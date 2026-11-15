import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Landmark, ScrollText, Camera, ArrowUpRight, Sparkles } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { useI18n } from '../../i18n/I18nContext';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import SEO from '../../components/SEO/SEO';
import './ArchiveEntryPage.css';

export default function ArchiveEntryPage() {
    const { lang, localizePath } = useI18n();
    const navigate = useNavigate();
    const shouldReduceMotion = useReducedMotion();
    const [hoveredPane, setHoveredPane] = useState<'left' | 'right' | null>(null);

    const labels = {
        tr: {
            leftIndex: 'I — KURUMSAL BELLEK',
            leftTag: 'Tarihî Koleksiyon',
            leftTitle: 'Galata Rum Okulu',
            leftDesc: 'Yüzyıllık akademik mirası izleyen tarihî belgeler, idari kayıtlar ve fiziksel eserlerden oluşan küratörlüğünde bir arşiv.',
            leftBtnDocs: 'Belgeler',
            leftBtnObjects: 'Objeler',
            leftHint: 'Arşivi Keşfet',
            irIndex: 'II — TOPLUMSAL BELLEK',
            irTag: 'Toplumsal Bellek',
            irTitle: 'İstanbul Rum Okul ve Cemaatler',
            irDesc: 'İstanbul Rum toplumunun tarihî belgeleri, fotoğrafları ve kültürel mirasını koruyan kapsamlı bir dijital arşiv.',
            irBtnDocs: 'Belgeler',
            irBtnPhotos: 'Fotoğraflar',
            irHint: 'Arşivi Keşfet',
            footerLabel: 'Arşiv Hacmi',
            footerValue: 'Est. 1885 — Cilt IV',
            footerAccess: 'Açık Erişim Dijital Miras',
        },
        en: {
            leftIndex: 'I — INSTITUTIONAL MEMORY',
            leftTag: 'Historical Collection',
            leftTitle: 'Galata Greek School',
            leftDesc: 'A curated repository of historical documents, administrative records, and physical artifacts tracing centuries of academic heritage.',
            leftBtnDocs: 'Documents',
            leftBtnObjects: 'Objects',
            leftHint: 'Explore Archive',
            irIndex: 'II — COMMUNAL MEMORY',
            irTag: 'Communal Memory',
            irTitle: 'Istanbul Greek Schools & Communities',
            irDesc: 'A comprehensive digital archive preserving historical documents, photographs, and cultural heritage of the Istanbul Greek community.',
            irBtnDocs: 'Documents',
            irBtnPhotos: 'Photographs',
            irHint: 'Explore Archive',
            footerLabel: 'Archival Volume',
            footerValue: 'Est. 1885 — Volume IV',
            footerAccess: 'Open-Access Digital Heritage',
        },
        el: {
            leftIndex: 'I — ΘΕΣΜΙΚΗ ΜΝΗΜΗ',
            leftTag: 'Ιστορική Συλλογή',
            leftTitle: 'Σχολή Γαλατά',
            leftDesc: 'Ένα επιμελημένο αποθετήριο ιστορικών εγγράφων, διοικητικών αρχείων και φυσικών τεκμηρίων που ιχνηλατούν αιώνες ακαδημαϊκής κληρονομιάς.',
            leftBtnDocs: 'Έγγραφα',
            leftBtnObjects: 'Αντικείμενα',
            leftHint: 'Εξερευνήστε το Αρχείο',
            irIndex: 'II — ΚΟΙΝΟΤΙΚΗ ΜΝΗΜΗ',
            irTag: 'Κοινοτική Μνήμη',
            irTitle: 'Ρωμαίικα Σχολεία και Κοινότητες της Πόλης',
            irDesc: 'Ένα ολοκληρωμένο ψηφιακό αρχείο που διατηρεί ιστορικά έγγραφα, φωτογραφίες και πολιτιστική κληρονομιά της ελληνικής κοινότητας της Κωνσταντινούπολης.',
            irBtnDocs: 'Έγγραφα',
            irBtnPhotos: 'Φωτογραφίες',
            irHint: 'Εξερευνήστε το Αρχείο',
            footerLabel: 'Αρχειακός Τόμος',
            footerValue: 'Est. 1885 — Τόμος IV',
            footerAccess: 'Ψηφιακή Κληρονομιά Ανοιχτής Πρόσβασης',
        },
    };

    const t = labels[lang as keyof typeof labels] || labels.en;

    const easeOutQuart: [number, number, number, number] = [0.22, 1, 0.36, 1];

    const contentContainerVariants = {
        hidden: { opacity: 0 },
        visible: (delayOffset: number) => ({
            opacity: 1,
            transition: {
                delayChildren: shouldReduceMotion ? 0 : delayOffset,
                staggerChildren: shouldReduceMotion ? 0 : 0.11,
            },
        }),
    };

    const itemVariants = {
        hidden: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.75, ease: easeOutQuart },
        },
    };

    return (
        <div className="archive-entry" style={{ position: 'relative' }}>
            <SEO 
                titleKey="nav.archive"
                overrideDescription={lang === 'tr' ? 'Galata Rum Okulu Vakfı - Kültür Merkezi ve İstanbul Rum toplumuna ait tarihi belge ve eserlerin dijital arşivi.' : lang === 'el' ? 'Ψηφιακό αρχείο ιστορικών εγγράφων και τεκμηρίων του Ιδρύματος Ελληνικού Σχολείου Γαλατά - Πολιτιστικού Κέντρου και της ελληνικής κοινότητας της Κωνσταντινούπολης.' : 'Digital archive of historical documents and artifacts belonging to the Galata Greek School Foundation - Cultural Center and the Istanbul Greek community.'}
                aiSchema={{
                    "@context": "https://schema.org",
                    "@type": "Archive",
                    "name": "Galata Rum Okulu Vakfı - Kültür Merkezi Arşivi",
                    "alternateName": "Galata Greek School Foundation - Cultural Center Archive",
                    "description": "A living digital archive preserving historical documents, photographs, and cultural heritage of the Istanbul Greek community.",
                    "url": "https://galatarumokulu.org.tr/arsiv",
                    "isAccessibleForFree": true
                }}
            />
            <Breadcrumbs items={[{ label: { tr: 'Arşiv', en: 'Archive', el: 'Αρχείο' } }]} />

            <h1 style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', border: 0 }}>
                {lang === 'tr' ? 'Arşiv' : lang === 'el' ? 'Αρχείο' : 'Archive'}
            </h1>

            <div className="archive-entry__main">
                {/* Left Pane — School Archive */}
                <motion.div
                    className={`archive-entry__pane archive-entry__pane--left ${hoveredPane === 'left' ? 'is-hovered' : ''} ${hoveredPane === 'right' ? 'is-dimmed' : ''}`}
                    onClick={() => navigate(localizePath('/arsiv/koleksiyon'))}
                    onMouseEnter={() => setHoveredPane('left')}
                    onMouseLeave={() => setHoveredPane(null)}
                    onFocus={() => setHoveredPane('left')}
                    onBlur={() => setHoveredPane(null)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            navigate(localizePath('/arsiv/koleksiyon'));
                        }
                    }}
                    role="link"
                    tabIndex={0}
                    animate={
                        shouldReduceMotion
                            ? {}
                            : {
                                flex: hoveredPane === 'left' ? 1.18 : hoveredPane === 'right' ? 0.85 : 1,
                            }
                    }
                    transition={{ duration: 0.7, ease: easeOutQuart }}
                >
                    <motion.div
                        className="archive-entry__pane-bg"
                        style={{ backgroundImage: `url('/images/artifacts/vintage-school-register.png')` }}
                        initial={shouldReduceMotion ? { opacity: 0.35 } : { scale: 1.08, opacity: 0 }}
                        animate={{
                            scale: hoveredPane === 'left' && !shouldReduceMotion ? 1.06 : 1,
                            opacity: hoveredPane === 'left' ? 0.56 : hoveredPane === 'right' ? 0.25 : 0.38,
                        }}
                        transition={{ duration: 0.9, ease: easeOutQuart }}
                    />
                    <div className="archive-entry__pane-overlay" />
                    <div className="archive-entry__pane-vignette" aria-hidden="true" />

                    <motion.div
                        className="archive-entry__pane-content"
                        variants={contentContainerVariants}
                        initial="hidden"
                        animate="visible"
                        custom={0.1}
                    >
                        <motion.div className="archive-entry__index-pill" variants={itemVariants}>
                            <span className="archive-entry__index-dot" aria-hidden="true" />
                            <span>{t.leftIndex}</span>
                        </motion.div>

                        <motion.span className="archive-entry__pane-tag" variants={itemVariants}>
                            {t.leftTag}
                        </motion.span>

                        <motion.h2 className="archive-entry__pane-title" variants={itemVariants}>
                            {t.leftTitle}
                        </motion.h2>

                        <motion.div
                            className="archive-entry__ornament"
                            variants={itemVariants}
                            animate={{ width: hoveredPane === 'left' ? 96 : 56 }}
                            transition={{ duration: 0.5, ease: easeOutQuart }}
                            aria-hidden="true"
                        />

                        <motion.p className="archive-entry__pane-desc" variants={itemVariants}>
                            {t.leftDesc}
                        </motion.p>

                        <motion.div className="archive-entry__btn-row" variants={itemVariants}>
                            <motion.button
                                className="archive-entry__btn"
                                whileHover={shouldReduceMotion ? {} : { y: -3, scale: 1.02 }}
                                whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(localizePath('/arsiv/koleksiyon'), { state: { tab: 0 } });
                                }}
                            >
                                <FileText size={16} aria-hidden="true" />
                                <span>{t.leftBtnDocs}</span>
                                <ArrowUpRight size={14} className="archive-entry__btn-arrow" aria-hidden="true" />
                            </motion.button>
                            <motion.button
                                className="archive-entry__btn"
                                whileHover={shouldReduceMotion ? {} : { y: -3, scale: 1.02 }}
                                whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(localizePath('/arsiv/koleksiyon'), { state: { tab: 1 } });
                                }}
                            >
                                <Landmark size={16} aria-hidden="true" />
                                <span>{t.leftBtnObjects}</span>
                                <ArrowUpRight size={14} className="archive-entry__btn-arrow" aria-hidden="true" />
                            </motion.button>
                        </motion.div>
                    </motion.div>

                    <motion.div
                        className="archive-entry__hint"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{
                            opacity: hoveredPane === 'left' ? 1 : 0.5,
                            y: hoveredPane === 'left' && !shouldReduceMotion ? -4 : 0,
                        }}
                        transition={{ duration: 0.4, ease: easeOutQuart }}
                    >
                        <motion.span
                            className="archive-entry__hint-line"
                            animate={{ width: hoveredPane === 'left' ? 48 : 28 }}
                            transition={{ duration: 0.4, ease: easeOutQuart }}
                        />
                        <span className="archive-entry__hint-text">{t.leftHint}</span>
                        <motion.span
                            className="archive-entry__hint-line"
                            animate={{ width: hoveredPane === 'left' ? 48 : 28 }}
                            transition={{ duration: 0.4, ease: easeOutQuart }}
                        />
                    </motion.div>
                </motion.div>

                {/* Center Animated Vertical Divider */}
                <motion.div
                    className="archive-entry__center-divider"
                    initial={shouldReduceMotion ? { opacity: 1 } : { scaleY: 0, opacity: 0 }}
                    animate={{ scaleY: 1, opacity: 1 }}
                    transition={{ duration: 1, ease: easeOutQuart }}
                    aria-hidden="true"
                >
                    <div className="archive-entry__center-medallion">
                        <Sparkles size={14} />
                    </div>
                </motion.div>

                {/* Right Pane — Istanbul Rumları Arşivi */}
                <motion.div
                    className={`archive-entry__pane archive-entry__pane--right ${hoveredPane === 'right' ? 'is-hovered' : ''} ${hoveredPane === 'left' ? 'is-dimmed' : ''}`}
                    onClick={() => navigate(localizePath('/arsiv/istanbul-rum'))}
                    onMouseEnter={() => setHoveredPane('right')}
                    onMouseLeave={() => setHoveredPane(null)}
                    onFocus={() => setHoveredPane('right')}
                    onBlur={() => setHoveredPane(null)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            navigate(localizePath('/arsiv/istanbul-rum'));
                        }
                    }}
                    role="link"
                    tabIndex={0}
                    animate={
                        shouldReduceMotion
                            ? {}
                            : {
                                flex: hoveredPane === 'right' ? 1.18 : hoveredPane === 'left' ? 0.85 : 1,
                            }
                    }
                    transition={{ duration: 0.7, ease: easeOutQuart }}
                >
                    <motion.div
                        className="archive-entry__pane-bg"
                        style={{ backgroundImage: `url('/images/artifacts/vintage-greek-book.png')` }}
                        initial={shouldReduceMotion ? { opacity: 0.35 } : { scale: 1.08, opacity: 0 }}
                        animate={{
                            scale: hoveredPane === 'right' && !shouldReduceMotion ? 1.06 : 1,
                            opacity: hoveredPane === 'right' ? 0.56 : hoveredPane === 'left' ? 0.25 : 0.38,
                        }}
                        transition={{ duration: 0.9, ease: easeOutQuart }}
                    />
                    <div className="archive-entry__pane-overlay" />
                    <div className="archive-entry__pane-vignette" aria-hidden="true" />

                    <motion.div
                        className="archive-entry__pane-content"
                        variants={contentContainerVariants}
                        initial="hidden"
                        animate="visible"
                        custom={0.22}
                    >
                        <motion.div className="archive-entry__index-pill" variants={itemVariants}>
                            <span className="archive-entry__index-dot" aria-hidden="true" />
                            <span>{t.irIndex}</span>
                        </motion.div>

                        <motion.span className="archive-entry__pane-tag" variants={itemVariants}>
                            {t.irTag}
                        </motion.span>

                        <motion.h2 className="archive-entry__pane-title" variants={itemVariants}>
                            {t.irTitle}
                        </motion.h2>

                        <motion.div
                            className="archive-entry__ornament"
                            variants={itemVariants}
                            animate={{ width: hoveredPane === 'right' ? 96 : 56 }}
                            transition={{ duration: 0.5, ease: easeOutQuart }}
                            aria-hidden="true"
                        />

                        <motion.p className="archive-entry__pane-desc" variants={itemVariants}>
                            {t.irDesc}
                        </motion.p>

                        <motion.div className="archive-entry__btn-row" variants={itemVariants}>
                            <motion.button
                                className="archive-entry__btn"
                                whileHover={shouldReduceMotion ? {} : { y: -3, scale: 1.02 }}
                                whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(localizePath('/arsiv/istanbul-rum'), { state: { tab: 0 } });
                                }}
                            >
                                <ScrollText size={16} aria-hidden="true" />
                                <span>{t.irBtnDocs}</span>
                                <ArrowUpRight size={14} className="archive-entry__btn-arrow" aria-hidden="true" />
                            </motion.button>
                            <motion.button
                                className="archive-entry__btn"
                                whileHover={shouldReduceMotion ? {} : { y: -3, scale: 1.02 }}
                                whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(localizePath('/arsiv/istanbul-rum'), { state: { tab: 1 } });
                                }}
                            >
                                <Camera size={16} aria-hidden="true" />
                                <span>{t.irBtnPhotos}</span>
                                <ArrowUpRight size={14} className="archive-entry__btn-arrow" aria-hidden="true" />
                            </motion.button>
                        </motion.div>
                    </motion.div>

                    <motion.div
                        className="archive-entry__hint"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{
                            opacity: hoveredPane === 'right' ? 1 : 0.5,
                            y: hoveredPane === 'right' && !shouldReduceMotion ? -4 : 0,
                        }}
                        transition={{ duration: 0.4, ease: easeOutQuart }}
                    >
                        <motion.span
                            className="archive-entry__hint-line"
                            animate={{ width: hoveredPane === 'right' ? 48 : 28 }}
                            transition={{ duration: 0.4, ease: easeOutQuart }}
                        />
                        <span className="archive-entry__hint-text">{t.irHint}</span>
                        <motion.span
                            className="archive-entry__hint-line"
                            animate={{ width: hoveredPane === 'right' ? 48 : 28 }}
                            transition={{ duration: 0.4, ease: easeOutQuart }}
                        />
                    </motion.div>
                </motion.div>
            </div>

            {/* Footer */}
            <motion.div
                className="archive-entry__footer"
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5, ease: easeOutQuart }}
            >
                <div>
                    <p className="archive-entry__footer-label">{t.footerLabel}</p>
                    <p className="archive-entry__footer-value">{t.footerValue}</p>
                </div>
                <div className="archive-entry__footer-right">
                    <span className="archive-entry__footer-badge">{t.footerAccess}</span>
                </div>
            </motion.div>
        </div>
    );
}
