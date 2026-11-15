import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../../i18n/I18nContext';
import { supabase } from '../../services/supabaseClient';
import SEO from '../../components/SEO/SEO';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
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
    const [venueOptions, setVenueOptions] = useState<Array<{ id: string; label: { tr: string; en: string; el: string } }>>([]);
    const [eventTypeOptions, setEventTypeOptions] = useState<Array<{ tr: string; en: string; el: string }>>([]);

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
            title1: { tr: 'İletişim &', en: 'Contact &', el: 'Επικοινωνία &' },
            title2: { tr: 'Mekan Talebi', en: 'Venue Inquiry', el: 'Αίτημα Χώρου' },
            subtitle: {
                tr: 'Galata\'nın kalbinde yer alan tarihi neoklasik yapımızda; çağdaş sanat sergileri, uluslararası konferanslar, dönem konserleri ve seçkin resepsiyonlarınız için bizimle iletişime geçebilirsiniz. Asırlık mimarimiz, her buluşmaya kendine özgü bir prestij ve derinlik katar.',
                en: 'Get in touch with us to host contemporary art exhibitions, international conferences, concerts, and exclusive receptions in our historic neoclassical landmark in the heart of Galata. Our century-old architecture lends distinctive prestige and depth to every gathering.',
                el: 'Επικοινωνήστε μαζί μας για τη φιλοξενία εκθέσεων σύγχρονης τέχνης, διεθνών συνεδρίων, συναυλιών και εκλεκτών δεξιώσεων στο ιστορικό νεοκλασικό μας κτίριο στην καρδιά του Γαλατά. Η αιωνόβια αρχιτεκτονική μας προσδίδει ξεχωριστό κύρος και βάθος σε κάθε συνάντηση.'
            }
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

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Enter inside an earlier step moves on; only the last step sends
        if (step < 3) {
            handleNext();
            return;
        }
        if (submitting) return;

        setSubmitting(true);
        setSubmitError(false);

        const text = (v: string) => v.trim() || null;
        // No .select(): visitors may insert an inquiry but are not allowed to read any back
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
        <div className="concierge-page" style={{ position: 'relative' }}>
            <SEO 
                overrideTitle={lang === 'tr' ? 'Bize Ulaşın' : lang === 'el' ? 'Επικοινωνία' : 'Contact Us'}
                overrideDescription={lang === 'tr' ? 'Galata Rum Okulu Vakfı - Kültür Merkezi iletişim ve mekan talebi formu. Uluslararası sergiler, konferanslar, konserler ve seçkin davetler için tarihi neoklasik yapımızla iletişime geçin.' : lang === 'el' ? 'Φόρμα επικοινωνίας και αιτήματος χώρου για το Ίδρυμα Ελληνικού Σχολείου Γαλατά - Πολιτιστικό Κέντρο. Επικοινωνήστε για εκθέσεις, συνέδρια, συναυλίες και εκλεκτές δεξιώσεις.' : 'Contact and venue inquiry form for the Galata Greek School Foundation - Cultural Center. Reach out for international exhibitions, conferences, concerts, and exclusive receptions in our historic neoclassical landmark.'}
                overrideKeywords={lang === 'tr' ? 'iletişim, bize ulaşın, mekan kiralama talebi, galata rum okulu etkinlik, concierge, event inquiry' : lang === 'el' ? 'επικοινωνία, ενοικίαση χώρου, εκδηλώσεις σχολής γαλατά, κρατήσεις, αίτημα εκδήλωσης' : 'contact, reach us, venue hire inquiry, galata greek school events, concierge, event inquiry'}
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
                {/* ══════ HERO SECTION ══════ */}
                <section className="cp-hero">
                    <div className="cp-hero__bg-accent" />
                    <div className="cp-hero__inner">
                        <div className="cp-hero__content">
                            <div className="cp-hero__accent-line" />
                            <h1 className="cp-hero__title">
                                {content.hero.title1[lang]} <br />
                                <span className="cp-hero__title-italic">{content.hero.title2[lang]}</span>
                            </h1>
                            <p className="cp-hero__subtitle">
                                {content.hero.subtitle[lang]}
                            </p>
                        </div>
                        <div className="cp-hero__image-wrapper">
                            <img
                                src="https://tvloakrlqazcadokliaf.supabase.co/storage/v1/object/public/media/venue/mz81jyod0nq_1773083709418.webp"
                                alt={lang === 'tr' ? 'Galata Rum Okulu ana salonu' : lang === 'el' ? 'Η κύρια αίθουσα της Σχολής Γαλατά' : 'The main hall of the Galata Greek School'}
                                className="cp-hero__image"
                                width="1200"
                                height="800"
                            />
                            <div className="cp-hero__pattern hidden-mobile" />
                        </div>
                    </div>
                </section>

                {/* ══════ FORM SECTION ══════ */}
                <section className="cp-form-section">
                    <div className="cp-form-container">
                        {/* FORM BOX */}
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
                                                    <label htmlFor="cp-event-type" className="cp-form__label">{content.form.eventType.label[lang]}</label>
                                                    <select 
                                                        id="cp-event-type"
                                                        name="eventType"
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
                                                    <label htmlFor="cp-guest-count" className="cp-form__label">{content.form.guestCount.label[lang]}</label>
                                                    <select 
                                                        id="cp-guest-count"
                                                        name="guestCount"
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
                                                <div className={`cp-form__multiselect ${levelsOpen ? 'cp-form__multiselect--open' : ''}`}>
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
                                                <label htmlFor="cp-proposed-date" className="cp-form__label">{content.form.dates.label[lang]}</label>
                                                <div className="cp-form__row-2">
                                                    <input 
                                                        id="cp-proposed-date"
                                                        name="proposedDate"
                                                        type="date" 
                                                        className="cp-form__input" 
                                                        value={formData.proposedDate}
                                                        onChange={e => setFormData(p => ({ ...p, proposedDate: e.target.value }))}
                                                    />
                                                    <input 
                                                        id="cp-alternative-dates"
                                                        name="alternativeDates"
                                                        type="text" 
                                                        aria-label={content.form.dates.altPlaceholder[lang]}
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
                                                <label htmlFor="cp-message" className="cp-form__label">{content.form.details.label[lang]}</label>
                                                <textarea
                                                    id="cp-message"
                                                    name="message"
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
                                                    placeholder={lang === 'tr' ? 'ornek@email.com' : lang === 'el' ? 'example@email.com' : 'example@email.com'}
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
                                                    placeholder={lang === 'tr' ? '+90 555 123 4567' : lang === 'el' ? '+30 690 123 4567' : '+90 555 123 4567'}
                                                    value={formData.phone}
                                                    onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                                                />
                                            </div>
                                            <div className="cp-form__group">
                                                <label htmlFor="cp-company" className="cp-form__label">
                                                    {lang === 'tr' ? 'Kurum / Firma' : lang === 'el' ? 'Εταιρεία / Οργανισμός' : 'Organization / Company'} 
                                                    <span className="cp-form__optional"> ({lang === 'tr' ? 'opsiyonel' : lang === 'el' ? 'προαιρετικό' : 'optional'})</span>
                                                </label>
                                                <input
                                                    id="cp-company"
                                                    name="company"
                                                    type="text"
                                                    autoComplete="organization"
                                                    className="cp-form__input"
                                                    placeholder={lang === 'tr' ? 'Firma veya Kurum Adı' : lang === 'el' ? 'Όνομα εταιρείας ή οργανισμού' : 'Company or organization name'}
                                                    value={formData.company}
                                                    onChange={e => setFormData(p => ({ ...p, company: e.target.value }))}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Never claim success when the inquiry was not saved */}
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
                </section>
            </div>
        </div>
    );
}
