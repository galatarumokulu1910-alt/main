import { useState, useEffect } from 'react';
import { supabase } from '../../services/supabaseClient';
import { enrichVenueEventsWithMiceSpecs } from '../../services/dbSync';
import { PRODUCTION_SITE_ORIGIN, VENUE_INFO, normalizeLegacyMediaUrl } from '../../config/venueInfo';
import { Link, useNavigate } from 'react-router-dom';
import { useI18n } from '../../i18n/I18nContext';
import SEO from '../../components/SEO/SEO';
import FloorPlan from '../../components/FloorPlan/FloorPlan';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import './VenueHirePage.css';

export default function VenueHirePage() {
    const { lang, localizePath, t } = useI18n();
    const navigate = useNavigate();
    const l = (lang || 'tr') as 'tr' | 'en' | 'el';
    const [venues, setVenues] = useState<any[]>(() => enrichVenueEventsWithMiceSpecs(null));
    const [loading, setLoading] = useState(true);
    const [selectedFloorLevel, setSelectedFloorLevel] = useState<number>(1);
    const [quickInquiry, setQuickInquiry] = useState({
        type: 'conference',
        level: 'level4',
        guests: 'opt3',
    });

    const logisticsRows = [
        {
            point: {
                tr: 'Galataport İstanbul (Liman, Oteller & Otopark)',
                en: 'Galataport Istanbul (Cruise Terminal, Hotels & Parking)',
                el: 'Galataport Κωνσταντινούπολης (Λιμάνι, Ξενοδοχεία & Parking)',
            },
            distance: '400 m',
            time: {
                tr: '5 dk yürüyüş',
                en: '5 min walk',
                el: '5 λεπτά με τα πόδια',
            },
            notes: {
                tr: 'Otel konaklaması ve yüksek kapasiteli kapalı otopark imkanı',
                en: 'Pedestrian access to nearby hotels and underground parking',
                el: 'Άμεση πρόσβαση σε ξενοδοχεία και υπόγειο πάρκινγκ',
            },
        },
        {
            point: {
                tr: 'Tophane T1 Tramvay İstasyonu',
                en: 'Tophane T1 Tram Station',
                el: 'Σταθμός Τραμ T1 Tophane',
            },
            distance: '250 m',
            time: {
                tr: '3 dk yürüyüş',
                en: '3 min walk',
                el: '3 λεπτά με τα πόδια',
            },
            notes: {
                tr: 'Kabataş – Karaköy – Tarihi Yarımada raylı sistem hattı',
                en: 'Direct rail link across Kabataş, Karaköy, and the Historic Peninsula',
                el: 'Άμεση σύνδεση με τραμ (Καμπατάς – Καράκιοϊ – Ιστορική Χερσόνησος)',
            },
        },
        {
            point: {
                tr: 'Karaköy İskelesi & Tarihi Tünel (Beyoğlu)',
                en: 'Karaköy Ferry Terminal & Historic Tünel (Beyoğlu)',
                el: 'Αποβάθρα Καράκιοϊ & Ιστορικό Τελεφερίκ Tünel (Μπέγιογλου)',
            },
            distance: '500 m',
            time: {
                tr: '6 dk yürüyüş',
                en: '6 min walk',
                el: '6 λεπτά με τα πόδια',
            },
            notes: {
                tr: 'Kadıköy/Üsküdar vapur hatları ve İstiklal Caddesi bağlantısı',
                en: 'Ferry connections and funicular access to İstiklal Avenue',
                el: 'Θαλάσσια σύνδεση και άμεση πρόσβαση στην οδό Ιστικλάλ',
            },
        },
        {
            point: {
                tr: 'Bina Girişi & Engelsiz Erişim',
                en: 'Main Entrance & Accessible Access',
                el: 'Κεντρική Είσοδος & Πρόσβαση ΑμεΑ',
            },
            distance: {
                tr: 'Kemeraltı Cd. No:25',
                en: 'Kemeraltı Cd. No:25',
                el: 'Οδός Kemeraltı No:25',
            },
            time: {
                tr: 'Doğrudan Giriş',
                en: 'Direct Entry',
                el: 'Άμεση Είσοδος',
            },
            notes: {
                tr: 'Ana cadde üzerinden doğrudan erişim ve 2 adet engelsiz asansör',
                en: 'Direct street-level entrance with 2 accessible elevators',
                el: 'Άμεση πρόσβαση από την οδό Kemeraltı με 2 ανελκυστήρες ΑμεΑ',
            },
        },
    ];

    const handleQuickInquirySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams({
            type: quickInquiry.type,
            level: quickInquiry.level,
            guests: quickInquiry.guests,
        });
        navigate(`${localizePath('/bize-ulasin')}?${params.toString()}`);
    };

    useEffect(() => {
        const fetchVenues = async () => {
            const { data } = await supabase
                .from('venue_events')
                .select('*')
                .eq('status', 'published')
                .order('order_index', { ascending: true });

            setVenues(enrichVenueEventsWithMiceSpecs(data));
            setLoading(false);
        };
        fetchVenues();
    }, []);

    const micePillars = [
        {
            title: {
                tr: 'Konferans, Sempozyum & Kurumsal Toplantılar',
                en: 'Conferences, Symposia & Corporate Meetings',
                el: 'Συνέδρια, Συμπόσια & Εταιρικές Συναντήσεις',
            },
            desc: {
                tr: 'Ana oturumlar için 6,26 m tavan yüksekliğine sahip 1. Kat Çok Amaçlı Büyük Salon (250 kişi tiyatro düzeni) ve eşzamanlı oturumlar için 2. ve 3. katlardaki 12 bağımsız salon.',
                en: 'Featuring the 6.26 m double-height Level 1 Grand Multipurpose Hall (250 guests in theater setup) for keynote sessions, paired with 12 seminar rooms across Levels 2 and 3.',
                el: 'Με τη Μεγάλη Αίθουσα 1ου Ορόφου ύψους 6,26 m (250 άτομα σε θεατρική διάταξη) για κεντρικές ομιλίες και 12 ανεξάρτητες αίθουσες στους Ορόφους 2 και 3.',
            },
        },
        {
            title: {
                tr: 'Marka Lansmanları & Basın Davetleri',
                en: 'Brand Launches & Press Previews',
                el: 'Εταιρικές Παρουσιάσεις & Εκδηλώσεις Τύπου',
            },
            desc: {
                tr: 'Ürün tanıtımları, basın buluşmaları ve özel marka etkinlikleri için 1910 tarihli neoklasik mimari atmosfer ve çok katlı esnek kullanım imkanı.',
                en: '1910 neoclassical architectural prestige and flexible multi-level layouts for product launches, press previews, and special brand showcases.',
                el: 'Νεοκλασικό αρχιτεκτονικό κύρος του 1910 και ευέλικτη πολυώροφη διάταξη για παρουσιάσεις προϊόντων, συνεντεύξεις τύπου και εταιρικές εκδηλώσεις.',
            },
        },
        {
            title: {
                tr: 'Sergiler, Bienaller & Sanat Projeleri',
                en: 'Exhibitions, Biennials & Cultural Productions',
                el: 'Εκθέσεις, Μπιενάλε & Πολιτιστικές Παραγωγές',
            },
            desc: {
                tr: '18. İstanbul Bienali ve 212 Photography Istanbul gibi uluslararası organizasyonlara ev sahipliği yapmış; yüksek tavanlı ve galeri aydınlatmalı 1.060 m² sergi alanı.',
                en: 'Proven host venue for the 18th Istanbul Biennial and 212 Photography Istanbul, offering 1,060 m² of high-ceilinged space with gallery track lighting.',
                el: 'Χώρος φιλοξενίας της 18ης Μπιενάλε Κωνσταντινούπολης και του 212 Photography Istanbul, με 1.060 m² εκθεσιακού χώρου, ψηλές οροφές και μουσειακό φωτισμό.',
            },
        },
        {
            title: {
                tr: 'Gala Yemeği & Özel Resepsiyonlar',
                en: 'Gala Dinners & Exclusive Receptions',
                el: 'Δείπνα Γκαλά & Ειδικές Δεξιώσεις',
            },
            desc: {
                tr: 'Tüm etkinlik katlarının kullanımında 850 kişiye kadar kokteyl ve 450 kişiye kadar yemekli davet kapasitesi; servis mutfağı, açık avlular ve teras katındaki Simone Restaurant üzerinden catering imkanı.',
                en: 'Up to 850 guests for cocktail receptions and 450 guests for seated gala dinners across all 3 event floors, supported by a service kitchen, open-air courtyards, and catering via Simone Restaurant.',
                el: 'Έως 850 άτομα για δεξιώσεις κοκτέιλ και 450 άτομα για επίσημο δείπνο γκαλά στους 3 ορόφους, με κουζίνα εξυπηρέτησης, εσωτερικές αυλές και δυνατότητα catering από το Simone Restaurant.',
            },
        },
    ];

    const faqItems = [
        {
            q: {
                tr: 'Etkinlikler için toplam kiralanabilir alan ve kapasite nedir?',
                en: 'What is the total rentable event space and guest capacity?',
                el: 'Ποιος είναι ο συνολικός διαθέσιμος χώρος και η χωρητικότητα;',
            },
            a: {
                tr: 'Galata Rum Okulu Kültür Merkezi, 1., 2. ve 3. etkinlik katlarında toplam 1.060 m² kiralanabilir alan sunar. Tüm etkinlik katlarının birlikte kullanımında kokteyl düzeninde 850, tiyatro ve konferans düzeninde 650, yemekli gala düzeninde 450, sınıf düzeninde 300 ve toplantı düzeninde 150 kişi ağırlanabilmektedir.',
                en: 'Galata Greek School Cultural Center offers 1,060 m² of rentable event space across Levels 1, 2, and 3. When all 3 event floors are rented together, the venue accommodates up to 850 guests for cocktail receptions, 650 in theater setup, 450 for seated gala dinners, 300 in classroom setup, and 150 in boardroom setup.',
                el: 'Η Αστική Σχολή Γαλατά – Πολιτιστικό Κέντρο προσφέρει 1.060 m² χώρου εκδηλώσεων στους Ορόφους 1, 2 και 3, φιλοξενώντας έως 850 άτομα σε δεξίωση κοκτέιλ, 650 σε θεατρική διάταξη, 450 σε επίσημο δείπνο, 300 σε σχολική διάταξη και 150 σε διάταξη συνεδρίασης.',
            },
        },
        {
            q: {
                tr: 'Tarihi binada hazırlık ve sahne/sergi kurulum kuralları nelerdir?',
                en: 'What are the preparation and setup rules in the historic building?',
                el: 'Ποιοι είναι οι κανόνες προετοιμασίας και εγκατάστασης στο ιστορικό κτίριο;',
            },
            a: {
                tr: 'Galata Rum Okulu Kültür Merkezi, 2. derece tescilli tarihi eser statüsünde koruma altında bir yapıdır. Etkinlik hazırlık, yükleme ve kurulum süreçlerinde tarihi dokuya azami özen gösterilmesi esastır. Duvar, tavan ve zemin yüzeylerine çivi, vida veya yapıştırıcı uygulanamaz; sahne, ışık ve sergi kurulumları zemine zarar vermeyen bağımsız sistemlerle gerçekleştirilir.',
                en: 'Galata Greek School Cultural Center is an officially registered 2nd-degree historic monument. All event preparations and setups must be executed with the utmost care toward the historic fabric. Nails, screws, or adhesives are not permitted on walls, ceilings, or floors; all staging and exhibition setups use freestanding systems.',
                el: 'Η Αστική Σχολή Γαλατά – Πολιτιστικό Κέντρο είναι διατηρητέο ιστορικό μνημείο Β΄ κατηγορίας. Απαγορεύονται οι επεμβάσεις (καρφιά, βίδες, κόλλες) σε τοίχους, οροφές και δάπεδα· όλες οι κατασκευές πραγματοποιούνται με αυτοφερόμενα συστήματα.',
            },
        },
        {
            q: {
                tr: 'Davet ve etkinliklerde ikram (catering) hizmeti nasıl sağlanır?',
                en: 'How is catering handled for galas, launches, and receptions?',
                el: 'Πώς παρέχεται το catering για δείπνα και δεξιώσεις;',
            },
            a: {
                tr: '1. katta servis mutfağı ve iki açık hava avlusu yer almaktadır. Ayrıca binanın teras katında Pazartesi hariç her gün (Salı–Pazar 17.00–00.00) hizmet veren Simone Restaurant’tan etkinlik ve davetler için doğrudan catering hizmeti alınabilmektedir.',
                en: 'Level 1 includes a catering service kitchen and two open-air courtyards. Event organizers can also arrange catering directly from Simone Restaurant, which operates independently on the rooftop terrace Tuesday–Sunday from 17:00 to 00:00.',
                el: 'Ο 1ος όροφος διαθέτει κουζίνα εξυπηρέτησης και δύο ανοιχτές αυλές. Επιπλέον, παρέχεται δυνατότητα catering από το ανεξάρτητο Simone Restaurant που λειτουργεί στην ταράτσα του κτιρίου Τρίτη–Κυριακή (17:00–00:00).',
            },
        },
        {
            q: {
                tr: 'Mekan ziyareti, müsaitlik ve teklif talebi nasıl oluşturulur?',
                en: 'How can we schedule a venue visit or request a rental proposal?',
                el: 'Πώς μπορούμε να προγραμματίσουμε επίσκεψη ή να ζητήσουμε προσφορά;',
            },
            a: {
                tr: 'Kemeraltı Caddesi No:25, Karaköy / Beyoğlu adresindeki binamız için mekan ziyareti ve teklif taleplerinizi Bize Ulaşın sayfasındaki form üzerinden, +90 212 244 86 36 numaralı telefondan veya info@galatarumokulu.org e-posta adresinden iletebilirsiniz.',
                en: 'You can schedule a venue visit at Kemeraltı Caddesi No:25, Karaköy / Beyoğlu and request a tailored proposal via our Contact Us form, by calling +90 212 244 86 36, or by emailing info@galatarumokulu.org.',
                el: 'Μπορείτε να προγραμματίσετε επίσκεψη στην οδό Kemeraltı No:25, Καράκιοϊ / Μπέγιογλου και να λάβετε προσφορά μέσω της φόρμας Επικοινωνίας, τηλεφωνικά στο +90 212 244 86 36 ή μέσω email στο info@galatarumokulu.org.',
            },
        },
    ];

    const pageUrl = `${PRODUCTION_SITE_ORIGIN}${localizePath('/mekan-kiralama')}`;

    const renderWithSimoneLink = (text: string) => {
        const linkStyle = {
            color: 'var(--color-brass-gold-text, #84642B)',
            fontWeight: 600,
            textDecoration: 'underline',
            textUnderlineOffset: '3px',
        };
        const parts = text.split(/(Simone Restaurant|\+90 212 244 86 36|info@galatarumokulu\.org|Bize Ulaşın|Contact Us|φόρμας Επικοινωνίας)/g);
        if (parts.length === 1) return text;
        return parts.map((part, i) => {
            if (part === 'Simone Restaurant') {
                return (
                    <a key={i} href={VENUE_INFO.simoneRestaurant.websiteUrl} target="_blank" rel="noopener noreferrer" style={linkStyle}>
                        Simone Restaurant
                    </a>
                );
            }
            if (part === '+90 212 244 86 36') {
                return (
                    <a key={i} href={VENUE_INFO.contact.telephoneHref} style={linkStyle}>
                        +90 212 244 86 36
                    </a>
                );
            }
            if (part === 'info@galatarumokulu.org') {
                return (
                    <a key={i} href={VENUE_INFO.contact.emailHref} style={linkStyle}>
                        info@galatarumokulu.org
                    </a>
                );
            }
            if (part === 'Bize Ulaşın' || part === 'Contact Us' || part === 'φόρμας Επικοινωνίας') {
                return (
                    <Link key={i} to={localizePath('/bize-ulasin')} style={linkStyle}>
                        {part}
                    </Link>
                );
            }
            return part;
        });
    };

    return (
        <div className="venue-hire-page">
            <SEO 
                titleKey="venue.pageTitle" 
                descriptionKey="venue.pageDesc" 
                keywordsKey="venue.pageKeywords"
                aiSchema={{
                    "@context": "https://schema.org",
                    "@graph": [
                        {
                            "@type": ["EventVenue", "Place", "LandmarksOrHistoricalBuildings"],
                            "@id": `${PRODUCTION_SITE_ORIGIN}/#school-venue`,
                            "name": VENUE_INFO.institutionName[l],
                            "alternateName": [
                                VENUE_INFO.institutionName.tr,
                                VENUE_INFO.institutionName.en,
                                VENUE_INFO.institutionName.el
                            ],
                            "description": "Monumental 1910 neoclassical heritage venue in Karaköy, Beyoğlu, Istanbul offering 1,060 m² of net event space across 3 floors (up to 850 guests) for MICE conferences, global brand launches, corporate gala dinners, fashion shows, and international art exhibitions.",
                            "url": pageUrl,
                            "image": `${PRODUCTION_SITE_ORIGIN}/images/homepage/detail-3.webp`,
                            "maximumAttendeeCapacity": 850,
                            "openingHours": "Tu-Sa 10:00-18:00",
                            "hasMap": VENUE_INFO.contact.mapsUrl,
                            "floorSize": {
                                "@type": "QuantitativeValue",
                                "value": 1060,
                                "unitCode": "MTK"
                            },
                            "address": {
                                "@type": "PostalAddress",
                                "streetAddress": VENUE_INFO.contact.schemaStreetAddress,
                                "addressLocality": VENUE_INFO.contact.addressLocality,
                                "addressRegion": VENUE_INFO.contact.addressRegion,
                                "postalCode": VENUE_INFO.contact.postalCode,
                                "addressCountry": VENUE_INFO.contact.addressCountry
                            },
                            "geo": {
                                "@type": "GeoCoordinates",
                                "latitude": String(VENUE_INFO.contact.geo.latitude),
                                "longitude": String(VENUE_INFO.contact.geo.longitude)
                            },
                            "telephone": VENUE_INFO.contact.telephoneDisplay,
                            "email": VENUE_INFO.contact.email,
                            "amenityFeature": [
                                { "@type": "LocationFeatureSpecification", "name": "Total Net Event Area (Levels 1–3 Buyout)", "value": "1,060 m² (13 halls, 3 foyers, 2 courtyards)" },
                                { "@type": "LocationFeatureSpecification", "name": "Cocktail Reception Capacity", "value": "850 Guests (Buyout) / 450 (Level 3) / 350 (Level 1) / 250 (Level 2)" },
                                { "@type": "LocationFeatureSpecification", "name": "Theater & Conference Capacity", "value": "650 Guests (Buyout) / 320 (Level 3) / 250 (Level 1) / 140 (Level 2)" },
                                { "@type": "LocationFeatureSpecification", "name": "Seated Gala Dinner Capacity", "value": "450 Guests (Buyout) / 220 (Level 3) / 160 (Level 1) / 90 (Level 2)" },
                                { "@type": "LocationFeatureSpecification", "name": "AV & Three-Phase Power", "value": "3×63A (Levels 1 & 3) and 3×32A (Level 2) 3-Phase AV Panels" },
                                { "@type": "LocationFeatureSpecification", "name": "Accessibility", "value": "Dual East & West Accessible Elevators" },
                                { "@type": "LocationFeatureSpecification", "name": "Catering Facilities", "value": "Level 1 Service Kitchen & Rooftop Simone Restaurant Catering" },
                                { "@type": "LocationFeatureSpecification", "name": "Heritage Protection Classification", "value": "2nd-Degree Registered Historic Monument (2. Derece Tarihi Eser) — Sensitive Non-Invasive Setup Required" }
                            ],
                            "hasOfferCatalog": {
                                "@type": "OfferCatalog",
                                "name": "MICE, Brand Launch & Cultural Venue Hire Formats",
                                "itemListElement": [
                                    { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "MICE Conferences, Congresses & Corporate Summits" } },
                                    { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Global Brand Launches, Press Previews & PR Showcases" } },
                                    { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Corporate Gala Dinners, Award Ceremonies & Diplomatic Receptions" } },
                                    { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Fashion Shows, Editorial Photo/Film Productions & Design Weeks" } },
                                    { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "International Art Exhibitions, Biennials & Curatorial Programs" } }
                                ]
                            },
                            "containsPlace": {
                                "@type": "Archive",
                                "name": "Istanbul Greek Community Archive",
                                "description": "Historical archive preserving documents, photographs, and educational records of the Greek community of Istanbul."
                            },
                            "sameAs": [
                                "https://www.instagram.com/galatarumokulukulturmerkezi/",
                                "https://tr.wikipedia.org/wiki/Galata_Rum_İlkokulu",
                                VENUE_INFO.contact.mapsUrl,
                                "https://www.google.com/maps?cid=5985796472069547113"
                            ]
                        },
                        {
                            "@type": "FAQPage",
                            "@id": `${pageUrl}#faq`,
                            "mainEntity": faqItems.map((item) => ({
                                "@type": "Question",
                                "name": item.q[l],
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": item.a[l]
                                }
                            }))
                        }
                    ]
                }}
            />
            <Breadcrumbs items={[{ label: { tr: 'Mekan Kiralama', en: 'Venue Hire', el: 'Ενοικίαση Χώρου' } }]} />
            <FloorPlan
                initialVenues={venues}
                externalLoading={loading}
                selectedLevel={selectedFloorLevel}
                onSelectLevel={setSelectedFloorLevel}
            />

            {/* MICE, Brand Launch & Corporate Event Solutions + Capacity Matrix */}
            <section className="venue-mice-section" aria-labelledby="venue-mice-heading">
                <div className="venue-mice-section__inner">
                    <p className="venue-mice-section__eyebrow">
                        {l === 'tr'
                            ? 'KURUMSAL ETKİNLİKLER, SERGİLER & ÖZEL DAVETLER'
                            : l === 'el'
                              ? 'ΕΤΑΙΡΙΚΕΣ ΕΚΔΗΛΩΣΕΙΣ, ΕΚΘΕΣΕΙΣ & ΕΙΔΙΚΕΣ ΔΕΞΙΩΣΕΙΣ'
                              : 'CORPORATE EVENTS, EXHIBITIONS & PRIVATE RECEPTIONS'}
                    </p>
                    <h2 id="venue-mice-heading" className="venue-mice-section__title">
                        {l === 'tr'
                            ? 'Etkinlik, Sergi ve Kurumsal Organizasyon Alanları'
                            : l === 'el'
                              ? 'Χώροι Εκδηλώσεων, Εκθέσεων & Εταιρικών Διοργανώσεων'
                              : 'Event, Exhibition & Corporate Venue Spaces'}
                    </h2>
                    <p className="venue-mice-section__lead">
                        {l === 'tr'
                            ? 'Karaköy Kemeraltı Caddesi’nde yer alan 1910 tarihli Galata Rum Okulu Kültür Merkezi; sergiler, konferanslar, marka lansmanları ve özel davetler için 3 katta toplam 1.060 m² etkinlik alanı ve 850 kişiye varan kapasite sunar.'
                            : l === 'el'
                              ? 'Το ιστορικό νεοκλασικό κτίριο του 1910 της Αστικής Σχολής Γαλατά – Πολιτιστικού Κέντρου στην οδό Kemeraltı στο Καράκιοϊ προσφέρει 1.060 m² σε 3 ορόφους εκδηλώσεων με χωρητικότητα έως 850 προσκεκλημένους για εκθέσεις, συνέδρια, παρουσιάσεις και δεξιώσεις.'
                              : 'Located on Kemeraltı Caddesi in Karaköy, the 1910 neoclassical Galata Greek School Cultural Center offers 1,060 m² of event space across 3 floors with capacity for up to 850 guests — ideal for exhibitions, conferences, brand launches, and receptions.'}
                    </p>

                    <div className="venue-mice-pillars">
                        {micePillars.map((pillar, idx) => (
                            <article key={idx} className="venue-mice-pillar">
                                <h3 className="venue-mice-pillar__title">{pillar.title[l]}</h3>
                                <p className="venue-mice-pillar__desc">{pillar.desc[l]}</p>
                            </article>
                        ))}
                    </div>

                    {/* 2nd-Degree Historic Building & Production Sensitivity Notice */}
                    <aside className="venue-heritage-notice" aria-label={l === 'tr' ? 'Tarihi Yapı Koruma ve Kurulum İlkeleri' : l === 'el' ? 'Αρχές Προστασίας Ιστορικού Κτιρίου' : 'Historic Building Protection & Setup Guidelines'}>
                        <div className="venue-heritage-notice__badge">
                            {l === 'tr'
                                ? 'TARİHİ YAPI KORUMA VE KURULUM İLKELERİ'
                                : l === 'el'
                                  ? 'ΑΡΧΕΣ ΠΡΟΣΤΑΣΙΑΣ ΙΣΤΟΡΙΚΟΥ ΜΝΗΜΕΙΟΥ & ΕΓΚΑΤΑΣΤΑΣΗΣ'
                                  : 'HISTORIC BUILDING PROTECTION & SETUP GUIDELINES'}
                        </div>
                        <p className="venue-heritage-notice__text">
                            {l === 'tr'
                                ? 'Galata Rum Okulu Kültür Merkezi, 2. derece tescilli tarihi eser statüsündedir. Etkinlik hazırlık, kurulum ve söküm süreçlerinde binanın özgün mimari dokusuna özen gösterilmesi esastır; duvar, tavan ve zemin yüzeylerine çivi, vida veya yapıştırıcı uygulanmadan, zeminden destekli bağımsız sistemler kullanılır.'
                                : l === 'el'
                                  ? 'Η Αστική Σχολή Γαλατά – Πολιτιστικό Κέντρο αποτελεί διατηρητέο ιστορικό μνημείο Β΄ κατηγορίας. Κατά την προετοιμασία και την εγκατάσταση εκδηλώσεων απαιτείται ιδιαίτερη προσοχή στον ιστορικό ιστό, με χρήση αυτοφερόμενων συστημάτων χωρίς επεμβάσεις σε τοίχους, οροφές ή δάπεδα.'
                                  : 'Galata Greek School Cultural Center is a registered 2nd-degree historic monument. All event preparations and technical setups must respect the original architectural fabric, utilizing freestanding systems without drilling, nailing, or applying adhesives to walls, ceilings, or floors.'}
                        </p>
                    </aside>

                    {/* Comparative Floor & Capacity Matrix Table */}
                    <div className="venue-matrix-wrap">
                        <h3 className="venue-matrix__title">
                            {l === 'tr'
                                ? 'Kat Bazlı Alan ve Kapasite Tablosu'
                                : l === 'el'
                                  ? 'Πίνακας Χώρων & Χωρητικότητας ανά Όροφο'
                                  : 'Floor-by-Floor Space & Capacity Table'}
                        </h3>
                        <div className="venue-matrix__scroll">
                            <table className="venue-matrix__table">
                                <thead>
                                    <tr>
                                        <th>{l === 'tr' ? 'Etkinlik Katı & Alan' : l === 'el' ? 'Όροφος & Χώρος' : 'Event Level & Space'}</th>
                                        <th>{l === 'tr' ? 'Alan' : l === 'el' ? 'Εμβαδόν' : 'Area'}</th>
                                        <th>{l === 'tr' ? 'Kokteyl' : l === 'el' ? 'Κοκτέιλ' : 'Cocktail'}</th>
                                        <th>{l === 'tr' ? 'Tiyatro / Konferans' : l === 'el' ? 'Θέατρο / Συνέδριο' : 'Theater'}</th>
                                        <th>{l === 'tr' ? 'Gala Yemeği' : l === 'el' ? 'Επίσημο Δείπνο' : 'Gala Dinner'}</th>
                                        <th>{l === 'tr' ? 'Sınıf / Toplantı' : l === 'el' ? 'Σεμινάριο / Σύσκεψη' : 'Classroom / Boardroom'}</th>
                                        <th>{l === 'tr' ? 'Tavan Yüksekliği' : l === 'el' ? 'Ύψος Οροφής' : 'Ceiling Height'}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td><strong>{l === 'tr' ? 'Kat 1 — Çok Amaçlı Büyük Salon & Fuaye' : l === 'el' ? '1ος Όροφος — Μεγάλη Αίθουσα & Φουαγιέ' : 'Level 1 — Grand Multipurpose Hall & Foyer'}</strong></td>
                                        <td>227 + 100 m²</td>
                                        <td>350</td>
                                        <td>250</td>
                                        <td>160</td>
                                        <td>120 / 60</td>
                                        <td>6,26 m</td>
                                    </tr>
                                    <tr>
                                        <td><strong>{l === 'tr' ? 'Kat 2 — 3 Sergi ve Toplantı Salonu, Fuaye & Balkon' : l === 'el' ? '2ος Όροφος — 3 Αίθουσες, Φουαγιέ & Εξώστης' : 'Level 2 — 3 Exhibition & Seminar Halls & Balcony'}</strong></td>
                                        <td>275 m²</td>
                                        <td>250</td>
                                        <td>140</td>
                                        <td>90</td>
                                        <td>100 / 75</td>
                                        <td>4,11 m</td>
                                    </tr>
                                    <tr>
                                        <td><strong>{l === 'tr' ? 'Kat 3 — 9 Sergi Salonu & Merkez Fuaye' : l === 'el' ? '3ος Όροφος — 9 Αίθουσες Εκθέσεων & Φουαγιέ' : 'Level 3 — 9 Exhibition Galleries & Central Foyer'}</strong></td>
                                        <td>458 m²</td>
                                        <td>450</td>
                                        <td>320</td>
                                        <td>220</td>
                                        <td>180 / 80</td>
                                        <td>3,97 m</td>
                                    </tr>
                                    <tr className="venue-matrix__row--highlight">
                                        <td><strong>{l === 'tr' ? 'Tüm Etkinlik Katları (Kat 1 + 2 + 3)' : l === 'el' ? 'Όλοι οι Όροφοι Εκδηλώσεων (1 + 2 + 3)' : 'All Event Floors Combined (Levels 1 + 2 + 3)'}</strong></td>
                                        <td><strong>1.060 m²</strong></td>
                                        <td><strong>850</strong></td>
                                        <td><strong>650</strong></td>
                                        <td><strong>450</strong></td>
                                        <td><strong>300 / 150</strong></td>
                                        <td><strong>3,97 – 6,26 m</strong></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Transport & Location Access Table */}
                    <div className="venue-matrix-wrap">
                        <h3 className="venue-matrix__title">
                            {l === 'tr'
                                ? 'Konum ve Ulaşım Mesafeleri'
                                : l === 'el'
                                  ? 'Τοποθεσία & Αποστάσεις Πρόσβασης'
                                  : 'Location & Transport Distances'}
                        </h3>
                        <div className="venue-matrix__scroll">
                            <table className="venue-matrix__table">
                                <thead>
                                    <tr>
                                        <th>{l === 'tr' ? 'Ulaşım Noktası' : l === 'el' ? 'Σημείο Πρόσβασης' : 'Access Point'}</th>
                                        <th>{l === 'tr' ? 'Mesafe' : l === 'el' ? 'Απόσταση' : 'Distance'}</th>
                                        <th>{l === 'tr' ? 'Süre' : l === 'el' ? 'Χρόνος' : 'Time'}</th>
                                        <th>{l === 'tr' ? 'Detay' : l === 'el' ? 'Λεπτομέρειες' : 'Details'}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {logisticsRows.map((row, idx) => (
                                        <tr key={idx}>
                                            <td><strong>{row.point[l]}</strong></td>
                                            <td>{typeof row.distance === 'string' ? row.distance : row.distance[l]}</td>
                                            <td>{row.time[l]}</td>
                                            <td>{row.notes[l]}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Embedded Quick Venue Inquiry Configurator */}
                    <form className="venue-quick-inquiry" onSubmit={handleQuickInquirySubmit} aria-label={l === 'tr' ? 'Hızlı Mekan Kiralama Talep Formu' : l === 'el' ? 'Γρήγορη Φόρμα Αιτήματος Χώρου' : 'Quick Venue Rental Inquiry Form'}>
                        <div className="venue-quick-inquiry__header">
                            <span className="venue-quick-inquiry__eyebrow">
                                {l === 'tr' ? 'MEKAN TALEBİ & İLETİŞİM' : l === 'el' ? 'ΑΙΤΗΜΑ ΧΩΡΟΥ & ΕΠΙΚΟΙΝΩΝΙΑ' : 'VENUE INQUIRY & CONTACT'}
                            </span>
                            <h3 className="venue-quick-inquiry__title">
                                {l === 'tr'
                                    ? 'Etkinliğiniz İçin Hızlı Talep Oluşturun'
                                    : l === 'el'
                                      ? 'Δημιουργήστε Αίτημα για την Εκδήλωσή σας'
                                      : 'Start Your Event Venue Inquiry'}
                            </h3>
                        </div>
                        <div className="venue-quick-inquiry__fields">
                            <label className="venue-quick-inquiry__field">
                                <span>{l === 'tr' ? 'Etkinlik Türü' : l === 'el' ? 'Είδος Εκδήλωσης' : 'Event Type'}</span>
                                <select
                                    value={quickInquiry.type}
                                    onChange={(e) => setQuickInquiry((prev) => ({ ...prev, type: e.target.value }))}
                                >
                                    <option value="conference">{l === 'tr' ? 'Konferans / Sempozyum / Toplantı' : l === 'el' ? 'Συνέδριο / Συμπόσιο / Συνάντηση' : 'Conference / Symposium / Meeting'}</option>
                                    <option value="launch">{l === 'tr' ? 'Marka Lansmanı / Basın Daveti' : l === 'el' ? 'Εταιρική Παρουσίαση / Εκδήλωση Τύπου' : 'Brand Launch / Press Event'}</option>
                                    <option value="exhibition">{l === 'tr' ? 'Sanat Sergisi / Bienal' : l === 'el' ? 'Έκθεση Τέχνης / Μπιενάλε' : 'Art Exhibition / Biennial'}</option>
                                    <option value="gala">{l === 'tr' ? 'Gala Yemeği / Özel Resepsiyon' : l === 'el' ? 'Δείπνο Γκαλά / Δεξίωση' : 'Gala Dinner / Private Reception'}</option>
                                    <option value="fashion_show">{l === 'tr' ? 'Defile / Fotoğraf & Film Çekimi' : l === 'el' ? 'Επίδειξη Μόδας / Παραγωγή' : 'Fashion Show / Film & Photo Shoot'}</option>
                                </select>
                            </label>
                            <label className="venue-quick-inquiry__field">
                                <span>{l === 'tr' ? 'Tercih Edilen Kat / Alan' : l === 'el' ? 'Προτιμώμενος Όροφος / Χώρος' : 'Preferred Floor / Space'}</span>
                                <select
                                    value={quickInquiry.level}
                                    onChange={(e) => setQuickInquiry((prev) => ({ ...prev, level: e.target.value }))}
                                >
                                    <option value="level4">{l === 'tr' ? 'Tüm Etkinlik Katları (Kat 1+2+3 — 1.060 m²)' : l === 'el' ? 'Όλοι οι Όροφοι Εκδηλώσεων (1.060 m²)' : 'All Event Floors Combined (Levels 1+2+3 — 1,060 m²)'}</option>
                                    <option value="level1">{l === 'tr' ? 'Kat 1 — Çok Amaçlı Büyük Salon & Fuaye (327 m²)' : l === 'el' ? '1ος Όροφος — Μεγάλη Αίθουσα & Φουαγιέ (327 m²)' : 'Level 1 — Grand Multipurpose Hall & Foyer (327 m²)'}</option>
                                    <option value="level2">{l === 'tr' ? 'Kat 2 — 3 Sergi Salonu, Fuaye & Balkon (275 m²)' : l === 'el' ? '2ος Όροφος — 3 Αίθουσες, Φουαγιέ & Εξώστης (275 m²)' : 'Level 2 — 3 Exhibition Halls, Foyer & Balcony (275 m²)'}</option>
                                    <option value="level3">{l === 'tr' ? 'Kat 3 — 9 Sergi Salonu & Merkez Fuaye (458 m²)' : l === 'el' ? '3ος Όροφος — 9 Αίθουσες Εκθέσεων & Φουαγιέ (458 m²)' : 'Level 3 — 9 Exhibition Galleries & Central Foyer (458 m²)'}</option>
                                </select>
                            </label>
                            <label className="venue-quick-inquiry__field">
                                <span>{l === 'tr' ? 'Tahmini Katılımcı Sayısı' : l === 'el' ? 'Εκτιμώμενος Αριθμός Καλεσμένων' : 'Estimated Guests'}</span>
                                <select
                                    value={quickInquiry.guests}
                                    onChange={(e) => setQuickInquiry((prev) => ({ ...prev, guests: e.target.value }))}
                                >
                                    <option value="opt1">{l === 'tr' ? '50 kişiye kadar (Butik / VIP)' : l === 'el' ? 'Έως 50 άτομα (Boutique / VIP)' : 'Up to 50 guests (Boutique / VIP)'}</option>
                                    <option value="opt2">{l === 'tr' ? '50 – 160 kişi (Seminer / Gala)' : l === 'el' ? '50 – 160 άτομα (Σεμινάριο / Γκαλά)' : '50 – 160 guests (Seminar / Gala)'}</option>
                                    <option value="opt3">{l === 'tr' ? '160 – 350 kişi (Konferans / Büyük Sergi)' : l === 'el' ? '160 – 350 άτομα (Συνέδριο / Έκθεση)' : '160 – 350 guests (Conference / Exhibition)'}</option>
                                    <option value="opt4">{l === 'tr' ? '350 – 850 kişi (Tüm Bina / Çok Katlı)' : l === 'el' ? '350 – 850 άτομα (Ολόκληρο Κτίριο)' : '350 – 850 guests (Full Building)'}</option>
                                </select>
                            </label>
                        </div>
                        <div className="venue-quick-inquiry__actions">
                            <button type="submit" className="venue-cta__btn">
                                {l === 'tr' ? 'Talep Formuna Devam Et →' : l === 'el' ? 'Συνέχεια στη Φόρμα Αιτήματος →' : 'Continue to Inquiry Form →'}
                            </button>
                            <Link to={localizePath('/gecmis-etkinlikler')} className="venue-quick-inquiry__secondary">
                                {l === 'tr' ? 'Geçmiş Etkinlik ve Sergileri İnceleyin →' : l === 'el' ? 'Δείτε Παρελθούσες Εκδηλώσεις & Εκθέσεις →' : 'Explore Past Events & Exhibitions →'}
                            </Link>
                        </div>
                    </form>

                    {/* Venue Hire FAQ */}
                    <div className="venue-faq">
                        <h3 className="venue-faq__title">
                            {l === 'tr'
                                ? 'Sıkça Sorulan Sorular'
                                : l === 'el'
                                  ? 'Συχνές Ερωτήσεις'
                                  : 'Frequently Asked Questions'}
                        </h3>
                        <div className="venue-faq__grid">
                            {faqItems.map((item, idx) => (
                                <div key={idx} className="venue-faq__item">
                                    <h4 className="venue-faq__q">{item.q[l]}</h4>
                                    <p className="venue-faq__a">{renderWithSimoneLink(item.a[l])}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CMS Venue Galleries */}
            <div className="venue-galleries">
                <h2 className="venue-galleries__title">
                    {lang === 'tr' ? 'Mekanlarımızdan Kareler' : lang === 'el' ? 'Στιγμιότυπα από τους Χώρους μας' : 'Glimpses of Our Venues'}
                </h2>

                {loading ? (
                    <div className="venue-galleries__loading">{lang === 'tr' ? 'Mekan özetleri yükleniyor…' : lang === 'el' ? 'Φόρτωση χώρων…' : 'Loading venue highlights…'}</div>
                ) : (
                    <div className="venue-galleries__grid">
                        {venues.map((venue) => (
                            <button
                                key={venue.id}
                                type="button"
                                className="venue-galleries__card"
                                onClick={() => {
                                    const lvl = Number(venue.level) || 1;
                                    setSelectedFloorLevel(lvl);
                                    document.getElementById('venue-floor-plan-tabs')?.scrollIntoView({
                                        behavior: 'smooth',
                                        block: 'start',
                                    });
                                }}
                            >
                                <img
                                    src={normalizeLegacyMediaUrl(venue.image_url) || '/placeholder.png'}
                                    alt={venue[`title_${l}`] || venue.title_en}
                                    className="venue-galleries__img"
                                    loading="lazy"
                                    width="480"
                                    height="270"
                                />
                                <h3 className="venue-galleries__card-title">{venue[`title_${l}`] || venue.title_en}</h3>
                                <p className="venue-galleries__card-desc">{venue[`description_${l}`] || venue.description_en}</p>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Closing call — highlights the historic prestige and architectural character of the venue */}
            <section className="venue-cta">
                <div className="venue-cta__inner">
                    <h2 className="venue-cta__title">
                        {lang === 'tr' ? 'Tarihin Prestiji ile Buluşun' : lang === 'el' ? 'Όπου η Ιστορία Συναντά το Κύρος' : 'Where History Meets Prestige'}
                    </h2>
                    <p className="venue-cta__text">
                        {lang === 'tr'
                            ? '19. yüzyıldan günümüze uzanan anıtsal neoklasik mimarisi, yüksek tavanlı salonları ve zamansız atmosferiyle Galata Rum Okulu Kültür Merkezi; uluslararası bienallerden çağdaş sanat sergilerine, prestijli konferanslardan seçkin davet ve lansmanlara kadar unutulmaz buluşmalara ev sahipliği yapar.'
                            : lang === 'el'
                                ? 'Με τη μνημειακή νεοκλασική αρχιτεκτονική του 19ου αιώνα, τις ψηλοτάβανες αίθουσες και τη διαχρονική της ατμόσφαιρα, η Αστική Σχολή Γαλατά – Πολιτιστικό Κέντρο αποτελεί στις μέρες μας έναν ξεχωριστό χώρο για διεθνείς μπιενάλε, εκθέσεις σύγχρονης τέχνης, συνέδρια υψηλού κύρους και εκλεκτές δεξιώσεις.'
                                : 'With its monumental 19th-century neoclassical architecture, high-ceilinged halls, and timeless atmosphere, the Galata Greek School Cultural Center hosts unforgettable gatherings — from international biennials and contemporary art exhibitions to prestigious conferences and exclusive receptions.'}
                    </p>
                    <div className="venue-cta__actions">
                        <Link to={localizePath('/bize-ulasin')} className="venue-cta__btn">{t('hero.cta')}</Link>
                        <Link to={localizePath('/gecmis-etkinlikler')} className="venue-cta__phone">
                            {lang === 'tr' ? 'Geçmiş Etkinlikleri İnceleyin →' : lang === 'el' ? 'Δείτε Παρελθούσες Εκδηλώσεις →' : 'Explore Past Events →'}
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
