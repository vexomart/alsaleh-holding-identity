-- إنشاء جدول صندوق الإرسال (Email Outbox)
CREATE TABLE IF NOT EXISTS public.email_outbox (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  to_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  template_key TEXT NOT NULL,
  idempotency_key TEXT NOT NULL UNIQUE,
  provider TEXT NOT NULL DEFAULT 'resend',
  provider_msg_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  retries INTEGER NOT NULL DEFAULT 0,
  last_error TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- إنشاء جدول طابور الأعمال (Job Queue)
CREATE TABLE IF NOT EXISTS public.email_jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_type TEXT NOT NULL DEFAULT 'email.send',
  payload JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  retries INTEGER NOT NULL DEFAULT 0,
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- إنشاء جدول قوالب الإيميل
CREATE TABLE IF NOT EXISTS public.email_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  template_key TEXT NOT NULL UNIQUE,
  subject_template TEXT NOT NULL,
  html_template TEXT NOT NULL,
  variables JSONB NOT NULL DEFAULT '[]',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- إنشاء فهارس للأداء
CREATE INDEX IF NOT EXISTS idx_email_outbox_status ON public.email_outbox(status);
CREATE INDEX IF NOT EXISTS idx_email_outbox_user_id ON public.email_outbox(user_id);
CREATE INDEX IF NOT EXISTS idx_email_outbox_template_key ON public.email_outbox(template_key);
CREATE INDEX IF NOT EXISTS idx_email_outbox_created_at ON public.email_outbox(created_at);

CREATE INDEX IF NOT EXISTS idx_email_jobs_status ON public.email_jobs(status);
CREATE INDEX IF NOT EXISTS idx_email_jobs_scheduled_at ON public.email_jobs(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_email_jobs_job_type ON public.email_jobs(job_type);

-- إنشاء دالة تحديث updated_at
CREATE OR REPLACE FUNCTION public.update_email_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- إنشاء المشغلات (Triggers)
CREATE TRIGGER email_outbox_updated_at
  BEFORE UPDATE ON public.email_outbox
  FOR EACH ROW
  EXECUTE FUNCTION public.update_email_updated_at();

CREATE TRIGGER email_templates_updated_at
  BEFORE UPDATE ON public.email_templates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_email_updated_at();

-- إنشاء RLS policies
ALTER TABLE public.email_outbox ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;

-- سياسات email_outbox
CREATE POLICY "Admin can manage all email outbox" ON public.email_outbox
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view their own email outbox" ON public.email_outbox
  FOR SELECT USING (auth.uid() = user_id);

-- سياسات email_jobs
CREATE POLICY "Admin can manage all email jobs" ON public.email_jobs
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Service role can process email jobs" ON public.email_jobs
  FOR ALL USING ((auth.jwt() ->> 'role'::text) = 'service_role'::text);

-- سياسات email_templates
CREATE POLICY "Admin can manage email templates" ON public.email_templates
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Service role can read email templates" ON public.email_templates
  FOR SELECT USING ((auth.jwt() ->> 'role'::text) = 'service_role'::text);

-- إدراج القوالب الأساسية
INSERT INTO public.email_templates (template_key, subject_template, html_template, variables) VALUES
('wallet_deposit_approved', 'تم اعتماد إيداعك في {{company_name}}', '
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>تم اعتماد الإيداع</title>
    <style>
        body { font-family: Arial, sans-serif; direction: rtl; margin: 0; padding: 20px; background-color: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #4f46e5, #7c3aed); color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; }
        .amount { font-size: 24px; font-weight: bold; color: #16a34a; text-align: center; margin: 20px 0; }
        .details { background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .button { display: inline-block; background: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { background: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #64748b; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>✅ تم اعتماد الإيداع</h1>
        </div>
        <div class="content">
            <p>عزيزي/عزيزتي <strong>{{client_name}}</strong>،</p>
            <p>نحن سعداء لإبلاغك بأنه تم اعتماد طلب الإيداع الخاص بك بنجاح.</p>
            
            <div class="amount">{{amount}} {{currency}}</div>
            
            <div class="details">
                <h3>تفاصيل العملية:</h3>
                <p><strong>رقم العملية:</strong> {{tx_id}}</p>
                <p><strong>المبلغ المودع:</strong> {{amount}} {{currency}}</p>
                <p><strong>رصيدك الحالي:</strong> {{balance_after}} {{currency}}</p>
                <p><strong>تاريخ العملية:</strong> {{date}}</p>
            </div>
            
            <p>يمكنك الآن استخدام رصيدك لشراء خدماتنا المختلفة.</p>
            
            <div style="text-align: center;">
                <a href="{{portal_url}}" class="button">دخول إلى حسابك</a>
            </div>
        </div>
        <div class="footer">
            <p>&copy; {{year}} {{company_name}} - جميع الحقوق محفوظة</p>
            <p>للدعم الفني: support@alialshehriholding.com</p>
        </div>
    </div>
</body>
</html>
', ''["client_name", "tx_id", "amount", "currency", "balance_after", "date", "portal_url", "company_name", "year"]''),

('wallet_deposit_rejected', 'تم رفض طلب الإيداع', '
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>تم رفض الإيداع</title>
    <style>
        body { font-family: Arial, sans-serif; direction: rtl; margin: 0; padding: 20px; background-color: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #dc2626, #b91c1c); color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; }
        .reason { background: #fef2f2; border: 1px solid #fecaca; padding: 15px; border-radius: 6px; margin: 20px 0; color: #991b1b; }
        .button { display: inline-block; background: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { background: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #64748b; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>❌ تم رفض طلب الإيداع</h1>
        </div>
        <div class="content">
            <p>عزيزي/عزيزتي <strong>{{client_name}}</strong>،</p>
            <p>نأسف لإبلاغك بأنه تم رفض طلب الإيداع الخاص بك.</p>
            
            <div class="reason">
                <h3>سبب الرفض:</h3>
                <p>{{reason}}</p>
            </div>
            
            <p>يمكنك المحاولة مرة أخرى أو التواصل مع الدعم الفني للمساعدة.</p>
            
            <div style="text-align: center;">
                <a href="{{portal_url}}" class="button">دخول إلى حسابك</a>
            </div>
        </div>
        <div class="footer">
            <p>&copy; {{year}} {{company_name}} - جميع الحقوق محفوظة</p>
            <p>للدعم الفني: support@alialshehriholding.com</p>
        </div>
    </div>
</body>
</html>
', ''["client_name", "tx_id", "amount", "currency", "reason", "portal_url", "company_name", "year"]''),

('wallet_withdraw_approved', 'تم اعتماد طلب السحب', '
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>تم اعتماد السحب</title>
    <style>
        body { font-family: Arial, sans-serif; direction: rtl; margin: 0; padding: 20px; background-color: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #059669, #047857); color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; }
        .amount { font-size: 24px; font-weight: bold; color: #059669; text-align: center; margin: 20px 0; }
        .details { background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .button { display: inline-block; background: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { background: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #64748b; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>💰 تم اعتماد طلب السحب</h1>
        </div>
        <div class="content">
            <p>عزيزي/عزيزتي <strong>{{client_name}}</strong>،</p>
            <p>تم اعتماد طلب السحب الخاص بك وسيتم تحويل المبلغ خلال 24-48 ساعة عمل.</p>
            
            <div class="amount">{{amount}} {{currency}}</div>
            
            <div class="details">
                <h3>تفاصيل العملية:</h3>
                <p><strong>رقم العملية:</strong> {{tx_id}}</p>
                <p><strong>المبلغ المسحوب:</strong> {{amount}} {{currency}}</p>
                <p><strong>رصيدك الحالي:</strong> {{balance_after}} {{currency}}</p>
                <p><strong>تاريخ العملية:</strong> {{date}}</p>
            </div>
            
            <div style="text-align: center;">
                <a href="{{portal_url}}" class="button">دخول إلى حسابك</a>
            </div>
        </div>
        <div class="footer">
            <p>&copy; {{year}} {{company_name}} - جميع الحقوق محفوظة</p>
            <p>للدعم الفني: support@alialshehriholding.com</p>
        </div>
    </div>
</body>
</html>
', ''["client_name", "tx_id", "amount", "currency", "balance_after", "date", "portal_url", "company_name", "year"]''),

('wallet_withdraw_rejected', 'تم رفض طلب السحب', '
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>تم رفض السحب</title>
    <style>
        body { font-family: Arial, sans-serif; direction: rtl; margin: 0; padding: 20px; background-color: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #dc2626, #b91c1c); color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; }
        .reason { background: #fef2f2; border: 1px solid #fecaca; padding: 15px; border-radius: 6px; margin: 20px 0; color: #991b1b; }
        .button { display: inline-block; background: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { background: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #64748b; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>❌ تم رفض طلب السحب</h1>
        </div>
        <div class="content">
            <p>عزيزي/عزيزتي <strong>{{client_name}}</strong>،</p>
            <p>نأسف لإبلاغك بأنه تم رفض طلب السحب الخاص بك.</p>
            
            <div class="reason">
                <h3>سبب الرفض:</h3>
                <p>{{reason}}</p>
            </div>
            
            <p>يمكنك المحاولة مرة أخرى أو التواصل مع الدعم الفني للمساعدة.</p>
            
            <div style="text-align: center;">
                <a href="{{portal_url}}" class="button">دخول إلى حسابك</a>
            </div>
        </div>
        <div class="footer">
            <p>&copy; {{year}} {{company_name}} - جميع الحقوق محفوظة</p>
            <p>للدعم الفني: support@alialshehriholding.com</p>
        </div>
    </div>
</body>
</html>
', ''["client_name", "tx_id", "amount", "currency", "reason", "portal_url", "company_name", "year"]''),

('otp_code', 'رمز التحقق لحسابك', '
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>رمز التحقق</title>
    <style>
        body { font-family: Arial, sans-serif; direction: rtl; margin: 0; padding: 20px; background-color: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #4f46e5, #7c3aed); color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; text-align: center; }
        .otp-code { font-size: 36px; font-weight: bold; color: #4f46e5; background: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0; letter-spacing: 8px; }
        .warning { background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 6px; margin: 20px 0; color: #92400e; }
        .footer { background: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #64748b; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔐 رمز التحقق</h1>
        </div>
        <div class="content">
            <p>عزيزي/عزيزتي <strong>{{client_name}}</strong>،</p>
            <p>استخدم الرمز التالي لتسجيل الدخول إلى حسابك:</p>
            
            <div class="otp-code">{{otp_code}}</div>
            
            <div class="warning">
                <p><strong>تنبيه:</strong> هذا الرمز صالح لمدة 10 دقائق فقط ولا تشاركه مع أحد.</p>
            </div>
            
            <p>إذا لم تطلب هذا الرمز، يرجى تجاهل هذه الرسالة.</p>
        </div>
        <div class="footer">
            <p>&copy; {{year}} {{company_name}} - جميع الحقوق محفوظة</p>
            <p>للدعم الفني: support@alialshehriholding.com</p>
        </div>
    </div>
</body>
</html>
', ''["client_name", "otp_code", "company_name", "year"]'')

ON CONFLICT (template_key) DO UPDATE SET
  subject_template = EXCLUDED.subject_template,
  html_template = EXCLUDED.html_template,
  variables = EXCLUDED.variables,
  updated_at = now();