-- إنشاء صلاحيات الأمان (RLS Policies) للجداول الجديدة

-- صلاحيات جدول العملاء
CREATE POLICY "Admin can manage all clients" ON public.clients FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can view clients they created" ON public.clients FOR SELECT TO authenticated USING (created_by = auth.uid());
CREATE POLICY "Users can create clients" ON public.clients FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid());

-- صلاحيات جدول جهات الاتصال
CREATE POLICY "Admin can manage all contacts" ON public.client_contacts FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can manage contacts for their clients" ON public.client_contacts FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.clients WHERE id = client_contacts.client_id AND created_by = auth.uid())
);

-- صلاحيات الشركات التابعة (عامة للعرض)
CREATE POLICY "Anyone can view published subsidiaries" ON public.subsidiaries FOR SELECT USING (is_published = true);
CREATE POLICY "Admin can manage subsidiaries" ON public.subsidiaries FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- صلاحيات الصفحات
CREATE POLICY "Anyone can view published pages" ON public.pages FOR SELECT USING (status = 'published');
CREATE POLICY "Admin can manage all pages" ON public.pages FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Authors can manage their pages" ON public.pages FOR ALL TO authenticated USING (author_id = auth.uid());

-- صلاحيات المشاريع
CREATE POLICY "Admin can manage all projects" ON public.projects FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Project managers can manage their projects" ON public.projects FOR ALL TO authenticated USING (assigned_manager = auth.uid());
CREATE POLICY "Users can view projects for their clients" ON public.projects FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.clients WHERE id = projects.client_id AND created_by = auth.uid())
);

-- صلاحيات مراحل المشاريع
CREATE POLICY "Admin can manage all project stages" ON public.project_stages FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Project managers can manage stages for their projects" ON public.project_stages FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.projects WHERE id = project_stages.project_id AND assigned_manager = auth.uid())
);

-- صلاحيات المهام
CREATE POLICY "Admin can manage all tasks" ON public.project_tasks FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Assignees can manage their tasks" ON public.project_tasks FOR ALL TO authenticated USING (assignee_id = auth.uid());
CREATE POLICY "Project managers can manage tasks for their projects" ON public.project_tasks FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.projects WHERE id = project_tasks.project_id AND assigned_manager = auth.uid())
);

-- صلاحيات محاضر الاجتماعات
CREATE POLICY "Admin can manage all meeting minutes" ON public.meeting_minutes FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can create meeting minutes" ON public.meeting_minutes FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid());
CREATE POLICY "Users can view meeting minutes for their projects" ON public.meeting_minutes FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.projects WHERE id = meeting_minutes.project_id AND assigned_manager = auth.uid()) OR
  created_by = auth.uid()
);

-- صلاحيات التذاكر
CREATE POLICY "Admin can manage all tickets" ON public.support_tickets FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Assignees can manage their assigned tickets" ON public.support_tickets FOR ALL TO authenticated USING (assignee_id = auth.uid());
CREATE POLICY "Users can view tickets for their clients" ON public.support_tickets FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.clients WHERE id = support_tickets.client_id AND created_by = auth.uid())
);

-- صلاحيات ردود التذاكر
CREATE POLICY "Admin can manage all ticket replies" ON public.ticket_replies FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can view replies for tickets they have access to" ON public.ticket_replies FOR SELECT TO authenticated USING (
  EXISTS (
    SELECT 1 FROM public.support_tickets st 
    WHERE st.id = ticket_replies.ticket_id AND 
    (st.assignee_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role))
  )
);

-- صلاحيات عروض الأسعار
CREATE POLICY "Admin can manage all quotes" ON public.quotes FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can manage quotes for their clients" ON public.quotes FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.clients WHERE id = quotes.client_id AND created_by = auth.uid()) OR
  created_by = auth.uid()
);

-- صلاحيات عناصر عروض الأسعار
CREATE POLICY "Admin can manage all quote items" ON public.quote_items FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can manage quote items for their quotes" ON public.quote_items FOR ALL TO authenticated USING (
  EXISTS (
    SELECT 1 FROM public.quotes q 
    JOIN public.clients c ON q.client_id = c.id 
    WHERE q.id = quote_items.quote_id AND (c.created_by = auth.uid() OR q.created_by = auth.uid())
  )
);

-- صلاحيات العقود
CREATE POLICY "Admin can manage all contracts" ON public.business_contracts FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can manage contracts for their clients" ON public.business_contracts FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.clients WHERE id = business_contracts.client_id AND created_by = auth.uid()) OR
  created_by = auth.uid()
);

-- صلاحيات الفواتير
CREATE POLICY "Admin can manage all business invoices" ON public.business_invoices FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can manage invoices for their clients" ON public.business_invoices FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.clients WHERE id = business_invoices.client_id AND created_by = auth.uid()) OR
  created_by = auth.uid()
);

-- صلاحيات عناصر الفواتير
CREATE POLICY "Admin can manage all invoice items" ON public.business_invoice_items FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can manage invoice items for their invoices" ON public.business_invoice_items FOR ALL TO authenticated USING (
  EXISTS (
    SELECT 1 FROM public.business_invoices bi 
    JOIN public.clients c ON bi.client_id = c.id 
    WHERE bi.id = business_invoice_items.invoice_id AND (c.created_by = auth.uid() OR bi.created_by = auth.uid())
  )
);

-- صلاحيات المدفوعات
CREATE POLICY "Admin can manage all business payments" ON public.business_payments FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can view payments for their invoices" ON public.business_payments FOR SELECT TO authenticated USING (
  EXISTS (
    SELECT 1 FROM public.business_invoices bi 
    JOIN public.clients c ON bi.client_id = c.id 
    WHERE bi.id = business_payments.invoice_id AND c.created_by = auth.uid()
  )
);

-- صلاحيات الوظائف
CREATE POLICY "Anyone can view active job postings" ON public.job_postings FOR SELECT USING (is_active = true);
CREATE POLICY "Admin can manage job postings" ON public.job_postings FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- صلاحيات المتقدمين للوظائف
CREATE POLICY "Admin can manage job applicants" ON public.job_applicants FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can apply for jobs" ON public.job_applicants FOR INSERT TO authenticated WITH CHECK (true);

-- صلاحيات مكتبة الوسائط
CREATE POLICY "Admin can manage all media" ON public.media_library FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can upload media" ON public.media_library FOR INSERT TO authenticated WITH CHECK (uploaded_by = auth.uid());
CREATE POLICY "Users can view their uploaded media" ON public.media_library FOR SELECT TO authenticated USING (uploaded_by = auth.uid());

-- صلاحيات الإشعارات
CREATE POLICY "Users can view their notifications" ON public.notifications FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Admin can manage all notifications" ON public.notifications FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "System can create notifications" ON public.notifications FOR INSERT TO authenticated WITH CHECK (true);

-- صلاحيات الإعدادات
CREATE POLICY "Admin can manage system settings" ON public.system_settings FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can view system settings" ON public.system_settings FOR SELECT TO authenticated USING (true);