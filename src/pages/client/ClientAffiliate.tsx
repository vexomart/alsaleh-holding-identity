import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Link,
  Copy,
  DollarSign,
  Users,
  TrendingUp,
  Target,
  Star,
  Gift,
  Calendar,
  Download,
  Share,
  BarChart3,
  CheckCircle,
  Clock,
  Award,
  Zap,
  Globe,
  Mail,
  MessageSquare
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface AffiliateData {
  affiliate_code: string;
  total_referrals: number;
  successful_referrals: number;
  total_earnings: number;
  pending_earnings: number;
  paid_earnings: number;
  commission_rate: number;
  referral_link: string;
  current_level: string;
  next_level_target: number;
}

interface ReferralTransaction {
  id: string;
  referred_user: string;
  service_type: string;
  commission_amount: number;
  status: string;
  created_at: string;
}

const ClientAffiliate = () => {
  const [affiliateData, setAffiliateData] = useState<AffiliateData>({
    affiliate_code: '',
    total_referrals: 0,
    successful_referrals: 0,
    total_earnings: 0,
    pending_earnings: 0,
    paid_earnings: 0,
    commission_rate: 0,
    referral_link: '',
    current_level: '',
    next_level_target: 0
  });
  const [transactions, setTransactions] = useState<ReferralTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAffiliateData();
  }, []);

  const fetchAffiliateData = async () => {
    try {
      setLoading(true);
      
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        toast({
          title: "خطأ في المصادقة",
          description: "يجب تسجيل الدخول أولاً",
          variant: "destructive",
        });
        return;
      }

      // جلب بيانات برنامج التسويق بالعمولة
      const { data: affiliateProgram, error: affiliateError } = await supabase
        .from('affiliate_program')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (affiliateError) {
        console.error('Error fetching affiliate program:', affiliateError);
      }

      // إنشاء برنامج تسويق إذا لم يكن موجوداً
      let currentAffiliateProgram = affiliateProgram;
      if (!affiliateProgram) {
        // إنشاء كود التسويق
        const affiliateCode = 'AFF' + Date.now().toString().slice(-6);
        
        const { data: newProgram, error: createError } = await supabase
          .from('affiliate_program')
          .insert({
            user_id: user.id,
            affiliate_code: affiliateCode,
            commission_rate: 10.00,
            level_name: 'برونزي',
            level_threshold: 5
          })
          .select()
          .single();

        if (createError) {
          console.error('Error creating affiliate program:', createError);
          throw createError;
        }
        currentAffiliateProgram = newProgram;
      }

      // جلب الإحالات
      const { data: referrals, error: referralsError } = await supabase
        .from('affiliate_referrals')
        .select('*')
        .eq('affiliate_user_id', user.id);

      if (referralsError) {
        console.error('Error fetching referrals:', referralsError);
      }

      // جلب العمولات بطريقة مبسطة
      const { data: commissions, error: commissionsError } = await supabase
        .from('affiliate_commissions')
        .select('*')
        .eq('affiliate_user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (commissionsError) {
        console.error('Error fetching commissions:', commissionsError);
      }

      // حساب الإحصائيات
      const totalReferrals = referrals?.length || 0;
      const successfulReferrals = commissions?.length || 0;
      const totalEarnings = commissions?.reduce((sum, commission) => sum + Number(commission.commission_amount), 0) || 0;
      const pendingEarnings = commissions?.filter(c => c.status === 'pending').reduce((sum, commission) => sum + Number(commission.commission_amount), 0) || 0;
      const paidEarnings = commissions?.filter(c => c.status === 'paid').reduce((sum, commission) => sum + Number(commission.commission_amount), 0) || 0;

      // تحديد المستوى التالي
      const levelThresholds = {
        'برونزي': { next: 'فضي', target: 5000 },
        'فضي': { next: 'ذهبي', target: 15000 },
        'ذهبي': { next: 'بلاتيني', target: 50000 },
        'بلاتيني': { next: 'ماسي', target: 100000 },
        'ماسي': { next: 'ماسي', target: 100000 }
      };

      const currentLevel = currentAffiliateProgram?.level_name || 'برونزي';
      const nextLevelTarget = levelThresholds[currentLevel as keyof typeof levelThresholds]?.target || 5000;

      // إنشاء رابط الإحالة الصحيح
      const referralLink = `https://alialshehriholding.com/auth?ref=${currentAffiliateProgram?.affiliate_code}`;

      const fetchedData: AffiliateData = {
        affiliate_code: currentAffiliateProgram?.affiliate_code || '',
        total_referrals: totalReferrals,
        successful_referrals: successfulReferrals,
        total_earnings: totalEarnings,
        pending_earnings: pendingEarnings,
        paid_earnings: paidEarnings,
        commission_rate: currentAffiliateProgram?.commission_rate || 10,
        referral_link: referralLink,
        current_level: currentLevel,
        next_level_target: nextLevelTarget
      };

      // تحويل بيانات العمولات لعرضها - استخدام بيانات مؤقتة حتى يتم ربط الجداول
      const transformedTransactions: ReferralTransaction[] = (commissions || []).slice(0, 5).map((commission, index) => ({
        id: commission.id,
        referred_user: `عميل ${index + 1}`,
        service_type: 'خدمة رقمية',
        commission_amount: Number(commission.commission_amount || 0),
        status: commission.status || 'pending',
        created_at: commission.created_at
      }));

      setAffiliateData(fetchedData);
      setTransactions(transformedTransactions);
      setLoading(false);
    } catch (error: any) {
      console.error('Error fetching affiliate data:', error);
      toast({
        title: "خطأ في تحميل بيانات التسويق بالعمولة",
        description: error.message,
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const copyReferralLink = () => {
    navigator.clipboard.writeText(affiliateData.referral_link);
    toast({
      title: "تم النسخ بنجاح",
      description: "تم نسخ رابط الإحالة إلى الحافظة",
    });
  };

  const getStatusColor = (status: string) => {
    const colors = {
      paid: 'bg-green-100 text-green-800 border-green-200',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      rejected: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  const getStatusText = (status: string) => {
    const statusMap = {
      paid: 'مدفوع',
      pending: 'في الانتظار',
      rejected: 'مرفوض'
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      paid: <CheckCircle className="w-4 h-4" />,
      pending: <Clock className="w-4 h-4" />,
      rejected: <Clock className="w-4 h-4" />
    };
    return icons[status as keyof typeof icons] || icons.pending;
  };

  const getLevelColor = (level: string) => {
    const colors = {
      'برونزي': 'text-orange-600 bg-orange-50',
      'فضي': 'text-gray-600 bg-gray-50',
      'ذهبي': 'text-yellow-600 bg-yellow-50',
      'بلاتيني': 'text-purple-600 bg-purple-50',
      'ماسي': 'text-blue-600 bg-blue-50'
    };
    return colors[level as keyof typeof colors] || 'text-gray-600 bg-gray-50';
  };

  const getLevelBenefits = (level: string) => {
    const benefits = {
      'برونزي': ['عمولة 10%', 'دعم أساسي', 'تقارير شهرية'],
      'فضي': ['عمولة 12%', 'دعم متقدم', 'تقارير أسبوعية', 'مواد تسويقية'],
      'ذهبي': ['عمولة 15%', 'دعم مخصص', 'تقارير يومية', 'مواد تسويقية متقدمة'],
      'بلاتيني': ['عمولة 18%', 'مدير حساب مخصص', 'تقارير فورية', 'عروض حصرية'],
      'ماسي': ['عمولة 20%', 'دعم كامل', 'أولوية في كل شيء', 'شراكة استراتيجية']
    };
    return benefits[level as keyof typeof benefits] || benefits['برونزي'];
  };

  const successRate = affiliateData.total_referrals > 0 
    ? (affiliateData.successful_referrals / affiliateData.total_referrals * 100).toFixed(1)
    : '0';

  const progressToNextLevel = affiliateData.next_level_target > 0 
    ? (affiliateData.total_earnings / affiliateData.next_level_target * 100).toFixed(1)
    : '0';

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-muted rounded w-48 mx-auto"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-muted rounded-lg"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-32 bg-muted rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6" dir="rtl" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-primary to-primary/80 rounded-xl shadow-lg">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-foreground tracking-tight">التسويق بالعمولة</h1>
            <p className="text-sm text-muted-foreground">اربح من خلال إحالة العملاء الجدد</p>
          </div>
        </div>
        
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <Badge className={`px-3 py-1.5 text-sm ${getLevelColor(affiliateData.current_level)} bg-muted border shadow-sm`}>
            <Award className="w-4 h-4 ml-1.5" />
            مستوى {affiliateData.current_level}
          </Badge>
          <Badge variant="outline" className="px-3 py-1.5 text-xs">
            كود المسوق: {affiliateData.affiliate_code}
          </Badge>
        </div>
      </div>

      {/* Referral Link Card */}
      <Card className="border border-border/50 shadow-sm hover:shadow-md transition-all duration-200">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg font-medium">
            <Link className="w-4 h-4" />
            رابط الإحالة الخاص بك
          </CardTitle>
          <CardDescription className="text-sm">
            شارك هذا الرابط مع الأصدقاء واحصل على عمولة من كل عميل جديد
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 flex-col sm:flex-row">
            <Input 
              value={affiliateData.referral_link} 
              readOnly 
              className="flex-1 font-mono text-xs sm:text-sm bg-muted/50 border-muted"
            />
            <div className="flex gap-2">
              <Button onClick={copyReferralLink} variant="outline" size="sm" className="text-xs">
                <Copy className="w-3 h-3 ml-1" />
                نسخ
              </Button>
              <Button variant="outline" size="sm" className="text-xs">
                <Share className="w-3 h-3 ml-1" />
                مشاركة
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <Button 
              variant="outline" 
              size="sm"
              className="justify-start text-xs h-9"
              onClick={() => window.open(`mailto:?subject=انضم إلى شركة علي صالح الشهري القابضة&body=انضم إلى شركة علي صالح الشهري القابضة واحصل على خدمات رقمية متميزة: ${affiliateData.referral_link}`, '_blank')}
            >
              <Mail className="w-3 h-3 ml-1.5" />
              البريد الإلكتروني
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="justify-start text-xs h-9"
              onClick={() => window.open(`https://wa.me/?text=انضم إلى شركة علي صالح الشهري القابضة واحصل على خدمات رقمية متميزة ${affiliateData.referral_link}`, '_blank')}
            >
              <MessageSquare className="w-3 h-3 ml-1.5" />
              واتساب
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="justify-start text-xs h-9 sm:col-span-2 lg:col-span-1"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: 'انضم إلى شركة علي صالح الشهري القابضة',
                    text: 'احصل على خدمات رقمية متميزة',
                    url: affiliateData.referral_link,
                  });
                }
              }}
            >
              <Globe className="w-3 h-3 ml-1.5" />
              وسائل التواصل
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border border-border/50 shadow-sm hover:shadow-md transition-all duration-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">إجمالي الإحالات</p>
                <p className="text-xl font-semibold">{affiliateData.total_referrals}</p>
                <p className="text-xs text-green-600 font-medium">{affiliateData.successful_referrals} ناجحة</p>
              </div>
              <div className="p-2.5 bg-blue-50 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/50 shadow-sm hover:shadow-md transition-all duration-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">معدل النجاح</p>
                <p className="text-xl font-semibold text-green-600">{successRate}%</p>
                <p className="text-xs text-muted-foreground">من الإحالات</p>
              </div>
              <div className="p-2.5 bg-green-50 rounded-lg">
                <Target className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/50 shadow-sm hover:shadow-md transition-all duration-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">إجمالي الأرباح</p>
                <p className="text-xl font-semibold text-green-600">
                  {affiliateData.total_earnings.toLocaleString()} ريال
                </p>
                <p className="text-xs text-muted-foreground">نسبة العمولة {affiliateData.commission_rate}%</p>
              </div>
              <div className="p-2.5 bg-green-50 rounded-lg">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/50 shadow-sm hover:shadow-md transition-all duration-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">أرباح معلقة</p>
                <p className="text-xl font-semibold text-orange-600">
                  {affiliateData.pending_earnings.toLocaleString()} ريال
                </p>
                <p className="text-xs text-muted-foreground">في انتظار الصرف</p>
              </div>
              <div className="p-2.5 bg-orange-50 rounded-lg">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Level Progress & Benefits */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* التقدم نحو المستوى التالي */}
        <Card className="border border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              التقدم نحو المستوى التالي
            </CardTitle>
            <CardDescription>
              أكمل {affiliateData.next_level_target.toLocaleString()} ريال لتصل إلى المستوى التالي
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">التقدم الحالي</span>
                <span className="text-sm font-bold">{progressToNextLevel}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-primary to-primary/80 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(parseFloat(progressToNextLevel), 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{affiliateData.total_earnings.toLocaleString()} ريال</span>
                <span>{affiliateData.next_level_target.toLocaleString()} ريال</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* مزايا المستوى الحالي */}
        <Card className="border border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5" />
              مزايا مستوى {affiliateData.current_level}
            </CardTitle>
            <CardDescription>
              استمتع بالمزايا الحصرية لمستواك الحالي
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {getLevelBenefits(affiliateData.current_level).map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm">{benefit}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border border-border/50 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
          <CardContent className="p-6 text-center">
            <div className="p-3 bg-blue-100 rounded-full w-fit mx-auto mb-3 group-hover:scale-110 transition-transform">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold mb-2">تقارير الأداء</h3>
            <p className="text-sm text-muted-foreground">عرض تقارير مفصلة عن أدائك</p>
          </CardContent>
        </Card>

        <Card className="border border-border/50 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
          <CardContent className="p-6 text-center">
            <div className="p-3 bg-green-100 rounded-full w-fit mx-auto mb-3 group-hover:scale-110 transition-transform">
              <Download className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold mb-2">طلب سحب</h3>
            <p className="text-sm text-muted-foreground">اطلب سحب أرباحك المعلقة</p>
          </CardContent>
        </Card>

        <Card className="border border-border/50 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
          <CardContent className="p-6 text-center">
            <div className="p-3 bg-purple-100 rounded-full w-fit mx-auto mb-3 group-hover:scale-110 transition-transform">
              <Gift className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold mb-2">أدوات التسويق</h3>
            <p className="text-sm text-muted-foreground">احصل على مواد ترويجية</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions & Referrals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* آخر المعاملات */}
        <Card className="border border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle>آخر المعاملات</CardTitle>
            <CardDescription>
              سجل بآخر عمولاتك من الإحالات الناجحة
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 border border-border/50 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-green-100 rounded-full">
                      <DollarSign className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">{transaction.referred_user}</p>
                      <p className="text-sm text-muted-foreground">{transaction.service_type}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(transaction.created_at).toLocaleDateString('ar-SA')}
                      </p>
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="text-lg font-bold text-green-600">
                      +{transaction.commission_amount.toLocaleString()} ريال
                    </p>
                    <Badge className={`text-xs ${getStatusColor(transaction.status)}`}>
                      {getStatusIcon(transaction.status)}
                      <span className="mr-1">{getStatusText(transaction.status)}</span>
                    </Badge>
                  </div>
                </div>
              ))}
            </div>

            {transactions.length === 0 && (
              <div className="text-center py-12">
                <DollarSign className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">لا توجد معاملات حتى الآن</h3>
                <p className="text-muted-foreground">
                  ابدأ بمشاركة رابط الإحالة لتحصل على أول عمولة
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* الإحالات الجديدة */}
        <Card className="border border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              الإحالات الحديثة
            </CardTitle>
            <CardDescription>
              العملاء الجدد الذين انضموا عبر رابطك
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {affiliateData.total_referrals > 0 ? (
                // عرض الإحالات الحديثة (يمكن تطويرها لاحقاً لجلب البيانات الفعلية)
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full">
                        <Users className="w-4 h-4 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="font-medium text-green-800 dark:text-green-200">عميل جديد انضم!</p>
                        <p className="text-xs text-green-600 dark:text-green-400">منذ ساعتين</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      جديد
                    </Badge>
                  </div>
                  
                  <div className="text-center p-6 text-muted-foreground">
                    <p className="text-sm">
                      إجمالي {affiliateData.total_referrals} إحالة مسجلة
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">لا توجد إحالات بعد</h3>
                  <p className="text-muted-foreground">
                    شارك رابط الإحالة الخاص بك لتبدأ في كسب العمولات
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientAffiliate;