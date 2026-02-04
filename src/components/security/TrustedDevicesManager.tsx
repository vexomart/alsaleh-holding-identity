/**
 * Trusted Devices Manager Component
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTrustedDevices, TrustedDevice } from '@/hooks/useTrustedDevices';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Smartphone,
  Monitor,
  Tablet,
  Trash2,
  Shield,
  ShieldCheck,
  Clock,
  MapPin,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';

const getDeviceIcon = (type: string | null) => {
  switch (type) {
    case 'mobile':
      return Smartphone;
    case 'tablet':
      return Tablet;
    default:
      return Monitor;
  }
};

interface DeviceCardProps {
  device: TrustedDevice;
  isCurrent: boolean;
  onRemove: () => void;
  onTrust: () => void;
}

const DeviceCard = ({ device, isCurrent, onRemove, onTrust }: DeviceCardProps) => {
  const DeviceIcon = getDeviceIcon(device.device_type);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={cn(
        "relative p-4 rounded-xl border transition-all",
        isCurrent 
          ? "bg-primary/5 border-primary/30" 
          : "bg-card border-border hover:border-primary/20"
      )}
    >
      {isCurrent && (
        <Badge className="absolute top-2 left-2 bg-primary/20 text-primary">
          هذا الجهاز
        </Badge>
      )}

      <div className="flex items-start gap-4">
        <div className={cn(
          "p-3 rounded-xl",
          device.is_trusted ? "bg-green-500/10" : "bg-muted"
        )}>
          <DeviceIcon className={cn(
            "h-6 w-6",
            device.is_trusted ? "text-green-500" : "text-muted-foreground"
          )} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold truncate">
              {device.device_name || 'جهاز غير معروف'}
            </h4>
            {device.is_trusted && (
              <ShieldCheck className="h-4 w-4 text-green-500" />
            )}
          </div>

          <div className="space-y-1 text-sm text-muted-foreground">
            <div className="flex items-center gap-4 flex-wrap">
              <span>{device.browser} • {device.os}</span>
            </div>
            {device.location && (
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span>{device.location}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>
                آخر نشاط: {formatDistanceToNow(new Date(device.last_used_at), { 
                  addSuffix: true, 
                  locale: ar 
                })}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!device.is_trusted && (
            <Button
              variant="outline"
              size="sm"
              onClick={onTrust}
              className="text-green-600 border-green-600/30 hover:bg-green-500/10"
            >
              <Shield className="h-4 w-4 ml-1" />
              وثّق
            </Button>
          )}
          {!isCurrent && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onRemove}
              className="text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export const TrustedDevicesManager = () => {
  const { devices, isLoading, currentDeviceId, removeDevice, trustDevice } = useTrustedDevices();
  const [deviceToRemove, setDeviceToRemove] = useState<TrustedDevice | null>(null);

  const handleRemove = async () => {
    if (deviceToRemove) {
      await removeDevice(deviceToRemove.id);
      setDeviceToRemove(null);
    }
  };

  const trustedCount = devices.filter(d => d.is_trusted).length;

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                الأجهزة الموثوقة
              </CardTitle>
              <CardDescription>
                إدارة الأجهزة المسموح لها بالوصول إلى حسابك
              </CardDescription>
            </div>
            <Badge variant="secondary" className="text-lg px-3 py-1">
              {trustedCount} / {devices.length}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : devices.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Monitor className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>لم يتم تسجيل أي جهاز بعد</p>
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {devices.map((device) => (
                  <DeviceCard
                    key={device.id}
                    device={device}
                    isCurrent={device.id === currentDeviceId}
                    onRemove={() => setDeviceToRemove(device)}
                    onTrust={() => trustDevice(device.id)}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!deviceToRemove} onOpenChange={() => setDeviceToRemove(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>إزالة الجهاز</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من إزالة "{deviceToRemove?.device_name}"؟ 
              سيتطلب تسجيل الدخول من هذا الجهاز التحقق مرة أخرى.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemove}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              إزالة
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
