
-- Fix admin_approve_contract to handle missing users gracefully
CREATE OR REPLACE FUNCTION public.admin_approve_contract(
  p_contract_id uuid,
  p_admin_id uuid,
  p_notes text DEFAULT NULL::text,
  p_modified_pricing jsonb DEFAULT NULL::jsonb
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_contract contracts%ROWTYPE;
  v_user_exists boolean := false;
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
  
  -- Check if user exists before creating notification
  SELECT EXISTS(
    SELECT 1 FROM auth.users WHERE id = v_contract.customer_user_id
  ) INTO v_user_exists;
  
  -- Only create notification if user exists in auth.users
  IF v_user_exists THEN
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
  END IF;
  
  RETURN true;
END;
$function$;

-- Also fix admin_reject_contract for consistency
CREATE OR REPLACE FUNCTION public.admin_reject_contract(
  p_contract_id uuid,
  p_admin_id uuid,
  p_reason text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_contract contracts%ROWTYPE;
  v_user_exists boolean := false;
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
      admin_approved_at = now(),
      updated_at = now()
  WHERE id = p_contract_id;
  
  -- Check if user exists before creating notification
  SELECT EXISTS(
    SELECT 1 FROM auth.users WHERE id = v_contract.customer_user_id
  ) INTO v_user_exists;
  
  -- Only create notification if user exists
  IF v_user_exists THEN
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
      'Contract Rejected',
      'تم رفض العقد',
      'Your contract has been rejected. Reason: ' || p_reason,
      'تم رفض عقدك. السبب: ' || p_reason,
      '/app/contracts/' || p_contract_id,
      jsonb_build_object('contract_id', p_contract_id, 'reason', p_reason)
    );
  END IF;
  
  RETURN true;
END;
$function$;
