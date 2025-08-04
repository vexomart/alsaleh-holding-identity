-- Add STC Pay specific columns to payment_transactions table
ALTER TABLE public.payment_transactions 
ADD COLUMN IF NOT EXISTS stc_pay_reference TEXT;

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_payment_transactions_stc_pay_reference 
ON public.payment_transactions(stc_pay_reference);