import { Link, useLocation } from 'react-router-dom';
import { useI18n } from '../../i18n/I18nContext';
import { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import galataLogo from '../../assets/galata-rum-okulu_logo.svg';
import './Header.css';

export default function Header() {
    const { lang, setLang, t } = useI18n();
    const { theme, toggleTheme } = useTheme();
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation();

    // Close mobile menu on route change
    useEffect(() => {
        setMobileOpen(false);
    }, [location.pathname]);

    // Track scroll for background styling
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        document.body.style.overflow = mobileOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [mobileOpen]);

    const navItems = [
        { to: '/', label: t('nav.home') },
        { to: '/arsiv', label: t('nav.archive') },
        { to: '/mekan-kiralama', label: t('nav.venueHire') },
        { to: '/gecmis-etkinlikler', label: t('nav.events') },
        { to: '/ammf', label: 'AMMF' },
        { to: '/bize-ulasin', label: t('nav.contact') },
    ];

    return (
        <>
            <nav className={`header ${scrolled ? 'header--scrolled' : ''}`}>
                <div className="header__inner">
                    <div className="header__logo-group">
                        <Link to="/" className="header__logo-link">
                            <img
                                src={galataLogo}
                                alt="Galata Rum Okulu Logo"
                                className="header__logo"
                                width="40"
                                height="40"
                            />
                            <span className="header__logo-year">1885</span>
                        </Link>
                    </div>

                    <div className="header__right">
                        <div className="header__nav-links">
                            {navItems.map(item => (
                                <Link
                                    key={item.to}
                                    to={item.to}
                                    className={`header__nav-link ${location.pathname === item.to ? 'header__nav-link--active' : ''}`}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>

                        <div className="header__actions">
                            <button
                                className="header__theme-toggle"
                                onClick={toggleTheme}
                                aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                                title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
                            >
                                {theme === 'dark' ? (
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="5" />
                                        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                                    </svg>
                                ) : (
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                                    </svg>
                                )}
                            </button>
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
                        </div>

                        {/* Mobile hamburger toggle */}
                        <button
                            className={`header__mobile-toggle ${mobileOpen ? 'header__mobile-toggle--open' : ''}`}
                            onClick={() => setMobileOpen(!mobileOpen)}
                            aria-label={mobileOpen ? 'Menüyü kapat' : 'Menüyü aç'}
                            aria-expanded={mobileOpen}
                        >
                            <span className="header__hamburger-line" />
                            <span className="header__hamburger-line" />
                            <span className="header__hamburger-line" />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile slide-out menu */}
            <div className={`header__mobile-overlay ${mobileOpen ? 'header__mobile-overlay--visible' : ''}`} onClick={() => setMobileOpen(false)} />
            <div className={`header__mobile-menu ${mobileOpen ? 'header__mobile-menu--open' : ''}`}>
                <div className="header__mobile-menu-inner">
                    {navItems.map(item => (
                        <Link
                            key={item.to}
                            to={item.to}
                            className={`header__mobile-link ${location.pathname === item.to ? 'header__mobile-link--active' : ''}`}
                            onClick={() => setMobileOpen(false)}
                        >
                            {item.label}
                        </Link>
                    ))}

                    <hr className="header__mobile-divider" />

                    <button
                        className="header__mobile-theme-toggle"
                        onClick={toggleTheme}
                    >
                        {theme === 'dark' ? (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="5" />
                                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                            </svg>
                        ) : (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                            </svg>
                        )}
                        <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                    </button>

                    <div className="header__mobile-lang">
                        {(['tr', 'en', 'el'] as const).map(code => (
                            <button
                                key={code}
                                className={`header__mobile-lang-btn ${lang === code ? 'active' : ''}`}
                                onClick={() => setLang(code)}
                            >
                                {code.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
