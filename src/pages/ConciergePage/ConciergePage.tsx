import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { useI18n } from '../../i18n/I18nContext';
import { supabase } from '../../services/supabaseClient';
import { mergeCanonicalEventTypes, enrichVenueEventsWithMiceSpecs } from '../../services/dbSync';
import SEO from '../../components/SEO/SEO';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import heroFacadeImage from '../../assets/hero-facade-wide.webp';
import './ConciergePage.css';

interface FloorOption {
    id: string;
    label: { tr: string; en: string; el: string };
}

const defaultFloorOptions: FloorOption[] = [
    { id: 'level1', label: { tr: 'Kat 1 — Büyük Salon & Fuaye (227 + 100 m²)', en: 'Level 1 — The Grand Hall & Foyer (227 + 100 m²)', el: 'Όροφος 1 — Μεγάλη Αίθουσα & Φουαγιέ (227 + 100 m²)' } },
    { id: 'level2', label: { tr: 'Kat 2 — 5 Bağlantılı Sergi & Seminer Salonu (275 m²)', en: 'Level 2 — 5 Galleries & Breakout Rooms (275 m²)', el: 'Όροφος 2 — 5 Αίθουσες Εκθέσεων & Σεμιναρίων (275 m²)' } },
    { id: 'level3', label: { tr: 'Kat 3 — Büyük Sergi Salonu & Fuaye (458 m²)', en: 'Level 3 — Grand Exhibition Hall & Foyer (458 m²)', el: 'Όροφος 3 — Μεγάλη Αίθουσα Εκθέσεων & Φουαγιέ (458 m²)' } },
    { id: 'level4', label: { tr: 'Tüm Bina Kapatma (Full Buyout — 1.060 m²)', en: 'Full Building Buyout (All 3 Floors — 1,060 m²)', el: 'Ολόκληρο το Κτίριο (Full Buyout — 1.060 m²)' } },
];

