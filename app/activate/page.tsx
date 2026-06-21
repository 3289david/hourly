"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Nav } from "@/components/nav";
import { IconKey, IconCheck, IconArrowRight, IconClock } from "@/components/icons";

const TIER_LABELS: Record<string, string> = {
  trial: "5-Minute Free Trial",
  "1h": "1 Hour",
  "6h": "6 Hours",
  "24h": "24 Hours",
  "7d": "7 Days",
  "30d": "30 Days",
};

function formatDuration(ms: number): string {
  if (ms <= 0) return "0:00";
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0) return `${h}h ${m}m remaining`;
  if (m > 0) return `${m}m ${s}s remaining`;
  return `${s}s remaining`;
}

export default function ActivatePage() {
  const router = useRouter();
  const [key, setKey] = useState("");
  const [byokKey, setByokKey] = useState("");
  const [showByok, setShowByok] = useState(false);
  const [loading, setLoading] = useState(false);
  const [trialLoading, setTrialLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<{ tier: string; expiresAt: number; extended?: boolean; restored?: boolean } | null>(null);
  const [existingSession, setExistingSession] = useState<{ tier: string; expiresAt: number } | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);

  // Check for existing active session
  useEffect(() => {
    fetch("/api/session")
      .then((r) => r.json())
      .then((d: { authenticated?: boolean; tier?: string; expiresAt?: number }) => {
        if (d.authenticated && d.expiresAt && d.expiresAt > Date.now()) {
          setExistingSession({ tier: d.tier!, expiresAt: d.expiresAt });
        }
      })
      .catch(() => {})
      .finally(() => setCheckingSession(false));
  }, []);

  async function handleActivate(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const isExtending = !!(existingSession && existingSession.expiresAt > Date.now());
    try {
      const res = await fetch("/api/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: key.trim(), byokKey: byokKey.trim() || undefined }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string; tier?: string; expiresAt?: number; sessionId?: string };
      if (!res.ok || !data.ok) { setError(data.error ?? "Activation failed"); return; }
      // Detect restore: same key used again — API returns the stored sessionId
      const isRestored = !isExtending && !!data.sessionId;
      setSuccess({ tier: data.tier!, expiresAt: data.expiresAt!, extended: isExtending, restored: isRestored && !isExtending });
      setTimeout(() => router.push("/workspace"), 1500);
    } catch {
      setError("Network error — please try again");
    } finally {
      setLoading(false);
    }
  }

  async function handleTrial() {
    setError("");
    setTrialLoading(true);
    try {
      const res = await fetch("/api/trial", { method: "POST" });
      const data = (await res.json()) as { ok?: boolean; error?: string; tier?: string; expiresAt?: number };
      if (!res.ok || !data.ok) { setError(data.error ?? "Failed to start trial"); return; }
      setSuccess({ tier: "trial", expiresAt: data.expiresAt! });
      setTimeout(() => router.push("/workspace"), 1200);
    } catch {
      setError("Network error — please try again");
    } finally {
      setTrialLoading(false);
    }
  }

  const isExtendMode = !!(existingSession && existingSession.expiresAt > Date.now());

  return (
    <div style={{ background: "var(--color-bg)", minHeight: "100vh" }}>
      <Nav />
      <div className="fixed inset-0 grid-bg opacity-20 pointer-events-none" aria-hidden />

      <main style={{
        minHeight: "100vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "80px 1.5rem 3rem", textAlign: "center",
      }}>
        <div style={{ width: "100%", maxWidth: "28rem" }}>

          {success ? (
            /* ── Success state ── */
            <div style={{ textAlign: "center", padding: "1rem 0" }}>
              <div style={{ width: "3.5rem", height: "3.5rem", borderRadius: "9999px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem", background: "rgba(0,232,122,0.1)", border: "2px solid var(--color-success)" }}>
                <IconCheck size={24} style={{ color: "var(--color-success)" } as React.CSSProperties} />
              </div>
              <h2 style={{ color: "var(--color-text)", fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.5rem" }}>
                {success.restored ? "Session restored!" : success.extended ? "Session extended!" : success.tier === "trial" ? "Trial started!" : "Session activated!"}
              </h2>
              <p style={{ color: "var(--color-text-2)", fontSize: "0.875rem", marginBottom: "0.25rem" }}>
                {success.restored ? "Your workspace and remaining time have been restored." : `${TIER_LABELS[success.tier] ?? success.tier} of ${success.tier === "trial" ? "free" : "unlimited"} access`}
              </p>
              {(success.extended || success.restored) && (
                <p style={{ color: "var(--color-text-3)", fontSize: "0.75rem", marginBottom: "0.25rem" }}>
                  Expires: {new Date(success.expiresAt).toLocaleString()}
                </p>
              )}
              <p style={{ color: "var(--color-accent)", fontSize: "0.75rem", marginTop: "1rem" }}>
                Redirecting to workspace…
              </p>
            </div>

          ) : checkingSession ? null : (
            <>
              {/* ── Existing session banner ── */}
              {isExtendMode && (
                <div style={{
                  background: "rgba(0,212,255,0.06)", border: "1px solid rgba(0,212,255,0.2)",
                  borderRadius: "0.875rem", padding: "1rem 1.25rem",
                  marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.75rem",
                }}>
                  <IconClock size={16} style={{ color: "var(--color-accent)", flexShrink: 0 } as React.CSSProperties} />
                  <div style={{ textAlign: "left", flex: 1 }}>
                    <p style={{ color: "var(--color-text)", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.125rem" }}>
                      Active session — {TIER_LABELS[existingSession!.tier] ?? existingSession!.tier}
                    </p>
                    <p style={{ color: "var(--color-accent)", fontSize: "0.8rem", fontFamily: "var(--font-mono)" }}>
                      {formatDuration(existingSession!.expiresAt - Date.now())}
                    </p>
                  </div>
                  <button
                    onClick={() => router.push("/workspace")}
                    style={{ display: "flex", alignItems: "center", gap: "0.375rem", padding: "0.5rem 0.875rem", borderRadius: "0.5rem", background: "var(--color-accent)", color: "#000", fontWeight: 600, fontSize: "0.8rem", border: "none", cursor: "pointer", whiteSpace: "nowrap" }}
                  >
                    Open <IconArrowRight size={13} />
                  </button>
                </div>
              )}

              {/* ── Activation card ── */}
              <div style={{ background: "var(--color-surface)", border: "1px solid var(--color-border-2)", borderRadius: "1rem", padding: "2rem" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
                  <div style={{ width: "2.5rem", height: "2.5rem", borderRadius: "0.75rem", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--color-accent-dim)", border: "1px solid rgba(0,212,255,0.3)", color: "var(--color-accent)" }}>
                    <IconKey size={18} />
                  </div>
                  <div>
                    <h1 style={{ color: "var(--color-text)", fontSize: "1.125rem", fontWeight: 700 }}>
                      {isExtendMode ? "Extend your session" : "Activate your session"}
                    </h1>
                    <p style={{ color: "var(--color-text-2)", fontSize: "0.875rem", marginTop: "0.25rem" }}>
                      {isExtendMode
                        ? "Enter a new license key to add time to your current session"
                        : "Enter the license key from your purchase email"}
                    </p>
                  </div>
                </div>

                <form onSubmit={handleActivate} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div>
                    <label htmlFor="key" style={{ display: "block", color: "var(--color-text-2)", fontSize: "0.75rem", fontWeight: 500, marginBottom: "0.5rem" }}>
                      License Key
                    </label>
                    <input
                      id="key" type="text" value={key}
                      onChange={(e) => setKey(e.target.value)}
                      placeholder="HRL-XXXX-XXXX-XXXX"
                      required autoComplete="off" spellCheck={false}
                      style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: "0.75rem", background: "var(--color-surface-3)", border: "1px solid var(--color-border-2)", color: "var(--color-text)", fontFamily: "var(--font-mono)", fontSize: "0.875rem", outline: "none", textAlign: "center", boxSizing: "border-box" }}
                      onFocus={(e) => (e.target.style.borderColor = "var(--color-accent)")}
                      onBlur={(e) => (e.target.style.borderColor = "var(--color-border-2)")}
                    />
                  </div>

                  <button
                    type="button"
                    style={{ color: "var(--color-text-3)", fontSize: "0.75rem", background: "none", border: "none", cursor: "pointer" }}
                    onClick={() => setShowByok(!showByok)}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-text-2)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-3)")}
                  >
                    {showByok ? "— Hide" : "+ Add"} your own API key (BYOK, optional)
                  </button>

                  {showByok && (
                    <div>
                      <label htmlFor="byok" style={{ display: "block", color: "var(--color-text-2)", fontSize: "0.75rem", fontWeight: 500, marginBottom: "0.5rem" }}>
                        OpenRouter API Key <span style={{ color: "var(--color-text-3)" }}>(optional)</span>
                      </label>
                      <input
                        id="byok" type="password" value={byokKey}
                        onChange={(e) => setByokKey(e.target.value)}
                        placeholder="sk-or-v1-..."
                        autoComplete="off"
                        style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: "0.75rem", background: "var(--color-surface-3)", border: "1px solid var(--color-border-2)", color: "var(--color-text)", fontFamily: "var(--font-mono)", fontSize: "0.875rem", outline: "none", textAlign: "center", boxSizing: "border-box" }}
                        onFocus={(e) => (e.target.style.borderColor = "var(--color-accent)")}
                        onBlur={(e) => (e.target.style.borderColor = "var(--color-border-2)")}
                      />
                    </div>
                  )}

                  {error && (
                    <div style={{ padding: "0.75rem 1rem", borderRadius: "0.75rem", background: "rgba(255,68,68,0.08)", border: "1px solid rgba(255,68,68,0.3)", color: "var(--color-error)", fontSize: "0.875rem" }}>
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading || !key.trim()}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
                      padding: "0.875rem 1rem", borderRadius: "0.75rem", fontWeight: 600, fontSize: "0.9375rem",
                      border: "none", cursor: loading || !key.trim() ? "default" : "pointer", marginTop: "0.25rem",
                      background: loading || !key.trim() ? "var(--color-surface-3)" : "var(--color-accent)",
                      color: loading || !key.trim() ? "var(--color-text-3)" : "#000",
                      boxShadow: loading || !key.trim() ? "none" : "0 0 24px rgba(0,212,255,0.2)",
                    }}
                  >
                    {loading ? (
                      <>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ animation: "spin 1s linear infinite" } as React.CSSProperties} aria-hidden>
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.3" />
                          <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        Validating…
                      </>
                    ) : (
                      <>{isExtendMode ? "Extend Session" : "Start Session"} <IconArrowRight size={16} /></>
                    )}
                  </button>
                </form>
              </div>

              {/* ── Free trial ── */}
              {!isExtendMode && (
                <div style={{ marginTop: "1rem", background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "1rem", padding: "1.25rem 1.5rem" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
                    <div style={{ textAlign: "left" }}>
                      <p style={{ color: "var(--color-text)", fontSize: "0.9rem", fontWeight: 600, marginBottom: "0.25rem" }}>
                        Try it free — 5 minutes
                      </p>
                      <p style={{ color: "var(--color-text-3)", fontSize: "0.8rem", lineHeight: 1.4 }}>
                        No key needed. Free AI models only.
                      </p>
                    </div>
                    <button
                      onClick={handleTrial}
                      disabled={trialLoading}
                      style={{
                        display: "flex", alignItems: "center", gap: "0.375rem",
                        padding: "0.625rem 1.125rem", borderRadius: "0.625rem",
                        border: "1px solid var(--color-border-2)",
                        background: "var(--color-surface-3)",
                        color: "var(--color-text)", fontWeight: 600, fontSize: "0.875rem",
                        cursor: trialLoading ? "wait" : "pointer",
                        whiteSpace: "nowrap", flexShrink: 0,
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--color-accent)"; e.currentTarget.style.color = "var(--color-accent)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--color-border-2)"; e.currentTarget.style.color = "var(--color-text)"; }}
                    >
                      {trialLoading ? "Starting…" : <>Try Free <IconArrowRight size={13} /></>}
                    </button>
                  </div>
                </div>
              )}

              <p style={{ color: "var(--color-text-3)", fontSize: "0.875rem", marginTop: "1.25rem" }}>
                Don&apos;t have a key?{" "}
                <Link href="/#pricing" style={{ color: "var(--color-accent)" }}>View pricing</Link>
              </p>
            </>
          )}
        </div>
      </main>

      <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
    </div>
  );
}
