-- إنشاء نظام ASH HOLDING الموحد - المرحلة الأولى
-- إنشاء جدول المستخدمين الموحد
CREATE TABLE public.ash_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  phone TEXT UNIQUE,
  name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('superadmin', 'admin', 'finance', 'support', 'client')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('active', 'suspended', 'pending', 'blocked')),
  kyc_status TEXT NOT NULL DEFAULT 'unverified' CHECK (kyc_status IN ('unverified', 'pending', 'verified', 'rejected')),
  two_factor_enabled BOOLEAN DEFAULT false,
  avatar_url TEXT,
  company_name TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_login_at TIMESTAMP WITH TIME ZONE,
  verified_at TIMESTAMP WITH TIME ZONE
);

-- إنشاء جدول رموز التحقق OTP
CREATE TABLE public.ash_otps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.ash_users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  code TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'login' CHECK (type IN ('login', 'register', 'reset')),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  attempts INTEGER DEFAULT 0,
  consumed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- إنشاء جدول المحافظ الرقمية
CREATE TABLE public.ash_wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.ash_users(id) ON DELETE CASCADE UNIQUE,
  balance DECIMAL(18,2) DEFAULT 0.00 NOT NULL,
  currency TEXT DEFAULT 'SAR' NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- إنشاء جدول معاملات المحفظة
CREATE TABLE public.ash_wallet_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id UUID REFERENCES public.ash_wallets(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.ash_users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('deposit', 'withdraw', 'charge', 'adjustment', 'refund', 'commission')),
  amount DECIMAL(18,2) NOT NULL,
  balance_before DECIMAL(18,2),
  balance_after DECIMAL(18,2),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled')),
  reference_id TEXT,
  description TEXT,
  admin_notes TEXT,
  created_by UUID REFERENCES public.ash_users(id),
  approved_by UUID REFERENCES public.ash_users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  approved_at TIMESTAMP WITH TIME ZONE
);