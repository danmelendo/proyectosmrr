-- Remove the public INSERT policy that allows anyone to insert
-- The edge function uses service role key to bypass RLS, so this is safe
DROP POLICY IF EXISTS "Anyone can submit contact form" ON public.clients;