import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Hourly — Hire AI by the Hour",
    template: "%s | Hourly",
  },
  description:
    "Unlimited AI coding agent — by the hour. No subscriptions. No tokens. No credits. Just buy time and code.",
  keywords: [
    "AI coding",
    "AI agent",
    "pay as you go",
    "hourly AI",
    "DeepSeek",
    "Qwen Coder",
    "code assistant",
  ],
  authors: [{ name: "Hourly" }],
  creator: "Hourly",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL ?? "https://hourly.dev",
    siteName: "Hourly",
    title: "Hourly — Hire AI by the Hour",
    description:
      "Unlimited AI coding agent — by the hour. No subscriptions. No tokens. No credits.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hourly — Hire AI by the Hour",
    description:
      "Unlimited AI coding agent — by the hour. No subscriptions. No tokens.",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.svg", sizes: "any" },
    ],
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#050505",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
