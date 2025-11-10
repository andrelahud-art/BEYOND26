import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service — Beyond26',
  description: 'Terms and conditions for using Beyond26 services.',
};

export default function TermsPage() {
  return (
    <div className="py-20">
      <div className="container px-4 md:px-8 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Terms of Service</h1>
        <p className="text-muted-foreground mb-12">Last updated: November 10, 2025</p>

        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">Agreement to Terms</h2>
            <p>
              By accessing or using Beyond26 services, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Services Description</h2>
            <p>
              Beyond26 provides premium concierge services ("Shadow Services") for travelers attending the 2026 North American events. Services include but are not limited to: personal assistance, logistics coordination, transportation arrangement, and hospitality support.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Booking & Payment Terms</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Deposit:</strong> A 50% deposit is required at the time of booking to secure your reservation.
              </li>
              <li>
                <strong>Balance:</strong> The remaining 50% balance must be paid no later than 24 hours before the start of your service.
              </li>
              <li>
                <strong>Currency:</strong> All prices are quoted in USD. Local currency estimates are approximate and for reference only.
              </li>
              <li>
                <strong>Payment Methods:</strong> We accept payments via Stripe (credit cards, debit cards).
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Cancellation Policy</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>72+ hours before service:</strong> 50% refund of total payment
              </li>
              <li>
                <strong>48-72 hours before service:</strong> 25% refund of total payment
              </li>
              <li>
                <strong>Less than 48 hours:</strong> Non-refundable
              </li>
              <li>
                <strong>No-show:</strong> Non-refundable
              </li>
            </ul>
            <p className="mt-4">
              Cancellations must be submitted in writing to{' '}
              <a href="mailto:hello@beyond26.com" className="text-primary hover:underline">
                hello@beyond26.com
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Client Responsibilities</h2>
            <p>Clients agree to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide accurate information for bookings</li>
              <li>Treat Shadows and staff with respect and professionalism</li>
              <li>Comply with local laws and regulations</li>
              <li>Not engage in illegal activities during service</li>
              <li>Cooperate with safety and security protocols</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Code of Conduct</h2>
            <p>
              Beyond26 reserves the right to terminate services immediately without refund if clients engage in:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Harassment or inappropriate behavior toward Shadows or staff</li>
              <li>Illegal activities</li>
              <li>Behavior that compromises safety</li>
              <li>Damage to property or reputation</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Limitation of Liability</h2>
            <p>
              Beyond26 and its Shadows will exercise reasonable care in providing services. However, we are not liable for:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Events beyond our reasonable control (force majeure)</li>
              <li>Third-party service failures (restaurants, transportation providers)</li>
              <li>Personal injury or property damage not caused by our negligence</li>
              <li>Indirect, consequential, or punitive damages</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Insurance</h2>
            <p>
              All Shadows are covered by comprehensive liability insurance. Clients are encouraged to maintain their own travel and medical insurance.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">No Affiliation with FIFA</h2>
            <p>
              Beyond26 is an independent hospitality service provider and is not affiliated with, endorsed by, or sponsored by FIFA™, its subsidiaries, or any football associations. We do not sell tickets or engage in ticket resale.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Intellectual Property</h2>
            <p>
              All content on this website, including text, graphics, logos, and software, is the property of Beyond26 and protected by copyright and trademark laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Governing Law</h2>
            <p>
              These Terms are governed by the laws of Mexico. Any disputes shall be resolved through arbitration in Mexico City.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. Continued use of our services after changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
            <p>
              For questions about these Terms, contact us at{' '}
              <a href="mailto:legal@beyond26.com" className="text-primary hover:underline">
                legal@beyond26.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
