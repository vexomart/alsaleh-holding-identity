import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Wallet, Plus, Copy, Eye, User, Shield } from 'lucide-react';
import { db, supabase } from '@/integrations/supabase/db';
import { useToast } from '@/hooks/use-toast';
import { NumberFormatter } from '@/components/NumberFormatter';
import { Building2, CreditCard, Smartphone } from 'lucide-react';
import SEO from '@/components/SEO';

interface WalletData {
  id: string;
  balance: number;
  currency: string;
  user_id: string;
}

interface UserProfile {
  user_id: string;
  email: string;
  full_name?: string;
  phone?: string;
  company?: string;
  role: string;
  site_id: string;
  created_at: string;
  updated_at: string;
}

// Removed Transaction interface - no longer needed

const WalletPage = () => {
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [depositAmount, setDepositAmount] = useState('');
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [depositing, setDepositing] = useState(false);
  const [accountNumberVisible, setAccountNumberVisible] = useState(false);
  const { toast } = useToast();

// Removed payment methods array - using Tap Company gateway

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch user profile
      const { data: profileData } = await db
        .from('profiles')
        .select('user_id, email, full_name, phone, company, role, site_id, created_at, updated_at')
        .eq('user_id', user.id)
        .single();

      if (profileData) {
        const profile = profileData as any;
        setUserProfile({
          user_id: user.id,
          email: user.email,
          full_name: profile?.full_name,
          phone: profile?.phone,
          company: profile?.company,
          role: profile?.role || 'customer',
          site_id: profile?.site_id,
          created_at: profile?.created_at,
          updated_at: profile?.updated_at
        });
      }

      // Fetch wallet
      const { data: walletData, error: walletError } = await db
        .from('customer_wallets')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (walletError && walletError.code !== 'PGRST116') {
        console.error('Wallet error:', walletError);
        return;
      }

      if (!walletData) {
        // Create wallet if doesn't exist
        const { data: newWallet, error: createError } = await db
          .from('customer_wallets')
          .insert({ user_id: user.id, balance: 0 })
          .select()
          .single();

        if (createError) {
          console.error('Create wallet error:', createError);
          return;
        }
        setWallet(newWallet);
      } else {
        setWallet(walletData);
      }

      // Removed transactions fetching - no longer needed
    } catch (error) {
      console.error('Error fetching wallet data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeposit = async () => {
    if (!depositAmount) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال المبلغ",
        variant: "destructive"
      });
      return;
    }

    const amount = parseFloat(depositAmount);
    if (amount <= 0 || amount < 10) {
      toast({
        title: "خطأ",
        description: "الحد الأدنى للإيداع 10 ريال سعودي",
        variant: "destructive"
      });
      return;
    }

    if (!userProfile?.email) {
      toast({
        title: "خطأ",
        description: "يرجى التأكد من بيانات المستخدم",
        variant: "destructive"
      });
      return;
    }

    setDepositing(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "خطأ",
          description: "يرجى تسجيل الدخول أولاً",
          variant: "destructive"
        });
        setDepositing(false);
        return;
      }

      console.log('Starting deposit process...', { amount, email: userProfile.email });

      const response = await supabase.functions.invoke('tap-payment', {
        body: {
          amount,
          currency: 'SAR',
          customer_name: userProfile?.full_name || 'عميل',
          customer_email: userProfile.email,
          customer_phone: userProfile?.phone || '',
          description: `شحن المحفظة الرقمية بمبلغ ${amount} ريال سعودي`,
          product_details: {
            name: 'شحن المحفظة الرقمية',
            description: `إيداع ${amount} ريال سعودي في المحفظة`,
            category: 'wallet_deposit'
          }
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });

      console.log('Tap payment response:', response);

      if (response.error) {
        console.error('Supabase function error:', response.error);
        throw new Error(response.error.message || 'خطأ في الاتصال بخدمة الدفع');
      }

      const { data } = response;
      console.log('Payment data:', data);

      if (data?.success && data?.payment_url) {
        // Close dialog and redirect to Tap payment page
        setIsDepositOpen(false);
        setDepositAmount('');
        window.location.href = data.payment_url;
      } else {
        throw new Error(data?.error || 'فشل في إنشاء رابط الدفع');
      }
    } catch (error) {
      console.error('Deposit error:', error);
      toast({
        title: "خطأ في الشحن",
        description: error.message || "حدث خطأ أثناء إنشاء رابط الدفع، يرجى المحاولة مرة أخرى",
        variant: "destructive"
      });
      setDepositing(false);
    }
  };

