import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../../i18n/I18nContext';
import { supabase } from '../../services/supabaseClient';
import SEO from '../../components/SEO/SEO';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import galataLogo from '../../assets/galata-rum-okulu_logo.svg';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import './ConciergePage.css';

// Default floor options as fallback if DB has no data with level info
const defaultFloorOptions = [
    { id: 'level-1', label: { tr: 'Kat 1 — Büyük Salon', en: 'Floor 1 — Main Hall', el: 'Όροφος 1 — Κεντρική Αίθουσα' } },
    { id: 'level-2', label: { tr: 'Kat 2 — Sergi Salonu + Fuaye', en: 'Floor 2 — Exhibition Hall + Foyer', el: 'Όροφος 2 — Εκθεσιακός Χώρος + Φουαγιέ' } },
    { id: 'level-3', label: { tr: 'Kat 3 — Sergi Salonu + Fuaye', en: 'Floor 3 — Exhibition Hall + Foyer', el: 'Όροφος 3 — Εκθεσιακός Χώρος + Φουαγιέ' } },
];

export default function ConciergePage() {
    const navigate = useNavigate();
    const { lang, localizePath } = useI18n();
    const [levelsOpen, setLevelsOpen] = useState(false);
    const multiselectRef = useRef<HTMLDivElement>(null);
    const heroReveal = useScrollReveal<HTMLElement>({ threshold: 0.1, once: true });
    const formReveal = useScrollReveal<HTMLElement>({ threshold: 0.1, once: true });
    const [venueOptions, setVenueOptions] = useState<Array<{ id: string; label: { tr: string; en: string; el: string } }>>([]);
    const [eventTypeOptions, setEventTypeOptions] = useState<Array<{ tr: string; en: string; el: string }>>([]);
    const [preloaderActive, setPreloaderActive] = useState(() => {
        return !sessionStorage.getItem('contact_preloader_seen');
    });

    useEffect(() => {
        if (preloaderActive) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [preloaderActive]);

    useEffect(() => {
        if (!preloaderActive) return;
        const timer = setTimeout(() => {
            setPreloaderActive(false);
            sessionStorage.setItem('contact_preloader_seen', 'true');
        }, 3400);
        return () => clearTimeout(timer);
    }, [preloaderActive]);

    // Close multi-select dropdown on outside click
    useEffect(() => {
        if (!levelsOpen) return;
        const handleClickOutside = (e: MouseEvent) => {
            if (multiselectRef.current && !multiselectRef.current.contains(e.target as Node)) {
                setLevelsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [levelsOpen]);

    const [step, setStep] = useState(1);
    const [submitted, setSubmitted] = useState(false);
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
        company: ''
    });

    useEffect(() => {
        const fetchVenues = async () => {
            const { data } = await supabase
                .from('venue_events')
                .select('id, level, title_tr, title_en, title_el')
                .eq('status', 'published')
                .not('level', 'is', null)
                .order('level', { ascending: true });

            if (data && data.length > 0) {
                setVenueOptions(data.map(v => ({
                    id: `level-${v.level}`,
                    label: {
                        tr: `Kat ${v.level} — ${v.title_tr}`,
                        en: `Floor ${v.level} — ${v.title_en || v.title_tr}`,
                        el: `Όροφος ${v.level} — ${v.title_el || v.title_en || v.title_tr}`,
                    }
                })));
            } else {
                // Use defaults if DB returns nothing
                setVenueOptions(defaultFloorOptions);
            }
        };
        fetchVenues();
        const fetchEventTypes = async () => {
            const { data } = await supabase
                .from('event_types')
                .select('label_tr, label_en, label_el')
                .order('order_index', { ascending: true });
            if (data && data.length > 0) {
                setEventTypeOptions(data.map(row => ({
                    tr: row.label_tr,
                    en: row.label_en,
                    el: row.label_el,
                })));
            }
        };
        fetchEventTypes();
    }, []);

    const floorOptions = venueOptions.length > 0 ? venueOptions : defaultFloorOptions;

    // Localized text dictionary for Concierge Form
    const content = {
        hero: {
            title1: { tr: 'Concierge', en: 'Concierge', el: 'Concierge' },
            title2: { tr: 'Inquiry', en: 'Inquiry', el: 'Inquiry' }, // Following Stitch design which uses italic Inquiry
            subtitle: {
                tr: 'Galata\'nın kalbinde yer alan tarihi neoklasik binamızda kültürel etkinliklerinize, küratörlü sergilerinize veya özel davetlerinize ev sahipliği yapın. Size özel kurgulanmış eşsiz bir atmosfer sunuyoruz.',
                en: 'Host your cultural events, curated exhibitions, or private gatherings in our historic neoclassical building in the heart of Galata. We offer a unique atmosphere tailored specifically for you.',
                el: 'Φιλοξενήστε τις πολιτιστικές σας εκδηλώσεις, επιμελημένες εκθέσεις ή ιδιωτικές συγκεντρώσεις στο ιστορικό νεοκλασικό μας κτίριο στην καρδιά του Γαλατά, Προσφέρουμε μια μοναδική ατμόσφαιρα προσαρμοσμένη ειδικά για εσάς.'
            }
        },
        plan: {
            title: { tr: 'Etkinliğinizi Planlayın', en: 'Plan Your Event', el: 'Σχεδιάστε την Εκδήλωσή σας' },
            desc: {
                tr: 'Tarihi binamızda hayalinizdeki etkinliği gerçeğe dönüştürmek için formu doldurun. Concierge ekibimiz her detayı sizin için özenle planlayacaktır.',
                en: 'Fill out the form to bring your dream event to life in our historic building. Our concierge team will meticulously plan every detail for you.',
                el: 'Συμπληρώστε τη φόρμα για να κάνετε πραγματικότητα την εκδήλωση των ονείρων σας στο ιστορικό μας κτίριο. Η ομάδα concierge μας θα σχεδιάσει κάθε λεπτομέρεια για εσάς.'
            },
            features: [
                { icon: '🏛', text: { tr: 'Neoklasik Mimari', en: 'Neoclassical Architecture', el: 'Νεοκλασική Αρχιτεκτονική' } },
                { icon: '🎨', text: { tr: 'Küratörlü Sergi Alanları', en: 'Curated Exhibition Spaces', el: 'Επιμελημένοι Εκθεσιακοί Χώροι' } },
                { icon: '✨', text: { tr: 'Kişiye Özel Deneyim', en: 'Tailored Experience', el: 'Προσαρμοσμένη Εμπειρία' } }
            ]
        },
        steps: {
            s1: { tr: 'Etkinlik', en: 'Event', el: 'Εκδήλωση' },
            s2: { tr: 'Lojistik', en: 'Logistics', el: 'Logistics' },
            s3: { tr: 'İletişim', en: 'Contact', el: 'Επικοινωνία' }
        },
        form: {
            eventType: {
                label: { tr: 'Etkinlik Türü', en: 'Event Type', el: 'Είδος Εκδήλωσης' },
            },
            guestCount: {
                label: { tr: 'Tahmini Misafir Sayısı', en: 'Estimated Number of Guests', el: 'Εκτιμώμενος Αριθμός Καλεσμένων' },
                options: {
                    opt1: { tr: '20 kişiye kadar', en: 'Up to 20 people', el: 'Έως 20 άτομα' },
                    opt2: { tr: '20 - 50 kişi', en: '20 - 50 people', el: '20 - 50 άτομα' },
                    opt3: { tr: '50 - 100 kişi', en: '50 - 100 people', el: '50 - 100 άτομα' },
                    opt4: { tr: '100+ kişi', en: '100+ people', el: '100+ άτομα' }
                }
            },
            preferredLevels: {
                label: { tr: 'Tercih Edilen Katlar', en: 'Preferred Floors', el: 'Προτιμώμενοι Όροφοι' },
                placeholder: { tr: 'Kat seçiniz (opsiyonel)', en: 'Select levels (optional)', el: 'Επιλέξτε ορόφους (προαιρετικά)' },
                options: floorOptions
            },
            dates: {
                label: { tr: 'Önerilen Tarihler', en: 'Proposed Dates', el: 'Προτεινόμενες Ημερομηνίες' },
                altPlaceholder: { tr: 'Alternatif tarihler veya süre', en: 'Alternative dates or duration', el: 'Εναλλακτικές ημερομηνίες ή διάρκεια' }
            },
            tech: {
                label: { tr: 'Teknik Gereksinimler', en: 'Technical Requirements', el: 'Τεχνικές Απαιτήσεις' },
                opt1: { tr: 'AV Sistemi', en: 'AV System', el: 'Σύστημα AV' },
                opt2: { tr: 'Sahne', en: 'Stage', el: 'Σκηνή' },
                opt3: { tr: 'Catering', en: 'Catering', el: 'Catering' },
                opt4: { tr: 'WiFi', en: 'WiFi', el: 'WiFi' }
            },
            details: {
                label: { tr: 'Mesaj / Ek Detaylar', en: 'Message / Additional Details', el: 'Μήνυμα / Πρόσθετες Λεπτομέρειες' },
                placeholder: {
                    tr: 'Etkinliğinizle ilgili vizyonunuzu bize anlatın…',
                    en: 'Tell us about your vision for your event…',
                    el: 'Πείτε μας για το όραμά σας για την εκδήλωσή σας…'
                }
            },
            actions: {
                cancel: { tr: 'İptal', en: 'Cancel', el: 'Ακύρωση' },
                next: { tr: 'Sonraki Adım', en: 'Next Step', el: 'Επόμενο Βήμα' },
                prev: { tr: 'Önceki Adım', en: 'Previous Step', el: 'Προηγούμενο Βήμα' },
                submit: { tr: 'Talebi Gönder', en: 'Submit Inquiry', el: 'Υποβολή Αιτήματος' }
            }
        }
    };

    const handleNext = () => {
        setStep(prev => prev + 1);
    };

    const handleBack = () => {
        setStep(prev => prev - 1);
    };

    const handleCancel = () => {
        navigate(localizePath('/'));
    };

    const handleCheckboxChange = (tech: string) => {
        setFormData(prev => {
            const hasTech = prev.techRequirements.includes(tech);
            return {
                ...prev,
                techRequirements: hasTech 
                    ? prev.techRequirements.filter(t => t !== tech)
                    : [...prev.techRequirements, tech]
            };
        });
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Concierge booking submission:', formData);
        setSubmitted(true);
    };

    return (
        <div className="concierge-page" style={{ position: 'relative' }}>
            {/* ══════ PRELOADER ══════ */}
            <div className={`hp-preloader ${preloaderActive ? '' : 'hp-preloader--hidden'}`}>
                <div className="hp-preloader__decor" aria-hidden="true">
                    <svg className="hp-preloader__decor-blob hp-preloader__decor-blob--1" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                        <path fill="#e0f2fe" d="M45,-57C58,-48,68,-33,72,-16C76,1,74,19,66,33C58,47,43,58,26,64C9,70,-9,72,-26,67C-43,62,-58,50,-66,34C-74,18,-74,-2,-68,-20C-62,-38,-49,-54,-33,-62C-17,-70,2,-70,17,-70C32,-70,32,-66,45,-57Z" transform="translate(100 100)" />
                    </svg>
                    <svg className="hp-preloader__decor-blob hp-preloader__decor-blob--2" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                        <path fill="#fef3c7" d="M39,-48C51,-41,61,-28,65,-13C69,2,67,19,59,32C51,45,37,54,21,61C5,68,-13,73,-28,68C-43,63,-55,48,-61,31C-67,14,-67,-5,-61,-22C-55,-39,-43,-54,-28,-62C-13,-70,5,-71,21,-69C37,-67,27,-55,39,-48Z" transform="translate(100 100)" />
                    </svg>
                </div>
                <div className="hp-preloader__center">
                    <img src={galataLogo} alt="Galata Rum Okulu Logo" className="hp-preloader__logo" />
                    <h2 className="hp-preloader__title">Galata Rum Okulu</h2>
                    <h3 className="hp-preloader__subtitle-gold">{lang === 'tr' ? 'İletişim' : lang === 'el' ? 'Επικοινωνία' : 'Contact'}</h3>
                </div>
            </div>
            <SEO 
                overrideTitle={lang === 'tr' ? 'Bize Ulaşın' : lang === 'el' ? 'Επικοινωνία' : 'Contact Us'}
                overrideDescription={lang === 'tr' ? 'Galata Rum Okulu mekan kiralama talebi formu. Sergi, moda defilesi, kurumsal toplantı ve özel etkinlikler için iletişime geçin. Etkinliğiniz Rum arşivinin korunmasını destekler.' : lang === 'el' ? 'Φόρμα επικοινωνίας για ενοικίαση χώρου στη Σχολή Γαλατά. Επικοινωνήστε για εκθέσεις, επιδείξεις μόδας, εταιρικές και πολιτιστικές εκδηλώσεις. Η εκδήλωσή σας χρηματοδοτεί τη διατήρηση του ελληνικού αρχείου.' : 'Contact form for venue hire at Galata Greek School. Reach out for exhibitions, fashion shows, corporate events, and cultural gatherings. Your event funds the preservation of the Greek archive.'}
                overrideKeywords={lang === 'tr' ? 'iletişim, bize ulaşın, mekan kiralama talebi, galata rum okulu etkinlik, concierge, event inquiry' : lang === 'el' ? 'επικοινωνία, ενοικίαση χώρου, εκδηλώσεις σχολής γαλατά, κρατήσεις, αίτημα εκδήλωσης' : 'contact, reach us, venue hire inquiry, galata greek school events, concierge, event inquiry'}
                aiSchema={{
                    "@context": "https://schema.org",
                    "@type": "ContactPage",
                    "name": "Galata Rum Okulu - İletişim",
                    "description": "Contact and venue hire inquiry form for Galata Greek School.",
                    "url": "https://galatarumokulu.org.tr/bize-ulasin",
                    "mainEntity": {
                        "@type": "Organization",
                        "name": "Galata Rum Okulu",
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
            <main className="cp-main">
                {/* ══════ HERO SECTION ══════ */}
                <section ref={heroReveal.ref} className={`cp-hero cp-reveal ${heroReveal.isVisible && !preloaderActive ? 'cp-reveal--visible' : ''}`}>
                    <div className="cp-hero__inner">
                        {/* Left Column — Contact Info */}
                        <div className="cp-hero__left">
                            <div className="cp-hero__accent-line" />
                            <h1 className="cp-hero__title">
                                {lang === 'tr' ? 'Bize Ulaşın' : lang === 'el' ? 'Επικοινωνία' : 'Contact Us'}
                            </h1>
                            <div className="cp-hero__contact-info">
                                <a href="mailto:info@galatarumokulu.org" className="cp-hero__contact-link">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><path d="M22 6l-10 7L2 6"/></svg>
                                    <span>info@galatarumokulu.org</span>
                                </a>
                                <a href="tel:+902128924300" className="cp-hero__contact-link">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 015.06 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L9.09 9.9a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>
                                    <span>0 (212) 892 43 00</span>
                                </a>
                            </div>
                            <div className="footer__socials" style={{ marginTop: 'var(--space-8)', justifyContent: 'flex-start' }}>
                                {/* Facebook */}
                                <a href="https://www.facebook.com/galatarumokulu/?locale=tr_TR" target="_blank" rel="noopener noreferrer" className="footer__social-circle" aria-label="Facebook"><svg width="10" height="18" viewBox="0 0 10 18" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M2.26125 18V9.73468H0V6.65756H2.26125V3.97495C2.26125 0.941913 3.90375 0 7.425 0V3.1205C5.83875 3.1205 5.56875 3.5262 5.56875 4.54214V6.65756H9.72L8.91 9.73468H5.56875V18H2.26125Z" /></svg></a>
                                {/* X / Twitter */}
                                <a href="https://x.com/GalataRum" target="_blank" rel="noopener noreferrer" className="footer__social-circle" aria-label="X (Twitter)"><svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M9.4754 6.84888L15.3905 0H13.9882L8.85194 5.94073L4.7454 0H0L6.19532 8.87895L0 15.9981H1.40237L6.83226 9.71536L11.1685 15.9981H15.9139L9.4754 6.84888ZM7.54519 8.88998L6.9142 8.00032L1.90809 0.940177H4.06202L8.11586 6.65651L8.74685 7.54617L14.0041 14.9602H11.8501L7.54519 8.88998Z" /></svg></a>
                                {/* Instagram */}
                                <a href="https://www.instagram.com/galatarumokulu/" target="_blank" rel="noopener noreferrer" className="footer__social-circle" aria-label="Instagram"><svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M10 0C7.284 0 6.944 0.012 5.877 0.06C4.814 0.109 4.088 0.278 3.453 0.525C2.796 0.78 2.234 1.116 1.673 1.676C1.113 2.238 0.776 2.799 0.522 3.455C0.275 4.09 0.106 4.816 0.058 5.88C0.009 6.946 0 7.286 0 10C0 12.714 0.009 13.054 0.058 14.12C0.107 15.184 0.275 15.91 0.522 16.545C0.778 17.202 1.114 17.764 1.674 18.324C2.235 18.886 2.796 19.222 3.453 19.475C4.088 19.722 4.814 19.891 5.877 19.94C6.944 19.988 7.284 20 10 20C12.716 20 13.056 19.988 14.123 19.94C15.186 19.891 15.912 19.722 16.547 19.475C17.204 19.221 17.766 18.884 18.327 18.324C18.887 17.763 19.224 17.201 19.478 16.545C19.725 15.91 19.894 15.184 19.942 14.12C19.991 13.054 20 12.714 20 10C20 7.286 19.991 6.946 19.942 5.88C19.893 4.816 19.725 4.09 19.478 3.455C19.223 2.798 18.887 2.236 18.327 1.676C18.766 1.115 17.204 0.778 16.547 0.525C15.912 0.278 15.186 0.109 14.123 0.06C13.056 0.012 12.716 0 10 0ZM10 1.802C12.668 1.802 12.984 1.812 14.041 1.86C14.981 1.903 15.5 2.067 15.847 2.202C16.307 2.381 16.634 2.592 16.978 2.936C17.322 3.28 17.534 3.608 17.712 4.067C17.848 4.415 18.01 4.933 18.055 5.874C18.102 6.93 18.113 7.247 18.113 9.916C18.113 12.585 18.102 12.902 18.055 13.957C18.01 14.898 17.848 15.417 17.712 15.764C17.534 16.223 17.322 16.551 16.978 16.895C16.634 17.239 16.307 17.45 15.847 17.629C15.5 17.765 14.981 17.928 14.041 17.971C12.984 18.019 12.668 18.03 10 18.03C7.332 18.03 7.016 18.019 5.959 17.971C5.019 17.928 4.5 17.765 4.153 17.629C3.693 17.45 3.366 17.239 3.022 16.895C2.678 16.551 2.466 16.223 2.288 15.764C2.152 15.417 1.99 14.898 1.945 13.957C1.898 12.902 1.887 12.585 1.887 9.916C1.887 7.247 1.898 6.93 1.945 5.874C1.99 4.933 2.152 4.415 2.288 4.067C2.466 3.608 2.678 3.28 3.022 2.936C3.366 2.592 3.693 2.381 4.153 2.202C4.5 2.067 5.019 1.903 5.959 1.86C7.016 1.812 7.332 1.802 10 1.802ZM10 4.865C7.164 4.865 4.865 7.164 4.865 10C4.865 12.836 7.164 15.135 10 15.135C12.836 15.135 15.135 12.836 15.135 10C15.135 7.164 12.836 4.865 10 4.865ZM10 13.333C8.159 13.333 6.667 11.841 6.667 10C6.667 8.159 8.159 6.667 10 6.667C11.841 6.667 13.333 8.159 13.333 10C13.333 11.841 11.841 13.333 10 13.333ZM15.334 3.466C15.334 4.128 14.796 4.666 14.133 4.666C13.47 4.666 12.933 4.128 12.933 3.466C12.933 2.803 13.47 2.266 14.133 2.266C14.796 2.266 15.334 2.803 15.334 3.466Z" /></svg></a>
                            </div>
                        </div>

                        {/* Right Column — Concierge Inquiry Text */}
                        <div className="cp-hero__right">
                            <h2 className="cp-hero__title-italic">
                                {content.hero.title1[lang]} <br />
                                <span className="cp-hero__title-normal">{content.hero.title2[lang]}</span>
                            </h2>
                            <p className="cp-hero__subtitle">
                                {content.hero.subtitle[lang]}
                            </p>
                        </div>
                    </div>
                </section>

                {/* ══════ FORM SECTION ══════ */}
                <section ref={formReveal.ref} className={`cp-form-section cp-reveal ${formReveal.isVisible && !preloaderActive ? 'cp-reveal--visible' : ''}`}>
                    <div className="cp-form-layout">
                        {/* Left — Plan Info Sidebar */}
                        <div className="cp-form-sidebar">
                            <div className="cp-form-sidebar__accent" />
                            <h2 className="cp-form-sidebar__title">{content.plan.title[lang]}</h2>
                            <p className="cp-form-sidebar__desc">{content.plan.desc[lang]}</p>
                            <ul className="cp-form-sidebar__features">
                                {content.plan.features.map((f, i) => (
                                    <li key={i} className="cp-form-sidebar__feature">
                                        <span className="cp-form-sidebar__feature-icon">{f.icon}</span>
                                        <span>{f.text[lang]}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Right — Form */}
                        <div className="cp-form-box">
                            {submitted ? (
                                <div className="cp-confirmation" style={{ textAlign: 'center', padding: '64px var(--space-6)' }}>
                                    <div style={{ fontSize: '3.5rem', color: 'var(--color-brass-gold)', marginBottom: '24px' }}>✓</div>
                                    <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '16px', color: 'var(--color-ink)' }}>
                                        {lang === 'tr' ? 'Talebiniz Alındı' : lang === 'el' ? 'Το αίτημά σας ελήφθη' : 'Inquiry Received'}
                                    </h2>
                                    <p style={{ fontSize: '1.1rem', opacity: 0.8, maxWidth: '480px', margin: '0 auto', lineHeight: '1.6', color: 'var(--color-inscription)' }}>
                                        {lang === 'tr' 
                                            ? 'Teşekkür ederiz. Concierge ekibimiz talebinizi inceleyip en kısa sürede sizinle e-posta veya telefon yoluyla iletişime geçecektir.' 
                                            : lang === 'el' 
                                                ? 'Σας ευχαριστούμε. Η ομάδα concierge θα εξετάσει το αίτημά σας και θα επικοινωνήσει μαζί σας το συντομότερο δυνατό.' 
                                                : 'Thank you. Our concierge team will review your request and get back to you shortly via email or phone.'}
                                    </p>
                                </div>
                            ) : (
                                <form className="cp-form" onSubmit={handleFormSubmit}>
                                    {/* Stepper */}
                                    <div className="cp-stepper">
                                        <div className="cp-stepper__item">
                                            <div className={`cp-stepper__circle ${step >= 1 ? 'cp-stepper__circle--active' : ''} ${step === 1 ? 'cp-stepper__circle--current' : ''}`}>1</div>
                                            <span className={`cp-stepper__label ${step >= 1 ? 'cp-stepper__label--active' : ''}`}>{content.steps.s1[lang]}</span>
                                        </div>
                                        <div className={`cp-stepper__line ${step >= 2 ? 'cp-stepper__line--active' : ''}`} />
                                        <div className="cp-stepper__item">
                                            <div className={`cp-stepper__circle ${step >= 2 ? 'cp-stepper__circle--active' : ''} ${step === 2 ? 'cp-stepper__circle--current' : ''}`}>2</div>
                                            <span className={`cp-stepper__label ${step >= 2 ? 'cp-stepper__label--active' : ''}`}>{content.steps.s2[lang]}</span>
                                        </div>
                                        <div className={`cp-stepper__line ${step >= 3 ? 'cp-stepper__line--active' : ''}`} />
                                        <div className="cp-stepper__item">
                                            <div className={`cp-stepper__circle ${step >= 3 ? 'cp-stepper__circle--active' : ''} ${step === 3 ? 'cp-stepper__circle--current' : ''}`}>3</div>
                                            <span className={`cp-stepper__label ${step >= 3 ? 'cp-stepper__label--active' : ''}`}>{content.steps.s3[lang]}</span>
                                        </div>
                                    </div>

                                    {/* Step 1: Event Details */}
                                    {step === 1 && (
                                        <div className="cp-form__step-1" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                                            <div className="cp-form__row-2">
                                                <div className="cp-form__group">
                                                    <label className="cp-form__label">{content.form.eventType.label[lang]}</label>
                                                    <select 
                                                        className="cp-form__input"
                                                        value={formData.eventType}
                                                        onChange={e => setFormData(p => ({ ...p, eventType: e.target.value }))}
                                                    >
                                                        <option value="">{lang === 'tr' ? 'Tür seçin…' : lang === 'el' ? 'Επιλέξτε τύπο…' : 'Select type…'}</option>
                                                        {eventTypeOptions.map((opt, idx) => (
                                                            <option key={idx} value={opt[lang]}>{opt[lang]}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="cp-form__group">
                                                    <label className="cp-form__label">{content.form.guestCount.label[lang]}</label>
                                                    <select 
                                                        className="cp-form__input"
                                                        value={formData.guestCount}
                                                        onChange={e => setFormData(p => ({ ...p, guestCount: e.target.value }))}
                                                    >
                                                        <option value="">{lang === 'tr' ? 'Kapasite seçin…' : lang === 'el' ? 'Επιλέξτε χωρητικότητα…' : 'Select capacity…'}</option>
                                                        <option value={content.form.guestCount.options.opt1[lang]}>{content.form.guestCount.options.opt1[lang]}</option>
                                                        <option value={content.form.guestCount.options.opt2[lang]}>{content.form.guestCount.options.opt2[lang]}</option>
                                                        <option value={content.form.guestCount.options.opt3[lang]}>{content.form.guestCount.options.opt3[lang]}</option>
                                                        <option value={content.form.guestCount.options.opt4[lang]}>{content.form.guestCount.options.opt4[lang]}</option>
                                                    </select>
                                                </div>
                                            </div>

                                            {/* Preferred Floors — optional multi-select */}
                                            <div className="cp-form__group">
                                                <label className="cp-form__label">
                                                    {content.form.preferredLevels.label[lang]}
                                                    <span className="cp-form__optional"> ({lang === 'tr' ? 'opsiyonel' : lang === 'el' ? 'προαιρετικό' : 'optional'})</span>
                                                </label>
                                                <div ref={multiselectRef} className={`cp-form__multiselect ${levelsOpen ? 'cp-form__multiselect--open' : ''}`}>
                                                    <button
                                                        type="button"
                                                        className="cp-form__multiselect-trigger"
                                                        onClick={() => setLevelsOpen(!levelsOpen)}
                                                    >
                                                        <span className="cp-form__multiselect-value">
                                                            {formData.selectedLevels.length === 0
                                                                ? content.form.preferredLevels.placeholder[lang]
                                                                : formData.selectedLevels.map(id =>
                                                                    content.form.preferredLevels.options.find(o => o.id === id)?.label[lang]
                                                                ).join(', ')}
                                                        </span>
                                                        <span className={`cp-form__multiselect-arrow ${levelsOpen ? 'cp-form__multiselect-arrow--up' : ''}`}>▾</span>
                                                    </button>
                                                    {levelsOpen && (
                                                        <div className="cp-form__multiselect-dropdown">
                                                            {content.form.preferredLevels.options.map(opt => (
                                                                <label key={opt.id} className="cp-form__multiselect-option">
                                                                    <input
                                                                        type="checkbox"
                                                                        className="cp-form__checkbox"
                                                                        checked={formData.selectedLevels.includes(opt.id)}
                                                                        onChange={() => {
                                                                            setFormData(prev => {
                                                                                const isSel = prev.selectedLevels.includes(opt.id);
                                                                                return {
                                                                                    ...prev,
                                                                                    selectedLevels: isSel
                                                                                        ? prev.selectedLevels.filter(id => id !== opt.id)
                                                                                        : [...prev.selectedLevels, opt.id]
                                                                                };
                                                                            });
                                                                        }}
                                                                    />
                                                                    <span className="cp-form__checkbox-text">{opt.label[lang]}</span>
                                                                </label>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Step 2: Logistics */}
                                    {step === 2 && (
                                        <div className="cp-form__step-2" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                                            <div className="cp-form__group">
                                                <label className="cp-form__label">{content.form.dates.label[lang]}</label>
                                                <div className="cp-form__row-2">
                                                    <input 
                                                        type="date" 
                                                        className="cp-form__input" 
                                                        value={formData.proposedDate}
                                                        onChange={e => setFormData(p => ({ ...p, proposedDate: e.target.value }))}
                                                    />
                                                    <input 
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
                                                <div className="cp-form__row-4">
                                                    {[
                                                        { key: 'opt1', text: content.form.tech.opt1[lang] },
                                                        { key: 'opt2', text: content.form.tech.opt2[lang] },
                                                        { key: 'opt3', text: content.form.tech.opt3[lang] },
                                                        { key: 'opt4', text: content.form.tech.opt4[lang] }
                                                    ].map(opt => (
                                                        <label key={opt.key} className="cp-form__checkbox-label group">
                                                            <input 
                                                                type="checkbox" 
                                                                className="cp-form__checkbox" 
                                                                checked={formData.techRequirements.includes(opt.text)}
                                                                onChange={() => handleCheckboxChange(opt.text)}
                                                            />
                                                            <span className="cp-form__checkbox-text">{opt.text}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="cp-form__group">
                                                <label className="cp-form__label">{content.form.details.label[lang]}</label>
                                                <textarea
                                                    rows={4}
                                                    placeholder={content.form.details.placeholder[lang]}
                                                    className="cp-form__input"
                                                    value={formData.message}
                                                    onChange={e => setFormData(p => ({ ...p, message: e.target.value }))}
                                                ></textarea>
                                            </div>
                                        </div>
                                    )}

                                    {/* Step 3: Contact Info */}
                                    {step === 3 && (
                                        <div className="cp-form__step-3" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                                            <div className="cp-form__group">
                                                <label className="cp-form__label">
                                                    {lang === 'tr' ? 'Ad Soyad' : lang === 'el' ? 'Ονοματεπώνυμο' : 'Full Name'} *
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    className="cp-form__input"
                                                    placeholder={lang === 'tr' ? 'Adınız ve Soyadınız' : lang === 'el' ? 'Το ονοματεπώνυμό σας' : 'Your full name'}
                                                    value={formData.fullName}
                                                    onChange={e => setFormData(p => ({ ...p, fullName: e.target.value }))}
                                                />
                                            </div>
                                            <div className="cp-form__group">
                                                <label className="cp-form__label">
                                                    {lang === 'tr' ? 'E-posta Adresi' : lang === 'el' ? 'Διεύθυνση Email' : 'Email Address'} *
                                                </label>
                                                <input
                                                    type="email"
                                                    required
                                                    className="cp-form__input"
                                                    placeholder={lang === 'tr' ? 'ornek@email.com' : lang === 'el' ? 'example@email.com' : 'example@email.com'}
                                                    value={formData.email}
                                                    onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                                                />
                                            </div>
                                            <div className="cp-form__group">
                                                <label className="cp-form__label">
                                                    {lang === 'tr' ? 'Telefon Numarası' : lang === 'el' ? 'Αριθμός Τηλεφώνου' : 'Phone Number'} *
                                                </label>
                                                <input
                                                    type="tel"
                                                    required
                                                    className="cp-form__input"
                                                    placeholder={lang === 'tr' ? '+90 555 123 4567' : lang === 'el' ? '+30 690 123 4567' : '+90 555 123 4567'}
                                                    value={formData.phone}
                                                    onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                                                />
                                            </div>
                                            <div className="cp-form__group">
                                                <label className="cp-form__label">
                                                    {lang === 'tr' ? 'Kurum / Firma' : lang === 'el' ? 'Εταιρεία / Οργανισμός' : 'Organization / Company'} 
                                                    <span className="cp-form__optional"> ({lang === 'tr' ? 'opsiyonel' : lang === 'el' ? 'προαιρετικό' : 'optional'})</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    className="cp-form__input"
                                                    placeholder={lang === 'tr' ? 'Firma veya Kurum Adı' : lang === 'el' ? 'Όνομα εταιρείας ή οργανισμού' : 'Company or organization name'}
                                                    value={formData.company}
                                                    onChange={e => setFormData(p => ({ ...p, company: e.target.value }))}
                                                />
                                            </div>
                                        </div>
                                    )}

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
                                            <button type="button" className="cp-form__btn-submit" onClick={handleNext}>
                                                {content.form.actions.next[lang]}
                                            </button>
                                        ) : (
                                            <button type="submit" className="cp-form__btn-submit">
                                                {content.form.actions.submit[lang]}
                                            </button>
                                        )}
                                    </div>
                                </form>
                            )}
                        </div>

                    </div>
                </section>
            </main>
        </div>
    );
}
