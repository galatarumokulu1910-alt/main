import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../../i18n/I18nContext';
import { supabase } from '../../services/supabaseClient';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import './PastEventsPage.css';

export default function PastEventsPage() {
    const { lang } = useI18n();
    const l = lang || 'en';

    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            const { data } = await supabase
                .from('past_events')
                .select('*')
                .eq('status', 'published')
                .order('event_date', { ascending: false });

            if (data) setEvents(data);
            setLoading(false);
        };
        fetchEvents();
    }, []);

    const getImgClass = (idx: number) => {
        const sequence = ['--4-5', '--square', '--3-4', '--4-5', '--video', '--3-4'];
        return sequence[idx % sequence.length];
    };

    return (
        <div className="past-events-page bg-background-light dark:bg-background-dark text-charcoal dark:text-gray-200 transition-colors duration-300" style={{ position: 'relative' }}>
            <Breadcrumbs items={[{ label: { tr: 'Geçmiş Etkinlikler', en: 'Past Events', el: 'Παρελθούσες Εκδηλώσεις' } }]} />
            <main className="pe-main">
                {/* ══════ HEADER SECTION ══════ */}
                <section className="pe-header">
                    <div className="pe-header__inner">
                        <div className="pe-header__text">
                            <h1 className="pe-header__title">
                                {lang === 'tr' ? 'Gecmis Etkinlikler' : lang === 'el' ? 'Parelthouses Ekdiloseis' : 'Past Events'}<br />
                                <span className="pe-header__title-accent">Past Events</span>
                            </h1>
                            <p className="pe-header__description">
                                {lang === 'tr'
                                    ? 'Galata Rum Okulu, her biri kendine ozgu hikayesiyle birlesen prestijli moda defilelerinden, cagdas sanat sergilerine ve seckin kurumsal galalara ev sahipligi yapmaktadir. Neoklasik mimarimiz, modern vizyonlarla burada bulusuyor.'
                                    : lang === 'el'
                                        ? 'To Galata Rum Okulu filoxenei kourouseis, synedria kai politistikes ekdiloseis. I neoklasiki mas architektoniki synanta tis synchrones oramata edo.'
                                        : 'The Galata Greek School hosts prestigious fashion shows, contemporary art exhibitions, and exclusive corporate galas, each merging with its unique story. Our neoclassical architecture meets modern visions here.'}
                            </p>
                        </div>
                        <div className="pe-header__watermark-col">
                            <span className="pe-header__watermark">1885</span>
                        </div>
                    </div>
                </section>

                {/* ══════ MASONRY GRID ══════ */}
                {loading ? (
                    <div style={{ padding: '40px', textAlign: 'center' }}>Loading Events...</div>
                ) : (
                    <div className="pe-masonry-grid">
                        {events.map((evt, idx) => (
                            <article key={evt.id} className="pe-masonry-item group">
                                <Link to={`/past-events/${evt.id}`} className="block">
                                    <div className={`pe-card__image-container pe-card__image${getImgClass(idx)}`}>
                                        <img
                                            alt={evt[`title_${l}`] || evt.title_en}
                                            className="pe-card__img"
                                            src={evt.cover_image_url || '/placeholder.png'}
                                        />
                                        <div className="pe-card__overlay"></div>
                                    </div>
                                    <div className="pe-card__content">
                                        <div className="pe-card__header">
                                            <h3 className="pe-card__title">{evt[`title_${l}`] || evt.title_en}</h3>
                                            <span className="pe-card__badge">{evt[`type_${l}`] || evt.type_en || ''}</span>
                                        </div>
                                    </div>
                                </Link>
                            </article>
                        ))}
                    </div>
                )}

                {/* ══════ CTA SECTION ══════ */}
                <section className="pe-cta">
                    <h2 className="pe-cta__title">
                        {lang === 'tr' ? 'Etkinliginizi Burada Planlayin' : lang === 'el' ? 'Schediaste tin Ekdilosi sas Edo' : 'Plan Your Event Here'}
                    </h2>
                    <p className="pe-cta__desc">
                        {lang === 'tr'
                            ? 'Siz de markanizi veya sanatinizi Galata\'nin bu benzersiz atmosferiyle bulusturmak isterseniz bizimle iletisime gecin.'
                            : lang === 'el'
                                ? 'An thelete na ferete tin techni i tin epicheirisi sas stin monadiki atmosfaira tis Galatas, epikoinoniste mazi mas.'
                                : 'If you would like to bring your brand or art to this unique atmosphere of Galata, get in touch with us.'}
                    </p>
                    <Link to="/concierge" className="pe-cta__btn group">
                        {lang === 'tr' ? 'Bize Ulasin' : lang === 'el' ? 'Epikoinonia' : 'Contact Us'}
                        <span className="pe-cta__btn-icon">→</span>
                    </Link>
                </section>
            </main>
        </div>
    );
}
