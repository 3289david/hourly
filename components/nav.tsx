"use client";

import Link from "next/link";
import { useState } from "react";
import { IconHourly } from "./icons";

export function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 border-b"
      style={{
        background: "rgba(5,5,5,0.85)",
        backdropFilter: "blur(16px)",
        borderColor: "var(--color-border)",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-3 font-semibold text-base">
          <IconHourly size={28} />
          <span style={{ color: "var(--color-text)", fontFamily: "var(--font-mono)" }}>
            Hourly
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {[
            { label: "Features", href: "#features" },
            { label: "Pricing", href: "#pricing" },
            { label: "FAQ", href: "#faq" },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm transition-colors"
              style={{ color: "var(--color-text-2)" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--color-text)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--color-text-2)")
              }
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/activate"
            className="text-sm px-4 py-2 rounded-lg transition-colors"
            style={{ color: "var(--color-text-2)", border: "1px solid var(--color-border-2)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--color-text)";
              e.currentTarget.style.borderColor = "var(--color-text-3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--color-text-2)";
              e.currentTarget.style.borderColor = "var(--color-border-2)";
            }}
          >
            Activate Key
          </Link>
          <a
            href="#pricing"
            className="text-sm px-4 py-2 rounded-lg font-medium transition-all"
            style={{
              background: "var(--color-accent)",
              color: "#000",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--color-accent-hover)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--color-accent)";
            }}
          >
            Get Started
          </a>
        </div>

        <button
          className="md:hidden p-2"
          style={{ color: "var(--color-text-2)" }}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
            {mobileOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="3" y1="18" x2="21" y2="18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </>
            )}
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <div
          className="md:hidden px-6 pb-6 flex flex-col items-center gap-3 text-center"
          style={{ borderTop: "1px solid var(--color-border)" }}
        >
          {[
            { label: "Features", href: "#features" },
            { label: "Pricing", href: "#pricing" },
            { label: "FAQ", href: "#faq" },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm py-1.5 w-full"
              style={{ color: "var(--color-text-2)" }}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <Link
            href="/activate"
            className="text-sm py-1.5 w-full"
            style={{ color: "var(--color-text-2)" }}
          >
            Activate Key
          </Link>
          <a
            href="#pricing"
            className="text-sm px-4 py-2 rounded-lg font-medium text-center w-full"
            style={{ background: "var(--color-accent)", color: "#000" }}
            onClick={() => setMobileOpen(false)}
          >
            Get Started
          </a>
        </div>
      )}
    </nav>
  );
}
