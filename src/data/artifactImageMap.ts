/**
 * Maps artifact rows to local image imports.
 * Uses id-based matching (primary), then title fallback.
 *
 * ISS-03 Provenance Safeguard:
 * Explicitly identifies and blocks the 3 seeded records (`c1000000-...001..003`)
 * and synthetic AI placeholder assets (`vintage-*.png`) so they are NEVER
 * presented as authentic historical photographs in public galleries or detail views.
 */
import { objectsArtifacts } from './objectsArtifacts';
import { documentsArtifacts } from './documentsArtifacts';
import { normalizeLegacyMediaUrl } from '../config/venueInfo';

const allLocalArtifacts = [...objectsArtifacts, ...documentsArtifacts];

// Build lookups by id, title_en, and titleTr (both full-resolution for OpenSeadragon and 560px WebP thumbnails for grid cards)
const imageById: Record<string, string> = {};
const imageByTitle: Record<string, string> = {};
const imageByTitleTr: Record<string, string> = {};
const thumbById: Record<string, string> = {};
const thumbByTitle: Record<string, string> = {};
const thumbByTitleTr: Record<string, string> = {};

for (const a of allLocalArtifacts) {
    if (a.imageSrc) {
        const thumbUrl = a.id ? `/img/archive-thumbs/${a.id}.webp` : a.imageSrc;
        if (a.id) {
            imageById[a.id] = a.imageSrc;
            thumbById[a.id] = thumbUrl;
        }
        if (a.title) {
            imageByTitle[a.title] = a.imageSrc;
            thumbByTitle[a.title] = thumbUrl;
        }
        if (a.titleTr) {
            imageByTitleTr[a.titleTr] = a.imageSrc;
            thumbByTitleTr[a.titleTr] = thumbUrl;
        }
    }
}

/**
 * IDs of the 3 database records that were seeded with AI-generated placeholder
 * illustrations instead of verified historical scans (ISS-03).
 */
export const UNVERIFIED_ILLUSTRATION_ARTIFACT_IDS = new Set<string>([
    'c1000000-0000-0000-0000-000000000001',
    'c1000000-0000-0000-0000-000000000002',
    'c1000000-0000-0000-0000-000000000003',
]);

/**
 * File path substrings of synthetic AI-generated illustrations that must never
 * be rendered as authentic historical photographs.
 */
export const SYNTHETIC_PLACEHOLDER_IMAGE_PATTERNS = [
    'vintage-school-register.png',
    'vintage-greek-book.png',
    'vintage-school-toys.png',
    'vintage-student-portrait.png',
] as const;

export function isSyntheticPlaceholderUrl(url: string | null | undefined): boolean {
    if (!url) return false;
    const lower = url.toLowerCase();
    return SYNTHETIC_PLACEHOLDER_IMAGE_PATTERNS.some((pat) => lower.includes(pat));
}

export function isUnverifiedIllustrationArtifact(item: {
    id?: string | null;
    image_url?: string | null;
}): boolean {
    if (!item) return false;
    if (item.id && UNVERIFIED_ILLUSTRATION_ARTIFACT_IDS.has(item.id)) {
        return true;
    }
    return isSyntheticPlaceholderUrl(item.image_url);
}

/**
 * Filters out unverified synthetic/illustration records from public collection listings
 * until genuine archival scans are uploaded and approved by the Foundation.
 */
export function filterVerifiedPublicArtifacts<T extends { id?: string | null; image_url?: string | null }>(
    items: T[]
): T[] {
    return items.filter((item) => !isUnverifiedIllustrationArtifact(item));
}

/**
 * Resolves the image source for a Supabase artifact row.
 * Priority: verified image_url > id match > title_en match > title_tr match > normalized match.
 * Returns '' if the record is flagged as an unverified synthetic illustration (ISS-03).
 */
