-- إنشاء جدول معاملات الدفع
CREATE TABLE IF NOT EXISTS public.payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id TEXT NOT NULL UNIQUE,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('TAB', 'PAYLINK', 'STC_PAY', 'TAMARA', 'CASH', 'BANK_TRANSFER')),
  amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
  currency TEXT DEFAULT 'SAR' CHECK (currency IN ('SAR', 'USD', 'EUR')),
  status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PAID', 'FAILED', 'CANCELLED', 'REFUNDED')),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  invoice_number TEXT,
  offer_title TEXT,
  description TEXT,
  user_id UUID REFERENCES auth.users(id),
  contract_id UUID,
  metadata JSONB DEFAULT '{}',
  payment_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- إضافة فهارس للأداء
CREATE INDEX IF NOT EXISTS idx_payment_transactions_transaction_id ON public.payment_transactions(transaction_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_status ON public.payment_transactions(status);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_user_id ON public.payment_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_created_at ON public.payment_transactions(created_at);

-- تفعيل RLS
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;

-- إنشاء السياسات الأمنية
CREATE POLICY "Users can view their own transactions"
  ON public.payment_transactions
  FOR SELECT
  USING (
    auth.uid() = user_id 
    OR has_role(auth.uid(), 'admin'::app_role)
  );

CREATE POLICY "Users can create their own transactions"
  ON public.payment_transactions
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id 
    OR ((auth.jwt() ->> 'role') = 'service_role')
    OR has_role(auth.uid(), 'admin'::app_role)
  );

CREATE POLICY "Only admins can update transactions"
  ON public.payment_transactions
  FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can delete transactions"
  ON public.payment_transactions
  FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- إضافة trigger لتحديث updated_at
CREATE OR REPLACE FUNCTION update_payment_transactions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_payment_transactions_updated_at
  BEFORE UPDATE ON public.payment_transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_payment_transactions_updated_at();