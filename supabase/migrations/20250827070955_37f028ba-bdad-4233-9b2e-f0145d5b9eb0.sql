-- نظام تتبع المشاريع المتقدم
-- إنشاء جداول نظام تتبع المشاريع مع إشعارات في الوقت الفعلي

-- 1. جدول المشاريع الرئيسي
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_number TEXT NOT NULL UNIQUE,
  client_id UUID REFERENCES public.profiles(id),
  assigned_to UUID REFERENCES public.profiles(id),
  title TEXT NOT NULL,
  description TEXT,
  project_type TEXT NOT NULL DEFAULT 'website',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'review', 'completed', 'cancelled', 'on_hold')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  estimated_duration_days INTEGER DEFAULT 30,
  actual_duration_days INTEGER,
  estimated_cost DECIMAL(12,2),
  actual_cost DECIMAL(12,2),
  start_date DATE,
  estimated_completion_date DATE,
  actual_completion_date DATE,
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  client_satisfaction_rating INTEGER CHECK (client_satisfaction_rating >= 1 AND client_satisfaction_rating <= 5),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. جدول مراحل المشروع
CREATE TABLE IF NOT EXISTS public.project_phases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  phase_number INTEGER NOT NULL,
  phase_name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'skipped')),
  estimated_duration_days INTEGER DEFAULT 7,
  actual_duration_days INTEGER,
  start_date DATE,
  end_date DATE,
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  deliverables TEXT[],
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(project_id, phase_number)
);

-- 3. جدول تحديثات المشروع (Timeline)
CREATE TABLE IF NOT EXISTS public.project_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  phase_id UUID REFERENCES public.project_phases(id) ON DELETE SET NULL,
  update_type TEXT NOT NULL DEFAULT 'progress' CHECK (update_type IN ('progress', 'milestone', 'issue', 'completion', 'note', 'status_change')),
  title TEXT NOT NULL,
  description TEXT,
  old_status TEXT,
  new_status TEXT,
  progress_before INTEGER,
  progress_after INTEGER,
  created_by UUID REFERENCES public.profiles(id),
  is_visible_to_client BOOLEAN DEFAULT true,
  attachments JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 4. جدول الملفات والمرفقات
CREATE TABLE IF NOT EXISTS public.project_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  phase_id UUID REFERENCES public.project_phases(id) ON DELETE SET NULL,
  filename TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  description TEXT,
  is_deliverable BOOLEAN DEFAULT false,
  is_visible_to_client BOOLEAN DEFAULT true,
  uploaded_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 5. جدول إشعارات المشروع
CREATE TABLE IF NOT EXISTS public.project_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES public.profiles(id),
  notification_type TEXT NOT NULL CHECK (notification_type IN ('project_started', 'phase_completed', 'status_change', 'deadline_approaching', 'project_completed', 'issue_reported')),
  title TEXT NOT NULL,
  message TEXT,
  is_read BOOLEAN DEFAULT false,
  sent_via_email BOOLEAN DEFAULT false,
  sent_via_whatsapp BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- إنشاء فهارس للأداء
