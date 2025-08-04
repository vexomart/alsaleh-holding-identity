-- Create domains table for domain requests
CREATE TABLE public.domain_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  domain_name TEXT NOT NULL,
  extension TEXT NOT NULL,
  full_domain TEXT NOT NULL,
  price DECIMAL(10,2),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'approved', 'rejected', 'registered')),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  customer_company TEXT,
  additional_notes TEXT,
  namecheap_order_id TEXT,
  registration_period INTEGER DEFAULT 1,
  auto_renew BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.domain_requests ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own domain requests" 
ON public.domain_requests 
FOR SELECT 
USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Anyone can create domain requests" 
ON public.domain_requests 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update their own domain requests" 
ON public.domain_requests 
FOR UPDATE 
USING (auth.uid() = user_id OR user_id IS NULL);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_domain_requests_updated_at
BEFORE UPDATE ON public.domain_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create domain prices table
CREATE TABLE public.domain_prices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  extension TEXT NOT NULL UNIQUE,
  price DECIMAL(10,2) NOT NULL,
  is_popular BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.domain_prices ENABLE ROW LEVEL SECURITY;

-- Create policy for domain prices (public read)
CREATE POLICY "Domain prices are viewable by everyone" 
ON public.domain_prices 
FOR SELECT 
USING (is_active = true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_domain_prices_updated_at
BEFORE UPDATE ON public.domain_prices
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial domain prices
INSERT INTO public.domain_prices (extension, price, is_popular) VALUES
('.com', 50.00, true),
('.net', 45.00, false),
('.org', 40.00, false),
('.info', 35.00, false),
('.sa', 150.00, true),
('.com.sa', 120.00, false),
('.biz', 30.00, false),
('.me', 55.00, false),
('.co', 60.00, false),
('.io', 80.00, true);