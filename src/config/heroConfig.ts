import heroFacadeImage from '../assets/hero-facade-wide.webp';
import { normalizeLegacyMediaUrl } from './venueInfo';

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

export const ADDITIONAL_ARCHITECTURAL_HERO_SLIDES: HeroInteriorSlide[] = [
    {
        id: 'hero-slide-6',
        label: '6. Büyük Salon — Sahne ve Tarihi Taş Duvar Perspektifi',
        src: '/images/architecture/mehmet-mutaf-01-buyuk-salon-tas-duvar.jpg',
        panVariant: 'enter-pan-right',
    },
    {
        id: 'hero-slide-7',
        label: '7. 2. Kat Üst Galeri Balkonundan Büyük Salon Perspektifi',
        src: '/images/architecture/mehmet-mutaf-02-ust-balkon-buyuk-salon.jpg',
        panVariant: 'pan-out-center',
    },
    {
        id: 'hero-slide-8',
        label: '8. 1. Kat Ana Fuaye & Merdiven Sahanlığından Büyük Salon Girişi',
        src: '/images/architecture/mehmet-mutaf-03-birinci-kat-fuaye-giris.jpg',
        panVariant: 'pan-left',
    },
    {
        id: 'hero-slide-9',
        label: '9. Sergi Salonları — Kapıdan Kapıya (Enfilade) Galeri Perspektifi',
        src: '/images/architecture/mehmet-mutaf-04-sergi-salonlari-enfilade.jpg',
        panVariant: 'pan-right-zoom',
    },
    {
        id: 'hero-slide-10',
        label: '10. Tarihi Sınıf & Panoramik Duvar Resmi',
        src: '/images/architecture/mehmet-mutaf-06-tarihi-sinif-duvar-resmi.jpg',
        panVariant: 'pan-up-left',
    },
    {
        id: 'hero-slide-11',
        label: '11. Restorasyonda Açığa Çıkan Tarihi Tuğla Tonozlu Taş Mekân',
        src: '/images/architecture/mehmet-mutaf-09-tonozlu-tarihi-tas-mekan.jpg',
        panVariant: 'pan-out-center',
    },
];

export const DEFAULT_HERO_SLIDES: HeroInteriorSlide[] = [
    {
        id: 'hero-slide-1',
        label: '1. Büyük Salon — Genel Görünüm',
        src: '/supabase-media/venue/mz81jyod0nq_1773083709418.webp',
        panVariant: 'enter-pan-right',
    },
    {
        id: 'hero-slide-2',
        label: '2. Büyük Salon — Sütunlar ve Sahne Perspektifi',
        src: '/supabase-media/venue/j68cg174mir_1773083669472.webp',
        panVariant: 'pan-left',
    },
    {
        id: 'hero-slide-3',
        label: '3. 2. Kat Sergi Salonu & Kemerli Koridor',
        src: '/supabase-media/venue/ap0hijmh6rn_1773083839555.webp',
        panVariant: 'pan-right-zoom',
    },
    {
        id: 'hero-slide-4',
        label: '4. Büyük Salon — Çağdaş Sanat Sergi Kurulumu',
        src: '/supabase-media/venue/afnuua7o3ah_1773083641141.webp',
        panVariant: 'pan-up-left',
    },
    {
        id: 'hero-slide-5',
        label: '5. Büyük Salon — Asma Kat ve Etkinlik Düzeni',
        src: '/supabase-media/venue/bg6errwn25u_1773083618325.webp',
        panVariant: 'pan-out-center',
    },
    ...ADDITIONAL_ARCHITECTURAL_HERO_SLIDES,
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
        const baseSlides: HeroInteriorSlide[] = Array.isArray(parsed.slides) && parsed.slides.length > 0
            ? parsed.slides.filter((s: any) => s && typeof s.src === 'string' && s.src.trim().length > 0).map((s: any, idx: number) => ({
                id: s.id || `hero-slide-${idx + 1}`,
                label: s.label || `Sahne ${idx + 1}`,
                src: normalizeLegacyMediaUrl(s.src),
                panVariant: HERO_PAN_OPTIONS.some((o) => o.value === s.panVariant) ? s.panVariant : 'pan-left',
            }))
            : DEFAULT_HERO_SLIDES;

        const existingSrcSet = new Set(baseSlides.map((s) => s.src));
        const mergedSlides = [
            ...baseSlides,
            ...ADDITIONAL_ARCHITECTURAL_HERO_SLIDES.filter((s) => !existingSrcSet.has(s.src)),
        ];

        return {
            facadeImageUrl: typeof parsed.facadeImageUrl === 'string' ? normalizeLegacyMediaUrl(parsed.facadeImageUrl) : '',
            slideDurationMs: typeof parsed.slideDurationMs === 'number' && parsed.slideDurationMs >= 3000 ? parsed.slideDurationMs : 6200,
            slides: mergedSlides.length > 0 ? mergedSlides : DEFAULT_HERO_SLIDES,
        };
    } catch {
        return DEFAULT_HERO_CONFIG;
    }
}
