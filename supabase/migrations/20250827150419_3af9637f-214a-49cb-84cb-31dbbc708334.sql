-- Fix RLS policies and add proper notifications

-- Update invoices RLS policies  
DROP POLICY IF EXISTS "invoices_ultra_secure_admin_access" ON invoices;
DROP POLICY IF EXISTS "invoices_ultra_secure_owner_access" ON invoices;

CREATE POLICY "Admin can view all invoices" ON invoices
  FOR SELECT USING (
    has_role(auth.uid(), 'admin'::app_role) AND auth.uid() IS NOT NULL
  );

CREATE POLICY "Users can view their own invoices" ON invoices  
  FOR SELECT USING (
    user_id = auth.uid() AND auth.uid() IS NOT NULL
  );

-- Add notification function for wallet deposits
CREATE OR REPLACE FUNCTION create_wallet_deposit_notification()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert notification for wallet deposit  
  INSERT INTO project_notifications (
    project_id,
    recipient_email,
    notification_type,
    title,
    message,
    is_read,
    sent_via_email
  ) VALUES (
    NEW.id,
    'admin@tasaheel.com.sa', 
    'wallet_deposit',
    'طلب شحن محفظة جديد',
    'تم استلام طلب شحن محفظة بمبلغ ' || NEW.amount || ' ريال سعودي من المرجع: ' || NEW.reference_id,
    false,
    true
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Create trigger for wallet deposits
DROP TRIGGER IF EXISTS wallet_deposit_notification_trigger ON wallet_transactions;
CREATE TRIGGER wallet_deposit_notification_trigger
  AFTER INSERT ON wallet_transactions
  FOR EACH ROW 
  WHEN (NEW.transaction_type = 'deposit')
  EXECUTE FUNCTION create_wallet_deposit_notification();

-- Add sample notifications
INSERT INTO project_notifications (
  project_id,
  recipient_email,
  notification_type,
  title, 
  message,
  is_read,
  sent_via_email
) VALUES 
(gen_random_uuid(), 'admin@tasaheel.com.sa', 'wallet_deposit', 'طلب شحن محفظة', 'تم استلام طلب شحن محفظة بمبلغ 100 ريال سعودي', false, false),
(gen_random_uuid(), 'admin@tasaheel.com.sa', 'payment_update', 'تحديث دفعة', 'تم تحديث حالة الدفعة رقم INV25000001', false, true),
(gen_random_uuid(), 'admin@tasaheel.com.sa', 'invoice_created', 'فاتورة جديدة', 'تم إنشاء فاتورة جديدة رقم INV25000002', false, false);