export function resolveArtifactImage(item: {
    id?: string | null;
    image_url?: string | null;
    title_en?: string | null;
    title_tr?: string | null;
}): string {
    if (isUnverifiedIllustrationArtifact(item)) {
        return '';
    }

    // 1. Supabase image_url (verified non-synthetic)
    if (item.image_url) return normalizeLegacyMediaUrl(item.image_url);

    // 2. Match by id
    if (item.id && imageById[item.id]) {
        return imageById[item.id];
    }

    // 3. Match by English title (exact)
    if (item.title_en && imageByTitle[item.title_en]) {
        return imageByTitle[item.title_en];
    }

    // 4. Match by Turkish title (exact)
    if (item.title_tr && imageByTitleTr[item.title_tr]) {
        return imageByTitleTr[item.title_tr];
    }

    // 5. Normalized title match (strip dashes, Unicode normalize)
    if (item.title_en) {
        const normalized = item.title_en.normalize('NFC').replace(/[\u2013\u2014]/g, '—').trim();
        if (imageByTitle[normalized]) return imageByTitle[normalized];
    }
    if (item.title_tr) {
        const normalized = item.title_tr.normalize('NFC').replace(/[\u2013\u2014]/g, '—').trim();
        if (imageByTitleTr[normalized]) return imageByTitleTr[normalized];
    }

    // No match found
    return '';
}

/**
 * Resolves the lightweight 560px WebP thumbnail URL (`/img/archive-thumbs/<id>.webp`)
 * for collection/grid cards (`/arsiv/koleksiyon`, `/arsiv/istanbul-rum`), while keeping
 * full-resolution scans in `resolveArtifactImage()` for the OpenSeadragon detail viewer.
 */
export function resolveArtifactThumbnail(item: {
    id?: string | null;
    image_url?: string | null;
    title_en?: string | null;
    title_tr?: string | null;
}): string {
    if (isUnverifiedIllustrationArtifact(item)) {
        return '';
    }

    if (item.id && thumbById[item.id]) {
        return thumbById[item.id];
    }
    if (item.title_en && thumbByTitle[item.title_en]) {
        return thumbByTitle[item.title_en];
    }
    if (item.title_tr && thumbByTitleTr[item.title_tr]) {
        return thumbByTitleTr[item.title_tr];
    }
    if (item.title_en) {
        const normalized = item.title_en.normalize('NFC').replace(/[\u2013\u2014]/g, '—').trim();
        if (thumbByTitle[normalized]) return thumbByTitle[normalized];
    }
    if (item.title_tr) {
        const normalized = item.title_tr.normalize('NFC').replace(/[\u2013\u2014]/g, '—').trim();
        if (thumbByTitleTr[normalized]) return thumbByTitleTr[normalized];
    }

    return resolveArtifactImage(item);
}

export function getArchivalCreditNotice(lang: 'tr' | 'en' | 'el'): string {
    if (lang === 'tr') {
        return 'Kaynak & Telif: Galata Rum Okulu Vakfı Arşivi. Dijital arşiv görselleri yalnızca kültürel mirasın korunması ve akademik araştırma amacıyla sunulmaktadır; yazılı izin olmaksızın ticari olarak çoğaltılamaz.';
    }
    if (lang === 'el') {
        return 'Πηγή & Πνευματικά Δικαιώματα: Αρχείο της Αστικής Σχολής Γαλατά. Τα ψηφιακά τεκμήρια παρουσιάζονται αποκλειστικά για σκοπούς έρευνας και διατήρησης της πολιτιστικής κληρονομιάς.';
    }
    return 'Source & Copyright: Galata Greek School Foundation Archive. Digital archival visuals are provided strictly for cultural heritage preservation and academic study; commercial reproduction without written permission is prohibited.';
}

export function getUnverifiedArtifactBanner(lang: 'tr' | 'en' | 'el'): { title: string; body: string } {
    if (lang === 'tr') {
        return {
            title: 'Arşiv Görseli Doğrulama Aşamasında (ISS-03)',
            body: 'Bu arşiv kaydının orijinal yüksek çözünürlüklü tıpkıbasımı ve envanter künyesi vakıf arşiv kurulu tarafından doğrulanmaktadır. Temsili/illüstratif görseller orijinal tarihi belge olarak yayınlanmamaktadır.',
        };
    }
    if (lang === 'el') {
        return {
            title: 'Το Αρχειακό Τεκμήριο Βρίσκεται Υπό Επαλήθευση (ISS-03)',
            body: 'Το πρωτότυπο ψηφιακό αντίγραφο υψηλής ανάλυσης και η αρχειακή τεκμηρίωση αυτής της καταχώρισης βρίσκονται υπό επαλήθευση από το Αρχείο του Ιδρύματος.',
        };
    }
    return {
        title: 'Archival Visual Under Provenance Verification (ISS-03)',
        body: 'The original high-resolution facsimile and catalog provenance for this archival entry are currently undergoing verification by the Foundation Archive Board. Illustrative placeholders are withheld from public display.',
    };
}
