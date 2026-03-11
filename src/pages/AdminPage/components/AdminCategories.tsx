import { useState, useEffect } from 'react';
import { supabase } from '../../../services/supabaseClient';

export default function AdminCategories() {
    const [categories, setCategories] = useState<any[]>([]);
    const [subcategories, setSubcategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeSection, setActiveSection] = useState<'categories' | 'subcategories'>('categories');
    const [archiveFilter, setArchiveFilter] = useState<'all' | 'school' | 'istanbul_rum'>('all');

    // Category form
    const [catEditing, setCatEditing] = useState(false);
    const [catId, setCatId] = useState<string | null>(null);
    const [catForm, setCatForm] = useState({ type_key: '', name_tr: '', name_en: '', name_el: '', archive_type: 'school' });

    // Subcategory form
    const [subEditing, setSubEditing] = useState(false);
    const [subId, setSubId] = useState<string | null>(null);
    const [subForm, setSubForm] = useState({ key_name: '', name_tr: '', name_en: '', name_el: '', category_id: '' });

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        setLoading(true);
        const [catRes, subRes] = await Promise.all([
            supabase.from('archive_categories').select('*').order('type_key'),
            supabase.from('archive_subcategories').select('*, category:archive_categories(type_key)').order('key_name'),
        ]);
        if (catRes.data) setCategories(catRes.data);
        if (subRes.data) setSubcategories(subRes.data);
        setLoading(false);
    };

    // ── Categories CRUD ──
    const saveCat = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!catForm.type_key.trim()) {
            alert("HATA: Kategori anahtarı (type_key) boş bırakılamaz.");
            return;
        }
        setLoading(true);
        try {
            if (catEditing && catId) {
                const { error } = await supabase.from('archive_categories').update(catForm).eq('id', catId);
                if (error) throw error;
            } else {
                const { error } = await supabase.from('archive_categories').insert([catForm]);
                if (error) throw error;
            }
            await fetchData();
            resetCat();
        } catch (error: any) {
            alert(`Kategori kaydedilemedi: ${error.message || 'Bilinmeyen bir hata oluştu.'}\nLütfen girdiğiniz bilgileri kontrol edip tekrar deneyin.`);
            setLoading(false);
        }
    };

    const deleteCat = async (id: string) => {
        if (window.confirm('Bu kategoriyi silmek istediğinizden emin misiniz? Bağlı alt kategoriler etkilenebilir.')) {
            setLoading(true);
            const { error } = await supabase.from('archive_categories').delete().eq('id', id);
            if (error) {
                alert(`Kategori silinemedi: ${error.message}\n\nBu kategori altında eserler veya alt kategoriler olabilir. Önce bağlı öğeleri silin veya başka bir kategoriye taşıyın.`);
                setLoading(false);
                return;
            }
            await fetchData();
        }
    };

    const editCat = (item: any) => {
        setCatEditing(true); setCatId(item.id);
        setCatForm({ type_key: item.type_key, name_tr: item.name_tr || '', name_en: item.name_en || '', name_el: item.name_el || '', archive_type: item.archive_type || 'school' });
    };

    const resetCat = () => { setCatEditing(false); setCatId(null); setCatForm({ type_key: '', name_tr: '', name_en: '', name_el: '', archive_type: 'school' }); };

    // ── Subcategories CRUD ──
    const saveSub = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!subForm.key_name.trim()) {
            alert("HATA: Alt kategori anahtarı (key_name) boş bırakılamaz.");
            return;
        }
        if (!subForm.category_id) {
            alert("HATA: Üst kategori seçilmedi! Her alt kategori mutlaka bir ana kategoriye ait olmalıdır.");
            return;
        }
        setLoading(true);
        try {
            if (subEditing && subId) {
                const { error } = await supabase.from('archive_subcategories').update(subForm).eq('id', subId);
                if (error) throw error;
            } else {
                const { error } = await supabase.from('archive_subcategories').insert([subForm]);
                if (error) throw error;
            }
            await fetchData();
            resetSub();
        } catch (error: any) {
            alert(`Alt kategori kaydedilemedi: ${error.message || 'Bilinmeyen bir hata oluştu.'}\nLütfen girdiğiniz bilgileri veya bağlantıları kontrol edip tekrar deneyin.`);
            setLoading(false);
        }
    };

    const deleteSub = async (id: string) => {
        if (window.confirm('Bu alt kategoriyi silmek istediğinizden emin misiniz?')) {
            setLoading(true);
            const { error } = await supabase.from('archive_subcategories').delete().eq('id', id);
            if (error) {
                alert(`Alt kategori silinemedi: ${error.message}\n\nBu alt kategori altında eserler olabilir. Önce bağlı öğeleri silin veya başka bir alt kategoriye taşıyın.`);
                setLoading(false);
                return;
            }
            await fetchData();
        }
    };

    const editSub = (item: any) => {
        setSubEditing(true); setSubId(item.id);
        setSubForm({ key_name: item.key_name, name_tr: item.name_tr || '', name_en: item.name_en || '', name_el: item.name_el || '', category_id: item.category_id || '' });
    };

    const resetSub = () => { setSubEditing(false); setSubId(null); setSubForm({ key_name: '', name_tr: '', name_en: '', name_el: '', category_id: '' }); };

    if (loading && categories.length === 0) return <div>Kategoriler yükleniyor...</div>;

    return (
        <div className="admin-module">
            <div className="admin-module-header">
                <h2>Arşiv Kategorileri</h2>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                        className={`admin-btn-${activeSection === 'categories' ? 'primary' : 'secondary'}`}
                        onClick={() => setActiveSection('categories')}
                    >
                        Ana Kategoriler
                    </button>
                    <button
                        className={`admin-btn-${activeSection === 'subcategories' ? 'primary' : 'secondary'}`}
                        onClick={() => setActiveSection('subcategories')}
                    >
                        Alt Kategoriler
                    </button>
                </div>
            </div>

            {/* Archive Type Filter */}
            <div style={{ display: 'flex', gap: '6px', marginBottom: '16px' }}>
                {(['all', 'school', 'istanbul_rum'] as const).map(f => (
                    <button
                        key={f}
                        className={`admin-btn-${archiveFilter === f ? 'primary' : 'secondary'}`}
                        style={{ fontSize: '0.8rem', padding: '4px 12px' }}
                        onClick={() => setArchiveFilter(f)}
                    >
                        {f === 'all' ? 'Tümü' : f === 'school' ? '🏫 Okul Arşivi' : '🏛️ İstanbul Rumları'}
                    </button>
                ))}
            </div>

            {/* ── CATEGORIES SECTION ── */}
            {activeSection === 'categories' && (
                <>
                    {catEditing ? (
                        <div className="admin-form-card">
                            <div className="admin-form-card-header">
                                <button type="button" className="admin-form-back-btn" onClick={resetCat}>←</button>
                                <h3>{catId ? 'Kategoriyi Düzenle' : 'Yeni Kategori'}</h3>
                            </div>
                            <form onSubmit={saveCat} className="admin-form">
                                <div className="admin-form-row">
                                    <div className="admin-form-group">
                                        <label>Anahtar (type_key) <span style={{ color: 'red' }}>*</span></label>
                                        <input type="text" value={catForm.type_key} onChange={e => setCatForm(p => ({ ...p, type_key: e.target.value }))} placeholder="ör. documents, objects" required />
                                        <span className="admin-field-hint">Küçük harf, boşluksuz. Sistem anahtarıdır.</span>
                                    </div>
                                    <div className="admin-form-group">
                                        <label>Arşiv Tipi</label>
                                        <select value={catForm.archive_type} onChange={e => setCatForm(p => ({ ...p, archive_type: e.target.value }))}>
                                            <option value="school">Okul Arşivi</option>
                                            <option value="istanbul_rum">İstanbul Rumları</option>
                                            <option value="both">Her İkisi</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="admin-form-row">
                                    <div className="admin-form-group">
                                        <label>İsim (TR) <span style={{ color: 'red' }}>*</span></label>
                                        <input type="text" value={catForm.name_tr} onChange={e => setCatForm(p => ({ ...p, name_tr: e.target.value }))} placeholder="Resmi Kayıt" required />
                                    </div>
                                    <div className="admin-form-group">
                                        <label>İsim (EN) <span style={{ color: 'red' }}>*</span></label>
                                        <input type="text" value={catForm.name_en} onChange={e => setCatForm(p => ({ ...p, name_en: e.target.value }))} placeholder="Official Record" required />
                                    </div>
                                    <div className="admin-form-group">
                                        <label>İsim (EL) <span style={{ color: 'red' }}>*</span></label>
                                        <input type="text" value={catForm.name_el} onChange={e => setCatForm(p => ({ ...p, name_el: e.target.value }))} placeholder="Επίσημο Αρχείο" required />
                                    </div>
                                </div>
                                <div className="admin-form-actions">
                                    <button type="button" className="admin-btn-secondary" onClick={resetCat}>İptal</button>
                                    <button type="submit" className="admin-btn-primary">Kaydet</button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <>
                            <div style={{ marginBottom: '16px' }}>
                                <button className="admin-btn-add" onClick={() => setCatEditing(true)}>
                                    <span>+</span> Yeni Kategori
                                </button>
                            </div>
                            <div className="admin-table-container">
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Anahtar</th>
                                            <th>Arşiv</th>
                                            <th>TR</th>
                                            <th>EN</th>
                                            <th>İşlemler</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {categories.length === 0 ? (
                                            <tr className="admin-empty-row"><td colSpan={5}>Henüz hiç kategori eklenmemiş.</td></tr>
                                        ) : (
                                            categories
                                                .filter(cat => archiveFilter === 'all' || cat.archive_type === archiveFilter || cat.archive_type === 'both')
                                                .map(cat => (
                                                    <tr key={cat.id}>
                                                        <td><span className="admin-badge badge-draft">{cat.type_key}</span></td>
                                                        <td><span className="admin-badge" style={{ background: cat.archive_type === 'istanbul_rum' ? '#e0f2f1' : cat.archive_type === 'both' ? '#fff3e0' : '#f0e6c8', color: '#555', fontSize: '0.75rem' }}>{cat.archive_type === 'istanbul_rum' ? 'İst. Rum' : cat.archive_type === 'both' ? 'Her İkisi' : 'Okul'}</span></td>
                                                        <td>{cat.name_tr}</td>
                                                        <td>{cat.name_en}</td>
                                                        <td>
                                                            <div className="admin-table-actions">
                                                                <button className="admin-btn-icon" onClick={() => editCat(cat)}>Düzenle</button>
                                                                <button className="admin-btn-icon text-danger" onClick={() => deleteCat(cat.id)}>Sil</button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </>
            )}

            {/* ── SUBCATEGORIES SECTION ── */}
            {activeSection === 'subcategories' && (
                <>
                    {subEditing ? (
                        <div className="admin-form-card">
                            <div className="admin-form-card-header">
                                <button type="button" className="admin-form-back-btn" onClick={resetSub}>←</button>
                                <h3>{subId ? 'Alt Kategoriyi Düzenle' : 'Yeni Alt Kategori'}</h3>
                            </div>
                            <form onSubmit={saveSub} className="admin-form">
                                <div className="admin-form-row">
                                    <div className="admin-form-group">
                                        <label>Anahtar (key_name) <span style={{ color: 'red' }}>*</span></label>
                                        <input type="text" value={subForm.key_name} onChange={e => setSubForm(p => ({ ...p, key_name: e.target.value }))} placeholder="ör. kayit, atletik" required />
                                        <span className="admin-field-hint">Küçük harf, boşluksuz. Sistem anahtarıdır.</span>
                                    </div>
                                    <div className="admin-form-group">
                                        <label>Üst Kategori</label>
                                        <select value={subForm.category_id} onChange={e => setSubForm(p => ({ ...p, category_id: e.target.value }))}>
                                            <option value="">Seçiniz...</option>
                                            {categories.map(c => (
                                                <option key={c.id} value={c.id}>{c.type_key} — {c.name_tr}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="admin-form-row">
                                    <div className="admin-form-group">
                                        <label>İsim (TR) <span style={{ color: 'red' }}>*</span></label>
                                        <input type="text" value={subForm.name_tr} onChange={e => setSubForm(p => ({ ...p, name_tr: e.target.value }))} placeholder="Atletik Kupa" required />
                                    </div>
                                    <div className="admin-form-group">
                                        <label>İsim (EN) <span style={{ color: 'red' }}>*</span></label>
                                        <input type="text" value={subForm.name_en} onChange={e => setSubForm(p => ({ ...p, name_en: e.target.value }))} placeholder="Athletic Trophy" required />
                                    </div>
                                    <div className="admin-form-group">
                                        <label>İsim (EL) <span style={{ color: 'red' }}>*</span></label>
                                        <input type="text" value={subForm.name_el} onChange={e => setSubForm(p => ({ ...p, name_el: e.target.value }))} placeholder="Αθλητικό Τρόπαιο" required />
                                    </div>
                                </div>
                                <div className="admin-form-actions">
                                    <button type="button" className="admin-btn-secondary" onClick={resetSub}>İptal</button>
                                    <button type="submit" className="admin-btn-primary">Kaydet</button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <>
                            <div style={{ marginBottom: '16px' }}>
                                <button className="admin-btn-add" onClick={() => setSubEditing(true)}>
                                    <span>+</span> Yeni Alt Kategori
                                </button>
                            </div>
                            <div className="admin-table-container">
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Alt Kategori Anahtarı</th>
                                            <th>Üst Kategori</th>
                                            <th>TR</th>
                                            <th>EN</th>
                                            <th>İşlemler</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {subcategories.length === 0 ? (
                                            <tr className="admin-empty-row"><td colSpan={5}>Henüz hiç alt kategori eklenmemiş.</td></tr>
                                        ) : (
                                            subcategories.map(sub => (
                                                <tr key={sub.id}>
                                                    <td><span className="admin-badge badge-draft">{sub.key_name}</span></td>
                                                    <td><span className="admin-badge badge-success">{sub.category?.type_key || '—'}</span></td>
                                                    <td>{sub.name_tr}</td>
                                                    <td>{sub.name_en}</td>
                                                    <td>
                                                        <div className="admin-table-actions">
                                                            <button className="admin-btn-icon" onClick={() => editSub(sub)}>Düzenle</button>
                                                            <button className="admin-btn-icon text-danger" onClick={() => deleteSub(sub.id)}>Sil</button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    );
}
