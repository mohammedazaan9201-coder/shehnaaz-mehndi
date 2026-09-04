import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "dev-only-secret-change-me";
const SESSION_COOKIE = "sm_admin_session";

export interface AdminSession {
  email: string;
  name: string;
}

export async function verifyAdminCredentials(email: string, password: string): Promise<boolean> {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@shehnaazsmehndi.com";
  const adminHash = process.env.ADMIN_PASSWORD_HASH;

  if (email.toLowerCase() !== adminEmail.toLowerCase()) return false;

  // In dev, if no hash is configured yet, fall back to a plain-text dev password
  // so the admin panel is usable out of the box. Set ADMIN_PASSWORD_HASH in
  // production and remove this fallback.
  if (!adminHash) {
    return password === (process.env.ADMIN_DEV_PASSWORD || "shehnaaz-admin");
  }
  return bcrypt.compare(password, adminHash);
}

export function createSessionToken(session: AdminSession): string {
  return jwt.sign(session, JWT_SECRET, { expiresIn: "7d" });
}

export function verifySessionToken(token: string): AdminSession | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AdminSession;
  } catch {
    return null;
  }
}

export function getSessionCookieName() {
  return SESSION_COOKIE;
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}
