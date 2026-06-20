import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms and conditions for using Hourly.",
};

export default function TermsPage() {
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
          Terms of Service
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
              1. Agreement to Terms
            </h2>
            <p>
              By accessing or using Hourly (&quot;the Service&quot;) at hourly.krl.kr, you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-3" style={{ color: "var(--color-text)" }}>
              2. The Service
            </h2>
            <p>
              Hourly provides time-limited access to an AI coding workspace. You purchase a specific duration of access (1 hour, 6 hours, 24 hours, 7 days, or 30 days). Access begins when you activate your license key and ends when the purchased time expires.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-3" style={{ color: "var(--color-text)" }}>
              3. Purchases and Payments
            </h2>
            <ul className="flex flex-col gap-2 ml-4">
              <li>• All purchases are <strong style={{ color: "var(--color-text)" }}>one-time payments</strong>. There are no subscriptions or recurring charges.</li>
              <li>• Prices are listed in USD and are subject to change. The price at time of purchase is final.</li>
              <li>• Payments are processed by Polar.sh and Stripe. Hourly does not handle or store payment card details.</li>
              <li>• A license key is delivered to your email address immediately after successful payment.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-3" style={{ color: "var(--color-text)" }}>
              4. Refund Policy
            </h2>
            <ul className="flex flex-col gap-2 ml-4">
              <li>• <strong style={{ color: "var(--color-text)" }}>Unactivated keys:</strong> Full refund within 7 days of purchase. Contact support with your order ID.</li>
              <li>• <strong style={{ color: "var(--color-text)" }}>Activated sessions:</strong> No refunds for time already used. If a technical issue prevented access, contact support within 48 hours of the incident for review.</li>
              <li>• Refunds are processed through Polar.sh and may take 5-10 business days to appear.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-3" style={{ color: "var(--color-text)" }}>
              5. Acceptable Use
            </h2>
            <p className="mb-3">You agree not to use Hourly to:</p>
            <ul className="flex flex-col gap-2 ml-4">
              <li>• Generate malware, ransomware, spyware, or other malicious code.</li>
              <li>• Conduct unauthorized penetration testing, DDoS attacks, or other offensive security operations against systems you do not own.</li>
              <li>• Generate content that violates applicable laws, including content that infringes copyright, constitutes fraud, or is defamatory.</li>
              <li>• Attempt to circumvent rate limits, session limits, or access controls of the Service.</li>
              <li>• Resell, sublicense, or commercially redistribute the Service without written permission.</li>
              <li>• Use the Service to generate spam, phishing content, or any form of unsolicited communication at scale.</li>
            </ul>
            <p className="mt-3">
              Violations may result in immediate session termination without refund.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-3" style={{ color: "var(--color-text)" }}>
              6. AI Output Disclaimer
            </h2>
            <p>
              AI-generated code and content may contain errors, bugs, security vulnerabilities, or inaccuracies. Hourly provides AI assistance as a productivity tool — you are responsible for reviewing, testing, and validating all AI output before deploying it to production. Hourly is not liable for damages arising from AI-generated content.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-3" style={{ color: "var(--color-text)" }}>
              7. Intellectual Property
            </h2>
            <p>
              Code you generate during your session is yours. You retain ownership of all output produced using Hourly. You grant Hourly no rights to your inputs or outputs. Hourly retains all rights to the platform, interface, and infrastructure.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-3" style={{ color: "var(--color-text)" }}>
              8. Session and Data Retention
            </h2>
            <p>
              Your workspace files are retained for 48 hours after session expiry. After that, they are permanently deleted. We are not responsible for data loss. You should download any important files before your session ends.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-3" style={{ color: "var(--color-text)" }}>
              9. Service Availability
            </h2>
            <p>
              Hourly is provided &quot;as is&quot; with no uptime guarantee. We aim for high availability but may experience downtime for maintenance or technical issues. If the Service is unavailable for an extended period during your active session, contact support for a time extension or credit.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-3" style={{ color: "var(--color-text)" }}>
              10. Limitation of Liability
            </h2>
            <p>
              To the maximum extent permitted by law, Hourly shall not be liable for indirect, incidental, special, consequential, or punitive damages arising from your use of the Service, including but not limited to lost profits, data loss, or service interruption. Our total liability for any claim shall not exceed the amount you paid for the session in question.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-3" style={{ color: "var(--color-text)" }}>
              11. Modifications
            </h2>
            <p>
              We reserve the right to modify these terms at any time. Changes will be posted on this page with an updated date. Continued use of the Service after changes constitutes acceptance of the revised terms.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-3" style={{ color: "var(--color-text)" }}>
              12. Governing Law
            </h2>
            <p>
              These terms are governed by and construed in accordance with applicable laws. Any disputes shall be resolved through good-faith negotiation before pursuing formal proceedings.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-3" style={{ color: "var(--color-text)" }}>
              13. Contact
            </h2>
            <p>
              Questions about these terms: <a href="mailto:support@hourly.krl.kr" style={{ color: "var(--color-accent)" }}>support@hourly.krl.kr</a>
            </p>
          </section>
        </div>

        <div className="mt-16 pt-8" style={{ borderTop: "1px solid var(--color-border)" }}>
          <Link href="/privacy" className="text-sm" style={{ color: "var(--color-accent)" }}>
            Read our Privacy Policy →
          </Link>
        </div>
      </div>
    </div>
  );
}
