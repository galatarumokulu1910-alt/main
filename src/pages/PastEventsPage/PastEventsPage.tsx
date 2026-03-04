import { Link } from 'react-router-dom';
import { useI18n } from '../../i18n/I18nContext';
import './PastEventsPage.css';

export default function PastEventsPage() {
    const { lang } = useI18n();

    return (
        <div className="past-events-page bg-background-light dark:bg-background-dark text-charcoal dark:text-gray-200 transition-colors duration-300">
            <main className="pe-main">
                {/* ══════ HEADER SECTION ══════ */}
                <section className="pe-header">
                    <div className="pe-header__inner">
                        <div className="pe-header__text">
                            <div className="greek-pattern w-24 mb-6"></div>
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
                <div className="pe-masonry-grid">
                    {/* Item 1 */}
                    <article className="pe-masonry-item group">
                        <Link to="/past-events/1" className="block">
                            <div className="pe-card__image-container pe-card__image--4-5">
                                <img
                                    alt="Fashion Show in Hall"
                                    className="pe-card__img"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCVlkWqPzY0sH0OFy5UmoQ4zEgxLckGXt8MveL7ZR-UWFeB8ANsuZVXStOEbfoS3rK4f3UJvSfzDmtJu0pFGKo8Zl-l2saDEYxGaw79duMDZ18X5UwyO2kthd7XBcD6TBziZqVW966eXOT69GrZa4Co6plnrWjSqgsYM3C3CT5K_ZJmCjD81ntjzvqZzNZ4th_HK3xI8cvMYfNr8C9oha5yzKjUwG_XTcu5YDmB9o_PlSOsEJxeHF4dUIqgY5tP_903GfYmMKsWhbM"
                                />
                                <div className="pe-card__overlay"></div>
                            </div>
                            <div className="pe-card__content">
                                <div className="pe-card__header">
                                    <h3 className="pe-card__title">Vogue Couture Gala</h3>
                                    <span className="pe-card__badge">Moda</span>
                                </div>
                                <p className="pe-card__quote">
                                    "Okulun yuksek tavanli koridorlari ve ham dokusu, koleksiyonumuzun zamansiz ruhunu mukemmel bir dramatik atmosferle tamamladi."
                                </p>
                            </div>
                        </Link>
                    </article>

                    {/* Item 2 */}
                    <article className="pe-masonry-item group">
                        <Link to="/past-events/2" className="block">
                            <div className="pe-card__image-container pe-card__image--square">
                                <img
                                    alt="Art Exhibition"
                                    className="pe-card__img"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuA_l1spIuR1oc-oUzcKo8Mq1hiBTWuW_acz6vqzYtObFkcYBb1PrfJTn0KCanX0aDn6WooJc7VkrA2oNLBt6xKxsnVWX58qEC__obSZnXUH-r14fp6ppPoMLEvQkPvMHmUYAk8PKGPPztwbVx8ckFwjJOS_FpKYX0RlG-IkwCF0y4vFvO-FWXN4d12s1hnBg1ZW2sDMC2ryNK_fVYSzudQj4ngE_C9_Ef9PjOpeCRPK3AnAzSBit8cbxX_bFnIiw7gPSjmAolPHDPQ"
                                />
                                <div className="pe-card__overlay"></div>
                            </div>
                            <div className="pe-card__content">
                                <div className="pe-card__header">
                                    <h3 className="pe-card__title">Modern Diaspora</h3>
                                    <span className="pe-card__badge">Sergi</span>
                                </div>
                                <p className="pe-card__quote">
                                    "Eski siniflarin gun isigiyla yikanan pencereleri, enstalasyonlarimiz icin dogal bir galeri alani sundu."
                                </p>
                            </div>
                        </Link>
                    </article>

                    {/* Item 3 */}
                    <article className="pe-masonry-item group">
                        <Link to="/past-events/3" className="block">
                            <div className="pe-card__image-container pe-card__image--3-4">
                                <img
                                    alt="Corporate Gala Dinner"
                                    className="pe-card__img"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCxr39dCa9LDaJp725Y4lz6WKj8zETatm83Xg4USyZWyRHl4sbbmSijNwMJW7SccTnL1o8jCV5oR_X9lvjp4RR59baw5WmEGE0fsiausBMYz93-mBdz2WEK4-7nWhDSanr0BT6Nd12dTLVQy6JOfZw_l0C2-DoV-xIFez3yyC06YYqfqgBz7nWA1t4AVKIJEP4lWW-C9kkMWPED8K8w97qS3PvepCpu-Y1pZIYzHc1K39hmq5JyhPrTIgr4LktVe9v7vOqIuSxOS_k"
                                />
                                <div className="pe-card__overlay"></div>
                            </div>
                            <div className="pe-card__content">
                                <div className="pe-card__header">
                                    <h3 className="pe-card__title">Global Tech Awards</h3>
                                    <span className="pe-card__badge">Kurumsal</span>
                                </div>
                                <p className="pe-card__quote">
                                    "Tarihi binanin modern teknoloji sunumlariyla kontrasti, davetlilerimiz icin unutulmaz bir deneyim yaratti."
                                </p>
                            </div>
                        </Link>
                    </article>

                    {/* Item 4 */}
                    <article className="pe-masonry-item group">
                        <Link to="/past-events/4" className="block">
                            <div className="pe-card__image-container pe-card__image--4-5">
                                <img
                                    alt="Jewelry Exhibition"
                                    className="pe-card__img"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAyiKVqgDxFjYC6r2VIt0XEjpFivzm-WzyZERCqVovmq61aSkV0RLYP15QHIkpfrZh7qKkbHKOGngwZbYsovkctYUtz18gRFvcshL5yuVsmOUXYgEPZJMsGQsefBR1uyByH_LQP3Kz-x36EIbFRB6V2kT0rjrWBl3G0L2oJJT22E1WWrJHe9lDBoJ24HeHDMW0ZaRluubhsXpMlxc3iJq7FuHrfWMBuVKPfWH2TdkcZO5jQlvhGd02IthG9IvlCLe16bAPcjQ0rfkI"
                                />
                                <div className="pe-card__overlay"></div>
                            </div>
                            <div className="pe-card__content">
                                <div className="pe-card__header">
                                    <h3 className="pe-card__title">Orbis Brilliance</h3>
                                    <span className="pe-card__badge">Lansman</span>
                                </div>
                                <p className="pe-card__quote">
                                    "Okulun mermer merdivenleri, mucevher koleksiyonumuzun ihtisamini sergilemek icin bir sahne gorevi gordu."
                                </p>
                            </div>
                        </Link>
                    </article>

                    {/* Item 5 */}
                    <article className="pe-masonry-item group">
                        <Link to="/past-events/5" className="block">
                            <div className="pe-card__image-container pe-card__image--video">
                                <img
                                    alt="Concert in Courtyard"
                                    className="pe-card__img"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuB9HRZqTPQlQWVSec-lXNBjiL7-FQNwJNFe7tyEUZ3BWj6Sl0C90BKhB6IqfXzCNwLIWbVhacBgfxSfvXHP2nJOJL1d4HIeoDojwRBIT4cVzk6n__do6Loz4vxmOmAhdzG1Vw_bnNda5WBUtMC5yRFM1Ixf_HsAqTBjwpN85QLZd4h2sItZLWv8Wp5fxgg49ZkKKYLGZGXNih6F33ZnfOand2Ev_eDsVSkhadyvj0HKLhzr5_Y9peDOvFf7zEMNDUQVJ8Ajzf6Eo8Y"
                                />
                                <div className="pe-card__overlay"></div>
                            </div>
                            <div className="pe-card__content">
                                <div className="pe-card__header">
                                    <h3 className="pe-card__title">Chamber Melodies</h3>
                                    <span className="pe-card__badge">Konser</span>
                                </div>
                                <p className="pe-card__quote">
                                    "Akustigin derinligi ve tas duvarlarin yankisi, her notayi daha anlamli kildi."
                                </p>
                            </div>
                        </Link>
                    </article>

                    {/* Item 6 */}
                    <article className="pe-masonry-item group">
                        <Link to="/past-events/6" className="block">
                            <div className="pe-card__image-container pe-card__image--3-4">
                                <img
                                    alt="Discussion Panel"
                                    className="pe-card__img"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBbeokMO0HUBB8kwJZKoD_ylDT56ZwJeUiqmycXGeB6tN7pcqTm9lIUHX1GJulE73vkoxy5z2Zn2h884-jhHFr4xrbiPBWSUAglOyJ0e4qI5av8yJ_oPezRqyybcjfOwexz8gcZKbzlQql8pruGCgNDh4qDDpr_YCDinU9IGXpnrGX3CUyThMghwzq37GVMoxo5RFkPEwf-0JTEM6ZpuPK9vBudo63l4dHj1Gad_37Pza74B6wKyxaVPP6AKHNEg_tYUaVzIKNbiAg"
                                />
                                <div className="pe-card__overlay"></div>
                            </div>
                            <div className="pe-card__content">
                                <div className="pe-card__header">
                                    <h3 className="pe-card__title">Urban Dialogues</h3>
                                    <span className="pe-card__badge">Panel</span>
                                </div>
                                <p className="pe-card__quote">
                                    "Istanbul'un kalbinde, tarihin icinde gelecegi konusmak ilham vericiydi."
                                </p>
                            </div>
                        </Link>
                    </article>
                </div>

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
