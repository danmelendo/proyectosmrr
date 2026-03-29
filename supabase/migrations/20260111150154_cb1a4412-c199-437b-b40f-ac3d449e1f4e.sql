-- Remove unnecessary public INSERT policies that bypass validation
-- The edge function uses service role key and handles all inserts with proper validation

DROP POLICY IF EXISTS "Allow anonymous contact form submissions" ON public.clients;
DROP POLICY IF EXISTS "Allow anonymous rate limit tracking" ON public.contact_rate_limits;