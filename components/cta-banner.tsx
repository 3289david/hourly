"use client";

import { IconArrowRight } from "./icons";

export function CTABanner() {
  return (
    <section
      className="py-28"
      style={{ borderTop: "1px solid var(--color-border)" }}
    >
      <div className="max-w-4xl mx-auto px-6 text-center">
        <div
          className="relative rounded-3xl p-12 overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, rgba(0,212,255,0.06) 0%, rgba(0,90,255,0.04) 100%)",
            border: "1px solid var(--color-accent)",
          }}
        >
          {/* Background glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(0,212,255,0.05) 0%, transparent 70%)",
            }}
            aria-hidden
          />

          <div className="relative">
            <div
              className="text-xs font-mono uppercase tracking-widest mb-4"
              style={{ color: "var(--color-accent)" }}
            >
              Ready to start?
            </div>

            <h2
              className="text-4xl md:text-5xl font-bold mb-4"
              style={{ color: "var(--color-text)" }}
            >
              $1.99 for an hour
              <br />
              of unlimited AI.
            </h2>

            <p
              className="text-lg mb-10 max-w-lg mx-auto"
              style={{ color: "var(--color-text-2)" }}
            >
              No account needed. No subscription. Just a license key and a countdown.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="#pricing"
                className="flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-base transition-all"
                style={{ background: "var(--color-accent)", color: "#000" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--color-accent-hover)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,212,255,0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "var(--color-accent)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                View Pricing
                <IconArrowRight size={18} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
