import { NextRequest, NextResponse } from "next/server";
import { verifySession, SESSION_COOKIE } from "@/lib/session";

export async function GET(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;

  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const session = await verifySession(token);

  if (!session) {
    return NextResponse.json({ authenticated: false, expired: true }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    tier: session.tier,
    expiresAt: session.expiresAt,
    sessionId: session.sessionId,
    timeRemaining: session.expiresAt - Date.now(),
  });
}

export async function DELETE(_req: NextRequest) {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(SESSION_COOKIE);
  return res;
}
