-- Create payment methods table for managing payment gateways
CREATE TABLE IF NOT EXISTS public.payment_methods (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  provider TEXT NOT NULL UNIQUE,
  icon_name TEXT NOT NULL,
  api_key TEXT,
  secret_key TEXT,
  webhook_secret TEXT,
  is_active BOOLEAN NOT NULL DEFAULT false,
  is_live_mode BOOLEAN NOT NULL DEFAULT false,
  configuration JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;

-- Create policies for payment methods
CREATE POLICY "Admins can manage payment methods" 
ON public.payment_methods 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_payment_methods_updated_at
BEFORE UPDATE ON public.payment_methods
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default payment methods
INSERT INTO public.payment_methods (name, name_ar, provider, icon_name, configuration) VALUES
('Tabby', 'تاب', 'tabby', 'CreditCard', '{
  "supported_cards": ["visa", "mastercard", "mada"],
  "supported_wallets": ["apple_pay", "stc_pay"],
  "currencies": ["SAR"],
  "min_amount": 1,
  "max_amount": 50000,
  "description": "دفع آمن بالفيزا ومدى وApple Pay"
}'),
('Tamara', 'تمارا', 'tamara', 'Calendar', '{
  "payment_types": ["pay_in_3", "pay_in_4", "pay_next_month"],
  "currencies": ["SAR"],
  "min_amount": 100,
  "max_amount": 10000,
  "installments": [3, 4],
  "description": "اشتري الآن وادفع لاحقاً بأقساط مريحة"
}'),
('Bank Transfer', 'حوالة بنكية', 'bank_transfer', 'Building2', '{
  "bank_name": "البنك الأهلي السعودي",
  "iban": "SA1980000161608016071040",
  "account_number": "161000010006086071040",
  "account_holder": "شركة علي صالح الشهري القابضة",
  "processing_time": "1-3 أيام عمل",
  "requires_receipt": true
}')
ON CONFLICT (provider) DO NOTHING;