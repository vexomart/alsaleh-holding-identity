import { useState, useEffect, useCallback, createContext, useContext } from 'react';

export type Language = 'ar' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dir: 'rtl' | 'ltr';
}

const translations: Record<Language, Record<string, string>> = {
  ar: {
    // Dashboard
    'dashboard.title': 'لوحة التحكم',
    'dashboard.welcome': 'مرحباً بك',
    'dashboard.overview': 'نظرة عامة',
    'dashboard.analytics': 'التحليلات',
    'dashboard.reports': 'التقارير',
    'dashboard.settings': 'الإعدادات',
    'dashboard.profile': 'الملف الشخصي',
    'dashboard.notifications': 'الإشعارات',
    'dashboard.search': 'بحث...',
    'dashboard.logout': 'تسجيل الخروج',
    
    // KPIs
    'kpi.portfolio': 'قيمة المحفظة',
    'kpi.revenue': 'الإيرادات',
    'kpi.roi': 'العائد على الاستثمار',
    'kpi.growth': 'معدل النمو',
    'kpi.services': 'الخدمات النشطة',
    'kpi.clients': 'العملاء',
    'kpi.projects': 'المشاريع',
    'kpi.transactions': 'المعاملات',
    
    // Charts
    'chart.performance': 'أداء المحفظة',
    'chart.revenue': 'الإيرادات الشهرية',
    'chart.distribution': 'توزيع الاستثمارات',
    'chart.growth': 'مؤشر النمو',
    
    // Time periods
    'time.today': 'اليوم',
    'time.week': 'هذا الأسبوع',
    'time.month': 'هذا الشهر',
    'time.quarter': 'هذا الربع',
    'time.year': 'هذا العام',
    
    // Sectors
    'sector.technology': 'التكنولوجيا',
    'sector.media': 'الإعلام',
    'sector.digital': 'الاستثمارات الرقمية',
    'sector.real_estate': 'العقارات',
    'sector.finance': 'الخدمات المالية',
    
    // Actions
    'action.view_all': 'عرض الكل',
    'action.download': 'تحميل',
    'action.export': 'تصدير',
    'action.filter': 'تصفية',
    'action.refresh': 'تحديث',
    'action.save': 'حفظ',
    'action.cancel': 'إلغاء',
    
    // Notifications
    'notification.new': 'جديد',
    'notification.unread': 'غير مقروء',
    'notification.mark_read': 'تحديد كمقروء',
    'notification.clear_all': 'مسح الكل',
    
    // Status
    'status.active': 'نشط',
    'status.pending': 'قيد الانتظار',
    'status.completed': 'مكتمل',
    'status.cancelled': 'ملغي',
    
    // Reports
    'report.financial': 'التقارير المالية',
    'report.performance': 'تقارير الأداء',
    'report.quarterly': 'التقرير الربعي',
    'report.annual': 'التقرير السنوي',
    
    // Settings
    'settings.security': 'الأمان',
    'settings.preferences': 'التفضيلات',
    'settings.language': 'اللغة',
    'settings.theme': 'المظهر',
    'settings.notifications': 'إعدادات الإشعارات',
  },
  en: {
    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.welcome': 'Welcome',
    'dashboard.overview': 'Overview',
    'dashboard.analytics': 'Analytics',
    'dashboard.reports': 'Reports',
    'dashboard.settings': 'Settings',
    'dashboard.profile': 'Profile',
    'dashboard.notifications': 'Notifications',
    'dashboard.search': 'Search...',
    'dashboard.logout': 'Logout',
    
    // KPIs
    'kpi.portfolio': 'Portfolio Value',
    'kpi.revenue': 'Revenue',
    'kpi.roi': 'ROI',
    'kpi.growth': 'Growth Rate',
    'kpi.services': 'Active Services',
    'kpi.clients': 'Clients',
    'kpi.projects': 'Projects',
    'kpi.transactions': 'Transactions',
    
    // Charts
    'chart.performance': 'Portfolio Performance',
    'chart.revenue': 'Monthly Revenue',
    'chart.distribution': 'Investment Distribution',
    'chart.growth': 'Growth Indicator',
    
    // Time periods
    'time.today': 'Today',
    'time.week': 'This Week',
    'time.month': 'This Month',
    'time.quarter': 'This Quarter',
    'time.year': 'This Year',
    
    // Sectors
    'sector.technology': 'Technology',
    'sector.media': 'Media',
    'sector.digital': 'Digital Investments',
    'sector.real_estate': 'Real Estate',
    'sector.finance': 'Financial Services',
    
    // Actions
    'action.view_all': 'View All',
    'action.download': 'Download',
    'action.export': 'Export',
    'action.filter': 'Filter',
    'action.refresh': 'Refresh',
    'action.save': 'Save',
    'action.cancel': 'Cancel',
    
    // Notifications
    'notification.new': 'New',
    'notification.unread': 'Unread',
    'notification.mark_read': 'Mark as Read',
    'notification.clear_all': 'Clear All',
    
    // Status
    'status.active': 'Active',
    'status.pending': 'Pending',
    'status.completed': 'Completed',
    'status.cancelled': 'Cancelled',
    
    // Reports
    'report.financial': 'Financial Reports',
    'report.performance': 'Performance Reports',
    'report.quarterly': 'Quarterly Report',
    'report.annual': 'Annual Report',
    
    // Settings
    'settings.security': 'Security',
    'settings.preferences': 'Preferences',
    'settings.language': 'Language',
    'settings.theme': 'Theme',
    'settings.notifications': 'Notification Settings',
  },
};

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

export const useLanguageState = () => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('dashboard_language');
    return (saved as Language) || 'ar';
  });

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('dashboard_language', lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, []);

  const t = useCallback((key: string): string => {
    return translations[language][key] || key;
  }, [language]);

  const dir: 'rtl' | 'ltr' = language === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
  }, [language, dir]);

  return { language, setLanguage, t, dir };
};
