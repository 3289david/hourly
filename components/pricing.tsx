"use client";

import { IconCheck, IconArrowRight } from "./icons";

const PLANS = [
  { id: "1h", name: "Starter", duration: "1 hour", price: "$1.99", description: "Perfect for a quick fix or a single feature.", features: ["1 hr unlimited access", "All 10 AI models", "Cloud workspace", "Terminal access"], popular: false, highlight: false },
  { id: "6h", name: "Builder", duration: "6 hours", price: "$3.99", description: "A solid work session. Ship a full feature.", features: ["6 hr unlimited access", "All 10 AI models", "Cloud workspace", "Terminal access", "GitHub integration"], popular: false, highlight: false },
  { id: "24h", name: "Day Pass", duration: "24 hours", price: "$9.99", description: "A full day to build, debug, and ship.", features: ["24 hr unlimited access", "All 10 AI models", "Cloud workspace", "Terminal access", "GitHub integration", "BYOK support"], popular: true, highlight: true },
  { id: "7d", name: "Week", duration: "7 days", price: "$22.99", description: "Launch a whole project. Build something real.", features: ["7 day unlimited access", "All 10 AI models", "Cloud workspace", "Terminal access", "GitHub integration", "BYOK support", "Priority routing"], popular: false, highlight: false },
  { id: "30d", name: "Monthly", duration: "30 days", price: "$44.99", description: "For those who code every day.", features: ["30 day unlimited access", "All 10 AI models", "Cloud workspace", "Terminal access", "GitHub integration", "BYOK support", "Priority routing"], popular: false, highlight: false },
];

const CHECKOUT_URLS: Record<string, string> = {
  "1h":  process.env.NEXT_PUBLIC_CHECKOUT_1H  ?? "#pricing",
  "6h":  process.env.NEXT_PUBLIC_CHECKOUT_6H  ?? "#pricing",
  "24h": process.env.NEXT_PUBLIC_CHECKOUT_24H ?? "#pricing",
  "7d":  process.env.NEXT_PUBLIC_CHECKOUT_7D  ?? "#pricing",
  "30d": process.env.NEXT_PUBLIC_CHECKOUT_30D ?? "#pricing",
};

export function Pricing() {
  return (
    <section
      id="pricing"
      className="flex flex-col items-center"
      style={{ borderTop: "1px solid var(--color-border)", paddingTop: "7rem", paddingBottom: "7rem", textAlign: "center" }}
    >
      <div className="w-full max-w-6xl px-6">
        <div style={{ marginBottom: "3.5rem" }}>
          <p style={{ color: "var(--color-accent)", fontFamily: "var(--font-mono)", fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1rem", textAlign: "center" }}>
            Pricing
          </p>
          <h2 style={{ color: "var(--color-text)", fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 700, textAlign: "center" }}>
            No subscriptions.{" "}
            <span style={{ color: "var(--color-text-2)" }}>Pay for what you use.</span>
          </h2>
          <p style={{ color: "var(--color-text-2)", fontSize: "1rem", marginTop: "1rem", maxWidth: "28rem", marginLeft: "auto", marginRight: "auto", textAlign: "center" }}>
            One-time purchase. Buy time, use time. No auto-renewals, no hidden limits.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className="flex flex-col items-center"
              style={{
                position: "relative",
                borderRadius: "0.75rem",
                padding: "1.5rem",
                textAlign: "center",
                background: plan.highlight
                  ? "linear-gradient(160deg, rgba(0,212,255,0.07) 0%, rgba(0,100,255,0.03) 100%)"
                  : "var(--color-surface)",
                border: plan.highlight ? "1px solid rgba(0,212,255,0.3)" : "1px solid var(--color-border)",
              }}
            >
              {plan.popular && (
                <div style={{ position: "absolute", top: "-0.75rem", left: "50%", transform: "translateX(-50%)", background: "var(--color-accent)", color: "#000", fontFamily: "var(--font-mono)", fontSize: "10px", fontWeight: 600, padding: "0.25rem 0.75rem", borderRadius: "9999px", whiteSpace: "nowrap" }}>
                  Most Popular
                </div>
              )}
              <p style={{ color: "var(--color-text-3)", fontFamily: "var(--font-mono)", fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.25rem", textAlign: "center" }}>
                {plan.duration}
              </p>
              <p style={{ color: "var(--color-text)", fontSize: "1rem", fontWeight: 600, marginBottom: "0.75rem", textAlign: "center" }}>
                {plan.name}
              </p>
              <div style={{ marginBottom: "1rem", textAlign: "center" }}>
                <span style={{ color: "var(--color-text)", fontFamily: "var(--font-mono)", fontSize: "1.875rem", fontWeight: 700 }}>
                  {plan.price}
                </span>
                <span style={{ color: "var(--color-text-3)", fontSize: "0.875rem", marginLeft: "0.375rem" }}>one-time</span>
              </div>
              <p style={{ color: "var(--color-text-2)", fontSize: "0.875rem", marginBottom: "1.25rem", textAlign: "center" }}>
                {plan.description}
              </p>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem", flex: 1, width: "100%" }}>
                {plan.features.map((f) => (
                  <li key={f} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", color: "var(--color-text-2)", fontSize: "0.875rem", textAlign: "center" }}>
                    <IconCheck size={12} style={{ color: "var(--color-accent)", flexShrink: 0 } as React.CSSProperties} />
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href={CHECKOUT_URLS[plan.id] ?? "#pricing"}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
                  width: "100%", padding: "0.625rem 1.25rem", borderRadius: "0.5rem",
                  fontSize: "0.875rem", fontWeight: 500, textDecoration: "none", textAlign: "center",
                  ...(plan.highlight
                    ? { background: "var(--color-accent)", color: "#000" }
                    : { background: "var(--color-surface-3)", color: "var(--color-text)", border: "1px solid var(--color-border-2)" }),
                }}
                onMouseEnter={(e) => { if (plan.highlight) e.currentTarget.style.background = "var(--color-accent-hover)"; else e.currentTarget.style.borderColor = "var(--color-text-3)"; }}
                onMouseLeave={(e) => { if (plan.highlight) e.currentTarget.style.background = "var(--color-accent)"; else e.currentTarget.style.borderColor = "var(--color-border-2)"; }}
              >
                Buy {plan.duration} <IconArrowRight size={13} />
              </a>
            </div>
          ))}
        </div>

        <p style={{ color: "var(--color-text-3)", fontSize: "0.875rem", marginTop: "2.5rem", textAlign: "center" }}>
          Payments processed by <span style={{ color: "var(--color-text-2)" }}>Polar.sh</span> — license key delivered instantly by email.
        </p>
      </div>
    </section>
  );
}
