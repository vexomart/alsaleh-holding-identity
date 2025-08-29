-- تصحيح إنشاء مولدات الأرقام والمثيرات
CREATE OR REPLACE FUNCTION public.ash_set_ticket_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.ticket_number IS NULL OR NEW.ticket_number = '' THEN
    NEW.ticket_number := public.generate_ash_ticket_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.ash_set_invoice_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.invoice_number IS NULL OR NEW.invoice_number = '' THEN
    NEW.invoice_number := public.generate_ash_invoice_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- إضافة المثيرات المصححة
DROP TRIGGER IF EXISTS ash_tickets_set_number ON public.ash_tickets;
CREATE TRIGGER ash_tickets_set_number 
  BEFORE INSERT ON public.ash_tickets 
  FOR EACH ROW 
  EXECUTE FUNCTION public.ash_set_ticket_number();

DROP TRIGGER IF EXISTS ash_invoices_set_number ON public.ash_invoices;
CREATE TRIGGER ash_invoices_set_number 
  BEFORE INSERT ON public.ash_invoices 
  FOR EACH ROW 
  EXECUTE FUNCTION public.ash_set_invoice_number();

-- إضافة سياسات إضافية للأمان
CREATE POLICY "ash_otps_select_own" ON public.ash_otps
  FOR SELECT USING (
    user_id = auth.uid() OR email = auth.email()
  );

CREATE POLICY "ash_otps_insert_public" ON public.ash_otps
  FOR INSERT WITH CHECK (true);

CREATE POLICY "ash_otps_update_own" ON public.ash_otps
  FOR UPDATE USING (
    user_id = auth.uid() OR email = auth.email()
  );

-- سياسات للمشاريع
CREATE POLICY "ash_projects_select_own_or_admin" ON public.ash_projects
  FOR SELECT USING (
    client_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM public.ash_users WHERE id = auth.uid() AND role IN ('superadmin', 'admin', 'support'))
  );

-- سياسات للتذاكر
CREATE POLICY "ash_tickets_select_own_or_admin" ON public.ash_tickets
  FOR SELECT USING (
    client_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM public.ash_users WHERE id = auth.uid() AND role IN ('superadmin', 'admin', 'support'))
  );

-- سياسات للفواتير
CREATE POLICY "ash_invoices_select_own_or_admin" ON public.ash_invoices
  FOR SELECT USING (
    client_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM public.ash_users WHERE id = auth.uid() AND role IN ('superadmin', 'admin', 'finance'))
  );

-- سياسات للإشعارات
CREATE POLICY "ash_notifications_select_own" ON public.ash_notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "ash_notifications_insert_admin" ON public.ash_notifications
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.ash_users WHERE id = auth.uid() AND role IN ('superadmin', 'admin')) OR
    user_id = auth.uid()
  );

-- سياسات لسجلات التدقيق
CREATE POLICY "ash_audit_logs_select_admin" ON public.ash_audit_logs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.ash_users WHERE id = auth.uid() AND role IN ('superadmin', 'admin'))
  );

CREATE POLICY "ash_audit_logs_insert_system" ON public.ash_audit_logs
  FOR INSERT WITH CHECK (true);

-- سياسات للجلسات
CREATE POLICY "ash_sessions_select_own" ON public.ash_sessions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "ash_sessions_insert_own" ON public.ash_sessions
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "ash_sessions_update_own" ON public.ash_sessions
  FOR UPDATE USING (user_id = auth.uid());

-- إنشاء مستخدم إداري أولي (سوبر أدمن)
INSERT INTO public.ash_users (
  email, name, password_hash, role, status, kyc_status, verified_at
) VALUES (
  'admin@ashholding.com', 
  'مدير النظام', 
  '$2b$12$dummy.hash.for.initial.admin', 
  'superadmin', 
  'active', 
  'verified',
  now()
) ON CONFLICT (email) DO NOTHING;