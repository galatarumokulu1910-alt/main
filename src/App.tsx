import { BrowserRouter, Routes, Route } from 'react-router-dom';
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

function App() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <HelmetProvider>
          <BrowserRouter>
            <ScrollToTop />
            <div className="app">
              <Header />
              <main>
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
                  <Route path="/admin" element={<AdminPage />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </BrowserRouter>
        </HelmetProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}

export default App;
