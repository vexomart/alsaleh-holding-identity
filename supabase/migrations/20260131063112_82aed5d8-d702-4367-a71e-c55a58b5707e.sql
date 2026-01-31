-- Create invoice status enum
CREATE TYPE public.invoice_status AS ENUM ('draft', 'issued', 'paid', 'cancelled', 'overdue');

-- Create invoices table
CREATE TABLE public.invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES public.tenants(id) ON DELETE SET NULL,
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  customer_id uuid NOT NULL,
  invoice_number text NOT NULL,
  status invoice_status NOT NULL DEFAULT 'issued',
  subtotal numeric(12,2) NOT NULL DEFAULT 0,
  vat_rate numeric(5,2) NOT NULL DEFAULT 15.00,
  vat_amount numeric(12,2) NOT NULL DEFAULT 0,
  total numeric(12,2) NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'SAR',
  pdf_url text,
  notes text,
  due_date timestamptz,
  paid_at timestamptz,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(order_id),
  UNIQUE(invoice_number)
);

-- Enable RLS
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Admins can manage invoices"
ON public.invoices FOR ALL
USING (is_admin(auth.uid(), tenant_id));

CREATE POLICY "Customers can view own invoices"
ON public.invoices FOR SELECT
USING (customer_id = auth.uid());

-- Indexes for performance
CREATE INDEX idx_invoices_order_id ON public.invoices(order_id);
CREATE INDEX idx_invoices_customer_id ON public.invoices(customer_id);
CREATE INDEX idx_invoices_tenant_status ON public.invoices(tenant_id, status);
CREATE INDEX idx_invoices_created_at ON public.invoices(created_at DESC);

-- Trigger for updated_at
CREATE TRIGGER update_invoices_updated_at
BEFORE UPDATE ON public.invoices
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Function to generate invoice number
CREATE OR REPLACE FUNCTION public.generate_invoice_number(p_tenant_id uuid DEFAULT NULL)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  year_str text;
  next_num integer;
  invoice_num text;
BEGIN
  year_str := TO_CHAR(NOW(), 'YYYY');
  
  SELECT COALESCE(MAX(
    CAST(NULLIF(SPLIT_PART(invoice_number, '-', 3), '') AS integer)
  ), 0) + 1
  INTO next_num
  FROM public.invoices
  WHERE invoice_number LIKE 'INV-' || year_str || '-%'
    AND (p_tenant_id IS NULL OR tenant_id = p_tenant_id);
  
  invoice_num := 'INV-' || year_str || '-' || LPAD(next_num::text, 5, '0');
  
  RETURN invoice_num;
END;
$$;

-- Enable realtime for invoices
ALTER PUBLICATION supabase_realtime ADD TABLE public.invoices;