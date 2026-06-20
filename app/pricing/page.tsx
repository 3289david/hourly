import type { Metadata } from "next";
import Link from "next/link";
import { IconCheck, IconArrowRight } from "@/components/icons";
import { IconHourly } from "@/components/icons";

export const metadata: Metadata = {
  title: "Pricing — Hourly",
  description: "Buy time, use time. No subscriptions, no auto-renewals.",
};

const PLANS = [
  {
    id: "1h", name: "Starter", duration: "1 Hour", price: "$1.99",
    description: "Perfect for a quick fix or a single feature.",
    features: ["1 hr unlimited access", "All 10 AI models", "Cloud workspace", "Terminal access"],
    popular: false, highlight: false,
    url: process.env.NEXT_PUBLIC_CHECKOUT_1H ?? "#",
  },
  {
    id: "6h", name: "Builder", duration: "6 Hours", price: "$3.99",
    description: "A solid work session. Ship a full feature.",
    features: ["6 hr unlimited access", "All 10 AI models", "Cloud workspace", "Terminal access", "GitHub integration"],
    popular: false, highlight: false,
    url: process.env.NEXT_PUBLIC_CHECKOUT_6H ?? "#",
  },
  {
    id: "24h", name: "Day Pass", duration: "24 Hours", price: "$9.99",
    description: "A full day to build, debug, and ship.",
    features: ["24 hr unlimited access", "All 10 AI models", "Cloud workspace", "Terminal access", "GitHub integration", "BYOK support"],
    popular: true, highlight: true,
    url: process.env.NEXT_PUBLIC_CHECKOUT_24H ?? "#",
  },
  {
    id: "7d", name: "Power Week", duration: "7 Days", price: "$22.99",
    description: "Launch a whole project. Build something real.",
    features: ["7 day unlimited access", "All 10 AI models", "Cloud workspace", "Terminal access", "GitHub integration", "BYOK support", "Priority routing"],
    popular: false, highlight: false,
    url: process.env.NEXT_PUBLIC_CHECKOUT_7D ?? "#",
  },
  {
    id: "30d", name: "Monthly", duration: "30 Days", price: "$44.99",
    description: "For those who code every day.",
    features: ["30 day unlimited access", "All 10 AI models", "Cloud workspace", "Terminal access", "GitHub integration", "BYOK support", "Priority routing"],
    popular: false, highlight: false,
    url: process.env.NEXT_PUBLIC_CHECKOUT_30D ?? "#",
  },
];

