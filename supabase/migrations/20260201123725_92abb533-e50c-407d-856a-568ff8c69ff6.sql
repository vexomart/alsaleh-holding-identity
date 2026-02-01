-- =============================================
-- Proactive Notification System - Schema Expansion
-- =============================================

-- 1. Add new notification type enum values
ALTER TYPE public.notification_type ADD VALUE IF NOT EXISTS 'invoice_due';
ALTER TYPE public.notification_type ADD VALUE IF NOT EXISTS 'payment_failed';
ALTER TYPE public.notification_type ADD VALUE IF NOT EXISTS 'low_wallet_balance';
ALTER TYPE public.notification_type ADD VALUE IF NOT EXISTS 'order_status_changed';
ALTER TYPE public.notification_type ADD VALUE IF NOT EXISTS 'order_delayed';
ALTER TYPE public.notification_type ADD VALUE IF NOT EXISTS 'contract_pending_signature';
ALTER TYPE public.notification_type ADD VALUE IF NOT EXISTS 'contract_signed';
ALTER TYPE public.notification_type ADD VALUE IF NOT EXISTS 'contract_expired';
ALTER TYPE public.notification_type ADD VALUE IF NOT EXISTS 'admin_message';

-- 2. Create severity enum
DO $$ BEGIN
  CREATE TYPE public.notification_severity AS ENUM ('info', 'warning', 'critical');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 3. Create role_target enum  
DO $$ BEGIN
  CREATE TYPE public.notification_role_target AS ENUM ('admin', 'customer', 'all');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 4. Add new columns to notifications table
ALTER TABLE public.notifications 
ADD COLUMN IF NOT EXISTS severity public.notification_severity DEFAULT 'info',
ADD COLUMN IF NOT EXISTS role_target public.notification_role_target DEFAULT 'customer',
ADD COLUMN IF NOT EXISTS scheduled_for TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS body_en TEXT,
ADD COLUMN IF NOT EXISTS body_ar TEXT,
ADD COLUMN IF NOT EXISTS title_en TEXT,
ADD COLUMN IF NOT EXISTS source_type TEXT,
ADD COLUMN IF NOT EXISTS source_id UUID,
ADD COLUMN IF NOT EXISTS idempotency_key TEXT;

