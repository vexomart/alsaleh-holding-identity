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
  X
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
    name: 'Tap Now',
    name_ar: 'تاب الان',
    icon: 'CreditCard',
    description: 'ادفع بسهولة باستخدام تاب الان - دعم للبطاقات والمحافظ الرقمية',
    color: 'from-purple-500 to-violet-500',
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
    color: 'from-green-500 to-emerald-500',
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
    color: 'from-blue-500 to-cyan-500',
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
        title: "تم الحفظ بنجاح",
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
      <div className="min-h-screen p-6 bg-gradient-to-br from-background via-background/95 to-primary/5">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center">
            <div className="animate-pulse space-y-4">
              <div className="h-12 bg-muted rounded-lg w-1/2 mx-auto"></div>
              <div className="h-6 bg-muted rounded w-1/3 mx-auto"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse">
                <div className="h-96 bg-muted rounded-2xl"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-background via-background/95 to-primary/5" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-primary to-primary-variant rounded-3xl shadow-xl">
            <CreditCard className="h-12 w-12 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-primary-variant bg-clip-text text-transparent">
              إدارة طرق الدفع
            </h1>
            <p className="text-xl text-muted-foreground mt-3 max-w-2xl mx-auto">
              قم بإدارة وتكوين بوابات الدفع المختلفة لتوفير تجربة دفع آمنة ومرنة للعملاء
            </p>
          </div>
        </div>

        {/* Payment Methods Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {paymentProviders.map((provider) => {
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
              />
            );
          })}
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
  onUpdate
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
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50 border-yellow-200',
        badge: 'secondary'
      };
    }
    if (isActive) {
      return {
        icon: <CheckCircle className="h-5 w-5" />,
        text: 'مفعل ويعمل',
        color: 'text-green-600',
        bgColor: 'bg-green-50 border-green-200',
        badge: 'default'
      };
    }
    return {
      icon: <AlertCircle className="h-5 w-5" />,
      text: 'معطل',
      color: 'text-gray-600',
      bgColor: 'bg-gray-50 border-gray-200',
      badge: 'secondary'
    };
  };

  const statusInfo = getStatusInfo();

  return (
    <Card className={`relative group transition-all duration-500 hover:shadow-2xl hover:scale-105 ${statusInfo.bgColor} border-2 overflow-hidden`}>
      {/* Background Gradient Effect */}
      <div className={`absolute inset-0 bg-gradient-to-br ${provider.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
      
      <CardHeader className="relative pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className={`p-4 bg-gradient-to-br ${provider.color} rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
              <IconComponent className="h-8 w-8 text-white" />
            </div>
            <div className="space-y-1">
              <CardTitle className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                {provider.name_ar}
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground leading-relaxed">
                {provider.description}
              </CardDescription>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className={statusInfo.color}>
              {statusInfo.icon}
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-4 flex flex-wrap gap-2">
          {provider.features.map((feature: string, index: number) => (
            <Badge 
              key={index} 
              variant="outline" 
              className="text-xs px-2 py-1 bg-background/50 hover:bg-primary/10 transition-colors"
            >
              {feature}
            </Badge>
          ))}
        </div>
      </CardHeader>
      
      <CardContent className="relative space-y-6">
        {/* Status Card */}
        <div className="p-4 rounded-xl bg-background/70 backdrop-blur-sm border space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-foreground">حالة الطريقة</span>
            <Badge variant={statusInfo.badge as any} className="gap-1">
              {statusInfo.icon}
              {statusInfo.text}
            </Badge>
          </div>
          
          {isConfigured && (
            <>
              <Separator className="my-2" />
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">البيئة:</span>
                  <div className="flex items-center gap-1">
                    {existingMethod?.is_live_mode ? (
                      <>
                        <Wifi className="h-3 w-3 text-red-500" />
                        <span className="text-red-600 font-medium">مباشر</span>
                      </>
                    ) : (
                      <>
                        <WifiOff className="h-3 w-3 text-blue-500" />
                        <span className="text-blue-600 font-medium">تجريبي</span>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">الحالة:</span>
                  <div className="flex items-center gap-1">
                    {isActive ? (
                      <>
                        <Zap className="h-3 w-3 text-green-500" />
                        <span className="text-green-600 font-medium">نشط</span>
                      </>
                    ) : (
                      <>
                        <X className="h-3 w-3 text-gray-500" />
                        <span className="text-gray-600 font-medium">متوقف</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              {existingMethod?.api_key && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">API Key:</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onToggleSecrets(existingMethod.id)}
                      className="h-7 w-7 p-0 hover:bg-primary/10"
                    >
                      {showSecrets[existingMethod.id] ? 
                        <EyeOff className="h-3 w-3" /> : 
                        <Eye className="h-3 w-3" />
                      }
                    </Button>
                  </div>
                  <div className="text-xs font-mono bg-muted/70 p-3 rounded-lg text-center border">
                    {showSecrets[existingMethod.id] 
                      ? existingMethod.api_key 
                      : '••••••••••••••••••••••••••••'
                    }
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button 
                variant={isConfigured ? "outline" : "default"} 
                size="lg"
                className="flex-1 gap-2 h-12 font-semibold group-hover:shadow-lg transition-all"
                disabled={saving}
              >
                <Settings className="h-5 w-5" />
                {isConfigured ? 'تعديل الإعدادات' : 'إعداد الآن'}
              </Button>
            </DialogTrigger>
            
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto" dir="rtl">
              <DialogHeader className="border-b pb-4">
                <DialogTitle className="flex items-center gap-3 text-2xl">
                  <div className={`p-3 bg-gradient-to-br ${provider.color} rounded-xl shadow-lg`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div>إعدادات {provider.name_ar}</div>
                    <div className="text-sm font-normal text-muted-foreground mt-1">
                      {provider.description}
                    </div>
                  </div>
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-8 pt-6">
                {/* Status Controls */}
                <div className="grid grid-cols-2 gap-6 p-6 bg-muted/30 rounded-xl">
                  <div className="space-y-3">
                    <Label htmlFor="is_active" className="text-base font-semibold flex items-center gap-2">
                      <Check className="h-4 w-4" />
                      تفعيل طريقة الدفع
                    </Label>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">تفعيل/إلغاء تفعيل للعملاء</span>
                      <Switch
                        id="is_active"
                        checked={formData.is_active}
                        onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
                        className="scale-125"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="is_live_mode" className="text-base font-semibold flex items-center gap-2">
                      <Wifi className="h-4 w-4" />
                      الوضع المباشر
                    </Label>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">تشغيل البيئة المباشرة</span>
                      <Switch
                        id="is_live_mode"
                        checked={formData.is_live_mode}
                        onCheckedChange={(checked) => setFormData({...formData, is_live_mode: checked})}
                        className="scale-125"
                      />
                    </div>
                  </div>
                </div>

                {/* API Configuration */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 pb-2 border-b">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Key className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold">بيانات الاتصال والتكوين</h3>
                  </div>
                  
                  <div className="grid gap-6">
                    {provider.fields.map((field: any) => (
                      <div key={field.key} className="space-y-3">
                        <Label htmlFor={field.key} className="text-base font-semibold">
                          {field.label}
                          {field.required && <span className="text-red-500 mr-2">*</span>}
                        </Label>
                        <Input
                          id={field.key}
                          type={field.type}
                          value={formData[field.key] || ''}
                          onChange={(e) => setFormData({...formData, [field.key]: e.target.value})}
                          placeholder={field.placeholder}
                          required={field.required}
                          className="h-12 font-mono text-base"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Configuration Preview */}
                {existingMethod?.configuration && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Shield className="h-5 w-5 text-primary" />
                      التكوين الحالي
                    </h3>
                    <div className="p-4 bg-muted/50 rounded-xl border">
                      <pre className="text-sm text-muted-foreground font-mono whitespace-pre-wrap">
                        {JSON.stringify(existingMethod.configuration, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4 pt-6 border-t">
                  <Button 
                    onClick={handleSave} 
                    size="lg"
                    className="flex-1 gap-2 h-12 font-semibold"
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <RefreshCw className="h-5 w-5 animate-spin" />
                        جاري الحفظ...
                      </>
                    ) : (
                      <>
                        <Save className="h-5 w-5" />
                        حفظ التغييرات
                      </>
                    )}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="lg"
                    onClick={() => setIsOpen(false)}
                    className="px-8"
                  >
                    إلغاء
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          {isConfigured && (
            <Button
              variant={isActive ? "destructive" : "default"}
              size="lg"
              onClick={() => {
                const newFormData = { ...formData, is_active: !isActive };
                setFormData(newFormData);
                onUpdate(provider.id, newFormData);
              }}
              disabled={saving}
              className="px-6 h-12 font-semibold"
            >
              {isActive ? 'تعطيل' : 'تفعيل'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}