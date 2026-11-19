import { useState, useEffect } from 'react';
import { supabase } from '../../../services/supabaseClient';
import {
    Mail,
    Phone,
    Building2,
    Calendar,
    Users,
    FileText,
    Download,
    RefreshCw,
    Trash2,
    ExternalLink,
    CheckCircle2,
    Clock,
    Archive as ArchiveIcon,
    Inbox,
} from 'lucide-react';

type InquiryTab = 'venue' | 'archive' | 'newsletter';

interface VenueInquiryRow {
    id: string;
    created_at: string;
    status: 'new' | 'in_review' | 'responded' | 'archived';
    full_name: string;
    email: string;
    phone: string;
    company: string | null;
    event_type: string | null;
    guest_count: string | null;
    preferred_levels: string[];
    proposed_date: string | null;
    alternative_dates: string | null;
    tech_requirements: string[];
    message: string | null;
    locale: string;
}

interface ArchiveInquiryRow {
    id: string;
    created_at: string;
    status: 'new' | 'in_review' | 'approved' | 'archived';
    artifact_id: string;
    artifact_title: string;
    collection_no: string | null;
    full_name: string;
    email: string;
    institution: string | null;
    message: string;
    locale: string;
}

interface NewsletterSubscriberRow {
    id: string;
    created_at: string;
    email: string;
    locale: string;
    status: 'pending_confirmation' | 'active' | 'unsubscribed';
    unsubscribed_at: string | null;
}

const VENUE_STATUS_LABELS: Record<VenueInquiryRow['status'], { label: string; bg: string; color: string }> = {
    new: { label: 'Yeni', bg: '#fef3c7', color: '#92400e' },
    in_review: { label: 'İnceleniyor', bg: '#dbeafe', color: '#1e40af' },
    responded: { label: 'Yanıtlandı', bg: '#d1fae5', color: '#065f46' },
    archived: { label: 'Arşivlendi', bg: '#f3f4f6', color: '#4b5563' },
};

const ARCHIVE_STATUS_LABELS: Record<ArchiveInquiryRow['status'], { label: string; bg: string; color: string }> = {
    new: { label: 'Yeni', bg: '#fef3c7', color: '#92400e' },
    in_review: { label: 'İnceleniyor', bg: '#dbeafe', color: '#1e40af' },
    approved: { label: 'Onaylandı / Yanıtlandı', bg: '#d1fae5', color: '#065f46' },
    archived: { label: 'Arşivlendi', bg: '#f3f4f6', color: '#4b5563' },
};

const NEWSLETTER_STATUS_LABELS: Record<NewsletterSubscriberRow['status'], { label: string; bg: string; color: string }> = {
    pending_confirmation: { label: 'Kayıtlı (Onaylı)', bg: '#dbeafe', color: '#1e40af' },
    active: { label: 'Aktif', bg: '#d1fae5', color: '#065f46' },
    unsubscribed: { label: 'Ayrıldı', bg: '#fee2e2', color: '#991b1b' },
};

const LEVEL_NAMES: Record<string, string> = {
    level1: 'Kat 1 — Çok Amaçlı Büyük Salon & Fuaye',
    level2: 'Kat 2 — 3 Sergi Salonu, Fuaye & Balkon',
    level3: 'Kat 3 — 9 Sergi Salonu & Fuaye',
    level4: 'Tüm Etkinlik Katları (Kat 1, 2 ve 3 — 1.060 m²)',
};

