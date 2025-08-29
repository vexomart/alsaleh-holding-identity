-- إنشاء نظام موحد ومتطور للمستخدمين والأدوار والمحفظة الرقمية
-- 1. إنشاء جدول المستخدمين الموحد
CREATE TABLE IF NOT EXISTS public.ash_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  phone TEXT UNIQUE,
  name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('superadmin', 'admin', 'finance', 'support', 'client')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('active', 'suspended', 'pending', 'blocked')),
  kyc_status TEXT NOT NULL DEFAULT 'unverified' CHECK (kyc_status IN ('unverified', 'pending', 'verified', 'rejected')),
  two_factor_enabled BOOLEAN DEFAULT false,
  avatar_url TEXT,
  company_name TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_login_at TIMESTAMP WITH TIME ZONE,
  verified_at TIMESTAMP WITH TIME ZONE
);

-- 2. إنشاء جدول رموز التحقق OTP
CREATE TABLE IF NOT EXISTS public.ash_otps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.ash_users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  code TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'login' CHECK (type IN ('login', 'register', 'reset')),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  attempts INTEGER DEFAULT 0,
  consumed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. إنشاء جدول المحافظ الرقمية
CREATE TABLE IF NOT EXISTS public.ash_wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.ash_users(id) ON DELETE CASCADE UNIQUE,
  balance DECIMAL(18,2) DEFAULT 0.00 NOT NULL,
  currency TEXT DEFAULT 'SAR' NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 4. إنشاء جدول معاملات المحفظة
CREATE TABLE IF NOT EXISTS public.ash_wallet_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id UUID REFERENCES public.ash_wallets(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.ash_users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('deposit', 'withdraw', 'charge', 'adjustment', 'refund', 'commission')),
  amount DECIMAL(18,2) NOT NULL,
  balance_before DECIMAL(18,2),
  balance_after DECIMAL(18,2),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled')),
  reference_id TEXT,
  description TEXT,
  admin_notes TEXT,
  created_by UUID REFERENCES public.ash_users(id),
  approved_by UUID REFERENCES public.ash_users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  approved_at TIMESTAMP WITH TIME ZONE
);

-- 5. إنشاء جدول المشاريع
CREATE TABLE IF NOT EXISTS public.ash_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES public.ash_users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'on_hold', 'completed', 'cancelled')),
  budget DECIMAL(18,2),
  start_date DATE,
  due_date DATE,
  completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
  assigned_to UUID REFERENCES public.ash_users(id),
  created_by UUID REFERENCES public.ash_users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 6. إنشاء جدول التذاكر
CREATE TABLE IF NOT EXISTS public.ash_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES public.ash_users(id) ON DELETE CASCADE,
  ticket_number TEXT UNIQUE NOT NULL,
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'pending', 'solved', 'closed')),
  category TEXT DEFAULT 'general',
  assigned_to UUID REFERENCES public.ash_users(id),
  created_by UUID REFERENCES public.ash_users(id),
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 7. إنشاء جدول الفواتير
CREATE TABLE IF NOT EXISTS public.ash_invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES public.ash_users(id) ON DELETE CASCADE,
  invoice_number TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  amount DECIMAL(18,2) NOT NULL,
  tax_amount DECIMAL(18,2) DEFAULT 0.00,
  total_amount DECIMAL(18,2) NOT NULL,
  currency TEXT DEFAULT 'SAR',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled', 'refunded')),
  due_date DATE,
  paid_at TIMESTAMP WITH TIME ZONE,
  pdf_url TEXT,
  notes TEXT,
  created_by UUID REFERENCES public.ash_users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 8. إنشاء جدول سجلات التدقيق
