/**
 * ============================================================================
 * SUPABASE EDGE FUNCTION: notify-inquiry
 * ============================================================================
 * Server-side email notification dispatcher for `venue_inquiries` and
 * `archive_inquiries`. Runs on Deno Edge Runtime; never exposes API keys
 * in the client bundle.
 *
 * Required Production Secrets (set via `supabase secrets set`):
 * - RESEND_API_KEY: Server-side API key for Resend (or SMTP relay)
 * - NOTIFICATION_TO_EMAIL: Recipient address (default: info@galatarumokulu.org)
 * - NOTIFICATION_FROM_EMAIL: Verified sender (e.g. bildirim@galatarumokulu.org)
 * ============================================================================
 */

const corsHeaders = {
    'Access-Control-Allow-Origin': 'https://galatarumokulu.org',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface NotificationRequest {
    type: 'venue_inquiry' | 'archive_inquiry';
    locale?: 'tr' | 'en' | 'el';
    fullName: string;
    email: string;
    phone?: string;
    company?: string | null;
    eventType?: string | null;
    guestCount?: string | null;
    preferredLevels?: string[];
    proposedDate?: string | null;
    artifactId?: string;
    artifactTitle?: string;
    collectionNo?: string;
    institution?: string | null;
}

Deno.serve(async (req: Request) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
            status: 405,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }

    try {
        const body = (await req.json()) as NotificationRequest;
        if (!body.fullName || !body.email || !body.type) {
            return new Response(JSON.stringify({ error: 'Missing required fields' }), {
                status: 400,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
        }

        const resendApiKey = Deno.env.get('RESEND_API_KEY');
        const toEmail = Deno.env.get('NOTIFICATION_TO_EMAIL') || 'info@galatarumokulu.org';
        const fromEmail = Deno.env.get('NOTIFICATION_FROM_EMAIL') || 'Galata Rum Okulu <bildirim@galatarumokulu.org>';

        // Dry-run / non-production safety guard: never send live external emails if key is not configured
        if (!resendApiKey || Deno.env.get('DRY_RUN_NOTIFICATIONS') === 'true') {
            return new Response(
                JSON.stringify({
                    dispatched: false,
                    mode: 'dry_run_no_external_email',
                    message: 'Notification logged in dry-run mode (no external email sent).',
                }),
                {
                    status: 202,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                }
            );
        }

        const subject =
            body.type === 'venue_inquiry'
                ? `[Mekan Talebi] ${body.fullName}${body.company ? ` — ${body.company}` : ''}`
                : `[Arşiv İnceleme Talebi] ${body.artifactTitle || body.artifactId} — ${body.fullName}`;

        const textLines =
            body.type === 'venue_inquiry'
                ? [
                      'Galata Rum Okulu — Yeni Mekan Kiralama / Etkinlik Talebi',
                      '--------------------------------------------------------',
                      `Ad Soyad: ${body.fullName}`,
                      `E-posta: ${body.email}`,
                      `Telefon: ${body.phone || '-'}`,
                      `Kurum: ${body.company || '-'}`,
                      `Etkinlik Türü: ${body.eventType || '-'}`,
                      `Katılımcı Sayısı: ${body.guestCount || '-'}`,
                      `Tercih Edilen Katlar: ${(body.preferredLevels || []).join(', ') || '-'}`,
                      `Planlanan Tarih: ${body.proposedDate || '-'}`,
                      `Dil (Locale): ${body.locale || 'tr'}`,
                  ]
                : [
                      'Galata Rum Okulu — Yeni Akademik Arşiv İnceleme Talebi',
                      '------------------------------------------------------',
                      `Eser: ${body.artifactTitle || '-'} (${body.collectionNo || body.artifactId || '-'})`,
                      `Ad Soyad: ${body.fullName}`,
                      `E-posta: ${body.email}`,
                      `Kurum / Üniversite: ${body.institution || '-'}`,
                      `Dil (Locale): ${body.locale || 'tr'}`,
                  ];

        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${resendApiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from: fromEmail,
                to: [toEmail],
                reply_to: body.email,
                subject,
                text: textLines.join('\n'),
            }),
        });

        if (!response.ok) {
            return new Response(
                JSON.stringify({
                    dispatched: false,
                    error: `Email provider returned HTTP ${response.status}`,
                }),
                {
                    status: 502,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                }
            );
        }

        return new Response(JSON.stringify({ dispatched: true }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    } catch (err) {
        return new Response(
            JSON.stringify({
                dispatched: false,
                error: err instanceof Error ? err.message : 'Unexpected notification error',
            }),
            {
                status: 500,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
        );
    }
});
