-- Clear fake lh3.googleusercontent.com placeholder URLs from venue_events
-- These are AI-generated placeholder URLs that don't resolve to real images.
-- After running this, upload real venue photos via the Admin Panel.

UPDATE venue_events
SET image_url = NULL
WHERE image_url LIKE '%lh3.googleusercontent.com/aida-public/%';

UPDATE venue_events
SET thumbnail_images = NULL
WHERE thumbnail_images::text LIKE '%lh3.googleusercontent.com/aida-public/%';
