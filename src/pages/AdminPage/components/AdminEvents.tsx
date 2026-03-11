import { useState, useEffect } from 'react';
import { supabase } from '../../../services/supabaseClient';
import ImageUploader from './ImageUploader';
import DatePicker, { registerLocale } from 'react-datepicker';
import { tr } from 'date-fns/locale/tr';
import 'react-datepicker/dist/react-datepicker.css';

registerLocale('tr', tr);

const EVENT_CATEGORIES = [
    { key: 'sergi', tr: 'Sergi', en: 'Exhibition', el: 'Έκθεση' },
    { key: 'konser', tr: 'Konser', en: 'Concert', el: 'Συναυλία' },
    { key: 'konferans', tr: 'Konferans', en: 'Conference', el: 'Συνέδριο' },
    { key: 'performans', tr: 'Performans', en: 'Performance', el: 'Παράσταση' },
    { key: 'etkinlik', tr: 'Etkinlik', en: 'Event', el: 'Εκδήλωση' },
];

export default function AdminEvents() {
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState<'date' | 'title'>('date');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
    const [searchQuery, setSearchQuery] = useState('');

    // Form State
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState<string | null>(null);
    const [activeLangTab, setActiveLangTab] = useState<'tr' | 'en' | 'el'>('tr');
    const [formData, setFormData] = useState({
        cover_image_url: '',
        thumbnail_images: [] as string[],
        title_tr: '', title_en: '', title_el: '',
        type_tr: '', type_en: '', type_el: '',
        description_tr: '',
        event_date: '',
        status: 'draft'
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        const { data } = await supabase.from('past_events').select('*').order('event_date', { ascending: false });
        if (data) setEvents(data);
        setLoading(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const key = e.target.value;
        const cat = EVENT_CATEGORIES.find(c => c.key === key);
        if (cat) {
            setFormData(prev => ({ ...prev, type_tr: cat.tr, type_en: cat.en, type_el: cat.el }));
        } else {
            setFormData(prev => ({ ...prev, type_tr: '', type_en: '', type_el: '' }));
        }
    };

    const resetForm = () => {
        setIsEditing(false);
        setCurrentId(null);
        setFormData({
            cover_image_url: '',
            thumbnail_images: [],
            title_tr: '', title_en: '', title_el: '',
            type_tr: '', type_en: '', type_el: '',
            description_tr: '',
            event_date: '',
            status: 'draft'
        });
        setActiveLangTab('tr');
    };

    const slugify = (text: string) => {
        const map: Record<string, string> = {
            'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
            'Ç': 'c', 'Ğ': 'g', 'İ': 'i', 'Ö': 'o', 'Ş': 's', 'Ü': 'u'
        };
        let s = text;
        for (const [from, to] of Object.entries(map)) s = s.split(from).join(to);
        return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-')
            .replace(/^-|-$/g, '').substring(0, 100);
    };

    const editItem = (item: any) => {
        setIsEditing(true);
        setCurrentId(item.id);
        setFormData({
            cover_image_url: item.cover_image_url || '',
            thumbnail_images: item.thumbnail_images || [],
            title_tr: item.title_tr || '', title_en: item.title_en || '', title_el: item.title_el || '',
            type_tr: item.type_tr || '', type_en: item.type_en || '', type_el: item.type_el || '',
            description_tr: item.description_tr || '',
            event_date: item.event_date || '',
            status: item.status || 'draft'
        });
    };

    const saveItem = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.cover_image_url) {
            alert("HATA: Lütfen bir kapak görseli yükleyin (Zorunlu).");
            return;
        }
        if (!formData.title_tr.trim()) {
            alert("HATA: Lütfen etkinlik için Türkçe başlık giriniz (Zorunlu).");
            return;
        }
        if (!formData.event_date) {
            alert("HATA: Lütfen etkinlik tarihini seçiniz (Zorunlu).");
            return;
        }

        setLoading(true);

        try {
            const payload: any = { ...formData };
            // Auto-generate slug from title_tr if not editing
            if (!isEditing) {
                payload.slug = slugify(formData.title_tr);
            }

            if (isEditing && currentId) {
                const { error } = await supabase.from('past_events').update(payload).eq('id', currentId);
                if (error) throw error;
            } else {
                const { error } = await supabase.from('past_events').insert([payload]);
                if (error) throw error;
            }
            await fetchData();
            resetForm();
        } catch (error: any) {
            alert(`Etkinlik kaydedilemedi: ${error.message || 'Bilinmeyen hata.'}\nLütfen internet bağlantınızı ve bilgileri kontrol edip tekrar deneyin.`);
            setLoading(false);
        }
    };

    const deleteItem = async (id: string) => {
        if (window.confirm("Bu etkinliği silmek istediğinizden emin misiniz?")) {
            setLoading(true);
            await supabase.from('past_events').delete().eq('id', id);
            await fetchData();
        }
    };

    const addThumbnail = (url: string) => {
        if (url) {
            setFormData(prev => ({ ...prev, thumbnail_images: [...prev.thumbnail_images, url] }));
        }
    };

    const removeThumbnail = (index: number) => {
        setFormData(prev => {
            const newThumbs = [...prev.thumbnail_images];
            newThumbs.splice(index, 1);
            return { ...prev, thumbnail_images: newThumbs };
        });
    };

    // Sort & filter events
    const filteredEvents = events
        .filter(e => {
            if (!searchQuery.trim()) return true;
            const q = searchQuery.toLowerCase();
            return (e.title_tr || '').toLowerCase().includes(q) ||
                (e.type_tr || '').toLowerCase().includes(q);
        })
        .sort((a, b) => {
            if (sortBy === 'date') {
                const dA = a.event_date || '';
                const dB = b.event_date || '';
                return sortDirection === 'desc' ? dB.localeCompare(dA) : dA.localeCompare(dB);
            } else {
                const tA = (a.title_tr || '').toLowerCase();
                const tB = (b.title_tr || '').toLowerCase();
                return sortDirection === 'asc' ? tA.localeCompare(tB, 'tr') : tB.localeCompare(tA, 'tr');
            }
        });

    const toggleSort = (field: 'date' | 'title') => {
        if (sortBy === field) {
            setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortDirection(field === 'date' ? 'desc' : 'asc');
        }
    };

    if (loading && events.length === 0) return <div>Etkinlikler yükleniyor...</div>;

    return (
        <div className="admin-module">
            <div className="admin-module-header">
                <h2>Geçmiş Etkinlikler <span style={{ fontSize: '13px', fontWeight: 400, color: '#888' }}>({filteredEvents.length})</span></h2>
                {!isEditing && (
                    <button className="admin-btn-add" onClick={() => setIsEditing(true)}>
                        <span>+</span> Yeni Etkinlik Ekle
                    </button>
                )}
            </div>

            {/* Sorting & Search Toolbar */}
            {!isEditing && (
                <div className="admin-events-toolbar">
                    <div className="admin-sort-group">
                        <span className="admin-sort-label">Sırala:</span>
                        <button
                            className={`admin-sort-btn ${sortBy === 'date' ? 'active' : ''}`}
                            onClick={() => toggleSort('date')}
                        >
                            Tarih {sortBy === 'date' ? (sortDirection === 'desc' ? '↓' : '↑') : ''}
                        </button>
                        <button
                            className={`admin-sort-btn ${sortBy === 'title' ? 'active' : ''}`}
                            onClick={() => toggleSort('title')}
                        >
                            Başlık {sortBy === 'title' ? (sortDirection === 'asc' ? 'A→Z' : 'Z→A') : ''}
                        </button>
                    </div>
                    <div className="admin-search-box">
                        <input
                            type="text"
                            placeholder="Etkinlik ara..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                            <button className="admin-search-clear" onClick={() => setSearchQuery('')}>✕</button>
                        )}
                    </div>
                </div>
            )}

            {isEditing ? (
                <div className="admin-form-card">
                    <div className="admin-form-card-header">
                        <button type="button" className="admin-form-back-btn" onClick={resetForm}>←</button>
                        <h3>{currentId ? 'Etkinliği Düzenle' : 'Yeni Etkinlik'}</h3>
                    </div>
                    <form onSubmit={saveItem} className="admin-form">

                        <div className="admin-form-row">
                            <div className="admin-form-group">
                                <label>Etkinlik Tarihi</label>
                                <DatePicker
                                    selected={formData.event_date ? new Date(formData.event_date + 'T00:00:00') : null}
                                    onChange={(date: Date | null) => {
                                        if (date) {
                                            const yyyy = date.getFullYear();
                                            const mm = String(date.getMonth() + 1).padStart(2, '0');
                                            const dd = String(date.getDate()).padStart(2, '0');
                                            setFormData(prev => ({ ...prev, event_date: `${yyyy}-${mm}-${dd}` }));
                                        } else {
                                            setFormData(prev => ({ ...prev, event_date: '' }));
                                        }
                                    }}
                                    dateFormat="dd/MM/yyyy"
                                    locale="tr"
                                    placeholderText="Tarih seçin..."
                                    className="admin-datepicker-input"
                                    showMonthDropdown
                                    showYearDropdown
                                    dropdownMode="select"
                                    isClearable
                                    required
                                />
                            </div>
                            <div className="admin-form-group">
                                <label>Durum</label>
                                <select name="status" value={formData.status} onChange={handleInputChange}>
                                    <option value="draft">Taslak</option>
                                    <option value="published">Yayında</option>
                                </select>
                            </div>
                        </div>

                        <div className="admin-form-row">
                            <div className="admin-form-group">
                                <label>Kapak Görseli (Zorunlu)</label>
                                <ImageUploader
                                    value={formData.cover_image_url}
                                    onChange={(url) => setFormData({ ...formData, cover_image_url: url })}
                                    folderPath="events"
                                    maxWidth={1920}
                                />
                                <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '4px' }}>
                                    Yatay önerilir. Optimum: 1920x1080px
                                </p>
                            </div>
                        </div>

                        <div className="admin-form-group" style={{ marginTop: '20px' }}>
                            <label>Galeri Küçük Resimleri</label>
                            <p className="admin-field-hint">İsteğe bağlı, birden fazla eklenebilir. Etkinlik detay galerisinde görünür.</p>
                            {formData.thumbnail_images.length > 0 && (
                                <div className="admin-gallery-strip">
                                    {formData.thumbnail_images.map((imgUrl, i) => (
                                        <div key={i} className="admin-gallery-thumb-wrapper">
                                            <img src={imgUrl} alt={`thumb-${i}`} />
                                            <button type="button" className="admin-gallery-remove-btn" onClick={() => removeThumbnail(i)}>✕</button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div style={{ maxWidth: '280px' }}>
                                <ImageUploader
                                    value={""}
                                    onChange={(url) => addThumbnail(url)}
                                    folderPath="events"
                                    maxWidth={1280}
                                />
                            </div>
                        </div>

                        {/* EVENT CATEGORY DROPDOWN */}
                        <div className="admin-form-group" style={{ marginTop: '20px' }}>
                            <label>Etkinlik Türü / Event Type</label>
                            <select
                                value={EVENT_CATEGORIES.find(c => c.tr === formData.type_tr)?.key || ''}
                                onChange={handleCategoryChange}
                            >
                                <option value="">— Tür Seçin / Select Type —</option>
                                {EVENT_CATEGORIES.map(cat => (
                                    <option key={cat.key} value={cat.key}>
                                        {cat.tr} / {cat.en}
                                    </option>
                                ))}
                            </select>
                            {formData.type_tr && (
                                <p style={{ fontSize: '0.8rem', color: '#888', marginTop: '4px' }}>
                                    TR: {formData.type_tr} · EN: {formData.type_en} · EL: {formData.type_el}
                                </p>
                            )}
                        </div>

                        {/* TRILINGUAL TABS */}
                        <div className="admin-lang-tabs" style={{ marginTop: '30px' }}>
                            <button type="button" className={`lang-tab ${activeLangTab === 'tr' ? 'active' : ''}`} onClick={() => setActiveLangTab('tr')}>TR</button>
                            <button type="button" className={`lang-tab ${activeLangTab === 'en' ? 'active' : ''}`} onClick={() => setActiveLangTab('en')}>EN</button>
                            <button type="button" className={`lang-tab ${activeLangTab === 'el' ? 'active' : ''}`} onClick={() => setActiveLangTab('el')}>EL</button>
                        </div>

                        <div className="admin-lang-content">
                            <div className="admin-form-group">
                                <label>Etkinlik Başlığı ({activeLangTab.toUpperCase()})</label>
                                <input
                                    type="text"
                                    name={`title_${activeLangTab}`}
                                    value={formData[`title_${activeLangTab}` as keyof typeof formData]}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            {activeLangTab === 'tr' && (
                                <div className="admin-form-group">
                                    <label>Açıklama (TR)</label>
                                    <textarea
                                        name="description_tr"
                                        value={formData.description_tr}
                                        onChange={handleInputChange}
                                        rows={6}
                                        placeholder="Etkinlik hakkında detaylı açıklama..."
                                        style={{ resize: 'vertical', minHeight: '120px' }}
                                    />
                                </div>
                            )}
                        </div>

                        <div className="admin-form-actions">
                            <button type="button" className="admin-btn-secondary" onClick={resetForm}>İptal</button>
                            <button type="submit" className="admin-btn-primary">Etkinliği Kaydet</button>
                        </div>
                    </form>
                </div >
            ) : (
                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Kapak</th>
                                <th>Başlık (TR)</th>
                                <th>Tarih</th>
                                <th>Durum</th>
                                <th>İşlemler</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEvents.length === 0 ? (
                                <tr className="admin-empty-row"><td colSpan={5}>{searchQuery ? 'Arama sonucu bulunamadı.' : 'Henüz hiç etkinlik eklenmemiş.'}</td></tr>
                            ) : (
                                filteredEvents.map(event => (
                                    <tr key={event.id}>
                                        <td>
                                            {event.cover_image_url ? (
                                                <img src={event.cover_image_url} alt="cover" className="admin-thumb" />
                                            ) : (
                                                <div className="admin-thumb-placeholder">Görsel Yok</div>
                                            )}
                                        </td>
                                        <td>{event.title_tr}</td>
                                        <td>{event.event_date ? new Date(event.event_date).toLocaleDateString('tr-TR') : '-'}</td>
                                        <td>
                                            <span className={`admin-badge ${event.status === 'published' ? 'badge-success' : 'badge-draft'}`}>
                                                {event.status === 'published' ? 'Yayında' : 'Taslak'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="admin-table-actions">
                                                <button className="admin-btn-icon" onClick={() => editItem(event)}>Düzenle</button>
                                                <button className="admin-btn-icon text-danger" onClick={() => deleteItem(event.id)}>Sil</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )
            }
        </div >
    );
}
