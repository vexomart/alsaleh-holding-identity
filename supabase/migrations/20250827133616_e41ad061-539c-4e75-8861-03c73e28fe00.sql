-- Create payment methods table for admin to manage payment options
CREATE TABLE public.payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  provider TEXT NOT NULL, -- stripe, paypal, stc_pay, tamara, etc.
  icon_name TEXT NOT NULL, -- lucide icon name
  api_key TEXT, -- encrypted API key
  secret_key TEXT, -- encrypted secret key
  webhook_secret TEXT, -- encrypted webhook secret
  is_active BOOLEAN DEFAULT true,
  is_live_mode BOOLEAN DEFAULT false, -- test vs live mode
  configuration JSONB DEFAULT '{}', -- additional config like currencies, limits
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;

-- Only admins can manage payment methods
CREATE POLICY "payment_methods_admin_only" 
ON public.payment_methods 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Everyone can view active payment methods
CREATE POLICY "payment_methods_public_view" 
ON public.payment_methods 
FOR SELECT 
USING (is_active = true);

-- Add trigger for updated_at
CREATE TRIGGER update_payment_methods_updated_at
  BEFORE UPDATE ON public.payment_methods
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default payment methods
INSERT INTO public.payment_methods (name, name_ar, provider, icon_name, is_active, configuration) VALUES
('Visa Card', 'فيزا', 'stripe', 'CreditCard', true, '{"currencies": ["SAR", "USD"], "min_amount": 10, "max_amount": 100000}'),
('Mastercard', 'ماستركارد', 'stripe', 'CreditCard', true, '{"currencies": ["SAR", "USD"], "min_amount": 10, "max_amount": 100000}'),
('Mada', 'مدى', 'stripe', 'CreditCard', true, '{"currencies": ["SAR"], "min_amount": 5, "max_amount": 50000}'),
('STC Pay', 'STC Pay', 'stc_pay', 'Smartphone', true, '{"currencies": ["SAR"], "min_amount": 1, "max_amount": 10000}'),
('Bank Transfer', 'حوالة بنكية', 'bank_transfer', 'Building2', true, '{"currencies": ["SAR"], "min_amount": 100, "max_amount": 1000000}'),
('Tamara', 'تمارا', 'tamara', 'Calendar', true, '{"currencies": ["SAR"], "min_amount": 100, "max_amount": 5000, "installments": [3, 6, 12]}');