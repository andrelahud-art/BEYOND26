'use client';

import Image from 'next/image';
import { FormEvent, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  Compass,
  CreditCard,
  Globe2,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
} from 'lucide-react';

type City = 'All Cities' | 'Mexico City' | 'Guadalajara' | 'Monterrey';
type Vibe = 'All Vibes' | 'Explorer' | 'Social' | 'Practical';
type Package = 'City Walk' | 'Half Day Local' | 'Night Social';

const reveal = {
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.45, ease: 'easeOut' },
};

const cityCards = [
  {
    name: 'Mexico City',
    description: 'The cultural heart of Mexico. Food, nightlife and history.',
    stats: '1,200+ requests',
    image:
      'https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?auto=format&fit=crop&w=1400&q=80',
  },
  {
    name: 'Guadalajara',
    description: 'Tradition, tequila, and a vibrant young scene.',
    stats: '780+ requests',
    image:
      'https://images.unsplash.com/photo-1623808643506-3f9557788ea2?auto=format&fit=crop&w=1400&q=80',
  },
  {
    name: 'Monterrey',
    description: 'Modern Mexico with mountains, nightlife and tech culture.',
    stats: '640+ requests',
    image:
      'https://images.unsplash.com/photo-1612810809247-58de661f4dbf?auto=format&fit=crop&w=1400&q=80',
  },
] as const;

const profiles = [
  {
    name: 'Sofia',
    age: 24,
    city: 'Mexico City',
    languages: ['Spanish', 'English'],
    vibe: 'Explorer',
    rate: '$28/hr',
    quote: 'Street food + hidden cafes in Roma and Condesa.',
    image:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Diego',
    age: 29,
    city: 'Mexico City',
    languages: ['Spanish', 'English', 'French'],
    vibe: 'Social',
    rate: '$32/hr',
    quote: 'Rooftops, nightlife and social hotspots.',
    image:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Camila',
    age: 27,
    city: 'Guadalajara',
    languages: ['Spanish', 'English'],
    vibe: 'Practical',
    rate: '$25/hr',
    quote: 'Safe routing, local transport and smooth logistics.',
    image:
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Mateo',
    age: 31,
    city: 'Guadalajara',
    languages: ['Spanish', 'English', 'Portuguese'],
    vibe: 'Explorer',
    rate: '$30/hr',
    quote: 'Markets, architecture and authentic daytime plans.',
    image:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Valeria',
    age: 26,
    city: 'Monterrey',
    languages: ['Spanish', 'English'],
    vibe: 'Social',
    rate: '$29/hr',
    quote: 'Night plans with trusted venues and secure transport.',
    image:
      'https://images.unsplash.com/photo-1542206395-9feb3edaa68d?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Andrés',
    age: 33,
    city: 'Monterrey',
    languages: ['Spanish', 'English', 'German'],
    vibe: 'Practical',
    rate: '$34/hr',
    quote: 'Perfect for business travelers and fast city navigation.',
    image:
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=900&q=80',
  },
] as const;

