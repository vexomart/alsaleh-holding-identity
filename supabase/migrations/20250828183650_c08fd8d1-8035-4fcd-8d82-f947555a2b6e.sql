-- حذف جميع الفواتير الموجودة (البيانات الوهمية)
DELETE FROM public.invoices;

-- إعادة تعيين عداد الفواتير للسنة الحالية
DELETE FROM public.invoice_counters WHERE year = EXTRACT(YEAR FROM CURRENT_DATE);
INSERT INTO public.invoice_counters (year, counter) VALUES (EXTRACT(YEAR FROM CURRENT_DATE), 0);