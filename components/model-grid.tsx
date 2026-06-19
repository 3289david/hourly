"use client";

const MODELS = [
  {
    name: "DeepSeek R1",
    specialty: "Reasoning & Python",
    badge: "Best for backend",
    color: "#0066ff",
    svg: (
      <svg width="28" height="28" viewBox="0 0 40 40" fill="none" aria-hidden>
        <circle cx="20" cy="20" r="18" fill="#0066ff" opacity="0.15" />
        <circle cx="20" cy="20" r="18" stroke="#0066ff" strokeWidth="1.5" />
        <path d="M12 20h16M20 12v16" stroke="#0066ff" strokeWidth="2" strokeLinecap="round" />
        <circle cx="20" cy="20" r="4" fill="#0066ff" />
      </svg>
    ),
  },
  {
    name: "Qwen 2.5 Coder",
    specialty: "Frontend & React",
    badge: "Best for UI",
    color: "#ff6600",
    svg: (
      <svg width="28" height="28" viewBox="0 0 40 40" fill="none" aria-hidden>
        <circle cx="20" cy="20" r="18" fill="#ff6600" opacity="0.15" />
        <circle cx="20" cy="20" r="18" stroke="#ff6600" strokeWidth="1.5" />
        <polyline points="14,16 10,20 14,24" stroke="#ff6600" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <polyline points="26,16 30,20 26,24" stroke="#ff6600" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="18" y1="13" x2="22" y2="27" stroke="#ff6600" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: "Kimi",
    specialty: "Debug & Analysis",
    badge: "Best for bugs",
    color: "#7c3aed",
    svg: (
      <svg width="28" height="28" viewBox="0 0 40 40" fill="none" aria-hidden>
        <circle cx="20" cy="20" r="18" fill="#7c3aed" opacity="0.15" />
        <circle cx="20" cy="20" r="18" stroke="#7c3aed" strokeWidth="1.5" />
        <circle cx="15" cy="17" r="2.5" fill="#7c3aed" />
        <circle cx="25" cy="17" r="2.5" fill="#7c3aed" />
        <path d="M13 25c2-3 12-3 14 0" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: "GLM-4",
    specialty: "Fast Tasks",
    badge: "Best for speed",
    color: "#00c853",
    svg: (
      <svg width="28" height="28" viewBox="0 0 40 40" fill="none" aria-hidden>
        <circle cx="20" cy="20" r="18" fill="#00c853" opacity="0.15" />
        <circle cx="20" cy="20" r="18" stroke="#00c853" strokeWidth="1.5" />
        <polygon points="20,10 28,25 12,25" fill="#00c853" opacity="0.3" stroke="#00c853" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: "Auto Route",
    specialty: "Smart selection",
    badge: "Recommended",
    color: "#00d4ff",
    svg: (
      <svg width="28" height="28" viewBox="0 0 40 40" fill="none" aria-hidden>
        <circle cx="20" cy="20" r="18" fill="#00d4ff" opacity="0.15" />
        <circle cx="20" cy="20" r="18" stroke="#00d4ff" strokeWidth="1.5" />
        <path d="M12 20c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke="#00d4ff" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M28 20l-3-3-3 3" stroke="#00d4ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="20" cy="23" r="3" stroke="#00d4ff" strokeWidth="1.5" />
      </svg>
    ),
  },
];

export function ModelGrid() {
  return (
    <section
      className="py-24"
      style={{ borderTop: "1px solid var(--color-border)" }}
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <div
            className="text-xs font-mono uppercase tracking-widest mb-3"
            style={{ color: "var(--color-accent)" }}
          >
            Models
          </div>
          <h2
            className="text-3xl md:text-4xl font-bold"
            style={{ color: "var(--color-text)" }}
          >
            Pick your model.
            <br />
            <span style={{ color: "var(--color-text-2)" }}>Or let us pick for you.</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {MODELS.map((model) => (
            <div
              key={model.name}
              className="flex flex-col items-center text-center p-5 rounded-2xl transition-all duration-200"
              style={{
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = model.color + "60";
                (e.currentTarget as HTMLDivElement).style.background =
                  "var(--color-surface-2)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor =
                  "var(--color-border)";
                (e.currentTarget as HTMLDivElement).style.background =
                  "var(--color-surface)";
              }}
            >
              <div className="mb-3">{model.svg}</div>
              <div
                className="font-semibold text-sm mb-1"
                style={{ color: "var(--color-text)" }}
              >
                {model.name}
              </div>
              <div
                className="text-xs mb-3"
                style={{ color: "var(--color-text-2)" }}
              >
                {model.specialty}
              </div>
              <div
                className="text-xs px-2 py-0.5 rounded-full"
                style={{
                  background: model.color + "20",
                  color: model.color,
                  border: `1px solid ${model.color}40`,
                  fontFamily: "var(--font-mono)",
                }}
              >
                {model.badge}
              </div>
            </div>
          ))}
        </div>

        <p
          className="text-center text-sm mt-8"
          style={{ color: "var(--color-text-3)" }}
        >
          All models routed through OpenRouter. Switch models mid-session at any time.
        </p>
      </div>
    </section>
  );
}
