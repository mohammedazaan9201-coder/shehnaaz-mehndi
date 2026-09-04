import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createReview, getAllReviews, getApprovedReviews } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";

const reviewSchema = z.object({
  productId: z.string().optional(),
  customerName: z.string().min(2).max(80),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(5).max(1000),
});

export async function POST(req: NextRequest) {
  const json = await req.json().catch(() => null);
  const parsed = reviewSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please provide a name, rating and review." }, { status: 400 });
  }
  const review = createReview(parsed.data);
  return NextResponse.json(review, { status: 201 });
}

export async function GET(req: NextRequest) {
  const admin = req.nextUrl.searchParams.get("admin");
  if (admin) {
    const session = await getAdminSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json(getAllReviews());
  }
  return NextResponse.json(getApprovedReviews());
}
