import { supabase } from './supabaseClient';
import { DEFAULT_HERO_CONFIG } from '../config/heroConfig';
import preservedLegacyEventsData from '../data/preservedLegacyEvents.json';
import seoRouteSnapshotData from '../data/seoRouteSnapshot.json';

export interface PreservedLegacyEvent {
    id: string;
    slug: string;
    event_date: string;
    type_tr: string;
    type_en: string;
    type_el: string;
    title_tr: string;
    title_en: string;
    title_el: string;
    description_tr: string;
    description_en: string;
    description_el: string;
    cover_image_url: string;
    thumbnail_images: string[];
    status: string;
    source_urls?: Record<string, string | undefined>;
}

export const PRESERVED_LEGACY_EVENTS: PreservedLegacyEvent[] = preservedLegacyEventsData as unknown as PreservedLegacyEvent[];

export function getPreservedLegacyEvent(slugOrId: string | null | undefined): PreservedLegacyEvent | null {
    if (!slugOrId) return null;
    return PRESERVED_LEGACY_EVENTS.find((e) => e.slug === slugOrId || e.id === slugOrId) ?? null;
}


export interface CanonicalEventType {
    key: string;
    label_tr: string;
    label_en: string;
    label_el: string;
    order_index: number;
}

export const CANONICAL_EVENT_TYPES: CanonicalEventType[] = [
    {
        key: 'sanat-sergisi',
        label_tr: 'Sanat Sergisi & Bienal',
        label_en: 'Art Exhibition & Biennial',
        label_el: 'Έκθεση Τέχνης & Μπιενάλε',
        order_index: 1,
    },
    {
        key: 'konferans',
        label_tr: 'Konferans & Sempozyum',
        label_en: 'Conference & Symposium',
        label_el: 'Συνέδριο & Συμπόσιο',
        order_index: 2,
    },
    {
        key: 'soylesi-panel',
        label_tr: 'Söyleşi, Panel & Kitap Tanıtımı',
        label_en: 'Talk, Panel & Book Launch',
        label_el: 'Ομιλία, Πάνελ & Παρουσίαση Βιβλίου',
        order_index: 3,
    },
    {
        key: 'performans-konser',
        label_tr: 'Performans, Konser & Tiyatro',
        label_en: 'Performance, Concert & Theater',
        label_el: 'Παράσταση, Συναυλία & Θέατρο',
        order_index: 4,
    },
    {
        key: 'ozel-resepsiyon',
        label_tr: 'Özel Resepsiyon & Lansman',
        label_en: 'Private Reception & Brand Launch',
        label_el: 'Ιδιωτική Δεξίωση & Παρουσίαση',
        order_index: 5,
    },
    {
        key: 'kurumsal-seminer',
        label_tr: 'Kurumsal Seminer & Zirve',
        label_en: 'Corporate Seminar & Summit',
        label_el: 'Εταιρικό Σεμινάριο & Σύνοδος',
        order_index: 6,
    },
    {
        key: 'atolye-egitim',
        label_tr: 'Atölye & Akademik Program',
        label_en: 'Workshop & Academic Program',
        label_el: 'Εργαστήριο & Ακαδημαϊκό Πρόγραμμα',
        order_index: 7,
    },
    {
        key: 'foto-film',
        label_tr: 'Film Gösterimi & Çekim Prodüksiyonu',
        label_en: 'Film Screening & Photo/Film Production',
        label_el: 'Προβολή Ταινίας & Οπτικοακουστική Παραγωγή',
        order_index: 8,
    },
];

export function mergeCanonicalEventTypes(
    dbRows: Array<{ key?: string; label_tr: string; label_en: string; label_el: string }> | null | undefined
): Array<{ key: string; tr: string; en: string; el: string }> {
    const byKey = new Map<string, { key: string; tr: string; en: string; el: string }>();

    for (const item of CANONICAL_EVENT_TYPES) {
        byKey.set(item.key, {
            key: item.key,
            tr: item.label_tr,
            en: item.label_en,
            el: item.label_el,
        });
    }

    if (dbRows && dbRows.length > 0) {
        for (const row of dbRows) {
            const k = row.key || row.label_tr;
            if (!byKey.has(k)) {
                byKey.set(k, {
                    key: k,
                    tr: row.label_tr,
                    en: row.label_en || row.label_tr,
                    el: row.label_el || row.label_en || row.label_tr,
                });
            }
        }
    }

    return Array.from(byKey.values());
}

export interface MiceTechSpec {
    ceilingHeight: Record<'tr' | 'en' | 'el', string>;
    roomStructure: Record<'tr' | 'en' | 'el', string>;
    powerSupply: Record<'tr' | 'en' | 'el', string>;
    elevatorAccess: Record<'tr' | 'en' | 'el', string>;
    connectivity: Record<'tr' | 'en' | 'el', string>;
    riggingRules: Record<'tr' | 'en' | 'el', string>;
    classroomCapacity: number;
    boardroomCapacity: number;
}

export interface CanonicalVenueMiceConfig {
    id: string;
    level: number;
    area: string;
    title_tr: string;
    title_en: string;
    title_el: string;
    description_tr: string;
    description_en: string;
    description_el: string;
    gala_capacity: number;
    theater_capacity: number;
    cocktail_capacity: number;
    floor_plan_svg_url: string;
    features_tr: string[];
    features_en: string[];
    features_el: string[];
    image_url: string;
    thumbnail_images: string[];
    techSpecs: MiceTechSpec;
}

