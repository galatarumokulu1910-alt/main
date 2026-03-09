import { useState, useEffect } from 'react';
import { supabase } from '../../../services/supabaseClient';
import ImageUploader from './ImageUploader';

export default function AdminVenue() {
    const [venues, setVenues] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState<string | null>(null);
    const [activeLangTab, setActiveLangTab] = useState<'tr' | 'en' | 'el'>('tr');
    const [newFeature, setNewFeature] = useState('');
    const [thumbToAdd, setThumbToAdd] = useState('');

    const emptyForm = {
        image_url: '',
        thumbnail_images: [] as string[],
        title_tr: '', title_en: '', title_el: '',
        description_tr: '', description_en: '', description_el: '',
        level: 1,
        area: '',
        features_tr: [] as string[],
        features_en: [] as string[],
        features_el: [] as string[],
        gala_capacity: '' as string | number,
        theater_capacity: '' as string | number,
        cocktail_capacity: '' as string | number,
        floor_plan_svg_url: '',
        order_index: 0,
        status: 'draft'
    };

    const [formData, setFormData] = useState(emptyForm);

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        setLoading(true);
        const { data } = await supabase.from('venue_events').select('*').order('order_index', { ascending: true });
        if (data) setVenues(data);
        setLoading(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const resetForm = () => {
        setIsEditing(false);
        setCurrentId(null);
        setFormData(emptyForm);
        setActiveLangTab('tr');
        setNewFeature('');
        setThumbToAdd('');
    };

    const editItem = (item: any) => {
        setIsEditing(true);
        setCurrentId(item.id);
        setFormData({
            image_url: item.image_url || '',
            thumbnail_images: item.thumbnail_images || [],
            title_tr: item.title_tr || '', title_en: item.title_en || '', title_el: item.title_el || '',
            description_tr: item.description_tr || '', description_en: item.description_en || '', description_el: item.description_el || '',
            level: item.level || 1,
            area: item.area || '',
            features_tr: item.features_tr || [],
            features_en: item.features_en || [],
            features_el: item.features_el || [],
            gala_capacity: item.gala_capacity ?? '',
            theater_capacity: item.theater_capacity ?? '',
            cocktail_capacity: item.cocktail_capacity ?? '',
            floor_plan_svg_url: item.floor_plan_svg_url || '',
            order_index: item.order_index ?? 0,
            status: item.status || 'draft'
        });
    };

    const saveItem = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title_tr.trim()) {
            alert("HATA: Lütfen mekan alanı için Türkçe ad giriniz (Zorunlu).");
            return;
        }

        setLoading(true);
        const payload = {
            ...formData,
            gala_capacity: formData.gala_capacity === '' ? null : Number(formData.gala_capacity),
            theater_capacity: formData.theater_capacity === '' ? null : Number(formData.theater_capacity),
            cocktail_capacity: formData.cocktail_capacity === '' ? null : Number(formData.cocktail_capacity),
            level: Number(formData.level),
            order_index: Number(formData.order_index),
        };

        try {
            if (isEditing && currentId) {
                const { error } = await supabase.from('venue_events').update(payload).eq('id', currentId);
                if (error) throw error;
            } else {
                const { error } = await supabase.from('venue_events').insert([payload]);
                if (error) throw error;
            }
            await fetchData();
            resetForm();
        } catch (error: any) {
            alert(`Mekan alanı kaydedilemedi: ${error.message || 'Bilinmeyen hata.'}\nLütfen internet bağlantınızı ve girdiğiniz değerleri kontrol edip tekrar deneyin.`);
            setLoading(false);
        }
    };

    const deleteItem = async (id: string) => {
        if (window.confirm('Bu mekanı silmek istediğinizden emin misiniz?')) {
            setLoading(true);
            await supabase.from('venue_events').delete().eq('id', id);
            await fetchData();
        }
    };

    // Feature management per language
    const addFeature = () => {
        if (!newFeature.trim()) return;
        setFormData(prev => ({
            ...prev,
            [`features_${activeLangTab}`]: [...(prev[`features_${activeLangTab}` as keyof typeof prev] as string[]), newFeature.trim()]
        }));
        setNewFeature('');
    };

    const removeFeature = (lang: 'tr' | 'en' | 'el', index: number) => {
        setFormData(prev => {
            const key = `features_${lang}` as keyof typeof prev;
            const arr = [...(prev[key] as string[])];
            arr.splice(index, 1);
            return { ...prev, [key]: arr };
        });
    };

    // Thumbnail management
    const addThumbnail = (url: string) => {
        if (url) setFormData(prev => ({ ...prev, thumbnail_images: [...prev.thumbnail_images, url] }));
        setThumbToAdd('');
    };

    const removeThumbnail = (index: number) => {
        setFormData(prev => {
            const arr = [...prev.thumbnail_images];
            arr.splice(index, 1);
            return { ...prev, thumbnail_images: arr };
        });
    };

    if (loading && venues.length === 0) return <div>Mekan alanları yükleniyor...</div>;

    return (
        <div className="admin-module">
            <div className="admin-module-header">
                <h2>Mekan Kiralama Alanları</h2>
                {!isEditing && (
                    <button className="admin-btn-add" onClick={() => setIsEditing(true)}>
                        <span>+</span> Yeni Alan Ekle
                    </button>
                )}
            </div>

            {isEditing ? (
                <div className="admin-form-card">
                    <h3>{currentId ? 'Alanı Düzenle' : 'Yeni Alan'}</h3>
                    <form onSubmit={saveItem} className="admin-form">

                        {/* Row 1: Level, Order, Status, Area */}
                        <div className="admin-form-row">
                            <div className="admin-form-group">
                                <label>Kat / Seviye</label>
                                <select name="level" value={formData.level} onChange={handleInputChange}>
                                    <option value={1}>Level 1</option>
                                    <option value={2}>Level 2</option>
                                    <option value={3}>Level 3</option>
                                </select>
                            </div>
                            <div className="admin-form-group">
                                <label>Sıra (order)</label>
                                <input type="number" name="order_index" value={formData.order_index} onChange={handleInputChange} min={0} />
                            </div>
                            <div className="admin-form-group">
                                <label>Alan (m²)</label>
                                <input type="text" name="area" value={formData.area} onChange={handleInputChange} placeholder="örn. 227 + 100 m²" />
                            </div>
                            <div className="admin-form-group">
                                <label>Durum</label>
                                <select name="status" value={formData.status} onChange={handleInputChange}>
                                    <option value="draft">Taslak</option>
                                    <option value="published">Yayında</option>
                                </select>
                            </div>
                        </div>

                        {/* Capacity */}
                        <div className="admin-form-section-title">Kapasite</div>
                        <div className="admin-form-row">
                            <div className="admin-form-group">
                                <label>🎭 Gala Yemeği</label>
                                <input type="number" name="gala_capacity" value={formData.gala_capacity} onChange={handleInputChange} placeholder="kişi" min={0} />
                            </div>
                            <div className="admin-form-group">
                                <label>🎪 Tiyatro</label>
                                <input type="number" name="theater_capacity" value={formData.theater_capacity} onChange={handleInputChange} placeholder="kişi" min={0} />
                            </div>
                            <div className="admin-form-group">
                                <label>🥂 Kokteyl</label>
                                <input type="number" name="cocktail_capacity" value={formData.cocktail_capacity} onChange={handleInputChange} placeholder="kişi" min={0} />
                            </div>
                        </div>

                        {/* Main image */}
                        <div className="admin-form-group">
                            <label>Ana Görsel</label>
                            <ImageUploader
                                value={formData.image_url}
                                onChange={(url) => setFormData({ ...formData, image_url: url })}
                                folderPath="venue"
                            />
                        </div>

                        {/* Thumbnail gallery */}
                        <div className="admin-form-section-title">Fotoğraf Galerisi (Carousel)</div>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
                            {formData.thumbnail_images.map((url, i) => (
                                <div key={i} style={{ position: 'relative', width: 80, height: 60 }}>
                                    <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 4, border: '1px solid #ddd' }} />
                                    <button
                                        type="button"
                                        onClick={() => removeThumbnail(i)}
                                        style={{ position: 'absolute', top: -6, right: -6, background: '#e53e3e', color: '#fff', border: 'none', borderRadius: '50%', width: 18, height: 18, cursor: 'pointer', fontSize: 10, lineHeight: '18px', textAlign: 'center' }}
                                    >×</button>
                                </div>
                            ))}
                        </div>
                        <ImageUploader
                            value={thumbToAdd}
                            onChange={(url) => { addThumbnail(url); setThumbToAdd(''); }}
                            folderPath="venue"
                        />
                        <p style={{ fontSize: '0.8rem', color: '#888', marginTop: 4 }}>Her ekleme otomatik galeriye eklenir. Birden fazla fotoğraf yükleyebilirsiniz.</p>

                        {/* Floor plan SVG URL */}
                        <div className="admin-form-group" style={{ marginTop: 16 }}>
                            <label>Kat Planı Görseli URL (SVG veya PNG)</label>
                            <input
                                type="url"
                                name="floor_plan_svg_url"
                                value={formData.floor_plan_svg_url}
                                onChange={handleInputChange}
                                placeholder="https://..."
                            />
                            <p style={{ fontSize: '0.8rem', color: '#888', marginTop: 4 }}>Supabase Storage'a yükleyip URL'yi yapıştırın.</p>
                        </div>

                        {/* Trilingual tabs */}
                        <div className="admin-lang-tabs" style={{ marginTop: 20 }}>
                            {(['tr', 'en', 'el'] as const).map(l => (
                                <button key={l} type="button" className={`lang-tab ${activeLangTab === l ? 'active' : ''}`} onClick={() => setActiveLangTab(l)}>
                                    {l.toUpperCase()}
                                </button>
                            ))}
                        </div>

                        <div className="admin-lang-content">
                            <div className="admin-form-group">
                                <label>Alan Adı ({activeLangTab.toUpperCase()})</label>
                                <input
                                    type="text"
                                    name={`title_${activeLangTab}`}
                                    value={formData[`title_${activeLangTab}` as keyof typeof formData] as string}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="admin-form-group">
                                <label>Açıklama ({activeLangTab.toUpperCase()})</label>
                                <textarea
                                    rows={3}
                                    name={`description_${activeLangTab}`}
                                    value={formData[`description_${activeLangTab}` as keyof typeof formData] as string}
                                    onChange={handleInputChange}
                                />
                            </div>

                            {/* Features per language */}
                            <div className="admin-form-group">
                                <label>Özellikler ({activeLangTab.toUpperCase()})</label>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
                                    {(formData[`features_${activeLangTab}` as keyof typeof formData] as string[]).map((f, i) => (
                                        <span key={i} style={{ background: '#f0e6c8', borderRadius: 4, padding: '2px 8px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                                            {f}
                                            <button type="button" onClick={() => removeFeature(activeLangTab, i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#c0392b', fontWeight: 700, fontSize: 14 }}>×</button>
                                        </span>
                                    ))}
                                </div>
                                <div style={{ display: 'flex', gap: 8 }}>
                                    <input
                                        type="text"
                                        value={newFeature}
                                        onChange={e => setNewFeature(e.target.value)}
                                        placeholder={`Özellik ekle (${activeLangTab.toUpperCase()})...`}
                                        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addFeature(); } }}
                                        style={{ flex: 1 }}
                                    />
                                    <button type="button" className="admin-btn-secondary" onClick={addFeature}>Ekle</button>
                                </div>
                            </div>
                        </div>

                        <div className="admin-form-actions">
                            <button type="button" className="admin-btn-secondary" onClick={resetForm}>İptal</button>
                            <button type="submit" className="admin-btn-primary">Alanı Kaydet</button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Görsel</th>
                                <th>Kat</th>
                                <th>Alan Adı (TR)</th>
                                <th>Alan (m²)</th>
                                <th>Kapasite (Gala/Tiyatro/Kokteyl)</th>
                                <th>Durum</th>
                                <th>İşlemler</th>
                            </tr>
                        </thead>
                        <tbody>
                            {venues.length === 0 ? (
                                <tr className="admin-empty-row"><td colSpan={7}>Henüz hiç mekan alanı eklenmemiş.</td></tr>
                            ) : (
                                venues.map(v => (
                                    <tr key={v.id}>
                                        <td>
                                            {v.image_url
                                                ? <img src={v.image_url} alt="venue" className="admin-thumb" />
                                                : <div className="admin-thumb-placeholder">Yok</div>
                                            }
                                        </td>
                                        <td><span className="admin-badge" style={{ background: '#f0e6c8', color: '#8B6914' }}>L{v.level || '?'}</span></td>
                                        <td>
                                            <strong>{v.title_tr}</strong>
                                            {v.area && <div style={{ fontSize: '0.8rem', color: '#888', marginTop: 2 }}>{v.area}</div>}
                                        </td>
                                        <td style={{ fontSize: '0.85rem' }}>{v.area || '—'}</td>
                                        <td style={{ fontSize: '0.85rem' }}>
                                            {v.gala_capacity ? `${v.gala_capacity} / ${v.theater_capacity} / ${v.cocktail_capacity}` : '—'}
                                        </td>
                                        <td>
                                            <span className={`admin-badge ${v.status === 'published' ? 'badge-success' : 'badge-draft'}`}>
                                                {v.status === 'published' ? 'Yayında' : 'Taslak'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="admin-table-actions">
                                                <button className="admin-btn-icon" onClick={() => editItem(v)}>Düzenle</button>
                                                <button className="admin-btn-icon text-danger" onClick={() => deleteItem(v.id)}>Sil</button>
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
