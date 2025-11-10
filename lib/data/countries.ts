import { CountryContent } from '../types';

export const COUNTRIES: CountryContent[] = [
  {
    code: 'us',
    name: 'United States / Canada',
    flag: '🇺🇸',
    language: 'en',
    hero: {
      title: 'More than 2026. Beyond Experience.',
      subtitle:
        'Shadow Concierge 24/7 for high-end travelers. Invisible when needed, invaluable when it counts.',
    },
    content:
      'Luxury Shadow Concierge for Mexico 2026. Discreet, bilingual, insured. Direct-to-client service with human precision and AI-powered logistics. Experience Mexico like never before with your personal Shadow handling every detail.',
    currency: 'USD',
    seo: {
      title: 'Beyond26 — Luxury Shadow Concierge for 2026 Travelers',
      description:
        'Discreet, bilingual, insured. Book your personal Shadow for Mexico 2026 — Matchday, Weekend, or Elite Family packages. Premium concierge service.',
    },
  },
  {
    code: 'mx',
    name: 'México',
    flag: '🇲🇽',
    language: 'es',
    hero: {
      title: 'Más allá de 2026. Más allá de la experiencia.',
      subtitle:
        'Concierge Shadow 24/7 para viajeros de alto nivel. Invisible cuando se necesita, invaluable cuando cuenta.',
    },
    content:
      'Concierge de lujo para visitantes 2026. Asistencia humana 24/7, bilingüe, con protocolos de seguridad y logística integral. Reservas inmediatas y atención discreta. Experimenta tu país desde una perspectiva única con tu Shadow personal manejando cada detalle.',
    currency: 'MXN',
    seo: {
      title: 'Beyond26 — Concierge de Lujo para Viajeros 2026 en México',
      description:
        'Servicio discreto, bilingüe y asegurado. Reserva tu Shadow personal para México 2026 — paquetes Matchday, Weekend o Elite Family. Concierge premium.',
    },
  },
  {
    code: 'fr',
    name: 'France',
    flag: '🇫🇷',
    language: 'fr',
    hero: {
      title: 'Au-delà de 2026. Au-delà de l\'expérience.',
      subtitle:
        'Concierge Shadow 24/7 pour voyageurs haut de gamme. Invisible quand nécessaire, précieux quand ça compte.',
    },
    content:
      'Concierge privé pour voyageurs 2026 au Mexique. Discrétion, hospitalité haut de gamme, chauffeur privé, réservations prioritaires, assistance 24/7. Découvrez le Mexique avec un niveau de service exceptionnel grâce à votre Shadow personnel.',
    currency: 'EUR',
    seo: {
      title: 'Beyond26 — Concierge de Luxe pour Voyageurs 2026 au Mexique',
      description:
        'Service discret, bilingue et assuré. Réservez votre Shadow personnel pour le Mexique 2026 — forfaits Matchday, Weekend ou Elite Family. Concierge premium.',
    },
  },
  {
    code: 'de',
    name: 'Deutschland',
    flag: '🇩🇪',
    language: 'de',
    hero: {
      title: 'Mehr als 2026. Jenseits der Erfahrung.',
      subtitle:
        'Shadow Concierge 24/7 für anspruchsvolle Reisende. Unsichtbar, wenn nötig, unbezahlbar, wenn es darauf ankommt.',
    },
    content:
      'Luxus-Concierge für 2026-Reisende in Mexiko. Diskret, zweisprachig, versichert. Präzise Logistik, priorisierte Reservierungen, 24/7-Betreuung. Erleben Sie Mexiko mit Ihrem persönlichen Shadow, der sich um jedes Detail kümmert.',
    currency: 'EUR',
    seo: {
      title: 'Beyond26 — Luxus-Concierge für 2026-Reisende in Mexiko',
      description:
        'Diskreter, zweisprachiger und versicherter Service. Buchen Sie Ihren persönlichen Shadow für Mexiko 2026 — Matchday-, Weekend- oder Elite-Family-Pakete.',
    },
  },
];

export function getCountryByCode(code: string): CountryContent | undefined {
  return COUNTRIES.find((country) => country.code === code);
}
