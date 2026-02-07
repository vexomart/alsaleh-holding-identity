/**
 * UnifiedHeader - V3 Dashboard Header
 * Light Theme - Modern SaaS Style
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
  ChevronDown
} from 'lucide-react';
import '@/styles/v3/light-theme.css';

interface UnifiedHeaderProps {
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
};

export const UnifiedHeader: React.FC<UnifiedHeaderProps> = ({
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
    <header className="v3-header">
      {/* Left: Menu + Title */}
      <div className="flex items-center gap-4">
        <button
          className="v3-btn-ghost h-10 w-10 p-0"
          onClick={onMenuClick}
        >
          <Menu size={20} />
        </button>

        <h1 className="font-semibold text-lg hidden sm:block" style={{ color: 'hsl(var(--v3-text-primary))' }}>
          {getPageTitle()}
        </h1>
      </div>

      {/* Center: Search (Desktop) */}
      {!isMobile && (
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search 
              className="absolute start-3 top-1/2 -translate-y-1/2" 
              size={18}
              style={{ color: 'hsl(var(--v3-text-muted))' }}
            />
            <input
              type="text"
              placeholder={isRTL ? 'بحث...' : 'Search...'}
              className={cn(
                'w-full h-10 ps-10 pe-4 rounded-lg text-sm',
                'border transition-all duration-200'
              )}
              style={{
                background: 'hsl(var(--v3-bg-elevated))',
                borderColor: 'hsl(var(--v3-border-default))',
                color: 'hsl(var(--v3-text-primary))',
              }}
            />
          </div>
        </div>
      )}

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <button
          className="v3-btn-ghost h-10 w-10 p-0 relative"
          onClick={() => navigate(variant === 'admin' ? '/adminash/notifications' : '/portal/notifications')}
        >
          <Bell size={20} />
          <span 
            className="absolute top-1 end-1 w-2 h-2 rounded-full"
            style={{ background: 'hsl(var(--v3-error))' }}
          />
        </button>

        {/* User Menu */}
        <div className="relative" ref={userMenuRef}>
          <button
            className={cn(
              'flex items-center gap-2 h-10 px-3 rounded-lg transition-colors'
            )}
            onClick={() => setShowUserMenu(!showUserMenu)}
            style={{
              background: showUserMenu ? 'hsl(var(--v3-bg-hover))' : 'transparent',
            }}
          >
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ 
                background: 'hsl(var(--v3-brand-primary) / 0.1)',
                color: 'hsl(var(--v3-brand-primary))'
              }}
            >
              <User size={18} />
            </div>
            {!isMobile && (
              <>
                <span 
                  className="text-sm font-medium"
                  style={{ color: 'hsl(var(--v3-text-primary))' }}
                >
                  {profile?.full_name || user?.email?.split('@')[0]}
                </span>
                <ChevronDown 
                  size={16} 
                  style={{ 
                    color: 'hsl(var(--v3-text-muted))',
                    transform: showUserMenu ? 'rotate(180deg)' : 'none',
                    transition: 'transform 200ms'
                  }}
                />
              </>
            )}
          </button>

          {/* Dropdown Menu */}
          {showUserMenu && (
            <div 
              className="absolute end-0 top-full mt-2 w-56 rounded-xl overflow-hidden shadow-lg z-50"
              style={{
                background: 'hsl(var(--v3-bg-card))',
                border: '1px solid hsl(var(--v3-border-light))',
              }}
            >
              <div 
                className="px-4 py-3 border-b"
                style={{ borderColor: 'hsl(var(--v3-border-light))' }}
              >
                <p 
                  className="text-sm font-medium"
                  style={{ color: 'hsl(var(--v3-text-primary))' }}
                >
                  {profile?.full_name}
                </p>
                <p 
                  className="text-xs"
                  style={{ color: 'hsl(var(--v3-text-muted))' }}
                >
                  {user?.email}
                </p>
              </div>
              
              <div className="py-1">
                <button
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors"
                  style={{ color: 'hsl(var(--v3-text-secondary))' }}
                  onClick={() => {
                    navigate(variant === 'admin' ? '/adminash/settings' : '/portal/profile');
                    setShowUserMenu(false);
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'hsl(var(--v3-bg-hover))'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <Settings size={18} />
                  {isRTL ? 'الإعدادات' : 'Settings'}
                </button>
                
                <button
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors"
                  style={{ color: 'hsl(var(--v3-error))' }}
                  onClick={handleLogout}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'hsl(var(--v3-error-bg))'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <LogOut size={18} />
                  {isRTL ? 'تسجيل الخروج' : 'Logout'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

UnifiedHeader.displayName = 'UnifiedHeader';