// Removed transaction helper functions - no longer needed

  const generateAccountNumber = (userId: string, clientId?: string) => {
    if (clientId) return clientId;
    return `ACC${userId.slice(-8).toUpperCase()}`;
  };

  const copyAccountNumber = () => {
    const accountNumber = generateAccountNumber(userProfile?.user_id || '', '');
    navigator.clipboard.writeText(accountNumber);
    toast({
      title: "تم النسخ",
      description: "تم نسخ رقم الحساب إلى الحافظة"
    });
  };

// Removed stats calculation - no longer needed

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-12 bg-white/60 rounded-xl w-1/3"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-48 bg-white/60 rounded-xl"></div>
                <div className="h-32 bg-white/60 rounded-xl"></div>
              </div>
              <div className="h-96 bg-white/60 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const accountNumber = generateAccountNumber(userProfile?.user_id || '', '');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50" dir="rtl">
      <SEO 
        title="المحفظة الرقمية - شركة علي صالح محمد الشهري"
        description="إدارة أموالك وتتبع معاملاتك بسهولة وأمان مع نظام المحفظة الرقمية المتقدم"
      />
      
      <div className="max-w-6xl mx-auto p-4 lg:p-6 space-y-6">
        {/* Banking Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl text-white">
                <Wallet className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">المحفظة الرقمية</h1>
                <p className="text-slate-600">إدارة أموالك وتتبع معاملاتك بسهولة وأمان</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg">
              <Shield className="h-4 w-4 text-slate-600" />
              <span className="text-sm text-slate-600">محمي وآمن</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Account Information Card */}
            <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-slate-600" />
                    <CardTitle className="text-lg text-slate-800">معلومات الحساب</CardTitle>
                  </div>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                    نشط
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-600 font-medium">اسم العميل</Label>
                    <p className="text-slate-800 font-semibold">{userProfile?.full_name || 'غير محدد'}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-600 font-medium">البريد الإلكتروني</Label>
                    <p className="text-slate-800 font-medium">{userProfile?.email}</p>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <Label className="text-slate-600 font-medium">رقم الحساب</Label>
                      <div className="flex items-center gap-2">
                        <p className="text-lg font-mono font-bold text-slate-800 tracking-wider">
                          {accountNumberVisible ? accountNumber : '●●●●●●●●'}
                        </p>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setAccountNumberVisible(!accountNumberVisible)}
                          className="h-8 w-8 p-0"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={copyAccountNumber}
                          className="h-8 w-8 p-0"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-right">
                      <Label className="text-slate-600 font-medium">شركة علي صالح محمد الشهري</Label>
                      <p className="text-sm text-slate-500">المملكة العربية السعودية</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Balance Card */}
            <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-none shadow-lg">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white/90 font-medium">رصيد المحفظة</CardTitle>
                  <Wallet className="h-6 w-6 text-white/70" />
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl md:text-5xl font-bold tracking-tight">
                      <NumberFormatter number={wallet?.balance || 0} />
                    </span>
                    <span className="text-xl text-white/80 font-medium">ريال سعودي</span>
                  </div>
                  <p className="text-white/70 text-sm">الرصيد المتاح للاستخدام</p>
                </div>

                <Dialog open={isDepositOpen} onOpenChange={setIsDepositOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      size="lg" 
                      className="w-full bg-white text-blue-600 hover:bg-white/90 font-semibold"
                    >
                      <Plus className="h-5 w-5 ml-2" />
                      شحن المحفظة
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md" dir="rtl">
                    <DialogHeader>
                      <DialogTitle className="text-center text-slate-800">شحن المحفظة</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="amount" className="text-slate-700 font-medium">المبلغ (ريال سعودي)</Label>
                          <Input
                            id="amount"
                            type="number"
                            min="10"
                            step="0.01"
                            value={depositAmount}
                            onChange={(e) => setDepositAmount(e.target.value)}
                            placeholder="الحد الأدنى 10 ريال سعودي"
                            className="text-lg font-semibold"
                          />
                          <p className="text-sm text-slate-500">سيتم الدفع بأمان عبر بوابة Tap Company</p>
                        </div>
                        <Button 
                          onClick={handleDeposit} 
                          disabled={depositing || !depositAmount}
                          className="w-full bg-blue-600 hover:bg-blue-700"
                          size="lg"
                        >
                          {depositing ? 'جاري التحويل...' : 'الدفع عبر Tap Company'}
                        </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </div>

          {/* طرق الدفع المتاحة */}
          <div className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl text-slate-800">طرق الدفع المتاحة</CardTitle>
                <p className="text-slate-600">الطرق المدعومة للإيداع والسحب</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4">
                  {/* البنك الراجحي */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Card className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 border-2 hover:border-blue-200">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center text-white">
                              <Building2 className="h-8 w-8" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-bold text-slate-800 mb-1">البنك الراجحي</h3>
                              <p className="text-sm text-slate-600">تحويل بنكي مع إرفاق الإيصال</p>
                              <Badge className="mt-2 bg-blue-100 text-blue-800">متاح</Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md" dir="rtl">
                      <DialogHeader>
                        <DialogTitle className="text-center flex items-center justify-center gap-2">
                          <Building2 className="h-5 w-5" />
                          طلب تحويل - البنك الراجحي
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                          <p className="text-sm text-blue-700">
                            يرجى إرفاق إيصال التحويل البنكي وسيتم التواصل معك خلال 24 ساعة
                          </p>
                        </div>
                        <Button className="w-full">
                          إرسال طلب تحويل
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  {/* STC Pay */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Card className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 border-2 hover:border-purple-200">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center text-white">
                              <Smartphone className="h-8 w-8" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-bold text-slate-800 mb-1">STC Pay</h3>
                              <p className="text-sm text-slate-600">الدفع عبر محفظة STC</p>
                              <Badge className="mt-2 bg-purple-100 text-purple-800">متاح</Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md" dir="rtl">
                      <DialogHeader>
                        <DialogTitle className="text-center flex items-center justify-center gap-2">
                          <Smartphone className="h-5 w-5" />
                          طلب دفع - STC Pay
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                          <p className="text-sm text-purple-700">
                            أدخل رقم المعاملة من STC Pay وسيتم التحقق منها
                          </p>
                        </div>
                        <Button className="w-full bg-purple-600 hover:bg-purple-700">
                          إرسال طلب دفع
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  {/* تمارا */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Card className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 border-2 hover:border-green-200">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-700 rounded-lg flex items-center justify-center text-white">
                              <CreditCard className="h-8 w-8" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-bold text-slate-800 mb-1">تمارا</h3>
                              <p className="text-sm text-slate-600">الدفع الآجل والتقسيط</p>
                              <Badge className="mt-2 bg-green-100 text-green-800">متاح</Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md" dir="rtl">
                      <DialogHeader>
                        <DialogTitle className="text-center flex items-center justify-center gap-2">
                          <CreditCard className="h-5 w-5" />
                          طلب دفع - تمارا
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                          <p className="text-sm text-green-700">
                            أدخل بياناتك وسيتم تفعيل خدمة تمارا لك
                          </p>
                        </div>
                        <Button className="w-full bg-green-600 hover:bg-green-700">
                          إرسال طلب تمارا
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  {/* Visa/MasterCard */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Card className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 border-2 hover:border-indigo-200">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-lg flex items-center justify-center text-white">
                              <CreditCard className="h-8 w-8" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-bold text-slate-800 mb-1">Visa/MasterCard</h3>
                              <p className="text-sm text-slate-600">بطاقة ائتمانية أو مدينة</p>
                              <Badge className="mt-2 bg-indigo-100 text-indigo-800">متاح</Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md" dir="rtl">
                      <DialogHeader>
                        <DialogTitle className="text-center flex items-center justify-center gap-2">
                          <CreditCard className="h-5 w-5" />
                          طلب دفع - بطاقة ائتمانية
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                          <p className="text-sm text-indigo-700">
                            سيتم إرسال رابط دفع آمن إليك
                          </p>
                        </div>
                        <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                          إرسال طلب دفع
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-slate-800">
                  <Shield className="h-5 w-5" />
                  معلومات الدفع
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <h3 className="font-semibold text-blue-800 mb-2">الدفع الآمن</h3>
                  <p className="text-sm text-blue-700">
                    جميع طرق الدفع آمنة ومحمية بأعلى معايير الأمان العالمية
                  </p>
                </div>
                
                <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                  <h3 className="font-semibold text-emerald-800 mb-2">المعالجة السريعة</h3>
                  <p className="text-sm text-emerald-700">
                    يتم مراجعة جميع الطلبات والرد عليها خلال 24 ساعة
                  </p>
                </div>
                
                <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
                  <h3 className="font-semibold text-amber-800 mb-2">الدعم الفني</h3>
                  <p className="text-sm text-amber-700">
                    فريق الدعم متاح على مدار الساعة لمساعدتك
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletPage;