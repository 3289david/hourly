"use client";

import { IconArrowRight } from "./icons";

export function CTABanner() {
  return (
    <section
      className="py-20"
      style={{ borderTop: "1px solid var(--color-border)" }}
    >
      <div className="max-w-2xl mx-auto px-6 text-center">
        <div
          className="text-xs font-mono uppercase tracking-widest mb-4"
          style={{ color: "var(--color-accent)" }}
        >
          Ready to start?
        </div>

        <h2
          className="text-2xl md:text-3xl font-bold mb-3"
          style={{ color: "var(--color-text)" }}
        >
          $1.99 for an hour of unlimited AI.
        </h2>

        <p
          className="text-sm mb-8"
          style={{ color: "var(--color-text-2)" }}
        >
          No account needed. No subscription. Just a license key and a countdown.
        </p>

        <a
          href="#pricing"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-all"
          style={{ background: "var(--color-accent)", color: "#000" }}
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
          <IconArrowRight size={16} />
        </a>
      </div>
    </section>
  );
}
