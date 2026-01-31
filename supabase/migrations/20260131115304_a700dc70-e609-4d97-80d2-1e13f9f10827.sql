-- Add payment_url column to invoices for Paylink integration
ALTER TABLE public.invoices 
ADD COLUMN IF NOT EXISTS payment_url TEXT,
ADD COLUMN IF NOT EXISTS provider VARCHAR(50) DEFAULT 'paylink',
ADD COLUMN IF NOT EXISTS provider_invoice_id TEXT;

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_invoices_provider_invoice_id ON public.invoices(provider_invoice_id);

-- Comment for documentation
COMMENT ON COLUMN public.invoices.payment_url IS 'Paylink payment URL for customer to complete payment';
COMMENT ON COLUMN public.invoices.provider IS 'Payment provider (paylink, tap, etc)';
COMMENT ON COLUMN public.invoices.provider_invoice_id IS 'External invoice ID from payment provider';