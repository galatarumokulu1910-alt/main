import { Link } from 'react-router-dom';
import { BookOpen, Landmark, Sparkles } from 'lucide-react';
import { useI18n } from '../../i18n/I18nContext';
import { AMMF_WEBSITE_URL, ARCHIVE_PUBLIC_ENABLED, PRODUCTION_SITE_ORIGIN } from '../../config/venueInfo';
import SEO from '../../components/SEO/SEO';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import './AmmfPage.css';

// Using the images from the Stitch design
const IMAGES = {
    hero: "/images/ammf/anasalon.webp",
    detail: "/images/ammf/acilis.webp"
};

// Content dictionary for AMMF Page translations
const content = {
    breadcrumbs: {
        home: { tr: 'Ana Sayfa', en: 'Home', el: 'Αρχική Σελίδα' },
        foundations: { tr: 'Vakıflar', en: 'Foundations', el: 'Ιδρύματα' },
        current: { tr: 'AMMF Güçbirliği', en: 'AMMF Partnership', el: 'Συνεργασία AMMF' }
    },
    hero: {
        eyebrow: {
            tr: 'Kurumsal Restorasyon & Himaye',
            en: 'Heritage Restoration & Patronage',
            el: 'Αποκατάσταση & Χορηγία'
        },
        title: {
            tr: 'Athanasios ve Marina Martinou Vakfı (AMMF)',
            en: 'Athanasios and Marina Martinou Foundation (AMMF)',
            el: 'Ίδρυμα Αθανασίου και Μαρίνας Μαρτίνου (AMMF)'
        },
        quote: {
            tr: '"Entelektüel mirasın restorasyonu yoluyla neoklasik İstanbul\'un mirasını korumak."',
            en: '"Preserving the legacy of neoclassical Istanbul through the restoration of intellectual heritage."',
            el: '«Διαφυλάσσοντας την παρακαταθήκη της νεοκλασικής Κωνσταντινούπολης μέσα από την αναβίωση της πνευματικής της κληρονομιάς.»'
        },
        p1Prefix: {
            tr: 'Athanasios ve Marina Martinou Vakfı (AMMF)',
            en: 'The Athanasios and Marina Martinou Foundation (AMMF)',
            el: 'Το Κοινωφελές Ίδρυμα Αθανασίου και Μαρίνας Μαρτίνου (AMMF)'
        },
        p1Rest: {
            tr: ', bu neoklasik simge yapının kapsamlı restorasyonunda ve vizyoner dönüşümünde çok önemli bir rol oynamıştır. Onların bağlılığı, Galata Rum Okulu\'nun gelecek nesiller için canlı bir kültürel mekan olarak kalmasını sağlamaktadır.',
            en: ' has played a crucial role in the comprehensive restoration and visionary transformation of this neoclassical landmark. Their dedication ensures that the Galata Greek School remains a vibrant cultural venue for future generations.',
            el: ' συνέβαλε καθοριστικά στην πλήρη αποκατάσταση και τη σύγχρονη επαναλειτουργία αυτού του νεοκλασικού τοπόσημου. Χάρη στη γενναιόδωρη στήριξή του, η Αστική Σχολή Γαλατά αποτελεί στις μέρες μας έναν ζωντανό χώρο πολιτισμού για τις επόμενες γενιές.'
        },
        p2: {
            tr: 'Titiz bir mimari koruma sayesinde vakıf, okulun 140 yıllık tarihini modern çağın talepleriyle birleştirerek şehrin kalbinde sanat, arşivler ve akademik diyalog için bir sığınak yarattı.',
            en: 'Through meticulous architectural preservation, the foundation has merged the school\'s 140-year history with the demands of the modern era, creating a sanctuary for art, archives, and academic dialogue in the heart of the city.',
            el: 'Μέσα από την υποδειγματική αρχιτεκτονική αποκατάσταση, η ιστορική διαδρομή 140 ετών της Σχολής συνδέθηκε αρμονικά με τις απαιτήσεις της σύγχρονης εποχής, δημιουργώντας έναν φιλόξενο χώρο τέχνης, αρχειακής έρευνας και επιστημονικού διαλόγου στην καρδιά της Πόλης.'
        },
        caption: {
            tr: 'Okulun Ana Salon Restorasyonu, 2021',
            en: "Main Hall Restoration of the School, 2021",
            el: 'Αποκατάσταση της Μεγάλης Αίθουσας της Σχολής, 2021'
        }
    },
    stats: {
        contribution: { label: { tr: 'Katkı', en: 'Contribution', el: 'Συμβολή' }, value: { tr: 'Öncü Restorasyon Ortağı', en: 'Lead Restoration Partner', el: 'Μέγας Χορηγός Αποκατάστασης' } },
        since: { label: { tr: 'Tarih', en: 'Date', el: 'Χρονολογία' }, value: { tr: '2012', en: '2012', el: '2012' } },
        focus: { label: { tr: 'Odak', en: 'Focus', el: 'Αντικείμενο' }, value: { tr: 'Mimari Miras', en: 'Architectural Heritage', el: 'Αρχιτεκτονική & Πολιτιστική Κληρονομιά' } }
    },
    vision: {
        eyebrow: { tr: '140 Yıllık Mirası Korumak', en: 'Preserving a 140-Year Heritage', el: 'Διαφύλαξη μιας Ιστορικής Παρακαταθήκης 140 Ετών' },
        title: { tr: 'Kültürel Koruma İçin Bir Vizyon', en: 'A Vision for Cultural Preservation', el: 'Όραμα Πολιτιστικής Διαφύλαξης' },
        cards: [
            {
                icon: 'history_edu',
                title: { tr: 'Arşiv Restorasyonu', en: 'Archive Restoration', el: 'Διάσωση & Ψηφιοποίηση Αρχείου' },
                desc: { tr: 'Okulun tarihi kayıtlarının ve akademik belgelerinin sistematik olarak dijitalleştirilmesi ve fiziksel olarak korunması.', en: "Systematic digitization and physical preservation of the school's historical records and academic documents.", el: 'Συστηματική ψηφιοποίηση, τεκμηρίωση και φυσική συντήρηση των ιστορικών μαθητολογίων και αρχειακών τεκμηρίων της Σχολής.' }
            },
            {
                icon: 'architecture',
                title: { tr: 'Yapısal Bütünlük', en: 'Structural Integrity', el: 'Στατική Θωράκιση & Αποκατάσταση' },
                desc: { tr: 'Orijinal 19. yüzyıl estetik unsurlarını korurken neoklasik duvarları güçlendirmek.', en: 'Strengthening neoclassical walls while preserving original 19th-century aesthetic elements.', el: 'Αντισεισμική ενίσχυση του φέροντος οργανισμού με απόλυτο σεβασμό στα αυθεντικά νεοκλασικά μορφολογικά στοιχεία του κτιρίου.' }
            },
            {
                icon: 'theater_comedy',
                title: { tr: 'Modern Mekan', en: 'Modern Space', el: 'Σύγχρονοι Εκθεσιακοί Χώροι' },
                desc: { tr: 'Tarihi sınıfları müze standartlarında sergi alanlarına ve akustik konferans salonlarına dönüştürmek.', en: 'Transforming historic classrooms into museum-grade exhibition galleries and acoustic conference halls.', el: 'Ανάδειξη των ιστορικών αιθουσών διδασκαλίας σε εκθεσιακούς χώρους μουσειακών προδιαγραφών και αίθουσες συνεδρίων.' }
            }
        ]
    },
    partnership: {
        title: { tr: 'Kurumsal Ortaklık', en: 'Corporate Partnership', el: 'Θεσμική Σύμπραξη' },
        desc: {
            tr: 'Galata Rum Okulu ile AMMF arasındaki işbirliği, özel-kamu mirası yönetimi için bir model teşkil etmektedir. Hem somut (bina) hem de somut olmayan (eğitim geçmişi) unsurlara odaklanarak, okulun İstanbul\'un entelektüel dokusuna katkı sağlamaya devam etmesini sağlıyoruz.',
            en: 'The collaboration between the Galata Greek School and AMMF serves as a model for private-public heritage management. By focusing on both tangible (the building) and intangible (educational history) elements, we ensure that the school continues to contribute to Istanbul\'s intellectual fabric.',
            el: 'Η σύμπραξη μεταξύ της Αστικής Σχολής Γαλατά και του Ιδρύματος Αθανασίου και Μαρίνας Μαρτίνου (AMMF) αποτελεί πρότυπο διαφύλαξης της πολιτιστικής κληρονομιάς. Αναδεικνύοντας τόσο το υλικό μνημείο (το ιστορικό διδακτήριο) όσο και την άυλη παρακαταθήκη του (την εκπαιδευτική και κοινοτική μνήμη), η Σχολή συνεχίζει να εμπλουτίζει την πνευματική και πολιτιστική ζωή της Κωνσταντινούπολης.'
        },
        btn: { tr: 'Arşiv Fotoğraflarını Gör', en: 'View Archive Photos', el: 'Περιήγηση στο Ψηφιακό Αρχείο' }
    }
};

