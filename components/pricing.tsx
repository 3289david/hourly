"use client";

import { IconCheck, IconArrowRight } from "./icons";

const PLANS = [
  {
    id: "1h",
    name: "Starter",
    duration: "1 hour",
    price: "$0.99",
    period: "one-time",
    description: "Try it out. Perfect for a quick fix or a single feature.",
    checkoutEnvKey: "NEXT_PUBLIC_CHECKOUT_1H",
    features: [
      "1 hour of unlimited access",
      "All 4 AI models",
      "Cloud workspace",
      "Terminal access",
    ],
    popular: false,
    highlight: false,
  },
  {
    id: "6h",
    name: "Builder",
    duration: "6 hours",
    price: "$2.99",
    period: "one-time",
    description: "A solid work session. Ship a full feature.",
    checkoutEnvKey: "NEXT_PUBLIC_CHECKOUT_6H",
    features: [
      "6 hours of unlimited access",
      "All 4 AI models",
      "Cloud workspace",
      "Terminal access",
      "GitHub integration",
    ],
    popular: false,
    highlight: false,
  },
  {
    id: "24h",
    name: "Day Pass",
    duration: "24 hours",
    price: "$7.99",
    period: "one-time",
    description: "A full day to build, debug, and ship. Best value per hour.",
    checkoutEnvKey: "NEXT_PUBLIC_CHECKOUT_24H",
    features: [
      "24 hours of unlimited access",
      "All 4 AI models",
      "Cloud workspace",
      "Terminal access",
      "GitHub integration",
      "BYOK support",
    ],
    popular: true,
    highlight: true,
  },
  {
    id: "7d",
    name: "Power Week",
    duration: "7 days",
    price: "$19.99",
    period: "one-time",
    description: "Launch a whole project. Build something real.",
    checkoutEnvKey: "NEXT_PUBLIC_CHECKOUT_7D",
    features: [
      "7 days of unlimited access",
      "All 4 AI models",
      "Cloud workspace",
      "Terminal access",
      "GitHub integration",
      "BYOK support",
      "Priority routing",
    ],
    popular: false,
    highlight: false,
  },
  {
    id: "30d",
    name: "Monthly",
    duration: "30 days",
    price: "$39.99",
    period: "one-time",
    description: "For those who code every day. Still cheaper than the others.",
    checkoutEnvKey: "NEXT_PUBLIC_CHECKOUT_30D",
    features: [
      "30 days of unlimited access",
      "All 4 AI models",
      "Cloud workspace",
      "Terminal access",
      "GitHub integration",
      "BYOK support",
      "Priority routing",
    ],
    popular: false,
    highlight: false,
  },
];

export function Pricing() {
  return (
    <section
      id="pricing"
      className="py-28"
      style={{ borderTop: "1px solid var(--color-border)" }}
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <div
            className="text-xs font-mono uppercase tracking-widest mb-3"
            style={{ color: "var(--color-accent)" }}
          >
            Pricing
          </div>
          <h2
            className="text-4xl md:text-5xl font-bold"
            style={{ color: "var(--color-text)" }}
          >
            No subscriptions.
            <br />
            <span style={{ color: "var(--color-text-2)" }}>Pay for what you use.</span>
          </h2>
          <p
            className="mt-4 text-base max-w-xl mx-auto"
            style={{ color: "var(--color-text-2)" }}
          >
            Every plan is a one-time purchase. Buy time, use time. No auto-renewals.
            No credits that expire at midnight. No hidden limits.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className="flex flex-col rounded-2xl p-5 relative transition-all duration-200"
              style={{
                background: plan.highlight
                  ? "linear-gradient(135deg, rgba(0,212,255,0.08) 0%, rgba(0,144,255,0.04) 100%)"
                  : "var(--color-surface)",
                border: plan.highlight
                  ? "1px solid var(--color-accent)"
                  : "1px solid var(--color-border)",
                boxShadow: plan.highlight
                  ? "0 0 40px rgba(0,212,255,0.08)"
                  : "none",
              }}
            >
              {plan.popular && (
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-semibold"
                  style={{
                    background: "var(--color-accent)",
                    color: "#000",
                    fontFamily: "var(--font-mono)",
                    whiteSpace: "nowrap",
                  }}
                >
                  Most Popular
                </div>
              )}

              <div className="mb-4">
                <div
                  className="text-xs font-mono uppercase tracking-wider mb-1"
                  style={{ color: "var(--color-text-3)" }}
                >
                  {plan.duration}
                </div>
                <div
                  className="font-semibold"
                  style={{ color: "var(--color-text)" }}
                >
                  {plan.name}
                </div>
              </div>

              <div className="mb-4">
                <span
                  className="text-3xl font-bold"
                  style={{ color: "var(--color-text)", fontFamily: "var(--font-mono)" }}
                >
                  {plan.price}
                </span>
                <span
                  className="text-xs ml-1"
                  style={{ color: "var(--color-text-3)" }}
                >
                  {plan.period}
                </span>
              </div>

              <p
                className="text-xs mb-5 leading-relaxed"
                style={{ color: "var(--color-text-2)" }}
              >
                {plan.description}
              </p>

              <ul className="flex flex-col gap-2 mb-6 flex-1">
                {plan.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2 text-xs"
                    style={{ color: "var(--color-text-2)" }}
                  >
                    <IconCheck
                      size={13}
                      className="mt-0.5 flex-shrink-0"
                      style={{ color: "var(--color-accent)" } as React.CSSProperties}
                    />
                    {f}
                  </li>
                ))}
              </ul>

              <PlanButton plan={plan} />
            </div>
          ))}
        </div>

        <div
          className="mt-10 text-center text-sm"
          style={{ color: "var(--color-text-3)" }}
        >
          Payments processed by{" "}
          <span style={{ color: "var(--color-text-2)" }}>Polar.sh</span>
          {" "}— secure, one-click checkout. License key delivered instantly by email.
        </div>
      </div>
    </section>
  );
}

function PlanButton({ plan }: { plan: (typeof PLANS)[0] }) {
  const href = process.env[`NEXT_PUBLIC_CHECKOUT_${plan.id.toUpperCase().replace("H", "H").replace("D", "D")}`] ?? "#pricing";

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium transition-all"
      style={
        plan.highlight
          ? {
              background: "var(--color-accent)",
              color: "#000",
            }
          : {
              background: "var(--color-surface-3)",
              color: "var(--color-text)",
              border: "1px solid var(--color-border-2)",
            }
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
      <IconArrowRight size={14} />
    </a>
  );
}
