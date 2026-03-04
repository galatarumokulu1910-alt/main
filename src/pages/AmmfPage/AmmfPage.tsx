import { useI18n } from '../../i18n/I18nContext';
import './AmmfPage.css';

// Using the images from the Stitch design
const IMAGES = {
    hero: "https://lh3.googleusercontent.com/aida-public/AB6AXuBXHmnCTkEvuY9wsw_o69b6Nj1AiJmXmKZWZ2_rPdvcqRlsECqXssn39GYI0uXANpDaxtKhljwG1MyiP28jvIfAKR-rOMMWshWqjgHNOxlC_tbjW5bu8i4id7PoSNLXxD7CombZx_MSsqsBy0-YbkYPyIA8V5SSD6nFae9_Qu_gKHT1_TFxIxVIJkt0uDhtYSrkutY0oaEdB14DYN5urmqUsoqObkpn3LNpY1BF7gAx3tqeUQMY8R0MV-7nWCb1BpVAZ9bvXHDcNWU",
    detail: "https://lh3.googleusercontent.com/aida-public/AB6AXuDDIQSVcAiSsq-PkCeDbh5oy-vZbL9TNqd8Hy69FjmrLpscZzyDRB993UYP09O0jIzp7V2AYqyHvYX1OF2fsYwIb7iVvP2-t3QTZK3-BP7Z-UOyXpGG6xTiN3WjPBdczjg-_GR_ATNSeAUwBREx1I_1uJNjbBysxd3TqImAyd3h0ggmZk9Q9S_gx-tw8b7zwYIzg9988rhLbPCkVeYJDeerHqDoEVrDnCgvvRGag418nc07ECoK4TXRMYPCqYr9eyh-6niG3hFirZk"
};

