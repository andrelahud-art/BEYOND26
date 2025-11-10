# Beyond26 — Luxury Shadow Concierge for 2026 Travelers

A production-ready Next.js 14 website for Beyond26, a premium concierge service for high-end travelers attending the North American 2026 football event.

## 🚀 Features

- **Modern Tech Stack**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Multi-Language Support**: EN base with country-specific content (ES, FR, DE)
- **Three Shadow Archetypes**: Conversationalist, Balanced, Silent Shadow
- **Dynamic Pricing**: USD base with MXN/EUR conversion
- **Form Validation**: React Hook Form + Zod
- **Analytics**: GA4 integration with event tracking
- **SEO Optimized**: Meta tags, OpenGraph, Schema.org JSON-LD, hreflang
- **Accessibility**: WCAG 2.1 AA compliant
- **Performance**: Optimized for Lighthouse scores (90+ target)
- **Security**: CSP headers, HTTPS only, no inline scripts

## 📋 Prerequisites

- Node.js 18+ and npm
- Git

## 🛠️ Local Development Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd BEYOND26
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your credentials:

```env
# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Integrations
NEXT_PUBLIC_CALENDLY_URL=https://calendly.com/beyond26/booking
NEXT_PUBLIC_WHATSAPP=15551234567
NEXT_PUBLIC_GOOGLE_MAPS_KEY=YOUR_GOOGLE_MAPS_API_KEY

# Stripe
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Build for Production

```bash
npm run build
npm start
```

## 📝 Project Structure

```
BEYOND26/
├── app/                          # Next.js App Router
│   ├── (routes)/
│   │   ├── page.tsx             # Home page
│   │   ├── services/            # Services page
│   │   ├── experience/          # Experience page
│   │   ├── about/               # About page
│   │   ├── contact/             # Contact page with form
│   │   ├── choose-your-shadow/  # Shadow selector
│   │   ├── countries/[country]/ # Dynamic country routes
│   │   └── thank-you/           # Thank you page
│   ├── legal/                   # Legal pages
│   │   ├── privacy/
│   │   ├── terms/
│   │   └── cookies/
│   ├── api/                     # API routes
│   │   ├── lead/                # Lead capture endpoint
│   │   ├── quote/               # Quote request endpoint
│   │   └── pricing/             # Dynamic pricing endpoint
│   ├── layout.tsx               # Root layout
│   └── not-found.tsx            # 404 page
├── components/
│   ├── ui/                      # Base UI components
│   ├── layout/                  # Layout components (Navbar, Footer)
│   ├── sections/                # Page sections
│   ├── AnalyticsProvider.tsx   # GA4 provider
│   ├── CookieConsent.tsx       # Cookie banner
│   └── PackageCard.tsx         # Package display card
├── lib/
│   ├── types.ts                # TypeScript types
│   ├── validators.ts           # Zod schemas
│   ├── analytics.ts            # GA4 helpers
│   ├── currency.ts             # Currency conversion
│   ├── seo.ts                  # SEO utilities
│   ├── utils.ts                # General utilities
│   └── data/                   # Mock data
│       ├── packages.ts
│       ├── shadows.ts
│       ├── countries.ts
│       └── cities.ts
├── styles/
│   └── globals.css             # Global styles + design tokens
└── public/                     # Static assets
```

## 🎨 Design System

### Colors
- Background: `#000000` (true black)
- Foreground: `#F5F5F5` (near white)
- Primary (Gold): `#D4AF37`
- Muted: `#888888`
- Surface: `#0A0A0A`

### Typography
- Font: Inter (fallback for Neue Haas Grotesk)
- Border Radius: `rounded-2xl` (1rem)

## 🔌 Integration Setup

### Google Analytics (GA4)

1. Create a GA4 property at [analytics.google.com](https://analytics.google.com)
2. Copy your Measurement ID (format: `G-XXXXXXXXXX`)
3. Add to `.env.local` as `NEXT_PUBLIC_GA_ID`

### Calendly

1. Create a Calendly account
2. Set up booking pages for each package
3. Add base URL to `.env.local` as `NEXT_PUBLIC_CALENDLY_URL`

### WhatsApp Business

1. Get a WhatsApp Business number
2. Add phone number (format: `15551234567`) to `.env.local`

### Stripe

1. Create a Stripe account
2. Get API keys from Stripe Dashboard
3. Add to `.env.local`:
   - `NEXT_PUBLIC_STRIPE_PUBLIC_KEY` (starts with `pk_`)
   - `STRIPE_SECRET_KEY` (starts with `sk_`)

### Google Maps (Optional)

1. Enable Maps JavaScript API in Google Cloud Console
2. Create an API key with restrictions
3. Add to `.env.local` as `NEXT_PUBLIC_GOOGLE_MAPS_KEY`

## 🌍 Multi-Language Support

The site supports 4 regions:
- **US/CA** (en): `/countries/us`
- **Mexico** (es): `/countries/mx`
- **France** (fr): `/countries/fr`
- **Germany** (de): `/countries/de`

Content is localized in `/lib/data/countries.ts`. Pricing automatically converts to local currency.

## 🎯 SEO Configuration

### Meta Tags
- Configured in each page's metadata
- OpenGraph images should be 1200x630px
- Place in `/public/og/`

### hreflang
- Automatically generated for country pages
- See `lib/seo.ts` for configuration

### Schema.org
- Organization schema in layout
- Service schema for packages
- LocalBusiness schema for host cities

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel Dashboard
4. Deploy

```bash
# Or use Vercel CLI
npm i -g vercel
vercel
```

### Custom Server

```bash
# Build
npm run build

# Start
npm start

# Or with PM2
pm2 start npm --name "beyond26" -- start
```

## 📊 Performance Targets

- **Lighthouse Performance**: ≥ 90
- **Accessibility**: ≥ 95
- **Best Practices**: ≥ 95
- **SEO**: ≥ 95
- **TTFB**: < 200ms
- **LCP**: < 2.2s
- **CLS**: < 0.1
- **JS Bundle**: < 180KB gzipped

## 🛡️ Security

- Content Security Policy configured in `next.config.js`
- HTTPS only (enforced via headers)
- No inline scripts
- Environment variables for secrets
- Input validation with Zod

## 🧪 Testing Checklist

- [ ] All pages render without errors
- [ ] Forms validate correctly
- [ ] API endpoints return expected data
- [ ] Country tabs switch correctly
- [ ] Mobile responsive on all pages
- [ ] Accessibility: keyboard navigation works
- [ ] Analytics events fire correctly
- [ ] Cookie consent banner appears
- [ ] WhatsApp/Calendly links work
- [ ] 404 page displays correctly

## 🐛 Troubleshooting

### Build Errors

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Type Errors

```bash
npm run type-check
```

### Missing Environment Variables

Check that all required variables from `.env.example` are set in `.env.local`.

## 📞 Support

For issues or questions:
- Email: dev@beyond26.com
- GitHub Issues: [repository-url]/issues

## 📄 License

Proprietary - Beyond26 © 2025

---

**Built with ❤️ for travelers who deserve more than ordinary.**
