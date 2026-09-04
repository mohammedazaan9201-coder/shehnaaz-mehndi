import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getOrderByNumberAndPhone } from "@/lib/db";

const trackSchema = z.object({
  orderNumber: z.string().min(3),
  phone: z.string().min(10),
});

export async function POST(req: NextRequest) {
  const json = await req.json().catch(() => null);
  const parsed = trackSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please enter a valid order number and phone number." }, { status: 400 });
  }

  const order = getOrderByNumberAndPhone(parsed.data.orderNumber, parsed.data.phone);
  if (!order) {
    return NextResponse.json(
      { error: "No order found with that order number and phone number." },
      { status: 404 }
    );
  }

  return NextResponse.json(order);
}
