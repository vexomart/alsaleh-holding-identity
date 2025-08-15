import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { 
  ShoppingCart, 
  Settings, 
  Upload, 
  CheckCircle, 
  AlertCircle,
  RefreshCw,
  Eye,
  Link
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Product {
  id: string;
  title: string;
  description: string;
  price: string;
  currency: string;
  availability: 'in_stock' | 'out_of_stock' | 'preorder';
  condition: 'new' | 'used' | 'refurbished';
  brand: string;
  gtin?: string;
  mpn?: string;
  imageUrl: string;
  category: string;
  status?: 'approved' | 'pending' | 'disapproved';
}

export const GoogleMerchantAPIIntegration = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [merchantId, setMerchantId] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');

  // Sample products data
  const sampleProducts: Product[] = [
    {
      id: 'prod_001',
      title: 'خدمة تصميم الشعارات الاحترافية',
      description: 'تصميم شعار احترافي مع هوية بصرية متكاملة',
      price: '500.00',
      currency: 'SAR',
      availability: 'in_stock',
      condition: 'new',
      brand: 'الصالح القابضة',
      imageUrl: '/src/assets/services/logo-design.jpg',
      category: 'خدمات التصميم',
      status: 'approved'
    },
    {
      id: 'prod_002',
      title: 'باقة الهوية التجارية الكاملة',
      description: 'باقة شاملة للهوية التجارية تشمل الشعار والمواد التسويقية',
      price: '1500.00',
      currency: 'SAR',
      availability: 'in_stock',
      condition: 'new',
      brand: 'الصالح القابضة',
      imageUrl: '/src/assets/services/brand-package.jpg',
      category: 'خدمات التصميم',
      status: 'pending'
    },
    {
      id: 'prod_003',
      title: 'تصميم الكتيبات والبروشورات',
      description: 'تصميم كتيبات وبروشورات احترافية للشركات',
      price: '300.00',
      currency: 'SAR',
      availability: 'in_stock',
      condition: 'new',
      brand: 'الصالح القابضة',
      imageUrl: '/src/assets/services/brochure-design.jpg',
      category: 'خدمات التصميم والطباعة',
      status: 'approved'
    }
  ];

  useEffect(() => {
    setProducts(sampleProducts);
    // Check if Merchant Center is already connected
    checkConnectionStatus();
  }, []);

  const checkConnectionStatus = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('google-merchant-status');
      if (data?.connected) {
        setIsConnected(true);
        setMerchantId(data.merchantId);
      }
    } catch (error) {
      console.log('Connection status check failed:', error);
    }
  };

  const handleConnectMerchant = async () => {
    if (!merchantId) {
      toast.error('يرجى إدخال معرف المتجر');
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('google-merchant-connect', {
        body: { merchantId }
      });

      if (error) throw error;

      setIsConnected(true);
      toast.success('تم ربط المتجر بنجاح مع Google Merchant Center');
    } catch (error) {
      toast.error('فشل في ربط المتجر');
      console.error('Merchant connection error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const syncProductsToGoogle = async () => {
    if (!isConnected) {
      toast.error('يجب ربط المتجر أولاً');
      return;
    }

    setSyncStatus('syncing');
    try {
      const { data, error } = await supabase.functions.invoke('google-merchant-sync', {
        body: { products }
      });

      if (error) throw error;

      setSyncStatus('success');
      toast.success(`تم رفع ${products.length} منتج بنجاح إلى Google Merchant Center`);
    } catch (error) {
      setSyncStatus('error');
      toast.error('فشل في رفع المنتجات');
      console.error('Sync error:', error);
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'disapproved': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <RefreshCw className="w-4 h-4" />;
      case 'disapproved': return <AlertCircle className="w-4 h-4" />;
      default: return <Eye className="w-4 h-4" />;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">ربط Google Merchant Center</h1>
          <p className="text-muted-foreground mt-2">
            إدارة ومزامنة منتجاتك مع Google Merchant Center باستخدام API
          </p>
        </div>
        <Badge variant={isConnected ? "default" : "secondary"} className="flex items-center gap-2">
          <Link className="w-4 h-4" />
          {isConnected ? 'متصل' : 'غير متصل'}
        </Badge>
      </div>

      <Tabs defaultValue="setup" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="setup">الإعداد</TabsTrigger>
          <TabsTrigger value="products">المنتجات</TabsTrigger>
          <TabsTrigger value="sync">المزامنة</TabsTrigger>
        </TabsList>

        <TabsContent value="setup" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                إعداد الاتصال مع Google Merchant Center
              </CardTitle>
              <CardDescription>
                قم بربط حسابك مع Google Merchant Center لبدء رفع المنتجات
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="merchant-id">معرف المتجر (Merchant ID)</Label>
                <Input
                  id="merchant-id"
                  placeholder="مثال: 1234567890"
                  value={merchantId}
                  onChange={(e) => setMerchantId(e.target.value)}
                  disabled={isConnected}
                />
              </div>
              
              {!isConnected ? (
                <Button 
                  onClick={handleConnectMerchant} 
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? 'جاري الربط...' : 'ربط المتجر'}
                </Button>
              ) : (
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 text-green-800">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">تم ربط المتجر بنجاح</span>
                  </div>
                  <p className="text-green-600 text-sm mt-1">
                    معرف المتجر: {merchantId}
                  </p>
                </div>
              )}

              <div className="pt-4 border-t">
                <h3 className="font-semibold mb-2">خطوات الإعداد:</h3>
                <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                  <li>إنشاء حساب في Google Merchant Center</li>
                  <li>الحصول على معرف المتجر (Merchant ID)</li>
                  <li>إعداد API credentials في Google Cloud Console</li>
                  <li>ربط المتجر باستخدام النموذج أعلاه</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                إدارة المنتجات ({products.length})
              </CardTitle>
              <CardDescription>
                عرض وإدارة المنتجات المتاحة للرفع إلى Google Merchant Center
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {products.map((product) => (
                  <div key={product.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <img 
                      src={product.imageUrl} 
                      alt={product.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1 space-y-1">
                      <h3 className="font-medium">{product.title}</h3>
                      <p className="text-sm text-muted-foreground">{product.description}</p>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{product.price} {product.currency}</span>
                        <Badge variant="outline">{product.category}</Badge>
                        <Badge 
                          variant="outline" 
                          className={`${getStatusColor(product.status)} flex items-center gap-1`}
                        >
                          {getStatusIcon(product.status)}
                          {product.status === 'approved' ? 'معتمد' : 
                           product.status === 'pending' ? 'قيد المراجعة' : 
                           product.status === 'disapproved' ? 'مرفوض' : 'جديد'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sync" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                مزامنة المنتجات
              </CardTitle>
              <CardDescription>
                رفع المنتجات إلى Google Merchant Center وتتبع حالة المزامنة
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{products.length}</div>
                  <div className="text-sm text-blue-600">إجمالي المنتجات</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {products.filter(p => p.status === 'approved').length}
                  </div>
                  <div className="text-sm text-green-600">معتمد</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">
                    {products.filter(p => p.status === 'pending').length}
                  </div>
                  <div className="text-sm text-yellow-600">قيد المراجعة</div>
                </div>
              </div>

              <Button 
                onClick={syncProductsToGoogle}
                disabled={!isConnected || syncStatus === 'syncing'}
                className="w-full"
                size="lg"
              >
                {syncStatus === 'syncing' ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    جاري الرفع...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    رفع المنتجات إلى Google Merchant Center
                  </>
                )}
              </Button>

              {syncStatus === 'success' && (
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 text-green-800">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">تم رفع المنتجات بنجاح</span>
                  </div>
                </div>
              )}

              {syncStatus === 'error' && (
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center gap-2 text-red-800">
                    <AlertCircle className="w-5 h-5" />
                    <span className="font-medium">فشل في رفع المنتجات</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};