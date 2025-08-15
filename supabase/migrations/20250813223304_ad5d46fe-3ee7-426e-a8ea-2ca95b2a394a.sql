-- Create subscription plans table
CREATE TABLE public.subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  description TEXT,
  description_ar TEXT,
  price DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'SAR',
  billing_interval TEXT NOT NULL DEFAULT 'monthly', -- monthly, yearly
  features JSONB NOT NULL DEFAULT '[]',
  max_automations INTEGER,
  max_workflows INTEGER,
  priority_support BOOLEAN DEFAULT false,
  custom_integrations BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create subscriptions table
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES public.subscription_plans(id),
  status TEXT NOT NULL DEFAULT 'active', -- active, cancelled, expired, pending
  current_period_start TIMESTAMP WITH TIME ZONE DEFAULT now(),
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT false,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  paylink_transaction_id TEXT,
  payment_status TEXT DEFAULT 'pending', -- pending, paid, failed
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create automation usage tracking table
CREATE TABLE public.automation_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES public.subscriptions(id),
  automation_type TEXT NOT NULL,
  usage_count INTEGER DEFAULT 1,
  usage_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automation_usage ENABLE ROW LEVEL SECURITY;

-- RLS Policies for subscription_plans (public read)
CREATE POLICY "Anyone can view active subscription plans" 
ON public.subscription_plans 
FOR SELECT 
USING (is_active = true);

-- RLS Policies for subscriptions
CREATE POLICY "Users can view their own subscriptions" 
ON public.subscriptions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own subscriptions" 
ON public.subscriptions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "System can update subscriptions" 
ON public.subscriptions 
FOR UPDATE 
USING (true);

CREATE POLICY "Admins can manage all subscriptions" 
ON public.subscriptions 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for automation_usage
CREATE POLICY "Users can view their own usage" 
ON public.automation_usage 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "System can insert usage records" 
ON public.automation_usage 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can view all usage" 
ON public.automation_usage 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Insert default subscription plans
INSERT INTO public.subscription_plans (name, name_ar, description, description_ar, price, features, max_automations, max_workflows, priority_support, custom_integrations) VALUES
('Basic Plan', 'الخطة الأساسية', 'Perfect for small businesses getting started with automation', 'مثالية للشركات الصغيرة البادئة في الأتمتة', 99.00, 
 '["Basic workflow automation", "Email automation", "50 tasks per month", "Standard support"]',
 50, 5, false, false),

('Professional Plan', 'الخطة المتقدمة', 'Advanced automation for growing businesses', 'أتمتة متقدمة للشركات النامية', 299.00, 
 '["Advanced workflow automation", "Email & SMS automation", "500 tasks per month", "Priority support", "Advanced analytics"]',
 500, 20, true, false),

('Enterprise Plan', 'خطة الشركات', 'Unlimited automation for large organizations', 'أتمتة غير محدودة للمؤسسات الكبيرة', 899.00, 
 '["Unlimited automation", "Custom integrations", "Unlimited tasks", "24/7 dedicated support", "Custom training"]',
 -1, -1, true, true);

-- Create function to check subscription limits
CREATE OR REPLACE FUNCTION public.check_automation_limit(p_user_id UUID, p_automation_type TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_subscription RECORD;
  v_usage_count INTEGER;
  v_monthly_limit INTEGER;
BEGIN
  -- Get user's active subscription
  SELECT s.*, sp.max_automations
  INTO v_subscription
  FROM public.subscriptions s
  JOIN public.subscription_plans sp ON s.plan_id = sp.id
  WHERE s.user_id = p_user_id 
    AND s.status = 'active'
    AND s.current_period_end > now()
  ORDER BY s.created_at DESC
  LIMIT 1;
  
  -- If no active subscription, deny access
  IF v_subscription IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- If unlimited plan (max_automations = -1), allow
  IF v_subscription.max_automations = -1 THEN
    RETURN TRUE;
  END IF;
  
  -- Count current month usage
  SELECT COALESCE(SUM(usage_count), 0)
  INTO v_usage_count
  FROM public.automation_usage
  WHERE user_id = p_user_id
    AND automation_type = p_automation_type
    AND usage_date >= date_trunc('month', CURRENT_DATE);
  
  -- Check if within limits
  RETURN v_usage_count < v_subscription.max_automations;
END;
$$;

-- Create function to record automation usage
CREATE OR REPLACE FUNCTION public.record_automation_usage(p_user_id UUID, p_automation_type TEXT, p_count INTEGER DEFAULT 1)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_subscription_id UUID;
BEGIN
  -- Get user's active subscription ID
  SELECT id INTO v_subscription_id
  FROM public.subscriptions
  WHERE user_id = p_user_id 
    AND status = 'active'
    AND current_period_end > now()
  ORDER BY created_at DESC
  LIMIT 1;
  
  -- Insert usage record
  INSERT INTO public.automation_usage (user_id, subscription_id, automation_type, usage_count)
  VALUES (p_user_id, v_subscription_id, p_automation_type, p_count);
END;
$$;

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_subscription_plans_updated_at
  BEFORE UPDATE ON public.subscription_plans
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();