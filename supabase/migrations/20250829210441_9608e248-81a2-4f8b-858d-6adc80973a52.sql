-- إدراج القوالب الأساسية
INSERT INTO public.email_templates (template_key, subject_template, html_template, variables) VALUES
('wallet_deposit_approved', 'تم اعتماد إيداعك في {{company_name}}', '<!DOCTYPE html>
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
</html>', '["client_name", "tx_id", "amount", "currency", "balance_after", "date", "portal_url", "company_name", "year"]'::jsonb),

('wallet_deposit_rejected', 'تم رفض طلب الإيداع', '<!DOCTYPE html>
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
</html>', '["client_name", "tx_id", "amount", "currency", "reason", "portal_url", "company_name", "year"]'::jsonb),

('wallet_withdraw_approved', 'تم اعتماد طلب السحب', '<!DOCTYPE html>
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
</html>', '["client_name", "tx_id", "amount", "currency", "balance_after", "date", "portal_url", "company_name", "year"]'::jsonb),

('otp_code', 'رمز التحقق لحسابك', '<!DOCTYPE html>
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
</html>', '["client_name", "otp_code", "company_name", "year"]'::jsonb)

ON CONFLICT (template_key) DO UPDATE SET
  subject_template = EXCLUDED.subject_template,
  html_template = EXCLUDED.html_template,
  variables = EXCLUDED.variables,
  updated_at = now();