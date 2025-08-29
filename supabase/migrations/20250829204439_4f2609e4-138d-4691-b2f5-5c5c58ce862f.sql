-- تفعيل أمان RLS وإضافة السياسات
ALTER TABLE public.ash_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ash_otps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ash_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ash_wallet_transactions ENABLE ROW LEVEL SECURITY;

-- سياسات للمستخدمين
CREATE POLICY "ash_users_select_own_or_admin" ON public.ash_users
  FOR SELECT USING (
    id = auth.uid() OR 
    EXISTS (SELECT 1 FROM public.ash_users WHERE id = auth.uid() AND role IN ('superadmin', 'admin'))
  );

CREATE POLICY "ash_users_insert_public" ON public.ash_users
  FOR INSERT WITH CHECK (true);

CREATE POLICY "ash_users_update_own_or_admin" ON public.ash_users
  FOR UPDATE USING (
    id = auth.uid() OR 
    EXISTS (SELECT 1 FROM public.ash_users WHERE id = auth.uid() AND role IN ('superadmin', 'admin'))
  );

-- سياسات لرموز OTP
CREATE POLICY "ash_otps_select_own" ON public.ash_otps
  FOR SELECT USING (user_id = auth.uid() OR email = auth.email());

CREATE POLICY "ash_otps_insert_public" ON public.ash_otps
  FOR INSERT WITH CHECK (true);

CREATE POLICY "ash_otps_update_own" ON public.ash_otps
  FOR UPDATE USING (user_id = auth.uid() OR email = auth.email());

-- سياسات للمحافظ
CREATE POLICY "ash_wallets_select_own_or_admin" ON public.ash_wallets
  FOR SELECT USING (
    user_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM public.ash_users WHERE id = auth.uid() AND role IN ('superadmin', 'admin', 'finance'))
  );

CREATE POLICY "ash_wallets_insert_system" ON public.ash_wallets
  FOR INSERT WITH CHECK (true);

CREATE POLICY "ash_wallets_update_admin" ON public.ash_wallets
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.ash_users WHERE id = auth.uid() AND role IN ('superadmin', 'admin', 'finance'))
  );

-- سياسات لمعاملات المحفظة
CREATE POLICY "ash_wallet_transactions_select_own_or_admin" ON public.ash_wallet_transactions
  FOR SELECT USING (
    user_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM public.ash_users WHERE id = auth.uid() AND role IN ('superadmin', 'admin', 'finance'))
  );

CREATE POLICY "ash_wallet_transactions_insert_admin" ON public.ash_wallet_transactions
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.ash_users WHERE id = auth.uid() AND role IN ('superadmin', 'admin', 'finance'))
  );

CREATE POLICY "ash_wallet_transactions_update_admin" ON public.ash_wallet_transactions
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.ash_users WHERE id = auth.uid() AND role IN ('superadmin', 'admin', 'finance'))
  );