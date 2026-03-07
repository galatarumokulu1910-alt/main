import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../../i18n/I18nContext';
import { sampleArtifacts } from '../../data/sampleArtifacts';
import { objectsArtifacts } from '../../data/objectsArtifacts';
import { documentsArtifacts } from '../../data/documentsArtifacts';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import './ArchiveCollectionPage.css';

type Lang = 'tr' | 'en' | 'el';

const tabs = {
    tr: ['Belgeler & Kişiler', 'Objeler & Mekanlar'],
    en: ['Documents & People', 'Objects & Spaces'],
    el: ['Έγγραφα & Πρόσωπα', 'Αντικείμενα & Χώροι'],
};

const docSubTabs = {
    tr: ['Tümü', 'El Yazmaları', 'Fotoğraflar', 'Mektuplar', 'Resmi Kayıtlar', 'Öğrenci Kayıtları'],
    en: ['All', 'Manuscripts', 'Photographs', 'Letters', 'Official Records', 'Student Records'],
    el: ['Όλα', 'Χειρόγραφα', 'Φωτογραφίες', 'Επιστολές', 'Επίσημα Αρχεία', 'Μαθητολόγια'],
};

// Maps doc sub-tab index (excluding 0=All) to category/subCategory values
const docSubCategoryKeys = ['books', 'portraits', 'documents', 'documents', 'kayit'];

const objSubTabs = {
    tr: ['Tümü', 'Atletik Kupalar', 'Bina & Tabelalar', 'Eğitim Araçları', 'Eski Objeler', 'Kişisel Eşyalar', 'Öğrenci Eserleri'],
    en: ['All', 'Athletic Trophies', 'Building & Signs', 'Educational Tools', 'Old Objects', 'Personal Items', 'Student Works'],
    el: ['Όλα', 'Αθλητικά Τρόπαια', 'Κτίριο & Πινακίδες', 'Εκπαιδευτικά Εργαλεία', 'Παλιά Αντικείμενα', 'Προσωπικά Είδη', 'Μαθητικά Έργα'],
};

// Maps sub-tab index (excluding 0=All) to subCategory values
const objSubCategoryKeys = ['atletik', 'bina', 'egitim', 'obje', 'kisisel', 'ogrenci'];

const sidebarLinks = {
    tr: { home: 'Ana Sayfa', archive: 'Arşiv', explore: 'Haritayı Keşfet', settings: 'Ayarlar', searchPlaceholder: 'Arşivde ara...', topTitle: 'Koleksiyon', sub: 'Mirası Korumak' },
    en: { home: 'Home', archive: 'Archive', explore: 'Explore Map', settings: 'Settings', searchPlaceholder: 'Search archive...', topTitle: 'Collection', sub: 'Preserving Legacy' },
    el: { home: 'Αρχική', archive: 'Αρχείο', explore: 'Χάρτης', settings: 'Ρυθμίσεις', searchPlaceholder: 'Αναζήτηση αρχείου...', topTitle: 'Συλλογή', sub: 'Διατήρηση Κληρονομιάς' },
};

const categoryLabels: Record<string, Record<string, string>> = {
    books: { tr: 'Nadir El Yazması', en: 'Rare Manuscript', el: 'Σπάνιο Χειρόγραφο' },
    portraits: { tr: 'Fotoğraf', en: 'Photography', el: 'Φωτογραφία' },
    documents: { tr: 'Resmi Kayıt', en: 'Official Record', el: 'Επίσημο Αρχείο' },
    objects: { tr: 'Fiziksel Obje', en: 'Physical Object', el: 'Φυσικό Αντικείμενο' },
    atletik: { tr: 'Atletik Kupa', en: 'Athletic Trophy', el: 'Αθλητικό Τρόπαιο' },
    bina: { tr: 'Bina & Tabela', en: 'Building & Sign', el: 'Κτίριο & Πινακίδα' },
    egitim: { tr: 'Eğitim Aracı', en: 'Educational Tool', el: 'Εκπαιδευτικό Εργαλείο' },
    obje: { tr: 'Eski Obje', en: 'Old Object', el: 'Παλιό Αντικείμενο' },
    kisisel: { tr: 'Kişisel Eşya', en: 'Personal Item', el: 'Προσωπικό Αντικείμενο' },
    ogrenci: { tr: 'Öğrenci Eseri', en: 'Student Work', el: 'Μαθητικό Έργο' },
    kayit: { tr: 'Öğrenci Kaydı', en: 'Student Record', el: 'Μαθητολόγιο' },
};

