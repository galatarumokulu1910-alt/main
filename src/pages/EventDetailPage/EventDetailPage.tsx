import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useI18n } from '../../i18n/I18nContext';
import { supabase } from '../../services/supabaseClient';
import { decodeHtmlEntities } from '../../utils/decodeHtml';
import SEO from '../../components/SEO/SEO';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import './EventDetailPage.css';

const CURATED_EVENT_DESCRIPTIONS: Record<string, Record<'tr' | 'en' | 'el', string>> = {
    'toz-sergisi': {
        tr: [
            'Sanat kuramcısı, yazar ve küratör Ali Artun ile heykeltıraş ve kavramsal sanatçı Ahmet Yiğider’i bir araya getiren “TÖZ” sergisi, 17 Ocak – 8 Şubat 2026 tarihleri arasında Galata Rum Okulu Vakfı - Kültür Merkezi’nde sanatseverlerle buluştu.',
            'Sergi, mimarlığı gündelik yaşamın faydacı pratiklerinden, yapıların salt işlevselliğinden ve rasyonalist kurgulardan soyutlayarak; onu kadim, şiirsel, büyüsel ve sembolik bir dil olarak ele alır. Ali Artun’un kavramsal çerçevesinde “TÖZ”, çevremizi kuşatan sıradan yapılaşmanın ötesine geçerek formun, geometrinin, sayının ve sembolün imgesel dünyasına odaklanan bir mimarlık ve düşünce sergisi niteliği taşır.',
            'Ahmet Yiğider’in Galata Rum Okulu’nun tarihi neoklasik atmosferiyle diyalog kuran heykel ve mekânsal yerleştirmeleri, insanlığın kadim hafızasındaki izleri, tözü ve gizemi görünür kılar. Sergi, izleyiciyi mekân, form ve varoluş arasındaki derin ilişki üzerine kozmik ve şiirsel bir tefekkür alanına davet eder.',
        ].join('\n\n'),
        en: [
            'Bringing together art theorist, author, and curator Ali Artun with sculptor and conceptual artist Ahmet Yiğider, the exhibition “TÖZ” (Substance) welcomed visitors at the Galata Greek School Foundation - Cultural Center between January 17 and February 8, 2026.',
            'Abstracting architecture from utilitarian daily practices, functionalist constraints, and rationalist construction, the exhibition approaches architecture as an ancient, poetic, and symbolic language. Within Ali Artun’s curatorial framework, “TÖZ” transcends ordinary built environments to explore the imaginative realm of form, geometry, number, and symbol.',
            'In dialogue with the historic neoclassical atmosphere of the Galata Greek School, Ahmet Yiğider’s sculptures and spatial installations render visible the traces, substance, and mystery embedded in humanity’s ancient memory — inviting viewers into a space of contemplation on space, form, and existence.',
        ].join('\n\n'),
        el: [
            'Συνενώνοντας τον θεωρητικό της τέχνης, συγγραφέα και επιμελητή Ali Artun με τον γλύπτη και εννοιολογικό καλλιτέχνη Ahmet Yiğider, η έκθεση «TÖZ» (Ουσία) φιλοξενήθηκε στο Ίδρυμα Ελληνικού Σχολείου Γαλατά - Πολιτιστικό Κέντρο από τις 17 Ιανουαρίου έως τις 8 Φεβρουαρίου 2026.',
            'Αποδεσμεύοντας την αρχιτεκτονική από τη χρησιμοθηρική καθημερινότητα και τον ορθολογισμό, η έκθεση την προσεγγίζει ως μια αρχέγονη, ποιητική και συμβολική γλώσσα που εστιάζει στον φαντασιακό κόσμο της μορφής, της γεωμετρίας, του αριθμού και του συμβόλου.',
            'Σε διάλογο με την ιστορική νεοκλασική ατμόσφαιρα της Σχολής Γαλατά, τα γλυπτά και οι χωρικές εγκαταστάσεις του Ahmet Yiğider αναδεικνύουν τα ίχνη και την ουσία της αρχαίας μνήμης, προσκαλώντας τον επισκέπτη σε έναν χώρο στοχασμού γύρω από τον χώρο, τη μορφή και την ύπαρξη.',
        ].join('\n\n'),
    },
    'samatya-donem-konseri-sesler-hazinesi-orkestra-ve-solistleri': {
        tr: 'Sesler Hazinesi Orkestra ve Solistleri tarafından Galata Rum Okulu’nun tarihi ana salonunda gerçekleştirilen “Samatya” Dönem Konseri, İstanbul’un çok kültürlü müzik mirasını ve Samatya’nın tarihsel ezgilerini dinleyicilerle buluşturdu.',
        en: 'Performed by the Treasury of Voices Orchestra and Soloists in the historic Grand Hall of the Galata Greek School, the “Samatya” Period Concert brought Istanbul’s multicultural musical heritage and historical melodies to the audience.',
        el: 'Η συναυλία εποχής «Samatya» από την Ορχήστρα και τους Σολίστ «Θησαυρός Φωνών» στην ιστορική αίθουσα της Σχολής Γαλατά ανέδειξε την πολυπολιτισμική μουσική κληρονομιά της Κωνσταντινούπολης.',
    },
    'violete-ikari-konseri-galatada-ince-bir-yagmur-neapoleos-stavropoleos-kutsal-metropolitligi-kadin-ko': {
        tr: 'Yunan müziğinin sevilen sesi Violete Ikari, Neapoleos & Stavropoleos Kutsal Metropolitliği Kadın Korosu eşliğinde “Galata’da İnce Bir Yağmur…” başlıklı özel konserde Galata Rum Okulu sahnesinde dinleyicilerle buluştu.',
        en: 'Acclaimed Greek vocalist Violete Ikari, accompanied by the Women’s Choir of the Holy Metropolis of Neapoli and Stavroupoli, performed the special concert “A Fine Rain in Galata…” at the Galata Greek School.',
        el: 'Η καταξιωμένη ερμηνεύτρια Βιολέτα Ίκαρη, συνοδευόμενη από τη Γυναικεία Χορωδία της Ιεράς Μητροπόλεως Νεαπόλεως και Σταυρουπόλεως, παρουσίασε μια ξεχωριστή συναυλία στη Σχολή Γαλατά.',
    },
    '212-photography-istanbul-festivali-viviane-sassen-afisi': {
        tr: 'Uluslararası fotoğraf ve görsel sanatlar festivali 212 Photography Istanbul kapsamında Galata Rum Okulu, çağdaş fotoğraf sanatının öncü isimlerinden Viviane Sassen başta olmak üzere uluslararası sanatçıların seçkilerine ev sahipliği yaptı.',
        en: 'As part of the international 212 Photography Istanbul festival, the Galata Greek School hosted curated exhibitions featuring leading contemporary photographers including Viviane Sassen.',
        el: 'Στο πλαίσιο του διεθνούς φεστιβάλ 212 Photography Istanbul, η Σχολή Γαλατά φιλοξένησε επιμελημένες εκθέσεις σύγχρονης φωτογραφίας με έργα της Viviane Sassen και διεθνών καλλιτεχνών.',
    },
    '212-photography-istanbul-festivali-ebru-yildiz-afisi': {
        tr: '212 Photography Istanbul festivali kapsamında Galata Rum Okulu’nun sergi salonlarında düzenlenen seçkide, Ebru Yıldız’ın müzik ve sahne dünyasını belgeleyen çarpıcı fotoğraf çalışmaları sanatseverlerle buluştu.',
        en: 'Hosted across the exhibition halls of the Galata Greek School during the 212 Photography Istanbul festival, this showcase presented striking photographic works by Ebru Yıldız.',
        el: 'Στο πλαίσιο του φεστιβάλ 212 Photography Istanbul, οι εκθεσιακοί χώροι της Σχολής Γαλατά φιλοξένησαν φωτογραφικά έργα της Ebru Yıldız.',
    },
    'murat-tabanlioglu-liderliginde-port-city-talks-living-by-the-water-sergi-kapanisi': {
        tr: 'Mimar Murat Tabanlıoğlu öncülüğünde düzenlenen “Port City Talks: Living by the Water” sergi kapanışı ve söyleşi programı, liman kentlerinin mimari, kültürel ve kentsel dönüşümünü Galata Rum Okulu’nda tartışmaya açtı.',
        en: 'Led by architect Murat Tabanlıoğlu, the closing symposium of “Port City Talks: Living by the Water” explored the architectural, cultural, and urban evolution of port cities at the Galata Greek School.',
        el: 'Υπό την καθοδήγηση του αρχιτέκτονα Murat Tabanlıoğlu, το συμπόσιο λήξης της έκθεσης «Port City Talks: Living by the Water» εξέτασε την αρχιτεκτονική και πολιτιστική εξέλιξη των πόλεων-λιμανιών.',
    },
};

