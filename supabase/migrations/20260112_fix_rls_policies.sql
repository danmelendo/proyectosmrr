-- Restore RLS policies needed for edge function to work with service role

-- Add INSERT policy for clients table (service role will bypass, but allows explicit access)
CREATE POLICY "Service role can insert clients"
ON public.clients
FOR INSERT
TO service_role
WITH CHECK (true);

-- Add INSERT policy for contact_rate_limits (service role will bypass, but allows explicit access)
CREATE POLICY "Service role can insert rate limits"
ON public.contact_rate_limits
FOR INSERT
TO service_role
WITH CHECK (true);

-- Add SELECT policy for contact_rate_limits to allow the function to read rate limit data
CREATE POLICY "Service role can select rate limits"
ON public.contact_rate_limits
FOR SELECT
TO service_role
USING (true);
