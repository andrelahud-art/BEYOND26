'use client';

import { FormEvent, useMemo, useState } from 'react';
import { Compass, Handshake, MapPin, ShieldCheck, Sparkles, Users } from 'lucide-react';

const cityCards = [
  {
    name: 'Mexico City',
    description: 'The cultural heart of Mexico. Food, nightlife and history.',
    image:
      'https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Guadalajara',
    description: 'Tradition, tequila, and a vibrant young scene.',
    image:
      'https://images.unsplash.com/photo-1623808643506-3f9557788ea2?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Monterrey',
    description: 'Modern Mexico with mountains, nightlife and tech culture.',
    image:
      'https://images.unsplash.com/photo-1612810809247-58de661f4dbf?auto=format&fit=crop&w=1200&q=80',
  },
];

const companionTypes = [
  {
    title: 'Explorer',
    description: 'Walk neighborhoods, food spots and hidden places.',
    icon: Compass,
  },
  {
    title: 'Social',
    description: 'Nightlife, bars, meeting people and fun experiences.',
    icon: Users,
  },
  {
    title: 'Practical',
    description: 'Help navigating the city, translating and getting around.',
    icon: Handshake,
  },
];

const profiles = [
  {
    name: 'Sofia',
    age: 24,
    city: 'Mexico City',
    languages: 'Spanish, English',
    vibe: 'Explorer',
    rate: '$28/hr',
    quote: 'I love showing travelers the best street food and hidden cafes in Roma and Condesa.',
    image:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Diego',
    age: 29,
    city: 'Mexico City',
    languages: 'Spanish, English, French',
    vibe: 'Social',
    rate: '$32/hr',
    quote: 'From rooftop bars to live music nights, I build social nights people remember.',
    image:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Camila',
    age: 27,
    city: 'Guadalajara',
    languages: 'Spanish, English',
    vibe: 'Practical',
    rate: '$25/hr',
    quote: 'I help first-time travelers move confidently around the city and local hotspots.',
    image:
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Mateo',
    age: 31,
    city: 'Guadalajara',
    languages: 'Spanish, English, Portuguese',
    vibe: 'Explorer',
    rate: '$30/hr',
    quote: 'I curate daytime routes mixing markets, architecture, and authentic food stops.',
    image:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Valeria',
    age: 26,
    city: 'Monterrey',
    languages: 'Spanish, English',
    vibe: 'Social',
    rate: '$29/hr',
    quote: 'I design fun nights with safe transportation, top bars, and local social scenes.',
    image:
      'https://images.unsplash.com/photo-1542206395-9feb3edaa68d?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Andrés',
    age: 33,
    city: 'Monterrey',
    languages: 'Spanish, English, German',
    vibe: 'Practical',
    rate: '$34/hr',
    quote: 'Perfect for business travelers needing smart routing, translation, and local logistics.',
    image:
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80',
  },
];

const pricing = [
  { title: 'City Walk', duration: '2 hours', description: 'Perfect for first-time visitors.' },
  { title: 'Half Day Local', duration: '4 hours', description: 'Explore neighborhoods and culture.' },
  { title: 'Night Social', duration: '4 hours', description: 'Bars, nightlife and social spots.' },
];

