import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createOrder, getAllOrders, getProductById, updateProduct } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";

const orderItemSchema = z.object({
  productId: z.string(),
  name: z.string(),
  variant: z.string().optional(),
  price: z.number().nonnegative(),
  quantity: z.number().int().positive(),
  image: z.string().optional(),
});

const orderSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().min(10),
  email: z.string().email().optional().or(z.literal("")),
  fullAddress: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
  deliveryMethod: z.enum(["HOME_DELIVERY", "STORE_PICKUP"]),
  paymentMethod: z.enum(["UPI", "BANK_TRANSFER"]),
  transactionId: z.string().optional(),
  paymentScreenshotUrl: z.string().optional(),
  items: z.array(orderItemSchema).min(1),
  subtotal: z.number().nonnegative(),
  total: z.number().nonnegative(),
});

export async function POST(req: NextRequest) {
  const json = await req.json().catch(() => null);
  const parsed = orderSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the order details and try again.", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;

  if (data.deliveryMethod === "HOME_DELIVERY") {
    if (!data.fullAddress || !data.city || !data.state || !data.pincode) {
      return NextResponse.json(
        { error: "A full address, city, state and pincode are required for home delivery." },
        { status: 400 }
      );
    }
  }

  // Stock check + reservation against the live product store. Since payment is
  // confirmed manually (UPI/bank transfer, no gateway yet), we decrement stock
  // at order placement rather than at payment confirmation. If an order is
  // later cancelled by the admin, the stock is restored (see
  // api/orders/[id]/route.ts).
  for (const item of data.items) {
    const product = getProductById(item.productId);
    if (product && item.quantity > product.stock) {
      return NextResponse.json(
        { error: `${item.name} only has ${product.stock} in stock.` },
        { status: 400 }
      );
    }
  }

  for (const item of data.items) {
    const product = getProductById(item.productId);
    if (product) {
      updateProduct(product.id, { stock: Math.max(0, product.stock - item.quantity) });
    }
  }

  const order = createOrder({
    fullName: data.fullName,
    phone: data.phone,
    email: data.email || undefined,
    fullAddress: data.fullAddress,
    city: data.city,
    state: data.state,
    pincode: data.pincode,
    deliveryMethod: data.deliveryMethod,
    paymentMethod: data.paymentMethod,
    transactionId: data.transactionId,
    paymentScreenshotUrl: data.paymentScreenshotUrl,
    items: data.items,
    subtotal: data.subtotal,
    total: data.total,
  });

  return NextResponse.json(order, { status: 201 });
}

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(getAllOrders());
}
