import { useI18n } from '../../i18n/I18nContext';
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
        title: {
            tr: 'Athanasios ve Marina Martinou Vakfı',
            en: 'Athanasios and Marina Martinou Foundation',
            el: 'Ίδρυμα Αθανάσιος και Μαρίνα Μαρτίνου'
        },
        quote: {
            tr: '"Entelektüel mirasın restorasyonu yoluyla neoklasik İstanbul\'un mirasını korumak."',
            en: '"Preserving the legacy of neoclassical Istanbul through the restoration of intellectual heritage."',
            el: '"Διατηρώντας την κληρονομιά της νεοκλασικής Κωνσταντινούπολης μέσω της αποκατάστασης της πνευματικής κληρονομιάς."'
        },
        p1: {
            tr: 'Athanasios ve Marina Martinou Vakfı (AMMF), bu neoklasik simge yapının kapsamlı restorasyonunda ve vizyoner dönüşümünde çok önemli bir rol oynamıştır. Onların bağlılığı, Galata Rum Okulu\'nun gelecek nesiller için canlı bir kültürel mekan olarak kalmasını sağlamaktadır.',
            en: 'The Athanasios and Marina Martinou Foundation (AMMF) has played a crucial role in the comprehensive restoration and visionary transformation of this neoclassical landmark. Their dedication ensures that the Galata Greek School remains a vibrant cultural venue for future generations.',
            el: 'Το Ίδρυμα Αθανάσιος και Μαρίνα Μαρτίνου (AMMF) διαδραμάτισε κρίσιμο ρόλο στην ολοκληρωμένη ανακαίνιση και τον οραματικό μετασχηματισμό αυτού του νεοκλασικού ορόσημου. Η αφοσίωσή τους διασφαλίζει ότι το Ελληνικό Σχολείο Γαλατά παραμένει ένας ζωντανός πολιτιστικός χώρος για τις μελλοντικές γενιές.'
        },
        p2: {
            tr: 'Titiz bir mimari koruma sayesinde vakıf, okulun 120 yıllık tarihini modern çağın talepleriyle birleştirerek şehrin kalbinde sanat, arşivler ve akademik diyalog için bir sığınak yarattı.',
            en: 'Through meticulous architectural preservation, the foundation has merged the school\'s 120-year history with the demands of the modern era, creating a sanctuary for art, archives, and academic dialogue in the heart of the city.',
            el: 'Μέσω σχολαστικής αρχιτεκτονικής συντήρησης, το ίδρυμα συνδύασε την 120χρονη ιστορία του σχολείου με τις απαιτήσεις της σύγχρονης εποχής, δημιουργώντας ένα καταφύγιο τέχνης, αρχείων και ακαδημαϊκού διαλόγου στην καρδιά της πόλης.'
        },
        caption: {
            tr: 'Okulun Ana Salon Restorasyonu, 2021',
            en: "Main Hall Restoration of the School, 2021",
            el: 'Ανακαίνιση Κεντρικής Αίθουσας του Σχολείου, 2021'
        }
    },
    stats: {
        contribution: { label: { tr: 'Katkı', en: 'Contribution', el: 'Συνεισφορά' }, value: { tr: 'Öncü Restorasyon Ortağı', en: 'Lead Restoration Partner', el: 'Κύριος Συνεργάτης Ανακαίνισης' } },
        since: { label: { tr: 'Tarih', en: 'Date', el: 'Ημερομηνία' }, value: { tr: '2012', en: '2012', el: '2012' } },
        focus: { label: { tr: 'Odak', en: 'Focus', el: 'Εστίαση' }, value: { tr: 'Mimari Miras', en: 'Architectural Heritage', el: 'Αρχιτεκτονική Κληρονομιά' } }
    },
    vision: {
        eyebrow: { tr: '120 Yıllık Mirası Korumak', en: 'Preserving a 120-Year Heritage', el: 'Διατηρώντας μια Κληρονομιά 120 Ετών' },
        title: { tr: 'Kültürel Koruma İçin Bir Vizyon', en: 'A Vision for Cultural Preservation', el: 'Ένα Όραμα για Πολιτιστική Διατήρηση' },
        cards: [
            {
                icon: 'history_edu',
                title: { tr: 'Arşiv Restorasyonu', en: 'Archive Restoration', el: 'Αποκατάσταση Αρχείου' },
                desc: { tr: 'Okulun tarihi kayıtlarının ve akademik belgelerinin sistematik olarak dijitalleştirilmesi ve fiziksel olarak korunması.', en: "Systematic digitization and physical preservation of the school's historical records and academic documents.", el: 'Συστηματική ψηφιοποίηση και φυσική συντήρηση των ιστορικών αρχείων και ακαδημαϊκών εγγράφων του σχολείου.' }
            },
            {
                icon: 'architecture',
                title: { tr: 'Yapısal Bütünlük', en: 'Structural Integrity', el: 'Δομική Ακεραιότητα' },
                desc: { tr: 'Orijinal 19. yüzyıl estetik unsurlarını korurken neoklasik duvarları güçlendirmek.', en: 'Strengthening neoclassical walls while preserving original 19th-century aesthetic elements.', el: 'Ενίσχυση των νεοκλασικών τοίχων με ταυτόχρονη διατήρηση των αυθεντικών αισθητικών στοιχείων του 19ου αιώνα.' }
            },
            {
                icon: 'theater_comedy',
                title: { tr: 'Modern Mekan', en: 'Modern Space', el: 'Σύγχρονος Χώρος' },
                desc: { tr: 'Tarihi sınıfları son teknoloji sergi alanlarına ve akustik konferans salonlarına dönüştürmek.', en: 'Transforming historic classrooms into state-of-the-art exhibition areas and acoustic conference halls.', el: 'Μετατροπή των ιστορικών τάξεων σε υπερσύγχρονους εκθεσιακούς χώρους και ακουστικές αίθουσες συνεδρίων.' }
            }
        ]
    },
    partnership: {
        title: { tr: 'Kurumsal Ortaklık', en: 'Corporate Partnership', el: 'Εταιρική Συνεργασία' },
        desc: {
            tr: 'Galata Rum Okulu ile AMMF arasındaki işbirliği, özel-kamu mirası yönetimi için bir model teşkil etmektedir. Hem somut (bina) hem de somut olmayan (eğitim geçmişi) unsurlara odaklanarak, okulun İstanbul\'un entelektüel dokusuna katkı sağlamaya devam etmesini sağlıyoruz.',
            en: 'The collaboration between the Galata Greek School and AMMF serves as a model for private-public heritage management. By focusing on both tangible (the building) and intangible (educational history) elements, we ensure that the school continues to contribute to Istanbul\'s intellectual fabric.',
            el: 'Η συνεργασία μεταξύ του Ελληνικού Σχολείου Γαλατά και του AMMF χρησιμεύει ως μοντέλο για τη διαχείριση της ιδιωτικής-δημόσιας κληρονομιάς. Εστιάζοντας τόσο σε υλικά (το κτίριο) όσο και σε άυλα (εκπαιδευτική ιστορία) στοιχεία, διασφαλίζουμε ότι το σχολείο συνεχίζει να συμβάλλει στον πνευματικό ιστό της Κωνσταντινούπολης.'
        },
        btn: { tr: 'Arşiv Fotoğraflarını Gör', en: 'View Archive Photos', el: 'Προβολή Φωτογραφιών Αρχείου' }
    }
};

