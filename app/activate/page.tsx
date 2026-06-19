"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { IconHourly, IconKey, IconCheck, IconArrowRight } from "@/components/icons";

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
  const [success, setSuccess] = useState<{
    tier: string;
    expiresAt: number;
  } | null>(null);

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

      const data = (await res.json()) as {
        ok?: boolean;
        error?: string;
        tier?: string;
        expiresAt?: number;
      };

      if (!res.ok || !data.ok) {
        setError(data.error ?? "Activation failed");
        return;
      }

      setSuccess({ tier: data.tier!, expiresAt: data.expiresAt! });
      setTimeout(() => router.push("/workspace"), 1500);
    } catch {
      setError("Network error — please try again");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{ background: "var(--color-bg)" }}
    >
      {/* Grid bg */}
      <div className="fixed inset-0 grid-bg opacity-20 pointer-events-none" aria-hidden />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <Link href="/" className="flex items-center gap-2">
            <IconHourly size={32} />
            <span
              className="text-lg font-semibold"
              style={{ color: "var(--color-text)", fontFamily: "var(--font-mono)" }}
            >
              Hourly
            </span>
          </Link>
        </div>

        <div
          className="rounded-2xl p-8"
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border-2)",
          }}
        >
          {success ? (
            <div className="text-center py-4">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5"
                style={{
                  background: "rgba(0,255,136,0.1)",
                  border: "2px solid var(--color-success)",
                }}
              >
                <IconCheck size={24} style={{ color: "var(--color-success)" } as React.CSSProperties} />
              </div>
              <h2
                className="text-xl font-bold mb-2"
                style={{ color: "var(--color-text)" }}
              >
                Session activated
              </h2>
              <p className="text-sm mb-1" style={{ color: "var(--color-text-2)" }}>
                {TIER_LABELS[success.tier] ?? success.tier} of unlimited access
              </p>
              <p className="text-xs" style={{ color: "var(--color-text-3)" }}>
                Expires {new Date(success.expiresAt).toLocaleString()}
              </p>
              <p className="text-xs mt-4" style={{ color: "var(--color-accent)" }}>
                Redirecting to workspace...
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{
                    background: "var(--color-accent-dim)",
                    border: "1px solid var(--color-accent)",
                    color: "var(--color-accent)",
                  }}
                >
                  <IconKey size={18} />
                </div>
                <div>
                  <h1
                    className="font-bold"
                    style={{ color: "var(--color-text)" }}
                  >
                    Activate your session
                  </h1>
                  <p className="text-xs" style={{ color: "var(--color-text-2)" }}>
                    Enter the license key from your purchase email
                  </p>
                </div>
              </div>

              <form onSubmit={handleActivate} className="flex flex-col gap-4">
                <div>
                  <label
                    htmlFor="key"
                    className="block text-xs font-medium mb-2"
                    style={{ color: "var(--color-text-2)" }}
                  >
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
                    className="w-full px-4 py-3 rounded-xl text-sm transition-colors"
                    style={{
                      background: "var(--color-surface-3)",
                      border: "1px solid var(--color-border-2)",
                      color: "var(--color-text)",
                      fontFamily: "var(--font-mono)",
                      outline: "none",
                    }}
                    onFocus={(e) =>
                      (e.target.style.borderColor = "var(--color-accent)")
                    }
                    onBlur={(e) =>
                      (e.target.style.borderColor = "var(--color-border-2)")
                    }
                  />
                </div>

                <button
                  type="button"
                  className="text-xs text-left transition-colors"
                  style={{ color: "var(--color-text-3)" }}
                  onClick={() => setShowByok(!showByok)}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "var(--color-text-2)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "var(--color-text-3)")
                  }
                >
                  {showByok ? "— Hide" : "+ Add"} your own API key (BYOK, optional)
                </button>

                {showByok && (
                  <div>
                    <label
                      htmlFor="byok"
                      className="block text-xs font-medium mb-2"
                      style={{ color: "var(--color-text-2)" }}
                    >
                      OpenRouter API Key
                      <span
                        className="ml-2"
                        style={{ color: "var(--color-text-3)" }}
                      >
                        (lower price, your usage)
                      </span>
                    </label>
                    <input
                      id="byok"
                      type="password"
                      value={byokKey}
                      onChange={(e) => setByokKey(e.target.value)}
                      placeholder="sk-or-v1-..."
                      autoComplete="off"
                      className="w-full px-4 py-3 rounded-xl text-sm"
                      style={{
                        background: "var(--color-surface-3)",
                        border: "1px solid var(--color-border-2)",
                        color: "var(--color-text)",
                        fontFamily: "var(--font-mono)",
                        outline: "none",
                      }}
                      onFocus={(e) =>
                        (e.target.style.borderColor = "var(--color-accent)")
                      }
                      onBlur={(e) =>
                        (e.target.style.borderColor = "var(--color-border-2)")
                      }
                    />
                    <p
                      className="text-xs mt-1"
                      style={{ color: "var(--color-text-3)" }}
                    >
                      Your key is encrypted and never stored after your session ends.
                    </p>
                  </div>
                )}

                {error && (
                  <div
                    className="px-4 py-3 rounded-xl text-sm"
                    style={{
                      background: "rgba(255,68,68,0.08)",
                      border: "1px solid rgba(255,68,68,0.3)",
                      color: "var(--color-error)",
                    }}
                  >
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !key.trim()}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm transition-all mt-2"
                  style={{
                    background: loading || !key.trim()
                      ? "var(--color-surface-3)"
                      : "var(--color-accent)",
                    color: loading || !key.trim() ? "var(--color-text-3)" : "#000",
                    cursor: loading ? "wait" : "pointer",
                  }}
                >
                  {loading ? (
                    <>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        style={{ animation: "spin 1s linear infinite" } as React.CSSProperties}
                        aria-hidden
                      >
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.3" />
                        <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                      Validating...
                    </>
                  ) : (
                    <>
                      Start Session
                      <IconArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>

        <p className="text-center text-xs mt-6" style={{ color: "var(--color-text-3)" }}>
          Don&apos;t have a key?{" "}
          <Link
            href="/#pricing"
            style={{ color: "var(--color-accent)" }}
          >
            View pricing
          </Link>
        </p>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
