import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  CreditCard, 
  Settings,
  CheckCircle,
  AlertCircle,
  Clock,
  Save,
  Eye,
  EyeOff,
  Smartphone,
  Building2,
  Calendar,
  Wifi,
  WifiOff,
  Zap,
  Shield,
  Copy,
  RefreshCw,
  Key,
  Check,
  X,
  Sparkles,
  Monitor,
  Tablet,
  Globe
} from 'lucide-react';

interface PaymentMethod {
  id: string;
  name: string;
  name_ar: string;
  provider: string;
  icon_name: string;
  api_key?: string;
  secret_key?: string;
  webhook_secret?: string;
  is_active: boolean;
  is_live_mode: boolean;
  configuration: any;
  created_at: string;
}

const iconMap = {
  CreditCard,
  Smartphone,
  Building2,
  Calendar,
  Shield
};

const paymentProviders = [
  {
    id: 'tap_now',
    name: 'Electronic Payment',
    name_ar: 'الدفع الإلكتروني',
    icon: 'CreditCard',
    description: 'ادفع بسهولة عبر البطاقات الائتمانية والمحافظ الرقمية الآمنة',
    color: 'from-violet-600 via-purple-600 to-indigo-600',
    hoverColor: 'from-violet-700 via-purple-700 to-indigo-700',
    features: ['Visa', 'Mastercard', 'Mada', 'Apple Pay', 'Google Pay', 'STC Pay'],
    fields: [
      { key: 'merchant_id', label: 'كود التاجر', type: 'text', required: true, placeholder: 'MERCHANT_ID' },
      { key: 'public_key', label: 'المفتاح العام', type: 'text', required: true, placeholder: 'pk_test_...' },
      { key: 'secret_key', label: 'المفتاح السري', type: 'password', required: true, placeholder: 'sk_test_...' },
      { key: 'webhook_secret', label: 'مفتاح Webhook', type: 'password', required: false, placeholder: 'whsec_...' }
    ]
  },
  {
    id: 'tamara',
    name: 'Tamara',
    name_ar: 'تمارا',
    icon: 'Calendar',
    description: 'قسم مشترياتك واشتري الآن وادفع لاحقاً',
    color: 'from-emerald-500 via-teal-500 to-cyan-500',
    hoverColor: 'from-emerald-600 via-teal-600 to-cyan-600',
    features: ['تقسيط 3 أشهر', 'تقسيط 4 أشهر', 'ادفع الشهر القادم'],
    fields: [
      { key: 'api_url', label: 'API URL', type: 'text', required: true, placeholder: 'https://api.tamara.co' },
      { key: 'api_token', label: 'API Token', type: 'password', required: true, placeholder: 'Bearer token...' },
      { key: 'notification_token', label: 'Notification Token', type: 'password', required: true, placeholder: 'notification_token...' },
      { key: 'merchant_url', label: 'رابط التاجر', type: 'text', required: false, placeholder: 'https://example.com' }
    ]
  },
  {
    id: 'bank_transfer',
    name: 'Bank Transfer',
    name_ar: 'حوالة بنكية',
    icon: 'Building2',
    description: 'تحويل بنكي مباشر لحساب الشركة',
    color: 'from-blue-600 via-indigo-600 to-purple-600',
    hoverColor: 'from-blue-700 via-indigo-700 to-purple-700',
    features: ['تحويل مباشر', 'IBAN متاح', 'مؤكد خلال 24 ساعة'],
    fields: [
      { key: 'bank_name', label: 'اسم البنك', type: 'text', required: true, placeholder: 'البنك الأهلي السعودي' },
      { key: 'account_number', label: 'رقم الحساب', type: 'text', required: true, placeholder: '161000010006086071040' },
      { key: 'iban', label: 'IBAN', type: 'text', required: true, placeholder: 'SA1980000161608016071040' },
      { key: 'account_holder', label: 'اسم صاحب الحساب', type: 'text', required: true, placeholder: 'شركة علي صالح الشهري القابضة' }
    ]
  }
];

