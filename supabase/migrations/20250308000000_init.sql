-- Schema Definitions for Galata Greek School CMS

-- 1. Create Archive Categories
CREATE TABLE public.archive_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name_tr TEXT NOT NULL,
    name_en TEXT NOT NULL,
    name_el TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Archive Sub-Categories
CREATE TABLE public.archive_subcategories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES public.archive_categories(id) ON DELETE CASCADE,
    name_tr TEXT NOT NULL,
    name_en TEXT NOT NULL,
    name_el TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create Artifacts
CREATE TABLE public.artifacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES public.archive_categories(id),
    sub_category_id UUID REFERENCES public.archive_subcategories(id),
    image_url TEXT,
    title_tr TEXT NOT NULL,
    title_en TEXT NOT NULL,
    title_el TEXT NOT NULL,
    description_tr TEXT,
    description_en TEXT,
    description_el TEXT,
    provenance_tr TEXT,
    provenance_en TEXT,
    provenance_el TEXT,
    status TEXT CHECK (status IN ('draft', 'published')) DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create Past Events
CREATE TABLE public.past_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cover_image_url TEXT,
    thumbnail_images TEXT[],
    title_tr TEXT NOT NULL,
    title_en TEXT NOT NULL,
    title_el TEXT NOT NULL,
    event_date DATE NOT NULL,
    type_tr TEXT,
    type_en TEXT,
    type_el TEXT,
    status TEXT CHECK (status IN ('draft', 'published')) DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Create Venue Hire Events / Spaces
CREATE TABLE public.venue_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    image_url TEXT,
    title_tr TEXT NOT NULL,
    title_en TEXT NOT NULL,
    title_el TEXT NOT NULL,
    description_tr TEXT,
    description_en TEXT,
    description_el TEXT,
    status TEXT CHECK (status IN ('draft', 'published')) DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Create History Timeline
CREATE TABLE public.history_timeline (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    year TEXT NOT NULL,
    title_tr TEXT NOT NULL,
    title_en TEXT NOT NULL,
    title_el TEXT NOT NULL,
    description_tr TEXT,
    description_en TEXT,
    description_el TEXT,
    order_index INTEGER DEFAULT 0,
    status TEXT CHECK (status IN ('draft', 'published')) DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Create Static Page Content
CREATE TABLE public.page_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_key TEXT NOT NULL,
    section_key TEXT NOT NULL,
    content_tr TEXT,
    content_en TEXT,
    content_el TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(page_key, section_key)
);

-- Enable RLS (Row Level Security) - allow public read access to 'published' items, admin for all
ALTER TABLE public.archive_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.archive_subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artifacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.past_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venue_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.history_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_content ENABLE ROW LEVEL SECURITY;

-- Create Policies for Public Read Access
CREATE POLICY "Public profiles are viewable by everyone." ON public.archive_categories FOR SELECT USING (true);
CREATE POLICY "Public profiles are viewable by everyone." ON public.archive_subcategories FOR SELECT USING (true);
CREATE POLICY "Published artifacts are viewable by everyone." ON public.artifacts FOR SELECT USING (status = 'published');
CREATE POLICY "Published past events are viewable by everyone." ON public.past_events FOR SELECT USING (status = 'published');
CREATE POLICY "Published venue events are viewable by everyone." ON public.venue_events FOR SELECT USING (status = 'published');
CREATE POLICY "Published history are viewable by everyone." ON public.history_timeline FOR SELECT USING (status = 'published');
CREATE POLICY "Page content is viewable by everyone." ON public.page_content FOR SELECT USING (true);

-- Create Storage Bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public media access" ON storage.objects FOR SELECT USING ( bucket_id = 'media' );
