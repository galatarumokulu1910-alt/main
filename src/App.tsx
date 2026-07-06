import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { I18nProvider } from './i18n/I18nContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import HomePage from './pages/HomePage/HomePage';
import ArchiveEntryPage from './pages/ArchivePage/ArchiveEntryPage';
import ArchiveCollectionPage from './pages/ArchivePage/ArchiveCollectionPage';
import ArchiveItemPage from './pages/ArchivePage/ArchiveItemPage';
import IstanbulRumCollectionPage from './pages/ArchivePage/IstanbulRumCollectionPage';
import VenueHirePage from './pages/VenueHirePage/VenueHirePage';
import PastEventsPage from './pages/PastEventsPage/PastEventsPage';
import EventDetailPage from './pages/EventDetailPage/EventDetailPage';
import HistoryPage from './pages/HistoryPage/HistoryPage';
import ConciergePage from './pages/ConciergePage/ConciergePage';
import AmmfPage from './pages/AmmfPage/AmmfPage';
import AdminPage from './pages/AdminPage/AdminPage';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import './styles/global.css';

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
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div className="app">
      {!isAdmin && <Header />}
      <main>
        <Routes>
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/en/*" element={<PrefixRouteWrapper />} />
          <Route path="/el/*" element={<PrefixRouteWrapper />} />
          <Route path="/tr/*" element={<PrefixRouteWrapper />} />
          <Route path="/*" element={<MainRoutes />} />
        </Routes>
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