export default function Home() {
  const [cityFilter, setCityFilter] = useState<string>('All Cities');

  const filteredProfiles = useMemo(() => {
    if (cityFilter === 'All Cities') {
      return profiles;
    }

    return profiles.filter((profile) => profile.city === cityFilter);
  }, [cityFilter]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <div className="scroll-smooth bg-background text-foreground">
      <section
        id="hero"
        className="relative isolate overflow-hidden border-b border-border/80 px-6 py-24 sm:px-10 md:py-32"
      >
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(37,99,235,0.35),transparent_45%),radial-gradient(circle_at_80%_0%,rgba(59,130,246,0.22),transparent_35%)]" />
        <div className="mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-[1.1fr,0.9fr] lg:items-center">
          <div className="space-y-8">
            <span className="inline-flex rounded-full border border-primary/40 bg-primary/10 px-4 py-1 text-xs font-medium uppercase tracking-[0.24em] text-primary">
              Launching before FIFA World Cup 2026
            </span>
            <div className="space-y-5">
              <h1 className="text-4xl font-semibold leading-tight sm:text-5xl md:text-6xl">
                Explore Mexico with a Local
              </h1>
              <p className="max-w-xl text-lg text-muted-foreground">
                Skip the tourist traps. Meet verified locals who match your vibe and discover the city differently.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <a href="#booking" className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:translate-y-[-2px] hover:bg-primary/90">
                Find a Local Companion
              </a>
              <a href="#become-local" className="rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold transition hover:border-primary hover:text-primary">
                Become a Local
              </a>
            </div>
          </div>
          <div className="rounded-3xl border border-border bg-card/70 p-2 shadow-2xl shadow-primary/10 backdrop-blur">
            <img
              src="https://images.unsplash.com/photo-1585464231875-d9ef1f5ad396?auto=format&fit=crop&w=1200&q=80"
              alt="Mexico City nightlife"
              className="h-[420px] w-full rounded-[1.3rem] object-cover"
            />
          </div>
        </div>
      </section>

      <section id="how-it-works" className="mx-auto w-full max-w-6xl px-6 py-20 sm:px-10">
        <h2 className="text-3xl font-semibold sm:text-4xl">How BEYON26 Works</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            ['Choose a local', 'Browse profiles of locals who know the city and match your style.'],
            ['Request a booking', 'Pick the experience and time that works for you.'],
            ['Explore together', 'Meet your local companion and discover the city beyond tourist spots.'],
          ].map(([title, text], index) => (
            <article key={title} className="rounded-2xl border border-border bg-card p-6 transition hover:-translate-y-1 hover:border-primary/60">
              <p className="text-sm text-primary">Step {index + 1}</p>
              <h3 className="mt-2 text-xl font-semibold">{title}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="cities" className="border-y border-border/80 bg-card/40 px-6 py-20 sm:px-10">
        <div className="mx-auto w-full max-w-6xl">
          <h2 className="text-3xl font-semibold sm:text-4xl">Available Cities</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {cityCards.map((city) => (
              <article key={city.name} className="overflow-hidden rounded-2xl border border-border bg-card transition hover:-translate-y-1 hover:border-primary/70">
                <img src={city.image} alt={city.name} className="h-48 w-full object-cover" />
                <div className="space-y-4 p-5">
                  <h3 className="text-xl font-semibold">{city.name}</h3>
                  <p className="text-sm text-muted-foreground">{city.description}</p>
                  <button
                    type="button"
                    onClick={() => setCityFilter(city.name)}
                    className="text-sm font-semibold text-primary transition hover:text-primary/80"
                  >
                    Explore locals
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-20 sm:px-10">
        <h2 className="text-3xl font-semibold sm:text-4xl">Find someone that matches your style</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {companionTypes.map((type) => {
            const Icon = type.icon;
            return (
              <article key={type.title} className="rounded-2xl border border-border bg-card p-6">
                <Icon className="h-8 w-8 text-primary" />
                <h3 className="mt-4 text-xl font-semibold">{type.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{type.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section id="locals" className="border-y border-border/80 px-6 py-20 sm:px-10">
        <div className="mx-auto w-full max-w-6xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-3xl font-semibold sm:text-4xl">Meet Some of Our Locals</h2>
            <div className="flex flex-wrap gap-2">
              {['All Cities', 'Mexico City', 'Guadalajara', 'Monterrey'].map((city) => (
                <button
                  key={city}
                  type="button"
                  onClick={() => setCityFilter(city)}
                  className={`rounded-full px-4 py-2 text-xs font-medium transition ${
                    cityFilter === city
                      ? 'bg-primary text-primary-foreground'
                      : 'border border-border bg-card text-muted-foreground hover:border-primary hover:text-primary'
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProfiles.map((profile) => (
              <article key={profile.name} className="rounded-2xl border border-border bg-card p-5 transition hover:-translate-y-1 hover:border-primary/70">
                <img src={profile.image} alt={profile.name} className="h-52 w-full rounded-xl object-cover" />
                <div className="mt-4 space-y-2 text-sm">
                  <h3 className="text-xl font-semibold">{profile.name}, {profile.age}</h3>
                  <p className="flex items-center gap-1 text-muted-foreground"><MapPin className="h-4 w-4" />{profile.city}</p>
                  <p className="text-muted-foreground">{profile.languages}</p>
                  <p className="inline-block rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">{profile.vibe}</p>
                  <p className="text-muted-foreground">“{profile.quote}”</p>
                  <p className="font-semibold text-primary">{profile.rate}</p>
                  <a href="#booking" className="inline-block pt-2 font-semibold text-primary hover:text-primary/80">Request</a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-20 sm:px-10">
        <h2 className="text-3xl font-semibold sm:text-4xl">Simple Pricing</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {pricing.map((item) => (
            <article key={item.title} className="rounded-2xl border border-border bg-card p-6">
              <h3 className="text-xl font-semibold">{item.title}</h3>
              <p className="mt-2 text-primary">{item.duration}</p>
              <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
            </article>
          ))}
        </div>
        <p className="mt-6 text-sm text-muted-foreground">
          Prices are set by locals. The platform charges a service fee.
        </p>
      </section>

      <section id="booking" className="border-y border-border/80 bg-card/40 px-6 py-20 sm:px-10">
        <div className="mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-semibold sm:text-4xl">Request a booking</h2>
            <p className="mt-4 text-muted-foreground">
              Tell us where, when, and what kind of local experience you want. We will match you with verified companions.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-border bg-card p-6">
            <input required placeholder="Full name" className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm" />
            <input required type="email" placeholder="Email" className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm" />
            <select required className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm">
              <option value="">Select city</option>
              {cityCards.map((city) => <option key={city.name}>{city.name}</option>)}
            </select>
            <select required className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm">
              <option value="">Companion type</option>
              {companionTypes.map((type) => <option key={type.title}>{type.title}</option>)}
            </select>
            <textarea placeholder="Tell us your ideal plan" rows={4} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm" />
            <button type="submit" className="w-full rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90">
              Send booking request
            </button>
          </form>
        </div>
      </section>

      <section id="become-local" className="mx-auto w-full max-w-6xl px-6 py-20 sm:px-10">
        <h2 className="text-3xl font-semibold sm:text-4xl">Earn money showing your city</h2>
        <p className="mt-4 max-w-3xl text-muted-foreground">
          If you know your city well and enjoy meeting people from around the world, you can apply to become a BEYON26 local companion.
        </p>
        <form onSubmit={handleSubmit} className="mt-8 grid gap-4 rounded-2xl border border-border bg-card p-6 sm:grid-cols-2">
          <input required placeholder="Name" className="rounded-xl border border-border bg-background px-4 py-3 text-sm" />
          <input required placeholder="City" className="rounded-xl border border-border bg-background px-4 py-3 text-sm" />
          <input required placeholder="Languages" className="rounded-xl border border-border bg-background px-4 py-3 text-sm" />
          <input required placeholder="Availability" className="rounded-xl border border-border bg-background px-4 py-3 text-sm" />
          <textarea required placeholder="Bio" rows={4} className="rounded-xl border border-border bg-background px-4 py-3 text-sm sm:col-span-2" />
          <input type="url" placeholder="Photo URL" className="rounded-xl border border-border bg-background px-4 py-3 text-sm sm:col-span-2" />
          <input type="url" placeholder="Short intro video URL" className="rounded-xl border border-border bg-background px-4 py-3 text-sm sm:col-span-2" />
          <button type="submit" className="sm:col-span-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90">
            Apply Now
          </button>
        </form>
      </section>

      <section id="trust" className="border-y border-border/80 bg-card/40 px-6 py-20 sm:px-10">
        <div className="mx-auto w-full max-w-6xl">
          <h2 className="text-3xl font-semibold sm:text-4xl">Built for trust</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              'All locals are verified',
              'Profiles include photos and bios',
              'Secure booking through the platform',
              'Support available for travelers',
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-2xl border border-border bg-card p-5 text-sm text-muted-foreground">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-16 text-center sm:px-10">
        <p className="text-sm uppercase tracking-[0.2em] text-primary">Métrica clave</p>
        <p className="mx-auto mt-4 max-w-3xl text-muted-foreground">
          La página solo sirve si logra 10 solicitudes reales de reserva en 30 días. Si no ocurre, el problema no es la web, es la propuesta de valor.
        </p>
        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Sparkles className="h-4 w-4 text-primary" /> Startup speed, trust-first design, conversion focus.
        </div>
      </section>
    </div>
  );
}