export default function Home() {
  const [cityFilter, setCityFilter] = useState<City>('All Cities');
  const [vibeFilter, setVibeFilter] = useState<Vibe>('All Vibes');
  const [selectedPackage, setSelectedPackage] = useState<Package>('City Walk');

  const filteredProfiles = useMemo(
    () =>
      profiles.filter((p) => {
        const matchCity = cityFilter === 'All Cities' || p.city === cityFilter;
        const matchVibe = vibeFilter === 'All Vibes' || p.vibe === vibeFilter;
        return matchCity && matchVibe;
      }),
    [cityFilter, vibeFilter]
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => event.preventDefault();

  return (
    <div className="bg-background text-foreground">
      <section id="hero" className="relative overflow-hidden border-b border-border bg-[#05070f] px-6 pb-24 pt-24 text-white sm:px-10 md:pt-32">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1585464231875-d9ef1f5ad396?auto=format&fit=crop&w=1800&q=80"
            alt="Mexico City nightlife"
            fill
            unoptimized
            className="object-cover opacity-35"
            priority
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_20%,rgba(29,78,216,0.38),transparent_42%),radial-gradient(circle_at_85%_5%,rgba(37,99,235,0.25),transparent_28%)]" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/55 to-[#05070f]" />
        </div>

        <div className="relative mx-auto grid w-full max-w-7xl gap-12 lg:grid-cols-[1.05fr,0.95fr] lg:items-center">
          <motion.div {...reveal}>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-blue-200 backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" /> launching before world cup 2026
            </span>
            <h1 className="mt-6 text-5xl font-semibold leading-[1.05] sm:text-6xl md:text-7xl">Explore Mexico with a Local</h1>
            <p className="mt-5 max-w-xl text-lg text-blue-50/85">
              Skip tourist traps. Book verified local companions matched to your personality and travel style.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href="#booking-layer" className="rounded-full bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground shadow-[0_0_32px_rgba(37,99,235,0.45)] transition hover:-translate-y-0.5 hover:bg-blue-500 active:scale-[0.98]">
                Find a Local Companion
              </a>
              <a href="#local-application" className="rounded-full border border-white/30 bg-white/10 px-7 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20">
                Become a Local
              </a>
            </div>
            <p className="mt-4 text-sm text-blue-100/85">Verified profiles • Secure payments • Human support 24/7</p>
          </motion.div>

          <motion.div {...reveal} className="relative">
            <div className="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur-xl">
              <div className="grid gap-3">
                {profiles.slice(0, 3).map((profile, i) => (
                  <motion.div
                    key={profile.name}
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut' }}
                    className="flex items-center gap-3 rounded-2xl border border-white/15 bg-black/30 p-3"
                  >
                    <Image src={profile.image} alt={profile.name} width={56} height={56} unoptimized className="h-14 w-14 rounded-xl object-cover" />
                    <div className="text-sm">
                      <p className="font-semibold">{profile.name}, {profile.age} • {profile.city}</p>
                      <p className="text-blue-100/75">{profile.vibe} • {profile.rate}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <motion.section {...reveal} id="how-it-works" className="relative mx-auto w-full max-w-7xl px-6 py-20 sm:px-10">
        <h2 className="text-3xl font-semibold sm:text-4xl">How BEYON26 Works</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3 md:gap-8">
          {[
            ['01', 'Choose a local', 'Browse verified profiles and select vibe, city, and language fit.'],
            ['02', 'Request booking', 'Send your date, plan, and expectations in one booking flow.'],
            ['03', 'Explore together', 'Meet your local and discover places beyond tourist routes.'],
          ].map(([n, t, d], i) => (
            <div key={t} className="relative rounded-3xl border border-border/70 bg-gradient-to-b from-white to-slate-50 p-6 shadow-sm">
              {i < 2 && <div className="absolute -right-4 top-12 hidden h-[2px] w-8 bg-gradient-to-r from-blue-500/50 to-transparent md:block" />}
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-lg font-semibold text-white shadow-lg shadow-blue-500/30">{n}</div>
              <h3 className="mt-4 text-xl font-semibold">{t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </motion.section>

      <section id="cities" className="border-y border-border bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-6 py-20 text-white sm:px-10">
        <motion.div {...reveal} className="mx-auto w-full max-w-7xl">
          <h2 className="text-3xl font-semibold sm:text-4xl">Available Cities</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {cityCards.map((city) => (
              <article key={city.name} className="group relative overflow-hidden rounded-3xl border border-white/15">
                <Image src={city.image} alt={city.name} width={1200} height={900} unoptimized className="h-72 w-full object-cover transition duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-0 p-5">
                  <p className="text-xs uppercase tracking-[0.18em] text-blue-300">{city.stats}</p>
                  <h3 className="mt-1 text-2xl font-semibold">{city.name}</h3>
                  <p className="mt-2 text-sm text-white/80">{city.description}</p>
                  <button onClick={() => setCityFilter(city.name as City)} className="mt-3 text-sm font-semibold text-blue-300 transition group-hover:text-blue-200">
                    Explore locals →
                  </button>
                </div>
              </article>
            ))}
          </div>
        </motion.div>
      </section>

      <section id="locals" className="mx-auto w-full max-w-7xl px-6 py-20 sm:px-10">
        <motion.div {...reveal}>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-semibold sm:text-4xl">Meet Some of Our Locals</h2>
              <p className="mt-2 text-muted-foreground">Curated profiles with personality, language and city fit.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {(['All Cities', 'Mexico City', 'Guadalajara', 'Monterrey'] as City[]).map((city) => (
                <button key={city} onClick={() => setCityFilter(city)} className={`rounded-full px-4 py-2 text-xs font-semibold ${cityFilter === city ? 'bg-primary text-white' : 'border border-border bg-card text-muted-foreground'}`}>
                  {city}
                </button>
              ))}
              {(['All Vibes', 'Explorer', 'Social', 'Practical'] as Vibe[]).map((v) => (
                <button key={v} onClick={() => setVibeFilter(v)} className={`rounded-full px-4 py-2 text-xs font-semibold ${vibeFilter === v ? 'bg-slate-900 text-white' : 'border border-border bg-card text-muted-foreground'}`}>
                  {v}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProfiles.map((profile) => (
              <article key={profile.name} className="group rounded-3xl border border-border/70 bg-gradient-to-b from-white to-slate-50 p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/10">
                <div className="relative overflow-hidden rounded-2xl">
                  <Image src={profile.image} alt={profile.name} width={900} height={700} unoptimized className="h-56 w-full object-cover transition duration-500 group-hover:scale-105" />
                  <span className="absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-xs text-white backdrop-blur">{profile.city}</span>
                </div>
                <div className="mt-4">
                  <h3 className="text-xl font-semibold">{profile.name}, {profile.age}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">“{profile.quote}”</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-800">{profile.vibe}</span>
                    {profile.languages.map((lang) => <span key={lang} className="rounded-full border border-border px-2.5 py-1 text-xs">{lang}</span>)}
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <p className="font-semibold text-primary">{profile.rate}</p>
                    <a href="#booking-layer" className="text-sm font-semibold text-primary">Request</a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </motion.div>
      </section>

      <section id="booking-layer" className="border-y border-border bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.12),transparent_35%),linear-gradient(180deg,#0b1020,#0f172a)] px-6 py-20 text-white sm:px-10">
        <motion.div {...reveal} className="mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[1.1fr,0.9fr]">
          <div className="rounded-3xl border border-white/15 bg-white/10 p-7 backdrop-blur-xl">
            <h2 className="text-3xl font-semibold sm:text-4xl">Book Your Local Companion</h2>
            <p className="mt-3 text-blue-100/80">Your conversion engine: select package, city, date, and companion type in one flow.</p>

            <div className="mt-6 flex flex-wrap gap-2">
              {(['City Walk', 'Half Day Local', 'Night Social'] as Package[]).map((pkg) => (
                <button
                  key={pkg}
                  onClick={() => setSelectedPackage(pkg)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold transition ${selectedPackage === pkg ? 'bg-primary text-white shadow-lg shadow-blue-500/40' : 'border border-white/30 bg-white/10 text-white/80'}`}
                >
                  {pkg}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="mt-5 grid gap-4 sm:grid-cols-2">
              <select required className="rounded-xl border border-white/20 bg-black/30 px-4 py-3 text-sm text-white">
                <option value="">Select city</option>
                {cityCards.map((city) => <option key={city.name}>{city.name}</option>)}
              </select>
              <input required type="date" className="rounded-xl border border-white/20 bg-black/30 px-4 py-3 text-sm text-white" />
              <select required className="rounded-xl border border-white/20 bg-black/30 px-4 py-3 text-sm text-white">
                <option value="">Companion type</option>
                <option>Explorer</option><option>Social</option><option>Practical</option>
              </select>
              <input placeholder="Budget range (USD)" className="rounded-xl border border-white/20 bg-black/30 px-4 py-3 text-sm text-white" />
              <textarea required rows={4} placeholder="Describe your ideal experience" className="rounded-xl border border-white/20 bg-black/30 px-4 py-3 text-sm text-white sm:col-span-2" />
              <button type="submit" className="sm:col-span-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-[0_0_26px_rgba(59,130,246,0.5)] transition hover:bg-blue-500 active:scale-[0.99]">
                Request Booking
              </button>
            </form>
          </div>

          <div className="rounded-3xl border border-white/15 bg-white/10 p-7 backdrop-blur-xl">
            <h3 className="text-2xl font-semibold">Built for trust + conversion</h3>
            <div className="mt-5 space-y-3 text-sm">
              {[
                [ShieldCheck, 'All locals are ID-verified and interviewed.'],
                [CreditCard, 'Secure payments with transparent service fee.'],
                [MessageCircle, 'Live support before and during your experience.'],
                [Globe2, 'Bilingual matching to avoid communication gaps.'],
              ].map(([Icon, label]) => {
                const C = Icon as typeof ShieldCheck;
                return (
                  <div key={label as string} className="flex items-center gap-3 rounded-xl border border-white/15 bg-black/25 p-3">
                    <C className="h-5 w-5 text-blue-300" />
                    <span className="text-blue-50/90">{label as string}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </section>

      <section id="local-application" className="mx-auto w-full max-w-7xl px-6 py-20 sm:px-10">
        <motion.div {...reveal} className="rounded-3xl border border-border/70 bg-gradient-to-b from-white to-slate-50 p-8 shadow-sm">
          <h2 className="text-3xl font-semibold sm:text-4xl">Earn money showing your city</h2>
          <p className="mt-3 max-w-3xl text-muted-foreground">If you know your city and enjoy meeting people from around the world, apply to become a BEYON26 local companion.</p>
          <form onSubmit={handleSubmit} className="mt-6 grid gap-4 sm:grid-cols-2">
            <input required placeholder="Name" className="rounded-xl border border-border bg-background px-4 py-3 text-sm" />
            <input required placeholder="City" className="rounded-xl border border-border bg-background px-4 py-3 text-sm" />
            <input required placeholder="Languages" className="rounded-xl border border-border bg-background px-4 py-3 text-sm" />
            <input required placeholder="Availability" className="rounded-xl border border-border bg-background px-4 py-3 text-sm" />
            <textarea required rows={4} placeholder="Bio" className="rounded-xl border border-border bg-background px-4 py-3 text-sm sm:col-span-2" />
            <input type="url" placeholder="Photo URL" className="rounded-xl border border-border bg-background px-4 py-3 text-sm sm:col-span-2" />
            <input type="url" placeholder="Short intro video URL" className="rounded-xl border border-border bg-background px-4 py-3 text-sm sm:col-span-2" />
            <button type="submit" className="sm:col-span-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-500">Apply Now</button>
          </form>
        </motion.div>
      </section>

      <section id="trust" className="border-y border-border bg-slate-950 px-6 py-20 text-white sm:px-10">
        <motion.div {...reveal} className="mx-auto w-full max-w-7xl">
          <h2 className="text-3xl font-semibold sm:text-4xl">Built for trust</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              ['Verified locals', BadgeCheck],
              ['Secure booking & payment', CreditCard],
              ['Support available for travelers', Users],
              ['Clear expectations before booking', CheckCircle2],
            ].map(([label, Icon]) => {
              const C = Icon as typeof BadgeCheck;
              return (
                <div key={label as string} className="rounded-2xl border border-white/15 bg-white/5 p-5 backdrop-blur text-sm">
                  <C className="mb-2 h-5 w-5 text-blue-300" />
                  {label as string}
                </div>
              );
            })}
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              ['Emma (USA)', '“Best decision in CDMX. Felt safe and discovered amazing places.”', 5],
              ['Lucas (Brazil)', '“Fast booking, clear process and incredible local vibe.”', 5],
              ['Nora (Germany)', '“Professional, friendly, and way better than classic tours.”', 5],
            ].map(([name, text, stars]) => (
              <div key={name as string} className="rounded-2xl border border-white/15 bg-white/5 p-5 backdrop-blur">
                <div className="mb-3 flex gap-1">{Array.from({ length: stars as number }).map((_, i) => <Star key={i} className="h-4 w-4 fill-blue-400 text-blue-400" />)}</div>
                <p className="text-sm text-white/85">{text as string}</p>
                <p className="mt-4 text-xs text-blue-200">{name as string}</p>
              </div>
            ))}
          </div>
        </motion.div>
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
