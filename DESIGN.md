# Design System: The Archive — 120 Years of History | Galata Greek School
**Project ID:** 7717995346942134074

## 1. Visual Theme & Atmosphere

The Galata Greek School design system embodies a **"Modern Past"** philosophy — a reverent, scholarly aesthetic that bridges the gravitas of 120 years of neoclassical history with the clarity and precision of contemporary digital storytelling. The interface feels like walking through a meticulously curated **archival exhibition**: every surface breathes with the warmth of aged parchment, while gold leaf accents whisper of Ottoman-era craftsmanship and institutional significance.

The overall mood is **documentary luxury** — cinematic, authoritative, and deeply atmospheric without ever becoming heavy or ornamental. The design draws from the language of **heritage editorial publishing**, museum catalogues, and fine architectural monographs. It positions the school not merely as a building, but as a **living cultural institution**: a guardian of Hellenic identity in the heart of Istanbul's Galata district.

**Key Characteristics:**
- Cinematic, full-width hero compositions that frame the 1885 neoclassical façade as fine art
- Warm parchment-toned surfaces evoking the patina of historical documents
- Restrained, purposeful gold accents channeling institutional prestige and Byzantine heritage
- Scholarly serif typography for headlines creating a sense of permanence and authority
- Clean sans-serif body text ensuring modern readability
- Bilingual Turkish-English content reflecting the school's multicultural identity
- Photography-first narrative approach treating the building and its stories as the primary content
- Generous whitespace creating a contemplative, gallery-like browsing rhythm

## 2. Color Palette & Roles

