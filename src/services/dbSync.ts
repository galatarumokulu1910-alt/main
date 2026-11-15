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
        title_tr: 'Büyük Salon & Fuaye',
        title_en: 'The Grand Hall & Foyer',
        title_el: 'Μεγάλη Αίθουσα & Φουαγιέ',
        description_tr: '1. Kat Büyük Salon: 227 m² kolonsuz ana salon (19.0 × 12.0 m), 100 m² giriş fuayesi ve 60 + 22 m² asma kat balkonu ile 6.20 m tavan yüksekliğine sahiptir. Ana konferanslar, gala yemekleri, dönem konserleri ve prestijli lansmanlar için idealdir.',
        description_en: 'Level 1 Grand Hall: Featuring a 227 m² column-free main hall (19.0 × 12.0 m), a 100 m² entrance foyer, and a 60 + 22 m² mezzanine balcony under a soaring 6.20 m ceiling. Ideal for keynote conferences, gala dinners, concerts, and flagship launches.',
        description_el: '1ος Όροφος — Μεγάλη Αίθουσα: Διαθέτει κύρια αίθουσα 227 m² χωρίς κολώνες (19.0 × 12.0 m), φουαγιέ υποδοχής 100 m² και πατάρι 60 + 22 m² με ύψος οροφής 6.20 m. Ιδανική για συνέδρια, δείπνα γκαλά και συναυλίες.',
        gala_capacity: 160,
        theater_capacity: 250,
        cocktail_capacity: 350,
        floor_plan_svg_url: '/images/floorplans/level-1-plan.svg',
        features_tr: [
            'Kolonsuz Ana Salon (19.0 × 12.0 m)',
            'Asma Kat Balkonu (60 + 22 m²)',
            'Akustik Mimari & Ray Aydınlatma',
            'Kayıt Fuayesi, Vestiyer & Catering Alanı',
            'Projeksiyon & Profesyonel AV Altyapısı',
            'İklimlendirme (HVAC) & PRM Erişimi',
        ],
        features_en: [
            'Column-Free Main Hall (19.0 × 12.0 m)',
            'Mezzanine Balcony Overlook (60 + 22 m²)',
            'Acoustic Treatment & Track Lighting Rig',
            'Registration Foyer, Cloakroom & Catering Prep',
            'Projection & Professional AV Infrastructure',
            'Climate Controlled (HVAC) & PRM Accessible',
        ],
        features_el: [
            'Κύρια Αίθουσα χωρίς Κολώνες (19.0 × 12.0 m)',
            'Εξώστης Ημιωρόφου (60 + 22 m²)',
            'Ακουστική Επεξεργασία & Φωτισμός Ράγας',
            'Φουαγιέ Υποδοχής, Βεστιάριο & Χώρος Catering',
            'Υποδομή Προβολής & Επαγγελματικού AV',
            'Κλιματισμός (HVAC) & Πρόσβαση ΑμεΑ',
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
                tr: '6.20 m (Asma Kat Altı: 2.85 m)',
                en: '6.20 m (Under Mezzanine: 2.85 m)',
                el: '6.20 m (Κάτω από Πατάρι: 2.85 m)',
            },
            roomStructure: {
                tr: 'Kolonsuz Ana Salon (227 m²) + Fuaye (100 m²) + Asma Kat',
                en: 'Column-Free Hall (227 m²) + Foyer (100 m²) + Mezzanine',
                el: 'Αίθουσα χωρίς Κολώνες (227 m²) + Φουαγιέ (100 m²) + Πατάρι',
            },
            powerSupply: {
                tr: '3×63A Trifaze AV Panosu + Monofaze Hatlar',
                en: '3×63A 3-Phase AV Panel + Dedicated Circuits',
                el: 'Τριφασικός Πίνακας 3×63A AV',
            },
            elevatorAccess: {
                tr: 'Zemin Giriş + Asansör (630 kg / 8 Kişi) • PRM Uygun',
                en: 'Direct Ground Access + Elevator (630 kg / 8 Pax) • PRM',
                el: 'Άμεση Πρόσβαση Ισογείου + Ανελκυστήρας (630 kg)',
            },
            connectivity: {
                tr: 'Simetrik Fiber Wi-Fi 6 • Canlı Yayın (Live Stream) Hattı',
                en: 'Symmetric Fiber Wi-Fi 6 • Live Stream Ethernet Line',
                el: 'Συμμετρικό Fiber Wi-Fi 6 • Γραμμή Live Streaming',
            },
            riggingRules: {
                tr: 'Ground-Support (Yerden Kurulum) • Çivisiz Tarihi Doku',
                en: 'Ground-Support Truss Only • Heritage Wall Protection',
                el: 'Επιδαπέδια Στήριξη (Ground-Support) • Προστασία Μνημείου',
            },
            classroomCapacity: 120,
            boardroomCapacity: 60,
        },
    },
    2: {
        id: '57c70963-b5d2-47df-8ec8-84d3c478b205',
        level: 2,
        area: '275 m²',
        title_tr: '2. Kat Sergi & Paralel Oturum Salonları',
        title_en: '2nd Floor Galleries & Breakout Rooms',
        title_el: '2ος Όροφος — Αίθουσες Εκθέσεων & Σεμιναρίων',
        description_tr: '2. Kat Galerileri: 65 m² merkez fuaye etrafında birbirine doğrudan geçişli (enfilade) 5 tarihi odadan (26–52 m²) oluşur. Paralel konferans oturumları (breakout rooms), kurumsal atölyeler, VIP/Kulis kullanımı ve çok odalı sergiler için idealdir.',
        description_en: 'Level 2 Galleries: Comprising 5 interconnected enfilade heritage rooms (26–52 m²) around a 65 m² central foyer. Ideal for parallel conference breakout sessions, corporate workshops, VIP/Green Room suites, and multi-room exhibitions.',
        description_el: '2ος Όροφος: Αποτελείται από 5 συνδεδεμένες ιστορικές αίθουσες (26–52 m²) γύρω από ένα κεντρικό φουαγιέ 65 m². Ιδανικός για παράλληλες συνεδρίες, εργαστήρια, VIP lounge και εκθέσεις.',
        gala_capacity: 90,
        theater_capacity: 140,
        cocktail_capacity: 250,
        floor_plan_svg_url: '/images/floorplans/level-2-plan.svg',
        features_tr: [
            '5 Bağlantılı Tarihi Salon (26 m² – 52 m²)',
            'Merkez Coffee Break & Networking Fuayesi (65 m²)',
            'Paralel Oturum (Breakout) & Atölye Düzeni',
            'Konuşmacı Hazırlık (Green Room / VIP Lounge) Odası',
            'Galeri Ray Aydınlatma & Karartma (Blackout) İmkanı',
            'Kat Bazlı Servis Mutfağı & Misafir WC',
        ],
        features_en: [
            '5 Interconnected Heritage Rooms (26 m² – 52 m²)',
            'Central Coffee Break & Networking Foyer (65 m²)',
            'Parallel Breakout & Workshop Configurations',
            'Dedicated Speaker Green Room / VIP Lounge Suite',
            'Gallery Track Lighting & Blackout Capability',
            'Floor Pantry / Catering Prep & Guest Restrooms',
        ],
        features_el: [
            '5 Συνδεδεμένες Ιστορικές Αίθουσες (26 m² – 52 m²)',
            'Κεντρικό Φουαγιέ Coffee Break & Δικτύωσης (65 m²)',
            'Διάταξη Παράλληλων Συνεδριών & Εργαστηρίων',
            'Αίθουσα Προετοιμασίας Ομιλητών (Green Room / VIP)',
            'Φωτισμός Ράγας Γκαλερί & Δυνατότητα Συσκότισης',
            'Χώρος Προετοιμασίας Catering & WC Επισκεπτών',
        ],
        image_url: 'https://tvloakrlqazcadokliaf.supabase.co/storage/v1/object/public/media/venue/ap0hijmh6rn_1773083839555.webp',
        thumbnail_images: [
            'https://tvloakrlqazcadokliaf.supabase.co/storage/v1/object/public/media/venue/spxudaa4qm9_1773083863877.webp',
            'https://tvloakrlqazcadokliaf.supabase.co/storage/v1/object/public/media/venue/67zjoy8xv0v_1773083872018.webp',
            'https://tvloakrlqazcadokliaf.supabase.co/storage/v1/object/public/media/venue/h3t2o8sr1f_1773083881680.webp',
        ],
        techSpecs: {
            ceilingHeight: {
                tr: '4.20 m (Tarihi Yüksek Tavan)',
                en: '4.20 m (High Heritage Ceiling)',
                el: '4.20 m (Ψηλοτάβανες Αίθουσες)',
            },
            roomStructure: {
                tr: '5 Bağlantılı Oda (52, 46, 44, 42, 26 m²) + 65 m² Fuaye',
                en: '5 Enfilade Rooms (52, 46, 44, 42, 26 m²) + 65 m² Foyer',
                el: '5 Συνδεδεμένες Αίθουσες + Κεντρικό Φουαγιέ 65 m²',
            },
            powerSupply: {
                tr: '3×32A Trifaze Kat Panosu + Oda Priz Hatları',
                en: '3×32A 3-Phase Floor Panel + Room Circuits',
                el: 'Τριφασικός Πίνακας Ορόφου 3×32A',
            },
            elevatorAccess: {
                tr: 'Asansör (630 kg / 8 Kişi) + Tarihi Merdiven (2.10 m)',
                en: 'Elevator (630 kg / 8 Pax) + Grand Staircase (2.10 m)',
                el: 'Ανελκυστήρας (630 kg) + Ιστορικό Κλιμακοστάσιο (2.10 m)',
            },
            connectivity: {
                tr: 'Simetrik Fiber Wi-Fi 6 (Tüm Odalarda Kapsama)',
                en: 'Symmetric Fiber Wi-Fi 6 (Full Multi-Room Coverage)',
                el: 'Συμμετρικό Fiber Wi-Fi 6 σε Όλες τις Αίθουσες',
            },
            riggingRules: {
                tr: 'Modüler Sergi Panosu • Çivisiz Duvar Koruma',
                en: 'Modular Exhibition Panels • Non-Invasive Mounting',
                el: 'Αυτοφερόμενα Πάνελ Έκθεσης • Προστασία Τοιχοποιίας',
            },
            classroomCapacity: 100,
            boardroomCapacity: 75,
        },
    },
    3: {
        id: 'b2c7526e-2594-41c0-a9b7-9cc2f295f7f2',
        level: 3,
        area: '458 m²',
        title_tr: '3. Kat Büyük Sergi Salonu & Fuaye',
        title_en: '3rd Floor Grand Exhibition Hall & Foyer',
        title_el: '3ος Όροφος — Μεγάλη Αίθουσα Εκθέσεων & Φουαγιέ',
        description_tr: '3. Kat Sergi Alanı: 458 m² ile binanın en geniş tek kat alanıdır. 190 m² Kuzey Sergi Kanadı, 150 m² Güney Kanadı ve 118 m² panoramik merkez fuayesi ile uluslararası bienaller, büyük ölçekli sergiler, gala davetleri ve lansmanlar için tasarlanmıştır.',
        description_en: 'Level 3 Exhibition Floor: The largest single floor in the building at 458 m², combining a 190 m² North Wing, 150 m² South Wing, and 118 m² central atrium foyer. Designed for international biennials, major exhibitions, gala dinners, and brand launches.',
        description_el: '3ος Όροφος: Ο μεγαλύτερος ενιαίος όροφος του κτιρίου (458 m²), με Βόρεια Πτέρυγα 190 m², Νότια Πτέρυγα 150 m² και κεντρικό φουαγιέ 118 m². Ιδανικός για διεθνείς μπιενάλε, μεγάλες εκθέσεις και δεξιώσεις.',
        gala_capacity: 220,
        theater_capacity: 320,
        cocktail_capacity: 450,
        floor_plan_svg_url: '/images/floorplans/level-3-plan.svg',
        features_tr: [
            'Binanın En Geniş Katı (458 m² Bütüncül Alan)',
            'Kuzey Kanadı (190 m²) + Güney Kanadı (150 m²)',
            'Panoramik Merkez Fuaye & Resepsiyon Holü (118 m²)',
            'Doğal Gün Işığı & Tam Karartma (Blackout) Opsiyonu',
            'Profesyonel Müzecilik Ray Aydınlatma Sistemi',
            'Catering Hazırlık Odası (Back-of-House) & WC',
        ],
        features_en: [
            'Largest Single Floor in the Building (458 m² Total)',
            'North Exhibition Wing (190 m²) + South Wing (150 m²)',
            'Panoramic Central Atrium & Reception Foyer (118 m²)',
            'Abundant Natural Daylight & Full Blackout Option',
            'Museum-Grade Track Lighting System',
            'Dedicated Catering Prep Room (Back-of-House) & WC',
        ],
        features_el: [
            'Ο Μεγαλύτερος Όροφος του Κτιρίου (458 m² Συνολικά)',
            'Βόρεια Πτέρυγα (190 m²) + Νότια Πτέρυγα (150 m²)',
            'Κεντρικό Φουαγιέ Υποδοχής & Δεξιώσεων (118 m²)',
            'Φυσικός Φωτισμός & Δυνατότητα Πλήρους Συσκότισης',
            'Μουσειακός Φωτισμός Ράγας & Κλιματισμός',
            'Χώρος Προετοιμασίας Catering & WC Επισκεπτών',
        ],
        image_url: 'https://tvloakrlqazcadokliaf.supabase.co/storage/v1/object/public/media/venue/idso4ws063_1773084000348.webp',
        thumbnail_images: [
            'https://tvloakrlqazcadokliaf.supabase.co/storage/v1/object/public/media/venue/qe9jvxrmfdn_1773084012264.webp',
            'https://tvloakrlqazcadokliaf.supabase.co/storage/v1/object/public/media/venue/9zg4pl7tr6_1773084019065.webp',
            'https://tvloakrlqazcadokliaf.supabase.co/storage/v1/object/public/media/venue/le67ll2cb_1773084025160.webp',
        ],
        techSpecs: {
            ceilingHeight: {
                tr: '4.60 m (Yüksek Galeri Tavanı)',
                en: '4.60 m (High Gallery Ceiling)',
                el: '4.60 m (Υψηλή Οροφή Γκαλερί)',
            },
            roomStructure: {
                tr: '2 Geniş Sergi Kanadı (190 + 150 m²) + Merkez Fuaye (118 m²)',
                en: '2 Grand Exhibition Wings (190 + 150 m²) + Atrium (118 m²)',
                el: '2 Πτέρυγες Εκθέσεων (190 + 150 m²) + Φουαγιέ (118 m²)',
            },
            powerSupply: {
                tr: '3×63A Trifaze Kat Panosu + Galeri Ray Hatları',
                en: '3×63A 3-Phase Floor Panel + Track Circuits',
                el: 'Τριφασικός Πίνακας 3×63A + Γραμμές Φωτισμού',
            },
            elevatorAccess: {
                tr: 'Asansör (630 kg / 8 Kişi) + Tarihi Merdiven (2.10 m)',
                en: 'Elevator (630 kg / 8 Pax) + Grand Staircase (2.10 m)',
                el: 'Ανελκυστήρας (630 kg) + Ιστορικό Κλιμακοστάσιο (2.10 m)',
            },
            connectivity: {
                tr: 'Simetrik Fiber Wi-Fi 6 • Canlı Yayın & Hibrit Etkinlik Ağı',
                en: 'Symmetric Fiber Wi-Fi 6 • Hybrid Event Network',
                el: 'Συμμετρικό Fiber Wi-Fi 6 • Δίκτυο Υβριδικών Εκδηλώσεων',
            },
            riggingRules: {
                tr: 'Ground-Support (Yerden Kurulum) • Serbest Sergi Panosu',
                en: 'Ground-Support Systems • Freestanding Exhibition Walls',
                el: 'Επιδαπέδια Συστήματα • Αυτοφερόμενοι Τοίχοι Έκθεσης',
            },
            classroomCapacity: 180,
            boardroomCapacity: 80,
        },
    },
    4: {
        id: 'd4e8910a-7c12-4e55-9b30-1060f0000004',
        level: 4,
        area: '1.060 m²',
        title_tr: 'Tüm Bina Kapatma (3 Kat Bütüncül Kullanım)',
        title_en: 'Full Building Buyout (All 3 Floors)',
        title_el: 'Ολόκληρο το Κτίριο (Και οι 3 Όροφοι)',
        description_tr: 'Tüm Bina Kapatma (Full Buyout): 1. Kat Büyük Salon, 2. Kat Paralel Galeri Odaları ve 3. Kat Büyük Sergi Kanatlarının tek bir kuruma/etkinliğe münhasıran tahsis edilmesidir. 1.060 m² toplam etkinlik alanı ile uluslararası zirveler, bienaller, büyük marka lansmanları ve çok katlı gala davetleri için benzersiz bir tarihi atmosfer sunar.',
        description_en: 'Full Building Buyout: Exclusive privatization of all three levels — the Level 1 Grand Hall, Level 2 Breakout Galleries, and Level 3 Exhibition Wings. Offering 1,060 m² of total event space for international summits, biennials, major brand takeovers, and multi-level gala receptions.',
        description_el: 'Αποκλειστική Διάθεση Ολόκληρου Κτιρίου (Full Buyout): Περιλαμβάνει και τους τρεις ορόφους (Μεγάλη Αίθουσα, Αίθουσες 2ου Ορόφου και Πτέρυγες 3ου Ορόφου) με συνολική επιφάνεια 1.060 m² για διεθνή συνέδρια, μπιενάλε και μεγάλες δεξιώσεις.',
        gala_capacity: 450,
        theater_capacity: 650,
        cocktail_capacity: 850,
        floor_plan_svg_url: '/images/floorplans/full-building-plan.svg',
        features_tr: [
            '1.060 m² Toplam Etkinlik Alanı (3 Kat + Asma Kat + 3 Fuaye)',
            'Tam Münhasırlık (Exclusive Marka / Kurum Tahsisi)',
            'Ana Konferans (Kat 1) + 5 Paralel Oturum (Kat 2) + Sergi/Gala (Kat 3)',
            'Kulis (Green Room), Basın Odası, VIP Lounge & 3 Catering Alanı',
            '3×125A Ana Trifaze Enerji & Tüm Binada Fiber Wi-Fi 6',
            'Özel Güvenlik, Vestiyer & Akreditasyon Giriş Kurgusu',
        ],
        features_en: [
            '1,060 m² Total Event Footprint (3 Floors + Mezzanine + 3 Foyers)',
            '100% Exclusive Building Privatization & Brand Takeover',
            'Plenary Hall (L1) + 5 Breakout Rooms (L2) + Exhibition/Gala (L3)',
            'Speaker Green Room, Press Suite, VIP Lounge & 3 Catering Zones',
            '3×125A Main 3-Phase Power & Building-Wide Fiber Wi-Fi 6',
            'Dedicated Security, Cloakroom & Registration Entrance Flow',
        ],
        features_el: [
            '1.060 m² Συνολικός Χώρος Εκδηλώσεων (3 Όροφοι + Πατάρι + 3 Φουαγιέ)',
            '100% Αποκλειστική Χρήση του Ιστορικού Κτιρίου',
            'Κεντρική Αίθουσα (1ος) + 5 Παράλληλες Αίθουσες (2ος) + Έκθεση/Γκαλά (3ος)',
            'Green Room Ομιλητών, Αίθουσα Τύπου, VIP Lounge & 3 Χώροι Catering',
            'Κεντρική Τριφασική Παροχή 3×125A & Fiber Wi-Fi 6 σε Όλο το Κτίριο',
            'Αποκλειστική Υποδοχή, Βεστιάριο & Έλεγχος Πρόσβασης',
        ],
        image_url: 'https://tvloakrlqazcadokliaf.supabase.co/storage/v1/object/public/media/venue/mz81jyod0nq_1773083709418.webp',
        thumbnail_images: [
            'https://tvloakrlqazcadokliaf.supabase.co/storage/v1/object/public/media/venue/ap0hijmh6rn_1773083839555.webp',
            'https://tvloakrlqazcadokliaf.supabase.co/storage/v1/object/public/media/venue/idso4ws063_1773084000348.webp',
            'https://tvloakrlqazcadokliaf.supabase.co/storage/v1/object/public/media/venue/ec39t6bl3hd_1773083599484.webp',
        ],
        techSpecs: {
            ceilingHeight: {
                tr: '4.20 m – 6.20 m (3 Kat + Asma Kat)',
                en: '4.20 m – 6.20 m (All 3 Floors + Mezzanine)',
                el: '4.20 m – 6.20 m (3 Όροφοι + Πατάρι)',
            },
            roomStructure: {
                tr: '1 Ana Salon + 2 Sergi Kanadı + 5 Paralel Salon + 3 Fuaye',
                en: '1 Grand Hall + 2 Exhibition Wings + 5 Breakout Rooms + 3 Foyers',
                el: '1 Μεγάλη Αίθουσα + 2 Πτέρυγες + 5 Αίθουσες + 3 Φουαγιέ',
            },
            powerSupply: {
                tr: '3×125A Ana Trifaze Enerji + Kat Panoları (63A / 32A / 63A)',
                en: '3×125A Main 3-Phase Supply + Floor Panels (63A / 32A / 63A)',
                el: 'Κεντρική Παροχή 3×125A + Πίνακες Ορόφων',
            },
            elevatorAccess: {
                tr: 'Kemeraltı Cd. Yükleme + Asansör (630 kg) + Tarihi Merdiven',
                en: 'Kemeraltı St. Load-In + Elevator (630 kg) + Grand Staircase',
                el: 'Φόρτωση από Kemeraltı Cd. + Ανελκυστήρας (630 kg)',
            },
            connectivity: {
                tr: 'Tüm Binada Kesintisiz Simetrik Fiber Wi-Fi 6 & Canlı Yayın Ağı',
                en: 'Building-Wide Seamless Fiber Wi-Fi 6 & Live Broadcast Mesh',
                el: 'Ενιαίο Δίκτυο Fiber Wi-Fi 6 & Live Broadcast σε Όλο το Κτίριο',
            },
            riggingRules: {
                tr: 'Ground-Support & Modüler Pano • Tam Bina Münhasırlığı',
                en: 'Ground-Support & Modular Panels • Full Venue Exclusivity',
                el: 'Επιδαπέδια Στήριξη • Πλήρης Αποκλειστικότητα Κτιρίου',
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
            floor_plan_svg_url: row.floor_plan_svg_url || canonical.floor_plan_svg_url,
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
