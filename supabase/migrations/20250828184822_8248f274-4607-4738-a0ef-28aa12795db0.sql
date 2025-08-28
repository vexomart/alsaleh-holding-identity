-- حذف السياسات المكررة إن وجدت
DROP POLICY IF EXISTS "Admins can manage all invoices" ON public.invoices;
DROP POLICY IF EXISTS "Admins can create invoices" ON public.invoices;
DROP POLICY IF EXISTS "Admins can update invoices" ON public.invoices;

-- إضافة سياسة شاملة للأدمن لإدارة الفواتير
CREATE POLICY "Admins can manage invoices" ON public.invoices
FOR ALL USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- السماح بإنشاء الفواتير للمستخدمين المرتبطين بالفاتورة
CREATE POLICY "Users can create their invoices" ON public.invoices
FOR INSERT WITH CHECK (user_id = auth.uid() AND auth.uid() IS NOT NULL);