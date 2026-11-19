import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { supabase } from '../../services/supabaseClient';
import { syncDatabaseWithAuthenticatedSession } from '../../services/dbSync';
import type { Session } from '@supabase/supabase-js';
import {
    LayoutDashboard, Image as ImageIcon, Calendar, Building2, BookOpen,
    FileText, LogOut, ArrowRight, Plus, Package, Clock, FolderOpen, Users,
    CheckSquare, Inbox
} from 'lucide-react';
import SEO from '../../components/SEO/SEO';
import './AdminPage.css';
import './components/AdminForms.css';

const AdminHero = lazy(() => import('./components/AdminHero'));
const AdminInquiries = lazy(() => import('./components/AdminInquiries'));
const AdminArtifacts = lazy(() => import('./components/AdminArtifacts'));
const AdminEvents = lazy(() => import('./components/AdminEvents'));
const AdminVenue = lazy(() => import('./components/AdminVenue'));
const AdminHistory = lazy(() => import('./components/AdminHistory'));
const AdminContent = lazy(() => import('./components/AdminContent'));
const AdminCategories = lazy(() => import('./components/AdminCategories'));
const AdminIstanbulRum = lazy(() => import('./components/AdminIstanbulRum'));
const AdminTestPlans = lazy(() => import('./components/AdminTestPlans'));

interface Stats {
    inquiries: number;
    artifacts: number;
    events: number;
    venues: number;
    history: number;
    content: number;
    categories: number;
    istanbulRum: number;
    testPlans: number;
}

