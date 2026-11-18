import { useState, useEffect } from 'react';
import {
    Utensils,
    Users,
    Wine,
    BookOpen,
    Briefcase,
    ArrowUpDown,
    LayoutGrid,
    Zap,
    PackageCheck,
    Wifi,
    ShieldCheck,
    ExternalLink,
} from 'lucide-react';
import { useI18n } from '../../i18n/I18nContext';
import { supabase } from '../../services/supabaseClient';
import {
    enrichVenueEventsWithMiceSpecs,
    CANONICAL_VENUE_MICE_DATA,
    type MiceTechSpec,
} from '../../services/dbSync';
import { normalizeLegacyMediaUrl } from '../../config/venueInfo';
import './FloorPlan.css';

/* ──────────────── Types ──────────────── */
interface Room {
    id: string;
    name: string;
    nameTr: string;
    nameEl: string;
    descriptionTr: string;
    descriptionEn: string;
    descriptionEl: string;
    level: number;
    area: string;
    images: string[];
    features: string[];
    featuresTr: string[];
    featuresEl: string[];
    capacities: {
        gala: number;
        theater: number;
        cocktail: number;
        classroom: number;
        boardroom: number;
    };
    floorPlanSvgUrl?: string;
    techSpecs?: MiceTechSpec;
}

function mapVenuesToRooms(data: any[] | null | undefined): Room[] {
    const enriched = enrichVenueEventsWithMiceSpecs(data);
    return enriched.map((v) => {
        const canonical = CANONICAL_VENUE_MICE_DATA[Number(v.level)];
        const specs = v.techSpecs || canonical?.techSpecs;
        return {
            id: v.id,
            name: v.title_en || v.title_tr,
            nameTr: v.title_tr,
            nameEl: v.title_el || v.title_en,
            descriptionTr: v.description_tr || canonical?.description_tr || '',
            descriptionEn: v.description_en || canonical?.description_en || '',
            descriptionEl: v.description_el || canonical?.description_el || '',
            level: Number(v.level),
            area: v.area || canonical?.area || '',
            images: [v.image_url, ...(v.thumbnail_images || [])].map((u) => normalizeLegacyMediaUrl(u)).filter(Boolean),
            features: v.features_en || canonical?.features_en || [],
            featuresTr: v.features_tr || canonical?.features_tr || [],
            featuresEl: v.features_el || canonical?.features_el || [],
            capacities: {
                gala: Number(v.gala_capacity) || canonical?.gala_capacity || 0,
                theater: Number(v.theater_capacity) || canonical?.theater_capacity || 0,
                cocktail: Number(v.cocktail_capacity) || canonical?.cocktail_capacity || 0,
                classroom: specs?.classroomCapacity || 0,
                boardroom: specs?.boardroomCapacity || 0,
            },
            floorPlanSvgUrl: v.floor_plan_svg_url || canonical?.floor_plan_svg_url,
            techSpecs: specs,
        };
    });
}

/* ══════════════════════════════════════════════════════════════
   FLOOR PLAN COMPONENT
   ══════════════════════════════════════════════════════════════ */
interface FloorPlanProps {
    initialVenues?: any[];
    externalLoading?: boolean;
}

