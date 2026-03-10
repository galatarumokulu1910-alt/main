import { useState, useEffect } from 'react';
import { supabase } from '../../../services/supabaseClient';
import ImageUploader from './ImageUploader';

export default function AdminIstanbulRum() {
    const [artifacts, setArtifacts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [subcategories, setSubcategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Form State
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState<string | null>(null);
    const [activeLangTab, setActiveLangTab] = useState<'tr' | 'en' | 'el'>('tr');
    const [formData, setFormData] = useState({
        category_id: '',
        sub_category_id: '',
        image_url: '',
        title_tr: '', title_en: '', title_el: '',
        description_tr: '', description_en: '', description_el: '',
        provenance_tr: '', provenance_en: '', provenance_el: '',
        status: 'draft'
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        const { data: cats } = await supabase.from('archive_categories').select('*').order('name_tr');
        if (cats) setCategories(cats);

        const { data: subcats } = await supabase.from('archive_subcategories').select('*').order('name_tr');
        if (subcats) setSubcategories(subcats);

        // Only fetch istanbul_rum artifacts
        const { data: arts } = await supabase.from('artifacts').select(`
            *,
            archive_categories (name_tr),
            archive_subcategories (name_tr)
        `)
            .eq('archive_type', 'istanbul_rum')
            .order('created_at', { ascending: false });
        if (arts) setArtifacts(arts);

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
            category_id: '', sub_category_id: '', image_url: '',
            title_tr: '', title_en: '', title_el: '',
            description_tr: '', description_en: '', description_el: '',
            provenance_tr: '', provenance_en: '', provenance_el: '',
            status: 'draft'
        });
        setActiveLangTab('tr');
    };

    const editItem = (item: any) => {
        setIsEditing(true);
        setCurrentId(item.id);
        setFormData({
            category_id: item.category_id || '',
            sub_category_id: item.sub_category_id || '',
            image_url: item.image_url || '',
            title_tr: item.title_tr || '', title_en: item.title_en || '', title_el: item.title_el || '',
            description_tr: item.description_tr || '', description_en: item.description_en || '', description_el: item.description_el || '',
            provenance_tr: item.provenance_tr || '', provenance_en: item.provenance_en || '', provenance_el: item.provenance_el || '',
            status: item.status || 'draft'
        });
    };

    const saveItem = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.image_url) {
            alert("HATA: Lütfen bir eser görseli yükleyin veya seçin (Zorunlu).");
            return;
        }

        if (!formData.category_id) {
            alert("Lütfen bir Kategori seçiniz.");
            return;
        }

        if (!formData.title_tr.trim()) {
            alert("HATA: Lütfen eser için Türkçe bir başlık giriniz. Diğer diller isteğe bağlıdır ancak Türkçe başlık zorunludur.");
            return;
        }

        setLoading(true);

        const payload = {
            ...formData,
            archive_type: 'istanbul_rum',
            category_id: formData.category_id || null,
            sub_category_id: formData.sub_category_id || null
        };

        try {
            if (isEditing && currentId) {
                const { error } = await supabase.from('artifacts').update(payload).eq('id', currentId);
                if (error) throw error;
            } else {
                const { error } = await supabase.from('artifacts').insert([payload]);
                if (error) throw error;
            }
            await fetchData();
            resetForm();
        } catch (error: any) {
            alert(`Eser kaydedilemedi: ${error.message || 'Bilinmeyen hata.'}\nLütfen internet bağlantınızı ve girdiğiniz değerleri kontrol edip tekrar deneyin.`);
            setLoading(false);
        }
    };

    const deleteItem = async (id: string) => {
        if (window.confirm("Bu eseri silmek istediğinizden emin misiniz?")) {
            setLoading(true);
            await supabase.from('artifacts').delete().eq('id', id);
            await fetchData();
        }
    };

    if (loading && artifacts.length === 0) return <div>İstanbul Rum eserleri yükleniyor...</div>;

    return (
        <div className="admin-module">
            <div className="admin-module-header">
                <h2>İstanbul Rumları Arşivi</h2>
                {!isEditing && (
                    <button className="admin-btn-add" onClick={() => setIsEditing(true)}>
                        <span>+</span> Yeni Eser Ekle
                    </button>
                )}
            </div>

            {isEditing ? (
                <div className="admin-form-card">
                    <h3>{currentId ? 'Eseri Düzenle' : 'Yeni İstanbul Rum Eseri'}</h3>
                    <form onSubmit={saveItem} className="admin-form">

                        {/* META DATA */}
                        <div className="admin-form-row">
                            <div className="admin-form-group">
                                <label>Kategori</label>
                                <select name="category_id" value={formData.category_id} onChange={handleInputChange}>
                                    <option value="">-- Kategori Seçin --</option>
                                    {categories.map(c => <option key={c.id} value={c.id}>{c.name_tr}</option>)}
                                </select>
                            </div>
                            <div className="admin-form-group">
                                <label>Alt Kategori</label>
                                <select name="sub_category_id" value={formData.sub_category_id} onChange={handleInputChange}>
                                    <option value="">-- Alt Kategori Seçin --</option>
                                    {subcategories
                                        .filter(s => s.category_id === formData.category_id)
                                        .map(s => <option key={s.id} value={s.id}>{s.name_tr}</option>)
                                    }
                                </select>
                            </div>
                            <div className="admin-form-group">
                                <label>Durum</label>
                                <select name="status" value={formData.status} onChange={handleInputChange}>
                                    <option value="draft">Taslak</option>
                                    <option value="published">Yayında</option>
                                </select>
                            </div>
                        </div>

                        <div className="admin-form-group">
                            <label>Eser Görseli</label>
                            <ImageUploader
                                value={formData.image_url}
                                onChange={(url) => setFormData({ ...formData, image_url: url })}
                                folderPath="istanbul-rum"
                                maxWidth={1920}
                            />
                            <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '4px' }}>
                                Önerilen: 1080x1080px (Kare) veya 1920x1080px (Yatay).
                            </p>
                        </div>

                        {/* TRILINGUAL TABS */}
                        <div className="admin-lang-tabs">
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
                            <div className="admin-form-group">
                                <label>Künye / Kaynak ({activeLangTab.toUpperCase()})</label>
                                <textarea
                                    rows={2}
                                    name={`provenance_${activeLangTab}`}
                                    value={formData[`provenance_${activeLangTab}` as keyof typeof formData]}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        <div className="admin-form-actions">
                            <button type="button" className="admin-btn-secondary" onClick={resetForm}>İptal</button>
                            <button type="submit" className="admin-btn-primary">Eseri Kaydet</button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Görsel</th>
                                <th>Başlık (TR)</th>
                                <th>Kategori</th>
                                <th>Durum</th>
                                <th>İşlemler</th>
                            </tr>
                        </thead>
                        <tbody>
                            {artifacts.length === 0 ? (
                                <tr className="admin-empty-row"><td colSpan={5}>Henüz hiç İstanbul Rum eseri eklenmemiş.</td></tr>
                            ) : (
                                artifacts.map(art => (
                                    <tr key={art.id}>
                                        <td>
                                            {art.image_url ? (
                                                <img src={art.image_url} alt="thumb" className="admin-thumb" />
                                            ) : (
                                                <div className="admin-thumb-placeholder">Görsel Yok</div>
                                            )}
                                        </td>
                                        <td>{art.title_tr}</td>
                                        <td>{art.archive_categories?.name_tr || '-'}</td>
                                        <td>
                                            <span className={`admin-badge ${art.status === 'published' ? 'badge-success' : 'badge-draft'}`}>
                                                {art.status === 'published' ? 'Yayında' : 'Taslak'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="admin-table-actions">
                                                <button className="admin-btn-icon" onClick={() => editItem(art)}>Düzenle</button>
                                                <button className="admin-btn-icon text-danger" onClick={() => deleteItem(art.id)}>Sil</button>
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
