import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../../i18n/I18nContext';
import venueLevel1 from '../../assets/venue/level1-grand-hall.png';
import venueL1Gala from '../../assets/venue/level1-gala.png';
import venueL1Theater from '../../assets/venue/level1-theater.png';
import venueL1Cocktail from '../../assets/venue/level1-cocktail.png';
import venueLevel2 from '../../assets/venue/level2-exhibition.png';
import venueL2Gallery from '../../assets/venue/level2-gallery.png';
import venueL2Conference from '../../assets/venue/level2-conference.png';
import venueL2Empty from '../../assets/venue/level2-empty.png';
import venueLevel3 from '../../assets/venue/level3-exhibition.png';
import venueL3Cocktail from '../../assets/venue/level3-cocktail.png';
import venueL3Fashion from '../../assets/venue/level3-fashion.png';
import venueL3Empty from '../../assets/venue/level3-empty.png';
import './FloorPlan.css';

/* ──────────────── Types ──────────────── */
interface Room {
    id: string;
    name: string;
    nameTr: string;
    level: number;
    area: string;
    images: string[];
    features: string[];
    featuresTr: string[];
    capacities: {
        gala: number;
        theater: number;
        cocktail: number;
    };
    /** SVG path data for the room shape */
    path: string;
    /** Label position within the SVG */
    labelX: number;
    labelY: number;
}

const rooms: Room[] = [
    {
        id: 'grand-hall',
        name: 'The Grand Hall',
        nameTr: 'Büyük Salon',
        level: 1,
        area: '227 + 100 m²',
        images: [venueLevel1, venueL1Gala, venueL1Theater, venueL1Cocktail],
        features: ['Acoustic Treatment', 'Integrated Lighting Rig', 'Climate Controlled', 'Mezzanine: 60 + 22 m²'],
        featuresTr: ['Akustik Düzenleme', 'Entegre Aydınlatma Sistemi', 'İklim Kontrollü', 'Asma Kat: 60 + 22 m²'],
        capacities: { gala: 400, theater: 600, cocktail: 800 },
        path: 'M 60 80 L 440 80 L 440 320 L 60 320 Z',
        labelX: 250,
        labelY: 200,
    },
    {
        id: 'exhibition-hall-2',
        name: 'Exhibition Hall + Foyer',
        nameTr: 'Sergi Salonu + Fuaye',
        level: 2,
        area: '275 m²',
        images: [venueLevel2, venueL2Gallery, venueL2Conference, venueL2Empty],
        features: ['Acoustic Treatment', 'Integrated Lighting Rig', 'Climate Controlled'],
        featuresTr: ['Akustik Düzenleme', 'Entegre Aydınlatma Sistemi', 'İklim Kontrollü'],
        capacities: { gala: 300, theater: 450, cocktail: 600 },
        path: 'M 60 80 L 300 80 L 300 180 L 440 180 L 440 380 L 60 380 Z',
        labelX: 250,
        labelY: 240,
    },
    {
        id: 'exhibition-hall-3',
        name: 'Exhibition Hall + Foyer',
        nameTr: 'Sergi Salonu + Fuaye',
        level: 3,
        area: '458 m²',
        images: [venueLevel3, venueL3Cocktail, venueL3Fashion, venueL3Empty],
        features: ['Acoustic Treatment', 'Integrated Lighting Rig', 'Climate Controlled'],
        featuresTr: ['Akustik Düzenleme', 'Entegre Aydınlatma Sistemi', 'İklim Kontrollü'],
        capacities: { gala: 300, theater: 450, cocktail: 600 },
        path: 'M 120 100 L 380 100 L 380 220 L 440 220 L 440 340 L 120 340 L 120 220 L 60 220 L 60 160 L 120 160 Z',
        labelX: 250,
        labelY: 230,
    },
];

/* ══════════════════════════════════════════════════════════════
   FLOOR PLAN COMPONENT
   ══════════════════════════════════════════════════════════════ */
