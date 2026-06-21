import { NextRequest, NextResponse } from "next/server";
import { verifySession, SESSION_COOKIE } from "@/lib/session";
import { touchSession } from "@/lib/key-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return NextResponse.json({ ok: false }, { status: 401 });

  const session = await verifySession(token);
  if (!session) return NextResponse.json({ ok: false }, { status: 401 });

  // Update heartbeat so this session stays "active" for the concurrency check.
  // Trial sessions don't have a key-store entry — touchSession is a no-op for them.
  if (session.licenseKey && session.tier !== "trial") {
    touchSession(session.licenseKey);
  }

  return NextResponse.json({ ok: true, expiresAt: session.expiresAt });
}
