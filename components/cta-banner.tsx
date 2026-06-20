"use client";

import { IconArrowRight } from "./icons";

export function CTABanner() {
  return (
    <section
      style={{ borderTop: "1px solid var(--color-border)", paddingTop: "7rem", paddingBottom: "7rem" }}
    >
      <div className="max-w-3xl mx-auto px-6" style={{ textAlign: "center" }}>
        <div
          className="text-sm font-mono uppercase tracking-widest text-center"
          style={{ color: "var(--color-accent)", marginBottom: "1.25rem" }}
        >
          Ready to start?
        </div>

        <h2
          className="text-4xl md:text-5xl font-bold text-center"
          style={{ color: "var(--color-text)", marginBottom: "1rem" }}
        >
          $1.99 for an hour of unlimited AI.
        </h2>

        <p
          className="text-base text-center"
          style={{ color: "var(--color-text-2)", marginBottom: "2.5rem" }}
        >
          No account needed. No subscription. Just a license key and a countdown.
        </p>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <a
            href="#pricing"
            className="inline-flex items-center gap-2 rounded-xl font-semibold text-base transition-all"
            style={{ background: "var(--color-accent)", color: "#000", padding: "1rem 2rem" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--color-accent-hover)";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--color-accent)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            View Pricing
            <IconArrowRight size={18} />
          </a>
        </div>
      </div>
    </section>
  );
}