export default function AdminPage() {
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [activeTab, setActiveTab] = useState('dashboard');
    const [loginError, setLoginError] = useState('');
    const [stats, setStats] = useState<Stats>({ inquiries: 0, artifacts: 0, events: 0, venues: 0, history: 0, content: 0, categories: 0, istanbulRum: 0, testPlans: 0 });
    const syncedSessionIdRef = useRef<string | null>(null);
    const verifiedAdminUserIdRef = useRef<string | null>(null);

    const fetchStats = async () => {
        const [vInq, aInq, arts, evts, vens, hist, cont, cats, irArts, plans] = await Promise.all([
            supabase.from('venue_inquiries').select('id', { count: 'exact', head: true }),
            supabase.from('archive_inquiries').select('id', { count: 'exact', head: true }),
            supabase.from('artifacts').select('id', { count: 'exact', head: true }),
            supabase.from('past_events').select('id', { count: 'exact', head: true }),
            supabase.from('venue_events').select('id', { count: 'exact', head: true }),
            supabase.from('history_timeline').select('id', { count: 'exact', head: true }),
            supabase.from('page_content').select('id', { count: 'exact', head: true }),
            supabase.from('archive_categories').select('id', { count: 'exact', head: true }),
            supabase.from('artifacts').select('id', { count: 'exact', head: true }).eq('archive_type', 'istanbul_rum'),
            supabase.from('test_cases').select('id', { count: 'exact', head: true }).eq('is_plan', true),
        ]);
        setStats({
            inquiries: (vInq.count ?? 0) + (aInq.count ?? 0),
            artifacts: arts.count ?? 0,
            events: evts.count ?? 0,
            venues: vens.count ?? 0,
            history: hist.count ?? 0,
            content: cont.count ?? 0,
            categories: cats.count ?? 0,
            istanbulRum: irArts.count ?? 0,
            testPlans: plans.count ?? 0,
        });
    };

    useEffect(() => {
        const verifyAdminRole = async (currentSession: Session): Promise<boolean> => {
            if (!currentSession?.user?.id) {
                return false;
            }
            // 1. Primary authoritative check: server-side SECURITY DEFINER function `public.is_admin()`
            //    Enforces strict default-deny against `public.admin_users` (never trusting user_metadata or stale app_metadata)
            const { data, error } = await supabase.rpc('is_admin');
            if (!error && typeof data === 'boolean') {
                return data;
            }
            // 2. Fallback only if `is_admin()` RPC is unreachable: require active row in `public.admin_users`
            const { data: allowRow, error: allowErr } = await supabase
                .from('admin_users')
                .select('user_id')
                .eq('user_id', currentSession.user.id)
                .eq('is_active', true)
                .maybeSingle();
            if (allowErr) {
                return false;
            }
            return Boolean(allowRow);
        };

        const handleAuthenticatedSession = async (currentSession: Session | null) => {
            if (!currentSession) {
                setSession(null);
                syncedSessionIdRef.current = null;
                verifiedAdminUserIdRef.current = null;
                return;
            }

            const userId = currentSession.user?.id ?? 'active';
            if (verifiedAdminUserIdRef.current !== userId) {
                const isAuthorizedAdmin = await verifyAdminRole(currentSession);
                if (!isAuthorizedAdmin) {
                    verifiedAdminUserIdRef.current = null;
                    await supabase.auth.signOut();
                    setSession(null);
                    syncedSessionIdRef.current = null;
                    setLoginError('Yetkisiz hesap: Bu kullanıcı yönetici (admin) yetkisine sahip değildir.');
                    return;
                }
                verifiedAdminUserIdRef.current = userId;
            }

            if (syncedSessionIdRef.current !== userId) {
                syncedSessionIdRef.current = userId;
                await syncDatabaseWithAuthenticatedSession();
            }
            setSession(currentSession);
            void fetchStats();
        };

        // Listen for auth state changes (INITIAL_SESSION, SIGNED_IN, SIGNED_OUT, TOKEN_REFRESHED).
        // Per Context7 Supabase Auth guidance, defer async RPC work outside the synchronous event callback lock.
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, currentSession) => {
                window.setTimeout(() => {
                    void handleAuthenticatedSession(currentSession).finally(() => {
                        setLoading(false);
                    });
                }, 0);
            }
        );

        // Clean up old localStorage session if it exists
        localStorage.removeItem('galata_admin_session');

        return () => subscription.unsubscribe();
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginError('');
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setLoginError('Geçersiz e-posta veya şifre. Lütfen tekrar deneyin.');
        }
        // Session will be set automatically by onAuthStateChange listener
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setSession(null);
    };

    const navigateTo = (tab: string) => setActiveTab(tab);

    if (loading) {
        return (
            <div className="admin-loading">
                <SEO
                    overrideTitle="Galata CMS — Yönetici Paneli"
                    overrideDescription="Galata Rum Okulu Yönetim Paneli"
                    noindex={true}
                />
                Yükleniyor…
            </div>
        );
    }

    if (!session) {
        return (
            <div className="admin-login-wrapper">
                <SEO
                    overrideTitle="Galata CMS — Yönetici Paneli"
                    overrideDescription="Galata Rum Okulu Yönetim Paneli"
                    noindex={true}
                />
                <div className="admin-login-container">
                    <div className="admin-login-header">
                        <div className="admin-login-logo">G</div>
                        <h2>Galata CMS</h2>
                        <p>Yönetici Portalına Giriş Yapın</p>
                    </div>
                    <form onSubmit={handleLogin} className="admin-login-form" data-testid="admin-login-form">
                        {loginError && <div className="admin-error" role="alert">{loginError}</div>}
                        <div className="admin-input-group">
                            <label htmlFor="admin-email">E-posta</label>
                            <input
                                id="admin-email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="ornek@galata.org"
                                required
                            />
                        </div>
                        <div className="admin-input-group">
                            <label htmlFor="admin-password">Şifre</label>
                            <input
                                id="admin-password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                        </div>
                        <button type="submit" className="admin-btn-primary" style={{ marginTop: '8px' }}>
                            Giriş Yap
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    const tabs = [
        { id: 'dashboard', label: 'Gösterge Paneli', Icon: LayoutDashboard },
        { id: 'inquiries', label: 'Gelen Başvurular', Icon: Inbox },
        { id: 'hero', label: 'Ana Sayfa Hero & Pan', Icon: ImageIcon },
        { id: 'artifacts', label: 'Arşiv Eserleri', Icon: Package },
        { id: 'events', label: 'Geçmiş Etkinlikler', Icon: Calendar },
        { id: 'venue', label: 'Mekan Kiralama', Icon: Building2 },
        { id: 'history', label: 'Tarihçe', Icon: BookOpen },
        { id: 'istanbul_rum', label: 'İstanbul Rumları', Icon: Users },
        { id: 'categories', label: 'Kategoriler', Icon: FolderOpen },
        { id: 'content', label: 'Sayfa İçerikleri', Icon: FileText },
        { id: 'test_plans', label: 'Test Planları', Icon: CheckSquare },
    ];

    const pageTitles: Record<string, { title: string; sub: string }> = {
        dashboard: { title: 'Gösterge Paneli', sub: 'Genel bakış ve hızlı erişim' },
        inquiries: { title: 'Gelen Başvurular & Aboneler', sub: 'Mekan kiralama talepleri, arşiv inceleme başvuruları ve e-bülten aboneleri' },
        hero: { title: 'Ana Sayfa Hero & Pan Yönetimi', sub: 'Açılan kapı görselini, iç mekân sahnelerini ve pan yönlerini yönetin' },
        artifacts: { title: 'Arşiv Eserleri', sub: 'Arşiv eserlerini ekleyin ve yönetin' },
        events: { title: 'Geçmiş Etkinlikler', sub: 'Etkinlik kayıtlarını yönetin' },
        venue: { title: 'Mekan Kiralama', sub: 'Kiralanabilir alanları yönetin' },
        history: { title: 'Tarihçe', sub: 'Zaman çizelgesini yönetin' },
        istanbul_rum: { title: 'İstanbul Rumları Arşivi', sub: 'İstanbul Rum toplumunun eserlerini yönetin' },
        categories: { title: 'Arşiv Kategorileri', sub: 'Ana ve alt kategorileri yönetin' },
        content: { title: 'Sayfa İçerikleri', sub: 'Statik metin içeriklerini yönetin' },
        test_plans: { title: 'QA Test Planları', sub: 'Otomasyon ve manuel test planlarını yönetin' },
    };

    const statsCards = [
        { label: 'Gelen Başvuru', value: stats.inquiries, Icon: Inbox, color: 'gold', tab: 'inquiries' },
        { label: 'Arşiv Eseri', value: stats.artifacts, Icon: Package, color: 'gold', tab: 'artifacts' },
        { label: 'Etkinlik', value: stats.events, Icon: Calendar, color: 'blue', tab: 'events' },
        { label: 'Mekan', value: stats.venues, Icon: Building2, color: 'green', tab: 'venue' },
        { label: 'Tarihçe Kaydı', value: stats.history, Icon: BookOpen, color: 'purple', tab: 'history' },
        { label: 'İstanbul Rum', value: stats.istanbulRum, Icon: Users, color: 'teal', tab: 'istanbul_rum' },
        { label: 'Kategori', value: stats.categories, Icon: FolderOpen, color: 'cyan', tab: 'categories' },
        { label: 'İçerik Bloğu', value: stats.content, Icon: FileText, color: 'orange', tab: 'content' },
        { label: 'Test Planı', value: stats.testPlans, Icon: CheckSquare, color: 'red', tab: 'test_plans' },
    ];

    const quickActions = [
        { label: 'Gelen Başvuruları Görüntüle', tab: 'inquiries', Icon: Inbox },
        { label: 'Hero Görselleri & Pan Yönetimi', tab: 'hero', Icon: ImageIcon },
        { label: 'Yeni Eser Ekle', tab: 'artifacts', Icon: Package },
        { label: 'Yeni Etkinlik Ekle', tab: 'events', Icon: Calendar },
        { label: 'Yeni Mekan Ekle', tab: 'venue', Icon: Building2 },
        { label: 'Yeni Tarihçe Kaydı', tab: 'history', Icon: Clock },
        { label: 'İçerik Düzenle', tab: 'content', Icon: FileText },
    ];

    const userEmail = session.user?.email ?? '';
    const userInitial = userEmail.charAt(0).toUpperCase();
    const currentPage = pageTitles[activeTab] ?? pageTitles.dashboard;

    return (
        <div className="admin-layout">
            {/* Sidebar */}
            <aside className="admin-sidebar">
                <div className="admin-sidebar-header">
                    <div className="admin-sidebar-logo">
                        <div className="admin-sidebar-logo-icon">G</div>
                        <div>
                            <h2>Galata CMS</h2>
                            <span>Yönetici Paneli</span>
                        </div>
                    </div>
                </div>

                <div className="admin-nav-section-label">Modüller</div>
                <nav className="admin-nav">
                    {tabs.map(({ id, label, Icon }) => (
                        <button
                            key={id}
                            className={`admin-nav-item ${activeTab === id ? 'active' : ''}`}
                            onClick={() => setActiveTab(id)}
                        >
                            <Icon size={17} />
                            {label}
                        </button>
                    ))}
                </nav>

                <div className="admin-sidebar-footer">
                    <button className="admin-nav-item text-danger" onClick={handleLogout}>
                        <LogOut size={17} /> Çıkış Yap
                    </button>
                </div>
            </aside>

            {/* Main */}
            <main className="admin-main">
                {/* Top Bar */}
                <header className="admin-topbar">
                    <div className="admin-topbar-left">
                        <h1>{currentPage.title}</h1>
                        <p>{currentPage.sub}</p>
                    </div>
                    <div className="admin-topbar-right">
                        <div className="admin-user-badge">
                            <div className="admin-user-avatar">{userInitial}</div>
                            {userEmail}
                        </div>
                    </div>
                </header>

                {/* Content */}
                <div className="admin-content-area">
                    {activeTab === 'dashboard' && (
                        <div className="admin-dashboard">
                            <div className="admin-dashboard-welcome">
                                <h2>Hoş Geldiniz 👋</h2>
                                <p>Galata İçerik Yönetim Sistemi'ne giriş yaptınız. Aşağıdan bir modül seçerek içerik yönetimine başlayabilirsiniz.</p>
                            </div>

                            {/* Stats */}
                            <div className="admin-stats-grid">
                                {statsCards.map(({ label, value, Icon, color, tab }) => (
                                    <div
                                        key={tab}
                                        className={`admin-stat-card ${color}`}
                                        onClick={() => navigateTo(tab)}
                                        style={{ cursor: 'pointer' }}
                                        title={`${label} modülüne git`}
                                    >
                                        <div className="admin-stat-icon"><Icon size={20} /></div>
                                        <div>
                                            <div className="admin-stat-label">{label}</div>
                                            <div className="admin-stat-value">{value}</div>
                                            <div className="admin-stat-sub">kayıt mevcut</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Quick Actions */}
                            <div className="admin-quick-actions">
                                <h3>Hızlı İşlemler</h3>
                                <div className="admin-quick-grid">
                                    {quickActions.map(({ label, tab, Icon }) => (
                                        <button
                                            key={tab}
                                            className="admin-quick-btn"
                                            onClick={() => navigateTo(tab)}
                                        >
                                            <div className="admin-quick-btn-icon"><Icon size={18} /></div>
                                            <div>
                                                <div className="admin-quick-btn-text">{label}</div>
                                            </div>
                                            <ArrowRight size={14} style={{ marginLeft: 'auto', color: 'var(--admin-text-muted)' }} />
                                        </button>
                                    ))}
                                    <button
                                        className="admin-quick-btn"
                                        onClick={() => navigateTo('artifacts')}
                                    >
                                        <div className="admin-quick-btn-icon"><Plus size={18} /></div>
                                        <div>
                                            <div className="admin-quick-btn-text">Tüm Modülleri Gör</div>
                                        </div>
                                        <ArrowRight size={14} style={{ marginLeft: 'auto', color: 'var(--admin-text-muted)' }} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    <Suspense fallback={<div className="admin-loading">Modül yükleniyor…</div>}>
                        {activeTab === 'inquiries' && <AdminInquiries />}
                        {activeTab === 'hero' && <AdminHero />}
                        {activeTab === 'artifacts' && <AdminArtifacts />}
                        {activeTab === 'events' && <AdminEvents />}
                        {activeTab === 'venue' && <AdminVenue />}
                        {activeTab === 'history' && <AdminHistory />}
                        {activeTab === 'istanbul_rum' && <AdminIstanbulRum />}
                        {activeTab === 'categories' && <AdminCategories />}
                        {activeTab === 'content' && <AdminContent />}
                        {activeTab === 'test_plans' && <AdminTestPlans sessionEmail={userEmail} />}
                    </Suspense>
                </div>
            </main>
        </div>
    );
}
