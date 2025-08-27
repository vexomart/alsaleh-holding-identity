-- Get existing project ID or create sample data safely
DO $$
DECLARE
  existing_project_id UUID;
BEGIN
  -- Try to get an existing project ID
  SELECT id INTO existing_project_id FROM projects LIMIT 1;
  
  -- If no projects exist, create one
  IF existing_project_id IS NULL THEN
    INSERT INTO projects (
      project_number,
      title,
      description,
      status,
      budget,
      user_id
    ) VALUES (
      'PR25000001',
      'مشروع تجريبي للإشعارات',
      'مشروع تجريبي لاختبار نظام الإشعارات',
      'active',
      1000,
      auth.uid()
    ) RETURNING id INTO existing_project_id;
  END IF;
  
  -- Now add sample notifications with valid project ID
  INSERT INTO project_notifications (
    project_id,
    recipient_email,
    notification_type,
    title,
    message,
    is_read,
    sent_via_email
  ) VALUES 
  (existing_project_id, 'admin@tasaheel.com.sa', 'project_started', 'مشروع جديد', 'تم بدء مشروع تطوير موقع إلكتروني للعميل علي الشهري', false, false),
  (existing_project_id, 'admin@tasaheel.com.sa', 'status_change', 'تحديث حالة دفعة', 'تم استلام دفعة مالية جديدة بمبلغ 500 ريال سعودي', false, true),
  (existing_project_id, 'admin@tasaheel.com.sa', 'issue_reported', 'طلب شحن محفظة', 'تم استلام طلب شحن محفظة رقمية بمبلغ 100 ريال سعودي', false, false),
  (existing_project_id, 'admin@tasaheel.com.sa', 'deadline_approaching', 'موعد استحقاق قريب', 'يوجد فاتورة بموعد استحقاق خلال 3 أيام - رقم INV25000001', false, true),
  (existing_project_id, 'admin@tasaheel.com.sa', 'project_completed', 'اكتمال مشروع', 'تم اكتمال مشروع تطوير التطبيق بنجاح', false, false);
END $$;