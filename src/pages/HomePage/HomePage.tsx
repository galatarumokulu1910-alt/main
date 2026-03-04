import { Link } from 'react-router-dom';
import { useI18n } from '../../i18n/I18nContext';
import heroImage from '../../assets/galata_hero.png';
import './HomePage.css';

export default function HomePage() {
    const { lang } = useI18n();

    return (
        <div className="home-page">
            {/* ══════ HERO — "The Modern Past" ══════ */}
            <header className="hp-hero">
                <div className="hp-hero__bg">
                    <img
                        src={heroImage}
                        alt="Galata Greek School Neoclassical Facade"
                        className="hp-hero__img"
                    />
                    <div className="hp-hero__gradient" />
                </div>
                <div className="hp-hero__content">
                    <h1 className="hp-hero__headline">
                        The Modern <br /><span className="hp-hero__headline-accent">Past</span>
                    </h1>
                    <p className="hp-hero__subtitle">
                        {lang === 'tr'
                            ? 'Tarihi yeniden taniyin. Galata\'nin kalbinde 19. yuzyildan kalma bir simge yapi, simdi cagdas sanat ve kultur evi.'
                            : lang === 'el'
                                ? 'Vivste tin istoria xana. Ena simadio tou 19ou aiona stin kardia tis Galatas, tora spiti synchronis technis kai politismou.'
                                : 'Experience history redefined. A 19th-century landmark in the heart of Galata, now home to contemporary art and culture.'}
                    </p>
                    <div className="hp-hero__ctas">
                        <Link to="/venue-hire" className="hp-hero__cta hp-hero__cta--primary">
                            {lang === 'tr' ? 'Etkinliginizi Tarihte Duzenleyin' : lang === 'el' ? 'Filoxeniste tin Ekdilosi sas' : 'Host Your Event in History'}
                        </Link>
                        <Link to="/archive" className="hp-hero__cta hp-hero__cta--secondary">
                            {lang === 'tr' ? 'Hikayemizi Kesfedin' : lang === 'el' ? 'Anakaliypste tin Istoria mas' : 'Discover Our Story'}
                        </Link>
                    </div>
                </div>
                <div className="hp-hero__scroll">
                    <span className="hp-hero__scroll-text">Scroll</span>
                    <span className="hp-hero__scroll-icon">&#x25BE;</span>
                </div>
            </header>

            {/* ══════ TARIHCE — History Section ══════ */}
            <section className="hp-history">
                <div className="hp-history__inner">
                    <div className="hp-history__text">
                        <div className="hp-history__watermark">1885</div>
                        <h2 className="hp-history__title">
                            {lang === 'tr' ? 'Tarihce' : lang === 'el' ? 'Istoria' : 'History'}
                        </h2>
                        <div className="hp-history__body">
                            <p>
                                {lang === 'tr'
                                    ? 'Galata Rum Okulu, Osmanli Imparatorlugu\'nun modernlesme surecinde Rum toplulugununun gerceklestirdigi egitim kurumlari icindeki en onemli yerlerden biridir.'
                                    : lang === 'el'
                                        ? 'To Scholio tis Galatas einai ena apo ta pio simantika ekpaideftika idrimata pou dimiourgise i elliniki koinotita kata tin periodo eksynchronismou tis Othomanikis Aftokratorias.'
                                        : 'The Galata Greek School is one of the most important educational institutions established by the Greek community during the modernization period of the Ottoman Empire.'}
                            </p>
                            <p>
                                {lang === 'tr'
                                    ? '1910 yilinda acilan okul, mimar Patroklos Kambanakis ve Stavros Hristidis tarafindan donemin neoklasik-eklektik uslubuyla insa edilmistir.'
                                    : lang === 'el'
                                        ? 'To scholio, pou anoixe to 1910, kataskevastike apo tous architectones Patroklos Kambanakis kai Stavros Christidis se neoklasiko-eklektiko ifos tis epochis.'
                                        : 'The school, opened in 1910, was built by architects Patroklos Kambanakis and Stavros Hristidis in the neoclassical-eclectic style of the era.'}
                            </p>
                            <Link to="/history" className="hp-history__link">
                                {lang === 'tr' ? 'DAHA FAZLA OKU' : lang === 'el' ? 'DIAVASTE PERISSOTERA' : 'READ MORE'}
                                <span className="hp-history__link-arrow">&rarr;</span>
                            </Link>
                        </div>
                    </div>
                    <div className="hp-history__gallery">
                        <div className="hp-history__gallery-col hp-history__gallery-col--offset">
                            <img src="/images/homepage/detail-1.jpg" alt="Architectural Detail" className="hp-history__photo hp-history__photo--sm" />
                            <img src="/images/homepage/detail-2.jpg" alt="Architectural Detail" className="hp-history__photo hp-history__photo--lg" />
                        </div>
                        <div className="hp-history__gallery-col">
                            <img src="/images/homepage/detail-3.jpg" alt="Architectural Detail" className="hp-history__photo hp-history__photo--lg" />
                            <img src="/images/homepage/detail-4.jpg" alt="Architectural Detail" className="hp-history__photo hp-history__photo--sm" />
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════ SPLIT SECTION — Architecture Statement ══════ */}
            <section className="hp-split">
                <div className="hp-split__image">
                    <img src="/images/homepage/interior.jpg" alt="Interior space" />
                </div>
                <div className="hp-split__text">
                    <div className="hp-split__divider" />
                    <h2 className="hp-split__headline">
                        {lang === 'tr'
                            ? 'Donemin neoklasik mimarisiyle Istanbul\'un kalbinde.'
                            : lang === 'el'
                                ? 'Neoklasiki architektoniki stin kardia tis Konstantinoupolis.'
                                : 'Neoclassical architecture in the heart of Istanbul.'}
                    </h2>
                    <p className="hp-split__body">
                        {lang === 'tr'
                            ? 'Okul binasi 2012 yilinda sahiplerine, Istanbul Rum cemaatine iade edilmistir. Bu tarihten itibaren sehrin kultur ve sanat hayatina kapilarini acarak bircok onemli etkinlige ev sahipligi yapmaktadir.'
                            : lang === 'el'
                                ? 'To ktirio tou scholiou epistrafike stous idioktites tou, tin elliniki koinotita tis Konstantinoupolis, to 2012. Apo tote echi anoixei tis portes tou ston politistiko kai kalltechniko kosmo tis polis.'
                                : 'The school building was returned to its owners, the Istanbul Greek community, in 2012. Since then, it has opened its doors to the city\'s cultural and artistic life, hosting many important events.'}
                    </p>
                    <div className="hp-split__watermark">2026</div>
                </div>
            </section>

            {/* ══════ ETKINLIKLER — Events Section ══════ */}
            <section className="hp-events">
                <div className="hp-events__inner">
                    <div className="hp-events__header">
                        <div>
                            <h2 className="hp-events__title">
                                {lang === 'tr' ? 'Etkinlikler' : lang === 'el' ? 'Ekdiloseis' : 'Events'}
                            </h2>
                            <p className="hp-events__subtitle">
                                {lang === 'tr' ? 'Gelecek sergiler ve kulturel bulusmalar' : lang === 'el' ? 'Epomenes ektheseis kai politistikes synantiseis' : 'Upcoming exhibitions and cultural gatherings'}
                            </p>
                        </div>
                        <Link to="/past-events" className="hp-events__view-all">
                            {lang === 'tr' ? 'Tumunu Gor' : lang === 'el' ? 'Dite ola' : 'View All'}
                        </Link>
                    </div>
                    <div className="hp-events__grid">
                        {/* Event 1 */}
                        <Link to="/past-events/1" className="hp-event-card">
                            <div className="hp-event-card__image-wrap">
                                <img src="/images/homepage/event-1.jpg" alt="Exhibition" className="hp-event-card__img" />
                                <div className="hp-event-card__overlay" />
                                <span className="hp-event-card__badge hp-event-card__badge--gold">
                                    {lang === 'tr' ? 'Sergi' : lang === 'el' ? 'Ekthesi' : 'Exhibition'}
                                </span>
                            </div>
                            <h3 className="hp-event-card__title">
                                {lang === 'tr' ? 'Uc Ayakli Kedi' : lang === 'el' ? 'I Triskeli Gata' : 'Three-Legged Cat'}
                            </h3>
                            <p className="hp-event-card__date">20.09 - 23.11.2023</p>
                        </Link>
                        {/* Event 2 */}
                        <Link to="/past-events/2" className="hp-event-card">
                            <div className="hp-event-card__image-wrap">
                                <img src="/images/homepage/event-3.jpg" alt="Conference" className="hp-event-card__img" />
                                <div className="hp-event-card__overlay" />
                                <span className="hp-event-card__badge hp-event-card__badge--clay">
                                    {lang === 'tr' ? 'Konferans' : lang === 'el' ? 'Synedrio' : 'Conference'}
                                </span>
                            </div>
                            <h3 className="hp-event-card__title">
                                {lang === 'tr' ? 'Galata Mimarisi Uzerine' : lang === 'el' ? 'Peri tis Architektonikis tis Galatas' : 'On Galata Architecture'}
                            </h3>
                            <p className="hp-event-card__date">05.12.2023</p>
                        </Link>
                        {/* Event 3 */}
                        <Link to="/past-events/3" className="hp-event-card">
                            <div className="hp-event-card__image-wrap">
                                <img src="/images/homepage/event-3.jpg" alt="Jazz Concert" className="hp-event-card__img" />
                                <div className="hp-event-card__overlay" />
                                <span className="hp-event-card__badge hp-event-card__badge--gold">
                                    {lang === 'tr' ? 'Konser' : lang === 'el' ? 'Synavlia' : 'Concert'}
                                </span>
                            </div>
                            <h3 className="hp-event-card__title">
                                {lang === 'tr' ? 'Avlu Caz Geceleri' : lang === 'el' ? 'Vradinai Jazz stin Avli' : 'Courtyard Jazz Nights'}
                            </h3>
                            <p className="hp-event-card__date">
                                {lang === 'tr' ? 'Hafta Sonu Etkinligi' : lang === 'el' ? 'Ekdilosi Savvatokiriakou' : 'Weekend Event'}
                            </p>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
