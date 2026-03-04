/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export type Language = 'tr' | 'en' | 'el';

interface I18nContextType {
    lang: Language;
    setLang: (lang: Language) => void;
    t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

/* ── Translation dictionaries ── */
const translations: Record<Language, Record<string, string>> = {
    tr: {
        'nav.home': 'Ana Sayfa',
        'nav.exhibitions': 'Sergiler',
        'nav.events': 'Etkinlikler',
        'nav.archive': 'Arsiv',
        'nav.venueHire': 'Mekan Kiralama',
        'nav.contact': 'Bize Ulasin',
        'hero.badge': 'Estd. 1885',
        'hero.headline': 'ESTD. 1885: Etkinliginizi Tarihte Duzenleyin',
        'hero.subtitle': 'Bir asirlik mirasi modern vizyonlarla bulusturan, Istanbul\'un en ikonik neoklasik yapilarindan biri.',
        'hero.cta': 'Etkinliginizi Planlayin',
        'hero.explore': 'Arsivi Kesfedin',
        'archive.title': '100 Yillik Ufuk',
        'archive.subtitle': 'Galata Rum yasaminin canli dijital arsivi',
        'archive.collection': 'Arsiv Koleksiyonu',
        'venue.title': 'Bos Tuval',
        'venue.subtitle': 'Istanbul\'un en ikonik neoklasik yapilarindan birini, bir sonraki vizyonunuzun sahnesine donusturun.',
        'venue.floorPlans': 'Altin Aksanli Kat Planlari',
        'venue.badge': 'Mekan Kiralama',
        'footer.newsletter': 'Bultenimize Abone Olun',
        'footer.emailPlaceholder': 'E-posta adresiniz',
        'footer.subscribe': 'Abone Ol',
        'footer.visitHours': 'Ziyaret Saatleri',
        'footer.contact': 'Iletisim',
        'footer.location': 'Konum',
        'footer.weekdays': 'Hafta ici: 09:00 - 18:00',
        'footer.weekends': 'Hafta sonu: 10:00 - 16:00',
        'footer.address': 'Kemankesh Karamustafa Pasa, Galata, Karakoy, Istanbul',
        'footer.phone': '+90 212 243 3597',
        'footer.email': 'info@galatarumokulu.org',
        'footer.copyright': '\u00A9 2026 Galata Rum Okulu. Tum haklari saklidir.',
        'footer.privacy': 'KVKK',
        'footer.cookies': 'Cerez Politikasi',
        'footer.credits': 'Kunye',
        'footer.exportCsv': 'CSV Disa Aktar',
        'footer.exportXlsx': 'XLSX Disa Aktar',
        'capacity.gala': 'Gala Yemegi',
        'capacity.theater': 'Tiyatro',
        'capacity.cocktail': 'Kokteyl',
        'capacity.configuration': 'Kurulum',
        'capacity.capacity': 'Kapasite',
        'features.title': 'Ozellikler',
        'features.setupCapacities': 'Kurulum Kapasiteleri',
        'slider.manage': 'Slaytlari Yonet',
    },
    en: {
        'nav.home': 'Home',
        'nav.exhibitions': 'Exhibitions',
        'nav.events': 'Events',
        'nav.archive': 'Archive',
        'nav.venueHire': 'Venue Hire',
        'nav.contact': 'Contact',
        'hero.badge': 'Estd. 1885',
        'hero.headline': 'ESTD. 1885: Host Your Event in History',
        'hero.subtitle': 'One of Istanbul\'s most iconic neoclassical landmarks, bridging a century of heritage with modern visions.',
        'hero.cta': 'Plan Your Event',
        'hero.explore': 'Explore the Archive',
        'archive.title': 'The 100-Year Horizon',
        'archive.subtitle': 'A living digital archive of Galata Greek life',
        'archive.collection': 'Archive Collection',
        'venue.title': 'The Blank Canvas',
        'venue.subtitle': 'Transform one of Istanbul\'s most iconic neoclassical landmarks into the stage for your next vision.',
        'venue.floorPlans': 'Gold-Accented Floor Plans',
        'venue.badge': 'Venue Hire',
        'footer.newsletter': 'Subscribe to Our Newsletter',
        'footer.emailPlaceholder': 'Your email address',
        'footer.subscribe': 'Subscribe',
        'footer.visitHours': 'Visit Hours',
        'footer.contact': 'Contact',
        'footer.location': 'Location',
        'footer.weekdays': 'Weekdays: 09:00 - 18:00',
        'footer.weekends': 'Weekends: 10:00 - 16:00',
        'footer.address': 'Kemankesh Karamustafa Pasa, Galata, Karakoy, Istanbul',
        'footer.phone': '+90 212 243 3597',
        'footer.email': 'info@galatarumokulu.org',
        'footer.copyright': '\u00A9 2026 Galata Rum Okulu. All rights reserved.',
        'footer.privacy': 'Privacy',
        'footer.cookies': 'Cookie Policy',
        'footer.credits': 'Credits',
        'footer.exportCsv': 'Export CSV',
        'footer.exportXlsx': 'Export XLSX',
        'capacity.gala': 'Gala Dinner',
        'capacity.theater': 'Theater',
        'capacity.cocktail': 'Cocktail',
        'capacity.configuration': 'Configuration',
        'capacity.capacity': 'Capacity',
        'features.title': 'Features',
        'features.setupCapacities': 'Setup Capacities',
        'slider.manage': 'Manage Slides',
    },
    el: {
        'nav.home': 'Archiki',
        'nav.exhibitions': 'Ektheseis',
        'nav.events': 'Ekdiloseis',
        'nav.archive': 'Archeio',
        'nav.venueHire': 'Enoikiasi Chorou',
        'nav.contact': 'Epikoinonia',
        'hero.badge': 'Idr. 1885',
        'hero.headline': 'IDR. 1885: Filoxeniste tin Ekdilosi sas stin Istoria',
        'hero.subtitle': 'Ena apo ta pio emvlimatika neoklasika ktiria tis Konstantinoupolis.',
        'hero.cta': 'Schediaste tin Ekdilosi sas',
        'hero.explore': 'Exerevniste to Archeio',
        'archive.title': 'O Orizontas 100 Eton',
        'archive.subtitle': 'Ena zontano psifiako archeio tis ellinikis zois stin Galata',
        'archive.collection': 'Syllogi Archeiou',
        'venue.title': 'O Lefkos Kamvas',
        'venue.subtitle': 'Metatrepste ena apo ta pio emvlimatika neoklasika ktiria tis Konstantinoupolis se skini gia to epomeno orama sas.',
        'venue.floorPlans': 'Katopseis me Chryses Pinelies',
        'venue.badge': 'Enoikiasi Chorou',
        'footer.newsletter': 'Eggrafi sto Enimerotiko mas Deltio',
        'footer.emailPlaceholder': 'I diefthinsi email sas',
        'footer.subscribe': 'Eggrafi',
        'footer.visitHours': 'Ores Episkepsis',
        'footer.contact': 'Epikoinonia',
        'footer.location': 'Topothesia',
        'footer.weekdays': 'Kathimerines: 09:00 - 18:00',
        'footer.weekends': 'Savvatokyriaka: 10:00 - 16:00',
        'footer.address': 'Kemankesh Karamustafa Pasa, Galatas, Karakioi, Konstantinoupoli',
        'footer.phone': '+90 212 243 3597',
        'footer.email': 'info@galatarumokulu.org',
        'footer.copyright': '\u00A9 2026 Galata Rum Okulu. Me epifylaksi pantos dikaiomatos.',
        'footer.privacy': 'Aporrito',
        'footer.cookies': 'Politiki Cookies',
        'footer.credits': 'Syntelestes',
        'footer.exportCsv': 'Exagogi CSV',
        'footer.exportXlsx': 'Exagogi XLSX',
        'capacity.gala': 'Deipno Gkala',
        'capacity.theater': 'Theatro',
        'capacity.cocktail': 'Cocktail',
        'capacity.configuration': 'Diamorfosi',
        'capacity.capacity': 'Choritikotita',
        'features.title': 'Charaktiristika',
        'features.setupCapacities': 'Choritikotites Diamorfosis',
        'slider.manage': 'Diacheirisi Diafaneion',
    },
};

export function I18nProvider({ children }: { children: ReactNode }) {
    const [lang, setLang] = useState<Language>('tr');

    const t = useCallback(
        (key: string): string => translations[lang][key] || translations.en[key] || key,
        [lang],
    );

    return (
        <I18nContext.Provider value={{ lang, setLang, t }}>
            {children}
        </I18nContext.Provider>
    );
}

export function useI18n() {
    const ctx = useContext(I18nContext);
    if (!ctx) throw new Error('useI18n must be used within I18nProvider');
    return ctx;
}
