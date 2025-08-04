-- Add Tamara-specific columns to payment_transactions table
ALTER TABLE public.payment_transactions 
ADD COLUMN IF NOT EXISTS tamara_order_id TEXT;

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_payment_transactions_tamara_order_id 
ON public.payment_transactions(tamara_order_id);