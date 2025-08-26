-- حذف الجدول إذا كان موجود وإعادة إنشاؤه
DROP TABLE IF EXISTS public.payment_transactions CASCADE;

-- إنشاء جدول معاملات الدفع من جديد
CREATE TABLE public.payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id TEXT NOT NULL,
  payment_method TEXT NOT NULL DEFAULT 'TAB',
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'SAR',
  status TEXT DEFAULT 'PENDING',
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  invoice_number TEXT,
  offer_title TEXT,
  description TEXT,
  user_id UUID,
  contract_id UUID,
  metadata JSONB DEFAULT '{}',
  payment_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- إضافة قيد فريد على transaction_id
ALTER TABLE public.payment_transactions ADD CONSTRAINT unique_transaction_id UNIQUE (transaction_id);

-- إضافة فهارس
CREATE INDEX idx_payment_transactions_status ON public.payment_transactions(status);
CREATE INDEX idx_payment_transactions_user_id ON public.payment_transactions(user_id);
CREATE INDEX idx_payment_transactions_created_at ON public.payment_transactions(created_at);

-- تفعيل RLS
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;

-- سياسة للعرض
CREATE POLICY "Anyone can insert payment transactions"
  ON public.payment_transactions
  FOR INSERT
  WITH CHECK (true);

-- سياسة للعرض  
CREATE POLICY "Users can view their own payment transactions"
  ON public.payment_transactions
  FOR SELECT
  USING (true);