import { useParams } from 'react-router-dom';
import { useI18n } from '../../i18n/I18nContext';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import './EventDetailPage.css';

// Mock database for events to populate the detail pages
const eventsDB = {
    '1': {
        title: { tr: 'Uc Ayakli Kedi', en: 'Three-Legged Cat', el: 'I Triskeli Gata' },
        date: '20.09 - 23.11.2023',
        category: { tr: 'Sergi', en: 'Exhibition', el: 'Ekthesi' },
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCVlkWqPzY0sH0OFy5UmoQ4zEgxLckGXt8MveL7ZR-UWFeB8ANsuZVXStOEbfoS3rK4f3UJvSfzDmtJu0pFGKo8Zl-l2saDEYxGaw79duMDZ18X5UwyO2kthd7XBcD6TBziZqVW966eXOT69GrZa4Co6plnrWjSqgsYM3C3CT5K_ZJmCjD81ntjzvqZzNZ4th_HK3xI8cvMYfNr8C9oha5yzKjUwG_XTcu5YDmB9o_PlSOsEJxeHF4dUIqgY5tP_903GfYmMKsWhbM',
        description: {
            tr: 'Galata Rum Okulu, cagdas sanatin en carpici orneklerinden birine daha ev sahipligi yapiyor. "Uc Ayakli Kedi" sergisi, modern yasamin getirdigi eksiklikleri ve buna karsin hayata tutunma cabasini metaforik bir dille isliyor.',
            en: 'Galata Greek School hosts yet another striking example of contemporary art. The "Three-Legged Cat" exhibition explores the deficiencies brought by modern life and the struggle to hold onto it through a metaphorical language.',
            el: 'To Galata Rum Okulu filoxenei ena akomi entyposiako deigma synchronis technis. I ekthesi "I Triskeli Gata" dierevna tis elleipseis pou fernei i synchroni zoi kai ton agona gia na kratithoume se aftin mesa apo mia metaforiki glossa.'
        }
    },
    '2': {
        title: { tr: 'Galata Mimarisi Uzerine', en: 'On Galata Architecture', el: 'Peri tis Architektonikis tis Galatas' },
        date: '05.12.2023',
        category: { tr: 'Konferans', en: 'Conference', el: 'Synedrio' },
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA_l1spIuR1oc-oUzcKo8Mq1hiBTWuW_acz6vqzYtObFkcYBb1PrfJTn0KCanX0aDn6WooJc7VkrA2oNLBt6xKxsnVWX58qEC__obSZnXUH-r14fp6ppPoMLEvQkPvMHmUYAk8PKGPPztwbVx8ckFwjJOS_FpKYX0RlG-IkwCF0y4vFvO-FWXN4d12s1hnBg1ZW2sDMC2ryNK_fVYSzudQj4ngE_C9_Ef9PjOpeCRPK3AnAzSBit8cbxX_bFnIiw7gPSjmAolPHDPQ',
        description: {
            tr: 'Tarihi yarimadanin karsisinda, Pera ve Karakoy\'un kesisim noktasinda yer alan Galata\'nin essiz mimari dokusu uzmanlar tarafindan masaya yatiriliyor. Rum okulu binasinin da incelenecegi konferans ucretsizdir.',
            en: 'The unique architectural texture of Galata, located at the intersection of Pera and Karakoy opposite the historical peninsula, is being discussed by experts. The conference, where the Greek school building will also be examined, is free of charge.',
            el: 'I monadiki architektoniki yfi tis Galatas, pou vrisketai sti diastavrosi tou Pera kai tou Karakoy apenanti apo tin istoriki chersoniso, syziteitai apo eidikous. To synedrio, sto opoio tha exetastei kai toktirio tou ellinikou scholeiou, einai dorean.'
        }
    },
    '3': {
        title: { tr: 'Avlu Caz Geceleri', en: 'Courtyard Jazz Nights', el: 'Vradinai Jazz stin Avli' },
        date: 'Hafta Sonu Etkinligi',
        category: { tr: 'Konser', en: 'Concert', el: 'Synavlia' },
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB9HRZqTPQlQWVSec-lXNBjiL7-FQNwJNFe7tyEUZ3BWj6Sl0C90BKhB6IqfXzCNwLIWbVhacBgfxSfvXHP2nJOJL1d4HIeoDojwRBIT4cVzk6n__do6Loz4vxmOmAhdzG1Vw_bnNda5WBUtMC5yRFM1Ixf_HsAqTBjwpN85QLZd4h2sItZLWv8Wp5fxgg49ZkKKYLGZGXNih6F33ZnfOand2Ev_eDsVSkhadyvj0HKLhzr5_Y9peDOvFf7zEMNDUQVJ8Ajzf6Eo8Y',
        description: {
            tr: '19. yuzyildan kalma Galata Rum Okulu\'nun tarihi avlusu, caz tınılarıyla yankilaniyor. Sehrin gurultusunden uzak, yildizlarin altinda essiz bir muzik deneyimi sizi bekliyor.',
            en: 'The historic courtyard of the 19th-century Galata Greek School echoes with jazz melodies. An unforgettable musical experience awaits you under the stars, away from the noise of the city.',
            el: 'I istoriki avli tou Galata Rum Okulu tou 19ou aiona antichei me notes jazz. Mia axexasti mousiki empeiria sas perimenei kato apo t\' astra, makria apo to thoryvo tis polis.'
        }
    },
    // Adding fallbacks based on Prestige Gallery designs
} as Record<string, { title: Record<string, string>, date: string, category: Record<string, string>, image: string, description: Record<string, string> }>;

