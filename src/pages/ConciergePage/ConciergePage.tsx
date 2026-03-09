import { useState, useEffect } from 'react';
import { useI18n } from '../../i18n/I18nContext';
import { supabase } from '../../services/supabaseClient';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import './ConciergePage.css';

export default function ConciergePage() {
    const { lang } = useI18n();
    const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
    const [levelsOpen, setLevelsOpen] = useState(false);
    const [venueOptions, setVenueOptions] = useState<Array<{ id: string; label: { tr: string; en: string; el: string } }>>([]);

    // Default floor options as fallback if DB has no data with level info
    const defaultFloorOptions = [
        { id: 'level-1', label: { tr: 'Kat 1 — Büyük Salon', en: 'Floor 1 — Main Hall', el: 'Όροφος 1 — Κεντρική Αίθουσα' } },
        { id: 'level-2', label: { tr: 'Kat 2 — Sergi Salonu + Fuaye', en: 'Floor 2 — Exhibition Hall + Foyer', el: 'Όροφος 2 — Εκθεσιακός Χώρος + Φουαγιέ' } },
        { id: 'level-3', label: { tr: 'Kat 3 — Sergi Salonu + Fuaye', en: 'Floor 3 — Exhibition Hall + Foyer', el: 'Όροφος 3 — Εκθεσιακός Χώρος + Φουαγιέ' } },
    ];

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
                el: 'Φιλοξενήστε τις πολιτιστικές σας εκδηλώσεις, επιμελημένες εκθέσεις ή ιδιωτικές συγκεντρώσεις στο ιστορικό νεοκλασικό μας κτίριο στην καρδιά του Γαλατά. Προσφέρουμε μια μοναδική ατμόσφαιρα προσαρμοσμένη ειδικά για εσάς.'
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
                options: {
                    opt1: { tr: 'Sanat Sergisi', en: 'Art Exhibition', el: 'Έκθεση Τέχνης' },
                    opt2: { tr: 'Kurumsal Seminer', en: 'Corporate Seminar', el: 'Εταιρικό Σεμινάριο' },
                    opt3: { tr: 'Özel Resepsiyon', en: 'Private Reception', el: 'Ιδιωτική Δεξίωση' },
                    opt4: { tr: 'Fotoğraf/Film Çekimi', en: 'Photo/Film Shoot', el: 'Φωτογράφιση / Γύρισμα' },
                    opt5: { tr: 'Performans / Konser', en: 'Performance / Concert', el: 'Παράσταση / Συναυλία' }
                }
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
                    tr: 'Etkinliğinizle ilgili vizyonunuzu bize anlatın...',
                    en: 'Tell us about your vision for your event...',
                    el: 'Πείτε μας για το όραμά σας για την εκδήλωσή σας...'
                }
            },
            actions: {
                cancel: { tr: 'İptal', en: 'Cancel', el: 'Ακύρωση' },
                next: { tr: 'Sonraki Adım', en: 'Next Step', el: 'Επόμενο Βήμα' }
            }
        }
    };

    return (
        <div className="concierge-page" style={{ position: 'relative' }}>
            <Breadcrumbs items={[{ label: { tr: 'Bize Ulaşın', en: 'Contact Us', el: 'Επικοινωνία' } }]} />
            <main className="cp-main">
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
                                src="/images/homepage/detail-2.jpg"
                                alt="Venue Interior"
                                className="cp-hero__image"
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
                            <form className="cp-form" onSubmit={(e) => e.preventDefault()}>
                                <div className="cp-form__row-2">
                                    <div className="cp-form__group">
                                        <label className="cp-form__label">{content.form.eventType.label[lang]}</label>
                                        <select className="cp-form__input">
                                            <option>{content.form.eventType.options.opt1[lang]}</option>
                                            <option>{content.form.eventType.options.opt2[lang]}</option>
                                            <option>{content.form.eventType.options.opt3[lang]}</option>
                                            <option>{content.form.eventType.options.opt4[lang]}</option>
                                            <option>{content.form.eventType.options.opt5[lang]}</option>
                                        </select>
                                    </div>
                                    <div className="cp-form__group">
                                        <label className="cp-form__label">{content.form.guestCount.label[lang]}</label>
                                        <select className="cp-form__input">
                                            <option>{content.form.guestCount.options.opt1[lang]}</option>
                                            <option>{content.form.guestCount.options.opt2[lang]}</option>
                                            <option>{content.form.guestCount.options.opt3[lang]}</option>
                                            <option>{content.form.guestCount.options.opt4[lang]}</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Preferred Levels — optional multi-select */}
                                <div className="cp-form__group">
                                    <label className="cp-form__label">
                                        {content.form.preferredLevels.label[lang]}
                                        <span className="cp-form__optional"> ({lang === 'tr' ? 'opsiyonel' : lang === 'el' ? 'proairetiko' : 'optional'})</span>
                                    </label>
                                    <div className={`cp-form__multiselect ${levelsOpen ? 'cp-form__multiselect--open' : ''}`}>
                                        <button
                                            type="button"
                                            className="cp-form__multiselect-trigger"
                                            onClick={() => setLevelsOpen(!levelsOpen)}
                                        >
                                            <span className="cp-form__multiselect-value">
                                                {selectedLevels.length === 0
                                                    ? content.form.preferredLevels.placeholder[lang]
                                                    : selectedLevels.map(id =>
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
                                                            checked={selectedLevels.includes(opt.id)}
                                                            onChange={() => {
                                                                setSelectedLevels(prev =>
                                                                    prev.includes(opt.id)
                                                                        ? prev.filter(id => id !== opt.id)
                                                                        : [...prev, opt.id]
                                                                );
                                                            }}
                                                        />
                                                        <span className="cp-form__checkbox-text">{opt.label[lang]}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="cp-form__group">
                                    <label className="cp-form__label">{content.form.dates.label[lang]}</label>
                                    <div className="cp-form__row-2">
                                        <input type="date" className="cp-form__input" />
                                        <input type="text" placeholder={content.form.dates.altPlaceholder[lang]} className="cp-form__input" />
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
                                                <input type="checkbox" className="cp-form__checkbox" />
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
                                    ></textarea>
                                </div>

                                <div className="cp-form__actions">
                                    <button type="button" className="cp-form__btn-cancel">
                                        {content.form.actions.cancel[lang]}
                                    </button>
                                    <button type="submit" className="cp-form__btn-submit">
                                        {content.form.actions.next[lang]}
                                    </button>
                                </div>
                            </form>
                        </div>

                    </div>
                </section>
            </main>
        </div>
    );
}
