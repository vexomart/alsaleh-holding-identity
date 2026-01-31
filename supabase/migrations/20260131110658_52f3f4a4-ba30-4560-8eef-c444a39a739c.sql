
-- =====================================================
-- PHASE FIN-0: FINANCIAL CORE FOUNDATION (CLEAN)
-- =====================================================

-- 1. CUSTOMER UNIQUE IDENTIFIER
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS customer_uid TEXT UNIQUE;

CREATE INDEX IF NOT EXISTS idx_profiles_customer_uid ON public.profiles(customer_uid);

-- Function to generate customer UID
CREATE OR REPLACE FUNCTION public.generate_customer_uid()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  tenant_short TEXT;
  next_seq INTEGER;
  new_uid TEXT;
BEGIN
  SELECT COALESCE(SUBSTRING(t.slug, 1, 3), 'ASH')
  INTO tenant_short
  FROM public.tenants t
  WHERE t.id = NEW.tenant_id;
  
  IF tenant_short IS NULL THEN
    tenant_short := 'ASH';
  END IF;
  
  SELECT COALESCE(MAX(
    CAST(SUBSTRING(customer_uid FROM '[0-9]{6}$') AS INTEGER)
  ), 0) + 1
  INTO next_seq
  FROM public.profiles
  WHERE tenant_id = NEW.tenant_id OR (NEW.tenant_id IS NULL AND tenant_id IS NULL);
  
  new_uid := 'ASH-' || UPPER(tenant_short) || '-' || LPAD(next_seq::TEXT, 6, '0');
  
  NEW.customer_uid := new_uid;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_generate_customer_uid ON public.profiles;
CREATE TRIGGER trigger_generate_customer_uid
  BEFORE INSERT ON public.profiles
  FOR EACH ROW
  WHEN (NEW.customer_uid IS NULL)
  EXECUTE FUNCTION public.generate_customer_uid();

-- 2. LEDGER ACCOUNT TYPES ENUM
DO $$ BEGIN
  CREATE TYPE public.ledger_account_type AS ENUM ('asset', 'liability', 'revenue', 'expense', 'equity');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- 3. LEDGER ACCOUNTS TABLE
CREATE TABLE IF NOT EXISTS public.ledger_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  account_type public.ledger_account_type NOT NULL,
  parent_id UUID REFERENCES public.ledger_accounts(id),
  is_active BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(tenant_id, code)
);

ALTER TABLE public.ledger_accounts ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_ledger_accounts_tenant ON public.ledger_accounts(tenant_id);
CREATE INDEX IF NOT EXISTS idx_ledger_accounts_code ON public.ledger_accounts(code);
CREATE INDEX IF NOT EXISTS idx_ledger_accounts_type ON public.ledger_accounts(account_type);

-- 4. JOURNAL ENTRIES TABLE
CREATE TABLE IF NOT EXISTS public.journal_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  entry_number TEXT NOT NULL,
  reference_type TEXT,
  reference_id UUID,
  description TEXT,
  description_ar TEXT,
  posted_at TIMESTAMPTZ,
  is_posted BOOLEAN DEFAULT false,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(tenant_id, entry_number)
);

ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_journal_entries_tenant ON public.journal_entries(tenant_id);
CREATE INDEX IF NOT EXISTS idx_journal_entries_reference ON public.journal_entries(reference_type, reference_id);
CREATE INDEX IF NOT EXISTS idx_journal_entries_posted ON public.journal_entries(is_posted, posted_at);

-- 5. JOURNAL LINES TABLE
CREATE TABLE IF NOT EXISTS public.journal_lines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id UUID NOT NULL REFERENCES public.journal_entries(id) ON DELETE CASCADE,
  account_id UUID NOT NULL REFERENCES public.ledger_accounts(id),
  debit NUMERIC(15, 2) DEFAULT 0 CHECK (debit >= 0),
  credit NUMERIC(15, 2) DEFAULT 0 CHECK (credit >= 0),
  currency TEXT DEFAULT 'SAR',
  description TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT check_debit_or_credit CHECK (
    (debit > 0 AND credit = 0) OR (credit > 0 AND debit = 0) OR (debit = 0 AND credit = 0)
  )
);

ALTER TABLE public.journal_lines ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_journal_lines_entry ON public.journal_lines(entry_id);
CREATE INDEX IF NOT EXISTS idx_journal_lines_account ON public.journal_lines(account_id);

-- 6. CUSTOMER WALLETS TABLE
CREATE TABLE IF NOT EXISTS public.customer_wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  customer_user_id UUID NOT NULL,
  wallet_number TEXT NOT NULL UNIQUE,
  balance NUMERIC(15, 2) DEFAULT 0 CHECK (balance >= 0),
  currency TEXT DEFAULT 'SAR',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'frozen', 'closed')),
  ledger_account_id UUID REFERENCES public.ledger_accounts(id),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(tenant_id, customer_user_id)
);

