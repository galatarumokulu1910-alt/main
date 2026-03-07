import type { Artifact } from '../components/ArtifactCard/ArtifactCard';

export const sampleArtifacts: Artifact[] = [
    {
        id: 'artifact-001',
        title: 'Greek Calligraphy Textbook',
        titleTr: 'Yunanca Güzel Yazı Ders Kitabı',
        titleEl: 'Εγχειρίδιο Ελληνικής Καλλιγραφίας',
        date: 'c. 1912',
        category: 'books',
        description:
            'A handwritten Greek calligraphy textbook used by students at the Galata School. The leather-bound volume features ornate border decorations and cursive exercises in Ancient Greek, reflecting the rigorous classical curriculum of the early 20th century.',
        descriptionTr:
            'Galata Okulu öğrencileri tarafından kullanılan el yazması bir Yunanca güzel yazı ders kitabı. Deri ciltli eser, süslü kenar dekorasyonları ve Antik Yunanca el yazısı alıştırmalarını içermektedir.',
        descriptionEl:
            'Ένα χειρόγραφο εγχειρίδιο ελληνικής καλλιγραφίας που χρησιμοποιούσαν οι μαθητές του Σχολείου Γαλατά. Ο δερματόδετος τόμος περιλαμβάνει πλούσια διακοσμητικά περιθώρια και ασκήσεις πλάγιας γραφής στα Αρχαία Ελληνικά.',
        imageSrc: '/images/artifacts/vintage-greek-book.png',
        provenance: 'Galata Greek School Archive, Collection No. GRO-1912-045',
        provenanceTr: 'Galata Rum Okulu Arşivi, Koleksiyon No. GRO-1912-045',
        provenanceEl: 'Αρχείο Ελληνικού Σχολείου Γαλατά, Συλλογή Αρ. GRO-1912-045',
    },
    {
        id: 'artifact-002',
        title: 'Class of 1910 — Inaugural Portrait',
        titleTr: '1910 Sınıfı — Açılış Portresi',
        titleEl: 'Τάξη του 1910 — Εγκαίνια Πορτρέτο',
        date: '2 June 1910',
        category: 'portraits',
        description:
            'A formal group portrait of the first graduating class, photographed on the day of the school\'s grand opening ceremony. Students wear period academic uniforms with white collars, standing before the neoclassical façade designed by architects Kambanakis and Hristidis.',
        descriptionTr:
            'Okulun açılış töreninde çekilen ilk mezuniyet sınıfının resmi grup portresi. Öğrenciler, mimarlar Kambanakis ve Hristidis tarafından tasarlanan neoklasik cephe önünde beyaz yakalı dönem üniformalarıyla poz vermektedir.',
        descriptionEl:
            'Ένα επίσημο ομαδικό πορτρέτο της πρώτης αποφοιτήσασας τάξης, φωτογραφημένο την ημέρα της μεγάλης τελετής εγκαινίων του σχολείου. Οι μαθητές φορούν ακαδημαϊκές στολές εποχής με λευκούς γιακάδες, στεκόμενοι μπροστά στη νεοκλασική πρόσοψη.',
        imageSrc: '/images/artifacts/vintage-student-portrait.png',
        provenance: 'AMMF Foundation Digital Archive',
        provenanceTr: 'AMMF Vakfı Dijital Arşivi',
        provenanceEl: 'Ψηφιακό Αρχείο Ιδρύματος AMMF',
    },
    {
        id: 'artifact-003',
        title: 'Student Enrollment Register',
        titleTr: 'Öğrenci Kayıt Defteri',
        titleEl: 'Μητρώο Εγγραφής Μαθητών',
        date: '1908–1923',
        category: 'documents',
        description:
            'The original enrollment ledger documenting student admissions during the late Ottoman and early Republican eras. Entries are handwritten in both Greek and Ottoman Turkish scripts, providing a unique bilingual record of the Galata Greek community\'s educational legacy.',
        descriptionTr:
            'Geç Osmanlı ve erken Cumhuriyet dönemlerinde öğrenci kayıtlarını belgeleyen orijinal kayıt defteri. Hem Yunanca hem Osmanlıca el yazısı ile yazılmış girişler, Galata Rum topluluğunun eğitim mirasının eşsiz iki dilli bir kaydını sunmaktadır.',
        descriptionEl:
            'Το πρωτότυπο βιβλίο εγγραφών που τεκμηριώνει τις εισαγωγές μαθητών κατά τις ύστερες οθωμανικές και πρώιμες δημοκρατικές περιόδους. Οι καταχωρίσεις είναι χειρόγραφες τόσο στα Ελληνικά όσο και στα Οθωμανικά Τουρκικά.',
        imageSrc: '/images/artifacts/vintage-school-register.png',
        provenance: 'Galata Greek School Archive, Collection No. GRO-REG-001',
        provenanceTr: 'Galata Rum Okulu Arşivi, Koleksiyon No. GRO-REG-001',
        provenanceEl: 'Αρχείο Ελληνικού Σχολείου Γαλατά, Συλλογή Αρ. GRO-REG-001',
    },
    {
        id: 'artifact-004',
        title: 'Schoolyard Toys & Greek Alphabet Blocks',
        titleTr: 'Okul Bahçesi Oyuncakları ve Yunan Alfabesi Küpleri',
        titleEl: 'Παιχνίδια Αυλής και Κύβοι Ελληνικού Αλφάβητου',
        date: 'c. 1890–1920',
        category: 'objects',
        description:
            'A collection of antique wooden toys recovered during the 2013 restoration: a hand-carved spinning top, a cloth doll, and alphabet blocks featuring Greek letters. These objects offer a tender glimpse into the daily lives of children who once filled these corridors with laughter.',
        descriptionTr:
            '2013 restorasyonu sırasında bulunan antika ahşap oyuncak koleksiyonu: el oyması topaç, bez bebek ve Yunan harfleri taşıyan alfabe küpleri. Bu objeler, koridorları bir zamanlar kahkahalarla dolduran çocukların günlük yaşamlarına dokunaklı bir pencere açmaktadır.',
        descriptionEl:
            'Μια συλλογή αντίκων ξύλινων παιχνιδιών που ανακτήθηκαν κατά την ανακαίνιση του 2013: μια χειροποίητη σβούρα, μια υφασμάτινη κούκλα και κύβοι αλφαβήτου με ελληνικά γράμματα. Αυτά τα αντικείμενα προσφέρουν μια τρυφερή ματιά στην καθημερινή ζωή των παιδιών.',
        imageSrc: '/images/artifacts/vintage-school-toys.png',
        provenance: 'Restoration Findings, Catalog No. REST-2013-OBJ-12',
        provenanceTr: 'Restorasyon Bulguları, Katalog No. REST-2013-OBJ-12',
        provenanceEl: 'Ευρήματα Ανακαίνισης, Κατάλογος Αρ. REST-2013-OBJ-12',
    },
];
