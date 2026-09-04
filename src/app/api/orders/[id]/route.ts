import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getOrderById, getProductById, updateOrderStatus, updateProduct } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";
import { ORDER_STATUSES } from "@/lib/types";

const statusSchema = z.object({
  status: z.enum(ORDER_STATUSES as [string, ...string[]]),
  note: z.string().optional(),
});

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const order = getOrderById(params.id);
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
  return NextResponse.json(order);
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const json = await req.json().catch(() => null);
  const parsed = statusSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid status update." }, { status: 400 });
  }

  const existing = getOrderById(params.id);
  if (!existing) return NextResponse.json({ error: "Order not found" }, { status: 404 });

  const newStatus = parsed.data.status as import("@/lib/types").OrderStatus;

  // Stock was reserved (decremented) at order placement. If an order is being
  // cancelled for the first time, restore that stock.
  if (newStatus === "CANCELLED" && existing.status !== "CANCELLED") {
    for (const item of existing.items) {
      const product = getProductById(item.productId);
      if (product) {
        updateProduct(product.id, { stock: product.stock + item.quantity });
      }
    }
  }

  const updated = updateOrderStatus(params.id, newStatus, parsed.data.note);
  if (!updated) return NextResponse.json({ error: "Order not found" }, { status: 404 });
  return NextResponse.json(updated);
}
