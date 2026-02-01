-- =====================================================
-- CONTRACT PRE-APPROVAL FLOW MIGRATION
-- Phase: Service-Contract Integration
-- =====================================================

-- 1) Update contract_status enum to include new statuses
ALTER TYPE public.contract_status ADD VALUE IF NOT EXISTS 'pre_approved_by_customer' AFTER 'draft';
ALTER TYPE public.contract_status ADD VALUE IF NOT EXISTS 'pending_admin_approval' AFTER 'pre_approved_by_customer';

-- 2) Add default_contract_template_id to services table
ALTER TABLE public.services
ADD COLUMN IF NOT EXISTS default_contract_template_id uuid REFERENCES public.contract_templates(id) ON DELETE SET NULL;

-- Add comment for clarity
COMMENT ON COLUMN public.services.default_contract_template_id IS 'Optional contract template to show during service request';

-- 3) Add pre-approval tracking fields to contracts table
ALTER TABLE public.contracts
ADD COLUMN IF NOT EXISTS customer_pre_approval boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS pre_approval_timestamp timestamp with time zone,
ADD COLUMN IF NOT EXISTS pre_approval_ip inet,
ADD COLUMN IF NOT EXISTS pre_approval_metadata jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS admin_approval_notes text,
ADD COLUMN IF NOT EXISTS admin_rejection_reason text,
ADD COLUMN IF NOT EXISTS admin_approved_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS admin_approved_by uuid;

-- Add comments for documentation
COMMENT ON COLUMN public.contracts.customer_pre_approval IS 'Whether customer has given preliminary consent during service request';
COMMENT ON COLUMN public.contracts.pre_approval_timestamp IS 'Timestamp of preliminary consent';
COMMENT ON COLUMN public.contracts.pre_approval_ip IS 'IP address at time of preliminary consent';
COMMENT ON COLUMN public.contracts.pre_approval_metadata IS 'Additional metadata about pre-approval (user agent, etc)';
COMMENT ON COLUMN public.contracts.admin_approval_notes IS 'Notes from admin during approval';
COMMENT ON COLUMN public.contracts.admin_rejection_reason IS 'Reason if admin rejects the contract';
COMMENT ON COLUMN public.contracts.admin_approved_at IS 'Timestamp when admin approved';
COMMENT ON COLUMN public.contracts.admin_approved_by IS 'Admin user ID who approved';

-- 4) Add contract requirement tracking to orders table
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS requires_contract boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS contract_pre_approved boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS contract_id uuid REFERENCES public.contracts(id) ON DELETE SET NULL;

COMMENT ON COLUMN public.orders.requires_contract IS 'Whether this order requires a contract';
COMMENT ON COLUMN public.orders.contract_pre_approved IS 'Whether customer has pre-approved the contract';
COMMENT ON COLUMN public.orders.contract_id IS 'Reference to associated contract';

-- 5) Create index for efficient lookups
CREATE INDEX IF NOT EXISTS idx_services_default_contract_template 
ON public.services(default_contract_template_id) WHERE default_contract_template_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_contracts_status_customer 
ON public.contracts(customer_user_id, status);

CREATE INDEX IF NOT EXISTS idx_orders_contract 
ON public.orders(contract_id) WHERE contract_id IS NOT NULL;

-- 6) Create function to check if service requires contract
CREATE OR REPLACE FUNCTION public.service_requires_contract(p_service_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.services s
    WHERE s.id = p_service_id
    AND s.default_contract_template_id IS NOT NULL
    AND s.is_active = true
  )
$$;

