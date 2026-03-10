import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useI18n } from '../../i18n/I18nContext';
import { supabase } from '../../services/supabaseClient';
import { resolveArtifactImage } from '../../data/artifactImageMap';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import './ArchiveCollectionPage.css';

type Lang = 'tr' | 'en' | 'el';

const tabs = {
    tr: ['Belgeler & Haritalar', 'Fotoğraflar & Objeler'],
    en: ['Documents & Maps', 'Photographs & Objects'],
    el: ['Έγγραφα & Χάρτες', 'Φωτογραφίες & Αντικείμενα'],
};

const docSubTabs = {
    tr: ['Tümü', 'Belgeler'],
    en: ['All', 'Documents'],
    el: ['Όλα', 'Έγγραφα'],
};

const objSubTabs = {
    tr: ['Tümü', 'Cemaat Fotoğrafları', 'Tarihî Objeler'],
    en: ['All', 'Community Photos', 'Historical Objects'],
    el: ['Όλα', 'Φωτογραφίες Κοινότητας', 'Ιστορικά Αντικείμενα'],
};

const sidebarLinks = {
    tr: { home: 'Ana Sayfa', archive: 'Arşiv', istanbulRum: 'İstanbul Rumları', explore: 'Haritayı Keşfet', searchPlaceholder: 'Arşivde ara...', topTitle: 'İstanbul Rumları', sub: 'Toplumsal Bellek' },
    en: { home: 'Home', archive: 'Archive', istanbulRum: 'Istanbul Greeks', explore: 'Explore Map', searchPlaceholder: 'Search archive...', topTitle: 'Istanbul Greeks', sub: 'Communal Memory' },
    el: { home: 'Αρχική', archive: 'Αρχείο', istanbulRum: 'Έλληνες Κωνσταντινούπολης', explore: 'Χάρτης', searchPlaceholder: 'Αναζήτηση αρχείου...', topTitle: 'Έλληνες Κων/πολης', sub: 'Κοινοτική Μνήμη' },
};

const categoryLabels: Record<string, Record<string, string>> = {
    'Documents': { tr: 'Belge', en: 'Document', el: 'Έγγραφο' },
    'Community Photos': { tr: 'Cemaat Fotoğrafı', en: 'Community Photo', el: 'Φωτογραφία Κοινότητας' },
    'Historical Objects': { tr: 'Tarihî Obje', en: 'Historical Object', el: 'Ιστορικό Αντικείμενο' },
    'Documents & Maps': { tr: 'Belge & Haritalar', en: 'Documents & Maps', el: 'Έγγραφα & Χάρτες' },
    'Photographs & Objects': { tr: 'Fotoğraf & Objeler', en: 'Photographs & Objects', el: 'Φωτογραφίες & Αντικείμενα' }
};

export default function IstanbulRumCollectionPage() {
    const location = useLocation();
    const { lang } = useI18n();
    const l = (lang as Lang) || 'en';
    const [activeTab, setActiveTab] = useState(location.state?.tab || 0);
    const [activeSubTab, setActiveSubTab] = useState(location.state?.subTab || 0);

    const [artifactsData, setArtifactsData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArtifacts = async () => {
            const { data } = await supabase.from('artifacts')
                .select(`
                    *,
                    category:archive_categories(name_en),
                    subcategory:archive_subcategories(name_en)
                `)
                .eq('status', 'published')
                .eq('archive_type', 'istanbul_rum');

            if (data) {
                const mapped = data.map(item => ({
                    ...item,
                    category: item.category?.name_en || 'Documents & Maps',
                    subCategory: item.subcategory?.name_en || 'Community Photos',
                    imageSrc: resolveArtifactImage(item),
                    date: item.provenance_tr || ''
                }));
                setArtifactsData(mapped);
            }
            setLoading(false);
        };
        fetchArtifacts();
    }, []);

    const sb = sidebarLinks[l] || sidebarLinks.en;
    const currentTabs = tabs[l] || tabs.en;
    const currentSubTabs = activeTab === 0
        ? (docSubTabs[l] || docSubTabs.en)
        : (objSubTabs[l] || objSubTabs.en);

    const docSubCategoryKeys = ['Documents'];
    const objSubCategoryKeys = ['Community Photos', 'Historical Objects'];

    // Filter artifacts based on active tab and sub-tab
    const allDocArtifacts = artifactsData.filter(a => a.category === 'Documents & Maps');
    const allObjArtifacts = artifactsData.filter(a => a.category === 'Photographs & Objects');

    const filteredArtifacts = activeTab === 0
        ? allDocArtifacts.filter(a => {
            if (activeSubTab === 0) return true; // "All"
            const subCat = docSubCategoryKeys[activeSubTab - 1];
            return a.subCategory === subCat;
        })
        : allObjArtifacts.filter(a => {
            if (activeSubTab === 0) return true; // "All"
            const subCat = objSubCategoryKeys[activeSubTab - 1];
            return a.subCategory === subCat;
        });

    const getTitle = (a: any) => {
        if (l === 'tr') return a.title_tr || a.title_en;
        if (l === 'el') return a.title_el || a.title_en;
        return a.title_en;
    };

    return (
        <div className="archive-collection" style={{ position: 'relative' }}>
            <Breadcrumbs items={[
                { label: { tr: 'Arşiv', en: 'Archive', el: 'Αρχείο' }, to: '/archive' },
                { label: { tr: 'İstanbul Rumları', en: 'Istanbul Greeks', el: 'Έλληνες Κων/πολης' } },
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
                        <Link to="/archive" className="archive-collection__nav-link">
                            <svg className="archive-collection__nav-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" /><path d="M9 21V12h6v9" /></svg>
                            <span>{sb.home}</span>
                        </Link>
                        <Link to="/archive/istanbul-rum" className="archive-collection__nav-link archive-collection__nav-link--active">
                            <svg className="archive-collection__nav-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 8V21H3V8" /><path d="M1 3h22v5H1z" /><path d="M10 12h4" /></svg>
                            <span>{sb.istanbulRum}</span>
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
                        <h2 className="archive-collection__topbar-title">{sb.istanbulRum}</h2>
                        <div className="archive-collection__search">
                            <span className="archive-collection__search-icon">🔍</span>
                            <input
                                className="archive-collection__search-input"
                                type="text"
                                placeholder={sb.searchPlaceholder}
                            />
                        </div>
                    </div>
                    {loading && <div style={{ padding: '20px' }}>Loading Collection...</div>}

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
