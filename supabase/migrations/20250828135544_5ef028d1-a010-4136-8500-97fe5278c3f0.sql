-- إنشاء جدول لبرنامج التسويق بالعمولة
CREATE TABLE public.affiliate_program (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  affiliate_code TEXT NOT NULL UNIQUE,
  commission_rate DECIMAL(5,2) DEFAULT 10.00,
  total_earnings DECIMAL(10,2) DEFAULT 0.00,
  total_referrals INTEGER DEFAULT 0,
  total_orders INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  level_name TEXT DEFAULT 'برونزي',
  level_threshold INTEGER DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- إنشاء جدول للإحالات
CREATE TABLE public.affiliate_referrals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  affiliate_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referred_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  affiliate_code TEXT NOT NULL,
  commission_earned DECIMAL(10,2) DEFAULT 0.00,
  order_value DECIMAL(10,2) DEFAULT 0.00,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'paid')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(referred_user_id) -- عميل واحد يمكن إحالته مرة واحدة فقط
);

-- إنشاء جدول لتتبع عمولات الطلبات
CREATE TABLE public.affiliate_commissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  affiliate_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referred_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  service_request_id UUID REFERENCES public.service_requests(id) ON DELETE CASCADE,
  order_amount DECIMAL(10,2) NOT NULL,
  commission_rate DECIMAL(5,2) NOT NULL DEFAULT 10.00,
  commission_amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid')),
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- إضافة فهارس للأداء
CREATE INDEX idx_affiliate_program_user_id ON public.affiliate_program(user_id);
CREATE INDEX idx_affiliate_program_code ON public.affiliate_program(affiliate_code);
CREATE INDEX idx_affiliate_referrals_affiliate ON public.affiliate_referrals(affiliate_user_id);
CREATE INDEX idx_affiliate_referrals_referred ON public.affiliate_referrals(referred_user_id);
CREATE INDEX idx_affiliate_commissions_affiliate ON public.affiliate_commissions(affiliate_user_id);

-- تفعيل RLS
ALTER TABLE public.affiliate_program ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_commissions ENABLE ROW LEVEL SECURITY;

-- سياسات الأمان للبرنامج
CREATE POLICY "Users can view their own affiliate program" 
ON public.affiliate_program 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own affiliate program" 
ON public.affiliate_program 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own affiliate program" 
ON public.affiliate_program 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- سياسات للإحالات
CREATE POLICY "Users can view their referrals" 
ON public.affiliate_referrals 
FOR SELECT 
USING (auth.uid() = affiliate_user_id);

CREATE POLICY "System can create referrals" 
ON public.affiliate_referrals 
FOR INSERT 
WITH CHECK (true);

-- سياسات للعمولات
CREATE POLICY "Users can view their commissions" 
ON public.affiliate_commissions 
FOR SELECT 
USING (auth.uid() = affiliate_user_id);

CREATE POLICY "System can create commissions" 
ON public.affiliate_commissions 
FOR INSERT 
WITH CHECK (true);

-- سياسات للأدمن
CREATE POLICY "Admins can manage all affiliate data" 
ON public.affiliate_program 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage all referrals" 
ON public.affiliate_referrals 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage all commissions" 
ON public.affiliate_commissions 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- دالة لإنشاء كود التسويق التلقائي
CREATE OR REPLACE FUNCTION public.generate_affiliate_code()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  code TEXT;
  counter INTEGER := 0;
BEGIN
  LOOP
    -- إنشاء كود من 8 أرقام وحروف
    code := 'AFF' || LPAD((EXTRACT(EPOCH FROM now())::bigint % 100000)::TEXT, 5, '0');
    
    -- التحقق من عدم وجود الكود
    IF NOT EXISTS (SELECT 1 FROM public.affiliate_program WHERE affiliate_code = code) THEN
      RETURN code;
    END IF;
    
    counter := counter + 1;
    IF counter > 10 THEN
      -- إضافة رقم عشوائي إذا فشل إنشاء كود فريد
      code := code || (random() * 999)::integer;
      RETURN code;
    END IF;
  END LOOP;
END;
$$;

-- دالة لإنشاء برنامج التسويق عند إنشاء المستخدم
CREATE OR REPLACE FUNCTION public.create_affiliate_program()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.affiliate_program (
    user_id,
    affiliate_code,
    commission_rate,
    level_name,
    level_threshold
  ) VALUES (
    NEW.id,
    public.generate_affiliate_code(),
    10.00,
    'برونزي',
    5
  );
  
  RETURN NEW;
EXCEPTION
  WHEN others THEN
    -- في حالة وجود خطأ، لا نوقف إنشاء المستخدم
    RETURN NEW;
END;
$$;

-- ترايجر لإنشاء برنامج التسويق تلقائياً
CREATE TRIGGER create_affiliate_program_on_signup
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.create_affiliate_program();

-- دالة لحساب مستوى التسويق
CREATE OR REPLACE FUNCTION public.calculate_affiliate_level(user_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  total_referrals INTEGER;
  new_level TEXT;
BEGIN
  -- حساب إجمالي الإحالات
  SELECT COUNT(*) INTO total_referrals
  FROM public.affiliate_referrals
  WHERE affiliate_user_id = user_id;
  
  -- تحديد المستوى
  IF total_referrals >= 100 THEN
    new_level := 'ماسي';
  ELSIF total_referrals >= 50 THEN
    new_level := 'ذهبي';
  ELSIF total_referrals >= 20 THEN
    new_level := 'فضي';
  ELSE
    new_level := 'برونزي';
  END IF;
  
  -- تحديث المستوى في قاعدة البيانات
  UPDATE public.affiliate_program
  SET level_name = new_level,
      updated_at = now()
  WHERE affiliate_program.user_id = calculate_affiliate_level.user_id;
  
  RETURN new_level;
END;
$$;

-- إضافة ترايجر لتحديث الإحصائيات
CREATE TRIGGER update_affiliate_updated_at
BEFORE UPDATE ON public.affiliate_program
FOR EACH ROW
EXECUTE FUNCTION public._update_updated_at();

CREATE TRIGGER update_referrals_updated_at
BEFORE UPDATE ON public.affiliate_referrals
FOR EACH ROW
EXECUTE FUNCTION public._update_updated_at();

CREATE TRIGGER update_commissions_updated_at
BEFORE UPDATE ON public.affiliate_commissions
FOR EACH ROW
EXECUTE FUNCTION public._update_updated_at();