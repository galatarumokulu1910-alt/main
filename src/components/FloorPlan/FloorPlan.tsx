import { useState, useEffect } from 'react';
import { Utensils, Users, Wine } from 'lucide-react';
import { useI18n } from '../../i18n/I18nContext';
import { supabase } from '../../services/supabaseClient';
import './FloorPlan.css';

/* ──────────────── Types ──────────────── */
interface Room {
    id: string;
    name: string;
    nameTr: string;
    nameEl: string;
    level: number;
    area: string;
    images: string[];       // [main, thumb1, thumb2, ...]
    features: string[];
    featuresTr: string[];
    featuresEl: string[];
    capacities: { gala: number; theater: number; cocktail: number; };
    path: string;
    labelX: number;
    labelY: number;
    floorPlanSvgUrl?: string;
}

/* Fallback data while DB loads or if empty */
const fallbackRooms: Room[] = [
    {
        id: 'grand-hall',
        name: 'The Grand Hall', nameTr: 'Büyük Salon', nameEl: 'Μεγάλη Αίθουσα',
        level: 1, area: '227 + 100 m²',
        images: [],
        features: ['Acoustic Treatment', 'Integrated Lighting Rig', 'Climate Controlled', 'Mezzanine: 60 + 22 m²'],
        featuresTr: ['Akustik Düzenleme', 'Entegre Aydınlatma Sistemi', 'İklim Kontrollü', 'Asma Kat: 60 + 22 m²'],
        featuresEl: ['Ακουστική Επεξεργασία', 'Ολοκληρωμένο Σύστημα Φωτισμού', 'Κλιματισμός', 'Ημιώροφος: 60 + 22 m²'],
        capacities: { gala: 400, theater: 600, cocktail: 800 },
        path: 'M 60 80 L 440 80 L 440 320 L 60 320 Z', labelX: 250, labelY: 200,
    },
    {
        id: 'exhibition-hall-2',
        name: 'Exhibition Hall + Foyer', nameTr: 'Sergi Salonu + Fuaye', nameEl: 'Αίθουσα Εκθέσεων + Φουαγιέ',
        level: 2, area: '275 m²',
        images: [],
        features: ['Acoustic Treatment', 'Integrated Lighting Rig', 'Climate Controlled'],
        featuresTr: ['Akustik Düzenleme', 'Entegre Aydınlatma Sistemi', 'İklim Kontrollü'],
        featuresEl: ['Ακουστική Επεξεργασία', 'Ολοκληρωμένο Σύστημα Φωτισμού', 'Κλιματισμός'],
        capacities: { gala: 300, theater: 450, cocktail: 600 },
        path: 'M 60 80 L 300 80 L 300 180 L 440 180 L 440 380 L 60 380 Z', labelX: 250, labelY: 240,
    },
    {
        id: 'exhibition-hall-3',
        name: 'Exhibition Hall + Foyer', nameTr: 'Sergi Salonu + Fuaye', nameEl: 'Αίθουσα Εκθέσεων + Φουαγιέ',
        level: 3, area: '458 m²',
        images: [],
        features: ['Acoustic Treatment', 'Integrated Lighting Rig', 'Climate Controlled'],
        featuresTr: ['Akustik Düzenleme', 'Entegre Aydınlatma Sistemi', 'İklim Kontrollü'],
        featuresEl: ['Ακουστική Επεξεργασία', 'Ολοκληρωμένο Σύστημα Φωτισμού', 'Κλιματισμός'],
        capacities: { gala: 300, theater: 450, cocktail: 600 },
        path: 'M 120 100 L 380 100 L 380 220 L 440 220 L 440 340 L 120 340 L 120 220 L 60 220 L 60 160 L 120 160 Z', labelX: 250, labelY: 230,
    },
];

/* ══════════════════════════════════════════════════════════════
   FLOOR PLAN COMPONENT
   ══════════════════════════════════════════════════════════════ */
interface FloorPlanProps {
    initialVenues?: any[];
    externalLoading?: boolean;
}

