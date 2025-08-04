-- حذف جداول النطاقات وجميع البيانات المرتبطة بها

-- حذف جدول طلبات النطاقات
DROP TABLE IF EXISTS public.domain_requests CASCADE;

-- حذف جدول أسعار النطاقات  
DROP TABLE IF EXISTS public.domain_prices CASCADE;