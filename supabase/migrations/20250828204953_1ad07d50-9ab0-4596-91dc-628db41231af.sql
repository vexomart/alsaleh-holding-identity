-- حذف البيانات السابقة من الفواتير
DELETE FROM invoices;

-- إضافة دالة لإنشاء أرقام فواتير عشوائية
CREATE OR REPLACE FUNCTION public.generate_random_invoice_number()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
    random_number TEXT;
    year_part TEXT;
    month_part TEXT;
BEGIN
    -- إنشاء رقم عشوائي من 6 أرقام
    random_number := LPAD(floor(random() * 1000000)::text, 6, '0');
    
    -- إضافة السنة والشهر
    year_part := TO_CHAR(CURRENT_DATE, 'YY');
    month_part := TO_CHAR(CURRENT_DATE, 'MM');
    
    -- تكوين رقم الفاتورة النهائي
    RETURN 'INV-' || year_part || month_part || '-' || random_number;
END;
$function$;

-- إضافة trigger لإنشاء رقم الفاتورة تلقائياً
CREATE OR REPLACE FUNCTION public.auto_set_invoice_number()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF NEW.invoice_number IS NULL OR NEW.invoice_number = '' THEN
    NEW.invoice_number := generate_random_invoice_number();
  END IF;
  RETURN NEW;
END;
$function$;

-- إنشاء trigger
DROP TRIGGER IF EXISTS set_invoice_number_trigger ON invoices;
CREATE TRIGGER set_invoice_number_trigger
  BEFORE INSERT ON invoices
  FOR EACH ROW
  EXECUTE FUNCTION auto_set_invoice_number();

-- إضافة جدول للإشعارات الحقيقية
CREATE TABLE IF NOT EXISTS invoice_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  invoice_id uuid REFERENCES invoices NOT NULL,
  notification_type text NOT NULL, -- 'created', 'updated', 'paid', 'overdue'
  title text NOT NULL,
  message text NOT NULL,
  is_read boolean DEFAULT false,
  sent_via_email boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now()
);

-- تفعيل RLS على جدول الإشعارات
ALTER TABLE invoice_notifications ENABLE ROW LEVEL SECURITY;

-- إضافة policies للإشعارات
CREATE POLICY "Users can view their own notifications" ON invoice_notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications" ON invoice_notifications
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their notifications" ON invoice_notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- إضافة دالة لإنشاء إشعارات تلقائية
CREATE OR REPLACE FUNCTION public.create_invoice_notification()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- إنشاء إشعار عند إنشاء فاتورة جديدة
  IF TG_OP = 'INSERT' THEN
    INSERT INTO invoice_notifications (
      user_id,
      invoice_id,
      notification_type,
      title,
      message
    ) VALUES (
      NEW.user_id,
      NEW.id,
      'created',
      'فاتورة جديدة',
      'تم إنشاء فاتورة جديدة رقم ' || NEW.invoice_number
    );
  END IF;
  
  -- إنشاء إشعار عند تحديث حالة الدفع
  IF TG_OP = 'UPDATE' AND OLD.payment_status != NEW.payment_status THEN
    INSERT INTO invoice_notifications (
      user_id,
      invoice_id,
      notification_type,
      title,
      message
    ) VALUES (
      NEW.user_id,
      NEW.id,
      CASE 
        WHEN NEW.payment_status = 'completed' THEN 'paid'
        WHEN NEW.payment_status = 'failed' THEN 'failed'
        ELSE 'updated'
      END,
      CASE 
        WHEN NEW.payment_status = 'completed' THEN 'تم دفع الفاتورة'
        WHEN NEW.payment_status = 'failed' THEN 'فشل في دفع الفاتورة'
        ELSE 'تم تحديث الفاتورة'
      END,
      CASE 
        WHEN NEW.payment_status = 'completed' THEN 'تم دفع الفاتورة رقم ' || NEW.invoice_number || ' بنجاح'
        WHEN NEW.payment_status = 'failed' THEN 'فشل في دفع الفاتورة رقم ' || NEW.invoice_number
        ELSE 'تم تحديث حالة الفاتورة رقم ' || NEW.invoice_number
      END
    );
  END IF;
  
  RETURN NEW;
END;
$function$;

-- إنشاء trigger للإشعارات
DROP TRIGGER IF EXISTS invoice_notification_trigger ON invoices;
CREATE TRIGGER invoice_notification_trigger
  AFTER INSERT OR UPDATE ON invoices
  FOR EACH ROW
  EXECUTE FUNCTION create_invoice_notification();

-- دالة للحصول على رقم فاتورة جديد للاستخدام من الخارج
CREATE OR REPLACE FUNCTION public.get_new_invoice_number()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  RETURN public.generate_random_invoice_number();
END;
$function$;

-- تفعيل realtime للإشعارات
ALTER PUBLICATION supabase_realtime ADD TABLE invoice_notifications;