-- TEMPORARY Migration Policies to bypass Email Auth issues
-- Run this, then I will run the migration script, then we will delete these.
CREATE POLICY "TEMP_MIGRATION_archive_categories" ON public.archive_categories FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "TEMP_MIGRATION_archive_subcategories" ON public.archive_subcategories FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "TEMP_MIGRATION_artifacts" ON public.artifacts FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "TEMP_MIGRATION_past_events" ON public.past_events FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "TEMP_MIGRATION_venue_events" ON public.venue_events FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "TEMP_MIGRATION_history_timeline" ON public.history_timeline FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "TEMP_MIGRATION_page_content" ON public.page_content FOR ALL TO anon USING (true) WITH CHECK (true);
