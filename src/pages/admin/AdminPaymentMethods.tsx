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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  CreditCard, 
  Plus, 
  Edit, 
  Trash2, 
  Key, 
  Shield, 
  Globe, 
  Settings,
  Eye,
  EyeOff,
  Smartphone,
  Building2,
  Calendar
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
  Shield,
  Globe
};

export default function AdminPaymentMethods() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null);
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    name_ar: '',
    provider: '',
    icon_name: 'CreditCard',
    api_key: '',
    secret_key: '',
    webhook_secret: '',
    is_active: true,
    is_live_mode: false,
    configuration: '{}'
  });

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let configuration;
      try {
        configuration = JSON.parse(formData.configuration);
      } catch {
        configuration = {};
      }

      const methodData = {
        ...formData,
        configuration,
        api_key: formData.api_key || null,
        secret_key: formData.secret_key || null,
        webhook_secret: formData.webhook_secret || null
      };

      if (editingMethod) {
        const { error } = await supabase
          .from('payment_methods')
          .update(methodData)
          .eq('id', editingMethod.id);

        if (error) throw error;
        toast({
          title: "تم التحديث",
          description: "تم تحديث طريقة الدفع بنجاح"
        });
      } else {
        const { error } = await supabase
          .from('payment_methods')
          .insert(methodData);

        if (error) throw error;
        toast({
          title: "تم الإنشاء",
          description: "تم إنشاء طريقة دفع جديدة"
        });
      }

      setIsDialogOpen(false);
      resetForm();
      fetchPaymentMethods();
    } catch (error) {
      console.error('Error saving payment method:', error);
      toast({
        title: "خطأ",
        description: "فشل في حفظ طريقة الدفع",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف طريقة الدفع؟')) return;

    try {
      const { error } = await supabase
        .from('payment_methods')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "تم الحذف",
        description: "تم حذف طريقة الدفع بنجاح"
      });
      
      fetchPaymentMethods();
    } catch (error) {
      console.error('Error deleting payment method:', error);
      toast({
        title: "خطأ",
        description: "فشل في حذف طريقة الدفع",
        variant: "destructive"
      });
    }
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('payment_methods')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "تم التحديث",
        description: `تم ${!currentStatus ? 'تفعيل' : 'إلغاء تفعيل'} طريقة الدفع`
      });
      
      fetchPaymentMethods();
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "خطأ",
        description: "فشل في تحديث الحالة",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      name_ar: '',
      provider: '',
      icon_name: 'CreditCard',
      api_key: '',
      secret_key: '',
      webhook_secret: '',
      is_active: true,
      is_live_mode: false,
      configuration: '{}'
    });
    setEditingMethod(null);
  };

  const openEditDialog = (method: PaymentMethod) => {
    setEditingMethod(method);
    setFormData({
      name: method.name,
      name_ar: method.name_ar,
      provider: method.provider,
      icon_name: method.icon_name,
      api_key: method.api_key || '',
      secret_key: method.secret_key || '',
      webhook_secret: method.webhook_secret || '',
      is_active: method.is_active,
      is_live_mode: method.is_live_mode,
      configuration: JSON.stringify(method.configuration, null, 2)
    });
    setIsDialogOpen(true);
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
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <CreditCard className="h-8 w-8 text-primary" />
            إدارة طرق الدفع
          </h1>
          <p className="text-muted-foreground mt-2">
            قم بإدارة وتكوين طرق الدفع المختلفة للعملاء
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="gap-2">
              <Plus className="h-4 w-4" />
              إضافة طريقة دفع
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
            <DialogHeader>
              <DialogTitle>
                {editingMethod ? 'تعديل طريقة الدفع' : 'إضافة طريقة دفع جديدة'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic">المعلومات الأساسية</TabsTrigger>
                  <TabsTrigger value="api">API Keys</TabsTrigger>
                  <TabsTrigger value="config">التكوين</TabsTrigger>
                </TabsList>
                
                <TabsContent value="basic" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">الاسم (English)</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="Visa Card"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="name_ar">الاسم (العربية)</Label>
                      <Input
                        id="name_ar"
                        value={formData.name_ar}
                        onChange={(e) => setFormData({...formData, name_ar: e.target.value})}
                        placeholder="فيزا"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="provider">مقدم الخدمة</Label>
                      <Select value={formData.provider} onValueChange={(value) => setFormData({...formData, provider: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر مقدم الخدمة" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="stripe">Stripe</SelectItem>
                          <SelectItem value="paypal">PayPal</SelectItem>
                          <SelectItem value="stc_pay">STC Pay</SelectItem>
                          <SelectItem value="tamara">Tamara</SelectItem>
                          <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                          <SelectItem value="tabby">Tabby</SelectItem>
                          <SelectItem value="mada">Mada</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="icon_name">الأيقونة</Label>
                      <Select value={formData.icon_name} onValueChange={(value) => setFormData({...formData, icon_name: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر الأيقونة" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CreditCard">CreditCard</SelectItem>
                          <SelectItem value="Smartphone">Smartphone</SelectItem>
                          <SelectItem value="Building2">Building2</SelectItem>
                          <SelectItem value="Calendar">Calendar</SelectItem>
                          <SelectItem value="Shield">Shield</SelectItem>
                          <SelectItem value="Globe">Globe</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="is_active"
                        checked={formData.is_active}
                        onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
                      />
                      <Label htmlFor="is_active">مفعل</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="is_live_mode"
                        checked={formData.is_live_mode}
                        onCheckedChange={(checked) => setFormData({...formData, is_live_mode: checked})}
                      />
                      <Label htmlFor="is_live_mode">وضع مباشر</Label>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="api" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="api_key">API Key</Label>
                    <Input
                      id="api_key"
                      type="password"
                      value={formData.api_key}
                      onChange={(e) => setFormData({...formData, api_key: e.target.value})}
                      placeholder="pk_test_..."
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="secret_key">Secret Key</Label>
                    <Input
                      id="secret_key"
                      type="password"
                      value={formData.secret_key}
                      onChange={(e) => setFormData({...formData, secret_key: e.target.value})}
                      placeholder="sk_test_..."
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="webhook_secret">Webhook Secret</Label>
                    <Input
                      id="webhook_secret"
                      type="password"
                      value={formData.webhook_secret}
                      onChange={(e) => setFormData({...formData, webhook_secret: e.target.value})}
                      placeholder="whsec_..."
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="config" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="configuration">التكوين (JSON)</Label>
                    <Textarea
                      id="configuration"
                      value={formData.configuration}
                      onChange={(e) => setFormData({...formData, configuration: e.target.value})}
                      placeholder='{"currencies": ["SAR"], "min_amount": 10, "max_amount": 10000}'
                      rows={8}
                      className="font-mono text-sm"
                    />
                    <p className="text-xs text-muted-foreground">
                      مثال: currencies, min_amount, max_amount, installments, etc.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1">
                  {editingMethod ? 'تحديث' : 'إنشاء'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  إلغاء
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Payment Methods Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paymentMethods.map((method) => {
          const IconComponent = iconMap[method.icon_name as keyof typeof iconMap] || CreditCard;
          const isSecretsVisible = showSecrets[method.id];
          
          return (
            <Card key={method.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <IconComponent className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{method.name_ar}</CardTitle>
                      <CardDescription className="text-sm">{method.name}</CardDescription>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Badge variant={method.is_active ? "default" : "secondary"}>
                      {method.is_active ? 'مفعل' : 'معطل'}
                    </Badge>
                    {method.is_live_mode && (
                      <Badge variant="destructive" className="text-xs">
                        مباشر
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="font-medium">المقدم:</span> {method.provider}
                  </div>
                  
                  {method.api_key && (
                    <div className="text-sm">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">API Key:</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleSecretVisibility(method.id)}
                          className="h-6 w-6 p-0"
                        >
                          {isSecretsVisible ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                        </Button>
                      </div>
                      <code className="text-xs bg-muted p-1 rounded block mt-1 break-all">
                        {isSecretsVisible ? method.api_key : '••••••••••••••••'}
                      </code>
                    </div>
                  )}
                  
                  <div className="text-sm">
                    <span className="font-medium">التكوين:</span>
                    <pre className="text-xs bg-muted p-2 rounded mt-1 overflow-auto">
                      {JSON.stringify(method.configuration, null, 2)}
                    </pre>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 pt-2 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(method)}
                    className="flex-1"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    تعديل
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleStatus(method.id, method.is_active)}
                    className="flex-1"
                  >
                    <Settings className="h-3 w-3 mr-1" />
                    {method.is_active ? 'إلغاء' : 'تفعيل'}
                  </Button>
                  
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(method.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
        
        {paymentMethods.length === 0 && (
          <div className="col-span-full text-center py-12">
            <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">لا توجد طرق دفع</h3>
            <p className="text-muted-foreground mb-4">
              ابدأ بإضافة طريقة دفع جديدة للعملاء
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              إضافة طريقة دفع
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}