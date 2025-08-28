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
      // Mock data for demonstration
      const mockData: AffiliateData = {
        affiliate_code: 'AFF2024001',
        total_referrals: 12,
        successful_referrals: 8,
        total_earnings: 5200,
        pending_earnings: 1500,
        paid_earnings: 3700,
        commission_rate: 10,
        referral_link: 'https://tasaheel.sa/ref/AFF2024001',
        current_level: 'ذهبي',
        next_level_target: 10000
      };

      const mockTransactions: ReferralTransaction[] = [
        {
          id: '1',
          referred_user: 'أحمد محمد العلي',
          service_type: 'تطوير موقع إلكتروني',
          commission_amount: 1500,
          status: 'paid',
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          referred_user: 'فاطمة سعد الزهراني',
          service_type: 'تصميم هوية بصرية',
          commission_amount: 800,
          status: 'pending',
          created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '3',
          referred_user: 'خالد أحمد المطيري',
          service_type: 'تطوير تطبيق جوال',
          commission_amount: 2500,
          status: 'paid',
          created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];

      setAffiliateData(mockData);
      setTransactions(mockTransactions);
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
      'برونزي': 'text-orange-600',
      'فضي': 'text-gray-600',
      'ذهبي': 'text-yellow-600',
      'بلاتيني': 'text-purple-600',
      'ماسي': 'text-blue-600'
    };
    return colors[level as keyof typeof colors] || 'text-gray-600';
  };

  const successRate = affiliateData.total_referrals > 0 
    ? (affiliateData.successful_referrals / affiliateData.total_referrals * 100).toFixed(1)
    : '0';

  const progressToNextLevel = affiliateData.next_level_target > 0 
    ? (affiliateData.total_earnings / affiliateData.next_level_target * 100).toFixed(1)
    : '0';

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-64"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-32 bg-muted rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8" dir="rtl">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="p-3 bg-gradient-to-br from-primary to-primary/80 rounded-full">
            <Users className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">التسويق بالعمولة</h1>
            <p className="text-muted-foreground">اربح من خلال إحالة العملاء الجدد</p>
          </div>
        </div>
        
        <div className="flex items-center justify-center gap-3">
          <Badge className={`px-4 py-2 text-lg ${getLevelColor(affiliateData.current_level)} bg-muted`}>
            <Award className="w-5 h-5 ml-2" />
            مستوى {affiliateData.current_level}
          </Badge>
          <Badge variant="outline" className="px-4 py-2">
            كود المسوق: {affiliateData.affiliate_code}
          </Badge>
        </div>
      </div>

      {/* Referral Link Card */}
      <Card className="border border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link className="w-5 h-5" />
            رابط الإحالة الخاص بك
          </CardTitle>
          <CardDescription>
            شارك هذا الرابط مع الأصدقاء واحصل على عمولة من كل عميل جديد
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input 
              value={affiliateData.referral_link} 
              readOnly 
              className="flex-1 font-mono text-sm"
            />
            <Button onClick={copyReferralLink} variant="outline">
              <Copy className="w-4 h-4 ml-2" />
              نسخ
            </Button>
            <Button variant="outline">
              <Share className="w-4 h-4 ml-2" />
              مشاركة
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <Button variant="outline" className="justify-start">
              <Mail className="w-4 h-4 ml-2" />
              مشاركة عبر البريد الإلكتروني
            </Button>
            <Button variant="outline" className="justify-start">
              <MessageSquare className="w-4 h-4 ml-2" />
              مشاركة عبر واتساب
            </Button>
            <Button variant="outline" className="justify-start">
              <Globe className="w-4 h-4 ml-2" />
              مشاركة على وسائل التواصل
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border border-border/50 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">إجمالي الإحالات</p>
                <p className="text-2xl font-bold">{affiliateData.total_referrals}</p>
                <p className="text-xs text-green-600 font-medium">{affiliateData.successful_referrals} ناجحة</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/50 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">معدل النجاح</p>
                <p className="text-2xl font-bold text-green-600">{successRate}%</p>
                <p className="text-xs text-muted-foreground">من الإحالات</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Target className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/50 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">إجمالي الأرباح</p>
                <p className="text-2xl font-bold text-green-600">
                  {affiliateData.total_earnings.toLocaleString()} ريال
                </p>
                <p className="text-xs text-muted-foreground">نسبة العمولة {affiliateData.commission_rate}%</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/50 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">أرباح معلقة</p>
                <p className="text-2xl font-bold text-orange-600">
                  {affiliateData.pending_earnings.toLocaleString()} ريال
                </p>
                <p className="text-xs text-muted-foreground">في انتظار الصرف</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Level Progress */}
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

      {/* Recent Transactions */}
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
    </div>
  );
};

export default ClientAffiliate;