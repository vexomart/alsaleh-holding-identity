-- Add sample notifications using allowed types
INSERT INTO project_notifications (
  project_id,
  recipient_email,
  notification_type,
  title,
  message,
  is_read,
  sent_via_email
) VALUES 
(gen_random_uuid(), 'admin@tasaheel.com.sa', 'project_started', 'مشروع جديد', 'تم بدء مشروع تطوير موقع إلكتروني للعميل علي الشهري', false, false),
(gen_random_uuid(), 'admin@tasaheel.com.sa', 'status_change', 'تحديث حالة دفعة', 'تم استلام دفعة مالية جديدة بمبلغ 500 ريال سعودي', false, true),
(gen_random_uuid(), 'admin@tasaheel.com.sa', 'issue_reported', 'طلب شحن محفظة', 'تم استلام طلب شحن محفظة رقمية بمبلغ 100 ريال سعودي', false, false),
(gen_random_uuid(), 'admin@tasaheel.com.sa', 'deadline_approaching', 'موعد استحقاق قريب', 'يوجد فاتورة بموعد استحقاق خلال 3 أيام - رقم INV25000001', false, true),
(gen_random_uuid(), 'admin@tasaheel.com.sa', 'project_completed', 'اكتمال مشروع', 'تم اكتمال مشروع تطوير التطبيق بنجاح', false, false);