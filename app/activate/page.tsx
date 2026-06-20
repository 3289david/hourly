"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Nav } from "@/components/nav";
import { IconKey, IconCheck, IconArrowRight } from "@/components/icons";

const TIER_LABELS: Record<string, string> = {
  "1h": "1 Hour",
  "6h": "6 Hours",
  "24h": "24 Hours",
  "7d": "7 Days",
  "30d": "30 Days",
};

export default function ActivatePage() {
  const router = useRouter();
  const [key, setKey] = useState("");
  const [byokKey, setByokKey] = useState("");
  const [showByok, setShowByok] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<{ tier: string; expiresAt: number } | null>(null);

  async function handleActivate(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: key.trim(), byokKey: byokKey.trim() || undefined }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string; tier?: string; expiresAt?: number };
      if (!res.ok || !data.ok) { setError(data.error ?? "Activation failed"); return; }
      setSuccess({ tier: data.tier!, expiresAt: data.expiresAt! });
      setTimeout(() => router.push("/workspace"), 1500);
    } catch {
      setError("Network error — please try again");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ background: "var(--color-bg)", minHeight: "100vh" }}>
      <Nav />
      <div className="fixed inset-0 grid-bg opacity-20 pointer-events-none" aria-hidden />

      <main
        style={{
          paddingTop: "80px",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "80px 1.5rem 3rem",
          textAlign: "center",
        }}
      >
        <div style={{ width: "100%", maxWidth: "28rem" }}>
          {success ? (
            <div style={{ textAlign: "center", padding: "1rem 0" }}>
              <div
                style={{ width: "3.5rem", height: "3.5rem", borderRadius: "9999px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem", background: "rgba(0,255,136,0.1)", border: "2px solid var(--color-success)" }}
              >
                <IconCheck size={24} style={{ color: "var(--color-success)" } as React.CSSProperties} />
              </div>
              <h2 style={{ color: "var(--color-text)", fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.5rem", textAlign: "center" }}>
                Session activated
              </h2>
              <p style={{ color: "var(--color-text-2)", fontSize: "0.875rem", marginBottom: "0.25rem", textAlign: "center" }}>
                {TIER_LABELS[success.tier] ?? success.tier} of unlimited access
              </p>
              <p style={{ color: "var(--color-text-3)", fontSize: "0.75rem", textAlign: "center" }}>
                Expires {new Date(success.expiresAt).toLocaleString()}
              </p>
              <p style={{ color: "var(--color-accent)", fontSize: "0.75rem", marginTop: "1rem", textAlign: "center" }}>
                Redirecting to workspace...
              </p>
            </div>
          ) : (
            <div style={{ background: "var(--color-surface)", border: "1px solid var(--color-border-2)", borderRadius: "1rem", padding: "2rem" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem", textAlign: "center" }}>
                <div style={{ width: "2.5rem", height: "2.5rem", borderRadius: "0.75rem", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--color-accent-dim)", border: "1px solid var(--color-accent)", color: "var(--color-accent)" }}>
                  <IconKey size={18} />
                </div>
                <div>
                  <h1 style={{ color: "var(--color-text)", fontSize: "1.125rem", fontWeight: 700, textAlign: "center" }}>
                    Activate your session
                  </h1>
                  <p style={{ color: "var(--color-text-2)", fontSize: "0.875rem", textAlign: "center" }}>
                    Enter the license key from your purchase email
                  </p>
                </div>
              </div>

              <form onSubmit={handleActivate} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div>
                  <label htmlFor="key" style={{ display: "block", color: "var(--color-text-2)", fontSize: "0.75rem", fontWeight: 500, marginBottom: "0.5rem", textAlign: "center" }}>
                    License Key
                  </label>
                  <input
                    id="key"
                    type="text"
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    placeholder="HRL-XXXX-XXXX-XXXX"
                    required
                    autoComplete="off"
                    spellCheck={false}
                    style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: "0.75rem", background: "var(--color-surface-3)", border: "1px solid var(--color-border-2)", color: "var(--color-text)", fontFamily: "var(--font-mono)", fontSize: "0.875rem", outline: "none", textAlign: "center", boxSizing: "border-box" }}
                    onFocus={(e) => (e.target.style.borderColor = "var(--color-accent)")}
                    onBlur={(e) => (e.target.style.borderColor = "var(--color-border-2)")}
                  />
                </div>

                <button
                  type="button"
                  style={{ color: "var(--color-text-3)", fontSize: "0.75rem", background: "none", border: "none", cursor: "pointer", textAlign: "center" }}
                  onClick={() => setShowByok(!showByok)}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-text-2)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-3)")}
                >
                  {showByok ? "— Hide" : "+ Add"} your own API key (BYOK, optional)
                </button>

                {showByok && (
                  <div>
                    <label htmlFor="byok" style={{ display: "block", color: "var(--color-text-2)", fontSize: "0.75rem", fontWeight: 500, marginBottom: "0.5rem", textAlign: "center" }}>
                      OpenRouter API Key <span style={{ color: "var(--color-text-3)" }}>(lower price, your usage)</span>
                    </label>
                    <input
                      id="byok"
                      type="password"
                      value={byokKey}
                      onChange={(e) => setByokKey(e.target.value)}
                      placeholder="sk-or-v1-..."
                      autoComplete="off"
                      style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: "0.75rem", background: "var(--color-surface-3)", border: "1px solid var(--color-border-2)", color: "var(--color-text)", fontFamily: "var(--font-mono)", fontSize: "0.875rem", outline: "none", textAlign: "center", boxSizing: "border-box" }}
                      onFocus={(e) => (e.target.style.borderColor = "var(--color-accent)")}
                      onBlur={(e) => (e.target.style.borderColor = "var(--color-border-2)")}
                    />
                    <p style={{ color: "var(--color-text-3)", fontSize: "0.75rem", marginTop: "0.25rem", textAlign: "center" }}>
                      Your key is encrypted and never stored after your session ends.
                    </p>
                  </div>
                )}

                {error && (
                  <div style={{ padding: "0.75rem 1rem", borderRadius: "0.75rem", background: "rgba(255,68,68,0.08)", border: "1px solid rgba(255,68,68,0.3)", color: "var(--color-error)", fontSize: "0.875rem", textAlign: "center" }}>
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !key.trim()}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
                    padding: "0.75rem 1rem", borderRadius: "0.75rem", fontWeight: 600, fontSize: "0.875rem",
                    border: "none", cursor: loading ? "wait" : "pointer", marginTop: "0.5rem",
                    background: loading || !key.trim() ? "var(--color-surface-3)" : "var(--color-accent)",
                    color: loading || !key.trim() ? "var(--color-text-3)" : "#000",
                  }}
                >
                  {loading ? (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ animation: "spin 1s linear infinite" } as React.CSSProperties} aria-hidden>
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.3" />
                        <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                      Validating...
                    </>
                  ) : (
                    <>Start Session <IconArrowRight size={16} /></>
                  )}
                </button>
              </form>
            </div>
          )}

          <p style={{ color: "var(--color-text-3)", fontSize: "0.875rem", marginTop: "1.5rem", textAlign: "center" }}>
            Don&apos;t have a key?{" "}
            <Link href="/#pricing" style={{ color: "var(--color-accent)" }}>
              View pricing
            </Link>
          </p>
        </div>
      </main>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
