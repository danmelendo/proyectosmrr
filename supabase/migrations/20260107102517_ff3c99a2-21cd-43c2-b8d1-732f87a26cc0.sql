-- Add tags column to blog_posts table
ALTER TABLE public.blog_posts 
ADD COLUMN tags text[] DEFAULT '{}' NOT NULL;