export default function PricingPage() {
  return (
    <div style={{ background: "var(--color-bg)", minHeight: "100vh", color: "var(--color-text)" }}>

      {/* Minimal header */}
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        height: "60px", display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 1.5rem",
        background: "rgba(6,6,10,0.90)", backdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--color-border)",
      }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}>
          <IconHourly size={22} />
          <span style={{ color: "var(--color-text)", fontFamily: "var(--font-mono)", fontSize: "0.9rem", fontWeight: 600 }}>Hourly</span>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <Link href="/activate" style={{ color: "var(--color-text-2)", fontSize: "0.875rem", textDecoration: "none" }}
            onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "var(--color-text)")}
            onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "var(--color-text-2)")}
          >
            Activate Key
          </Link>
          <Link href="/workspace" style={{
            fontSize: "0.875rem", fontWeight: 600, padding: "0.5rem 1rem", borderRadius: "0.5rem",
            background: "var(--color-surface-3)", border: "1px solid var(--color-border-2)",
            color: "var(--color-text)", textDecoration: "none",
          }}>
            Workspace →
          </Link>
        </div>
      </header>

      {/* Glow */}
      <div
        aria-hidden
        style={{
          position: "fixed", top: 0, left: "50%", transform: "translateX(-50%)",
          width: "800px", height: "300px", pointerEvents: "none",
          background: "radial-gradient(ellipse at 50% 0%, rgba(0,212,255,0.1) 0%, transparent 70%)",
        }}
      />

      <main style={{ paddingTop: "60px" }}>
        <div style={{ maxWidth: "72rem", margin: "0 auto", padding: "5rem 1.5rem 6rem", textAlign: "center" }}>

          {/* Header */}
          <p style={{ color: "var(--color-accent)", fontFamily: "var(--font-mono)", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "1rem" }}>
            Pricing
          </p>
          <h1 style={{ fontSize: "clamp(2.25rem, 5vw, 3.5rem)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.025em", marginBottom: "1rem" }}>
            No subscriptions.{" "}
            <span style={{ color: "var(--color-text-2)" }}>Pay for what you use.</span>
          </h1>
          <p style={{ color: "var(--color-text-2)", fontSize: "1.0625rem", lineHeight: 1.7, maxWidth: "32rem", margin: "0 auto 4rem" }}>
            One-time purchase. Buy time, use time.<br />No auto-renewals, no hidden limits.
          </p>

          {/* Plans grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
            gap: "1rem",
            marginBottom: "3rem",
          }}>
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                style={{
                  position: "relative",
                  display: "flex", flexDirection: "column", alignItems: "center",
                  borderRadius: "1rem", padding: "1.75rem 1.5rem", textAlign: "center",
                  background: plan.highlight
                    ? "linear-gradient(160deg, rgba(0,212,255,0.08) 0%, rgba(0,60,255,0.03) 100%)"
                    : "var(--color-surface)",
                  border: plan.highlight
                    ? "1px solid rgba(0,212,255,0.35)"
                    : "1px solid var(--color-border)",
                  boxShadow: plan.highlight ? "0 0 48px rgba(0,212,255,0.06)" : "none",
                }}
              >
                {plan.popular && (
                  <div style={{
                    position: "absolute", top: "-0.75rem", left: "50%", transform: "translateX(-50%)",
                    background: "var(--color-accent)", color: "#000",
                    fontSize: "0.65rem", fontWeight: 700, fontFamily: "var(--font-mono)",
                    padding: "0.2rem 0.75rem", borderRadius: "9999px",
                    textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap",
                  }}>
                    Most Popular
                  </div>
                )}

                <p style={{ color: "var(--color-text-3)", fontFamily: "var(--font-mono)", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.375rem" }}>
                  {plan.duration}
                </p>
                <p style={{ color: "var(--color-text)", fontSize: "1.0625rem", fontWeight: 700, marginBottom: "1rem" }}>
                  {plan.name}
                </p>
                <div style={{ marginBottom: "0.75rem" }}>
                  <span style={{ color: "var(--color-text)", fontFamily: "var(--font-mono)", fontSize: "2.25rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
                    {plan.price}
                  </span>
                  <span style={{ color: "var(--color-text-3)", fontSize: "0.8rem", marginLeft: "0.375rem" }}>one-time</span>
                </div>
                <p style={{ color: "var(--color-text-2)", fontSize: "0.85rem", lineHeight: 1.5, marginBottom: "1.5rem" }}>
                  {plan.description}
                </p>

                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1.75rem", flex: 1, width: "100%", textAlign: "left" }}>
                  {plan.features.map((f) => (
                    <li key={f} style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--color-text-2)", fontSize: "0.8rem" }}>
                      <IconCheck size={12} style={{ color: "var(--color-accent)", flexShrink: 0 } as React.CSSProperties} />
                      {f}
                    </li>
                  ))}
                </ul>

                <a
                  href={plan.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
                    width: "100%", padding: "0.75rem 1.25rem", borderRadius: "0.625rem",
                    fontSize: "0.9rem", fontWeight: 600, textDecoration: "none",
                    ...(plan.highlight
                      ? { background: "var(--color-accent)", color: "#000", boxShadow: "0 0 24px rgba(0,212,255,0.3)" }
                      : { background: "var(--color-surface-3)", color: "var(--color-text)", border: "1px solid var(--color-border-2)" }),
                  }}
                >
                  Buy {plan.duration} <IconArrowRight size={14} />
                </a>
              </div>
            ))}
          </div>

          {/* Footer note */}
          <p style={{ color: "var(--color-text-3)", fontSize: "0.875rem", marginBottom: "1rem" }}>
            Payments processed by <span style={{ color: "var(--color-text-2)" }}>Polar.sh</span> — license key delivered instantly by email.
          </p>
          <p style={{ color: "var(--color-text-3)", fontSize: "0.875rem" }}>
            Already bought?{" "}
            <Link href="/activate" style={{ color: "var(--color-accent)", textDecoration: "none" }}>
              Activate your key →
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
