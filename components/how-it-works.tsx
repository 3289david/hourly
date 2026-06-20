import { IconKey, IconBolt, IconClock } from "./icons";

const STEPS = [
  {
    icon: IconKey,
    step: "01",
    title: "Buy a time pass",
    description:
      "Pick your plan — 1 hour, 6 hours, 24 hours, or longer. One payment via Stripe. No subscription. A license key is delivered to your email instantly.",
  },
  {
    icon: IconBolt,
    step: "02",
    title: "Activate your key",
    description:
      "Paste your license key at hourly.dev/activate. Your session starts immediately. The clock begins the moment you enter the workspace.",
  },
  {
    icon: IconClock,
    step: "03",
    title: "Code without limits",
    description:
      "Unlimited prompts, unlimited file edits, unlimited code generation. Pick any model. Clone repos, run terminal commands, ship features — all within your time window.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-28">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <div
            className="text-xs font-mono uppercase tracking-widest mb-3"
            style={{ color: "var(--color-accent)" }}
          >
            How it works
          </div>
          <h2
            className="text-3xl md:text-4xl font-bold"
            style={{ color: "var(--color-text)" }}
          >
            Three steps to start.
          </h2>
          <p className="mt-3 text-base" style={{ color: "var(--color-text-2)" }}>
            From zero to a running AI coding session in under two minutes.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connector lines */}
          <div
            className="hidden md:block absolute top-8 left-1/3 right-1/3 h-px"
            style={{ background: "var(--color-border-2)" }}
            aria-hidden
          />

          {STEPS.map((step) => (
            <div key={step.step} className="relative flex flex-col items-center text-center">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 relative"
                style={{
                  background: "var(--color-surface-3)",
                  border: "1px solid var(--color-border-2)",
                }}
              >
                <step.icon size={24} className="text-accent" style={{ color: "var(--color-accent)" } as React.CSSProperties} />
                <div
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{
                    background: "var(--color-accent)",
                    color: "#000",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {step.step.slice(1)}
                </div>
              </div>

              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: "var(--color-text)" }}
              >
                {step.title}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--color-text-2)" }}
              >
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
