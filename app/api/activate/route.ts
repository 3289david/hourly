import { NextRequest, NextResponse } from "next/server";
import { validatePolarLicense } from "@/lib/polar";
import { createSessionToken, SESSION_COOKIE } from "@/lib/session";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  try {
    const { key, byokKey } = (await req.json()) as {
      key?: string;
      byokKey?: string;
    };

    if (!key || typeof key !== "string" || key.trim().length < 8) {
      return NextResponse.json(
        { error: "Please enter a valid license key" },
        { status: 400 }
      );
    }

    const license = await validatePolarLicense(key.trim());

    const sessionId = uuidv4();
    const expiresAt = Date.now() + license.durationMs;

    const token = await createSessionToken({
      licenseKey: license.key,
      tier: license.tier,
      expiresAt,
      sessionId,
      byokKey: byokKey?.trim() || undefined,
    });

    const res = NextResponse.json({
      ok: true,
      tier: license.tier,
      expiresAt,
      sessionId,
    });

    const maxAge = Math.floor(license.durationMs / 1000);
    res.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge,
      path: "/",
    });

    return res;
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Activation failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
