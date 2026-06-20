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
      className="flex flex-col items-center"
      style={{ borderTop: "1px solid var(--color-border)", paddingTop: "7rem", paddingBottom: "7rem", textAlign: "center" }}
    >
      <div className="w-full max-w-5xl px-6">
        <div style={{ marginBottom: "3.5rem" }}>
          <p style={{ color: "var(--color-accent)", fontFamily: "var(--font-mono)", fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1rem", textAlign: "center" }}>
            How it works
          </p>
          <h2 style={{ color: "var(--color-text)", fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 700, textAlign: "center" }}>
            Three steps to start.
          </h2>
          <p style={{ color: "var(--color-text-2)", fontSize: "1.125rem", marginTop: "1rem", textAlign: "center" }}>
            From zero to a running AI coding session in under two minutes.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {STEPS.map((step) => (
            <div
              key={step.step}
              className="flex flex-col items-center"
              style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "0.75rem", padding: "2rem", textAlign: "center" }}
            >
              <div
                className="flex items-center justify-center"
                style={{ width: "3.5rem", height: "3.5rem", borderRadius: "0.75rem", background: "var(--color-surface-3)", border: "1px solid var(--color-border-2)", marginBottom: "1.25rem", position: "relative" }}
              >
                <step.icon size={22} style={{ color: "var(--color-accent)" } as React.CSSProperties} />
                <div style={{ position: "absolute", top: "-0.625rem", right: "-0.625rem", width: "1.5rem", height: "1.5rem", borderRadius: "9999px", background: "var(--color-accent)", color: "#000", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-mono)", fontSize: "11px", fontWeight: 700 }}>
                  {step.step.slice(1)}
                </div>
              </div>
              <h3 style={{ color: "var(--color-text)", fontSize: "1.125rem", fontWeight: 600, marginBottom: "0.75rem", textAlign: "center" }}>
                {step.title}
              </h3>
              <p style={{ color: "var(--color-text-2)", fontSize: "1rem", lineHeight: 1.7, textAlign: "center" }}>
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
