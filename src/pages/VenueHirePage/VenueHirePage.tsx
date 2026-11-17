import { useState, useEffect } from 'react';
import { supabase } from '../../services/supabaseClient';
import { enrichVenueEventsWithMiceSpecs } from '../../services/dbSync';
import { PRODUCTION_SITE_ORIGIN, VENUE_INFO } from '../../config/venueInfo';
import { Link } from 'react-router-dom';
import { useI18n } from '../../i18n/I18nContext';
import SEO from '../../components/SEO/SEO';
import FloorPlan from '../../components/FloorPlan/FloorPlan';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import './VenueHirePage.css';

export default function VenueHirePage() {
    const { lang, localizePath, t } = useI18n();
    const l = (lang || 'tr') as 'tr' | 'en' | 'el';
    const [venues, setVenues] = useState<any[]>(() => enrichVenueEventsWithMiceSpecs(null));
    const [loading, setLoading] = useState(true);

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
                tr: 'MICE, Kongre & Kurumsal Zirveler',
                en: 'MICE, Conferences & Corporate Summits',
                el: 'Συνέδρια MICE & Εταιρικές Σύνοδοι',
            },
            desc: {
                tr: 'Ana oturumlar (plenary) için 6,26 m tavan yüksekliğine sahip 1. Kat Çok Amaçlı Büyük Salon (250 kişi tiyatro düzeni) ve eşzamanlı paralel oturumlar (breakout rooms) için 2. ve 3. katlardaki 12 bağımsız salon ile tam kapsamlı MICE altyapısı.',
                en: 'Full-scale MICE infrastructure featuring the 6.26 m double-height Level 1 Grand Multipurpose Hall (250 guests in theater setup) for plenary keynotes, paired with 12 breakout and seminar rooms across Levels 2 and 3.',
                el: 'Ολοκληρωμένη υποδομή MICE με τη Μεγάλη Αίθουσα 1ου Ορόφου ύψους 6,26 m (250 άτομα σε θεατρική διάταξη) για κεντρικές ομιλίες και 12 ανεξάρτητες αίθουσες στους Ορόφους 2 και 3 για παράλληλες συνεδρίες.',
            },
        },
        {
            title: {
                tr: 'Marka Lansmanları, Basın & PR Davetleri',
                en: 'Brand Launches, Press Previews & PR Showcases',
                el: 'Παρουσιάσεις Επωνυμίας (Brand Launch) & PR',
            },
            desc: {
                tr: 'Küresel markalar, ürün lansmanları, basın toplantıları ve deneyim odaklı PR etkinlikleri için 1910 tarihli neoklasik mimari prestij, 3×63A trifaze AV enerji panoları ve simetrik fiber Wi-Fi 6 canlı yayın (live stream) hattı.',
                en: '1910 neoclassical architectural prestige for global brand launches, press previews, and experiential PR showcases, backed by 3×63A three-phase AV power panels and symmetric Fiber Wi-Fi 6 with a dedicated live-stream line.',
                el: 'Νεοκλασικό αρχιτεκτονικό κύρος του 1910 για παρουσιάσεις επωνυμίας, συνεντεύξεις τύπου και εκδηλώσεις PR, με τριφασική παροχή 3×63A AV και συμμετρικό Fiber Wi-Fi 6 για live streaming.',
            },
        },
        {
            title: {
                tr: 'Moda Defileleri, Sergiler & Kreatif Prodüksiyonlar',
                en: 'Fashion Shows, Biennials & Creative Productions',
                el: 'Επιδείξεις Μόδας, Μπιενάλε & Παραγωγές',
            },
            desc: {
                tr: '18. İstanbul Bienali ve 212 Photography Istanbul gibi uluslararası organizasyonlara ev sahipliği yapmış; 3,97 m – 6,26 m tavan yüksekliği, müzecilik ray aydınlatması ve 1.060 m² net alanıyla defile, sergi ve çekim prodüksiyonlarına hazır mekan.',
                en: 'Proven host venue for the 18th Istanbul Biennial and 212 Photography Istanbul, offering 1,060 m² of net space, 3.97 m – 6.26 m ceilings, and museum-grade track lighting for fashion shows, exhibitions, and editorial shoots.',
                el: 'Αποδεδειγμένος χώρος φιλοξενίας της 18ης Μπιενάλε Κωνσταντινούπολης και του 212 Photography Istanbul, με 1.060 m² καθαρού χώρου, οροφές 3,97 m – 6,26 m και μουσειακό φωτισμό για επιδείξεις μόδας και εκθέσεις.',
            },
        },
        {
            title: {
                tr: 'Gala Yemeği, Ödül Töreni & VIP Resepsiyonlar',
                en: 'Gala Dinners, Award Ceremonies & VIP Receptions',
                el: 'Δείπνα Γκαλά, Βραβεύσεις & VIP Δεξιώσεις',
            },
            desc: {
                tr: 'Tüm etkinlik katları (Buyout) kullanımında 850 kişiye kadar kokteyl ve 450 kişiye kadar gala yemeği kapasitesi; 1. kat servis mutfağı, iki yan açık hava avlusu ve teras katındaki bağımsız Simone Restaurant üzerinden doğrudan catering imkanı.',
                en: 'Up to 850 guests for standing cocktail receptions and 450 guests for seated gala dinners in full 3-floor buyout mode, supported by a Level 1 catering kitchen, twin open-air courtyards, and in-house catering options via rooftop Simone Restaurant.',
                el: 'Έως 850 άτομα για δεξιώσεις κοκτέιλ και 450 άτομα για επίσημο δείπνο γκαλά σε αποκλειστική χρήση 3 ορόφων, με κουζίνα εξυπηρέτησης, 2 εσωτερικές αυλές και δυνατότητα catering από το Simone Restaurant.',
            },
        },
    ];

    const faqItems = [
        {
            q: {
                tr: 'MICE ve marka etkinlikleri için toplam kiralanabilir alan ve maksimum kapasite nedir?',
                en: 'What is the total rentable event space and maximum capacity for MICE and brand events?',
                el: 'Ποιος είναι ο συνολικός διαθέσιμος χώρος και η μέγιστη χωρητικότητα για εκδηλώσεις MICE;',
            },
            a: {
                tr: 'Galata Rum Okulu, 1., 2. ve 3. etkinlik katlarında toplam 1.060 m² net (2.194 m² brüt) kiralanabilir alan sunar. Tüm etkinlik katlarının bütüncül kiralanmasında (Buyout) kokteyl düzeninde 850 kişi, tiyatro/konferans düzeninde 650 kişi, oturmalı gala düzeninde 450 kişi, sınıf düzeninde 300 kişi ve U-masa düzeninde 150 kişi ağırlanabilmektedir. (4. Kat vakıf ve dijital arşiv alanı olup kiralama kapsamı dışındadır.)',
                en: 'Galata Greek School offers 1,060 m² of net rentable event space (2,194 m² gross) across Levels 1, 2, and 3. In a full 3-floor buyout, the venue accommodates up to 850 guests for cocktail receptions, 650 in theater/conference setup, 450 for seated gala dinners, 300 in classroom setup, and 150 in boardroom setup. (Level 4 houses the Foundation Archive and is excluded from venue rental.)',
                el: 'Η Ελληνική Σχολή Γαλατά προσφέρει 1.060 m² καθαρού χώρου εκδηλώσεων στους Ορόφους 1, 2 και 3. Σε αποκλειστική χρήση (Buyout) φιλοξενεί έως 850 άτομα σε κοκτέιλ, 650 σε θεατρική διάταξη, 450 σε δείπνο γκαλά, 300 σε διάταξη τάξης και 150 σε διάταξη συνεδρίασης. (Ο 4ος όροφος στεγάζει το Αρχείο και εξαιρείται από τη μίσθωση.)',
            },
        },
        {
            q: {
                tr: 'Prodüksiyon, ses/ışık (AV), elektrik gücü ve 2. derece tarihi eser koruma kuralları nelerdir?',
                en: 'What are the AV production, power supply, and 2nd-degree listed heritage building rules?',
                el: 'Ποιες είναι οι τεχνικές προδιαγραφές ηλεκτρικής ισχύος, AV και προστασίας του διατηρητέου μνημείου Β΄ κατηγορίας;',
            },
            a: {
                tr: 'Galata Rum Okulu, 2. derece tescilli tarihi eser statüsünde koruma altında bir yapıdır; bu nedenle etkinlik öncesi tüm hazırlık, yükleme, dekor, ses/ışık (AV) ve sahne kurulum süreçlerinde tarihi dokuya karşı azami hassasiyet gösterilmesi zorunludur. Duvar, tavan, zemin ve özgün ahşap/taş yüzeylere çivi, vida, dübel veya yapıştırıcı uygulanamaz; tüm sahne, ışık ve sergi kurulumları zemine zarar vermeyen ground-support (zemin destekli) sistemler ve bağımsız modüler panolarla gerçekleştirilir. Teknik altyapıda 1. ve 3. katlarda 3×63A trifaze, 2. katta 3×32A trifaze AV enerji panoları, simetrik fiber Wi-Fi 6 ve çift yönlü engelli erişimli asansörler mevcuttur.',
                en: 'Galata Greek School is a officially registered 2nd-degree historic monument (2. derece tarihi eser); therefore, all pre-event preparations, load-in/load-out logistics, scenic design, and AV/staging setups must be executed with the utmost sensitivity and care toward the historic fabric. Nails, screws, anchors, or adhesives are strictly prohibited on walls, ceilings, floors, and original woodwork; all staging, lighting, and exhibition structures must use floor-protected, freestanding ground-support and non-invasive modular systems. Levels 1 and 3 provide 3×63A three-phase power panels and Level 2 provides a 3×32A three-phase panel, alongside symmetric Fiber Wi-Fi 6 and dual PRM elevators.',
                el: 'Η Ελληνική Σχολή Γαλατά είναι επίσημα χαρακτηρισμένο διατηρητέο ιστορικό μνημείο Β΄ κατηγορίας (2. derece tarihi eser)· συνεπώς, όλες οι προετοιμασίες, η φορτοεκφόρτωση και οι εγκαταστάσεις σκηνικών/AV απαιτούν μέγιστη προσοχή και ευαισθησία απέναντι στον ιστορικό ιστό. Απαγορεύονται αυστηρά οι επεμβάσεις (καρφιά, βίδες, κόλλες) σε τοίχους, οροφές και δάπεδα· όλες οι κατασκευές πραγματοποιούνται αποκλειστικά με επιδαπέδια αυτοφερόμενα συστήματα (ground-support). Οι Όροφοι 1 & 3 διαθέτουν τριφασικούς πίνακες 3×63A και ο 2ος Όροφος 3×32A.',
            },
        },
        {
            q: {
                tr: 'Gala yemekleri ve kurumsal davetlerde catering hizmeti nasıl sağlanır?',
                en: 'How is catering handled for corporate galas, brand launches, and receptions?',
                el: 'Πώς παρέχεται το catering για εταιρικά δείπνα γκαλά και δεξιώσεις;',
            },
            a: {
                tr: '1. katta profesyonel servis mutfağı (11,10 m²) ve iki açık hava fuaye avlusu (28 m² + 37 m²) yer almaktadır. Ayrıca binanın teras katında bağımsız olarak Pazartesi hariç her gün (Salı–Pazar 17.00–00.00) hizmet veren Simone Restaurant’tan (simoneistanbul.com) etkinlik ve lansmanlar için doğrudan üst düzey catering ve ikram hizmeti alınabilmektedir.',
                en: 'Level 1 includes a dedicated catering service kitchen (11.10 m²) and two open-air foyer courtyards (28 m² + 37 m²). Event organizers can also arrange bespoke culinary and cocktail catering directly from Simone Restaurant (simoneistanbul.com), which operates independently on the rooftop terrace Tuesday–Sunday from 17:00 to 00:00.',
                el: 'Ο 1ος όροφος διαθέτει επαγγελματική κουζίνα εξυπηρέτησης (11,10 m²) και δύο ανοιχτές αυλές (28 m² + 37 m²). Επιπλέον, παρέχεται δυνατότητα άμεσου catering υψηλής γαστρονομίας από το ανεξάρτητο Simone Restaurant (simoneistanbul.com) που λειτουργεί στην ταράτσα του κτιρίου Τρίτη–Κυριακή (17:00–00:00).',
            },
        },
        {
            q: {
                tr: 'Mekan keşfi (site visit), müsaitlik ve kurumsal teklif talebi nasıl oluşturulur?',
                en: 'How can MICE agencies and brands schedule a site inspection or request a proposal?',
                el: 'Πώς μπορούν τα γραφεία MICE και οι εταιρείες να προγραμματίσουν επίσκεψη ή να ζητήσουν προσφορά;',
            },
            a: {
                tr: 'Kemeraltı Caddesi No:25, Karaköy / Beyoğlu adresindeki binamız için teknik keşif (site visit), kat planı incelemesi ve özel bütçe teklifi taleplerinizi Bize Ulaşın sayfasındaki kurumsal form üzerinden, +90 212 244 86 36 numaralı telefondan veya info@galatarumokulu.org e-posta adresinden iletebilirsiniz.',
                en: 'MICE planners, brand teams, and production agencies can request a technical site inspection at Kemeraltı Caddesi No:25, Karaköy / Beyoğlu and a tailored rental proposal via our Contact Us inquiry form, by calling +90 212 244 86 36, or by emailing info@galatarumokulu.org.',
                el: 'Τα γραφεία MICE, οι εταιρείες και οι ομάδες παραγωγής μπορούν να προγραμματίσουν τεχνική αυτοψία στην οδό Kemeraltı No:25, Καράκιοϊ / Μπέγιογλου και να λάβουν προσφορά μέσω της φόρμας Επικοινωνίας, τηλεφωνικά στο +90 212 244 86 36 ή μέσω email στο info@galatarumokulu.org.',
            },
        },
    ];

    const pageUrl = `${PRODUCTION_SITE_ORIGIN}${localizePath('/mekan-kiralama')}`;

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
                                { "@type": "LocationFeatureSpecification", "name": "Connectivity & Broadcast", "value": "Symmetric Fiber Wi-Fi 6 & Dedicated Live-Stream Ethernet" },
                                { "@type": "LocationFeatureSpecification", "name": "Accessibility", "value": "Dual East & West PRM-Accessible Elevators" },
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
                                "https://tr.wikipedia.org/wiki/Galata_Rum_İlkokulu"
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
            <FloorPlan initialVenues={venues} externalLoading={loading} />

            {/* MICE, Brand Launch & Corporate Event Solutions + Capacity Matrix */}
            <section className="venue-mice-section" aria-labelledby="venue-mice-heading">
                <div className="venue-mice-section__inner">
                    <p className="venue-mice-section__eyebrow">
                        {l === 'tr'
                            ? 'MICE ACENTELERİ, KÜRESEL MARKALAR & KÜLTÜR KURUMLARI İÇİN'
                            : l === 'el'
                              ? 'ΓΙΑ ΓΡΑΦΕΙΑ MICE, ΔΙΕΘΝΕΙΣ ΕΠΩΝΥΜΙΕΣ & ΠΟΛΙΤΙΣΤΙΚΟΥΣ ΦΟΡΕΙΣ'
                              : 'FOR MICE AGENCIES, GLOBAL BRANDS & CULTURAL INSTITUTIONS'}
                    </p>
                    <h2 id="venue-mice-heading" className="venue-mice-section__title">
                        {l === 'tr'
                            ? 'MICE, Marka Lansmanı ve Kurumsal Etkinlik Çözümleri'
                            : l === 'el'
                              ? 'Λύσεις για Συνέδρια MICE, Παρουσιάσεις Επωνυμίας & Εταιρικές Εκδηλώσεις'
                              : 'MICE, Brand Launches & Corporate Event Solutions in Istanbul'}
                    </h2>
                    <p className="venue-mice-section__lead">
                        {l === 'tr'
                            ? 'İstanbul Karaköy Kemeraltı Caddesi’nde yükselen 1910 tarihli anıtsal neoklasik yapımız; uluslararası MICE acenteleri, kurumsal markalar, moda evleri ve kültür kurumları için 3 etkinlik katında toplam 1.060 m² net alan ve 850 kişiye varan ağırlama kapasitesi sunar.'
                            : l === 'el'
                              ? 'Το μνημειακό νεοκλασικό κτίριο του 1910 στην οδό Kemeraltı στο Καράκιοϊ προσφέρει 1.060 m² καθαρού χώρου σε 3 ορόφους εκδηλώσεων με χωρητικότητα έως 850 επισκέπτες για γραφεία MICE, διεθνή brands, οίκους μόδας και πολιτιστικούς οργανισμούς.'
                              : 'Rising on Kemeraltı Caddesi in Karaköy, our monumental 1910 neoclassical landmark provides 1,060 m² of net event space across 3 dedicated floors with capacity for up to 850 guests — tailored for MICE agencies, global brands, fashion houses, and cultural institutions.'}
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
                    <aside className="venue-heritage-notice" aria-label={l === 'tr' ? 'Tarihi Yapı Koruma ve Kurulum Hassasiyeti' : l === 'el' ? 'Προστασία Ιστορικού Μνημείου Β΄ Κατηγορίας' : '2nd-Degree Historic Monument & Setup Sensitivity'}>
                        <div className="venue-heritage-notice__badge">
                            {l === 'tr'
                                ? '2. DERECE TESCİLLİ TARİHİ ESER • KORUMA VE KURULUM HASSASİYETİ'
                                : l === 'el'
                                  ? 'ΔΙΑΤΗΡΗΤΕΟ ΜΝΗΜΕΙΟ Β΄ ΚΑΤΗΓΟΡΙΑΣ • ΕΥΑΙΣΘΗΣΙΑ ΠΡΟΕΤΟΙΜΑΣΙΑΣ & ΕΓΚΑΤΑΣΤΑΣΗΣ'
                                  : '2ND-DEGREE LISTED HISTORIC MONUMENT • SETUP & PRODUCTION SENSITIVITY'}
                        </div>
                        <p className="venue-heritage-notice__text">
                            {l === 'tr'
                                ? 'Galata Rum Okulu binası 2. derece tarihi eser statüsünde koruma altında bir kültür mirasıdır. MICE organizasyonları, lansmanlar, sergiler ve özel davetler kapsamında yapılacak tüm ön hazırlık, ekipman taşıma, dekor/sahne kurulumu ve söküm çalışmalarında tarihi mimari dokuya karşı azami hassasiyet gösterilmesi gerekmektedir. Özgün duvar, tavan, ahşap doğrama ve zemin yüzeylerine çivi, vida veya yapıştırıcı ile müdahale edilmez; tüm prodüksiyon uygulamaları zemini koruyan bağımsız (ground-support) sistemlerle gerçekleştirilir.'
                                : l === 'el'
                                  ? 'Το κτίριο της Ελληνικής Σχολής Γαλατά αποτελεί προστατευόμενο ιστορικό μνημείο Β΄ κατηγορίας (2. derece tarihi eser). Κατά τον σχεδιασμό και την προετοιμασία εκδηλώσεων MICE, παρουσιάσεων, εκθέσεων και δεξιώσεων, όλες οι ομάδες παραγωγής οφείλουν να επιδεικνύουν μέγιστη προσοχή και ευαισθησία κατά τη μεταφορά εξοπλισμού και την εγκατάσταση σκηνικών, χρησιμοποιώντας αποκλειστικά αυτοφερόμενα συστήματα (ground-support) χωρίς καμία φθορά στις ιστορικές επιφάνειες.'
                                  : 'Galata Greek School is a protected 2nd-degree registered historic monument (2. derece tarihi eser). All MICE agencies, brand teams, and production crews must exercise the highest level of sensitivity and care during pre-event preparations, load-in/load-out logistics, and technical staging. Direct drilling, nailing, or adhesive application on original walls, ceilings, woodwork, and historic floors is strictly prohibited; all setups must utilize floor-protected, freestanding ground-support systems.'}
                        </p>
                    </aside>

                    {/* Comparative Floor & Capacity Matrix Table (GEO & Featured Snippet Optimized) */}
                    <div className="venue-matrix-wrap">
                        <h3 className="venue-matrix__title">
                            {l === 'tr'
                                ? 'Kat Bazlı Kapasite ve Teknik Altyapı Karşılaştırma Tablosu'
                                : l === 'el'
                                  ? 'Συγκριτικός Πίνακας Χωρητικότητας & Τεχνικών Προδιαγραφών ανά Όροφο'
                                  : 'Floor-by-Floor Capacity & Technical Specifications Matrix'}
                        </h3>
                        <div className="venue-matrix__scroll">
                            <table className="venue-matrix__table">
                                <thead>
                                    <tr>
                                        <th>{l === 'tr' ? 'Etkinlik Katı & Alan' : l === 'el' ? 'Όροφος & Χώρος' : 'Event Level & Space'}</th>
                                        <th>{l === 'tr' ? 'Net Alan' : l === 'el' ? 'Καθαρό Εμβαδόν' : 'Net Area'}</th>
                                        <th>{l === 'tr' ? 'Kokteyl' : l === 'el' ? 'Κοκτέιλ' : 'Cocktail'}</th>
                                        <th>{l === 'tr' ? 'Tiyatro / Konferans' : l === 'el' ? 'Θέατρο / Συνέδριο' : 'Theater'}</th>
                                        <th>{l === 'tr' ? 'Gala Yemeği' : l === 'el' ? 'Δείπνο Γκαλά' : 'Gala Dinner'}</th>
                                        <th>{l === 'tr' ? 'Sınıf / U-Masa' : l === 'el' ? 'Τάξη / Π' : 'Classroom / Boardroom'}</th>
                                        <th>{l === 'tr' ? 'Tavan & Enerji' : l === 'el' ? 'Ύψος & Ισχύς' : 'Ceiling & Power'}</th>
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
                                        <td>6.26 m • 3×63A</td>
                                    </tr>
                                    <tr>
                                        <td><strong>{l === 'tr' ? 'Kat 2 — 3 Sergi/Seminer Salonu, Fuaye & Balkon' : l === 'el' ? '2ος Όροφος — 3 Αίθουσες, Φουαγιέ & Εξώστης' : 'Level 2 — 3 Breakout/Exhibition Halls & Balcony'}</strong></td>
                                        <td>275 m²</td>
                                        <td>250</td>
                                        <td>140</td>
                                        <td>90</td>
                                        <td>100 / 75</td>
                                        <td>4.11 m • 3×32A</td>
                                    </tr>
                                    <tr>
                                        <td><strong>{l === 'tr' ? 'Kat 3 — 9 Sergi Salonu & Merkez Fuaye' : l === 'el' ? '3ος Όροφος — 9 Αίθουσες Εκθέσεων & Φουαγιέ' : 'Level 3 — 9 Exhibition Galleries & Central Foyer'}</strong></td>
                                        <td>458 m²</td>
                                        <td>450</td>
                                        <td>320</td>
                                        <td>220</td>
                                        <td>180 / 80</td>
                                        <td>3.97 m • 3×63A</td>
                                    </tr>
                                    <tr className="venue-matrix__row--highlight">
                                        <td><strong>{l === 'tr' ? 'Tüm Etkinlik Katları (Kat 1 + 2 + 3 Buyout)' : l === 'el' ? 'Όλοι οι Όροφοι Εκδηλώσεων (1 + 2 + 3 Buyout)' : 'All Event Floors Buyout (Levels 1 + 2 + 3)'}</strong></td>
                                        <td><strong>1.060 m²</strong></td>
                                        <td><strong>850</strong></td>
                                        <td><strong>650</strong></td>
                                        <td><strong>450</strong></td>
                                        <td><strong>300 / 150</strong></td>
                                        <td><strong>3.97–6.26 m • 2×63A + 32A</strong></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* B2B MICE & Brand Venue Hire FAQ */}
                    <div className="venue-faq">
                        <h3 className="venue-faq__title">
                            {l === 'tr'
                                ? 'MICE ve Marka Etkinlikleri — Sıkça Sorulan Sorular'
                                : l === 'el'
                                  ? 'Συχνές Ερωτήσεις για Εκδηλώσεις MICE & Επωνυμιών'
                                  : 'MICE & Brand Venue Hire — Frequently Asked Questions'}
                        </h3>
                        <div className="venue-faq__grid">
                            {faqItems.map((item, idx) => (
                                <div key={idx} className="venue-faq__item">
                                    <h4 className="venue-faq__q">{item.q[l]}</h4>
                                    <p className="venue-faq__a">{item.a[l]}</p>
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
                            <div key={venue.id} className="venue-galleries__card">
                                <img
                                    src={venue.image_url || '/placeholder.png'}
                                    alt={venue[`title_${l}`] || venue.title_en}
                                    className="venue-galleries__img"
                                    loading="lazy"
                                    width="480"
                                    height="270"
                                />
                                <h3 className="venue-galleries__card-title">{venue[`title_${l}`] || venue.title_en}</h3>
                                <p className="venue-galleries__card-desc">{venue[`description_${l}`] || venue.description_en}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Closing call — highlights the historic prestige and architectural character of the venue */}
            <section className="venue-cta">
                <div className="venue-cta__inner">
                    <h2 className="venue-cta__title">
                        {lang === 'tr' ? 'Tarihin Prestijiyle Buluşun' : lang === 'el' ? 'Όπου η Ιστορία Συναντά το Κύρος' : 'Where History Meets Prestige'}
                    </h2>
                    <p className="venue-cta__text">
                        {lang === 'tr'
                            ? '19. yüzyıldan günümüze uzanan anıtsal neoklasik mimarisi, yüksek tavanlı salonları ve zamansız atmosferiyle Galata Rum Okulu; uluslararası bienallerden çağdaş sanat sergilerine, prestijli konferanslardan seçkin davet ve lansmanlara kadar unutulmaz buluşmalara ev sahipliği yapar.'
                            : lang === 'el'
                                ? 'Με τη μνημειακή νεοκλασική αρχιτεκτονική του 19ου αιώνα, τις ψηλοτάβανες αίθουσες και τη διαχρονική του ατμόσφαιρα, η Σχολή Γαλατά φιλοξενεί αξέχαστες συναντήσεις — από διεθνείς μπιενάλε και εκθέσεις σύγχρονης τέχνης έως συνέδρια υψηλού κύρους και εκλεκτές δεξιώσεις.'
                                : 'With its monumental 19th-century neoclassical architecture, high-ceilinged halls, and timeless atmosphere, the Galata Greek School hosts unforgettable gatherings — from international biennials and contemporary art exhibitions to prestigious conferences and exclusive receptions.'}
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
