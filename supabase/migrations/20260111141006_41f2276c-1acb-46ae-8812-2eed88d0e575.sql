-- Add INSERT policy for clients table to allow contact form submissions
CREATE POLICY "Allow anonymous contact form submissions"
ON public.clients
FOR INSERT
TO anon
WITH CHECK (true);

-- Add INSERT policy for contact_rate_limits to enable spam protection
CREATE POLICY "Allow anonymous rate limit tracking"
ON public.contact_rate_limits
FOR INSERT
TO anon
WITH CHECK (true);