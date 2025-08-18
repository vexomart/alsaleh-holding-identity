-- إنشاء الأنواع المخصصة والجداول الأساسية للنظام

-- أنواع البيانات المخصصة
CREATE TYPE client_sector AS ENUM ('government', 'private', 'semi_government');
CREATE TYPE client_status AS ENUM ('prospect', 'active', 'inactive', 'blocked');
CREATE TYPE project_status AS ENUM ('planning', 'in_progress', 'review', 'completed', 'cancelled');
CREATE TYPE ticket_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE ticket_status AS ENUM ('open', 'in_progress', 'waiting_client', 'resolved', 'closed');
CREATE TYPE invoice_status AS ENUM ('draft', 'sent', 'paid', 'overdue', 'cancelled');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
CREATE TYPE quote_status AS ENUM ('draft', 'sent', 'accepted', 'rejected', 'expired');
CREATE TYPE contract_status AS ENUM ('draft', 'sent', 'signed', 'active', 'completed', 'terminated');
CREATE TYPE job_type AS ENUM ('full_time', 'part_time', 'contract', 'internship');
CREATE TYPE applicant_stage AS ENUM ('applied', 'screening', 'interview', 'offer', 'hired', 'rejected');

-- جدول العملاء
CREATE TABLE public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  legal_name TEXT NOT NULL,
  display_name TEXT,
  tax_number TEXT,
  commercial_register TEXT,
  sector client_sector NOT NULL DEFAULT 'private',
  country TEXT DEFAULT 'SA',
  city TEXT,
  address TEXT,
  billing_email TEXT NOT NULL,
  phone TEXT,
  website TEXT,
  logo_url TEXT,
  status client_status NOT NULL DEFAULT 'prospect',
  notes TEXT,
  tags TEXT[],
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- جدول جهات الاتصال للعملاء
CREATE TABLE public.client_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  title TEXT,
  department TEXT,
  is_primary BOOLEAN DEFAULT false,
  is_billing_contact BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- جدول الشركات التابعة
CREATE TABLE public.subsidiaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  name_ar TEXT,
  logo_url TEXT,
  description TEXT,
  description_ar TEXT,
  website TEXT,
  services TEXT[],
  management_team JSONB DEFAULT '[]',
  order_index INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- جدول إدارة الصفحات والمحتوى
CREATE TABLE public.pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  title_ar TEXT,
  content JSONB DEFAULT '{}',
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT[],
  language TEXT DEFAULT 'ar',
  status TEXT DEFAULT 'draft',
  featured_image TEXT,
  author_id UUID REFERENCES auth.users(id),
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- جدول المشاريع
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  project_type TEXT,
  start_date DATE,
  due_date DATE,
  completion_date DATE,
  status project_status DEFAULT 'planning',
  budget DECIMAL(15,2),
  currency TEXT DEFAULT 'SAR',
  progress_percentage INTEGER DEFAULT 0,
  assigned_manager UUID REFERENCES auth.users(id),
  tags TEXT[],
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- جدول مراحل المشاريع
CREATE TABLE public.project_stages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending',
  start_date DATE,
  end_date DATE,
  completion_percentage INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- جدول المهام
