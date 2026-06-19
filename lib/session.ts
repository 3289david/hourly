import { SignJWT, jwtVerify } from "jose";
import type { PolarTier } from "./polar";

export interface SessionPayload {
  licenseKey: string;
  tier: PolarTier;
  expiresAt: number;
  sessionId: string;
  byokKey?: string;
  githubToken?: string;
}

const SESSION_COOKIE = "hourly_session";

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET not set");
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(
  payload: Omit<SessionPayload, "sessionId"> & { sessionId?: string }
): Promise<string> {
  const { v4: uuidv4 } = await import("uuid");
  const sessionId = payload.sessionId ?? uuidv4();
  const expiresAt = payload.expiresAt;

  const token = await new SignJWT({ ...payload, sessionId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(Math.floor(expiresAt / 1000))
    .sign(getSecret());

  return token;
}

export async function verifySession(
  token: string
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    const session = payload as unknown as SessionPayload;

    if (Date.now() > session.expiresAt) return null;

    return session;
  } catch {
    return null;
  }
}

export function getSessionCookieOptions(expiresAt: number): string {
  const expires = new Date(expiresAt).toUTCString();
  const isSecure =
    process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${SESSION_COOKIE}=%TOKEN%; Path=/; HttpOnly; SameSite=Lax; Expires=${expires}${isSecure}`;
}

export { SESSION_COOKIE };