export default function FloorPlan({ initialVenues, externalLoading }: FloorPlanProps = {}) {
    const { t, lang } = useI18n();
    const l = (lang || 'tr') as 'tr' | 'en' | 'el';

    const levelLabel = (lvl: number) => {
        if (lvl === 4) {
            return l === 'tr' ? 'Kat 1 + 2 + 3 (Buyout)' : l === 'el' ? 'Όροφοι 1 + 2 + 3' : 'Levels 1 + 2 + 3';
        }
        return l === 'tr' ? `Kat ${lvl}` : l === 'el' ? `Όροφος ${lvl}` : `Level ${lvl}`;
    };

    const [rooms, setRooms] = useState<Room[]>(() => mapVenuesToRooms(initialVenues ?? null));
    const [dataLoaded, setDataLoaded] = useState(true);
    const [activeLevel, setActiveLevel] = useState(1);
    const [photoIndex, setPhotoIndex] = useState(0);

    useEffect(() => {
        if (initialVenues !== undefined) {
            if (!externalLoading) {
                setRooms(mapVenuesToRooms(initialVenues));
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

            setRooms(mapVenuesToRooms(data));
            setDataLoaded(true);
        };
        fetchVenues();
    }, [initialVenues, externalLoading]);

    const currentRoom = rooms.find((r) => r.level === activeLevel) ?? rooms[0];

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

    const getRoomDesc = (room: Room) => {
        if (l === 'tr') return room.descriptionTr;
        if (l === 'el') return room.descriptionEl || room.descriptionEn;
        return room.descriptionEn;
    };

    const availableLevels = rooms.map((r) => r.level).sort((a, b) => a - b);

    const heroImage =
        rooms.find((r) => r.images.length > 0)?.images[0] ??
        '/supabase-media/venue/mz81jyod0nq_1773083709418.webp';

    const labels = {
        techSectionTitle: {
            tr: 'MİMARİ & TEKNİK ALTYAPI KARTLARI (MICE)',
            en: 'ARCHITECTURAL & TECHNICAL SPECIFICATIONS (MICE)',
            el: 'ΑΡΧΙΤΕΚΤΟΝΙΚΕΣ & ΤΕΧΝΙΚΕΣ ΠΡΟΔΙΑΓΡΑΦΕΣ (MICE)',
        },
        ceiling: { tr: 'Tavan Yüksekliği', en: 'Ceiling Height', el: 'Ύψος Οροφής' },
        layout: { tr: 'Oda & Mimari Yapı', en: 'Spatial & Room Layout', el: 'Διάταξη Χώρων' },
        power: { tr: 'Elektrik & Enerji Gücü', en: 'Power Supply', el: 'Ηλεκτρική Ισχύς' },
        access: { tr: 'Asansör & Yükleme Erişimi', en: 'Elevator & Load-In Access', el: 'Ανελκυστήρας & Πρόσβαση' },
        wifi: { tr: 'İnternet & Canlı Yayın', en: 'Connectivity & Broadcast', el: 'Δίκτυο & Live Stream' },
        rigging: { tr: 'Kurulum & Miras Kuralı', en: 'Rigging & Heritage Rules', el: 'Κανόνες Εγκατάστασης' },
        blueprintTitle: {
            tr: 'Resmi Mimari Kat Planı (Tabanlıoğlu Mimarlık)',
            en: 'Official Architectural Floor Plan (Tabanlıoğlu Architects)',
            el: 'Επίσημη Αρχιτεκτονική Κάτοψη',
        },
        openPlanBtn: {
            tr: 'Tam Boyutlu Planı Aç / İndir',
            en: 'Open / Download Full Plan',
            el: 'Άνοιγμα / Λήψη Πλήρους Κάτοψης',
        },
        classroom: {
            tr: 'Sınıf / Atölye Düzeni',
            en: 'Classroom / Workshop',
            el: 'Διάταξη Τάξης / Εργαστηρίου',
        },
        boardroom: {
            tr: 'U-Masa / Toplantı Düzeni',
            en: 'U-Shape / Boardroom',
            el: 'Διάταξη Π / Συνεδρίασης',
        },
        paxUnit: {
            tr: 'Kişi',
            en: 'Guests',
            el: 'Άτομα',
        },
    };

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
        return <section className="floor-plan-section">{hero}</section>;
    }

    const specs = currentRoom?.techSpecs;

    return (
        <section className="floor-plan-section">
            {hero}

            <div className="floor-plan-container">
                {/* ── Level Tabs ── */}
                <div className="floor-plan-tabs">
                    <h2 className="floor-plan-tabs__heading">{t('venue.floorPlans')}</h2>
                    <div className="floor-plan-tabs__row">
                        {availableLevels.map((level) => {
                            const room = rooms.find((r) => r.level === level);
                            const isBuyout = level === 4;
                            return (
                                <button
                                    key={level}
                                    type="button"
                                    aria-pressed={activeLevel === level}
                                    className={`floor-plan-tab ${activeLevel === level ? 'floor-plan-tab--active' : ''} ${isBuyout ? 'floor-plan-tab--buyout' : ''}`}
                                    onClick={() => {
                                        setActiveLevel(level);
                                        setPhotoIndex(0);
                                    }}
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
                                <div
                                    className="floor-plan-carousel__img"
                                    style={{
                                        background: '#1a1a1a',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#888',
                                    }}
                                >
                                    {l === 'tr'
                                        ? 'Bu salonun fotoğrafı henüz eklenmedi'
                                        : l === 'el'
                                          ? 'Δεν υπάρχει ακόμη φωτογραφία'
                                          : 'No photo of this space yet'}
                                </div>
                            )}
                        </div>

                        {currentRoom.images.length > 1 && (
                            <>
                                <button
                                    className="floor-plan-carousel__arrow floor-plan-carousel__arrow--prev"
                                    onClick={() =>
                                        setPhotoIndex((i) => (i - 1 + currentRoom.images.length) % currentRoom.images.length)
                                    }
                                    type="button"
                                    aria-label={
                                        l === 'tr'
                                            ? 'Önceki fotoğraf'
                                            : l === 'el'
                                              ? 'Προηγούμενη φωτογραφία'
                                              : 'Previous photo'
                                    }
                                >
                                    <svg
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <polyline points="15 18 9 12 15 6" />
                                    </svg>
                                </button>
                                <button
                                    className="floor-plan-carousel__arrow floor-plan-carousel__arrow--next"
                                    onClick={() => setPhotoIndex((i) => (i + 1) % currentRoom.images.length)}
                                    type="button"
                                    aria-label={
                                        l === 'tr'
                                            ? 'Sonraki fotoğraf'
                                            : l === 'el'
                                              ? 'Επόμενη φωτογραφία'
                                              : 'Next photo'
                                    }
                                >
                                    <svg
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
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
                                <span className="floor-plan-carousel__counter">
                                    {photoIndex + 1} / {currentRoom.images.length}
                                </span>
                            )}
                        </div>
                    </div>
                )}

                {/* ── MICE Technical Specification Badges Grid (6 Cards) ── */}
                {specs && (
                    <div className="mice-specs-section">
                        <div className="mice-specs-header">
                            <span className="mice-specs-eyebrow">{labels.techSectionTitle[l]}</span>
                        </div>
                        <div className="mice-specs-grid">
                            <div className="mice-spec-card">
                                <div className="mice-spec-card__icon" aria-hidden="true">
                                    <ArrowUpDown size={18} />
                                </div>
                                <div className="mice-spec-card__body">
                                    <span className="mice-spec-card__label">{labels.ceiling[l]}</span>
                                    <strong className="mice-spec-card__value">{specs.ceilingHeight[l]}</strong>
                                </div>
                            </div>

                            <div className="mice-spec-card">
                                <div className="mice-spec-card__icon" aria-hidden="true">
                                    <LayoutGrid size={18} />
                                </div>
                                <div className="mice-spec-card__body">
                                    <span className="mice-spec-card__label">{labels.layout[l]}</span>
                                    <strong className="mice-spec-card__value">{specs.roomStructure[l]}</strong>
                                </div>
                            </div>

                            <div className="mice-spec-card">
                                <div className="mice-spec-card__icon" aria-hidden="true">
                                    <Zap size={18} />
                                </div>
                                <div className="mice-spec-card__body">
                                    <span className="mice-spec-card__label">{labels.power[l]}</span>
                                    <strong className="mice-spec-card__value">{specs.powerSupply[l]}</strong>
                                </div>
                            </div>

                            <div className="mice-spec-card">
                                <div className="mice-spec-card__icon" aria-hidden="true">
                                    <PackageCheck size={18} />
                                </div>
                                <div className="mice-spec-card__body">
                                    <span className="mice-spec-card__label">{labels.access[l]}</span>
                                    <strong className="mice-spec-card__value">{specs.elevatorAccess[l]}</strong>
                                </div>
                            </div>

                            <div className="mice-spec-card">
                                <div className="mice-spec-card__icon" aria-hidden="true">
                                    <Wifi size={18} />
                                </div>
                                <div className="mice-spec-card__body">
                                    <span className="mice-spec-card__label">{labels.wifi[l]}</span>
                                    <strong className="mice-spec-card__value">{specs.connectivity[l]}</strong>
                                </div>
                            </div>

                            <div className="mice-spec-card">
                                <div className="mice-spec-card__icon" aria-hidden="true">
                                    <ShieldCheck size={18} />
                                </div>
                                <div className="mice-spec-card__body">
                                    <span className="mice-spec-card__label">{labels.rigging[l]}</span>
                                    <strong className="mice-spec-card__value">{specs.riggingRules[l]}</strong>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── Architectural Floor Plan Blueprint + Details Panel ── */}
                <div className={`floor-plan-body ${currentRoom?.floorPlanSvgUrl ? '' : 'floor-plan-body--no-plan'}`}>
                    {currentRoom?.floorPlanSvgUrl && (
                        <div className="floor-plan-svg-wrapper">
                            <div className="floor-plan-svg-toolbar">
                                <span className="floor-plan-svg-toolbar__title">
                                    {labels.blueprintTitle[l]} — {levelLabel(activeLevel)}
                                </span>
                                <a
                                    href={currentRoom.floorPlanSvgUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="floor-plan-svg-toolbar__btn"
                                >
                                    <span>{labels.openPlanBtn[l]}</span>
                                    <ExternalLink size={13} aria-hidden="true" />
                                </a>
                            </div>
                            <div className="floor-plan-svg-canvas">
                                <img
                                    src={currentRoom.floorPlanSvgUrl}
                                    alt={`${getRoomName(currentRoom)} — ${l === 'tr' ? 'kat planı' : l === 'el' ? 'κάτοψη' : 'floor plan'}`}
                                    className="floor-plan-svg-img"
                                />
                            </div>
                        </div>
                    )}

                    {/* ── Details Panel ── */}
                    {currentRoom && (
                        <div className="floor-plan-details">
                            <div className="floor-plan-details__header">
                                <span className="floor-plan-details__level-badge">{levelLabel(activeLevel)}</span>
                                <h3 className="floor-plan-details__name">{getRoomName(currentRoom)}</h3>
                                {currentRoom.area && <p className="floor-plan-details__area">{currentRoom.area}</p>}
                                {getRoomDesc(currentRoom) && (
                                    <p className="floor-plan-details__desc">{getRoomDesc(currentRoom)}</p>
                                )}
                            </div>

                            {/* Features */}
                            {getFeatures().length > 0 && (
                                <div className="floor-plan-details__features">
                                    <h4>{t('features.title')}</h4>
                                    <ul>
                                        {getFeatures().map((feature, i) => (
                                            <li key={i}>
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                                    <polyline
                                                        points="20,6 9,17 4,12"
                                                        stroke="var(--color-brass-gold)"
                                                        strokeWidth="2.5"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {(currentRoom.capacities.gala > 0 || currentRoom.capacities.theater > 0) && (
                                <div className="floor-plan-details__capacity">
                                    <h4>{t('features.setupCapacities')}</h4>
                                    <table className="capacity-table">
                                        <thead>
                                            <tr>
                                                <th>{t('capacity.configuration')}</th>
                                                <th>
                                                    {t('capacity.capacity')} ({labels.paxUnit[l]})
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <span className="capacity-table__icon" aria-hidden="true">
                                                        <Utensils size={16} />
                                                    </span>
                                                    {t('capacity.gala')}
                                                </td>
                                                <td>{currentRoom.capacities.gala}</td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <span className="capacity-table__icon" aria-hidden="true">
                                                        <Users size={16} />
                                                    </span>
                                                    {t('capacity.theater')}
                                                </td>
                                                <td>{currentRoom.capacities.theater}</td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <span className="capacity-table__icon" aria-hidden="true">
                                                        <Wine size={16} />
                                                    </span>
                                                    {t('capacity.cocktail')}
                                                </td>
                                                <td>{currentRoom.capacities.cocktail}</td>
                                            </tr>
                                            {currentRoom.capacities.classroom > 0 && (
                                                <tr>
                                                    <td>
                                                        <span className="capacity-table__icon" aria-hidden="true">
                                                            <BookOpen size={16} />
                                                        </span>
                                                        {labels.classroom[l]}
                                                    </td>
                                                    <td>{currentRoom.capacities.classroom}</td>
                                                </tr>
                                            )}
                                            {currentRoom.capacities.boardroom > 0 && (
                                                <tr>
                                                    <td>
                                                        <span className="capacity-table__icon" aria-hidden="true">
                                                            <Briefcase size={16} />
                                                        </span>
                                                        {labels.boardroom[l]}
                                                    </td>
                                                    <td>{currentRoom.capacities.boardroom}</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
