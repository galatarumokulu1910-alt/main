-- ============================================================
-- GALATA CMS — SEED ALL 6 PAST EVENTS
-- Run this in Supabase Dashboard → SQL Editor
--
-- past_events schema:
--   id UUID, cover_image_url TEXT, thumbnail_images TEXT[],
--   title_tr, title_en, title_el TEXT,
--   event_date DATE, type_tr, type_en, type_el TEXT,
--   status TEXT, created_at TIMESTAMPTZ
-- ============================================================

INSERT INTO public.past_events
    (cover_image_url,
     title_tr, title_en, title_el,
     type_tr, type_en, type_el,
     event_date,
     status)
VALUES

-- ── EVENT 1: Üç Ayaklı Kedi ──
('https://lh3.googleusercontent.com/aida-public/AB6AXuCVlkWqPzY0sH0OFy5UmoQ4zEgxLckGXt8MveL7ZR-UWFeB8ANsuZVXStOEbfoS3rK4f3UJvSfzDmtJu0pFGKo8Zl-l2saDEYxGaw79duMDZ18X5UwyO2kthd7XBcD6TBziZqVW966eXOT69GrZa4Co6plnrWjSqgsYM3C3CT5K_ZJmCjD81ntjzvqZzNZ4th_HK3xI8cvMYfNr8C9oha5yzKjUwG_XTcu5YDmB9o_PlSOsEJxeHF4dUIqgY5tP_903GfYmMKsWhbM',
 'Üç Ayaklı Kedi', 'Three-Legged Cat', 'Γάτα με Τρία Πόδια',
 'Sergi', 'Exhibition', 'Έκθεση',
 '2023-09-20', 'published'),

-- ── EVENT 2: Galata Mimarisi Üzerine ──
('https://lh3.googleusercontent.com/aida-public/AB6AXuA_l1spIuR1oc-oUzcKo8Mq1hiBTWuW_acz6vqzYtObFkcYBb1PrfJTn0KCanX0aDn6WooJc7VkrA2oNLBt6xKxsnVWX58qEC__obSZnXUH-r14fp6ppPoMLEvQkPvMHmUYAk8PKGPPztwbVx8ckFwjJOS_FpKYX0RlG-IkwCF0y4vFvO-FWXN4d12s1hnBg1ZW2sDMC2ryNK_fVYSzudQj4ngE_C9_Ef9PjOpeCRPK3AnAzSBit8cbxX_bFnIiw7gPSjmAolPHDPQ',
 'Galata Mimarisi Üzerine', 'On Galata Architecture', 'Περί Αρχιτεκτονικής της Γαλατάς',
 'Konferans', 'Conference', 'Συνέδριο',
 '2023-12-05', 'published'),

-- ── EVENT 3: Avlu Caz Geceleri ──
('https://lh3.googleusercontent.com/aida-public/AB6AXuCxr39dCa9LDaJp725Y4lz6WKj8zETatm83Xg4USyZWyRHl4sbbmSijNwMJW7SccTnL1o8jCV5oR_X9lvjp4RR59baw5WmEGE0fsiausBMYz93-mBdz2WEK4-7nWhDSanr0BT6Nd12dTLVQy6JOfZw_l0C2-DoV-xIFez3yyC06YYqfqgBz7nWA1t4AVKIJEP4lWW-C9kkMWPED8K8w97qS3PvepCpu-Y1pZIYzHc1K39hmq5JyhPrTIgr4LktVe9v7vOqIuSxOS_k',
 'Avlu Caz Geceleri', 'Courtyard Jazz Nights', 'Βραδιές Τζαζ στην Αυλή',
 'Konser', 'Concert', 'Συναυλία',
 '2024-06-15', 'published'),

-- ── EVENT 4: Özel Lansman Gecesi ──
('https://lh3.googleusercontent.com/aida-public/AB6AXuAyiKVqgDxFjYC6r2VIt0XEjpFivzm-WzyZERCqVovmq61aSkV0RLYP15QHIkpfrZh7qKkbHKOGngwZbYsovkctYUtz18gRFvcshL5yuVsmOUXYgEPZJMsGQsefBR1uyByH_LQP3Kz-x36EIbFRB6V2kT0rjrWBl3G0L2oJJT22E1WWrJHe9lDBoJ24HeHDMW0ZaRluubhsXpMlxc3iJq7FuHrfWMBuVKPfWH2TdkcZO5jQlvhGd02IthG9IvlCLe16bAPcjQ0rfkI',
 'Özel Lansman Gecesi', 'Special Launch Night', 'Ειδική Βραδιά Λανσαρίσματος',
 'Lansman', 'Launch', 'Λανσάρισμα',
 '2024-09-10', 'published'),

-- ── EVENT 5: Oda Müziği Geceleri ──
('https://lh3.googleusercontent.com/aida-public/AB6AXuB9HRZqTPQlQWVSec-lXNBjiL7-FQNwJNFe7tyEUZ3BWj6Sl0C90BKhB6IqfXzCNwLIWbVhacBgfxSfvXHP2nJOJL1d4HIeoDojwRBIT4cVzk6n__do6Loz4vxmOmAhdzG1Vw_bnNda5WBUtMC5yRFM1Ixf_HsAqTBjwpN85QLZd4h2sItZLWv8Wp5fxgg49ZkKKYLGZGXNih6F33ZnfOand2Ev_eDsVSkhadyvj0HKLhzr5_Y9peDOvFf7zEMNDUQVJ8Ajzf6Eo8Y',
 'Oda Müziği Geceleri', 'Chamber Music Evenings', 'Βραδιές Μουσικής Δωματίου',
 'Konser', 'Concert', 'Συναυλία',
 '2024-11-20', 'published'),

-- ── EVENT 6: Kent Diyalogları ──
('https://lh3.googleusercontent.com/aida-public/AB6AXuBbeokMO0HUBB8kwJZKoD_ylDT56ZwJeUiqmycXGeB6tN7pcqTm9lIUHX1GJulE73vkoxy5z2Zn2h884-jhHFr4xrbiPBWSUAglOyJ0e4qI5av8yJ_oPezRqyybcjfOwexz8gcZKbzlQql8pruGCgNDh4qDDpr_YCDinU9IGXpnrGX3CUuThMghwzq37GVMoxo5RFkPEwf-0JTEM6ZpuPK9vBudo63l4dHj1Gad_37Pza74B6wKyxaVPP6AKHNEg_tYUaVzIKNbiAg',
 'Kent Diyalogları', 'Urban Dialogues', 'Αστικοί Διάλογοι',
 'Panel', 'Panel', 'Πάνελ',
 '2025-03-15', 'published');

-- ── Verify: should show 6+ rows ──
SELECT title_tr, type_tr, event_date, status
FROM public.past_events
ORDER BY event_date DESC;
