import { useI18n } from '../../i18n/I18nContext';
import './HistoryPage.css';

export default function HistoryPage() {
    const { lang } = useI18n();

    // Translations for this specific page could also live in the global i18n file,
    // but for simplicity and modularity of this specific long-form content, we can define them locally
    // or use inline dictionaries.

    const content = {
        hero: {
            title1: { tr: '120 Yıllık', en: '120 Years of', el: '120 Chronia' },
            title2: { tr: 'Tarih', en: 'History', el: 'Istoria' },
            subtitle: {
                tr: 'Galata\'nın kalbinde neoklasik tarih, akademik mukemmellik ve kisisel donusumun 120 yili.',
                en: '120 years of neoclassical history, academic excellence, and cultural transformation in the heart of Galata.',
                el: '120 chronia neoklasikis istorias, akadimakis aristeias kai politistikis metavasis stin kardia tis Galatas.'
            },
            badgeText: { tr: 'Kurulus Yili', en: 'Foundation Year', el: 'Etos Idrysis' }
        },
        tarihce: {
            title: { tr: 'Tarihce', en: 'History', el: 'Istoria' },
            p1: {
                tr: 'Galata Rum Okulu, Osmanli Imparatorlugu\'nun modernlesme surecinde Rum toplulugunun gerceklestirdigi egitim kurumlari icindeki onemli bir yere sahip yapilardan biridir. Okul, Rum cocuklarin modern egitim ve ogretimine katki saglayabilmek amaciyla donemin hayirseverlerinden Eleni Zarifi\'nin destekleriyle insa edilmistir.',
                en: 'Galata Greek School is one of the important structures among the educational institutions realized by the Greek community during the modernization process of the Ottoman Empire. The school was built with the support of Eleni Zarifi, one of the philanthropists of the period, in order to contribute to the modern education and training of Greek children.',
                el: 'To Galata Rum Okulu einai ena apo ta simantika ktiiria anamesa sta ekpaideftika idrymata pou dimiourgise i elliniki koinotita kata ti diadikasia eksygchronismou tis Othomanikis Aftokratorias. To scholeio chtistike me tin ypostiriksi tis Eleni Zarifi, mias apo tis filanthropous tis epochis, prokeimenou na symvalei sti synchroni ekpaidefsi kai katartisi ton Ellinopoulon.'
            },
            p2: {
                tr: 'Okulun mimarlari Patroklos Kambanakis ve Stavros Hristidis\'tir. Okulun acilisi 1910 yilinda 2 Haziran Carsamba gunu saat 11\'de gerceklestirilmistir.',
                en: 'The architects of the school are Patroklos Kambanakis and Stavros Hristidis. The opening of the school took place at 11 am on Wednesday, June 2, 1910.',
                el: 'Oi architektones tou scholeiou einai o Patroklos Kampanakis kai o Stavros Christidis. Ta egkainia tou scholeiou pragmatopoiithikan stis 11 p.m. tin Tetarti 2 Iouniou 1910.'
            }
        },
        middleBlock: {
            title: {
                tr: 'Donemin neoklasik-eklektik mimari uslubuyla insa edilen okul, Istanbul\'un tarihi ticaret ve finans merkezi Galata\'da bulunmaktadir.',
                en: 'Built with the neoclassical-eclectic architectural style of the period, the school is located in Galata, the historical historical trade and financial center of Istanbul.',
                el: 'Chtismenou me to neoklasiko-eklektiko architektoniko styl tis epochis, to scholeio vrisketai sti Galata, to istoriko emporiko kai oikonomiko kentro tis Konstantinoupolis.'
            },
            subtitle: {
                tr: 'Gecmiste cocuk sesleriyle yankilanan, ancak uzun yillar sessizlige gomulen okul binasi 2012 yilinda sahiplerine iade edilmistir.',
                en: 'The school building, which echoed with children\'s voices in the past but was buried in silence for many years, was returned to its owners in 2012.',
                el: 'To ktirio tou scholeiou, pou antixouse apo paidikes fones sto parelthon alla vythistike sti siopi gia polla chronia, epistrafike stous idioktites tou to 2012.'
            }
        },
        restoration: {
            title: { tr: 'Restorasyon', en: 'Restoration', el: 'Apokatastasi' },
            p1: {
                tr: 'Restorasyon projesinin uygulamasi Ekumenik Patrik Hazretleri I. Bartholomeos\'un himayelerinde baslatilmistir. Sayin Marina ve Athanasios Martinos\'un comert ve zarif sponsorluklari sayesinde tamamlanmistir.',
                en: 'The implementation of the restoration project was initiated under the auspices of His All-Holiness Ecumenical Patriarch Bartholomew I. It was completed thanks to the generous and elegant sponsorship of Mr. Marina and Athanasios Martinos.',
                el: 'I ylopoiisi tou ergou apokatastasis ksekinise ypo tin aigida tis A.Th.P. tou Oikoumenikou Patriarchou Vartholomaiou A\'. Oloklirothike chari sti gennaiodori kai kompsi chorigia tis k. Marina kai tou k. Athanasiou Martinou.'
            },
            p2: {
                tr: 'Galata Rum Okulu, yeni kurumsal adiyla "Okul" hem gecmisten gelen hafizasini, koklu gecmisini koruyarak, Rum kimligi ve kulturel mirasinin bir kurumu olmayi, hem de gelecege yonelik bir perspektif yaratmak uzere tum Istanbullulari kucaklayan bir sanat ve egitim alani olmayi hedeflemektedir.',
                en: 'Galata Greek School, with its new corporate name "The School", aims to be an institution of Greek identity and cultural heritage by preserving its memory from the past and entirely deep-rooted past, as well as an art and education area that embraces all Istanbulites to create a perspective towards the future.',
                el: 'To Galata Rum Okulu, me ti nea tou etairiki eponymia "To Scholeio", stocheuei na einai ena idryma tis ellinikis taftotitas kai tis politistikis klironomias diatirontas ti mnimi tou apo to parelthon kai to vathia rizomeno parelthon tou, kathos kai enas choros technis kai ekpaidefsis pou agkaliazei olous tous Konstantinoupolites gia na dimiourgisei mia prooptiki gia to mellon.'
            },
            btn: { tr: 'Proje Detaylarini Incele', en: 'Examine Project Details', el: 'Eksetaste tis leptomereies tou ergou' }
        }
    };

    return (
        <div className="history-page">
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
