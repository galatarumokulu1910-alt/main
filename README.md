# Galata Greek School — "Modern Past" Digital Platform

> A premium, trilingual web platform for the historic 120-year-old Galata Greek School in Istanbul's Karaköy district. Bridging a century of Hellenic heritage with contemporary digital storytelling.

[![Vite](https://img.shields.io/badge/Vite-7.3-646CFF?logo=vite&logoColor=white)](https://vite.dev)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Deploy](https://img.shields.io/badge/Deploy-Vercel-000?logo=vercel&logoColor=white)](https://vercel.com)

---

## 📋 Table of Contents

- [About the Project](#about-the-project)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Pages & Routes](#pages--routes)
- [Design System](#design-system)
- [Internationalization (i18n)](#internationalization-i18n)
- [Getting Started](#getting-started)
- [Scripts](#scripts)
- [Deployment](#deployment)
- [Status & Roadmap](#status--roadmap)

---

## About the Project

The Galata Greek School (Galata Rum Okulu), also known by its corporate name **"The School" ("Okul")**, was founded in **1885** and formally opened on **June 2, 1910**. Designed by architects **Patroklos Kambanakis** and **Stavros Hristidis**, with consulting architect **Perikli Fotiadis**, the school was built with the support of **Eleni Zarifi** on land donated by the Galata Greek Community. Located at **Kemankeş Karamustafa Paşa, Kemeraltı Cd. No:49, 34425 Beyoğlu/İstanbul** — at the intersection of the Kemeraltı and Bereketzade neighborhoods — the school is a landmark of neoclassical-eclectic Ottoman architecture.

Restored under the patronage of **Ecumenical Patriarch Bartholomew I** and thanks to the generous sponsorship of **Marina and Athanasios Martinos**, with restoration led by **Murat Tabanlıoğlu** (Tabanlıoğlu Architects), the school now serves as both a **cultural heritage archive** and a **premium event venue**.

This platform fulfills two primary missions:

| Mission | Description |
|---------|-------------|
| **Commercial** | Positioning the building as a high-end venue for art, culture, and private events |
| **Historical** | A digital museum for the "100-Year Horizon" archive of Galata Greek life |

### Building Facilities

| Floor | Function |
|-------|----------|
| **1st Floor** | Büyük Salon (Large Hall) |
| **2nd Floor** | Exhibition hall + foyer |
| **3rd Floor** | Exhibition hall + foyer |
| **4th Floor** | Library, Archive, Administrative Offices |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Browser (Client)                         │
│                                                                 │
│  ┌───────────┐   ┌──────────────────────────────────────────┐   │
│  │  Vercel   │   │           React 19 SPA                    │   │
│  │  (Host)   │──▶│                                          │   │
│  │           │   │  ┌──────────────────────────────────┐    │   │
│  │  CDN +    │   │  │         BrowserRouter             │    │   │
│  │  Rewrites │   │  │                                    │    │   │
│  └───────────┘   │  │  ┌────────────────────────────┐   │    │   │
│                  │  │  │       I18nProvider           │   │    │   │
│                  │  │  │    (TR / EN / EL context)    │   │    │   │
│                  │  │  │                              │   │    │   │
│                  │  │  │  ┌──────────────────────┐   │   │    │   │
│                  │  │  │  │    App Shell          │   │   │    │   │
│                  │  │  │  │  ┌────────────────┐  │   │   │    │   │
│                  │  │  │  │  │     Header      │  │   │   │    │   │
│                  │  │  │  │  │  (Nav + i18n)   │  │   │   │    │   │
│                  │  │  │  │  ├────────────────┤  │   │   │    │   │
│                  │  │  │  │  │   <Routes>      │  │   │   │    │   │
│                  │  │  │  │  │  8 page routes  │  │   │   │    │   │
│                  │  │  │  │  ├────────────────┤  │   │   │    │   │
│                  │  │  │  │  │     Footer      │  │   │   │    │   │
│                  │  │  │  │  │ (Newsletter +   │  │   │   │    │   │
│                  │  │  │  │  │  Contact info)  │  │   │   │    │   │
│                  │  │  │  │  └────────────────┘  │   │   │    │   │
│                  │  │  │  └──────────────────────┘   │   │    │   │
│                  │  │  └────────────────────────────┘   │    │   │
│                  │  └──────────────────────────────────┘    │   │
│                  └──────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘

DATA FLOW
─────────
I18nContext ──▶ useI18n() hook ──▶ All components
                                    │
CSS Variables (variables.css) ──────▶ All stylesheets
                                    │
Static Data (sampleArtifacts.ts) ──▶ ArchivePage
```

### Component Architecture

```
App.tsx
├── I18nProvider          (Context — trilingual state management)
├── BrowserRouter         (Client-side routing)
├── ScrollToTop           (Utility — scroll reset on navigation)
├── Header                (Shared — navigation + language toggle)
├── <Routes>
│   ├── /                 → HomePage         (Hero + collections + story)
│   ├── /archive          → ArchivePage      (Digital archive + artifacts)
│   ├── /venue-hire       → VenueHirePage    (Floor plans + venue info)
│   ├── /past-events      → PastEventsPage   (Event gallery)
│   ├── /past-events/:id  → EventDetailPage  (Individual event detail)
│   ├── /history          → HistoryPage      (Vertical timeline 1885→now)
│   ├── /concierge        → ConciergePage    (Multi-step booking form)
│   └── /ammf             → AmmfPage         (Foundation tribute)
└── Footer                (Shared — newsletter + contact + legal)
```

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | React 19.2 | UI rendering with latest concurrent features |
| **Language** | TypeScript 5.9 | Type safety across the codebase |
| **Build Tool** | Vite 7.3 | Dev server with HMR + optimized production builds |
| **Routing** | React Router DOM 7 | Client-side SPA navigation |
| **Styling** | CSS Custom Properties | Design tokens in `variables.css`, component-scoped CSS |
| **i18n** | Custom Context API | Lightweight trilingual support (TR/EN/EL) |
| **Linting** | ESLint 9 + TypeScript ESLint | Code quality enforcement |
| **Deployment** | Vercel | CDN hosting with SPA rewrites |

---

## Project Structure

```
GalataSchool/
├── public/                    # Static assets served as-is
├── src/
│   ├── assets/                # Images & SVG logos
│   │   ├── galata-rum-okulu_logo.svg
│   │   ├── galata_hero.png
│   │   └── galata_herp.jpg
│   ├── components/            # Shared, reusable components
│   │   ├── ArtifactCard/      # Archive artifact display card
│   │   ├── FloorPlan/         # SVG-based interactive floor plans
│   │   ├── Footer/            # Site-wide footer with newsletter
│   │   ├── Header/            # Navigation + language toggle
│   │   └── ScrollToTop/       # Route-change scroll reset
│   ├── data/
│   │   └── sampleArtifacts.ts # Static archive artifact data
│   ├── i18n/
│   │   └── I18nContext.tsx     # Trilingual context + translations
│   ├── pages/                 # Route-level page components
│   │   ├── AmmfPage/          # AMMF Foundation tribute
│   │   ├── ArchivePage/       # 100-Year Horizon digital archive
│   │   ├── ConciergePage/     # Venue booking inquiry form
│   │   ├── EventDetailPage/   # Individual past event detail
│   │   ├── HistoryPage/       # Vertical timeline (1885–present)
│   │   ├── HomePage/          # Hero + collections + story
│   │   ├── PastEventsPage/    # Past events masonry gallery
│   │   └── VenueHirePage/     # Floor plans + venue spaces
│   ├── styles/
│   │   ├── global.css         # Base resets + global styles
│   │   └── variables.css      # Design tokens (colors, typography, spacing)
│   ├── App.tsx                # Root component with routing
│   ├── App.css
│   ├── main.tsx               # React DOM mount point
│   └── index.css
├── stitch-screens/            # Stitch UI design exports
├── DESIGN.md                  # Complete design system documentation
├── Requirements.md            # Feature requirements specification
├── vercel.json                # Vercel deployment config (SPA rewrites)
├── vite.config.ts             # Vite configuration
├── tsconfig.json              # TypeScript project references
├── tsconfig.app.json          # App-specific TS config
├── tsconfig.node.json         # Node/tooling TS config
└── package.json
```

---

## Pages & Routes

| Route | Page | Description | Status |
|-------|------|-------------|--------|
| `/` | HomePage | Cinematic hero with video/image slideshow, featured collections, brand story, how-to-use section, social proof | ✅ Implemented |
| `/archive` | ArchivePage | "100-Year Horizon" digital archive with artifact masonry grid and curator lightbox | ✅ Implemented |
| `/venue-hire` | VenueHirePage | Interactive SVG floor plans with gold accents, space configurations | ✅ Implemented |
| `/past-events` | PastEventsPage | Prestige masonry gallery of past events (fashion shows, galas) | ✅ Implemented |
| `/past-events/:id` | EventDetailPage | Case study detail for individual events | ✅ Implemented |
| `/history` | HistoryPage | Vertical scroll-triggered timeline from 1885 to present | ✅ Implemented |
| `/concierge` | ConciergePage | Multi-step venue booking inquiry form | ✅ Implemented |
| `/ammf` | AmmfPage | AMMF Foundation tribute section | ✅ Implemented |

---

## Design System

The visual identity follows a **"Modern Past"** philosophy — documentary luxury that bridges 120 years of neoclassical heritage with contemporary digital storytelling.

### Color Palette

| Token | Hex | Role |
|-------|-----|------|
| `--color-parchment-cream` | `#FDFCF8` | Primary background — aged archival paper |
| `--color-stone-gray` | `#F5F0E8` | Secondary surface — plaster walls |
| `--color-brass-gold` | `#C5A059` | Primary accent — Heritage Brass Gold |
| `--color-citron` | `#F2D00D` | Bright accent — hover states |
| `--color-charcoal` | `#1A1A1A` | Dark sections — hero overlays, footer |
| `--color-ink` | `#2C2C2C` | Primary text — Scholar's Ink |

### Typography

- **Display/Headlines**: Playfair Display (serif) — monumental, editorial
- **Body/UI**: Manrope (sans-serif) — modern, geometric, readable

> Full design system documentation: [`DESIGN.md`](./DESIGN.md)

---

## Internationalization (i18n)

The platform supports three languages via a lightweight React Context:

| Language | Code | Default |
|----------|------|---------|
| Turkish | `tr` | ✅ |
| English | `en` | |
| Greek | `el` | |

**Usage in components:**

```tsx
import { useI18n } from '../i18n/I18nContext';

function MyComponent() {
  const { t, lang, setLang } = useI18n();
  return <h1>{t('hero.headline')}</h1>;
}
```

Translation keys are defined in `src/i18n/I18nContext.tsx` with fallback chain: **current language → English → raw key**.

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/GalataGreekSchool-Page.git
cd GalataGreekSchool-Page/GalataSchool

# Install dependencies
npm install

# Start development server
npm run dev
```

The dev server starts at `http://localhost:5173` with hot module replacement.

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | TypeScript check + production build to `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint across the codebase |

---

## Deployment

The project is configured for **Vercel** deployment with SPA client-side routing support.

```json
// vercel.json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### Deploy Steps

1. Push to your GitHub repository
2. Import the project in [Vercel Dashboard](https://vercel.com)
3. Set the **Root Directory** to `GalataSchool`
4. Vercel auto-detects Vite and deploys

---

## Status & Roadmap

### ✅ Completed

- [x] React 19 + TypeScript + Vite project scaffold
- [x] Design system tokens in CSS custom properties
- [x] Trilingual i18n system (TR / EN / EL)
- [x] Shared Header with navigation + language toggle
- [x] Mobile hamburger menu with slide-out panel + overlay
- [x] Shared Footer with newsletter + contact info
- [x] HomePage with cinematic hero section
- [x] ArchivePage with artifact masonry grid
- [x] VenueHirePage with interactive SVG floor plans + capacity tables
- [x] HistoryPage with vertical timeline
- [x] PastEventsPage with prestige gallery
- [x] EventDetailPage for individual events
- [x] ConciergePage with booking inquiry form
- [x] AmmfPage foundation tribute
- [x] Vercel deployment configuration
- [x] ScrollToTop on route changes

### 🔧 Immediate

- [ ] Dark mode toggle
- [ ] SEO metadata + Open Graph + structured data
- [ ] Image lazy loading + performance optimization
- [ ] Accessibility audit (WCAG 2.1 compliance)

### 📋 Short-Term

- [ ] Newsletter email storage (CSV/XLSX export)
- [ ] Archive audio atmosphere toggle
- [ ] Instagram feed integration

### 🏗️ CMS Phase (Planned)

Full content management system so the site owner can update all content without touching code.

**Admin Dashboard**

- Login with authentication (JWT/session)
- Content overview + quick-edit access

**Content Management (per page)**

| Page | Editable Content |
| --- | --- |
| HomePage | Hero image, headline, subtitle, CTA, history section, event cards |
| ArchivePage | Artifacts (title, image, date, category, description) — full CRUD |
| PastEventsPage | Events (title, date, images, description, gallery) — full CRUD |
| HistoryPage | Timeline entries (year, title, description, image) — add/edit/delete |
| VenueHirePage | Room names, capacities, features, floor plan data |
| AmmfPage | Foundation content, images, body text |
| Header/Footer | Logo, social links, contact info, newsletter config |

**Media Management**

- Drag-and-drop image upload with preview + crop
- Media library for browsing and reusing images
- Automatic optimization (WebP, resizing)

**i18n Admin**

- Translate all content per language (TR / EN / EL)
- Translation status indicator per page

**Backend Architecture**

- Headless CMS (Sanity / Strapi) or custom admin panel
- API layer (`src/lib/cms.ts`) for data fetching
- Image CDN via CMS or Cloudinary
- Webhook on publish → Vercel rebuild

---

## License

All rights reserved. © 2026 Galata Rum Okulu.
