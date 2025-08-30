-- إضافة سياسة للسماح لـ edge functions بإنشاء المحافظ
DROP POLICY IF EXISTS "ash_wallets_system_insert" ON public.ash_wallets;

CREATE POLICY "ash_wallets_system_insert" ON public.ash_wallets
  FOR INSERT WITH CHECK (
    -- السماح لـ service role (edge functions) بإنشاء المحافظ
    (auth.jwt() ->> 'role')::text = 'service_role'
  );