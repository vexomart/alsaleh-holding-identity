-- =====================================================
-- PHASE WALLET-0: Complete Wallet Module
-- =====================================================

-- 1) Add reserved_balance to customer_wallets if not exists
ALTER TABLE public.customer_wallets 
ADD COLUMN IF NOT EXISTS reserved_balance numeric DEFAULT 0;

-- 2) Create payment_methods table
CREATE TABLE IF NOT EXISTS public.payment_methods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES public.tenants(id),
  user_id uuid, -- nullable for tenant-wide methods
  type text NOT NULL CHECK (type IN ('card', 'mada', 'visa', 'bank_transfer', 'wallet')),
  label_ar text NOT NULL,
  label_en text NOT NULL,
  is_enabled boolean DEFAULT true,
  is_default boolean DEFAULT false,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 3) Create bank_transfer_requests table
CREATE TABLE IF NOT EXISTS public.bank_transfer_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES public.tenants(id),
  user_id uuid NOT NULL,
  wallet_id uuid REFERENCES public.customer_wallets(id),
  amount numeric NOT NULL CHECK (amount > 0),
  currency text DEFAULT 'SAR',
  bank_name text NOT NULL,
  iban text NOT NULL,
  account_holder_name text,
  reference_code text UNIQUE,
  receipt_media_url text,
  status text DEFAULT 'submitted' CHECK (status IN ('submitted', 'under_review', 'approved', 'rejected')),
  reviewer_user_id uuid,
  reviewer_notes text,
  rejection_reason text,
  processed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 4) Enable RLS
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bank_transfer_requests ENABLE ROW LEVEL SECURITY;

-- 5) RLS Policies for payment_methods
CREATE POLICY "Users can view own payment methods"
ON public.payment_methods FOR SELECT
USING (user_id = auth.uid() OR (user_id IS NULL AND tenant_id IS NOT NULL));

CREATE POLICY "Users can manage own payment methods"
ON public.payment_methods FOR ALL
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can manage all payment methods"
ON public.payment_methods FOR ALL
USING (is_admin(auth.uid(), tenant_id));

-- 6) RLS Policies for bank_transfer_requests
CREATE POLICY "Users can view own bank transfers"
ON public.bank_transfer_requests FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can create own bank transfers"
ON public.bank_transfer_requests FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can manage all bank transfers"
ON public.bank_transfer_requests FOR ALL
USING (is_admin(auth.uid(), tenant_id));

-- 7) Add wallet permissions
INSERT INTO public.permissions (module, name, name_ar, description) VALUES
  ('wallet', 'wallet.view_own', 'عرض المحفظة الخاصة', 'View own wallet balance and transactions'),
  ('wallet', 'wallet.topup', 'شحن المحفظة', 'Top up own wallet balance'),
  ('wallet', 'wallet.view_all', 'عرض جميع المحافظ', 'View all customer wallets (admin)'),
  ('wallet', 'wallet.manage', 'إدارة المحافظ', 'Manage wallet balances and adjustments'),
  ('wallet', 'transactions.view_all', 'عرض جميع المعاملات', 'View all financial transactions'),
  ('wallet', 'bank_transfer.submit', 'تقديم طلب تحويل بنكي', 'Submit bank transfer requests'),
  ('wallet', 'bank_transfer.review', 'مراجعة التحويلات البنكية', 'Review and approve/reject bank transfers')
ON CONFLICT DO NOTHING;

-- 8) Grant permissions to roles
INSERT INTO public.role_permissions (role, permission_id, tenant_id)
SELECT 'super_admin', p.id, NULL FROM public.permissions p WHERE p.module = 'wallet'
ON CONFLICT DO NOTHING;

INSERT INTO public.role_permissions (role, permission_id, tenant_id)
SELECT 'admin', p.id, NULL FROM public.permissions p WHERE p.module = 'wallet'
ON CONFLICT DO NOTHING;

