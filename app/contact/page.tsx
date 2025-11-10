import { Suspense } from 'react';
import { ContactForm } from './ContactForm';

export default function ContactPage() {
  return (
    <div className="py-20">
      <div className="container px-4 md:px-8 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Let's Start Your Journey
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Contact us to discuss your needs, schedule a consultation, or book your Shadow directly.
          </p>
        </div>

        <Suspense fallback={
          <div className="flex items-center justify-center py-20">
            <div className="text-muted-foreground">Loading...</div>
          </div>
        }>
          <ContactForm />
        </Suspense>
      </div>
    </div>
  );
}