// Content dictionary for AMMF Page translations
const content = {
    breadcrumbs: {
        home: { tr: 'Ana Sayfa', en: 'Home', el: 'Archika' },
        foundations: { tr: 'Vakiflar', en: 'Foundations', el: 'Idrymata' },
        current: { tr: 'AMMF Gucbirligi', en: 'AMMF Tribute', el: 'AMMF Afieroma' }
    },
    hero: {
        title: {
            tr: 'Athanasios ve Marina Martinou Vakfi',
            en: 'The Athanasios and Marina Martinou Foundation',
            el: 'To Idryma Athanasios kai Marina Martinou'
        },
        quote: {
            tr: '"Entelektuel mirasin restorasyonu yoluyla neoklasik Istanbul\'un mirasini korumak."',
            en: '"Preserving the legacy of neoclassical Istanbul through the restoration of intellectual heritage."',
            el: '"Diatirontas tin klironomia tis neoklasikis Konstantinoupolis meso tis apokatastasis tis pnevmatikis klironomias."'
        },
        p1: {
            tr: 'Athanasios ve Marina Martinou Vakfi (AMMF), bu neoklasik simge yapinin kapsamli restorasyonunda ve vizyoner donusumunde cok onemli bir rol oynamistir. Onlarin bagliligi, Galata Rum Okulu\'nun gelecek nesiller icin canli bir kulturel mekan olarak kalmasini saglamaktadir.',
            en: 'The Athanasios and Marina Martinou Foundation (AMMF) has played a pivotal role in the comprehensive restoration and visionary transformation of this neoclassical landmark. Their commitment ensures that the Galata Greek School remains a vibrant cultural venue for future generations.',
            el: 'To Idryma Athanasios kai Marina Martinou (AMMF) epaixe krisimo rolo stin olokliromeni apokatastasi kai oramatiki metamorfosi aftou tou neoklasikou orosimou. I desmefsi tous diasfalizei oti to Galata Rum Okulu paramenei enas zontanos politistikos choros gia tis mellontikes genies.'
        },
        p2: {
            tr: 'Titiz bir mimari koruma sayesinde vakif, okulun 120 yillik tarihini modern cagin talepleriyle birlestirerek sehrin kalbinde sanat, arsivler ve akademik diyalog icin bir siginak yaratti.',
            en: 'Through meticulous architectural preservation, the foundation has bridged the 120-year history of the school with the demands of the modern era, creating a sanctuary for arts, archives, and academic dialogue in the heart of the city.',
            el: 'Meso tis scholastikis architektonikis diatirisis, to idryma synezesxe tin 120eti istoria tou scholeiou me tis apaitiseis tis synchronis epochis, dimiourgontas ena katarfygio gia tis technes, ta archeia kai ton akadimaiko dialogo stin kardia tis polis.'
        },
        caption: {
            tr: 'Okulun Ana Salon Restorasyonu, 2021',
            en: "The School's Main Hall Restoration, 2021",
            el: 'Apokatastasi tis Kyrias Aithousas tou Scholeiou, 2021'
        }
    },
    stats: {
        contribution: { label: { tr: 'Katki', en: 'Contribution', el: 'Syneisfora' }, value: { tr: 'Oncu Restorasyon Ortagi', en: 'Lead Restoration Partner', el: 'Kyrios Synergatis Apokatastasis' } },
        since: { label: { tr: 'Tarih', en: 'Since', el: 'Apo' }, value: { tr: '2012', en: '2012', el: '2012' } },
        focus: { label: { tr: 'Odak', en: 'Focus', el: 'Estiasi' }, value: { tr: 'Mimari Miras', en: 'Architectural Heritage', el: 'Architektoniki Klironomia' } }
    },
    vision: {
        eyebrow: { tr: '120 Yillik Mirasi Korumak', en: 'Safeguarding the 120-Year Legacy', el: 'Diatirontas tin 120eti Klironomia' },
        title: { tr: 'Kulturel Koruma Icin Bir Vizyon', en: 'A Vision for Cultural Preservation', el: 'Ena Orama gia tin Politistiki Diatirisi' },
        cards: [
            {
                icon: 'history_edu',
                title: { tr: 'Arsiv Restorasyonu', en: 'Archive Restoration', el: 'Apokatastasi Archeiou' },
                desc: { tr: 'Okulun tarihi kayitlarinin ve akademik belgelerinin sistematik olarak dijitallestirilmesi ve fiziksel olarak korunmasi.', en: "Systematic digitization and physical preservation of the school's historical registers and scholarly documents.", el: 'Sistimatiki psifiopoiisi kai fysiki diatirisi ton istorikon mitroon kai akadimaikon engrafon tou scholeiou.' }
            },
            {
                icon: 'architecture',
                title: { tr: 'Yapisal Butunluk', en: 'Structural Integrity', el: 'Domiki Akeraiotita' },
                desc: { tr: 'Orijinal 19. yuzyil estetik unsurlarini korurken neoklasik duvarlari guclendirmek.', en: 'Reinforcing the neoclassical masonry while maintaining the original 19th-century aesthetic signatures.', el: 'Enischysi tis neoklasikis toichopoiias diatirontas tis original aisthitikes ypografes tou 19ou aiona.' }
            },
            {
                icon: 'theater_comedy',
                title: { tr: 'Modern Mekan', en: 'Modern Venue', el: 'Synchronos Choros' },
                desc: { tr: 'Tarihi siniflari son teknoloji sergi alanlarina ve akustik konferans salonlarina donusturmek.', en: 'Transforming the historical classrooms into state-of-the-art exhibition spaces and acoustic lecture halls.', el: 'Metamorfosi ton istorikon aithouson daskalias se state-of-the-art porousies ekthesis kai akoustikes aithouses dialexeon.' }
            }
        ]
    },
    partnership: {
        title: { tr: 'Kurumsal Ortaklik', en: 'Institutional Partnership', el: 'Thesmiki Synergasia' },
        desc: {
            tr: 'Galata Rum Okulu ile AMMF arasindaki isbirligi, ozel-kamu mirasi yonetimi icin bir model teskil etmektedir. Hem somut (bina) hem de somut olmayan (egitim gecmisi) unsurlara odaklanarak, okulun Istanbul\'un entelektuel dokusuna katki saglamaya devam etmesini sagliyoruz.',
            en: 'The collaboration between the Galata Greek School and AMMF serves as a model for private-public heritage management. By focusing on both the tangible (the building) and the intangible (the education history), we ensure the school continues to contribute to the intellectual fabric of Istanbul.',
            el: 'I synergasia metaxy tou Galata Rum Okulu kai tou AMMF apotelei montelo gia tin idiotiki-dimosia diacheirisi tis klironomias. Estiazontas toso sto yliko (to ktirio) oso kai sto ayla (tin istoria tis ekpaidefsis), exasfalizoume oti to scholeio synechizei na syneisferi ston pnevmatiko iston tis Konstantinoupolis.'
        },
        btn: { tr: 'Arsiv Fotograflarini Gor', en: 'View Archival Photos', el: 'Deite Archeiakes Fotografies' }
    }
};

export default function AmmfPage() {
    const { lang } = useI18n();

    return (
        <div className="ammf-page bg-background-light dark:bg-background-dark text-charcoal dark:text-gray-200 transition-colors duration-300">
            <main className="ammf-main">
                {/* ══════ BREADCRUMBS ══════ */}
                <div className="ammf-breadcrumbs">
                    <span className="ammf-breadcrumbs__link hover-primary">{content.breadcrumbs.home[lang]}</span>
                    <span className="material-symbols-outlined ammf-breadcrumbs__icon">arrow_forward_ios</span>
                    <span className="ammf-breadcrumbs__link hover-primary">{content.breadcrumbs.foundations[lang]}</span>
                    <span className="material-symbols-outlined ammf-breadcrumbs__icon">arrow_forward_ios</span>
                    <span className="ammf-breadcrumbs__current">{content.breadcrumbs.current[lang]}</span>
                </div>

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
                            <button className="ammf-btn">
                                {content.partnership.btn[lang]}
                                <span className="material-symbols-outlined ammf-btn__icon">open_in_new</span>
                            </button>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
