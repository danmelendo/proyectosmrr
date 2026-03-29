-- Add RLS policies for contact_rate_limits table
-- Allow anyone to insert rate limit entries (for tracking submissions)
CREATE POLICY "Anyone can insert rate limit entries"
ON public.contact_rate_limits
FOR INSERT
WITH CHECK (true);

-- Allow anyone to select rate limit entries (for checking limits)
CREATE POLICY "Anyone can select rate limit entries"
ON public.contact_rate_limits
FOR SELECT
USING (true);

-- Allow deletion through the cleanup function (runs as SECURITY DEFINER)
CREATE POLICY "Allow delete for cleanup"
ON public.contact_rate_limits
FOR DELETE
USING (true);