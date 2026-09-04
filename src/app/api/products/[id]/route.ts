import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { deleteProduct, getProductById, updateProduct } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";

const patchSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().min(1).optional(),
  price: z.number().nonnegative().optional(),
  compareAtPrice: z.number().nonnegative().optional(),
  images: z.array(z.string()).min(1).optional(),
  categorySlug: z.string().min(1).optional(),
  variantLabel: z.string().optional(),
  stock: z.number().int().nonnegative().optional(),
  isFeatured: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const product = getProductById(params.id);
  if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });
  return NextResponse.json(product);
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const json = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Invalid product update." }, { status: 400 });

  const updated = updateProduct(params.id, parsed.data);
  if (!updated) return NextResponse.json({ error: "Product not found" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  deleteProduct(params.id);
  return NextResponse.json({ ok: true });
}
