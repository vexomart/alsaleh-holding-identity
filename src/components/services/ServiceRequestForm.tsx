import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Send, Loader2, LogIn, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

interface ServiceOption {
  value: string;
  label: string;
}

interface ServiceRequestFormProps {
  serviceName: string;
  serviceType: string;
  colorTheme: "orange" | "blue" | "violet" | "emerald" | "pink" | "cyan" | "amber" | "rose" | "indigo" | "teal";
  serviceOptions?: ServiceOption[];
  features?: string[];
  title?: string;
}

// Zod validation schema
const formSchema = z.object({
  name: z.string()
    .min(2, "الاسم مطلوب (حرفان على الأقل)")
    .max(100, "الاسم طويل جداً"),
  email: z.string()
    .email("البريد الإلكتروني غير صحيح")
    .max(255, "البريد الإلكتروني طويل جداً"),
  phone: z.string()
    .regex(/^(05|5|9665|00966|966|\+966)\d{8}$/, "رقم الجوال غير صحيح (مثال: 05XXXXXXXX)"),
  company: z.string().max(200, "اسم الشركة طويل جداً").optional(),
  serviceOption: z.string().optional(),
  description: z.string().max(2000, "الوصف طويل جداً").optional(),
  selectedFeatures: z.array(z.string()).optional()
});

const colorThemes = {
  orange: {
    gradient: "from-orange-500 to-red-500",
    bg: "bg-orange-500",
    text: "text-orange-500",
    ring: "ring-orange-500/20",
    hover: "hover:bg-orange-600"
  },
  blue: {
    gradient: "from-blue-600 to-indigo-600",
    bg: "bg-blue-600",
    text: "text-blue-600",
    ring: "ring-blue-600/20",
    hover: "hover:bg-blue-700"
  },
  violet: {
    gradient: "from-violet-500 to-purple-600",
    bg: "bg-violet-500",
    text: "text-violet-500",
    ring: "ring-violet-500/20",
    hover: "hover:bg-violet-600"
  },
  emerald: {
    gradient: "from-emerald-500 to-teal-500",
    bg: "bg-emerald-500",
    text: "text-emerald-500",
    ring: "ring-emerald-500/20",
    hover: "hover:bg-emerald-600"
  },
  pink: {
    gradient: "from-pink-500 to-rose-500",
    bg: "bg-pink-500",
    text: "text-pink-500",
    ring: "ring-pink-500/20",
    hover: "hover:bg-pink-600"
  },
  cyan: {
    gradient: "from-cyan-500 to-blue-500",
    bg: "bg-cyan-500",
    text: "text-cyan-500",
    ring: "ring-cyan-500/20",
    hover: "hover:bg-cyan-600"
  },
  amber: {
    gradient: "from-amber-500 to-orange-500",
    bg: "bg-amber-500",
    text: "text-amber-500",
    ring: "ring-amber-500/20",
    hover: "hover:bg-amber-600"
  },
  rose: {
    gradient: "from-rose-500 to-pink-600",
    bg: "bg-rose-500",
    text: "text-rose-500",
    ring: "ring-rose-500/20",
    hover: "hover:bg-rose-600"
  },
  indigo: {
    gradient: "from-indigo-500 to-purple-500",
    bg: "bg-indigo-500",
    text: "text-indigo-500",
    ring: "ring-indigo-500/20",
    hover: "hover:bg-indigo-600"
  },
  teal: {
    gradient: "from-teal-500 to-cyan-500",
    bg: "bg-teal-500",
    text: "text-teal-500",
    ring: "ring-teal-500/20",
    hover: "hover:bg-teal-600"
  }
};

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