ALTER TABLE public.customer_wallets ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_customer_wallets_tenant ON public.customer_wallets(tenant_id);
CREATE INDEX IF NOT EXISTS idx_customer_wallets_customer ON public.customer_wallets(customer_user_id);
CREATE INDEX IF NOT EXISTS idx_customer_wallets_number ON public.customer_wallets(wallet_number);
CREATE INDEX IF NOT EXISTS idx_customer_wallets_status ON public.customer_wallets(status);

-- Function to generate wallet number
CREATE OR REPLACE FUNCTION public.generate_wallet_number()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  customer_uid TEXT;
BEGIN
  SELECT p.customer_uid INTO customer_uid
  FROM public.profiles p
  WHERE p.id = NEW.customer_user_id;
  
  IF customer_uid IS NULL THEN
    NEW.wallet_number := 'W-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
  ELSE
    NEW.wallet_number := 'W-' || customer_uid;
  END IF;
  
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_generate_wallet_number ON public.customer_wallets;
CREATE TRIGGER trigger_generate_wallet_number
  BEFORE INSERT ON public.customer_wallets
  FOR EACH ROW
  WHEN (NEW.wallet_number IS NULL OR NEW.wallet_number = '')
  EXECUTE FUNCTION public.generate_wallet_number();

-- 7. FINANCIAL TRANSACTION ENUMS
DO $$ BEGIN
  CREATE TYPE public.financial_transaction_status AS ENUM ('pending', 'processing', 'succeeded', 'failed', 'refunded', 'cancelled');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.financial_transaction_type AS ENUM ('invoice_payment', 'refund', 'topup', 'withdrawal', 'adjustment', 'transfer', 'fee');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- 8. FINANCIAL TRANSACTIONS TABLE
CREATE TABLE IF NOT EXISTS public.financial_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  customer_user_id UUID NOT NULL,
  wallet_id UUID REFERENCES public.customer_wallets(id),
  transaction_type public.financial_transaction_type NOT NULL,
  amount NUMERIC(15, 2) NOT NULL CHECK (amount > 0),
  currency TEXT DEFAULT 'SAR',
  status public.financial_transaction_status DEFAULT 'pending',
  provider TEXT,
  provider_reference TEXT,
  provider_response JSONB,
  idempotency_key TEXT UNIQUE,
  related_invoice_id UUID REFERENCES public.invoices(id),
  related_order_id UUID REFERENCES public.orders(id),
  journal_entry_id UUID REFERENCES public.journal_entries(id),
  description TEXT,
  description_ar TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.financial_transactions ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_fin_trans_tenant ON public.financial_transactions(tenant_id);
CREATE INDEX IF NOT EXISTS idx_fin_trans_customer ON public.financial_transactions(customer_user_id);
CREATE INDEX IF NOT EXISTS idx_fin_trans_wallet ON public.financial_transactions(wallet_id);
CREATE INDEX IF NOT EXISTS idx_fin_trans_status ON public.financial_transactions(status);
CREATE INDEX IF NOT EXISTS idx_fin_trans_type ON public.financial_transactions(transaction_type);
CREATE INDEX IF NOT EXISTS idx_fin_trans_provider_ref ON public.financial_transactions(provider, provider_reference);
CREATE INDEX IF NOT EXISTS idx_fin_trans_idempotency ON public.financial_transactions(idempotency_key);
CREATE INDEX IF NOT EXISTS idx_fin_trans_invoice ON public.financial_transactions(related_invoice_id);
CREATE INDEX IF NOT EXISTS idx_fin_trans_order ON public.financial_transactions(related_order_id);
CREATE INDEX IF NOT EXISTS idx_fin_trans_created ON public.financial_transactions(created_at DESC);

-- 9. VALIDATION FUNCTION: Ensure journal entry balances
CREATE OR REPLACE FUNCTION public.validate_journal_entry_balance()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  total_debit NUMERIC(15, 2);
  total_credit NUMERIC(15, 2);
BEGIN
  SELECT COALESCE(SUM(debit), 0), COALESCE(SUM(credit), 0)
  INTO total_debit, total_credit
  FROM public.journal_lines
  WHERE entry_id = NEW.id;
  
  IF NEW.is_posted = true AND OLD.is_posted = false THEN
    IF total_debit != total_credit THEN
      RAISE EXCEPTION 'Journal entry is unbalanced: debit (%) != credit (%)', total_debit, total_credit;
    END IF;
    
    IF total_debit = 0 THEN
      RAISE EXCEPTION 'Journal entry has no lines';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_validate_journal_balance ON public.journal_entries;
CREATE TRIGGER trigger_validate_journal_balance
  BEFORE UPDATE ON public.journal_entries
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_journal_entry_balance();

-- 10. HELPER FUNCTIONS
CREATE OR REPLACE FUNCTION public.generate_journal_entry_number(p_tenant_id UUID DEFAULT NULL)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  year_str TEXT;
  next_num INTEGER;
  entry_num TEXT;
