-- Create payment_transactions table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.payment_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  offer_title TEXT NOT NULL,
  amount INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'SAR',
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  paylink_transaction_no TEXT,
  tap_transaction_id TEXT,
  tamara_order_id TEXT,
  stc_pay_transaction_id TEXT,
  status TEXT NOT NULL DEFAULT 'INITIATED',
  payment_method TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own transactions" 
ON public.payment_transactions 
FOR SELECT 
USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Anyone can insert transactions" 
ON public.payment_transactions 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Service role can update transactions" 
ON public.payment_transactions 
FOR UPDATE 
USING (true);

-- Add trigger for updated_at
CREATE TRIGGER update_payment_transactions_updated_at
BEFORE UPDATE ON public.payment_transactions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();