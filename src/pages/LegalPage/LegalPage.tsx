import { Link } from 'react-router-dom';
import { useI18n } from '../../i18n/I18nContext';
import SEO from '../../components/SEO/SEO';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';

type LegalDocType = 'kvkk' | 'privacy' | 'cookies';

const LEGAL_CONTENT: Record<LegalDocType, {
    title: Record<'tr' | 'en' | 'el', string>;
    subtitle: Record<'tr' | 'en' | 'el', string>;
    sections: Array<{
        heading: Record<'tr' | 'en' | 'el', string>;
        body: Record<'tr' | 'en' | 'el', string>;
    }>;
}> = {
    kvkk: {
        title: {
            tr: 'KVKK Aydınlatma Metni',
            en: 'PDPL (KVKK) Disclosure Text',
            el: 'Ενημερωτικό Κείμενο Προστασίας Δεδομένων (KVKK)',
        },
        subtitle: {
            tr: '6698 Sayılı Kişisel Verilerin Korunması Kanunu kapsamında Galata Rum Okulu Vakfı - Kültür Merkezi bilgilendirme metni.',
            en: 'Information notice by the Galata Greek School Foundation - Cultural Center under Turkish Personal Data Protection Law No. 6698.',
            el: 'Ενημέρωση από το Ίδρυμα Ελληνικού Σχολείου Γαλατά - Πολιτιστικό Κέντρο σύμφωνα με τον Νόμο 6698 περί Προστασίας Δεδομένων.',
        },
        sections: [
            {
                heading: {
                    tr: '1. Veri Sorumlusu',
                    en: '1. Data Controller',
                    el: '1. Υπεύθυνος Επεξεργασίας Δεδομένων',
                },
                body: {
                    tr: '6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) uyarınca kişisel verileriniz; veri sorumlusu olarak Galata Rum Okulu Vakfı - Kültür Merkezi (Kemankeş Karamustafa Paşa, Kemeraltı Cd. No:49, 34425 Beyoğlu / İstanbul) tarafından aşağıda açıklanan kapsamda işlenmektedir.',
                    en: 'In accordance with the Law on the Protection of Personal Data No. 6698 ("KVKK"), your personal data is processed by Galata Greek School Foundation - Cultural Center (Kemankeş Karamustafa Paşa, Kemeraltı Cd. No:49, 34425 Beyoğlu / Istanbul) as the data controller.',
                    el: 'Σύμφωνα με τον Νόμο περί Προστασίας Δεδομένων Προσωπικού Χαρακτήρα αριθ. 6698 («KVKK»), τα προσωπικά σας δεδομένα υποβάλλονται σε επεξεργασία από το Ίδρυμα Ελληνικού Σχολείου Γαλατά - Πολιτιστικό Κέντρο.',
                },
            },
            {
                heading: {
                    tr: '2. Kişisel Verilerin İşlenme Amaçları',
                    en: '2. Purposes of Processing Personal Data',
                    el: '2. Σκοποί Επεξεργασίας Προσωπικών Δεδομένων',
                },
                body: {
                    tr: 'İletişim formları, bülten aboneliği ve mekan talebi başvuruları aracılığıyla paylaşılan ad-soyad, e-posta, telefon ve kurum bilgileriniz; yalnızca kültür-sanat etkinlikleri hakkında bilgilendirme yapılması, mekan ve işbirliği taleplerinizin yanıtlanması ve yasal yükümlülüklerin yerine getirilmesi amacıyla işlenir.',
                    en: 'Name, email, telephone, and organization details shared via contact forms, newsletter subscriptions, and venue inquiries are processed solely to respond to your inquiries, share updates on cultural events, and fulfill legal obligations.',
                    el: 'Τα στοιχεία ονόματος, email, τηλεφώνου και φορέα που κοινοποιούνται μέσω των φορμών επικοινωνίας χρησιμοποιούνται αποκλειστικά για την απάντηση στα αιτήματά σας και την ενημέρωση για πολιτιστικές εκδηλώσεις.',
                },
            },
            {
                heading: {
                    tr: '3. İlgili Kişinin Hakları ve Başvuru',
                    en: '3. Rights of the Data Subject & Contact',
                    el: '3. Δικαιώματα Υποκειμένου & Επικοινωνία',
                },
                body: {
                    tr: 'KVKK’nın 11. maddesi kapsamındaki taleplerinizi info@galatarumokulu.org e-posta adresine veya yazılı olarak vakıf adresimize iletebilirsiniz.',
                    en: 'You may submit your requests under Article 11 of the KVKK via email to info@galatarumokulu.org or in writing to our foundation address.',
                    el: 'Μπορείτε να υποβάλετε τα αιτήματά σας σύμφωνα με το Άρθρο 11 του KVKK στο info@galatarumokulu.org.',
                },
            },
        ],
    },
    privacy: {
        title: {
            tr: 'Gizlilik Politikası',
            en: 'Privacy Policy',
            el: 'Πολιτική Απορρήτου',
        },
        subtitle: {
            tr: 'Ziyaretçi bilgilerinizin güvenliği, dijital arşiv kullanımı ve gizlilik ilkelerimiz.',
            en: 'Our principles regarding visitor data security, digital archive usage, and privacy.',
            el: 'Οι αρχές μας σχετικά με την ασφάλεια των δεδομένων επισκεπτών και τη χρήση του ψηφιακού αρχείου.',
        },
        sections: [
            {
                heading: {
                    tr: '1. Bilgi Güvenliği ve Gizlilik',
                    en: '1. Information Security & Privacy',
                    el: '1. Ασφάλεια Πληροφοριών & Απόρρητο',
                },
                body: {
                    tr: 'Galata Rum Okulu Vakfı - Kültür Merkezi, web sitesini ziyaret eden kullanıcıların gizliliğini korumayı taahhüt eder. İletişim ve mekan talebi formları üzerinden iletilen bilgiler üçüncü taraflarla ticari amaçlarla paylaşılmaz.',
                    en: 'The Galata Greek School Foundation - Cultural Center is committed to protecting the privacy of its website visitors. Information submitted through contact and venue inquiry forms is never shared with third parties for commercial purposes.',
                    el: 'Το Ίδρυμα Ελληνικού Σχολείου Γαλατά - Πολιτιστικό Κέντρο δεσμεύεται να προστατεύει το απόρρητο των επισκεπτών του ιστότοπου.',
                },
            },
            {
                heading: {
                    tr: '2. Dijital Arşiv ve Telif Hakları',
                    en: '2. Digital Archive & Copyright',
                    el: '2. Ψηφιακό Αρχείο & Πνευματικά Δικαιώματα',
                },
                body: {
                    tr: 'Sitemizde yer alan dijital arşiv belgeleri, fotoğraflar ve mimari görseller kültürel mirasın korunması ve akademik/kültürel inceleme amacıyla sunulmaktadır. Kaynak gösterilmeden ticari amaçla çoğaltılamaz.',
                    en: 'Digital archive documents, photographs, and architectural visuals on our website are presented for cultural heritage preservation and research. They may not be reproduced commercially without attribution.',
                    el: 'Τα ψηφιακά αρχειακά τεκμήρια και οι φωτογραφίες στον ιστότοπό μας παρουσιάζονται για σκοπούς έρευνας και διατήρησης της πολιτιστικής κληρονομιάς.',
                },
            },
        ],
    },
    cookies: {
        title: {
            tr: 'Çerez Politikası',
            en: 'Cookie Policy',
            el: 'Πολιτική Cookies',
        },
        subtitle: {
            tr: 'Web sitemizde kullanılan zorunlu ve işlevsel çerezler hakkında bilgilendirme.',
            en: 'Information about essential and functional cookies used on our website.',
            el: 'Πληροφορίες σχετικά με τα απαραίτητα και λειτουργικά cookies που χρησιμοποιούνται στον ιστότοπό μας.',
        },
        sections: [
            {
                heading: {
                    tr: '1. Çerez Kullanımı',
                    en: '1. Use of Cookies',
                    el: '1. Χρήση Cookies',
                },
                body: {
                    tr: 'Galata Rum Okulu Vakfı - Kültür Merkezi web sitesi; dil tercihinizi (TR / EN / EL) ve görünüm ayarlarınızı (açık/koyu tema) hatırlamak ve sayfa güvenliğini sağlamak amacıyla yalnızca zorunlu ve işlevsel çerezler/yerel depolama (localStorage) kullanır.',
                    en: 'The Galata Greek School Foundation - Cultural Center website uses only essential and functional storage (such as language preference TR/EN/EL and theme settings) to ensure a seamless browsing experience.',
                    el: 'Ο ιστότοπος του Ιδρύματος Ελληνικού Σχολείου Γαλατά - Πολιτιστικού Κέντρου χρησιμοποιεί μόνο απαραίτητα λειτουργικά cookies για την αποθήκευση της γλώσσας και του θέματος εμφάνισης.',
                },
            },
            {
                heading: {
                    tr: '2. Çerez Tercihlerinin Yönetimi',
                    en: '2. Managing Cookie Preferences',
                    el: '2. Διαχείριση Προτιμήσεων Cookies',
                },
                body: {
                    tr: 'Tarayıcı ayarlarınız üzerinden çerezleri ve yerel depolama verilerini dilediğiniz zaman temizleyebilir veya engelleyebilirsiniz.',
                    en: 'You can clear or block cookies and local storage data at any time through your browser settings.',
                    el: 'Μπορείτε να διαγράψετε ή να αποκλείσετε τα cookies ανά πάσα στιγμή μέσω των ρυθμίσεων του προγράμματος περιήγησής σας.',
                },
            },
        ],
    },
};

