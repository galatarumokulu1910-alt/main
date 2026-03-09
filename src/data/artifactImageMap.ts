/**
 * Maps artifact rows to local image imports.
 * Uses id-based matching (primary), then title fallback.
 * Once image_url values are populated in Supabase, this file can be removed.
 */
import { objectsArtifacts } from './objectsArtifacts';
import { documentsArtifacts } from './documentsArtifacts';

const allLocalArtifacts = [...objectsArtifacts, ...documentsArtifacts];

// Build lookups by id, title_en, and titleTr
const imageById: Record<string, string> = {};
const imageByTitle: Record<string, string> = {};
const imageByTitleTr: Record<string, string> = {};

for (const a of allLocalArtifacts) {
    if (a.imageSrc) {
        if (a.id) imageById[a.id] = a.imageSrc;
        if (a.title) imageByTitle[a.title] = a.imageSrc;
        if (a.titleTr) imageByTitleTr[a.titleTr] = a.imageSrc;
    }
}

/**
 * Resolves the image source for a Supabase artifact row.
 * Priority: image_url > id match > title_en match > title_tr match > normalize & fuzzy
 */
export function resolveArtifactImage(item: {
    id?: string | null;
    image_url?: string | null;
    title_en?: string | null;
    title_tr?: string | null;
}): string {
    // 1. Supabase image_url
    if (item.image_url) return item.image_url;

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
