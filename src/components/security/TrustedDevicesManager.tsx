/**
 * Enhanced Trusted Devices Manager Component
 * With real-time updates and device verification
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTrustedDevices, TrustedDevice } from '@/hooks/useTrustedDevices';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
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
  ShieldAlert,
  Clock,
  MapPin,
  Loader2,
  CheckCircle2,
  Wifi,
  WifiOff,
  RefreshCw,
  MoreVertical,
  Eye,
  Ban
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { formatDistanceToNow, format } from 'date-fns';
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

const getDeviceTypeLabel = (type: string | null) => {
  switch (type) {
    case 'mobile':
      return 'هاتف';
    case 'tablet':
      return 'جهاز لوحي';
    default:
      return 'حاسوب';
  }
};

interface DeviceCardProps {
  device: TrustedDevice;
  isCurrent: boolean;
  onRemove: () => void;
  onTrust: () => void;
  index: number;
}

const DeviceCard = ({ device, isCurrent, onRemove, onTrust, index }: DeviceCardProps) => {
  const DeviceIcon = getDeviceIcon(device.device_type);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ delay: index * 0.05 }}
      className={cn(
        "relative p-4 rounded-xl border transition-all duration-300",
        isCurrent 
          ? "bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/30 shadow-lg shadow-primary/10" 
          : "bg-card border-border hover:border-primary/20 hover:shadow-md"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Current Device Badge */}
      {isCurrent && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2"
        >
          <Badge className="bg-primary text-primary-foreground shadow-lg">
            <Wifi className="h-3 w-3 ml-1" />
            هذا الجهاز
          </Badge>
        </motion.div>
      )}

      <div className="flex items-start gap-4">
        {/* Device Icon */}
        <motion.div 
          className={cn(
            "p-3 rounded-xl transition-all duration-300",
            device.is_trusted 
              ? "bg-gradient-to-br from-green-500/20 to-emerald-500/10" 
              : "bg-muted"
          )}
          animate={{ scale: isHovered ? 1.05 : 1 }}
        >
          <DeviceIcon className={cn(
            "h-7 w-7 transition-colors",
            device.is_trusted ? "text-green-500" : "text-muted-foreground"
          )} />
        </motion.div>

        {/* Device Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold truncate text-foreground">
              {device.device_name || 'جهاز غير معروف'}
            </h4>
            {device.is_trusted ? (
              <ShieldCheck className="h-4 w-4 text-green-500 flex-shrink-0" />
            ) : (
              <ShieldAlert className="h-4 w-4 text-yellow-500 flex-shrink-0" />
            )}
          </div>

          <div className="space-y-1.5 text-sm text-muted-foreground">
            {/* Browser & OS */}
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="secondary" className="text-xs font-normal">
                {getDeviceTypeLabel(device.device_type)}
              </Badge>
              <span className="text-xs">{device.browser} • {device.os}</span>
            </div>
            
            {/* Location */}
            {device.location && (
              <div className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                <span className="text-xs">{device.location}</span>
              </div>
            )}
            
            {/* Last Activity */}
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              <span className="text-xs">
                آخر نشاط: {formatDistanceToNow(new Date(device.last_used_at), { 
                  addSuffix: true, 
                  locale: ar 
                })}
              </span>
            </div>

            {/* Verified Date */}
            {device.verified_at && (
              <div className="flex items-center gap-1.5 text-green-600">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span className="text-xs">
                  تم التوثيق: {format(new Date(device.verified_at), 'yyyy/MM/dd')}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {!device.is_trusted && !isCurrent && (
            <Button
              variant="outline"
              size="sm"
              onClick={onTrust}
              className="text-green-600 border-green-500/30 hover:bg-green-500/10 hover:border-green-500/50"
            >
              <Shield className="h-4 w-4 ml-1" />
              وثّق
            </Button>
          )}
          
          {!isCurrent && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onRemove} className="text-destructive">
                  <Trash2 className="h-4 w-4 ml-2" />
                  إزالة الجهاز
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export const TrustedDevicesManager = () => {
  const { devices, isLoading, currentDeviceId, removeDevice, trustDevice, fetchDevices } = useTrustedDevices();
  const [deviceToRemove, setDeviceToRemove] = useState<TrustedDevice | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRemove = async () => {
    if (deviceToRemove) {
      await removeDevice(deviceToRemove.id);
      setDeviceToRemove(null);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchDevices();
    setIsRefreshing(false);
  };

  const trustedCount = devices.filter(d => d.is_trusted).length;
  const currentDevice = devices.find(d => d.id === currentDeviceId);

  return (
    <>
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-br from-primary/5 to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>الأجهزة الموثوقة</CardTitle>
                <CardDescription>
                  إدارة الأجهزة المسموح لها بالوصول إلى حسابك
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw className={cn("h-4 w-4 ml-1", isRefreshing && "animate-spin")} />
                تحديث
              </Button>
              <Badge variant="secondary" className="text-base px-3 py-1.5 font-bold">
                <ShieldCheck className="h-4 w-4 ml-1 text-green-500" />
                {trustedCount} / {devices.length}
              </Badge>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">جاري تحميل الأجهزة...</p>
            </div>
          ) : devices.length === 0 ? (
            <div className="text-center py-12">
              <div className="p-4 rounded-full bg-muted/50 w-fit mx-auto mb-4">
                <Monitor className="h-12 w-12 text-muted-foreground/50" />
              </div>
              <p className="text-muted-foreground font-medium">لم يتم تسجيل أي جهاز بعد</p>
              <p className="text-sm text-muted-foreground/70 mt-1">
                ستظهر الأجهزة هنا عند تسجيل الدخول
              </p>
            </div>
          ) : (
            <ScrollArea className="h-[450px] pl-2">
              <div className="space-y-3 pr-2">
                {/* Current Device First */}
                {currentDevice && (
                  <DeviceCard
                    device={currentDevice}
                    isCurrent={true}
                    onRemove={() => {}}
                    onTrust={() => trustDevice(currentDevice.id)}
                    index={0}
                  />
                )}
                
                {/* Other Devices */}
                <AnimatePresence mode="popLayout">
                  {devices
                    .filter(d => d.id !== currentDeviceId)
                    .map((device, index) => (
                      <DeviceCard
                        key={device.id}
                        device={device}
                        isCurrent={false}
                        onRemove={() => setDeviceToRemove(device)}
                        onTrust={() => trustDevice(device.id)}
                        index={index + 1}
                      />
                    ))}
                </AnimatePresence>
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* Remove Device Dialog */}
      <AlertDialog open={!!deviceToRemove} onOpenChange={() => setDeviceToRemove(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Ban className="h-5 w-5 text-destructive" />
              إزالة الجهاز
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>هل أنت متأكد من إزالة هذا الجهاز؟</p>
              {deviceToRemove && (
                <div className="p-3 rounded-lg bg-muted mt-2">
                  <p className="font-medium">{deviceToRemove.device_name}</p>
                  <p className="text-sm text-muted-foreground">
                    {deviceToRemove.browser} • {deviceToRemove.os}
                  </p>
                </div>
              )}
              <p className="text-sm text-yellow-600 mt-2">
                سيتطلب تسجيل الدخول من هذا الجهاز التحقق مرة أخرى.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemove}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              <Trash2 className="h-4 w-4 ml-2" />
              إزالة
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
