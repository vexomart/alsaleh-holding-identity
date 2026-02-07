/**
 * SendNotificationDialog Component
 * Admin dialog to send notifications to customers
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Send, 
  Users, 
  User, 
  Info, 
  AlertTriangle, 
  AlertCircle,
  Loader2,
  MessageSquare,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import type { NotificationType, NotificationSeverity, NotificationRoleTarget } from '@/types/notifications';

interface SendNotificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSend: (data: NotificationFormData) => Promise<void>;
  language: 'ar' | 'en';
}

interface NotificationFormData {
  title: string;
  title_ar: string;
  message: string;
  message_ar: string;
  type: NotificationType;
  severity: NotificationSeverity;
  role_target: NotificationRoleTarget;
  user_id?: string;
  link?: string;
}

const notificationTypes: { value: NotificationType; labelAr: string; labelEn: string; icon: React.ElementType }[] = [
  { value: 'admin_message', labelAr: 'رسالة إدارية', labelEn: 'Admin Message', icon: MessageSquare },
  { value: 'info', labelAr: 'معلومات', labelEn: 'Information', icon: Info },
  { value: 'warning', labelAr: 'تحذير', labelEn: 'Warning', icon: AlertTriangle },
  { value: 'error', labelAr: 'خطأ', labelEn: 'Error', icon: AlertCircle },
];

const severityOptions: { value: NotificationSeverity; labelAr: string; labelEn: string; color: string }[] = [
  { value: 'info', labelAr: 'عادي', labelEn: 'Normal', color: 'text-primary' },
  { value: 'warning', labelAr: 'تحذير', labelEn: 'Warning', color: 'text-secondary' },
  { value: 'critical', labelAr: 'حرج', labelEn: 'Critical', color: 'text-destructive' },
];

export function SendNotificationDialog({ open, onOpenChange, onSend, language }: SendNotificationDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<NotificationFormData>({
    title: '',
    title_ar: '',
    message: '',
    message_ar: '',
    type: 'admin_message',
    severity: 'info',
    role_target: 'customer',
    link: '',
  });

  const handleSubmit = async () => {
    if (!formData.title && !formData.title_ar) return;
    
    setIsLoading(true);
    try {
      await onSend(formData);
      onOpenChange(false);
      setFormData({
        title: '',
        title_ar: '',
        message: '',
        message_ar: '',
        type: 'admin_message',
        severity: 'info',
        role_target: 'customer',
        link: '',
      });
    } catch (error) {
      console.error('Error sending notification:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="h-5 w-5 text-primary" />
            {language === 'ar' ? 'إرسال إشعار جديد' : 'Send New Notification'}
          </DialogTitle>
          <DialogDescription>
            {language === 'ar' 
              ? 'قم بإرسال إشعار فوري للعملاء أو المسؤولين' 
              : 'Send an instant notification to customers or admins'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Target Audience */}
          <div className="space-y-3">
            <Label>{language === 'ar' ? 'الجمهور المستهدف' : 'Target Audience'}</Label>
            <RadioGroup
              value={formData.role_target}
              onValueChange={(value) => setFormData(prev => ({ ...prev, role_target: value as NotificationRoleTarget }))}
              className="grid grid-cols-3 gap-3"
            >
              {[
                { value: 'customer', labelAr: 'العملاء', labelEn: 'Customers', icon: Users },
                { value: 'admin', labelAr: 'المسؤولين', labelEn: 'Admins', icon: User },
                { value: 'all', labelAr: 'الجميع', labelEn: 'Everyone', icon: Users },
              ].map((option) => (
                <Label
                  key={option.value}
                  className={cn(
                    "flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all",
                    formData.role_target === option.value 
                      ? "border-primary bg-primary/5" 
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <RadioGroupItem value={option.value} className="sr-only" />
                  <option.icon className={cn(
                    "h-5 w-5",
                    formData.role_target === option.value ? "text-primary" : "text-muted-foreground"
                  )} />
                  <span className={cn(
                    "font-medium",
                    formData.role_target === option.value ? "text-primary" : "text-foreground"
                  )}>
                    {language === 'ar' ? option.labelAr : option.labelEn}
                  </span>
                </Label>
              ))}
            </RadioGroup>
          </div>

          {/* Notification Type */}
          <div className="space-y-3">
            <Label>{language === 'ar' ? 'نوع الإشعار' : 'Notification Type'}</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as NotificationType }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {notificationTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center gap-2">
                      <type.icon className="h-4 w-4" />
                      {language === 'ar' ? type.labelAr : type.labelEn}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Severity */}
          <div className="space-y-3">
            <Label>{language === 'ar' ? 'مستوى الأهمية' : 'Severity Level'}</Label>
            <div className="flex gap-2">
              {severityOptions.map((option) => (
                <Button
                  key={option.value}
                  type="button"
                  variant={formData.severity === option.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFormData(prev => ({ ...prev, severity: option.value }))}
                  className={cn(
                    "flex-1",
                    formData.severity === option.value && option.value === 'warning' && "bg-secondary hover:bg-secondary/90",
                    formData.severity === option.value && option.value === 'critical' && "bg-destructive hover:bg-destructive/90"
                  )}
                >
                  {language === 'ar' ? option.labelAr : option.labelEn}
                </Button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{language === 'ar' ? 'العنوان (إنجليزي)' : 'Title (English)'}</Label>
              <Input
                placeholder="Notification title..."
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>{language === 'ar' ? 'العنوان (عربي)' : 'Title (Arabic)'}</Label>
              <Input
                placeholder="عنوان الإشعار..."
                value={formData.title_ar}
                onChange={(e) => setFormData(prev => ({ ...prev, title_ar: e.target.value }))}
                dir="rtl"
              />
            </div>
          </div>

          {/* Message */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{language === 'ar' ? 'الرسالة (إنجليزي)' : 'Message (English)'}</Label>
              <Textarea
                placeholder="Notification message..."
                value={formData.message}
                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>{language === 'ar' ? 'الرسالة (عربي)' : 'Message (Arabic)'}</Label>
              <Textarea
                placeholder="نص الإشعار..."
                value={formData.message_ar}
                onChange={(e) => setFormData(prev => ({ ...prev, message_ar: e.target.value }))}
                rows={3}
                dir="rtl"
              />
            </div>
          </div>

          {/* Link */}
          <div className="space-y-2">
            <Label>{language === 'ar' ? 'رابط (اختياري)' : 'Link (Optional)'}</Label>
            <Input
              placeholder="https://..."
              value={formData.link}
              onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
              type="url"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {language === 'ar' ? 'إلغاء' : 'Cancel'}
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isLoading || (!formData.title && !formData.title_ar)}
            className="gap-2"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            {language === 'ar' ? 'إرسال' : 'Send'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
