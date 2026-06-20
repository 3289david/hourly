import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Hourly collects and uses your information.",
};

export default function PrivacyPage() {
  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--color-bg)", color: "var(--color-text)" }}
    >
      {/* Nav */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 border-b"
        style={{
          background: "rgba(5,5,5,0.9)",
          backdropFilter: "blur(16px)",
          borderColor: "var(--color-border)",
        }}
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center h-14">
          <Link
            href="/"
            className="text-sm font-semibold"
            style={{ color: "var(--color-text)", fontFamily: "var(--font-mono)" }}
          >
            ← Hourly
          </Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 pt-28 pb-24">
        <div
          className="text-xs font-mono uppercase tracking-widest mb-4"
          style={{ color: "var(--color-accent)" }}
        >
          Legal
        </div>
        <h1
          className="text-4xl font-bold mb-2"
          style={{ color: "var(--color-text)" }}
        >
          Privacy Policy
        </h1>
        <p className="text-sm mb-12" style={{ color: "var(--color-text-3)" }}>
          Last updated: June 20, 2026
        </p>

        <div
          className="flex flex-col gap-8 text-sm leading-relaxed"
          style={{ color: "var(--color-text-2)" }}
        >
          <section>
            <h2 className="text-base font-semibold mb-3" style={{ color: "var(--color-text)" }}>
              1. What We Collect
            </h2>
            <p>
              Hourly collects minimal information necessary to provide the service:
            </p>
            <ul className="mt-3 flex flex-col gap-2 ml-4">
              <li>• <strong style={{ color: "var(--color-text)" }}>Email address</strong> — provided by Polar.sh at checkout for license key delivery. We do not store this beyond transactional emails.</li>
              <li>• <strong style={{ color: "var(--color-text)" }}>Session data</strong> — an encrypted JWT cookie that identifies your active session. It expires when your purchased time runs out.</li>
              <li>• <strong style={{ color: "var(--color-text)" }}>Workspace files</strong> — files you create or clone during your session are stored temporarily and deleted 48 hours after session expiry.</li>
              <li>• <strong style={{ color: "var(--color-text)" }}>Server logs</strong> — standard request logs (IP address, timestamp, endpoint) retained for up to 30 days for security and debugging.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-3" style={{ color: "var(--color-text)" }}>
              2. What We Do Not Collect
            </h2>
            <ul className="flex flex-col gap-2 ml-4">
              <li>• We do not collect or store payment card details — payments are processed by <a href="https://polar.sh" target="_blank" rel="noopener noreferrer" style={{ color: "var(--color-accent)" }}>Polar.sh</a> and <a href="https://stripe.com" target="_blank" rel="noopener noreferrer" style={{ color: "var(--color-accent)" }}>Stripe</a>.</li>
              <li>• We do not sell your data to third parties.</li>
              <li>• We do not use tracking pixels, advertising cookies, or behavioral analytics.</li>
              <li>• Your AI conversation history is not permanently stored. Messages exist only in-session memory.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-3" style={{ color: "var(--color-text)" }}>
              3. BYOK (Bring Your Own Key)
            </h2>
            <p>
              If you provide your own API keys (OpenRouter or model-specific keys), they are encrypted in memory for the duration of your session only. They are never written to disk, logged, or retained after your session ends.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-3" style={{ color: "var(--color-text)" }}>
              4. Cookies
            </h2>
            <p>
              We use a single session cookie (<code style={{ fontFamily: "var(--font-mono)", color: "var(--color-accent)" }}>hourly_session</code>) to maintain your workspace access. This cookie is HttpOnly, Secure, and expires when your session time runs out. We do not use any third-party cookies or analytics cookies.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-3" style={{ color: "var(--color-text)" }}>
              5. Third-Party Services
            </h2>
            <ul className="flex flex-col gap-2 ml-4">
              <li>• <strong style={{ color: "var(--color-text)" }}>Polar.sh / Stripe</strong> — handles payment processing. Their privacy policies apply to checkout data.</li>
              <li>• <strong style={{ color: "var(--color-text)" }}>OpenRouter</strong> — AI inference is routed through OpenRouter. Prompts and responses are subject to OpenRouter&apos;s data handling policy.</li>
              <li>• <strong style={{ color: "var(--color-text)" }}>Cloudflare</strong> — used for CDN and DDoS protection. Cloudflare may process request metadata.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-3" style={{ color: "var(--color-text)" }}>
              6. Data Deletion
            </h2>
            <p>
              Workspace files are automatically deleted 48 hours after session expiry. To request deletion of any other data associated with your email, contact us at the address below. We will respond within 7 days.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-3" style={{ color: "var(--color-text)" }}>
              7. Changes to This Policy
            </h2>
            <p>
              We may update this policy as the service evolves. Material changes will be announced on the site. Continued use of Hourly after changes constitutes acceptance of the revised policy.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-3" style={{ color: "var(--color-text)" }}>
              8. Contact
            </h2>
            <p>
              For privacy questions or data requests: <a href="mailto:support@hourly.krl.kr" style={{ color: "var(--color-accent)" }}>support@hourly.krl.kr</a>
            </p>
          </section>
        </div>

        <div className="mt-16 pt-8" style={{ borderTop: "1px solid var(--color-border)" }}>
          <Link href="/terms" className="text-sm" style={{ color: "var(--color-accent)" }}>
            Read our Terms of Service →
          </Link>
        </div>
      </div>
    </div>
  );
}
