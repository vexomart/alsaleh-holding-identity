-- Add reference_id column to wallet_transactions table
ALTER TABLE public.wallet_transactions 
ADD COLUMN reference_id TEXT;

-- Add index for better performance on reference_id searches
CREATE INDEX idx_wallet_transactions_reference_id 
ON public.wallet_transactions(reference_id) 
WHERE reference_id IS NOT NULL;