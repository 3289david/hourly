import { NextRequest, NextResponse } from "next/server";
import { validatePolarLicense } from "@/lib/polar";
import { createSessionToken, verifySession, SESSION_COOKIE, type SessionTier } from "@/lib/session";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  try {
    const { key, byokKey } = (await req.json()) as {
      key?: string;
      byokKey?: string;
    };

    if (!key || typeof key !== "string" || key.trim().length < 8) {
      return NextResponse.json({ error: "Please enter a valid license key" }, { status: 400 });
    }

    const sessionId = uuidv4();
    const license = await validatePolarLicense(key.trim(), sessionId);

    // Check for existing valid session → extend instead of reset
    let expiresAt: number;
    const existingToken = req.cookies.get(SESSION_COOKIE)?.value;
    if (existingToken) {
      const existing = await verifySession(existingToken);
      if (existing && existing.expiresAt > Date.now()) {
        // Extend: add new duration on top of remaining time
        expiresAt = existing.expiresAt + license.durationMs;
      } else {
        expiresAt = Date.now() + license.durationMs;
      }
    } else {
      expiresAt = Date.now() + license.durationMs;
    }

    const token = await createSessionToken({
      licenseKey: license.key,
      tier: license.tier as SessionTier,
      expiresAt,
      sessionId,
      byokKey: byokKey?.trim() || undefined,
    });

    const res = NextResponse.json({ ok: true, tier: license.tier, expiresAt, sessionId });

    res.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: Math.floor((expiresAt - Date.now()) / 1000),
      path: "/",
    });

    return res;
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Activation failed" },
      { status: 400 }
    );
  }
}
