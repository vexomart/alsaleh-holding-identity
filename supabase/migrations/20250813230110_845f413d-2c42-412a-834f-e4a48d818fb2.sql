-- إزالة قيد NOT NULL من user_id في جدول subscriptions للسماح بالضيوف
ALTER TABLE public.subscriptions ALTER COLUMN user_id DROP NOT NULL;

-- تحديث RLS policy للسماح بالدفع للضيوف
DROP POLICY IF EXISTS "Users can create their own subscriptions" ON public.subscriptions;

CREATE POLICY "Users can create subscriptions" 
ON public.subscriptions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- تحديث policy للعرض
DROP POLICY IF EXISTS "Users can view their own subscriptions" ON public.subscriptions;

CREATE POLICY "Users can view subscriptions" 
ON public.subscriptions 
FOR SELECT 
USING (auth.uid() = user_id OR user_id IS NULL OR has_role(auth.uid(), 'admin'::app_role));