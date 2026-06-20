import { NextRequest, NextResponse } from "next/server";
import { createSessionToken, verifySession, SESSION_COOKIE } from "@/lib/session";
import { v4 as uuidv4 } from "uuid";

const TRIAL_DURATION_MS = 5 * 60 * 1000; // 5 minutes

export async function POST(req: NextRequest) {
  // Don't allow trial if they already have an active session
  const existingToken = req.cookies.get(SESSION_COOKIE)?.value;
  if (existingToken) {
    const existing = await verifySession(existingToken);
    if (existing && existing.expiresAt > Date.now()) {
      return NextResponse.json({ error: "You already have an active session" }, { status: 400 });
    }
  }

  const sessionId = uuidv4();
  const expiresAt = Date.now() + TRIAL_DURATION_MS;

  const token = await createSessionToken({
    licenseKey: "trial",
    tier: "trial",
    expiresAt,
    sessionId,
  });

  const res = NextResponse.json({ ok: true, tier: "trial", expiresAt, sessionId });

  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: Math.floor(TRIAL_DURATION_MS / 1000),
    path: "/",
  });

  return res;
}
