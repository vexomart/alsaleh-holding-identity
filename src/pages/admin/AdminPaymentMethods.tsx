import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  CreditCard, 
  Plus, 
  Edit, 
  Trash2, 
  Key, 
  Shield, 
  Eye,
  EyeOff,
  Smartphone,
  Building2,
  Calendar,
  Settings,
  CheckCircle,
  AlertCircle,
  Clock,
  Save
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
    id: 'tabby',
    name: 'Tabby',
    name_ar: 'تاب',
    icon: 'CreditCard',
    description: 'ادفع على أقساط مع تاب',
    color: 'from-purple-500 to-pink-500',
    fields: [
      { key: 'merchant_code', label: 'كود التاجر', type: 'text', required: true },
      { key: 'public_key', label: 'المفتاح العام', type: 'text', required: true },
      { key: 'secret_key', label: 'المفتاح السري', type: 'password', required: true },
      { key: 'webhook_secret', label: 'مفتاح Webhook', type: 'password', required: false }
    ],
    defaultConfig: {
      currencies: ['SAR'],
      min_amount: 100,
      max_amount: 10000,
      installments: [3, 6, 12]
    }
  },
  {
    id: 'tamara',
    name: 'Tamara',
    name_ar: 'تمارا',
    icon: 'Calendar',
    description: 'قسم مشترياتك مع تمارا',
    color: 'from-green-500 to-emerald-500',
    fields: [
      { key: 'api_url', label: 'API URL', type: 'text', required: true },
      { key: 'api_token', label: 'API Token', type: 'password', required: true },
      { key: 'notification_token', label: 'Notification Token', type: 'password', required: true },
      { key: 'merchant_url', label: 'رابط التاجر', type: 'text', required: false }
    ],
    defaultConfig: {
      api_url: 'https://api-sandbox.tamara.co',
      currency: 'SAR',
      max_amount: 50000,
      min_amount: 100,
      country_code: 'SA',
      sandbox_mode: true
    }
  },
  {
    id: 'bank_transfer',
    name: 'Bank Transfer',
    name_ar: 'حوالة بنكية',
    icon: 'Building2',
    description: 'تحويل بنكي مباشر',
    color: 'from-blue-500 to-cyan-500',
    fields: [
      { key: 'bank_name', label: 'اسم البنك', type: 'text', required: true },
      { key: 'account_number', label: 'رقم الحساب', type: 'text', required: true },
      { key: 'iban', label: 'IBAN', type: 'text', required: true },
      { key: 'company_name', label: 'اسم الشركة', type: 'text', required: true }
    ],
    defaultConfig: {
      iban: 'SA1980000161608016071040',
      bank_name: 'البنك الأهلي السعودي',
      company_name: 'شركة علي صالح الشهري القابضة',
      account_number: '161000010006086071040',
      processing_time: '24 ساعة',
      requires_receipt: true
    }
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
        .in('provider', ['tabby', 'tamara', 'bank_transfer'])
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
      
      const methodData = {
        name: provider.name,
        name_ar: provider.name_ar,
        provider: provider.id,
        icon_name: provider.icon,
        configuration: provider.defaultConfig,
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
        title: "تم الحفظ",
        description: `تم حفظ إعدادات ${provider.name_ar} بنجاح`,
      });

      fetchPaymentMethods();
    } catch (error) {
      console.error('Error saving payment method:', error);
      toast({
        title: "خطأ",
        description: "فشل في حفظ الإعدادات",
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
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-96 bg-muted rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8" dir="rtl" style={{ fontFamily: 'Noto Kufi Arabic, Amiri, Tajawal, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="p-3 bg-gradient-to-br from-primary to-primary-variant rounded-2xl shadow-lg">
            <CreditCard className="h-8 w-8 text-primary-foreground" />
          </div>
        </div>
        <div>
          <h1 className="text-4xl font-bold text-foreground">إدارة طرق الدفع</h1>
          <p className="text-lg text-muted-foreground mt-2">
            قم بإدارة وتكوين طرق الدفع المختلفة للعملاء
          </p>
        </div>
      </div>

      {/* Payment Methods Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {paymentProviders.map((provider) => {
          const existingMethod = paymentMethods.find(m => m.provider === provider.id);
          const IconComponent = iconMap[provider.icon as keyof typeof iconMap];
          const isConfigured = !!(existingMethod && existingMethod.api_key);
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
  const [formData, setFormData] = useState({
    is_active: isActive,
    is_live_mode: existingMethod?.is_live_mode || false,
    api_key: existingMethod?.api_key || '',
    secret_key: existingMethod?.secret_key || '',
    webhook_secret: existingMethod?.webhook_secret || '',
    ...provider.fields.reduce((acc: any, field: any) => {
      acc[field.key] = existingMethod?.configuration?.[field.key] || provider.defaultConfig[field.key] || '';
      return acc;
    }, {})
  });

  const handleSave = () => {
    onUpdate(provider.id, formData);
    setIsOpen(false);
  };

  const getStatusIcon = () => {
    if (!isConfigured) return <Clock className="h-4 w-4 text-yellow-500" />;
    if (isActive) return <CheckCircle className="h-4 w-4 text-green-500" />;
    return <AlertCircle className="h-4 w-4 text-gray-500" />;
  };

  const getStatusText = () => {
    if (!isConfigured) return 'غير مُكوّن';
    if (isActive) return 'مفعل';
    return 'معطل';
  };

  const getStatusColor = () => {
    if (!isConfigured) return 'border-yellow-200 bg-yellow-50';
    if (isActive) return 'border-green-200 bg-green-50';
    return 'border-gray-200 bg-gray-50';
  };

  return (
    <Card className={`relative transition-all duration-300 hover:shadow-lg ${getStatusColor()}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-3 bg-gradient-to-br ${provider.color} rounded-xl shadow-md`}>
              <IconComponent className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold">{provider.name_ar}</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                {provider.description}
              </CardDescription>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <Badge variant={isActive && isConfigured ? "default" : "secondary"} className="text-xs">
              {getStatusText()}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Configuration Status */}
        <div className="p-3 rounded-lg bg-muted/50 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">حالة التكوين:</span>
            <span className={isConfigured ? 'text-green-600' : 'text-yellow-600'}>
              {isConfigured ? 'مُكوّن' : 'يحتاج تكوين'}
            </span>
          </div>
          
          {isConfigured && (
            <>
              <div className="flex items-center justify-between text-sm">
                <span>الوضع:</span>
                <span className={existingMethod?.is_live_mode ? 'text-red-600' : 'text-blue-600'}>
                  {existingMethod?.is_live_mode ? 'مباشر' : 'تجريبي'}
                </span>
              </div>
              
              {existingMethod?.api_key && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">API Key:</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onToggleSecrets(existingMethod.id)}
                      className="h-6 w-6 p-0"
                    >
                      {showSecrets[existingMethod.id] ? 
                        <EyeOff className="h-3 w-3" /> : 
                        <Eye className="h-3 w-3" />
                      }
                    </Button>
                  </div>
                  <div className="text-xs font-mono bg-muted p-2 rounded text-center">
                    {showSecrets[existingMethod.id] 
                      ? existingMethod.api_key 
                      : '••••••••••••••••'
                    }
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button 
                variant={isConfigured ? "outline" : "default"} 
                className="flex-1 gap-2"
                disabled={saving}
              >
                <Settings className="h-4 w-4" />
                {isConfigured ? 'إعدادات' : 'تكوين'}
              </Button>
            </DialogTrigger>
            
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <div className={`p-2 bg-gradient-to-br ${provider.color} rounded-lg`}>
                    <IconComponent className="h-5 w-5 text-white" />
                  </div>
                  إعدادات {provider.name_ar}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Status Switches */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="is_active" className="text-sm font-medium">تفعيل الطريقة</Label>
                    <Switch
                      id="is_active"
                      checked={formData.is_active}
                      onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="is_live_mode" className="text-sm font-medium">الوضع المباشر</Label>
                    <Switch
                      id="is_live_mode"
                      checked={formData.is_live_mode}
                      onCheckedChange={(checked) => setFormData({...formData, is_live_mode: checked})}
                    />
                  </div>
                </div>

                {/* API Fields */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Key className="h-5 w-5 text-primary" />
                    بيانات الاتصال
                  </h3>
                  
                  {provider.fields.map((field: any) => (
                    <div key={field.key} className="space-y-2">
                      <Label htmlFor={field.key} className="text-sm font-medium">
                        {field.label}
                        {field.required && <span className="text-red-500 mr-1">*</span>}
                      </Label>
                      <Input
                        id={field.key}
                        type={field.type}
                        value={formData[field.key as keyof typeof formData]}
                        onChange={(e) => setFormData({...formData, [field.key]: e.target.value})}
                        placeholder={`أدخل ${field.label}`}
                        required={field.required}
                        className="font-mono text-sm"
                      />
                    </div>
                  ))}
                </div>

                {/* Default Configuration */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">التكوين الافتراضي</h3>
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <pre className="text-xs text-muted-foreground font-mono">
                      {JSON.stringify(provider.defaultConfig, null, 2)}
                    </pre>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t">
                  <Button 
                    onClick={handleSave} 
                    className="flex-1 gap-2"
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        جاري الحفظ...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        حفظ الإعدادات
                      </>
                    )}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                    إلغاء
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          {isConfigured && (
            <Button
              variant={isActive ? "secondary" : "default"}
              size="sm"
              onClick={() => {
                const newFormData = { ...formData, is_active: !isActive };
                setFormData(newFormData);
                onUpdate(provider.id, newFormData);
              }}
              disabled={saving}
              className="px-3"
            >
              {isActive ? 'تعطيل' : 'تفعيل'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}