-- 5. Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON public.notifications(user_id, is_read) WHERE is_read = false;
CREATE INDEX IF NOT EXISTS idx_notifications_tenant_role ON public.notifications(tenant_id, role_target);
CREATE INDEX IF NOT EXISTS idx_notifications_scheduled ON public.notifications(scheduled_for) WHERE scheduled_for IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_notifications_source ON public.notifications(source_type, source_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_notifications_idempotency ON public.notifications(idempotency_key) WHERE idempotency_key IS NOT NULL;

-- 6. Update RLS policies
DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can create own notifications" ON public.notifications;

CREATE POLICY "Customers can view own notifications" ON public.notifications FOR SELECT
USING (user_id = auth.uid() OR (role_target = 'all' AND tenant_id = get_user_tenant_id(auth.uid())));

CREATE POLICY "Admins can view tenant notifications" ON public.notifications FOR SELECT
USING (is_admin(auth.uid(), tenant_id));

CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE
USING (user_id = auth.uid());

CREATE POLICY "Admins can create notifications" ON public.notifications FOR INSERT
WITH CHECK (is_admin(auth.uid(), tenant_id) OR user_id = auth.uid());

CREATE POLICY "Users can delete own notifications" ON public.notifications FOR DELETE
USING (user_id = auth.uid());

-- 7. Create helper function for proactive notifications
CREATE OR REPLACE FUNCTION public.create_proactive_notification(
  p_user_id UUID, p_tenant_id UUID, p_type public.notification_type,
  p_severity public.notification_severity, p_role_target public.notification_role_target,
  p_title_ar TEXT, p_title_en TEXT, p_body_ar TEXT DEFAULT NULL, p_body_en TEXT DEFAULT NULL,
  p_link TEXT DEFAULT NULL, p_source_type TEXT DEFAULT NULL, p_source_id UUID DEFAULT NULL,
  p_idempotency_key TEXT DEFAULT NULL, p_scheduled_for TIMESTAMP WITH TIME ZONE DEFAULT NULL
)
RETURNS UUID LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_notification_id UUID;
BEGIN
  IF p_idempotency_key IS NOT NULL THEN
    SELECT id INTO v_notification_id FROM public.notifications WHERE idempotency_key = p_idempotency_key;
    IF v_notification_id IS NOT NULL THEN RETURN v_notification_id; END IF;
  END IF;
  INSERT INTO public.notifications (user_id, tenant_id, type, severity, role_target, title, title_ar, title_en,
    message, message_ar, body_ar, body_en, link, source_type, source_id, idempotency_key, scheduled_for, is_read)
  VALUES (p_user_id, p_tenant_id, p_type, p_severity, p_role_target, p_title_en, p_title_ar, p_title_en,
    p_body_en, p_body_ar, p_body_ar, p_body_en, p_link, p_source_type, p_source_id, p_idempotency_key, p_scheduled_for, false)
  RETURNING id INTO v_notification_id;
  RETURN v_notification_id;
END;
$$;

-- 8. Create function to get due invoices for reminders
CREATE OR REPLACE FUNCTION public.get_invoices_needing_reminders()
RETURNS TABLE (invoice_id UUID, customer_id UUID, tenant_id UUID, invoice_number TEXT, total NUMERIC, due_date TIMESTAMP WITH TIME ZONE, hours_until_due NUMERIC)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT i.id, i.customer_id, i.tenant_id, i.invoice_number, i.total, i.due_date, EXTRACT(EPOCH FROM (i.due_date - now())) / 3600
  FROM public.invoices i WHERE i.status = 'issued' AND i.due_date IS NOT NULL
    AND ((i.due_date - now() BETWEEN interval '71 hours' AND interval '73 hours')
      OR (i.due_date - now() BETWEEN interval '23 hours' AND interval '25 hours')
      OR (i.due_date < now() AND i.due_date > now() - interval '1 hour'));
$$;

-- 9. Create function to get low wallet balances
CREATE OR REPLACE FUNCTION public.get_wallets_with_low_balance(p_threshold NUMERIC DEFAULT 100)
RETURNS TABLE (wallet_id UUID, customer_user_id UUID, tenant_id UUID, balance NUMERIC, currency TEXT)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT w.id, w.customer_user_id, w.tenant_id, w.balance, w.currency FROM public.customer_wallets w
  WHERE w.status = 'active' AND w.balance < p_threshold;
$$;

-- 10. Create function to get delayed orders (using correct enum values)
CREATE OR REPLACE FUNCTION public.get_delayed_orders(p_hours_threshold INTEGER DEFAULT 48)
RETURNS TABLE (order_id UUID, customer_id UUID, tenant_id UUID, order_number TEXT, status public.order_status, last_updated TIMESTAMP WITH TIME ZONE, hours_since_update NUMERIC)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT o.id, o.customer_id, o.tenant_id, o.order_number, o.status, o.updated_at, EXTRACT(EPOCH FROM (now() - o.updated_at)) / 3600
  FROM public.orders o WHERE o.status NOT IN ('completed', 'cancelled', 'refunded')
    AND o.updated_at < now() - (p_hours_threshold || ' hours')::interval;
$$;

-- 11. Create function to get expiring contracts
CREATE OR REPLACE FUNCTION public.get_expiring_contracts(p_days_threshold INTEGER DEFAULT 7)
RETURNS TABLE (contract_id UUID, customer_user_id UUID, tenant_id UUID, contract_number TEXT, status public.contract_status, created_at TIMESTAMP WITH TIME ZONE)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT c.id, c.customer_user_id, c.tenant_id, c.contract_number, c.status, c.created_at FROM public.contracts c
  WHERE c.status = 'pending_signature' AND c.created_at < now() - ((p_days_threshold - 1) || ' days')::interval;
$$;