export default function AmmfPage() {
    const { lang } = useI18n();

    return (
        <div className="ammf-page bg-background-light dark:bg-background-dark text-charcoal dark:text-gray-200 transition-colors duration-300" style={{ position: 'relative' }}>
            <SEO 
                overrideTitle={lang === 'tr' ? 'AMMF Vakfı' : lang === 'el' ? 'Ίδρυμα AMMF' : 'AMMF Foundation'}
                overrideDescription={lang === 'tr' ? 'Athanasios ve Marina Martinou Vakfı (AMMF) ile Galata Rum Okulu ortaklığı. Tarihi restorasyon, kültürel miras koruma ve mimari proje detayları.' : 'Partnership between AMMF and the Galata Greek School. Historical restoration, cultural heritage preservation, and architectural project details.'}
                overrideKeywords="AMMF, Athanasios Marina Martinou, vakıf, restorasyon, galata rum okulu, kültürel miras, mimari koruma"
                aiSchema={{
                    "@context": "https://schema.org",
                    "@type": "NGO",
                    "name": "Athanasios and Marina Martinou Foundation (AMMF)",
                    "alternateName": "AMMF",
                    "description": "Foundation dedicated to the restoration and cultural preservation of the historic Galata Greek School in Istanbul.",
                    "url": "https://galatarumokulu.org.tr/ammf",
                    "foundingDate": "2012",
                    "areaServed": "Istanbul, Turkey"
                }}
            />
            <Breadcrumbs items={[
                { label: { tr: 'AMMF', en: 'AMMF', el: 'AMMF' } }
            ]} />
            <main className="ammf-main">

                {/* ══════ HERO SECTION ══════ */}
                <section className="ammf-hero">
                    <div className="ammf-hero__grid">
                        {/* Text Content */}
                        <div className="ammf-hero__content">
                            <h1 className="ammf-hero__title">
                                {content.hero.title[lang]}
                            </h1>
                            <div className="ammf-hero__divider" />
                            <p className="ammf-hero__quote">
                                {content.hero.quote[lang]}
                            </p>
                            <div className="ammf-hero__text">
                                <p>{content.hero.p1[lang]}</p>
                                <p>{content.hero.p2[lang]}</p>
                            </div>

                            {/* Stats */}
                            <div className="ammf-stats">
                                <div className="ammf-stat">
                                    <h4 className="ammf-stat__label">{content.stats.contribution.label[lang]}</h4>
                                    <p className="ammf-stat__value">{content.stats.contribution.value[lang]}</p>
                                </div>
                                <div className="ammf-stat">
                                    <h4 className="ammf-stat__label">{content.stats.since.label[lang]}</h4>
                                    <p className="ammf-stat__value">{content.stats.since.value[lang]}</p>
                                </div>
                                <div className="ammf-stat">
                                    <h4 className="ammf-stat__label">{content.stats.focus.label[lang]}</h4>
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
                        <h3 className="ammf-vision__title">{content.vision.title[lang]}</h3>
                        <p className="ammf-vision__eyebrow">{content.vision.eyebrow[lang]}</p>
                    </div>

                    <div className="ammf-vision__grid">
                        {content.vision.cards.map((card, idx) => (
                            <div key={idx} className="ammf-card">
                                <span className="material-symbols-outlined ammf-card__icon">{card.icon}</span>
                                <h4 className="ammf-card__title">{card.title[lang]}</h4>
                                <p className="ammf-card__desc">{card.desc[lang]}</p>
                            </div>
                        ))}
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

                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
