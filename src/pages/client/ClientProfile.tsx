import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ResponsiveGrid } from '@/components/ResponsiveGrid';
import { ResponsiveCard } from '@/components/ResponsiveCard';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building, 
  Camera, 
  Save,
  Edit,
  Shield,
  Calendar,
  Globe,
  FileText,
  Loader2
} from 'lucide-react';

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  city: string;
  country: string;
  bio: string;
  website: string;
  taxNumber: string;
  commercialRecord: string;
}

export default function ClientProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    city: '',
    country: 'المملكة العربية السعودية',
    bio: '',
    website: '',
    taxNumber: '',
    commercialRecord: ''
  });
  const [stats, setStats] = useState({
    completedProjects: 0,
    activeProjects: 0,
    totalPayments: 0
  });

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        setError('لم يتم العثور على جلسة صالحة');
        return;
      }

      // 1) حاول جلب الملف من جدول profiles أولاً
      let firstName = '';
      let lastName = '';
      let email = user.email || '';
      let phone = '';
      let company = '';
      let position = '';
      let city = '';
      let country = 'المملكة العربية السعودية';
      let bio = '';
      let website = '';
      let taxNumber = '';
      let commercialRecord = '';

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (profile && !profileError) {
        const fullName = profile.full_name || '';
        const parts = fullName.trim().split(' ');
        firstName = parts[0] || '';
        lastName = parts.slice(1).join(' ');
        email = profile.email || email;
        phone = profile.phone || '';
        company = profile.company || '';
        position = (profile as any).position || '';
        city = (profile as any).city || '';
        country = (profile as any).country || 'المملكة العربية السعودية';
        bio = (profile as any).bio || '';
        website = (profile as any).website || '';
        taxNumber = (profile as any).tax_number || '';
        commercialRecord = (profile as any).commercial_record || '';
      } else {
        // 2) Fallback: جدول platform_users مع تخزين التفاصيل داخل profile_data
        const { data: platformUser, error: platformError } = await supabase
          .from('platform_users')
          .select('id, email, phone, full_name, profile_data')
          .eq('id', user.id)
          .maybeSingle();

        if (platformError) {
          console.warn('فشل جلب profiles وسنسقط إلى platform_users، لكن حدث خطأ أيضاً:', platformError);
        }

        if (platformUser) {
          const fullName = platformUser.full_name || '';
          const parts = fullName.trim().split(' ');
          firstName = parts[0] || '';
          lastName = parts.slice(1).join(' ');
          email = platformUser.email || email;
          phone = platformUser.phone || '';

          const pd = (platformUser as any).profile_data || {};
          company = pd.company || '';
          position = pd.position || '';
          city = pd.city || '';
          country = pd.country || 'المملكة العربية السعودية';
          bio = pd.bio || '';
          website = pd.website || '';
          taxNumber = pd.tax_number || '';
          commercialRecord = pd.commercial_record || '';
        } else if (profileError && profileError.code !== 'PGRST116') {
          console.error('Error fetching profile:', profileError);
          setError('تعذر تحميل بيانات الملف الشخصي');
          return;
        } else {
          // بدون سجلات: استخدم بيانات auth كبداية
          firstName = user.user_metadata?.full_name?.split(' ')[0] || '';
          lastName = user.user_metadata?.full_name?.split(' ').slice(1).join(' ') || '';
          phone = user.user_metadata?.phone || '';
        }
      }

      setProfileData({
        firstName,
        lastName,
        email,
        phone,
        company,
        position,
        city,
        country,
        bio,
        website,
        taxNumber,
        commercialRecord,
      });

      // Load stats
      await loadUserStats(user.id);
    } catch (error) {
      console.error('Error loading profile:', error);
      setError('حدث خطأ أثناء تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  const loadUserStats = async (userId: string) => {
    try {
      const [contractsResult, paymentsResult] = await Promise.all([
        // Load contracts if table exists
        supabase.from('contracts')
          .select('id, status', { count: 'exact', head: true })
          .eq('user_id', userId),
        // Load payments if table exists  
        supabase.from('payment_transactions')
          .select('amount', { count: 'exact' })
          .eq('user_id', userId)
          .eq('status', 'completed')
      ]);

      const totalContracts = contractsResult.count || 0;
      const completedContracts = contractsResult.data?.filter(c => c.status === 'completed').length || 0;
      const activeContracts = totalContracts - completedContracts;
      const totalPayments = paymentsResult.data?.reduce((sum, p) => sum + (Number(p.amount) || 0), 0) || 0;

      setStats({
        completedProjects: completedContracts,
        activeProjects: activeContracts,
        totalPayments
      });
    } catch (error) {
      console.error('Error loading stats:', error);
      // Don't show error for stats, just keep defaults
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "خطأ في المصادقة",
          description: "يرجى تسجيل الدخول مرة أخرى",
          variant: "destructive",
        });
        return;
      }

      const fullName = `${profileData.firstName} ${profileData.lastName}`.trim();

      // بيانات إضافية نخزنها داخل profile_data عند استخدام platform_users
      const profileDataJson = {
        company: profileData.company,
        position: profileData.position,
        city: profileData.city,
        country: profileData.country,
        bio: profileData.bio,
        website: profileData.website,
        tax_number: profileData.taxNumber,
        commercial_record: profileData.commercialRecord,
      };
      
      // المحاولة الأولى: التحديث داخل جدول profiles (إن كان متاحًا)
      const { error: profilesError } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          full_name: fullName,
          email: profileData.email,
          phone: profileData.phone,
          company: profileData.company,
          position: profileData.position,
          city: profileData.city,
          country: profileData.country,
          bio: profileData.bio,
          website: profileData.website,
          tax_number: profileData.taxNumber,
          commercial_record: profileData.commercialRecord,
          site_id: '11111111-1111-1111-1111-111111111111'
        });

      if (profilesError) {
        console.warn('تعذر الحفظ في profiles، سيتم الحفظ في platform_users بدلاً من ذلك:', profilesError);
        // Fallback: التحديث داخل platform_users
        const { error: platformError } = await supabase
          .from('platform_users')
          .update({
            full_name: fullName,
            email: profileData.email,
            phone: profileData.phone,
            profile_data: profileDataJson,
            updated_at: new Date().toISOString(),
          })
          .eq('id', user.id);

        if (platformError) throw platformError;
      }

      setIsEditing(false);
      toast({
        title: "تم حفظ التغييرات",
        description: "تم تحديث معلومات الملف الشخصي بنجاح",
      });
    } catch (error: any) {
      console.error('Error saving profile:', error);
      toast({
        title: "خطأ في الحفظ",
        description: error.message || "حدث خطأ أثناء حفظ التغييرات",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const profileStats = [
    { label: 'المشاريع المكتملة', value: stats.completedProjects.toString(), icon: FileText, color: 'text-green-600' },
    { label: 'المشاريع النشطة', value: stats.activeProjects.toString(), icon: Calendar, color: 'text-blue-600' },
    { label: 'إجمالي المدفوعات', value: `${stats.totalPayments.toLocaleString()} ريال`, icon: Shield, color: 'text-purple-600' },
    { label: 'حالة الحساب', value: 'نشط', icon: User, color: 'text-orange-600' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">جارٍ تحميل معلومات الملف الشخصي...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={loadUserProfile}>إعادة المحاولة</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">الملف الشخصي</h1>
          <p className="text-muted-foreground">إدارة معلوماتك الشخصية وبيانات الحساب</p>
        </div>
        <Button 
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className="w-full sm:w-auto"
          disabled={saving}
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              جارٍ الحفظ...
            </>
          ) : isEditing ? (
            <>
              <Save className="w-4 h-4 mr-2" />
              حفظ التغييرات
            </>
          ) : (
            <>
              <Edit className="w-4 h-4 mr-2" />
              تعديل الملف
            </>
          )}
        </Button>
      </div>

      {/* Profile Header Card */}
      <ResponsiveCard size="lg" className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <div className="p-8">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage src="/placeholder-avatar.jpg" alt="Profile" />
                <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                  {profileData.firstName.charAt(0)}{profileData.lastName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <Button
                  size="sm"
                  className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                >
                  <Camera className="w-4 h-4" />
                </Button>
              )}
            </div>
            <div className="text-center sm:text-right flex-1">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                {profileData.firstName} {profileData.lastName}
              </h2>
              <p className="text-lg text-muted-foreground mb-4">{profileData.position}</p>
              <div className="flex flex-col sm:flex-row gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  <span>{profileData.company}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{profileData.city}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>{profileData.email}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ResponsiveCard>

      {/* Stats Cards */}
      <ResponsiveGrid cols="1-2-4" gap="md">
        {profileStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <ResponsiveCard key={index} size="sm">
              <div className="flex items-center justify-between">
                <div className="text-right">
                  <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
                <Icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </ResponsiveCard>
          );
        })}
      </ResponsiveGrid>

      {/* Profile Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              المعلومات الشخصية
            </CardTitle>
            <CardDescription>
              معلوماتك الأساسية وبيانات الاتصال
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">الاسم الأول</Label>
                <Input
                  id="firstName"
                  value={profileData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">اسم العائلة</Label>
                <Input
                  id="lastName"
                  value={profileData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                value={profileData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                disabled={!isEditing}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">رقم الهاتف</Label>
              <Input
                id="phone"
                value={profileData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                disabled={!isEditing}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">المدينة</Label>
                <Input
                  id="city"
                  value={profileData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">الدولة</Label>
                <Input
                  id="country"
                  value={profileData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bio">نبذة شخصية</Label>
              <Textarea
                id="bio"
                value={profileData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                disabled={!isEditing}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Business Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="w-5 h-5" />
              المعلومات التجارية
            </CardTitle>
            <CardDescription>
              بيانات الشركة والمعلومات التجارية
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="company">اسم الشركة</Label>
              <Input
                id="company"
                value={profileData.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                disabled={!isEditing}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="position">المنصب</Label>
              <Input
                id="position"
                value={profileData.position}
                onChange={(e) => handleInputChange('position', e.target.value)}
                disabled={!isEditing}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="website">الموقع الإلكتروني</Label>
              <Input
                id="website"
                value={profileData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                disabled={!isEditing}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="taxNumber">الرقم الضريبي</Label>
              <Input
                id="taxNumber"
                value={profileData.taxNumber}
                onChange={(e) => handleInputChange('taxNumber', e.target.value)}
                disabled={!isEditing}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="commercialRecord">السجل التجاري</Label>
              <Input
                id="commercialRecord"
                value={profileData.commercialRecord}
                onChange={(e) => handleInputChange('commercialRecord', e.target.value)}
                disabled={!isEditing}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            إعدادات الأمان
          </CardTitle>
          <CardDescription>
            إدارة كلمة المرور وإعدادات الأمان
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="outline" className="flex-1">
              تغيير كلمة المرور
            </Button>
            <Button variant="outline" className="flex-1">
              تفعيل المصادقة الثنائية
            </Button>
            <Button variant="outline" className="flex-1">
              عرض سجل تسجيل الدخول
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}