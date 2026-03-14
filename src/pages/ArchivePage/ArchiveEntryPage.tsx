import { useNavigate } from 'react-router-dom';
import { useI18n } from '../../i18n/I18nContext';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import SEO from '../../components/SEO/SEO';
import './ArchiveEntryPage.css';

export default function ArchiveEntryPage() {
    const { lang } = useI18n();
    const navigate = useNavigate();

    const labels = {
        tr: {
            leftTag: 'Tarihî Koleksiyon',
            leftTitle: 'Galata Rum Okulu',
            leftDesc: 'Yüzyıllık akademik mirası izleyen tarihî belgeler, idari kayıtlar ve fiziksel eserlerden oluşan küratörlüğünde bir arşiv.',
            leftBtnDocs: 'Belgeler',
            leftBtnObjects: 'Objeler',
            leftHint: 'Arşivi Keşfet',
            irTag: 'Toplumsal Bellek',
            irTitle: 'İstanbul Rum Okul ve Cemaatler',
            irDesc: 'İstanbul Rum toplumunun tarihî belgeleri, fotoğrafları ve kültürel mirasını koruyan kapsamlı bir dijital arşiv.',
            irBtnDocs: 'Belgeler',
            irBtnPhotos: 'Fotoğraflar',
            irHint: 'Arşivi Keşfet',
            footerLabel: 'Arşiv Hacmi',
            footerValue: 'Est. 1885 — Cilt IV',
        },
        en: {
            leftTag: 'Historical Collection',
            leftTitle: 'Galata Greek School',
            leftDesc: 'A curated repository of historical documents, administrative records, and physical artifacts tracing centuries of academic heritage.',
            leftBtnDocs: 'Documents',
            leftBtnObjects: 'Objects',
            leftHint: 'Explore Archive',
            irTag: 'Communal Memory',
            irTitle: 'Istanbul Greek Schools & Communities',
            irDesc: 'A comprehensive digital archive preserving historical documents, photographs, and cultural heritage of the Istanbul Greek community.',
            irBtnDocs: 'Documents',
            irBtnPhotos: 'Photographs',
            irHint: 'Explore Archive',
            footerLabel: 'Archival Volume',
            footerValue: 'Est. 1885 — Volume IV',
        },
        el: {
            leftTag: 'Ιστορική Συλλογή',
            leftTitle: 'Σχολή Γαλατά',
            leftDesc: 'Ένα επιμελημένο αποθετήριο ιστορικών εγγράφων, διοικητικών αρχείων και φυσικών τεκμηρίων που ιχνηλατούν αιώνες ακαδημαϊκής κληρονομιάς.',
            leftBtnDocs: 'Έγγραφα',
            leftBtnObjects: 'Αντικείμενα',
            leftHint: 'Εξερευνήστε το Αρχείο',
            irTag: 'Κοινοτική Μνήμη',
            irTitle: 'Ρωμαίικα Σχολεία και Κοινότητες της Πόλης',
            irDesc: 'Ένα ολοκληρωμένο ψηφιακό αρχείο που διατηρεί ιστορικά έγγραφα, φωτογραφίες και πολιτιστική κληρονομιά της ελληνικής κοινότητας της Κωνσταντινούπολης.',
            irBtnDocs: 'Έγγραφα',
            irBtnPhotos: 'Φωτογραφίες',
            irHint: 'Εξερευνήστε το Αρχείο',
            footerLabel: 'Αρχειακός Τόμος',
            footerValue: 'Est. 1885 — Τόμος IV',
        },
    };

    const t = labels[lang as keyof typeof labels] || labels.en;

    return (
        <div className="archive-entry" style={{ position: 'relative' }}>
            <SEO 
                titleKey="nav.archive"
                overrideDescription={lang === 'tr' ? 'Galata Rum Okulu ve İstanbul Rum toplumuna ait tarihi belge ve eserlerin dijital arşivi.' : 'Digital archive of historical documents and artifacts belonging to the Galata Greek School and the Istanbul Greek community.'}
                aiSchema={{
                    "@context": "https://schema.org",
                    "@type": "ArchiveOrganization",
                    "name": "Galata Greek School Archive",
                    "description": "A living digital archive preserving historical documents, photographs, and cultural heritage of the Istanbul Greek community.",
                    "url": "https://galatarumokulu.org.tr/arsiv"
                }}
            />
            <Breadcrumbs items={[{ label: { tr: 'Arşiv', en: 'Archive', el: 'Αρχείο' } }]} />

            <div className="archive-entry__main">
                {/* Left Pane — School Archive */}
                <div
                    className="archive-entry__pane archive-entry__pane--left"
                    onClick={() => navigate('/arsiv/koleksiyon')}
                    style={{ cursor: 'pointer' }}
                >
                    <div
                        className="archive-entry__pane-bg"
                        style={{ backgroundImage: `url('/images/artifacts/vintage-school-register.png')` }}
                    />
                    <div className="archive-entry__pane-overlay" />
                    <div className="archive-entry__pane-content">
                        <span className="archive-entry__pane-tag">{t.leftTag}</span>
                        <h1 className="archive-entry__pane-title">{t.leftTitle}</h1>
                        <p className="archive-entry__pane-desc">{t.leftDesc}</p>
                        <div className="archive-entry__btn-row">
                            <button
                                className="archive-entry__btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate('/arsiv/koleksiyon', { state: { tab: 0 } });
                                }}
                            >
                                <span>📄</span>
                                <span>{t.leftBtnDocs}</span>
                            </button>
                            <button
                                className="archive-entry__btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate('/arsiv/koleksiyon', { state: { tab: 1 } });
                                }}
                            >
                                <span>🏺</span>
                                <span>{t.leftBtnObjects}</span>
                            </button>
                        </div>
                    </div>
                    <div className="archive-entry__hint">
                        <span className="archive-entry__hint-line" />
                        <span className="archive-entry__hint-text">{t.leftHint}</span>
                        <span className="archive-entry__hint-line" />
                    </div>
                </div>

                {/* Right Pane — Istanbul Rumları Arşivi */}
                <div
                    className="archive-entry__pane archive-entry__pane--right"
                    onClick={() => navigate('/arsiv/istanbul-rum')}
                    style={{ cursor: 'pointer' }}
                >
                    <div
                        className="archive-entry__pane-bg"
                        style={{ backgroundImage: `url('/images/artifacts/vintage-greek-book.png')` }}
                    />
                    <div className="archive-entry__pane-overlay" />
                    <div className="archive-entry__pane-content">
                        <span className="archive-entry__pane-tag">{t.irTag}</span>
                        <h1 className="archive-entry__pane-title">{t.irTitle}</h1>
                        <p className="archive-entry__pane-desc">{t.irDesc}</p>
                        <div className="archive-entry__btn-row">
                            <button
                                className="archive-entry__btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate('/arsiv/istanbul-rum', { state: { tab: 0 } });
                                }}
                            >
                                <span>📜</span>
                                <span>{t.irBtnDocs}</span>
                            </button>
                            <button
                                className="archive-entry__btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate('/arsiv/istanbul-rum', { state: { tab: 1 } });
                                }}
                            >
                                <span>📷</span>
                                <span>{t.irBtnPhotos}</span>
                            </button>
                        </div>
                    </div>
                    <div className="archive-entry__hint">
                        <span className="archive-entry__hint-line" />
                        <span className="archive-entry__hint-text">{t.irHint}</span>
                        <span className="archive-entry__hint-line" />
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="archive-entry__footer">
                <div>
                    <p className="archive-entry__footer-label">{t.footerLabel}</p>
                    <p className="archive-entry__footer-value">{t.footerValue}</p>
                </div>
            </div>
        </div>
    );
}
