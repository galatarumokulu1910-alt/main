import { Link } from 'react-router-dom';
import { useI18n } from '../../i18n/I18nContext';
import SEO from '../../components/SEO/SEO';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import './NotFoundPage.css';

const copy = {
    tr: {
        eyebrow: 'HATA 404 · SAYFA BULUNAMADI',
        title: 'Aradığınız Sayfa Bulunamadı',
        desc: 'Ulaşmaya çalıştığınız bağlantı kaldırılmış, taşınmış veya geçersiz bir adrese işaret ediyor olabilir. Aşağıdaki bağlantıları kullanarak Galata Rum Okulu Vakfı - Kültür Merkezi arşiv ve mekan sayfalarına dönebilirsiniz.',
        homeBtn: 'Ana Sayfaya Dön',
        venueBtn: 'Mekan Kiralama',
        archiveLink: 'Dijital Arşiv →',
        eventsLink: 'Geçmiş Etkinlikler →',
        contactLink: 'Bize Ulaşın →',
    },
    en: {
        eyebrow: 'ERROR 404 · PAGE NOT FOUND',
        title: 'Page Not Found',
        desc: 'The page you are looking for may have been moved, removed, or does not exist. You can return to the Galata Greek School Foundation - Cultural Center pages using the links below.',
        homeBtn: 'Return to Home',
        venueBtn: 'Venue Hire',
        archiveLink: 'Digital Archive →',
        eventsLink: 'Past Events →',
        contactLink: 'Contact Us →',
    },
    el: {
        eyebrow: 'ΣΦΑΛΜΑ 404 · Η ΣΕΛΙΔΑ ΔΕΝ ΒΡΕΘΗΚΕ',
        title: 'Η Σελίδα Δεν Βρέθηκε',
        desc: 'Η σελίδα που αναζητάτε ενδέχεται να έχει μετακινηθεί, καταργηθεί ή να μην υπάρχει. Μπορείτε να επιστρέψετε στις σελίδες του Ιδρύματος Ελληνικού Σχολείου Γαλατά μέσω των παρακάτω συνδέσμων.',
        homeBtn: 'Επιστροφή στην Αρχική',
        venueBtn: 'Ενοικίαση Χώρου',
        archiveLink: 'Ψηφιακό Αρχείο →',
        eventsLink: 'Παρελθούσες Εκδηλώσεις →',
        contactLink: 'Επικοινωνία →',
    },
};

export default function NotFoundPage() {
    const { lang, localizePath } = useI18n();
    const l = (lang as 'tr' | 'en' | 'el') || 'tr';
    const c = copy[l] || copy.tr;

    return (
        <div className="not-found-page" data-testid="not-found-page">
            <SEO
                overrideTitle={c.title}
                overrideDescription={c.desc}
                noindex={true}
            />
            <Breadcrumbs items={[{ label: { tr: '404 — Bulunamadı', en: '404 — Not Found', el: '404 — Δεν Βρέθηκε' } }]} />

            <section className="nfp-section" aria-labelledby="nfp-heading">
                <div className="nfp-card">
                    <span className="nfp-eyebrow">{c.eyebrow}</span>
                    <div className="nfp-code" aria-hidden="true">404</div>
                    <h1 id="nfp-heading" className="nfp-title">{c.title}</h1>
                    <p className="nfp-desc">{c.desc}</p>

                    <div className="nfp-actions">
                        <Link to={localizePath('/')} className="nfp-btn nfp-btn--primary">
                            {c.homeBtn}
                        </Link>
                        <Link to={localizePath('/mekan-kiralama')} className="nfp-btn nfp-btn--secondary">
                            {c.venueBtn}
                        </Link>
                    </div>

                    <nav className="nfp-quick-links" aria-label="404 Quick Links">
                        <Link to={localizePath('/arsiv')} className="nfp-quick-link">{c.archiveLink}</Link>
                        <Link to={localizePath('/gecmis-etkinlikler')} className="nfp-quick-link">{c.eventsLink}</Link>
                        <Link to={localizePath('/bize-ulasin')} className="nfp-quick-link">{c.contactLink}</Link>
                    </nav>
                </div>
            </section>
        </div>
    );
}