export default function FloorPlan({ initialVenues, externalLoading }: FloorPlanProps = {}) {
    const { t, lang } = useI18n();
    const l = lang || 'en';
    const levelLabel = (lvl: number) => l === 'tr' ? `Kat ${lvl}` : l === 'el' ? `Όροφος ${lvl}` : `Level ${lvl}`;

    const [rooms, setRooms] = useState<Room[]>(fallbackRooms);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [activeLevel, setActiveLevel] = useState(1);
    const [photoIndex, setPhotoIndex] = useState(0);

    useEffect(() => {
        const mapVenuesToRooms = (data: any[]) => {
            const mapped: Room[] = data
                .filter(v => v.level)
                .map(v => ({
                    id: v.id,
                    name: v.title_en || v.title_tr,
                    nameTr: v.title_tr,
                    nameEl: v.title_el || v.title_en,
                    level: v.level,
                    area: v.area || '',
                    images: [v.image_url, ...(v.thumbnail_images || [])].filter(Boolean),
                    features: v.features_en || [],
                    featuresTr: v.features_tr || [],
                    featuresEl: v.features_el || [],
                    capacities: {
                        gala: v.gala_capacity || 0,
                        theater: v.theater_capacity || 0,
                        cocktail: v.cocktail_capacity || 0,
                    },
                    path: v.svg_path || fallbackRooms.find(r => r.level === v.level)?.path || '',
                    labelX: v.label_x || 250,
                    labelY: v.label_y || 200,
                    floorPlanSvgUrl: v.floor_plan_svg_url,
                }));

            if (mapped.length > 0) {
                setRooms(mapped);
            }
        };

        if (initialVenues !== undefined) {
            if (!externalLoading) {
                if (initialVenues.length > 0) {
                    mapVenuesToRooms(initialVenues);
                }
                setDataLoaded(true);
            }
            return;
        }

        const fetchVenues = async () => {
            const { data } = await supabase
                .from('venue_events')
                .select('*')
                .eq('status', 'published')
                .order('order_index', { ascending: true });

            if (data && data.length > 0) {
                mapVenuesToRooms(data);
            }
            setDataLoaded(true);
        };
        fetchVenues();
    }, [initialVenues, externalLoading]);

    const currentRoom = rooms.find(r => r.level === activeLevel) ?? rooms[0];

    const getFeatures = () => {
        if (!currentRoom) return [];
        if (l === 'tr') return currentRoom.featuresTr.length ? currentRoom.featuresTr : currentRoom.features;
        if (l === 'el') return currentRoom.featuresEl.length ? currentRoom.featuresEl : currentRoom.features;
        return currentRoom.features;
    };

    const getRoomName = (room: Room) => {
        if (l === 'tr') return room.nameTr || room.name;
        if (l === 'el') return room.nameEl || room.name;
        return room.name;
    };

    const availableLevels = rooms.map(r => r.level).sort();

    const heroImage = rooms.find(r => r.images.length > 0)?.images[0] ?? 'https://tvloakrlqazcadokliaf.supabase.co/storage/v1/object/public/media/venue/mz81jyod0nq_1773083709418.webp';

    const hero = (
        <div className="floor-plan-hero">
            <img className="floor-plan-hero__bg" src={heroImage} alt="" aria-hidden="true" fetchPriority="high" />
            <div className="floor-plan-hero__inner">
                <p className="floor-plan-hero__badge">{t('venue.badge')}</p>
                <h1 className="floor-plan-hero__title">{t('venue.title')}</h1>
                <p className="floor-plan-hero__subtitle">{t('venue.subtitle')}</p>
            </div>
        </div>
    );

    if (!dataLoaded) {
        return (
            <section className="floor-plan-section">
                {hero}
            </section>
        );
    }

    return (
        <section className="floor-plan-section">
            {hero}

            <div className="floor-plan-container">
                {/* ── Level Tabs ── */}
                <div className="floor-plan-tabs">
                    <h2 className="floor-plan-tabs__heading">{t('venue.floorPlans')}</h2>
                    <div className="floor-plan-tabs__row">
                        {availableLevels.map(level => {
                            const room = rooms.find(r => r.level === level);
                            return (
                                <button
                                    key={level}
                                    type="button"
                                    aria-pressed={activeLevel === level}
                                    className={`floor-plan-tab ${activeLevel === level ? 'floor-plan-tab--active' : ''}`}
                                    onClick={() => { setActiveLevel(level); setPhotoIndex(0); }}
                                >
                                    <span className="floor-plan-tab__level">{levelLabel(level)}</span>
                                    <span className="floor-plan-tab__name">{room ? getRoomName(room) : ''}</span>
                                    {room?.area && <span className="floor-plan-tab__area">{room.area}</span>}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* ── Venue Photo Carousel ── */}
                {currentRoom && (
                    <div className="floor-plan-carousel">
                        <div className="floor-plan-carousel__track">
                            {currentRoom.images.length > 0 ? (
                                <img
                                    key={`${activeLevel}-${photoIndex}`}
                                    src={currentRoom.images[photoIndex]}
                                    alt={`${getRoomName(currentRoom)} — ${photoIndex + 1}`}
                                    className="floor-plan-carousel__img"
                                    width="800"
                                    height="450"
                                />
                            ) : (
                                <div className="floor-plan-carousel__img" style={{ background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
                                    {l === 'tr' ? 'Bu salonun fotoğrafı henüz eklenmedi' : l === 'el' ? 'Δεν υπάρχει ακόμη φωτογραφία' : 'No photo of this space yet'}
                                </div>
                            )}
                        </div>

                        {currentRoom.images.length > 1 && (
                            <>
                                <button
                                    className="floor-plan-carousel__arrow floor-plan-carousel__arrow--prev"
                                    onClick={() => setPhotoIndex(i => (i - 1 + currentRoom.images.length) % currentRoom.images.length)}
                                    type="button"
                                    aria-label={l === 'tr' ? 'Önceki fotoğraf' : l === 'el' ? 'Προηγούμενη φωτογραφία' : 'Previous photo'}
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="15 18 9 12 15 6" />
                                    </svg>
                                </button>
                                <button
                                    className="floor-plan-carousel__arrow floor-plan-carousel__arrow--next"
                                    onClick={() => setPhotoIndex(i => (i + 1) % currentRoom.images.length)}
                                    type="button"
                                    aria-label={l === 'tr' ? 'Sonraki fotoğraf' : l === 'el' ? 'Επόμενη φωτογραφία' : 'Next photo'}
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="9 18 15 12 9 6" />
                                    </svg>
                                </button>
                                <div className="floor-plan-carousel__dots">
                                    {currentRoom.images.map((_, i) => (
                                        <button
                                            key={i}
                                            className={`floor-plan-carousel__dot ${i === photoIndex ? 'floor-plan-carousel__dot--active' : ''}`}
                                            onClick={() => setPhotoIndex(i)}
                                            type="button"
                                            aria-label={`${l === 'tr' ? 'Fotoğraf' : l === 'el' ? 'Φωτογραφία' : 'Photo'} ${i + 1}`}
                                            aria-current={i === photoIndex}
                                        />
                                    ))}
                                </div>
                            </>
                        )}

                        <div className="floor-plan-photo__overlay">
                            <span className="floor-plan-photo__badge">{levelLabel(activeLevel)}</span>
                            <h3 className="floor-plan-photo__title">{getRoomName(currentRoom)}</h3>
                            {currentRoom.images.length > 1 && (
                                <span className="floor-plan-carousel__counter">{photoIndex + 1} / {currentRoom.images.length}</span>
                            )}
                        </div>
                    </div>
                )}

                <div className={`floor-plan-body ${currentRoom?.floorPlanSvgUrl ? '' : 'floor-plan-body--no-plan'}`}>
                    {/* ── Floor plan drawing (only when the CMS has a real one) ── */}
                    {currentRoom?.floorPlanSvgUrl && (
                        <div className="floor-plan-svg-wrapper">
                            <img
                                src={currentRoom.floorPlanSvgUrl}
                                alt={`${getRoomName(currentRoom)} — ${l === 'tr' ? 'kat planı' : l === 'el' ? 'κάτοψη' : 'floor plan'}`}
                                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                            />
                        </div>
                    )}

                    {/* ── Details Panel ── */}
                    {currentRoom && (
                        <div className="floor-plan-details">
                            <div className="floor-plan-details__header">
                                <span className="floor-plan-details__level-badge">{levelLabel(activeLevel)}</span>
                                <h3 className="floor-plan-details__name">{getRoomName(currentRoom)}</h3>
                                {currentRoom.nameTr && currentRoom.nameTr !== getRoomName(currentRoom) && (
                                    <p className="floor-plan-details__name-tr" lang="tr">{currentRoom.nameTr}</p>
                                )}
                                {currentRoom.area && <p className="floor-plan-details__area">{currentRoom.area}</p>}
                            </div>

                            {/* Features */}
                            {getFeatures().length > 0 && (
                                <div className="floor-plan-details__features">
                                    <h4>{t('features.title')}</h4>
                                    <ul>
                                        {getFeatures().map((feature, i) => (
                                            <li key={i}>
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                                    <polyline points="20,6 9,17 4,12" stroke="var(--color-brass-gold)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {(currentRoom.capacities.gala > 0 || currentRoom.capacities.theater > 0) && (
                                <>
                                    {/* Capacity table */}
                                    <div className="floor-plan-details__capacity">
                                        <h4>{t('features.setupCapacities')}</h4>
                                        <table className="capacity-table">
                                            <thead>
                                                <tr>
                                                    <th>{t('capacity.configuration')}</th>
                                                    <th>{t('capacity.capacity')}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td><span className="capacity-table__icon" aria-hidden="true"><Utensils size={16} /></span>{t('capacity.gala')}</td>
                                                    <td>{currentRoom.capacities.gala}</td>
                                                </tr>
                                                <tr>
                                                    <td><span className="capacity-table__icon" aria-hidden="true"><Users size={16} /></span>{t('capacity.theater')}</td>
                                                    <td>{currentRoom.capacities.theater}</td>
                                                </tr>
                                                <tr>
                                                    <td><span className="capacity-table__icon" aria-hidden="true"><Wine size={16} /></span>{t('capacity.cocktail')}</td>
                                                    <td>{currentRoom.capacities.cocktail}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>

            </div>
        </section>
    );
}