export default function FloorPlan() {
    const { t } = useI18n();
    const [activeLevel, setActiveLevel] = useState(1);
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [hoveredRoom, setHoveredRoom] = useState<string | null>(null);
    const [photoIndex, setPhotoIndex] = useState(0);

    const currentRoom = rooms.find(r => r.level === activeLevel)!;

    const handleRoomClick = (room: Room) => {
        setSelectedRoom(room);
    };

    return (
        <section className="floor-plan-section">
            {/* ── Hero ── */}
            <div className="floor-plan-hero">
                <div className="floor-plan-hero__badge">{t('venue.badge')}</div>
                <h1 className="floor-plan-hero__title">{t('venue.title')}</h1>
                <p className="floor-plan-hero__subtitle">
                    {t('venue.subtitle')}
                </p>

            </div>

            <div className="floor-plan-container">
                {/* ── Level Tabs ── */}
                <div className="floor-plan-tabs">
                    <h2 className="floor-plan-tabs__heading">
                        {t('venue.floorPlans')}
                    </h2>
                    <div className="floor-plan-tabs__row">
                        {[1, 2, 3].map(level => (
                            <button
                                key={level}
                                className={`floor-plan-tab ${activeLevel === level ? 'floor-plan-tab--active' : ''}`}
                                onClick={() => { setActiveLevel(level); setSelectedRoom(null); setPhotoIndex(0); }}
                            >
                                <span className="floor-plan-tab__level">Level {level}</span>
                                <span className="floor-plan-tab__name">
                                    {rooms.find(r => r.level === level)?.name}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── Venue Photo Carousel ── */}
                <div className="floor-plan-carousel">
                    <div className="floor-plan-carousel__track">
                        <img
                            key={`${activeLevel}-${photoIndex}`}
                            src={currentRoom.images[photoIndex]}
                            alt={`${currentRoom.name} — Photo ${photoIndex + 1}`}
                            className="floor-plan-carousel__img"
                        />
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
                        <h3 className="floor-plan-photo__title">{currentRoom.name}</h3>
                        {currentRoom.images.length > 1 && (
                            <span className="floor-plan-carousel__counter">{photoIndex + 1} / {currentRoom.images.length}</span>
                        )}
                    </div>
                </div>

                <div className="floor-plan-body">
                    {/* ── SVG Floor Plan ── */}
                    <div className="floor-plan-svg-wrapper">
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

                            {/* Building outline */}
                            <rect
                                x="40" y="60" width="420" height="340"
                                fill="none"
                                stroke="var(--color-inscription)"
                                strokeWidth="1"
                                strokeDasharray="4 4"
                                opacity="0.3"
                            />

                            {/* Room shape */}
                            <path
                                d={currentRoom.path}
                                fill={
                                    hoveredRoom === currentRoom.id
                                        ? 'rgba(242, 208, 13, 0.08)'
                                        : selectedRoom?.id === currentRoom.id
                                            ? 'rgba(197, 160, 89, 0.1)'
                                            : 'rgba(197, 160, 89, 0.04)'
                                }
                                stroke="var(--color-brass-gold)"
                                strokeWidth={hoveredRoom === currentRoom.id || selectedRoom?.id === currentRoom.id ? 2.5 : 1.5}
                                className="floor-plan-room"
                                filter={hoveredRoom === currentRoom.id ? 'url(#gold-glow)' : undefined}
                                onClick={() => handleRoomClick(currentRoom)}
                                onMouseEnter={() => setHoveredRoom(currentRoom.id)}
                                onMouseLeave={() => setHoveredRoom(null)}
                                style={{ cursor: 'pointer' }}
                            />

                            {/* Room dimensions */}
                            {/* Top dimension line */}
                            <line x1="60" y1="50" x2="440" y2="50" stroke="var(--color-brass-gold)" strokeWidth="0.5" opacity="0.6" />
                            <line x1="60" y1="45" x2="60" y2="55" stroke="var(--color-brass-gold)" strokeWidth="0.5" opacity="0.6" />
                            <line x1="440" y1="45" x2="440" y2="55" stroke="var(--color-brass-gold)" strokeWidth="0.5" opacity="0.6" />

                            {/* Side dimension line */}
                            <line x1="30" y1="80" x2="30" y2={activeLevel === 2 ? 380 : activeLevel === 3 ? 340 : 320} stroke="var(--color-brass-gold)" strokeWidth="0.5" opacity="0.6" />
                            <line x1="25" y1="80" x2="35" y2="80" stroke="var(--color-brass-gold)" strokeWidth="0.5" opacity="0.6" />
                            <line x1="25" y1={activeLevel === 2 ? 380 : activeLevel === 3 ? 340 : 320} x2="35" y2={activeLevel === 2 ? 380 : activeLevel === 3 ? 340 : 320} stroke="var(--color-brass-gold)" strokeWidth="0.5" opacity="0.6" />

                            {/* Room label */}
                            <text
                                x={currentRoom.labelX}
                                y={currentRoom.labelY - 15}
                                textAnchor="middle"
                                className="floor-plan-label floor-plan-label--name"
                            >
                                {currentRoom.name}
                            </text>
                            <text
                                x={currentRoom.labelX}
                                y={currentRoom.labelY + 5}
                                textAnchor="middle"
                                className="floor-plan-label floor-plan-label--name-tr"
                            >
                                {currentRoom.nameTr}
                            </text>
                            <text
                                x={currentRoom.labelX}
                                y={currentRoom.labelY + 28}
                                textAnchor="middle"
                                className="floor-plan-label floor-plan-label--area"
                            >
                                {currentRoom.area}
                            </text>

                            {/* Level indicator */}
                            <text x="460" y="405" className="floor-plan-label floor-plan-label--level">
                                L{activeLevel}
                            </text>

                            {/* Compass rose */}
                            <g transform="translate(460, 90)">
                                <circle cx="0" cy="0" r="14" fill="none" stroke="var(--color-brass-gold)" strokeWidth="0.5" opacity="0.5" />
                                <text x="0" y="-18" textAnchor="middle" className="floor-plan-label floor-plan-label--compass">N</text>
                                <line x1="0" y1="-12" x2="0" y2="12" stroke="var(--color-brass-gold)" strokeWidth="0.5" opacity="0.6" />
                                <line x1="-12" y1="0" x2="12" y2="0" stroke="var(--color-brass-gold)" strokeWidth="0.5" opacity="0.6" />
                                <polygon points="0,-10 -3,-4 3,-4" fill="var(--color-brass-gold)" opacity="0.8" />
                            </g>

                            {/* Entry markers */}
                            <g>
                                <rect x="230" y="316" width="40" height="8" fill="var(--color-brass-gold)" opacity="0.6" rx="1" />
                                <text x="250" y="340" textAnchor="middle" className="floor-plan-label floor-plan-label--entry">Entry</text>
                            </g>
                        </svg>
                    </div>

                    {/* ── Details Panel ── */}
                    <div className="floor-plan-details">
                        <div className="floor-plan-details__header">
                            <span className="floor-plan-details__level-badge">Level {activeLevel}</span>
                            <h3 className="floor-plan-details__name">{currentRoom.name}</h3>
                            <p className="floor-plan-details__name-tr">{currentRoom.nameTr}</p>
                            <p className="floor-plan-details__area">{currentRoom.area}</p>
                        </div>

                        <hr className="gold-divider" />

                        {/* Features */}
                        <div className="floor-plan-details__features">
                            <h4>{t('features.title')}</h4>
                            <ul>
                                {currentRoom.features.map((feature, i) => (
                                    <li key={i}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                            <polyline points="20,6 9,17 4,12" stroke="var(--color-brass-gold)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

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
                                        <td>
                                            <span className="capacity-table__icon">🎭</span>
                                            {t('capacity.gala')}
                                        </td>
                                        <td>{currentRoom.capacities.gala}</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <span className="capacity-table__icon">🎪</span>
                                            {t('capacity.theater')}
                                        </td>
                                        <td>{currentRoom.capacities.theater}</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <span className="capacity-table__icon">🥂</span>
                                            {t('capacity.cocktail')}
                                        </td>
                                        <td>{currentRoom.capacities.cocktail}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
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
