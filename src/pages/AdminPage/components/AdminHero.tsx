import { useState, useEffect } from 'react';
import { supabase } from '../../../services/supabaseClient';
import { invalidateCmsCache } from '../../../hooks/useCmsContent';
import ImageUploader from './ImageUploader';
import {
    DEFAULT_FACADE_IMAGE,
    DEFAULT_HERO_CONFIG,
    HERO_PAN_OPTIONS,
    parseHeroConfig,
    type HeroConfig,
    type HeroInteriorSlide,
    type HeroPanVariant,
} from '../../../config/heroConfig';
import { ArrowUp, ArrowDown, Trash2, Plus, RotateCcw, Save, Check, Images } from 'lucide-react';
import '../../HomePage/HomePage.css';

export default function AdminHero() {
    const [config, setConfig] = useState<HeroConfig>(DEFAULT_HERO_CONFIG);
    const [rowId, setRowId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [savedSuccess, setSavedSuccess] = useState(false);
    const [venuePhotos, setVenuePhotos] = useState<{ label: string; url: string }[]>([]);
    const [pickerOpenForSlide, setPickerOpenForSlide] = useState<string | null>(null);

    const fetchHeroConfig = async () => {
        setLoading(true);
        try {
            const [cmsRes, venuesRes] = await Promise.all([
                supabase
                    .from('page_content')
                    .select('id, content_tr')
                    .eq('page_key', 'home')
                    .eq('section_key', 'hero_slides_config')
                    .maybeSingle(),
                supabase
                    .from('venue_events')
                    .select('title_tr, level, image_url, thumbnail_images')
                    .order('order_index', { ascending: true }),
            ]);

            if (cmsRes.data) {
                setRowId(cmsRes.data.id);
                setConfig(parseHeroConfig(cmsRes.data.content_tr));
            } else {
                setRowId(null);
                setConfig(DEFAULT_HERO_CONFIG);
            }

            if (venuesRes.data) {
                const photos: { label: string; url: string }[] = [];
                venuesRes.data.forEach((v: any) => {
                    const roomTitle = v.title_tr || `Kat ${v.level || ''}`;
                    if (v.image_url) {
                        photos.push({ label: `${roomTitle} (Ana Görsel)`, url: v.image_url });
                    }
                    if (Array.isArray(v.thumbnail_images)) {
                        v.thumbnail_images.forEach((thumb: string, idx: number) => {
                            if (thumb) {
                                photos.push({ label: `${roomTitle} — Kare ${idx + 1}`, url: thumb });
                            }
                        });
                    }
                });
                setVenuePhotos(photos);
            }
        } catch (err) {
            console.error('Hero ayarları yüklenirken hata:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHeroConfig();
    }, []);

    const handleSlideChange = (id: string, patch: Partial<HeroInteriorSlide>) => {
        setConfig((prev) => ({
            ...prev,
            slides: prev.slides.map((s) => (s.id === id ? { ...s, ...patch } : s)),
        }));
        setSavedSuccess(false);
    };

    const moveSlide = (index: number, direction: -1 | 1) => {
        const target = index + direction;
        if (target < 0 || target >= config.slides.length) return;
        const next = [...config.slides];
        const temp = next[index];
        next[index] = next[target];
        next[target] = temp;
        setConfig((prev) => ({ ...prev, slides: next }));
        setSavedSuccess(false);
    };

    const removeSlide = (id: string) => {
        if (config.slides.length <= 1) {
            alert('En az 1 iç mekân görseli bulunmalıdır.');
            return;
        }
        setConfig((prev) => ({
            ...prev,
            slides: prev.slides.filter((s) => s.id !== id),
        }));
        setSavedSuccess(false);
    };

    const addSlide = () => {
        const newIndex = config.slides.length + 1;
        const newSlide: HeroInteriorSlide = {
            id: `hero-slide-${Date.now()}`,
            label: `${newIndex}. Yeni İç Mekân Sahnesi`,
            src: venuePhotos[0]?.url || DEFAULT_HERO_CONFIG.slides[0].src,
            panVariant: 'pan-left',
        };
        setConfig((prev) => ({
            ...prev,
            slides: [...prev.slides, newSlide],
        }));
        setSavedSuccess(false);
    };

    const resetToDefaults = () => {
        if (window.confirm('Hero görsellerini ve pan yönlerini varsayılan kurulum ayarlarına döndürmek istiyor musunuz?')) {
            setConfig(DEFAULT_HERO_CONFIG);
            setSavedSuccess(false);
        }
    };

    const saveConfig = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        const validSlides = config.slides.filter((s) => s.src && s.src.trim().length > 0);
        if (validSlides.length === 0) {
            alert('HATA: Lütfen en az bir geçerli iç mekân görseli ekleyin.');
            return;
        }

        setSaving(true);
        setSavedSuccess(false);
        const serialized = JSON.stringify({
            ...config,
            slides: validSlides,
        });

        try {
            if (rowId) {
                const { error } = await supabase
                    .from('page_content')
                    .update({
                        content_tr: serialized,
                        content_en: serialized,
                        content_el: serialized,
                    })
                    .eq('id', rowId);
                if (error) throw error;
            } else {
                const { data, error } = await supabase
                    .from('page_content')
                    .insert([
                        {
                            page_key: 'home',
                            section_key: 'hero_slides_config',
                            content_tr: serialized,
                            content_en: serialized,
                            content_el: serialized,
                        },
                    ])
                    .select('id')
                    .single();
                if (error) throw error;
                if (data?.id) setRowId(data.id);
            }

            invalidateCmsCache('home');
            setSavedSuccess(true);
        } catch (err: any) {
            console.error('Hero ayarları kaydedilemedi:', err);
            alert('Hero ayarları kaydedilirken hata oluştu: ' + (err.message || err));
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="admin-loading">Hero ayarları yükleniyor…</div>;
    }

    const activeFacadePreview = config.facadeImageUrl || DEFAULT_FACADE_IMAGE;

    return (
        <div className="admin-module">
            <div className="admin-module-header" style={{ flexWrap: 'wrap', gap: '12px' }}>
                <div>
                    <h2>Ana Sayfa Hero Görselleri & Pan Yönetimi</h2>
                    <p style={{ fontSize: '0.88rem', color: 'var(--admin-text-muted)', marginTop: '4px' }}>
                        Açılan dış cephe kapı görselini, kapı açıldıktan sonra dönen iç mekân fotoğraflarını ve her fotoğrafın kamera hareket yönünü (Pan / Zoom) buradan yönetebilirsiniz.
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <button type="button" className="admin-btn-secondary" onClick={resetToDefaults} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <RotateCcw size={15} /> Varsayılana Dön
                    </button>
                    <button type="button" className="admin-btn-primary" onClick={() => saveConfig()} disabled={saving} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        {savedSuccess ? <Check size={16} /> : <Save size={16} />}
                        {saving ? 'Kaydediliyor…' : savedSuccess ? 'Kaydedildi!' : 'Değişiklikleri Kaydet'}
                    </button>
                </div>
            </div>

            {savedSuccess && (
                <div style={{ background: '#ecfdf5', border: '1px solid #10b981', color: '#065f46', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.9rem' }}>
                    ✓ Ana sayfa Hero görselleri ve pan yönleri başarıyla güncellendi. Ana sayfada anında aktif oldu.
                </div>
            )}

            {/* 1. DIŞ CEPHE (AÇILAN KAPI) VE SÜRE AYARLARI */}
            <div className="admin-form-card" style={{ marginBottom: '24px' }}>
                <div className="admin-form-card-header">
                    <h3>1. Dış Cephe (Açılan Kapı) Görseli & Geçiş Süresi</h3>
                </div>
                <div className="admin-form-row" style={{ alignItems: 'flex-start', gap: '24px' }}>
                    <div className="admin-form-group" style={{ flex: 2 }}>
                        <label>Dış Cephe Görseli (Ortadan ikiye açılarak iç mekâna geçiş yapan kapı görseli)</label>
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', flexWrap: 'wrap', marginTop: '8px' }}>
                            <div style={{ width: '240px', height: '135px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--admin-border)', position: 'relative', flexShrink: 0, background: '#111' }}>
                                <img src={activeFacadePreview} alt="Dış Cephe Önizleme" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
                                <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: '2px', background: 'rgba(255, 214, 140, 0.85)', boxShadow: '0 0 10px rgba(255,214,140,0.8)' }} />
                                <span style={{ position: 'absolute', bottom: '6px', left: '8px', background: 'rgba(0,0,0,0.7)', color: '#fff', fontSize: '11px', padding: '2px 8px', borderRadius: '4px' }}>
                                    {config.facadeImageUrl ? 'Özel Görsel' : 'Varsayılan Dış Cephe'}
                                </span>
                            </div>
                            <div style={{ flex: 1, minWidth: '240px' }}>
                                <ImageUploader
                                    value={config.facadeImageUrl}
                                    onChange={(url) => {
                                        setConfig((prev) => ({ ...prev, facadeImageUrl: url }));
                                        setSavedSuccess(false);
                                    }}
                                    folderPath="hero"
                                    maxWidth={1920}
                                />
                                {config.facadeImageUrl && (
                                    <button
                                        type="button"
                                        className="admin-btn-secondary"
                                        style={{ marginTop: '8px', fontSize: '12px', padding: '6px 12px' }}
                                        onClick={() => {
                                            setConfig((prev) => ({ ...prev, facadeImageUrl: '' }));
                                            setSavedSuccess(false);
                                        }}
                                    >
                                        Varsayılan Dış Cephe Görselini Kullan
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="admin-form-group" style={{ flex: 1, minWidth: '220px' }}>
                        <label>İç Mekân Sahne Geçiş Süresi (Saniye)</label>
                        <input
                            type="number"
                            min={3}
                            max={15}
                            step={0.5}
                            value={(config.slideDurationMs / 1000).toFixed(1)}
                            onChange={(e) => {
                                const sec = parseFloat(e.target.value);
                                if (!isNaN(sec)) {
                                    setConfig((prev) => ({ ...prev, slideDurationMs: Math.round(sec * 1000) }));
                                    setSavedSuccess(false);
                                }
                            }}
                        />
                        <p style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)', marginTop: '6px' }}>
                            Kapılar açıldıktan sonra her bir iç mekân fotoğrafının ekranda pan yaparak kalacağı süre (Önerilen: 6.0 – 7.5 saniye).
                        </p>
                    </div>
                </div>
            </div>

            {/* 2. İÇ MEKÂN SAHNELERİ & PAN YÖNLERİ */}
            <div className="admin-form-card">
                <div className="admin-form-card-header" style={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                        <h3>2. İç Mekân Sahneleri ve Pan (Kamera Hareketi) Yönleri ({config.slides.length} Sahne)</h3>
                    </div>
                    <button type="button" className="admin-btn-add" onClick={addSlide} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <Plus size={16} /> Yeni İç Mekân Sahnesi Ekle
                    </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {config.slides.map((slide, idx) => {
                        const selectedPanInfo = HERO_PAN_OPTIONS.find((o) => o.value === slide.panVariant) || HERO_PAN_OPTIONS[0];
                        const isPickerOpen = pickerOpenForSlide === slide.id;

                        return (
                            <div
                                key={slide.id}
                                style={{
                                    border: '1px solid var(--admin-border)',
                                    borderRadius: '10px',
                                    padding: '20px',
                                    background: 'var(--admin-surface)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '16px',
                                }}
                            >
                                {/* Top bar: Slide index, title, order & delete controls */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', borderBottom: '1px solid var(--admin-border)', paddingBottom: '12px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <span className="admin-badge badge-success" style={{ fontSize: '12px', padding: '4px 10px' }}>
                                            Sahne #{idx + 1}
                                        </span>
                                        <strong style={{ fontSize: '1rem' }}>{slide.label || `Sahne ${idx + 1}`}</strong>
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                        <button
                                            type="button"
                                            className="admin-btn-icon"
                                            disabled={idx === 0}
                                            onClick={() => moveSlide(idx, -1)}
                                            title="Yukarı Taşı"
                                            style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', opacity: idx === 0 ? 0.4 : 1 }}
                                        >
                                            <ArrowUp size={15} /> Yukarı
                                        </button>
                                        <button
                                            type="button"
                                            className="admin-btn-icon"
                                            disabled={idx === config.slides.length - 1}
                                            onClick={() => moveSlide(idx, 1)}
                                            title="Aşağı Taşı"
                                            style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', opacity: idx === config.slides.length - 1 ? 0.4 : 1 }}
                                        >
                                            <ArrowDown size={15} /> Aşağı
                                        </button>
                                        <button
                                            type="button"
                                            className="admin-btn-icon text-danger"
                                            onClick={() => removeSlide(slide.id)}
                                            title="Sahneyi Sil"
                                            style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                                        >
                                            <Trash2 size={15} /> Sil
                                        </button>
                                    </div>
                                </div>

                                {/* Main row: Live Pan Preview + Controls + Image Uploader */}
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', alignItems: 'start' }}>
                                    {/* Column 1: Live Animated Pan Preview */}
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px', color: 'var(--admin-text-secondary)' }}>
                                            Canlı Pan Önizlemesi ({selectedPanInfo.label})
                                        </label>
                                        <div
                                            className="hp-hero--open"
                                            style={{
                                                position: 'relative',
                                                width: '100%',
                                                aspectRatio: '16 / 9',
                                                borderRadius: '8px',
                                                overflow: 'hidden',
                                                background: '#0d0d0d',
                                                border: '1px solid var(--admin-border)',
                                                '--hero-pan-duration': '5500ms',
                                            } as React.CSSProperties}
                                        >
                                            {slide.src ? (
                                                <img
                                                    key={`${slide.src}-${slide.panVariant}`}
                                                    src={slide.src}
                                                    alt={slide.label}
                                                    className={`hp-hero__hall hp-hero__hall--active hp-hero__hall--${slide.panVariant}`}
                                                    style={{ animationIterationCount: 'infinite', animationDirection: 'alternate' }}
                                                />
                                            ) : (
                                                <div style={{ color: '#888', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '0.85rem' }}>
                                                    Görsel Seçilmedi
                                                </div>
                                            )}
                                            <span
                                                style={{
                                                    position: 'absolute',
                                                    bottom: '8px',
                                                    left: '8px',
                                                    background: 'rgba(0,0,0,0.72)',
                                                    color: '#fff',
                                                    fontSize: '11px',
                                                    padding: '3px 8px',
                                                    borderRadius: '4px',
                                                    zIndex: 2,
                                                }}
                                            >
                                                {selectedPanInfo.label}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Column 2: Label, Pan Direction & URL */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        <div className="admin-form-group" style={{ marginBottom: 0 }}>
                                            <label>Sahne Başlığı / Not (Yönetim Paneli İçin)</label>
                                            <input
                                                type="text"
                                                value={slide.label}
                                                onChange={(e) => handleSlideChange(slide.id, { label: e.target.value })}
                                                placeholder="Örn: 1. Büyük Salon — Genel Görünüm"
                                            />
                                        </div>

                                        <div className="admin-form-group" style={{ marginBottom: 0 }}>
                                            <label>Pan Yönü / Kamera Hareketi</label>
                                            <select
                                                value={slide.panVariant}
                                                onChange={(e) => handleSlideChange(slide.id, { panVariant: e.target.value as HeroPanVariant })}
                                            >
                                                {HERO_PAN_OPTIONS.map((opt) => (
                                                    <option key={opt.value} value={opt.value}>
                                                        {opt.label}
                                                    </option>
                                                ))}
                                            </select>
                                            <span style={{ display: 'block', fontSize: '0.78rem', color: 'var(--admin-text-muted)', marginTop: '4px' }}>
                                                {selectedPanInfo.desc}
                                            </span>
                                        </div>

                                        <div className="admin-form-group" style={{ marginBottom: 0 }}>
                                            <label>Görsel URL veya Salon Galerisinden Seçim</label>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <input
                                                    type="text"
                                                    value={slide.src}
                                                    onChange={(e) => handleSlideChange(slide.id, { src: e.target.value })}
                                                    placeholder="https://..."
                                                    style={{ flex: 1 }}
                                                />
                                                {venuePhotos.length > 0 && (
                                                    <button
                                                        type="button"
                                                        className="admin-btn-secondary"
                                                        onClick={() => setPickerOpenForSlide(isPickerOpen ? null : slide.id)}
                                                        style={{ whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '0 12px' }}
                                                    >
                                                        <Images size={15} /> {isPickerOpen ? 'Galeriyi Kapat' : 'Salondan Seç'}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Column 3: Upload New Image */}
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px', color: 'var(--admin-text-secondary)' }}>
                                            Bilgisayardan Yeni Görsel Yükle
                                        </label>
                                        <ImageUploader
                                            value={slide.src}
                                            onChange={(url) => handleSlideChange(slide.id, { src: url })}
                                            folderPath="hero"
                                            maxWidth={1920}
                                        />
                                    </div>
                                </div>

                                {/* Optional Quick Picker from Existing Venue Photos */}
                                {isPickerOpen && venuePhotos.length > 0 && (
                                    <div style={{ borderTop: '1px solid var(--admin-border)', paddingTop: '14px', marginTop: '4px' }}>
                                        <div style={{ fontSize: '0.82rem', fontWeight: 600, marginBottom: '10px', color: 'var(--admin-text-secondary)' }}>
                                            Mevcut Salon Fotoğraflarından Seçin (Tıkladığınız görsel bu sahneye atanır):
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '10px', maxHeight: '240px', overflowY: 'auto', padding: '4px' }}>
                                            {venuePhotos.map((vp) => {
                                                const isSelected = slide.src === vp.url;
                                                return (
                                                    <button
                                                        key={vp.url}
                                                        type="button"
                                                        onClick={() => {
                                                            handleSlideChange(slide.id, { src: vp.url });
                                                            setPickerOpenForSlide(null);
                                                        }}
                                                        style={{
                                                            border: isSelected ? '2px solid #c5a059' : '1px solid var(--admin-border)',
                                                            borderRadius: '6px',
                                                            overflow: 'hidden',
                                                            padding: 0,
                                                            background: 'var(--admin-bg)',
                                                            cursor: 'pointer',
                                                            textAlign: 'left',
                                                        }}
                                                    >
                                                        <img src={vp.url} alt={vp.label} style={{ width: '100%', height: '76px', objectFit: 'cover', display: 'block' }} loading="lazy" />
                                                        <div style={{ fontSize: '10px', padding: '4px 6px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--admin-text)' }}>
                                                            {vp.label}
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                <div className="admin-form-actions" style={{ marginTop: '24px' }}>
                    <button type="button" className="admin-btn-secondary" onClick={addSlide} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <Plus size={16} /> Yeni İç Mekân Sahnesi Ekle
                    </button>
                    <button type="button" className="admin-btn-primary" onClick={() => saveConfig()} disabled={saving} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <Save size={16} /> {saving ? 'Kaydediliyor…' : 'Hero Ayarlarını Kaydet'}
                    </button>
                </div>
            </div>
        </div>
    );
}
