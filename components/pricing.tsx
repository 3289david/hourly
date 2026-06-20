"use client";

import { IconCheck, IconArrowRight } from "./icons";

const PLANS = [
  {
    id: "1h",
    name: "Starter",
    duration: "1 hour",
    price: "$1.99",
    description: "Try it out. Perfect for a quick fix or a single feature.",
    checkoutEnvKey: "NEXT_PUBLIC_CHECKOUT_1H",
    features: ["1 hour unlimited access", "All 10 AI models", "Cloud workspace", "Terminal access"],
    popular: false,
    highlight: false,
  },
  {
    id: "6h",
    name: "Builder",
    duration: "6 hours",
    price: "$3.99",
    description: "A solid work session. Ship a full feature.",
    checkoutEnvKey: "NEXT_PUBLIC_CHECKOUT_6H",
    features: ["6 hours unlimited access", "All 10 AI models", "Cloud workspace", "Terminal access", "GitHub integration"],
    popular: false,
    highlight: false,
  },
  {
    id: "24h",
    name: "Day Pass",
    duration: "24 hours",
    price: "$9.99",
    description: "A full day to build, debug, and ship. Best value per hour.",
    checkoutEnvKey: "NEXT_PUBLIC_CHECKOUT_24H",
    features: ["24 hours unlimited access", "All 10 AI models", "Cloud workspace", "Terminal access", "GitHub integration", "BYOK support"],
    popular: true,
    highlight: true,
  },
  {
    id: "7d",
    name: "Week",
    duration: "7 days",
    price: "$22.99",
    description: "Launch a whole project. Build something real.",
    checkoutEnvKey: "NEXT_PUBLIC_CHECKOUT_7D",
    features: ["7 days unlimited access", "All 10 AI models", "Cloud workspace", "Terminal access", "GitHub integration", "BYOK support", "Priority routing"],
    popular: false,
    highlight: false,
  },
  {
    id: "30d",
    name: "Monthly",
    duration: "30 days",
    price: "$44.99",
    description: "For those who code every day. Still cheaper than the rest.",
    checkoutEnvKey: "NEXT_PUBLIC_CHECKOUT_30D",
    features: ["30 days unlimited access", "All 10 AI models", "Cloud workspace", "Terminal access", "GitHub integration", "BYOK support", "Priority routing"],
    popular: false,
    highlight: false,
  },
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
      className="py-20"
      style={{ borderTop: "1px solid var(--color-border)" }}
    >
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-12">
          <div
            className="text-xs font-mono uppercase tracking-widest mb-3"
            style={{ color: "var(--color-accent)" }}
          >
            Pricing
          </div>
          <h2
            className="text-2xl md:text-3xl font-bold"
            style={{ color: "var(--color-text)" }}
          >
            No subscriptions.{" "}
            <span style={{ color: "var(--color-text-2)" }}>Pay for what you use.</span>
          </h2>
          <p
            className="mt-3 text-sm max-w-md mx-auto"
            style={{ color: "var(--color-text-2)" }}
          >
            Every plan is a one-time purchase. Buy time, use time. No auto-renewals, no hidden limits.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className="flex flex-col rounded-xl p-4 relative"
              style={{
                background: plan.highlight
                  ? "linear-gradient(160deg, rgba(0,212,255,0.07) 0%, rgba(0,100,255,0.03) 100%)"
                  : "var(--color-surface)",
                border: plan.highlight
                  ? "1px solid rgba(0,212,255,0.3)"
                  : "1px solid var(--color-border)",
              }}
            >
              {plan.popular && (
                <div
                  className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap"
                  style={{
                    background: "var(--color-accent)",
                    color: "#000",
                    fontFamily: "var(--font-mono)",
                    fontSize: "10px",
                  }}
                >
                  Most Popular
                </div>
              )}

              <div className="mb-3">
                <div
                  className="text-xs font-mono uppercase tracking-wider mb-0.5"
                  style={{ color: "var(--color-text-3)" }}
                >
                  {plan.duration}
                </div>
                <div className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>
                  {plan.name}
                </div>
              </div>

              <div className="mb-3">
                <span
                  className="text-2xl font-bold"
                  style={{ color: "var(--color-text)", fontFamily: "var(--font-mono)" }}
                >
                  {plan.price}
                </span>
                <span className="text-xs ml-1" style={{ color: "var(--color-text-3)" }}>
                  one-time
                </span>
              </div>

              <p
                className="text-xs mb-4 leading-relaxed"
                style={{ color: "var(--color-text-2)" }}
              >
                {plan.description}
              </p>

              <ul className="flex flex-col gap-1.5 mb-4 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-1.5 text-xs" style={{ color: "var(--color-text-2)" }}>
                    <IconCheck size={11} style={{ color: "var(--color-accent)", flexShrink: 0 } as React.CSSProperties} />
                    {f}
                  </li>
                ))}
              </ul>

              <PlanButton plan={plan} />
            </div>
          ))}
        </div>

        <p
          className="mt-8 text-center text-xs"
          style={{ color: "var(--color-text-3)" }}
        >
          Payments processed by{" "}
          <span style={{ color: "var(--color-text-2)" }}>Polar.sh</span>
          {" "}— secure checkout. License key delivered instantly by email.
        </p>
      </div>
    </section>
  );
}

function PlanButton({ plan }: { plan: (typeof PLANS)[0] }) {
  const href = CHECKOUT_URLS[plan.id] ?? "#pricing";

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium transition-all"
      style={
        plan.highlight
          ? { background: "var(--color-accent)", color: "#000" }
          : { background: "var(--color-surface-3)", color: "var(--color-text)", border: "1px solid var(--color-border-2)" }
      }
      onMouseEnter={(e) => {
        if (plan.highlight) {
          e.currentTarget.style.background = "var(--color-accent-hover)";
        } else {
          e.currentTarget.style.borderColor = "var(--color-text-3)";
        }
      }}
      onMouseLeave={(e) => {
        if (plan.highlight) {
          e.currentTarget.style.background = "var(--color-accent)";
        } else {
          e.currentTarget.style.borderColor = "var(--color-border-2)";
        }
      }}
    >
      Buy {plan.duration}
      <IconArrowRight size={12} />
    </a>
  );
}
