
-- Update the admin approval function to credit wallet automatically
CREATE OR REPLACE FUNCTION public.approve_finance_contract_with_wallet_credit(
  p_contract_id uuid,
  p_admin_id uuid,
  p_notes text DEFAULT NULL::text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_contract finance_contracts%ROWTYPE;
  v_application finance_applications%ROWTYPE;
  v_entity entities%ROWTYPE;
  v_wallet customer_wallets%ROWTYPE;
  v_transaction_id uuid;
  v_wallet_id uuid;
  v_amount numeric;
  v_customer_user_id uuid;
BEGIN
  -- Get contract
  SELECT * INTO v_contract FROM finance_contracts WHERE id = p_contract_id;
  
  IF v_contract IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'العقد غير موجود');
  END IF;
  
  IF v_contract.status NOT IN ('pending_signature', 'signed') THEN
    RETURN jsonb_build_object('success', false, 'error', 'لا يمكن الموافقة على العقد في هذه الحالة');
  END IF;
  
  -- Get application to get amount
  SELECT * INTO v_application FROM finance_applications WHERE id = v_contract.application_id;
  
  IF v_application IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'طلب التمويل غير موجود');
  END IF;
  
  v_amount := v_application.amount_sar;
  
  -- Get entity to find owner user
  SELECT * INTO v_entity FROM entities WHERE id = v_application.entity_id;
  
  IF v_entity IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'الجهة غير موجودة');
  END IF;
  
  v_customer_user_id := v_entity.owner_user_id;
  
  -- Get or create wallet for customer
  SELECT * INTO v_wallet FROM customer_wallets WHERE customer_user_id = v_customer_user_id;
  
  IF v_wallet IS NULL THEN
    -- Create new wallet
    INSERT INTO customer_wallets (
      customer_user_id, 
      wallet_number, 
      balance, 
      currency, 
      status,
      tenant_id
    ) VALUES (
      v_customer_user_id,
      '4' || lpad(floor(random() * 1000000000000000)::text, 15, '0'),
      0,
      'SAR',
      'active',
      v_application.tenant_id
    ) RETURNING * INTO v_wallet;
  END IF;
  
  v_wallet_id := v_wallet.id;
  
  -- Update contract status to active
  UPDATE finance_contracts
  SET status = 'active',
      admin_approved_at = now(),
      admin_approved_by = p_admin_id,
      updated_at = now()
  WHERE id = p_contract_id;
  
  -- Update application status to disbursed
  UPDATE finance_applications
  SET status = 'disbursed',
      updated_at = now()
  WHERE id = v_contract.application_id;
  
  -- Create financial transaction for the disbursement
  INSERT INTO financial_transactions (
    customer_user_id,
    wallet_id,
    transaction_type,
    amount,
    currency,
    status,
    provider,
    provider_reference,
    description,
    description_ar,
    processed_at,
    tenant_id,
    metadata
  ) VALUES (
    v_customer_user_id,
    v_wallet_id,
    'topup',
    v_amount,
    'SAR',
    'succeeded',
    'finance_disbursement',
    'FIN-' || v_contract.contract_number,
    'Finance disbursement for contract ' || v_contract.contract_number,
    'صرف تمويل للعقد ' || v_contract.contract_number,
    now(),
    v_application.tenant_id,
    jsonb_build_object(
      'contract_id', p_contract_id,
      'application_id', v_contract.application_id,
      'approved_by', p_admin_id,
      'notes', p_notes
    )
  ) RETURNING id INTO v_transaction_id;
  
  -- Credit wallet balance
  UPDATE customer_wallets 
  SET balance = balance + v_amount, 
      updated_at = now()
  WHERE id = v_wallet_id;
  
  -- Generate installments
  PERFORM generate_finance_installments(
    p_contract_id,
    (SELECT total_payable_sar FROM finance_offers WHERE id = v_contract.offer_id),
    v_application.tenor_months,
    CURRENT_DATE
  );
  
  -- Log the audit
  PERFORM log_finance_audit(
    p_admin_id,
    'finance_contract',
    p_contract_id,
    'approved_with_disbursement',
    jsonb_build_object(
      'amount', v_amount,
      'wallet_id', v_wallet_id,
      'transaction_id', v_transaction_id,
      'notes', p_notes
    ),
    v_application.tenant_id
  );
  
  -- Create notification for customer
  INSERT INTO notifications (
    user_id,
    tenant_id,
    type,
    severity,
    title,
    title_ar,
    message,
    message_ar,
    link,
    metadata
  ) VALUES (
    v_customer_user_id,
    v_application.tenant_id,
    'info',
    'success',
    'Finance Approved - Funds Deposited',
    'تمت الموافقة على التمويل - تم إيداع المبلغ',
    'Your finance application has been approved and ' || v_amount || ' SAR has been deposited to your wallet.',
    'تمت الموافقة على طلب التمويل الخاص بك وتم إيداع ' || v_amount || ' ريال في محفظتك.',
    '/app/wallet',
    jsonb_build_object(
      'contract_id', p_contract_id,
      'amount', v_amount,
      'transaction_id', v_transaction_id
    )
  );
  
  RETURN jsonb_build_object(
    'success', true,
    'message', 'تمت الموافقة وإيداع المبلغ بنجاح',
    'contract_id', p_contract_id,
    'transaction_id', v_transaction_id,
    'amount_credited', v_amount,
    'new_balance', v_wallet.balance + v_amount,
    'wallet_id', v_wallet_id
  );
END;
$function$;
