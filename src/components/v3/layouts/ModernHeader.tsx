/**
 * ModernHeader - V3 Dashboard Header
 * Stripe/Notion Inspired - Clean & Minimal
 * RTL-First Arabic Native
 */

import * as React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/hooks/useAuth';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Menu,
  Bell,
  Search,
  User,
  LogOut,
  Settings,
  ChevronDown,
  HelpCircle
} from 'lucide-react';
import '@/styles/v3/modern-theme.css';

interface ModernHeaderProps {
  onMenuClick: () => void;
  variant: 'admin' | 'customer';
}

const pageTitles: Record<string, { ar: string; en: string }> = {
  // Admin routes
  '/adminash': { ar: 'نظرة عامة', en: 'Overview' },
  '/adminash/users': { ar: 'المستخدمين', en: 'Users' },
  '/adminash/roles': { ar: 'الأدوار والصلاحيات', en: 'Roles & Permissions' },
  '/adminash/services': { ar: 'الخدمات', en: 'Services' },
  '/adminash/orders': { ar: 'الطلبات', en: 'Orders' },
  '/adminash/contracts': { ar: 'العقود', en: 'Contracts' },
  '/adminash/wallets': { ar: 'المحافظ', en: 'Wallets' },
  '/adminash/finance': { ar: 'مركز التمويل', en: 'Finance Center' },
  '/adminash/referrals': { ar: 'الإحالات', en: 'Referrals' },
  '/adminash/integrations': { ar: 'التكاملات', en: 'Integrations' },
  '/adminash/reports': { ar: 'التقارير', en: 'Reports' },
  '/adminash/notifications': { ar: 'الإشعارات', en: 'Notifications' },
  '/adminash/settings': { ar: 'الإعدادات', en: 'Settings' },
  '/adminash/audit': { ar: 'سجل المراجعة', en: 'Audit Log' },
  // Customer routes
  '/portal': { ar: 'نظرة عامة', en: 'Overview' },
  '/portal/orders': { ar: 'طلباتي', en: 'My Orders' },
  '/portal/services': { ar: 'الخدمات', en: 'Services' },
  '/portal/contracts': { ar: 'عقودي', en: 'My Contracts' },
  '/portal/invoices': { ar: 'فواتيري', en: 'My Invoices' },
  '/portal/wallet': { ar: 'المحفظة', en: 'Wallet' },
  '/portal/transactions': { ar: 'المعاملات', en: 'Transactions' },
  '/portal/finance': { ar: 'التمويل', en: 'Finance' },
  '/portal/referrals': { ar: 'الإحالات', en: 'Referrals' },
  '/portal/notifications': { ar: 'الإشعارات', en: 'Notifications' },
  '/portal/profile': { ar: 'الملف الشخصي', en: 'Profile' },
  '/portal/security': { ar: 'الأمان', en: 'Security' },
  '/portal/support': { ar: 'الدعم', en: 'Support' },
  '/portal/settings': { ar: 'الإعدادات', en: 'Settings' },
};

