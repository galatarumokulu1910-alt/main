REQUIREMENTS.md: Galata Greek School "Modern Past" Project
1. Project Overview
A premium, trilingual web platform for a 120-year-old renovated Greek School in Galata. The site serves two primary purposes:

Commercial: Positioning the building as a high-end venue for art, culture, and private organizations.

Historical: Serving as a digital museum for the "100-Year Horizon" archive of Galata Greek life.

2. Global Technical Requirements
Trilingual Support: Native toggles for Turkish (TR), English (EN), and Greek (EL).

Responsiveness: Mobile-first design that preserves the "neoclassical" proportions on smaller screens.

Performance: Lazy-loading for high-resolution archival images to maintain a sub-2-second load time.

Accessibility: Compliant with modern standards (Screen readers, high-contrast text, and keyboard navigation for the "Venue Hire" form).

3. Page-Specific Functionality
3.1. Homepage ("The Portal")
Hero Section: Full-width cinematic video/image background of the renovated architecture.

Primary CTA: High-visibility button "Host Your Event in History."

Visual Anchor: Sticky header with the trilingual switcher.

3.2. Venue Hire & Floor Plans ("Commercial Hub")
Interactive Floor Plans: SVG-based, minimalist floor plans with gold accents.

Dynamic Capacities: Table view showing different setup capacities (Gala, Theater, Cocktail) for various rooms.

Booking Inquiry: Multi-step form capturing: Event Type, Date, Estimated Guests, and Technical Requirements.

3.3. The 100-Year Horizon ("Digital Archive")
Vertical Timeline: A scroll-triggered timeline moving from 1885 to the present.

Artifact Masonry: A grid system for artifacts (toys, books, portraits) older than 50 years.

The "Curator View": Implementation of a high-detail lightbox/zoom for vintage student records and handwritten Greek books.

Audio Atmosphere: Subtle toggle for ambient sounds (e.g., distant school bell or classroom murmurs).

3.4. Past Events ("Social Proof")
Prestige Gallery: Masonry grid focusing on high-end past events (Fashion Shows, Vernissages).

Case Study Pop-ups: Small overlays describing how the "Modern Past" was integrated into specific events.

4. Integration & Data
E-Newsletter: Subscription box in the footer that stores emails (ready for future CSV/XLSX export).

Social Integration: Live Instagram feed in the footer showcasing the "rosano.studio" aesthetic.

CMS Readiness: All components must use clean, semantic HTML/React props to allow for future WordPress data binding.

5. Design Constants (from DESIGN.md)
Primary Palette: Gallery White, Deep Charcoal, Metallic Old Gold.

Typography: Classic Serif for Heritage headers; Wide Sans-Serif for functional data.