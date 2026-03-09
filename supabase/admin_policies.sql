-- Enable Full Access for Authenticated (Admin) Users

CREATE POLICY "Enable all for authenticated users" ON public.archive_categories FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for authenticated users" ON public.archive_subcategories FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for authenticated users" ON public.artifacts FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for authenticated users" ON public.past_events FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for authenticated users" ON public.venue_events FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for authenticated users" ON public.history_timeline FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for authenticated users" ON public.page_content FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Enable Media Bucket Uploads
CREATE POLICY "Enable auth access to media" ON storage.objects FOR ALL TO authenticated USING (bucket_id = 'media') WITH CHECK (bucket_id = 'media');
