import { Suspense, lazy, useState, useEffect, type ComponentType, type ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { I18nProvider, useI18n } from './i18n/I18nContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ARCHIVE_PUBLIC_ENABLED } from './config/venueInfo';
import { supabase } from './services/supabaseClient';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import HomePage from './pages/HomePage/HomePage';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import { LogoLoader, PageTransitionLoader } from './components/LogoLoader/LogoLoader';
import './styles/global.css';

function lazyWithRetry<T extends ComponentType<any>>(factory: () => Promise<{ default: T }>) {
  return lazy(async () => {
    try {
      return await factory();
    } catch (err) {
      const key = 'galata_chunk_reload';
      const lastReload = Number(sessionStorage.getItem(key) || '0');
      if (typeof window !== 'undefined' && Date.now() - lastReload > 10000) {
        sessionStorage.setItem(key, String(Date.now()));
        window.location.reload();
      }
      throw err;
    }
  });
}

const ArchiveEntryPage = lazyWithRetry(() => import('./pages/ArchivePage/ArchiveEntryPage'));
const ArchiveCollectionPage = lazyWithRetry(() => import('./pages/ArchivePage/ArchiveCollectionPage'));
const ArchiveItemPage = lazyWithRetry(() => import('./pages/ArchivePage/ArchiveItemPage'));
const IstanbulRumCollectionPage = lazyWithRetry(() => import('./pages/ArchivePage/IstanbulRumCollectionPage'));
const VenueHirePage = lazyWithRetry(() => import('./pages/VenueHirePage/VenueHirePage'));
const PastEventsPage = lazyWithRetry(() => import('./pages/PastEventsPage/PastEventsPage'));
const EventDetailPage = lazyWithRetry(() => import('./pages/EventDetailPage/EventDetailPage'));
const HistoryPage = lazyWithRetry(() => import('./pages/HistoryPage/HistoryPage'));
const ConciergePage = lazyWithRetry(() => import('./pages/ConciergePage/ConciergePage'));
const AmmfPage = lazyWithRetry(() => import('./pages/AmmfPage/AmmfPage'));
const LegalPage = lazyWithRetry(() => import('./pages/LegalPage/LegalPage'));
const AdminPage = lazyWithRetry(() => import('./pages/AdminPage/AdminPage'));

function ArchiveAdminGate({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<'checking' | 'admin' | 'blocked'>(
    ARCHIVE_PUBLIC_ENABLED ? 'admin' : 'checking'
  );

  useEffect(() => {
    if (ARCHIVE_PUBLIC_ENABLED) {
      setStatus('admin');
      return;
    }
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (mounted) {
        setStatus(data?.session?.user ? 'admin' : 'blocked');
      }
    }).catch(() => {
      if (mounted) setStatus('blocked');
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setStatus(session?.user ? 'admin' : 'blocked');
      }
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  if (ARCHIVE_PUBLIC_ENABLED) {
    return <>{children}</>;
  }
  if (status === 'checking') {
    return <LogoLoader mode="suspense" />;
  }
  if (status !== 'admin') {
    return <NotFoundPage />;
  }
  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex, nofollow, noarchive" />
      </Helmet>
      {children}
    </>
  );
}

function MainRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/arsiv" element={<ArchiveAdminGate><ArchiveEntryPage /></ArchiveAdminGate>} />
      <Route path="/arsiv/koleksiyon" element={<ArchiveAdminGate><ArchiveCollectionPage /></ArchiveAdminGate>} />
      <Route path="/arsiv/eser/:id" element={<ArchiveAdminGate><ArchiveItemPage /></ArchiveAdminGate>} />
      <Route path="/arsiv/istanbul-rum" element={<ArchiveAdminGate><IstanbulRumCollectionPage /></ArchiveAdminGate>} />
      <Route path="/mekan-kiralama" element={<VenueHirePage />} />
      <Route path="/gecmis-etkinlikler" element={<PastEventsPage />} />
      <Route path="/gecmis-etkinlikler/:slug" element={<EventDetailPage />} />
      <Route path="/tarihce" element={<HistoryPage />} />
      <Route path="/bize-ulasin" element={<ConciergePage />} />
      <Route path="/ammf" element={<AmmfPage />} />
      <Route path="/kvkk" element={<LegalPage docType="kvkk" />} />
      <Route path="/gizlilik-politikasi" element={<LegalPage docType="privacy" />} />
      <Route path="/cerez-politikasi" element={<LegalPage docType="cookies" />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/admin/*" element={<AdminPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

function PrefixRouteWrapper() {
  const location = useLocation();
  const lang = location.pathname.split('/')[1];

  if (lang === 'tr') {
    const parts = location.pathname.split('/');
    const basePath = '/' + parts.slice(2).join('/');
    return <Navigate to={`${basePath}${location.search}${location.hash}`} replace />;
  }

  if (lang && ['en', 'el'].includes(lang)) {
    return <MainRoutes />;
  }

  return <NotFoundPage />;
}

function AppLayout() {
  const location = useLocation();
  const { lang } = useI18n();
  const isAdmin = /^\/((en|el)\/)?admin(\/|$)/.test(location.pathname);
  const skipLabel = lang === 'tr' ? 'Ana içeriğe geç' : lang === 'el' ? 'Μετάβαση στο κύριο περιεχόμενο' : 'Skip to main content';

  return (
    <div className="app">
      {!isAdmin && (
        <a href="#main-content" className="skip-to-content">
          {skipLabel}
        </a>
      )}
      {!isAdmin && <Header />}
      <PageTransitionLoader />
      <main id="main-content">
        <Suspense fallback={<LogoLoader mode="suspense" />}>
          <Routes>
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/admin/*" element={<AdminPage />} />
            <Route path="/en/*" element={<PrefixRouteWrapper />} />
            <Route path="/el/*" element={<PrefixRouteWrapper />} />
            <Route path="/tr/*" element={<PrefixRouteWrapper />} />
            <Route path="/*" element={<MainRoutes />} />
          </Routes>
        </Suspense>
      </main>
      {!isAdmin && <Footer />}
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <I18nProvider>
          <HelmetProvider>
            <ScrollToTop />
            <AppLayout />
          </HelmetProvider>
        </I18nProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
