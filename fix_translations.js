import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://tvloakrlqazcadokliaf.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2bG9ha3JscWF6Y2Fkb2tsaWFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5NTMwODcsImV4cCI6MjA4ODUyOTA4N30.yU2-aCCeVG9nuSAYQba04LZjVBIHsL64Mae0HckzZRo";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const TRANSLATION_MAP = {
    "Caudalie Özel Lansmanı Galata Rum Okulu'nda!": {
        en: "Caudalie Special Launch at the Galata Greek School",
        el: "Ιδιωτική Παρουσίαση της Caudalie στο Ελληνικό Σχολείο Γαλατά"
    },
    "Esra Gülmen X Atasay Lansmanı": {
        en: "Esra Gülmen X Atasay Launch",
        el: "Παρουσίαση Esra Gülmen X Atasay"
    },
    "Adalar Konuşuyor: Irini Dimitriyadis": {
        en: "Islands Talk: Irini Dimitriyadis",
        el: "Οι Νήσοι Μιλούν: Ειρήνη Δημητριάδη"
    },
    "Adalar Konuşuyor: Rita Ender": {
        en: "Islands Talk: Rita Ender",
        el: "Οι Νήσοι Μιλούν: Ρίτα Έντερ"
    },
    "Adalar Konuşuyor: Fatih Özgüven": {
        en: "Islands Talk: Fatih Özgüven",
        el: "Οι Νήσοι Μιλούν: Φατίχ Οζγκιουβέν"
    },
    "Adalar Konuşuyor: Pelin Tan": {
        en: "Islands Talk: Pelin Tan",
        el: "Οι Νήσοι Μιλούν: Πελίν Ταν"
    },
    "Osmanlı Döneminde Adalı Rumlar": {
        en: "Greek Islanders in the Ottoman Era",
        el: "Έλληνες Νησιώτες κατά την Οθωμανική Περίοδο"
    },
    "Yetimhaneden Öğrenmek": {
        en: "Learning from the Orphanage",
        el: "Μαθαίνοντας από το Ορφανοτροφείο"
    },
    "Kayıp Vatan": {
        en: "Lost Homeland",
        el: "Χαμένη Πατρίδα"
    },
    "Tadı Damağımda Kaldı": {
        en: "An Unforgettable Taste",
        el: "Μια Αξέχαστη Γεύση"
    },
    "Sokrates Şimdi": {
        en: "Socrates Now",
        el: "Σωκράτης Τώρα"
    },
    "Düşünce Bahçesi: Melek Aksoy & Sinan Logie": {
        en: "Garden of Thought: Melek Aksoy & Sinan Logie",
        el: "Κήπος της Σκέψης: Melek Aksoy & Sinan Logie"
    },
    "Düşünce Bahçesi: Özge Ersoy": {
        en: "Garden of Thought: Özge Ersoy",
        el: "Κήπος της Σκέψης: Özge Ersoy"
    },
    "Düşünce Bahçesi: Ali Taptık": {
        en: "Garden of Thought: Ali Taptık",
        el: "Κήπος της Σκέψης: Ali Taptık"
    },
    "Haliç Üniversitesi Mimarlık ve Kent Çalışmaları Programı": {
        en: "Haliç University Architecture and Urban Studies Program",
        el: "Πρόγραμμα Αρχιτεκτονικής και Αστικών Σπουδών Πανεπιστημίου Haliç"
    },
    "Karamanlı Rum Ortodoks Bir Askerin Seferberlik Hatıraları": {
        en: "Mobilization Memoirs of a Karamanli Greek Orthodox Soldier",
        el: "Απομνημονεύματα Επιστράτευσης ενός Καραμανλή Ρωμιού Ορθόδοξου Στρατιώτη"
    },
    "EU ERASMUS+ NARRATE Projesi": {
        en: "EU ERASMUS+ NARRATE Project",
        el: "Έργο EU ERASMUS+ NARRATE"
    },
    "Galata Rum Okulu Mezunlar Buluşması 2018": {
        en: "Galata Greek School Alumni Reunion 2018",
        el: "Συνάντηση Αποφοίτων Ελληνικού Σχολείου Γαλατά 2018"
    },
    "Galata Rum Okulu Mezunlar Gecesi 2014": {
        en: "Galata Greek School Alumni Night 2014",
        el: "Βραδιά Αποφοίτων Ελληνικού Σχολείου Γαλατά 2014"
    },
    "Stefanos Yerasimos’un izinde: İstanbul ve Osmanlı tarihi": {
        en: "In the Footsteps of Stefanos Yerasimos: History of Istanbul and the Ottoman Empire",
        el: "Στα Βήματα του Στέφανου Γεράσιμου: Ιστορία της Κωνσταντινούπολης και της Οθωμανικής Αυτοκρατορίας"
    },
    "İstanbul'da Filantropik Yaklaşımlar": {
        en: "Philanthropic Approaches in Istanbul",
        el: "Φιλανθρωπικές Προσεγγίσεις στην Κωνσταντινούπολη"
    },
    "Alacakaranlıkta Günden Güne": {
        en: "Day by Day in the Twilight",
        el: "Μέρα με τη Μέρα στο Λυκόφως"
    },
    "İki Satır Arasında - 1. Seans": {
        en: "Between Two Lines - Session 1",
        el: "Μεταξύ Δύο Γραμμών - 1η Συνεδρία"
    },
    "İki Satır Arasında - 2. Seans": {
        en: "Between Two Lines - Session 2",
        el: "Μεταξύ Δύο Γραμμών - 2η Συνεδρία"
    },
    "İki Satır Arasında - 3. Seans": {
        en: "Between Two Lines - Session 3",
        el: "Μεταξύ Δύο Γραμμών - 3η Συνεδρία"
    },
    "İstanbul'un Yeni Tarihi: 8500 yıl önce Yenikapı'da Yaşam": {
        en: "The New History of Istanbul: Life in Yenikapı 8500 Years Ago",
        el: "Η Νέα Ιστορία της Κωνσταντινούπολης: Η Ζωή στο Γενίκαπι πριν από 8500 Χρόνια"
    }
};