const ServiceRequestForm = ({
  serviceName,
  serviceType,
  colorTheme,
  serviceOptions = [],
  features = [],
  title = "اطلب الخدمة الآن"
}: ServiceRequestFormProps) => {
  const { toast } = useToast();
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');
  const [referenceNumber, setReferenceNumber] = useState<string>('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [retryCount, setRetryCount] = useState(0);
  const submitTimeRef = useRef<number>(0);
  const theme = colorThemes[colorTheme];
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    serviceOption: "",
    description: "",
    selectedFeatures: [] as string[],
    // Honeypot field - hidden from users, filled by bots
    website: ""
  });

  // Validate single field
  const validateField = useCallback((field: string, value: string) => {
    try {
      const fieldSchema = formSchema.shape[field as keyof typeof formSchema.shape];
      if (fieldSchema) {
        fieldSchema.parse(value);
        setValidationErrors(prev => {
          const next = { ...prev };
          delete next[field];
          return next;
        });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        setValidationErrors(prev => ({
          ...prev,
          [field]: error.errors[0]?.message || 'قيمة غير صحيحة'
        }));
      }
    }
  }, []);

  // Handle input change with validation
  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Debounced validation
    if (field === 'name' || field === 'email' || field === 'phone') {
      setTimeout(() => validateField(field, value), 300);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent duplicate submissions (debounce 2 seconds)
    const now = Date.now();
    if (now - submitTimeRef.current < 2000) {
      return;
    }
    submitTimeRef.current = now;

    // Clean phone number
    const cleanPhone = formData.phone.replace(/[\s\-+]/g, '');
    const dataToValidate = { ...formData, phone: cleanPhone };

    // Validate all fields
    try {
      formSchema.parse(dataToValidate);
      setValidationErrors({});
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.errors.forEach(err => {
          if (err.path[0]) {
            errors[err.path[0] as string] = err.message;
          }
        });
        setValidationErrors(errors);
        
        toast({
          title: "⚠️ يرجى تصحيح الأخطاء",
          description: "تحقق من البيانات المدخلة",
          variant: "destructive"
        });
        return;
      }
    }

    setSubmitStatus('submitting');

    try {
      const response = await supabase.functions.invoke('service-page-request', {
        body: {
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: cleanPhone,
          company: formData.company.trim() || undefined,
          serviceName,
          serviceType,
          serviceOption: formData.serviceOption || undefined,
          description: formData.description.trim() || undefined,
          selectedFeatures: formData.selectedFeatures.length > 0 ? formData.selectedFeatures : undefined,
          website: formData.website, // Honeypot
          pageUrl: window.location.href,
          timestamp: new Date().toISOString()
        }
      });

      if (response.error) {
        throw new Error(response.error.message || 'فشل الإرسال');
      }

      const data = response.data;

      if (!data.success) {
        // Handle validation errors from server
        if (data.validationErrors) {
          toast({
            title: "⚠️ بيانات غير صحيحة",
            description: data.validationErrors.join('، '),
            variant: "destructive"
          });
          setSubmitStatus('error');
          return;
        }
        throw new Error(data.error || 'حدث خطأ غير متوقع');
      }

      // Success!
      setReferenceNumber(data.referenceNumber || '');
      setSubmitStatus('success');
      setRetryCount(0);
      
      toast({
        title: "✅ تم إرسال طلبك بنجاح!",
        description: `الرقم المرجعي: ${data.referenceNumber || 'سيصلك عبر البريد'}`,
      });
      
      // Reset form after success
      setFormData({
        name: "", email: "", phone: "", company: "",
        serviceOption: "", description: "", selectedFeatures: [],
        website: ""
      });

    } catch (error: any) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
      setRetryCount(prev => prev + 1);
      
      // Different messages based on retry count
      const errorMessage = retryCount >= 2 
        ? "يرجى التواصل معنا مباشرة على info@ash-holding.sa"
        : "يرجى المحاولة مرة أخرى";
      
      toast({
        title: "❌ فشل إرسال الطلب",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  const handleFeatureToggle = (feature: string, checked: boolean) => {
    if (checked) {
      setFormData({ ...formData, selectedFeatures: [...formData.selectedFeatures, feature] });
    } else {
      setFormData({ ...formData, selectedFeatures: formData.selectedFeatures.filter(f => f !== feature) });
    }
  };

  const handleRetry = () => {
    setSubmitStatus('idle');
  };

  const isSubmitting = submitStatus === 'submitting';

  return (
    <motion.div 
      initial={{ opacity: 0, x: 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <Card className={cn(
        "border-0 shadow-2xl overflow-hidden",
        `ring-2 ${theme.ring}`
      )}>
        {/* Header - RTL gradient direction */}
        <div className={cn("p-6 text-white bg-gradient-to-l", theme.gradient)}>
          <h3 className="text-2xl font-bold mb-2 text-right">{title}</h3>
          <p className="text-white/80 text-sm text-right">
            {serviceName} - استشارة مجانية ورد سريع
          </p>
        </div>
        
        <CardContent className="p-6 sm:p-8" dir="rtl">
          {/* Success State */}
          {submitStatus === 'success' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-600" />
              </div>
              <h4 className="text-2xl font-bold text-emerald-600 mb-2">تم إرسال طلبك بنجاح!</h4>
              {referenceNumber && (
                <p className="text-lg text-muted-foreground mb-4">
                  الرقم المرجعي: <span className="font-mono font-bold text-foreground">{referenceNumber}</span>
                </p>
              )}
              <p className="text-muted-foreground mb-6">سيتواصل معك فريقنا خلال 24 ساعة</p>
              <Button 
                variant="outline" 
                onClick={() => setSubmitStatus('idle')}
                className="gap-2"
              >
                <span>إرسال طلب آخر</span>
              </Button>
            </motion.div>
          )}

          {/* Error State with Retry */}
          {submitStatus === 'error' && retryCount >= 3 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <AlertCircle className="w-10 h-10 text-red-600" />
              </div>
              <h4 className="text-xl font-bold text-red-600 mb-2">تعذر إرسال الطلب</h4>
              <p className="text-muted-foreground mb-6">يرجى التواصل معنا مباشرة</p>
              <div className="space-y-3">
                <a 
                  href="mailto:info@ash-holding.sa" 
                  className="block text-primary hover:underline"
                >
                  📧 info@ash-holding.sa
                </a>
                <a 
                  href="tel:0555812567" 
                  className="block text-primary hover:underline"
                >
                  📱 0555812567
                </a>
              </div>
              <Button 
                variant="outline" 
                onClick={handleRetry}
                className="gap-2 mt-6"
              >
                <RefreshCw className="w-4 h-4" />
                <span>المحاولة مرة أخرى</span>
              </Button>
            </motion.div>
          )}

          {/* Form */}
          {(submitStatus === 'idle' || submitStatus === 'submitting' || (submitStatus === 'error' && retryCount < 3)) && (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Honeypot field - hidden from humans */}
              <input
                type="text"
                name="website"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                tabIndex={-1}
                autoComplete="off"
                style={{ 
                  position: 'absolute', 
                  left: '-9999px', 
                  opacity: 0, 
                  height: 0,
                  width: 0,
                  overflow: 'hidden'
                }}
                aria-hidden="true"
              />

              {/* Row 1: Name (Right) & Email (Left) - Native RTL Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="block font-medium">الاسم الكامل *</Label>
                  <Input 
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    required
                    placeholder="أدخل اسمك الكامل"
                    className={cn(validationErrors.name && "border-red-500 focus-visible:ring-red-500")}
                    disabled={isSubmitting}
                  />
                  {validationErrors.name && (
                    <p className="text-sm text-red-500">{validationErrors.name}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="block font-medium">البريد الإلكتروني *</Label>
                  <Input 
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    required
                    className={cn("text-left", validationErrors.email && "border-red-500 focus-visible:ring-red-500")}
                    placeholder="example@email.com"
                    dir="ltr"
                    disabled={isSubmitting}
                  />
                  {validationErrors.email && (
                    <p className="text-sm text-red-500">{validationErrors.email}</p>
                  )}
                </div>
              </div>

              {/* Row 2: Phone (Right) & Company (Left) - Native RTL Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="block font-medium">رقم الجوال *</Label>
                  <Input 
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    required
                    className={cn("text-left", validationErrors.phone && "border-red-500 focus-visible:ring-red-500")}
                    placeholder="05XXXXXXXX"
                    dir="ltr"
                    disabled={isSubmitting}
                  />
                  {validationErrors.phone && (
                    <p className="text-sm text-red-500">{validationErrors.phone}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="block font-medium">اسم الشركة / المؤسسة</Label>
                  <Input 
                    value={formData.company}
                    onChange={(e) => handleChange('company', e.target.value)}
                    placeholder="اسم الشركة (اختياري)"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Service Option - Native RTL Select */}
              {serviceOptions.length > 0 && (
                <div className="space-y-2">
                  <Label className="block font-medium">نوع الخدمة المطلوبة</Label>
                  <Select 
                    value={formData.serviceOption} 
                    onValueChange={(v) => setFormData({...formData, serviceOption: v})}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر نوع الخدمة" />
                    </SelectTrigger>
                    <SelectContent>
                      {serviceOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Description */}
              <div className="space-y-2">
                <Label className="block font-medium">تفاصيل المشروع</Label>
                <Textarea 
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  rows={4}
                  className="resize-none"
                  placeholder="اشرح متطلباتك بالتفصيل..."
                  disabled={isSubmitting}
                />
              </div>

              {/* Features Selection - Native RTL Grid */}
              {features.length > 0 && (
                <div className="space-y-3">
                  <Label className="block font-medium">الخدمات الإضافية المطلوبة</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {features.slice(0, 6).map((feature) => (
                      <motion.label 
                        key={feature}
                        htmlFor={feature}
                        className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                        whileHover={{ scale: 1.02 }}
                      >
                        <Checkbox 
                          id={feature}
                          checked={formData.selectedFeatures.includes(feature)}
                          onCheckedChange={(checked) => handleFeatureToggle(feature, checked as boolean)}
                          className={cn("border-2", theme.text)}
                          disabled={isSubmitting}
                        />
                        <span className="text-sm flex-1">{feature}</span>
                      </motion.label>
                    ))}
                  </div>
                </div>
              )}

              {/* Submit Button - Native RTL: text first, icon second */}
              <motion.div whileHover={{ scale: isSubmitting ? 1 : 1.02 }} whileTap={{ scale: isSubmitting ? 1 : 0.98 }}>
                <Button 
                  type="submit" 
                  size="lg" 
                  className={cn(
                    "w-full text-white font-bold py-6 text-lg bg-gradient-to-l gap-2",
                    theme.gradient
                  )}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span>جاري الإرسال...</span>
                      <Loader2 className="w-5 h-5 animate-spin" />
                    </>
                  ) : submitStatus === 'error' ? (
                    <>
                      <span>إعادة المحاولة</span>
                      <RefreshCw className="w-5 h-5" />
                    </>
                  ) : (
                    <>
                      <span>إرسال الطلب</span>
                      <Send className="w-5 h-5" />
                    </>
                  )}
                </Button>
              </motion.div>

              {/* Customer Portal Link - Native RTL: text first, icon second */}
              <div className="pt-4 border-t border-border">
                <Link to="/portal">
                  <Button 
                    type="button"
                    variant="outline" 
                    className="w-full gap-2"
                    disabled={isSubmitting}
                  >
                    <span>بوابة العملاء - تتبع طلباتك</span>
                    <LogIn className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ServiceRequestForm;
