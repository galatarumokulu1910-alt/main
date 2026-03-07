# Galata Greek School — Tasks

## ✅ Completed

- [x] React 19 + TypeScript + Vite scaffold
- [x] react-router-dom: 8 routes wired
- [x] i18n context (TR / EN / EL) with `useI18n()` hook
- [x] Header: logo, nav links, language toggle, scroll effect
- [x] Mobile hamburger menu with slide-out panel + overlay
- [x] Footer: newsletter form, visit hours, contact, location, social icons, legal links
- [x] ScrollToTop on route change
- [x] HomePage: cinematic hero (full image, centered content), featured collections, brand story
- [x] ArchivePage: masonry grid, artifact cards, Curator View lightbox
- [x] VenueHirePage + FloorPlan: hero, SVG floor plans with hover/glow, level tabs, room details, capacity tables, CTA
- [x] PastEventsPage: prestige masonry gallery
- [x] EventDetailPage: individual event case study
- [x] HistoryPage: vertical scroll timeline (1885–present)
- [x] ConciergePage: multi-step booking inquiry form
- [x] AmmfPage: foundation tribute
- [x] i18n wired into Header nav links + FloorPlan component
- [x] Design tokens in `variables.css`
- [x] Vercel deployment + SPA rewrites
- [x] Venue Hire: updated floor names from official PDF (Exhibition Hall + Foyer for L2/L3, removed Terrace)
- [x] Venue Hire: official areas — L1: 227+100 m² (Mezzanine 60+22 m²), L2: 275 m², L3: 458 m²
- [x] Venue Hire: photo carousel per level (4 images each: gala/theater/cocktail for L1, gallery/conference/empty for L2/L3)
- [x] Address updated to official: Kemankeş Karamustafa Paşa, Kemeraltı Cd. No:49, 34425 Beyoğlu/İstanbul
- [x] HistoryPage: added timeline events, Fotiadis + Tabanlıoğlu architects, corrected opening date
- [x] README.md: enriched About section from PDF
- [x] ConciergePage: added optional multi-select dropdown for preferred venue levels
- [x] Dark mode: `data-theme="dark"` toggle with ThemeContext, localStorage persistence, system preference
- [x] Footer: AMMF Foundation sponsor name linked to /ammf page
- [x] Deployed to Vercel (production) — latest: venue carousel + areas

## 🔧 Immediate

- [ ] SEO: meta tags, Open Graph, structured data per page
- [ ] Images: lazy loading + width/height attributes for CLS
- [ ] Accessibility audit (WCAG 2.1)

## 📋 Short-Term

- [ ] Archive: audio atmosphere toggle
- [ ] Newsletter backend (email storage + CSV/XLSX export)
- [ ] Instagram feed integration

## 🏗️ CMS Phase (Medium-Term)

### Admin Dashboard

- [ ] Admin authentication (login screen, JWT or session-based)
- [ ] Dashboard layout: sidebar nav, content overview, quick stats

### Content Management

- [ ] **Hero Section**: upload/replace hero image, edit headline + subtitle
- [ ] **Homepage Sections**: edit history text, split section copy, event cards
- [ ] **Archive Page**: CRUD for archive artifacts (title, image, date, category, description)
- [ ] **Past Events**: CRUD for events (title, date, images, description, gallery)
- [ ] **History Timeline**: add/edit/delete timeline entries (year, title, description, image)
- [ ] **AMMF Page**: edit foundation tribute content + images
- [ ] **Venue Hire**: edit room names, capacities, features, SVG data
- [ ] **Venue Hire Images**: upload/replace venue photos per level carousel (L1, L2, L3)

### Media Management

- [ ] Image upload with drag-and-drop, preview, and crop
- [ ] Media library: browse, search, reuse uploaded images
- [ ] Automatic image optimization (WebP conversion, resizing)

### i18n Content

- [ ] Translate content per language (TR / EN / EL) in admin
- [ ] Translation status indicator (complete / incomplete per page)

### Backend / API

- [ ] REST or GraphQL API for all content types
- [ ] Database: PostgreSQL or MongoDB for content storage
- [ ] File storage: Vercel Blob, Cloudinary, or S3 for images
- [ ] Webhook on publish: trigger Vercel redeploy (ISR or SSG)

### Deployment

- [ ] Migrate from fully static SPA to Next.js (SSR/SSG) or keep SPA + API
- [ ] API hosting: Vercel Serverless Functions or separate Node.js backend
