-- Drop the overly permissive DELETE policy
DROP POLICY IF EXISTS "Allow delete for cleanup" ON public.contact_rate_limits;

-- Add admin-only DELETE policy (cleanup function uses SECURITY DEFINER, bypasses RLS)
CREATE POLICY "Only admins can delete rate limits"
ON public.contact_rate_limits
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));