import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';

const cmsCache = new Map<string, Record<string, any>>();
const inflightRequests = new Map<string, Promise<Record<string, any>>>();

export const CURATED_CMS_EL_OVERRIDES: Record<string, string> = {
    'home.hero_headline': 'Το Σύγχρονο Παρελθόν',
    'home.hero_subtitle':
        'Ένα ιστορικό νεοκλασικό κτίριο στην καρδιά του Γαλατά, που σήμερα αποτελεί ζωντανή εστία σύγχρονης τέχνης και πολιτισμού.',
    'home.cta_primary': 'Ενοικίαση Χώρου',
    'home.cta_secondary': 'Ανακαλύψτε την Ιστορία μας',
    'home.history_p1':
        'Η Αστική Σχολή Γαλατά συγκαταλέγεται στα σημαντικότερα εκπαιδευτικά καθιδρύματα που ίδρυσε η ομογένεια κατά την περίοδο του εκσυγχρονισμού της Οθωμανικής Αυτοκρατορίας. Το διδακτήριο ανεγέρθηκε σε οικόπεδο που παραχώρησε η Ελληνορθόδοξη Κοινότητα Γαλατά, χάρη στη γενναιόδωρη δωρεά της μεγάλης ευεργέτιδας Ελένης Ζαρίφη.',
    'home.history_p2':
        'Η Σχολή εγκαινιάστηκε στις 2 Ιουνίου 1910. Το κτίριο ανεγέρθηκε σε σχέδια των αρχιτεκτόνων Πατρόκλου Καμπανάκη και Σταύρου Χρηστίδη, με τη συμβολή του Περικλή Φωτιάδη ως συμβούλου αρχιτέκτονα, στον νεοκλασικό-εκλεκτικιστικό ρυθμό της εποχής.',
    'history.hero_title': '140 Χρόνια Ιστορίας',
    'history.hero_title1': '140 Χρόνια',
    'history.hero_title2': 'Ιστορίας',
    'history.hero_subtitle':
        '140 χρόνια νεοκλασικής αρχιτεκτονικής, εκπαιδευτικής παράδοσης και πολιτιστικής δημιουργίας στην καρδιά του Γαλατά.',
    'history.tarihce_p1':
        'Η Αστική Σχολή Γαλατά συγκαταλέγεται στα σημαντικότερα εκπαιδευτικά καθιδρύματα που ίδρυσε η ομογένεια κατά την περίοδο του εκσυγχρονισμού της Οθωμανικής Αυτοκρατορίας. Το διδακτήριο ανεγέρθηκε σε οικόπεδο που παραχώρησε η Ελληνορθόδοξη Κοινότητα Γαλατά, χάρη στη γενναιόδωρη χορηγία της μεγάλης ευεργέτιδας Ελένης Ζαρίφη, με σκοπό να συμβάλει στη σύγχρονη παιδεία και διαπαιδαγώγηση των Ελληνοπαίδων.',
    'history.tarihce_p2':
        'Αρχιτέκτονες της Σχολής υπήρξαν ο Πάτροκλος Καμπανάκης και ο Σταύρος Χρηστίδης, ενώ ο Περικλής Φωτιάδης διετέλεσε σύμβουλος αρχιτέκτονας του έργου. Τα επίσημα εγκαίνια της Σχολής τελέστηκαν την Τετάρτη 2 Ιουνίου 1910 και ώρα 11:00 π.μ.',
    'history.middle_title':
        'Κτισμένη στον νεοκλασικό-εκλεκτικιστικό αρχιτεκτονικό ρυθμό της εποχής, η Σχολή δεσπόζει στον Γαλατά — το ιστορικό εμπορικό και χρηματοοικονομικό κέντρο της Κωνσταντινούπολης — στη συμβολή των συνοικιών Κεμεραλτί και Μπερεκετζαντέ.',
    'history.middle_subtitle':
        'Το ιστορικό διδακτήριο, που κάποτε αντηχούσε από παιδικές φωνές αλλά παρέμεινε σιωπηλό επί σειρά ετών, αποδόθηκε εκ νέου στην Ελληνορθόδοξη Κοινότητα της Κωνσταντινούπολης το 2012.',
    'history.restoration_p1':
        'Η αποκατάσταση του κτιρίου πραγματοποιήθηκε υπό την αιγίδα της Α.Θ.Π. του Οικουμενικού Πατριάρχου κ.κ. Βαρθολομαίου, χάρη στην ευγενική και γενναιόδωρη χορηγία της Μαρίνας και του Αθανασίου Μαρτίνου, με την πολύτιμη συμβολή και τον συντονισμό του αρχιτέκτονα κ. Murat Tabanlıoğlu (Tabanlıoğlu Architects), του καθηγητή κ. Γεωργίου Πενέλη και του Δρος κ. Γρηγορίου Πενέλη (Penelis Consulting Engineers S.A.), καθώς και της κατασκευαστικής εταιρείας Ark İnşaat, διαφυλάσσοντας με απόλυτη πιστότητα και επιμέλεια την αυθεντική αρχιτεκτονική φυσιογνωμία της Σχολής.',
    'history.restoration_p2':
        'Η Αστική Σχολή Γαλατά, με τη νέα θεσμική της επωνυμία «Η Σχολή», φιλοδοξεί αφενός να παραμείνει θεματοφύλακας της ρωμαίικης ταυτότητας και της πολιτιστικής της κληρονομιάς, διατηρώντας ζωντανή την ιστορική της μνήμη, και αφετέρου να λειτουργήσει ως μια ανοιχτή εστία τέχνης και παιδείας που αγκαλιάζει όλους τους κατοίκους της Κωνσταντινούπολης με βλέμμα στραμμένο στο μέλλον.',
    'archive.hero_title': 'Αρχειακή Συλλογή',
    'archive.qa_section_key':
        'Εξερευνήστε τα ιστορικά έγγραφα, τις φωτογραφίες και τα κειμήλια της Αστικής Σχολής Γαλατά.',
    'venue.hero_title': 'Ενοικίαση Χώρου',
    'venue.hero_subtitle':
        'Φιλοξενήστε την εκδήλωσή σας σε έναν ιστορικό χώρο. Μοναδική ατμόσφαιρα και σύγχρονη υποδομή.',
    'past_events.hero_description':
        'Η Αστική Σχολή Γαλατά – Πολιτιστικό Κέντρο φιλοξενεί ένα εκλεκτό πρόγραμμα εκδηλώσεων — από διεθνείς εικαστικές διοργανώσεις, όπως η Μπιενάλε της Κωνσταντινούπολης και το 212 Photography Istanbul, έως συναυλίες, συμπόσια αρχιτεκτονικής και λογοτεχνίας, παρουσιάσεις και ειδικές δεξιώσεις.',
};

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
                const curatedEl = CURATED_CMS_EL_OVERRIDES[`${pageKey}.${row.section_key}`];
                if (pageKey === 'history') {
                    const normalize140 = (val: string | null | undefined) =>
                        typeof val === 'string'
                            ? val
                                  .replace(/\b120(\s*(?:Yıllık|yılı|Years|years|Χρόνια|χρόνια))/g, '140$1')
                            : val;
                    const stripDuplicateSecondParagraph = (val: string | null | undefined) =>
                        typeof val === 'string' && row.section_key === 'restoration_p1'
                            ? val.split(/\n\s*\n/)[0].trim()
                            : val;
                    const normalizeTrHistory = (val: string | null | undefined) =>
                        typeof val === 'string'
                            ? stripDuplicateSecondParagraph(normalize140(val))!
                                  .replace(
                                      /Saygıdeğer\s+Ekümenik\s+Patrik\s+I\.\s*Bartholomeos['’]un|Ekümenik\s+Patrik\s+Hazretleri\s+I\.\s*Bartholomeos['’]un|Ekümenik\s+Patrik\s+I\.\s*Bartholomeos['’]un/g,
                                      'Patrik Hazretlerinin'
                                  )
                                  .replace(/sahiplerine iade edilmiştir/g, "İstanbul Rum Cemaati'ne iade edilmiştir")
                            : val;
                    const normalizeEnHistory = (val: string | null | undefined) =>
                        typeof val === 'string'
                            ? stripDuplicateSecondParagraph(normalize140(val))
                            : val;
                    const normalizeElHistory = (val: string | null | undefined) =>
                        curatedEl ||
                        (typeof val === 'string'
                            ? stripDuplicateSecondParagraph(normalize140(val))!
                                  .replace(/χάρις στη ευγενική/g, 'χάρη στην ευγενική')
                                  .replace(/και της εταιρεία Ark İnşaat/g, 'και της εταιρείας Ark İnşaat')
                                  .replace(/«Το Σχολείο»/g, '«Η Σχολή»')
                            : val);
                    map[row.section_key] = {
                        ...row,
                        content_tr: normalizeTrHistory(row.content_tr),
                        content_en: normalizeEnHistory(row.content_en),
                        content_el: normalizeElHistory(row.content_el),
                    };
                } else {
                    map[row.section_key] = {
                        ...row,
                        content_el: curatedEl || row.content_el,
                    };
                }
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
        const l = lang as 'tr' | 'en' | 'el';
        if (l === 'el') {
            const curatedEl = CURATED_CMS_EL_OVERRIDES[`${pageKey}.${sectionKey}`];
            if (curatedEl) return curatedEl;
        }
        const row = rows[sectionKey];
        if (!row) return fallback;
        return row[`content_${l}`] || row.content_en || fallback;
    };

    return { get, loading, hasData: Object.keys(rows).length > 0 };
}
