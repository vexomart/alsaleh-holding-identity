/**
 * V3 Customer Layout - Banking Portal
 * 100% Custom - NO SHADCN
 * RTL-First Arabic Native
 */

import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { V3RailNav, RailNavGroup } from '../navigation/V3RailNav';
import { V3BankHeader } from '../navigation/V3BankHeader';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import '@/styles/v3/tokens.css';

// Icons
const HomeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

const ShoppingCartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
  </svg>
);

const WalletIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/>
  </svg>
);

const FileTextIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/>
  </svg>
);

const PackageIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
  </svg>
);

const ReceiptIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/>
  </svg>
);

const HeadphonesIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/>
  </svg>
);

const SettingsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);

const LandmarkIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" x2="21" y1="22" y2="22"/><line x1="6" x2="6" y1="18" y2="11"/><line x1="10" x2="10" y1="18" y2="11"/><line x1="14" x2="14" y1="18" y2="11"/><line x1="18" x2="18" y1="18" y2="11"/><polygon points="12 2 20 7 4 7"/>
  </svg>
);

const UsersIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const CUSTOMER_BASE = '/portal';

export interface V3CustomerLayoutProps {
  children: React.ReactNode;
}

export const V3CustomerLayout: React.FC<V3CustomerLayoutProps> = ({ children }) => {
  const { language } = useLanguage();
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [isRailExpanded, setIsRailExpanded] = React.useState(false);
  const [walletBalance, setWalletBalance] = React.useState<number>(0);
  const [unreadNotifications, setUnreadNotifications] = React.useState<number>(0);

  // Fetch wallet balance and notifications count - filtered by current user
  React.useEffect(() => {
    if (!user?.id) return;

    const fetchUserData = async () => {
      // Fetch wallet balance - use maybeSingle() for users without wallets
      const { data: walletData } = await supabase
        .from('customer_wallets')
        .select('balance')
        .eq('customer_user_id', user.id)
        .maybeSingle();
      
      if (walletData) {
        setWalletBalance(walletData.balance || 0);
      }

      // Fetch unread notifications count
      const { count } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('is_read', false);

      setUnreadNotifications(count || 0);
    };

    fetchUserData();
  }, [user?.id]);

  // Time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return language === 'ar' ? 'صباح الخير' : 'Good Morning';
    if (hour < 17) return language === 'ar' ? 'مساء الخير' : 'Good Afternoon';
    return language === 'ar' ? 'مساء الخير' : 'Good Evening';
  };

  const navGroups: RailNavGroup[] = [
    {
      id: 'main',
      labelAr: 'الرئيسية',
      labelEn: 'Main',
      items: [
        { id: 'home', labelAr: 'الرئيسية', labelEn: 'Home', icon: <HomeIcon />, href: CUSTOMER_BASE },
        { id: 'orders', labelAr: 'طلباتي', labelEn: 'My Orders', icon: <ShoppingCartIcon />, href: `${CUSTOMER_BASE}/orders` },
        { id: 'wallet', labelAr: 'المحفظة', labelEn: 'Wallet', icon: <WalletIcon />, href: `${CUSTOMER_BASE}/wallet` },
      ],
    },
    {
      id: 'finance',
      labelAr: 'المالية',
      labelEn: 'Finance',
      items: [
        { id: 'finance', labelAr: 'التمويل', labelEn: 'Finance', icon: <LandmarkIcon />, href: `${CUSTOMER_BASE}/finance` },
        { id: 'referrals', labelAr: 'الإحالات', labelEn: 'Referrals', icon: <UsersIcon />, href: `${CUSTOMER_BASE}/referrals` },
      ],
    },
    {
      id: 'documents',
      labelAr: 'المستندات',
      labelEn: 'Documents',
      items: [
        { id: 'contracts', labelAr: 'العقود', labelEn: 'Contracts', icon: <FileTextIcon />, href: `${CUSTOMER_BASE}/contracts` },
        { id: 'invoices', labelAr: 'الفواتير', labelEn: 'Invoices', icon: <ReceiptIcon />, href: `${CUSTOMER_BASE}/invoices` },
      ],
    },
    {
      id: 'services',
      labelAr: 'الخدمات',
      labelEn: 'Services',
      items: [
        { id: 'catalog', labelAr: 'الخدمات', labelEn: 'Services', icon: <PackageIcon />, href: `${CUSTOMER_BASE}/services` },
        { id: 'support', labelAr: 'الدعم', labelEn: 'Support', icon: <HeadphonesIcon />, href: `${CUSTOMER_BASE}/support` },
        { id: 'settings', labelAr: 'الإعدادات', labelEn: 'Settings', icon: <SettingsIcon />, href: `${CUSTOMER_BASE}/settings` },
      ],
    },
  ];

  return (
    <div className="bank-portal">
      <div className={`bank-grid ${isRailExpanded ? 'rail-expanded' : ''}`}>
        {/* Rail Navigation */}
        <V3RailNav
          context="bank"
          groups={navGroups}
          isExpanded={isRailExpanded}
          onToggle={() => setIsRailExpanded(!isRailExpanded)}
          language={language}
        />

        {/* Main Area */}
        <div className="bank-main">
          <V3BankHeader
            greeting={getGreeting()}
            userName={profile?.full_name || profile?.email?.split('@')[0]}
            customerId={profile?.customer_uid}
            isVerified={profile?.is_kyc_verified}
            balance={walletBalance}
            notifications={unreadNotifications}
            onNotifications={() => navigate('/portal/notifications')}
            onProfile={() => navigate('/portal/profile')}
            onHelp={() => navigate('/portal/support')}
            language={language}
          />

          {/* Content */}
          <main className="bank-content">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

V3CustomerLayout.displayName = 'V3CustomerLayout';