export default function AdminInquiries() {
    const [activeSection, setActiveSection] = useState<InquiryTab>('venue');
    const [venueRows, setVenueRows] = useState<VenueInquiryRow[]>([]);
    const [archiveRows, setArchiveRows] = useState<ArchiveInquiryRow[]>([]);
    const [newsletterRows, setNewsletterRows] = useState<NewsletterSubscriberRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');

    const fetchAll = async () => {
        setLoading(true);
        const [vRes, aRes, nRes] = await Promise.all([
            supabase.from('venue_inquiries').select('*').order('created_at', { ascending: false }),
            supabase.from('archive_inquiries').select('*').order('created_at', { ascending: false }),
            supabase.from('newsletter_subscribers').select('*').order('created_at', { ascending: false }),
        ]);

        if (vRes.data) setVenueRows(vRes.data as VenueInquiryRow[]);
        if (aRes.data) setArchiveRows(aRes.data as ArchiveInquiryRow[]);
        if (nRes.data) setNewsletterRows(nRes.data as NewsletterSubscriberRow[]);
        setLoading(false);
    };

    useEffect(() => {
        fetchAll();
    }, []);

    const updateVenueStatus = async (id: string, status: VenueInquiryRow['status']) => {
        const { error } = await supabase.from('venue_inquiries').update({ status }).eq('id', id);
        if (error) {
            alert(`Durum güncellenemedi: ${error.message}`);
            return;
        }
        setVenueRows(prev => prev.map(r => (r.id === id ? { ...r, status } : r)));
    };

    const updateArchiveStatus = async (id: string, status: ArchiveInquiryRow['status']) => {
        const { error } = await supabase.from('archive_inquiries').update({ status }).eq('id', id);
        if (error) {
            alert(`Durum güncellenemedi: ${error.message}`);
            return;
        }
        setArchiveRows(prev => prev.map(r => (r.id === id ? { ...r, status } : r)));
    };

    const updateNewsletterStatus = async (id: string, status: NewsletterSubscriberRow['status']) => {
        const { error } = await supabase.from('newsletter_subscribers').update({ status }).eq('id', id);
        if (error) {
            alert(`Durum güncellenemedi: ${error.message}`);
            return;
        }
        setNewsletterRows(prev => prev.map(r => (r.id === id ? { ...r, status } : r)));
    };

    const deleteRow = async (table: 'venue_inquiries' | 'archive_inquiries' | 'newsletter_subscribers', id: string) => {
        if (!window.confirm('Bu kaydı kalıcı olarak silmek istediğinizden emin misiniz?')) return;
        const { error } = await supabase.from(table).delete().eq('id', id);
        if (error) {
            alert(`Kayıt silinemedi: ${error.message}`);
            return;
        }
        if (table === 'venue_inquiries') setVenueRows(prev => prev.filter(r => r.id !== id));
        if (table === 'archive_inquiries') setArchiveRows(prev => prev.filter(r => r.id !== id));
        if (table === 'newsletter_subscribers') setNewsletterRows(prev => prev.filter(r => r.id !== id));
    };

    const formatDateTime = (iso: string) => {
        try {
            return new Date(iso).toLocaleString('tr-TR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            });
        } catch {
            return iso;
        }
    };

    const exportCsv = () => {
        const escapeCsv = (val: unknown) => {
            const s = val == null ? '' : Array.isArray(val) ? val.join('; ') : String(val);
            return `"${s.replace(/"/g, '""')}"`;
        };

        let headers: string[] = [];
        let rows: string[][] = [];
        let filename = 'galata-basvurular.csv';

        if (activeSection === 'venue') {
            filename = `mekan-kiralama-talepleri-${new Date().toISOString().slice(0, 10)}.csv`;
            headers = [
                'Tarih',
                'Durum',
                'Ad Soyad',
                'Kurum',
                'E-posta',
                'Telefon',
                'Etkinlik Türü',
                'Katılımcı Sayısı',
                'Katlar',
                'Planlanan Tarih',
                'Alternatif Tarihler',
                'Teknik Gereksinimler',
                'Mesaj',
                'Dil',
            ];
            rows = venueRows.map(r => [
                formatDateTime(r.created_at),
                VENUE_STATUS_LABELS[r.status]?.label || r.status,
                r.full_name,
                r.company || '',
                r.email,
                r.phone,
                r.event_type || '',
                r.guest_count || '',
                (r.preferred_levels || []).map(l => LEVEL_NAMES[l] || l).join(' | '),
                r.proposed_date || '',
                r.alternative_dates || '',
                (r.tech_requirements || []).join(' | '),
                r.message || '',
                r.locale.toUpperCase(),
            ]);
        } else if (activeSection === 'archive') {
            filename = `arsiv-inceleme-talepleri-${new Date().toISOString().slice(0, 10)}.csv`;
            headers = ['Tarih', 'Durum', 'Eser Adı', 'Koleksiyon No', 'Ad Soyad', 'Kurum / Üniversite', 'E-posta', 'Mesaj', 'Dil'];
            rows = archiveRows.map(r => [
                formatDateTime(r.created_at),
                ARCHIVE_STATUS_LABELS[r.status]?.label || r.status,
                r.artifact_title,
                r.collection_no || r.artifact_id,
                r.full_name,
                r.institution || '',
                r.email,
                r.message,
                r.locale.toUpperCase(),
            ]);
        } else {
            filename = `ebulten-aboneleri-${new Date().toISOString().slice(0, 10)}.csv`;
            headers = ['Tarih', 'Durum', 'E-posta', 'Dil'];
            rows = newsletterRows.map(r => [
                formatDateTime(r.created_at),
                NEWSLETTER_STATUS_LABELS[r.status]?.label || r.status,
                r.email,
                r.locale.toUpperCase(),
            ]);
        }

        const csvContent = '\uFEFF' + [headers.map(escapeCsv).join(','), ...rows.map(r => r.map(escapeCsv).join(','))].join('\r\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
    };

    const q = searchQuery.trim().toLowerCase();

    const filteredVenue = venueRows.filter(r => {
        if (statusFilter !== 'all' && r.status !== statusFilter) return false;
        if (!q) return true;
        return (
            r.full_name.toLowerCase().includes(q) ||
            r.email.toLowerCase().includes(q) ||
            r.phone.toLowerCase().includes(q) ||
            (r.company || '').toLowerCase().includes(q) ||
            (r.event_type || '').toLowerCase().includes(q) ||
            (r.message || '').toLowerCase().includes(q)
        );
    });

    const filteredArchive = archiveRows.filter(r => {
        if (statusFilter !== 'all' && r.status !== statusFilter) return false;
        if (!q) return true;
        return (
            r.full_name.toLowerCase().includes(q) ||
            r.email.toLowerCase().includes(q) ||
            r.artifact_title.toLowerCase().includes(q) ||
            (r.institution || '').toLowerCase().includes(q) ||
            r.message.toLowerCase().includes(q)
        );
    });

    const filteredNewsletter = newsletterRows.filter(r => {
        if (statusFilter !== 'all' && r.status !== statusFilter) return false;
        if (!q) return true;
        return r.email.toLowerCase().includes(q);
    });

    const newVenueCount = venueRows.filter(r => r.status === 'new').length;
    const newArchiveCount = archiveRows.filter(r => r.status === 'new').length;

    return (
        <div className="admin-module">
            {/* Header & Sub-tabs */}
            <div className="admin-module-header" style={{ flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button
                        type="button"
                        className={`admin-sort-btn ${activeSection === 'venue' ? 'active' : ''}`}
                        onClick={() => {
                            setActiveSection('venue');
                            setStatusFilter('all');
                        }}
                        style={{ padding: '8px 16px', fontSize: '13px' }}
                    >
                        <Building2 size={15} />
                        Mekan Kiralama & İletişim ({venueRows.length})
                        {newVenueCount > 0 && (
                            <span
                                style={{
                                    marginLeft: '6px',
                                    background: '#d97706',
                                    color: '#fff',
                                    borderRadius: '999px',
                                    padding: '1px 7px',
                                    fontSize: '11px',
                                    fontWeight: 700,
                                }}
                            >
                                {newVenueCount} yeni
                            </span>
                        )}
                    </button>

                    <button
                        type="button"
                        className={`admin-sort-btn ${activeSection === 'archive' ? 'active' : ''}`}
                        onClick={() => {
                            setActiveSection('archive');
                            setStatusFilter('all');
                        }}
                        style={{ padding: '8px 16px', fontSize: '13px' }}
                    >
                        <FileText size={15} />
                        Arşiv İnceleme Talepleri ({archiveRows.length})
                        {newArchiveCount > 0 && (
                            <span
                                style={{
                                    marginLeft: '6px',
                                    background: '#d97706',
                                    color: '#fff',
                                    borderRadius: '999px',
                                    padding: '1px 7px',
                                    fontSize: '11px',
                                    fontWeight: 700,
                                }}
                            >
                                {newArchiveCount} yeni
                            </span>
                        )}
                    </button>

                    <button
                        type="button"
                        className={`admin-sort-btn ${activeSection === 'newsletter' ? 'active' : ''}`}
                        onClick={() => {
                            setActiveSection('newsletter');
                            setStatusFilter('all');
                        }}
                        style={{ padding: '8px 16px', fontSize: '13px' }}
                    >
                        <Mail size={15} />
                        E-Bülten Aboneleri ({newsletterRows.length})
                    </button>
                </div>

                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button type="button" className="admin-sort-btn" onClick={fetchAll} title="Listeyi Yenile">
                        <RefreshCw size={14} /> Yenile
                    </button>
                    <button type="button" className="admin-btn-add" onClick={exportCsv}>
                        <Download size={15} /> Excel / CSV İndir
                    </button>
                </div>
            </div>

            {/* Filter & Search Toolbar */}
            <div className="admin-events-toolbar">
                <div className="admin-sort-group" style={{ flexWrap: 'wrap' }}>
                    <span className="admin-sort-label">Durum Filtresi:</span>
                    <button
                        type="button"
                        className={`admin-sort-btn ${statusFilter === 'all' ? 'active' : ''}`}
                        onClick={() => setStatusFilter('all')}
                    >
                        Tümü
                    </button>
                    {activeSection !== 'newsletter' ? (
                        <>
                            <button
                                type="button"
                                className={`admin-sort-btn ${statusFilter === 'new' ? 'active' : ''}`}
                                onClick={() => setStatusFilter('new')}
                            >
                                <Clock size={13} /> Yeni
                            </button>
                            <button
                                type="button"
                                className={`admin-sort-btn ${statusFilter === 'in_review' ? 'active' : ''}`}
                                onClick={() => setStatusFilter('in_review')}
                            >
                                İnceleniyor
                            </button>
                            <button
                                type="button"
                                className={`admin-sort-btn ${
                                    statusFilter === (activeSection === 'venue' ? 'responded' : 'approved') ? 'active' : ''
                                }`}
                                onClick={() => setStatusFilter(activeSection === 'venue' ? 'responded' : 'approved')}
                            >
                                <CheckCircle2 size={13} /> Yanıtlandı
                            </button>
                            <button
                                type="button"
                                className={`admin-sort-btn ${statusFilter === 'archived' ? 'active' : ''}`}
                                onClick={() => setStatusFilter('archived')}
                            >
                                <ArchiveIcon size={13} /> Arşivlendi
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                type="button"
                                className={`admin-sort-btn ${statusFilter === 'pending_confirmation' ? 'active' : ''}`}
                                onClick={() => setStatusFilter('pending_confirmation')}
                            >
                                Kayıtlı
                            </button>
                            <button
                                type="button"
                                className={`admin-sort-btn ${statusFilter === 'active' ? 'active' : ''}`}
                                onClick={() => setStatusFilter('active')}
                            >
                                Aktif
                            </button>
                            <button
                                type="button"
                                className={`admin-sort-btn ${statusFilter === 'unsubscribed' ? 'active' : ''}`}
                                onClick={() => setStatusFilter('unsubscribed')}
                            >
                                Ayrıldı
                            </button>
                        </>
                    )}
                </div>

                <div className="admin-search-box">
                    <input
                        type="text"
                        placeholder="İsim, kurum, e-posta veya mesaj ara…"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Content List */}
            <div style={{ padding: '24px 28px' }}>
                {loading ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>Başvurular yükleniyor…</div>
                ) : activeSection === 'venue' ? (
                    filteredVenue.length === 0 ? (
                        <div style={{ padding: '48px 20px', textAlign: 'center', color: '#6b7280' }}>
                            <Inbox size={36} style={{ marginBottom: '10px', opacity: 0.5 }} />
                            <p style={{ margin: 0, fontWeight: 600 }}>Henüz mekan kiralama veya iletişim başvurusu bulunmuyor.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {filteredVenue.map(item => {
                                const badge = VENUE_STATUS_LABELS[item.status] || VENUE_STATUS_LABELS.new;
                                const replySubject = encodeURIComponent(
                                    `Re: Galata Rum Okulu — Mekan Kiralama / Etkinlik Talebiniz (${item.event_type || 'Başvuru'})`
                                );
                                const replyBody = encodeURIComponent(
                                    `Sayın ${item.full_name},\n\nGalata Rum Okulu Vakfı - Kültür Merkezi'ne ilettiğiniz mekan kiralama / etkinlik talebiniz için teşekkür ederiz.\n\n`
                                );
                                return (
                                    <div
                                        key={item.id}
                                        style={{
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '10px',
                                            padding: '20px',
                                            background: item.status === 'new' ? '#fffdf9' : '#fff',
                                            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'flex-start',
                                                flexWrap: 'wrap',
                                                gap: '12px',
                                                marginBottom: '14px',
                                                paddingBottom: '12px',
                                                borderBottom: '1px solid #f3f4f6',
                                            }}
                                        >
                                            <div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                                                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#111827' }}>
                                                        {item.full_name}
                                                    </h3>
                                                    {item.company && (
                                                        <span
                                                            style={{
                                                                fontSize: '13px',
                                                                fontWeight: 600,
                                                                color: '#4b5563',
                                                                background: '#f3f4f6',
                                                                padding: '2px 10px',
                                                                borderRadius: '6px',
                                                            }}
                                                        >
                                                            {item.company}
                                                        </span>
                                                    )}
                                                    <span
                                                        style={{
                                                            fontSize: '12px',
                                                            fontWeight: 700,
                                                            background: badge.bg,
                                                            color: badge.color,
                                                            padding: '3px 10px',
                                                            borderRadius: '999px',
                                                        }}
                                                    >
                                                        {badge.label}
                                                    </span>
                                                    <span
                                                        style={{
                                                            fontSize: '11px',
                                                            fontWeight: 700,
                                                            color: '#6b7280',
                                                            border: '1px solid #e5e7eb',
                                                            padding: '2px 7px',
                                                            borderRadius: '4px',
                                                        }}
                                                    >
                                                        {item.locale.toUpperCase()}
                                                    </span>
                                                </div>
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        gap: '16px',
                                                        flexWrap: 'wrap',
                                                        marginTop: '8px',
                                                        fontSize: '13px',
                                                        color: '#4b5563',
                                                    }}
                                                >
                                                    <a
                                                        href={`mailto:${item.email}`}
                                                        style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: '#1d4ed8' }}
                                                    >
                                                        <Mail size={14} /> {item.email}
                                                    </a>
                                                    <a
                                                        href={`tel:${item.phone}`}
                                                        style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: '#111827' }}
                                                    >
                                                        <Phone size={14} /> {item.phone}
                                                    </a>
                                                    <span style={{ color: '#6b7280' }}>Gönderim: {formatDateTime(item.created_at)}</span>
                                                </div>
                                            </div>

                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                                <select
                                                    value={item.status}
                                                    onChange={e => updateVenueStatus(item.id, e.target.value as VenueInquiryRow['status'])}
                                                    aria-label="Başvuru durumu"
                                                    style={{
                                                        padding: '6px 10px',
                                                        borderRadius: '6px',
                                                        border: '1px solid #d1d5db',
                                                        fontSize: '12.5px',
                                                        fontWeight: 600,
                                                        background: '#fff',
                                                    }}
                                                >
                                                    <option value="new">Yeni</option>
                                                    <option value="in_review">İnceleniyor</option>
                                                    <option value="responded">Yanıtlandı</option>
                                                    <option value="archived">Arşivlendi</option>
                                                </select>

                                                <a
                                                    href={`mailto:${item.email}?subject=${replySubject}&body=${replyBody}`}
                                                    className="admin-sort-btn"
                                                    style={{ textDecoration: 'none', background: '#111827', color: '#fff', borderColor: '#111827' }}
                                                >
                                                    <Mail size={13} /> Yanıtla
                                                </a>

                                                <button
                                                    type="button"
                                                    className="admin-sort-btn"
                                                    onClick={() => deleteRow('venue_inquiries', item.id)}
                                                    style={{ color: '#dc2626', borderColor: '#fecaca' }}
                                                    title="Kaydı Sil"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Details Grid */}
                                        <div
                                            style={{
                                                display: 'grid',
                                                gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
                                                gap: '12px',
                                                background: '#f9fafb',
                                                padding: '14px',
                                                borderRadius: '8px',
                                                fontSize: '13px',
                                            }}
                                        >
                                            <div>
                                                <strong style={{ color: '#6b7280', display: 'block', fontSize: '11.5px' }}>ETKİNLİK TÜRÜ</strong>
                                                <span>{item.event_type || '—'}</span>
                                            </div>
                                            <div>
                                                <strong style={{ color: '#6b7280', display: 'block', fontSize: '11.5px' }}>
                                                    <Users size={12} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                                                    KATILIMCI SAYISI
                                                </strong>
                                                <span>{item.guest_count || '—'}</span>
                                            </div>
                                            <div>
                                                <strong style={{ color: '#6b7280', display: 'block', fontSize: '11.5px' }}>
                                                    <Calendar size={12} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                                                    PLANLANAN TARİH
                                                </strong>
                                                <span>
                                                    {item.proposed_date || '—'}
                                                    {item.alternative_dates ? ` (Alternatif: ${item.alternative_dates})` : ''}
                                                </span>
                                            </div>
                                            <div>
                                                <strong style={{ color: '#6b7280', display: 'block', fontSize: '11.5px' }}>TERCİH EDİLEN KATLAR</strong>
                                                <span>
                                                    {(item.preferred_levels || []).length > 0
                                                        ? item.preferred_levels.map(l => LEVEL_NAMES[l] || l).join(', ')
                                                        : '—'}
                                                </span>
                                            </div>
                                            {(item.tech_requirements || []).length > 0 && (
                                                <div style={{ gridColumn: '1 / -1' }}>
                                                    <strong style={{ color: '#6b7280', display: 'block', fontSize: '11.5px' }}>
                                                        TEKNİK GEREKSİNİMLER
                                                    </strong>
                                                    <span>{item.tech_requirements.join(', ')}</span>
                                                </div>
                                            )}
                                        </div>

                                        {item.message && (
                                            <div
                                                style={{
                                                    marginTop: '12px',
                                                    padding: '12px 14px',
                                                    background: '#fff',
                                                    border: '1px solid #e5e7eb',
                                                    borderRadius: '8px',
                                                    fontSize: '13.5px',
                                                    lineHeight: 1.55,
                                                    color: '#1f2937',
                                                    whiteSpace: 'pre-wrap',
                                                }}
                                            >
                                                <strong style={{ display: 'block', fontSize: '11.5px', color: '#6b7280', marginBottom: '4px' }}>
                                                    PROJE DETAYLARI & MESAJ:
                                                </strong>
                                                {item.message}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )
                ) : activeSection === 'archive' ? (
                    filteredArchive.length === 0 ? (
                        <div style={{ padding: '48px 20px', textAlign: 'center', color: '#6b7280' }}>
                            <Inbox size={36} style={{ marginBottom: '10px', opacity: 0.5 }} />
                            <p style={{ margin: 0, fontWeight: 600 }}>Henüz arşiv inceleme başvurusu bulunmuyor.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {filteredArchive.map(item => {
                                const badge = ARCHIVE_STATUS_LABELS[item.status] || ARCHIVE_STATUS_LABELS.new;
                                const replySubject = encodeURIComponent(
                                    `Re: Galata Rum Okulu Dijital Arşivi — İnceleme Talebiniz (${item.artifact_title})`
                                );
                                return (
                                    <div
                                        key={item.id}
                                        style={{
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '10px',
                                            padding: '20px',
                                            background: item.status === 'new' ? '#fffdf9' : '#fff',
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'flex-start',
                                                flexWrap: 'wrap',
                                                gap: '12px',
                                                marginBottom: '12px',
                                            }}
                                        >
                                            <div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                                                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>{item.full_name}</h3>
                                                    {item.institution && (
                                                        <span
                                                            style={{
                                                                fontSize: '13px',
                                                                fontWeight: 600,
                                                                color: '#4b5563',
                                                                background: '#f3f4f6',
                                                                padding: '2px 10px',
                                                                borderRadius: '6px',
                                                            }}
                                                        >
                                                            {item.institution}
                                                        </span>
                                                    )}
                                                    <span
                                                        style={{
                                                            fontSize: '12px',
                                                            fontWeight: 700,
                                                            background: badge.bg,
                                                            color: badge.color,
                                                            padding: '3px 10px',
                                                            borderRadius: '999px',
                                                        }}
                                                    >
                                                        {badge.label}
                                                    </span>
                                                </div>
                                                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '6px', fontSize: '13px' }}>
                                                    <a href={`mailto:${item.email}`} style={{ color: '#1d4ed8' }}>
                                                        {item.email}
                                                    </a>
                                                    <span style={{ color: '#6b7280' }}>{formatDateTime(item.created_at)}</span>
                                                </div>
                                            </div>

                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <select
                                                    value={item.status}
                                                    onChange={e => updateArchiveStatus(item.id, e.target.value as ArchiveInquiryRow['status'])}
                                                    aria-label="Arşiv talep durumu"
                                                    style={{
                                                        padding: '6px 10px',
                                                        borderRadius: '6px',
                                                        border: '1px solid #d1d5db',
                                                        fontSize: '12.5px',
                                                        fontWeight: 600,
                                                    }}
                                                >
                                                    <option value="new">Yeni</option>
                                                    <option value="in_review">İnceleniyor</option>
                                                    <option value="approved">Onaylandı / Yanıtlandı</option>
                                                    <option value="archived">Arşivlendi</option>
                                                </select>

                                                <a
                                                    href={`mailto:${item.email}?subject=${replySubject}`}
                                                    className="admin-sort-btn"
                                                    style={{ textDecoration: 'none', background: '#111827', color: '#fff', borderColor: '#111827' }}
                                                >
                                                    <Mail size={13} /> Yanıtla
                                                </a>

                                                <button
                                                    type="button"
                                                    className="admin-sort-btn"
                                                    onClick={() => deleteRow('archive_inquiries', item.id)}
                                                    style={{ color: '#dc2626', borderColor: '#fecaca' }}
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>

                                        <div
                                            style={{
                                                padding: '10px 14px',
                                                background: '#f9fafb',
                                                borderRadius: '8px',
                                                fontSize: '13px',
                                                marginBottom: '10px',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                flexWrap: 'wrap',
                                                gap: '8px',
                                            }}
                                        >
                                            <div>
                                                <strong>Talep Edilen Eser:</strong> {item.artifact_title}{' '}
                                                {item.collection_no ? `(${item.collection_no})` : ''}
                                            </div>
                                            <a
                                                href={`/arsiv/eser/${item.artifact_id}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#1d4ed8', fontWeight: 600 }}
                                            >
                                                Eseri Görüntüle <ExternalLink size={13} />
                                            </a>
                                        </div>

                                        <div
                                            style={{
                                                padding: '12px 14px',
                                                border: '1px solid #e5e7eb',
                                                borderRadius: '8px',
                                                fontSize: '13.5px',
                                                whiteSpace: 'pre-wrap',
                                            }}
                                        >
                                            <strong style={{ display: 'block', fontSize: '11.5px', color: '#6b7280', marginBottom: '4px' }}>
                                                ARAŞTIRMA AMACI & MESAJ:
                                            </strong>
                                            {item.message}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )
                ) : filteredNewsletter.length === 0 ? (
                    <div style={{ padding: '48px 20px', textAlign: 'center', color: '#6b7280' }}>
                        <Inbox size={36} style={{ marginBottom: '10px', opacity: 0.5 }} />
                        <p style={{ margin: 0, fontWeight: 600 }}>Henüz e-bülten abonesi bulunmuyor.</p>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13.5px' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid #e5e7eb', textAlign: 'left', color: '#6b7280', fontSize: '12px' }}>
                                    <th style={{ padding: '10px 12px' }}>E-POSTA ADRESİ</th>
                                    <th style={{ padding: '10px 12px' }}>DİL</th>
                                    <th style={{ padding: '10px 12px' }}>KAYIT TARİHİ</th>
                                    <th style={{ padding: '10px 12px' }}>DURUM</th>
                                    <th style={{ padding: '10px 12px', textAlign: 'right' }}>İŞLEM</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredNewsletter.map(item => {
                                    const badge = NEWSLETTER_STATUS_LABELS[item.status] || NEWSLETTER_STATUS_LABELS.pending_confirmation;
                                    return (
                                        <tr key={item.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                            <td style={{ padding: '12px', fontWeight: 600 }}>
                                                <a href={`mailto:${item.email}`} style={{ color: '#111827', textDecoration: 'none' }}>
                                                    {item.email}
                                                </a>
                                            </td>
                                            <td style={{ padding: '12px' }}>{item.locale.toUpperCase()}</td>
                                            <td style={{ padding: '12px', color: '#6b7280' }}>{formatDateTime(item.created_at)}</td>
                                            <td style={{ padding: '12px' }}>
                                                <select
                                                    value={item.status}
                                                    onChange={e =>
                                                        updateNewsletterStatus(item.id, e.target.value as NewsletterSubscriberRow['status'])
                                                    }
                                                    aria-label="Abone durumu"
                                                    style={{
                                                        padding: '4px 8px',
                                                        borderRadius: '6px',
                                                        border: '1px solid #d1d5db',
                                                        fontSize: '12px',
                                                        fontWeight: 600,
                                                        background: badge.bg,
                                                        color: badge.color,
                                                    }}
                                                >
                                                    <option value="pending_confirmation">Kayıtlı (Onaylı)</option>
                                                    <option value="active">Aktif</option>
                                                    <option value="unsubscribed">Ayrıldı</option>
                                                </select>
                                            </td>
                                            <td style={{ padding: '12px', textAlign: 'right' }}>
                                                <button
                                                    type="button"
                                                    className="admin-sort-btn"
                                                    onClick={() => deleteRow('newsletter_subscribers', item.id)}
                                                    style={{ color: '#dc2626', borderColor: '#fecaca' }}
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
