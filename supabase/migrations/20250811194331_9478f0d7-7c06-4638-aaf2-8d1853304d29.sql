-- Add contract_data and contract_id to payment_transactions for contract issuance post-payment
ALTER TABLE public.payment_transactions
  ADD COLUMN IF NOT EXISTS contract_data jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS contract_id uuid;

-- Index for faster lookups by paylink_transaction_no and contract_id
CREATE INDEX IF NOT EXISTS idx_payment_transactions_paylink_no ON public.payment_transactions (paylink_transaction_no);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_contract_id ON public.payment_transactions (contract_id);
