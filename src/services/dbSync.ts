import { supabase } from './supabaseClient';

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

export const MISSING_EVENT_DESCRIPTIONS_TR: Record<string, string> = {
    'toz-sergisi': [
        'Sanat kuramcısı, yazar ve küratör Ali Artun ile heykeltıraş ve kavramsal sanatçı Ahmet Yiğider’i bir araya getiren “TÖZ” sergisi, 17 Ocak – 8 Şubat 2026 tarihleri arasında Galata Rum Okulu Vakfı - Kültür Merkezi’nde sanatseverlerle buluştu.',
        'Sergi, mimarlığı gündelik yaşamın faydacı pratiklerinden, yapıların salt işlevselliğinden ve rasyonalist kurgulardan soyutlayarak; onu kadim, şiirsel, büyüsel ve sembolik bir dil olarak ele alır. Ali Artun’un kavramsal çerçevesinde “TÖZ”, çevremizi kuşatan sıradan yapılaşmanın ötesine geçerek formun, geometrinin, sayının ve sembolün imgesel dünyasına odaklanan bir mimarlık ve düşünce sergisi niteliği taşır.',
        'Ahmet Yiğider’in Galata Rum Okulu’nun tarihi neoklasik atmosferiyle diyalog kuran heykel ve mekânsal yerleştirmeleri, insanlığın kadim hafızasındaki izleri, tözü ve gizemi görünür kılar. Sergi, izleyiciyi mekân, form ve varoluş arasındaki derin ilişki üzerine kozmik ve şiirsel bir tefekkür alanına davet eder.',
    ].join('\n\n'),
    'samatya-donem-konseri-sesler-hazinesi-orkestra-ve-solistleri':
        'Sesler Hazinesi Orkestra ve Solistleri tarafından Galata Rum Okulu’nun tarihi ana salonunda gerçekleştirilen “Samatya” Dönem Konseri, İstanbul’un çok kültürlü müzik mirasını ve Samatya’nın tarihsel ezgilerini dinleyicilerle buluşturdu.',
    'violete-ikari-konseri-galatada-ince-bir-yagmur-neapoleos-stavropoleos-kutsal-metropolitligi-kadin-ko':
        'Yunan müziğinin sevilen sesi Violete Ikari, Neapoleos & Stavropoleos Kutsal Metropolitliği Kadın Korosu eşliğinde “Galata’da İnce Bir Yağmur…” başlıklı özel konserde Galata Rum Okulu sahnesinde dinleyicilerle buluştu.',
    '212-photography-istanbul-festivali-viviane-sassen-afisi':
        'Uluslararası fotoğraf ve görsel sanatlar festivali 212 Photography Istanbul kapsamında Galata Rum Okulu, çağdaş fotoğraf sanatının öncü isimlerinden Viviane Sassen başta olmak üzere uluslararası sanatçıların seçkilerine ev sahipliği yaptı.',
    '212-photography-istanbul-festivali-ebru-yildiz-afisi':
        '212 Photography Istanbul festivali kapsamında Galata Rum Okulu’nun sergi salonlarında düzenlenen seçkide, Ebru Yıldız’ın müzik ve sahne dünyasını belgeleyen çarpıcı fotoğraf çalışmaları sanatseverlerle buluştu.',
    'murat-tabanlioglu-liderliginde-port-city-talks-living-by-the-water-sergi-kapanisi':
        'Mimar Murat Tabanlıoğlu öncülüğünde düzenlenen “Port City Talks: Living by the Water” sergi kapanışı ve söyleşi programı, liman kentlerinin mimari, kültürel ve kentsel dönüşümünü Galata Rum Okulu’nda tartışmaya açtı.',
};

/**
 * Runs automatically when an authenticated admin session is active in AdminPage,
 * syncing event_types, missing past_events descriptions, and updated page_content rows.
 */
export async function syncDatabaseWithAuthenticatedSession(): Promise<void> {
    try {
        // 1. Upsert canonical event_types
        await supabase.from('event_types').upsert(CANONICAL_EVENT_TYPES, { onConflict: 'key' });

        // 2. Backfill missing past_events descriptions (including toz-sergisi)
        for (const [slug, descTr] of Object.entries(MISSING_EVENT_DESCRIPTIONS_TR)) {
            await supabase
                .from('past_events')
                .update({ description_tr: descTr })
                .eq('slug', slug);
        }

        // 3. Update page_content rows to remove commercial copy & duplicate tagline prefixes
        await supabase
            .from('page_content')
            .update({
                content_tr: 'Arşivi Keşfedin',
                content_en: 'Explore the Archive',
                content_el: 'Εξερευνήστε το Αρχείο',
            })
            .eq('section_key', 'cta_primary');

        await supabase
            .from('page_content')
            .update({
                content_tr: 'Galata Rum Okulu Vakfı - Kültür Merkezi; İstanbul Bienali ve 212 Photography Istanbul gibi uluslararası sanat buluşmalarından dönem konserlerine, mimarlık ve edebiyat sempozyumlarından seçkin lansman ve özel resepsiyonlara kadar pek çok prestijli etkinliğe ev sahipliği yapmaktadır.',
                content_en: 'The Galata Greek School Foundation - Cultural Center hosts a distinguished repertoire of events — from international art gatherings like the Istanbul Biennial and 212 Photography Istanbul to period concerts, architecture and literature symposia, and exclusive receptions.',
                content_el: 'Το Ίδρυμα Ελληνικού Σχολείου Γαλατά - Πολιτιστικό Κέντρο φιλοξενεί ένα εκλεκτό ρεπερτόριο εκδηλώσεων — από διεθνείς καλλιτεχνικές διοργανώσεις όπως η Μπιενάλε της Κωνσταντινούπολης έως συναυλίες, συμπόσια αρχιτεκτονικής και λογοτεχνίας, και ιδιαίτερες δεξιώσεις.',
            })
            .eq('section_key', 'hero_description');
    } catch (err) {
        console.warn('Database auto-sync warning:', err);
    }
}
