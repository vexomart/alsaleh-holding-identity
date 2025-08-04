-- Add Paylink-specific columns to payment_transactions table
ALTER TABLE public.payment_transactions 
ADD COLUMN IF NOT EXISTS paylink_transaction_no TEXT;

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_payment_transactions_paylink_transaction_no 
ON public.payment_transactions(paylink_transaction_no);