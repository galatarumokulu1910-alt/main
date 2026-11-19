import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../../i18n/I18nContext';
import { VENUE_INFO } from '../../config/venueInfo';
import { submitNewsletterSubscription } from '../../services/formSubmissionService';
import galataLogo from '../../assets/galata-rum-okulu_logo.svg';
import './Footer.css';

const footerContent = {
    brandName: VENUE_INFO.school.name,
    newsletter: {
        desc: {
            tr: 'Etkinliklerimizden haberdar olmak için bültene abone olun:',
            en: 'Subscribe to our newsletter to stay updated on our events:',
            el: 'Εγγραφείτε στο ενημερωτικό μας δελτίο για να ενημερώνεστε για τις εκδηλώσεις μας:',
        },
        placeholder: { tr: 'E-posta adresiniz…', en: 'Your email address…', el: 'Η διεύθυνση email σας…' },
        consent: {
            tr: 'KVKK ve Gizlilik Politikası kapsamında e-bülten gönderimini kabul ediyorum. Dilediğiniz zaman abonelikten çıkabilirsiniz.',
            en: 'I agree to receive newsletter updates under the Privacy Policy. You may unsubscribe at any time.',
            el: 'Συμφωνώ να λαμβάνω ενημερωτικά δελτία σύμφωνα με την Πολιτική Απορρήτου. Μπορείτε να διαγραφείτε ανά πάσα στιγμή.',
        },
        btn: { tr: 'Abone Ol', en: 'Subscribe', el: 'Εγγραφή' },
        submittingBtn: { tr: 'Kaydediliyor…', en: 'Subscribing…', el: 'Εγγραφή…' },
        success: {
            tr: 'Bülten aboneliği talebiniz kaydedildi.',
            en: 'Your newsletter subscription has been recorded.',
            el: 'Η εγγραφή σας στο ενημερωτικό δελτίο καταχωρήθηκε.',
        },
        alreadySubscribed: {
            tr: 'Bu e-posta adresi bülten listemizde zaten kayıtlıdır.',
            en: 'This email address is already registered for our newsletter.',
            el: 'Αυτή η διεύθυνση email είναι ήδη εγγεγραμμένη στο ενημερωτικό δελτίο.',
        },
        errorFallback: {
            tr: 'Çevrimiçi bülten kaydı şu anda tamamlanamadı. Bülten listesine eklenmek için doğrudan e-posta gönderebilirsiniz:',
            en: 'Online newsletter registration could not be completed at this moment. You may subscribe directly via email:',
            el: 'Η ηλεκτρονική εγγραφή δεν ολοκληρώθηκε. Μπορείτε να εγγραφείτε απευθείας μέσω email:',
        },
    },
    hours: {
        title: { tr: 'Ziyaret Günleri', en: 'Visiting Days', el: 'Ημέρες Επίσκεψης' },
    },
    sponsor: {
        title: { tr: 'Destekçimiz', en: 'Our Sponsor', el: 'Χορηγός μας' },
    },
    contact: {
        title: { tr: 'İletişim', en: 'Contact', el: 'Επικοινωνία' },
    },
    location: {
        title: { tr: 'Konum', en: 'Location', el: 'Τοποθεσία' },
        mapLink: { tr: 'Haritada Görüntüle', en: 'View on Map', el: 'Προβολή στον Χάρτη' },
    },
    bottom: {
        copyright: {
            tr: 'Galata Rum Okulu Vakfı - Kültür Merkezi © 2026. Tüm hakları saklıdır.',
            en: 'Galata Greek School Foundation - Cultural Center © 2026. All rights reserved.',
            el: 'Αστική Σχολή Γαλατά – Πολιτιστικό Κέντρο © 2026. Με την επιφύλαξη παντός δικαιώματος.',
        },
        kvkk: { tr: 'KVKK', en: 'PDPL (KVKK)', el: 'KVKK' },
        privacy: { tr: 'Gizlilik Politikası', en: 'Privacy Policy', el: 'Πολιτική Απορρήτου' },
        cookies: { tr: 'Çerez Politikası', en: 'Cookie Policy', el: 'Πολιτική Cookies' },
    },
};

