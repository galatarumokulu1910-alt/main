import { Link } from 'react-router-dom';
import { ShieldCheck, MapPin, Mail, Phone, ArrowUpRight, FileText } from 'lucide-react';
import { useI18n } from '../../i18n/I18nContext';
import { VENUE_INFO } from '../../config/venueInfo';
import SEO from '../../components/SEO/SEO';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import './LegalPage.css';

type LegalDocType = 'kvkk' | 'privacy' | 'cookies';
type Locale = 'tr' | 'en' | 'el';

interface LegalSection {
    num: string;
    heading: Record<Locale, string>;
    body: Record<Locale, string>;
    bullets?: Record<Locale, string[]>;
}

interface LegalDocument {
    path: string;
    eyebrow: Record<Locale, string>;
    title: Record<Locale, string>;
    subtitle: Record<Locale, string>;
    badge: Record<Locale, string>;
    updated: Record<Locale, string>;
    sections: LegalSection[];
}

const LEGAL_CONTENT: Record<LegalDocType, LegalDocument> = {
    kvkk: {
        path: '/kvkk',
        eyebrow: {
            tr: 'YASAL BİLGİLENDİRME & VERİ KORUMA',
            en: 'LEGAL NOTICE & DATA PROTECTION',
            el: 'ΝΟΜΙΚΗ ΕΝΗΜΕΡΩΣΗ & ΠΡΟΣΤΑΣΙΑ ΔΕΔΟΜΕΝΩΝ',
        },
        title: {
            tr: 'KVKK Aydınlatma Metni',
            en: 'PDPL (KVKK) Disclosure Text',
            el: 'Ενημερωτικό Κείμενο Προστασίας Δεδομένων (KVKK)',
        },
        subtitle: {
            tr: '6698 Sayılı Kişisel Verilerin Korunması Kanunu kapsamında Galata Rum Okulu Vakfı - Kültür Merkezi aydınlatma ve bilgilendirme metni.',
            en: 'Information and disclosure notice by the Galata Greek School Foundation - Cultural Center under Turkish Personal Data Protection Law No. 6698.',
            el: 'Ενημερωτικό κείμενο από το Ίδρυμα Αστικής Σχολής Γαλατά – Πολιτιστικό Κέντρο σύμφωνα με τον Νόμο 6698 περί Προστασίας Δεδομένων Προσωπικού Χαρακτήρα.',
        },
        badge: {
            tr: '6698 Sayılı Kanun Kapsamında',
            en: 'Pursuant to Law No. 6698',
            el: 'Σύμφωνα με τον Νόμο 6698',
        },
        updated: {
            tr: 'Yürürlük & Güncelleme: 2026',
            en: 'Effective & Updated: 2026',
            el: 'Ισχύς & Ενημέρωση: 2026',
        },
        sections: [
            {
                num: '01',
                heading: {
                    tr: 'Veri Sorumlusunun Kimliği',
                    en: 'Identity of the Data Controller',
                    el: 'Ταυτότητα Υπευθύνου Επεξεργασίας',
                },
                body: {
                    tr: `6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) uyarınca kişisel verileriniz; veri sorumlusu sıfatıyla ${VENUE_INFO.institutionName.tr} (${VENUE_INFO.contact.fullAddress.tr}) tarafından hukuka ve dürüstlük kurallarına uygun olarak aşağıda açıklanan kapsamda işlenmektedir.`,
                    en: `In accordance with the Law on the Protection of Personal Data No. 6698 ("KVKK"), your personal data is processed lawfully and in good faith by the ${VENUE_INFO.institutionName.en} (${VENUE_INFO.contact.fullAddress.en}) acting as the data controller.`,
                    el: `Σύμφωνα με τον Νόμο περί Προστασίας Δεδομένων Προσωπικού Χαρακτήρα αρ. 6698 («KVKK»), τα προσωπικά σας δεδομένα υποβάλλονται σε επεξεργασία νομίμως και με καλή πίστη από το Ίδρυμα Αστικής Σχολής Γαλατά – Πολιτιστικό Κέντρο (${VENUE_INFO.contact.fullAddress.el}), υπό την ιδιότητά του ως υπευθύνου επεξεργασίας, στο πλαίσιο που περιγράφεται κατωτέρω.`,
                },
            },
            {
                num: '02',
                heading: {
                    tr: 'İşlenen Kişisel Veriler ve İşleme Amaçları',
                    en: 'Processed Personal Data & Purposes',
                    el: 'Δεδομένα & Σκοποί Επεξεργασίας',
                },
                body: {
                    tr: 'İletişim formları, mekan tahsis/kiralama başvuruları, arşiv araştırma talepleri ve etkinlik kayıtları aracılığıyla paylaşılan kişisel verileriniz aşağıdaki amaçlarla sınırlı olarak işlenir:',
                    en: 'Personal data shared through contact forms, venue hire inquiries, archive research requests, and event registrations is processed strictly for the following purposes:',
                    el: 'Τα προσωπικά δεδομένα που κοινοποιούνται μέσω των φορμών επικοινωνίας, αιτημάτων διάθεσης/ενοικίασης χώρου, αιτημάτων αρχειακής έρευνας και εγγραφών σε εκδηλώσεις υποβάλλονται σε επεξεργασία αποκλειστικά για τους ακόλουθους σκοπούς:',
                },
                bullets: {
                    tr: [
                        'Mekan kiralama, sergi, konferans ve kültürel işbirliği taleplerinin değerlendirilmesi ve yanıtlanması,',
                        'Kültür-sanat etkinlikleri, sergiler ve sempozyumlar hakkında bilgilendirme yapılması,',
                        'Dijital arşiv ve akademik araştırma başvurularının yürütülmesi,',
                        'Vakıf faaliyetlerinin ilgili mevzuata ve yasal yükümlülüklere uygun olarak yerine getirilmesi.',
                    ],
                    en: [
                        'Evaluating and responding to venue hire, exhibition, conference, and cultural collaboration inquiries,',
                        'Sharing institutional communications regarding exhibitions, symposia, and cultural programs,',
                        'Managing digital archive access and academic research requests,',
                        'Fulfilling legal and regulatory obligations applicable to foundation operations.',
                    ],
                    el: [
                        'Αξιολόγηση και απάντηση σε αιτήματα ενοικίασης χώρων, εκθέσεων, συνεδρίων και πολιτιστικών συνεργασιών,',
                        'Ενημέρωση σχετικά με πολιτιστικές και καλλιτεχνικές εκδηλώσεις, εκθέσεις και συμπόσια,',
                        'Διαχείριση αιτημάτων πρόσβασης στο ψηφιακό αρχείο και ακαδημαϊκής έρευνας,',
                        'Εκπλήρωση των δραστηριοτήτων του Ιδρύματος σύμφωνα με την ισχύουσα νομοθεσία και τις νόμιμες υποχρεώσεις του.',
                    ],
                },
            },
            {
                num: '03',
                heading: {
                    tr: 'Kişisel Verilerin Toplanma Yöntemi ve Hukuki Sebebi',
                    en: 'Method and Legal Basis of Collection',
                    el: 'Μέθοδος Συλλογής & Νομική Βάση',
                },
                body: {
                    tr: 'Kişisel verileriniz; web sitemizdeki iletişim ve mekan talebi formları, e-posta veya telefon kanalları üzerinden elektronik ortamda toplanmaktadır. Bu veriler KVKK’nın 5. maddesinde belirtilen “bir sözleşmenin kurulması veya ifasıyla doğrudan doğruya ilgili olması”, “veri sorumlusunun hukuki yükümlülüğünü yerine getirebilmesi” ve “ilgili kişinin temel hak ve özgürlüklerine zarar vermemek kaydıyla veri sorumlusunun meşru menfaati” hukuki sebeplerine dayanılarak işlenmektedir.',
                    en: 'Your personal data is collected electronically via our website inquiry forms, email, or telephone channels, based on the legal grounds set forth in Article 5 of the KVKK: performance of a pre-contractual request, compliance with legal obligations, and legitimate institutional interest.',
                    el: 'Τα προσωπικά σας δεδομένα συλλέγονται ηλεκτρονικά μέσω των φορμών επικοινωνίας και εκδήλωσης ενδιαφέροντος του ιστοτόπου μας, καθώς και μέσω ηλεκτρονικού ταχυδρομείου ή τηλεφώνου, βάσει των νομικών βάσεων του Άρθρου 5 του Νόμου 6698 (KVKK): εξυπηρέτηση προσυμβατικού αιτήματος, συμμόρφωση με έννομες υποχρεώσεις και έννομο συμφέρον του Ιδρύματος.',
                },
            },
            {
                num: '04',
                heading: {
                    tr: 'İlgili Kişinin Hakları (KVKK Madde 11)',
                    en: 'Rights of the Data Subject (Article 11)',
                    el: 'Δικαιώματα του Υποκειμένου των Δεδομένων (Άρθρο 11)',
                },
                body: {
                    tr: 'KVKK’nın 11. maddesi uyarınca veri sahipleri; kişisel verilerinin işlenip işlenmediğini öğrenme, işlenmişse buna ilişkin bilgi talep etme, işlenme amacına uygun kullanılıp kullanılmadığını öğrenme, eksik veya yanlış işlenmiş olması hâlinde düzeltilmesini ve şartları oluştuğunda silinmesini veya yok edilmesini isteme haklarına sahiptir. Taleplerinizi info@galatarumokulu.org adresine e-posta göndererek veya vakıf merkezimize yazılı olarak iletebilirsiniz.',
                    en: 'Under Article 11 of the KVKK, data subjects have the right to learn whether their personal data is processed, request information regarding processing, request correction of incomplete or inaccurate data, and request deletion or destruction under applicable legal conditions. You may submit your requests to info@galatarumokulu.org or in writing to our foundation address.',
                    el: 'Σύμφωνα με το Άρθρο 11 του Νόμου 6698 (KVKK), τα υποκείμενα των δεδομένων έχουν το δικαίωμα να ενημερώνονται εάν τα προσωπικά τους δεδομένα υποβάλλονται σε επεξεργασία, να ζητούν σχετικές πληροφορίες εφόσον έχουν υποβληθεί σε επεξεργασία, να ενημερώνονται εάν χρησιμοποιούνται σύμφωνα με τον σκοπό της επεξεργασίας, να αιτούνται τη διόρθωση ελλιπών ή ανακριβών στοιχείων, καθώς και τη διαγραφή ή καταστροφή τους υπό τις προβλεπόμενες νόμιμες προϋποθέσεις. Μπορείτε να υποβάλετε τα αιτήματά σας ηλεκτρονικά στο info@galatarumokulu.org ή εγγράφως στην έδρα του Ιδρύματος.',
                },
            },
        ],
    },
    privacy: {
        path: '/gizlilik-politikasi',
        eyebrow: {
            tr: 'VERİ GÜVENLİĞİ & KÜLTÜREL MİRAS İLKELERİ',
            en: 'DATA SECURITY & HERITAGE PRINCIPLES',
            el: 'ΑΣΦΑΛΕΙΑ ΔΕΔΟΜΕΝΩΝ & ΑΡΧΕΣ ΠΟΛΙΤΙΣΤΙΚΗΣ ΚΛΗΡΟΝΟΜΙΑΣ',
        },
        title: {
            tr: 'Gizlilik Politikası',
            en: 'Privacy Policy',
            el: 'Πολιτική Απορρήτου',
        },
        subtitle: {
            tr: 'Ziyaretçi bilgilerinizin güvenliği, kurumsal iletişim gizliliği ve dijital arşiv koleksiyonlarımızın kullanım ilkeleri.',
            en: 'Our principles governing visitor data security, institutional inquiry confidentiality, and digital archive usage.',
            el: 'Οι αρχές μας σχετικά με την ασφάλεια των δεδομένων επισκεπτών, την εμπιστευτικότητα επικοινωνίας και τη χρήση του ψηφιακού αρχείου.',
        },
        badge: {
            tr: 'Gizlilik & Telif İlkeleri',
            en: 'Privacy & Archival Copyright',
            el: 'Απόρρητο & Πνευματικά Δικαιώματα',
        },
        updated: {
            tr: 'Yürürlük & Güncelleme: 2026',
            en: 'Effective & Updated: 2026',
            el: 'Ισχύς & Ενημέρωση: 2026',
        },
        sections: [
            {
                num: '01',
                heading: {
                    tr: 'Bilgi Güvenliği ve Gizlilik Taahhüdü',
                    en: 'Information Security & Confidentiality Commitment',
                    el: 'Δέσμευση Ασφάλειας Πληροφοριών & Απορρήτου',
                },
                body: {
                    tr: 'Galata Rum Okulu Vakfı - Kültür Merkezi, web sitesini ziyaret eden kullanıcıların ve etkinlik/mekan talebinde bulunan kurumların gizliliğini korumayı taahhüt eder. İletişim ve mekan talebi formları üzerinden paylaşılan proje detayları, kurumsal bilgiler ve iletişim verileri üçüncü taraflarla ticari amaçlarla paylaşılmaz, satılmaz veya kiralanmaz.',
                    en: 'The Galata Greek School Foundation - Cultural Center is committed to protecting the privacy of website visitors and institutions submitting event or venue inquiries. Project briefs, institutional details, and contact information shared via our forms are never sold, rented, or shared with third parties for commercial purposes.',
                    el: 'Το Ίδρυμα Αστικής Σχολής Γαλατά – Πολιτιστικό Κέντρο δεσμεύεται να προστατεύει το απόρρητο των επισκεπτών του ιστοτόπου και των φορέων που υποβάλλουν αιτήματα εκδηλώσεων ή διάθεσης χώρων. Τα στοιχεία έργων, οι θεσμικές πληροφορίες και τα δεδομένα επικοινωνίας που κοινοποιούνται μέσω των φορμών μας ουδέποτε πωλούνται, εκμισθώνονται ή διαβιβάζονται σε τρίτους για εμπορικούς σκοπούς.',
                },
            },
            {
                num: '02',
                heading: {
                    tr: 'Mekan Talebi ve Kurumsal Proje Gizliliği',
                    en: 'Venue Inquiry & Institutional Project Privacy',
                    el: 'Εμπιστευτικότητα Αιτημάτων Χώρου & Έργων',
                },
                body: {
                    tr: 'Mekan kiralama ve etkinlik başvuru formu üzerinden ilettiğiniz etkinlik konsepti, katılımcı sayısı, tercih edilen tarihler ve teknik gereksinimler yalnızca vakıf yönetimi ve ilgili etkinlik koordinasyon ekibi tarafından değerlendirilir; başvurunuzun sonuçlandırılması dışında hiçbir amaçla kullanılmaz.',
                    en: 'Event concepts, estimated guest counts, proposed dates, and technical requirements submitted via our venue inquiry form are reviewed exclusively by foundation management and our event coordination team to evaluate feasibility and respond to your request.',
                    el: 'Η περιγραφή της εκδήλωσης, ο εκτιμώμενος αριθμός προσκεκλημένων, οι προτεινόμενες ημερομηνίες και οι τεχνικές απαιτήσεις που υποβάλλονται μέσω της φόρμας ενδιαφέροντος εξετάζονται αποκλειστικά από τη διοίκηση του Ιδρύματος και την ομάδα συντονισμού εκδηλώσεων για την αξιολόγηση και την εξυπηρέτηση του αιτήματός σας.',
                },
            },
            {
                num: '03',
                heading: {
                    tr: 'Dijital Arşiv, Görseller ve Telif Hakları',
                    en: 'Digital Archive, Visuals & Copyright',
                    el: 'Ψηφιακό Αρχείο, Εικόνες & Πνευματικά Δικαιώματα',
                },
                body: {
                    tr: 'Web sitemizde yer alan dijital arşiv belgeleri, tarihi fotoğraflar, efemera koleksiyonu ve mimari görseller kültürel mirasın korunması, eğitim ve akademik inceleme amacıyla sunulmaktadır:',
                    en: 'Digital archive documents, historical photographs, ephemera collections, and architectural visuals presented on our website are made available for cultural heritage preservation, education, and academic study:',
                    el: 'Τα ψηφιακά αρχειακά τεκμήρια, οι ιστορικές φωτογραφίες, η συλλογή εφημέρων και οι αρχιτεκτονικές απεικονίσεις που περιλαμβάνονται στον ιστότοπό μας παρουσιάζονται για σκοπούς διατήρησης της πολιτιστικής κληρονομιάς, εκπαίδευσης και ακαδημαϊκής μελέτης:',
                },
                bullets: {
                    tr: [
                        'Arşiv envanterindeki eser ve belge görselleri Galata Rum Okulu Vakfı’nın yazılı izni ve kaynak gösterimi olmaksızın ticari yayınlarda kullanılamaz.',
                        'Akademik araştırmalar, tezler ve kültürel yayınlar için yüksek çözünürlüklü belge talepleri iletişim formu üzerinden vakfımıza iletilebilir.',
                        'Sitedeki dış bağlantılar (harita servisleri, sosyal medya hesapları) ilgili platformların kendi gizlilik politikalarına tabidir.',
                    ],
                    en: [
                        'Archival artifacts and document visuals may not be reproduced in commercial publications without prior written permission and attribution to the Galata Greek School Foundation.',
                        'High-resolution reproduction requests for academic research and cultural publications may be submitted via our contact page.',
                        'External links (map services, social media platforms) are governed by the respective third-party privacy policies.',
                    ],
                    el: [
                        'Οι εικόνες έργων και εγγράφων από το αρχειακό ευρετήριο δεν επιτρέπεται να χρησιμοποιούνται σε εμπορικές εκδόσεις χωρίς τη γραπτή άδεια του Ιδρύματος Αστικής Σχολής Γαλατά και την αναφορά πηγής.',
                        'Αιτήματα αντιγράφων εγγράφων υψηλής ανάλυσης για ακαδημαϊκές έρευνες, διατριβές και πολιτιστικές εκδόσεις μπορούν να υποβάλλονται στο Ίδρυμά μας μέσω της φόρμας επικοινωνίας.',
                        'Οι εξωτερικοί σύνδεσμοι του ιστοτόπου (υπηρεσίες χαρτών, λογαριασμοί μέσων κοινωνικής δικτύωσης) διέπονται από τις αντίστοιχες πολιτικές απορρήτου των πλατφορμών αυτών.',
                    ],
                },
            },
            {
                num: '04',
                heading: {
                    tr: 'Teknik Güvenlik Önlemleri',
                    en: 'Technical Security Measures',
                    el: 'Τεχνικά Μέτρα Ασφαλείας',
                },
                body: {
                    tr: 'Web sitemiz üzerinden gerçekleştirilen tüm veri iletişimi SSL/TLS şifrelemesi ile korunmakta olup, veritabanı erişimleri yetkilendirme ve güvenlik duvarı politikalarıyla sınırlandırılmıştır.',
                    en: 'All data transmission across our website is protected with SSL/TLS encryption, and database access is strictly governed by role-based authorization policies.',
                    el: 'Όλη η μεταφορά δεδομένων μέσω του ιστοτόπου μας προστατεύεται με κρυπτογράφηση SSL/TLS, ενώ η πρόσβαση στη βάση δεδομένων περιορίζεται μέσω πολιτικών εξουσιοδότησης και τείχους προστασίας.',
                },
            },
        ],
    },
    cookies: {
        path: '/cerez-politikasi',
        eyebrow: {
            tr: 'TEKNİK ÇEREZLER & YEREL DEPOLAMA',
            en: 'TECHNICAL COOKIES & LOCAL STORAGE',
            el: 'ΤΕΧΝΙΚΑ COOKIES & ΤΟΠΙΚΗ ΑΠΟΘΗΚΕΥΣΗ',
        },
        title: {
            tr: 'Çerez Politikası',
            en: 'Cookie Policy',
            el: 'Πολιτική Cookies',
        },
        subtitle: {
            tr: 'Web sitemizde kullanıcı deneyimini ve dil/görünüm tercihlerini korumak amacıyla kullanılan zorunlu ve işlevsel teknolojiler hakkında bilgilendirme.',
            en: 'Information regarding essential and functional storage technologies used on our website to preserve language and display preferences.',
            el: 'Πληροφορίες σχετικά με τις απαραίτητες και λειτουργικές τεχνολογίες που χρησιμοποιούνται στον ιστότοπό μας για τη διατήρηση της εμπειρίας χρήστη και των προτιμήσεων γλώσσας και εμφάνισης.',
        },
        badge: {
            tr: 'Zorunlu & İşlevsel Depolama',
            en: 'Essential & Functional Only',
            el: 'Μόνο Απαραίτητα & Λειτουργικά',
        },
        updated: {
            tr: 'Yürürlük & Güncelleme: 2026',
            en: 'Effective & Updated: 2026',
            el: 'Ισχύς & Ενημέρωση: 2026',
        },
        sections: [
            {
                num: '01',
                heading: {
                    tr: 'Çerez (Cookie) ve Yerel Depolama Nedir?',
                    en: 'What Are Cookies & Local Storage?',
                    el: 'Τι είναι τα Cookies & η Τοπική Αποθήκευση;',
                },
                body: {
                    tr: 'Çerezler ve tarayıcı yerel depolama (localStorage) alanları, ziyaret ettiğiniz web sitesinin dil seçimi veya tema tercihi gibi temel ayarlarınızı hatırlaması için cihazınızda saklanan küçük metin kayıtlarıdır.',
                    en: 'Cookies and browser localStorage entries are small text records stored on your device that allow a website to remember core preferences such as selected language or visual theme.',
                    el: 'Τα cookies και η τοπική αποθήκευση του προγράμματος περιήγησης (localStorage) είναι μικρά αρχεία κειμένου που αποθηκεύονται στη συσκευή σας, ώστε ο ιστότοπος να θυμάται βασικές ρυθμίσεις όπως η επιλογή γλώσσας ή η προτίμηση θέματος.',
                },
            },
            {
                num: '02',
                heading: {
                    tr: 'Sitemizde Kullanılan Çerez Kategorileri',
                    en: 'Categories of Storage Used on Our Website',
                    el: 'Κατηγορίες Cookies που Χρησιμοποιούμε',
                },
                body: {
                    tr: 'Galata Rum Okulu Vakfı - Kültür Merkezi web sitesi, üçüncü taraf reklam veya profilleme çerezleri kullanmaz; yalnızca aşağıdaki zorunlu ve işlevsel kayıtları kullanır:',
                    en: 'The Galata Greek School Foundation - Cultural Center website does not use third-party advertising or behavioral profiling cookies; it relies solely on the following essential and functional records:',
                    el: 'Ο ιστότοπος του Ιδρύματος Αστικής Σχολής Γαλατά – Πολιτιστικού Κέντρου δεν χρησιμοποιεί διαφημιστικά cookies τρίτων ή cookies προφίλ· χρησιμοποιεί αποκλειστικά τις ακόλουθες απαραίτητες και λειτουργικές εγγραφές:',
                },
                bullets: {
                    tr: [
                        'Dil Tercihi (TR / EN / EL): Seçtiğiniz dilde sayfalar arasında kesintisiz gezinmenizi sağlar.',
                        'Görünüm & Tema Ayarları: Açık/koyu tema ve erişilebilirlik tercihlerinizin korunmasını sağlar.',
                        'Oturum & Güvenlik: Yalnızca yetkili yönetim paneli (/admin) oturumlarının güvenliğini doğrulamak için kullanılır.',
                    ],
                    en: [
                        'Language Preference (TR / EN / EL): Ensures seamless navigation across pages in your chosen language.',
                        'Display & Theme Settings: Preserves light/dark mode and accessibility preferences.',
                        'Session & Security: Used strictly to authenticate authorized administrative (/admin) sessions.',
                    ],
                    el: [
                        'Προτίμηση Γλώσσας (TR / EN / EL): Διασφαλίζει την απρόσκοπτη πλοήγηση μεταξύ των σελίδων στη γλώσσα που έχετε επιλέξει.',
                        'Ρυθμίσεις Εμφάνισης & Θέματος: Διατηρεί τις προτιμήσεις φωτεινού/σκοτεινού θέματος και προσβασιμότητας.',
                        'Συνεδρία & Ασφάλεια: Χρησιμοποιείται αποκλειστικά για την επαλήθευση της ασφάλειας των συνεδριών του εξουσιοδοτημένου πίνακα διαχείρισης (/admin).',
                    ],
                },
            },
            {
                num: '03',
                heading: {
                    tr: 'Çerez Tercihlerinin Yönetimi',
                    en: 'Managing Your Cookie Preferences',
                    el: 'Διαχείριση Προτιμήσεων Cookies',
                },
                body: {
                    tr: 'Tarayıcınızın ayarlar menüsünden çerezleri ve yerel depolama verilerini dilediğiniz zaman görüntüleyebilir, temizleyebilir veya engelleyebilirsiniz. Zorunlu işlevsel verilerin silinmesi durumunda dil tercihleriniz varsayılan ayarlara dönebilir.',
                    en: 'You may view, clear, or block cookies and localStorage data at any time through your web browser settings. Clearing functional storage may reset your language preference to default.',
                    el: 'Μπορείτε να προβάλλετε, να εκκαθαρίσετε ή να αποκλείσετε τα cookies και τα δεδομένα τοπικής αποθήκευσης ανά πάσα στιγμή μέσω των ρυθμίσεων του προγράμματος περιήγησής σας. Σε περίπτωση διαγραφής των απαραίτητων λειτουργικών δεδομένων, οι προτιμήσεις γλώσσας σας ενδέχεται να επανέλθουν στις προεπιλεγμένες ρυθμίσεις.',
                },
            },
        ],
    },
};

