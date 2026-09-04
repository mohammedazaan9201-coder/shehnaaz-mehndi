import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { setReviewApproval } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";

const approveSchema = z.object({ isApproved: z.boolean() });

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const json = await req.json().catch(() => null);
  const parsed = approveSchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  const review = setReviewApproval(params.id, parsed.data.isApproved);
  if (!review) return NextResponse.json({ error: "Review not found" }, { status: 404 });
  return NextResponse.json(review);
}
