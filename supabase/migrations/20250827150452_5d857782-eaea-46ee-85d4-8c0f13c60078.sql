-- First let's see what notification types are allowed
-- Then update policies without adding restricted notification types

-- Update invoices RLS policies only
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

-- Add notification function for wallet deposits using allowed types
CREATE OR REPLACE FUNCTION create_wallet_deposit_notification()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert notification for wallet deposit using 'project_update' type
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
    'project_update',
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