const DOC_ORDER: LegalDocType[] = ['kvkk', 'privacy', 'cookies'];

export default function LegalPage({ docType }: { docType: LegalDocType }) {
    const { lang, localizePath } = useI18n();
    const l: Locale = (lang as Locale) || 'tr';
    const doc = LEGAL_CONTENT[docType];

    const ui = {
        navEyebrow: {
            tr: 'YASAL BELGELER',
            en: 'LEGAL DOCUMENTS',
            el: 'ΝΟΜΙΚΑ ΕΓΓΡΑΦΑ',
        },
        controllerEyebrow: {
            tr: 'VERİ SORUMLUSU',
            en: 'DATA CONTROLLER',
            el: 'ΥΠΕΥΘΥΝΟΣ ΕΠΕΞΕΡΓΑΣΙΑΣ',
        },
        controllerTitle: {
            tr: 'Galata Rum Okulu Vakfı',
            en: 'Galata Greek School Foundation',
            el: 'Ίδρυμα Αστικής Σχολής Γαλατά',
        },
        controllerDesc: {
            tr: 'KVKK ve gizlilik ilkelerimiz kapsamındaki tüm soru ve başvurularınız için vakfımızla doğrudan iletişime geçebilirsiniz.',
            en: 'For any questions or requests regarding data protection and privacy, you may contact our foundation directly.',
            el: 'Για οποιαδήποτε ερώτηση ή αίτημα σχετικά με το KVKK και τις αρχές απορρήτου μας, μπορείτε να επικοινωνήσετε απευθείας με το Ίδρυμά μας.',
        },
        address: VENUE_INFO.contact.fullAddress,
        contactBtn: {
            tr: 'İletişim & Başvuru Formu',
            en: 'Contact & Inquiry Form',
            el: 'Φόρμα Επικοινωνίας & Αιτημάτων',
        },
    };

    return (
        <div className="legal-page">
            <SEO
                overrideTitle={doc.title[l]}
                overrideDescription={doc.subtitle[l]}
            />
            <Breadcrumbs items={[{ label: doc.title }]} />

            <div className="lp-main">
                {/* ══════ EDITORIAL HEADER (Unified with Design System) ══════ */}
                <section className="lp-header">
                    <div className="lp-header__inner">
                        <div className="lp-header__text">
                            <span className="lp-header__eyebrow">{doc.eyebrow[l]}</span>
                            <h1 className="lp-header__title">{doc.title[l]}</h1>
                            <p className="lp-header__description">{doc.subtitle[l]}</p>
                        </div>
                        <div className="lp-header__watermark-col" aria-hidden="true">
                            <span className="lp-header__watermark">1910</span>
                        </div>
                    </div>
                </section>

                {/* ══════ 2-COLUMN ARCHITECTURAL BODY ══════ */}
                <section className="lp-body">
                    <div className="lp-body__inner">
                        {/* Left Column: Legal Document Switcher + Data Controller Info */}
                        <aside className="lp-sidebar">
                            <nav className="lp-nav-card" aria-label={ui.navEyebrow[l]}>
                                <span className="lp-nav-card__eyebrow">{ui.navEyebrow[l]}</span>
                                <ul className="lp-nav-list">
                                    {DOC_ORDER.map((key) => {
                                        const item = LEGAL_CONTENT[key];
                                        const isActive = key === docType;
                                        return (
                                            <li key={key}>
                                                <Link
                                                    to={localizePath(item.path)}
                                                    className={`lp-nav-link ${isActive ? 'lp-nav-link--active' : ''}`}
                                                    aria-current={isActive ? 'page' : undefined}
                                                >
                                                    <span>{item.title[l]}</span>
                                                    <FileText size={15} aria-hidden="true" />
                                                </Link>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </nav>

                            <div className="lp-contact-card">
                                <span className="lp-contact-card__eyebrow">{ui.controllerEyebrow[l]}</span>
                                <h2 className="lp-contact-card__title">{ui.controllerTitle[l]}</h2>
                                <p className="lp-contact-card__desc">{ui.controllerDesc[l]}</p>

                                <ul className="lp-contact-list">
                                    <li className="lp-contact-item">
                                        <MapPin size={15} className="lp-contact-item__icon" aria-hidden="true" />
                                        <span>{ui.address[l]}</span>
                                    </li>
                                    <li className="lp-contact-item">
                                        <Mail size={15} className="lp-contact-item__icon" aria-hidden="true" />
                                        <a href={VENUE_INFO.contact.emailHref} translate="no">{VENUE_INFO.contact.email}</a>
                                    </li>
                                    <li className="lp-contact-item">
                                        <Phone size={15} className="lp-contact-item__icon" aria-hidden="true" />
                                        <a href={VENUE_INFO.contact.telephoneHref} translate="no">{VENUE_INFO.contact.telephoneDisplay}</a>
                                    </li>
                                </ul>

                                <Link to={localizePath('/bize-ulasin')} className="lp-contact-card__btn">
                                    <span>{ui.contactBtn[l]}</span>
                                    <ArrowUpRight size={14} aria-hidden="true" />
                                </Link>
                            </div>
                        </aside>

                        {/* Right Column: Structured Legal Document Card */}
                        <article className="lp-doc-card">
                            <div className="lp-doc-meta">
                                <span className="lp-doc-meta__badge">
                                    <ShieldCheck size={16} aria-hidden="true" />
                                    {doc.badge[l]}
                                </span>
                                <span className="lp-doc-meta__date">{doc.updated[l]}</span>
                            </div>

                            <div className="lp-sections">
                                {doc.sections.map((sec) => (
                                    <section key={sec.num} className="lp-section">
                                        <div className="lp-section__header">
                                            <span className="lp-section__num">{sec.num}.</span>
                                            <h2 className="lp-section__heading">{sec.heading[l]}</h2>
                                        </div>
                                        <p className="lp-section__body">{sec.body[l]}</p>
                                        {sec.bullets && sec.bullets[l] && (
                                            <ul className="lp-section__bullets">
                                                {sec.bullets[l].map((bullet, bIdx) => (
                                                    <li key={bIdx}>{bullet}</li>
                                                ))}
                                            </ul>
                                        )}
                                    </section>
                                ))}
                            </div>
                        </article>
                    </div>
                </section>
            </div>
        </div>
    );
}
