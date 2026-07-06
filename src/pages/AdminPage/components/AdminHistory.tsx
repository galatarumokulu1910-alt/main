import { useState, useEffect } from 'react';
import { supabase } from '../../../services/supabaseClient';

export default function AdminHistory() {
    const [timeline, setTimeline] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Form State
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState<string | null>(null);
    const [activeLangTab, setActiveLangTab] = useState<'tr' | 'en' | 'el'>('tr');
    const [formData, setFormData] = useState({
        year: '',
        title_tr: '', title_en: '', title_el: '',
        description_tr: '', description_en: '', description_el: '',
        order_index: 0,
        status: 'draft'
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        // Fetch and explicitly order by order_index, then year for fallback
        const { data } = await supabase.from('history_timeline')
            .select('*')
            .order('order_index', { ascending: true })
            .order('year', { ascending: true });

        if (data) setTimeline(data);
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
            year: '',
            title_tr: '', title_en: '', title_el: '',
            description_tr: '', description_en: '', description_el: '',
            order_index: 0,
            status: 'draft'
        });
        setActiveLangTab('tr');
    };

    const editItem = (item: any) => {
        setIsEditing(true);
        setCurrentId(item.id);
        setFormData({
            year: item.year || '',
            title_tr: item.title_tr || '', title_en: item.title_en || '', title_el: item.title_el || '',
            description_tr: item.description_tr || '', description_en: item.description_en || '', description_el: item.description_el || '',
            order_index: item.order_index || 0,
            status: item.status || 'draft'
        });
    };

    const saveItem = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title_tr.trim()) {
            alert("HATA: Lütfen tarihçe olayı için Türkçe başlık giriniz (Zorunlu).");
            return;
        }

        if (!formData.year.trim()) {
            alert("HATA: Lütfen bir tarih / yıl giriniz (Zorunlu).");
            return;
        }

        setLoading(true);

        // Ensure numerical casting
        const payload = {
            ...formData,
            order_index: parseInt(formData.order_index as any, 10) || 0
        };

        try {
            if (isEditing && currentId) {
                const { error } = await supabase.from('history_timeline').update(payload).eq('id', currentId);
                if (error) throw error;
            } else {
                const { error } = await supabase.from('history_timeline').insert([payload]);
                if (error) throw error;
            }
            await fetchData();
            resetForm();
        } catch (error: any) {
            alert(`Tarihçe kaydedilemedi: ${error.message || 'Bilinmeyen hata.'}\nLütfen internet bağlantınızı ve girdiğiniz değerleri kontrol edip tekrar deneyin.`);
            setLoading(false);
        }
    };

    const deleteItem = async (id: string) => {
        if (window.confirm("Bu tarihçe olayını silmek istediğinizden emin misiniz?")) {
            setLoading(true);
            try {
                const { error } = await supabase.from('history_timeline').delete().eq('id', id);
                if (error) throw error;
                await fetchData();
            } catch (error: any) {
                console.error("Tarihçe olayını silerken hata oluştu:", error);
                alert("Tarihçe olayını silerken bir hata oluştu: " + (error.message || error));
                setLoading(false);
            }
        }
    };

    if (loading && timeline.length === 0) return <div>Tarihçe yükleniyor...</div>;

    return (
        <div className="admin-module">
            <div className="admin-module-header">
                <h2>Tarihçe</h2>
                {!isEditing && (
                    <button className="admin-btn-add" onClick={() => setIsEditing(true)}>
                        <span>+</span> Yeni Olay Ekle
                    </button>
                )}
            </div>

            {isEditing ? (
                <div className="admin-form-card">
                    <div className="admin-form-card-header">
                        <button type="button" className="admin-form-back-btn" onClick={resetForm}>←</button>
                        <h3>{currentId ? 'Olayı Düzenle' : 'Yeni Olay'}</h3>
                    </div>
                    <form onSubmit={saveItem} className="admin-form">

                        <div className="admin-form-row">
                            <div className="admin-form-group">
                                <label>Yıl (örn. 1885 veya 19. Yüzyıl)</label>
                                <input
                                    type="text"
                                    name="year"
                                    value={formData.year}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="1885"
                                />
                            </div>
                            <div className="admin-form-group">
                                <label>Görünüm Sırası (Düşük = Önce)</label>
                                <input
                                    type="number"
                                    name="order_index"
                                    value={formData.order_index}
                                    onChange={handleInputChange}
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

                        {/* TRILINGUAL TABS */}
                        <div className="admin-lang-tabs" style={{ marginTop: '20px' }}>
                            <button type="button" className={`lang-tab ${activeLangTab === 'tr' ? 'active' : ''}`} onClick={() => setActiveLangTab('tr')}>TR</button>
                            <button type="button" className={`lang-tab ${activeLangTab === 'en' ? 'active' : ''}`} onClick={() => setActiveLangTab('en')}>EN</button>
                            <button type="button" className={`lang-tab ${activeLangTab === 'el' ? 'active' : ''}`} onClick={() => setActiveLangTab('el')}>EL</button>
                        </div>

                        <div className="admin-lang-content">
                            <div className="admin-form-group">
                                <label>Başlık ({activeLangTab.toUpperCase()})</label>
                                <input
                                    type="text"
                                    name={`title_${activeLangTab}`}
                                    value={formData[`title_${activeLangTab}` as keyof typeof formData]}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="admin-form-group">
                                <label>Açıklama ({activeLangTab.toUpperCase()})</label>
                                <textarea
                                    rows={4}
                                    name={`description_${activeLangTab}`}
                                    value={formData[`description_${activeLangTab}` as keyof typeof formData]}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        <div className="admin-form-actions">
                            <button type="button" className="admin-btn-secondary" onClick={resetForm}>İptal</button>
                            <button type="submit" className="admin-btn-primary">Olayı Kaydet</button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Yıl</th>
                                <th>Başlık (TR)</th>
                                <th>Sıra</th>
                                <th>Durum</th>
                                <th>İşlemler</th>
                            </tr>
                        </thead>
                        <tbody>
                            {timeline.length === 0 ? (
                                <tr className="admin-empty-row"><td colSpan={5}>Henüz hiç tarihçe olayı eklenmemiş.</td></tr>
                            ) : (
                                timeline.map(item => (
                                    <tr key={item.id}>
                                        <td><strong>{item.year}</strong></td>
                                        <td>{item.title_tr}</td>
                                        <td>{item.order_index}</td>
                                        <td>
                                            <span className={`admin-badge ${item.status === 'published' ? 'badge-success' : 'badge-draft'}`}>
                                                {item.status === 'published' ? 'Yayında' : 'Taslak'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="admin-table-actions">
                                                <button className="admin-btn-icon" onClick={() => editItem(item)}>Düzenle</button>
                                                <button className="admin-btn-icon text-danger" onClick={() => deleteItem(item.id)}>Sil</button>
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
