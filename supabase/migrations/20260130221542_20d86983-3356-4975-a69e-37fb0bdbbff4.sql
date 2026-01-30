-- Add missing columns to services table for advanced management
ALTER TABLE public.services 
ADD COLUMN IF NOT EXISTS include_vat boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS is_visible_to_customers boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS short_description text,
ADD COLUMN IF NOT EXISTS short_description_ar text;

-- Create index for better performance on sorting and filtering
CREATE INDEX IF NOT EXISTS idx_services_sort_order ON public.services(sort_order);
CREATE INDEX IF NOT EXISTS idx_services_category ON public.services(category);
CREATE INDEX IF NOT EXISTS idx_services_visibility ON public.services(is_active, is_visible_to_customers);

-- Create function to get sorted services by category
CREATE OR REPLACE FUNCTION public.get_services_by_category(
  p_tenant_id uuid DEFAULT NULL,
  p_include_inactive boolean DEFAULT false
)
RETURNS TABLE (
  category text,
  services jsonb
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.category,
    jsonb_agg(
      jsonb_build_object(
        'id', s.id,
        'name', s.name,
        'name_ar', s.name_ar,
        'description', s.description,
        'description_ar', s.description_ar,
        'short_description', s.short_description,
        'short_description_ar', s.short_description_ar,
        'price', s.price,
        'currency', s.currency,
        'include_vat', s.include_vat,
        'is_active', s.is_active,
        'is_visible_to_customers', s.is_visible_to_customers,
        'icon', s.icon,
        'image_url', s.image_url,
        'sort_order', s.sort_order,
        'metadata', s.metadata,
        'created_at', s.created_at,
        'updated_at', s.updated_at
      ) ORDER BY s.sort_order ASC
    ) as services
  FROM public.services s
  WHERE 
    (p_tenant_id IS NULL OR s.tenant_id = p_tenant_id)
    AND (p_include_inactive OR s.is_active = true)
  GROUP BY s.category
  ORDER BY MIN(s.sort_order);
END;
$$;

-- Create function to update service sort order (for drag & drop)
CREATE OR REPLACE FUNCTION public.update_services_sort_order(
  p_service_orders jsonb
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  service_record jsonb;
BEGIN
  FOR service_record IN SELECT * FROM jsonb_array_elements(p_service_orders)
  LOOP
    UPDATE public.services
    SET sort_order = (service_record->>'sort_order')::integer,
        updated_at = now()
    WHERE id = (service_record->>'id')::uuid;
  END LOOP;
  
  RETURN true;
END;
$$;

-- Create function to get next sort order for new service
CREATE OR REPLACE FUNCTION public.get_next_service_sort_order(
  p_tenant_id uuid DEFAULT NULL
)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  max_order integer;
BEGIN
  SELECT COALESCE(MAX(sort_order), 0) + 1
  INTO max_order
  FROM public.services
  WHERE p_tenant_id IS NULL OR tenant_id = p_tenant_id;
  
  RETURN max_order;
END;
$$;