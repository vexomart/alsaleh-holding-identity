-- تحديث المعاملة المعلقة إلى مدفوعة وإنشاء الطلبات المطلوبة
UPDATE payment_transactions 
SET status = 'PAID', updated_at = now()
WHERE id = '65b5bcf5-3daa-4e3d-9aa7-d91372a222a7' AND status = 'INITIATED';

-- إنشاء طلب الخدمة للمعاملة
INSERT INTO service_requests (
  user_id,
  service_type,
  title,
  description,
  status,
  priority,
  estimated_cost,
  notes
)
SELECT 
  user_id,
  'payment_based',
  offer_title,
  'طلب خدمة من المعاملة: ' || paylink_transaction_no,
  'pending',
  'high',
  amount,
  'تم الدفع بمبلغ ' || amount || ' ' || currency || ' عبر ' || payment_method
FROM payment_transactions 
WHERE id = '65b5bcf5-3daa-4e3d-9aa7-d91372a222a7'
AND NOT EXISTS (
  SELECT 1 FROM service_requests 
  WHERE user_id = payment_transactions.user_id 
  AND title = payment_transactions.offer_title
  AND created_at::date = payment_transactions.created_at::date
);

-- إضافة سجل الدفع
INSERT INTO payment_history (
  user_id,
  amount,
  currency,
  payment_method,
  status,
  reference_number,
  notes,
  payment_date
)
SELECT 
  user_id,
  amount,
  currency,
  payment_method,
  'completed',
  paylink_transaction_no,
  'دفع مقابل: ' || offer_title,
  created_at
FROM payment_transactions 
WHERE id = '65b5bcf5-3daa-4e3d-9aa7-d91372a222a7'
AND NOT EXISTS (
  SELECT 1 FROM payment_history 
  WHERE user_id = payment_transactions.user_id 
  AND reference_number = payment_transactions.paylink_transaction_no
);

-- تسجيل النشاط
INSERT INTO user_activity_logs (
  user_id,
  activity_type,
  description,
  metadata
)
SELECT 
  user_id,
  'payment',
  'دفع ناجح لخدمة: ' || offer_title,
  jsonb_build_object(
    'transaction_id', id,
    'amount', amount,
    'currency', currency,
    'payment_method', payment_method
  )
FROM payment_transactions 
WHERE id = '65b5bcf5-3daa-4e3d-9aa7-d91372a222a7'
AND NOT EXISTS (
  SELECT 1 FROM user_activity_logs 
  WHERE user_id = payment_transactions.user_id 
  AND activity_type = 'payment'
  AND metadata->>'transaction_id' = payment_transactions.id::text
);