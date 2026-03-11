-- ============================================================
-- Seed history_timeline with the 8 canonical historical events
-- Run this in Supabase SQL Editor
-- ============================================================

INSERT INTO history_timeline (year, title_tr, title_en, title_el, description_tr, description_en, description_el, order_index, status)
VALUES
  ('1885', 'Kuruluş', 'Foundation', 'Ίδρυση',
   'Galata Rum Okulu kuruldu.',
   'Galata Greek School was founded.',
   'Ιδρύθηκε το Ελληνικό Σχολείο Γαλατά.',
   1, 'published'),

  ('1910', 'Resmi Açılış', 'Official Opening', 'Επίσημα Εγκαίνια',
   '2 Haziran 1910 Çarşamba günü saat 11:00''de resmi açılış gerçekleştirildi.',
   'The official opening took place on Wednesday, June 2, 1910, at 11:00 AM.',
   'Τα επίσημα εγκαίνια πραγματοποιήθηκαν την Τετάρτη 2 Ιουνίου 1910.',
   2, 'published'),

  ('1958', 'Cephe Düzenlemesi', 'Facade Arrangement', 'Διαμόρφωση Πρόσοψης',
   'Ana cadde genişletilmesi sırasında binanın cephe kot seviyesi düzenlendi.',
   'The facade elevation of the building was arranged during the expansion of the main street.',
   'Το επίπεδο υψόμετρου της πρόσοψης του κτιρίου ρυθμίστηκε.',
   3, 'published'),

  ('1988', 'Eğitim Faaliyetlerinin Askıya Alınması', 'Suspension of Educational Activities', 'Αναστολή Εκπαιδευτικών Δραστηριοτήτων',
   'Demografik değişimler nedeniyle eğitim faaliyetleri askıya alındı.',
   'Educational activities were suspended due to demographic changes.',
   'Οι εκπαιδευτικές δραστηριότητες ανεστάλησαν.',
   4, 'published'),

  ('2000', 'Anaokulu Dönemi', 'Kindergarten Era', 'Εποχή Νηπιαγωγείου',
   '2000-2007 yılları arasında bina anaokulu olarak hizmet verdi.',
   'The building served as a kindergarten between 2000 and 2007.',
   'Το κτίριο λειτούργησε ως νηπιαγωγείο μεταξύ 2000 και 2007.',
   5, 'published'),

  ('2012', 'İade', 'Return', 'Επιστροφή',
   'Bina İstanbul Rum Cemaati''ne iade edildi.',
   'The building was returned to the Istanbul Greek Community.',
   'Το κτίριο επιστράφηκε στην Ελληνική Κοινότητα.',
   6, 'published'),

  ('2015', 'Okul İşlevinin Sona Ermesi', 'End of School Function', 'Τέλος Σχολικής Λειτουργίας',
   'Bina resmi olarak okul işlevi görmeyi bıraktı.',
   'The building officially ceased to function as a school.',
   'Το κτίριο έπαψε επίσημα να λειτουργεί ως σχολείο.',
   7, 'published'),

  ('2019', 'Restorasyon Başlangıcı', 'Start of Restoration', 'Έναρξη Ανακαίνισης',
   'Kültür ve eğitim merkezi olarak dönüştürmek için büyük restorasyon projesi başlatıldı.',
   'A major restoration project was initiated to transform it into a cultural and educational center.',
   'Ξεκίνησε ένα μεγάλο έργο ανακαίνισης.',
   8, 'published');
