import { useState, useEffect } from 'react';
import { useI18n } from '../../i18n/I18nContext';
import { supabase } from '../../services/supabaseClient';
import { useCmsContent } from '../../hooks/useCmsContent';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import './HistoryPage.css';

type Lang = 'tr' | 'en' | 'el';

export default function HistoryPage() {
    const { lang } = useI18n();
    const l = (lang as Lang) || 'en';
    const cms = useCmsContent('history');

    const [timeline, setTimeline] = useState<any[]>([]);
    const [timelineLoading, setTimelineLoading] = useState(true);

    useEffect(() => {
        const fetchTimeline = async () => {
            const { data } = await supabase
                .from('history_timeline')
                .select('*')
                .eq('status', 'published')
                .order('order_index', { ascending: true })
                .order('year', { ascending: true });

            if (data && data.length > 0) {
                setTimeline(data);
            } else {
                // Fallback to static events if DB is empty
                setTimeline(staticTimeline);
            }
            setTimelineLoading(false);
        };
        fetchTimeline();
    }, []);

    const getTimelineTitle = (item: any) => {
        if (l === 'tr') return item.title_tr || item.title_en || item.year;
        if (l === 'el') return item.title_el || item.title_en || item.year;
        return item.title_en || item.year;
    };

    const getTimelineDesc = (item: any) => {
        if (l === 'tr') return item.description_tr || item.description_en || '';
        if (l === 'el') return item.description_el || item.description_en || '';
        return item.description_en || '';
    };

    const content = {
        hero: {
            title1: { tr: cms.get('hero_title1', l, '120 Yıllık'), en: cms.get('hero_title1', 'en', '120 Years of'), el: cms.get('hero_title1', 'el', '120 Χρόνια') },
            title2: { tr: cms.get('hero_title2', l, 'Tarih'), en: cms.get('hero_title2', 'en', 'History'), el: cms.get('hero_title2', 'el', 'Ιστορίας') },
            subtitle: {
                tr: cms.get('hero_subtitle', 'tr', 'Galata\'nın kalbinde neoklasik tarih, akademik mükemmellik ve kültürel dönüşümün 120 yılı.'),
                en: cms.get('hero_subtitle', 'en', '120 years of neoclassical history, academic excellence, and cultural transformation in the heart of Galata.'),
                el: cms.get('hero_subtitle', 'el', '120 χρόνια νεοκλασικής ιστορίας, ακαδημαϊκής αριστείας και πολιτιστικής μεταμόρφωσης στην καρδιά του Γαλατά.')
            },
            badgeText: { tr: 'Kuruluş Yılı', en: 'Year of Foundation', el: 'Έτος Ίδρυσης' }
        },
        tarihce: {
            title: { tr: 'Tarihçe', en: 'History', el: 'Ιστορία' },
            p1: {
                tr: cms.get('tarihce_p1', 'tr', 'Galata Rum Okulu, Osmanlı İmparatorluğu\'nun modernleşme sürecinde önemli bir yapıdır.'),
                en: cms.get('tarihce_p1', 'en', 'The Galata Greek School is one of the important educational institutions of the Greek community.'),
                el: cms.get('tarihce_p1', 'el', 'Το Ελληνικό Σχολείο Γαλατά είναι ένα από τα σημαντικά εκπαιδευτικά ιδρύματα.')
            },
            p2: {
                tr: cms.get('tarihce_p2', 'tr', 'Okulun mimarları Patroklos Kambanakis ve Stavros Hristidis\'tir.'),
                en: cms.get('tarihce_p2', 'en', 'The architects of the school are Patroklos Kambanakis and Stavros Hristidis.'),
                el: cms.get('tarihce_p2', 'el', 'Αρχιτέκτονες του σχολείου είναι ο Πάτροκλος Καμπανάκης και ο Σταύρος Χρηστίδης.')
            }
        },
        timelineTitle: { tr: 'Kronoloji', en: 'Timeline', el: 'Χρονολόγιο' },
        middleBlock: {
            title: {
                tr: cms.get('middle_title', 'tr', 'Dönemin neoklasik-eklektik mimari üslubuyla inşa edilen okul, Galata\'da bulunmaktadır.'),
                en: cms.get('middle_title', 'en', 'Built in the neoclassical-eclectic architectural style of the period, the school is located in Galata.'),
                el: cms.get('middle_title', 'el', 'Χτισμένο στο νεοκλασικό-εκλεκτικιστικό αρχιτεκτονικό στυλ της περιόδου, το σχολείο βρίσκεται στον Γαλατά.')
            },
            subtitle: {
                tr: cms.get('middle_subtitle', 'tr', 'Okul binası 2012 yılında sahiplerine iade edilmiştir.'),
                en: cms.get('middle_subtitle', 'en', 'The school building was returned to its owners in 2012.'),
                el: cms.get('middle_subtitle', 'el', 'Το κτίριο του σχολείου επιστράφηκε στους ιδιοκτήτες του το 2012.')
            }
        },
        restoration: {
            title: { tr: 'Restorasyon', en: 'Restoration', el: 'Ανακαίνιση' },
            p1: {
                tr: cms.get('restoration_p1', 'tr', 'Restorasyon projesinin uygulaması Ekümenik Patrik Hazretleri I. Bartholomeos\'un himayelerinde başlatılmıştır.'),
                en: cms.get('restoration_p1', 'en', 'The restoration project was initiated under the auspices of Ecumenical Patriarch Bartholomew I.'),
                el: cms.get('restoration_p1', 'el', 'Η υλοποίηση του έργου ανακαίνισης ξεκίνησε υπό την αιγίδα του Οικουμενικού Πατριάρχου.')
            },
            p2: {
                tr: cms.get('restoration_p2', 'tr', 'Galata Rum Okulu, tüm İstanbulluları kucaklayan bir sanat ve eğitim alanı olmayı hedeflemektedir.'),
                en: cms.get('restoration_p2', 'en', 'The Galata Greek School aims to be an art and education space that embraces all Istanbulites.'),
                el: cms.get('restoration_p2', 'el', 'Το Ελληνικό Σχολείο Γαλατά στοχεύει να αποτελέσει έναν χώρο τέχνης και εκπαίδευσης.')
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
                                {content.hero.title1[l]} <span className="hp-header__title-italic">{content.hero.title2[l]}</span>
                            </h1>
                            <p className="hp-header__subtitle">
                                {content.hero.subtitle[l]}
                            </p>
                        </div>
                        <div className="hp-header__image-wrapper">
                            <img
                                src="/images/homepage/hero-facade.jpg"
                                alt="Historical Building Exterior"
                                className="hp-header__image"
                            />
                            <div className="hp-header__badge hidden-mobile">
                                <span className="hp-header__badge-year">1885</span>
                                <span className="hp-header__badge-text">{content.hero.badgeText[l]}</span>
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
                            <h2 className="hp-tarihce__title">{content.tarihce.title[l]}</h2>
                            <div className="hp-tarihce__prose">
                                <p>{content.tarihce.p1[l]}</p>
                                <p>{content.tarihce.p2[l]}</p>
                            </div>

                            <div className="hp-tarihce__vintage-wrap group">
                                <img
                                    src="/images/homepage/detail-1.jpg"
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
                                    {content.middleBlock.title[l]}
                                </h3>
                                <p className="hp-tarihce__blue-subtitle">
                                    {content.middleBlock.subtitle[l]}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ══════ TIMELINE SECTION — fetched from Supabase ══════ */}
                <section className="hp-timeline">
                    <div className="hp-timeline__inner max-w-7xl mx-auto px-6">
                        <h2 className="hp-timeline__title">{content.timelineTitle[l]}</h2>
                        {timelineLoading ? (
                            <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>Yükleniyor...</div>
                        ) : (
                            <div className="hp-timeline__track">
                                {timeline.map((event, index) => (
                                    <div key={event.id || index} className="hp-timeline__item">
                                        <div className="hp-timeline__year">{event.year}</div>
                                        <div className="hp-timeline__dot" />
                                        <div className="hp-timeline__content">
                                            <h3 className="hp-timeline__event-title">{getTimelineTitle(event)}</h3>
                                            <p className="hp-timeline__event-desc">{getTimelineDesc(event)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {/* ══════ MARQUEE SECTION ══════ */}
                <section className="hp-marquee bg-charcoal dark:bg-black">
                    <div className="hp-marquee__track">
                        <span className="hp-marquee__text">"Bir Kültür Mirası"</span>
                        <span className="hp-marquee__text hp-marquee__text--outline">"An Educational Landmark"</span>
                        <span className="hp-marquee__text">"Ένα Πολιτιστικό Μνημείο"</span>
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
                                src="/images/homepage/interior.jpg"
                                alt="Exhibition Hall Interior"
                                className="hp-restoration__img"
                            />
                            <div className="hp-restoration__watermark">2023</div>
                        </div>

                        <div className="hp-restoration__text-col">
                            <div className="greek-pattern-cyan hp-restoration__pattern" />
                            <h2 className="hp-restoration__title">{content.restoration.title[l]}</h2>
                            <div className="hp-restoration__prose">
                                <p>{content.restoration.p1[l]}</p>
                                <p>{content.restoration.p2[l]}</p>
                            </div>
                            <a href="#" className="hp-restoration__link group inline-flex items-center gap-2">
                                {content.restoration.btn[l]}
                                <span className="hp-restoration__icon group-hover:translate-x-2 transition-transform">&rarr;</span>
                            </a>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}

// Static fallback events (used when DB has no published timeline entries)
const staticTimeline = [
    { id: 's1', year: '1885', title_tr: 'Kuruluş', title_en: 'Foundation', title_el: 'Ίδρυση', description_tr: 'Galata Rum Okulu kuruldu.', description_en: 'Galata Greek School was founded.', description_el: 'Ιδρύθηκε το Ελληνικό Σχολείο Γαλατά.' },
    { id: 's2', year: '1910', title_tr: 'Resmi Açılış', title_en: 'Official Opening', title_el: 'Επίσημα Εγκαίνια', description_tr: '2 Haziran 1910 Çarşamba günü saat 11:00\'de resmi açılış gerçekleştirildi.', description_en: 'The official opening took place on Wednesday, June 2, 1910, at 11:00 AM.', description_el: 'Τα επίσημα εγκαίνια πραγματοποιήθηκαν την Τετάρτη 2 Ιουνίου 1910.' },
    { id: 's3', year: '1958', title_tr: 'Cephe Düzenlemesi', title_en: 'Facade Arrangement', title_el: 'Διαμόρφωση Πρόσοψης', description_tr: 'Ana cadde genişletilmesi sırasında binanın cephe kot seviyesi düzenlendi.', description_en: 'The facade elevation of the building was arranged during the expansion of the main street.', description_el: 'Το επίπεδο υψόμετρου της πρόσοψης του κτιρίου ρυθμίστηκε.' },
    { id: 's4', year: '1988', title_tr: 'Eğitim Faaliyetlerinin Askıya Alınması', title_en: 'Suspension of Educational Activities', title_el: 'Αναστολή Εκπαιδευτικών Δραστηριοτήτων', description_tr: 'Demografik değişimler nedeniyle eğitim faaliyetleri askıya alındı.', description_en: 'Educational activities were suspended due to demographic changes.', description_el: 'Οι εκπαιδευτικές δραστηριότητες ανεστάλησαν.' },
    { id: 's5', year: '2000', title_tr: 'Anaokulu Dönemi', title_en: 'Kindergarten Era', title_el: 'Εποχή Νηπιαγωγείου', description_tr: '2000-2007 yılları arasında bina anaokulu olarak hizmet verdi.', description_en: 'The building served as a kindergarten between 2000 and 2007.', description_el: 'Το κτίριο λειτούργησε ως νηπιαγωγείο μεταξύ 2000 και 2007.' },
    { id: 's6', year: '2012', title_tr: 'İade', title_en: 'Return', title_el: 'Επιστροφή', description_tr: 'Bina İstanbul Rum Cemaati\'ne iade edildi.', description_en: 'The building was returned to the Istanbul Greek Community.', description_el: 'Το κτίριο επιστράφηκε στην Ελληνική Κοινότητα.' },
    { id: 's7', year: '2015', title_tr: 'Okul İşlevinin Sona Ermesi', title_en: 'End of School Function', title_el: 'Τέλος Σχολικής Λειτουργίας', description_tr: 'Bina resmi olarak okul işlevi görmeyi bıraktı.', description_en: 'The building officially ceased to function as a school.', description_el: 'Το κτίριο έπαψε επίσημα να λειτουργεί ως σχολείο.' },
    { id: 's8', year: '2019', title_tr: 'Restorasyon Başlangıcı', title_en: 'Start of Restoration', title_el: 'Έναρξη Ανακαίνισης', description_tr: 'Kültür ve eğitim merkezi olarak dönüştürmek için büyük restorasyon projesi başlatıldı.', description_en: 'A major restoration project was initiated to transform it into a cultural and educational center.', description_el: 'Ξεκίνησε ένα μεγάλο έργο ανακαίνισης.' },
];
