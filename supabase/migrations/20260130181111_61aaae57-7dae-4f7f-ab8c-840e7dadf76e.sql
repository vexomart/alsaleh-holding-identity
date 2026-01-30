-- =====================================================
-- ASH HOLDING - CLEAN ARCHITECTURE DATABASE SCHEMA
-- Multi-tenant, RBAC-enabled, Enterprise-grade
-- =====================================================

-- 1. ENUMS
-- =====================================================
CREATE TYPE public.app_role AS ENUM ('super_admin', 'admin', 'manager', 'staff', 'customer');
CREATE TYPE public.order_status AS ENUM ('pending', 'processing', 'in_progress', 'completed', 'cancelled', 'refunded');
CREATE TYPE public.notification_type AS ENUM ('info', 'warning', 'success', 'error', 'system');
CREATE TYPE public.audit_action AS ENUM ('create', 'read', 'update', 'delete', 'login', 'logout', 'export');

-- 2. TENANTS (Companies/Organizations)
-- =====================================================
CREATE TABLE public.tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  name_ar TEXT,
  slug TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  domain TEXT,
  settings JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. PROFILES (Extended User Info)
-- =====================================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  full_name TEXT,
  full_name_ar TEXT,
  phone TEXT,
  avatar_url TEXT,
  preferred_language TEXT DEFAULT 'ar' CHECK (preferred_language IN ('ar', 'en')),
  is_active BOOLEAN DEFAULT true,
  last_login_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. USER ROLES (RBAC - Separate Table for Security)
-- =====================================================
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'customer',
  granted_by UUID REFERENCES auth.users(id),
  granted_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ,
  UNIQUE (user_id, tenant_id, role)
);

-- 5. PERMISSIONS
-- =====================================================
CREATE TABLE public.permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  name_ar TEXT,
  description TEXT,
  module TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. ROLE PERMISSIONS
-- =====================================================
CREATE TABLE public.role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role app_role NOT NULL,
  permission_id UUID REFERENCES public.permissions(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  UNIQUE (role, permission_id, tenant_id)
);

-- 7. SERVICES/PRODUCTS
-- =====================================================
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  name_ar TEXT,
  description TEXT,
  description_ar TEXT,
  price DECIMAL(12,2),
  currency TEXT DEFAULT 'SAR',
  category TEXT,
  icon TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 8. ORDERS/REQUESTS
-- =====================================================
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
  status order_status DEFAULT 'pending',
  assigned_to UUID REFERENCES auth.users(id),
  title TEXT NOT NULL,
  title_ar TEXT,
  description TEXT,
  total_amount DECIMAL(12,2),
  currency TEXT DEFAULT 'SAR',
  priority INTEGER DEFAULT 0,
  due_date TIMESTAMPTZ,
  attachments JSONB DEFAULT '[]',
  notes JSONB DEFAULT '[]',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 9. NOTIFICATIONS
-- =====================================================
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type notification_type DEFAULT 'info',
  title TEXT NOT NULL,
  title_ar TEXT,
  message TEXT,
  message_ar TEXT,
  link TEXT,
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 10. AUDIT LOGS
-- =====================================================
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action audit_action NOT NULL,
  table_name TEXT,
  record_id UUID,
  old_data JSONB,
  new_data JSONB,
  ip_address INET,
  user_agent TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 11. CMS - PAGES
-- =====================================================
CREATE TABLE public.pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  title_ar TEXT,
  content JSONB DEFAULT '{}',
  meta_title TEXT,
  meta_description TEXT,
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (tenant_id, slug)
);

-- 12. CMS - MENUS
-- =====================================================
CREATE TABLE public.menus (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  items JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 13. MEDIA LIBRARY
-- =====================================================
CREATE TABLE public.media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  uploaded_by UUID REFERENCES auth.users(id),
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  alt_text TEXT,
  alt_text_ar TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 14. SUPPORT TICKETS
-- =====================================================
CREATE TABLE public.tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_number TEXT UNIQUE NOT NULL,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  assigned_to UUID REFERENCES auth.users(id),
  subject TEXT NOT NULL,
  subject_ar TEXT,
  description TEXT,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'waiting', 'resolved', 'closed')),
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  messages JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- ENABLE RLS ON ALL TABLES
-- =====================================================
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menus ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- SECURITY DEFINER FUNCTION FOR ROLE CHECKING
-- =====================================================
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role, _tenant_id UUID DEFAULT NULL)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
      AND (tenant_id = _tenant_id OR _tenant_id IS NULL)
      AND (expires_at IS NULL OR expires_at > now())
  )
$$;

-- Function to check if user is admin or above
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID, _tenant_id UUID DEFAULT NULL)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('super_admin', 'admin')
      AND (tenant_id = _tenant_id OR _tenant_id IS NULL)
      AND (expires_at IS NULL OR expires_at > now())
  )
$$;

-- Get user's tenant_id
CREATE OR REPLACE FUNCTION public.get_user_tenant_id(_user_id UUID)
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT tenant_id FROM public.profiles WHERE id = _user_id LIMIT 1
$$;

-- =====================================================
-- RLS POLICIES
-- =====================================================

-- Tenants: Admins can manage, others can view their own
CREATE POLICY "Admins can manage tenants" ON public.tenants
  FOR ALL TO authenticated
  USING (public.is_admin(auth.uid(), NULL));

CREATE POLICY "Users can view their tenant" ON public.tenants
  FOR SELECT TO authenticated
  USING (id = public.get_user_tenant_id(auth.uid()));

-- Profiles: Users can view/update their own
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Admins can manage profiles" ON public.profiles
  FOR ALL TO authenticated
  USING (public.is_admin(auth.uid(), tenant_id));