export default function LegalPage({ docType }: { docType: LegalDocType }) {
    const { lang, localizePath } = useI18n();
    const l = lang || 'tr';
    const doc = LEGAL_CONTENT[docType];

    return (
        <div className="legal-page" style={{ backgroundColor: 'var(--color-alabaster)', minHeight: '70vh', paddingBottom: 'var(--space-24)' }}>
            <SEO
                overrideTitle={doc.title[l]}
                overrideDescription={doc.subtitle[l]}
            />
            <Breadcrumbs items={[{ label: doc.title }]} />
            <div style={{ maxWidth: '52rem', margin: '0 auto', padding: 'var(--space-12) var(--space-6)' }}>
                <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-4xl)', color: 'var(--color-ink)', marginBottom: 'var(--space-4)', fontWeight: 400 }}>
                    {doc.title[l]}
                </h1>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-lg)', color: 'var(--color-inscription)', marginBottom: 'var(--space-12)', lineHeight: 1.7 }}>
                    {doc.subtitle[l]}
                </p>

                {doc.sections.map((sec, idx) => (
                    <section key={idx} style={{ marginBottom: 'var(--space-10)', paddingBottom: 'var(--space-8)', borderBottom: '1px solid rgba(197, 160, 89, 0.18)' }}>
                        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-2xl)', color: 'var(--color-ink)', marginBottom: 'var(--space-3)', fontWeight: 400 }}>
                            {sec.heading[l]}
                        </h2>
                        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', color: 'var(--color-ink)', opacity: 0.88, lineHeight: 1.8 }}>
                            {sec.body[l]}
                        </p>
                    </section>
                ))}

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-6)', marginTop: 'var(--space-8)', fontSize: 'var(--text-sm)' }}>
                    <Link to={localizePath('/kvkk')} style={{ color: 'var(--color-brass-gold)', fontWeight: 600 }}>
                        {LEGAL_CONTENT.kvkk.title[l]}
                    </Link>
                    <Link to={localizePath('/gizlilik-politikasi')} style={{ color: 'var(--color-brass-gold)', fontWeight: 600 }}>
                        {LEGAL_CONTENT.privacy.title[l]}
                    </Link>
                    <Link to={localizePath('/cerez-politikasi')} style={{ color: 'var(--color-brass-gold)', fontWeight: 600 }}>
                        {LEGAL_CONTENT.cookies.title[l]}
                    </Link>
                    <Link to={localizePath('/bize-ulasin')} style={{ color: 'var(--color-ink)', textDecoration: 'underline' }}>
                        {l === 'tr' ? 'İletişim Formu →' : l === 'el' ? 'Φόρμα Επικοινωνίας →' : 'Contact Form →'}
                    </Link>
                </div>
            </div>
        </div>
    );
}
