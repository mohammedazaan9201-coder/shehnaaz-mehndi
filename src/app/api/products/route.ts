import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createProduct, getActiveProducts, getAllProducts } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";
import { slugify } from "@/lib/utils";

const productSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(1),
  price: z.number().nonnegative(),
  compareAtPrice: z.number().nonnegative().optional(),
  images: z.array(z.string()).min(1),
  categorySlug: z.string().min(1),
  variantLabel: z.string().optional(),
  stock: z.number().int().nonnegative(),
  isFeatured: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

export async function GET(req: NextRequest) {
  const admin = req.nextUrl.searchParams.get("admin");
  if (admin) {
    const session = await getAdminSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json(getAllProducts());
  }
  return NextResponse.json(getActiveProducts());
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const json = await req.json().catch(() => null);
  const parsed = productSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please check the product details.", details: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;
  const product = createProduct({
    ...data,
    slug: `${slugify(data.name)}-${Date.now().toString(36).slice(-4)}`,
    isActive: data.isActive ?? true,
    isFeatured: data.isFeatured ?? false,
  });

  return NextResponse.json(product, { status: 201 });
}