export const ModernHeader: React.FC<ModernHeaderProps> = ({
  onMenuClick,
  variant
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isRTL, language } = useLanguage();
  const { user, profile, signOut } = useAuth();
  const isMobile = useIsMobile();
  const [showUserMenu, setShowUserMenu] = React.useState(false);
  const userMenuRef = React.useRef<HTMLDivElement>(null);

  // Close menu on outside click
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getPageTitle = () => {
    const path = location.pathname;
    if (pageTitles[path]) {
      return language === 'ar' ? pageTitles[path].ar : pageTitles[path].en;
    }
    // Check prefix match
    for (const [key, value] of Object.entries(pageTitles)) {
      if (path.startsWith(key) && key !== '/adminash' && key !== '/portal') {
        return language === 'ar' ? value.ar : value.en;
      }
    }
    return language === 'ar' ? 'نظرة عامة' : 'Overview';
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="modern-header" dir="rtl">
      {/* RIGHT SIDE: Menu + Title (RTL: starts from right) */}
      <div className="flex items-center gap-4">
        <button
          className="modern-btn-ghost h-9 w-9 p-0"
          onClick={onMenuClick}
          aria-label="القائمة"
        >
          <Menu size={20} />
        </button>

        <h1 
          className="font-semibold hidden sm:block"
          style={{ 
            color: 'hsl(var(--modern-text-primary))',
            fontSize: 'var(--modern-text-md)'
          }}
        >
          {getPageTitle()}
        </h1>
      </div>

      {/* CENTER: Search (Desktop) */}
      {!isMobile && (
        <div className="flex-1 max-w-sm mx-6">
          <div className="relative">
            <Search 
              className="absolute start-3 top-1/2 -translate-y-1/2" 
              size={16}
              style={{ color: 'hsl(var(--modern-text-muted))' }}
            />
            <input
              type="text"
              placeholder={isRTL ? 'بحث...' : 'Search...'}
              dir="rtl"
              className="modern-input ps-9 h-9"
              style={{
                background: 'hsl(var(--modern-bg-muted))',
                borderColor: 'transparent',
              }}
            />
          </div>
        </div>
      )}

      {/* LEFT SIDE: Actions (RTL: ends on left) */}
      <div className="flex items-center gap-1">
        {/* Help */}
        <button
          className="modern-btn-ghost h-9 w-9 p-0 hidden sm:flex"
          aria-label="المساعدة"
        >
          <HelpCircle size={18} />
        </button>

        {/* Notifications */}
        <button
          className="modern-btn-ghost h-9 w-9 p-0 relative"
          onClick={() => navigate(variant === 'admin' ? '/adminash/notifications' : '/portal/notifications')}
          aria-label="الإشعارات"
        >
          <Bell size={18} />
          <span 
            className="absolute top-1.5 start-1.5 w-2 h-2 rounded-full"
            style={{ background: 'hsl(var(--modern-error))' }}
          />
        </button>

        {/* Divider */}
        <div 
          className="w-px h-6 mx-2 hidden sm:block"
          style={{ background: 'hsl(var(--modern-border-light))' }}
        />

        {/* User Menu */}
        <div className="relative" ref={userMenuRef}>
          <button
            className={cn(
              'flex items-center gap-2 h-9 px-2 rounded-lg transition-all duration-150'
            )}
            onClick={() => setShowUserMenu(!showUserMenu)}
            style={{
              background: showUserMenu ? 'hsl(var(--modern-bg-hover))' : 'transparent',
            }}
          >
            <div 
              className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium"
              style={{ 
                background: 'linear-gradient(135deg, hsl(var(--modern-brand-primary)), hsl(var(--modern-brand-secondary)))',
                color: 'white'
              }}
            >
              {(profile?.full_name || user?.email)?.[0]?.toUpperCase() || 'U'}
            </div>
            {!isMobile && (
              <>
                <span 
                  className="text-sm font-medium max-w-[120px] truncate"
                  style={{ color: 'hsl(var(--modern-text-primary))' }}
                >
                  {profile?.full_name || user?.email?.split('@')[0]}
                </span>
                <ChevronDown 
                  size={14} 
                  style={{ 
                    color: 'hsl(var(--modern-text-muted))',
                    transform: showUserMenu ? 'rotate(180deg)' : 'none',
                    transition: 'transform 150ms'
                  }}
                />
              </>
            )}
          </button>

          {/* Dropdown Menu */}
          {showUserMenu && (
            <div 
              className="absolute start-0 top-full mt-2 w-60 rounded-xl overflow-hidden z-50"
              dir="rtl"
              style={{
                background: 'hsl(var(--modern-bg-card))',
                border: '1px solid hsl(var(--modern-border-light))',
                boxShadow: 'var(--modern-shadow-lg)',
              }}
            >
              {/* User Info */}
              <div 
                className="px-4 py-3 border-b"
                style={{ borderColor: 'hsl(var(--modern-border-light))' }}
              >
                <p 
                  className="text-sm font-medium truncate"
                  style={{ color: 'hsl(var(--modern-text-primary))' }}
                >
                  {profile?.full_name}
                </p>
                <p 
                  className="text-xs mt-0.5 truncate"
                  style={{ color: 'hsl(var(--modern-text-muted))' }}
                >
                  {user?.email}
                </p>
              </div>
              
              {/* Menu Items */}
              <div className="py-1">
                <button
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors"
                  style={{ color: 'hsl(var(--modern-text-secondary))' }}
                  onClick={() => {
                    navigate(variant === 'admin' ? '/adminash/settings' : '/portal/profile');
                    setShowUserMenu(false);
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'hsl(var(--modern-bg-hover))'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <User size={16} />
                  <span>{isRTL ? 'الملف الشخصي' : 'Profile'}</span>
                </button>
                
                <button
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors"
                  style={{ color: 'hsl(var(--modern-text-secondary))' }}
                  onClick={() => {
                    navigate(variant === 'admin' ? '/adminash/settings' : '/portal/settings');
                    setShowUserMenu(false);
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'hsl(var(--modern-bg-hover))'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <Settings size={16} />
                  <span>{isRTL ? 'الإعدادات' : 'Settings'}</span>
                </button>

                <div 
                  className="my-1 h-px"
                  style={{ background: 'hsl(var(--modern-border-light))' }}
                />
                
                <button
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors"
                  style={{ color: 'hsl(var(--modern-error))' }}
                  onClick={handleLogout}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'hsl(var(--modern-error-bg))'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <LogOut size={16} />
                  <span>{isRTL ? 'تسجيل الخروج' : 'Logout'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

ModernHeader.displayName = 'ModernHeader';
