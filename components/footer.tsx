"use client";

import Link from "next/link";
import { IconHourly, IconGitHub } from "./icons";

export function Footer() {
  return (
    <footer
      className="py-12"
      style={{ borderTop: "1px solid var(--color-border)" }}
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-3">
              <IconHourly size={24} />
              <span
                className="font-semibold"
                style={{ color: "var(--color-text)", fontFamily: "var(--font-mono)" }}
              >
                Hourly
              </span>
            </Link>
            <p
              className="text-sm"
              style={{ color: "var(--color-text-3)" }}
            >
              Hire AI by the hour.
            </p>
          </div>

          <div className="flex flex-wrap gap-8">
            <div className="flex flex-col gap-2">
              <div
                className="text-xs font-semibold uppercase tracking-wider mb-1"
                style={{ color: "var(--color-text-3)" }}
              >
                Product
              </div>
              {[
                { label: "Features", href: "#features" },
                { label: "Pricing", href: "#pricing" },
                { label: "FAQ", href: "#faq" },
                { label: "Activate Key", href: "/activate" },
              ].map((link) => (
                <Link
                  key={link.label}
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
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div
          className="mt-10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderTop: "1px solid var(--color-border)" }}
        >
          <p className="text-xs" style={{ color: "var(--color-text-3)" }}>
            &copy; {new Date().getFullYear()} Hourly. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors"
              style={{ color: "var(--color-text-3)" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--color-text)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--color-text-3)")
              }
              aria-label="GitHub"
            >
              <IconGitHub size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
