import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookie Policy — Beyond26',
  description: 'How we use cookies and tracking technologies.',
};

export default function CookiesPage() {
  return (
    <div className="py-20">
      <div className="container px-4 md:px-8 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Cookie Policy</h1>
        <p className="text-muted-foreground mb-12">Last updated: November 10, 2025</p>

        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">What Are Cookies?</h2>
            <p>
              Cookies are small text files that are placed on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and understanding how you use our site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">How We Use Cookies</h2>
            <p>We use cookies for the following purposes:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Essential Cookies:</strong> Necessary for the website to function properly. These cannot be disabled.
              </li>
              <li>
                <strong>Analytics Cookies:</strong> Help us understand how visitors interact with our website (e.g., Google Analytics).
              </li>
              <li>
                <strong>Preference Cookies:</strong> Remember your settings and preferences (e.g., language, country selection).
              </li>
              <li>
                <strong>Marketing Cookies:</strong> Track your visit across websites to show relevant advertisements (with your consent).
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Cookies We Use</h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">Essential Cookies</h3>
                <table className="w-full border-collapse border border-border">
                  <thead>
                    <tr className="bg-card">
                      <th className="border border-border p-3 text-left">Cookie Name</th>
                      <th className="border border-border p-3 text-left">Purpose</th>
                      <th className="border border-border p-3 text-left">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border p-3">beyond26_session</td>
                      <td className="border border-border p-3">Maintains your session state</td>
                      <td className="border border-border p-3">Session</td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3">beyond26_cookie_consent</td>
                      <td className="border border-border p-3">Stores your cookie preferences</td>
                      <td className="border border-border p-3">1 year</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">Analytics Cookies (Opt-in)</h3>
                <table className="w-full border-collapse border border-border">
                  <thead>
                    <tr className="bg-card">
                      <th className="border border-border p-3 text-left">Cookie Name</th>
                      <th className="border border-border p-3 text-left">Purpose</th>
                      <th className="border border-border p-3 text-left">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border p-3">_ga</td>
                      <td className="border border-border p-3">Google Analytics - User identification</td>
                      <td className="border border-border p-3">2 years</td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3">_ga_*</td>
                      <td className="border border-border p-3">Google Analytics - Session state</td>
                      <td className="border border-border p-3">2 years</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Third-Party Cookies</h2>
            <p>
              Some cookies are set by third-party services that appear on our pages:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Google Analytics:</strong> Helps us analyze website traffic and user behavior
              </li>
              <li>
                <strong>Stripe:</strong> Processes payments securely
              </li>
              <li>
                <strong>Calendly:</strong> Enables booking and scheduling functionality
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Managing Cookies</h2>
            <p>
              You can control and manage cookies in several ways:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Cookie Consent Banner:</strong> Use our cookie banner to accept or decline non-essential cookies
              </li>
              <li>
                <strong>Browser Settings:</strong> Most browsers allow you to refuse or delete cookies. Instructions vary by browser:
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Chrome: Settings → Privacy and security → Cookies</li>
                  <li>Firefox: Options → Privacy & Security → Cookies</li>
                  <li>Safari: Preferences → Privacy → Cookies</li>
                </ul>
              </li>
            </ul>
            <p className="mt-4 text-sm text-muted-foreground">
              Note: Blocking essential cookies may prevent certain features of our website from working properly.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">EU Visitors</h2>
            <p>
              For visitors from the European Economic Area (EEA), we comply with GDPR requirements. We will only set non-essential cookies with your explicit consent via our cookie banner.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Updates to This Policy</h2>
            <p>
              We may update this Cookie Policy from time to time. Any changes will be posted on this page with an updated revision date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
            <p>
              If you have questions about our use of cookies, contact us at{' '}
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
