import { NextRequest, NextResponse } from "next/server";
import { validatePolarLicense } from "@/lib/polar";
import { createSessionToken, SESSION_COOKIE, type SessionTier } from "@/lib/session";
import { getRecord, claimKey, restoreKey, ACTIVE_TIMEOUT_MS } from "@/lib/key-store";
import { v4 as uuidv4 } from "uuid";

function sessionResponse(
  tier: string,
  expiresAt: number,
  sessionId: string,
  token: string
): NextResponse {
  const res = NextResponse.json({ ok: true, tier, expiresAt, sessionId });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: Math.floor((expiresAt - Date.now()) / 1000),
    path: "/",
  });
  return res;
}

export async function POST(req: NextRequest) {
  try {
    const { key, byokKey } = (await req.json()) as {
      key?: string;
      byokKey?: string;
    };

    if (!key || typeof key !== "string" || key.trim().length < 8) {
      return NextResponse.json({ error: "Please enter a valid license key" }, { status: 400 });
    }

    const trimmedKey = key.trim();
    const byok = byokKey?.trim() || undefined;

    // ── Check if key was ever used ──────────────────────────────────────────
    const existing = await getRecord(trimmedKey);

    if (existing) {
      // Key was previously activated — decide what to do based on session state

      if (existing.expiresAt <= Date.now()) {
        // Session has fully expired — cannot restore
        return NextResponse.json(
          { error: "Your session has expired. Purchase a new key at hourly.krl.kr/pricing." },
          { status: 400 }
        );
      }

      // Try to atomically restore the session (fails if currently active on another device)
      const restored = await restoreKey(trimmedKey);

      if (restored === "active") {
        const minutesLeft = Math.ceil(ACTIVE_TIMEOUT_MS / 60_000);
        return NextResponse.json(
          {
            error: `This session is currently active on another device. Close the other browser and try again in up to ${minutesLeft} minutes.`,
          },
          { status: 409 }
        );
      }

      if (restored === "expired") {
        return NextResponse.json(
          { error: "Your session has expired. Purchase a new key at hourly.krl.kr/pricing." },
          { status: 400 }
        );
      }

      if (restored === "not_found") {
        // Shouldn't happen — existing was set — but handle gracefully
        return NextResponse.json({ error: "Session not found." }, { status: 400 });
      }

      // ── Restore: reuse exact same sessionId and remaining time ──────────
      const token = await createSessionToken({
        licenseKey: trimmedKey,
        tier: restored.tier as SessionTier,
        expiresAt: restored.expiresAt,
        sessionId: restored.sessionId,
        byokKey: byok,
      });

      return sessionResponse(restored.tier, restored.expiresAt, restored.sessionId, token);
    }

    // ── Brand-new key — validate with Polar ────────────────────────────────
    const sessionId = uuidv4();
    const license = await validatePolarLicense(trimmedKey, sessionId);

    // Atomically claim the key before issuing a session
    const claimed = await claimKey(trimmedKey, {
      sessionId,
      tier: license.tier as SessionTier,
      expiresAt: Date.now() + license.durationMs,
    });

    if (!claimed) {
      // Race: another request claimed it first — treat as an existing session
      const race = await restoreKey(trimmedKey);
      if (race === "active") {
        return NextResponse.json(
          { error: "This session is currently active on another device." },
          { status: 409 }
        );
      }
      if (typeof race === "object") {
        const token = await createSessionToken({
          licenseKey: trimmedKey,
          tier: race.tier as SessionTier,
          expiresAt: race.expiresAt,
          sessionId: race.sessionId,
          byokKey: byok,
        });
        return sessionResponse(race.tier, race.expiresAt, race.sessionId, token);
      }
      return NextResponse.json({ error: "Activation conflict — please try again." }, { status: 409 });
    }

    const record = await getRecord(trimmedKey);
    const expiresAt = record!.expiresAt;

    const token = await createSessionToken({
      licenseKey: trimmedKey,
      tier: license.tier as SessionTier,
      expiresAt,
      sessionId,
      byokKey: byok,
    });

    return sessionResponse(license.tier, expiresAt, sessionId, token);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Activation failed" },
      { status: 400 }
    );
  }
}
