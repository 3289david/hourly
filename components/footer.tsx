"use client";

import Link from "next/link";
import { IconHourly, IconGitHub } from "./icons";

export function Footer() {
  return (
    <footer
      className="flex flex-col items-center"
      style={{ borderTop: "1px solid var(--color-border)", paddingTop: "3rem", paddingBottom: "3rem", textAlign: "center" }}
    >
      <div className="w-full max-w-5xl px-6" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2.5rem", textAlign: "center" }}>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}>
            <IconHourly size={22} />
            <span style={{ color: "var(--color-text)", fontFamily: "var(--font-mono)", fontSize: "1rem", fontWeight: 600 }}>
              Hourly
            </span>
          </Link>
          <p style={{ color: "var(--color-text-3)", fontSize: "0.875rem", textAlign: "center" }}>
            Hire AI by the hour.
          </p>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "3.5rem" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" }}>
            <p style={{ color: "var(--color-text-3)", fontSize: "0.875rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", textAlign: "center" }}>
              Product
            </p>
            {[
              { label: "Features", href: "/#features" },
              { label: "Pricing", href: "/#pricing" },
              { label: "FAQ", href: "/#faq" },
              { label: "Activate Key", href: "/activate" },
            ].map((link) => (
              <Link key={link.label} href={link.href} style={{ color: "var(--color-text-2)", fontSize: "0.875rem", textDecoration: "none", textAlign: "center" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-text)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-2)")}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" }}>
            <p style={{ color: "var(--color-text-3)", fontSize: "0.875rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", textAlign: "center" }}>
              Legal
            </p>
            {[
              { label: "Privacy Policy", href: "/privacy" },
              { label: "Terms of Service", href: "/terms" },
            ].map((link) => (
              <Link key={link.label} href={link.href} style={{ color: "var(--color-text-2)", fontSize: "0.875rem", textDecoration: "none", textAlign: "center" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-text)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-2)")}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div style={{ width: "100%", borderTop: "1px solid var(--color-border)", paddingTop: "1.5rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
          <p style={{ color: "var(--color-text-3)", fontSize: "0.875rem", textAlign: "center" }}>
            &copy; {new Date().getFullYear()} Hourly. All rights reserved.
          </p>
          <a href="https://github.com/3289david/hourly" target="_blank" rel="noopener noreferrer"
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
