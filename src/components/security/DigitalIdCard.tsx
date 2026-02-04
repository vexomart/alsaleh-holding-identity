/**
 * Digital Identity Card Component
 * Premium design with QR code and verification badge
 */

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Shield, 
  CheckCircle2, 
  QrCode, 
  Copy, 
  RefreshCw,
  Fingerprint,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface DigitalIdCardProps {
  className?: string;
  showQR?: boolean;
  compact?: boolean;
}

export const DigitalIdCard = ({ 
  className, 
  showQR = true,
  compact = false 
}: DigitalIdCardProps) => {
  const { user, profile } = useAuth();
  const [isFlipped, setIsFlipped] = useState(false);

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

  const copyClientId = () => {
    navigator.clipboard.writeText(clientId);
    toast.success('تم نسخ رقم العميل');
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'N/A';
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(new Date(dateStr));
  };

  if (compact) {
    return (
      <Card className={cn(
        "relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-primary/5 border-primary/20",
        className
      )}>
        <div className="p-4 flex items-center gap-4">
          <Avatar className="h-12 w-12 border-2 border-primary/30">
            <AvatarImage src={profile?.avatar_url || ''} />
            <AvatarFallback className="bg-primary/20 text-primary font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-bold truncate">{profile?.full_name || user?.email}</p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="font-mono">{clientId}</span>
              {isVerified && (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              )}
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className={cn("perspective-1000", className)}>
      <motion.div
        className="relative w-full max-w-md mx-auto cursor-pointer preserve-3d"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* Front Side */}
        <Card 
          className={cn(
            "relative overflow-hidden backface-hidden",
            "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900",
            "border-2 border-primary/30 shadow-2xl",
            "aspect-[1.6/1] p-6"
          )}
          style={{ backfaceVisibility: 'hidden' }}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-32 h-32 bg-primary/30 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
          </div>

          {/* Header */}
          <div className="relative flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <span className="text-white font-bold text-lg">ASH ID</span>
            </div>
            {isVerified && (
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                <CheckCircle2 className="h-3 w-3 ml-1" />
                موثق
              </Badge>
            )}
          </div>

          {/* Main Content */}
          <div className="relative flex items-center gap-4">
            <Avatar className="h-20 w-20 border-2 border-primary/50 shadow-xl">
              <AvatarImage src={profile?.avatar_url || ''} />
              <AvatarFallback className="bg-primary/30 text-white text-xl font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 text-white">
              <h3 className="text-xl font-bold mb-1">
                {profile?.full_name || user?.email?.split('@')[0]}
              </h3>
              <div className="flex items-center gap-2 mb-2">
                <Fingerprint className="h-4 w-4 text-primary" />
                <span className="font-mono text-sm text-primary">{clientId}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-white/60 hover:text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    copyClientId();
                  }}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
              <p className="text-xs text-white/60">{user?.email}</p>
            </div>
          </div>

          {/* Footer */}
          <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-xs text-white/40">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>عضو منذ: {formatDate(user?.created_at || null)}</span>
            </div>
            <div className="flex items-center gap-1">
              <RefreshCw className="h-3 w-3" />
              <span>اضغط للتقليب</span>
            </div>
          </div>

          {/* Holographic Effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
        </Card>

        {/* Back Side */}
        <Card 
          className={cn(
            "absolute inset-0 overflow-hidden backface-hidden",
            "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900",
            "border-2 border-primary/30 shadow-2xl",
            "aspect-[1.6/1] p-6",
            "rotate-y-180"
          )}
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/30 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
          </div>

          <div className="relative h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-white font-bold">معلومات إضافية</h4>
              {showQR && (
                <div className="bg-white p-2 rounded-lg">
                  <QrCode className="h-16 w-16 text-slate-900" />
                </div>
              )}
            </div>

            <div className="flex-1 grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-white/40 text-xs">البريد الإلكتروني</p>
                <p className="text-white truncate">{user?.email}</p>
              </div>
              <div>
                <p className="text-white/40 text-xs">الهاتف</p>
                <p className="text-white">{profile?.phone || 'غير محدد'}</p>
              </div>
              <div>
                <p className="text-white/40 text-xs">حالة التحقق</p>
                <p className={cn(
                  "font-medium",
                  isVerified ? "text-green-400" : "text-yellow-400"
                )}>
                  {isVerified ? 'موثق' : 'غير موثق'}
                </p>
              </div>
              <div>
                <p className="text-white/40 text-xs">الهوية الوطنية</p>
                <p className="text-white">
                  {profile?.national_id ? '****' + profile.national_id.slice(-4) : 'غير متوفر'}
                </p>
              </div>
            </div>

            <div className="mt-auto pt-4 border-t border-white/10">
              <p className="text-xs text-white/40 text-center">
                امسح رمز QR للتحقق من الهوية
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};
