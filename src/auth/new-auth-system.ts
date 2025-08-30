// نظام المصادقة الجديد - الثوابت والأنواع

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  email_lower: string;
  role: 'client' | 'admin' | 'superadmin';
  status: 'pending' | 'active' | 'blocked' | 'inactive';
  email_verified_at?: string;
  last_login_at?: string;
  created_at: string;
}

export interface AuthSession {
  id: string;
  user_id: string;
  session_token: string;
  realm: 'client' | 'admin';
  expires_at: string;
  user?: AuthUser;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  error_code?: string;
  user?: AuthUser;
  session?: AuthSession;
  requires_otp?: boolean;
  user_id?: string;
  redirect_url?: string;
}

export const AUTH_MESSAGES = {
  SUCCESS: {
    SIGNUP: 'تم إرسال رمز التحقق إلى بريدك الإلكتروني',
    LOGIN: 'تم تسجيل الدخول بنجاح',
    VERIFY: 'تم تفعيل حسابك ويمكنك تسجيل الدخول الآن',
    RESET: 'تم تحديث كلمة المرور بنجاح',
    OTP_SENT: 'أرسلنا رمز التحقق إلى بريدك'
  },
  ERROR: {
    INVALID_CREDENTIALS: 'بيانات تسجيل الدخول غير صحيحة',
    EMAIL_EXISTS: 'البريد الإلكتروني مسجّل مسبقًا',
    NOT_VERIFIED: 'الرجاء تفعيل بريدك الإلكتروني قبل تسجيل الدخول',
    ACCOUNT_BLOCKED: 'تم حظر حسابك. يرجى التواصل مع الإدارة',
    INVALID_OTP: 'رمز التحقق غير صحيح',
    OTP_EXPIRED: 'انتهت صلاحية رمز التحقق',
    RATE_LIMITED: 'تم تجاوز حد المحاولات. يرجى المحاولة لاحقاً',
    WRONG_REALM: 'غير مسموح بالوصول من هذا المسار'
  }
};

export const AUTH_ROUTES = {
  CLIENT: {
    LOGIN: '/auth/client/login',
    SIGNUP: '/auth/client/signup',
    FORGOT: '/auth/client/forgot',
    RESET: '/auth/client/reset',
    DASHBOARD: '/client/dashboard'
  },
  ADMIN: {
    LOGIN: '/auth/admin/login',
    DASHBOARD: '/admin/dashboard'
  }
};

export const SESSION_CONFIG = {
  DOMAIN: '.alialshehriholding.com',
  SAME_SITE: 'None' as const,
  SECURE: true,
  CLIENT_EXPIRES: 24 * 60 * 60 * 1000, // 24 ساعة
  ADMIN_EXPIRES: 8 * 60 * 60 * 1000,   // 8 ساعات
};

export const RATE_LIMITS = {
  LOGIN: 5,           // 5 محاولات
  LOGIN_WINDOW: 5,    // في 5 دقائق
  OTP: 5,             // 5 محاولات
  OTP_WINDOW: 10,     // في 10 دقائق
  RESET: 3,           // 3 محاولات
  RESET_WINDOW: 60,   // في ساعة
};