export const CANONICAL_VENUE_MICE_DATA: Record<number, CanonicalVenueMiceConfig> = {
    1: {
        id: '5b76814b-0668-4011-b45b-28decba1aaf4',
        level: 1,
        area: '227 + 100 m²',
        title_tr: 'Çok Amaçlı Büyük Salon & Fuaye',
        title_en: 'The Grand Multipurpose Hall & Foyer',
        title_el: 'Μεγάλη Αίθουσα Πολλαπλών Χρήσεων & Φουαγιέ',
        description_tr: '227 m² Çok Amaçlı Büyük Salon, 100 m² sergi ve fuaye alanı, iki yanda açık hava avluları, vestiyer ve servis mutfağından oluşan ana etkinlik katı.',
        description_en: 'Main event level featuring the 227 m² Multipurpose Grand Hall, a 100 m² exhibition and foyer area, twin open-air courtyards, a spacious cloakroom, and a catering service kitchen.',
        description_el: 'Κύριος όροφος εκδηλώσεων με την Αίθουσα Πολλαπλών Χρήσεων 227 m², χώρο έκθεσης και φουαγιέ 100 m², δύο εσωτερικές αυλές, βεστιάριο και κουζίνα εξυπηρέτησης.',
        gala_capacity: 160,
        theater_capacity: 250,
        cocktail_capacity: 350,
        floor_plan_svg_url: '/images/floorplans/level-1-official-plan.jpg',
        features_tr: [
            'Çok Amaçlı Büyük Salon (227 m²) & Sahne Alanı',
            'Sergi ve Fuaye Alanı (100 m²) + Ön Salon',
            'İki Yanda Açık Hava Avlusu',
            'Geniş Vestiyer & Hazırlık Odası',
            'Servis Mutfağı & Simone Restaurant Catering İmkanı',
            '2 Adet Engelsiz Asansör',
        ],
        features_en: [
            'Multipurpose Grand Hall (227 m²) & Stage Area',
            'Exhibition & Foyer Area (100 m²) + Front Hall',
            'Two Open-Air Courtyards',
            'Spacious Cloakroom & Lounge',
            'Service Kitchen & Catering via Simone Restaurant',
            '2 Accessible Elevators',
        ],
        features_el: [
            'Αίθουσα Πολλαπλών Χρήσεων (227 m²) & Σκηνή',
            'Χώρος Έκθεσης & Φουαγιέ (100 m²) + Μπροστινή Αίθουσα',
            'Δύο Ανοιχτές Εσωτερικές Αυλές',
            'Ευρύχωρο Βεστιάριο & Χώρος Υποδοχής',
            'Κουζίνα Εξυπηρέτησης & Catering από το Simone Restaurant',
            '2 Ανελκυστήρες ΑμεΑ',
        ],
        image_url: '/supabase-media/venue/mz81jyod0nq_1773083709418.webp',
        thumbnail_images: [
            '/supabase-media/venue/ec39t6bl3hd_1773083599484.webp',
            '/supabase-media/venue/bg6errwn25u_1773083618325.webp',
            '/supabase-media/venue/afnuua7o3ah_1773083641141.webp',
            '/supabase-media/venue/j68cg174mir_1773083669472.webp',
        ],
        techSpecs: {
            ceilingHeight: {
                tr: '6,26 m (Balkonlu Çift Kat Yüksekliği)',
                en: '6.26 m (Double-Height with Balcony)',
                el: '6,26 m (Διώροφο Ύψος με Εξώστη)',
            },
            roomStructure: {
                tr: 'Büyük Salon + Fuaye + 2 Açık Avlu + Servis Mutfağı',
                en: 'Grand Hall + Foyer + 2 Courtyards + Service Kitchen',
                el: 'Μεγάλη Αίθουσα + Φουαγιέ + 2 Αυλές + Κουζίνα',
            },
            powerSupply: {
                tr: 'Trifaze Enerji Panosu & Ses/Işık Altyapısı',
                en: '3-Phase Power Panel & Sound/Lighting Infrastructure',
                el: 'Τριφασική Παροχή & Υποδομή Ήχου/Φωτισμού',
            },
            elevatorAccess: {
                tr: '2 Adet Engelsiz Asansör',
                en: '2 Accessible Elevators',
                el: '2 Ανελκυστήρες ΑμεΑ',
            },
            connectivity: {
                tr: '',
                en: '',
                el: '',
            },
            riggingRules: {
                tr: '2. Derece Tarihi Eser • Tarihi Dokuya Uygun Hassas Kurulum',
                en: '2nd-Degree Historic Building • Non-Invasive Freestanding Setup',
                el: 'Διατηρητέο Μνημείο Β΄ Κατηγορίας • Προσεκτική Εγκατάσταση',
            },
            classroomCapacity: 120,
            boardroomCapacity: 60,
        },
    },
    2: {
        id: '57c70963-b5d2-47df-8ec8-84d3c478b205',
        level: 2,
        area: '275 m²',
        title_tr: '2. Kat Sergi Salonları, Fuaye & Balkon',
        title_en: '2nd Floor Exhibition Halls, Foyer & Balcony',
        title_el: '2ος Όροφος — Αίθουσες Εκθέσεων, Φουαγιέ & Εξώστης',
        description_tr: 'Kemeraltı Caddesi cephesinde yan yana 3 adet sergi ve toplantı salonu, geniş merkez fuaye alanı ve 1. Kat Büyük Salona bakan galeri balkonundan oluşur.',
        description_en: 'Comprises 3 front-facing exhibition and seminar halls along the Kemeraltı facade, a spacious central foyer, and the upper gallery balcony overlooking the Grand Hall.',
        description_el: 'Περιλαμβάνει 3 μπροστινές αίθουσες εκθέσεων και συνεδριάσεων, ευρύχωρο κεντρικό φουαγιέ και τον εξώστη με θέα στη Μεγάλη Αίθουσα.',
        gala_capacity: 90,
        theater_capacity: 140,
        cocktail_capacity: 250,
        floor_plan_svg_url: '/images/floorplans/level-2-official-plan.jpg',
        features_tr: [
            'Ön Cephede 3 Adet Sergi & Toplantı Salonu',
            'Geniş Merkez Sergi & Fuaye Alanı',
            'Büyük Salona Bakan Üst Galeri Balkonu',
            'Simone Restaurant Catering & İkram İmkanı',
            'Depolama Alanı & Engelli Erişimli Lavabolar',
            '2 Adet Engelsiz Asansör',
        ],
        features_en: [
            '3 Front-Facade Exhibition & Seminar Halls',
            'Spacious Central Exhibition & Foyer Area',
            'Upper Gallery Balcony Overlooking the Grand Hall',
            'Catering Available via Rooftop Simone Restaurant',
            'Storage Area & Accessible Restrooms',
            '2 Accessible Elevators',
        ],
        features_el: [
            '3 Μπροστινές Αίθουσες Εκθέσεων & Σεμιναρίων',
            'Ευρύχωρος Κεντρικός Χώρος Έκθεσης & Φουαγιέ',
            'Εξώστης με Θέα στη Μεγάλη Αίθουσα',
            'Δυνατότητα Catering από το Simone Restaurant',
            'Αποθηκευτικός Χώρος & WC ΑμεΑ',
            '2 Ανελκυστήρες ΑμεΑ',
        ],
        image_url: '/supabase-media/venue/ap0hijmh6rn_1773083839555.webp',
        thumbnail_images: [
            '/supabase-media/venue/spxudaa4qm9_1773083863877.webp',
            '/supabase-media/venue/67zjoy8xv0v_1773083872018.webp',
            '/supabase-media/venue/h3t2o8sr1f_1773083881680.webp',
        ],
        techSpecs: {
            ceilingHeight: {
                tr: '4,11 m Tavan Yüksekliği',
                en: '4.11 m Ceiling Height',
                el: '4,11 m Ύψος Οροφής',
            },
            roomStructure: {
                tr: '3 Sergi ve Toplantı Salonu + Merkez Fuaye + Balkon',
                en: '3 Exhibition & Seminar Halls + Central Foyer + Balcony',
                el: '3 Αίθουσες + Κεντρικό Φουαγιέ + Εξώστης',
            },
            powerSupply: {
                tr: 'Trifaze Enerji Panosu & Galeri Ray Aydınlatma',
                en: '3-Phase Power Panel & Gallery Track Lighting',
                el: 'Τριφασική Παροχή & Φωτισμός Ράγας',
            },
            elevatorAccess: {
                tr: '2 Adet Engelsiz Asansör',
                en: '2 Accessible Elevators',
                el: '2 Ανελκυστήρες ΑμεΑ',
            },
            connectivity: {
                tr: '',
                en: '',
                el: '',
            },
            riggingRules: {
                tr: '2. Derece Tarihi Eser • Tarihi Dokuya Uygun Hassas Kurulum',
                en: '2nd-Degree Historic Building • Non-Invasive Modular Setup',
                el: 'Διατηρητέο Μνημείο Β΄ Κατηγορίας • Προσεκτική Εγκατάσταση',
            },
            classroomCapacity: 100,
            boardroomCapacity: 75,
        },
    },
    3: {
        id: 'b2c7526e-2594-41c0-a9b7-9cc2f295f7f2',
        level: 3,
        area: '458 m²',
        title_tr: '3. Kat Sergi Salonları & Fuaye',
        title_en: '3rd Floor Exhibition Galleries & Foyer',
        title_el: '3ος Όροφος — Αίθουσες Εκθέσεων & Φουαγιέ',
        description_tr: 'Birbirine bağlantılı 9 bağımsız sergi ve atölye salonu ile geniş merkez fuaye alanından oluşan, binanın en kapsamlı sergi katıdır.',
        description_en: 'The building’s largest single-level exhibition layout, featuring 9 interconnected gallery and workshop rooms around a spacious central foyer.',
        description_el: 'Ο μεγαλύτερος εκθεσιακός όροφος του κτιρίου με 9 αίθουσες εκθέσεων και εργαστηρίων γύρω από ένα ευρύχωρο κεντρικό φουαγιέ.',
        gala_capacity: 220,
        theater_capacity: 320,
        cocktail_capacity: 450,
        floor_plan_svg_url: '/images/floorplans/level-3-official-plan.jpg',
        features_tr: [
            'Kuzey Kanadında 2 Büyük Sergi Salonu',
            'Ön Cephede 3 Sergi & Toplantı Salonu',
            'Orta Bölümde 4 Bağımsız Sergi & Atölye Odası',
            'Geniş Merkez Fuaye Alanı & Simone Restaurant Catering İmkanı',
            'Kat Deposu & Engelli Erişimli Lavabolar',
            '2 Adet Engelsiz Asansör',
        ],
        features_en: [
            '2 Large North-Wing Exhibition Halls',
            '3 Front-Facade Exhibition & Seminar Halls',
            '4 Central Gallery & Workshop Rooms',
            'Spacious Central Foyer & Catering via Simone Restaurant',
            'Storage Area & Accessible Restrooms',
            '2 Accessible Elevators',
        ],
        features_el: [
            '2 Μεγάλες Βόρειες Αίθουσες Εκθέσεων',
            '3 Μπροστινές Αίθουσες Εκθέσεων & Σεμιναρίων',
            '4 Κεντρικές Αίθουσες / Εργαστήρια',
            'Κεντρικό Φουαγιέ & Catering από το Simone Restaurant',
            'Αποθήκη Ορόφου & WC ΑμεΑ',
            '2 Ανελκυστήρες ΑμεΑ',
        ],
        image_url: '/supabase-media/venue/idso4ws063_1773084000348.webp',
        thumbnail_images: [
            '/supabase-media/venue/qe9jvxrmfdn_1773084012264.webp',
            '/supabase-media/venue/9zg4pl7tr6_1773084019065.webp',
            '/supabase-media/venue/le67ll2cb_1773084025160.webp',
        ],
        techSpecs: {
            ceilingHeight: {
                tr: '3,97 m Tavan Yüksekliği',
                en: '3.97 m Ceiling Height',
                el: '3,97 m Ύψος Οροφής',
            },
            roomStructure: {
                tr: '9 Bağımsız Sergi Salonu + Geniş Merkez Fuaye',
                en: '9 Exhibition Galleries + Spacious Central Foyer',
                el: '9 Αίθουσες Εκθέσεων + Κεντρικό Φουαγιέ',
            },
            powerSupply: {
                tr: 'Trifaze Enerji Panosu & Galeri Ray Aydınlatma',
                en: '3-Phase Power Panel & Museum Track Lighting',
                el: 'Τριφασική Παροχή & Μουσειακός Φωτισμός Ράγας',
            },
            elevatorAccess: {
                tr: '2 Adet Engelsiz Asansör',
                en: '2 Accessible Elevators',
                el: '2 Ανελκυστήρες ΑμεΑ',
            },
            connectivity: {
                tr: '',
                en: '',
                el: '',
            },
            riggingRules: {
                tr: '2. Derece Tarihi Eser • Tarihi Dokuya Uygun Hassas Kurulum',
                en: '2nd-Degree Historic Building • Freestanding Exhibition Walls',
                el: 'Διατηρητέο Μνημείο Β΄ Κατηγορίας • Προσεκτική Εγκατάσταση',
            },
            classroomCapacity: 180,
            boardroomCapacity: 80,
        },
    },
    4: {
        id: 'd4e8910a-7c12-4e55-9b30-1060f0000004',
        level: 4,
        area: '1.060 m² (Kat 1 + Kat 2 + Kat 3)',
        title_tr: 'Tüm Etkinlik Katları (Kat 1, 2 ve 3)',
        title_en: 'All Event Floors (Levels 1, 2 & 3)',
        title_el: 'Όλοι οι Όροφοι Εκδηλώσεων (1ος, 2ος & 3ος Όροφος)',
        description_tr: '1., 2. ve 3. etkinlik katlarının (toplam 1.060 m² alan: Çok Amaçlı Büyük Salon, 12 sergi ve toplantı odası, 3 fuaye ve açık avlular) tek bir organizasyona özel olarak tahsis edilmesidir. Teras katındaki Simone Restaurant’tan etkinlikler için catering hizmeti alınabilir.',
        description_en: 'Exclusive use of Levels 1, 2, and 3 (1,060 m² total event space: Multipurpose Grand Hall, 12 exhibition and seminar rooms, 3 foyers, and open-air courtyards) for a single organization or event, with direct catering options available from the rooftop Simone Restaurant.',
        description_el: 'Αποκλειστική διάθεση των Ορόφων 1, 2 και 3 (1.060 m² συνολικός χώρος: Μεγάλη Αίθουσα, 12 αίθουσες εκθέσεων, 3 φουαγιέ και αυλές), με δυνατότητα catering από το Simone Restaurant στην ταράτσα.',
        gala_capacity: 450,
        theater_capacity: 650,
        cocktail_capacity: 850,
        floor_plan_svg_url: '/images/floorplans/full-building-section-perspective.jpg',
        features_tr: [
            'Kat 1, Kat 2 ve Kat 3 Bütüncül Kullanım (1.060 m²)',
            '1 Çok Amaçlı Büyük Salon + 12 Sergi ve Toplantı Odası + 3 Fuaye',
            'Teras Katındaki Simone Restaurant’tan Catering İmkanı',
            '1. Kat Açık Hava Avluları + Vestiyer + Servis Mutfağı',
            '2 Adet Engelsiz Asansör',
            'Tek Organizasyona Özel Kullanım',
        ],
        features_en: [
            'Combined Use of Levels 1, 2 & 3 (1,060 m²)',
            '1 Multipurpose Grand Hall + 12 Exhibition & Seminar Rooms + 3 Foyers',
            'Event Catering Available from Rooftop Simone Restaurant',
            '1st Floor Open-Air Courtyards + Cloakroom + Service Kitchen',
            '2 Accessible Elevators',
            'Exclusive Event Use',
        ],
        features_el: [
            'Συνδυασμένη Χρήση 1ου, 2ου & 3ου Ορόφου (1.060 m²)',
            '1 Μεγάλη Αίθουσα + 12 Αίθουσες Εκθέσεων + 3 Φουαγιέ',
            'Δυνατότητα Catering από το Simone Restaurant στην Ταράτσα',
            '1ος Όροφος: Ανοιχτές Αυλές + Βεστιάριο + Κουζίνα',
            '2 Ανελκυστήρες ΑμεΑ',
            'Αποκλειστική Διάθεση Χώρων',
        ],
        image_url: '/supabase-media/venue/mz81jyod0nq_1773083709418.webp',
        thumbnail_images: [
            '/supabase-media/venue/ap0hijmh6rn_1773083839555.webp',
            '/supabase-media/venue/idso4ws063_1773084000348.webp',
            '/supabase-media/venue/ec39t6bl3hd_1773083599484.webp',
        ],
        techSpecs: {
            ceilingHeight: {
                tr: '3,97 m – 6,26 m Tavan Yüksekliği',
                en: '3.97 m – 6.26 m Ceiling Height',
                el: '3,97 m – 6,26 m Ύψος Οροφής',
            },
            roomStructure: {
                tr: 'Büyük Salon + 12 Sergi Odası + 3 Fuaye + 2 Açık Avlu',
                en: 'Grand Hall + 12 Galleries + 3 Foyers + 2 Courtyards',
                el: 'Μεγάλη Αίθουσα + 12 Αίθουσες + 3 Φουαγιέ + 2 Αυλές',
            },
            powerSupply: {
                tr: 'Tüm Katlarda Trifaze Enerji & Galeri Aydınlatma Altyapısı',
                en: '3-Phase Power & Gallery Lighting Across All Floors',
                el: 'Τριφασική Παροχή & Φωτισμός σε Όλους τους Ορόφους',
            },
            elevatorAccess: {
                tr: '2 Adet Engelsiz Asansör',
                en: '2 Accessible Elevators',
                el: '2 Ανελκυστήρες ΑμεΑ',
            },
            connectivity: {
                tr: '',
                en: '',
                el: '',
            },
            riggingRules: {
                tr: '2. Derece Tarihi Eser • Tarihi Dokuya Uygun Hassas Kurulum',
                en: '2nd-Degree Historic Building • Sensitive Non-Invasive Setup',
                el: 'Διατηρητέο Μνημείο Β΄ Κατηγορίας • Προσεκτική Εγκατάσταση',
            },
            classroomCapacity: 300,
            boardroomCapacity: 150,
        },
    },
};

