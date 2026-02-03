import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useSecureForm } from '@/components/SecurityProvider';
import { toast } from 'sonner';
import { Mail, Phone, User, MessageSquare, Send, CheckCircle, AlertCircle } from 'lucide-react';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

interface ContactFormSecureProps {
  onSuccess?: () => void;
  className?: string;
}

export const ContactFormSecure: React.FC<ContactFormSecureProps> = ({ 
  onSuccess, 
  className = '' 
}) => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const { validateFormData } = useSecureForm();

  const handleChange = (field: keyof ContactFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // إزالة رسالة الخطأ عند بدء الكتابة
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateRequired = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'الاسم مطلوب';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'الاسم يجب أن يكون حرفين على الأقل';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'البريد الإلكتروني مطلوب';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'رقم الهاتف مطلوب';
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'الموضوع مطلوب';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'الرسالة مطلوبة';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'الرسالة يجب أن تكون 10 أحرف على الأقل';
    }
    
    return newErrors;
  };

  const submitToBackend = async (sanitizedData: ContactFormData) => {
    const submitData = {
      ...sanitizedData,
      timestamp: new Date().toISOString(),
      source: 'website_contact_form_secure',
      userAgent: navigator.userAgent,
      referrer: document.referrer,
      language: 'ar'
    };

    try {
      // استخدام Edge Function لإرسال البريد
      const { supabase } = await import('@/integrations/supabase/client');
      
      const { data, error } = await supabase.functions.invoke('contact-form', {
        body: {
          name: sanitizedData.name,
          email: sanitizedData.email,
          phone: sanitizedData.phone,
          subject: sanitizedData.subject,
          message: sanitizedData.message,
          source: 'secure-contact-form'
        }
      });

      if (error) throw error;

      return { success: true, method: 'edge_function', data };
    } catch (error) {
      console.warn('Edge function submission failed, using mailto fallback');
      
      // Fallback: إرسال بريد إلكتروني مباشر
      const emailBody = `
الاسم: ${sanitizedData.name}
البريد الإلكتروني: ${sanitizedData.email}
رقم الهاتف: ${sanitizedData.phone}
الموضوع: ${sanitizedData.subject}

الرسالة:
${sanitizedData.message}

---
تم الإرسال من: ${window.location.href}
التاريخ: ${new Date().toLocaleString('ar-SA')}
      `.trim();

      const mailtoLink = `mailto:info@ash-holding.sa?subject=${encodeURIComponent(sanitizedData.subject)}&body=${encodeURIComponent(emailBody)}`;
      
      return { success: true, method: 'mailto', link: mailtoLink };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setErrors({});

    try {
      // التحقق من الحقول المطلوبة
      const requiredErrors = validateRequired();
      if (Object.keys(requiredErrors).length > 0) {
        setErrors(requiredErrors);
        toast.error('يرجى تعبئة جميع الحقول المطلوبة');
        return;
      }

      // التحقق الأمني وتنظيف البيانات
      const validation = validateFormData(formData);
      
      if (!validation.isValid) {
        setErrors(validation.errors);
        toast.error('يرجى تصحيح الأخطاء في النموذج');
        return;
      }

      // إرسال البيانات
      const result = await submitToBackend(validation.sanitizedData as ContactFormData);
      
      if (result.success) {
        setIsSuccess(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
        
        if (result.method === 'mailto' && 'link' in result) {
          toast.success('تم تحضير الرسالة. سيتم فتح برنامج البريد الإلكتروني...', {
            duration: 5000,
            action: {
              label: 'إرسال',
              onClick: () => {
                if ('link' in result && result.link) {
                  window.location.href = result.link;
                }
              }
            }
          });
          
          // فتح mailto بعد ثانيتين
          setTimeout(() => {
            if ('link' in result && result.link) {
              window.location.href = result.link;
            }
          }, 2000);
        } else {
          toast.success('تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.');
        }
        
        onSuccess?.();
      } else {
        throw new Error('فشل في إرسال الرسالة');
      }
      
    } catch (error: any) {
      console.error('Contact form error:', error);
      toast.error(error.message || 'حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className={`${className} text-center py-8`}>
        <div className="max-w-md mx-auto">
          <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
          <h3 className="text-xl font-bold text-success mb-2">تم إرسال رسالتك بنجاح!</h3>
          <p className="text-muted-foreground mb-4">
            شكراً لتواصلك معنا. سنقوم بالرد عليك في أقرب وقت ممكن.
          </p>
          <Button 
            onClick={() => setIsSuccess(false)}
            variant="outline"
          >
            إرسال رسالة أخرى
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`${className} space-y-6`} noValidate>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* الاسم */}
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium flex items-center gap-2">
            <User className="w-4 h-4" />
            الاسم الكامل <span className="text-destructive">*</span>
          </label>
          <Input
            id="name"
            type="text"
            value={formData.name}
            onChange={handleChange('name')}
            placeholder="أدخل اسمك الكامل"
            className={errors.name ? 'border-destructive' : ''}
            maxLength={100}
            required
          />
          {errors.name && (
            <p className="text-sm text-destructive flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.name}
            </p>
          )}
        </div>

        {/* البريد الإلكتروني */}
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
            <Mail className="w-4 h-4" />
            البريد الإلكتروني <span className="text-destructive">*</span>
          </label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={handleChange('email')}
            placeholder="example@domain.com"
            className={errors.email ? 'border-destructive' : ''}
            maxLength={255}
            required
          />
          {errors.email && (
            <p className="text-sm text-destructive flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.email}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* رقم الهاتف */}
        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm font-medium flex items-center gap-2">
            <Phone className="w-4 h-4" />
            رقم الهاتف <span className="text-destructive">*</span>
          </label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange('phone')}
            placeholder="05xxxxxxxx"
            className={errors.phone ? 'border-destructive' : ''}
            maxLength={20}
            required
          />
          {errors.phone && (
            <p className="text-sm text-destructive flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.phone}
            </p>
          )}
        </div>

        {/* الموضوع */}
        <div className="space-y-2">
          <label htmlFor="subject" className="text-sm font-medium flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            الموضوع <span className="text-destructive">*</span>
          </label>
          <Input
            id="subject"
            type="text"
            value={formData.subject}
            onChange={handleChange('subject')}
            placeholder="موضوع الرسالة"
            className={errors.subject ? 'border-destructive' : ''}
            maxLength={200}
            required
          />
          {errors.subject && (
            <p className="text-sm text-destructive flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.subject}
            </p>
          )}
        </div>
      </div>

      {/* الرسالة */}
      <div className="space-y-2">
        <label htmlFor="message" className="text-sm font-medium flex items-center gap-2">
          <MessageSquare className="w-4 h-4" />
          الرسالة <span className="text-destructive">*</span>
        </label>
        <Textarea
          id="message"
          value={formData.message}
          onChange={handleChange('message')}
          placeholder="اكتب رسالتك هنا..."
          className={`min-h-32 ${errors.message ? 'border-destructive' : ''}`}
          maxLength={2000}
          required
        />
        <div className="flex justify-between items-center">
          {errors.message ? (
            <p className="text-sm text-destructive flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.message}
            </p>
          ) : (
            <span className="text-sm text-muted-foreground">
              {formData.message.length}/2000 حرف
            </span>
          )}
        </div>
      </div>

      {/* زر الإرسال */}
      <Button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full md:w-auto"
        size="lg"
      >
        {isSubmitting ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            جارٍ الإرسال...
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Send className="w-4 h-4" />
            إرسال الرسالة
          </div>
        )}
      </Button>

      {/* معلومات التواصل */}
      <div className="border-t pt-6 mt-8">
        <h4 className="font-medium mb-4">طرق التواصل البديلة:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            <a href="mailto:info@ash-holding.sa" className="hover:text-primary">
              info@ash-holding.sa
            </a>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            <a href="tel:+966555812567" className="hover:text-primary">
              0555812567
            </a>
          </div>
        </div>
      </div>
    </form>
  );
};