-- User Roles: Admins only
CREATE POLICY "Admins can manage user roles" ON public.user_roles
  FOR ALL TO authenticated
  USING (public.is_admin(auth.uid(), tenant_id));

CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- Orders: Customers see own, admins see all in tenant
CREATE POLICY "Customers can view own orders" ON public.orders
  FOR SELECT TO authenticated
  USING (customer_id = auth.uid());

CREATE POLICY "Customers can create orders" ON public.orders
  FOR INSERT TO authenticated
  WITH CHECK (customer_id = auth.uid());

CREATE POLICY "Admins can manage orders" ON public.orders
  FOR ALL TO authenticated
  USING (public.is_admin(auth.uid(), tenant_id));

-- Notifications: Users see own
CREATE POLICY "Users can view own notifications" ON public.notifications
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications" ON public.notifications
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "System can create notifications" ON public.notifications
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- Services: Public read, admin write
CREATE POLICY "Anyone can view active services" ON public.services
  FOR SELECT TO authenticated
  USING (is_active = true);

CREATE POLICY "Admins can manage services" ON public.services
  FOR ALL TO authenticated
  USING (public.is_admin(auth.uid(), tenant_id));

-- Tickets: Customers see own, admins see all
CREATE POLICY "Customers can view own tickets" ON public.tickets
  FOR SELECT TO authenticated
  USING (customer_id = auth.uid());

CREATE POLICY "Customers can create tickets" ON public.tickets
  FOR INSERT TO authenticated
  WITH CHECK (customer_id = auth.uid());

CREATE POLICY "Admins can manage tickets" ON public.tickets
  FOR ALL TO authenticated
  USING (public.is_admin(auth.uid(), tenant_id));

-- Audit Logs: Admins only
CREATE POLICY "Admins can view audit logs" ON public.audit_logs
  FOR SELECT TO authenticated
  USING (public.is_admin(auth.uid(), tenant_id));

-- Pages, Menus, Media: Admin write, public read
CREATE POLICY "Anyone can view published pages" ON public.pages
  FOR SELECT TO authenticated
  USING (is_published = true);

CREATE POLICY "Admins can manage pages" ON public.pages
  FOR ALL TO authenticated
  USING (public.is_admin(auth.uid(), tenant_id));

CREATE POLICY "Anyone can view active menus" ON public.menus
  FOR SELECT TO authenticated
  USING (is_active = true);

CREATE POLICY "Admins can manage menus" ON public.menus
  FOR ALL TO authenticated
  USING (public.is_admin(auth.uid(), tenant_id));

CREATE POLICY "Anyone can view media" ON public.media
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Admins can manage media" ON public.media
  FOR ALL TO authenticated
  USING (public.is_admin(auth.uid(), tenant_id));

-- Permissions: Public read
CREATE POLICY "Anyone can view permissions" ON public.permissions
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Admins can manage role permissions" ON public.role_permissions
  FOR ALL TO authenticated
  USING (public.is_admin(auth.uid(), tenant_id));

-- =====================================================
-- AUTO-CREATE PROFILE ON SIGNUP TRIGGER
-- =====================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- AUTO-UPDATE updated_at TRIGGER
-- =====================================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_tenants_updated_at BEFORE UPDATE ON public.tenants FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_pages_updated_at BEFORE UPDATE ON public.pages FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_menus_updated_at BEFORE UPDATE ON public.menus FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_tickets_updated_at BEFORE UPDATE ON public.tickets FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- GENERATE ORDER NUMBER FUNCTION
-- =====================================================
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.order_number = 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER set_order_number BEFORE INSERT ON public.orders FOR EACH ROW EXECUTE FUNCTION public.generate_order_number();

-- GENERATE TICKET NUMBER
CREATE OR REPLACE FUNCTION public.generate_ticket_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.ticket_number = 'TKT-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER set_ticket_number BEFORE INSERT ON public.tickets FOR EACH ROW EXECUTE FUNCTION public.generate_ticket_number();

-- =====================================================
-- INSERT DEFAULT TENANT
-- =====================================================
INSERT INTO public.tenants (name, name_ar, slug, is_active) VALUES
('ASH Holding', 'شركة علي صالح الشهري القابضة', 'ash-holding', true);

-- =====================================================
-- INSERT DEFAULT PERMISSIONS
-- =====================================================
INSERT INTO public.permissions (name, name_ar, description, module) VALUES
('users.view', 'عرض المستخدمين', 'View users list', 'users'),
('users.create', 'إنشاء مستخدمين', 'Create new users', 'users'),
('users.edit', 'تعديل المستخدمين', 'Edit existing users', 'users'),
('users.delete', 'حذف المستخدمين', 'Delete users', 'users'),
('orders.view', 'عرض الطلبات', 'View orders', 'orders'),
('orders.create', 'إنشاء طلبات', 'Create orders', 'orders'),
('orders.edit', 'تعديل الطلبات', 'Edit orders', 'orders'),
('orders.delete', 'حذف الطلبات', 'Delete orders', 'orders'),
('services.view', 'عرض الخدمات', 'View services', 'services'),
('services.manage', 'إدارة الخدمات', 'Manage services', 'services'),
('reports.view', 'عرض التقارير', 'View reports', 'reports'),
('reports.export', 'تصدير التقارير', 'Export reports', 'reports'),
('settings.view', 'عرض الإعدادات', 'View settings', 'settings'),
('settings.edit', 'تعديل الإعدادات', 'Edit settings', 'settings'),
('audit.view', 'عرض سجل التدقيق', 'View audit logs', 'audit'),
('cms.view', 'عرض المحتوى', 'View CMS content', 'cms'),
('cms.manage', 'إدارة المحتوى', 'Manage CMS content', 'cms');

-- Enable realtime for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;