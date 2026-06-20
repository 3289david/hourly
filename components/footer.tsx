"use client";

import Link from "next/link";
import { IconHourly, IconGitHub } from "./icons";

export function Footer() {
  return (
    <footer
      style={{ borderTop: "1px solid var(--color-border)", paddingTop: "3rem", paddingBottom: "3rem" }}
    >
      <div
        className="max-w-5xl mx-auto px-6"
        style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "2.5rem" }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <IconHourly size={22} />
            <span
              className="text-base font-semibold"
              style={{ color: "var(--color-text)", fontFamily: "var(--font-mono)" }}
            >
              Hourly
            </span>
          </Link>
          <p className="text-sm text-center" style={{ color: "var(--color-text-3)" }}>
            Hire AI by the hour.
          </p>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "3.5rem" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" }}>
            <div
              className="text-sm font-semibold uppercase tracking-wider text-center"
              style={{ color: "var(--color-text-3)" }}
            >
              Product
            </div>
            {[
              { label: "Features", href: "/#features" },
              { label: "Pricing", href: "/#pricing" },
              { label: "FAQ", href: "/#faq" },
              { label: "Activate Key", href: "/activate" },
            ].map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm text-center transition-colors"
                style={{ color: "var(--color-text-2)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-text)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-2)")}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" }}>
            <div
              className="text-sm font-semibold uppercase tracking-wider text-center"
              style={{ color: "var(--color-text-3)" }}
            >
              Legal
            </div>
            {[
              { label: "Privacy Policy", href: "/privacy" },
              { label: "Terms of Service", href: "/terms" },
            ].map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm text-center transition-colors"
                style={{ color: "var(--color-text-2)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-text)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-2)")}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div
          className="w-full"
          style={{
            borderTop: "1px solid var(--color-border)",
            paddingTop: "1.5rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <p className="text-sm text-center" style={{ color: "var(--color-text-3)" }}>
            &copy; {new Date().getFullYear()} Hourly. All rights reserved.
          </p>
          <a
            href="https://github.com/3289david/hourly"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--color-text-3)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-text)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-3)")}
            aria-label="GitHub"
          >
            <IconGitHub size={18} />
          </a>
        </div>
      </div>
    </footer>
  );
}
