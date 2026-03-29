-- Convert existing category to categories array and remove tags
ALTER TABLE public.blog_posts 
  ADD COLUMN categories text[] NOT NULL DEFAULT '{}'::text[];

-- Migrate existing category data to categories array
UPDATE public.blog_posts 
SET categories = ARRAY[category];

-- Drop the old category column
ALTER TABLE public.blog_posts 
  DROP COLUMN category;

-- Drop the tags column
ALTER TABLE public.blog_posts 
  DROP COLUMN tags;