export default function EventDetailPage() {
    const { slug } = useParams();
    const { lang, localizePath } = useI18n();
    const l = lang || 'en';

    const [eventData, setEventData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvent = async () => {
            if (!slug) return;

            // Try slug first, then fall back to id (for backward compatibility)
            let result = await supabase
                .from('past_events')
                .select('*')
                .eq('slug', slug)
                .single();

            if (!result.data) {
                // Fallback: try as UUID id
                result = await supabase
                    .from('past_events')
                    .select('*')
                    .eq('id', slug)
                    .single();
            }

            if (result.data) setEventData(result.data);
            setLoading(false);
        };
        fetchEvent();
    }, [slug]);

    if (loading) return <div style={{ padding: '80px 20px', textAlign: 'center' }}>Loading Event Details…</div>;
    if (!eventData) return <div style={{ padding: '80px 20px', textAlign: 'center' }}>Event not found.</div>;

    const title = decodeHtmlEntities(eventData[`title_${l}`] || eventData.title_en);
    const curatedDesc = (eventData.slug && CURATED_EVENT_DESCRIPTIONS[eventData.slug]?.[l])
        || (slug && CURATED_EVENT_DESCRIPTIONS[slug]?.[l])
        || '';
    const desc = decodeHtmlEntities(
        eventData[`description_${l}`] || curatedDesc || eventData.description_en || eventData.description_tr || ''
    );
    const category = decodeHtmlEntities(eventData[`type_${l}`] || eventData.type_en || '');
    const eventDate = eventData.event_date
        ? new Date(eventData.event_date).toLocaleDateString(l === 'tr' ? 'tr-TR' : l === 'el' ? 'el-GR' : 'en-GB')
        : '';
    const venueName = l === 'tr'
        ? 'Galata Rum Okulu Vakfı - Kültür Merkezi'
        : l === 'el'
            ? 'Ίδρυμα Ελληνικού Σχολείου Γαλατά - Πολιτιστικό Κέντρο'
            : 'Galata Greek School Foundation - Cultural Center';

    // Split description into paragraphs
    const descParagraphs = desc ? desc.split(/\n\n|\n/).filter((p: string) => p.trim()) : [];

    return (
        <div className="event-detail-page" style={{ position: 'relative' }}>
            <SEO 
                overrideTitle={title}
                overrideDescription={desc ? desc.substring(0, 160) : (l === 'tr' ? 'Galata Rum Okulu Vakfı - Kültür Merkezi etkinlik detayları' : l === 'el' ? 'Λεπτομέρειες εκδήλωσης του Ιδρύματος Ελληνικού Σχολείου Γαλατά - Πολιτιστικού Κέντρου' : 'Galata Greek School Foundation - Cultural Center event details')}
                overrideKeywords={l === 'tr' ? `${title}, ${category}, galata rum okulu, etkinlik, istanbul kültür` : l === 'el' ? `${title}, ${category}, ελληνική σχολή γαλατά, εκδήλωση, Κωνσταντινούπολη πολιτισμός` : `${title}, ${category}, galata greek school, event, istanbul culture`}
                aiSchema={{
                    "@context": "https://schema.org",
                    "@type": "Event",
                    "name": title,
                    "description": desc ? desc.substring(0, 300) : '',
                    "startDate": eventData.event_date || '',
                    "image": eventData.cover_image_url || '',
                    "location": {
                        "@type": "Place",
                        "name": "Galata Rum Okulu Vakfı - Kültür Merkezi",
                        "address": {
                            "@type": "PostalAddress",
                            "streetAddress": "Kemankeş Karamustafa Paşa, Kemeraltı Cd. No:49",
                            "addressLocality": "Istanbul",
                            "addressRegion": "Beyoğlu",
                            "postalCode": "34425",
                            "addressCountry": "TR"
                        }
                    },
                    "organizer": {
                        "@type": "Organization",
                        "name": "Galata Rum Okulu Vakfı - Kültür Merkezi"
                    }
                }}
            />
            <div className="ed-main">
                <Breadcrumbs items={[
                    { label: { tr: 'Geçmiş Etkinlikler', en: 'Past Events', el: 'Παρελθούσες Εκδηλώσεις' }, to: '/gecmis-etkinlikler' },
                    { label: { tr: title, en: title, el: title } }
                ]} />

                {/* ══════ HEADER CONTENT ══════ */}
                <section className="ed-header">
                    <div className="ed-header__text">
                        <span className="ed-header__badge">{category}</span>
                        <h1 className="ed-header__title">{title}</h1>
                        <p className="ed-header__date">{eventDate}</p>
                    </div>
                </section>

                {/* ══════ HERO IMAGE ══════ */}
                <section className="ed-hero">
                    <img src={eventData.cover_image_url || '/placeholder.png'} alt={title} className="ed-hero__img" width="1200" height="675" />
                </section>

                {/* ══════ GALLERY IMAGES ══════ */}
                {eventData.gallery_urls && eventData.gallery_urls.length > 0 && (
                    <section className="ed-gallery">
                        {eventData.gallery_urls.map((url: string, index: number) => (
                            <div key={index} className="ed-gallery__item">
                                <img src={url} alt={`${title} Gallery ${index + 1}`} className="ed-gallery__img" loading="lazy" width="600" height="400" />
                            </div>
                        ))}
                    </section>
                )}

                {/* ══════ BODY ══════ */}
                <section className="ed-body">
                    <div className="ed-body__content">
                        {descParagraphs.length > 0 ? (
                            descParagraphs.map((paragraph: string, index: number) => (
                                <p key={index} className="ed-body__text">
                                    {paragraph.trim()}
                                </p>
                            ))
                        ) : (
                            <p className="ed-body__text ed-body__text--empty">
                                {lang === 'tr' ? 'Bu etkinlik için henüz açıklama eklenmemiştir.' :
                                    lang === 'el' ? 'Δεν υπάρχει ακόμη περιγραφή.' :
                                        'No description available for this event yet.'}
                            </p>
                        )}
                    </div>

                    {/* Information Sidebar */}
                    <aside className="ed-sidebar">
                        <div className="ed-sidebar__card">
                            <h4 className="ed-sidebar__title">
                                {lang === 'tr' ? 'Detaylar' : lang === 'el' ? 'Λεπτομέρειες' : 'Details'}
                            </h4>
                            <ul className="ed-sidebar__list">
                                <li className="ed-sidebar__item">
                                    <span className="ed-sidebar__label">{lang === 'tr' ? 'Tarih:' : lang === 'el' ? 'Ημερομηνία:' : 'Date:'}</span>
                                    <span>{eventDate}</span>
                                </li>
                                <li className="ed-sidebar__item">
                                    <span className="ed-sidebar__label">{lang === 'tr' ? 'Mekan:' : lang === 'el' ? 'Χώρος:' : 'Venue:'}</span>
                                    <Link to={localizePath('/mekan-kiralama')} className="ed-sidebar__venue-link">{venueName}</Link>
                                </li>
                                <li className="ed-sidebar__item">
                                    <span className="ed-sidebar__label">{lang === 'tr' ? 'Kategori:' : lang === 'el' ? 'Κατηγορία:' : 'Category:'}</span>
                                    <span>{category}</span>
                                </li>
                            </ul>
                            <div style={{ marginTop: 'var(--space-6)', paddingTop: 'var(--space-4)', borderTop: '1px solid rgba(197, 160, 89, 0.15)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                                <Link
                                    to={localizePath('/bize-ulasin')}
                                    style={{ display: 'inline-flex', justifyContent: 'center', alignItems: 'center', padding: 'var(--space-3) var(--space-5)', backgroundColor: 'var(--color-brass-gold)', color: 'var(--color-white)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-xs)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}
                                >
                                    {lang === 'tr' ? 'Mekan & İletişim' : lang === 'el' ? 'Χώρος & Επικοινωνία' : 'Venue & Inquiry'}
                                </Link>
                                <Link
                                    to={localizePath('/gecmis-etkinlikler')}
                                    style={{ textAlign: 'center', fontSize: 'var(--text-xs)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-brass-gold)' }}
                                >
                                    {lang === 'tr' ? '← Tüm Geçmiş Etkinlikler' : lang === 'el' ? '← Όλες οι Εκδηλώσεις' : '← All Past Events'}
                                </Link>
                            </div>
                        </div>
                    </aside>
                </section>
            </div>
        </div>
    );
}
