/**
 * User Details Page - Command Center Dark Theme
 * Full profile view with all user information
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight,
  User,
  Mail,
  Phone,
  Calendar,
  Clock,
  Shield,
  Edit,
  UserX,
  UserCheck,
  Trash2,
  Crown,
  Star,
  CheckCircle2,
  XCircle,
  Globe,
  Activity,
  Key,
  History,
  FileText,
  Wallet,
  ShoppingCart,
  Building
} from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { db } from '@/integrations/supabase/db';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';
import { ROUTES } from '@/constants/routes';

// Role configuration
const roleConfig: Record<string, { labelAr: string; labelEn: string; color: string; icon: React.ElementType }> = {
  super_admin: { labelAr: "مدير النظام", labelEn: "Super Admin", color: "var(--cmd-accent-amber)", icon: Crown },
  admin: { labelAr: "مدير", labelEn: "Admin", color: "var(--cmd-accent-purple)", icon: Star },
  manager: { labelAr: "مشرف", labelEn: "Manager", color: "var(--cmd-accent-blue)", icon: Shield },
  support: { labelAr: "دعم فني", labelEn: "Support", color: "var(--cmd-accent-cyan)", icon: Activity },
  finance: { labelAr: "مالية", labelEn: "Finance", color: "var(--cmd-accent-green)", icon: Wallet },
  content_editor: { labelAr: "محرر", labelEn: "Editor", color: "265 70% 60%", icon: FileText },
  staff: { labelAr: "موظف", labelEn: "Staff", color: "220 15% 50%", icon: User },
  customer: { labelAr: "عميل", labelEn: "Customer", color: "220 12% 45%", icon: User },
};

interface UserData {
  id: string;
  email: string;
  full_name: string | null;
  full_name_ar: string | null;
  avatar_url: string | null;
  phone: string | null;
  is_active: boolean | null;
  preferred_language: string | null;
  tenant_id: string | null;
  created_at: string | null;
  updated_at: string | null;
  last_login_at: string | null;
  roles: { role: string }[];
}

export default function UserDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language, isRTL } = useLanguage();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ orders: 0, contracts: 0, walletBalance: 0 });

  useEffect(() => {
    if (id) {
      fetchUser();
      fetchStats();
    }
  }, [id]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      
      // Fetch profile data
      const { data: profileData, error: profileError } = await db
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (profileError) throw profileError;

      // Fetch user roles separately
      const { data: rolesData } = await db
        .from('user_roles')
        .select('role')
        .eq('user_id', id);

      setUser({
        ...profileData,
        roles: rolesData || []
      });
    } catch (err) {
      console.error('Error fetching user:', err);
      toast({
        title: language === 'ar' ? 'خطأ في تحميل البيانات' : 'Error loading data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // Fetch orders count
      const { count: ordersCount } = await db
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('customer_user_id', id);

      // Fetch contracts count  
      const { count: contractsCount } = await db
        .from('contracts')
        .select('*', { count: 'exact', head: true })
        .eq('customer_user_id', id);

      // Fetch wallet balance
      const { data: wallet } = await db
        .from('customer_wallets')
        .select('balance')
        .eq('customer_user_id', id)
        .maybeSingle();

      setStats({
        orders: ordersCount || 0,
        contracts: contractsCount || 0,
        walletBalance: wallet?.balance || 0,
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const handleToggleStatus = async () => {
    if (!user) return;
    try {
      const { error } = await db
        .from('profiles')
        .update({ is_active: !user.is_active })
        .eq('id', user.id);

      if (error) throw error;
      
      setUser({ ...user, is_active: !user.is_active });
      toast({
        title: language === 'ar' ? 'تم تحديث الحالة' : 'Status updated',
      });
    } catch (err) {
      console.error('Error updating status:', err);
      toast({
        title: language === 'ar' ? 'خطأ في تحديث الحالة' : 'Error updating status',
        variant: 'destructive',
      });
    }
  };

  const formatDate = (date: string | null) => {
    if (!date) return language === 'ar' ? 'غير متوفر' : 'N/A';
    return format(new Date(date), 'PPP', { locale: language === 'ar' ? ar : enUS });
  };

  const formatDateTime = (date: string | null) => {
    if (!date) return language === 'ar' ? 'لم يسجل دخول' : 'Never logged in';
    return format(new Date(date), 'PPpp', { locale: language === 'ar' ? ar : enUS });
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 rounded-lg" style={{ background: 'hsl(var(--cmd-bg-elevated))' }} />
        <div className="h-64 rounded-xl" style={{ background: 'hsl(var(--cmd-bg-card))' }} />
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 rounded-xl" style={{ background: 'hsl(var(--cmd-bg-card))' }} />
          ))}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <User className="h-16 w-16 mb-4" style={{ color: 'hsl(var(--cmd-text-muted))' }} />
        <h2 style={{ color: 'hsl(var(--cmd-text-primary))' }}>
          {language === 'ar' ? 'المستخدم غير موجود' : 'User not found'}
        </h2>
        <button
          onClick={() => navigate(ROUTES.ADMIN.USERS)}
          className="mt-4 px-4 py-2 rounded-lg"
          style={{ background: 'hsl(var(--cmd-accent-cyan))', color: 'white' }}
        >
          {language === 'ar' ? 'العودة للقائمة' : 'Back to List'}
        </button>
      </div>
    );
  }

  const primaryRole = user.roles?.[0]?.role || 'customer';
  const roleInfo = roleConfig[primaryRole] || roleConfig.customer;
  const RoleIcon = roleInfo.icon;
  const displayName = language === 'ar' && user.full_name_ar ? user.full_name_ar : user.full_name || user.email.split('@')[0];
  const isOnline = user.last_login_at && (new Date().getTime() - new Date(user.last_login_at).getTime()) < 5 * 60 * 1000;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <button
          onClick={() => navigate(ROUTES.ADMIN.USERS)}
          className="h-10 w-10 flex items-center justify-center rounded-xl transition-colors"
          style={{ 
            background: 'hsl(var(--cmd-bg-elevated))',
            color: 'hsl(var(--cmd-text-secondary))',
          }}
        >
          <ArrowRight className={cn("h-5 w-5", !isRTL && "rotate-180")} />
        </button>
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'hsl(var(--cmd-text-primary))' }}>
            {language === 'ar' ? 'تفاصيل المستخدم' : 'User Details'}
          </h1>
          <p className="text-sm" style={{ color: 'hsl(var(--cmd-text-muted))' }}>
            #{user.id.slice(0, 8)}
          </p>
        </div>
      </motion.div>

      {/* Main Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-xl overflow-hidden"
        style={{
          background: 'hsl(var(--cmd-bg-card))',
          border: '1px solid hsl(var(--cmd-border-subtle))',
        }}
      >
        {/* Profile Header */}
        <div 
          className="p-6 relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, hsl(${roleInfo.color} / 0.15), hsl(${roleInfo.color} / 0.05))`,
            borderBottom: '1px solid hsl(var(--cmd-border-subtle))',
          }}
        >
          <div className="flex items-start gap-6 relative z-10">
            {/* Avatar */}
            <div className="relative">
              <div 
                className="h-24 w-24 rounded-2xl flex items-center justify-center text-3xl font-bold"
                style={{
                  background: `linear-gradient(135deg, hsl(${roleInfo.color} / 0.4), hsl(${roleInfo.color} / 0.2))`,
                  color: `hsl(${roleInfo.color})`,
                  border: `2px solid hsl(${roleInfo.color} / 0.5)`,
                }}
              >
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt={displayName} className="w-full h-full rounded-2xl object-cover" />
                ) : (
                  displayName.charAt(0).toUpperCase()
                )}
              </div>
              {/* Online Status */}
              <div 
                className="absolute -bottom-1 -end-1 h-6 w-6 rounded-full border-3 flex items-center justify-center"
                style={{
                  borderColor: 'hsl(var(--cmd-bg-card))',
                  background: isOnline 
                    ? 'hsl(var(--cmd-accent-green))' 
                    : user.is_active 
                      ? 'hsl(var(--cmd-accent-amber))' 
                      : 'hsl(var(--cmd-text-dim))',
                }}
              >
                {isOnline && (
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{ background: 'hsl(var(--cmd-accent-green))' }}
                    animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  />
                )}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold" style={{ color: 'hsl(var(--cmd-text-primary))' }}>
                  {displayName}
                </h2>
                <span 
                  className="inline-flex items-center gap-1.5 text-sm px-3 py-1 rounded-lg"
                  style={{
                    background: `hsl(${roleInfo.color} / 0.2)`,
                    color: `hsl(${roleInfo.color})`,
                    border: `1px solid hsl(${roleInfo.color} / 0.4)`,
                  }}
                >
                  <RoleIcon className="h-4 w-4" />
                  {language === 'ar' ? roleInfo.labelAr : roleInfo.labelEn}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm" style={{ color: 'hsl(var(--cmd-text-muted))' }}>
                <span className="flex items-center gap-1.5">
                  <Mail className="h-4 w-4" />
                  {user.email}
                </span>
                {user.phone && (
                  <span className="flex items-center gap-1.5" dir="ltr">
                    <Phone className="h-4 w-4" />
                    {user.phone}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Globe className="h-4 w-4" />
                  {user.preferred_language === 'ar' ? 'العربية' : 'English'}
                </span>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-3 mt-4">
                <span 
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium"
                  style={{
                    background: user.is_active 
                      ? 'hsl(var(--cmd-accent-green) / 0.15)' 
                      : 'hsl(var(--cmd-text-dim) / 0.15)',
                    color: user.is_active 
                      ? 'hsl(var(--cmd-accent-green))' 
                      : 'hsl(var(--cmd-text-dim))',
                  }}
                >
                  {user.is_active ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                  {user.is_active 
                    ? (language === 'ar' ? 'نشط' : 'Active')
                    : (language === 'ar' ? 'معطل' : 'Inactive')}
                </span>
                {isOnline && (
                  <span 
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm"
                    style={{
                      background: 'hsl(var(--cmd-accent-green) / 0.15)',
                      color: 'hsl(var(--cmd-accent-green))',
                    }}
                  >
                    <Activity className="h-4 w-4" />
                    {language === 'ar' ? 'متصل الآن' : 'Online now'}
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Link
                to={`/adminash/users/${user.id}/edit`}
                className="h-10 px-4 flex items-center gap-2 rounded-xl text-sm font-medium transition-all"
                style={{
                  background: 'hsl(var(--cmd-accent-cyan))',
                  color: 'white',
                }}
              >
                <Edit className="h-4 w-4" />
                {language === 'ar' ? 'تعديل' : 'Edit'}
              </Link>
              <button
                onClick={handleToggleStatus}
                className="h-10 px-4 flex items-center gap-2 rounded-xl text-sm font-medium transition-all"
                style={{
                  background: user.is_active 
                    ? 'hsl(var(--cmd-accent-amber) / 0.15)' 
                    : 'hsl(var(--cmd-accent-green) / 0.15)',
                  color: user.is_active 
                    ? 'hsl(var(--cmd-accent-amber))' 
                    : 'hsl(var(--cmd-accent-green))',
                }}
              >
                {user.is_active ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                {user.is_active 
                  ? (language === 'ar' ? 'تعطيل' : 'Deactivate')
                  : (language === 'ar' ? 'تفعيل' : 'Activate')}
              </button>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Date Info */}
          <DetailCard
            icon={Calendar}
            title={language === 'ar' ? 'تاريخ التسجيل' : 'Registration Date'}
            value={formatDate(user.created_at)}
            color="var(--cmd-accent-cyan)"
          />
          <DetailCard
            icon={Clock}
            title={language === 'ar' ? 'آخر تحديث' : 'Last Updated'}
            value={formatDate(user.updated_at)}
            color="var(--cmd-accent-blue)"
          />
          <DetailCard
            icon={History}
            title={language === 'ar' ? 'آخر تسجيل دخول' : 'Last Login'}
            value={formatDateTime(user.last_login_at)}
            color="var(--cmd-accent-green)"
          />
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <StatCard
          icon={ShoppingCart}
          title={language === 'ar' ? 'الطلبات' : 'Orders'}
          value={stats.orders}
          color="var(--cmd-accent-cyan)"
          link={`/adminash/orders?user=${user.id}`}
        />
        <StatCard
          icon={FileText}
          title={language === 'ar' ? 'العقود' : 'Contracts'}
          value={stats.contracts}
          color="var(--cmd-accent-purple)"
          link={`/adminash/contracts?user=${user.id}`}
        />
        <StatCard
          icon={Wallet}
          title={language === 'ar' ? 'رصيد المحفظة' : 'Wallet Balance'}
          value={`${stats.walletBalance.toLocaleString()} ${language === 'ar' ? 'ر.س' : 'SAR'}`}
          color="var(--cmd-accent-green)"
          link={`/adminash/wallets?user=${user.id}`}
        />
      </motion.div>

      {/* All Roles */}
      {user.roles && user.roles.length > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl p-6"
          style={{
            background: 'hsl(var(--cmd-bg-card))',
            border: '1px solid hsl(var(--cmd-border-subtle))',
          }}
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'hsl(var(--cmd-text-primary))' }}>
            <Key className="h-5 w-5" style={{ color: 'hsl(var(--cmd-accent-purple))' }} />
            {language === 'ar' ? 'جميع الأدوار' : 'All Roles'}
          </h3>
          <div className="flex flex-wrap gap-2">
            {user.roles.map((r, index) => {
              const rInfo = roleConfig[r.role] || roleConfig.customer;
              const RIcon = rInfo.icon;
              return (
                <span
                  key={index}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm"
                  style={{
                    background: `hsl(${rInfo.color} / 0.15)`,
                    color: `hsl(${rInfo.color})`,
                    border: `1px solid hsl(${rInfo.color} / 0.3)`,
                  }}
                >
                  <RIcon className="h-4 w-4" />
                  {language === 'ar' ? rInfo.labelAr : rInfo.labelEn}
                </span>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}

// Detail Card Component
const DetailCard = ({ 
  icon: Icon, 
  title, 
  value, 
  color 
}: { 
  icon: React.ElementType; 
  title: string; 
  value: string; 
  color: string;
}) => (
  <div 
    className="flex items-start gap-3 p-4 rounded-xl"
    style={{ background: 'hsl(var(--cmd-bg-elevated))' }}
  >
    <div 
      className="p-2.5 rounded-lg"
      style={{ background: `hsl(${color} / 0.15)` }}
    >
      <Icon className="h-5 w-5" style={{ color: `hsl(${color})` }} />
    </div>
    <div>
      <p className="text-sm" style={{ color: 'hsl(var(--cmd-text-muted))' }}>{title}</p>
      <p className="font-semibold mt-0.5" style={{ color: 'hsl(var(--cmd-text-primary))' }}>{value}</p>
    </div>
  </div>
);

// Stat Card Component
const StatCard = ({ 
  icon: Icon, 
  title, 
  value, 
  color,
  link
}: { 
  icon: React.ElementType; 
  title: string; 
  value: string | number; 
  color: string;
  link?: string;
}) => {
  const Wrapper = link ? Link : 'div';
  const props = link ? { to: link } : {};
  
  return (
    <Wrapper
      {...props as any}
      className="relative rounded-xl p-5 transition-all hover:scale-[1.02]"
      style={{
        background: 'hsl(var(--cmd-bg-card))',
        border: '1px solid hsl(var(--cmd-border-subtle))',
      }}
    >
      <div 
        className="absolute inset-0 opacity-10 rounded-xl"
        style={{
          background: `radial-gradient(circle at 30% 30%, hsl(${color}) 0%, transparent 70%)`,
        }}
      />
      <div className="relative z-10">
        <div 
          className="p-3 rounded-xl w-fit mb-3"
          style={{ background: `hsl(${color} / 0.15)` }}
        >
          <Icon className="h-6 w-6" style={{ color: `hsl(${color})` }} />
        </div>
        <p className="text-sm" style={{ color: 'hsl(var(--cmd-text-muted))' }}>{title}</p>
        <p className="text-2xl font-bold font-mono mt-1" style={{ color: 'hsl(var(--cmd-text-primary))' }}>
          {value}
        </p>
      </div>
    </Wrapper>
  );
};
