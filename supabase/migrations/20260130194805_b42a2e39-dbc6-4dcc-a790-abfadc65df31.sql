-- =====================================================
-- PHASE 0.5B: CREATE TABLES + INDEXES + RLS
-- =====================================================

-- A.1) CREATE MISSING TABLES
-- =====================================================

-- ORDER_EVENTS (Audit trail for orders)
CREATE TABLE IF NOT EXISTS public.order_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  previous_value JSONB,
  new_value JSONB,
  performed_by UUID,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- PAGE_SECTIONS (for CMS)
CREATE TABLE IF NOT EXISTS public.page_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  page_id UUID NOT NULL REFERENCES public.pages(id) ON DELETE CASCADE,
  section_type TEXT NOT NULL,
  content JSONB DEFAULT '{}',
  sort_order INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- A.2) CREATE INDEXES
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_order_events_order_id ON public.order_events(order_id);
CREATE INDEX IF NOT EXISTS idx_order_events_tenant_id ON public.order_events(tenant_id);
CREATE INDEX IF NOT EXISTS idx_order_events_created_at ON public.order_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_events_event_type ON public.order_events(event_type);

CREATE INDEX IF NOT EXISTS idx_page_sections_page_id ON public.page_sections(page_id);
CREATE INDEX IF NOT EXISTS idx_page_sections_tenant_id ON public.page_sections(tenant_id);
CREATE INDEX IF NOT EXISTS idx_page_sections_sort_order ON public.page_sections(sort_order);

CREATE INDEX IF NOT EXISTS idx_orders_tenant_id ON public.orders(tenant_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON public.orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);

-- A.3) ENABLE RLS
-- =====================================================
ALTER TABLE public.order_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_sections ENABLE ROW LEVEL SECURITY;

-- A.4) SECURITY DEFINER FUNCTION for permission check
-- =====================================================
CREATE OR REPLACE FUNCTION public.has_permission(_user_id UUID, _permission TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    JOIN public.role_permissions rp ON ur.role = rp.role
    JOIN public.permissions p ON rp.permission_id = p.id
    WHERE ur.user_id = _user_id
      AND p.name = _permission
      AND (ur.expires_at IS NULL OR ur.expires_at > now())
  )
$$;

-- Function to check if user is super_admin
CREATE OR REPLACE FUNCTION public.is_super_admin(_user_id UUID)
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
      AND role = 'super_admin'
      AND (expires_at IS NULL OR expires_at > now())
  )
$$;

-- A.5) RLS POLICIES FOR order_events
-- =====================================================
CREATE POLICY "order_events_select" ON public.order_events
FOR SELECT USING (
  is_super_admin(auth.uid())
  OR tenant_id = get_user_tenant_id(auth.uid())
);

CREATE POLICY "order_events_insert" ON public.order_events
FOR INSERT WITH CHECK (
  tenant_id = get_user_tenant_id(auth.uid())
);

-- A.6) RLS POLICIES FOR page_sections
-- =====================================================
CREATE POLICY "page_sections_select" ON public.page_sections
FOR SELECT USING (
  is_super_admin(auth.uid())
  OR tenant_id = get_user_tenant_id(auth.uid())
);

CREATE POLICY "page_sections_admin" ON public.page_sections
FOR ALL USING (
  is_admin(auth.uid(), tenant_id)
);

-- A.7) REALTIME for order_events
-- =====================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.order_events;