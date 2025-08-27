import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ResponsiveGrid } from '@/components/ResponsiveGrid';
import { ResponsiveCard } from '@/components/ResponsiveCard';
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
  FileText
} from 'lucide-react';

export default function ClientProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: 'محمد',
    lastName: 'أحمد السعيد',
    email: 'mohammed.ahmed@example.com',
    phone: '+966501234567',
    company: 'شركة التقنية المتقدمة',
    position: 'مدير تقنية المعلومات',
    city: 'الرياض',
    country: 'المملكة العربية السعودية',
    bio: 'مدير تقنية معلومات مع خبرة أكثر من 10 سنوات في تطوير الحلول التقنية والإشراف على المشاريع الرقمية.',
    website: 'https://example.com',
    taxNumber: '300123456789003',
    commercialRecord: 'CR-1234567890'
  });

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    // Here you would typically save to backend
    setIsEditing(false);
    // Show success toast
  };

  const profileStats = [
    { label: 'المشاريع المكتملة', value: '12', icon: FileText, color: 'text-green-600' },
    { label: 'المشاريع النشطة', value: '3', icon: Calendar, color: 'text-blue-600' },
    { label: 'سنوات الخبرة', value: '10+', icon: Shield, color: 'text-purple-600' },
    { label: 'معدل الرضا', value: '98%', icon: User, color: 'text-orange-600' }
  ];

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
        >
          {isEditing ? (
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