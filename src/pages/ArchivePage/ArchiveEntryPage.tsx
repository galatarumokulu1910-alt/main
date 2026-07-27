import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../../i18n/I18nContext';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import SEO from '../../components/SEO/SEO';
import galataLogo from '../../assets/galata-rum-okulu_logo.svg';
import './ArchiveEntryPage.css';

export default function ArchiveEntryPage() {
    const { lang } = useI18n();
    const navigate = useNavigate();
    const [preloaderActive, setPreloaderActive] = useState(true);
    const [imagesLoaded, setImagesLoaded] = useState(false);

    useEffect(() => {
        const img1 = new Image();
        const img2 = new Image();
        let loadedCount = 0;
        const handleImageLoad = () => {
            loadedCount++;
            if (loadedCount === 2) {
                setImagesLoaded(true);
            }
        };
        img1.onload = handleImageLoad;
        img1.onerror = handleImageLoad;
        img2.onload = handleImageLoad;
        img2.onerror = handleImageLoad;
        img1.src = '/images/artifacts/vintage-school-register.png';
        img2.src = '/images/artifacts/vintage-greek-book.png';
    }, []);

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
        }, 1500);
        return () => clearTimeout(timer);
    }, [preloaderActive]);

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
                    <h3 className="hp-preloader__subtitle-gold">{lang === 'tr' ? 'Arşiv' : lang === 'el' ? 'Αρχείο' : 'Archive'}</h3>
                </div>
            </div>

            <SEO 
                titleKey="nav.archive"
                overrideDescription={lang === 'tr' ? 'Galata Rum Okulu ve İstanbul Rum toplumuna ait tarihi belge ve eserlerin dijital arşivi.' : lang === 'el' ? 'Ψηφιακό αρχείο ιστορικών εγγράφων και τεκμηρίων της Ελληνικής Σχολής Γαλατά και της ελληνικής κοινότητας της Κωνσταντινούπολης.' : 'Digital archive of historical documents and artifacts belonging to the Galata Greek School and the Istanbul Greek community.'}
                aiSchema={{
                    "@context": "https://schema.org",
                    "@type": "Archive",
                    "name": "Galata Greek School Archive",
                    "description": "A living digital archive preserving historical documents, photographs, and cultural heritage of the Istanbul Greek community.",
                    "url": "https://galatarumokulu.org.tr/arsiv",
                    "isAccessibleForFree": true
                }}
            />
            <Breadcrumbs items={[{ label: { tr: 'Arşiv', en: 'Archive', el: 'Αρχείο' } }]} />

            <h1 style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', border: 0 }}>
                {lang === 'tr' ? 'Arşiv' : lang === 'el' ? 'Αρχείο' : 'Archive'}
            </h1>

            <div className={`archive-entry__main ${(preloaderActive || !imagesLoaded) ? 'archive-entry__main--loading' : 'archive-entry__main--loaded'}`}>
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
                        <h2 className="archive-entry__pane-title">{t.leftTitle}</h2>
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
                        <h2 className="archive-entry__pane-title">{t.irTitle}</h2>
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
