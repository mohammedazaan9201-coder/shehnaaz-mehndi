import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSessionCookieName } from "@/lib/auth";

export async function POST() {
  const store = await cookies();
  store.delete(getSessionCookieName());
  return NextResponse.json({ ok: true });
}