BEGIN
  year_str := TO_CHAR(NOW(), 'YYYY');
  
  SELECT COALESCE(MAX(
    CAST(NULLIF(SPLIT_PART(entry_number, '-', 3), '') AS INTEGER)
  ), 0) + 1
  INTO next_num
  FROM public.journal_entries
  WHERE entry_number LIKE 'JE-' || year_str || '-%'
    AND (p_tenant_id IS NULL OR tenant_id = p_tenant_id);
  
  entry_num := 'JE-' || year_str || '-' || LPAD(next_num::TEXT, 6, '0');
  
  RETURN entry_num;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_wallet_balance(p_wallet_id UUID)
RETURNS NUMERIC
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(balance, 0) FROM public.customer_wallets WHERE id = p_wallet_id;
$$;

CREATE OR REPLACE FUNCTION public.get_customer_wallet(p_customer_id UUID)
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM public.customer_wallets WHERE customer_user_id = p_customer_id LIMIT 1;
$$;

-- 11. RLS POLICIES

-- LEDGER ACCOUNTS
DROP POLICY IF EXISTS "Admins can manage ledger accounts" ON public.ledger_accounts;
DROP POLICY IF EXISTS "Authenticated can view ledger accounts" ON public.ledger_accounts;
CREATE POLICY "Admins can manage ledger accounts" ON public.ledger_accounts FOR ALL USING (public.is_admin(auth.uid(), tenant_id));
CREATE POLICY "Authenticated can view ledger accounts" ON public.ledger_accounts FOR SELECT USING (auth.uid() IS NOT NULL);

-- JOURNAL ENTRIES
DROP POLICY IF EXISTS "Admins can manage journal entries" ON public.journal_entries;
CREATE POLICY "Admins can manage journal entries" ON public.journal_entries FOR ALL USING (public.is_admin(auth.uid(), tenant_id));

-- JOURNAL LINES
DROP POLICY IF EXISTS "Admins can manage journal lines" ON public.journal_lines;
CREATE POLICY "Admins can manage journal lines" ON public.journal_lines FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.journal_entries je
    WHERE je.id = journal_lines.entry_id
    AND public.is_admin(auth.uid(), je.tenant_id)
  )
);

-- CUSTOMER WALLETS
DROP POLICY IF EXISTS "Customers can view own wallet" ON public.customer_wallets;
DROP POLICY IF EXISTS "Admins can manage wallets" ON public.customer_wallets;
CREATE POLICY "Customers can view own wallet" ON public.customer_wallets FOR SELECT USING (customer_user_id = auth.uid());
CREATE POLICY "Admins can manage wallets" ON public.customer_wallets FOR ALL USING (public.is_admin(auth.uid(), tenant_id));

-- FINANCIAL TRANSACTIONS
DROP POLICY IF EXISTS "Customers can view own transactions" ON public.financial_transactions;
DROP POLICY IF EXISTS "Admins can manage transactions" ON public.financial_transactions;
CREATE POLICY "Customers can view own transactions" ON public.financial_transactions FOR SELECT USING (customer_user_id = auth.uid());
CREATE POLICY "Admins can manage transactions" ON public.financial_transactions FOR ALL USING (public.is_admin(auth.uid(), tenant_id));

-- 12. DEFAULT LEDGER ACCOUNTS
INSERT INTO public.ledger_accounts (tenant_id, code, name_ar, name_en, account_type) VALUES
  (NULL, '1000', 'النقد والبنوك', 'Cash and Banks', 'asset'),
  (NULL, '1100', 'محافظ العملاء', 'Customer Wallets', 'liability'),
  (NULL, '1200', 'المدينون', 'Accounts Receivable', 'asset'),
  (NULL, '2000', 'الدائنون', 'Accounts Payable', 'liability'),
  (NULL, '2100', 'ضريبة القيمة المضافة', 'VAT Payable', 'liability'),
  (NULL, '3000', 'رأس المال', 'Capital', 'equity'),
  (NULL, '4000', 'إيرادات الخدمات', 'Service Revenue', 'revenue'),
  (NULL, '4100', 'إيرادات أخرى', 'Other Revenue', 'revenue'),
  (NULL, '5000', 'مصاريف التشغيل', 'Operating Expenses', 'expense'),
  (NULL, '5100', 'رسوم الدفع', 'Payment Fees', 'expense')
ON CONFLICT (tenant_id, code) DO NOTHING;

-- 13. UPDATED_AT TRIGGERS
DROP TRIGGER IF EXISTS update_ledger_accounts_updated_at ON public.ledger_accounts;
DROP TRIGGER IF EXISTS update_journal_entries_updated_at ON public.journal_entries;
DROP TRIGGER IF EXISTS update_customer_wallets_updated_at ON public.customer_wallets;
DROP TRIGGER IF EXISTS update_financial_transactions_updated_at ON public.financial_transactions;

CREATE TRIGGER update_ledger_accounts_updated_at BEFORE UPDATE ON public.ledger_accounts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_journal_entries_updated_at BEFORE UPDATE ON public.journal_entries FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_customer_wallets_updated_at BEFORE UPDATE ON public.customer_wallets FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_financial_transactions_updated_at BEFORE UPDATE ON public.financial_transactions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
