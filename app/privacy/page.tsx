import Link from "next/link";
import type { Metadata } from "next";
import { Nav } from "@/components/nav";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Hourly collects and uses your information.",
};

export default function PrivacyPage() {
  return (
    <div style={{ background: "var(--color-bg)", color: "var(--color-text)", minHeight: "100vh" }}>
      <Nav />
      <main style={{ paddingTop: "80px", textAlign: "center" }}>
        <div style={{ maxWidth: "48rem", margin: "0 auto", padding: "4rem 1.5rem 6rem" }}>
          <p style={{ color: "var(--color-accent)", fontFamily: "var(--font-mono)", fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1rem", textAlign: "center" }}>
            Legal
          </p>
          <h1 style={{ color: "var(--color-text)", fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 700, marginBottom: "0.5rem", textAlign: "center" }}>
            Privacy Policy
          </h1>
          <p style={{ color: "var(--color-text-3)", fontSize: "0.875rem", marginBottom: "3rem", textAlign: "center" }}>
            Last updated: June 20, 2026
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem", fontSize: "1rem", lineHeight: 1.8, color: "var(--color-text-2)", textAlign: "left" }}>
            {[
              {
                title: "1. What We Collect",
                content: (
                  <>
                    <p>Hourly collects minimal information necessary to provide the service:</p>
                    <ul style={{ marginTop: "0.75rem", display: "flex", flexDirection: "column", gap: "0.5rem", paddingLeft: "1.25rem" }}>
                      <li>• <strong style={{ color: "var(--color-text)" }}>Email address</strong> — provided by Polar.sh at checkout for license key delivery. We do not store this beyond transactional emails.</li>
                      <li>• <strong style={{ color: "var(--color-text)" }}>Session data</strong> — an encrypted JWT cookie that identifies your active session. It expires when your purchased time runs out.</li>
                      <li>• <strong style={{ color: "var(--color-text)" }}>Workspace files</strong> — files you create or clone during your session are stored temporarily and deleted 48 hours after session expiry.</li>
                      <li>• <strong style={{ color: "var(--color-text)" }}>Server logs</strong> — standard request logs (IP address, timestamp, endpoint) retained for up to 30 days for security and debugging.</li>
                    </ul>
                  </>
                ),
              },
              {
                title: "2. What We Do Not Collect",
                content: (
                  <ul style={{ display: "flex", flexDirection: "column", gap: "0.5rem", paddingLeft: "1.25rem" }}>
                    <li>• We do not collect or store payment card details — payments are processed by <a href="https://polar.sh" target="_blank" rel="noopener noreferrer" style={{ color: "var(--color-accent)" }}>Polar.sh</a> and <a href="https://stripe.com" target="_blank" rel="noopener noreferrer" style={{ color: "var(--color-accent)" }}>Stripe</a>.</li>
                    <li>• We do not sell your data to third parties.</li>
                    <li>• We do not use tracking pixels, advertising cookies, or behavioral analytics.</li>
                    <li>• Your AI conversation history is not permanently stored. Messages exist only in-session memory.</li>
                  </ul>
                ),
              },
              {
                title: "3. BYOK (Bring Your Own Key)",
                content: <p>If you provide your own API keys (OpenRouter or model-specific keys), they are encrypted in memory for the duration of your session only. They are never written to disk, logged, or retained after your session ends.</p>,
              },
              {
                title: "4. Cookies",
                content: <p>We use a single session cookie (<code style={{ fontFamily: "var(--font-mono)", color: "var(--color-accent)" }}>hourly_session</code>) to maintain your workspace access. This cookie is HttpOnly, Secure, and expires when your session time runs out. We do not use any third-party cookies or analytics cookies.</p>,
              },
              {
                title: "5. Third-Party Services",
                content: (
                  <ul style={{ display: "flex", flexDirection: "column", gap: "0.5rem", paddingLeft: "1.25rem" }}>
                    <li>• <strong style={{ color: "var(--color-text)" }}>Polar.sh / Stripe</strong> — handles payment processing. Their privacy policies apply to checkout data.</li>
                    <li>• <strong style={{ color: "var(--color-text)" }}>OpenRouter</strong> — AI inference is routed through OpenRouter. Prompts and responses are subject to OpenRouter&apos;s data handling policy.</li>
                    <li>• <strong style={{ color: "var(--color-text)" }}>Cloudflare</strong> — used for CDN and DDoS protection. Cloudflare may process request metadata.</li>
                  </ul>
                ),
              },
              {
                title: "6. Data Deletion",
                content: <p>Workspace files are automatically deleted 48 hours after session expiry. To request deletion of any other data associated with your email, contact us at the address below. We will respond within 7 days.</p>,
              },
              {
                title: "7. Changes to This Policy",
                content: <p>We may update this policy as the service evolves. Material changes will be announced on the site. Continued use of Hourly after changes constitutes acceptance of the revised policy.</p>,
              },
              {
                title: "8. Contact",
                content: <p>For privacy questions or data requests: <a href="mailto:support@hourly.krl.kr" style={{ color: "var(--color-accent)" }}>support@hourly.krl.kr</a></p>,
              },
            ].map(({ title, content }) => (
              <section key={title}>
                <h2 style={{ color: "var(--color-text)", fontSize: "1.125rem", fontWeight: 600, marginBottom: "0.75rem", textAlign: "center" }}>
                  {title}
                </h2>
                {content}
              </section>
            ))}
          </div>

          <div style={{ marginTop: "4rem", paddingTop: "2rem", borderTop: "1px solid var(--color-border)", textAlign: "center" }}>
            <Link href="/terms" style={{ color: "var(--color-accent)", fontSize: "0.875rem" }}>
              Read our Terms of Service →
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
