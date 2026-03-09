import { useState, useEffect } from 'react';
import { supabase } from '../../../services/supabaseClient';
import ImageUploader from './ImageUploader';

export default function AdminEvents() {
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Form State
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState<string | null>(null);
    const [activeLangTab, setActiveLangTab] = useState<'tr' | 'en' | 'el'>('tr');
    const [formData, setFormData] = useState({
        cover_image_url: '',
        thumbnail_images: [] as string[],
        title_tr: '', title_en: '', title_el: '',
        type_tr: '', type_en: '', type_el: '',
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

    const resetForm = () => {
        setIsEditing(false);
        setCurrentId(null);
        setFormData({
            cover_image_url: '',
            thumbnail_images: [],
            title_tr: '', title_en: '', title_el: '',
            type_tr: '', type_en: '', type_el: '',
            event_date: '',
            status: 'draft'
        });
        setActiveLangTab('tr');
    };

    const editItem = (item: any) => {
        setIsEditing(true);
        setCurrentId(item.id);
        setFormData({
            cover_image_url: item.cover_image_url || '',
            thumbnail_images: item.thumbnail_images || [],
            title_tr: item.title_tr || '', title_en: item.title_en || '', title_el: item.title_el || '',
            type_tr: item.type_tr || '', type_en: item.type_en || '', type_el: item.type_el || '',
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
            if (isEditing && currentId) {
                const { error } = await supabase.from('past_events').update(formData).eq('id', currentId);
                if (error) throw error;
            } else {
                const { error } = await supabase.from('past_events').insert([formData]);
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

    if (loading && events.length === 0) return <div>Etkinlikler yükleniyor...</div>;

    return (
        <div className="admin-module">
            <div className="admin-module-header">
                <h2>Geçmiş Etkinlikler</h2>
                {!isEditing && (
                    <button className="admin-btn-add" onClick={() => setIsEditing(true)}>
                        <span>+</span> Yeni Etkinlik Ekle
                    </button>
                )}
            </div>

            {isEditing ? (
                <div className="admin-form-card">
                    <h3>{currentId ? 'Etkinliği Düzenle' : 'Yeni Etkinlik'}</h3>
                    <form onSubmit={saveItem} className="admin-form">

                        <div className="admin-form-row">
                            <div className="admin-form-group">
                                <label>Etkinlik Tarihi</label>
                                <input type="date" name="event_date" value={formData.event_date} onChange={handleInputChange} required />
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
                                />
                            </div>
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
                            <div className="admin-form-group">
                                <label>Etkinlik Türü/Alt Başlık ({activeLangTab.toUpperCase()})</label>
                                <input
                                    type="text"
                                    name={`type_${activeLangTab}`}
                                    value={formData[`type_${activeLangTab}` as keyof typeof formData]}
                                    onChange={handleInputChange}
                                    placeholder="örn. Sergi / Exhibition"
                                />
                            </div>
                        </div>

                        <div className="admin-form-actions">
                            <button type="button" className="admin-btn-secondary" onClick={resetForm}>İptal</button>
                            <button type="submit" className="admin-btn-primary">Etkinliği Kaydet</button>
                        </div>
                    </form>
                </div>
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
                            {events.length === 0 ? (
                                <tr className="admin-empty-row"><td colSpan={5}>Henüz hiç etkinlik eklenmemiş.</td></tr>
                            ) : (
                                events.map(event => (
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
            )}
        </div>
    );
}
