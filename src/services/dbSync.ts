import { supabase } from './supabaseClient';
import { DEFAULT_HERO_CONFIG } from '../config/heroConfig';

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
        title_tr: 'Büyük Salon (Çok Amaçlı Salon) & Fuaye',
        title_en: 'The Grand Multipurpose Hall & Foyer',
        title_el: 'Μεγάλη Αίθουσα Πολλαπλών Χρήσεων & Φουαγιέ',
        description_tr: '1. Kat (740 m² brüt / 227 + 100 m² net etkinlik alanı): 227,35 m² Çok Amaçlı Büyük Salon (08), iki yanındaki açık hava avluları (07: 28 m², 09: 37 m²), 99,63 m² Sergi & Fuaye alanı (04), 66,82 m² Vestiyer (02), Servis Mutfağı (12) ve ön salondan (14: 55,67 m²) oluşur.',
        description_en: '1st Floor (740 m² gross / 227 + 100 m² net event space): Features the 227.35 m² Multipurpose Grand Hall (08) flanked by two open courtyards (07: 28 m², 09: 37 m²), a 99.63 m² Exhibition & Foyer area (04), a 66.82 m² Cloakroom (02), Catering Kitchen (12), and front hall (14: 55.67 m²).',
        description_el: '1ος Όροφος (740 m² μικτά / 227 + 100 m² καθαρός χώρος): Περιλαμβάνει την Αίθουσα Πολλαπλών Χρήσεων 227,35 m² (08), δύο εσωτερικές αυλές (07 & 09), Εκθεσιακό Χώρο & Φουαγιέ 99,63 m² (04), Βεστιάριο 66,82 m² (02) και Κουζίνα Catering (12).',
        gala_capacity: 160,
        theater_capacity: 250,
        cocktail_capacity: 350,
        floor_plan_svg_url: '/images/floorplans/level-1-official-plan.jpg',
        features_tr: [
            '08 Çok Amaçlı Salon (227,35 m²) & Taşınabilir Sahne',
            '04 Sergi & Fuaye Alanı (99,63 m²) + 14 Ön Salon (55,67 m²)',
            '07 & 09 İki Yanda Açık Hava Fuaye Avlusu (28 m² + 37 m²)',
            '02 Geniş Vestiyer / VIP Dinlenme (66,82 m²) & 03 WC',
            '12 Servis Mutfağı (11,10 m²) & Teras Katı Simone Restoran Catering İmkanı',
            'Çift Yönlü Engelli Asansörü & Yangın Merdivenleri (06, 10)',
        ],
        features_en: [
            '08 Multipurpose Grand Hall (227.35 m²) & Portable Stage',
            '04 Exhibition & Foyer (99.63 m²) + 14 Front Hall (55.67 m²)',
            '07 & 09 Two Flanking Open-Air Courtyards (28 m² + 37 m²)',
            '02 Spacious Cloakroom / VIP Lounge (66.82 m²) & 03 Restrooms',
            '12 Service Kitchen (11.10 m²) & In-House Catering via Rooftop Simone Restaurant',
            'Dual PRM-Accessible Elevators & Fire Escape Stairs (06, 10)',
        ],
        features_el: [
            '08 Αίθουσα Πολλαπλών Χρήσεων (227,35 m²) & Φορητή Σκηνή',
            '04 Χώρος Έκθεσης & Φουαγιέ (99,63 m²) + 14 Αίθουσα (55,67 m²)',
            '07 & 09 Δύο Πλευρικές Ανοιχτές Αυλές (28 m² + 37 m²)',
            '02 Βεστιάριο / VIP Χώρος (66,82 m²) & 03 WC',
            '12 Κουζίνα Εξυπηρέτησης & Δυνατότητα Catering από το Εστιατόριο Simone',
            'Διπλοί Ανελκυστήρες ΑμεΑ & Κλιμακοστάσια Ασφαλείας (06, 10)',
        ],
        image_url: 'https://tvloakrlqazcadokliaf.supabase.co/storage/v1/object/public/media/venue/mz81jyod0nq_1773083709418.webp',
        thumbnail_images: [
            'https://tvloakrlqazcadokliaf.supabase.co/storage/v1/object/public/media/venue/ec39t6bl3hd_1773083599484.webp',
            'https://tvloakrlqazcadokliaf.supabase.co/storage/v1/object/public/media/venue/bg6errwn25u_1773083618325.webp',
            'https://tvloakrlqazcadokliaf.supabase.co/storage/v1/object/public/media/venue/afnuua7o3ah_1773083641141.webp',
            'https://tvloakrlqazcadokliaf.supabase.co/storage/v1/object/public/media/venue/j68cg174mir_1773083669472.webp',
        ],
        techSpecs: {
            ceilingHeight: {
                tr: 'Çift Kat Yüksekliği (+6.26 m Kotu) • Balkonlu',
                en: 'Double-Height Hall (+6.26 m Level) • With Balcony',
                el: 'Διώροφο Ύψος (+6.26 m) • Με Εξώστη',
            },
            roomStructure: {
                tr: 'Çok Amaçlı Salon (227 m²) + Fuaye (100 m²) + 2 Yan Avlu + Mutfak',
                en: 'Multipurpose Hall (227 m²) + Foyer (100 m²) + 2 Courtyards + Kitchen',
                el: 'Αίθουσα (227 m²) + Φουαγιέ (100 m²) + 2 Αυλές + Κουζίνα',
            },
            powerSupply: {
                tr: '3×63A Trifaze AV Panosu + Profesyonel Ses/Işık Altyapısı',
                en: '3×63A 3-Phase AV Panel + Integrated Sound/Lighting Rig',
                el: 'Τριφασικός Πίνακας 3×63A AV & Υποδομή Ήχου/Φωτισμού',
            },
            elevatorAccess: {
                tr: 'Doğu & Batı Çift Engelli Asansörü + Seyyar Engelli Platformu',
                en: 'East & West Dual PRM Elevators + Wheelchair Platform Lift',
                el: 'Δύο Ανελκυστήρες ΑμεΑ (Ανατολικά & Δυτικά) + Ράμπα ΑμεΑ',
            },
            connectivity: {
                tr: 'Simetrik Fiber Wi-Fi 6 • Canlı Yayın (Live Stream) Hattı',
                en: 'Symmetric Fiber Wi-Fi 6 • Live Stream Ethernet Line',
                el: 'Συμμετρικό Fiber Wi-Fi 6 • Γραμμή Live Streaming',
            },
            riggingRules: {
                tr: 'Portatif Sahne • Ground-Support & Tarihi Doku Koruma',
                en: 'Portable Stage • Ground-Support & Heritage Protection',
                el: 'Φορητή Σκηνή • Επιδαπέδια Στήριξη & Προστασία Μνημείου',
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
        description_tr: '2. Kat (727 m² brüt / 275 m² net sergi & fuaye alanı): Kemeraltı Caddesi ön cephesinde yan yana 3 adet Sergi/Toplantı Salonu (02, 03, 04), orta aksta geniş Sergi & Fuaye Alanı (05), arka bölümde ise 1. Kat Çok Amaçlı Salonuna bakan galeri balkonu ve teknik alanlar yer alır.',
        description_en: '2nd Floor (727 m² gross / 275 m² net exhibition & foyer space): Comprises 3 front-facing Exhibition/Breakout Halls along the Kemeraltı facade (02, 03, 04), a spacious central Exhibition & Foyer Hall (05), and the upper gallery balcony overlooking the 1st Floor Multipurpose Hall.',
        description_el: '2ος Όροφος (727 m² μικτά / 275 m² καθαρός εκθεσιακός χώρος): Περιλαμβάνει 3 μπροστινές Αίθουσες Εκθέσεων/Συνεδριάσεων (02, 03, 04), κεντρικό Εκθεσιακό Χώρο & Φουαγιέ (05) και τον εξώστη της Μεγάλης Αίθουσας.',
        gala_capacity: 90,
        theater_capacity: 140,
        cocktail_capacity: 250,
        floor_plan_svg_url: '/images/floorplans/level-2-official-plan.jpg',
        features_tr: [
            '02, 03 ve 04 Numaralı 3 Ön Cephe Sergi & Seminer Salonu',
            '05 Geniş Merkez Sergi & Fuaye Alanı (2K-05)',
            'Çok Amaçlı Salon Üst Galeri Balkonu & AV Kontrol Noktası',
            'Teras Katı (11-12-13) Simone Restoran’dan Catering & İkram İmkanı',
            '01 Ana Merdiven + 07 & 09 Çift Yangın Merdiveni + 08 Depo',
            'Doğu & Batı Çift Yönlü Engelli Asansörü Erişimi',
        ],
        features_en: [
            '3 Front-Facade Exhibition & Breakout Halls (Rooms 02, 03, 04)',
            '05 Spacious Central Exhibition & Foyer Area (2K-05)',
            'Multipurpose Hall Upper Gallery Balcony & AV Control Point',
            'Catering & Refreshment Service Available via Rooftop Simone Restaurant',
            '01 Grand Staircase + 07 & 09 Dual Fire Escape Stairs + 08 Storage',
            'East & West Dual PRM-Accessible Elevator Access',
        ],
        features_el: [
            '3 Μπροστινές Αίθουσες Εκθέσεων & Σεμιναρίων (02, 03, 04)',
            '05 Κεντρικός Χώρος Έκθεσης & Φουαγιέ (2K-05)',
            'Εξώστης Μεγάλης Αίθουσας & Σημείο Ελέγχου AV',
            'Δυνατότητα Catering από το Εστιατόριο Simone στην Ταράτσα',
            '01 Κεντρικό Κλιμακοστάσιο + 07 & 09 Κλιμακοστάσια Ασφαλείας',
            'Διπλοί Ανελκυστήρες ΑμεΑ (Ανατολικά & Δυτικά)',
        ],
        image_url: 'https://tvloakrlqazcadokliaf.supabase.co/storage/v1/object/public/media/venue/ap0hijmh6rn_1773083839555.webp',
        thumbnail_images: [
            'https://tvloakrlqazcadokliaf.supabase.co/storage/v1/object/public/media/venue/spxudaa4qm9_1773083863877.webp',
            'https://tvloakrlqazcadokliaf.supabase.co/storage/v1/object/public/media/venue/67zjoy8xv0v_1773083872018.webp',
            'https://tvloakrlqazcadokliaf.supabase.co/storage/v1/object/public/media/venue/h3t2o8sr1f_1773083881680.webp',
        ],
        techSpecs: {
            ceilingHeight: {
                tr: '4.11 m Kat Yüksekliği (+10.56 m Kotu)',
                en: '4.11 m Floor-to-Ceiling (+10.56 m Level)',
                el: '4.11 m Ύψος Ορόφου (+10.56 m)',
            },
            roomStructure: {
                tr: '3 Ön Sergi Salonu (02, 03, 04) + Merkez Fuaye (05) + Balkon',
                en: '3 Front Halls (02, 03, 04) + Central Foyer (05) + Balcony',
                el: '3 Αίθουσες (02, 03, 04) + Κεντρικό Φουαγιέ (05) + Εξώστης',
            },
            powerSupply: {
                tr: '3×32A Trifaze Kat Panosu + AV & Galeri Ray Hatları',
                en: '3×32A 3-Phase Floor Panel + AV & Gallery Track Lines',
                el: 'Τριφασικός Πίνακας Ορόφου 3×32A + Γραμμές AV',
            },
            elevatorAccess: {
                tr: 'Doğu & Batı Çift Asansör + Ana Merdiven (01) + 2 Yangın Merdiveni',
                en: 'Dual Elevators (East/West) + Main Stairs (01) + 2 Fire Stairs',
                el: 'Διπλοί Ανελκυστήρες + Κεντρικό Κλιμακοστάσιο (01)',
            },
            connectivity: {
                tr: 'Simetrik Fiber Wi-Fi 6 (Tüm Salonlarda Kapsama)',
                en: 'Symmetric Fiber Wi-Fi 6 (Full Multi-Room Coverage)',
                el: 'Συμμετρικό Fiber Wi-Fi 6 σε Όλες τις Αίθουσες',
            },
            riggingRules: {
                tr: 'Modüler Sergi Panosu • Çivisiz Tarihi Duvar Koruma',
                en: 'Modular Exhibition Panels • Non-Invasive Heritage Mounting',
                el: 'Αυτοφερόμενα Πάνελ Έκθεσης • Προστασία Ιστορικής Τοιχοποιίας',
            },
            classroomCapacity: 100,
            boardroomCapacity: 75,
        },
    },
    3: {
        id: 'b2c7526e-2594-41c0-a9b7-9cc2f295f7f2',
        level: 3,
        area: '458 m²',
        title_tr: '3. Kat Büyük Sergi Salonları & Fuaye',
        title_en: '3rd Floor Exhibition Galleries & Foyer',
        title_el: '3ος Όροφος — Αίθουσες Εκθέσεων & Φουαγιέ',
        description_tr: '3. Kat (727 m² brüt / 458 m² net sergi & fuaye alanı): Kuzey (arka) kanatta 2 büyük sergi salonu (08, 09), orta koridor (13) çevresinde 4 sergi/atölye odası (10, 11, 12, 14), geniş merkez Sergi & Fuaye alanı (05) ve güney (ön cephe) hattında 3 sergi salonu (02, 03, 04) olmak üzere toplam 9 sergi salonu + ana fuayeden oluşur.',
        description_en: '3rd Floor (727 m² gross / 458 m² net exhibition & foyer space): The largest single-level exhibition layout, featuring 2 large north gallery halls (08, 09), 4 central gallery/workshop rooms (10, 11, 12, 14) along hall (13), a spacious central Exhibition & Foyer area (05), and 3 front-facade exhibition halls (02, 03, 04) — 9 halls in total.',
        description_el: '3ος Όροφος (727 m² μικτά / 458 m² καθαρός εκθεσιακός χώρος): Περιλαμβάνει 2 μεγάλες βόρειες αίθουσες (08, 09), 4 κεντρικές αίθουσες (10, 11, 12, 14), μεγάλο κεντρικό Φουαγιέ (05) και 3 μπροστινές αίθουσες εκθέσεων (02, 03, 04) — συνολικά 9 αίθουσες.',
        gala_capacity: 220,
        theater_capacity: 320,
        cocktail_capacity: 450,
        floor_plan_svg_url: '/images/floorplans/level-3-official-plan.jpg',
        features_tr: [
            '08 ve 09 Kuzey Kanadı 2 Büyük Sergi Salonu',
            '02, 03 ve 04 Ön Cephe 3 Sergi & Toplantı Salonu',
            '10, 11, 12 ve 14 Orta Aks 4 Bağımsız Sergi / Atölye Odası',
            '05 Geniş Merkez Sergi & Fuaye Alanı + Teras Simone Restoran Catering İmkanı',
            '15 Kat Deposu & 16 Bay/Bayan/Engelli WC Grubu',
            'Doğu & Batı Çift Engelli Asansörü + 3 Merdiven Kovası (01, 07, 17)',
        ],
        features_en: [
            '08 & 09 Two Large North-Wing Exhibition Halls',
            '02, 03 & 04 Three Front-Facade Exhibition & Seminar Halls',
            '10, 11, 12 & 14 Four Central Gallery / Breakout Rooms',
            '05 Spacious Central Exhibition & Foyer + Catering via Rooftop Simone Restaurant',
            '15 Floor Storage & 16 Restroom Complex (Including PRM WC)',
            'East & West Dual PRM Elevators + 3 Staircases (01, 07, 17)',
        ],
        features_el: [
            '08 & 09 Δύο Μεγάλες Βόρειες Αίθουσες Εκθέσεων',
            '02, 03 & 04 Τρεις Μπροστινές Αίθουσες Εκθέσεων & Σεμιναρίων',
            '10, 11, 12 & 14 Τέσσερις Κεντρικές Αίθουσες / Εργαστήρια',
            '05 Κεντρικός Χώρος Έκθεσης & Φουαγιέ + Catering από το Simone',
            '15 Αποθήκη Ορόφου & 16 Συγκρότημα WC (με WC ΑμεΑ)',
            'Διπλοί Ανελκυστήρες ΑμεΑ + 3 Κλιμακοστάσια (01, 07, 17)',
        ],
        image_url: 'https://tvloakrlqazcadokliaf.supabase.co/storage/v1/object/public/media/venue/idso4ws063_1773084000348.webp',
        thumbnail_images: [
            'https://tvloakrlqazcadokliaf.supabase.co/storage/v1/object/public/media/venue/qe9jvxrmfdn_1773084012264.webp',
            'https://tvloakrlqazcadokliaf.supabase.co/storage/v1/object/public/media/venue/9zg4pl7tr6_1773084019065.webp',
            'https://tvloakrlqazcadokliaf.supabase.co/storage/v1/object/public/media/venue/le67ll2cb_1773084025160.webp',
        ],
        techSpecs: {
            ceilingHeight: {
                tr: '3.97 m Kat Yüksekliği (+14.67 m Kotu)',
                en: '3.97 m Floor-to-Ceiling (+14.67 m Level)',
                el: '3.97 m Ύψος Ορόφου (+14.67 m)',
            },
            roomStructure: {
                tr: '9 Sergi Salonu (2 Kuzey + 4 Merkez + 3 Güney) + Ana Fuaye (05)',
                en: '9 Exhibition Rooms (2 North + 4 Central + 3 South) + Main Foyer (05)',
                el: '9 Αίθουσες Εκθέσεων (2 Βόρειες + 4 Κεντρικές + 3 Νότιες) + Φουαγιέ',
            },
            powerSupply: {
                tr: '3×63A Trifaze Kat Panosu + Müzecilik Ray Aydınlatma',
                en: '3×63A 3-Phase Floor Panel + Museum Track Lighting',
                el: 'Τριφασικός Πίνακας 3×63A + Μουσειακός Φωτισμός Ράγας',
            },
            elevatorAccess: {
                tr: 'Doğu & Batı Çift Engelli Asansörü + 3 Merdiven Kovası',
                en: 'East & West Dual PRM Elevators + 3 Stairwell Cores',
                el: 'Δύο Ανελκυστήρες ΑμεΑ + 3 Κλιμακοστάσια',
            },
            connectivity: {
                tr: 'Simetrik Fiber Wi-Fi 6 • 9 Salonda Kesintisiz Kapsama',
                en: 'Symmetric Fiber Wi-Fi 6 • Seamless 9-Room Coverage',
                el: 'Συμμετρικό Fiber Wi-Fi 6 • Κάλυψη και στις 9 Αίθουσες',
            },
            riggingRules: {
                tr: 'Ground-Support & Serbest Sergi Panoları • Tarihi Doku Koruma',
                en: 'Ground-Support & Freestanding Walls • Heritage Protection',
                el: 'Επιδαπέδια Στήριξη & Αυτοφερόμενα Πάνελ Έκθεσης',
            },
            classroomCapacity: 180,
            boardroomCapacity: 80,
        },
    },
    4: {
        id: 'd4e8910a-7c12-4e55-9b30-1060f0000004',
        level: 4,
        area: '1.060 m² Net (Kat 1 + Kat 2 + Kat 3)',
        title_tr: 'Tüm Etkinlik Katları (Kat 1, 2 ve 3 Bütüncül Kullanım)',
        title_en: 'All Event Floors Buyout (Levels 1, 2 & 3)',
        title_el: 'Όλοι οι Όροφοι Εκδηλώσεων (1ος, 2ος & 3ος Όροφος)',
        description_tr: 'Tüm Etkinlik Katları Kiralama (Buyout): Kiralama kapsamındaki 1. Kat Çok Amaçlı Büyük Salon & Avlular, 2. Kat 3 Sergi Salonu & Balkon ve 3. Kat 9 Sergi Salonunun (toplam 1.060 m² net etkinlik alanı) tek bir kuruma/bienale/zirveye münhasıran tahsis edilmesidir. (4. Kat vakıf/arşiv alanı olup kiralama kapsamı dışındadır; teras katındaki 11-12-13 no’lu alanda hizmet veren Simone Restoran’dan ise etkinlikler için doğrudan catering hizmeti alınabilir.)',
        description_en: 'All Event Floors Buyout: Exclusive privatization of Level 1 (Multipurpose Grand Hall & Courtyards), Level 2 (3 Exhibition Halls, Foyer & Balcony), and Level 3 (9 Exhibition Rooms & Foyer) — totaling 1,060 m² of net event space. (Level 4 houses the Foundation Archive and is outside the rental scope; the rooftop terrace [11-12-13] is home to Simone Restaurant, which can provide direct catering for events.)',
        description_el: 'Αποκλειστική Διάθεση Ορόφων Εκδηλώσεων (1ος, 2ος & 3ος Όροφος — 1.060 m²): Περιλαμβάνει τη Μεγάλη Αίθουσα & Αυλές (1ος), τις 3 Αίθουσες & Εξώστη (2ος) και τις 9 Αίθουσες Εκθέσεων (3ος). Ο 4ος όροφος (Αρχείο) εξαιρείται, ενώ από το εστιατόριο Simone στον όροφο της ταράτσας (11-12-13) παρέχεται δυνατότητα catering.',
        gala_capacity: 450,
        theater_capacity: 650,
        cocktail_capacity: 850,
        floor_plan_svg_url: '/images/floorplans/full-building-section-perspective.jpg',
        features_tr: [
            'Kat 1, Kat 2 ve Kat 3 Bütüncül Kullanım (1.060 m² Net Etkinlik Alanı)',
            '1 Çok Amaçlı Büyük Salon (6) + 12 Sergi/Seminer Salonu (4) + 3 Kat Fuayesi (5)',
            'Teras Katındaki (11-12-13) Simone Restoran’dan Catering & İkram Hizmeti İmkanı',
            '1. Kat İki Yan Açık Hava Avlusu + Vestiyer + Servis Mutfağı',
            'Doğu & Batı İki Yönde Modern Engelli Asansörü & Yangın Merdivenleri',
            'Tam Münhasırlık (Not: 4. Kat Arşiv/Kütüphane kiralama kapsamı dışındadır)',
        ],
        features_en: [
            'Combined Use of Levels 1, 2 & 3 (1,060 m² Net Event Space)',
            '1 Multipurpose Grand Hall (6) + 12 Exhibition/Breakout Rooms (4) + 3 Foyers (5)',
            'In-House Event Catering Available from Rooftop Simone Restaurant (Zones 11-12-13)',
            '1st Floor Twin Open-Air Courtyards + Cloakroom + Catering Service Kitchen',
            'Dual Modern PRM-Accessible Elevators & Fire Escape Cores (East/West)',
            'Full Event Exclusivity (Note: 4th Floor Archive/Library is outside rental scope)',
        ],
        features_el: [
            'Συνδυασμένη Χρήση 1ου, 2ου & 3ου Ορόφου (1.060 m² Καθαρός Χώρος)',
            '1 Αίθουσα Πολλαπλών Χρήσεων (6) + 12 Αίθουσες Εκθέσεων (4) + 3 Φουαγιέ (5)',
            'Δυνατότητα Catering Εκδηλώσεων από το Εστιατόριο Simone στην Ταράτσα (11-12-13)',
            '1ος Όροφος: 2 Ανοιχτές Αυλές + Βεστιάριο + Κουζίνα Catering',
            'Διπλοί Σύγχρονοι Ανελκυστήρες ΑμεΑ & Κλιμακοστάσια Ασφαλείας',
            'Πλήρης Αποκλειστικότητα (Ο 4ος Όροφος Αρχείου είναι εκτός μίσθωσης)',
        ],
        image_url: 'https://tvloakrlqazcadokliaf.supabase.co/storage/v1/object/public/media/venue/mz81jyod0nq_1773083709418.webp',
        thumbnail_images: [
            'https://tvloakrlqazcadokliaf.supabase.co/storage/v1/object/public/media/venue/ap0hijmh6rn_1773083839555.webp',
            'https://tvloakrlqazcadokliaf.supabase.co/storage/v1/object/public/media/venue/idso4ws063_1773084000348.webp',
            'https://tvloakrlqazcadokliaf.supabase.co/storage/v1/object/public/media/venue/ec39t6bl3hd_1773083599484.webp',
        ],
        techSpecs: {
            ceilingHeight: {
                tr: '3.97 m – 6.26 m (Çok Katlı Anıtsal Kesit)',
                en: '3.97 m – 6.26 m (Multi-Level Monumental Section)',
                el: '3.97 m – 6.26 m (Πολυώροφη Μνημειακή Τομή)',
            },
            roomStructure: {
                tr: 'Çok Amaçlı Salon (6) + 12 Sergi Odası (4) + Fuayeler (5) + Avlular',
                en: 'Multipurpose Hall (6) + 12 Galleries (4) + Foyers (5) + Courtyards',
                el: 'Μεγάλη Αίθουσα (6) + 12 Αίθουσες (4) + Φουαγιέ (5) + Αυλές',
            },
            powerSupply: {
                tr: '3×125A Ana Trifaze Enerji + Alçak Gerilim & Teknik Odalar (3)',
                en: '3×125A Main 3-Phase Supply + Dedicated Technical Rooms (3)',
                el: 'Κεντρική Παροχή 3×125A + Τεχνικοί Χώροι (3)',
            },
            elevatorAccess: {
                tr: 'Doğu & Batı 2 Modern Engelli Asansörü + 3 Merdiven Kovası',
                en: 'East & West 2 Modern PRM Elevators + 3 Stairwell Cores',
                el: '2 Σύγχρονοι Ανελκυστήρες ΑμεΑ + 3 Κλιμακοστάσια',
            },
            connectivity: {
                tr: 'Tüm Binada Kesintisiz Simetrik Fiber Wi-Fi 6 & Canlı Yayın Ağı',
                en: 'Building-Wide Seamless Fiber Wi-Fi 6 & Live Broadcast Mesh',
                el: 'Ενιαίο Δίκτυο Fiber Wi-Fi 6 & Live Broadcast σε Όλο το Κτίριο',
            },
            riggingRules: {
                tr: 'Tabanlıoğlu Restorasyon Projesi Koruma Kurallarına Uygun Kurulum',
                en: 'Compliant with Tabanlıoğlu Restoration Conservation Guidelines',
                el: 'Συμβατό με τις Προδιαγραφές Αποκατάστασης του Μνημείου',
            },
            classroomCapacity: 400,
            boardroomCapacity: 180,
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
            row.features_tr.length <= 5;

        byLevel.set(lvl, {
            ...row,
            title_tr: row.title_tr === '2.Kat Sergi Alanı' || row.title_tr === '3. Kat Sergi Alanı' || row.title_tr === 'Büyük Salon'
                ? canonical.title_tr
                : (row.title_tr || canonical.title_tr),
            title_en: row.title_en === '2nd Floor' || row.title_en === 'Third Floor Wing' || row.title_en === 'Main Hall'
                ? canonical.title_en
                : (row.title_en || canonical.title_en),
            title_el: row.title_el || canonical.title_el,
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
];

export function getCuratedEventDescription(
    slugOrId: string | null | undefined,
    lang: 'tr' | 'en' | 'el'
): string {
    if (!slugOrId) return '';
    const found = CURATED_EVENT_PATCHES.find(
        (p) => p.slug === slugOrId || p.id === slugOrId
    );
    if (!found) return '';
    return found[lang] || found.tr;
}

/**
 * Runs automatically when an authenticated admin session is active in AdminPage,
 * syncing event_types, missing past_events slugs & descriptions, venue_events MICE specs, and updated page_content rows.
 */
export async function syncDatabaseWithAuthenticatedSession(): Promise<void> {
    try {
        const venueSyncPromises = [1, 2, 3].map((lvl) => {
            const c = CANONICAL_VENUE_MICE_DATA[lvl];
            return supabase
                .from('venue_events')
                .update({
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
                })
                .eq('id', c.id);
        });

        // Also ensure Level 4 (Full Building Buyout) exists in venue_events
        const buyout = CANONICAL_VENUE_MICE_DATA[4];
        const buyoutUpsert = supabase.from('venue_events').upsert(
            [
                {
                    id: buyout.id,
                    level: buyout.level,
                    order_index: 4,
                    status: 'published',
                    area: buyout.area,
                    title_tr: buyout.title_tr,
                    title_en: buyout.title_en,
                    title_el: buyout.title_el,
                    description_tr: buyout.description_tr,
                    description_en: buyout.description_en,
                    description_el: buyout.description_el,
                    gala_capacity: buyout.gala_capacity,
                    theater_capacity: buyout.theater_capacity,
                    cocktail_capacity: buyout.cocktail_capacity,
                    floor_plan_svg_url: buyout.floor_plan_svg_url,
                    features_tr: buyout.features_tr,
                    features_en: buyout.features_en,
                    features_el: buyout.features_el,
                    image_url: buyout.image_url,
                    thumbnail_images: buyout.thumbnail_images,
                },
            ],
            { onConflict: 'id' }
        );

        await Promise.all([
            // 1. Upsert canonical event_types
            supabase.from('event_types').upsert(CANONICAL_EVENT_TYPES, { onConflict: 'key' }),

            // 2. Backfill missing past_events slugs & descriptions in parallel
            ...CURATED_EVENT_PATCHES.map((patch) =>
                supabase
                    .from('past_events')
                    .update({ slug: patch.slug, description_tr: patch.tr })
                    .eq('id', patch.id)
            ),

            // 3. Sync realistic MICE venue capacities, floor plan SVG URLs & Full Building Buyout
            ...venueSyncPromises,
            buyoutUpsert,

            // 4. Update page_content rows to remove commercial copy & duplicate tagline prefixes
            supabase
                .from('page_content')
                .update({
                    content_tr: 'Mekan Kiralama',
                    content_en: 'Venue Hire',
                    content_el: 'Ενοικίαση Χώρου',
                })
                .eq('section_key', 'cta_primary'),

            supabase
                .from('page_content')
                .update({
                    content_tr: 'Galata Rum Okulu Vakfı - Kültür Merkezi; İstanbul Bienali ve 212 Photography Istanbul gibi uluslararası sanat buluşmalarından dönem konserlerine, mimarlık ve edebiyat sempozyumlarından seçkin lansman ve özel resepsiyonlara kadar pek çok prestijli etkinliğe ev sahipliği yapmaktadır.',
                    content_en: 'The Galata Greek School Foundation - Cultural Center hosts a distinguished repertoire of events — from international art gatherings like the Istanbul Biennial and 212 Photography Istanbul to period concerts, architecture and literature symposia, and exclusive receptions.',
                    content_el: 'Το Ίδρυμα Ελληνικού Σχολείου Γαλατά - Πολιτιστικό Κέντρο φιλοξενεί ένα εκλεκτό ρεπερτόριο εκδηλώσεων — από διεθνείς καλλιτεχνικές διοργανώσεις όπως η Μπιενάλε της Κωνσταντινούπολης έως συναυλίες, συμπόσια αρχιτεκτονικής και λογοτεχνίας, και ιδιαίτερες δεξιώσεις.',
                })
                .eq('section_key', 'hero_description'),
        ]);

        // 5. Seed default hero_slides_config into page_content if not already present
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
    } catch (err) {
        console.warn('Database auto-sync warning:', err);
    }
}