CREATE TABLE public.project_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  stage_id UUID REFERENCES public.project_stages(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  assignee_id UUID REFERENCES auth.users(id),
  due_date TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'pending',
  priority TEXT DEFAULT 'medium',
  completion_percentage INTEGER DEFAULT 0,
  estimated_hours INTEGER,
  actual_hours INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- جدول محاضر الاجتماعات
CREATE TABLE public.meeting_minutes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  meeting_date TIMESTAMP WITH TIME ZONE NOT NULL,
  attendees TEXT[],
  agenda TEXT,
  notes TEXT,
  action_items JSONB DEFAULT '[]',
  attachments JSONB DEFAULT '[]',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- جدول التذاكر والدعم
CREATE TABLE public.support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_number TEXT UNIQUE NOT NULL,
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  priority ticket_priority DEFAULT 'medium',
  status ticket_status DEFAULT 'open',
  category TEXT DEFAULT 'general',
  assignee_id UUID REFERENCES auth.users(id),
  requester_name TEXT,
  requester_email TEXT,
  requester_phone TEXT,
  sla_due_date TIMESTAMP WITH TIME ZONE,
  resolution_notes TEXT,
  resolved_at TIMESTAMP WITH TIME ZONE,
  first_response_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- جدول ردود التذاكر
CREATE TABLE public.ticket_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID REFERENCES public.support_tickets(id) ON DELETE CASCADE,
  sender_type TEXT NOT NULL, -- 'client' or 'staff'
  sender_id UUID REFERENCES auth.users(id),
  sender_name TEXT,
  sender_email TEXT,
  body TEXT NOT NULL,
  attachments JSONB DEFAULT '[]',
  is_internal BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- جدول عروض الأسعار
CREATE TABLE public.quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_number TEXT UNIQUE NOT NULL,
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  issue_date DATE DEFAULT CURRENT_DATE,
  expire_date DATE,
  subtotal DECIMAL(15,2) DEFAULT 0,
  vat_rate DECIMAL(5,2) DEFAULT 15.00,
  vat_amount DECIMAL(15,2) DEFAULT 0,
  total DECIMAL(15,2) DEFAULT 0,
  currency TEXT DEFAULT 'SAR',
  status quote_status DEFAULT 'draft',
  terms_conditions TEXT,
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  accepted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- جدول عناصر عروض الأسعار
CREATE TABLE public.quote_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id UUID REFERENCES public.quotes(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  quantity DECIMAL(10,2) DEFAULT 1,
  unit_price DECIMAL(15,2) NOT NULL,
  total_price DECIMAL(15,2) NOT NULL,
  order_index INTEGER DEFAULT 0
);

-- جدول العقود
CREATE TABLE public.business_contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_number TEXT UNIQUE NOT NULL,
  quote_id UUID REFERENCES public.quotes(id),
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  start_date DATE,
  end_date DATE,
  contract_value DECIMAL(15,2),
  currency TEXT DEFAULT 'SAR',
  status contract_status DEFAULT 'draft',
  terms_conditions TEXT,
  file_url TEXT,
  signed_at TIMESTAMP WITH TIME ZONE,
  signed_by_client TEXT,
  signed_by_company TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- جدول الفواتير التجارية
CREATE TABLE public.business_invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number TEXT UNIQUE NOT NULL,
  quote_id UUID REFERENCES public.quotes(id),
  contract_id UUID REFERENCES public.business_contracts(id),
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  issue_date DATE DEFAULT CURRENT_DATE,
  due_date DATE,
  subtotal DECIMAL(15,2) DEFAULT 0,
  vat_rate DECIMAL(5,2) DEFAULT 15.00,
  vat_amount DECIMAL(15,2) DEFAULT 0,
  total DECIMAL(15,2) DEFAULT 0,
  currency TEXT DEFAULT 'SAR',
  status invoice_status DEFAULT 'draft',
  payment_terms TEXT,
  notes TEXT,
  qr_code TEXT,
  zatca_uuid TEXT,
  created_by UUID REFERENCES auth.users(id),
  sent_at TIMESTAMP WITH TIME ZONE,
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- جدول عناصر الفواتير
CREATE TABLE public.business_invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID REFERENCES public.business_invoices(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  quantity DECIMAL(10,2) DEFAULT 1,
  unit_price DECIMAL(15,2) NOT NULL,
  total_price DECIMAL(15,2) NOT NULL,
  vat_rate DECIMAL(5,2) DEFAULT 15.00,
  vat_amount DECIMAL(15,2) DEFAULT 0,
  order_index INTEGER DEFAULT 0
);

-- جدول المدفوعات
CREATE TABLE public.business_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID REFERENCES public.business_invoices(id) ON DELETE CASCADE,
  payment_method TEXT NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  currency TEXT DEFAULT 'SAR',
  status payment_status DEFAULT 'pending',
  transaction_reference TEXT,
  provider_reference TEXT,
  payment_date TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- جدول الوظائف
CREATE TABLE public.job_postings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  title_ar TEXT,
  department TEXT,
  location TEXT DEFAULT 'الرياض، السعودية',
  job_type job_type DEFAULT 'full_time',
  description TEXT NOT NULL,
  description_ar TEXT,
  requirements TEXT,
  requirements_ar TEXT,
  benefits TEXT,
  benefits_ar TEXT,
  salary_range TEXT,
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- جدول المتقدمين للوظائف
CREATE TABLE public.job_applicants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES public.job_postings(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  cv_url TEXT,
  cover_letter TEXT,
  stage applicant_stage DEFAULT 'applied',
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  interview_notes TEXT,
  recruiter_notes TEXT,
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- جدول مكتبة الوسائط
CREATE TABLE public.media_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  file_url TEXT NOT NULL,
  alt_text TEXT,
  caption TEXT,
  tags TEXT[],
  folder TEXT DEFAULT 'general',
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- جدول الإشعارات
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info',
  channel TEXT DEFAULT 'system', -- email, whatsapp, sms, system
  is_read BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}',
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- جدول الإعدادات العامة
CREATE TABLE public.system_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'general',
  updated_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subsidiaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_minutes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_postings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applicants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;