import { SignJWT, jwtVerify } from "jose";

export type SessionTier = "trial" | "1h" | "6h" | "24h" | "7d" | "30d";

export interface SessionPayload {
  licenseKey: string;
  tier: SessionTier;
  expiresAt: number;
  sessionId: string;
  byokKey?: string;
}

export const SESSION_COOKIE = "hourly_session";

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

  return new SignJWT({ ...payload, sessionId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(Math.floor(payload.expiresAt / 1000))
    .sign(getSecret());
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

export { SESSION_COOKIE as SESSION_COOKIE_NAME };