/**
 * Normalizes DB venue_events rows with realistic MICE capacities, architectural floor plans,
 * Full Building Buyout (Level 4), and MICE technical specifications.
 */
export function enrichVenueEventsWithMiceSpecs(dbVenues: any[] | null | undefined): any[] {
    const rows = Array.isArray(dbVenues) ? [...dbVenues] : [];
    const byLevel = new Map<number, any>();

    for (const row of rows) {
        const lvl = Number(row.level);
        if (!lvl) continue;
        const canonical = CANONICAL_VENUE_MICE_DATA[lvl];
        if (!canonical) {
            byLevel.set(lvl, row);
            continue;
        }

        // Detect legacy uncalibrated template capacities (e.g., 400/600/800 on L1 or 300/450/600 on L2 & L3)
        const hasLegacyCapacities =
            (lvl === 1 && Number(row.gala_capacity) === 400 && Number(row.theater_capacity) === 600) ||
            ((lvl === 2 || lvl === 3) && Number(row.gala_capacity) === 300 && Number(row.theater_capacity) === 450) ||
            !row.gala_capacity;

        const hasGenericFeatures =
            !Array.isArray(row.features_tr) ||
            row.features_tr.length <= 5 ||
            row.features_tr.some((f: string) => /\b(02|04|05|08|12|15|kovası|PRM|2K-05|Doğu|Taşınabilir|Seminer)\b/i.test(f));

        byLevel.set(lvl, {
            ...row,
            title_tr: canonical.title_tr,
            title_en: canonical.title_en,
            title_el: canonical.title_el,
            description_tr: canonical.description_tr,
            description_en: canonical.description_en,
            description_el: canonical.description_el,
            area: row.area || canonical.area,
            gala_capacity: hasLegacyCapacities ? canonical.gala_capacity : Number(row.gala_capacity),
            theater_capacity: hasLegacyCapacities ? canonical.theater_capacity : Number(row.theater_capacity),
            cocktail_capacity: hasLegacyCapacities ? canonical.cocktail_capacity : Number(row.cocktail_capacity),
            floor_plan_svg_url:
                !row.floor_plan_svg_url || String(row.floor_plan_svg_url).endsWith('-plan.svg')
                    ? canonical.floor_plan_svg_url
                    : row.floor_plan_svg_url,
            features_tr: hasGenericFeatures ? canonical.features_tr : row.features_tr,
            features_en: hasGenericFeatures ? canonical.features_en : row.features_en,
            features_el: hasGenericFeatures ? canonical.features_el : row.features_el,
            techSpecs: canonical.techSpecs,
        });
    }

    // Ensure levels 1, 2, 3, and 4 (Full Building Buyout) are all present
    for (const lvl of [1, 2, 3, 4]) {
        if (!byLevel.has(lvl)) {
            const c = CANONICAL_VENUE_MICE_DATA[lvl];
            byLevel.set(lvl, {
                id: c.id,
                level: c.level,
                order_index: c.level,
                status: 'published',
                area: c.area,
                title_tr: c.title_tr,
                title_en: c.title_en,
                title_el: c.title_el,
                description_tr: c.description_tr,
                description_en: c.description_en,
                description_el: c.description_el,
                gala_capacity: c.gala_capacity,
                theater_capacity: c.theater_capacity,
                cocktail_capacity: c.cocktail_capacity,
                floor_plan_svg_url: c.floor_plan_svg_url,
                features_tr: c.features_tr,
                features_en: c.features_en,
                features_el: c.features_el,
                image_url: c.image_url,
                thumbnail_images: c.thumbnail_images,
                techSpecs: c.techSpecs,
            });
        }
    }

    return Array.from(byLevel.values()).sort((a, b) => Number(a.level) - Number(b.level));
}

