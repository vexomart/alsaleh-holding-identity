-- تحديث اسم الشركة في جميع الجداول
UPDATE public.invoices 
SET offer_title = REPLACE(offer_title, 'تسهيل الرقمية', 'شركة علي صالح الشهري القابضة'),
    notes = REPLACE(COALESCE(notes, ''), 'تسهيل الرقمية', 'شركة علي صالح الشهري القابضة')
WHERE offer_title LIKE '%تسهيل الرقمية%' OR notes LIKE '%تسهيل الرقمية%';

-- تحديث اسم الشركة في جدول العقود
UPDATE public.contracts 
SET service_description = REPLACE(COALESCE(service_description, ''), 'تسهيل الرقمية', 'شركة علي صالح الشهري القابضة'),
    client_name = REPLACE(COALESCE(client_name, ''), 'تسهيل الرقمية', 'شركة علي صالح الشهري القابضة')
WHERE service_description LIKE '%تسهيل الرقمية%' OR client_name LIKE '%تسهيل الرقمية%';

-- تحديث اسم الشركة في جدول المدفوعات
UPDATE public.payment_transactions 
SET description = REPLACE(COALESCE(description, ''), 'تسهيل الرقمية', 'شركة علي صالح الشهري القابضة'),
    offer_title = REPLACE(COALESCE(offer_title, ''), 'تسهيل الرقمية', 'شركة علي صالح الشهري القابضة')
WHERE description LIKE '%تسهيل الرقمية%' OR offer_title LIKE '%تسهيل الرقمية%';

-- تحديث اسم الشركة في جدول التذاكر
UPDATE public.tickets 
SET description = REPLACE(COALESCE(description, ''), 'تسهيل الرقمية', 'شركة علي صالح الشهري القابضة'),
    title = REPLACE(COALESCE(title, ''), 'تسهيل الرقمية', 'شركة علي صالح الشهري القابضة')
WHERE description LIKE '%تسهيل الرقمية%' OR title LIKE '%تسهيل الرقمية%';

-- تحديث اسم الشركة في جدول العملاء
UPDATE public.clients 
SET legal_name = REPLACE(COALESCE(legal_name, ''), 'تسهيل الرقمية', 'شركة علي صالح الشهري القابضة'),
    display_name = REPLACE(COALESCE(display_name, ''), 'تسهيل الرقمية', 'شركة علي صالح الشهري القابضة'),
    notes = REPLACE(COALESCE(notes, ''), 'تسهيل الرقمية', 'شركة علي صالح الشهري القابضة')
WHERE legal_name LIKE '%تسهيل الرقمية%' OR display_name LIKE '%تسهيل الرقمية%' OR notes LIKE '%تسهيل الرقمية%';

-- تحديث أي بيانات أخرى تحتوي على اسم الشركة القديم
UPDATE public.business_invoices 
SET notes = REPLACE(COALESCE(notes, ''), 'تسهيل الرقمية', 'شركة علي صالح الشهري القابضة')
WHERE notes LIKE '%تسهيل الرقمية%';

-- تحديث جدول الإعدادات العامة للنظام
UPDATE public.system_settings 
SET value = jsonb_set(
    value,
    '{company_name}',
    '"شركة علي صالح الشهري القابضة"'
)
WHERE key = 'company_info' OR key = 'general_settings';

-- إضافة أو تحديث إعدادات الشركة
INSERT INTO public.system_settings (key, value, description, category) 
VALUES (
    'company_name',
    '"شركة علي صالح الشهري القابضة"',
    'اسم الشركة الرسمي',
    'company'
) ON CONFLICT (key) DO UPDATE SET 
    value = EXCLUDED.value,
    updated_at = now();