CREATE TABLE IF NOT EXISTS public.ash_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id UUID REFERENCES public.ash_users(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  ip_address INET,
  user_agent TEXT,
  before_data JSONB,
  after_data JSONB,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 9. إنشاء جدول الإشعارات
CREATE TABLE IF NOT EXISTS public.ash_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.ash_users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  read_at TIMESTAMP WITH TIME ZONE,
  email_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 10. إنشاء جدول الجلسات الآمنة
CREATE TABLE IF NOT EXISTS public.ash_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.ash_users(id) ON DELETE CASCADE,
  session_token TEXT UNIQUE NOT NULL,
  refresh_token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  ip_address INET,
  user_agent TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_used_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- إنشاء الفهارس لتحسين الأداء
CREATE INDEX IF NOT EXISTS idx_ash_users_email ON public.ash_users(email);
CREATE INDEX IF NOT EXISTS idx_ash_users_role ON public.ash_users(role);
CREATE INDEX IF NOT EXISTS idx_ash_users_status ON public.ash_users(status);
CREATE INDEX IF NOT EXISTS idx_ash_otps_email_type ON public.ash_otps(email, type);
CREATE INDEX IF NOT EXISTS idx_ash_otps_expires_at ON public.ash_otps(expires_at);
CREATE INDEX IF NOT EXISTS idx_ash_wallet_transactions_user_id ON public.ash_wallet_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_ash_wallet_transactions_status ON public.ash_wallet_transactions(status);
CREATE INDEX IF NOT EXISTS idx_ash_wallet_transactions_created_at ON public.ash_wallet_transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_ash_projects_client_id ON public.ash_projects(client_id);
CREATE INDEX IF NOT EXISTS idx_ash_projects_status ON public.ash_projects(status);
CREATE INDEX IF NOT EXISTS idx_ash_tickets_client_id ON public.ash_tickets(client_id);
CREATE INDEX IF NOT EXISTS idx_ash_tickets_status ON public.ash_tickets(status);
CREATE INDEX IF NOT EXISTS idx_ash_invoices_client_id ON public.ash_invoices(client_id);
CREATE INDEX IF NOT EXISTS idx_ash_invoices_status ON public.ash_invoices(status);
CREATE INDEX IF NOT EXISTS idx_ash_notifications_user_id ON public.ash_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_ash_notifications_read_at ON public.ash_notifications(read_at);
CREATE INDEX IF NOT EXISTS idx_ash_audit_logs_actor_user_id ON public.ash_audit_logs(actor_user_id);
CREATE INDEX IF NOT EXISTS idx_ash_audit_logs_entity_type ON public.ash_audit_logs(entity_type);
CREATE INDEX IF NOT EXISTS idx_ash_sessions_user_id ON public.ash_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_ash_sessions_session_token ON public.ash_sessions(session_token);

-- إنشاء مولدات الأرقام التلقائية
CREATE OR REPLACE FUNCTION public.generate_ash_ticket_number()
RETURNS TEXT AS $$
DECLARE
  year_suffix TEXT;
  counter INTEGER;
  ticket_num TEXT;
BEGIN
  year_suffix := TO_CHAR(CURRENT_DATE, 'YY');
  
  SELECT COALESCE(MAX(CAST(SUBSTRING(ticket_number FROM 7 FOR 6) AS INTEGER)), 0) + 1
  INTO counter
  FROM public.ash_tickets
  WHERE ticket_number LIKE 'ASH' || year_suffix || '%';
  
  ticket_num := 'ASH' || year_suffix || LPAD(counter::TEXT, 6, '0');
  
  RETURN ticket_num;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.generate_ash_invoice_number()
RETURNS TEXT AS $$
DECLARE
  year_suffix TEXT;
  counter INTEGER;
  invoice_num TEXT;
BEGIN
  year_suffix := TO_CHAR(CURRENT_DATE, 'YY');
  
  SELECT COALESCE(MAX(CAST(SUBSTRING(invoice_number FROM 7 FOR 6) AS INTEGER)), 0) + 1
  INTO counter
  FROM public.ash_invoices
  WHERE invoice_number LIKE 'INV' || year_suffix || '%';
  
  invoice_num := 'INV' || year_suffix || LPAD(counter::TEXT, 6, '0');
  
  RETURN invoice_num;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- مثيرات لتحديث التواريخ
CREATE OR REPLACE FUNCTION public.ash_update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- إضافة المثيرات
DROP TRIGGER IF EXISTS ash_users_updated_at ON public.ash_users;
CREATE TRIGGER ash_users_updated_at 
  BEFORE UPDATE ON public.ash_users 
  FOR EACH ROW EXECUTE FUNCTION public.ash_update_updated_at_column();

DROP TRIGGER IF EXISTS ash_wallets_updated_at ON public.ash_wallets;
CREATE TRIGGER ash_wallets_updated_at 
  BEFORE UPDATE ON public.ash_wallets 
  FOR EACH ROW EXECUTE FUNCTION public.ash_update_updated_at_column();

DROP TRIGGER IF EXISTS ash_projects_updated_at ON public.ash_projects;
CREATE TRIGGER ash_projects_updated_at 
  BEFORE UPDATE ON public.ash_projects 
  FOR EACH ROW EXECUTE FUNCTION public.ash_update_updated_at_column();

DROP TRIGGER IF EXISTS ash_tickets_updated_at ON public.ash_tickets;
CREATE TRIGGER ash_tickets_updated_at 
  BEFORE UPDATE ON public.ash_tickets 
  FOR EACH ROW EXECUTE FUNCTION public.ash_update_updated_at_column();

DROP TRIGGER IF EXISTS ash_invoices_updated_at ON public.ash_invoices;
CREATE TRIGGER ash_invoices_updated_at 
  BEFORE UPDATE ON public.ash_invoices 
  FOR EACH ROW EXECUTE FUNCTION public.ash_update_updated_at_column();

-- مثير لتوليد أرقام التذاكر والفواتير
DROP TRIGGER IF EXISTS ash_tickets_set_number ON public.ash_tickets;
CREATE TRIGGER ash_tickets_set_number 
  BEFORE INSERT ON public.ash_tickets 
  FOR EACH ROW 
  WHEN (NEW.ticket_number IS NULL OR NEW.ticket_number = '')
  EXECUTE FUNCTION (
    CREATE OR REPLACE FUNCTION public.ash_set_ticket_number()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.ticket_number := public.generate_ash_ticket_number();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql
  );

DROP TRIGGER IF EXISTS ash_invoices_set_number ON public.ash_invoices;
CREATE TRIGGER ash_invoices_set_number 
  BEFORE INSERT ON public.ash_invoices 
  FOR EACH ROW 
  WHEN (NEW.invoice_number IS NULL OR NEW.invoice_number = '')
  EXECUTE FUNCTION (
    CREATE OR REPLACE FUNCTION public.ash_set_invoice_number()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.invoice_number := public.generate_ash_invoice_number();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql
  );

-- مثير لإنشاء محفظة تلقائيًا عند إنشاء مستخدم جديد
CREATE OR REPLACE FUNCTION public.ash_handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- إنشاء محفظة للمستخدم الجديد
  INSERT INTO public.ash_wallets (user_id, balance, currency)
  VALUES (NEW.id, 0.00, 'SAR');
  
  -- إنشاء إشعار ترحيبي
  INSERT INTO public.ash_notifications (user_id, type, title, body, data)
  VALUES (
    NEW.id, 
    'welcome', 
    'مرحباً بك في ASH HOLDING', 
    'تم إنشاء حسابك بنجاح. يمكنك الآن الاستفادة من جميع خدماتنا.',
    jsonb_build_object('user_name', NEW.name)
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS ash_handle_new_user ON public.ash_users;
CREATE TRIGGER ash_handle_new_user
  AFTER INSERT ON public.ash_users
  FOR EACH ROW EXECUTE FUNCTION public.ash_handle_new_user();

-- إنشاء سياسات الأمان RLS
ALTER TABLE public.ash_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ash_otps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ash_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ash_wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ash_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ash_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ash_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ash_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ash_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ash_sessions ENABLE ROW LEVEL SECURITY;

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

-- سياسات للمحافظ
CREATE POLICY "ash_wallets_select_own_or_admin" ON public.ash_wallets
  FOR SELECT USING (
    user_id = auth.uid() OR 
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

-- تفعيل النشر اللحظي لجميع الجداول
ALTER publication supabase_realtime ADD TABLE public.ash_users;
ALTER publication supabase_realtime ADD TABLE public.ash_wallets;
ALTER publication supabase_realtime ADD TABLE public.ash_wallet_transactions;
ALTER publication supabase_realtime ADD TABLE public.ash_projects;
ALTER publication supabase_realtime ADD TABLE public.ash_tickets;
ALTER publication supabase_realtime ADD TABLE public.ash_invoices;
ALTER publication supabase_realtime ADD TABLE public.ash_notifications;

-- تعيين REPLICA IDENTITY FULL للمزامنة اللحظية الكاملة
ALTER TABLE public.ash_users REPLICA IDENTITY FULL;
ALTER TABLE public.ash_wallets REPLICA IDENTITY FULL;
ALTER TABLE public.ash_wallet_transactions REPLICA IDENTITY FULL;
ALTER TABLE public.ash_projects REPLICA IDENTITY FULL;
ALTER TABLE public.ash_tickets REPLICA IDENTITY FULL;
ALTER TABLE public.ash_invoices REPLICA IDENTITY FULL;
ALTER TABLE public.ash_notifications REPLICA IDENTITY FULL;