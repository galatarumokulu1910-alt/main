import { Link } from 'react-router-dom';
import { useI18n } from '../../i18n/I18nContext';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import './ArchiveEntryPage.css';

export default function ArchiveEntryPage() {
    const { lang } = useI18n();

    const labels = {
        tr: {
            leftTag: 'Tarihî Koleksiyon',
            leftTitle: 'Okul Arşivi',
            leftDesc: 'Yüzyıllık akademik mirası izleyen tarihî belgeler, idari kayıtlar ve fiziksel eserlerden oluşan küratörlüğünde bir arşiv.',
            leftBtnDocs: 'Belgeler',
            leftBtnObjects: 'Objeler',
            leftHint: 'Arşivi Keşfet',
            rightTag: 'Modern Erişim',
            rightTitle: 'Yeni Kütüphane',
            rightDesc: 'Dijital kaynaklar, nadir kitap koleksiyonları ve akademik tefekkür için sessiz alanlar sunan çağdaş araştırma kanadımız.',
            rightBtn: 'Kütüphaneye Gir',
            rightHint: 'Kaynakları Keşfet',
            footerLabel: 'Arşiv Hacmi',
            footerValue: 'Est. 1885 — Cilt IV',
        },
        en: {
            leftTag: 'Historical Collection',
            leftTitle: 'School Archive',
            leftDesc: 'A curated repository of historical documents, administrative records, and physical artifacts tracing centuries of academic heritage.',
            leftBtnDocs: 'Documents',
            leftBtnObjects: 'Objects',
            leftHint: 'Explore Archive',
            rightTag: 'Modern Access',
            rightTitle: 'New Library',
            rightDesc: 'Our contemporary research wing offering digital resources, rare book collections, and quiet spaces for scholarly contemplation.',
            rightBtn: 'Enter Library',
            rightHint: 'Discover Resources',
            footerLabel: 'Archival Volume',
            footerValue: 'Est. 1885 — Volume IV',
        },
        el: {
            leftTag: 'Ιστορική Συλλογή',
            leftTitle: 'Σχολικό Αρχείο',
            leftDesc: 'Ένα επιμελημένο αποθετήριο ιστορικών εγγράφων, διοικητικών αρχείων και φυσικών τεκμηρίων που ιχνηλατούν αιώνες ακαδημαϊκής κληρονομιάς.',
            leftBtnDocs: 'Έγγραφα',
            leftBtnObjects: 'Αντικείμενα',
            leftHint: 'Εξερευνήστε το Αρχείο',
            rightTag: 'Σύγχρονη Πρόσβαση',
            rightTitle: 'Νέα Βιβλιοθήκη',
            rightDesc: 'Η σύγχρονη ερευνητική μας πτέρυγα που προσφέρει ψηφιακούς πόρους, συλλογές σπάνιων βιβλίων και ήσυχους χώρους για ακαδημαϊκό στοχασμό.',
            rightBtn: 'Είσοδος Βιβλιοθήκης',
            rightHint: 'Ανακαλύψτε Πόρους',
            footerLabel: 'Αρχειακός Τόμος',
            footerValue: 'Est. 1885 — Τόμος IV',
        },
    };

    const t = labels[lang as keyof typeof labels] || labels.en;

    return (
        <div className="archive-entry" style={{ position: 'relative' }}>
            <Breadcrumbs items={[{ label: { tr: 'Arşiv', en: 'Archive', el: 'Αρχείο' } }]} />

            <div className="archive-entry__main">
                {/* Left Pane — School Archive */}
                <Link to="/archive/collection" className="archive-entry__pane archive-entry__pane--left">
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
                            <span className="archive-entry__btn">
                                <span>📄</span>
                                <span>{t.leftBtnDocs}</span>
                            </span>
                            <span className="archive-entry__btn">
                                <span>🏺</span>
                                <span>{t.leftBtnObjects}</span>
                            </span>
                        </div>
                    </div>
                    <div className="archive-entry__hint">
                        <span className="archive-entry__hint-line" />
                        <span className="archive-entry__hint-text">{t.leftHint}</span>
                        <span className="archive-entry__hint-line" />
                    </div>
                </Link>

                {/* Right Pane — New Library */}
                <Link to="/archive/collection" className="archive-entry__pane archive-entry__pane--right">
                    <div
                        className="archive-entry__pane-bg"
                        style={{ backgroundImage: `url('/images/artifacts/vintage-greek-book.png')` }}
                    />
                    <div className="archive-entry__pane-overlay" />
                    <div className="archive-entry__pane-content">
                        <span className="archive-entry__pane-tag">{t.rightTag}</span>
                        <h1 className="archive-entry__pane-title">{t.rightTitle}</h1>
                        <p className="archive-entry__pane-desc">{t.rightDesc}</p>
                        <Link to="/archive/collection" className="archive-entry__btn archive-entry__btn--primary">
                            <span>{t.rightBtn}</span>
                            <span>→</span>
                        </Link>
                    </div>
                    <div className="archive-entry__hint">
                        <span className="archive-entry__hint-line" />
                        <span className="archive-entry__hint-text">{t.rightHint}</span>
                        <span className="archive-entry__hint-line" />
                    </div>
                </Link>
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