-- 7) Create function to create pre-approved contract from service request
CREATE OR REPLACE FUNCTION public.create_pre_approved_contract(
  p_customer_id uuid,
  p_service_id uuid,
  p_order_id uuid DEFAULT NULL,
  p_ip_address inet DEFAULT NULL,
  p_user_agent text DEFAULT NULL,
  p_tenant_id uuid DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_template_id uuid;
  v_template contract_templates%ROWTYPE;
  v_service services%ROWTYPE;
  v_contract_number text;
  v_contract_id uuid;
  v_pricing jsonb;
BEGIN
  -- Get service details
  SELECT * INTO v_service FROM services WHERE id = p_service_id;
  
  IF v_service IS NULL THEN
    RAISE EXCEPTION 'Service not found';
  END IF;
  
  v_template_id := v_service.default_contract_template_id;
  
  IF v_template_id IS NULL THEN
    RAISE EXCEPTION 'Service does not have a contract template';
  END IF;
  
  -- Get template
  SELECT * INTO v_template FROM contract_templates WHERE id = v_template_id AND is_active = true;
  
  IF v_template IS NULL THEN
    RAISE EXCEPTION 'Contract template not found or inactive';
  END IF;
  
  -- Generate contract number
  v_contract_number := generate_contract_number(COALESCE(p_tenant_id, v_service.tenant_id));
  
  -- Calculate pricing with VAT
  v_pricing := jsonb_build_object(
    'subtotal', COALESCE(v_service.price, 0),
    'vat_rate', 15,
    'vat_amount', ROUND(COALESCE(v_service.price, 0) * 0.15, 2),
    'total', ROUND(COALESCE(v_service.price, 0) * 1.15, 2),
    'currency', COALESCE(v_service.currency, 'SAR')
  );
  
  -- Create contract with pre-approved status
  INSERT INTO contracts (
    contract_number,
    customer_user_id,
    service_id,
    order_id,
    template_id,
    tenant_id,
    status,
    locale,
    pricing_json,
    scope_summary,
    scope_summary_ar,
    terms_snapshot_json,
    customer_pre_approval,
    pre_approval_timestamp,
    pre_approval_ip,
    pre_approval_metadata
  ) VALUES (
    v_contract_number,
    p_customer_id,
    p_service_id,
    p_order_id,
    v_template_id,
    COALESCE(p_tenant_id, v_service.tenant_id),
    'pre_approved_by_customer',
    'ar',
    v_pricing,
    v_service.description,
    v_service.description_ar,
    jsonb_build_object(
      'title_ar', v_template.title_ar,
      'title_en', v_template.title_en,
      'body_ar', v_template.body_ar,
      'body_en', v_template.body_en,
      'template_version', v_template.version
    ),
    true,
    now(),
    p_ip_address,
    jsonb_build_object(
      'user_agent', p_user_agent,
      'created_via', 'service_request_flow'
    )
  ) RETURNING id INTO v_contract_id;
  
  -- Update order with contract reference if order_id provided
  IF p_order_id IS NOT NULL THEN
    UPDATE orders 
    SET contract_id = v_contract_id,
        contract_pre_approved = true,
        requires_contract = true
    WHERE id = p_order_id;
  END IF;
  
  RETURN v_contract_id;
END;
$$;

-- 8) Create function to admin approve contract
CREATE OR REPLACE FUNCTION public.admin_approve_contract(
  p_contract_id uuid,
  p_admin_id uuid,
  p_notes text DEFAULT NULL,
  p_modified_pricing jsonb DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_contract contracts%ROWTYPE;
BEGIN
  -- Get contract
  SELECT * INTO v_contract FROM contracts WHERE id = p_contract_id;
  
  IF v_contract IS NULL THEN
    RAISE EXCEPTION 'Contract not found';
  END IF;
  
  -- Check status allows approval
  IF v_contract.status NOT IN ('pre_approved_by_customer', 'pending_admin_approval') THEN
    RAISE EXCEPTION 'Contract cannot be approved in current status: %', v_contract.status;
  END IF;
  
  -- Update contract
  UPDATE contracts
  SET status = 'pending_signature',
      admin_approved_at = now(),
      admin_approved_by = p_admin_id,
      admin_approval_notes = p_notes,
      pricing_json = COALESCE(p_modified_pricing, pricing_json),
      updated_at = now()
  WHERE id = p_contract_id;
  
  -- Create notification for customer
  INSERT INTO notifications (
    user_id,
    tenant_id,
    type,
    title,
    title_ar,
    message,
    message_ar,
    link,
    metadata
  ) VALUES (
    v_contract.customer_user_id,
    v_contract.tenant_id,
    'info',
    'Contract Ready for Signature',
    'العقد جاهز للتوقيع',
    'Your contract has been approved and is ready for your signature.',
    'تمت الموافقة على عقدك وهو جاهز للتوقيع.',
    '/app/contracts/' || p_contract_id,
    jsonb_build_object('contract_id', p_contract_id, 'contract_number', v_contract.contract_number)
  );
  
  RETURN true;
END;
$$;

-- 9) Create function to admin reject contract
CREATE OR REPLACE FUNCTION public.admin_reject_contract(
  p_contract_id uuid,
  p_admin_id uuid,
  p_reason text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_contract contracts%ROWTYPE;
BEGIN
  -- Get contract
  SELECT * INTO v_contract FROM contracts WHERE id = p_contract_id;
  
  IF v_contract IS NULL THEN
    RAISE EXCEPTION 'Contract not found';
  END IF;
  
  -- Update contract
  UPDATE contracts
  SET status = 'cancelled',
      admin_rejection_reason = p_reason,
      admin_approved_by = p_admin_id,
      updated_at = now()
  WHERE id = p_contract_id;
  
  -- Create notification for customer
  INSERT INTO notifications (
    user_id,
    tenant_id,
    type,
    title,
    title_ar,
    message,
    message_ar,
    link,
    metadata
  ) VALUES (
    v_contract.customer_user_id,
    v_contract.tenant_id,
    'warning',
    'Contract Request Declined',
    'تم رفض طلب العقد',
    'Your contract request has been declined. Reason: ' || p_reason,
    'تم رفض طلب العقد الخاص بك. السبب: ' || p_reason,
    '/app/contracts/' || p_contract_id,
    jsonb_build_object('contract_id', p_contract_id, 'rejection_reason', p_reason)
  );
  
  RETURN true;
END;
$$;