export interface CuratedEventPatch {
    id: string;
    slug: string;
    tr: string;
    en: string;
    el: string;
}

export const CURATED_EVENT_PATCHES: CuratedEventPatch[] = [
    {
        id: '41dea564-3256-4bf8-88c7-b7cba4f784d3',
        slug: 'toz-sergisi',
        tr: [
            'Sanat kuramcısı, yazar ve küratör Ali Artun ile heykeltıraş ve kavramsal sanatçı Ahmet Yiğider’i bir araya getiren “TÖZ” sergisi, 17 Ocak – 8 Şubat 2026 tarihleri arasında Galata Rum Okulu Vakfı - Kültür Merkezi’nde sanatseverlerle buluştu.',
            'Sergi, mimarlığı gündelik yaşamın faydacı pratiklerinden, yapıların salt işlevselliğinden ve rasyonalist kurgulardan soyutlayarak; onu kadim, şiirsel, büyüsel ve sembolik bir dil olarak ele alır. Ali Artun’un kavramsal çerçevesinde “TÖZ”, çevremizi kuşatan sıradan yapılaşmanın ötesine geçerek formun, geometrinin, sayının ve sembolün imgesel dünyasına odaklanan bir mimarlık ve düşünce sergisi niteliği taşır.',
            'Ahmet Yiğider’in Galata Rum Okulu’nun tarihi neoklasik atmosferiyle diyalog kuran heykel ve mekânsal yerleştirmeleri, insanlığın kadim hafızasındaki izleri, tözü ve gizemi görünür kılar. Sergi, izleyiciyi mekân, form ve varoluş arasındaki derin ilişki üzerine kozmik ve şiirsel bir tefekkür alanına davet eder.',
        ].join('\n\n'),
        en: [
            'Bringing together art theorist, author, and curator Ali Artun with sculptor and conceptual artist Ahmet Yiğider, the exhibition “TÖZ” (Substance) welcomed visitors at the Galata Greek School Foundation - Cultural Center between January 17 and February 8, 2026.',
            'Abstracting architecture from utilitarian daily practices, functionalist constraints, and rationalist construction, the exhibition approaches architecture as an ancient, poetic, and symbolic language. Within Ali Artun’s curatorial framework, “TÖZ” transcends ordinary built environments to explore the imaginative realm of form, geometry, number, and symbol.',
            'In dialogue with the historic neoclassical atmosphere of the Galata Greek School, Ahmet Yiğider’s sculptures and spatial installations render visible the traces, substance, and mystery embedded in humanity’s ancient memory — inviting viewers into a space of contemplation on space, form, and existence.',
        ].join('\n\n'),
        el: [
            'Συνενώνοντας τον θεωρητικό της τέχνης, συγγραφέα και επιμελητή Ali Artun με τον γλύπτη και εννοιολογικό καλλιτέχνη Ahmet Yiğider, η έκθεση «TÖZ» (Ουσία) φιλοξενήθηκε στο Ίδρυμα Ελληνικού Σχολείου Γαλατά - Πολιτιστικό Κέντρο από τις 17 Ιανουαρίου έως τις 8 Φεβρουαρίου 2026.',
            'Αποδεσμεύοντας την αρχιτεκτονική από τη χρησιμοθηρική καθημερινότητα και τον ορθολογισμό, η έκθεση την προσεγγίζει ως μια αρχέγονη, ποιητική και συμββλική γλώσσα που εστιάζει στον φαντασιακό κόσμο της μορφής, της γεωμετρίας, του αριθμού και του συμβόλου.',
            'Σε διάλογο με την ιστορική νεοκλασική ατμόσφαιρα της Σχολής Γαλατά, τα γλυπτά και οι χωρικές εγκαταστάσεις του Ahmet Yiğider αναδεικνύουν τα ίχνη και την ουσία της αρχαίας μνήμης, προσκαλώντας τον επισκέπτη σε έναν χώρο στοχασμού γύρω από τον χώρο, τη μορφή και την ύπαρξη.',
        ].join('\n\n'),
    },
    {
        id: 'ea2aa434-164a-4b0d-82a8-662393a1cb78',
        slug: 'samatya-donem-konseri-sesler-hazinesi-orkestra-ve-solistleri',
        tr: 'Sesler Hazinesi Orkestra ve Solistleri tarafından Galata Rum Okulu’nun tarihi ana salonunda gerçekleştirilen “Samatya” Dönem Konseri, İstanbul’un çok kültürlü müzik mirasını ve Samatya’nın tarihsel ezgilerini dinleyicilerle buluşturdu.',
        en: 'Performed by the Treasury of Voices Orchestra and Soloists in the historic Grand Hall of the Galata Greek School, the “Samatya” Period Concert brought Istanbul’s multicultural musical heritage and historical melodies to the audience.',
        el: 'Η συναυλία εποχής «Samatya» από την Ορχήστρα και τους Σολίστ «Θησαυρός Φωνών» στην ιστορική αίθουσα της Σχολής Γαλατά ανέδειξε την πολυπολιτισμική μουσική κληρονομιά της Κωνσταντινούπολης.',
    },
    {
        id: '7393d6fb-db07-4685-af62-10cc035a0ca2',
        slug: 'violete-ikari-konseri-galatada-ince-bir-yagmur-neapoleos-stavropoleos-kutsal-metropolitligi-kadin-ko',
        tr: 'Yunan müziğinin sevilen sesi Violete Ikari, Neapoleos & Stavropoleos Kutsal Metropolitliği Kadın Korosu eşliğinde “Galata’da İnce Bir Yağmur…” başlıklı özel konserde Galata Rum Okulu sahnesinde dinleyicilerle buluştu.',
        en: 'Acclaimed Greek vocalist Violete Ikari, accompanied by the Women’s Choir of the Holy Metropolis of Neapoli and Stavroupoli, performed the special concert “A Fine Rain in Galata…” at the Galata Greek School.',
        el: 'Η καταξιωμένη ερμηνεύτρια Βιολέτα Ίκαρη, συνοδευόμενη από τη Γυναικεία Χορωδία της Ιεράς Μητροπόλεως Νεαπόλεως και Σταυρουπόλεως, παρουσίασε μια ξεχωριστή συναυλία στη Σχολή Γαλατά.',
    },
    {
        id: 'f9d2422d-d955-4d80-8828-94eaf2ef2ad9',
        slug: '212-photography-istanbul-festivali-viviane-sassen-afisi',
        tr: 'Uluslararası fotoğraf ve görsel sanatlar festivali 212 Photography Istanbul kapsamında Galata Rum Okulu, çağdaş fotoğraf sanatının öncü isimlerinden Viviane Sassen başta olmak üzere uluslararası sanatçıların seçkilerine ev sahipliği yaptı.',
        en: 'As part of the international 212 Photography Istanbul festival, the Galata Greek School hosted curated exhibitions featuring leading contemporary photographers including Viviane Sassen.',
        el: 'Στο πλαίσιο του διεθνούς φεστιβάλ 212 Photography Istanbul, η Σχολή Γαλατά φιλοξένησε επιμελημένες εκθέσεις σύγχρονης φωτογραφίας με έργα της Viviane Sassen και διεθνών καλλιτεχνών.',
    },
    {
        id: 'bb82fa65-e8ec-45ec-8117-d5bb949923bc',
        slug: '212-photography-istanbul-festivali-ebru-yildiz-afisi',
        tr: '212 Photography Istanbul festivali kapsamında Galata Rum Okulu’nun sergi salonlarında düzenlenen seçkide, Ebru Yıldız’ın müzik ve sahne dünyasını belgeleyen çarpıcı fotoğraf çalışmaları sanatseverlerle buluştu.',
        en: 'Hosted across the exhibition halls of the Galata Greek School during the 212 Photography Istanbul festival, this showcase presented striking photographic works by Ebru Yıldız.',
        el: 'Στο πλαίσιο του φεστιβάλ 212 Photography Istanbul, οι εκθεσιακοί χώροι της Σχολής Γαλατά φιλοξένησαν φωτογραφικά έργα της Ebru Yıldız.',
    },
    {
        id: 'c258c4a7-8c4d-47e7-88cb-919e116b4135',
        slug: 'murat-tabanlioglu-liderliginde-port-city-talks-living-by-the-water-sergi-kapanisi',
        tr: 'Mimar Murat Tabanlıoğlu öncülüğünde düzenlenen “Port City Talks: Living by the Water” sergi kapanışı ve söyleşi programı, liman kentlerinin mimari, kültürel ve kentsel dönüşümünü Galata Rum Okulu’nda tartışmaya açtı.',
        en: 'Led by architect Murat Tabanlıoğlu, the closing symposium of “Port City Talks: Living by the Water” explored the architectural, cultural, and urban evolution of port cities at the Galata Greek School.',
        el: 'Υπό την καθοδήγηση του αρχιτέκτονα Murat Tabanlıoğlu, το συμπόσιο λήξης της έκθεσης «Port City Talks: Living by the Water» εξέτασε την αρχιτεκτονική και πολιτιστική εξέλιξη των πόλεων-λιμανιών.',
    },
    {
        id: 'be2395b4-6335-4d04-9766-26981adc4945',
        slug: 'ustad-thrasivoulos-stanitsas-1910-1987-anisina-duzenlenen-dini-musiki-konseri',
        tr: 'İstanbul doğumlu büyük muganni ve Patrikhane Başmugannisi (Arhondon Protopsaltis) Üstad Thrasivoulos Stanitsas (1910–1987) anısına düzenlenen bu özel dinî musiki konseri, Bizans ve İstanbul Rum musiki geleneğinin seçkin eserlerini Galata Rum Okulu’nun tarihi atmosferinde dinleyicilerle buluşturdu.',
        en: 'Held in memory of the Istanbul-born Archon Protopsaltis of the Ecumenical Patriarchate, Master Thrasivoulos Stanitsas (1910–1987), this sacred music concert presented distinguished works of the Byzantine and Constantinopolitan musical tradition at the Galata Greek School.',
        el: 'Αφιερωμένη στη μνήμη του Κωνσταντινουπολίτη Άρχοντος Πρωτοψάλτου της Μεγάλης του Χριστού Εκκλησίας Θρασύβουλου Στανίτσα (1910–1987), αυτή η συναυλία εκκλησιαστικής μουσικής παρουσίασε εκλεκτά έργα της βυζαντινής και πολίτικης ψαλτικής παράδοσης στη Σχολή Γαλατά.',
    },
    {
        id: 'd011faf7-00d9-444f-b537-7deb4689ea8e',
        slug: 'aleksis-aleksandris',
        tr: 'Tarihçi, diplomat ve yazar Büyükelçi Aleksis Aleksandris’in katılımıyla Galata Rum Okulu’nda düzenlenen bu özel konferans ve söyleşide, İstanbul Rum toplumunun yakın dönem eğitim, kültür ve diplomasi tarihi kapsamlı biçimde ele alındı.',
        en: 'Featuring historian, diplomat, and author Ambassador Alexis Alexandris, this special lecture and discussion at the Galata Greek School examined the modern educational, cultural, and diplomatic history of the Greek community of Istanbul.',
        el: 'Με τη συμμετοχή του ιστορικού, διπλωμάτη και συγγραφέα Πρέσβη Αλέξη Αλεξανδρή, αυτή η ειδική διάλεξη στη Σχολή Γαλατά εξέτασε τη σύγχρονη εκπαιδευτική, πολιτιστική και διπλωματική ιστορία της ελληνικής κοινότητας της Κωνσταντινούπολης.',
    },
    {
        id: 'd46eb8b7-1e2b-40db-b156-2aa1780f69b3',
        slug: 'cagri-sarayin-eksilen-zaman-adli-sergisi',
        tr: 'Çağdaş sanatçı Çağrı Saray’ın Galata Rum Okulu’nda gerçekleşen “Eksilen Zaman” başlıklı kişisel sergisi; kentsel bellek, mekânsal dönüşüm ve zamanın aşındırdığı kişisel-toplumsal izleri çizim, video ve mekâna özgü yerleştirmeler aracılığıyla izleyiciye sundu.',
        en: 'Hosted at the Galata Greek School, contemporary artist Çağrı Saray’s solo exhibition “Diminishing Time” explored urban memory, spatial transformation, and the traces eroded by time through drawings, video works, and site-specific installations.',
        el: 'Η ατομική έκθεση του σύγχρονου καλλιτέχνη Çağrı Saray «Μειούμενος Χρόνος» στη Σχολή Γαλατά διερεύνησε την αστική μνήμη, τον χωρικό μετασχηματισμό και τα ίχνη του χρόνου μέσα από σχέδια, βίντεο και εγκαταστάσεις.',
    },
    {
        id: 'f9c5d523-452d-4876-9a4c-e69626593e33',
        slug: 'ceren-oykutun-konstantiniye-ve-ayasofya-defterleri-adli-sergisi',
        tr: 'Sanatçı Ceren Oykut’un Galata Rum Okulu’nda düzenlenen “Konstantiniye ve Ayasofya Defterleri” sergisi, İstanbul’un tarihsel katmanlarını, gündelik kent yaşamını ve mimari hafızasını incelikli desen ve defter çalışmaları üzerinden görünür kıldı.',
        en: 'Presented at the Galata Greek School, artist Ceren Oykut’s exhibition “Sketchbooks of Constantinople and Hagia Sophia” illuminated Istanbul’s historical layers, everyday urban life, and architectural memory through intricate drawings and sketchbooks.',
        el: 'Η έκθεση της καλλιτέχνιδας Ceren Oykut «Τετράδια Κωνσταντινουπόλεως και Αγίας Σοφίας» στη Σχολή Γαλατά ανέδειξε τα ιστορικά στρώματα και την αρχιτεκτονική μνήμη της πόλης μέσα από λεπτομερή σχέδια.',
    },
    {
        id: '3fca592d-f02a-4d04-bbae-6cef46ec430b',
        slug: '2-istanbul-tasarim-bienali-gelecek-artik-eskisi-gibi-degil',
        tr: 'İstanbul Kültür Sanat Vakfı (İKSV) tarafından Zoë Ryan küratörlüğünde düzenlenen 2. İstanbul Tasarım Bienali, “Gelecek Artık Eskisi Gibi Değil” başlığı altında ana sergi mekânı olarak Galata Rum Okulu’nda gerçekleşti. Bienal boyunca tarihi okul binasının tüm katları, manifestolar ve tasarım projeleriyle uluslararası bir düşünce laboratuvarına dönüştü.',
        en: 'Organized by the Istanbul Foundation for Culture and Arts (İKSV) and curated by Zoë Ryan, the 2nd Istanbul Design Biennial took place at the Galata Greek School as its primary venue under the theme “The Future Is Not What It Used To Be.”',
        el: 'Διοργανωμένη από το Ίδρυμα Πολιτισμού και Τεχνών της Κωνσταντινούπολης (İKSV) σε επιμέλεια της Zoë Ryan, η 2η Μπιενάλε Σχεδιασμού της Κωνσταντινούπολης φιλοξενήθηκε στη Σχολή Γαλατά με θέμα «Το Μέλλον Δεν Είναι Πια Όπως Παλιά».',
    },
    {
        id: '35031159-3d9a-43c2-8d26-5b5a2585f712',
        slug: 'galata-rum-okulunda-duzenlenen-ikona-yapim-atolyesi',
        tr: 'Galata Rum Okulu’nun eğitim ve kültürel miras programları kapsamında gerçekleştirilen İkona Yapım Atölyesi’nde, geleneksel Bizans ikona resim teknikleri, ahşap hazırlığı, doğal pigmentler ve altın varak uygulamaları uygulamalı olarak katılımcılarla paylaşıldı.',
        en: 'Held as part of the cultural heritage and educational programs at the Galata Greek School, the Icon Making Workshop introduced participants to traditional Byzantine iconography techniques, wooden panel preparation, natural pigments, and gold leaf application.',
        el: 'Στο πλαίσιο των εκπαιδευτικών και πολιτιστικών προγραμμάτων της Σχολής Γαλατά, το Εργαστήριο Αγιογραφίας παρουσίασε τις παραδοσιακές βυζαντινές τεχνικές αγιογραφίας, την προετοιμασία ξύλου, τις φυσικές χρωστικές και το φύλλο χρυσού.',
    },
    {
        id: '2e9caf22-1aa9-452e-b057-061634e1e159',
        slug: '206-odali-sessizlik-buyukada-rum-yetimhanesi-uzerine-etudler-sergisi',
        tr: 'Avrupa’nın en büyük, dünyanın ise ikinci en büyük ahşap yapısı olan Büyükada Rum Yetimhanesi’nin mimari, tarihsel ve insani hafızasına odaklanan “206 Odalı Sessizlik: Büyükada Rum Yetimhanesi Üzerine Etüdler” sergisi, Galata Rum Okulu’nda arşiv belgeleri, fotoğraflar ve mimari araştırmalar eşliğinde izleyiciyle buluştu.',
        en: 'Focusing on the architectural, historical, and human memory of the Prinkipo Greek Orphanage — Europe’s largest wooden building — the exhibition “206 Rooms of Silence: Studies on the Prinkipo Greek Orphanage” brought together archival documents, photographs, and architectural research at the Galata Greek School.',
        el: 'Εστιάζοντας στην αρχιτεκτονική και ιστορική μνήμη του Ελληνικού Ορφανοτροφείου της Πριγκήπου — του μεγαλύτερου ξύλινου κτιρίου της Ευρώπης — η έκθεση «Σιωπή 206 Δωματίων» παρουσίασε αρχειακά τεκμήρια, φωτογραφίες και αρχιτεκτονικές μελέτες στη Σχολή Γαλατά.',
    },
    {
        id: 'b6bbe178-ae6c-468a-9d25-69d3dfc85f44',
        slug: 'alacakaranlikta-gunden-gune',
        tr: [
            'Aret Gıcır’ın üçüncü kişisel sergisi “Günden Güne” (7 Mayıs – 4 Haziran 2016), Öktem&Aykut işbirliğiyle Galata Rum Okulu’nda gerçekleşti. Sergi, İstanbul Ermeni Patriği Mesrob II’nin (Mesrob Mutafyan) rahatsızlığının tıbbi adı olan “frontotemporal demans”tan yola çıkarak; hafızayı, tarihi, unutuşu ve yaşamla ölüm arasında asılı kalmış zamanı ele alır. İsmini şair Garbis Cancikyan’ın ilk şiirinden alan sergi, patriğin kapalı bilinci ile toplumsal hafızanın günden güne soluşunu paralel süreçler olarak kurgular.',
            'Sergi kapsamında düzenlenen “Alacakaranlıkta Günden Güne” söyleşisinde (4 Haziran 2016), Nora Tataryan, Yetvart Tovmasyan, Sevan Değirmenciyan ve Rober Koptaş’ın katılımıyla serginin kavramsal çerçevesi ve toplumsal bellek tartışmaya açılmıştır.',
        ].join('\n\n'),
        en: [
            'Aret Gıcır’s third solo exhibition “From Day to Day” (May 7 – June 4, 2016) took place at the Galata Greek School in collaboration with Öktem&Aykut. Departing from frontotemporal dementia — the medical condition affecting Istanbul Armenian Patriarch Mesrob II — the exhibition explores memory, history, forgetting, and time suspended between life and death, taking its title from the first published poem of Garbis Cancikyan.',
            'Held in the 3rd-floor exhibition space on June 4, 2016, the companion panel “Day by Day in the Twilight” brought together Nora Tataryan, Yetvart Tovmasyan, Sevan Değirmenciyan, and Rober Koptaş to discuss the exhibition and collective memory.',
        ].join('\n\n'),
        el: [
            'Η τρίτη ατομική έκθεση του Aret Gıcır «Μέρα με τη Μέρα / ՕՐԷ ՕՐ» (7 Μαΐου – 4 Ιουνίου 2016) πραγματοποιήθηκε στη Σχολή Γαλατά σε συνεργασία με την γκαλερί Öktem&Aykut, εξετάζοντας τη μνήμη, την ιστορία, τη λήθη και τον μετέωρο χρόνο με αφετηρία το ποίημα του Garbis Cancikyan.',
            'Στο πλαίσιο της έκθεσης πραγματοποιήθηκε στις 4 Ιουνίου 2016 η συζήτηση «Μέρα με τη Μέρα στο Λυκόφως» στον 3ο όροφο της Σχολής Γαλατά με τη συμμετοχή των Nora Tataryan, Yetvart Tovmasyan, Sevan Değirmenciyan και Rober Koptaş.',
        ].join('\n\n'),
    },
    {
        id: '33424163-c303-4d19-a866-75fbe6b13905',
        slug: 'dusunce-bahcesi-melek-aksoy-sinan-logie',
        tr: [
            'Reysi Kamhi’nin Galata Rum Okulu Açık Okul Kütüphanesi’nde gerçekleşen “Düşünce Bahçesi” başlıklı kişisel sergisi, bahçe mekânıyla kütüphane mekânını ilişkilendirerek doğa imgeleri üzerinden mekân içinde başka bir mekân yaratma sürecini kurgular. Kamhi, üzerinde çalıştığı ölüdoğa serisi ile dünyaya başka bir canlının gözünden bakmaya ve unutulanın hatırlandığı bu hayali bahçede kolektif okuma seanslarına davet eder.',
            'Sergi kapsamındaki okuma serilerinin ikincisinde (9 Haziran 2016), Melek Aksoy ve Sinan Logie “İstanbul Bahçeleri” kitaplarından yola çıkarak Turgut Cansever’in metinleri eşliğinde kentin dün ve bugünkü bahçe kültürüyle ilişkisini yorumlamıştır.',
        ].join('\n\n'),
        en: [
            'Hosted in the Open School Library of the Galata Greek School, Reysi Kamhi’s solo exhibition “A Garden of Thoughts” associates the garden with the library space through nature morte drawings — inviting viewers to look through the eyes of another being and participate in collective reading sessions.',
            'As the second session of the exhibition’s reading series (June 9, 2016), Melek Aksoy and Sinan Logie presented a reading from their book “Gardens of Istanbul”, interpreting the city’s historical and contemporary garden culture through the writings of architect Turgut Cansever.',
        ].join('\n\n'),
        el: [
            'Η ατομική έκθεση της Reysi Kamhi «Κήπος της Σκέψης» στην Ανοιχτή Σχολική Βιβλιοθήκη της Σχολής Γαλατά συνδέει τον χώρο του κήπου με τη βιβλιοθήκη μέσα από σχέδια νεκρής φύσης και συλλογικές αναγνώσεις.',
            'Στο πλαίσιο της σειράς αναγνώσεων της έκθεσης (9 Ιουνίου 2016), οι Melek Aksoy και Sinan Logie παρουσίασαν ανάγνωση από το βιβλίο τους «Κήποι της Κωνσταντινούπολης» με αναφορές στο έργο του αρχιτέκτονα Turgut Cansever.',
        ].join('\n\n'),
    },
    {
        id: '7fc2757e-e8f3-48d9-b856-5f0076c792b9',
        slug: 'en-basa-don-okumalari',
        tr: [
            'Galata Rum Okulu’nun 4. katındaki Açık Okul Kütüphanesi’nde gerçekleşen Erinç Seymen’in “En Başa Dön” başlıklı sergisi; azınlık kimliklerine atfedilen zanaatlerin ve mesleki ustalıkların hem yaşam kalım gereci olarak işlevselliğini hem de toplumları şematize eden göstergelere dönüşümünü tartışmaya açar. Resim ve heykelden oluşan yerleştirme, meslek/emek türü ile kültürel kimlik ilişkisini indirgemeci bakıştan kurtarmanın gerekliliğine işaret eder.',
            'Sergi kapsamında Rita Ender yönetiminde düzenlenen “En Başa Dön Okumaları” serisinde (4 ve 11 Mayıs 2017), Ender’in “Kolay Gelsin: Meslekler ve Mekanlar” kitabında yer verdiği son zanaat ustalarından Artin Aharon ve Hraç Arslanyan konuk olmuştur.',
        ].join('\n\n'),
        en: [
            'Hosted at the Open School Library on the 4th floor of the Galata Greek School, Erinç Seymen’s exhibition “Go Back to the Very Beginning” examines the transformation of artisanship and professional craftsmanship attributed to minority identities — comprising painting and sculpture that challenge reductionist perspectives on labor and cultural identity.',
            'Held in conjunction with the exhibition on May 4 and May 11, 2017, the “Back to the Beginning Readings” series moderated by Rita Ender welcomed master artisans Artin Aharon and Hraç Arslanyan featured in Ender’s book “Kolay Gelsin: Professions and Spaces.”',
        ].join('\n\n'),
        el: [
            'Η έκθεση του Erinç Seymen «Επιστροφή στην Αρχή» στην Ανοιχτή Σχολική Βιβλιοθήκη του 4ου ορόφου της Σχολής Γαλατά εξετάζει τις παραδοσιακές τέχνες και επαγγελματικές δεξιότητες που αποδίδονται στις μειονοτικές ταυτότητες μέσα από ζωγραφική και γλυπτική.',
            'Στο πλαίσιο της έκθεσης πραγματοποιήθηκε στις 4 και 11 Μαΐου 2017 η σειρά «Αναγνώσεις Επιστροφή στην Αρχή» υπό τον συντονισμό της Rita Ender με προσκεκλημένους τους τεχνίτες Artin Aharon και Hraç Arslanyan.',
        ].join('\n\n'),
    },
    {
        id: '66f6f1d2-e769-478c-b10e-e407e23f74ff',
        slug: 'stefanos-yerasimosun-izinde-istanbul-ve-osmanli-tarihi',
        tr: [
            'Galata Rum Okulu’nda 14 Kasım – 26 Aralık 2015 tarihleri arasında Stefanos Yerasimos’un vefatının 10. yıl dönümü vesilesiyle düzenlenen “Yerasimos Okulu: İstanbul’dan Evrensele” sergisi ve açılış paneli; tarihçi, yazar, mimar ve şehircilik uzmanı Stefanos Yerasimos’un bir İstanbullu olarak yarattığı ansiklopedik hafızanın izlerini süren bir kent okulu temsilidir (Açılış paneli konuşmacıları: Halil Berktay, Jean-François Pérouse, Afife Batur, Nevra Necipoğlu, Ersu Pekin, Orhan Silier, Aksel Tibet, İpek Akpınar, Hakan Erdem, Aykut Köksal).',
            'Sergi kapsamında 19 Aralık 2015 tarihinde Boğaziçi Üniversitesi Tarih Bölümü öğretim üyesi Prof. Dr. Edhem Eldem tarafından “Stefanos Yerasimos’un İzinde: İstanbul ve Osmanlı Tarihi” başlıklı özel konferans gerçekleştirilmiştir.',
        ].join('\n\n'),
        en: [
            'Organized at the Galata Greek School between November 14 and December 26, 2015 on the 10th anniversary of Stefanos Yerasimos’s passing, the exhibition and opening symposium “The Yerasimos School: From Istanbul to the Universal” honored the encyclopedic urban memory created by historian, author, architect, and urbanist Stefanos Yerasimos.',
            'As part of the exhibition program on December 19, 2015, Prof. Dr. Edhem Eldem (Boğaziçi University, Department of History) delivered the special lecture “In the Footsteps of Stefanos Yerasimos: History of Istanbul and the Ottoman Empire.”',
        ].join('\n\n'),
        el: [
            'Διοργανωμένη στη Σχολή Γαλατά από τις 14 Νοεμβρίου έως τις 26 Δεκεμβρίου 2015 με αφορμή τη 10η επέτειο από την απώλεια του Στέφανου Γεράσιμου, η έκθεση και το συμπόσιο «Η Σχολή Γεράσιμου: Από την Κωνσταντινούπολη στο Οικουμενικό» τίμησαν την εγκυκλοπαιδική μνήμη του ιστορικού, αρχιτέκτονα και πολεοδόμου.',
            'Στο πλαίσιο της έκθεσης, στις 19 Δεκεμβρίου 2015 ο καθηγητής Ιστορίας του Πανεπιστημίου Boğaziçi Δρ. Edhem Eldem έδωσε την ειδική διάλεξη «Στα Βήματα του Στέφανου Γεράσιμου: Ιστορία της Κωνσταντινούπολης και της Οθωμανικής Αυτοκρατορίας».',
        ].join('\n\n'),
    },
];

