import { useI18n } from '../../i18n/I18nContext';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import './HistoryPage.css';

export default function HistoryPage() {
    const { lang } = useI18n();

    // Translations for this specific page could also live in the global i18n file,
    // but for simplicity and modularity of this specific long-form content, we can define them locally
    // or use inline dictionaries.

    const content = {
        hero: {
            title1: { tr: '120 Yıllık', en: '120 Years of', el: '120 Χρόνια' },
            title2: { tr: 'Tarih', en: 'History', el: 'Ιστορίας' },
            subtitle: {
                tr: 'Galata\'nın kalbinde neoklasik tarih, akademik mükemmellik ve kültürel dönüşümün 120 yılı.',
                en: '120 years of neoclassical history, academic excellence, and cultural transformation in the heart of Galata.',
                el: '120 χρόνια νεοκλασικής ιστορίας, ακαδημαϊκής αριστείας και πολιτιστικής μεταμόρφωσης στην καρδιά του Γαλατά.'
            },
            badgeText: { tr: 'Kuruluş Yılı', en: 'Year of Foundation', el: 'Έτος Ίδρυσης' }
        },
        tarihce: {
            title: { tr: 'Tarihçe', en: 'History', el: 'Ιστορία' },
            p1: {
                tr: 'Galata Rum Okulu, Osmanlı İmparatorluğu\'nun modernleşme sürecinde Rum topluluğunun gerçekleştirdiği eğitim kurumları içindeki önemli bir yere sahip yapılardan biridir. Okul, Rum çocukların modern eğitim ve öğretimine katkı sağlayabilmek amacıyla dönemin hayırseverlerinden Eleni Zarifi\'nin destekleriyle, Galata Rum Cemaati tarafından bağışlanan arazi üzerinde inşa edilmiştir.',
                en: 'The Galata Greek School is one of the important structures among the educational institutions realized by the Greek community during the modernization process of the Ottoman Empire. The school was built on land donated by the Galata Greek Community, with the support of Eleni Zarifi, a philanthropist of the time, in order to contribute to the modern education and teaching of Greek children.',
                el: 'Το Ελληνικό Σχολείο Γαλατά είναι ένα από τα σημαντικά κτίρια μεταξύ των εκπαιδευτικών ιδρυμάτων που υλοποιήθηκαν από την ελληνική κοινότητα κατά τη διαδικασία εκσυγχρονισμού της Οθωμανικής Αυτοκρατορίας. Το σχολείο χτίστηκε σε γη που δωρίστηκε από την Ελληνική Κοινότητα Γαλατά, με την υποστήριξη της Ελένης Ζαρίφη, φιλανθρώπου της εποχής, προκειμένου να συμβάλει στη σύγχρονη εκπαίδευση και διδασκαλία των Ελλήνων παιδιών.'
            },
            p2: {
                tr: 'Okulun mimarları Patroklos Kambanakis ve Stavros Hristidis\'tir; Perikli Fotiadis danışmanlık mimarlık hizmeti vermiştir. Okulun açılışı 2 Haziran 1910 Çarşamba günü saat 11:00\'de gerçekleştirilmiştir.',
                en: 'The architects of the school are Patroklos Kambanakis and Stavros Hristidis; Perikli Fotiadis provided consulting architectural services. The opening of the school took place on Wednesday, June 2, 1910, at 11:00 AM.',
                el: 'Αρχιτέκτονες του σχολείου είναι ο Πάτροκλος Καμπανάκης και ο Σταύρος Χρηστίδης· ο Περικλής Φωτιάδης παρείχε συμβουλευτικές αρχιτεκτονικές υπηρεσίες. Τα εγκαίνια του σχολείου πραγματοποιήθηκαν την Τετάρτη 2 Ιουνίου 1910, στις 11:00 π.μ.'
            }
        },
        timeline: {
            title: { tr: 'Kronoloji', en: 'Timeline', el: 'Χρονολόγιο' },
            events: [
                {
                    year: '1885',
                    title: { tr: 'Kuruluş', en: 'Foundation', el: 'Ίδρυση' },
                    desc: {
                        tr: 'Galata Rum Okulu kuruldu.',
                        en: 'Galata Greek School was founded.',
                        el: 'Ιδρύθηκε το Ελληνικό Σχολείο Γαλατά.'
                    }
                },
                {
                    year: '1910',
                    title: { tr: 'Resmi Açılış', en: 'Official Opening', el: 'Επίσημα Εγκαίνια' },
                    desc: {
                        tr: '2 Haziran 1910 Çarşamba günü saat 11:00\'de resmi açılış gerçekleştirildi.',
                        en: 'The official opening took place on Wednesday, June 2, 1910, at 11:00 AM.',
                        el: 'Τα επίσημα εγκαίνια πραγματοποιήθηκαν την Τετάρτη 2 Ιουνίου 1910, στις 11:00 π.μ.'
                    }
                },
                {
                    year: '1958',
                    title: { tr: 'Cephe Düzenlemesi', en: 'Facade Arrangement', el: 'Διαμόρφωση Πρόσοψης' },
                    desc: {
                        tr: 'Ana cadde genişletilmesi sırasında binanın cephe kot seviyesi düzenlendi.',
                        en: 'The facade elevation of the building was arranged during the expansion of the main street.',
                        el: 'Το επίπεδο υψόμετρου της πρόσοψης του κτιρίου ρυθμίστηκε κατά τη διαπλάτυνση του κεντρικού δρόμου.'
                    }
                },
                {
                    year: '1988',
                    title: { tr: 'Eğitim Faaliyetlerinin Askıya Alınması', en: 'Suspension of Educational Activities', el: 'Αναστολή Εκπαιδευτικών Δραστηριοτήτων' },
                    desc: {
                        tr: 'Demografik değişimler nedeniyle eğitim faaliyetleri askıya alındı.',
                        en: 'Educational activities were suspended due to demographic changes.',
                        el: 'Οι εκπαιδευτικές δραστηριότητες ανεστάλησαν λόγω δημογραφικών αλλαγών.'
                    }
                },
                {
                    year: '2000',
                    title: { tr: 'Anaokulu Dönemi', en: 'Kindergarten Era', el: 'Εποχή Νηπιαγωγείου' },
                    desc: {
                        tr: '2000-2007 yılları arasında bina anaokulu olarak hizmet verdi.',
                        en: 'The building served as a kindergarten between 2000 and 2007.',
                        el: 'Το κτίριο λειτούργησε ως νηπιαγωγείο μεταξύ 2000 και 2007.'
                    }
                },
                {
                    year: '2012',
                    title: { tr: 'İade', en: 'Return', el: 'Επιστροφή' },
                    desc: {
                        tr: 'Bina İstanbul Rum Cemaati\'ne iade edildi.',
                        en: 'The building was returned to the Istanbul Greek Community.',
                        el: 'Το κτίριο επιστράφηκε στην Ελληνική Κοινότητα της Κωνσταντινούπολης.'
                    }
                },
                {
                    year: '2015',
                    title: { tr: 'Okul İşlevinin Sona Ermesi', en: 'End of School Function', el: 'Τέλος Σχολικής Λειτουργίας' },
                    desc: {
                        tr: 'Bina resmi olarak okul işlevi görmeyi bıraktı.',
                        en: 'The building officially ceased to function as a school.',
                        el: 'Το κτίριο έπαψε επίσημα να λειτουργεί ως σχολείο.'
                    }
                },
                {
                    year: '2019',
                    title: { tr: 'Restorasyon Başlangıcı', en: 'Start of Restoration', el: 'Έναρξη Ανακαίνισης' },
                    desc: {
                        tr: 'Kültür ve eğitim merkezi olarak dönüştürmek için büyük restorasyon projesi başlatıldı.',
                        en: 'A major restoration project was initiated to transform it into a cultural and educational center.',
                        el: 'Ξεκίνησε ένα μεγάλο έργο ανακαίνισης για τη μετατροπή του σε πολιτιστικό και εκπαιδευτικό κέντρο.'
                    }
                }
            ]
        },
        middleBlock: {
            title: {
                tr: 'Dönemin neoklasik-eklektik mimari üslubuyla inşa edilen okul, İstanbul\'un tarihi ticaret ve finans merkezi Galata\'da, Kemeraltı ve Bereketzade mahallelerinin kesişiminde bulunmaktadır.',
                en: 'Built in the neoclassical-eclectic architectural style of the period, the school is located in Galata, the historical trade and financial center of Istanbul, at the intersection of the Kemeraltı and Bereketzade neighborhoods.',
                el: 'Χτισμένο στο νεοκλασικό-εκλεκτικιστικό αρχιτεκτονικό στυλ της περιόδου, το σχολείο βρίσκεται στον Γαλατά, το ιστορικό εμπορικό και οικονομικό κέντρο της Κωνσταντινούπολης, στη διασταύρωση των γειτονιών Kemeraltı και Bereketzade.'
            },
            subtitle: {
                tr: 'Geçmişte çocuk sesleriyle yankılanan, ancak uzun yıllar sessizliğe gömülen okul binası 2012 yılında sahiplerine iade edilmiştir.',
                en: 'The school building, which resonated with the voices of children in the past but remained silent for many years, was returned to its owners in 2012.',
                el: 'Το κτίριο του σχολείου, που στο παρελθόν αντηχούσε από τις φωνές των παιδιών αλλά παρέμεινε σιωπηλό για πολλά χρόνια, επιστράφηκε στους ιδιοκτήτες του το 2012.'
            }
        },
        restoration: {
            title: { tr: 'Restorasyon', en: 'Restoration', el: 'Ανακαίνιση' },
            p1: {
                tr: 'Restorasyon projesinin uygulaması Ekümenik Patrik Hazretleri I. Bartholomeos\'un himayelerinde başlatılmıştır. Sayın Marina ve Athanasios Martinos\'un cömert ve zarif sponsorlukları sayesinde tamamlanmıştır. Restorasyon Murat Tabanlıoğlu (Tabanlıoğlu Mimarlık) öncülüğünde gerçekleştirilmiştir.',
                en: 'The implementation of the restoration project was initiated under the auspices of His All-Holiness Ecumenical Patriarch Bartholomew I. It was completed thanks to the generous and elegant sponsorships of Marina and Athanasios Martinos. The restoration was carried out under the leadership of Murat Tabanlıoğlu (Tabanlıoğlu Architects).',
                el: 'Η υλοποίηση του έργου ανακαίνισης ξεκίνησε υπό την αιγίδα της Αυτού Θειοτάτης Παναγιότητος του Οικουμενικού Πατριάρχου κ.κ. Βαρθολομαίου Α\'. Ολοκληρώθηκε χάρη στις γενναιόδωρες και κομψές χορηγίες της Μαρίνας και του Αθανάσιου Μαρτίνου. Η ανακαίνιση πραγματοποιήθηκε υπό την ηγεσία του Murat Tabanlıoğlu (Tabanlıoğlu Αρχιτέκτονες).'
            },
            p2: {
                tr: 'Galata Rum Okulu, yeni kurumsal adıyla "Okul" hem geçmişten gelen hafızasını, köklü geçmişini koruyarak, Rum kimliği ve kültürel mirasının bir kurumu olmayı, hem de geleceğe yönelik bir perspektif yaratmak üzere tüm İstanbulluları kucaklayan bir sanat ve eğitim alanı olmayı hedeflemektedir.',
                en: 'The Galata Greek School, with its new institutional name "The School," aims to be both an institution of Greek identity and cultural heritage by preserving its memory and deep-rooted past, and an art and education space that embraces all Istanbulites to create a perspective for the future.',
                el: 'Το Ελληνικό Σχολείο Γαλατά, με τη νέα θεσμική του ονομασία «Το Σχολείο», στοχεύει να αποτελέσει τόσο έναν θεσμό ελληνικής ταυτότητας και πολιτιστικής κληρονομιάς διατηρώντας τη μνήμη και το βαθιά ριζωμένο παρελθόν του, όσο και έναν χώρο τέχνης και εκπαίδευσης που αγκαλιάζει όλους τους Κωνσταντινουπολίτες για να δημιουργήσει μια προοπτική για το μέλλον.'
            },
            btn: { tr: 'Proje Detaylarını İncele', en: 'Explore Project Details', el: 'Εξερευνήστε τις Λεπτομέρειες του Έργου' }
        }
    };

    return (
        <div className="history-page" style={{ position: 'relative' }}>
            <Breadcrumbs items={[{ label: { tr: 'Tarihçe', en: 'History', el: 'Ιστορία' } }]} />
            {/* ══════ HERO SECTION ══════ */}
            <header className="hp-header-section">
                <div className="hp-header__bg-skew" />
                <div className="hp-header__inner max-w-7xl mx-auto px-6">
                    <div className="hp-header__grid">
                        <div className="hp-header__content">
                            <div className="hp-header__accent-line" />
                            <h1 className="hp-header__title">
                                {content.hero.title1[lang]} <span className="hp-header__title-italic">{content.hero.title2[lang]}</span>
                            </h1>
                            <p className="hp-header__subtitle">
                                {content.hero.subtitle[lang]}
                            </p>
                        </div>
                        <div className="hp-header__image-wrapper">
                            <img
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCAqd4msvB797TFhe3irMFX3DknVXwTJIUOxS_dp3eEgxF99EHtm29e5ZhkE4sJuqgDza21_6R7Rlwe8sZ8_o-FH3EMsXgymT2bX4t2kzTQlLrnbVp-Tbxi9IrwnzoB_-8f9b0_se-wLYc_G-2xM8GBnvWUre9Ek5jJuMoI5-zzmeniZ7hB9xOLDw2PBUuwTNax73FFKEYLDYOCIwi5veR5SmN_h5cUgPJoR30434Bruqevy7RBOFM30mbGNZf4yZrcRT7yq7WvpCA"
                                alt="Historical Building Exterior"
                                className="hp-header__image"
                            />
                            <div className="hp-header__badge hidden-mobile">
                                <span className="hp-header__badge-year">1885</span>
                                <span className="hp-header__badge-text">{content.hero.badgeText[lang]}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main>
                {/* ══════ TARIHCE (HISTORY) SECTION ══════ */}
                <section className="hp-tarihce">
                    <div className="hp-tarihce__watermark">1885</div>
                    <div className="hp-tarihce__inner max-w-7xl mx-auto px-6">
                        <div className="hp-tarihce__col-text">
                            <div className="greek-pattern-cyan hp-tarihce__pattern" />
                            <h2 className="hp-tarihce__title">{content.tarihce.title[lang]}</h2>
                            <div className="hp-tarihce__prose">
                                <p>{content.tarihce.p1[lang]}</p>
                                <p>{content.tarihce.p2[lang]}</p>
                            </div>

                            <div className="hp-tarihce__vintage-wrap group">
                                <img
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBropTZChPzQje-BRqdZ3j1LyYlrXj07umCKmmFQouJCyqPiGHVgpfb7N_uXxONucuf-3PtTll3ALS17KDlpDGUY_zwvC_38ni1JkTsr19wgBVI2LtO_GQu7MfStHtR0060LloX5fLMNfEyAXdCXlx-HltEwFbx99PEPy62yLCkFRw6x2QgV6je9MRktyJmTM6Phb_hfmwLE8bclEWL-nQ5iDMeW3mp92yPDKTM_RXfyLkNvu7PzulfrUVd8yCn094Z10BEuS_pn20"
                                    alt="Vintage Library Scan"
                                    className="hp-tarihce__vintage-img"
                                />
                                <div className="hp-tarihce__vintage-overlay" />
                            </div>
                        </div>

                        <div className="hp-tarihce__col-blue">
                            <div className="hp-tarihce__blue-box">
                                <span className="hp-tarihce__blue-watermark">1910</span>
                                <h3 className="hp-tarihce__blue-title">
                                    {content.middleBlock.title[lang]}
                                </h3>
                                <p className="hp-tarihce__blue-subtitle">
                                    {content.middleBlock.subtitle[lang]}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ══════ TIMELINE SECTION ══════ */}
                <section className="hp-timeline">
                    <div className="hp-timeline__inner max-w-7xl mx-auto px-6">
                        <h2 className="hp-timeline__title">{content.timeline.title[lang]}</h2>
                        <div className="hp-timeline__track">
                            {content.timeline.events.map((event, index) => (
                                <div key={index} className="hp-timeline__item">
                                    <div className="hp-timeline__year">{event.year}</div>
                                    <div className="hp-timeline__dot" />
                                    <div className="hp-timeline__content">
                                        <h3 className="hp-timeline__event-title">{event.title[lang]}</h3>
                                        <p className="hp-timeline__event-desc">{event.desc[lang]}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ══════ MARQUEE SECTION ══════ */}
                <section className="hp-marquee bg-charcoal dark:bg-black">
                    <div className="hp-marquee__track">
                        <span className="hp-marquee__text">"Bir Kültür Mirası"</span>
                        <span className="hp-marquee__text hp-marquee__text--outline">"An Educational Landmark"</span>
                        <span className="hp-marquee__text">"Ένα Πολιτιστικό Μνημείο"</span>
                        {/* Duplicated for seamless scrolling */}
                        <span className="hp-marquee__text">"Bir Kültür Mirası"</span>
                        <span className="hp-marquee__text hp-marquee__text--outline">"An Educational Landmark"</span>
                        <span className="hp-marquee__text">"Ένα Πολιτιστικό Μνημείο"</span>
                    </div>
                </section>

                {/* ══════ RESTORASYON SECTION ══════ */}
                <section className="hp-restoration">
                    <div className="hp-restoration__inner max-w-7xl mx-auto px-6">
                        <div className="hp-restoration__image-col">
                            <img
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA0p1IdArAgNWJcvJBU0ZbUJEz4ZUgGqW1fWQodxHmZfehEuMFqdis88m0fI_RjbY7JY321SzaA7ZnmgskRz0cimfGwAt9Y0_WpkNwHk74rU6H1qL0EmJB6ySQOsyLYC-lCJ2m0R8gVsGHS7fyr3-jUzvzG4iPYcx4lt3xnxrQHZ6yP6Re_Bluopxk098Qv1M4imTfhO0w2ylfqwNUWT03dE5HAOGsahgge9UnVykWzwkllb9YQIevj8CWSYm2reJEPHMHJrGfwES8"
                                alt="Exhibition Hall Interior"
                                className="hp-restoration__img"
                            />
                            <div className="hp-restoration__watermark">2023</div>
                        </div>

                        <div className="hp-restoration__text-col">
                            <div className="greek-pattern-cyan hp-restoration__pattern" />
                            <h2 className="hp-restoration__title">{content.restoration.title[lang]}</h2>
                            <div className="hp-restoration__prose">
                                <p>{content.restoration.p1[lang]}</p>
                                <p>{content.restoration.p2[lang]}</p>
                            </div>
                            <a href="#" className="hp-restoration__link group inline-flex items-center gap-2">
                                {content.restoration.btn[lang]}
                                <span className="hp-restoration__icon group-hover:translate-x-2 transition-transform">&rarr;</span>
                            </a>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
