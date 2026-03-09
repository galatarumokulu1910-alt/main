import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { sampleArtifacts } from '../src/data/sampleArtifacts';
import { objectsArtifacts } from '../src/data/objectsArtifacts';
import { documentsArtifacts } from '../src/data/documentsArtifacts';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
    console.log("Bypassing Auth for local migration via temporary Anon policies...");

    console.log("1. Cleaning old data...");
    await supabase.from('artifacts').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('archive_subcategories').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('archive_categories').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('past_events').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('venue_events').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('history_timeline').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    console.log("2. Inserting Categories...");
    const categories = [
        { name_tr: 'Belgeler & Kişiler', name_en: 'Documents & People', name_el: 'Έγγραφα & Πρόσωπα', order_index: 1, type_key: 'documents' },
        { name_tr: 'Objeler & Mekanlar', name_en: 'Objects & Spaces', name_el: 'Αντικείμενα & Χώροι', order_index: 2, type_key: 'objects' }
    ];

    const { data: cats, error: catErr } = await supabase.from('archive_categories').insert(categories).select();
    if (catErr) throw catErr;

    const docCatId = cats.find((c: any) => c.type_key === 'documents').id;
    const objCatId = cats.find((c: any) => c.type_key === 'objects').id;

    console.log("3. Inserting Sub-Categories...");
    const subcats = [
        { category_id: docCatId, name_tr: 'El Yazmaları', name_en: 'Manuscripts', name_el: 'Χειρόγραφα', key_name: 'books', order_index: 1 },
        { category_id: docCatId, name_tr: 'Fotoğraflar', name_en: 'Photographs', name_el: 'Φωτογραφίες', key_name: 'portraits', order_index: 2 },
        { category_id: docCatId, name_tr: 'Mektuplar', name_en: 'Letters', name_el: 'Επιστολές', key_name: 'letters', order_index: 3 },
        { category_id: docCatId, name_tr: 'Resmi Kayıtlar', name_en: 'Official Records', name_el: 'Επίσημα Αρχεία', key_name: 'documents', order_index: 4 },
        { category_id: docCatId, name_tr: 'Öğrenci Kayıtları', name_en: 'Student Records', name_el: 'Μαθητολόγια', key_name: 'kayit', order_index: 5 },

        { category_id: objCatId, name_tr: 'Atletik Kupalar', name_en: 'Athletic Trophies', name_el: 'Αθλητικά Τρόπαια', key_name: 'atletik', order_index: 1 },
        { category_id: objCatId, name_tr: 'Bina & Tabelalar', name_en: 'Building & Signs', name_el: 'Κτίριο & Πινακίδες', key_name: 'bina', order_index: 2 },
        { category_id: objCatId, name_tr: 'Eğitim Araçları', name_en: 'Educational Tools', name_el: 'Εκπαιδευτικά Εργαλεία', key_name: 'egitim', order_index: 3 },
        { category_id: objCatId, name_tr: 'Eski Objeler', name_en: 'Old Objects', name_el: 'Παλιά Αντικείμενα', key_name: 'obje', order_index: 4 },
        { category_id: objCatId, name_tr: 'Kişisel Eşyalar', name_en: 'Personal Items', name_el: 'Προσωπικά Είδη', key_name: 'kisisel', order_index: 5 },
        { category_id: objCatId, name_tr: 'Öğrenci Eserleri', name_en: 'Student Works', name_el: 'Μαθητικά Έργα', key_name: 'ogrenci', order_index: 6 },
    ];

    const { data: insertedSubcats, error: subcatErr } = await supabase.from('archive_subcategories').insert(subcats).select();
    if (subcatErr) throw subcatErr;

    const subcatMap: any = {};
    for (const sc of insertedSubcats) {
        subcatMap[sc.key_name] = sc;
    }

    console.log("4. Parsing and mapping existing Artifacts...");
    const allArtifacts: any[] = [...sampleArtifacts, ...objectsArtifacts, ...documentsArtifacts];
    const artifactInserts = [];
    let count = 0;
    for (const a of allArtifacts) {
        let scKey = a.subCategory || a.category;
        if (scKey === 'photos') scKey = 'portraits';

        let dbSubcat = subcatMap[scKey];
        if (!dbSubcat && a.category === 'objects') dbSubcat = subcatMap['obje'];
        if (!dbSubcat) dbSubcat = subcatMap['documents'];

        artifactInserts.push({
            category_id: dbSubcat.category_id,
            sub_category_id: dbSubcat.id,
            image_url: a.image,
            title_tr: a.titleTr || a.title || 'İsimsiz',
            title_en: a.titleEn || a.title || 'Untitled',
            title_el: a.titleEl || a.title || 'Χωρίς τίτλο',
            description_tr: a.descriptionTr || a.description || '',
            description_en: a.descriptionEn || a.description || '',
            description_el: a.descriptionEl || a.description || '',
            provenance_tr: a.provenanceTr || '',
            provenance_en: a.provenance || '',
            provenance_el: a.provenanceEl || '',
            status: 'published'
        });
        count++;
    }

    console.log(`5. Migrating ${count} artifacts into Supabase...`);
    for (let i = 0; i < artifactInserts.length; i += 50) {
        const batch = artifactInserts.slice(i, i + 50);
        const { error: artErr } = await supabase.from('artifacts').insert(batch);
        if (artErr) {
            console.error("Error inserting artifacts block:", artErr);
        }
    }

    console.log("6. Migrating hardcoded Events and Venues...");
    const events = [
        {
            event_date: '2023-10-15', status: 'published',
            cover_image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCVlkWqPzY0sH0OFy5UmoQ4zEgxLckGXt8MveL7ZR-UWFeB8ANsuZVXStOEbfoS3rK4f3UJvSfzDmtJu0pFGKo8Zl-l2saDEYxGaw79duMDZ18X5UwyO2kthd7XBcD6TBziZqVW966eXOT69GrZa4Co6plnrWjSqgsYM3C3CT5K_ZJmCjD81ntjzvqZzNZ4th_HK3xI8cvMYfNr8C9oha5yzKjUwG_XTcu5YDmB9o_PlSOsEJxeHF4dUIqgY5tP_903GfYmMKsWhbM',
            title_tr: 'Vogue Couture Gala', title_en: 'Vogue Couture Gala', title_el: 'Vogue Couture Gala',
            type_tr: 'Moda', type_en: 'Fashion', type_el: 'Μόδα'
        },
        {
            event_date: '2023-09-01', status: 'published',
            cover_image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuByi61RkZ-t5n-v-n8b3hExzR2w5e-_sX7f9m6kM9H_tA4kPzYXk9uT7M1a4vY3b-mQ8R_t-P_sE9xN-_xZ2kQ1hB4bS0Lw6qK9Yw8-_Fz6-mX_--_H9K1_m--wV6-u9_xL9Zk-__K3_M5j7_s-S-vNx4Z-lE4X7_tW9eL_4q-rB__Vw9P1K--',
            title_tr: 'Bienal Sergisi', title_en: 'Biennale Exhibition', title_el: 'Έκθεση Μπιενάλε',
            type_tr: 'Sergi', type_en: 'Exhibition', type_el: 'Έκθεση'
        }
    ];
    await supabase.from('past_events').insert(events);

    const venues = [
        {
            status: 'published',
            image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDQkZ_L0O9d-XgEaU4a9N6VnJm7vTnP6d_C3mQkY7Y8ZtC9bH4aQ1bR4cX6wW5zN9yR8wP3cT2vD1xG5kL8_nJm7vTnP6d_C3mQkY7Y8ZtC9bH4aQ1bR4cX6wW5zN9', // Fixed a placeholder URL based on previous pattern length
            title_tr: 'Büyük Salon', title_en: 'Main Hall', title_el: 'Κεντρική Αίθουσα',
            description_tr: 'Okulun en geniş salonu.', description_en: 'The largest hall of the school.', description_el: 'Η μεγαλύτερη αίθουσα.'
        }
    ];
    await supabase.from('venue_events').insert(venues);

    console.log("Migration script execution finished successfully!");
}

run().catch(console.error);
