import { Link } from 'react-router-dom';
import { useI18n } from '../../i18n/I18nContext';
import { useState, useEffect } from 'react';
import galataLogo from '../../assets/galata-rum-okulu_logo.svg';
import './Header.css';

export default function Header() {
    const { lang, setLang } = useI18n();
    const [scrolled, setScrolled] = useState(false);

    // Track scroll for background styling if needed
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`header ${scrolled ? 'header--scrolled' : ''}`}>
            <div className="header__inner">
                <div className="header__logo-group">
                    <Link to="/" className="header__logo-link">
                        <img
                            src={galataLogo}
                            alt="Galata Rum Okulu Logo"
                            className="header__logo"
                        />
                        <span className="header__logo-year">1885</span>
                    </Link>
                </div>

                <div className="header__right">
                    <div className="header__nav-links">
                        <Link to="/" className="header__nav-link">GALATA RUM OKULU</Link>
                        <Link to="/archive" className="header__nav-link">Okul Arsivi</Link>
                        <Link to="/venue-hire" className="header__nav-link">ETKINLIKLER</Link>
                        <Link to="/past-events" className="header__nav-link">GECMIS ETKINLIKLER</Link>
                        <a href="#" className="header__nav-link">AMMF FOUNDATION</a>
                        <a href="#" className="header__nav-link">BIZE ULASIN</a>
                    </div>

                    <div className="header__actions">
                        <div className="header__lang-switcher">
                            <button
                                className={`header__lang-btn ${lang === 'tr' ? 'active' : ''}`}
                                onClick={() => setLang('tr')}
                            >TR</button>
                            <span className="header__lang-divider">|</span>
                            <button
                                className={`header__lang-btn ${lang === 'en' ? 'active' : ''}`}
                                onClick={() => setLang('en')}
                            >EN</button>
                            <span className="header__lang-divider">|</span>
                            <button
                                className={`header__lang-btn ${lang === 'el' ? 'active' : ''}`}
                                onClick={() => setLang('el')}
                            >EL</button>
                        </div>

                        <button className="header__dark-mode-toggle">
                            <svg className="header__moon-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 21.5C6.75329 21.5 2.5 17.2467 2.5 12C2.5 8.13689 4.80214 4.81183 8.35639 3.25055C8.90564 3.00908 9.53123 3.39807 9.5583 3.99951C9.72145 7.62534 12.6976 10.5 16.3353 10.5C17.5103 10.5 18.6186 10.1915 19.5744 9.64808C20.0783 9.36153 20.7226 9.68233 20.7416 10.2612C20.9103 15.4214 17.0623 21.5 12 21.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
