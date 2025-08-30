import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, EyeOff, Mail, User, Phone, Building, ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { AUTH_ROUTES, AUTH_MESSAGES } from '@/auth/new-auth-system';
import { supabase } from '@/integrations/supabase/client';

interface FormData {
  name: string;
  email: string;
  phone: string;
  company_name: string;
  password: string;
}

const ClientLoginPage = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    company_name: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError(''); // مسح الخطأ عند بدء الكتابة
  };

  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      setError('يرجى إدخال البريد الإلكتروني وكلمة المرور');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // استخدام نظام المصادقة الجديد
      const { data, error } = await supabase.rpc('simple_authenticate_user', {
        email_lower_param: formData.email.toLowerCase().trim(),
        plain_password: formData.password
      });

      if (error) {
        throw new Error(error.message);
      }

      const authData = data as any;
      if (!authData.success) {
        if (authData.error_code === 'E_USER_BLOCKED') {
          setError(AUTH_MESSAGES.ERROR.ACCOUNT_BLOCKED);
        } else if (authData.error_code === 'E_USER_PENDING') {
          setError(AUTH_MESSAGES.ERROR.NOT_VERIFIED);
        } else if (authData.error_code === 'E_WRONG_PASSWORD') {
          setError(AUTH_MESSAGES.ERROR.INVALID_CREDENTIALS);
        } else {
          setError(authData.message || AUTH_MESSAGES.ERROR.INVALID_CREDENTIALS);
        }
        return;
      }

      // تحديث الجلسة المحلية
      const sessionData = {
        id: crypto.randomUUID(),
        user_id: authData.user.id,
        session_token: `session_${Date.now()}`,
        realm: 'client' as const,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        user: authData.user
      };

      localStorage.setItem('auth_session', JSON.stringify(sessionData));
      
      toast.success(AUTH_MESSAGES.SUCCESS.LOGIN);
      navigate(AUTH_ROUTES.CLIENT.DASHBOARD);
    } catch (error: any) {
      setError(error.message || AUTH_MESSAGES.ERROR.INVALID_CREDENTIALS);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!formData.name || !formData.email || !formData.password) {
      setError('يرجى إدخال جميع البيانات المطلوبة');
      return;
    }

    if (formData.password.length < 8) {
      setError('كلمة المرور يجب أن تكون 8 أحرف على الأقل');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // إنشاء هاش آمن لكلمة المرور
      const { data: passwordData, error: hashError } = await supabase.rpc('create_secure_password_hash', {
        plain_password: formData.password
      });

      if (hashError) {
        throw new Error('خطأ في معالجة كلمة المرور');
      }

      // إدراج المستخدم الجديد
      const passwordInfo = passwordData as any;
      const { data: userData, error: userError } = await supabase
        .from('ash_users')
        .insert({
          name: formData.name,
          email: formData.email,
          email_lower: formData.email.toLowerCase().trim(),
          phone: formData.phone || null,
          company_name: formData.company_name || null,
          role: 'client',
          status: 'pending',
          password_hash: '',
          password_algo: passwordInfo.password_algo,
          password_salt_b64: passwordInfo.password_salt_b64,
          password_hash_b64: passwordInfo.password_hash_b64
        })
        .select()
        .single();

      if (userError) {
        if (userError.code === '23505') {
          setError(AUTH_MESSAGES.ERROR.EMAIL_EXISTS);
        } else {
          setError('حدث خطأ أثناء إنشاء الحساب');
        }
        return;
      }

      // إنشاء رمز OTP للتحقق
      const { data: otpCode, error: otpError } = await supabase.rpc('create_otp_code', {
        p_user_id: userData.id,
        p_email: formData.email,
        p_type: 'email_verification'
      });

      if (otpError) {
        console.error('OTP creation error:', otpError);
      }

      toast.success(AUTH_MESSAGES.SUCCESS.SIGNUP);
      // يمكن إضافة إعادة توجيه لصفحة التحقق هنا
      setActiveTab('login');
    } catch (error: any) {
      setError(error.message || 'حدث خطأ أثناء إنشاء الحساب');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/10 to-accent/5 flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-md">
        {/* زر العودة للرئيسية */}
        <div className="mb-6 text-center">
          <Link
            to="/"
            className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors group"
          >
            <ArrowRight className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
            العودة للرئيسية
          </Link>
        </div>

        <div>
          <Card className="backdrop-blur-sm bg-background/95 border-border/50 shadow-2xl">
            <CardHeader className="text-center pb-6">
              <div>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  مرحباً بك
                </CardTitle>
                <p className="text-muted-foreground mt-2">
                  مدخل العملاء إلى منصة علي الشهري القابضة
                </p>
              </div>
            </CardHeader>

            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login" className="text-sm">
                    تسجيل الدخول
                  </TabsTrigger>
                  <TabsTrigger value="register" className="text-sm">
                    إنشاء حساب
                  </TabsTrigger>
                </TabsList>

                {/* رسالة الخطأ */}
                {error && (
                  <div className="mb-4">
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  </div>
                )}

                {/* تبويب تسجيل الدخول */}
                <TabsContent value="login" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">البريد الإلكتروني</Label>
                    <div className="relative">
                      <Mail className="absolute right-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="example@domain.com"
                        value={formData.email}
                        onChange={(e) => updateFormData('email', e.target.value)}
                        className="pr-10"
                        dir="ltr"
                        style={{ textAlign: 'left' }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password">كلمة المرور</Label>
                    <div className="relative">
                      <Input
                        id="login-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="كلمة المرور"
                        value={formData.password}
                        onChange={(e) => updateFormData('password', e.target.value)}
                        className="pl-10"
                        dir="ltr"
                        autoComplete="current-password"
                        autoCapitalize="off"
                        spellCheck="false"
                        style={{ textAlign: 'left' }}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute left-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  <Button
                    onClick={handleLogin}
                    disabled={loading}
                    className="w-full mt-6"
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        جارٍ تسجيل الدخول...
                      </div>
                    ) : (
                      'تسجيل الدخول'
                    )}
                  </Button>

                  <div className="text-center">
                    <Link
                      to={AUTH_ROUTES.CLIENT.FORGOT}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      نسيت كلمة المرور؟
                    </Link>
                  </div>
                </TabsContent>

                {/* تبويب إنشاء حساب */}
                <TabsContent value="register" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name">الاسم الكامل *</Label>
                    <div className="relative">
                      <User className="absolute right-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="register-name"
                        type="text"
                        placeholder="الاسم الكامل"
                        value={formData.name}
                        onChange={(e) => updateFormData('name', e.target.value)}
                        className="pr-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-email">البريد الإلكتروني *</Label>
                    <div className="relative">
                      <Mail className="absolute right-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="example@domain.com"
                        value={formData.email}
                        onChange={(e) => updateFormData('email', e.target.value)}
                        className="pr-10"
                        dir="ltr"
                        style={{ textAlign: 'left' }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-phone">رقم الهاتف</Label>
                    <div className="relative">
                      <Phone className="absolute right-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="register-phone"
                        type="tel"
                        placeholder="+966xxxxxxxxx"
                        value={formData.phone}
                        onChange={(e) => updateFormData('phone', e.target.value)}
                        className="pr-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-company">اسم الشركة</Label>
                    <div className="relative">
                      <Building className="absolute right-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="register-company"
                        type="text"
                        placeholder="اسم الشركة (اختياري)"
                        value={formData.company_name}
                        onChange={(e) => updateFormData('company_name', e.target.value)}
                        className="pr-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-password">كلمة المرور *</Label>
                    <div className="relative">
                      <Input
                        id="register-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="كلمة المرور (8 أحرف على الأقل)"
                        value={formData.password}
                        onChange={(e) => updateFormData('password', e.target.value)}
                        className="pl-10"
                        dir="ltr"
                        autoComplete="new-password"
                        autoCapitalize="off"
                        spellCheck="false"
                        style={{ textAlign: 'left' }}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute left-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  <Button
                    onClick={handleRegister}
                    disabled={loading}
                    className="w-full mt-6"
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        جارٍ إنشاء الحساب...
                      </div>
                    ) : (
                      'إنشاء حساب جديد'
                    )}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    بإنشاء حساب، أنت توافق على{' '}
                    <Link to="/terms" className="text-primary hover:underline">
                      الشروط والأحكام
                    </Link>
                    {' '}و{' '}
                    <Link to="/privacy" className="text-primary hover:underline">
                      سياسة الخصوصية
                    </Link>
                  </p>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ClientLoginPage;