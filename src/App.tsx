import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
        <BrowserRouter>
          <ScrollToTop />
          <div className="app">
            <Header />
            <main>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/archive" element={<ArchiveEntryPage />} />
                <Route path="/archive/collection" element={<ArchiveCollectionPage />} />
                <Route path="/archive/item/:id" element={<ArchiveItemPage />} />
                <Route path="/archive/istanbul-rum" element={<IstanbulRumCollectionPage />} />
                <Route path="/venue-hire" element={<VenueHirePage />} />
                <Route path="/past-events" element={<PastEventsPage />} />
                <Route path="/past-events/:eventId" element={<EventDetailPage />} />
                <Route path="/history" element={<HistoryPage />} />
                <Route path="/concierge" element={<ConciergePage />} />
                <Route path="/ammf" element={<AmmfPage />} />
                <Route path="/admin" element={<AdminPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </I18nProvider>
    </ThemeProvider>
  );
}

export default App;
