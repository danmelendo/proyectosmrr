-- Create clients table to store contact form submissions
CREATE TABLE public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  surname TEXT,
  phone TEXT,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT,
  interest_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  read BOOLEAN NOT NULL DEFAULT false,
  notes TEXT
);

-- Enable RLS on clients
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- Only admins can view clients
CREATE POLICY "Admins can view all clients"
ON public.clients
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can update clients
CREATE POLICY "Admins can update clients"
ON public.clients
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can delete clients
CREATE POLICY "Admins can delete clients"
ON public.clients
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Allow anonymous inserts from contact form (public endpoint)
CREATE POLICY "Anyone can submit contact form"
ON public.clients
FOR INSERT
WITH CHECK (true);