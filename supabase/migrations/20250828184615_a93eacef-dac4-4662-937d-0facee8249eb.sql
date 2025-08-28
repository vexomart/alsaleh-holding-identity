-- إضافة سياسات RLS للفواتير للسماح للأدمن بالإدارة الكاملة
CREATE POLICY "Admins can manage all invoices" ON public.invoices
FOR ALL USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- السماح للأدمن بإنشاء فواتير
CREATE POLICY "Admins can create invoices" ON public.invoices
FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- السماح للأدمن بتحديث الفواتير
CREATE POLICY "Admins can update invoices" ON public.invoices
FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));