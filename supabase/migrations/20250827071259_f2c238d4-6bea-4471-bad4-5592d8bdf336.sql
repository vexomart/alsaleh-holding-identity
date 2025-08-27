-- نظام تتبع المشاريع (إصلاح نهائي)
-- إنشاء الجداول بالترتيب الصحيح

-- 1. جدول المشاريع الرئيسي بسيط
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_number TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  project_type TEXT NOT NULL DEFAULT 'website',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'review', 'completed', 'cancelled', 'on_hold')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  estimated_duration_days INTEGER DEFAULT 30,
  estimated_cost DECIMAL(12,2),
  start_date DATE,
  estimated_completion_date DATE,
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
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
  start_date DATE,
  end_date DATE,
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(project_id, phase_number)
);

-- 3. جدول تحديثات المشروع
CREATE TABLE IF NOT EXISTS public.project_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  phase_id UUID REFERENCES public.project_phases(id) ON DELETE SET NULL,
  update_type TEXT NOT NULL DEFAULT 'progress',
  title TEXT NOT NULL,
  description TEXT,
  old_status TEXT,
  new_status TEXT,
  is_visible_to_client BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- إنشاء فهارس بسيطة
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_project_phases_project_id ON public.project_phases(project_id);
CREATE INDEX IF NOT EXISTS idx_project_updates_project_id ON public.project_updates(project_id);

-- وظيفة إنشاء رقم مشروع
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

-- وظيفة تحديث تقدم المشروع
CREATE OR REPLACE FUNCTION public.update_project_progress()
RETURNS TRIGGER AS $$
DECLARE
    avg_progress INTEGER;
BEGIN
    SELECT COALESCE(AVG(progress_percentage), 0)::INTEGER
    INTO avg_progress
    FROM public.project_phases
    WHERE project_id = COALESCE(NEW.project_id, OLD.project_id);
    
    UPDATE public.projects
    SET progress_percentage = avg_progress,
        updated_at = now()
    WHERE id = COALESCE(NEW.project_id, OLD.project_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path TO '';

DROP TRIGGER IF EXISTS update_project_progress_trigger ON public.project_phases;
CREATE TRIGGER update_project_progress_trigger
    AFTER INSERT OR UPDATE OR DELETE ON public.project_phases
    FOR EACH ROW EXECUTE FUNCTION public.update_project_progress();

-- وظيفة إنشاء مراحل افتراضية
CREATE OR REPLACE FUNCTION public.create_default_phases()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.project_type = 'website' THEN
        INSERT INTO public.project_phases (project_id, phase_number, phase_name, description, estimated_duration_days) VALUES
        (NEW.id, 1, 'التخطيط والتحليل', 'جمع المتطلبات وتحليل احتياجات العميل', 3),
        (NEW.id, 2, 'التصميم', 'تصميم واجهة المستخدم والتجربة', 7),
        (NEW.id, 3, 'البرمجة', 'تطوير الموقع وبرمجة الوظائف', 14),
        (NEW.id, 4, 'الاختبار', 'اختبار الموقع والتأكد من عمل جميع الوظائف', 3),
        (NEW.id, 5, 'النشر والتسليم', 'نشر الموقع وتسليمه للعميل', 3);
    ELSIF NEW.project_type = 'mobile_app' THEN
        INSERT INTO public.project_phases (project_id, phase_number, phase_name, description, estimated_duration_days) VALUES
        (NEW.id, 1, 'التخطيط والتحليل', 'جمع المتطلبات وتحليل احتياجات التطبيق', 5),
        (NEW.id, 2, 'التصميم', 'تصميم واجهة التطبيق وتجربة المستخدم', 10),
        (NEW.id, 3, 'البرمجة', 'تطوير التطبيق وبرمجة الوظائف', 21),
        (NEW.id, 4, 'الاختبار', 'اختبار التطبيق على أجهزة مختلفة', 5),
        (NEW.id, 5, 'النشر والتسليم', 'رفع التطبيق للمتاجر وتسليمه', 4);
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path TO '';

DROP TRIGGER IF EXISTS create_default_phases_trigger ON public.projects;
CREATE TRIGGER create_default_phases_trigger
    AFTER INSERT ON public.projects
    FOR EACH ROW EXECUTE FUNCTION public.create_default_phases();

-- سياسات الأمان البسيطة
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_phases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_updates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "المشاريع متاحة للجميع" ON public.projects FOR ALL USING (true);
CREATE POLICY "المراحل متاحة للجميع" ON public.project_phases FOR ALL USING (true);
CREATE POLICY "التحديثات متاحة للجميع" ON public.project_updates FOR ALL USING (true);

-- تفعيل التحديثات في الوقت الفعلي
ALTER TABLE public.projects REPLICA IDENTITY FULL;
ALTER TABLE public.project_phases REPLICA IDENTITY FULL;
ALTER TABLE public.project_updates REPLICA IDENTITY FULL;

-- إضافة الجداول للنشر في الوقت الفعلي
ALTER PUBLICATION supabase_realtime ADD TABLE public.projects;
ALTER PUBLICATION supabase_realtime ADD TABLE public.project_phases;
ALTER PUBLICATION supabase_realtime ADD TABLE public.project_updates;

-- بيانات تجريبية
INSERT INTO public.projects (title, description, project_type, status, estimated_cost, estimated_duration_days) VALUES
('موقع شركة العقارات الذكية', 'تطوير موقع إلكتروني لشركة عقارات مع نظام إدارة العقارات', 'website', 'in_progress', 15000.00, 30),
('تطبيق التوصيل السريع', 'تطبيق جوال لخدمة التوصيل مع تتبع GPS', 'mobile_app', 'pending', 25000.00, 45),
('نظام إدارة المخزون', 'نظام ويب لإدارة المخزون والمبيعات', 'website', 'review', 20000.00, 35)
ON CONFLICT (project_number) DO NOTHING;

DO $$
BEGIN
    RAISE NOTICE 'نظام تتبع المشاريع: تم إنشاء الأساسيات بنجاح!';
END $$;