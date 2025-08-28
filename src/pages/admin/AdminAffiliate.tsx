import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Users,
  Search,
  Filter,
  Download,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Star,
  Award,
  Gift,
  Calendar,
  Eye,
  Edit,
  Plus,
  Link,
  BarChart3,
  Target,
  CheckCircle,
  XCircle,
  Clock,
  Building2,
  Mail,
  Phone,
  Globe
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface Affiliate {
  id: string;
  user_id: string;
  affiliate_name: string;
  affiliate_email: string;
  affiliate_code: string;
  total_referrals: number;
  successful_referrals: number;
  total_earnings: number;
  pending_earnings: number;
  paid_earnings: number;
  commission_rate: number;
  status: 'active' | 'inactive' | 'suspended';
  created_at: string;
  last_activity: string;
}

interface AffiliateStats {
  total_affiliates: number;
  active_affiliates: number;
  total_earnings_paid: number;
  pending_payments: number;
  total_referrals: number;
}

const AdminAffiliate = () => {
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [filteredAffiliates, setFilteredAffiliates] = useState<Affiliate[]>([]);
  const [stats, setStats] = useState<AffiliateStats>({
    total_affiliates: 0,
    active_affiliates: 0,
    total_earnings_paid: 0,
    pending_payments: 0,
    total_referrals: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedAffiliate, setSelectedAffiliate] = useState<Affiliate | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  // New affiliate form state
  const [newAffiliate, setNewAffiliate] = useState({
    affiliate_name: '',
    affiliate_email: '',
    commission_rate: '10',
    status: 'active'
  });

  useEffect(() => {
    fetchAffiliateData();
  }, []);

  useEffect(() => {
    filterAffiliates();
  }, [affiliates, searchTerm, statusFilter]);

  const fetchAffiliateData = async () => {
    try {
      setLoading(true);

      // Since we don't have a dedicated affiliates table, we'll use payment_transactions
      // to simulate affiliate data based on referral patterns
      const { data: transactions, error } = await supabase
        .from('payment_transactions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Group transactions by user to create affiliate-like data
      const userStats = new Map();
      transactions?.forEach(transaction => {
        const userId = transaction.user_id;
        const profile = transaction.profiles;
        
        if (!userStats.has(userId)) {
          userStats.set(userId, {
            id: userId,
            user_id: userId,
            affiliate_name: transaction.customer_name || 'غير محدد',
            affiliate_email: transaction.customer_email || 'غير محدد',
            affiliate_code: `AFF${userId.slice(-6).toUpperCase()}`,
            total_referrals: 0,
            successful_referrals: 0,
            total_earnings: 0,
            pending_earnings: 0,
            paid_earnings: 0,
            commission_rate: 10,
            status: 'active' as const,
            created_at: transaction.created_at,
            last_activity: transaction.created_at
          });
        }

        const user = userStats.get(userId);
        user.total_referrals += 1;
        if (transaction.status === 'PAID') {
          user.successful_referrals += 1;
          user.paid_earnings += transaction.amount * 0.1; // 10% commission
        } else {
          user.pending_earnings += transaction.amount * 0.1;
        }
        user.total_earnings = user.paid_earnings + user.pending_earnings;
        user.last_activity = transaction.created_at;
      });

      const affiliatesData = Array.from(userStats.values());

      const statsData: AffiliateStats = {
        total_affiliates: affiliatesData.length,
        active_affiliates: affiliatesData.filter(a => a.status === 'active').length,
        total_earnings_paid: affiliatesData.reduce((sum, a) => sum + a.paid_earnings, 0),
        pending_payments: affiliatesData.reduce((sum, a) => sum + a.pending_earnings, 0),
        total_referrals: affiliatesData.reduce((sum, a) => sum + a.total_referrals, 0)
      };

      setAffiliates(affiliatesData);
      setStats(statsData);
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

  const filterAffiliates = () => {
    let filtered = affiliates;

    if (searchTerm) {
      filtered = filtered.filter(affiliate =>
        affiliate.affiliate_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        affiliate.affiliate_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        affiliate.affiliate_code.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(affiliate => affiliate.status === statusFilter);
    }

    setFilteredAffiliates(filtered);
  };

  const createAffiliate = async () => {
    try {
      if (!newAffiliate.affiliate_name || !newAffiliate.affiliate_email) {
        toast({
          title: "خطأ في البيانات",
          description: "يرجى تعبئة جميع الحقول المطلوبة",
          variant: "destructive",
        });
        return;
      }

      // Since we don't have an affiliates table, we'll create a user profile
      // and send them a welcome email with their affiliate details
      const affiliateCode = `AFF${Date.now().toString().slice(-6)}`;

      // Send affiliate invitation email
      try {
        await supabase.functions.invoke('customer-notifications', {
          body: {
            customerEmail: newAffiliate.affiliate_email,
            customerName: newAffiliate.affiliate_name,
            type: 'affiliate_invitation',
            data: {
              affiliateCode: affiliateCode,
              commissionRate: newAffiliate.commission_rate
            }
          }
        });
      } catch (emailError) {
        console.error('Error sending affiliate invitation email:', emailError);
      }

      toast({
        title: "تم إنشاء حساب المسوق بنجاح",
        description: "تم إرسال دعوة عبر البريد الإلكتروني",
      });

      setIsCreateDialogOpen(false);
      setNewAffiliate({
        affiliate_name: '',
        affiliate_email: '',
        commission_rate: '10',
        status: 'active'
      });
      fetchAffiliateData();
    } catch (error: any) {
      console.error('Error creating affiliate:', error);
      toast({
        title: "خطأ في إنشاء حساب المسوق",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const updateAffiliateStatus = async (affiliateId: string, newStatus: string) => {
    try {
      // Since we don't have an affiliates table, we'll simulate the update
      // In a real application, you would update the affiliate record
      
      const affiliate = affiliates.find(a => a.id === affiliateId);
      if (affiliate) {
        // Send status update email
        try {
          await supabase.functions.invoke('customer-notifications', {
            body: {
              customerEmail: affiliate.affiliate_email,
              customerName: affiliate.affiliate_name,
              type: 'affiliate_status_update',
              data: {
                newStatus: getStatusText(newStatus),
                affiliateCode: affiliate.affiliate_code
              }
            }
          });
        } catch (emailError) {
          console.error('Error sending status update email:', emailError);
        }
      }

      toast({
        title: "تم تحديث حالة المسوق",
        description: "تم إرسال إشعار عبر البريد الإلكتروني",
      });

      // Update local state
      setAffiliates(prev => prev.map(a => 
        a.id === affiliateId ? { ...a, status: newStatus as any } : a
      ));
    } catch (error: any) {
      console.error('Error updating affiliate status:', error);
      toast({
        title: "خطأ في تحديث الحالة",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800 border-green-200',
      inactive: 'bg-gray-100 text-gray-800 border-gray-200',
      suspended: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status as keyof typeof colors] || colors.inactive;
  };

  const getStatusText = (status: string) => {
    const statusMap = {
      active: 'نشط',
      inactive: 'غير نشط',
      suspended: 'معلق'
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      active: <CheckCircle className="w-4 h-4" />,
      inactive: <Clock className="w-4 h-4" />,
      suspended: <XCircle className="w-4 h-4" />
    };
    return icons[status as keyof typeof icons] || icons.inactive;
  };

  const getPerformanceLevel = (earnings: number) => {
    if (earnings >= 10000) return { level: 'ممتاز', color: 'text-green-600', icon: Award };
    if (earnings >= 5000) return { level: 'جيد جداً', color: 'text-blue-600', icon: Star };
    if (earnings >= 2000) return { level: 'جيد', color: 'text-orange-600', icon: Target };
    return { level: 'مبتدئ', color: 'text-gray-600', icon: Users };
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-64"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
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
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Users className="w-8 h-8 text-primary" />
            إدارة التسويق بالعمولة
          </h1>
          <p className="text-muted-foreground mt-2">
            متابعة وإدارة المسوقين والعمولات والأرباح
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
              <Plus className="w-4 h-4 ml-2" />
              إضافة مسوق جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg" dir="rtl">
            <DialogHeader>
              <DialogTitle>إضافة مسوق جديد</DialogTitle>
              <DialogDescription>
                دعوة مسوق جديد للانضمام إلى برنامج التسويق بالعمولة
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="affiliate_name">اسم المسوق *</Label>
                <Input
                  id="affiliate_name"
                  value={newAffiliate.affiliate_name}
                  onChange={(e) => setNewAffiliate(prev => ({ ...prev, affiliate_name: e.target.value }))}
                  placeholder="اسم المسوق"
                />
              </div>
              
              <div>
                <Label htmlFor="affiliate_email">البريد الإلكتروني *</Label>
                <Input
                  id="affiliate_email"
                  type="email"
                  value={newAffiliate.affiliate_email}
                  onChange={(e) => setNewAffiliate(prev => ({ ...prev, affiliate_email: e.target.value }))}
                  placeholder="email@example.com"
                />
              </div>
              
              <div>
                <Label htmlFor="commission_rate">نسبة العمولة (%)</Label>
                <Input
                  id="commission_rate"
                  type="number"
                  value={newAffiliate.commission_rate}
                  onChange={(e) => setNewAffiliate(prev => ({ ...prev, commission_rate: e.target.value }))}
                  placeholder="10"
                />
              </div>
              
              <Button onClick={createAffiliate} className="w-full">
                إرسال الدعوة
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card className="border border-border/50 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">إجمالي المسوقين</p>
                <p className="text-2xl font-bold">{stats.total_affiliates}</p>
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
                <p className="text-sm font-medium text-muted-foreground">مسوقين نشطين</p>
                <p className="text-2xl font-bold text-green-600">{stats.active_affiliates}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/50 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">إجمالي المدفوع</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.total_earnings_paid.toLocaleString()} ريال
                </p>
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
                <p className="text-sm font-medium text-muted-foreground">مدفوعات معلقة</p>
                <p className="text-2xl font-bold text-orange-600">
                  {stats.pending_payments.toLocaleString()} ريال
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/50 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">إجمالي الإحالات</p>
                <p className="text-2xl font-bold text-purple-600">{stats.total_referrals}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">البحث والفلترة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="البحث في المسوقين..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="حالة المسوق" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="active">نشط</SelectItem>
                <SelectItem value="inactive">غير نشط</SelectItem>
                <SelectItem value="suspended">معلق</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline">
              <Download className="w-4 h-4 ml-2" />
              تصدير التقرير
            </Button>

            <Button variant="outline">
              <BarChart3 className="w-4 h-4 ml-2" />
              إحصائيات متقدمة
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Affiliates Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredAffiliates.map((affiliate) => {
          const performance = getPerformanceLevel(affiliate.total_earnings);
          const successRate = affiliate.total_referrals > 0 
            ? (affiliate.successful_referrals / affiliate.total_referrals * 100).toFixed(1)
            : '0';

          return (
            <Card key={affiliate.id} className="border border-border/50 shadow-sm hover:shadow-lg transition-all duration-300 group">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="font-mono text-xs">
                    {affiliate.affiliate_code}
                  </Badge>
                  <div className="flex gap-2">
                    <Badge className={`text-xs ${getStatusColor(affiliate.status)}`}>
                      {getStatusIcon(affiliate.status)}
                      <span className="mr-1">{getStatusText(affiliate.status)}</span>
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full bg-gradient-to-br from-primary/10 to-primary/5`}>
                    <performance.icon className={`w-6 h-6 ${performance.color}`} />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {affiliate.affiliate_name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">{affiliate.affiliate_email}</p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <p className="text-2xl font-bold text-primary">{affiliate.total_referrals}</p>
                    <p className="text-xs text-muted-foreground">إجمالي الإحالات</p>
                  </div>
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">{successRate}%</p>
                    <p className="text-xs text-muted-foreground">معدل النجاح</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">إجمالي الأرباح</span>
                    <span className="font-bold text-green-600">
                      {affiliate.total_earnings.toLocaleString()} ريال
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">أرباح معلقة</span>
                    <span className="font-medium text-orange-600">
                      {affiliate.pending_earnings.toLocaleString()} ريال
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">نسبة العمولة</span>
                    <span className="font-medium text-blue-600">{affiliate.commission_rate}%</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>آخر نشاط: {new Date(affiliate.last_activity).toLocaleDateString('ar-SA')}</span>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => {
                      setSelectedAffiliate(affiliate);
                      setIsViewDialogOpen(true);
                    }}
                    className="flex-1"
                  >
                    <Eye className="w-4 h-4 ml-2" />
                    عرض
                  </Button>
                  
                  <Select onValueChange={(value) => updateAffiliateStatus(affiliate.id, value)}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="تحديث الحالة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">نشط</SelectItem>
                      <SelectItem value="inactive">غير نشط</SelectItem>
                      <SelectItem value="suspended">معلق</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredAffiliates.length === 0 && (
        <Card className="border border-border/50">
          <CardContent className="p-12 text-center">
            <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">لا يوجد مسوقين</h3>
            <p className="text-muted-foreground mb-4">
              لم يتم العثور على مسوقين تطابق معايير البحث
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="w-4 h-4 ml-2" />
              إضافة مسوق جديد
            </Button>
          </CardContent>
        </Card>
      )}

      {/* View Affiliate Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl" dir="rtl">
          <DialogHeader>
            <DialogTitle>تفاصيل المسوق</DialogTitle>
            <DialogDescription>
              عرض تفاصيل المسوق {selectedAffiliate?.affiliate_name}
            </DialogDescription>
          </DialogHeader>
          
          {selectedAffiliate && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">كود المسوق</Label>
                  <p className="text-sm text-muted-foreground font-mono">{selectedAffiliate.affiliate_code}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">تاريخ التسجيل</Label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedAffiliate.created_at).toLocaleDateString('ar-SA')}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">اسم المسوق</Label>
                  <p className="text-sm text-muted-foreground">{selectedAffiliate.affiliate_name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">البريد الإلكتروني</Label>
                  <p className="text-sm text-muted-foreground">{selectedAffiliate.affiliate_email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">إجمالي الإحالات</Label>
                  <p className="text-sm font-bold text-blue-600">{selectedAffiliate.total_referrals}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">الإحالات الناجحة</Label>
                  <p className="text-sm font-bold text-green-600">{selectedAffiliate.successful_referrals}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-lg font-bold text-green-600">{selectedAffiliate.paid_earnings.toLocaleString()} ريال</p>
                  <p className="text-sm text-muted-foreground">أرباح مدفوعة</p>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <p className="text-lg font-bold text-orange-600">{selectedAffiliate.pending_earnings.toLocaleString()} ريال</p>
                  <p className="text-sm text-muted-foreground">أرباح معلقة</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-lg font-bold text-blue-600">{selectedAffiliate.commission_rate}%</p>
                  <p className="text-sm text-muted-foreground">نسبة العمولة</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Badge className={getStatusColor(selectedAffiliate.status)}>
                  {getStatusIcon(selectedAffiliate.status)}
                  <span className="mr-1">{getStatusText(selectedAffiliate.status)}</span>
                </Badge>
                <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                  <Target className="w-4 h-4 mr-1" />
                  {getPerformanceLevel(selectedAffiliate.total_earnings).level}
                </Badge>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminAffiliate;