import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
export default function FloorPlan() {
    const { t, lang } = useI18n();
    const l = lang || 'en';

    const [rooms, setRooms] = useState<Room[]>(fallbackRooms);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [activeLevel, setActiveLevel] = useState(1);
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [hoveredRoom, setHoveredRoom] = useState<string | null>(null);
    const [photoIndex, setPhotoIndex] = useState(0);

    useEffect(() => {
        const fetchVenues = async () => {
            const { data } = await supabase
                .from('venue_events')
                .select('*')
                .eq('status', 'published')
                .order('order_index', { ascending: true });

            if (data && data.length > 0) {
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
            }
            setDataLoaded(true);
        };
        fetchVenues();
    }, []);

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

    const handleRoomClick = (room: Room) => setSelectedRoom(room);

    const availableLevels = rooms.map(r => r.level).sort();

    if (!dataLoaded) {
        return (
            <section className="floor-plan-section">
                <div className="floor-plan-hero">
                    <div className="floor-plan-hero__badge">{t('venue.badge')}</div>
                    <h1 className="floor-plan-hero__title">{t('venue.title')}</h1>
                </div>
            </section>
        );
    }

    return (
        <section className="floor-plan-section">
            {/* ── Hero ── */}
            <div className="floor-plan-hero">
                <div className="floor-plan-hero__badge">{t('venue.badge')}</div>
                <h1 className="floor-plan-hero__title">{t('venue.title')}</h1>
                <p className="floor-plan-hero__subtitle">{t('venue.subtitle')}</p>
            </div>

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
                                    className={`floor-plan-tab ${activeLevel === level ? 'floor-plan-tab--active' : ''}`}
                                    onClick={() => { setActiveLevel(level); setSelectedRoom(null); setPhotoIndex(0); }}
                                >
                                    <span className="floor-plan-tab__level">Level {level}</span>
                                    <span className="floor-plan-tab__name">{room ? getRoomName(room) : ''}</span>
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
                                    alt={`${getRoomName(currentRoom)} — Photo ${photoIndex + 1}`}
                                    className="floor-plan-carousel__img"
                                />
                            ) : (
                                <div className="floor-plan-carousel__img" style={{ background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
                                    Görsel Yükleniyor…
                                </div>
                            )}
                        </div>

                        {currentRoom.images.length > 1 && (
                            <>
                                <button
                                    className="floor-plan-carousel__arrow floor-plan-carousel__arrow--prev"
                                    onClick={() => setPhotoIndex(i => (i - 1 + currentRoom.images.length) % currentRoom.images.length)}
                                    aria-label="Previous photo"
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="15 18 9 12 15 6" />
                                    </svg>
                                </button>
                                <button
                                    className="floor-plan-carousel__arrow floor-plan-carousel__arrow--next"
                                    onClick={() => setPhotoIndex(i => (i + 1) % currentRoom.images.length)}
                                    aria-label="Next photo"
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
                                            aria-label={`Photo ${i + 1}`}
                                        />
                                    ))}
                                </div>
                            </>
                        )}

                        <div className="floor-plan-photo__overlay">
                            <span className="floor-plan-photo__badge">Level {activeLevel}</span>
                            <h3 className="floor-plan-photo__title">{getRoomName(currentRoom)}</h3>
                            {currentRoom.images.length > 1 && (
                                <span className="floor-plan-carousel__counter">{photoIndex + 1} / {currentRoom.images.length}</span>
                            )}
                        </div>
                    </div>
                )}

                <div className="floor-plan-body">
                    {/* ── SVG Floor Plan ── */}
                    <div className="floor-plan-svg-wrapper">
                        {currentRoom?.floorPlanSvgUrl ? (
                            <img
                                src={currentRoom.floorPlanSvgUrl}
                                alt={`${getRoomName(currentRoom)} floor plan`}
                                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                            />
                        ) : (
                            <svg
                                viewBox="0 0 500 420"
                                className="floor-plan-svg"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                {/* Grid lines */}
                                <defs>
                                    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="var(--color-stone-gray)" strokeWidth="0.5" opacity="0.5" />
                                    </pattern>
                                    <filter id="gold-glow">
                                        <feGaussianBlur stdDeviation="4" result="blur" />
                                        <feFlood floodColor="#F2D00D" floodOpacity="0.3" result="glow-color" />
                                        <feComposite in="glow-color" in2="blur" operator="in" result="glow" />
                                        <feMerge>
                                            <feMergeNode in="glow" />
                                            <feMergeNode in="SourceGraphic" />
                                        </feMerge>
                                    </filter>
                                </defs>

                                <rect width="500" height="420" fill="url(#grid)" />
                                <rect x="40" y="60" width="420" height="340" fill="none" stroke="var(--color-inscription)" strokeWidth="1" strokeDasharray="4 4" opacity="0.3" />

                                {currentRoom && (
                                    <path
                                        d={currentRoom.path}
                                        fill={hoveredRoom === currentRoom.id ? 'rgba(242,208,13,0.08)' : selectedRoom?.id === currentRoom.id ? 'rgba(197,160,89,0.1)' : 'rgba(197,160,89,0.04)'}
                                        stroke="var(--color-brass-gold)"
                                        strokeWidth={hoveredRoom === currentRoom.id || selectedRoom?.id === currentRoom.id ? 2.5 : 1.5}
                                        className="floor-plan-room"
                                        filter={hoveredRoom === currentRoom.id ? 'url(#gold-glow)' : undefined}
                                        onClick={() => handleRoomClick(currentRoom)}
                                        onMouseEnter={() => setHoveredRoom(currentRoom.id)}
                                        onMouseLeave={() => setHoveredRoom(null)}
                                        style={{ cursor: 'pointer' }}
                                    />
                                )}

                                {/* Dimension lines */}
                                <line x1="60" y1="50" x2="440" y2="50" stroke="var(--color-brass-gold)" strokeWidth="0.5" opacity="0.6" />
                                <line x1="60" y1="45" x2="60" y2="55" stroke="var(--color-brass-gold)" strokeWidth="0.5" opacity="0.6" />
                                <line x1="440" y1="45" x2="440" y2="55" stroke="var(--color-brass-gold)" strokeWidth="0.5" opacity="0.6" />
                                <line x1="30" y1="80" x2="30" y2={activeLevel === 2 ? 380 : activeLevel === 3 ? 340 : 320} stroke="var(--color-brass-gold)" strokeWidth="0.5" opacity="0.6" />
                                <line x1="25" y1="80" x2="35" y2="80" stroke="var(--color-brass-gold)" strokeWidth="0.5" opacity="0.6" />
                                <line x1="25" y1={activeLevel === 2 ? 380 : activeLevel === 3 ? 340 : 320} x2="35" y2={activeLevel === 2 ? 380 : activeLevel === 3 ? 340 : 320} stroke="var(--color-brass-gold)" strokeWidth="0.5" opacity="0.6" />

                                {currentRoom && (
                                    <>
                                        <text x={currentRoom.labelX} y={currentRoom.labelY - 15} textAnchor="middle" className="floor-plan-label floor-plan-label--name">
                                            {getRoomName(currentRoom)}
                                        </text>
                                        <text x={currentRoom.labelX} y={currentRoom.labelY + 5} textAnchor="middle" className="floor-plan-label floor-plan-label--name-tr">
                                            {currentRoom.nameTr}
                                        </text>
                                        <text x={currentRoom.labelX} y={currentRoom.labelY + 28} textAnchor="middle" className="floor-plan-label floor-plan-label--area">
                                            {currentRoom.area}
                                        </text>
                                    </>
                                )}

                                <text x="460" y="405" className="floor-plan-label floor-plan-label--level">L{activeLevel}</text>

                                {/* Compass rose */}
                                <g transform="translate(460, 90)">
                                    <circle cx="0" cy="0" r="14" fill="none" stroke="var(--color-brass-gold)" strokeWidth="0.5" opacity="0.5" />
                                    <text x="0" y="-18" textAnchor="middle" className="floor-plan-label floor-plan-label--compass">N</text>
                                    <line x1="0" y1="-12" x2="0" y2="12" stroke="var(--color-brass-gold)" strokeWidth="0.5" opacity="0.6" />
                                    <line x1="-12" y1="0" x2="12" y2="0" stroke="var(--color-brass-gold)" strokeWidth="0.5" opacity="0.6" />
                                    <polygon points="0,-10 -3,-4 3,-4" fill="var(--color-brass-gold)" opacity="0.8" />
                                </g>

                                {/* Entry marker */}
                                <g>
                                    <rect x="230" y="316" width="40" height="8" fill="var(--color-brass-gold)" opacity="0.6" rx="1" />
                                    <text x="250" y="340" textAnchor="middle" className="floor-plan-label floor-plan-label--entry">Entry</text>
                                </g>
                            </svg>
                        )}
                    </div>

                    {/* ── Details Panel ── */}
                    {currentRoom && (
                        <div className="floor-plan-details">
                            <div className="floor-plan-details__header">
                                <span className="floor-plan-details__level-badge">Level {activeLevel}</span>
                                <h3 className="floor-plan-details__name">{getRoomName(currentRoom)}</h3>
                                <p className="floor-plan-details__name-tr">{currentRoom.nameTr}</p>
                                {currentRoom.area && <p className="floor-plan-details__area">{currentRoom.area}</p>}
                            </div>

                            <hr className="gold-divider" />

                            {/* Features */}
                            {getFeatures().length > 0 && (
                                <div className="floor-plan-details__features">
                                    <h4>{t('features.title')}</h4>
                                    <ul>
                                        {getFeatures().map((feature, i) => (
                                            <li key={i}>
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
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
                                    <hr className="gold-divider" />
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
                                                    <td><span className="capacity-table__icon">🎭</span>{t('capacity.gala')}</td>
                                                    <td>{currentRoom.capacities.gala}</td>
                                                </tr>
                                                <tr>
                                                    <td><span className="capacity-table__icon">🎪</span>{t('capacity.theater')}</td>
                                                    <td>{currentRoom.capacities.theater}</td>
                                                </tr>
                                                <tr>
                                                    <td><span className="capacity-table__icon">🥂</span>{t('capacity.cocktail')}</td>
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

                <div className="floor-plan__cta-wrapper">
                    <Link to="/concierge" className="floor-plan__cta-btn">
                        {t('hero.cta')} →
                    </Link>
                </div>
            </div>
        </section>
    );
}
