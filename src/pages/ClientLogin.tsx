import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, EyeOff, Mail, User, Phone, Building, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import ForgotPassword from '@/components/auth/ForgotPassword';

const ClientLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    company_name: ''
  });
  const [otpCode, setOtpCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [tempUserId, setTempUserId] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkExistingSession();
  }, []);

  const checkExistingSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        navigate('/client/dashboard');
      }
    } catch (error) {
      console.error('Error checking session:', error);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const callAshAuth = async (action: string, data: any) => {
    try {
      const { data: result, error } = await supabase.functions.invoke('ash-auth', {
        body: { action, ...data }
      });

      if (error) throw error;
      
      // تحقق من وجود خطأ في الاستجابة
      if (result && !result.success) {
        throw new Error(result.message || 'حدث خطأ في النظام');
      }
      
      return result;
    } catch (error: any) {
      console.error('Auth API Error:', error);
      throw new Error(error.message || 'حدث خطأ في النظام');
    }
  };

  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      setError('يرجى إدخال البريد الإلكتروني وكلمة المرور');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await callAshAuth('login', {
        email: formData.email,
        password: formData.password
      });

      if (result.success) {
        if (result.requiresOTP) {
          setTempUserId(result.tempUserId);
          setShowOTP(true);
          toast.success('تم إرسال رمز التحقق إلى بريدك الإلكتروني');
        } else {
          toast.success('تم تسجيل الدخول بنجاح');
          navigate('/client/dashboard');
        }
      } else {
        setError(result.message || 'فشل في تسجيل الدخول');
      }
    } catch (error: any) {
      setError(error.message || 'حدث خطأ أثناء تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!formData.email || !formData.password || !formData.name) {
      setError('يرجى إدخال جميع البيانات المطلوبة');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await callAshAuth('register', {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        phone: formData.phone || '',
        company_name: formData.company_name || ''
      });

      if (result.success) {
        setTempUserId(result.tempUserId);
        setShowOTP(true);
        toast.success('تم إرسال رمز التحقق إلى بريدك الإلكتروني');
      } else {
        setError(result.message || 'فشل في إنشاء الحساب');
      }
    } catch (error: any) {
      setError(error.message || 'حدث خطأ أثناء إنشاء الحساب');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otpCode) {
      setError('يرجى إدخال رمز التحقق');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await callAshAuth('verify-otp', {
        tempUserId,
        code: otpCode
      });

      if (result.success) {
        toast.success('تم تفعيل الحساب بنجاح');
        navigate('/client/dashboard');
      } else {
        setError(result.message || 'رمز التحقق غير صحيح');
      }
    } catch (error: any) {
      setError(error.message || 'حدث خطأ أثناء التحقق');
    } finally {
      setLoading(false);
    }
  };

  if (showOTP) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-secondary/10 to-accent/5 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-primary">تأكيد البريد الإلكتروني</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center mb-4">
              <Mail className="w-16 h-16 mx-auto text-primary mb-2" />
              <p className="text-muted-foreground">
                تم إرسال رمز التحقق إلى بريدك الإلكتروني
              </p>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div>
              <Label htmlFor="otp">رمز التحقق</Label>
              <Input
                id="otp"
                type="text"
                placeholder="أدخل رمز التحقق المكون من 6 أرقام"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                className="text-center text-lg tracking-widest"
                maxLength={6}
              />
            </div>

            <Button 
              onClick={handleVerifyOTP}
              disabled={loading || !otpCode}
              className="w-full"
            >
              {loading ? 'جارٍ التحقق...' : 'تأكيد'}
            </Button>

            <Button 
              variant="outline" 
              onClick={() => setShowOTP(false)}
              className="w-full"
            >
              العودة لتسجيل الدخول
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showForgotPassword) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-secondary/10 to-accent/5 p-4">
        <div className="w-full max-w-md">
          <div className="mb-6 text-center">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="mb-4 text-muted-foreground hover:text-primary"
            >
              <ArrowLeft className="w-4 h-4 ml-2" />
              العودة للرئيسية
            </Button>
          </div>
          <ForgotPassword onBack={() => setShowForgotPassword(false)} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-secondary/10 to-accent/5 p-4">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4 text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="w-4 h-4 ml-2" />
            العودة للرئيسية
          </Button>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-primary">مرحباً بك</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">تسجيل الدخول</TabsTrigger>
                <TabsTrigger value="register">إنشاء حساب</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div>
                  <Label htmlFor="login-email">البريد الإلكتروني</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="example@domain.com"
                    value={formData.email}
                    onChange={(e) => updateFormData('email', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="login-password">كلمة المرور</Label>
                  <div className="relative">
                    <Input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="كلمة المرور"
                      value={formData.password}
                      onChange={(e) => updateFormData('password', e.target.value)}
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
                  className="w-full"
                >
                  {loading ? 'جارٍ تسجيل الدخول...' : 'تسجيل الدخول'}
                </Button>

                <div className="text-center">
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    نسيت كلمة المرور؟
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="register" className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div>
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

                <div>
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
                    />
                  </div>
                </div>

                <div>
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

                <div>
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

                <div>
                  <Label htmlFor="register-password">كلمة المرور *</Label>
                  <div className="relative">
                    <Input
                      id="register-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="كلمة المرور"
                      value={formData.password}
                      onChange={(e) => updateFormData('password', e.target.value)}
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
                  className="w-full"
                >
                  {loading ? 'جارٍ إنشاء الحساب...' : 'إنشاء حساب جديد'}
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientLogin;