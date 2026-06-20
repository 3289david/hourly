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
        background: "rgba(6,6,10,0.90)",
        backdropFilter: "blur(16px)",
        borderColor: "var(--color-border)",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 grid items-center" style={{ gridTemplateColumns: "1fr auto 1fr" }}>
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-2">
          <IconHourly size={24} />
          <span
            className="text-base font-semibold"
            style={{ color: "var(--color-text)", fontFamily: "var(--font-mono)" }}
          >
            Hourly
          </span>
        </Link>

        {/* Center links */}
        <div className="hidden md:flex items-center gap-8">
          {[
            { label: "Features", href: "/#features" },
            { label: "Pricing", href: "/#pricing" },
            { label: "FAQ", href: "/#faq" },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm transition-colors"
              style={{ color: "var(--color-text-2)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-text)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-2)")}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right: Activate + CTA */}
        <div className="hidden md:flex items-center gap-3 justify-end">
          <Link
            href="/activate"
            className="text-sm px-4 py-2 rounded-lg transition-colors"
            style={{ color: "var(--color-text-2)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-text)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-2)")}
          >
            Activate Key
          </Link>
          <Link
            href="/#pricing"
            className="text-sm px-4 py-2 rounded-lg font-medium transition-all"
            style={{ background: "var(--color-accent)", color: "#000" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-accent-hover)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "var(--color-accent)")}
          >
            Get Started
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 justify-self-end"
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
                <line x1="3" y1="7" x2="21" y2="7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="3" y1="17" x2="21" y2="17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="md:hidden py-5 flex flex-col items-center gap-4"
          style={{ borderTop: "1px solid var(--color-border)" }}
        >
          {[
            { label: "Features", href: "/#features" },
            { label: "Pricing", href: "/#pricing" },
            { label: "FAQ", href: "/#faq" },
            { label: "Activate Key", href: "/activate" },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-base"
              style={{ color: "var(--color-text-2)" }}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <Link
            href="/#pricing"
            className="mt-1 text-base px-6 py-2.5 rounded-lg font-medium"
            style={{ background: "var(--color-accent)", color: "#000" }}
            onClick={() => setMobileOpen(false)}
          >
            Get Started
          </Link>
        </div>
      )}
    </nav>
  );
}
