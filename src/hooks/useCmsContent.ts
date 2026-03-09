import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';

/**
 * Fetches all page_content rows for a given page_key.
 * Returns a helper `get(sectionKey, lang)` with automatic fallback chain:
 *   lang → 'en' → fallback string
 */
export function useCmsContent(pageKey: string) {
    const [rows, setRows] = useState<Record<string, any>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            const { data } = await supabase
                .from('page_content')
                .select('*')
                .eq('page_key', pageKey);

            if (data && data.length > 0) {
                const map: Record<string, any> = {};
                data.forEach(row => { map[row.section_key] = row; });
                setRows(map);
            }
            setLoading(false);
        };
        fetch();
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
