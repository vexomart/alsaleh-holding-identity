/**
 * SendSmsDialog Component
 * Admin dialog to send SMS messages to customers
 */

import { useState } from 'react';
import { 
  Send, 
  MessageSquare,
  Loader2,
  Phone,
  User,
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
import { useSmsNotifications } from '@/hooks/useSmsNotifications';
import { toast } from 'sonner';

interface SendSmsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  language?: 'ar' | 'en';
  defaultPhone?: string;
  defaultName?: string;
}

const messageTemplates = [
  { value: 'custom', labelAr: 'رسالة مخصصة', labelEn: 'Custom Message' },
  { value: 'order_status', labelAr: 'تحديث حالة الطلب', labelEn: 'Order Status Update' },
  { value: 'payment_reminder', labelAr: 'تذكير بالدفع', labelEn: 'Payment Reminder' },
  { value: 'account_update', labelAr: 'تحديث الحساب', labelEn: 'Account Update' },
  { value: 'welcome', labelAr: 'رسالة ترحيب', labelEn: 'Welcome Message' },
];

export function SendSmsDialog({ 
  open, 
  onOpenChange, 
  language = 'ar',
  defaultPhone = '',
  defaultName = '',
}: SendSmsDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [phone, setPhone] = useState(defaultPhone);
  const [customerName, setCustomerName] = useState(defaultName);
  const [templateType, setTemplateType] = useState('custom');
  const [customMessage, setCustomMessage] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  
  const { sendCustomSms, notifyOrderStatus, notifyAccountUpdate } = useSmsNotifications();

  const handleSend = async () => {
    if (!phone) {
      toast.error(language === 'ar' ? 'الرجاء إدخال رقم الهاتف' : 'Please enter phone number');
      return;
    }

    if (templateType === 'custom' && !customMessage) {
      toast.error(language === 'ar' ? 'الرجاء إدخال نص الرسالة' : 'Please enter message text');
      return;
    }

    setIsLoading(true);
    try {
      let result;
      
      switch (templateType) {
        case 'custom':
          result = await sendCustomSms(phone, customMessage);
          break;
        case 'order_status':
          result = await notifyOrderStatus(phone, orderNumber || 'N/A', 'تحديث من الإدارة');
          break;
        case 'account_update':
          result = await notifyAccountUpdate(phone);
          break;
        case 'welcome':
          result = await sendCustomSms(phone, `مرحباً ${customerName || 'بك'} في آش القابضة! نسعد بخدمتك.`);
          break;
        case 'payment_reminder':
          result = await sendCustomSms(phone, `تذكير: لديك مستحقات مالية. للاستفسار تواصل معنا.`);
          break;
        default:
          result = await sendCustomSms(phone, customMessage);
      }

      if (result.success) {
        toast.success(language === 'ar' ? 'تم إرسال الرسالة بنجاح' : 'SMS sent successfully');
        onOpenChange(false);
        resetForm();
      } else {
        toast.error(result.error || (language === 'ar' ? 'فشل إرسال الرسالة' : 'Failed to send SMS'));
      }
    } catch (error: any) {
      console.error('SMS send error:', error);
      toast.error(error.message || (language === 'ar' ? 'حدث خطأ أثناء الإرسال' : 'Error sending SMS'));
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setPhone(defaultPhone);
    setCustomerName(defaultName);
    setTemplateType('custom');
    setCustomMessage('');
    setOrderNumber('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            {language === 'ar' ? 'إرسال رسالة نصية' : 'Send SMS'}
          </DialogTitle>
          <DialogDescription>
            {language === 'ar' 
              ? 'أرسل رسالة نصية SMS للعميل' 
              : 'Send an SMS message to the customer'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Customer Name */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <User className="h-4 w-4" />
              {language === 'ar' ? 'اسم العميل (اختياري)' : 'Customer Name (Optional)'}
            </Label>
            <Input
              placeholder={language === 'ar' ? 'اسم العميل...' : 'Customer name...'}
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              dir={language === 'ar' ? 'rtl' : 'ltr'}
            />
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              {language === 'ar' ? 'رقم الهاتف' : 'Phone Number'} *
            </Label>
            <Input
              placeholder="966XXXXXXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              type="tel"
              dir="ltr"
              className="text-left"
            />
          </div>

          {/* Template Type */}
          <div className="space-y-2">
            <Label>{language === 'ar' ? 'نوع الرسالة' : 'Message Type'}</Label>
            <Select value={templateType} onValueChange={setTemplateType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {messageTemplates.map((template) => (
                  <SelectItem key={template.value} value={template.value}>
                    {language === 'ar' ? template.labelAr : template.labelEn}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Order Number (for order_status) */}
          {templateType === 'order_status' && (
            <div className="space-y-2">
              <Label>{language === 'ar' ? 'رقم الطلب' : 'Order Number'}</Label>
              <Input
                placeholder={language === 'ar' ? 'أدخل رقم الطلب...' : 'Enter order number...'}
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                dir="ltr"
              />
            </div>
          )}

          {/* Custom Message */}
          {templateType === 'custom' && (
            <div className="space-y-2">
              <Label>{language === 'ar' ? 'نص الرسالة' : 'Message Text'} *</Label>
              <Textarea
                placeholder={language === 'ar' ? 'اكتب رسالتك هنا...' : 'Write your message here...'}
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                rows={4}
                dir={language === 'ar' ? 'rtl' : 'ltr'}
                maxLength={160}
              />
              <p className="text-xs text-muted-foreground">
                {customMessage.length}/160 {language === 'ar' ? 'حرف' : 'characters'}
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {language === 'ar' ? 'إلغاء' : 'Cancel'}
          </Button>
          <Button 
            onClick={handleSend} 
            disabled={isLoading || !phone}
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
