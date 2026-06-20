import { IconKey, IconBolt, IconClock } from "./icons";

const STEPS = [
  {
    icon: IconKey,
    step: "01",
    title: "Buy a time pass",
    description:
      "Pick your plan — 1 hour, 6 hours, 24 hours, or longer. One payment via Stripe. No subscription. A license key lands in your email instantly.",
  },
  {
    icon: IconBolt,
    step: "02",
    title: "Activate your key",
    description:
      "Paste your license key at the activate page. Your session starts immediately — the clock begins the moment you enter the workspace.",
  },
  {
    icon: IconClock,
    step: "03",
    title: "Code without limits",
    description:
      "Unlimited prompts, unlimited edits, unlimited code generation. Pick any model. Clone repos, run terminals, ship features — all in your window.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="py-24"
      style={{ borderTop: "1px solid var(--color-border)" }}
    >
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
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
          <p className="mt-3 text-sm" style={{ color: "var(--color-text-2)" }}>
            From zero to a running AI coding session in under two minutes.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {STEPS.map((step) => (
            <div
              key={step.step}
              className="flex flex-col items-center text-center p-6 rounded-xl"
              style={{
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 relative"
                style={{
                  background: "var(--color-surface-3)",
                  border: "1px solid var(--color-border-2)",
                }}
              >
                <step.icon size={18} style={{ color: "var(--color-accent)" } as React.CSSProperties} />
                <div
                  className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{
                    background: "var(--color-accent)",
                    color: "#000",
                    fontFamily: "var(--font-mono)",
                    fontSize: "10px",
                  }}
                >
                  {step.step.slice(1)}
                </div>
              </div>

              <h3
                className="text-sm font-semibold mb-2"
                style={{ color: "var(--color-text)" }}
              >
                {step.title}
              </h3>
              <p
                className="text-xs leading-relaxed"
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
