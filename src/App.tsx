import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { I18nProvider } from './i18n/I18nContext';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import HomePage from './pages/HomePage/HomePage';
import ArchivePage from './pages/ArchivePage/ArchivePage';
import VenueHirePage from './pages/VenueHirePage/VenueHirePage';
import PastEventsPage from './pages/PastEventsPage/PastEventsPage';
import EventDetailPage from './pages/EventDetailPage/EventDetailPage';
import HistoryPage from './pages/HistoryPage/HistoryPage';
import ConciergePage from './pages/ConciergePage/ConciergePage';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import './styles/global.css';

function App() {
  return (
    <I18nProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div className="app">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/archive" element={<ArchivePage />} />
              <Route path="/venue-hire" element={<VenueHirePage />} />
              <Route path="/past-events" element={<PastEventsPage />} />
              <Route path="/past-events/:eventId" element={<EventDetailPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/concierge" element={<ConciergePage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </I18nProvider>
  );
}

export default App;
