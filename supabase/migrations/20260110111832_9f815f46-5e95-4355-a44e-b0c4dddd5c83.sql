-- Create table to track contact form submissions for rate limiting
CREATE TABLE public.contact_rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address TEXT NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for faster IP lookups
CREATE INDEX idx_contact_rate_limits_ip_time ON public.contact_rate_limits (ip_address, submitted_at DESC);

-- Enable RLS (only edge function with service role can access)
ALTER TABLE public.contact_rate_limits ENABLE ROW LEVEL SECURITY;

-- No policies needed - only service role can access this table

-- Create function to clean up old rate limit entries (older than 24 hours)
CREATE OR REPLACE FUNCTION public.cleanup_old_rate_limits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.contact_rate_limits
  WHERE submitted_at < now() - INTERVAL '24 hours';
END;
$$;