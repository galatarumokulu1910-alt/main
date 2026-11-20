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
    const legacy = PRESERVED_LEGACY_EVENTS.find((e) => e.slug === slugOrId || e.id === slugOrId);
    if (legacy) return legacy;
    const snap = SNAPSHOT_EVENT_BY_KEY.get(slugOrId);
    if (snap) return snap as unknown as PreservedLegacyEvent;
    return null;
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
    dbRows?: Array<{ key?: string; label_tr: string; label_en: string; label_el: string }> | null | undefined
): Array<{ key: string; tr: string; en: string; el: string }> {
    void dbRows;
    return CANONICAL_EVENT_TYPES.map((item) => ({
        key: item.key,
        tr: item.label_tr,
        en: item.label_en,
        el: item.label_el,
    }));
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
            'Χώρος Έκθεσης & Φουαγιέ (100 m²) + Πρόσθια Αίθουσα',
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
            '/images/architecture/mehmet-mutaf-01-buyuk-salon-tas-duvar.jpg',
            '/images/architecture/mehmet-mutaf-02-ust-balkon-buyuk-salon.jpg',
            '/images/architecture/mehmet-mutaf-03-birinci-kat-fuaye-giris.jpg',
            '/images/architecture/mehmet-mutaf-09-tonozlu-tarihi-tas-mekan.jpg',
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
                el: 'Διατηρητέο Μνημείο Β΄ Κατηγορίας • Μη Επεμβατική / Αυτοφερόμενη Εγκατάσταση',
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
        description_el: 'Περιλαμβάνει 3 αίθουσες εκθέσεων και συνεδριάσεων στην κύρια όψη της οδού Kemeraltı, ευρύχωρο κεντρικό φουαγιέ και τον εξώστη με θέα στη Μεγάλη Αίθουσα.',
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
            '3 Αίθουσες Εκθέσεων & Σεμιναρίων στην Κύρια Όψη',
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
            '/images/architecture/mehmet-mutaf-04-sergi-salonlari-enfilade.jpg',
            '/images/architecture/mehmet-mutaf-02-ust-balkon-buyuk-salon.jpg',
            '/images/architecture/mehmet-mutaf-08-anaokulu-fresk-koridor.jpg',
            '/images/architecture/tepta-tarihi-ana-merdiven-kovasi.jpg',
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
                el: 'Διατηρητέο Μνημείο Β΄ Κατηγορίας • Μη Επεμβατική / Αυτοφερόμενη Εγκατάσταση',
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
            '3 Αίθουσες Εκθέσεων & Σεμιναρίων στην Κύρια Όψη',
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
            '/images/architecture/mehmet-mutaf-05-sergi-salonlari-vitrinler.jpg',
            '/images/architecture/mehmet-mutaf-04-sergi-salonlari-enfilade.jpg',
            '/images/architecture/mehmet-mutaf-06-tarihi-sinif-duvar-resmi.jpg',
            '/images/architecture/mehmet-mutaf-07-arsiv-kutuphane-salonu.jpg',
            '/images/architecture/tepta-tarihi-ana-merdiven-kovasi.jpg',
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
                el: 'Διατηρητέο Μνημείο Β΄ Κατηγορίας • Μη Επεμβατική / Αυτοφερόμενη Εγκατάσταση',
            },
            classroomCapacity: 180,
            boardroomCapacity: 80,
        },
    },
    4: {
        id: 'd4e8910a-7c12-4e55-9b30-1060f0000004',
        level: 4,
        area: '1.060 m²',
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
            '/images/architecture/mehmet-mutaf-01-buyuk-salon-tas-duvar.jpg',
            '/images/architecture/mehmet-mutaf-02-ust-balkon-buyuk-salon.jpg',
            '/images/architecture/mehmet-mutaf-03-birinci-kat-fuaye-giris.jpg',
            '/images/architecture/mehmet-mutaf-04-sergi-salonlari-enfilade.jpg',
            '/images/architecture/mehmet-mutaf-05-sergi-salonlari-vitrinler.jpg',
            '/images/architecture/mehmet-mutaf-09-tonozlu-tarihi-tas-mekan.jpg',
            '/images/architecture/tepta-tarihi-ana-merdiven-kovasi.jpg',
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
                el: 'Διατηρητέο Μνημείο Β΄ Κατηγορίας • Μη Επεμβατική / Αυτοφερόμενη Εγκατάσταση',
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
            features_tr: canonical.features_tr,
            features_en: canonical.features_en,
            features_el: canonical.features_el,
            thumbnail_images: Array.from(
                new Set([
                    ...(Array.isArray(row.thumbnail_images) ? row.thumbnail_images : []),
                    ...canonical.thumbnail_images.filter((img) => img.startsWith('/images/architecture/')),
                ])
            ),
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

export const CURATED_EVENT_PATCHES: CuratedEventPatch[] = SNAPSHOT_EVENTS.map((ev) => ({
    id: ev.id,
    slug: ev.slug,
    tr: ev.description_tr || '',
    en: ev.description_en || '',
    el: ev.description_el || '',
}));

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

        // 2. Seed default hero_slides_config into page_content or append missing architectural slides
        const { data: existingHeroConfig } = await supabase
            .from('page_content')
            .select('id, content_tr')
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
    } catch (err) {
        console.warn('Database auto-sync warning:', err);
    }
}
