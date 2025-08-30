-- إنشاء جدول المحافظ لنظام ASH HOLDING
CREATE TABLE IF NOT EXISTS public.ash_wallets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.ash_users(id) ON DELETE CASCADE,
  balance NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  currency TEXT NOT NULL DEFAULT 'SAR',
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_locked BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- فهارس لتحسين الأداء
  UNIQUE(user_id)
);

-- تفعيل RLS على جدول المحافظ
ALTER TABLE public.ash_wallets ENABLE ROW LEVEL SECURITY;

-- سياسات الأمان
CREATE POLICY "ash_wallets_select_own_or_admin" ON public.ash_wallets
  FOR SELECT USING (
    user_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM public.ash_users 
      WHERE ash_users.id = auth.uid() 
      AND ash_users.role = ANY(ARRAY['superadmin', 'admin', 'finance'])
    )
  );

CREATE POLICY "ash_wallets_insert_admin" ON public.ash_wallets
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.ash_users 
      WHERE ash_users.id = auth.uid() 
      AND ash_users.role = ANY(ARRAY['superadmin', 'admin', 'finance'])
    )
  );

CREATE POLICY "ash_wallets_update_admin" ON public.ash_wallets
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.ash_users 
      WHERE ash_users.id = auth.uid() 
      AND ash_users.role = ANY(ARRAY['superadmin', 'admin', 'finance'])
    )
  );

-- دالة تحديث updated_at
CREATE OR REPLACE FUNCTION public.ash_update_wallet_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- تريجر لتحديث updated_at تلقائياً
CREATE TRIGGER ash_wallet_updated_at
  BEFORE UPDATE ON public.ash_wallets
  FOR EACH ROW
  EXECUTE FUNCTION public.ash_update_wallet_updated_at();

-- التأكد من وجود محفظة لكل مستخدم عند إنشاء حساب جديد
-- (سيتم إنشاؤها تلقائياً عبر edge function عند الحاجة)