import { useI18n } from '../../i18n/I18nContext';
import './ConciergePage.css';

export default function ConciergePage() {
    const { lang } = useI18n();

    // Localized text dictionary for Concierge Form
    const content = {
        hero: {
            title1: { tr: 'Concierge', en: 'Concierge', el: 'Concierge' },
            title2: { tr: 'Inquiry', en: 'Inquiry', el: 'Inquiry' }, // Following Stitch design which uses italic Inquiry
            subtitle: {
                tr: 'Galata\'nın kalbinde yer alan tarihi neoklasik binamızda kültürel etkinliklerinize, küratörlü sergilerinize veya özel davetlerinize ev sahipliği yapın. Size özel kurgulanmış eşsiz bir atmosfer sunuyoruz.',
                en: 'Host your next cultural event, exhibition, or private gathering in the heart of Galata. Our historic neoclassical building offers a unique atmosphere for curated experiences.',
                el: 'Filokseniste tin epomeni politistiki sas ekdilosi, ekthesi i idiotiki sygkentsrotisi stin kardia tis Galatas. To istoriko neoklasikoktirio mas prosferei mia monadiki atmosfaira gia epimeleitimenes empeiries.'
            }
        },
        steps: {
            s1: { tr: 'Etkınlık', en: 'Event', el: 'Ekdilosi' },
            s2: { tr: 'Lojıstık', en: 'Logistics', el: 'Logistics' },
            s3: { tr: 'Iletısım', en: 'Contact', el: 'Epikoinonia' }
        },
        form: {
            eventType: {
                label: { tr: 'Etkınlık Turu', en: 'Event Type', el: 'Typos Ekdilosis' },
                options: {
                    opt1: { tr: 'Sanat Sergisi', en: 'Art Exhibition', el: 'Ekthesi Technis' },
                    opt2: { tr: 'Kurumsal Seminer', en: 'Corporate Seminar', el: 'Etaireiko Seminario' },
                    opt3: { tr: 'Ozel Resepsiyon', en: 'Private Reception', el: 'Idiotiki Deksiosi' },
                    opt4: { tr: 'Fotograf/Film Cekimi', en: 'Photo/Film Shoot', el: 'Fotografisi/Kinimatografisi' },
                    opt5: { tr: 'Performans / Konser', en: 'Performance / Concert', el: 'Parastasi / Synavlia' }
                }
            },
            guestCount: {
                label: { tr: 'Tahmını Mısafır Sayısı', en: 'Estimated Guest Count', el: 'Ektimomenos Arithmos Kalesmenon' },
                options: {
                    opt1: { tr: '20 kisiye kadar', en: 'Up to 20 guests', el: 'Eos 20 atoma' },
                    opt2: { tr: '20 - 50 kisi', en: '20 - 50 guests', el: '20 - 50 atoma' },
                    opt3: { tr: '50 - 100 kisi', en: '50 - 100 guests', el: '50 - 100 atoma' },
                    opt4: { tr: '100+ kisi', en: '100+ guests', el: '100+ atoma' }
                }
            },
            dates: {
                label: { tr: 'Onerılen Tarıhler', en: 'Proposed Dates', el: 'Proteinomenes Imerominies' },
                altPlaceholder: { tr: 'Alternatif tarihler veya sure', en: 'Alternative dates or duration', el: 'Enallaktikes imerominies i diarkeia' }
            },
            tech: {
                label: { tr: 'Teknık Gereksınımler', en: 'Technical Requirements', el: 'Technikes Apaitiseis' },
                opt1: { tr: 'AV Sistemi', en: 'AV System', el: 'Sistima AV' },
                opt2: { tr: 'Sahne', en: 'Stage', el: 'Skini' },
                opt3: { tr: 'Catering', en: 'Catering', el: 'Catering (Trofodosia)' },
                opt4: { tr: 'WiFi', en: 'WiFi', el: 'WiFi' }
            },
            details: {
                label: { tr: 'Mesaj / Ek Detaylar', en: 'Message / Additional Details', el: 'Minima / Prothetes Leptomereies' },
                placeholder: {
                    tr: 'Etkinliginizle ilgili vizyonunuzu bize anlatin...',
                    en: 'Tell us more about your vision for the event...',
                    el: 'Peste mas perissotera gia to orama sas gia tin ekdilosi...'
                }
            },
            actions: {
                cancel: { tr: 'Iptal', en: 'Cancel', el: 'Akyrosi' },
                next: { tr: 'Sonrakı Adım', en: 'Next Step', el: 'Epomeno Vima' }
            }
        }
    };

    return (
        <div className="concierge-page">
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
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCeM0s1Ob8FgiwJPvFrcM3ogRb-Vp6V55WGNO-Tfs6eTtKPiGXBjk1vashc505aftBofRsdlLhNTJyY9kgaPFZorsEC7ULQukVC5qqsQqpJ5ZDBwCx20WmFrE79YJWdeA9Zy8yqlouJJrfb_YEuCpiCecxhyI4dPdYtab3a6Uqi6yldBJ0VbSQuHmKEWukQ_JpvA4yqNK1UelASbjhm4Hu4IVEkZNPeEsQXDFRzEhyVrJ6Ioe9M4XjDBXbKnNV7xSMUPg0hAyrcCyA"
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
