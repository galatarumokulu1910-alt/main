/**
 * Lightweight deterministic event slug resolver extracted from dbSync.ts
 * so HomePage and PastEventsPage do not pull preservedLegacyEvents.json (69 KB)
 * and CURATED_EVENT_PATCHES (40 KB) into the initial entry bundle.
 */
const STABILIZED_EVENT_SLUGS: Record<string, string> = {
    '41dea564-3256-4bf8-88c7-b7cba4f784d3': 'toz-sergisi',
    'ea2aa434-164a-4b0d-82a8-662393a1cb78': 'samatya-donem-konseri-sesler-hazinesi-orkestra-ve-solistleri',
    '7393d6fb-db07-4685-af62-10cc035a0ca2': 'violete-ikari-konseri-galatada-ince-bir-yagmur-neapoleos-stavropoleos-kutsal-metropolitligi-kadin-ko',
    'f9d2422d-d955-4d80-8828-94eaf2ef2ad9': '212-photography-istanbul-festivali-viviane-sassen-afisi',
    'bb82fa65-e8ec-45ec-8117-d5bb949923bc': '212-photography-istanbul-festivali-ebru-yildiz-afisi',
    'c258c4a7-8c4d-47e7-88cb-919e116b4135': 'murat-tabanlioglu-liderliginde-port-city-talks-living-by-the-water-sergi-kapanisi',
    'be2395b4-6335-4d04-9766-26981adc4945': 'ustad-thrasivoulos-stanitsas-1910-1987-anisina-duzenlenen-dini-musiki-konseri',
    'd011faf7-00d9-444f-b537-7deb4689ea8e': 'aleksis-aleksandris',
    'd46eb8b7-1e2b-40db-b156-2aa1780f69b3': 'cagri-sarayin-eksilen-zaman-adli-sergisi',
    'f9c5d523-452d-4876-9a4c-e69626593e33': 'ceren-oykutun-konstantiniye-ve-ayasofya-defterleri-adli-sergisi',
    '3fca592d-f02a-4d04-bbae-6cef46ec430b': '2-istanbul-tasarim-bienali-gelecek-artik-eskisi-gibi-degil',
    '35031159-3d9a-43c2-8d26-5b5a2585f712': 'galata-rum-okulunda-duzenlenen-ikona-yapim-atolyesi',
    '2e9caf22-1aa9-452e-b057-061634e1e159': '206-odali-sessizlik-buyukada-rum-yetimhanesi-uzerine-etudler-sergisi',
    'b6bbe178-ae6c-468a-9d25-69d3dfc85f44': 'alacakaranlikta-gunden-gune',
    '33424163-c303-4d19-a866-75fbe6b13905': 'dusunce-bahcesi-melek-aksoy-sinan-logie',
    '7fc2757e-e8f3-48d9-b856-5f0076c792b9': 'en-basa-don-okumalari',
    '66f6f1d2-e769-478c-b10e-e407e23f74ff': 'stefanos-yerasimosun-izinde-istanbul-ve-osmanli-tarihi',
};

const SLUG_TO_EVENT_ID: Record<string, string> = Object.fromEntries(
    Object.entries(STABILIZED_EVENT_SLUGS).map(([id, slug]) => [slug, id])
);

export function resolveEventSlug(event: { id: string; slug?: string | null }): string {
    if (event.slug && event.slug.trim().length > 0) {
        return event.slug.trim();
    }
    return STABILIZED_EVENT_SLUGS[event.id] || event.id;
}

export function resolveEventIdFromStabilizedSlug(slugOrId: string): string | null {
    if (STABILIZED_EVENT_SLUGS[slugOrId]) return slugOrId;
    return SLUG_TO_EVENT_ID[slugOrId] || null;
}
