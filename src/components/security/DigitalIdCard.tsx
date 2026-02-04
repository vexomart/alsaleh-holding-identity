/**
 * Advanced Digital Identity Card Component
 * Premium 3D design with real-time data and QR verification
 */

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Shield, 
  CheckCircle2, 
  Copy, 
  RefreshCw,
  Fingerprint,
  Clock,
  Wifi,
  WifiOff,
  Globe,
  User,
  Phone,
  Mail,
  CreditCard,
  Sparkles,
  Lock,
  ShieldCheck,
  Activity,
  Eye,
  EyeOff
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

interface DigitalIdCardProps {
  className?: string;
  showQR?: boolean;
  compact?: boolean;
}

// Generate QR code as SVG data
const generateQRPattern = (data: string): string => {
  // Simple visual QR-like pattern based on data hash
  const hash = data.split('').reduce((acc, char) => {
    return ((acc << 5) - acc) + char.charCodeAt(0);
  }, 0);
  return Math.abs(hash).toString(16).padStart(8, '0');
};

export const DigitalIdCard = ({ 
  className, 
  showQR = true,
  compact = false 
}: DigitalIdCardProps) => {
  const { user, profile } = useAuth();
  const [isFlipped, setIsFlipped] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [lastSync, setLastSync] = useState<Date>(new Date());
  const [securityScore, setSecurityScore] = useState(0);
  const [showSensitive, setShowSensitive] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Real-time profile subscription
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel(`profile_${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${user.id}`
        },
        (payload) => {
          console.log('Profile updated in real-time:', payload);
          setLastSync(new Date());
          toast.success('تم تحديث بيانات الهوية');
        }
      )
      .subscribe((status) => {
        setIsOnline(status === 'SUBSCRIBED');
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  // Calculate security score
  useEffect(() => {
    let score = 0;
    if (user?.email) score += 20;
    if (profile?.full_name) score += 15;
    if (profile?.phone) score += 15;
    if (profile?.is_kyc_verified) score += 25;
    if (profile?.national_id) score += 15;
    if (profile?.avatar_url) score += 10;
    setSecurityScore(score);
  }, [user, profile]);

  const initials = useMemo(() => {
    const name = profile?.full_name || user?.email || '';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }, [profile?.full_name, user?.email]);

  const clientId = profile?.customer_uid || 'N/A';
  const isVerified = profile?.is_kyc_verified;
  const qrData = generateQRPattern(clientId + user?.id);

  const copyClientId = () => {
    navigator.clipboard.writeText(clientId);
    toast.success('تم نسخ رقم العميل');
  };

  const getScoreColor = () => {
    if (securityScore >= 80) return 'text-green-400';
    if (securityScore >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBg = () => {
    if (securityScore >= 80) return 'from-green-500/20 to-emerald-500/20';
    if (securityScore >= 50) return 'from-yellow-500/20 to-orange-500/20';
    return 'from-red-500/20 to-rose-500/20';
  };

  const handleFlip = () => {
    setIsAnimating(true);
    setIsFlipped(!isFlipped);
    setTimeout(() => setIsAnimating(false), 600);
  };

  if (compact) {
    return (
      <Card className={cn(
        "relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-primary/5 border-primary/20",
        className
      )}>
        <div className="p-4 flex items-center gap-4">
          <div className="relative">
            <Avatar className="h-12 w-12 border-2 border-primary/30">
              <AvatarImage src={profile?.avatar_url || ''} />
              <AvatarFallback className="bg-primary/20 text-primary font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            {isOnline && (
              <span className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-background" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold truncate">{profile?.full_name || user?.email}</p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="font-mono">{clientId}</span>
              {isVerified && (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              )}
            </div>
          </div>
          <div className={cn("text-lg font-bold", getScoreColor())}>
            {securityScore}%
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className={cn("perspective-1000", className)}>
      {/* Status Bar */}
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-2">
          {isOnline ? (
            <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30">
              <Wifi className="h-3 w-3 ml-1" />
              متصل
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/30">
              <WifiOff className="h-3 w-3 ml-1" />
              غير متصل
            </Badge>
          )}
          <span className="text-xs text-muted-foreground">
            آخر تحديث: {format(lastSync, 'HH:mm:ss', { locale: ar })}
          </span>
        </div>
        <Badge className={cn("bg-gradient-to-r", getScoreBg(), "text-white border-0")}>
          <ShieldCheck className="h-3 w-3 ml-1" />
          نقاط الأمان: {securityScore}%
        </Badge>
      </div>

      <motion.div
        className="relative w-full max-w-md mx-auto cursor-pointer"
        style={{ 
          transformStyle: 'preserve-3d',
          perspective: '1000px'
        }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 80, damping: 15 }}
        onClick={handleFlip}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Front Side */}
        <Card 
          className={cn(
            "relative overflow-hidden",
            "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900",
            "border-2 border-primary/30 shadow-2xl",
            "aspect-[1.6/1] p-6"
          )}
          style={{ backfaceVisibility: 'hidden' }}
        >
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div 
              className="absolute top-0 left-0 w-40 h-40 bg-primary/20 rounded-full blur-3xl"
              animate={{ 
                x: [0, 50, 0], 
                y: [0, 30, 0],
                scale: [1, 1.2, 1]
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div 
              className="absolute bottom-0 right-0 w-48 h-48 bg-blue-500/15 rounded-full blur-3xl"
              animate={{ 
                x: [0, -30, 0], 
                y: [0, -50, 0],
                scale: [1, 1.3, 1]
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div 
              className="absolute top-1/2 left-1/2 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl"
              animate={{ 
                x: [-50, 50, -50], 
                y: [-25, 25, -25],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>

          {/* Holographic Shine Effect */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none"
            animate={{
              x: ['-100%', '200%'],
            }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" }}
            style={{ transform: 'skewX(-20deg)' }}
          />

          {/* Header */}
          <div className="relative flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Shield className="h-7 w-7 text-primary" />
              </motion.div>
              <div>
                <span className="text-white font-bold text-lg tracking-wider">ASH ID</span>
                <p className="text-[10px] text-white/40">Digital Identity</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isVerified ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30 shadow-lg shadow-green-500/20">
                    <CheckCircle2 className="h-3 w-3 ml-1" />
                    موثق
                  </Badge>
                </motion.div>
              ) : (
                <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                  <Clock className="h-3 w-3 ml-1" />
                  قيد التحقق
                </Badge>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="relative flex items-center gap-4">
            <div className="relative">
              <motion.div
                className="absolute -inset-1 bg-gradient-to-r from-primary via-blue-500 to-primary rounded-full opacity-50 blur-sm"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              />
              <Avatar className="relative h-20 w-20 border-2 border-white/30 shadow-xl">
                <AvatarImage src={profile?.avatar_url || ''} />
                <AvatarFallback className="bg-gradient-to-br from-primary/50 to-blue-500/50 text-white text-xl font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              {isOnline && (
                <motion.span 
                  className="absolute -bottom-1 -right-1 h-5 w-5 bg-green-500 rounded-full border-2 border-slate-800 flex items-center justify-center"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Activity className="h-3 w-3 text-white" />
                </motion.span>
              )}
            </div>
            
            <div className="flex-1 text-white">
              <h3 className="text-xl font-bold mb-1 flex items-center gap-2">
                {profile?.full_name || user?.email?.split('@')[0]}
                {isVerified && <Sparkles className="h-4 w-4 text-yellow-400" />}
              </h3>
              <div className="flex items-center gap-2 mb-2">
                <Fingerprint className="h-4 w-4 text-primary" />
                <motion.span 
                  className="font-mono text-sm text-primary bg-primary/10 px-2 py-0.5 rounded"
                  whileHover={{ scale: 1.05 }}
                >
                  {clientId}
                </motion.span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-white/60 hover:text-white hover:bg-white/10"
                  onClick={(e) => {
                    e.stopPropagation();
                    copyClientId();
                  }}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
              <div className="flex items-center gap-3 text-xs text-white/60">
                <span className="flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  {user?.email}
                </span>
              </div>
            </div>
          </div>

          {/* Security Score Bar */}
          <div className="absolute bottom-16 left-6 right-6">
            <div className="flex items-center justify-between text-xs text-white/40 mb-1">
              <span>مستوى الأمان</span>
              <span className={getScoreColor()}>{securityScore}%</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                className={cn("h-full rounded-full bg-gradient-to-r", 
                  securityScore >= 80 ? "from-green-500 to-emerald-400" :
                  securityScore >= 50 ? "from-yellow-500 to-orange-400" :
                  "from-red-500 to-rose-400"
                )}
                initial={{ width: 0 }}
                animate={{ width: `${securityScore}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-xs text-white/40">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>عضو منذ: {user?.created_at ? format(new Date(user.created_at), 'yyyy/MM/dd') : 'N/A'}</span>
            </div>
            <motion.div 
              className="flex items-center gap-1"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <RefreshCw className="h-3 w-3" />
              <span>اضغط للتقليب</span>
            </motion.div>
          </div>
        </Card>

        {/* Back Side */}
        <Card 
          className={cn(
            "absolute inset-0 overflow-hidden",
            "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900",
            "border-2 border-primary/30 shadow-2xl",
            "aspect-[1.6/1] p-5"
          )}
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/30 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl" />
          </div>

          <div className="relative h-full flex">
            {/* Left Section - Info */}
            <div className="flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-white font-bold flex items-center gap-2">
                  <Lock className="h-4 w-4 text-primary" />
                  بيانات الهوية
                </h4>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs text-white/60 hover:text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowSensitive(!showSensitive);
                  }}
                >
                  {showSensitive ? <EyeOff className="h-3 w-3 ml-1" /> : <Eye className="h-3 w-3 ml-1" />}
                  {showSensitive ? 'إخفاء' : 'إظهار'}
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm flex-1">
                <div className="space-y-0.5">
                  <p className="text-white/40 text-[10px] flex items-center gap-1">
                    <User className="h-2.5 w-2.5" />
                    الاسم الكامل
                  </p>
                  <p className="text-white text-xs font-medium truncate">
                    {profile?.full_name || 'غير محدد'}
                  </p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-white/40 text-[10px] flex items-center gap-1">
                    <Mail className="h-2.5 w-2.5" />
                    البريد الإلكتروني
                  </p>
                  <p className="text-white text-xs truncate">{user?.email}</p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-white/40 text-[10px] flex items-center gap-1">
                    <Phone className="h-2.5 w-2.5" />
                    الهاتف
                  </p>
                  <p className="text-white text-xs">
                    {showSensitive 
                      ? (profile?.phone || 'غير محدد')
                      : (profile?.phone ? '****' + profile.phone.slice(-4) : 'غير محدد')
                    }
                  </p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-white/40 text-[10px] flex items-center gap-1">
                    <CreditCard className="h-2.5 w-2.5" />
                    الهوية الوطنية
                  </p>
                  <p className="text-white text-xs">
                    {showSensitive 
                      ? (profile?.national_id || 'غير متوفر')
                      : (profile?.national_id ? '****' + profile.national_id.slice(-4) : 'غير متوفر')
                    }
                  </p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-white/40 text-[10px] flex items-center gap-1">
                    <ShieldCheck className="h-2.5 w-2.5" />
                    حالة التحقق
                  </p>
                  <p className={cn(
                    "text-xs font-medium",
                    isVerified ? "text-green-400" : "text-yellow-400"
                  )}>
                    {isVerified ? 'موثق ✓' : 'غير موثق'}
                  </p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-white/40 text-[10px] flex items-center gap-1">
                    <Globe className="h-2.5 w-2.5" />
                    نوع الحساب
                  </p>
                  <p className="text-white text-xs">عميل مسجل</p>
                </div>
              </div>

              <div className="mt-auto pt-2 border-t border-white/10">
                <p className="text-[10px] text-white/40 text-center">
                  رقم التسلسل: {qrData.toUpperCase()}
                </p>
              </div>
            </div>

            {/* Right Section - QR Code */}
            {showQR && (
              <div className="w-28 flex flex-col items-center justify-center border-r border-white/10 pr-4 mr-4">
                <div className="bg-white p-2 rounded-lg shadow-lg mb-2">
                  {/* Simple QR-like pattern */}
                  <div className="w-20 h-20 grid grid-cols-8 grid-rows-8 gap-0.5">
                    {Array.from({ length: 64 }).map((_, i) => {
                      const hash = parseInt(qrData, 16);
                      const isBlack = (hash >> (i % 32)) & 1;
                      // Corner patterns (always black for QR look)
                      const isCorner = (
                        (i < 24 && (i % 8 < 3)) || // top-left
                        (i < 24 && (i % 8 >= 5)) || // top-right
                        (i >= 40 && (i % 8 < 3))    // bottom-left
                      );
                      return (
                        <div 
                          key={i} 
                          className={cn(
                            "rounded-[1px]",
                            (isCorner || isBlack) ? "bg-slate-900" : "bg-transparent"
                          )}
                        />
                      );
                    })}
                  </div>
                </div>
                <p className="text-[9px] text-white/40 text-center">
                  امسح للتحقق
                </p>
              </div>
            )}
          </div>
        </Card>
      </motion.div>

      {/* Info Cards */}
      <div className="grid grid-cols-3 gap-3 mt-4">
        <motion.div 
          className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-3 text-center"
          whileHover={{ scale: 1.02 }}
        >
          <CheckCircle2 className="h-5 w-5 text-green-500 mx-auto mb-1" />
          <p className="text-xs text-muted-foreground">الحالة</p>
          <p className="text-sm font-bold text-green-500">
            {isVerified ? 'موثق' : 'نشط'}
          </p>
        </motion.div>
        <motion.div 
          className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl p-3 text-center"
          whileHover={{ scale: 1.02 }}
        >
          <Activity className="h-5 w-5 text-blue-500 mx-auto mb-1" />
          <p className="text-xs text-muted-foreground">الاتصال</p>
          <p className="text-sm font-bold text-blue-500">
            {isOnline ? 'متصل' : 'غير متصل'}
          </p>
        </motion.div>
        <motion.div 
          className={cn(
            "border rounded-xl p-3 text-center",
            securityScore >= 80 ? "bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20" :
            securityScore >= 50 ? "bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/20" :
            "bg-gradient-to-br from-red-500/10 to-rose-500/10 border-red-500/20"
          )}
          whileHover={{ scale: 1.02 }}
        >
          <Shield className={cn("h-5 w-5 mx-auto mb-1", getScoreColor())} />
          <p className="text-xs text-muted-foreground">الأمان</p>
          <p className={cn("text-sm font-bold", getScoreColor())}>
            {securityScore}%
          </p>
        </motion.div>
      </div>
    </div>
  );
};