export default function EventDetailPage() {
    const { eventId } = useParams();
    const { lang } = useI18n();

    // Try to get data from mock DB, if not use a generic placeholder
    const eventData = eventsDB[eventId || '1'] || {
        title: { tr: 'Ozel Etkinlik', en: 'Special Event', el: 'Eidikí Ekdílosi' },
        date: '2026',
        category: { tr: 'Etkinlik', en: 'Event', el: 'Ekdílosi' },
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCxr39dCa9LDaJp725Y4lz6WKj8zETatm83Xg4USyZWyRHl4sbbmSijNwMJW7SccTnL1o8jCV5oR_X9lvjp4RR59baw5WmEGE0fsiausBMYz93-mBdz2WEK4-7nWhDSanr0BT6Nd12dTLVQy6JOfZw_l0C2-DoV-xIFez3yyC06YYqfqgBz7nWA1t4AVKIJEP4lWW-C9kkMWPED8K8w97qS3PvepCpu-Y1pZIYzHc1K39hmq5JyhPrTIgr4LktVe9v7vOqIuSxOS_k',
        description: {
            tr: 'Tarihi yarımadanın karşısında, Pera ve Karaköy\'ün kesişim noktasında yer alan Galata Rum Okulu\'nun eşsiz mimari dokusunda gerçekleşen bu özel etkinlik, ziyaretçilere unutulmaz bir deneyim sundu.',
            en: 'Taking place in the unique architectural texture of the Galata Greek School, located at the intersection of Pera and Karaköy opposite the historical peninsula, this special event offered visitors an unforgettable experience.',
            el: 'Lamyánontas chóra sti monadikí architektonikí yfí tou Ellinikoú Scholeíou tou Galatá, pou vrísketai sti diastavrosí tou Péra kai tou Karaköy apénanti apó tin istorikí chersóniso, aftí i eidikí ekdílosi proséfere stous episképtes mia axéchasti empeiría.'
        }
    };

    return (
        <div className="event-detail-page bg-background-light dark:bg-background-dark text-charcoal dark:text-gray-200 transition-colors duration-300" style={{ position: 'relative' }}>
            <Breadcrumbs items={[
                { label: { tr: 'Geçmiş Etkinlikler', en: 'Past Events', el: 'Παρελθούσες Εκδηλώσεις' }, to: '/past-events' },
                { label: eventData.title }
            ]} />
            <main className="ed-main">

                {/* ══════ HEADER CONTENT ══════ */}
                <section className="ed-header">
                    <div className="ed-header__text">
                        <span className="ed-header__badge">{eventData.category[lang]}</span>
                        <h1 className="ed-header__title">{eventData.title[lang]}</h1>
                        <p className="ed-header__date">{eventData.date}</p>
                    </div>
                </section>

                {/* ══════ HERO IMAGE ══════ */}
                <section className="ed-hero">
                    <img src={eventData.image} alt={eventData.title[lang]} className="ed-hero__img" />
                </section>

                {/* ══════ BODY ══════ */}
                <section className="ed-body">
                    <div className="ed-body__content">
                        <p className="ed-body__text">
                            {eventData.description[lang]}
                        </p>
                    </div>

                    {/* Information Sidebar */}
                    <aside className="ed-sidebar">
                        <div className="ed-sidebar__card">
                            <h4 className="ed-sidebar__title">
                                {lang === 'tr' ? 'Detaylar' : lang === 'el' ? 'Leptomereies' : 'Details'}
                            </h4>
                            <ul className="ed-sidebar__list">
                                <li className="ed-sidebar__item">
                                    <span className="ed-sidebar__label">Tarih:</span>
                                    <span>{eventData.date}</span>
                                </li>
                                <li className="ed-sidebar__item">
                                    <span className="ed-sidebar__label">Mekan:</span>
                                    <span>Galata Rum Okulu</span>
                                </li>
                                <li className="ed-sidebar__item">
                                    <span className="ed-sidebar__label">Kategori:</span>
                                    <span>{eventData.category[lang]}</span>
                                </li>
                            </ul>
                        </div>
                    </aside>
                </section>
            </main>
        </div>
    );
}

