import React, { useState, useEffect } from 'react';
import { supabase } from '../../../services/supabaseClient';
import { Play, CheckCircle, XCircle, Clock, Plus, Edit2, Trash2, Copy, ArrowLeft, AlertCircle } from 'lucide-react';
import './AdminForms.css';

interface AdminTestPlansProps {
    sessionEmail: string;
}

interface TestCase {
    id: string;
    is_plan: boolean;
    title: string;
    description: string | null;
    target_module: string;
    status: string;
    plan_id: string | null;
    steps: string | null;
    expected_result: string | null;
    target_language: string;
    result: string;
    notes: string | null;
    executed_at: string | null;
    executed_by: string | null;
    sort_order: number;
    created_at: string;
}

export default function AdminTestPlans({ sessionEmail }: AdminTestPlansProps) {
    const [view, setView] = useState<'list' | 'plan_form' | 'detail' | 'case_form' | 'execution'>('list');

    // Data State
    const [plans, setPlans] = useState<TestCase[]>([]);
    const [cases, setCases] = useState<TestCase[]>([]);
    const [loading, setLoading] = useState(true);

    // Current selection
    const [currentPlan, setCurrentPlan] = useState<TestCase | null>(null);
    const [currentCase, setCurrentCase] = useState<TestCase | null>(null);

    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [filterModule, setFilterModule] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');

    // Forms
    const [planForm, setPlanForm] = useState({ title: '', description: '', target_module: 'artifacts', status: 'draft' });
    const [caseForm, setCaseForm] = useState({ title: '', steps: '', expected_result: '', target_language: 'all', sort_order: 0 });
    const [executionForm, setExecutionForm] = useState({ result: 'pending', notes: '' });

    useEffect(() => {
        if (view === 'list') {
            fetchPlans();
        } else if (view === 'detail' && currentPlan) {
            fetchCases(currentPlan.id);
        }
    }, [view, currentPlan]);

    const fetchPlans = async () => {
        setLoading(true);
        let query = supabase.from('test_cases').select('*').eq('is_plan', true).order('created_at', { ascending: false });

        if (filterModule !== 'all') query = query.eq('target_module', filterModule);
        if (filterStatus !== 'all') query = query.eq('status', filterStatus);

        const { data, error } = await query;
        if (!error && data) {
            const list = data;
            if (searchTerm) {
                const lower = searchTerm.toLowerCase();
                setPlans(list.filter(p => p.title.toLowerCase().includes(lower)));
            } else {
                setPlans(list);
            }
        }
        setLoading(false);
    };

    const fetchCases = async (planId: string) => {
        setLoading(true);
        const { data, error } = await supabase.from('test_cases')
            .select('*')
            .eq('plan_id', planId)
            .eq('is_plan', false)
            .order('sort_order', { ascending: true })
            .order('created_at', { ascending: true });

        if (!error && data) {
            setCases(data);
        }
        setLoading(false);
    };

    // --- PLAN CRUD ---
    const handleSavePlan = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const payload = { ...planForm, is_plan: true };

        try {
            if (currentPlan) {
                const { error } = await supabase.from('test_cases').update(payload).eq('id', currentPlan.id);
                if (error) throw error;
            } else {
                const { error } = await supabase.from('test_cases').insert([payload]);
                if (error) throw error;
            }
            setView('list');
        } catch (err: any) {
            alert(`HATA: Plan kaydedilemedi: ${err.message}`);
        }
        setLoading(false);
    };

    const deletePlan = async (id: string) => {
        if (!window.confirm('Bu test planını ve içindeki tüm testleri silmek istediğinize emin misiniz?')) return;
        setLoading(true);
        try {
            await supabase.from('test_cases').delete().eq('plan_id', id);
            await supabase.from('test_cases').delete().eq('id', id);
            fetchPlans();
        } catch (err: any) {
            alert(`HATA: ${err.message}`);
        }
        setLoading(false);
    };

    const duplicatePlan = async (plan: TestCase) => {
        setLoading(true);
        try {
            // 1. Insert new plan
            const newPlanPayload = {
                is_plan: true,
                title: `${plan.title} (Kopya)`,
                description: plan.description,
                target_module: plan.target_module,
                status: 'draft'
            };
            const { data: insertedPlan, error: planErr } = await supabase.from('test_cases').insert([newPlanPayload]).select().single();
            if (planErr) throw planErr;

            // 2. Fetch original cases
            const { data: origCases } = await supabase.from('test_cases').select('*').eq('plan_id', plan.id).eq('is_plan', false);

            // 3. Insert copied cases
            if (origCases && origCases.length > 0) {
                const newCases = origCases.map(c => ({
                    is_plan: false,
                    plan_id: insertedPlan.id,
                    title: c.title,
                    steps: c.steps,
                    expected_result: c.expected_result,
                    target_language: c.target_language,
                    sort_order: c.sort_order,
                    result: 'pending'
                }));
                await supabase.from('test_cases').insert(newCases);
            }
            fetchPlans();
        } catch (err: any) {
            alert(`Kopyalama Hatası: ${err.message}`);
        }
        setLoading(false);
    };

    // --- CASE CRUD ---
    const handleSaveCase = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const payload = { ...caseForm, plan_id: currentPlan?.id, is_plan: false };

        try {
            if (currentCase) {
                const { error } = await supabase.from('test_cases').update(payload).eq('id', currentCase.id);
                if (error) throw error;
            } else {
                const { error } = await supabase.from('test_cases').insert([payload]);
                if (error) throw error;
            }
            setView('detail');
        } catch (err: any) {
            alert(`HATA: Test kaydedilemedi: ${err.message}`);
        }
        setLoading(false);
    };

    const deleteCase = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!window.confirm('Bu testi silmek istediğinize emin misiniz?')) return;
        setLoading(true);
        try {
            await supabase.from('test_cases').delete().eq('id', id);
            if (currentPlan) fetchCases(currentPlan.id);
        } catch (err: any) {
            alert(`HATA: ${err.message}`);
        }
        setLoading(false);
    };

    // --- EXECUTION ---
    const handleExecute = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const payload = {
            result: executionForm.result,
            notes: executionForm.notes,
            executed_by: sessionEmail,
            executed_at: new Date().toISOString()
        };

        try {
            const { error } = await supabase.from('test_cases').update(payload).eq('id', currentCase?.id);
            if (error) throw error;
            setView('detail');
        } catch (err: any) {
            alert(`Sonuç kaydedilemedi: ${err.message}`);
        }
        setLoading(false);
    };


    // --- RENDER HELPERS ---
    const renderResultBadge = (result: string) => {
        switch (result) {
            case 'pass': return <span className="admin-status status-published"><CheckCircle size={14} /> Geçti</span>;
            case 'fail': return <span className="admin-status status-error"><XCircle size={14} /> Kaldı</span>;
            case 'blocked': return <span className="admin-status status-error" style={{ background: '#ffebee' }}><XCircle size={14} /> Engelli</span>;
            default: return <span className="admin-status status-draft"><Clock size={14} /> Beklemede</span>;
        }
    };

    const getModuleLabel = (mod: string) => {
        const labels: Record<string, string> = {
            artifacts: 'Arşiv Eserleri', events: 'Etkinlikler', venue: 'Mekan',
            history: 'Tarihçe', istanbul_rum: 'İstanbul Rumları', categories: 'Kategoriler',
            content: 'İçerik', all: 'Tümü'
        };
        return labels[mod] || mod;
    };

    // views
    if (view === 'list') {
        return (
            <div className="admin-module-container">
                <div className="admin-module-header">
                    <h2>QA Test Planları</h2>
                    <button className="admin-btn-primary" onClick={() => {
                        setCurrentPlan(null);
                        setPlanForm({ title: '', description: '', target_module: 'artifacts', status: 'draft' });
                        setView('plan_form');
                    }}>
                        <Plus size={18} /> Yeni Plan
                    </button>
                </div>

                <div className="admin-filter-bar">
                    <input
                        type="text"
                        placeholder="Plan ara..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="admin-search-input"
                    />
                    <select value={filterModule} onChange={e => setFilterModule(e.target.value)} className="admin-filter-select">
                        <option value="all">Tüm Modüller</option>
                        <option value="artifacts">Arşiv Eserleri</option>
                        <option value="events">Etkinlikler</option>
                        <option value="venue">Mekan</option>
                        <option value="history">Tarihçe</option>
                        <option value="istanbul_rum">İst Rumları</option>
                        <option value="categories">Kategoriler</option>
                        <option value="content">İçerik</option>
                    </select>
                    <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="admin-filter-select">
                        <option value="all">Tüm Durumlar</option>
                        <option value="draft">Taslak</option>
                        <option value="in_progress">Devam Ediyor</option>
                        <option value="completed">Tamamlandı</option>
                    </select>
                    <button className="admin-btn-secondary" onClick={fetchPlans}>Ara</button>
                </div>

                {loading ? <div className="admin-loading">Yükleniyor...</div> : (
                    <div className="admin-table-container">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Plan Adı</th>
                                    <th>Modül</th>
                                    <th>Durum</th>
                                    <th>Tarih</th>
                                    <th className="text-right">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody>
                                {plans.map(p => (
                                    <tr key={p.id} className="admin-table-row-clickable" onClick={() => { setCurrentPlan(p); setView('detail'); }}>
                                        <td className="font-medium">{p.title}</td>
                                        <td><span className="admin-badge">{getModuleLabel(p.target_module)}</span></td>
                                        <td>
                                            <span className={`admin-status status-${p.status === 'draft' ? 'draft' : 'published'}`}>
                                                {p.status === 'draft' ? 'Taslak' : p.status === 'in_progress' ? 'Devam Ediyor' : 'Tamamlandı'}
                                            </span>
                                        </td>
                                        <td>{new Date(p.created_at).toLocaleDateString('tr-TR')}</td>
                                        <td className="text-right" onClick={e => e.stopPropagation()}>
                                            <div className="admin-row-actions">
                                                <button className="admin-icon-btn" title="Kopyala" onClick={() => duplicatePlan(p)}><Copy size={16} /></button>
                                                <button className="admin-icon-btn" title="Düzenle" onClick={() => {
                                                    setCurrentPlan(p);
                                                    setPlanForm({ title: p.title, description: p.description || '', target_module: p.target_module, status: p.status });
                                                    setView('plan_form');
                                                }}><Edit2 size={16} /></button>
                                                <button className="admin-icon-btn text-danger" title="Sil" onClick={() => deletePlan(p.id)}><Trash2 size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        );
    }

    if (view === 'plan_form') {
        return (
            <div className="admin-form-wrapper">
                <div className="admin-form-header">
                    <button className="admin-back-btn" onClick={() => setView('list')}><ArrowLeft size={18} /> Geri</button>
                    <h2>{currentPlan ? 'Planı Düzenle' : 'Yeni Test Planı'}</h2>
                </div>
                <form onSubmit={handleSavePlan} className="admin-form-grid">
                    <div className="admin-input-group full-width">
                        <label>Plan Adı (Zorunlu)</label>
                        <input type="text" value={planForm.title} onChange={e => setPlanForm({ ...planForm, title: e.target.value })} required />
                    </div>
                    <div className="admin-input-group">
                        <label>Hedef Modül</label>
                        <select value={planForm.target_module} onChange={e => setPlanForm({ ...planForm, target_module: e.target.value })}>
                            <option value="artifacts">Arşiv Eserleri</option>
                            <option value="events">Etkinlikler</option>
                            <option value="venue">Mekan</option>
                            <option value="history">Tarihçe</option>
                            <option value="istanbul_rum">İst Rumları</option>
                            <option value="categories">Kategoriler</option>
                            <option value="content">Sayfa İçerikleri</option>
                            <option value="all">Genel / Tümü</option>
                        </select>
                    </div>
                    <div className="admin-input-group">
                        <label>Durum</label>
                        <select value={planForm.status} onChange={e => setPlanForm({ ...planForm, status: e.target.value })}>
                            <option value="draft">Taslak</option>
                            <option value="in_progress">Devam Ediyor</option>
                            <option value="completed">Tamamlandı</option>
                        </select>
                    </div>
                    <div className="admin-input-group full-width">
                        <label>Açıklama / Hedef</label>
                        <textarea rows={3} value={planForm.description} onChange={e => setPlanForm({ ...planForm, description: e.target.value })} />
                    </div>
                    <div className="admin-form-actions full-width">
                        <button type="button" className="admin-btn-secondary" onClick={() => setView('list')}>İptal</button>
                        <button type="submit" className="admin-btn-primary" disabled={loading}>
                            {loading ? 'Kaydediliyor...' : 'Kaydet'}
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    if (view === 'detail' && currentPlan) {
        const passCount = cases.filter(c => c.result === 'pass').length;
        const totalCount = cases.length;
        const progPct = totalCount > 0 ? Math.round((passCount / totalCount) * 100) : 0;

        return (
            <div className="admin-module-container">
                <div className="admin-module-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <button className="admin-icon-btn" onClick={() => setView('list')}><ArrowLeft size={20} /></button>
                        <div>
                            <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                📋 {currentPlan.title}
                                <span className={`admin-status status-${currentPlan.status === 'draft' ? 'draft' : 'published'}`} style={{ fontSize: '0.7em' }}>
                                    {currentPlan.status}
                                </span>
                            </h2>
                            <p style={{ margin: 0, color: 'var(--admin-text-muted)', fontSize: '0.9rem' }}>{getModuleLabel(currentPlan.target_module)} • {currentPlan.description}</p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="admin-btn-secondary" onClick={() => {
                            setCurrentPlan(currentPlan);
                            setPlanForm({ title: currentPlan.title, description: currentPlan.description || '', target_module: currentPlan.target_module, status: currentPlan.status });
                            setView('plan_form');
                        }}>Düzenle</button>
                    </div>
                </div>

                <div className="admin-dashboard-welcome" style={{ padding: '16px', marginTop: '16px', background: 'var(--admin-bg-light)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <strong>İlerleme: {passCount} / {totalCount} Test Geçti</strong>
                        <span>%{progPct}</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: 'var(--admin-border)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${progPct}%`, height: '100%', background: 'var(--admin-primary)', transition: 'width 0.3s' }} />
                    </div>
                </div>

                <div className="admin-module-header" style={{ marginTop: '24px', paddingBottom: '12px', borderBottom: '1px solid var(--admin-border)' }}>
                    <h3>Test Senaryoları</h3>
                    <button className="admin-btn-primary" onClick={() => {
                        setCurrentCase(null);
                        setCaseForm({ title: '', steps: '', expected_result: '', target_language: 'all', sort_order: (cases.length + 1) * 10 });
                        setView('case_form');
                    }}>
                        <Plus size={16} /> Yeni Test Ekle
                    </button>
                </div>

                {loading ? <div className="admin-loading">Yükleniyor...</div> : (
                    <div className="admin-table-container">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th style={{ width: '50px' }}>#</th>
                                    <th>Test Adı</th>
                                    <th>Dil</th>
                                    <th>Sonuç</th>
                                    <th className="text-right">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cases.length === 0 ? (
                                    <tr><td colSpan={5} className="text-center" style={{ padding: '32px', color: 'var(--admin-text-muted)' }}>Henüz test eklenmemiş.</td></tr>
                                ) : cases.map((c, idx) => (
                                    <tr key={c.id}>
                                        <td>{idx + 1}</td>
                                        <td className="font-medium">{c.title}</td>
                                        <td><span className="admin-badge">{c.target_language.toUpperCase()}</span></td>
                                        <td>{renderResultBadge(c.result)}</td>
                                        <td className="text-right">
                                            <div className="admin-row-actions">
                                                <button className="admin-btn-primary" style={{ padding: '4px 12px', fontSize: '0.85rem' }} onClick={() => {
                                                    setCurrentCase(c);
                                                    setExecutionForm({ result: c.result !== 'pending' ? c.result : 'pass', notes: c.notes || '' });
                                                    setView('execution');
                                                }}><Play size={14} /> Çalıştır</button>
                                                <button className="admin-icon-btn" onClick={() => {
                                                    setCurrentCase(c);
                                                    setCaseForm({ title: c.title, steps: c.steps || '', expected_result: c.expected_result || '', target_language: c.target_language, sort_order: c.sort_order });
                                                    setView('case_form');
                                                }}><Edit2 size={16} /></button>
                                                <button className="admin-icon-btn text-danger" onClick={(e) => deleteCase(c.id, e)}><Trash2 size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        );
    }

    if (view === 'case_form') {
        return (
            <div className="admin-form-wrapper">
                <div className="admin-form-header">
                    <button className="admin-back-btn" onClick={() => setView('detail')}><ArrowLeft size={18} /> Geri</button>
                    <h2>{currentCase ? 'Testi Düzenle' : 'Yeni Test'}</h2>
                </div>
                <form onSubmit={handleSaveCase} className="admin-form-grid">
                    <div className="admin-input-group full-width">
                        <label>Test Adı / Özeti (Zorunlu)</label>
                        <input type="text" value={caseForm.title} onChange={e => setCaseForm({ ...caseForm, title: e.target.value })} required placeholder="Örn: Kapak görseli olmadan kaydetmeyi dene" />
                    </div>
                    <div className="admin-input-group full-width">
                        <label>Test Adımları</label>
                        <textarea rows={4} value={caseForm.steps} onChange={e => setCaseForm({ ...caseForm, steps: e.target.value })} placeholder="1. Formu aç&#10;2. Görsel eklemeden Başlık yaz&#10;3. Kaydet'e bas" />
                    </div>
                    <div className="admin-input-group full-width">
                        <label>Beklenen Sonuç (Zorunlu)</label>
                        <textarea rows={2} value={caseForm.expected_result} onChange={e => setCaseForm({ ...caseForm, expected_result: e.target.value })} required placeholder="HATA uyarısı çıkmalı ve kayıt olmamalı." />
                    </div>
                    <div className="admin-input-group">
                        <label>Hedef Dil</label>
                        <select value={caseForm.target_language} onChange={e => setCaseForm({ ...caseForm, target_language: e.target.value })}>
                            <option value="all">Tümü (Tasarım/Genel)</option>
                            <option value="tr">Türkçe (TR)</option>
                            <option value="en">İngilizce (EN)</option>
                            <option value="el">Yunanca (EL)</option>
                        </select>
                    </div>
                    <div className="admin-input-group">
                        <label>Öncelik / Sıra Sayısı</label>
                        <input type="number" value={caseForm.sort_order} onChange={e => setCaseForm({ ...caseForm, sort_order: Number(e.target.value) })} />
                    </div>
                    <div className="admin-form-actions full-width">
                        <button type="button" className="admin-btn-secondary" onClick={() => setView('detail')}>İptal</button>
                        <button type="submit" className="admin-btn-primary" disabled={loading}>
                            {loading ? 'Kaydediliyor...' : 'Kaydet'}
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    if (view === 'execution' && currentCase) {
        return (
            <div className="admin-form-wrapper" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div className="admin-form-header">
                    <button className="admin-back-btn" onClick={() => setView('detail')}><ArrowLeft size={18} /> Geri</button>
                    <h2>Testi Çalıştır: {currentCase.title}</h2>
                </div>

                <div style={{ background: 'var(--admin-bg-light)', padding: '24px', borderRadius: '12px', marginBottom: '24px', border: '1px solid var(--admin-border)' }}>
                    <div style={{ marginBottom: '16px' }}>
                        <h4 style={{ margin: '0 0 8px', color: 'var(--admin-text-muted)', textTransform: 'uppercase', fontSize: '0.8rem' }}>Test Adımları</h4>
                        <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>{currentCase.steps || 'Adım belirtilmemiş. Özete göre test edin.'}</div>
                    </div>
                    <div style={{ padding: '16px', background: '#fff', borderLeft: '4px solid var(--admin-primary)', borderRadius: '0 8px 8px 0' }}>
                        <h4 style={{ margin: '0 0 8px', color: 'var(--admin-primary)' }}>Beklenen Sonuç:</h4>
                        <div style={{ fontWeight: '500' }}>{currentCase.expected_result}</div>
                    </div>
                </div>

                <form onSubmit={handleExecute} className="admin-form-grid">
                    <div className="admin-input-group full-width">
                        <label>Test Sonucu (Durum)</label>
                        <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '12px 24px', border: '1px solid var(--admin-border)', borderRadius: '8px', background: executionForm.result === 'pass' ? '#e8f5e9' : 'transparent' }}>
                                <input type="radio" name="result" value="pass" checked={executionForm.result === 'pass'} onChange={(e) => setExecutionForm({ ...executionForm, result: e.target.value })} />
                                <CheckCircle color="#2e7d32" size={18} /> Başarılı (Geçti)
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '12px 24px', border: '1px solid var(--admin-border)', borderRadius: '8px', background: executionForm.result === 'fail' ? '#ffebee' : 'transparent' }}>
                                <input type="radio" name="result" value="fail" checked={executionForm.result === 'fail'} onChange={(e) => setExecutionForm({ ...executionForm, result: e.target.value })} />
                                <XCircle color="#c62828" size={18} /> Başarısız (Kaldı)
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '12px 24px', border: '1px solid var(--admin-border)', borderRadius: '8px' }}>
                                <input type="radio" name="result" value="blocked" checked={executionForm.result === 'blocked'} onChange={(e) => setExecutionForm({ ...executionForm, result: e.target.value })} />
                                <AlertCircle color="#ef6c00" size={18} /> Bloke / Engelli
                            </label>
                        </div>
                    </div>
                    <div className="admin-input-group full-width" style={{ marginTop: '16px' }}>
                        <label>Notlar ve Bulgular (Opsiyonel)</label>
                        <textarea rows={4} value={executionForm.notes} onChange={e => setExecutionForm({ ...executionForm, notes: e.target.value })} placeholder="Örn: Hata mesajı çıktı ama rengi kırmızı değildi..." />
                    </div>
                    <div className="admin-form-actions full-width" style={{ marginTop: '24px' }}>
                        <button type="button" className="admin-btn-secondary" onClick={() => setView('detail')}>İptal</button>
                        <button type="submit" className="admin-btn-primary" disabled={loading} style={{ fontSize: '1.1rem', padding: '12px 32px' }}>
                            {loading ? 'Kaydediliyor...' : 'Sonucu Kaydet'}
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    return null;
}
