-- إضافة بقية الجداول والوظائف مع إصلاح مسار البحث
-- إنشاء الوظائف المساعدة مع مسار البحث الآمن
CREATE OR REPLACE FUNCTION public.ash_update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- إنشاء وظيفة إنشاء محفظة للمستخدم الجديد
CREATE OR REPLACE FUNCTION public.ash_handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- إنشاء محفظة للمستخدم الجديد
  INSERT INTO public.ash_wallets (user_id, balance, currency)
  VALUES (NEW.id, 0.00, 'SAR');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- إضافة مثيرات التحديث التلقائي
CREATE TRIGGER ash_users_updated_at 
  BEFORE UPDATE ON public.ash_users 
  FOR EACH ROW EXECUTE FUNCTION public.ash_update_updated_at_column();

CREATE TRIGGER ash_wallets_updated_at 
  BEFORE UPDATE ON public.ash_wallets 
  FOR EACH ROW EXECUTE FUNCTION public.ash_update_updated_at_column();

-- مثير إنشاء المحفظة التلقائي
CREATE TRIGGER ash_handle_new_user
  AFTER INSERT ON public.ash_users
  FOR EACH ROW EXECUTE FUNCTION public.ash_handle_new_user();

-- إنشاء الفهارس لتحسين الأداء
CREATE INDEX idx_ash_users_email ON public.ash_users(email);
CREATE INDEX idx_ash_users_role ON public.ash_users(role);
CREATE INDEX idx_ash_users_status ON public.ash_users(status);
CREATE INDEX idx_ash_otps_email_type ON public.ash_otps(email, type);
CREATE INDEX idx_ash_otps_expires_at ON public.ash_otps(expires_at);
CREATE INDEX idx_ash_wallet_transactions_user_id ON public.ash_wallet_transactions(user_id);
CREATE INDEX idx_ash_wallet_transactions_status ON public.ash_wallet_transactions(status);
CREATE INDEX idx_ash_wallet_transactions_created_at ON public.ash_wallet_transactions(created_at);

-- تفعيل النشر اللحظي
ALTER publication supabase_realtime ADD TABLE public.ash_users;
ALTER publication supabase_realtime ADD TABLE public.ash_wallets;
ALTER publication supabase_realtime ADD TABLE public.ash_wallet_transactions;
ALTER publication supabase_realtime ADD TABLE public.ash_otps;

-- تعيين REPLICA IDENTITY FULL للمزامنة اللحظية الكاملة
ALTER TABLE public.ash_users REPLICA IDENTITY FULL;
ALTER TABLE public.ash_wallets REPLICA IDENTITY FULL;
ALTER TABLE public.ash_wallet_transactions REPLICA IDENTITY FULL;
ALTER TABLE public.ash_otps REPLICA IDENTITY FULL;