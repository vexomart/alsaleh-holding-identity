-- إنشاء جدول إشعارات المشاريع المطلوب
CREATE TABLE IF NOT EXISTS public.project_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID,
  recipient_email TEXT NOT NULL,
  notification_type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  is_read BOOLEAN DEFAULT false,
  sent_via_email BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- تفعيل RLS
ALTER TABLE public.project_notifications ENABLE ROW LEVEL SECURITY;

-- إضافة سياسة للأدمن
CREATE POLICY "الجميع يمكنهم رؤية إشعارات المشاريع" 
ON public.project_notifications 
FOR ALL 
TO public 
USING (true);

-- إضافة فهرس للأداء
CREATE INDEX idx_project_notifications_project_id ON public.project_notifications(project_id);
CREATE INDEX idx_project_notifications_email ON public.project_notifications(recipient_email);
CREATE INDEX idx_project_notifications_created_at ON public.project_notifications(created_at);