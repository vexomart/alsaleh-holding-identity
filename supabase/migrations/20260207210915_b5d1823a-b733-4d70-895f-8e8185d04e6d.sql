-- Fix generate_invoice_number function to handle NULL tenant_id correctly
CREATE OR REPLACE FUNCTION public.generate_invoice_number(p_tenant_id uuid DEFAULT NULL)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  year_str text;
  next_num integer;
  invoice_num text;
BEGIN
  year_str := TO_CHAR(NOW(), 'YYYY');
  
  -- Get the next invoice number, handling NULL tenant_id
  IF p_tenant_id IS NULL THEN
    SELECT COALESCE(MAX(
      CAST(NULLIF(SPLIT_PART(invoice_number, '-', 3), '') AS integer)
    ), 0) + 1
    INTO next_num
    FROM public.invoices
    WHERE invoice_number LIKE 'INV-' || year_str || '-%'
      AND tenant_id IS NULL;
  ELSE
    SELECT COALESCE(MAX(
      CAST(NULLIF(SPLIT_PART(invoice_number, '-', 3), '') AS integer)
    ), 0) + 1
    INTO next_num
    FROM public.invoices
    WHERE invoice_number LIKE 'INV-' || year_str || '-%'
      AND tenant_id = p_tenant_id;
  END IF;
  
  invoice_num := 'INV-' || year_str || '-' || LPAD(next_num::text, 5, '0');
  
  RETURN invoice_num;
END;
$$;

-- Create trigger function to auto-log order events
CREATE OR REPLACE FUNCTION public.log_order_event()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  event_type_value text;
  prev_val jsonb;
  new_val jsonb;
BEGIN
  -- Determine event type based on operation
  IF TG_OP = 'INSERT' THEN
    event_type_value := 'created';
    prev_val := NULL;
    new_val := jsonb_build_object(
      'status', NEW.status,
      'total_amount', NEW.total_amount,
      'assigned_to', NEW.assigned_to,
      'priority', NEW.priority
    );
  ELSIF TG_OP = 'UPDATE' THEN
    -- Check what changed
    IF OLD.status IS DISTINCT FROM NEW.status THEN
      event_type_value := 'status_changed';
      prev_val := jsonb_build_object('status', OLD.status);
      new_val := jsonb_build_object('status', NEW.status);
    ELSIF OLD.assigned_to IS DISTINCT FROM NEW.assigned_to THEN
      event_type_value := 'assigned';
      prev_val := jsonb_build_object('assigned_to', OLD.assigned_to);
      new_val := jsonb_build_object('assigned_to', NEW.assigned_to);
    ELSIF OLD.priority IS DISTINCT FROM NEW.priority THEN
      event_type_value := 'priority_changed';
      prev_val := jsonb_build_object('priority', OLD.priority);
      new_val := jsonb_build_object('priority', NEW.priority);
    ELSIF OLD.total_amount IS DISTINCT FROM NEW.total_amount THEN
      event_type_value := 'amount_changed';
      prev_val := jsonb_build_object('total_amount', OLD.total_amount);
      new_val := jsonb_build_object('total_amount', NEW.total_amount);
    ELSE
      -- Generic update
      event_type_value := 'updated';
      prev_val := to_jsonb(OLD);
      new_val := to_jsonb(NEW);
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    event_type_value := 'cancelled';
    prev_val := to_jsonb(OLD);
    new_val := NULL;
  END IF;

  -- Insert the event
  INSERT INTO public.order_events (
    tenant_id,
    order_id,
    event_type,
    previous_value,
    new_value,
    performed_by,
    metadata
  ) VALUES (
    COALESCE(NEW.tenant_id, OLD.tenant_id),
    COALESCE(NEW.id, OLD.id),
    event_type_value,
    prev_val,
    new_val,
    auth.uid(),
    jsonb_build_object('trigger', 'auto', 'operation', TG_OP)
  );

  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Drop existing trigger if exists and create new one
DROP TRIGGER IF EXISTS order_event_logger ON public.orders;

CREATE TRIGGER order_event_logger
  AFTER INSERT OR UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.log_order_event();

-- Add an initial event for the current order if none exists
INSERT INTO public.order_events (tenant_id, order_id, event_type, new_value, metadata)
SELECT 
  o.tenant_id,
  o.id,
  'created',
  jsonb_build_object('status', o.status, 'total_amount', o.total_amount),
  jsonb_build_object('note', 'Initial event created retroactively')
FROM public.orders o
LEFT JOIN public.order_events e ON e.order_id = o.id
WHERE e.id IS NULL
GROUP BY o.id;