export default function ArchiveCollectionPage() {
    const { lang } = useI18n();
    const l = (lang as Lang) || 'en';
    const [activeTab, setActiveTab] = useState(0);
    const [activeSubTab, setActiveSubTab] = useState(0);

    const sb = sidebarLinks[l] || sidebarLinks.en;
    const currentTabs = tabs[l] || tabs.en;
    const currentSubTabs = activeTab === 0
        ? (docSubTabs[l] || docSubTabs.en)
        : (objSubTabs[l] || objSubTabs.en);

    // Filter artifacts based on active tab and sub-tab
    const allDocArtifacts = [...sampleArtifacts.filter(a => ['books', 'portraits', 'documents'].includes(a.category)), ...documentsArtifacts];
    const filteredArtifacts = activeTab === 0
        ? allDocArtifacts.filter(a => {
            if (activeSubTab === 0) return true; // "All"
            const subCat = docSubCategoryKeys[activeSubTab - 1];
            return a.category === subCat || a.subCategory === subCat;
        })
        : objectsArtifacts.filter(a => {
            if (activeSubTab === 0) return true; // "All"
            const subCat = objSubCategoryKeys[activeSubTab - 1];
            return a.subCategory === subCat;
        });

    const getTitle = (a: typeof sampleArtifacts[0]) => {
        if (l === 'tr') return a.titleTr || a.title;
        if (l === 'el') return a.titleEl || a.title;
        return a.title;
    };

    return (
        <div className="archive-collection" style={{ position: 'relative' }}>
            <Breadcrumbs items={[
                { label: { tr: 'Arşiv', en: 'Archive', el: 'Αρχείο' }, to: '/archive' },
                { label: { tr: 'Koleksiyon', en: 'Collection', el: 'Συλλογή' } },
            ]} />

            <div className="archive-collection__layout">
                {/* Sidebar */}
                <aside className="archive-collection__sidebar">
                    <div className="archive-collection__sidebar-header">
                        <div className="archive-collection__sidebar-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 19.5A2.5 2.5 0 016.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" /></svg>
                        </div>
                        <div>
                            <h1 className="archive-collection__sidebar-title">{sb.topTitle}</h1>
                            <p className="archive-collection__sidebar-sub">{sb.sub}</p>
                        </div>
                    </div>

                    <hr className="archive-collection__sidebar-divider" />

                    <nav className="archive-collection__nav">
                        <Link to="/" className="archive-collection__nav-link">
                            <svg className="archive-collection__nav-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" /><path d="M9 21V12h6v9" /></svg>
                            <span>{sb.home}</span>
                        </Link>
                        <Link to="/archive/collection" className="archive-collection__nav-link archive-collection__nav-link--active">
                            <svg className="archive-collection__nav-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 8V21H3V8" /><path d="M1 3h22v5H1z" /><path d="M10 12h4" /></svg>
                            <span>{sb.archive}</span>
                        </Link>
                        <Link to="/archive" className="archive-collection__nav-link">
                            <svg className="archive-collection__nav-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" /></svg>
                            <span>{sb.explore}</span>
                        </Link>
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="archive-collection__main">
                    {/* Top bar with search */}
                    <div className="archive-collection__topbar">
                        <h2 className="archive-collection__topbar-title">{sb.archive}</h2>
                        <div className="archive-collection__search">
                            <span className="archive-collection__search-icon">🔍</span>
                            <input
                                className="archive-collection__search-input"
                                type="text"
                                placeholder={sb.searchPlaceholder}
                            />
                        </div>
                    </div>

                    {/* Tab Navigation */}
                    <div className="archive-collection__tabs">
                        {currentTabs.map((tab, i) => (
                            <button
                                key={i}
                                className={`archive-collection__tab ${i === activeTab ? 'archive-collection__tab--active' : ''}`}
                                onClick={() => { setActiveTab(i); setActiveSubTab(0); }}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Sub-Tab Navigation */}
                    <div className="archive-collection__subtabs">
                        {currentSubTabs.map((sub, i) => (
                            <button
                                key={i}
                                className={`archive-collection__subtab ${i === activeSubTab ? 'archive-collection__subtab--active' : ''}`}
                                onClick={() => setActiveSubTab(i)}
                            >
                                {sub}
                            </button>
                        ))}
                    </div>

                    {/* Masonry Grid */}
                    <div className="archive-collection__grid">
                        {filteredArtifacts.map(artifact => (
                            <Link
                                key={artifact.id}
                                to={`/archive/item/${artifact.id}`}
                                className="archive-collection__card"
                            >
                                <div className="archive-collection__card-image">
                                    <img
                                        className="archive-collection__card-img"
                                        src={artifact.imageSrc}
                                        alt={getTitle(artifact)}
                                    />
                                </div>
                                <div>
                                    <h3 className="archive-collection__card-title">{getTitle(artifact)}</h3>
                                    <div className="archive-collection__card-meta">
                                        <span className="archive-collection__card-category">
                                            {categoryLabels[artifact.subCategory || artifact.category]?.[l] || artifact.category}
                                        </span>
                                        <p className="archive-collection__card-date">{artifact.date}</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
}
