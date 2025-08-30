import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Eye, EyeOff, Mail, User, Phone, Building, Shield, Clock } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface AshAuthCardProps {
  onAuthSuccess: (userData: any) => void;
  isAdmin?: boolean;
}

export const AshAuthCard: React.FC<AshAuthCardProps> = ({ onAuthSuccess, isAdmin = false }) => {
  const [activeTab, setActiveTab] = useState('login');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [tempUserId, setTempUserId] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState('');

  // بيانات النموذج
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    company_name: '',
    otp: ''
  });

  // تحديث البيانات
  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  // بدء العد التنازلي
  const startCountdown = () => {
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // استدعاء API المصادقة
  const callAuthAPI = async (action: string, data: any) => {
    console.log('🔐 Calling ash-auth with:', { action, data: { ...data, password: '***' } });
    
    const { data: response, error } = await supabase.functions.invoke('ash-auth', {
      body: { action, ...data }
    });

    console.log('🔐 ash-auth response:', response);
    console.log('🔐 ash-auth error:', error);

    if (error) {
      console.error('❌ Edge function error:', error);
      throw new Error(error.message || 'حدث خطأ في الخدمة');
    }
    
    if (!response) {
      console.error('❌ No response from edge function');
      throw new Error('لم يتم استلام رد من الخدمة');
    }
    
    if (!response.success) {
      console.error('❌ API returned error:', response.error || response.message);
      throw new Error(response.error || response.message || 'بيانات تسجيل الدخول غير صحيحة');
    }
    
    return response;
  };

  // معالجة التسجيل
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password || !formData.name) {
      setError('جميع الحقول مطلوبة');
      return;
    }

    setIsLoading(true);
    try {
      const response = await callAuthAPI('register', {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        phone: formData.phone,
        company_name: formData.company_name
      });

      setTempUserId(response.user_id);
      setShowOTP(true);
      startCountdown();
      toast.success(response.message);
    } catch (error: any) {
      setError(error.message);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // معالجة تسجيل الدخول
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('البريد الإلكتروني وكلمة المرور مطلوبان');
      return;
    }

    setIsLoading(true);
    try {
      const response = await callAuthAPI('login', {
        email: formData.email,
        password: formData.password
      });

      if (response.requires_otp) {
        setTempUserId(response.user_id);
        setShowOTP(true);
        startCountdown();
        toast.success(response.message);
      } else {
        onAuthSuccess(response.user);
      }
    } catch (error: any) {
      setError(error.message);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // التحقق من OTP
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.otp || formData.otp.length !== 6) {
      setError('يرجى إدخال رمز التحقق المكون من 6 أرقام');
      return;
    }

    setIsLoading(true);
    try {
      const response = await callAuthAPI('verify-otp', {
        email: formData.email,
        code: formData.otp
      });

      toast.success(response.message);
      onAuthSuccess(response.user);
    } catch (error: any) {
      setError(error.message);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // إعادة إرسال OTP
  const handleResendOTP = async () => {
    if (countdown > 0) return;

    setIsLoading(true);
    try {
      const response = await callAuthAPI('resend-otp', {
        email: formData.email
      });

      startCountdown();
      toast.success(response.message);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (showOTP) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md mx-auto bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-primary to-primary/60 rounded-2xl flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-white">تأكيد الهوية</CardTitle>
            <CardDescription className="text-white/80">
              تم إرسال رمز التحقق إلى {formData.email}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp" className="text-white text-right block">رمز التحقق</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="أدخل الرمز المكون من 6 أرقام"
                  value={formData.otp}
                  onChange={(e) => updateFormData('otp', e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="text-center text-2xl font-mono tracking-widest bg-white/10 border-white/30 text-white placeholder:text-white/50"
                  maxLength={6}
                  autoComplete="one-time-code"
                  dir="ltr"
                />
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                    <Alert className="bg-red-500/20 border-red-500/50 text-white">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                disabled={isLoading || formData.otp.length !== 6}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    جارٍ التحقق...
                  </div>
                ) : (
                  'تأكيد الرمز'
                )}
              </Button>

              <div className="text-center">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleResendOTP}
                  disabled={countdown > 0 || isLoading}
                  className="text-white/80 hover:text-white hover:bg-white/10"
                >
                  {countdown > 0 ? (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      إعادة الإرسال خلال {countdown} ثانية
                    </div>
                  ) : (
                    'إعادة إرسال الرمز'
                  )}
                </Button>
              </div>
            </form>

            <Button
              variant="outline"
              onClick={() => {
                setShowOTP(false);
                setFormData(prev => ({ ...prev, otp: '' }));
                setError('');
              }}
              className="w-full border-white/30 text-white hover:bg-white/10"
            >
              العودة لتسجيل الدخول
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full max-w-md mx-auto bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-primary to-primary/60 rounded-2xl flex items-center justify-center">
            <Building className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold text-white">ASH HOLDING</CardTitle>
          <CardDescription className="text-white/80">
            {isAdmin ? 'لوحة تحكم الإدارة' : 'منصة إدارة العملاء'}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-2 bg-white/10 border border-white/20">
              <TabsTrigger 
                value="login" 
                className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white"
              >
                تسجيل الدخول
              </TabsTrigger>
              <TabsTrigger 
                value="register" 
                className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white"
              >
                إنشاء حساب
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white text-right block">البريد الإلكتروني</Label>
                  <div className="relative">
                    <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="example@ashholding.com"
                      value={formData.email}
                      onChange={(e) => updateFormData('email', e.target.value)}
                      className="pr-10 bg-white/10 border-white/30 text-white placeholder:text-white/50"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white text-right block">كلمة المرور</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => updateFormData('password', e.target.value)}
                      className="pl-10 bg-white/10 border-white/30 text-white placeholder:text-white/50"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/80"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                    >
                      <Alert className="bg-red-500/20 border-red-500/50 text-white">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    </motion.div>
                  )}
                </AnimatePresence>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      جارٍ تسجيل الدخول...
                    </div>
                  ) : (
                    'تسجيل الدخول'
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register" className="space-y-4">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reg-name" className="text-white text-right block">الاسم الكامل</Label>
                  <div className="relative">
                    <User className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
                    <Input
                      id="reg-name"
                      type="text"
                      placeholder="محمد أحمد"
                      value={formData.name}
                      onChange={(e) => updateFormData('name', e.target.value)}
                      className="pr-10 bg-white/10 border-white/30 text-white placeholder:text-white/50"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reg-email" className="text-white text-right block">البريد الإلكتروني</Label>
                  <div className="relative">
                    <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
                    <Input
                      id="reg-email"
                      type="email"
                      placeholder="mohammed@company.com"
                      value={formData.email}
                      onChange={(e) => updateFormData('email', e.target.value)}
                      className="pr-10 bg-white/10 border-white/30 text-white placeholder:text-white/50"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reg-phone" className="text-white text-right block">رقم الهاتف (اختياري)</Label>
                  <div className="relative">
                    <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
                    <Input
                      id="reg-phone"
                      type="tel"
                      placeholder="+966501234567"
                      value={formData.phone}
                      onChange={(e) => updateFormData('phone', e.target.value)}
                      className="pr-10 bg-white/10 border-white/30 text-white placeholder:text-white/50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reg-company" className="text-white text-right block">اسم الشركة (اختياري)</Label>
                  <div className="relative">
                    <Building className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
                    <Input
                      id="reg-company"
                      type="text"
                      placeholder="شركة التقنية المتقدمة"
                      value={formData.company_name}
                      onChange={(e) => updateFormData('company_name', e.target.value)}
                      className="pr-10 bg-white/10 border-white/30 text-white placeholder:text-white/50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reg-password" className="text-white text-right block">كلمة المرور</Label>
                  <div className="relative">
                    <Input
                      id="reg-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => updateFormData('password', e.target.value)}
                      className="pl-10 bg-white/10 border-white/30 text-white placeholder:text-white/50"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/80"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-white/60">كلمة المرور يجب أن تكون 6 أحرف على الأقل</p>
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                    >
                      <Alert className="bg-red-500/20 border-red-500/50 text-white">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    </motion.div>
                  )}
                </AnimatePresence>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      جارٍ إنشاء الحساب...
                    </div>
                  ) : (
                    'إنشاء حساب جديد'
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
};