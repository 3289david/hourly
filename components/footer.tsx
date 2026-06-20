"use client";

import Link from "next/link";
import { IconHourly, IconGitHub } from "./icons";

export function Footer() {
  return (
    <footer
      className="py-10"
      style={{ borderTop: "1px solid var(--color-border)" }}
    >
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-2">
              <IconHourly size={20} />
              <span
                className="text-sm font-semibold"
                style={{ color: "var(--color-text)", fontFamily: "var(--font-mono)" }}
              >
                Hourly
              </span>
            </Link>
            <p className="text-xs" style={{ color: "var(--color-text-3)" }}>
              Hire AI by the hour.
            </p>
          </div>

          <div className="flex flex-wrap gap-10">
            <div className="flex flex-col gap-2">
              <div
                className="text-xs font-semibold uppercase tracking-wider mb-1"
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
                  className="text-xs transition-colors"
                  style={{ color: "var(--color-text-2)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-text)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-2)")}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex flex-col gap-2">
              <div
                className="text-xs font-semibold uppercase tracking-wider mb-1"
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
                  className="text-xs transition-colors"
                  style={{ color: "var(--color-text-2)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-text)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-2)")}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div
          className="mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-3"
          style={{ borderTop: "1px solid var(--color-border)" }}
        >
          <p className="text-xs" style={{ color: "var(--color-text-3)" }}>
            &copy; {new Date().getFullYear()} Hourly. All rights reserved.
          </p>
          <a
            href="https://github.com/3289david/hourly"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors"
            style={{ color: "var(--color-text-3)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-text)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-3)")}
            aria-label="GitHub"
          >
            <IconGitHub size={16} />
          </a>
        </div>
      </div>
    </footer>
  );
}
