import { Link, useLocation } from 'react-router-dom';
import { useI18n } from '../../i18n/I18nContext';
import { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import galataLogo from '../../assets/galata-rum-okulu_logo.svg';
import './Header.css';

export default function Header() {
    const { lang, setLang, t, localizePath } = useI18n();
    const { theme, toggleTheme } = useTheme();
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation();

    const [prevPath, setPrevPath] = useState(location.pathname);
    if (location.pathname !== prevPath) {
        setPrevPath(location.pathname);
        setMobileOpen(false);
    }

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

    const getLocalizedPath = (code: 'tr' | 'en' | 'el') => {
        const parts = location.pathname.split('/');
        const firstPart = parts[1];
        const hasPrefix = ['tr', 'en', 'el'].includes(firstPart);
        const baseParts = hasPrefix ? parts.slice(2) : parts.slice(1);
        const basePath = '/' + baseParts.join('/');
        
        if (code === 'tr') {
            return basePath;
        }
        return `/${code}${basePath === '/' ? '' : basePath}`;
    };

    const navItems = [
        { to: localizePath('/'), label: t('nav.home') },
        { to: localizePath('/arsiv'), label: t('nav.archive') },
        { to: localizePath('/mekan-kiralama'), label: t('nav.venueHire') },
        { to: localizePath('/gecmis-etkinlikler'), label: t('nav.events') },
        { to: localizePath('/ammf'), label: 'AMMF' },
        { to: localizePath('/bize-ulasin'), label: t('nav.contact') },
    ];

    const logoAlt = lang === 'tr' ? 'Galata Rum Okulu Logo' : lang === 'el' ? 'Λογότυπο Ελληνικού Σχολείου Γαλατά' : 'Galata Greek School Logo';
    const hamburgerLabel = mobileOpen 
        ? (lang === 'tr' ? 'Menüyü kapat' : lang === 'el' ? 'Κλείσιμο μενού' : 'Close menu')
        : (lang === 'tr' ? 'Menüyü aç' : lang === 'el' ? 'Άνοιγμα μενού' : 'Open menu');

    const langNames = {
        tr: 'Türkçe',
        en: 'English',
        el: 'Ελληνικά'
    };

    return (
        <>
            <nav className={`header ${scrolled ? 'header--scrolled' : ''}`}>
                <div className="header__inner">
                    <div className="header__logo-group">
                        <Link to={localizePath('/')} className="header__logo-link">
                            <img
                                src={galataLogo}
                                alt={logoAlt}
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
                                    aria-current={location.pathname === item.to ? 'page' : undefined}
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
                                {(['tr', 'en', 'el'] as const).map((code, idx) => (
                                    <span key={code}>
                                        <Link
                                            to={getLocalizedPath(code)}
                                            className={`header__lang-btn ${lang === code ? 'active' : ''}`}
                                            onClick={() => setLang(code)}
                                            aria-label={`Change language to ${langNames[code]}`}
                                            aria-current={lang === code ? 'true' : undefined}
                                        >
                                            {code.toUpperCase()}
                                        </Link>
                                        {idx < 2 && <span className="header__lang-divider">|</span>}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Mobile hamburger toggle */}
                        <button
                            className={`header__mobile-toggle ${mobileOpen ? 'header__mobile-toggle--open' : ''}`}
                            onClick={() => setMobileOpen(!mobileOpen)}
                            aria-label={hamburgerLabel}
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
                            aria-current={location.pathname === item.to ? 'page' : undefined}
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
                            <Link
                                key={code}
                                to={getLocalizedPath(code)}
                                className={`header__mobile-lang-btn ${lang === code ? 'active' : ''}`}
                                onClick={() => setLang(code)}
                                aria-label={`Change language to ${langNames[code]}`}
                                aria-current={lang === code ? 'true' : undefined}
                            >
                                {code.toUpperCase()}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