INSERT INTO public.role_permissions (role, permission_id, tenant_id)
SELECT 'finance', p.id, NULL FROM public.permissions p WHERE p.module = 'wallet'
ON CONFLICT DO NOTHING;

INSERT INTO public.role_permissions (role, permission_id, tenant_id)
SELECT 'customer', p.id, NULL FROM public.permissions p 
WHERE p.name IN ('wallet.view_own', 'wallet.topup', 'bank_transfer.submit')
ON CONFLICT DO NOTHING;

-- 9) Function to generate unique reference code
CREATE OR REPLACE FUNCTION public.generate_bank_transfer_reference()
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  ref_code text;
BEGIN
  ref_code := 'BT-' || to_char(now(), 'YYYYMMDD') || '-' || 
              upper(substring(md5(random()::text) from 1 for 6));
  RETURN ref_code;
END;
$$;

-- 10) Trigger to auto-generate reference code
CREATE OR REPLACE FUNCTION public.set_bank_transfer_reference()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.reference_code IS NULL THEN
    NEW.reference_code := generate_bank_transfer_reference();
  END IF;
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_bank_transfer_reference
BEFORE INSERT OR UPDATE ON public.bank_transfer_requests
FOR EACH ROW EXECUTE FUNCTION public.set_bank_transfer_reference();

-- 11) Function to process approved bank transfer
CREATE OR REPLACE FUNCTION public.process_bank_transfer_approval(
  p_transfer_id uuid,
  p_reviewer_id uuid,
  p_notes text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_transfer bank_transfer_requests%ROWTYPE;
  v_wallet customer_wallets%ROWTYPE;
  v_transaction_id uuid;
BEGIN
  -- Get transfer request
  SELECT * INTO v_transfer FROM bank_transfer_requests WHERE id = p_transfer_id;
  
  IF v_transfer IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Transfer not found');
  END IF;
  
  IF v_transfer.status != 'submitted' AND v_transfer.status != 'under_review' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Transfer already processed');
  END IF;
  
  -- Get or create wallet
  SELECT * INTO v_wallet FROM customer_wallets WHERE customer_user_id = v_transfer.user_id;
  
  IF v_wallet IS NULL THEN
    INSERT INTO customer_wallets (customer_user_id, wallet_number, balance, currency, status)
    VALUES (v_transfer.user_id, 'W-' || substr(md5(random()::text), 1, 8), 0, 'SAR', 'active')
    RETURNING * INTO v_wallet;
  END IF;
  
  -- Create financial transaction
  INSERT INTO financial_transactions (
    customer_user_id, wallet_id, transaction_type, amount, currency,
    status, provider, description, description_ar
  ) VALUES (
    v_transfer.user_id, v_wallet.id, 'topup', v_transfer.amount, v_transfer.currency,
    'succeeded', 'bank_transfer', 'Bank transfer approved: ' || v_transfer.reference_code,
    'تحويل بنكي معتمد: ' || v_transfer.reference_code
  ) RETURNING id INTO v_transaction_id;
  
  -- Update wallet balance
  UPDATE customer_wallets 
  SET balance = balance + v_transfer.amount, updated_at = now()
  WHERE id = v_wallet.id;
  
  -- Update transfer status
  UPDATE bank_transfer_requests
  SET status = 'approved', 
      reviewer_user_id = p_reviewer_id,
      reviewer_notes = p_notes,
      processed_at = now()
  WHERE id = p_transfer_id;
  
  RETURN jsonb_build_object(
    'success', true, 
    'transaction_id', v_transaction_id,
    'new_balance', v_wallet.balance + v_transfer.amount
  );
END;
$$;

-- 12) Index for performance
CREATE INDEX IF NOT EXISTS idx_bank_transfers_user_id ON public.bank_transfer_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_bank_transfers_status ON public.bank_transfer_requests(status);
CREATE INDEX IF NOT EXISTS idx_payment_methods_user_id ON public.payment_methods(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_methods_tenant_id ON public.payment_methods(tenant_id);