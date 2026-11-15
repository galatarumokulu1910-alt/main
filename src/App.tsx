import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { I18nProvider, useI18n } from './i18n/I18nContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import HomePage from './pages/HomePage/HomePage';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import './styles/global.css';

const ArchiveEntryPage = lazy(() => import('./pages/ArchivePage/ArchiveEntryPage'));
const ArchiveCollectionPage = lazy(() => import('./pages/ArchivePage/ArchiveCollectionPage'));
const ArchiveItemPage = lazy(() => import('./pages/ArchivePage/ArchiveItemPage'));
const IstanbulRumCollectionPage = lazy(() => import('./pages/ArchivePage/IstanbulRumCollectionPage'));
const VenueHirePage = lazy(() => import('./pages/VenueHirePage/VenueHirePage'));
const PastEventsPage = lazy(() => import('./pages/PastEventsPage/PastEventsPage'));
const EventDetailPage = lazy(() => import('./pages/EventDetailPage/EventDetailPage'));
const HistoryPage = lazy(() => import('./pages/HistoryPage/HistoryPage'));
const ConciergePage = lazy(() => import('./pages/ConciergePage/ConciergePage'));
const AmmfPage = lazy(() => import('./pages/AmmfPage/AmmfPage'));
const LegalPage = lazy(() => import('./pages/LegalPage/LegalPage'));
const AdminPage = lazy(() => import('./pages/AdminPage/AdminPage'));

function MainRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/arsiv" element={<ArchiveEntryPage />} />
      <Route path="/arsiv/koleksiyon" element={<ArchiveCollectionPage />} />
      <Route path="/arsiv/eser/:id" element={<ArchiveItemPage />} />
      <Route path="/arsiv/istanbul-rum" element={<IstanbulRumCollectionPage />} />
      <Route path="/mekan-kiralama" element={<VenueHirePage />} />
      <Route path="/gecmis-etkinlikler" element={<PastEventsPage />} />
      <Route path="/gecmis-etkinlikler/:slug" element={<EventDetailPage />} />
      <Route path="/tarihce" element={<HistoryPage />} />
      <Route path="/bize-ulasin" element={<ConciergePage />} />
      <Route path="/ammf" element={<AmmfPage />} />
      <Route path="/kvkk" element={<LegalPage docType="kvkk" />} />
      <Route path="/gizlilik-politikasi" element={<LegalPage docType="privacy" />} />
      <Route path="/cerez-politikasi" element={<LegalPage docType="cookies" />} />
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

  return <Navigate to="/" replace />;
}

function AppLayout() {
  const location = useLocation();
  const { lang } = useI18n();
  const isAdmin = location.pathname.startsWith('/admin');
  const skipLabel = lang === 'tr' ? 'Ana içeriğe geç' : lang === 'el' ? 'Μετάβαση στο κύριο περιεχόμενο' : 'Skip to main content';

  return (
    <div className="app">
      {!isAdmin && (
        <a href="#main-content" className="skip-to-content">
          {skipLabel}
        </a>
      )}
      {!isAdmin && <Header />}
      <main id="main-content">
        <Suspense fallback={<div style={{ minHeight: '60vh' }} aria-busy="true" />}>
          <Routes>
            <Route path="/admin" element={<AdminPage />} />
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