export default function Footer() {
    const { lang, localizePath } = useI18n();
    const [email, setEmail] = useState('');
    const [consentAccepted, setConsentAccepted] = useState(false);
    const [honeypot, setHoneypot] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [statusCode, setStatusCode] = useState<'IDLE' | 'PERSISTED' | 'ALREADY_SUBSCRIBED' | 'ERROR'>('IDLE');

    const handleNewsletterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (submitting) return;

        setSubmitting(true);
        setStatusCode('IDLE');

        const res = await submitNewsletterSubscription({
            email,
            locale: lang,
            consentAccepted,
            honeypot,
        });

        setSubmitting(false);
        if (res.ok && res.persisted) {
            setStatusCode(res.code === 'ALREADY_SUBSCRIBED' ? 'ALREADY_SUBSCRIBED' : 'PERSISTED');
            setEmail('');
        } else {
            setStatusCode('ERROR');
        }
    };

    return (
        <footer className="footer">
            <div className="footer__inner">
                <div className="footer__grid">
                    {/* Column 1: Logo & Newsletter */}
                    <div className="footer__col footer__col--newsletter">
                        <div className="footer__brand">
                            <img
                                src={galataLogo}
                                alt={footerContent.brandName[lang]}
                                width={64}
                                height={64}
                                className="footer__logo"
                                loading="lazy"
                            />
                            <span className="footer__brand-text">{footerContent.brandName[lang]}</span>
                        </div>
                        <p className="footer__newsletter-desc">{footerContent.newsletter.desc[lang]}</p>

                        {statusCode === 'PERSISTED' || statusCode === 'ALREADY_SUBSCRIBED' ? (
                            <p className="footer__newsletter-success" role="status" aria-live="polite" data-testid="newsletter-success">
                                ✓{' '}
                                {statusCode === 'ALREADY_SUBSCRIBED'
                                    ? footerContent.newsletter.alreadySubscribed[lang]
                                    : footerContent.newsletter.success[lang]}
                            </p>
                        ) : (
                            <form className="footer__newsletter-form" onSubmit={handleNewsletterSubmit} data-testid="newsletter-form">
                                {/* Honeypot anti-bot field */}
                                <div style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }} aria-hidden="true">
                                    <label htmlFor="footer-hp-url">Website</label>
                                    <input
                                        id="footer-hp-url"
                                        type="text"
                                        name="website_url"
                                        tabIndex={-1}
                                        autoComplete="off"
                                        value={honeypot}
                                        onChange={(e) => setHoneypot(e.target.value)}
                                    />
                                </div>

                                <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                                    <input
                                        type="email"
                                        name="email"
                                        autoComplete="email"
                                        spellCheck={false}
                                        aria-label={footerContent.newsletter.placeholder[lang]}
                                        placeholder={footerContent.newsletter.placeholder[lang]}
                                        className="footer__input"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                    <button type="submit" className="footer__submit" disabled={submitting} aria-busy={submitting}>
                                        {submitting ? footerContent.newsletter.submittingBtn[lang] : footerContent.newsletter.btn[lang]}
                                    </button>
                                </div>

                                <label
                                    style={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: '8px',
                                        marginTop: '8px',
                                        fontSize: '0.75rem',
                                        lineHeight: 1.4,
                                        cursor: 'pointer',
                                    }}
                                >
                                    <input
                                        type="checkbox"
                                        name="newsletterConsent"
                                        checked={consentAccepted}
                                        onChange={(e) => setConsentAccepted(e.target.checked)}
                                        required
                                        style={{ marginTop: '3px' }}
                                    />
                                    <span>
                                        {footerContent.newsletter.consent[lang]}{' '}
                                        <Link to={localizePath('/gizlilik-politikasi')} style={{ textDecoration: 'underline' }}>
                                            ({footerContent.bottom.privacy[lang]})
                                        </Link>
                                    </span>
                                </label>

                                {statusCode === 'ERROR' && (
                                    <p
                                        role="alert"
                                        data-testid="newsletter-error"
                                        style={{
                                            marginTop: '8px',
                                            fontSize: '0.75rem',
                                            color: 'var(--color-error, #C0392B)',
                                            lineHeight: 1.45,
                                        }}
                                    >
                                        {footerContent.newsletter.errorFallback[lang]}{' '}
                                        <a
                                            href="mailto:info@galatarumokulu.org?subject=E-B%C3%BClten%20Abonelik%20Talebi"
                                            style={{ textDecoration: 'underline', fontWeight: 600 }}
                                        >
                                            info@galatarumokulu.org
                                        </a>
                                    </p>
                                )}
                            </form>
                        )}
                    </div>

                    {/* Column 2: Visiting Days (School vs Simone Restaurant) */}
                    <div className="footer__col">
                        <h2 className="footer__heading">{footerContent.hours.title[lang]}</h2>
                        <p className="footer__text footer__text--margin" data-testid="footer-school-schedule">
                            <strong>{VENUE_INFO.school.name[lang]}:</strong>
                            <br />
                            {VENUE_INFO.school.scheduleSummary[lang]}
                        </p>
                        <p className="footer__text" data-testid="footer-simone-schedule" style={{ fontSize: '0.82rem' }}>
                            <strong>
                                <a
                                    href={VENUE_INFO.simoneRestaurant.websiteUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="footer__link"
                                    style={{ display: 'inline', textDecoration: 'underline' }}
                                >
                                    {VENUE_INFO.simoneRestaurant.name[lang]}
                                </a>:
                            </strong>
                            <br />
                            {VENUE_INFO.simoneRestaurant.scheduleSummary[lang]}
                        </p>
                    </div>

                    {/* Column 3: Contact & Socials */}
                    <div className="footer__col">
                        <h2 className="footer__heading">{footerContent.contact.title[lang]}</h2>
                        <p className="footer__text footer__text--margin">
                            <a href={VENUE_INFO.contact.mailtoHref} className="footer__link" translate="no">
                                {VENUE_INFO.contact.email}
                            </a>
                            <br />
                            <a href={VENUE_INFO.contact.telHref} className="footer__link" translate="no">
                                {VENUE_INFO.contact.displayPhone}
                            </a>
                        </p>
                        <div className="footer__socials">
                            {/* Facebook */}
                            <a
                                href="https://www.facebook.com/galatarumokulu/?locale=tr_TR"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="footer__social-circle"
                                aria-label="Facebook"
                            >
                                <svg width="10" height="18" viewBox="0 0 10 18" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2.26125 18V9.73468H0V6.65756H2.26125V3.97495C2.26125 0.941913 3.90375 0 7.425 0V3.1205C5.83875 3.1205 5.56875 3.5262 5.56875 4.54214V6.65756H9.72L8.91 9.73468H5.56875V18H2.26125Z" />
                                </svg>
                            </a>
                            {/* X / Twitter */}
                            <a
                                href="https://x.com/GalataRum"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="footer__social-circle"
                                aria-label="X (Twitter)"
                            >
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9.4754 6.84888L15.3905 0H13.9882L8.85194 5.94073L4.7454 0H0L6.19532 8.87895L0 15.9981H1.40237L6.83226 9.71536L11.1685 15.9981H15.9139L9.4754 6.84888ZM7.54519 8.88998L6.9142 8.00032L1.90809 0.940177H4.06202L8.11586 6.65651L8.74685 7.54617L14.0041 14.9602H11.8501L7.54519 8.88998Z" />
                                </svg>
                            </a>
                            {/* Instagram */}
                            <a
                                href={VENUE_INFO.contact.instagramUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="footer__social-circle"
                                aria-label="Instagram"
                            >
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M10 0C7.284 0 6.944 0.012 5.877 0.06C4.814 0.109 4.088 0.278 3.453 0.525C2.796 0.78 2.234 1.116 1.673 1.676C1.113 2.238 0.776 2.799 0.522 3.455C0.275 4.09 0.106 4.816 0.058 5.88C0.009 6.946 0 7.286 0 10C0 12.714 0.009 13.054 0.058 14.12C0.107 15.184 0.275 15.91 0.522 16.545C0.778 17.202 1.114 17.764 1.674 18.324C2.235 18.886 2.796 19.222 3.453 19.475C4.088 19.722 4.814 19.891 5.877 19.94C6.944 19.988 7.284 20 10 20C12.716 20 13.056 19.988 14.123 19.94C15.186 19.891 15.912 19.722 16.547 19.475C17.204 19.221 17.766 18.884 18.327 18.324C18.887 17.763 19.224 17.201 19.478 16.545C19.725 15.91 19.894 15.184 19.942 14.12C19.991 13.054 20 12.714 20 10C20 7.286 19.991 6.946 19.942 5.88C19.893 4.816 19.725 4.09 19.478 3.455C19.223 2.798 18.887 2.236 18.327 1.676C18.766 1.115 17.204 0.778 16.547 0.525C15.912 0.278 15.186 0.109 14.123 0.06C13.056 0.012 12.716 0 10 0ZM10 1.802C12.668 1.802 12.984 1.812 14.041 1.86C14.981 1.903 15.5 2.067 15.847 2.202C16.307 2.381 16.634 2.592 16.978 2.936C17.322 3.28 17.534 3.608 17.712 4.067C17.848 4.415 18.01 4.933 18.055 5.874C18.102 6.93 18.113 7.247 18.113 9.916C18.113 12.585 18.102 12.902 18.055 13.957C18.01 14.898 17.848 15.417 17.712 15.764C17.534 16.223 17.322 16.551 16.978 16.895C16.634 17.239 16.307 17.45 15.847 17.629C15.5 17.765 14.981 17.928 14.041 17.971C12.984 18.019 12.668 18.03 10 18.03C7.332 18.03 7.016 18.019 5.959 17.971C5.019 17.928 4.5 17.765 4.153 17.629C3.693 17.45 3.366 17.239 3.022 16.895C2.678 16.551 2.466 16.223 2.288 15.764C2.152 15.417 1.99 14.898 1.945 13.957C1.898 12.902 1.887 12.585 1.887 9.916C1.887 7.247 1.898 6.93 1.945 5.874C1.99 4.933 2.152 4.415 2.288 4.067C2.466 3.608 2.678 3.28 3.022 2.936C3.366 2.592 3.693 2.381 4.153 2.202C4.5 2.067 5.019 1.903 5.959 1.86C7.016 1.812 7.332 1.802 10 1.802ZM10 4.865C7.164 4.865 4.865 7.164 4.865 10C4.865 12.836 7.164 15.135 10 15.135C12.836 15.135 15.135 12.836 15.135 10C15.135 7.164 12.836 4.865 10 4.865ZM10 13.333C8.159 13.333 6.667 11.841 6.667 10C6.667 8.159 8.159 6.667 10 6.667C11.841 6.667 13.333 8.159 13.333 10C13.333 11.841 11.841 13.333 10 13.333ZM15.334 3.466C15.334 4.128 14.796 4.666 14.133 4.666C13.47 4.666 12.933 4.128 12.933 3.466C12.933 2.803 13.47 2.266 14.133 2.266C14.796 2.266 15.334 2.803 15.334 3.466Z"
                                    />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Column 4: Location */}
                    <div className="footer__col">
                        <h2 className="footer__heading">{footerContent.location.title[lang]}</h2>
                        <p className="footer__text footer__text--margin">{VENUE_INFO.contact.displayAddress[lang]}</p>
                        <a
                            href={VENUE_INFO.contact.mapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="footer__map-link"
                        >
                            {footerContent.location.mapLink[lang]}
                        </a>
                    </div>
                </div>

                {/* Footer Bottom */}
                <div className="footer__bottom">
                    <p>{footerContent.bottom.copyright[lang]}</p>
                    <div className="footer__legal-links">
                        <Link to={localizePath('/kvkk')} className="footer__legal-link">
                            {footerContent.bottom.kvkk[lang]}
                        </Link>
                        <Link to={localizePath('/gizlilik-politikasi')} className="footer__legal-link">
                            {footerContent.bottom.privacy[lang]}
                        </Link>
                        <Link to={localizePath('/cerez-politikasi')} className="footer__legal-link">
                            {footerContent.bottom.cookies[lang]}
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