function decodeHtmlEntities(text) {
    if (!text) return '';
    return text
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'")
        .replace(/&#39;/g, "'")
        .replace(/&#8211;/g, '–')
        .replace(/&#8212;/g, '—')
        .replace(/&ndash;/g, '–')
        .replace(/&mdash;/g, '—');
}

async function fixPastEvents() {
    console.log("Fetching past events...");
    const { data: events, error } = await supabase.from('past_events').select('*');
    
    if (error) {
        console.error("Error fetching events:", error.message);
        return;
    }
    
    console.log(`Processing ${events.length} past events...`);
    let updatedCount = 0;
    
    for (const event of events) {
        const cleanTitleTr = decodeHtmlEntities(event.title_tr).trim();
        let titleEn = decodeHtmlEntities(event.title_en).trim();
        let titleEl = decodeHtmlEntities(event.title_el).trim();
        
        // Strip out trailing " – Galata Rum Okulu" if present in titles
        const stripSuffix = (str) => {
            return str.replace(/\s*[–-]\s*Galata Rum Okulu/gi, "").trim();
        };
        
        const trBase = stripSuffix(cleanTitleTr);
        
        // Apply manual translation if exists
        if (TRANSLATION_MAP[trBase]) {
            titleEn = TRANSLATION_MAP[trBase].en;
            titleEl = TRANSLATION_MAP[trBase].el;
        } else {
            // Otherwise, decode HTML entities and strip suffix
            titleEn = stripSuffix(titleEn);
            titleEl = stripSuffix(titleEl);
            
            // If English or Greek is identical to Turkish, clean them up
            if (titleEn === cleanTitleTr || titleEn === trBase) {
                // If it's a known pattern or untranslated, just leave it cleaned
                titleEn = trBase;
            }
            if (titleEl === cleanTitleTr || titleEl === trBase) {
                titleEl = trBase;
            }
        }
        
        const cleanTypeTr = decodeHtmlEntities(event.type_tr || '').trim();
        const cleanTypeEn = decodeHtmlEntities(event.type_en || '').trim();
        const cleanTypeEl = decodeHtmlEntities(event.type_el || '').trim();
        
        // Update row
        const { error: updateError } = await supabase
            .from('past_events')
            .update({
                title_tr: trBase,
                title_en: titleEn,
                title_el: titleEl,
                type_tr: cleanTypeTr,
                type_en: cleanTypeEn,
                type_el: cleanTypeEl
            })
            .eq('id', event.id);
            
        if (updateError) {
            console.error(`Error updating event ${event.id}:`, updateError.message);
        } else {
            updatedCount++;
        }
    }
    
    console.log(`Successfully cleaned and updated ${updatedCount} past events.`);
}

async function fixArtifacts() {
    console.log("Fetching artifacts...");
    const { data: artifacts, error } = await supabase.from('artifacts').select('*');
    
    if (error) {
        console.error("Error fetching artifacts:", error.message);
        return;
    }
    
    console.log(`Processing ${artifacts.length} artifacts...`);
    let updatedCount = 0;
    
    for (const artifact of artifacts) {
        const titleTr = decodeHtmlEntities(artifact.title_tr).trim();
        const titleEn = decodeHtmlEntities(artifact.title_en).trim();
        const titleEl = decodeHtmlEntities(artifact.title_el).trim();
        
        const descTr = decodeHtmlEntities(artifact.description_tr || '').trim();
        let descEn = decodeHtmlEntities(artifact.description_en || '').trim();
        let descEl = decodeHtmlEntities(artifact.description_el || '').trim();
        
        // Clean descriptions that are duplicates of Turkish
        // E.g. "Beyoğlu Foto Palas Özel Kız Lisesi Öğrencileri - Tarihî Fotoğraf"
        // Let's translate basic suffix: " - Tarihî Fotoğraf" -> " - Historical Photo" / " - Ιστορική Φωτογραφία"
        const translatePhotoDesc = (desc) => {
            if (!desc) return '';
            let en = desc;
            let el = desc;
            
            if (desc.includes(" - Tarihî Fotoğraf")) {
                const base = desc.replace(" - Tarihî Fotoğraf", "").trim();
                // Simple translate rules for common terms
                let enBase = base;
                let elBase = base;
                
                if (base === "Beyoğlu Foto Palas Özel Kız Lisesi Öğrencileri") {
                    enBase = "Students of Beyoğlu Foto Palas Private Girls High School";
                    elBase = "Μαθήτριες του Ιδιωτικού Λυκείου Θηλέων Φωτό Παλάς Πέραν";
                } else if (base === "İstanbul Rum Okulları - Öğrenci Grubu") {
                    enBase = "Istanbul Greek Schools - Student Group";
                    elBase = "Ελληνικά Σχολεία Κωνσταντινούπολης - Ομάδα Μαθητών";
                } else if (base === "Büyükada Rum Yetimhanesi Öğrencileri") {
                    enBase = "Prinkipo Greek Orphanage Students";
                    elBase = "Μαθητές του Ελληνικού Ορφανοτροφείου Πριγκήπου";
                } else if (base === "Gökçeada (İmroz) Rum Okulu") {
                    enBase = "Gökçeada (Imbros) Greek School";
                    elBase = "Ελληνικό Σχολείο Ίμβρου";
                } else if (base === "Gökçeada Rum Okulu - 1937-1938 Eğitim Yılı") {
                    enBase = "Gökçeada Greek School - 1937-1938 Academic Year";
                    elBase = "Ελληνικό Σχολείο Ίμβρου - Σχολικό Έτος 1937-1938";
                } else if (base === "Kurtuluş Rum Okulu Öğretmenleri") {
                    enBase = "Teachers of Kurtuluş Greek School";
                    elBase = "Δάσκαλοι του Ελληνικού Σχολείου Ταταούλων";
                } else if (base === "Kurtuluş Rum Okulu Sınıf Fotoğrafı") {
                    enBase = "Kurtuluş Greek School Classroom Photo";
                    elBase = "Φωτογραφία Τάξης του Ελληνικού Σχολείου Ταταούλων";
                } else if (base === "Kadın Öğretmenler") {
                    enBase = "Female Teachers";
                    elBase = "Δασκάλες";
                }
                
                // Check for year
                const yearMatch = desc.match(/\b\d{4}(-\d{4})?\b/);
                const yearStr = yearMatch ? ` ${yearMatch[0]}` : "";
                
                en = `${enBase} - Historical Photo${yearStr}`;
                el = `${elBase} - Ιστορική Φωτογραφία${yearStr}`;
            }
            return { en, el };
        };
        
        if (descTr && (descEn === descTr || descEl === descTr)) {
            const translations = translatePhotoDesc(descTr);
            descEn = translations.en;
            descEl = translations.el;
        }
        
        // Update row
        const { error: updateError } = await supabase
            .from('artifacts')
            .update({
                title_tr: titleTr,
                title_en: titleEn,
                title_el: titleEl,
                description_tr: descTr,
                description_en: descEn,
                description_el: descEl
            })
            .eq('id', artifact.id);
            
        if (updateError) {
            console.error(`Error updating artifact ${artifact.id}:`, updateError.message);
        } else {
            updatedCount++;
        }
    }
    
    console.log(`Successfully cleaned and updated ${updatedCount} artifacts.`);
}

async function runUpdates() {
    console.log("=== RUNNING DATABASE TRANSLATION CORRECTIONS ===");
    console.log("Signing in to obtain authenticated session...");
    const { error: authErr } = await supabase.auth.signInWithPassword({
        email: 'test_updater@galatarumokulu.org',
        password: 'TemporaryPassword123!'
    });
    
    if (authErr) {
        console.error("Auth sign-in failed. Updates cannot proceed:", authErr.message);
        return;
    }
    
    console.log("Auth sign-in successful!");
    await fixPastEvents();
    await fixArtifacts();
    console.log("=== TRANSLATION CORRECTIONS COMPLETE ===");
}

runUpdates();