export default function AdminPaymentMethods() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .in('provider', ['tamara', 'bank_transfer', 'tap_now'])
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPaymentMethods(data || []);
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      toast({
        title: "خطأ",
        description: "فشل في جلب طرق الدفع",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updatePaymentMethod = async (providerId: string, formData: any) => {
    setSaving(providerId);
    try {
      const provider = paymentProviders.find(p => p.id === providerId);
      if (!provider) return;

      const existingMethod = paymentMethods.find(m => m.provider === providerId);
      
      // Build configuration object from form fields
      const configuration: any = {};
      provider.fields.forEach(field => {
        if (formData[field.key]) {
          configuration[field.key] = formData[field.key];
        }
      });

      const methodData = {
        name: provider.name,
        name_ar: provider.name_ar,
        provider: provider.id,
        icon_name: provider.icon,
        configuration: configuration,
        is_active: formData.is_active,
        is_live_mode: formData.is_live_mode,
        api_key: formData.api_key || null,
        secret_key: formData.secret_key || null,
        webhook_secret: formData.webhook_secret || null
      };

      if (existingMethod) {
        const { error } = await supabase
          .from('payment_methods')
          .update(methodData)
          .eq('id', existingMethod.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('payment_methods')
          .insert(methodData);

        if (error) throw error;
      }

      toast({
        title: "تم الحفظ بنجاح ✨",
        description: `تم حفظ إعدادات ${provider.name_ar} بنجاح`,
      });

      fetchPaymentMethods();
    } catch (error) {
      console.error('Error saving payment method:', error);
      toast({
        title: "خطأ في الحفظ",
        description: "فشل في حفظ الإعدادات، يرجى المحاولة مرة أخرى",
        variant: "destructive"
      });
    } finally {
      setSaving(null);
    }
  };

  const toggleSecretVisibility = (methodId: string) => {
    setShowSecrets(prev => ({
      ...prev,
      [methodId]: !prev[methodId]
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900" dir="rtl">
        <div className="container mx-auto py-12 px-4 lg:px-8">
          <div className="text-center mb-16">
            <div className="animate-pulse space-y-6">
              <div className="mx-auto w-24 h-24 bg-gradient-to-br from-primary/20 to-primary-variant/20 rounded-full animate-bounce"></div>
              <div className="h-16 bg-gradient-to-r from-muted/50 to-muted rounded-2xl w-2/3 mx-auto"></div>
              <div className="h-8 bg-muted/50 rounded-xl w-1/2 mx-auto"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse">
                <div className="h-[32rem] bg-gradient-to-br from-white/50 to-muted/20 rounded-3xl shadow-lg"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 font-tajawal" dir="rtl">
      <div className="container mx-auto py-12 px-4 lg:px-8">
        {/* Hero Header */}
        <div className="text-center mb-20 space-y-8">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary-variant/20 blur-3xl rounded-full"></div>
            <div className="relative p-6 bg-gradient-to-br from-white via-white/95 to-primary/5 rounded-full shadow-2xl border border-white/20">
              <CreditCard className="h-16 w-16 text-primary drop-shadow-lg" />
            </div>
          </div>
          
          <div className="space-y-6">
            <h1 className="text-6xl md:text-7xl font-black bg-gradient-to-r from-slate-800 via-primary to-primary-variant bg-clip-text text-transparent leading-tight">
              إدارة طرق الدفع
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed font-medium">
              قم بإدارة وتكوين بوابات الدفع المختلفة لتوفير تجربة دفع آمنة ومرنة للعملاء عبر جميع الأجهزة
            </p>
            
            {/* Device Icons */}
            <div className="flex justify-center items-center gap-6 mt-8">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/60 rounded-full shadow-md">
                <Monitor className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">سطح المكتب</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/60 rounded-full shadow-md">
                <Tablet className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">الأجهزة اللوحية</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/60 rounded-full shadow-md">
                <Smartphone className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">الهواتف الذكية</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {paymentProviders.map((provider, index) => {
            const existingMethod = paymentMethods.find(m => m.provider === provider.id);
            const IconComponent = iconMap[provider.icon as keyof typeof iconMap];
            const isConfigured = !!(existingMethod && (existingMethod.api_key || existingMethod.configuration));
            const isActive = existingMethod?.is_active || false;
            
            return (
              <PaymentMethodCard
                key={provider.id}
                provider={provider}
                existingMethod={existingMethod}
                IconComponent={IconComponent}
                isConfigured={isConfigured}
                isActive={isActive}
                saving={saving === provider.id}
                showSecrets={showSecrets}
                onToggleSecrets={toggleSecretVisibility}
                onUpdate={updatePaymentMethod}
                index={index}
              />
            );
          })}
        </div>

        {/* Footer Section */}
        <div className="mt-20 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/80 rounded-full shadow-lg backdrop-blur-sm border border-white/20">
            <Shield className="h-5 w-5 text-primary" />
            <span className="font-medium text-muted-foreground">مدعوم بأعلى معايير الأمان والحماية</span>
            <Sparkles className="h-5 w-5 text-primary animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}

interface PaymentMethodCardProps {
  provider: any;
  existingMethod: PaymentMethod | undefined;
  IconComponent: any;
  isConfigured: boolean;
  isActive: boolean;
  saving: boolean;
  showSecrets: Record<string, boolean>;
  onToggleSecrets: (id: string) => void;
  onUpdate: (providerId: string, formData: any) => void;
  index: number;
}

function PaymentMethodCard({
  provider,
  existingMethod,
  IconComponent,
  isConfigured,
  isActive,
  saving,
  showSecrets,
  onToggleSecrets,
  onUpdate,
  index
}: PaymentMethodCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState(() => {
    const initialData: any = {
      is_active: isActive,
      is_live_mode: existingMethod?.is_live_mode || false,
      api_key: existingMethod?.api_key || '',
      secret_key: existingMethod?.secret_key || '',
      webhook_secret: existingMethod?.webhook_secret || '',
    };

    // Initialize field values from configuration
    provider.fields.forEach((field: any) => {
      initialData[field.key] = existingMethod?.configuration?.[field.key] || '';
    });

    return initialData;
  });

  const handleSave = () => {
    onUpdate(provider.id, formData);
    setIsOpen(false);
  };

  const getStatusInfo = () => {
    if (!isConfigured) {
      return {
        icon: <Clock className="h-5 w-5" />,
        text: 'غير مُكوّن',
        color: 'text-amber-600',
        bgColor: 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200/50',
        badge: 'secondary',
        glowColor: 'shadow-amber-500/20'
      };
    }
    if (isActive) {
      return {
        icon: <CheckCircle className="h-5 w-5" />,
        text: 'مفعل ويعمل',
        color: 'text-emerald-600',
        bgColor: 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200/50',
        badge: 'default',
        glowColor: 'shadow-emerald-500/20'
      };
    }
    return {
      icon: <AlertCircle className="h-5 w-5" />,
      text: 'معطل',
      color: 'text-slate-600',
      bgColor: 'bg-gradient-to-br from-slate-50 to-gray-50 border-slate-200/50',
      badge: 'secondary',
      glowColor: 'shadow-slate-500/20'
    };
  };

  const statusInfo = getStatusInfo();

  return (
    <Card className={`
      relative group transition-all duration-700 hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-2
      ${statusInfo.bgColor} border-2 overflow-hidden backdrop-blur-sm
      animate-fade-in hover:${statusInfo.glowColor}
    `} style={{ animationDelay: `${index * 150}ms` }}>
      
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
        <div className={`absolute inset-0 bg-gradient-to-br ${provider.color} opacity-5`} />
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl transform translate-x-16 -translate-y-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-2xl transform -translate-x-12 translate-y-12" />
      </div>
      
      <CardHeader className="relative pb-6 space-y-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-5">
            <div className={`
              relative p-4 bg-gradient-to-br ${provider.color} rounded-2xl shadow-xl 
              group-hover:scale-110 group-hover:rotate-3 transition-all duration-500
              before:absolute before:inset-0 before:bg-white/20 before:rounded-2xl before:opacity-0 
              group-hover:before:opacity-100 before:transition-opacity before:duration-300
            `}>
              <IconComponent className="h-10 w-10 text-white relative z-10 drop-shadow-lg" />
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl" />
            </div>
            
            <div className="space-y-2 flex-1">
              <CardTitle className="text-2xl font-black text-foreground group-hover:text-primary transition-colors duration-300 leading-tight">
                {provider.name_ar}
              </CardTitle>
              <CardDescription className="text-muted-foreground leading-relaxed font-medium text-base">
                {provider.description}
              </CardDescription>
            </div>
          </div>
          
          <div className={`${statusInfo.color} group-hover:scale-110 transition-transform duration-300`}>
            {statusInfo.icon}
          </div>
        </div>

        {/* Enhanced Features */}
        <div className="flex flex-wrap gap-2">
          {provider.features.map((feature: string, featureIndex: number) => (
            <Badge 
              key={featureIndex} 
              variant="outline" 
              className={`
                text-xs px-3 py-1.5 bg-white/60 hover:bg-white/80 border-white/40
                transition-all duration-300 hover:scale-105 font-medium backdrop-blur-sm
                hover:shadow-md
              `}
              style={{ animationDelay: `${(index * 150) + (featureIndex * 50)}ms` }}
            >
              {feature}
            </Badge>
          ))}
        </div>
      </CardHeader>
      
      <CardContent className="relative space-y-6">
        {/* Enhanced Status Card */}
        <div className="p-5 rounded-2xl bg-white/70 backdrop-blur-md border border-white/40 space-y-4 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="font-bold text-foreground text-lg">حالة الطريقة</span>
            <Badge variant={statusInfo.badge as any} className="gap-2 px-3 py-1.5 font-medium">
              {statusInfo.icon}
              {statusInfo.text}
            </Badge>
          </div>
          
          {isConfigured && (
            <>
              <Separator className="my-3 bg-gradient-to-r from-transparent via-border to-transparent" />
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center justify-between p-3 bg-white/50 rounded-xl">
                  <span className="text-muted-foreground font-medium">البيئة:</span>
                  <div className="flex items-center gap-2">
                    {existingMethod?.is_live_mode ? (
                      <>
                        <Wifi className="h-4 w-4 text-red-500" />
                        <span className="text-red-600 font-bold">مباشر</span>
                      </>
                    ) : (
                      <>
                        <WifiOff className="h-4 w-4 text-blue-500" />
                        <span className="text-blue-600 font-bold">تجريبي</span>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-white/50 rounded-xl">
                  <span className="text-muted-foreground font-medium">الحالة:</span>
                  <div className="flex items-center gap-2">
                    {isActive ? (
                      <>
                        <Zap className="h-4 w-4 text-emerald-500" />
                        <span className="text-emerald-600 font-bold">نشط</span>
                      </>
                    ) : (
                      <>
                        <X className="h-4 w-4 text-slate-500" />
                        <span className="text-slate-600 font-bold">متوقف</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              {existingMethod?.api_key && (
                <div className="space-y-3 p-4 bg-white/50 rounded-xl border border-white/30">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground font-medium flex items-center gap-2">
                      <Key className="h-4 w-4" />
                      API Key:
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onToggleSecrets(existingMethod.id)}
                      className="h-8 w-8 p-0 hover:bg-primary/10 rounded-full"
                    >
                      {showSecrets[existingMethod.id] ? 
                        <EyeOff className="h-4 w-4" /> : 
                        <Eye className="h-4 w-4" />
                      }
                    </Button>
                  </div>
                  <div className="text-xs font-mono bg-slate-100 p-4 rounded-lg text-center border border-slate-200/50 break-all">
                    {showSecrets[existingMethod.id] 
                      ? existingMethod.api_key 
                      : '••••••••••••••••••••••••••••••••••••••••'
                    }
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Enhanced Action Buttons */}
        <div className="flex gap-4">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button 
                variant={isConfigured ? "outline" : "default"} 
                size="lg"
                className={`
                  flex-1 gap-3 h-14 font-bold text-base rounded-xl
                  transition-all duration-300 hover:shadow-xl hover:scale-105
                  ${isConfigured 
                    ? 'bg-white/80 hover:bg-white border-white/40 hover:border-primary/30' 
                    : `bg-gradient-to-r ${provider.color} hover:${provider.hoverColor} text-white shadow-lg`
                  }
                `}
                disabled={saving}
              >
                {saving ? (
                  <RefreshCw className="h-5 w-5 animate-spin" />
                ) : (
                  <Settings className="h-5 w-5" />
                )}
                {isConfigured ? 'تعديل الإعدادات' : 'إعداد الآن'}
              </Button>
            </DialogTrigger>
            
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto font-tajawal" dir="rtl">
              <DialogHeader className="space-y-4 pb-6">
                <div className="flex items-center gap-4">
                  <div className={`p-3 bg-gradient-to-br ${provider.color} rounded-xl`}>
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <DialogTitle className="text-2xl font-bold text-right">
                      إعدادات {provider.name_ar}
                    </DialogTitle>
                    <p className="text-muted-foreground text-right mt-1">
                      قم بتكوين بيانات الاتصال والمفاتيح الأمنية
                    </p>
                  </div>
                </div>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Main Settings */}
                <div className="space-y-4 p-6 bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl border">
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <Globe className="h-5 w-5 text-primary" />
                    الإعدادات الأساسية
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="font-medium flex items-center gap-2">
                        <Switch
                          checked={formData.is_active}
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                        />
                        تفعيل الطريقة
                      </Label>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="font-medium flex items-center gap-2">
                        <Switch
                          checked={formData.is_live_mode}
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_live_mode: checked }))}
                        />
                        البيئة المباشرة
                      </Label>
                    </div>
                  </div>
                </div>

                {/* Configuration Fields */}
                <div className="space-y-4">
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <Key className="h-5 w-5 text-primary" />
                    بيانات الاتصال
                  </h3>
                  
                  <div className="grid gap-4">
                    {provider.fields.map((field: any, fieldIndex: number) => (
                      <div key={field.key} className="space-y-2">
                        <Label className="font-medium text-right">
                          {field.label}
                          {field.required && <span className="text-red-500 mr-1">*</span>}
                        </Label>
                        <Input
                          type={field.type}
                          placeholder={field.placeholder}
                          value={formData[field.key] || ''}
                          onChange={(e) => setFormData(prev => ({ 
                            ...prev, 
                            [field.key]: e.target.value 
                          }))}
                          className="h-12 text-right bg-white/80 border-white/40 focus:border-primary/50 rounded-xl"
                          dir="ltr"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-6 border-t">
                  <Button 
                    onClick={handleSave} 
                    disabled={saving}
                    className={`
                      flex-1 h-12 gap-2 font-bold rounded-xl
                      bg-gradient-to-r ${provider.color} hover:${provider.hoverColor} 
                      text-white shadow-lg hover:shadow-xl transition-all duration-300
                    `}
                  >
                    {saving ? (
                      <RefreshCw className="h-5 w-5 animate-spin" />
                    ) : (
                      <Save className="h-5 w-5" />
                    )}
                    {saving ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={() => setIsOpen(false)}
                    className="px-8 h-12 font-bold rounded-xl bg-white/80 hover:bg-white border-white/40"
                  >
                    إلغاء
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}