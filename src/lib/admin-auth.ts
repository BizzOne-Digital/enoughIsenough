import "server-only";
import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "eie_admin_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 12; // 12 hours

function getSecret(): string {
  // Falls back to a fixed dev secret so the panel works out of the box;
  // set ADMIN_SESSION_SECRET in production to invalidate old sessions
  // and keep the signing key private.
  return process.env.ADMIN_SESSION_SECRET || "eie-dev-secret-change-me";
}

function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || "eie-admin-2026";
}

function sign(payload: string): string {
  return createHmac("sha256", getSecret()).update(payload).digest("hex");
}

export function checkAdminPassword(password: string): boolean {
  const expected = Buffer.from(getAdminPassword());
  const given = Buffer.from(password || "");
  if (expected.length !== given.length) return false;
  return timingSafeEqual(expected, given);
}

export function createSessionToken(): { token: string; expires: Date } {
  const expiresAt = Date.now() + SESSION_TTL_MS;
  const payload = `admin.${expiresAt}`;
  const signature = sign(payload);
  return { token: `${payload}.${signature}`, expires: new Date(expiresAt) };
}

export function verifySessionToken(token: string | undefined | null): boolean {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [role, expiresAtRaw, signature] = parts;
  const expiresAt = Number(expiresAtRaw);
  if (role !== "admin" || !Number.isFinite(expiresAt)) return false;
  if (Date.now() > expiresAt) return false;

  const expectedSignature = sign(`${role}.${expiresAtRaw}`);
  const a = Buffer.from(signature);
  const b = Buffer.from(expectedSignature);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

/** Server-side check for use in Server Components / route handlers. */
export async function isAdminSession(): Promise<boolean> {
  const store = await cookies();
  return verifySessionToken(store.get(ADMIN_COOKIE)?.value);
}
