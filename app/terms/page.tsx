import Link from "next/link";
import type { Metadata } from "next";
import { Nav } from "@/components/nav";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms and conditions for using Hourly.",
};

export default function TermsPage() {
  return (
    <div style={{ background: "var(--color-bg)", color: "var(--color-text)", minHeight: "100vh" }}>
      <Nav />
      <main style={{ paddingTop: "80px", textAlign: "center" }}>
        <div style={{ maxWidth: "48rem", margin: "0 auto", padding: "4rem 1.5rem 6rem" }}>
          <p style={{ color: "var(--color-accent)", fontFamily: "var(--font-mono)", fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1rem", textAlign: "center" }}>
            Legal
          </p>
          <h1 style={{ color: "var(--color-text)", fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 700, marginBottom: "0.5rem", textAlign: "center" }}>
            Terms of Service
          </h1>
          <p style={{ color: "var(--color-text-3)", fontSize: "0.875rem", marginBottom: "3rem", textAlign: "center" }}>
            Last updated: June 20, 2026
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem", fontSize: "1rem", lineHeight: 1.8, color: "var(--color-text-2)", textAlign: "left" }}>
            {[
              {
                title: "1. Agreement to Terms",
                content: <p>By accessing or using Hourly (&quot;the Service&quot;) at hourly.krl.kr, you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not use the Service.</p>,
              },
              {
                title: "2. The Service",
                content: <p>Hourly provides time-limited access to an AI coding workspace. You purchase a specific duration of access (1 hour, 6 hours, 24 hours, 7 days, or 30 days). Access begins when you activate your license key and ends when the purchased time expires.</p>,
              },
              {
                title: "3. Purchases and Payments",
                content: (
                  <ul style={{ display: "flex", flexDirection: "column", gap: "0.5rem", paddingLeft: "1.25rem" }}>
                    <li>• All purchases are <strong style={{ color: "var(--color-text)" }}>one-time payments</strong>. There are no subscriptions or recurring charges.</li>
                    <li>• Prices are listed in USD and are subject to change. The price at time of purchase is final.</li>
                    <li>• Payments are processed by Polar.sh and Stripe. Hourly does not handle or store payment card details.</li>
                    <li>• A license key is delivered to your email address immediately after successful payment.</li>
                  </ul>
                ),
              },
              {
                title: "4. Refund Policy",
                content: (
                  <ul style={{ display: "flex", flexDirection: "column", gap: "0.5rem", paddingLeft: "1.25rem" }}>
                    <li>• <strong style={{ color: "var(--color-text)" }}>Unactivated keys:</strong> Full refund within 7 days of purchase. Contact support with your order ID.</li>
                    <li>• <strong style={{ color: "var(--color-text)" }}>Activated sessions:</strong> No refunds for time already used. If a technical issue prevented access, contact support within 48 hours of the incident for review.</li>
                    <li>• Refunds are processed through Polar.sh and may take 5–10 business days to appear.</li>
                  </ul>
                ),
              },
              {
                title: "5. Acceptable Use",
                content: (
                  <>
                    <p style={{ marginBottom: "0.75rem" }}>You agree not to use Hourly to:</p>
                    <ul style={{ display: "flex", flexDirection: "column", gap: "0.5rem", paddingLeft: "1.25rem" }}>
                      <li>• Generate malware, ransomware, spyware, or other malicious code.</li>
                      <li>• Conduct unauthorized penetration testing, DDoS attacks, or other offensive security operations against systems you do not own.</li>
                      <li>• Generate content that violates applicable laws, including content that infringes copyright, constitutes fraud, or is defamatory.</li>
                      <li>• Attempt to circumvent rate limits, session limits, or access controls of the Service.</li>
                      <li>• Resell, sublicense, or commercially redistribute the Service without written permission.</li>
                      <li>• Use the Service to generate spam, phishing content, or any form of unsolicited communication at scale.</li>
                    </ul>
                    <p style={{ marginTop: "0.75rem" }}>Violations may result in immediate session termination without refund.</p>
                  </>
                ),
              },
              {
                title: "6. AI Output Disclaimer",
                content: <p>AI-generated code and content may contain errors, bugs, security vulnerabilities, or inaccuracies. Hourly provides AI assistance as a productivity tool — you are responsible for reviewing, testing, and validating all AI output before deploying it to production. Hourly is not liable for damages arising from AI-generated content.</p>,
              },
              {
                title: "7. Intellectual Property",
                content: <p>Code you generate during your session is yours. You retain ownership of all output produced using Hourly. You grant Hourly no rights to your inputs or outputs. Hourly retains all rights to the platform, interface, and infrastructure.</p>,
              },
              {
                title: "8. Session and Data Retention",
                content: <p>Your workspace files are retained for 48 hours after session expiry. After that, they are permanently deleted. We are not responsible for data loss. You should download any important files before your session ends.</p>,
              },
              {
                title: "9. Service Availability",
                content: <p>Hourly is provided &quot;as is&quot; with no uptime guarantee. We aim for high availability but may experience downtime for maintenance or technical issues. If the Service is unavailable for an extended period during your active session, contact support for a time extension or credit.</p>,
              },
              {
                title: "10. Limitation of Liability",
                content: <p>To the maximum extent permitted by law, Hourly shall not be liable for indirect, incidental, special, consequential, or punitive damages arising from your use of the Service, including but not limited to lost profits, data loss, or service interruption. Our total liability for any claim shall not exceed the amount you paid for the session in question.</p>,
              },
              {
                title: "11. Modifications",
                content: <p>We reserve the right to modify these terms at any time. Changes will be posted on this page with an updated date. Continued use of the Service after changes constitutes acceptance of the revised terms.</p>,
              },
              {
                title: "12. Governing Law",
                content: <p>These terms are governed by and construed in accordance with applicable laws. Any disputes shall be resolved through good-faith negotiation before pursuing formal proceedings.</p>,
              },
              {
                title: "13. Contact",
                content: <p>Questions about these terms: <a href="mailto:support@hourly.krl.kr" style={{ color: "var(--color-accent)" }}>support@hourly.krl.kr</a></p>,
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
            <Link href="/privacy" style={{ color: "var(--color-accent)", fontSize: "0.875rem" }}>
              Read our Privacy Policy →
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
