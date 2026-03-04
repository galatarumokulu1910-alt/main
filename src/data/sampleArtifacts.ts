import type { Artifact } from '../components/ArtifactCard/ArtifactCard';

export const sampleArtifacts: Artifact[] = [
    {
        id: 'artifact-001',
        title: 'Greek Calligraphy Textbook',
        titleTr: 'Yunanca Güzel Yazı Ders Kitabı',
        date: 'c. 1912',
        category: 'books',
        description:
            'A handwritten Greek calligraphy textbook used by students at the Galata School. The leather-bound volume features ornate border decorations and cursive exercises in Ancient Greek, reflecting the rigorous classical curriculum of the early 20th century.',
        descriptionTr:
            'Galata Okulu öğrencileri tarafından kullanılan el yazması bir Yunanca güzel yazı ders kitabı. Deri ciltli eser, süslü kenar dekorasyonları ve Antik Yunanca el yazısı alıştırmalarını içermektedir.',
        imageSrc: '/images/artifacts/vintage-greek-book.png',
        provenance: 'Galata Rum Okulu Arşivi, Koleksiyon No. GRO-1912-045',
    },
    {
        id: 'artifact-002',
        title: 'Class of 1910 — Inaugural Portrait',
        titleTr: '1910 Sınıfı — Açılış Portresi',
        date: '2 June 1910',
        category: 'portraits',
        description:
            'A formal group portrait of the first graduating class, photographed on the day of the school\'s grand opening ceremony. Students wear period academic uniforms with white collars, standing before the neoclassical façade designed by architects Kambanakis and Hristidis.',
        descriptionTr:
            'Okulun açılış töreninde çekilen ilk mezuniyet sınıfının resmi grup portresi. Öğrenciler, mimarlar Kambanakis ve Hristidis tarafından tasarlanan neoklasik cephe önünde beyaz yakalı dönem üniformalarıyla poz vermektedir.',
        imageSrc: '/images/artifacts/vintage-student-portrait.png',
        provenance: 'AMMF Vakfı Dijital Arşivi',
    },
    {
        id: 'artifact-003',
        title: 'Student Enrollment Register',
        titleTr: 'Öğrenci Kayıt Defteri',
        date: '1908–1923',
        category: 'documents',
        description:
            'The original enrollment ledger documenting student admissions during the late Ottoman and early Republican eras. Entries are handwritten in both Greek and Ottoman Turkish scripts, providing a unique bilingual record of the Galata Greek community\'s educational legacy.',
        descriptionTr:
            'Geç Osmanlı ve erken Cumhuriyet dönemlerinde öğrenci kayıtlarını belgeleyen orijinal kayıt defteri. Hem Yunanca hem Osmanlıca el yazısı ile yazılmış girişler, Galata Rum topluluğunun eğitim mirasının eşsiz iki dilli bir kaydını sunmaktadır.',
        imageSrc: '/images/artifacts/vintage-school-register.png',
        provenance: 'Galata Rum Okulu Arşivi, Koleksiyon No. GRO-REG-001',
    },
    {
        id: 'artifact-004',
        title: 'Schoolyard Toys & Greek Alphabet Blocks',
        titleTr: 'Okul Bahçesi Oyuncakları ve Yunan Alfabesi Küpleri',
        date: 'c. 1890–1920',
        category: 'objects',
        description:
            'A collection of antique wooden toys recovered during the 2013 restoration: a hand-carved spinning top, a cloth doll, and alphabet blocks featuring Greek letters. These objects offer a tender glimpse into the daily lives of children who once filled these corridors with laughter.',
        descriptionTr:
            '2013 restorasyonu sırasında bulunan antika ahşap oyuncak koleksiyonu: el oyması topaç, bez bebek ve Yunan harfleri taşıyan alfabe küpleri. Bu objeler, koridorları bir zamanlar kahkahalarla dolduran çocukların günlük yaşamlarına dokunaklı bir pencere açmaktadır.',
        imageSrc: '/images/artifacts/vintage-school-toys.png',
        provenance: 'Restorasyon Bulguları, Katalog No. REST-2013-OBJ-12',
    },
];
