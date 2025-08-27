-- Update RLS policies for better data visibility

-- Fix invoices RLS to allow admins to see all invoices
DROP POLICY IF EXISTS "invoices_ultra_secure_admin_access" ON invoices;
CREATE POLICY "Admin can view all invoices" ON invoices
  FOR SELECT USING (
    has_role(auth.uid(), 'admin'::app_role) AND auth.uid() IS NOT NULL
  );

-- Add notification insertion for wallet deposits
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
    'payment_received',
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

-- Create some sample notifications to test the system
INSERT INTO project_notifications (
  project_id,
  recipient_email,
  notification_type, 
  title,
  message,
  is_read,
  sent_via_email
) VALUES 
(gen_random_uuid(), 'admin@tasaheel.com.sa', 'system', 'تفعيل نظام الإشعارات', 'تم تفعيل نظام الإشعارات بنجاح', false, false),
(gen_random_uuid(), 'admin@tasaheel.com.sa', 'payment_received', 'استلام دفعة جديدة', 'تم استلام دفعة بمبلغ 500 ريال سعودي', false, true),
(gen_random_uuid(), 'admin@tasaheel.com.sa', 'urgent', 'مراجعة طلب عاجل', 'يرجى مراجعة الطلب العاجل رقم #12345', false, false);