export interface SnapshotEventRecord {
    id: string;
    slug: string;
    title_tr?: string;
    title_en?: string;
    title_el?: string;
    description_tr?: string;
    description_en?: string;
    description_el?: string;
}

export interface SnapshotArtifactRecord {
    id: string;
    archive_type?: string;
    title_tr?: string;
    title_en?: string;
    title_el?: string;
    description_tr?: string;
    description_en?: string;
    description_el?: string;
    provenance_tr?: string;
    provenance_en?: string;
    provenance_el?: string;
}

const SNAPSHOT_EVENTS: SnapshotEventRecord[] = ((seoRouteSnapshotData as any)?.events || []) as SnapshotEventRecord[];
const SNAPSHOT_ARTIFACTS: SnapshotArtifactRecord[] = ((seoRouteSnapshotData as any)?.artifacts || []) as SnapshotArtifactRecord[];

const SNAPSHOT_EVENT_BY_KEY = new Map<string, SnapshotEventRecord>();
for (const ev of SNAPSHOT_EVENTS) {
    if (ev.slug) SNAPSHOT_EVENT_BY_KEY.set(ev.slug, ev);
    if (ev.id) SNAPSHOT_EVENT_BY_KEY.set(ev.id, ev);
}

const SNAPSHOT_ARTIFACT_BY_ID = new Map<string, SnapshotArtifactRecord>();
for (const art of SNAPSHOT_ARTIFACTS) {
    if (art.id) SNAPSHOT_ARTIFACT_BY_ID.set(art.id, art);
}

