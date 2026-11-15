import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';

const cmsCache = new Map<string, Record<string, any>>();
const inflightRequests = new Map<string, Promise<Record<string, any>>>();

export function invalidateCmsCache(pageKey?: string) {
    if (pageKey) {
        cmsCache.delete(pageKey);
        inflightRequests.delete(pageKey);
    } else {
        cmsCache.clear();
        inflightRequests.clear();
    }
}

async function loadPageContent(pageKey: string): Promise<Record<string, any>> {
    const cached = cmsCache.get(pageKey);
    if (cached) return cached;

    const existingPromise = inflightRequests.get(pageKey);
    if (existingPromise) return existingPromise;

    const promise = (async () => {
        const { data } = await supabase
            .from('page_content')
            .select('section_key, content_tr, content_en, content_el')
            .eq('page_key', pageKey);

        const map: Record<string, any> = {};
        if (data && data.length > 0) {
            data.forEach((row) => {
                map[row.section_key] = row;
            });
            cmsCache.set(pageKey, map);
        }
        inflightRequests.delete(pageKey);
        return map;
    })();

    inflightRequests.set(pageKey, promise);
    return promise;
}

/**
 * Fetches all page_content rows for a given page_key with in-memory deduplication.
 * Returns a helper `get(sectionKey, lang)` with automatic fallback chain:
 *   lang → 'en' → fallback string
 */
export function useCmsContent(pageKey: string) {
    const [rows, setRows] = useState<Record<string, any>>(() => cmsCache.get(pageKey) ?? {});
    const [loading, setLoading] = useState<boolean>(() => !cmsCache.has(pageKey));

    useEffect(() => {
        let active = true;
        if (cmsCache.has(pageKey)) {
            setRows(cmsCache.get(pageKey)!);
            setLoading(false);
            return;
        }
        setLoading(true);
        loadPageContent(pageKey).then((map) => {
            if (active) {
                setRows(map);
                setLoading(false);
            }
        });
        return () => {
            active = false;
        };
    }, [pageKey]);

    /**
     * Get localized text for a section key.
     * @param sectionKey - The section_key in the DB
     * @param lang - Active language
     * @param fallback - Fallback string if DB has no entry
     */
    const get = (sectionKey: string, lang: string, fallback = ''): string => {
        const row = rows[sectionKey];
        if (!row) return fallback;
        const l = lang as 'tr' | 'en' | 'el';
        return row[`content_${l}`] || row.content_en || fallback;
    };

    return { get, loading, hasData: Object.keys(rows).length > 0 };
}
