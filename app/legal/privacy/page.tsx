import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — Beyond26',
  description: 'Our commitment to protecting your privacy and personal data.',
};

export default function PrivacyPage() {
  return (
    <div className="py-20">
      <div className="container px-4 md:px-8 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Privacy Policy</h1>
        <p className="text-muted-foreground mb-12">Last updated: November 10, 2025</p>

        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">Introduction</h2>
            <p>
              Beyond26 ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Information We Collect</h2>
            <p>We collect information that you provide directly to us, including:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Name, email address, and phone number</li>
              <li>Travel dates and destination preferences</li>
              <li>Package and Shadow type preferences</li>
              <li>Communication preferences and message content</li>
              <li>Payment information (processed securely through Stripe)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide, maintain, and improve our services</li>
              <li>Process your bookings and transactions</li>
              <li>Send you confirmations, updates, and support messages</li>
              <li>Respond to your inquiries and requests</li>
              <li>Analyze usage patterns to improve user experience</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Data Protection & Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. All data is encrypted at rest and in transit.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">GDPR & LFPDPPP Compliance</h2>
            <p>
              We comply with the EU General Data Protection Regulation (GDPR) and Mexico's Federal Law on Protection of Personal Data Held by Private Parties (LFPDPPP). You have the right to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access your personal data</li>
              <li>Rectify inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to processing of your data</li>
              <li>Request data portability</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Data Sharing</h2>
            <p>
              We do not sell or share your personal information with third parties for marketing purposes. We may share information with:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Service providers who assist in our operations (e.g., payment processors)</li>
              <li>Law enforcement when required by law</li>
              <li>Professional advisors (lawyers, accountants)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Cookies</h2>
            <p>
              We use cookies and similar tracking technologies to enhance your experience. See our{' '}
              <a href="/legal/cookies" className="text-primary hover:underline">
                Cookie Policy
              </a>{' '}
              for more information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Data Subject Requests</h2>
            <p>
              To exercise your data rights, contact us at{' '}
              <a href="mailto:privacy@beyond26.com" className="text-primary hover:underline">
                privacy@beyond26.com
              </a>
              . We will respond within 30 days.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy, please contact us at{' '}
              <a href="mailto:privacy@beyond26.com" className="text-primary hover:underline">
                privacy@beyond26.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
