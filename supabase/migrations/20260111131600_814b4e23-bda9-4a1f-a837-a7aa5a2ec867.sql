-- Drop overly permissive policies - edge function uses service role which bypasses RLS
DROP POLICY IF EXISTS "Anyone can select rate limit entries" ON public.contact_rate_limits;
DROP POLICY IF EXISTS "Anyone can insert rate limit entries" ON public.contact_rate_limits;

-- Add admin-only policy for viewing rate limits if needed
CREATE POLICY "Only admins can view rate limits"
ON public.contact_rate_limits
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));