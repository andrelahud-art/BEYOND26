'use client';

import { FormEvent, useMemo, useState } from 'react';
import {
  ArrowRight,
  BadgeCheck,
  CalendarClock,
  Compass,
  Handshake,
  Languages,
  MapPin,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
} from 'lucide-react';

type City = 'All Cities' | 'Mexico City' | 'Guadalajara' | 'Monterrey';
type Vibe = 'All Vibes' | 'Explorer' | 'Social' | 'Practical';

const cities = [
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
] as const;

const companionTypes = [
  { title: 'Explorer', description: 'Walk neighborhoods, food spots and hidden places.', icon: Compass },
  { title: 'Social', description: 'Nightlife, bars, meeting people and fun experiences.', icon: Users },
  { title: 'Practical', description: 'Help navigating the city, translating and getting around.', icon: Handshake },
] as const;

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
] as const;

export default function Home() {
  const [cityFilter, setCityFilter] = useState<City>('All Cities');
  const [vibeFilter, setVibeFilter] = useState<Vibe>('All Vibes');

  const filteredProfiles = useMemo(() => {
    return profiles.filter((profile) => {
      const byCity = cityFilter === 'All Cities' || profile.city === cityFilter;
      const byVibe = vibeFilter === 'All Vibes' || profile.vibe === vibeFilter;
      return byCity && byVibe;
    });
  }, [cityFilter, vibeFilter]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <div className="bg-background text-foreground">
      <section id="hero" className="relative overflow-hidden border-b border-border px-6 pb-24 pt-24 sm:px-10 md:pb-28 md:pt-32">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_10%_10%,rgba(37,99,235,0.2),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(14,116,255,0.16),transparent_30%)]" />
        <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[1.05fr,0.95fr] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              <Sparkles className="h-3.5 w-3.5" /> Launching before World Cup 2026
            </span>
            <h1 className="mt-6 text-4xl font-semibold leading-tight sm:text-5xl md:text-6xl">Explore Mexico with a Local</h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">
              Skip the tourist traps. Meet verified locals who match your vibe and discover the city differently.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href="#booking-layer" className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:-translate-y-0.5 hover:bg-primary/90">
                Find a Local Companion
              </a>
              <a href="#local-layer" className="rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold transition hover:border-primary hover:text-primary">
                Become a Local
              </a>
            </div>
            <div className="mt-8 grid max-w-xl grid-cols-3 gap-3 text-center text-xs sm:text-sm">
              {['Verified locals', 'Secure booking', 'Bilingual support'].map((item) => (
                <div key={item} className="rounded-xl border border-border bg-card px-3 py-3 text-muted-foreground">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card p-2 shadow-2xl shadow-primary/10">
            <img
              src="https://images.unsplash.com/photo-1585464231875-d9ef1f5ad396?auto=format&fit=crop&w=1400&q=80"
              alt="Mexico City nightlife and culture"
              className="h-[470px] w-full rounded-[1.25rem] object-cover"
            />
          </div>
        </div>
      </section>

      <section id="how-it-works" className="mx-auto w-full max-w-7xl px-6 py-20 sm:px-10">
        <h2 className="text-3xl font-semibold sm:text-4xl">How BEYON26 Works</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            ['Step 1', 'Choose a local', 'Browse profiles of locals who know the city and match your style.'],
            ['Step 2', 'Request a booking', 'Pick the experience and time that works for you.'],
            ['Step 3', 'Explore together', 'Meet your local companion and discover the city beyond tourist spots.'],
          ].map(([step, title, text]) => (
            <article key={title} className="rounded-2xl border border-border bg-card p-6 transition hover:-translate-y-1 hover:border-primary/60">
              <p className="text-xs uppercase tracking-[0.18em] text-primary">{step}</p>
              <h3 className="mt-2 text-xl font-semibold">{title}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="cities" className="border-y border-border bg-card/30 px-6 py-20 sm:px-10">
        <div className="mx-auto w-full max-w-7xl">
          <h2 className="text-3xl font-semibold sm:text-4xl">Available Cities</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {cities.map((city) => (
              <article key={city.name} className="overflow-hidden rounded-2xl border border-border bg-card transition hover:-translate-y-1 hover:border-primary/70">
                <img src={city.image} alt={city.name} className="h-52 w-full object-cover" />
                <div className="space-y-3 p-5">
                  <h3 className="text-xl font-semibold">{city.name}</h3>
                  <p className="text-sm text-muted-foreground">{city.description}</p>
                  <button type="button" onClick={() => setCityFilter(city.name as City)} className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80">
                    Explore locals <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 py-20 sm:px-10">
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

      <section id="locals" className="border-y border-border px-6 py-20 sm:px-10">
        <div className="mx-auto w-full max-w-7xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-3xl font-semibold sm:text-4xl">Meet Some of Our Locals</h2>
            <div className="flex flex-wrap gap-2">
              {(['All Cities', 'Mexico City', 'Guadalajara', 'Monterrey'] as City[]).map((city) => (
                <button
                  key={city}
                  type="button"
                  onClick={() => setCityFilter(city)}
                  className={`rounded-full px-4 py-2 text-xs font-medium transition ${
                    cityFilter === city ? 'bg-primary text-primary-foreground' : 'border border-border bg-card text-muted-foreground hover:border-primary hover:text-primary'
                  }`}
                >
                  {city}
                </button>
              ))}
              {(['All Vibes', 'Explorer', 'Social', 'Practical'] as Vibe[]).map((vibe) => (
                <button
                  key={vibe}
                  type="button"
                  onClick={() => setVibeFilter(vibe)}
                  className={`rounded-full px-4 py-2 text-xs font-medium transition ${
                    vibeFilter === vibe ? 'bg-foreground text-background' : 'border border-border bg-card text-muted-foreground hover:border-foreground hover:text-foreground'
                  }`}
                >
                  {vibe}
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
                  <p className="flex items-center gap-1 text-muted-foreground"><Languages className="h-4 w-4" />{profile.languages}</p>
                  <p className="inline-block rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">{profile.vibe}</p>
                  <p className="text-muted-foreground">“{profile.quote}”</p>
                  <div className="flex items-center justify-between pt-1">
                    <p className="font-semibold text-primary">{profile.rate}</p>
                    <a href="#booking-layer" className="font-semibold text-primary hover:text-primary/80">Request</a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="booking-layer" className="mx-auto grid w-full max-w-7xl gap-8 px-6 py-20 sm:px-10 lg:grid-cols-[1.02fr,0.98fr]">
        <div className="rounded-3xl border border-border bg-card p-7">
          <h2 className="text-3xl font-semibold sm:text-4xl">Capa Cliente: Request a Booking</h2>
          <p className="mt-3 text-muted-foreground">Comparte tu plan y te conectamos con el local ideal según ciudad, estilo y disponibilidad.</p>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <input required placeholder="Full name" className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm" />
            <input required type="email" placeholder="Email" className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm" />
            <div className="grid gap-4 sm:grid-cols-2">
              <select required className="rounded-xl border border-border bg-background px-4 py-3 text-sm">
                <option value="">Select city</option>
                {cities.map((city) => <option key={city.name}>{city.name}</option>)}
              </select>
              <select required className="rounded-xl border border-border bg-background px-4 py-3 text-sm">
                <option value="">Companion type</option>
                {companionTypes.map((type) => <option key={type.title}>{type.title}</option>)}
              </select>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <input type="date" required className="rounded-xl border border-border bg-background px-4 py-3 text-sm" />
              <input placeholder="Budget range (USD)" className="rounded-xl border border-border bg-background px-4 py-3 text-sm" />
            </div>
            <textarea required placeholder="Tell us your ideal plan" rows={4} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm" />
            <button type="submit" className="w-full rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90">
              Send booking request
            </button>
          </form>
        </div>

        <div className="rounded-3xl border border-border bg-card p-7">
          <h3 className="text-2xl font-semibold">Panel del Viajero</h3>
          <p className="mt-2 text-sm text-muted-foreground">Una vista de control para seguir cada reserva con transparencia.</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              ['2', 'Pending matches'],
              ['1', 'Confirmed booking'],
              ['4.9', 'Avg local rating'],
            ].map(([value, label]) => (
              <div key={label} className="rounded-xl border border-border bg-background p-4 text-center">
                <p className="text-2xl font-semibold text-primary">{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 space-y-3 text-sm">
            {[
              ['Match AI + curator review', 'We propose best-fit locals in under 24h.'],
              ['Secure payment', 'Pay in-platform with fee breakdown and invoice.'],
              ['Real-time support', 'Travel assistance before, during, and after booking.'],
            ].map(([title, desc]) => (
              <div key={title} className="rounded-xl border border-border bg-background p-4">
                <p className="font-semibold">{title}</p>
                <p className="text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="local-layer" className="border-y border-border bg-card/30 px-6 py-20 sm:px-10">
        <div className="mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[1.02fr,0.98fr]">
          <div className="rounded-3xl border border-border bg-card p-7">
            <h2 className="text-3xl font-semibold sm:text-4xl">Capa Local: Apply as Companion</h2>
            <p className="mt-3 text-muted-foreground">Si conoces tu ciudad, tienes carisma y responsabilidad, aplica y empieza a monetizar tus experiencias.</p>
            <form onSubmit={handleSubmit} className="mt-6 grid gap-4 sm:grid-cols-2">
              <input required placeholder="Name" className="rounded-xl border border-border bg-background px-4 py-3 text-sm" />
              <input required placeholder="City" className="rounded-xl border border-border bg-background px-4 py-3 text-sm" />
              <input required placeholder="Languages" className="rounded-xl border border-border bg-background px-4 py-3 text-sm" />
              <input required placeholder="Availability" className="rounded-xl border border-border bg-background px-4 py-3 text-sm" />
              <input placeholder="Hourly rate (USD)" className="rounded-xl border border-border bg-background px-4 py-3 text-sm" />
              <input type="url" placeholder="Photo URL" className="rounded-xl border border-border bg-background px-4 py-3 text-sm" />
              <textarea required placeholder="Bio" rows={4} className="rounded-xl border border-border bg-background px-4 py-3 text-sm sm:col-span-2" />
              <input type="url" placeholder="Short intro video URL" className="rounded-xl border border-border bg-background px-4 py-3 text-sm sm:col-span-2" />
              <button type="submit" className="sm:col-span-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90">
                Apply Now
              </button>
            </form>
          </div>

          <div className="rounded-3xl border border-border bg-card p-7">
            <h3 className="text-2xl font-semibold">Panel del Local</h3>
            <p className="mt-2 text-sm text-muted-foreground">Administra solicitudes, horarios y ganancias desde un solo lugar.</p>
            <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
              {[
                ['12', 'Requests this month'],
                ['$840', 'Projected earnings'],
                ['4.8', 'Traveler rating'],
                ['94%', 'Acceptance score'],
              ].map(([value, label]) => (
                <div key={label} className="rounded-xl border border-border bg-background p-4">
                  <p className="text-xl font-semibold text-primary">{value}</p>
                  <p className="text-muted-foreground">{label}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 space-y-3 text-sm">
              <div className="rounded-xl border border-border bg-background p-4">
                <p className="flex items-center gap-2 font-semibold"><CalendarClock className="h-4 w-4 text-primary" /> Availability sync</p>
                <p className="text-muted-foreground">Bloquea días, horas y tipo de experiencias que sí quieres aceptar.</p>
              </div>
              <div className="rounded-xl border border-border bg-background p-4">
                <p className="flex items-center gap-2 font-semibold"><MessageSquareText className="h-4 w-4 text-primary" /> Smart briefing</p>
                <p className="text-muted-foreground">Recibe brief del viajero con intereses, idioma y objetivos del recorrido.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="mx-auto w-full max-w-7xl px-6 py-20 sm:px-10">
        <h2 className="text-3xl font-semibold sm:text-4xl">Simple Pricing</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            ['City Walk', '2 hours', 'Perfect for first-time visitors.'],
            ['Half Day Local', '4 hours', 'Explore neighborhoods and culture.'],
            ['Night Social', '4 hours', 'Bars, nightlife and social spots.'],
          ].map(([title, duration, desc]) => (
            <article key={title} className="rounded-2xl border border-border bg-card p-6">
              <h3 className="text-xl font-semibold">{title}</h3>
              <p className="mt-2 text-primary">{duration}</p>
              <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
            </article>
          ))}
        </div>
        <p className="mt-6 text-sm text-muted-foreground">Prices are set by locals. The platform charges a service fee.</p>
      </section>

      <section id="trust" className="border-y border-border bg-card/30 px-6 py-20 sm:px-10">
        <div className="mx-auto w-full max-w-7xl">
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
          <div className="mt-6 grid gap-4 sm:grid-cols-3 text-sm">
            {[
              { label: 'ID + interview checks', Icon: BadgeCheck },
              { label: 'Traveler reviews on every experience', Icon: Star },
              { label: 'Emergency protocol + escalation path', Icon: Users },
            ].map(({ label, Icon }) => (
              <div key={label} className="rounded-xl border border-border bg-card p-4 text-muted-foreground">
                <Icon className="mb-2 h-5 w-5 text-primary" />
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 py-16 text-center sm:px-10">
        <p className="text-sm uppercase tracking-[0.2em] text-primary">Métrica clave</p>
        <p className="mx-auto mt-4 max-w-3xl text-muted-foreground">
          La página solo sirve si logra 10 solicitudes reales de reserva en 30 días. Si no ocurre → el problema no es la web, es la propuesta de valor.
        </p>
      </section>
    </div>
  );
}
