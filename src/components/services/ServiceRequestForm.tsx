import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Send, Loader2, LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

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

const ServiceRequestForm = ({
  serviceName,
  serviceType,
  colorTheme,
  serviceOptions = [],
  features = [],
  title = "اطلب الخدمة الآن"
}: ServiceRequestFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const theme = colorThemes[colorTheme];
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    serviceOption: "",
    description: "",
    selectedFeatures: [] as string[]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast({
      title: "✅ تم إرسال طلبك بنجاح!",
      description: "سيتواصل معك فريقنا خلال 24 ساعة",
    });
    
    setFormData({
      name: "", email: "", phone: "", company: "",
      serviceOption: "", description: "", selectedFeatures: []
    });
    
    setIsSubmitting(false);
  };

  const handleFeatureToggle = (feature: string, checked: boolean) => {
    if (checked) {
      setFormData({ ...formData, selectedFeatures: [...formData.selectedFeatures, feature] });
    } else {
      setFormData({ ...formData, selectedFeatures: formData.selectedFeatures.filter(f => f !== feature) });
    }
  };

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
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Row 1: Name (Right) & Email (Left) - Native RTL Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="block font-medium">الاسم الكامل *</Label>
                <Input 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  placeholder="أدخل اسمك الكامل"
                />
              </div>
              <div className="space-y-2">
                <Label className="block font-medium">البريد الإلكتروني *</Label>
                <Input 
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                  className="text-left"
                  placeholder="example@email.com"
                  dir="ltr"
                />
              </div>
            </div>

            {/* Row 2: Phone (Right) & Company (Left) - Native RTL Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="block font-medium">رقم الجوال *</Label>
                <Input 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  required
                  className="text-left"
                  placeholder="05XXXXXXXX"
                  dir="ltr"
                />
              </div>
              <div className="space-y-2">
                <Label className="block font-medium">اسم الشركة / المؤسسة</Label>
                <Input 
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                  placeholder="اسم الشركة (اختياري)"
                />
              </div>
            </div>

            {/* Service Option - Native RTL Select */}
            {serviceOptions.length > 0 && (
              <div className="space-y-2">
                <Label className="block font-medium">نوع الخدمة المطلوبة</Label>
                <Select value={formData.serviceOption} onValueChange={(v) => setFormData({...formData, serviceOption: v})}>
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
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={4}
                className="resize-none"
                placeholder="اشرح متطلباتك بالتفصيل..."
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
                      className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      whileHover={{ scale: 1.02 }}
                    >
                      <Checkbox 
                        id={feature}
                        checked={formData.selectedFeatures.includes(feature)}
                        onCheckedChange={(checked) => handleFeatureToggle(feature, checked as boolean)}
                        className={cn("border-2", theme.text)}
                      />
                      <span className="text-sm flex-1">{feature}</span>
                    </motion.label>
                  ))}
                </div>
              </div>
            )}

            {/* Submit Button - Native RTL: text first, icon second */}
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
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
                ) : (
                  <>
                    <span>إرسال الطلب</span>
                    <Send className="w-5 h-5" />
                  </>
                )}
              </Button>
            </motion.div>

            {/* Customer Portal Link - Native RTL: text first, icon second */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
              <Link to="/app">
                <Button 
                  type="button"
                  variant="outline" 
                  className="w-full gap-2"
                >
                  <span>بوابة العملاء - تتبع طلباتك</span>
                  <LogIn className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ServiceRequestForm;
