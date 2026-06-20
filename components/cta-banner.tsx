"use client";

import { IconArrowRight } from "./icons";

export function CTABanner() {
  return (
    <section
      className="flex flex-col items-center"
      style={{ borderTop: "1px solid var(--color-border)", paddingTop: "7rem", paddingBottom: "7rem", textAlign: "center" }}
    >
      <div className="w-full max-w-3xl px-6" style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
        <p style={{ color: "var(--color-accent)", fontFamily: "var(--font-mono)", fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1.25rem", textAlign: "center" }}>
          Ready to start?
        </p>
        <h2 style={{ color: "var(--color-text)", fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 700, marginBottom: "1rem", textAlign: "center" }}>
          $1.99 for an hour of unlimited AI.
        </h2>
        <p style={{ color: "var(--color-text-2)", fontSize: "1.125rem", marginBottom: "2.5rem", textAlign: "center" }}>
          No account needed. No subscription. Just a license key and a countdown.
        </p>
        <a
          href="#pricing"
          style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "var(--color-accent)", color: "#000", padding: "1rem 2rem", borderRadius: "0.75rem", fontWeight: 600, fontSize: "1rem", textDecoration: "none" }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "var(--color-accent-hover)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "var(--color-accent)"; e.currentTarget.style.transform = "translateY(0)"; }}
        >
          View Pricing
          <IconArrowRight size={18} />
        </a>
      </div>
    </section>
  );
}
