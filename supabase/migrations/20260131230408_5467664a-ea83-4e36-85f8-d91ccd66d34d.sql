-- =====================================================
-- PHASE FIN-4: Transaction Timeline & Audit Enhancement
-- =====================================================

-- Transaction Events Table for Timeline Tracking
CREATE TABLE IF NOT EXISTS public.transaction_events (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  transaction_id uuid NOT NULL REFERENCES public.financial_transactions(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  previous_status text,
  new_status text,
  metadata jsonb DEFAULT '{}'::jsonb,
  provider_payload jsonb, -- Sanitized provider response
  performed_by uuid, -- User who triggered the event (null for system events)
  ip_address inet,
  user_agent text,
  created_at timestamp with time zone DEFAULT now()
);

-- Create index for fast timeline queries
CREATE INDEX idx_transaction_events_transaction_id ON public.transaction_events(transaction_id);
CREATE INDEX idx_transaction_events_event_type ON public.transaction_events(event_type);
CREATE INDEX idx_transaction_events_created_at ON public.transaction_events(created_at DESC);

-- Enable RLS
ALTER TABLE public.transaction_events ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Admins can read all events
CREATE POLICY "Admins can view transaction events"
ON public.transaction_events
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.financial_transactions ft
    WHERE ft.id = transaction_events.transaction_id
    AND is_admin(auth.uid(), ft.tenant_id)
  )
);

-- RLS Policy: System can insert events (via service role)
CREATE POLICY "System can insert transaction events"
ON public.transaction_events
FOR INSERT
WITH CHECK (true);

-- Full-text search index for financial_transactions
CREATE INDEX IF NOT EXISTS idx_financial_transactions_search 
ON public.financial_transactions 
USING gin(to_tsvector('simple', 
  COALESCE(provider_reference, '') || ' ' || 
  COALESCE(description, '') || ' ' || 
  COALESCE(description_ar, '')
));

-- Add search_vector column for better performance
ALTER TABLE public.financial_transactions 
ADD COLUMN IF NOT EXISTS search_vector tsvector 
GENERATED ALWAYS AS (
  to_tsvector('simple', 
    COALESCE(provider_reference, '') || ' ' || 
    COALESCE(description, '') || ' ' || 
    COALESCE(description_ar, '')
  )
) STORED;

-- Index on search_vector
CREATE INDEX IF NOT EXISTS idx_financial_transactions_search_vector 
ON public.financial_transactions USING gin(search_vector);

-- Function to log transaction events
CREATE OR REPLACE FUNCTION public.log_transaction_event(
  p_transaction_id uuid,
  p_event_type text,
  p_previous_status text DEFAULT NULL,
  p_new_status text DEFAULT NULL,
  p_metadata jsonb DEFAULT '{}'::jsonb,
  p_provider_payload jsonb DEFAULT NULL,
  p_performed_by uuid DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  event_id uuid;
BEGIN
  INSERT INTO public.transaction_events (
    transaction_id,
    event_type,
    previous_status,
    new_status,
    metadata,
    provider_payload,
    performed_by
  ) VALUES (
    p_transaction_id,
    p_event_type,
    p_previous_status,
    p_new_status,
    p_metadata,
    p_provider_payload,
    p_performed_by
  )
  RETURNING id INTO event_id;
  
  RETURN event_id;
END;
$$;

-- Trigger to auto-log status changes
CREATE OR REPLACE FUNCTION public.auto_log_transaction_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    PERFORM public.log_transaction_event(
      NEW.id,
      'status_changed',
      OLD.status::text,
      NEW.status::text,
      jsonb_build_object(
        'auto_logged', true,
        'trigger_source', 'status_change_trigger'
      ),
      NEW.provider_response,
      NULL
    );
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger for auto-logging
DROP TRIGGER IF EXISTS trg_transaction_status_change ON public.financial_transactions;
CREATE TRIGGER trg_transaction_status_change
AFTER UPDATE ON public.financial_transactions
FOR EACH ROW
EXECUTE FUNCTION public.auto_log_transaction_status_change();

-- Function to validate status transition (finite-state machine)
CREATE OR REPLACE FUNCTION public.validate_transaction_status_transition(
  p_current_status text,
  p_new_status text,
  p_transaction_type text
)
RETURNS boolean
LANGUAGE plpgsql
IMMUTABLE
SET search_path TO 'public'
AS $$
BEGIN
  -- Define valid transitions based on finite-state machine
  -- pending -> processing, cancelled, failed
  -- processing -> succeeded, failed, cancelled
  -- succeeded -> refunded (only for invoice_payment and topup)
  -- failed -> pending (retry allowed)
  -- cancelled -> (terminal state)
  -- refunded -> (terminal state)
  
  CASE p_current_status
    WHEN 'pending' THEN
      RETURN p_new_status IN ('processing', 'cancelled', 'failed');
    WHEN 'processing' THEN
      RETURN p_new_status IN ('succeeded', 'failed', 'cancelled');
    WHEN 'succeeded' THEN
      IF p_transaction_type IN ('invoice_payment', 'topup') THEN
        RETURN p_new_status = 'refunded';
      END IF;
      RETURN false;
    WHEN 'failed' THEN
      RETURN p_new_status = 'pending'; -- Allow retry
    WHEN 'cancelled' THEN
      RETURN false; -- Terminal state
    WHEN 'refunded' THEN
      RETURN false; -- Terminal state
    ELSE
      RETURN false;
  END CASE;
END;
$$;

-- Trigger to enforce status transitions
CREATE OR REPLACE FUNCTION public.enforce_transaction_status_transition()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Skip validation if status hasn't changed
  IF OLD.status = NEW.status THEN
    RETURN NEW;
  END IF;
  
  -- Validate the transition
  IF NOT public.validate_transaction_status_transition(
    OLD.status::text, 
    NEW.status::text, 
    NEW.transaction_type::text
  ) THEN
    RAISE EXCEPTION 'Invalid status transition from % to % for transaction type %', 
      OLD.status, NEW.status, NEW.transaction_type;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create enforcement trigger
DROP TRIGGER IF EXISTS trg_enforce_status_transition ON public.financial_transactions;
CREATE TRIGGER trg_enforce_status_transition
BEFORE UPDATE ON public.financial_transactions
FOR EACH ROW
EXECUTE FUNCTION public.enforce_transaction_status_transition();

-- Validate amount (cannot be negative except for specific types)
CREATE OR REPLACE FUNCTION public.validate_transaction_amount()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Amount must be positive for all transaction types
  IF NEW.amount < 0 THEN
    RAISE EXCEPTION 'Transaction amount cannot be negative. Amount: %', NEW.amount;
  END IF;
  
  -- Amount cannot be zero
  IF NEW.amount = 0 THEN
    RAISE EXCEPTION 'Transaction amount cannot be zero';
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create amount validation trigger
DROP TRIGGER IF EXISTS trg_validate_transaction_amount ON public.financial_transactions;
CREATE TRIGGER trg_validate_transaction_amount
BEFORE INSERT OR UPDATE ON public.financial_transactions
FOR EACH ROW
EXECUTE FUNCTION public.validate_transaction_amount();

-- Add realtime for transaction_events
ALTER PUBLICATION supabase_realtime ADD TABLE public.transaction_events;