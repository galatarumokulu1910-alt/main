import type { Artifact } from '../components/ArtifactCard/ArtifactCard';

// Student register images
import belgeOgrenci01 from '../assets/images/Ogrenci Resimleri/belge-ogrenci-01-ogrenci-kayit-defteri.jpeg';
import belgeOgrenci02 from '../assets/images/Ogrenci Resimleri/belge-ogrenci-02-ogrenci-dosyasi-sultana.jpeg';
import belgeOgrenci03 from '../assets/images/Ogrenci Resimleri/belge-ogrenci-03-ogrenci-kayit-sayfasi.jpeg';
import belgeOgrenci04 from '../assets/images/Ogrenci Resimleri/belge-ogrenci-04-ogrenci-defteri-sayfasi.jpeg';

export const documentsArtifacts: Artifact[] = [
    // ── Öğrenci Kayıtları (Student Records) ──
    {
        id: 'doc-kayit-01',
        title: 'Student Register — 1940s–1950s',
        titleTr: 'Öğrenci Kayıt Defteri — 1940–1950',
        titleEl: 'Μαθητολόγιο — 1940–1950',
        date: 'c. 1948–1955',
        category: 'documents',
        subCategory: 'kayit',
        description: 'Page from the student register (Μαθητολόγιο) showing three student entries with passport photos, names, birthdates, and addresses. Entries include students from Galata district, born in the late 1940s.',
        descriptionTr: 'Öğrenci kayıt defterinden (Μαθητολόγιο) bir sayfa. Üç öğrenci kaydı: vesikalık fotoğraflar, isimler, doğum tarihleri ve adresler. Galata bölgesinden 1940\'ların sonunda doğan öğrenciler.',
        descriptionEl: 'Σελίδα μαθητολογίου με τρεις εγγραφές μαθητών: φωτογραφίες, ονόματα, ημερομηνίες γέννησης και διευθύνσεις.',
        imageSrc: belgeOgrenci01,
        provenance: 'Galata Greek School Student Registry',
        provenanceTr: 'Galata Rum Okulu Öğrenci Kayıt Defteri',
        provenanceEl: 'Μαθητολόγιο Αστικής Σχολής Γαλατά',
    },
    {
        id: 'doc-kayit-02',
        title: 'Student Record File — Sultana Savopulos',
        titleTr: 'Öğrenci Dosyası — Sultana Savopulos',
        titleEl: 'Ατομικός Φάκελος Μαθήτριας — Σουλτάνα Σαβόπουλου',
        date: 'c. 1960',
        category: 'documents',
        subCategory: 'kayit',
        description: 'Student observation and record file for Sultana Savopulos — cover page with passport photo. Title reads: "İlkokul öğrencilerinin sosyal, sağlık ve ruhsal durumlarını inceleme ve kayıt dosyası" (Primary student social, health, and psychological record file).',
        descriptionTr: 'Sultana Savopulos\'a ait öğrenci gözlem ve kayıt dosyası. "İlkokul öğrencilerinin sosyal, sağlık ve ruhsal durumlarını inceleme ve kayıt dosyası" başlıklı kapak sayfası, vesikalık fotoğraflı.',
        descriptionEl: 'Ατομικός φάκελος παρατηρήσεων Σουλτάνας Σαβόπουλου — εξώφυλλο με φωτογραφία.',
        imageSrc: belgeOgrenci02,
        provenance: 'Galata Greek School Student Archives',
        provenanceTr: 'Galata Rum Okulu Öğrenci Arşivi',
        provenanceEl: 'Αρχείο Μαθητών Ελληνικού Σχολείου Γαλατά',
    },
    {
        id: 'doc-kayit-03',
        title: 'Student Register Page — 1949–1955',
        titleTr: 'Öğrenci Kayıt Sayfası — 1949–1955',
        titleEl: 'Σελίδα Μαθητολογίου — 1949–1955',
        date: 'c. 1949–1955',
        category: 'documents',
        subCategory: 'kayit',
        description: 'Rotated student register page showing three entries with passport photos (Nos. 17). Columns include: Surname, Name, Father/Mother name, Birthdate, Nationality, Address, Father\'s occupation.',
        descriptionTr: 'Üç öğrenci kaydı içeren kayıt defteri sayfası. Sütunlar: Soyadı, Adı, Baba/Ana adı, Doğum yeri ve tarihi, Tabiiyet, Oturduğu yer, Babasının işi.',
        descriptionEl: 'Σελίδα μαθητολογίου με τρεις εγγραφές (αρ. 17): Επώνυμο, Όνομα, Πατέρας/Μητέρα, Γέννηση, Υπηκοότητα.',
        imageSrc: belgeOgrenci03,
        provenance: 'Galata Greek School Student Registry',
        provenanceTr: 'Galata Rum Okulu Öğrenci Kayıt Defteri',
        provenanceEl: 'Μαθητολόγιο Αστικής Σχολής Γαλατά',
    },
    {
        id: 'doc-kayit-04',
        title: 'Student Register — ÖĞRENCİ Header Page',
        titleTr: 'Öğrenci Kayıt Defteri — ÖĞRENCİ Başlık Sayfası',
        titleEl: 'Μαθητολόγιο — Σελίδα Κεφαλίδας ΟĞRENCİ',
        date: 'c. 1947–1953',
        category: 'documents',
        subCategory: 'kayit',
        description: 'Header page of the student register (ÖĞRENCİ) with printed column titles: Photograph, Name & Surname, Father/Guardian, Birthdate & Place, Nationality, Address, Father\'s Occupation. Features entries with Rum İlkokulü Mühürü (Greek Primary School seal).',
        descriptionTr: 'Öğrenci kayıt defterinin başlık sayfası. Basılı sütun başlıkları: Fotoğrafı, Adı ve Soyadı, Babasının Anasının Velisinin adı, Doğduğu yer ve tarih, Tabiiyet, Oturduğu yer, Babasının işi. Rum İlkokulü Mühürü içeren kayıtlar.',
        descriptionEl: 'Σελίδα κεφαλίδας μαθητολογίου (ÖĞRENCİ) με τυπωμένες στήλες και σφραγίδα Ρωμαίικου Δημοτικού.',
        imageSrc: belgeOgrenci04,
        provenance: 'Galata Greek School Student Registry',
        provenanceTr: 'Galata Rum Okulu Öğrenci Kayıt Defteri',
        provenanceEl: 'Μαθητολόγιο Αστικής Σχολής Γαλατά',
    },
];
