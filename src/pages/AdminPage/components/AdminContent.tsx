import { useState, useEffect } from 'react';
import { supabase } from '../../../services/supabaseClient';

export default function AdminContent() {
    const [contentItems, setContentItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Form State
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState<string | null>(null);
    const [activeLangTab, setActiveLangTab] = useState<'tr' | 'en' | 'el'>('tr');
    const [formData, setFormData] = useState({
        page_key: '',
        section_key: '',
        content_tr: '', content_en: '', content_el: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        const { data } = await supabase.from('page_content')
            .select('*')
            .order('page_key', { ascending: true })
            .order('section_key', { ascending: true });

        if (data) setContentItems(data);
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
            page_key: '',
            section_key: '',
            content_tr: '', content_en: '', content_el: ''
        });
        setActiveLangTab('tr');
    };

    const editItem = (item: any) => {
        setIsEditing(true);
        setCurrentId(item.id);
        setFormData({
            page_key: item.page_key || '',
            section_key: item.section_key || '',
            content_tr: item.content_tr || '', content_en: item.content_en || '', content_el: item.content_el || ''
        });
    };

    const saveItem = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.page_key.trim()) {
            alert("HATA: Lütfen bir Sayfa Anahtarı (page_key) giriniz. Bu alan zorunludur.");
            return;
        }
        if (!formData.section_key.trim()) {
            alert("HATA: Lütfen bir Bölüm Anahtarı (section_key) giriniz. Bu alan zorunludur.");
            return;
        }

        setLoading(true);

        try {
            if (isEditing && currentId) {
                const { error } = await supabase.from('page_content').update(formData).eq('id', currentId);
                if (error) throw error;
            } else {
                const { error } = await supabase.from('page_content').insert([formData]);
                if (error) throw error;
            }
            await fetchData();
            resetForm();
        } catch (error: any) {
            alert(`İçerik bloğu kaydedilemedi: ${error.message || 'Bilinmeyen hata.'}\nAnahtarlarda boşluk veya özel karakter olmamasına dikkat edin.`);
            setLoading(false);
        }
    };

    const deleteItem = async (id: string) => {
        if (window.confirm("Bu içerik bloğunu silmek istediğinizden emin misiniz? Bu, ön uç sayfa eşleştirmesini bozabilir.")) {
            setLoading(true);
            await supabase.from('page_content').delete().eq('id', id);
            await fetchData();
        }
    };

    if (loading && contentItems.length === 0) return <div>Sabit içerikler yükleniyor...</div>;

    return (
        <div className="admin-module">
            <div className="admin-module-header">
                <h2>Sabit Sayfa İçerikleri</h2>
                {!isEditing && (
                    <button className="admin-btn-add" onClick={() => setIsEditing(true)}>
                        <span>+</span> İçerik Bloğu Ekle
                    </button>
                )}
            </div>

            {isEditing ? (
                <div className="admin-form-card">
                    <div className="admin-form-card-header">
                        <button type="button" className="admin-form-back-btn" onClick={resetForm}>←</button>
                        <h3>{currentId ? 'İçerik Bloğunu Düzenle' : 'Yeni İçerik Bloğu'}</h3>
                    </div>
                    <div style={{ background: '#fff8ec', border: '1px solid #f6c94a', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px', fontSize: '13px', color: '#7a5800' }}>
                        ⚠️ Uyarı: Yayındaki bloklarda <strong>page_key</strong> veya <strong>section_key</strong> değiştirmek (ön yüz eşleştirmelerini) bozabilir.
                    </div>
                    <form onSubmit={saveItem} className="admin-form">

                        <div className="admin-form-row">
                            <div className="admin-form-group">
                                <label>Sayfa Anahtarı (örn. 'home', 'about')</label>
                                <input
                                    type="text"
                                    name="page_key"
                                    value={formData.page_key}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="admin-form-group">
                                <label>Bölüm Anahtarı (örn. 'hero_title', 'footer_contact')</label>
                                <input
                                    type="text"
                                    name="section_key"
                                    value={formData.section_key}
                                    onChange={handleInputChange}
                                    required
                                />
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
                                <label>İçerik ({activeLangTab.toUpperCase()})</label>
                                <textarea
                                    rows={8}
                                    name={`content_${activeLangTab}`}
                                    value={formData[`content_${activeLangTab}` as keyof typeof formData]}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="admin-form-actions">
                            <button type="button" className="admin-btn-secondary" onClick={resetForm}>İptal</button>
                            <button type="submit" className="admin-btn-primary">İçerik Bloğunu Kaydet</button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Sayfa Anahtarı</th>
                                <th>Bölüm Anahtarı</th>
                                <th>İçerik Önizlemesi (TR)</th>
                                <th>İşlemler</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contentItems.length === 0 ? (
                                <tr className="admin-empty-row"><td colSpan={4}>Henüz hiç sabit içerik yapılandırılmamış.</td></tr>
                            ) : (
                                contentItems.map(item => (
                                    <tr key={item.id}>
                                        <td><span className="admin-badge badge-draft">{item.page_key}</span></td>
                                        <td><strong>{item.section_key}</strong></td>
                                        <td style={{ maxWidth: '320px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--admin-text-secondary)' }}>
                                            {item.content_tr}
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
