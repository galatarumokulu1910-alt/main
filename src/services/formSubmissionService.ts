import { supabase } from './supabaseClient';
import type { SupportedLocale } from '../config/venueInfo';

export interface VenueInquiryPayload {
    fullName: string;
    email: string;
    phone: string;
    company?: string;
    eventType?: string;
    guestCount?: string;
    preferredLevels: string[];
    proposedDate?: string;
    alternativeDates?: string;
    techRequirements: string[];
    message?: string;
    locale: SupportedLocale;
    consentAccepted: boolean;
    honeypot?: string;
}

export interface ArchiveStudyInquiryPayload {
    artifactId: string;
    artifactTitle: string;
    collectionNo: string;
    fullName: string;
    email: string;
    institution?: string;
    message?: string;
    purpose?: string;
    locale: SupportedLocale;
    consentAccepted: boolean;
    honeypot?: string;
}

export interface NewsletterSubscriptionPayload {
    email: string;
    locale: SupportedLocale;
    consentAccepted: boolean;
    honeypot?: string;
}

export type SubmissionResultCode =
    | 'PERSISTED'
    | 'ALREADY_SUBSCRIBED'
    | 'VALIDATION_ERROR'
    | 'CONSENT_REQUIRED'
    | 'RATE_LIMITED'
    | 'BOT_REJECTED'
    | 'BACKEND_UNAVAILABLE'
    | 'RLS_OR_DB_ERROR';

export interface SubmissionResult {
    ok: boolean;
    code: SubmissionResultCode;
    persisted: boolean;
    notificationDispatched?: boolean;
    errorMessage?: string;
    message: Record<SupportedLocale, string>;
}

export interface PersistenceBackendAdapter {
    insertRow: (
        table: 'venue_inquiries' | 'archive_inquiries' | 'newsletter_subscribers',
        row: Record<string, unknown>
    ) => Promise<{ error: { code?: string; message?: string } | null }>;
    invokeNotification?: (
        payload: Record<string, unknown>
    ) => Promise<{ error: { message?: string } | null }>;
}

