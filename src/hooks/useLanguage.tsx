import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

export type Language = 'ar' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dir: 'rtl' | 'ltr';
  isRTL: boolean;
}

const translations: Record<Language, Record<string, string>> = {
  ar: {
    // Auth
    'auth.login': 'تسجيل الدخول',
    'auth.logout': 'تسجيل الخروج',
    'auth.email': 'البريد الإلكتروني',
    'auth.password': 'كلمة المرور',
    'auth.forgot_password': 'نسيت كلمة المرور؟',
    'auth.reset_password': 'إعادة تعيين كلمة المرور',
    'auth.send_reset_link': 'إرسال رابط الإعادة',
    'auth.back_to_login': 'العودة لتسجيل الدخول',
    'auth.remember_me': 'تذكرني',
    'auth.login_success': 'تم تسجيل الدخول بنجاح',
    'auth.login_error': 'خطأ في تسجيل الدخول',
    'auth.invalid_credentials': 'بيانات الدخول غير صحيحة',
    
    // Dashboard
    'dashboard.overview': 'نظرة عامة',
    'dashboard.orders': 'الطلبات',
    'dashboard.services': 'الخدمات',
    'dashboard.users': 'المستخدمين',
    'dashboard.settings': 'الإعدادات',
    'dashboard.notifications': 'الإشعارات',
    'dashboard.reports': 'التقارير',
    'dashboard.support': 'الدعم',
    'dashboard.profile': 'الملف الشخصي',
    'dashboard.security': 'الأمان',
    'dashboard.cms': 'إدارة المحتوى',
    'dashboard.audit': 'سجل التدقيق',
    
    // Admin
    'admin.title': 'لوحة الإدارة',
    'admin.welcome': 'مرحباً بك في لوحة الإدارة',
    'admin.total_users': 'إجمالي المستخدمين',
    'admin.total_orders': 'إجمالي الطلبات',
    'admin.total_revenue': 'إجمالي الإيرادات',
    'admin.pending_orders': 'الطلبات المعلقة',
    'admin.recent_orders': 'أحدث الطلبات',
    'admin.recent_users': 'أحدث المستخدمين',
    
    // Customer
    'customer.title': 'لوحة العميل',
    'customer.welcome': 'مرحباً بك',
    'customer.my_orders': 'طلباتي',
    'customer.new_order': 'طلب جديد',
    'customer.track_order': 'تتبع الطلب',
    'customer.my_tickets': 'تذاكر الدعم',
    
    // Common
    'common.save': 'حفظ',
    'common.cancel': 'إلغاء',
    'common.delete': 'حذف',
    'common.edit': 'تعديل',
    'common.view': 'عرض',
    'common.search': 'بحث',
    'common.filter': 'تصفية',
    'common.export': 'تصدير',
    'common.refresh': 'تحديث',
    'common.loading': 'جاري التحميل...',
    'common.no_data': 'لا توجد بيانات',
    'common.error': 'حدث خطأ',
    'common.success': 'تمت العملية بنجاح',
    
    // Status
    'status.pending': 'قيد الانتظار',
    'status.processing': 'قيد المعالجة',
    'status.in_progress': 'قيد التنفيذ',
    'status.completed': 'مكتمل',
    'status.cancelled': 'ملغي',
  },
  en: {
    // Auth
    'auth.login': 'Login',
    'auth.logout': 'Logout',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.forgot_password': 'Forgot Password?',
    'auth.reset_password': 'Reset Password',
    'auth.send_reset_link': 'Send Reset Link',
    'auth.back_to_login': 'Back to Login',
    'auth.remember_me': 'Remember me',
    'auth.login_success': 'Login successful',
    'auth.login_error': 'Login error',
    'auth.invalid_credentials': 'Invalid credentials',
    
    // Dashboard
    'dashboard.overview': 'Overview',
    'dashboard.orders': 'Orders',
    'dashboard.services': 'Services',
    'dashboard.users': 'Users',
    'dashboard.settings': 'Settings',
    'dashboard.notifications': 'Notifications',
    'dashboard.reports': 'Reports',
    'dashboard.support': 'Support',
    'dashboard.profile': 'Profile',
    'dashboard.security': 'Security',
    'dashboard.cms': 'CMS',
    'dashboard.audit': 'Audit Log',
    
    // Admin
    'admin.title': 'Admin Dashboard',
    'admin.welcome': 'Welcome to Admin Dashboard',
    'admin.total_users': 'Total Users',
    'admin.total_orders': 'Total Orders',
    'admin.total_revenue': 'Total Revenue',
    'admin.pending_orders': 'Pending Orders',
    'admin.recent_orders': 'Recent Orders',
    'admin.recent_users': 'Recent Users',
    
    // Customer
    'customer.title': 'Customer Dashboard',
    'customer.welcome': 'Welcome',
    'customer.my_orders': 'My Orders',
    'customer.new_order': 'New Order',
    'customer.track_order': 'Track Order',
    'customer.my_tickets': 'Support Tickets',
    
    // Common
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.view': 'View',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.export': 'Export',
    'common.refresh': 'Refresh',
    'common.loading': 'Loading...',
    'common.no_data': 'No data',
    'common.error': 'An error occurred',
    'common.success': 'Success',
    
    // Status
    'status.pending': 'Pending',
    'status.processing': 'Processing',
    'status.in_progress': 'In Progress',
    'status.completed': 'Completed',
    'status.cancelled': 'Cancelled',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ash_language');
      return (saved as Language) || 'ar';
    }
    return 'ar';
  });

  /**
   * SINGLE SOURCE OF TRUTH: Apply direction at document level
   * This is the ONLY place where document.dir should be set
   */
  const applyDirection = (lang: Language) => {
    const dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
    document.body.dir = dir; // Also body for full coverage
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('ash_language', lang);
    applyDirection(lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  const dir: 'rtl' | 'ltr' = language === 'ar' ? 'rtl' : 'ltr';
  const isRTL = language === 'ar';

  // Apply direction on mount and language change
  useEffect(() => {
    applyDirection(language);
  }, [language]);

  const value: LanguageContextType = { language, setLanguage, t, dir, isRTL };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    return {
      language: 'ar' as Language,
      setLanguage: () => {},
      t: (key: string) => key,
      dir: 'rtl' as const,
      isRTL: true,
    };
  }
  return context;
};
