# Developer Handover Document — Galata School Website

Welcome to the **Galata School** website project codebase. This document outlines the codebase architecture, database schemas, deployment setup, static rendering pipelines, and details you need to maintain and develop the website.

---

## 1. Project Overview & Repositories

* **Git Repository:** `https://github.com/galatarumokulu1910-alt/main`
* **Target Hosting:** Vercel (Production URL: `https://main-one-fawn.vercel.app`)
* **Database & Storage:** Supabase (Project ID: `tvloakrlqazcadokliaf` / Custom Org `galatarumokulu1910-7863s-projects`)
* **Domain Name (Configured):** `https://galatarumokulu.org.tr`

---

## 2. Technical Stack

* **Frontend:** React 18, Vite 6/7, TypeScript, React Router DOM (v6).
* **Styling:** Custom Vanilla CSS for components and layout. Tailwind CSS is available but vanilla classes are preferred for core layouts.
* **Database Client:** Supabase JS Client (`@supabase/supabase-js`).
* **Prerendering:** Puppeteer script (`prerender.mjs`) for exporting crawlable static pages.

---

## 3. Directory Structure

```
├── .env                  # Local environment variables (gitignored, template below)
├── dist/                 # Build output directory (contains prerendered static pages)
├── public/               # Public assets (images, static files)
├── src/
│   ├── assets/           # UI assets (logo, default placeholders)
│   ├── components/       # Shared UI components (Header, Footer, SEO, Breadcrumbs)
│   ├── contexts/         # React Contexts (Theme, etc.)
│   ├── hooks/            # Custom hooks (e.g. useCmsContent)
│   ├── i18n/             # i18n translation context and static dictionaries
│   ├── pages/            # Page components (Home, History, Archive, Venue Hire, Event Details)
│   ├── services/         # API integrations (Supabase client initialisation)
│   ├── utils/            # General utilities
│   ├── App.tsx           # Route configuration and language prefix routing
│   └── main.tsx          # Client entry point
├── prerender.mjs         # Puppeteer-based static site generator script
├── vercel.json           # Vercel configuration (routing and SPA fallback)
└── package.json          # Dependency and script manager
```

---

## 4. Environment Variables (`.env`)

Create a `.env` file at the root of `GalataSchool/` directory with the following keys:
```env
VITE_SUPABASE_URL="https://tvloakrlqazcadokliaf.supabase.co"
VITE_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2bG9ha3JscWF6Y2Fkb2tsaWFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5NTMwODcsImV4cCI6MjA4ODUyOTA4N30.yU2-aCCeVG9nuSAYQba04LZjVBIHsL64Mae0HckzZRo"
```

> [!WARNING]
> Vite embeds environment variables at **build time**. Any updates made on the Vercel dashboard will require a manual **Redeploy** (rebuilding the project) to take effect.

---

## 5. Routing & Language Architecture

The website supports three locales: **Turkish (`tr`)**, **English (`en`)**, and **Greek (`el`)**.

* **Prefix Routing:** 
  The default locale (`tr`) serves from the root path (`/`). English routes are prefixed with `/en` (e.g., `/en/arsiv`), and Greek routes are prefixed with `/el` (e.g., `/el/arsiv`).
* **Language State:**
  Controlled by the `I18nProvider` in [I18nContext.tsx](file:///c:/Users/1/Desktop/GalataGreekSchool-Page/GalataSchool/src/i18n/I18nContext.tsx). The wrapper parses the active prefix route, sets the corresponding lang code state, and exposes translation functions.
* **Crawlable Navigation:**
  The language switcher in the [Header.tsx](file:///c:/Users/1/Desktop/GalataGreekSchool-Page/GalataSchool/src/components/Header/Header.tsx) is fully crawler-friendly. It renders React Router `<Link>` elements pointing to the correct alternate path (e.g. `/arsiv` -> `/en/arsiv` or `/el/arsiv`), ensuring Googlebot and other search engine spiders discover translated versions.

---

## 6. Translation Architecture

Translations are split into two categories:

### A. Static UI Translations (Frontend)
Located directly in the code inside [I18nContext.tsx](file:///c:/Users/1/Desktop/GalataGreekSchool-Page/GalataSchool/src/i18n/I18nContext.tsx#L24-L248). The `t()` function resolves flat and nested keys (e.g. `t('nav.home')` or `t('footer.hours.title')`).

### B. Dynamic Content Translations (Database)
Dynamic content loaded from Supabase uses separate language columns for each locale:
* `title_tr`, `title_en`, `title_el`
* `description_tr`, `description_en`, `description_el`
* `type_tr`, `type_en`, `type_el`

**Resolution Logic:** 
To display a dynamic description, always check the localized column first, falling back to English, and then Turkish. Example:
```javascript
const desc = eventData[`description_${l}`] || eventData.description_en || eventData.description_tr || '';
```

---

## 7. Static Prerendering (SEO Optimization)

Since this is a Single Page Application (SPA), search engine bots can have trouble indexing dynamic content. We run a custom Puppeteer script to prerender static HTML files.

* **Script:** [prerender.mjs](file:///c:/Users/1/Desktop/GalataGreekSchool-Page/GalataSchool/prerender.mjs)
* **How it works:**
  1. Bootstraps a temporary local preview server using Vite on port `4173`.
  2. Launches a headless Chromium instance (Puppeteer).
  3. Navigates to each of the 21 primary static routes (across TR, EN, EL).
  4. Waits for React content to load (`networkidle0`).
  5. Saves the rendered DOM as static `index.html` files inside the `dist` directory structure (e.g., `dist/en/tarihce/index.html`).
  6. Shuts down the preview server.

### Vercel Routing (`vercel.json`)
Vercel is configured to prioritize static files in `dist/`. If a static folder exists (e.g., `/en/tarihce`), Vercel serves the prerendered static HTML file. For other paths or dynamic routes, Vercel falls back to `/app.html` (the original SPA shell) to let React Router handle routing on the client side.

---

## 8. Development & Deployment Commands

Run these commands inside the `GalataSchool/` directory:

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Build & Prerender (Run before deployment)
npm run build
```

> [!NOTE]
> The `npm run build` script is mapped to `tsc -b && vite build && node prerender.mjs`. The prerendering step is vital and must complete successfully for Vercel hosting rewrites to work.

---

## 9. Key Database Tables (Supabase)

* **`artifacts`:** Preserves archive items (historical collection & communal memory). Columns include `category`, `subCategory`, `title_tr`/`en`/`el`, `description_tr`/`en`/`el`, and `imageSrc`.
* **`past_events`:** History of events hosted at the school. Columns include `slug`, `event_date`, `cover_image_url`, `title_tr`/`en`/`el`, `description_tr`/`en`/`el`.
* **`venue_events`:** Venue pricing/sizing settings (for Venue Hire).
* **`history_timeline`:** Chronological history events displayed on the History page.