declare global {
    interface Window {
        __GALATA_TEST_DB_ADAPTER__?: PersistenceBackendAdapter;
    }
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_REGEX = /^[+\d()\s-]{6,40}$/;

const submissionTimestamps: Record<string, number> = {};
const DEFAULT_COOLDOWN_MS = 4000;

export function resetRateLimiterForTests() {
    for (const key of Object.keys(submissionTimestamps)) {
        delete submissionTimestamps[key];
    }
}

function checkRateLimit(formKey: string, cooldownMs = DEFAULT_COOLDOWN_MS): boolean {
    const now = Date.now();
    const last = submissionTimestamps[formKey] || 0;
    if (now - last < cooldownMs) {
        return false;
    }
    submissionTimestamps[formKey] = now;
    return true;
}

const ENABLE_EMAIL_NOTIFICATIONS = import.meta.env?.VITE_ENABLE_EMAIL_NOTIFICATIONS !== 'false';
const INFO_RECIPIENT_EMAIL = 'info@galatarumokulu.org';

const LEVEL_LABELS_TR: Record<string, string> = {
    level1: 'Kat 1 — Çok Amaçlı Büyük Salon & Fuaye (227 + 100 m²)',
    level2: 'Kat 2 — 3 Sergi Salonu, Fuaye & Balkon (275 m²)',
    level3: 'Kat 3 — 9 Sergi Salonu & Fuaye (458 m²)',
    level4: 'Tüm Etkinlik Katları (Kat 1, 2 ve 3 — 1.060 m²)',
};

function buildFormattedEmailTablePayload(payload: Record<string, unknown>): Record<string, string> {
    const type = String(payload.type || '');
    const locale = String(payload.locale || 'tr').toUpperCase();
    const submittedAt = new Date().toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' });

    if (type === 'venue_inquiry') {
        const fullName = String(payload.fullName || '-');
        const company = payload.company ? String(payload.company) : '';
        const email = String(payload.email || '-');
        const levels = Array.isArray(payload.preferredLevels)
            ? payload.preferredLevels.map(l => LEVEL_LABELS_TR[String(l)] || String(l)).join(' | ')
            : '-';
        const techs = Array.isArray(payload.techRequirements) ? payload.techRequirements.join(', ') : '-';

        return {
            _subject: `[Galata Rum Okulu — Mekan Kiralama Talebi] ${fullName}${company ? ` (${company})` : ''}`,
            _template: 'table',
            _captcha: 'false',
            _replyto: email,
            'Başvuru Türü': 'Mekan Kiralama & İletişim Talebi',
            'Gönderim Zamanı': submittedAt,
            'Ad Soyad': fullName,
            'Kurum / Şirket': company || 'Belirtilmedi',
            'E-posta Adresi': email,
            'Telefon Numarası': String(payload.phone || '-'),
            'Etkinlik Türü': String(payload.eventType || 'Belirtilmedi'),
            'Katılımcı Sayısı': String(payload.guestCount || 'Belirtilmedi'),
            'Tercih Edilen Katlar': levels || 'Belirtilmedi',
            'Planlanan Tarih': String(payload.proposedDate || 'Belirtilmedi'),
            'Alternatif Tarihler': String(payload.alternativeDates || 'Belirtilmedi'),
            'Teknik Gereksinimler': techs || 'Belirtilmedi',
            'Proje Detayları & Mesaj': String(payload.message || 'Belirtilmedi'),
            'Form Dili': locale,
            'Yönetim Paneli': 'https://galatarumokulu.org/admin',
        };
    }

    if (type === 'archive_inquiry') {
        const fullName = String(payload.fullName || '-');
        const email = String(payload.email || '-');
        const artifactTitle = String(payload.artifactTitle || payload.artifactId || '-');

        return {
            _subject: `[Galata Rum Okulu — Arşiv İnceleme Talebi] ${artifactTitle} — ${fullName}`,
            _template: 'table',
            _captcha: 'false',
            _replyto: email,
            'Başvuru Türü': 'Akademik Arşiv İnceleme Talebi',
            'Gönderim Zamanı': submittedAt,
            'Talep Edilen Eser': artifactTitle,
            'Koleksiyon / Eser No': String(payload.collectionNo || payload.artifactId || '-'),
            'Ad Soyad': fullName,
            'Kurum / Üniversite': String(payload.institution || 'Belirtilmedi'),
            'E-posta Adresi': email,
            'Araştırma Amacı & Mesaj': String(payload.message || '-'),
            'Form Dili': locale,
            'Yönetim Paneli': 'https://galatarumokulu.org/admin',
        };
    }

    const email = String(payload.email || '-');
    return {
        _subject: `[Galata Rum Okulu — Yeni E-Bülten Abonesi] ${email}`,
        _template: 'table',
        _captcha: 'false',
        _replyto: email,
        'Başvuru Türü': 'E-Bülten Aboneliği',
        'Gönderim Zamanı': submittedAt,
        'Abone E-posta Adresi': email,
        'Form Dili': locale,
        'Yönetim Paneli': 'https://galatarumokulu.org/admin',
    };
}

const defaultSupabaseAdapter: PersistenceBackendAdapter = {
    async insertRow(table, row) {
        const { error } = await supabase.from(table).insert(row);
        return { error };
    },
    async invokeNotification(payload) {
        if (!ENABLE_EMAIL_NOTIFICATIONS) {
            return { error: { message: 'EMAIL_GATE_DEFERRED_BY_OWNER' } };
        }
        try {
            const formattedTableBody = buildFormattedEmailTablePayload(payload);
            const response = await fetch(`https://formsubmit.co/ajax/${INFO_RECIPIENT_EMAIL}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify(formattedTableBody),
            });

            if (response.ok) {
                return { error: null };
            }

            const { error } = await supabase.functions.invoke('notify-inquiry', {
                body: payload,
            });
            return { error };
        } catch (err) {
            return { error: { message: err instanceof Error ? err.message : 'Notification dispatch failed' } };
        }
    },
};

const RESULT_MESSAGES: Record<SubmissionResultCode, Record<SupportedLocale, string>> = {
    PERSISTED: {
        tr: 'Talebiniz başarıyla kaydedildi. Ekibimiz en kısa sürede sizinle iletişime geçecektir.',
        en: 'Your inquiry has been securely saved. Our team will contact you shortly.',
        el: 'Το αίτημά σας καταχωρήθηκε επιτυχώς. Η ομάδα μας θα επικοινωνήσει μαζί σας σύντομα.',
    },
    ALREADY_SUBSCRIBED: {
        tr: 'Bu e-posta adresi bülten listemizde zaten kayıtlıdır.',
        en: 'This email address is already registered on our mailing list.',
        el: 'Αυτή η διεύθυνση email είναι ήδη εγγεγραμμένη στη λίστα ενημερώσεών μας.',
    },
    VALIDATION_ERROR: {
        tr: 'Lütfen tüm zorunlu alanları ve e-posta/telefon formatını kontrol ediniz.',
        en: 'Please verify all required fields and your email/telephone format.',
        el: 'Παρακαλούμε ελέγξτε όλα τα υποχρεωτικά πεδία και τη μορφή email/τηλεφώνου.',
    },
    CONSENT_REQUIRED: {
        tr: 'Devam etmek için KVKK ve Gizlilik Politikası onay kutusunu işaretlemeniz gerekmektedir.',
        en: 'Please accept the KVKK and Privacy Policy consent checkbox to proceed.',
        el: 'Παρακαλούμε αποδεχθείτε τους όρους προστασίας δεδομένων (KVKK) για να συνεχίσετε.',
    },
    RATE_LIMITED: {
        tr: 'Çok sık gönderim yapıldı. Lütfen birkaç saniye bekleyip tekrar deneyiniz.',
        en: 'Too many attempts in a short time. Please wait a few seconds and try again.',
        el: 'Πολλές προσπάθειες σε σύντομο χρόνο. Παρακαλούμε περιμένετε λίγα δευτερόλεπτα.',
    },
    BOT_REJECTED: {
        tr: 'Güvenlik doğrulaması başarısız oldu.',
        en: 'Automated spam protection check failed.',
        el: 'Ο έλεγχος ασφαλείας απέτυχε.',
    },
    BACKEND_UNAVAILABLE: {
        tr: 'Başvuru veritabanı şu anda bakım/kurulum aşamasındadır; talebiniz otomatik olarak kaydedilemedi. Form bilgileriniz korunmuştur; e-posta uygulamanızda manuel gönderim taslağı açmak veya telefonla ulaşmak için:',
        en: 'The inquiry database is currently undergoing maintenance; your request was not automatically saved. Your form entries are preserved; to open a manual email draft in your mail client or call us directly:',
        el: 'Η βάση δεδομένων αιτημάτων βρίσκεται υπό συντήρηση· το αίτημά σας δεν αποθηκεύτηκε αυτόματα. Για να ανοίξετε χειροκίνητο πρόχειρο email ή να καλέσετε:',
    },
    RLS_OR_DB_ERROR: {
        tr: 'Talebiniz teknik bir hata nedeniyle otomatik kaydedilemedi. Lütfen tekrar deneyin veya e-posta uygulamanızda manuel taslak açarak bize ulaşın:',
        en: 'Your inquiry could not be automatically saved due to a technical error. Please retry or open a manual email draft in your mail client:',
        el: 'Το αίτημά σας δεν αποθηκεύτηκε αυτόματα λόγω τεχνικού σφάλματος. Δοκιμάστε ξανά ή στείλτε χειροκίνητο email:',
    },
};

function makeResult(
    ok: boolean,
    code: SubmissionResultCode,
    persisted: boolean,
    extra?: { notificationDispatched?: boolean; errorMessage?: string }
): SubmissionResult {
    return {
        ok,
        code,
        persisted,
        message: RESULT_MESSAGES[code],
        ...extra,
    };
}

function getActiveAdapter(customAdapter?: PersistenceBackendAdapter): PersistenceBackendAdapter {
    if (customAdapter) return customAdapter;
    if (typeof window !== 'undefined' && window.__GALATA_TEST_DB_ADAPTER__) {
        return window.__GALATA_TEST_DB_ADAPTER__;
    }
    return defaultSupabaseAdapter;
}

/**
 * Submits a MICE / Venue Inquiry to `public.venue_inquiries`.
 * NEVER swallows PGRST205 or 42P01 missing-table errors as success.
 * Returns `ok: true, persisted: true` ONLY after confirmed database insert.
 */
export async function submitVenueInquiry(
    payload: VenueInquiryPayload,
    customAdapter?: PersistenceBackendAdapter
): Promise<SubmissionResult> {
    if (payload.honeypot && payload.honeypot.trim().length > 0) {
        return makeResult(false, 'BOT_REJECTED', false, { errorMessage: 'Spam check triggered.' });
    }

    if (!payload.consentAccepted) {
        return makeResult(false, 'CONSENT_REQUIRED', false, { errorMessage: 'KVKK consent is required.' });
    }

    const fullName = payload.fullName.trim();
    const email = payload.email.trim().toLowerCase();
    const phone = payload.phone.trim();

    if (fullName.length < 2 || fullName.length > 200) {
        return makeResult(false, 'VALIDATION_ERROR', false, { errorMessage: 'Invalid full name.' });
    }
    if (!EMAIL_REGEX.test(email) || email.length > 320) {
        return makeResult(false, 'VALIDATION_ERROR', false, { errorMessage: 'Invalid email address.' });
    }
    if (!PHONE_REGEX.test(phone) || phone.length > 50) {
        return makeResult(false, 'VALIDATION_ERROR', false, { errorMessage: 'Invalid phone number.' });
    }

    if (!checkRateLimit(`venue:${email}`)) {
        return makeResult(false, 'RATE_LIMITED', false, { errorMessage: 'Please wait before retrying.' });
    }

    const adapter = getActiveAdapter(customAdapter);
    const cleanText = (v?: string) => (v && v.trim().length > 0 ? v.trim() : null);

    const dbRow = {
        full_name: fullName,
        email,
        phone,
        company: cleanText(payload.company),
        event_type: cleanText(payload.eventType),
        guest_count: cleanText(payload.guestCount),
        preferred_levels: payload.preferredLevels.slice(0, 20),
        proposed_date: payload.proposedDate || null,
        alternative_dates: cleanText(payload.alternativeDates),
        tech_requirements: payload.techRequirements.slice(0, 20),
        message: cleanText(payload.message),
        locale: payload.locale,
        consent_accepted: true,
    };

    const { error } = await adapter.insertRow('venue_inquiries', dbRow);

    if (error) {
        // Reset client-side rate limit timestamp so retries or server-side rate-limit tests reach the adapter
        delete submissionTimestamps[`venue:${email}`];

        if (error.code === 'P0001' || (error.message && error.message.includes('RATE_LIMIT_EXCEEDED'))) {
            return makeResult(false, 'RATE_LIMITED', false, { errorMessage: error.message });
        }

        const isMissingTable =
            error.code === 'PGRST205' ||
            error.code === '42P01' ||
            Boolean(error.message && error.message.includes('venue_inquiries'));

        return makeResult(
            false,
            isMissingTable ? 'BACKEND_UNAVAILABLE' : 'RLS_OR_DB_ERROR',
            false,
            { errorMessage: error.message || 'Database insert failed.' }
        );
    }

    // Independent non-blocking server-side notification dispatch
    let notificationDispatched = false;
    if (adapter.invokeNotification) {
        const notifyRes = await adapter.invokeNotification({
            type: 'venue_inquiry',
            locale: payload.locale,
            fullName,
            email,
            phone,
            company: cleanText(payload.company),
            eventType: cleanText(payload.eventType),
            guestCount: cleanText(payload.guestCount),
            preferredLevels: dbRow.preferred_levels,
            proposedDate: dbRow.proposed_date,
            alternativeDates: dbRow.alternative_dates,
            techRequirements: dbRow.tech_requirements,
            message: dbRow.message,
        });
        notificationDispatched = !notifyRes.error;
    }

    return makeResult(true, 'PERSISTED', true, { notificationDispatched });
}

/**
 * Submits an Academic Archive Study Inquiry to `public.archive_inquiries`.
 * Never returns success unless the row is actually persisted.
 */
export async function submitArchiveStudyInquiry(
    payload: ArchiveStudyInquiryPayload,
    customAdapter?: PersistenceBackendAdapter
): Promise<SubmissionResult> {
    if (payload.honeypot && payload.honeypot.trim().length > 0) {
        return makeResult(false, 'BOT_REJECTED', false, { errorMessage: 'Spam check triggered.' });
    }

    if (!payload.consentAccepted) {
        return makeResult(false, 'CONSENT_REQUIRED', false, { errorMessage: 'KVKK consent is required.' });
    }

    const fullName = payload.fullName.trim();
    const email = payload.email.trim().toLowerCase();
    const message = (payload.message ?? payload.purpose ?? '').trim();

    if (fullName.length < 2 || fullName.length > 200) {
        return makeResult(false, 'VALIDATION_ERROR', false, { errorMessage: 'Invalid full name.' });
    }
    if (!EMAIL_REGEX.test(email) || email.length > 320) {
        return makeResult(false, 'VALIDATION_ERROR', false, { errorMessage: 'Invalid email address.' });
    }
    if (message.length < 5 || message.length > 5000) {
        return makeResult(false, 'VALIDATION_ERROR', false, { errorMessage: 'Invalid study purpose.' });
    }

    if (!checkRateLimit(`archive:${email}:${payload.artifactId}`)) {
        return makeResult(false, 'RATE_LIMITED', false, { errorMessage: 'Please wait before retrying.' });
    }

    const adapter = getActiveAdapter(customAdapter);
    const dbRow = {
        artifact_id: payload.artifactId,
        artifact_title: payload.artifactTitle.slice(0, 300),
        collection_no: payload.collectionNo.slice(0, 100),
        full_name: fullName,
        email,
        institution: payload.institution?.trim() ? payload.institution.trim().slice(0, 200) : null,
        message,
        locale: payload.locale,
        consent_accepted: true,
    };

    const { error } = await adapter.insertRow('archive_inquiries', dbRow);

    if (error) {
        if (error.code === 'P0001' || (error.message && error.message.includes('RATE_LIMIT_EXCEEDED'))) {
            return makeResult(false, 'RATE_LIMITED', false, { errorMessage: error.message });
        }

        delete submissionTimestamps[`archive:${email}:${payload.artifactId}`];
        const isMissingTable =
            error.code === 'PGRST205' ||
            error.code === '42P01' ||
            Boolean(error.message && error.message.includes('archive_inquiries'));

        return makeResult(
            false,
            isMissingTable ? 'BACKEND_UNAVAILABLE' : 'RLS_OR_DB_ERROR',
            false,
            { errorMessage: error.message || 'Database insert failed.' }
        );
    }

    let notificationDispatched = false;
    if (adapter.invokeNotification) {
        const notifyRes = await adapter.invokeNotification({
            type: 'archive_inquiry',
            locale: payload.locale,
            artifactId: payload.artifactId,
            artifactTitle: payload.artifactTitle,
            collectionNo: payload.collectionNo,
            fullName,
            email,
            institution: dbRow.institution,
            message: dbRow.message,
        });
        notificationDispatched = !notifyRes.error;
    }

    return makeResult(true, 'PERSISTED', true, { notificationDispatched });
}

/**
 * Submits a Newsletter Subscription to `public.newsletter_subscribers`.
 * Handles unique email constraint (23505) gracefully as ALREADY_SUBSCRIBED.
 * Never returns success if the table is missing or insert fails.
 */
export async function submitNewsletterSubscription(
    payload: NewsletterSubscriptionPayload,
    customAdapter?: PersistenceBackendAdapter
): Promise<SubmissionResult> {
    if (payload.honeypot && payload.honeypot.trim().length > 0) {
        return makeResult(false, 'BOT_REJECTED', false, { errorMessage: 'Spam check triggered.' });
    }

    if (!payload.consentAccepted) {
        return makeResult(false, 'CONSENT_REQUIRED', false, { errorMessage: 'Privacy consent is required.' });
    }

    const email = payload.email.trim().toLowerCase();
    if (!EMAIL_REGEX.test(email) || email.length > 320) {
        return makeResult(false, 'VALIDATION_ERROR', false, { errorMessage: 'Invalid email address.' });
    }

    if (!checkRateLimit(`newsletter:${email}`)) {
        return makeResult(false, 'RATE_LIMITED', false, { errorMessage: 'Please wait before retrying.' });
    }

    const adapter = getActiveAdapter(customAdapter);
    const dbRow = {
        email,
        locale: payload.locale,
        consent_accepted: true,
        status: 'pending_confirmation',
    };

    const { error } = await adapter.insertRow('newsletter_subscribers', dbRow);

    if (error) {
        if (error.code === '23505') {
            return makeResult(true, 'ALREADY_SUBSCRIBED', true);
        }
        if (error.code === 'P0001' || (error.message && error.message.includes('RATE_LIMIT_EXCEEDED'))) {
            return makeResult(false, 'RATE_LIMITED', false, { errorMessage: error.message });
        }

        delete submissionTimestamps[`newsletter:${email}`];
        const isMissingTable =
            error.code === 'PGRST205' ||
            error.code === '42P01' ||
            Boolean(error.message && error.message.includes('newsletter_subscribers'));

        return makeResult(
            false,
            isMissingTable ? 'BACKEND_UNAVAILABLE' : 'RLS_OR_DB_ERROR',
            false,
            { errorMessage: error.message || 'Subscription could not be saved.' }
        );
    }

    let notificationDispatched = false;
    if (adapter.invokeNotification) {
        const notifyRes = await adapter.invokeNotification({
            type: 'newsletter_subscription',
            locale: payload.locale,
            email,
        });
        notificationDispatched = !notifyRes.error;
    }

    return makeResult(true, 'PERSISTED', true, { notificationDispatched });
}
