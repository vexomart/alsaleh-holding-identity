-- Add performance indexes for services table
-- Index for admin filtering (tenant + active + sort)
CREATE INDEX IF NOT EXISTS idx_services_tenant_active_sort 
ON public.services (tenant_id, is_active, sort_order);

-- Index for category filtering
CREATE INDEX IF NOT EXISTS idx_services_tenant_category 
ON public.services (tenant_id, category);

-- Index for customer view (active + visible + sort)
CREATE INDEX IF NOT EXISTS idx_services_customer_view 
ON public.services (is_active, is_visible_to_customers, sort_order) 
WHERE is_active = true AND is_visible_to_customers = true;

-- Index for created_at ordering
CREATE INDEX IF NOT EXISTS idx_services_created_at 
ON public.services (created_at DESC);