export function getCuratedEventTitle(
    slugOrId: string | null | undefined,
    lang: 'tr' | 'en' | 'el'
): string {
    if (!slugOrId) return '';
    const snap = SNAPSHOT_EVENT_BY_KEY.get(slugOrId);
    if (!snap) return '';
    const field = `title_${lang}` as const;
    return (snap[field] || '').trim();
}

export function getCuratedEventDescription(
    slugOrId: string | null | undefined,
    lang: 'tr' | 'en' | 'el'
): string {
    if (!slugOrId) return '';
    const snap = SNAPSHOT_EVENT_BY_KEY.get(slugOrId);
    if (snap) {
        const field = `description_${lang}` as const;
        const val = (snap[field] || '').trim();
        if (val) return val;
    }
    const found = CURATED_EVENT_PATCHES.find(
        (p) => p.slug === slugOrId || p.id === slugOrId
    );
    if (!found) return '';
    return found[lang] || found.tr;
}

export function getCuratedArtifactTranslation(
    id: string | null | undefined
): SnapshotArtifactRecord | null {
    if (!id) return null;
    return SNAPSHOT_ARTIFACT_BY_ID.get(id) ?? null;
}

export { resolveEventSlug, resolveEventIdFromStabilizedSlug } from '../utils/eventSlug';