### Heritage Foundation
- **Warm Parchment Cream** (#FDFCF8) – Primary background color. A barely perceptible warmth that avoids the clinical sterility of pure white, evoking the tonal quality of aged archival paper. This foundational color creates an inviting, scholarly canvas across all primary content sections.
- **Antiqued Stone Gray** (#F5F0E8) – Secondary surface color used for alternating content sections, card backgrounds, and sidebar areas. Provides a subtle but distinct layering effect reminiscent of stone and plaster walls within the school itself.

### Gold Accent System (The Signature)
- **Heritage Brass Gold** (#C5A059) – The defining accent color of the entire design system. A warm, muted brass gold — never bright or garish — that anchors the "Modern Past" identity. Used for:
  - Primary call-to-action button backgrounds
  - Active navigation state indicators (underline or background highlight)
  - Selective keyword highlighting within serif headings (e.g., *"The **People** Who Shaped History"*)
  - Horizontal divider rules within cards
  - Icon accents and decorative elements
  - The `Estd. 1885` heritage badge typography
- **Luminous Citron** (#F2D00D) – A brighter, more saturated gold reserved sparingly for hover states, micro-interactions, and moments requiring heightened visual energy. This is the project's registered `customColor` within Stitch and should be used as the vibrant counterpart to the Heritage Brass Gold.
- **Deep Burnished Gold** (#9A7B3D) – A darker, more subdued gold variant for pressed/active button states and fine typographic details on dark backgrounds.

### Atmospheric Darks
- **Archival Charcoal** (#1A1A1A) – A near-black with warm undertones used for high-contrast hero sections (particularly the AMMF Foundation tribute section), footer areas, and cinematic overlay backgrounds. Conveys authority and institutional weight.
- **Deep Heritage Navy** (#2C3E50) – A sophisticated dark blue-charcoal used as an optional secondary dark background or for elevated navigation elements, evoking the depth of a moonlit Bosphorus.

### Typography & Text
- **Scholar's Ink** (#2C2C2C) – Primary text color for body copy, subheadings, and descriptive content on light backgrounds. Warmer and more refined than pure black, easier on the eyes for extended reading.
- **Stone Inscription Gray** (#6B6B6B) – Secondary text used for metadata, timestamps, captions, and supporting copy. Creates a clear typographic hierarchy that recedes gracefully from primary content.
- **Faded Archive Beige** (#B8A88A) – Tertiary text color used on dark backgrounds for subtle secondary information, labels, and watermark-style elements.
- **Pure Vellum White** (#FFFFFF) – Text color on dark backgrounds and gold button surfaces. Provides maximum contrast for CTAs and hero section headlines.

### Functional States
- **Olive Confirmation** (#4A7C59) – Success and availability indicators, echoing the natural palette of Istanbul's historic gardens
- **Terracotta Alert** (#C0392B) – Error states and critical warnings, referencing the terracotta tones found in Ottoman-era architectural detailing
- **Aegean Informational** (#5B7FA4) – Neutral system messages and informational callouts, subtly echoing the blue of the Aegean Sea

## 3. Typography Rules

**Primary Font Family:** Manrope  
**Character:** A modern, geometric sans-serif with gentle humanist warmth. Its slightly rounded letterforms provide contemporary clarity while maintaining approachability — the "Modern" half of the "Modern Past" equation.

**Secondary/Display Font:** Serif display face (Playfair Display or similar high-contrast transitional serif)  
**Character:** Authoritative, editorial, and deeply elegant. Used for cinematic hero headlines and major section titles — the "Past" half of the equation, evoking historical documents, museum plaques, and architectural inscriptions.

### Hierarchy & Weights

- **Cinematic Display Headlines (H1 — Serif):** Bold weight (700), generous letter-spacing (0.03em), large scale (3–4.5rem). Used for hero sections, major page titles like *"The Archive"* and *"The Blank Canvas."* These headlines should feel monumental, like text carved in stone.
- **Section Headers (H2 — Serif/Sans-serif):** Semi-bold weight (600), moderate letter-spacing (0.02em), 2–2.5rem size. Delineates major content zones such as *"Tarihçe,"* *"Restorasyon,"* or *"Space Configurations."*
- **Subsection Headers (H3 — Manrope):** Medium weight (500), subtle letter-spacing (0.01em), 1.25–1.5rem. Used for card titles, venue names (e.g., *"The Grand Hall"*), and event names (e.g., *"Vogue Couture Gala"*).
- **Body Text (Manrope):** Regular weight (400), relaxed line-height (1.8), 1rem size. Descriptions and historical narratives prioritize comfortable, contemplative reading with generous vertical rhythm.
- **Meta/Caption Text (Manrope):** Regular weight (400), slightly tighter line-height (1.5), 0.875rem size. Dates, dimensions (e.g., *"Level 1 | 800 m²"*), and operational details.
- **CTA Button Text (Manrope):** Medium weight (500), subtle letter-spacing (0.02em), 0.9375rem size. Balanced presence — confident but never demanding.
- **Heritage Badge ("Estd. 1885"):** Light weight (300), widely spaced letters (0.15em), small caps treatment. A signature typographic motif that appears in the navigation header.

### Spacing Principles
- Serif headlines use expanded letter-spacing (0.03em+) for monumental, chiseled elegance
- Body text maintains generous line-height (1.8) for scholarly, contemplative reading
- Consistent vertical rhythm with 2–3rem between related text blocks
- Large margins (5–8rem) between major sections reinforcing the gallery-like spaciousness
- Bilingual text pairs (Turkish-English) maintain consistent spacing patterns across both languages

## 4. Component Stylings

### Buttons
- **Shape:** Gently rounded corners (8px/0.5rem radius, aligning with Stitch `ROUND_EIGHT` setting) — refined and architectural without appearing playful
- **Primary CTA:** Heritage Brass Gold (#C5A059) background with Pure Vellum White text. Comfortable padding (1rem vertical, 2.5rem horizontal). Often paired with `arrow_forward` icon.
- **Hover State:** Slight darkening toward Deep Burnished Gold (#9A7B3D), smooth 300ms ease transition
- **Focus State:** Luminous Citron (#F2D00D) outer glow for keyboard navigation accessibility
- **Secondary CTA:** Outlined style with goldrimmed border on transparent background; hover fills with a whisper of gold tint
- **On-Dark Variant:** Gold-outlined button on Archival Charcoal backgrounds, fills gold on hover

### Cards & Content Containers
- **Corner Style:** Consistently rounded (8px/0.5rem) matching button geometry for visual harmony
- **Background:** Warm Parchment Cream (#FDFCF8) or Antiqued Stone Gray (#F5F0E8) depending on section context
- **Shadow Strategy:** Ultra-restrained by default — flat surfaces dominate. On hover, a whisper-soft diffused shadow appears (`0 4px 16px rgba(0,0,0,0.06)`) evoking a photograph lifting gently from an album
- **Border:** Optional hairline gold accent rule (1px) at card top or bottom for heritage-coded separation
- **Internal Padding:** Generous 2–2.5rem providing comfortable breathing room for historical narratives
- **Image Treatment:** Full-bleed photography at top of cards with historical sepia-toned or warm-grade imagery; 16:9 or 4:3 aspect ratios

### Event/Venue Cards (Specific Pattern)
- **Image Area:** Full-width, warm-toned architectural photography
- **Content Stack:** Event/venue name (serif H3), brief Turkish description in body text, capacity/features listed with `check` icon indicators in Heritage Brass Gold
- **Testimonial Variant:** Italicized quote text in serif face with thin gold accent line to the left
- **Hover Behavior:** Gentle lift effect (translateY -3px) with enhanced soft shadow

### Navigation
- **Style:** Clean horizontal top bar with the `Galata Rum Okulu` logotype on the left and `Estd. 1885` heritage badge
- **Items:** Galata Rum Okulu | Sergiler | Etkinlikler | Geçmiş Etkinlikler | Bize Ulaşın
- **Typography:** Manrope Medium (500), normal case, subtle letter-spacing (0.01em)
- **Default State:** Scholar's Ink (#2C2C2C) text
- **Active/Hover State:** Heritage Brass Gold (#C5A059) text color with smooth 200ms transition
- **Active Indicator:** Thin gold underline (2px) appearing below current section
- **Language Selector:** TR | EN | EL toggle with Heritage Brass Gold active indicator
- **Scroll-to-Top:** `expand_less` icon button fixed to bottom-right

### Inputs & Forms (Concierge Inquiry)
- **Stroke Style:** Refined 1px border in Antiqued Stone Gray
- **Background:** Warm Parchment Cream with transition to brighter white on focus
- **Corner Style:** Matching component roundness (8px/0.5rem)
- **Focus State:** Border color shifts to Heritage Brass Gold with subtle outer glow
- **Padding:** Generous 1rem vertical, 1.25rem horizontal for comfortable data entry
- **Labels:** Manrope Medium (500) in Scholar's Ink with adequate spacing above inputs

### Footer
- **Background:** Archival Charcoal (#1A1A1A)
- **Content Sections:** Visit Hours, Contact, Location — organized in three columns
- **Typography:** Faded Archive Beige (#B8A88A) for labels, Pure Vellum White for content
- **Social Icons:** Facebook, X (Twitter), Instagram — aligned horizontally with gold hover accents
- **Legal Links:** KVKK | Çerez Politikası | Künye — in subdued text
- **Copyright:** `Galata Rum Okulu © 2026. Tüm hakları saklıdır.`

## 5. Layout Principles

### Grid & Structure
- **Max Content Width:** 1440px for premium readability on large displays
- **Grid System:** Responsive 12-column grid with fluid gutters (24px mobile, 32px desktop)
- **Content Grid Variations:**
  - 3-column for venue space configurations and event gallery cards
  - 2-column for historical timeline/narrative sections (image + text side by side)
  - Single column for cinematic hero sections and full-width archival narratives
- **Breakpoints:**
  - Mobile: <768px
  - Tablet: 768–1024px
  - Desktop: 1024–1440px
  - Large Desktop: >1440px

### Whitespace Strategy (Critical — The Gallery Rhythm)
- **Base Unit:** 8px for micro-spacing, 16px for component spacing
- **Vertical Rhythm:** Consistent 2rem (32px) base unit between related elements
- **Section Margins:** Dramatic 6–10rem (96–160px) between major sections, creating the contemplative pauses of a historical walk-through
- **Edge Padding:** 1.5rem (24px) mobile, 4rem (64px) desktop for generous framing
- **Hero Sections:** Extra-generous top/bottom padding (10–14rem) for monumental, cinematic presentation

### Alignment & Visual Balance
- **Text Alignment:** Centered for hero headlines and section titles; left-aligned for body text and card content
- **Image-to-Text Ratio:** Heavily weighted toward imagery (65–35 split), reflecting the photography-first archival approach
- **Asymmetric Balance:** Large cinematic building photographs offset by refined, compact text blocks
- **Visual Weight Distribution:** Gold accent elements guide the eye through the hierarchy — from navigation indicator → section title → CTA button
- **Reading Flow:** Vertical scroll-based narrative encouraging slow, deliberate exploration of the 120-year history

### Responsive Behavior
- **Mobile-First Foundation:** Core historical narrative experience optimized for phone screens
- **Progressive Enhancement:** Additional grid columns, larger hero imagery, and richer typographic details added at larger breakpoints
- **Touch Targets:** Minimum 44×44px for all interactive elements (WCAG AAA compliant)
- **Collapsing Strategy:** Navigation to hamburger menu, event grid from 3→2→1 columns, hero padding scales proportionally

## 6. Design System Notes for Stitch Generation

When creating new screens for this project using Stitch, reference these specific instructions:

### Language to Use
- **Atmosphere:** "Documentary luxury with scholarly warmth — like a meticulously curated archival exhibition in a restored 19th-century neoclassical school"
- **Color Mode:** "Warm parchment cream backgrounds with Heritage Brass Gold accents and cinematic charcoal dark sections"
- **Button Shapes:** "Gently rounded corners" (8px radius, never pill-shaped, never sharp)
- **Shadows:** "Ultra-restrained — flat by default, whisper-soft diffused shadows on hover"
- **Spacing:** "Gallery-like spaciousness with dramatic breathing room between major sections"
- **Typography:** "Monumental serif headlines paired with clean Manrope sans-serif body text"

### Color References
Always use the descriptive names with hex codes:
- Primary Accent: "Heritage Brass Gold (#C5A059)"
- Bright Accent (sparingly): "Luminous Citron (#F2D00D)"
- Primary Background: "Warm Parchment Cream (#FDFCF8)"
- Secondary Surface: "Antiqued Stone Gray (#F5F0E8)"
- Dark Sections: "Archival Charcoal (#1A1A1A)"
- Primary Text: "Scholar's Ink (#2C2C2C)"
- Secondary Text: "Stone Inscription Gray (#6B6B6B)"
- Text on Dark: "Faded Archive Beige (#B8A88A)" or "Pure Vellum White (#FFFFFF)"

### Component Prompts
- "Create a cinematic hero section with a full-width neoclassical building photograph, a monumental serif headline in Pure Vellum White, and a Heritage Brass Gold CTA button with gently rounded 8px corners"
- "Design an event card with warm-toned photography, a serif event name, a Turkish description in Manrope body text, and a thin Heritage Brass Gold accent divider"
- "Add a historical timeline section on Warm Parchment Cream background with Scholar's Ink serif headings, generous 1.8 line-height body text, and gold-accented milestone markers"
- "Create a venue specification card with Antiqued Stone Gray background, gently rounded corners, and checkmark feature list using Heritage Brass Gold check icons"
- "Design a dark AMMF Foundation tribute section on Archival Charcoal with Heritage Brass Gold typography accents and Faded Archive Beige supporting text"

### Content & Theme Notes
- The school was **established in 1885** — the "Estd. 1885" heritage badge is a core brand element
- Content is **bilingual Turkish-English** and occasionally includes Greek (EL)
- The school is in **Karaköy/Galata, Istanbul** — a historic trade and finance district
- The architects were **Patroklos Kambanakis and Stavros Hristidis**
- The restoration was sponsored by **Marina and Athanasios Martinos** under the patronage of **Ecumenical Patriarch Bartholomew I**
- Key venue spaces: **The Grand Hall** (800 m²), **The Gallery Wing** (1,200 m²), **The Terrace Suite** (500 m²)
- The institution positions itself as both a **guardian of Hellenic heritage** and an **inclusive contemporary art and education space** for all Istanbulites

### Incremental Iteration
When refining existing screens:
1. Focus on **ONE component** at a time (e.g., "Update the hero section gold accent elements")
2. Be specific about changes (e.g., "Change the CTA button from Heritage Brass Gold to outlined gold-on-cream for a softer approach")
3. Reference this design system language consistently
4. Maintain the **bilingual content structure** in all new sections
5. Ensure all new screens include the consistent **navigation header** with `Estd. 1885` badge and **Archival Charcoal footer** with contact information