CREATE INDEX IF NOT EXISTS idx_projects_client_id ON public.projects(client_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_assigned_to ON public.projects(assigned_to);
CREATE INDEX IF NOT EXISTS idx_project_phases_project_id ON public.project_phases(project_id);
CREATE INDEX IF NOT EXISTS idx_project_updates_project_id ON public.project_updates(project_id);
CREATE INDEX IF NOT EXISTS idx_project_files_project_id ON public.project_files(project_id);
CREATE INDEX IF NOT EXISTS idx_project_notifications_recipient ON public.project_notifications(recipient_id, is_read);

-- وظائف مساعدة
-- 1. إنشاء رقم مشروع تلقائي
CREATE OR REPLACE FUNCTION public.generate_project_number()
RETURNS TEXT AS $$
DECLARE
    year_suffix TEXT;
    counter INTEGER;
    project_num TEXT;
BEGIN
    year_suffix := TO_CHAR(CURRENT_DATE, 'YY');
    
    SELECT COALESCE(MAX(CAST(SUBSTRING(project_number FROM 4 FOR 6) AS INTEGER)), 0) + 1
    INTO counter
    FROM public.projects
    WHERE project_number LIKE 'PR' || year_suffix || '%';
    
    project_num := 'PR' || year_suffix || LPAD(counter::TEXT, 6, '0');
    
    RETURN project_num;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path TO '';

-- 2. تحديث تقدم المشروع بناءً على المراحل
CREATE OR REPLACE FUNCTION public.update_project_progress()
RETURNS TRIGGER AS $$
DECLARE
    avg_progress INTEGER;
BEGIN
    -- حساب متوسط تقدم جميع المراحل
    SELECT COALESCE(AVG(progress_percentage), 0)::INTEGER
    INTO avg_progress
    FROM public.project_phases
    WHERE project_id = COALESCE(NEW.project_id, OLD.project_id);
    
    -- تحديث تقدم المشروع
    UPDATE public.projects
    SET progress_percentage = avg_progress,
        updated_at = now()
    WHERE id = COALESCE(NEW.project_id, OLD.project_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path TO '';

-- 3. إنشاء إشعار تلقائي عند تغيير الحالة
CREATE OR REPLACE FUNCTION public.create_project_notification()
RETURNS TRIGGER AS $$
DECLARE
    notification_title TEXT;
    notification_message TEXT;
    notification_type TEXT;
BEGIN
    -- تحديد نوع الإشعار والرسالة
    IF TG_OP = 'UPDATE' AND OLD.status != NEW.status THEN
        notification_type := 'status_change';
        notification_title := 'تم تحديث حالة المشروع';
        notification_message := 'تم تغيير حالة المشروع "' || NEW.title || '" من ' || 
                               CASE OLD.status 
                                   WHEN 'pending' THEN 'في الانتظار'
                                   WHEN 'in_progress' THEN 'قيد التنفيذ'
                                   WHEN 'review' THEN 'قيد المراجعة'
                                   WHEN 'completed' THEN 'مكتمل'
                                   WHEN 'cancelled' THEN 'ملغي'
                                   WHEN 'on_hold' THEN 'متوقف مؤقتاً'
                               END || ' إلى ' ||
                               CASE NEW.status 
                                   WHEN 'pending' THEN 'في الانتظار'
                                   WHEN 'in_progress' THEN 'قيد التنفيذ'
                                   WHEN 'review' THEN 'قيد المراجعة'
                                   WHEN 'completed' THEN 'مكتمل'
                                   WHEN 'cancelled' THEN 'ملغي'
                                   WHEN 'on_hold' THEN 'متوقف مؤقتاً'
                               END;
        
        -- إنشاء الإشعار للعميل
        INSERT INTO public.project_notifications (
            project_id, recipient_id, notification_type, title, message
        ) VALUES (
            NEW.id, NEW.client_id, notification_type, notification_title, notification_message
        );
        
        -- إنشاء تحديث في التايم لاين
        INSERT INTO public.project_updates (
            project_id, update_type, title, description, old_status, new_status, created_by
        ) VALUES (
            NEW.id, 'status_change', notification_title, notification_message, OLD.status, NEW.status, auth.uid()
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path TO '';

-- إنشاء المشغلات (Triggers)
-- مشغل لإنشاء رقم المشروع
CREATE OR REPLACE FUNCTION public.set_project_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.project_number IS NULL OR NEW.project_number = '' THEN
        NEW.project_number := public.generate_project_number();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path TO '';

DROP TRIGGER IF EXISTS set_project_number_trigger ON public.projects;
CREATE TRIGGER set_project_number_trigger
    BEFORE INSERT ON public.projects
    FOR EACH ROW EXECUTE FUNCTION public.set_project_number();

-- مشغل لتحديث تاريخ التعديل
DROP TRIGGER IF EXISTS update_projects_updated_at ON public.projects;
CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON public.projects
    FOR EACH ROW EXECUTE FUNCTION public._update_updated_at();

DROP TRIGGER IF EXISTS update_phases_updated_at ON public.project_phases;
CREATE TRIGGER update_phases_updated_at
    BEFORE UPDATE ON public.project_phases
    FOR EACH ROW EXECUTE FUNCTION public._update_updated_at();

-- مشغل لتحديث تقدم المشروع
DROP TRIGGER IF EXISTS update_project_progress_trigger ON public.project_phases;
CREATE TRIGGER update_project_progress_trigger
    AFTER INSERT OR UPDATE OR DELETE ON public.project_phases
    FOR EACH ROW EXECUTE FUNCTION public.update_project_progress();

-- مشغل للإشعارات
DROP TRIGGER IF EXISTS project_notification_trigger ON public.projects;
CREATE TRIGGER project_notification_trigger
    AFTER UPDATE ON public.projects
    FOR EACH ROW EXECUTE FUNCTION public.create_project_notification();

-- سياسات الأمان (RLS)
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_phases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_notifications ENABLE ROW LEVEL SECURITY;

-- سياسات المشاريع
CREATE POLICY "العملاء يمكنهم رؤية مشاريعهم فقط" 
ON public.projects FOR SELECT 
USING (client_id = auth.uid() OR assigned_to = auth.uid() OR public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "الإدارة يمكنها إدارة جميع المشاريع" 
ON public.projects FOR ALL 
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "المسؤولون عن المشاريع يمكنهم التحديث" 
ON public.projects FOR UPDATE 
USING (assigned_to = auth.uid() OR public.has_role(auth.uid(), 'admin'::app_role));

-- سياسات المراحل
CREATE POLICY "رؤية مراحل المشاريع المسموحة" 
ON public.project_phases FOR SELECT 
USING (EXISTS (
    SELECT 1 FROM public.projects p 
    WHERE p.id = project_id 
    AND (p.client_id = auth.uid() OR p.assigned_to = auth.uid() OR public.has_role(auth.uid(), 'admin'::app_role))
));

CREATE POLICY "إدارة مراحل المشاريع" 
ON public.project_phases FOR ALL 
USING (EXISTS (
    SELECT 1 FROM public.projects p 
    WHERE p.id = project_id 
    AND (p.assigned_to = auth.uid() OR public.has_role(auth.uid(), 'admin'::app_role))
));

-- سياسات التحديثات
CREATE POLICY "رؤية تحديثات المشاريع المسموحة" 
ON public.project_updates FOR SELECT 
USING (
    is_visible_to_client = true AND
    EXISTS (
        SELECT 1 FROM public.projects p 
        WHERE p.id = project_id 
        AND (p.client_id = auth.uid() OR p.assigned_to = auth.uid() OR public.has_role(auth.uid(), 'admin'::app_role))
    )
);

CREATE POLICY "إنشاء تحديثات المشاريع" 
ON public.project_updates FOR INSERT 
WITH CHECK (EXISTS (
    SELECT 1 FROM public.projects p 
    WHERE p.id = project_id 
    AND (p.assigned_to = auth.uid() OR public.has_role(auth.uid(), 'admin'::app_role))
));

-- سياسات الملفات
CREATE POLICY "رؤية ملفات المشاريع المسموحة" 
ON public.project_files FOR SELECT 
USING (
    is_visible_to_client = true AND
    EXISTS (
        SELECT 1 FROM public.projects p 
        WHERE p.id = project_id 
        AND (p.client_id = auth.uid() OR p.assigned_to = auth.uid() OR public.has_role(auth.uid(), 'admin'::app_role))
    )
);

CREATE POLICY "رفع ملفات المشاريع" 
ON public.project_files FOR INSERT 
WITH CHECK (EXISTS (
    SELECT 1 FROM public.projects p 
    WHERE p.id = project_id 
    AND (p.assigned_to = auth.uid() OR public.has_role(auth.uid(), 'admin'::app_role))
));

-- سياسات الإشعارات
CREATE POLICY "رؤية الإشعارات الشخصية" 
ON public.project_notifications FOR SELECT 
USING (recipient_id = auth.uid());

CREATE POLICY "إنشاء إشعارات للمستخدمين" 
ON public.project_notifications FOR INSERT 
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role) OR 
    EXISTS (
        SELECT 1 FROM public.projects p 
        WHERE p.id = project_id 
        AND p.assigned_to = auth.uid()
    )
);

-- تفعيل التحديثات في الوقت الفعلي
ALTER TABLE public.projects REPLICA IDENTITY FULL;
ALTER TABLE public.project_phases REPLICA IDENTITY FULL;
ALTER TABLE public.project_updates REPLICA IDENTITY FULL;
ALTER TABLE public.project_notifications REPLICA IDENTITY FULL;

-- إضافة الجداول للنشر في الوقت الفعلي
ALTER PUBLICATION supabase_realtime ADD TABLE public.projects;
ALTER PUBLICATION supabase_realtime ADD TABLE public.project_phases;
ALTER PUBLICATION supabase_realtime ADD TABLE public.project_updates;
ALTER PUBLICATION supabase_realtime ADD TABLE public.project_notifications;

-- إدراج مراحل افتراضية للمشاريع الجديدة
CREATE OR REPLACE FUNCTION public.create_default_phases()
RETURNS TRIGGER AS $$
BEGIN
    -- إدراج المراحل الافتراضية لمشاريع المواقع
    IF NEW.project_type = 'website' THEN
        INSERT INTO public.project_phases (project_id, phase_number, phase_name, description, estimated_duration_days) VALUES
        (NEW.id, 1, 'التخطيط والتحليل', 'جمع المتطلبات وتحليل احتياجات العميل', 3),
        (NEW.id, 2, 'التصميم', 'تصميم واجهة المستخدم والتجربة', 7),
        (NEW.id, 3, 'البرمجة', 'تطوير الموقع وبرمجة الوظائف', 14),
        (NEW.id, 4, 'الاختبار', 'اختبار الموقع والتأكد من عمل جميع الوظائف', 3),
        (NEW.id, 5, 'النشر والتسليم', 'نشر الموقع وتسليمه للعميل', 3);
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path TO '';

DROP TRIGGER IF EXISTS create_default_phases_trigger ON public.projects;
CREATE TRIGGER create_default_phases_trigger
    AFTER INSERT ON public.projects
    FOR EACH ROW EXECUTE FUNCTION public.create_default_phases();

DO $$
BEGIN
    RAISE NOTICE 'نظام تتبع المشاريع: تم إنشاء النظام بنجاح مع الجداول والوظائف والسياسات والتحديثات في الوقت الفعلي!';
END $$;