/**
 * Runs when an authenticated admin session is active in AdminPage.
 * Strictly non-destructive: seeds missing event_types or hero_slides_config without
 * overwriting staff-edited rows in venue_events, past_events, or page_content.
 */
export async function syncDatabaseWithAuthenticatedSession(): Promise<void> {
    try {
        // 1. Ensure canonical event_types exist without overwriting custom staff edits
        await supabase
            .from('event_types')
            .upsert(CANONICAL_EVENT_TYPES, { onConflict: 'key', ignoreDuplicates: true });

        // 2. Seed default hero_slides_config into page_content only if not already present
        const { data: existingHeroConfig } = await supabase
            .from('page_content')
            .select('id')
            .eq('page_key', 'home')
            .eq('section_key', 'hero_slides_config')
            .maybeSingle();

        if (!existingHeroConfig) {
            const defaultJson = JSON.stringify(DEFAULT_HERO_CONFIG);
            await supabase.from('page_content').insert([
                {
                    page_key: 'home',
                    section_key: 'hero_slides_config',
                    content_tr: defaultJson,
                    content_en: defaultJson,
                    content_el: defaultJson,
                },
            ]);
        }

        // 3. Upgrade legacy "120 Yıllık" -> "140 Yıllık" in history page_content rows
        const { data: historyRows } = await supabase
            .from('page_content')
            .select('id, content_tr, content_en, content_el')
            .eq('page_key', 'history')
            .in('section_key', ['hero_title', 'hero_title1', 'hero_subtitle']);

        if (historyRows && historyRows.length > 0) {
            for (const row of historyRows) {
                if ((row.content_tr || '').includes('120') || (row.content_en || '').includes('120') || (row.content_el || '').includes('120')) {
                    await supabase
                        .from('page_content')
                        .update({
                            content_tr: (row.content_tr || '').replace(/\b120\b/g, '140'),
                            content_en: (row.content_en || '').replace(/\b120\b/g, '140'),
                            content_el: (row.content_el || '').replace(/\b120\b/g, '140'),
                        })
                        .eq('id', row.id);
                }
            }
        }

        // 4. Sync Turkish-only protocol wording and Greek editorial fixes in history page_content
        const { data: trProtocolRows } = await supabase
            .from('page_content')
            .select('id, section_key, content_tr, content_en, content_el')
            .eq('page_key', 'history')
            .in('section_key', ['middle_subtitle', 'restoration_p1', 'restoration_p2']);

        if (trProtocolRows && trProtocolRows.length > 0) {
            for (const row of trProtocolRows) {
                const stripP2 = (val: string) =>
                    row.section_key === 'restoration_p1' ? val.split(/\n\s*\n/)[0].trim() : val;
                const origTr = row.content_tr || '';
                const origEn = row.content_en || '';
                const origEl = row.content_el || '';

                const updatedTr = stripP2(origTr)
                    .replace(
                        /Saygıdeğer\s+Ekümenik\s+Patrik\s+I\.\s*Bartholomeos['’]un|Ekümenik\s+Patrik\s+Hazretleri\s+I\.\s*Bartholomeos['’]un|Ekümenik\s+Patrik\s+I\.\s*Bartholomeos['’]un/g,
                        'Patrik Hazretlerinin'
                    )
                    .replace(/sahiplerine iade edilmiştir/g, "İstanbul Rum Cemaati'ne iade edilmiştir");
                const updatedEn = stripP2(origEn);
                const updatedEl = stripP2(origEl)
                    .replace(/χάρις στη ευγενική/g, 'χάρη στην ευγενική')
                    .replace(/και της εταιρεία Ark İnşaat/g, 'και της εταιρείας Ark İnşaat')
                    .replace(/«Το Σχολείο»/g, '«Η Σχολή»');

                if (updatedTr !== origTr || updatedEn !== origEn || updatedEl !== origEl) {
                    await supabase
                        .from('page_content')
                        .update({ content_tr: updatedTr, content_en: updatedEn, content_el: updatedEl })
                        .eq('id', row.id);
                }
            }
        }

        // 4b. Sync history_timeline Greek terminology (Αποκατάσταση instead of Ανακαίνιση)
        const { data: timelineRows } = await supabase
            .from('history_timeline')
            .select('id, title_el, description_el');

        if (timelineRows && timelineRows.length > 0) {
            for (const row of timelineRows) {
                const origTitleEl = row.title_el || '';
                const origDescEl = row.description_el || '';
                const updatedTitleEl = origTitleEl.replace(/Έναρξη Ανακαίνισης/g, 'Έναρξη Αποκατάστασης');
                const updatedDescEl = origDescEl
                    .replace(/έργο ανακαίνισης/g, 'έργο αποκατάστασης')
                    .replace(/Το επίπεδο υψόμετρου της πρόσοψης του κτιρίου ρυθμίστηκε/g, 'Η στάθμη της πρόσοψης του κτιρίου διαμορφώθηκε');
                if (updatedTitleEl !== origTitleEl || updatedDescEl !== origDescEl) {
                    await supabase
                        .from('history_timeline')
                        .update({ title_el: updatedTitleEl, description_el: updatedDescEl })
                        .eq('id', row.id);
                }
            }
        }

        // 5. Sync editorial EN & EL translations for past_events and artifacts from seoRouteSnapshot.json
        for (const ev of SNAPSHOT_EVENTS) {
            if (ev.id && ev.title_en && ev.title_el && ev.description_en && ev.description_el) {
                await supabase
                    .from('past_events')
                    .update({
                        title_en: ev.title_en,
                        title_el: ev.title_el,
                        description_en: ev.description_en,
                        description_el: ev.description_el,
                    })
                    .eq('id', ev.id);
            }
        }

        for (const art of SNAPSHOT_ARTIFACTS) {
            if (art.id && art.title_en && art.title_el) {
                await supabase
                    .from('artifacts')
                    .update({
                        title_en: art.title_en,
                        title_el: art.title_el,
                        description_en: art.description_en || '',
                        description_el: art.description_el || '',
                    })
                    .eq('id', art.id);
            }
        }
    } catch (err) {
        console.warn('Database auto-sync warning:', err);
    }
}
