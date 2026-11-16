import heroFacadeImage from '../assets/hero-facade-wide.webp';

export type HeroPanVariant =
    | 'enter-pan-right'
    | 'pan-left'
    | 'pan-right'
    | 'pan-right-zoom'
    | 'pan-up-left'
    | 'pan-out-center'
    | 'static';

export interface HeroInteriorSlide {
    id: string;
    src: string;
    label: string;
    panVariant: HeroPanVariant;
}

export interface HeroConfig {
    facadeImageUrl: string;
    slideDurationMs: number;
    slides: HeroInteriorSlide[];
}

export const HERO_PAN_OPTIONS: { value: HeroPanVariant; label: string; desc: string }[] = [
    {
        value: 'enter-pan-right',
        label: 'İçeri Giriş & Sağa Pan',
        desc: 'Kapı açılışında ileri doğru girerek sağa süzülür (İlk sahne için önerilir)',
    },
    {
        value: 'pan-left',
        label: 'Soldan Sağa Pan',
        desc: 'Mekân içinde soldan sağa doğru yatay kamera hareketi',
    },
    {
        value: 'pan-right',
        label: 'Sağdan Sola Pan',
        desc: 'Mekân içinde sağdan sola doğru yatay kamera hareketi',
    },
    {
        value: 'pan-right-zoom',
        label: 'Sola Pan & Yakınlaşma (Zoom In)',
        desc: 'Sola doğru kayarken mimari detaylara yavaşça yakınlaşır',
    },
    {
        value: 'pan-up-left',
        label: 'Aşağıdan Yukarı & Sola Pan',
        desc: 'Zeminden tavan ve kemer detaylarına doğru yükselerek kayar',
    },
    {
        value: 'pan-out-center',
        label: 'Merkezden Uzaklaşma (Zoom Out)',
        desc: 'Detaydan başlayıp geniş salon perspektifine doğru açılır',
    },
    {
        value: 'static',
        label: 'Sabit (Hareketsiz)',
        desc: 'Kamera hareketi olmadan yalnızca yumuşak geçiş (cross-fade) uygular',
    },
];

export const DEFAULT_FACADE_IMAGE = heroFacadeImage;

export const DEFAULT_HERO_SLIDES: HeroInteriorSlide[] = [
    {
        id: 'hero-slide-1',
        label: '1. Büyük Salon — Genel Görünüm',
        src: 'https://tvloakrlqazcadokliaf.supabase.co/storage/v1/object/public/media/venue/mz81jyod0nq_1773083709418.webp',
        panVariant: 'enter-pan-right',
    },
    {
        id: 'hero-slide-2',
        label: '2. Büyük Salon — Sütunlar ve Sahne Perspektifi',
        src: 'https://tvloakrlqazcadokliaf.supabase.co/storage/v1/object/public/media/venue/j68cg174mir_1773083669472.webp',
        panVariant: 'pan-left',
    },
    {
        id: 'hero-slide-3',
        label: '3. 2. Kat Sergi Salonu & Kemerli Koridor',
        src: 'https://tvloakrlqazcadokliaf.supabase.co/storage/v1/object/public/media/venue/ap0hijmh6rn_1773083839555.webp',
        panVariant: 'pan-right-zoom',
    },
    {
        id: 'hero-slide-4',
        label: '4. Büyük Salon — Çağdaş Sanat Sergi Kurulumu',
        src: 'https://tvloakrlqazcadokliaf.supabase.co/storage/v1/object/public/media/venue/afnuua7o3ah_1773083641141.webp',
        panVariant: 'pan-up-left',
    },
    {
        id: 'hero-slide-5',
        label: '5. Büyük Salon — Asma Kat ve Etkinlik Düzeni',
        src: 'https://tvloakrlqazcadokliaf.supabase.co/storage/v1/object/public/media/venue/bg6errwn25u_1773083618325.webp',
        panVariant: 'pan-out-center',
    },
];

export const DEFAULT_HERO_CONFIG: HeroConfig = {
    facadeImageUrl: '',
    slideDurationMs: 6200,
    slides: DEFAULT_HERO_SLIDES,
};

export function parseHeroConfig(rawJson?: string | null): HeroConfig {
    if (!rawJson || !rawJson.trim()) {
        return DEFAULT_HERO_CONFIG;
    }
    try {
        const parsed = JSON.parse(rawJson);
        const slides = Array.isArray(parsed.slides) && parsed.slides.length > 0
            ? parsed.slides.filter((s: any) => s && typeof s.src === 'string' && s.src.trim().length > 0).map((s: any, idx: number) => ({
                id: s.id || `hero-slide-${idx + 1}`,
                label: s.label || `Sahne ${idx + 1}`,
                src: s.src,
                panVariant: HERO_PAN_OPTIONS.some((o) => o.value === s.panVariant) ? s.panVariant : 'pan-left',
            }))
            : DEFAULT_HERO_SLIDES;

        return {
            facadeImageUrl: typeof parsed.facadeImageUrl === 'string' ? parsed.facadeImageUrl : '',
            slideDurationMs: typeof parsed.slideDurationMs === 'number' && parsed.slideDurationMs >= 3000 ? parsed.slideDurationMs : 6200,
            slides: slides.length > 0 ? slides : DEFAULT_HERO_SLIDES,
        };
    } catch {
        return DEFAULT_HERO_CONFIG;
    }
}