export default function AmmfPage() {
    const { lang, localizePath } = useI18n();
    const cardLinks = [ARCHIVE_PUBLIC_ENABLED ? '/arsiv' : '/tarihce', '/tarihce', '/mekan-kiralama'];

    return (
        <div className="ammf-page" style={{ position: 'relative' }}>
            <SEO 
                overrideTitle={lang === 'tr' ? 'AMMF Vakfı & Restorasyon' : lang === 'el' ? 'Ίδρυμα AMMF & Αποκατάσταση' : 'AMMF Foundation & Restoration'}
                overrideDescription={lang === 'tr' ? 'Athanasios ve Marina Martinou Vakfı (AMMF) ile Galata Rum Okulu Vakfı - Kültür Merkezi ortaklığı ve tarihi mimari restorasyon projesi.' : lang === 'el' ? 'Συνεργασία του Ιδρύματος Αθανασίου και Μαρίνας Μαρτίνου (AMMF) με την Αστική Σχολή Γαλατά – Πολιτιστικό Κέντρο για την ιστορική αποκατάσταση του κτιρίου.' : 'Partnership between the Athanasios and Marina Martinou Foundation (AMMF) and Galata Greek School Foundation for architectural restoration.'}
                overrideKeywords={lang === 'tr' ? 'AMMF, Athanasios Marina Martinou, vakıf, restorasyon, galata rum okulu, kültürel miras, mimari koruma' : lang === 'el' ? 'AMMF, Αθανάσιος Μαρίνα Μαρτίνου, ίδρυμα, αποκατάσταση, αστική σχολή γαλατά, πολιτιστική κληρονομιά, αρχιτεκτονική διατήρηση' : 'AMMF, Athanasios Marina Martinou, foundation, restoration, galata greek school, cultural heritage, architectural preservation'}
                aiSchema={{
                    "@context": "https://schema.org",
                    "@type": "NGO",
                    "name": "Athanasios and Marina Martinou Foundation (AMMF)",
                    "alternateName": "AMMF",
                    "description": "Foundation dedicated to the restoration and cultural preservation of the historic Galata Greek School Foundation - Cultural Center in Istanbul.",
                    "url": `${PRODUCTION_SITE_ORIGIN}${localizePath('/ammf')}`,
                    "sameAs": [AMMF_WEBSITE_URL],
                    "foundingDate": "2012",
                    "areaServed": "Istanbul, Turkey"
                }}
            />
            <Breadcrumbs items={[
                { label: { tr: 'AMMF', en: 'AMMF', el: 'AMMF' } }
            ]} />
            <div className="ammf-main">

                {/* ══════ HERO SECTION ══════ */}
                <section className="ammf-hero">
                    <div className="ammf-hero__grid">
                        {/* Text Content */}
                        <div className="ammf-hero__content">
                            <span className="ammf-hero__eyebrow">
                                {content.hero.eyebrow[lang]}
                            </span>
                            <h1 className="ammf-hero__title">
                                <a
                                    href={AMMF_WEBSITE_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ color: 'inherit', textDecoration: 'none' }}
                                >
                                    {content.hero.title[lang]}
                                </a>
                            </h1>
                            <div className="ammf-hero__divider" />
                            <p className="ammf-hero__quote">
                                {content.hero.quote[lang]}
                            </p>
                            <div className="ammf-hero__text">
                                <p>
                                    <a
                                        href={AMMF_WEBSITE_URL}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ color: 'inherit', fontWeight: 500, textDecoration: 'underline', textDecorationColor: 'var(--color-brass-gold)', textUnderlineOffset: '3px' }}
                                    >
                                        {content.hero.p1Prefix[lang]}
                                    </a>
                                    {content.hero.p1Rest[lang]}
                                </p>
                                <p>{content.hero.p2[lang]}</p>
                            </div>

                            {/* Stats */}
                            <div className="ammf-stats">
                                <div className="ammf-stat">
                                    <h2 className="ammf-stat__label">{content.stats.contribution.label[lang]}</h2>
                                    <p className="ammf-stat__value">{content.stats.contribution.value[lang]}</p>
                                </div>
                                <div className="ammf-stat">
                                    <h2 className="ammf-stat__label">{content.stats.since.label[lang]}</h2>
                                    <p className="ammf-stat__value">{content.stats.since.value[lang]}</p>
                                </div>
                                <div className="ammf-stat">
                                    <h2 className="ammf-stat__label">{content.stats.focus.label[lang]}</h2>
                                    <p className="ammf-stat__value">{content.stats.focus.value[lang]}</p>
                                </div>
                            </div>
                        </div>

                        {/* Image Content */}
                        <div className="ammf-hero__image-wrapper">
                            <div className="ammf-image-border-fx">
                                <div className="ammf-image-border-fx__outline" />
                                <div className="ammf-image-border-fx__inner">
                                    <div
                                        className="ammf-image-border-fx__bg"
                                        style={{ backgroundImage: `url(${IMAGES.hero})` }}
                                    >
                                        <div className="ammf-image-border-fx__gradient" />
                                    </div>
                                </div>
                            </div>
                            <div className="ammf-hero__caption">
                                <span>{content.hero.caption[lang]}</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ══════ VISION SECTION ══════ */}
                <section className="ammf-vision">
                    <div className="ammf-vision__header">
                        <h2 className="ammf-vision__title">{content.vision.title[lang]}</h2>
                        <p className="ammf-vision__eyebrow">{content.vision.eyebrow[lang]}</p>
                    </div>

                    <div className="ammf-vision__grid">
                        {content.vision.cards.map((card, idx) => {
                            const IconComponent = idx === 0 ? BookOpen : idx === 1 ? Landmark : Sparkles;
                            return (
                                <Link key={idx} to={localizePath(cardLinks[idx] || '/arsiv')} className="ammf-card" style={{ textDecoration: 'none' }}>
                                    <span className="ammf-card__icon" aria-hidden="true">
                                        <IconComponent size={28} strokeWidth={1.5} />
                                    </span>
                                    <h3 className="ammf-card__title">{card.title[lang]}</h3>
                                    <p className="ammf-card__desc">{card.desc[lang]}</p>
                                </Link>
                            );
                        })}
                    </div>
                </section>

                {/* ══════ PARTNERSHIP SECTION ══════ */}
                <section className="ammf-partnership">
                    <div className="ammf-partnership__inner">
                        <div className="ammf-partnership__image-col">
                            <div
                                className="ammf-partnership__image"
                                style={{ backgroundImage: `url(${IMAGES.detail})` }}
                            />
                        </div>
                        <div className="ammf-partnership__content-col">
                            <h2 className="ammf-partnership__title">{content.partnership.title[lang]}</h2>
                            <p className="ammf-partnership__text">
                                {content.partnership.desc[lang]}
                            </p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--space-6)' }}>
                                {ARCHIVE_PUBLIC_ENABLED && (
                                    <Link to={localizePath('/arsiv/koleksiyon')} className="ammf-btn">
                                        <span>{content.partnership.btn[lang]}</span>
                                        <span className="ammf-btn__icon">→</span>
                                    </Link>
                                )}
                                <Link
                                    to={localizePath('/tarihce')}
                                    style={{ fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-brass-gold)' }}
                                >
                                    {lang === 'tr' ? 'Tarihçeyi Keşfedin →' : lang === 'el' ? 'Εξερευνήστε την Ιστορία →' : 'Explore History →'}
                                </Link>
                                <Link
                                    to={localizePath('/gecmis-etkinlikler')}
                                    style={{ fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-brass-gold)' }}
                                >
                                    {lang === 'tr' ? 'Konser, Sergi & Sempozyumlar →' : lang === 'el' ? 'Συναυλίες, Εκθέσεις & Συμπόσια →' : 'Concerts, Exhibitions & Symposia →'}
                                </Link>
                                <Link
                                    to={localizePath('/mekan-kiralama')}
                                    style={{ fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-brass-gold)' }}
                                >
                                    {lang === 'tr' ? 'Kültürel Etkinlik & Mekan Kiralama →' : lang === 'el' ? 'Ενοικίαση Χώρου Εκδηλώσεων →' : 'Cultural Event & Venue Hire →'}
                                </Link>
                                <a
                                    href={AMMF_WEBSITE_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-brass-gold)', textDecoration: 'underline', textUnderlineOffset: '4px' }}
                                >
                                    {lang === 'tr' ? 'AMMF Resmi Web Sitesi (iamm.gr) ↗' : lang === 'el' ? 'Επίσημος Ιστότοπος AMMF (iamm.gr) ↗' : 'Official AMMF Website (iamm.gr) ↗'}
                                </a>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
