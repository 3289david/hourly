"use client";

import Link from "next/link";
import { useState } from "react";
import { IconHourly } from "./icons";

export function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 border-b"
      style={{ background: "rgba(6,6,10,0.90)", backdropFilter: "blur(16px)", borderColor: "var(--color-border)" }}
    >
      {/* Desktop: everything centered in one row */}
      <div
        className="hidden md:flex items-center justify-center gap-8 px-6"
        style={{ height: "4rem" }}
      >
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}>
          <IconHourly size={24} />
          <span style={{ color: "var(--color-text)", fontFamily: "var(--font-mono)", fontSize: "1rem", fontWeight: 600 }}>
            Hourly
          </span>
        </Link>

        {[
          { label: "Features", href: "/#features" },
          { label: "Pricing", href: "/#pricing" },
          { label: "FAQ", href: "/#faq" },
        ].map((link) => (
          <a
            key={link.href}
            href={link.href}
            style={{ color: "var(--color-text-2)", fontSize: "0.875rem", textDecoration: "none" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-text)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-2)")}
          >
            {link.label}
          </a>
        ))}

        <Link
          href="/activate"
          style={{ color: "var(--color-text-2)", fontSize: "0.875rem", padding: "0.5rem 1rem", borderRadius: "0.5rem", textDecoration: "none" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-text)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-2)")}
        >
          Activate Key
        </Link>

        <Link
          href="/#pricing"
          style={{ background: "var(--color-accent)", color: "#000", fontSize: "0.875rem", fontWeight: 600, padding: "0.5rem 1rem", borderRadius: "0.5rem", textDecoration: "none" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-accent-hover)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "var(--color-accent)")}
        >
          Get Started
        </Link>
      </div>

      {/* Mobile: logo + hamburger row */}
      <div className="md:hidden flex items-center justify-center px-6" style={{ height: "4rem", position: "relative" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}>
          <IconHourly size={22} />
          <span style={{ color: "var(--color-text)", fontFamily: "var(--font-mono)", fontSize: "0.875rem", fontWeight: 600 }}>
            Hourly
          </span>
        </Link>
        <button
          style={{ position: "absolute", right: "1.5rem", color: "var(--color-text-2)", background: "none", border: "none", cursor: "pointer", padding: "0.25rem" }}
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

      {/* Mobile dropdown — centered */}
      {mobileOpen && (
        <div
          className="md:hidden flex flex-col items-center gap-4 py-5"
          style={{ borderTop: "1px solid var(--color-border)", textAlign: "center" }}
        >
          {[
            { label: "Features", href: "/#features" },
            { label: "Pricing", href: "/#pricing" },
            { label: "FAQ", href: "/#faq" },
            { label: "Activate Key", href: "/activate" },
          ].map((link) => (
            <a key={link.href} href={link.href} style={{ color: "var(--color-text-2)", fontSize: "1rem", textDecoration: "none" }} onClick={() => setMobileOpen(false)}>
              {link.label}
            </a>
          ))}
          <Link
            href="/#pricing"
            style={{ background: "var(--color-accent)", color: "#000", fontSize: "1rem", fontWeight: 600, padding: "0.625rem 1.5rem", borderRadius: "0.5rem", textDecoration: "none" }}
            onClick={() => setMobileOpen(false)}
          >
            Get Started
          </Link>
        </div>
      )}
    </nav>
  );
}