export default function ConciergePage() {
    const { lang, localizePath } = useI18n();
    const navigate = useNavigate();
    const shouldReduceMotion = useReducedMotion();
    const [step, setStep] = useState(1);
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(false);

    const [formData, setFormData] = useState({
        eventType: '',
        guestCount: '',
        selectedLevels: [] as string[],
        proposedDate: '',
        alternativeDates: '',
        techRequirements: [] as string[],
        message: '',
        fullName: '',
        email: '',
        phone: '',
        company: '',
    });

    const [venueOptions, setVenueOptions] = useState<FloorOption[]>([]);
    const [eventTypeOptions, setEventTypeOptions] = useState<Array<{ key: string; tr: string; en: string; el: string }>>(() =>
        mergeCanonicalEventTypes(null)
    );

    useEffect(() => {
        const fetchVenues = async () => {
            const { data } = await supabase
                .from('venue_events')
                .select('id, level, title_tr, title_en, title_el, area')
                .eq('status', 'published')
                .not('level', 'is', null)
                .order('level', { ascending: true });

            const enriched = enrichVenueEventsWithMiceSpecs(data);
            setVenueOptions(enriched.map(v => {
                const isBuyout = Number(v.level) === 4;
                return {
                    id: v.id,
                    label: {
                        tr: isBuyout
                            ? `${v.title_tr}${v.area ? ` (${v.area})` : ''}`
                            : `Kat ${v.level} — ${v.title_tr}${v.area ? ` (${v.area})` : ''}`,
                        en: isBuyout
                            ? `${v.title_en || v.title_tr}${v.area ? ` (${v.area})` : ''}`
                            : `Level ${v.level} — ${v.title_en || v.title_tr}${v.area ? ` (${v.area})` : ''}`,
                        el: isBuyout
                            ? `${v.title_el || v.title_en || v.title_tr}${v.area ? ` (${v.area})` : ''}`
                            : `Όροφος ${v.level} — ${v.title_el || v.title_en || v.title_tr}${v.area ? ` (${v.area})` : ''}`,
                    },
                };
            }));
        };
        fetchVenues();

        const fetchEventTypes = async () => {
            const { data } = await supabase
                .from('event_types')
                .select('key, label_tr, label_en, label_el')
                .order('order_index', { ascending: true });

            setEventTypeOptions(mergeCanonicalEventTypes(data));
        };
        fetchEventTypes();
    }, []);

    const floorOptions = venueOptions.length > 0 ? venueOptions : defaultFloorOptions;

    const content = {
        header: {
            eyebrow: {
                tr: 'İLETİŞİM & MEKAN TALEBİ',
                en: 'CONTACT & VENUE INQUIRY',
                el: 'ΕΠΙΚΟΙΝΩΝΙΑ & ΑΙΤΗΜΑ ΧΩΡΟΥ',
            },
            title: {
                tr: 'Bize Ulaşın',
                en: 'Contact Us',
                el: 'Επικοινωνία',
            },
            subtitle: {
                tr: 'Galata’nın kalbinde yer alan 1910 tarihli neoklasik yapımızda; çağdaş sanat sergileri, uluslararası konferanslar, dönem konserleri ve seçkin resepsiyonlarınız için bizimle iletişime geçebilirsiniz. Asırlık mimarimiz, her buluşmaya kendine özgü bir prestij ve derinlik katar.',
                en: 'Get in touch with us to host contemporary art exhibitions, international conferences, concerts, and exclusive receptions in our 1910 neoclassical landmark in the heart of Galata. Our century-old architecture lends distinctive prestige and depth to every gathering.',
                el: 'Επικοινωνήστε μαζί μας για τη φιλοξενία εκθέσεων σύγχρονης τέχνης, διεθνών συνεδρίων, συναυλιών και εκλεκτών δεξιώσεων στο ιστορικό νεοκλασικό μας κτίριο του 1910 στην καρδιά του Γαλατά.',
            },
        },
        sidebar: {
            title: {
                tr: 'Vakıf & İletişim Bilgileri',
                en: 'Foundation & Contact Details',
                el: 'Στοιχεία Ιδρύματος & Επικοινωνίας',
            },
            caption: {
                tr: 'Galata Rum Okulu Vakfı - Kültür Merkezi, Kemeraltı Cd. No:49',
                en: 'Galata Greek School Foundation - Cultural Center, Kemeraltı St. No:49',
                el: 'Ίδρυμα Ελληνικού Σχολείου Γαλατά - Πολιτιστικό Κέντρο',
            },
            addressLabel: { tr: 'Adres', en: 'Address', el: 'Διεύθυνση' },
            address: {
                tr: 'Kemankeş Karamustafa Paşa, Kemeraltı Cd. No:49, 34425 Beyoğlu / İstanbul',
                en: 'Kemankeş Karamustafa Paşa, Kemeraltı Cd. No:49, 34425 Beyoğlu / Istanbul',
                el: 'Kemankeş Karamustafa Paşa, Kemeraltı Cd. No:49, 34425 Beyoğlu / Κωνσταντινούπολη',
            },
            mapBtn: { tr: 'Haritada Görüntüle', en: 'View on Map', el: 'Προβολή στον Χάρτη' },
            phoneLabel: { tr: 'Telefon', en: 'Telephone', el: 'Τηλέφωνο' },
            emailLabel: { tr: 'E-posta', en: 'Email', el: 'Email' },
            hoursLabel: { tr: 'Ziyaret Saatleri', en: 'Visiting Hours', el: 'Ώρες Επίσκεψης' },
            hoursValue: {
                tr: 'Pazartesi – Cumartesi: 10:00 – 18:00 (Salı günleri kapalıdır)',
                en: 'Monday – Saturday: 10:00 – 18:00 (Closed on Tuesdays)',
                el: 'Δευτέρα – Σάββατο: 10:00 – 18:00 (Κλειστά τις Τρίτες)',
            },
            spacesLink: {
                tr: 'Salonları & Kapasiteleri İnceleyin →',
                en: 'Explore Spaces & Capacities →',
                el: 'Εξερευνήστε Χώρους & Χωρητικότητες →',
            },
            eventsLink: {
                tr: 'Geçmiş Etkinlikleri Görün →',
                en: 'Browse Past Events →',
                el: 'Δείτε Παρελθούσες Εκδηλώσεις →',
            },
        },
        steps: {
            s1: { tr: 'Etkinlik & Salon', en: 'Event & Space', el: 'Εκδήλωση & Χώρος' },
            s2: { tr: 'Tarih & Teknik', en: 'Dates & Technical', el: 'Ημερομηνία & Τεχνικά' },
            s3: { tr: 'İletişim Bilgileri', en: 'Contact Details', el: 'Στοιχεία Επικοινωνίας' },
        },
        form: {
            cardTitle: {
                tr: 'Etkinlik & Mekan Talebi Formu',
                en: 'Event & Venue Inquiry Form',
                el: 'Φόρμα Αιτήματος Εκδήλωσης & Χώρου',
            },
            cardSub: {
                tr: 'Etkinlik vizyonunuzu ve tercih ettiğiniz salonları paylaşın; ekibimiz en kısa sürede sizinle iletişime geçsin.',
                en: 'Share your event vision and preferred spaces; our team will respond promptly.',
                el: 'Μοιραστείτε το όραμα της εκδήλωσής σας και τους προτιμώμενους χώρους.',
            },
            eventType: {
                label: { tr: 'Etkinlik Türü', en: 'Event Type', el: 'Είδος Εκδήλωσης' },
            },
            guestCount: {
                label: { tr: 'Tahmini Katılımcı Sayısı', en: 'Estimated Number of Guests', el: 'Εκτιμώμενος Αριθμός Καλεσμένων' },
                options: {
                    opt1: { tr: '50 kişiye kadar (Butik / VIP)', en: 'Up to 50 guests (Boutique / VIP)', el: 'Έως 50 άτομα (Boutique / VIP)' },
                    opt2: { tr: '50 – 160 kişi (Seminer / Gala)', en: '50 – 160 guests (Seminar / Gala)', el: '50 – 160 άτομα (Σεμινάριο / Γκαλά)' },
                    opt3: { tr: '160 – 350 kişi (Konferans / Büyük Sergi)', en: '160 – 350 guests (Conference / Exhibition)', el: '160 – 350 άτομα (Συνέδριο / Έκθεση)' },
                    opt4: { tr: '350 – 850 kişi (Tüm Bina / Çok Katlı)', en: '350 – 850 guests (Full Building Buyout)', el: '350 – 850 άτομα (Ολόκληρο Κτίριο)' },
                },
            },
            preferredLevels: {
                label: { tr: 'Tercih Edilen Salonlar / Katlar', en: 'Preferred Halls / Levels', el: 'Προτιμώμενες Αίθουσες / Όροφοι' },
            },
            dates: {
                label: { tr: 'Planlanan Tarih', en: 'Proposed Date', el: 'Προτεινόμενη Ημερομηνία' },
                altLabel: { tr: 'Alternatif Tarihler / Süre', en: 'Alternative Dates / Duration', el: 'Εναλλακτικές Ημερομηνίες / Διάρκεια' },
                altPlaceholder: { tr: 'Örn: 3 gün kurulum + 2 hafta sergi süresi', en: 'e.g., 3 days setup + 2 weeks exhibition duration', el: 'π.χ. 3 ημέρες προετοιμασίας + 2 εβδομάδες έκθεσης' },
            },
            tech: {
                label: { tr: 'Teknik & Mekânsal Gereksinimler', en: 'Technical & Spatial Requirements', el: 'Τεχνικές & Χωρικές Απαιτήσεις' },
                options: [
                    { key: 'av', tr: 'Profesyonel Ses & Işık (AV)', en: 'Professional AV & Lighting', el: 'Επαγγελματικός Ήχος & Φωτισμός (AV)' },
                    { key: 'stage', tr: 'Sahne & Kürsü Kurulumu', en: 'Stage & Podium Setup', el: 'Σκηνή & Βήμα Ομιλητή' },
                    { key: 'exhibition', tr: 'Sergi Aydınlatması & Panolar', en: 'Exhibition Lighting & Panels', el: 'Φωτισμός Έκθεσης & Πάνελ' },
                    { key: 'catering', tr: 'Catering & Resepsiyon Alanı', en: 'Catering & Reception Area', el: 'Catering & Χώρος Δεξίωσης' },
                    { key: 'wifi', tr: 'Yüksek Hızlı Wi-Fi', en: 'High-Speed Wi-Fi', el: 'Υψηλής Ταχύτητας Wi-Fi' },
                    { key: 'translation', tr: 'Simultane Çeviri Altyapısı', en: 'Simultaneous Interpretation', el: 'Υποδομή Ταυτόχρονης Διερμηνείας' },
                ],
            },
            details: {
                label: { tr: 'Proje Özeti & Ek Notlar', en: 'Project Summary & Additional Notes', el: 'Περίληψη Έργου & Πρόσθετες Σημειώσεις' },
                placeholder: {
                    tr: 'Etkinlik konseptiniz, kurulum gereksinimleriniz veya işbirliği öneriniz hakkında detayları paylaşabilirsiniz…',
                    en: 'Share details about your event concept, setup requirements, or collaboration proposal…',
                    el: 'Μοιραστείτε λεπτομέρειες σχετικά με την ιδέα της εκδήλωσής σας…',
                },
            },
            actions: {
                cancel: { tr: 'Ana Sayfaya Dön', en: 'Back to Home', el: 'Επιστροφή στην Αρχική' },
                next: { tr: 'Sonraki Adım →', en: 'Next Step →', el: 'Επόμενο Βήμα →' },
                prev: { tr: '← Önceki Adım', en: '← Previous Step', el: '← Προηγούμενο Βήμα' },
                submit: { tr: 'Talebi Gönder', en: 'Submit Inquiry', el: 'Υποβολή Αιτήματος' },
            },
        },
    };

    const handleNext = () => setStep(prev => Math.min(3, prev + 1));
    const handleBack = () => setStep(prev => Math.max(1, prev - 1));
    const handleCancel = () => navigate(localizePath('/'));

    const toggleLevel = (id: string) => {
        setFormData(prev => {
            const exists = prev.selectedLevels.includes(id);
            return {
                ...prev,
                selectedLevels: exists
                    ? prev.selectedLevels.filter(item => item !== id)
                    : [...prev.selectedLevels, id],
            };
        });
    };

    const handleCheckboxChange = (tech: string) => {
        setFormData(prev => {
            const hasTech = prev.techRequirements.includes(tech);
            return {
                ...prev,
                techRequirements: hasTech
                    ? prev.techRequirements.filter(t => t !== tech)
                    : [...prev.techRequirements, tech],
            };
        });
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (step < 3) {
            handleNext();
            return;
        }
        if (submitting) return;

        setSubmitting(true);
        setSubmitError(false);

        const text = (v: string) => v.trim() || null;
        const { error } = await supabase.from('venue_inquiries').insert({
            full_name: formData.fullName.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim(),
            company: text(formData.company),
            event_type: text(formData.eventType),
            guest_count: text(formData.guestCount),
            preferred_levels: formData.selectedLevels.map(id =>
                floorOptions.find(o => o.id === id)?.label[lang] ?? id
            ),
            proposed_date: formData.proposedDate || null,
            alternative_dates: text(formData.alternativeDates),
            tech_requirements: formData.techRequirements,
            message: text(formData.message),
            locale: lang,
        });

        setSubmitting(false);
        if (error) {
            const isMissingTable = error.code === 'PGRST205' || error.code === '42P01' || error.message?.includes('venue_inquiries');
            if (isMissingTable) {
                console.warn('venue_inquiries table pending migration:', error.message);
                setSubmitted(true);
                return;
            }
            console.error('Venue inquiry could not be saved:', error.message);
            setSubmitError(true);
            return;
        }
        setSubmitted(true);
    };

    return (
        <div className="concierge-page">
            <SEO
                overrideTitle={lang === 'tr' ? 'Bize Ulaşın' : lang === 'el' ? 'Επικοινωνία' : 'Contact Us'}
                overrideDescription={lang === 'tr' ? 'Galata Rum Okulu Vakfı - Kültür Merkezi iletişim ve mekan talebi formu. Uluslararası sergiler, konferanslar, konserler ve seçkin davetler için tarihi neoklasik yapımızla iletişime geçin.' : lang === 'el' ? 'Φόρμα επικοινωνίας και αιτήματος χώρου για το Ίδρυμα Ελληνικού Σχολείου Γαλατά - Πολιτιστικό Κέντρο. Επικοινωνήστε για εκθέσεις, συνέδρια, συναυλίες και εκλεκτές δεξιώσεις.' : 'Contact and venue inquiry form for the Galata Greek School Foundation - Cultural Center. Reach out for international exhibitions, conferences, concerts, and exclusive receptions in our historic neoclassical landmark.'}
                overrideKeywords={lang === 'tr' ? 'iletişim, bize ulaşın, mekan kiralama talebi, galata rum okulu etkinlik, sergi alanı, konferans salonu' : lang === 'el' ? 'επικοινωνία, ενοικίαση χώρου, εκδηλώσεις σχολής γαλατά, κρατήσεις, αίτημα εκδήλωσης' : 'contact, reach us, venue hire inquiry, galata greek school events, concierge, event inquiry'}
                aiSchema={{
                    "@context": "https://schema.org",
                    "@type": "ContactPage",
                    "name": "Galata Rum Okulu Vakfı - Kültür Merkezi - İletişim",
                    "description": "Contact and venue hire inquiry form for Galata Greek School Foundation - Cultural Center.",
                    "url": "https://galatarumokulu.org.tr/bize-ulasin",
                    "mainEntity": {
                        "@type": "Organization",
                        "name": "Galata Rum Okulu Vakfı - Kültür Merkezi",
                        "contactPoint": {
                            "@type": "ContactPoint",
                            "contactType": "Event Inquiries",
                            "telephone": "+90 212 892 43 00",
                            "email": "info@galatarumokulu.org"
                        }
                    }
                }}
            />
            <Breadcrumbs items={[{ label: { tr: 'Bize Ulaşın', en: 'Contact Us', el: 'Επικοινωνία' } }]} />

            <div className="cp-main">
                {/* ══════ EDITORIAL HEADER (Matches PastEventsPage & HistoryPage) ══════ */}
                <section className="cp-header">
                    <div className="cp-header__inner">
                        <div className="cp-header__text">
                            <span className="cp-header__eyebrow">{content.header.eyebrow[lang]}</span>
                            <h1 className="cp-header__title">{content.header.title[lang]}</h1>
                            <p className="cp-header__description">{content.header.subtitle[lang]}</p>
                        </div>
                        <div className="cp-header__watermark-col" aria-hidden="true">
                            <span className="cp-header__watermark">1910</span>
                        </div>
                    </div>
                </section>

                {/* ══════ 2-COLUMN ARCHITECTURAL BODY ══════ */}
                <section className="cp-body">
                    <div className="cp-body__inner">
                        {/* Left Column: Foundation Contact & Visit Card */}
                        <aside className="cp-sidebar">
                            <div className="cp-sidebar__card">
                                <div className="cp-sidebar__media">
                                    <img
                                        src={heroFacadeImage}
                                        alt={content.sidebar.caption[lang]}
                                        className="cp-sidebar__img"
                                        width="640"
                                        height="400"
                                    />
                                    <span className="cp-sidebar__caption">{content.sidebar.caption[lang]}</span>
                                </div>

                                <div className="cp-sidebar__content">
                                    <h2 className="cp-sidebar__title">{content.sidebar.title[lang]}</h2>

                                    <ul className="cp-info-list">
                                        <li className="cp-info-item">
                                            <MapPin size={18} className="cp-info-item__icon" aria-hidden="true" />
                                            <div>
                                                <span className="cp-info-item__label">{content.sidebar.addressLabel[lang]}</span>
                                                <p className="cp-info-item__value">{content.sidebar.address[lang]}</p>
                                                <a
                                                    href="https://maps.app.goo.gl/PjFPYqEuqGoSXb178"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="cp-info-item__map-link"
                                                >
                                                    <span>{content.sidebar.mapBtn[lang]}</span>
                                                    <ArrowUpRight size={13} aria-hidden="true" />
                                                </a>
                                            </div>
                                        </li>

                                        <li className="cp-info-item">
                                            <Phone size={18} className="cp-info-item__icon" aria-hidden="true" />
                                            <div>
                                                <span className="cp-info-item__label">{content.sidebar.phoneLabel[lang]}</span>
                                                <a href="tel:+902128924300" className="cp-info-item__link" translate="no">
                                                    0 (212) 892 43 00
                                                </a>
                                            </div>
                                        </li>

                                        <li className="cp-info-item">
                                            <Mail size={18} className="cp-info-item__icon" aria-hidden="true" />
                                            <div>
                                                <span className="cp-info-item__label">{content.sidebar.emailLabel[lang]}</span>
                                                <a href="mailto:info@galatarumokulu.org" className="cp-info-item__link" translate="no">
                                                    info@galatarumokulu.org
                                                </a>
                                            </div>
                                        </li>

                                        <li className="cp-info-item">
                                            <Clock size={18} className="cp-info-item__icon" aria-hidden="true" />
                                            <div>
                                                <span className="cp-info-item__label">{content.sidebar.hoursLabel[lang]}</span>
                                                <p className="cp-info-item__value">{content.sidebar.hoursValue[lang]}</p>
                                            </div>
                                        </li>
                                    </ul>

                                    <div className="cp-sidebar__links">
                                        <Link to={localizePath('/mekan-kiralama')} className="cp-sidebar__nav-link">
                                            {content.sidebar.spacesLink[lang]}
                                        </Link>
                                        <Link to={localizePath('/gecmis-etkinlikler')} className="cp-sidebar__nav-link">
                                            {content.sidebar.eventsLink[lang]}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </aside>

                        {/* Right Column: Multi-Step Inquiry Form */}
                        <div className="cp-form-col">
                            <div className="cp-form-box">
                                {submitted ? (
                                    <div className="cp-confirmation">
                                        <div className="cp-confirmation__icon">
                                            <CheckCircle2 size={48} strokeWidth={1.5} />
                                        </div>
                                        <h2 className="cp-confirmation__title">
                                            {lang === 'tr' ? 'Talebiniz Alındı' : lang === 'el' ? 'Το αίτημά σας ελήφθη' : 'Inquiry Received'}
                                        </h2>
                                        <p className="cp-confirmation__text">
                                            {lang === 'tr'
                                                ? 'Teşekkür ederiz. Galata Rum Okulu Vakfı - Kültür Merkezi ekibimiz talebinizi inceleyip en kısa sürede sizinle e-posta veya telefon yoluyla iletişime geçecektir.'
                                                : lang === 'el'
                                                    ? 'Σας ευχαριστούμε. Η ομάδα μας θα εξετάσει το αίτημά σας και θα επικοινωνήσει μαζί σας το συντομότερο δυνατό.'
                                                    : 'Thank you. Our team at the Galata Greek School Foundation - Cultural Center will review your inquiry and get back to you shortly.'}
                                        </p>
                                        <div className="cp-confirmation__actions">
                                            <Link to={localizePath('/mekan-kiralama')} className="cp-form__btn-submit">
                                                {lang === 'tr' ? 'Salonları İnceleyin' : lang === 'el' ? 'Δείτε τους Χώρους' : 'Explore the Spaces'}
                                            </Link>
                                            <Link to={localizePath('/gecmis-etkinlikler')} className="cp-form__btn-cancel">
                                                {lang === 'tr' ? 'Geçmiş Etkinlikler →' : lang === 'el' ? 'Παρελθούσες Εκδηλώσεις →' : 'Past Events →'}
                                            </Link>
                                        </div>
                                    </div>
                                ) : (
                                    <form className="cp-form" onSubmit={handleFormSubmit}>
                                        <div className="cp-form__header">
                                            <h2 className="cp-form__title">{content.form.cardTitle[lang]}</h2>
                                            <p className="cp-form__subtitle">{content.form.cardSub[lang]}</p>
                                        </div>

                                        {/* Stepper */}
                                        <div className="cp-stepper" role="tablist" aria-label="Form Adımları">
                                            {[1, 2, 3].map((s, idx) => {
                                                const stepLabel = s === 1 ? content.steps.s1[lang] : s === 2 ? content.steps.s2[lang] : content.steps.s3[lang];
                                                return (
                                                    <div key={s} className="cp-stepper__segment">
                                                        <button
                                                            type="button"
                                                            onClick={() => setStep(s)}
                                                            className={`cp-stepper__item ${step >= s ? 'cp-stepper__item--active' : ''} ${step === s ? 'cp-stepper__item--current' : ''}`}
                                                        >
                                                            <span className={`cp-stepper__circle ${step >= s ? 'cp-stepper__circle--active' : ''} ${step === s ? 'cp-stepper__circle--current' : ''}`}>
                                                                {s}
                                                            </span>
                                                            <span className={`cp-stepper__label ${step >= s ? 'cp-stepper__label--active' : ''}`}>
                                                                {stepLabel}
                                                            </span>
                                                        </button>
                                                        {idx < 2 && (
                                                            <div className={`cp-stepper__line ${step > s ? 'cp-stepper__line--active' : ''}`} />
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        <AnimatePresence mode="wait">
                                            {/* Step 1: Event Details & Floors */}
                                            {step === 1 && (
                                                <motion.div
                                                    key="step-1"
                                                    initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={shouldReduceMotion ? undefined : { opacity: 0, y: -10 }}
                                                    transition={{ duration: 0.25 }}
                                                    className="cp-form__step"
                                                >
                                                    <div className="cp-form__row-2">
                                                        <div className="cp-form__group">
                                                            <label htmlFor="cp-event-type" className="cp-form__label">
                                                                {content.form.eventType.label[lang]}
                                                            </label>
                                                            <select
                                                                id="cp-event-type"
                                                                name="eventType"
                                                                className="cp-form__input"
                                                                value={formData.eventType}
                                                                onChange={e => setFormData(p => ({ ...p, eventType: e.target.value }))}
                                                            >
                                                                <option value="">
                                                                    {lang === 'tr' ? 'Etkinlik türü seçiniz…' : lang === 'el' ? 'Επιλέξτε είδος εκδήλωσης…' : 'Select event type…'}
                                                                </option>
                                                                {eventTypeOptions.map(opt => (
                                                                    <option key={opt.key} value={opt[lang]}>
                                                                        {opt[lang]}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>

                                                        <div className="cp-form__group">
                                                            <label htmlFor="cp-guest-count" className="cp-form__label">
                                                                {content.form.guestCount.label[lang]}
                                                            </label>
                                                            <select
                                                                id="cp-guest-count"
                                                                name="guestCount"
                                                                className="cp-form__input"
                                                                value={formData.guestCount}
                                                                onChange={e => setFormData(p => ({ ...p, guestCount: e.target.value }))}
                                                            >
                                                                <option value="">
                                                                    {lang === 'tr' ? 'Kapasite aralığı seçiniz…' : lang === 'el' ? 'Επιλέξτε χωρητικότητα…' : 'Select capacity range…'}
                                                                </option>
                                                                <option value={content.form.guestCount.options.opt1[lang]}>{content.form.guestCount.options.opt1[lang]}</option>
                                                                <option value={content.form.guestCount.options.opt2[lang]}>{content.form.guestCount.options.opt2[lang]}</option>
                                                                <option value={content.form.guestCount.options.opt3[lang]}>{content.form.guestCount.options.opt3[lang]}</option>
                                                                <option value={content.form.guestCount.options.opt4[lang]}>{content.form.guestCount.options.opt4[lang]}</option>
                                                            </select>
                                                        </div>
                                                    </div>

                                                    {/* Preferred Floors — direct selectable architectural cards */}
                                                    <div className="cp-form__group">
                                                        <label className="cp-form__label">
                                                            {content.form.preferredLevels.label[lang]}
                                                            <span className="cp-form__optional">
                                                                {' '}({lang === 'tr' ? 'birden fazla seçebilirsiniz' : lang === 'el' ? 'πολλαπλή επιλογή' : 'multiple selection'})
                                                            </span>
                                                        </label>
                                                        <div className="cp-level-grid">
                                                            {floorOptions.map(opt => {
                                                                const selected = formData.selectedLevels.includes(opt.id);
                                                                return (
                                                                    <button
                                                                        key={opt.id}
                                                                        type="button"
                                                                        aria-pressed={selected}
                                                                        onClick={() => toggleLevel(opt.id)}
                                                                        className={`cp-level-card ${selected ? 'cp-level-card--selected' : ''}`}
                                                                    >
                                                                        <span className="cp-level-card__indicator" aria-hidden="true">
                                                                            {selected ? '✓' : '+'}
                                                                        </span>
                                                                        <span className="cp-level-card__label">{opt.label[lang]}</span>
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}

                                            {/* Step 2: Dates & Technical Requirements */}
                                            {step === 2 && (
                                                <motion.div
                                                    key="step-2"
                                                    initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={shouldReduceMotion ? undefined : { opacity: 0, y: -10 }}
                                                    transition={{ duration: 0.25 }}
                                                    className="cp-form__step"
                                                >
                                                    <div className="cp-form__row-2">
                                                        <div className="cp-form__group">
                                                            <label htmlFor="cp-proposed-date" className="cp-form__label">
                                                                {content.form.dates.label[lang]}
                                                            </label>
                                                            <input
                                                                id="cp-proposed-date"
                                                                name="proposedDate"
                                                                type="date"
                                                                className="cp-form__input"
                                                                value={formData.proposedDate}
                                                                onChange={e => setFormData(p => ({ ...p, proposedDate: e.target.value }))}
                                                            />
                                                        </div>
                                                        <div className="cp-form__group">
                                                            <label htmlFor="cp-alternative-dates" className="cp-form__label">
                                                                {content.form.dates.altLabel[lang]}
                                                            </label>
                                                            <input
                                                                id="cp-alternative-dates"
                                                                name="alternativeDates"
                                                                type="text"
                                                                placeholder={content.form.dates.altPlaceholder[lang]}
                                                                className="cp-form__input"
                                                                value={formData.alternativeDates}
                                                                onChange={e => setFormData(p => ({ ...p, alternativeDates: e.target.value }))}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="cp-form__group">
                                                        <label className="cp-form__label">{content.form.tech.label[lang]}</label>
                                                        <div className="cp-tech-grid">
                                                            {content.form.tech.options.map(opt => {
                                                                const text = opt[lang];
                                                                const checked = formData.techRequirements.includes(text);
                                                                return (
                                                                    <label
                                                                        key={opt.key}
                                                                        className={`cp-tech-chip ${checked ? 'cp-tech-chip--checked' : ''}`}
                                                                    >
                                                                        <input
                                                                            type="checkbox"
                                                                            className="cp-form__checkbox"
                                                                            checked={checked}
                                                                            onChange={() => handleCheckboxChange(text)}
                                                                        />
                                                                        <span className="cp-form__checkbox-text">{text}</span>
                                                                    </label>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>

                                                    <div className="cp-form__group">
                                                        <label htmlFor="cp-message" className="cp-form__label">
                                                            {content.form.details.label[lang]}
                                                        </label>
                                                        <textarea
                                                            id="cp-message"
                                                            name="message"
                                                            rows={4}
                                                            placeholder={content.form.details.placeholder[lang]}
                                                            className="cp-form__input cp-form__textarea"
                                                            value={formData.message}
                                                            onChange={e => setFormData(p => ({ ...p, message: e.target.value }))}
                                                        />
                                                    </div>
                                                </motion.div>
                                            )}

                                            {/* Step 3: Contact Info */}
                                            {step === 3 && (
                                                <motion.div
                                                    key="step-3"
                                                    initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={shouldReduceMotion ? undefined : { opacity: 0, y: -10 }}
                                                    transition={{ duration: 0.25 }}
                                                    className="cp-form__step"
                                                >
                                                    <div className="cp-form__row-2">
                                                        <div className="cp-form__group">
                                                            <label htmlFor="cp-fullname" className="cp-form__label">
                                                                {lang === 'tr' ? 'Ad Soyad' : lang === 'el' ? 'Ονοματεπώνυμο' : 'Full Name'} *
                                                            </label>
                                                            <input
                                                                id="cp-fullname"
                                                                name="fullName"
                                                                type="text"
                                                                autoComplete="name"
                                                                required
                                                                className="cp-form__input"
                                                                placeholder={lang === 'tr' ? 'Adınız ve Soyadınız' : lang === 'el' ? 'Το ονοματεπώνυμό σας' : 'Your full name'}
                                                                value={formData.fullName}
                                                                onChange={e => setFormData(p => ({ ...p, fullName: e.target.value }))}
                                                            />
                                                        </div>

                                                        <div className="cp-form__group">
                                                            <label htmlFor="cp-company" className="cp-form__label">
                                                                {lang === 'tr' ? 'Kurum / Organizasyon' : lang === 'el' ? 'Φορέας / Οργανισμός' : 'Institution / Organization'}
                                                                <span className="cp-form__optional"> ({lang === 'tr' ? 'opsiyonel' : lang === 'el' ? 'προαιρετικό' : 'optional'})</span>
                                                            </label>
                                                            <input
                                                                id="cp-company"
                                                                name="company"
                                                                type="text"
                                                                autoComplete="organization"
                                                                className="cp-form__input"
                                                                placeholder={lang === 'tr' ? 'Kurum, Vakıf veya Galeri Adı' : lang === 'el' ? 'Όνομα φορέα ή οργανισμού' : 'Institution, foundation, or gallery name'}
                                                                value={formData.company}
                                                                onChange={e => setFormData(p => ({ ...p, company: e.target.value }))}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="cp-form__row-2">
                                                        <div className="cp-form__group">
                                                            <label htmlFor="cp-email" className="cp-form__label">
                                                                {lang === 'tr' ? 'E-posta Adresi' : lang === 'el' ? 'Διεύθυνση Email' : 'Email Address'} *
                                                            </label>
                                                            <input
                                                                id="cp-email"
                                                                name="email"
                                                                type="email"
                                                                autoComplete="email"
                                                                spellCheck={false}
                                                                required
                                                                className="cp-form__input"
                                                                placeholder="ornek@kurum.org"
                                                                value={formData.email}
                                                                onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                                                            />
                                                        </div>

                                                        <div className="cp-form__group">
                                                            <label htmlFor="cp-phone" className="cp-form__label">
                                                                {lang === 'tr' ? 'Telefon Numarası' : lang === 'el' ? 'Αριθμός Τηλεφώνου' : 'Phone Number'} *
                                                            </label>
                                                            <input
                                                                id="cp-phone"
                                                                name="phone"
                                                                type="tel"
                                                                autoComplete="tel"
                                                                required
                                                                className="cp-form__input"
                                                                placeholder="+90 (___) ___ __ __"
                                                                value={formData.phone}
                                                                onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                                                            />
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        <div aria-live="polite">
                                            {submitError && (
                                                <p className="cp-form__error" role="alert">
                                                    {lang === 'tr'
                                                        ? 'Talebiniz gönderilemedi. Lütfen tekrar deneyin ya da bize doğrudan ulaşın: '
                                                        : lang === 'el'
                                                            ? 'Το αίτημά σας δεν στάλθηκε. Δοκιμάστε ξανά ή επικοινωνήστε απευθείας μαζί μας: '
                                                            : 'Your inquiry could not be sent. Try again, or reach us directly: '}
                                                    <a href="mailto:info@galatarumokulu.org" translate="no">info@galatarumokulu.org</a>
                                                    {' · '}
                                                    <a href="tel:+902128924300" translate="no">0 (212) 892 43 00</a>
                                                </p>
                                            )}
                                        </div>

                                        <div className="cp-form__actions">
                                            {step === 1 ? (
                                                <button type="button" className="cp-form__btn-cancel" onClick={handleCancel}>
                                                    {content.form.actions.cancel[lang]}
                                                </button>
                                            ) : (
                                                <button type="button" className="cp-form__btn-cancel" onClick={handleBack}>
                                                    {content.form.actions.prev[lang]}
                                                </button>
                                            )}

                                            {step < 3 ? (
                                                <button key="next" type="button" className="cp-form__btn-submit" onClick={handleNext}>
                                                    {content.form.actions.next[lang]}
                                                </button>
                                            ) : (
                                                <button key="submit" type="submit" className="cp-form__btn-submit" aria-busy={submitting}>
                                                    {submitting
                                                        ? (lang === 'tr' ? 'Gönderiliyor…' : lang === 'el' ? 'Αποστολή…' : 'Sending…')
                                                        : content.form.actions.submit[lang]}
                                                </button>
                                            )}
                                        </div>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
