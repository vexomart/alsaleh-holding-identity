-- إصلاح القيود والفهارس في جدول الفواتير

-- حذف القيد الفريد أولاً
ALTER TABLE public.invoices DROP CONSTRAINT IF EXISTS invoices_invoice_number_key;

-- حذف الفهارس المكررة
DROP INDEX IF EXISTS idx_invoices_invoice_number;

-- إنشاء فهرس فريد جديد
CREATE UNIQUE INDEX IF NOT EXISTS idx_invoices_invoice_number_unique 
ON public.invoices(invoice_number) 
WHERE invoice_number IS NOT NULL AND invoice_number != '';

-- حل مشكلة الفواتير المكررة
DO $$
DECLARE
    duplicate_invoice RECORD;
    counter INT := 1;
BEGIN
    -- البحث عن الفواتير المكررة وإصلاحها
    FOR duplicate_invoice IN 
        SELECT invoice_number, array_agg(id ORDER BY created_at) as ids
        FROM public.invoices 
        WHERE invoice_number IS NOT NULL AND invoice_number != ''
        GROUP BY invoice_number 
        HAVING COUNT(*) > 1
    LOOP
        -- الاحتفاظ بأول فاتورة وإعادة ترقيم الباقي
        FOR i IN 2..array_length(duplicate_invoice.ids, 1) LOOP
            UPDATE public.invoices 
            SET invoice_number = duplicate_invoice.invoice_number || '-DUP-' || i
            WHERE id = duplicate_invoice.ids[i];
        END LOOP;
    END LOOP;
END $$;