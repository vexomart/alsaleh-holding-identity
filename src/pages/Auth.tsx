import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Eye, EyeOff, Mail, Lock, User, Phone, Building2, ArrowRight, CheckCircle, Star } from 'lucide-react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetMessage, setResetMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          const redirectPath = (location.state as any)?.from?.pathname || '/dashboard';
          navigate(redirectPath, { replace: true });
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        const redirectPath = (location.state as any)?.from?.pathname || '/dashboard';
        navigate(redirectPath, { replace: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, location]);

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    }

    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const phone = formData.get('phone') as string;
    const company = formData.get('company') as string;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
        data: {
          full_name: `${firstName} ${lastName}`,
          phone,
          company,
        }
      }
    });

    if (error) {
      setError(error.message);
    } else {
      setError(null);
      alert('تم إرسال رقم التحقق إلى بريدك الإلكتروني. يرجى التحقق من بريدك الإلكتروني وإدخال الرقم.');
    }

    setLoading(false);
  };

  const handlePasswordReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setResetLoading(true);
    setError(null);
    setResetMessage(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('reset-email') as string;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth?type=recovery`,
    });

    if (error) {
      setError(error.message);
    } else {
      setResetMessage('تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني');
    }

    setResetLoading(false);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900" dir="rtl">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-indigo-400/20 to-blue-600/20 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-purple-400/10 to-pink-600/10 rounded-full blur-2xl animate-pulse"></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 right-20 w-4 h-4 bg-blue-400 rounded-full animate-bounce-gentle"></div>
        <div className="absolute bottom-32 right-32 w-6 h-6 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/3 left-20 w-3 h-3 bg-indigo-400 rounded-full animate-bounce-gentle" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center p-6">
        <div className="w-full max-w-md animate-scale-in">
          {/* Logo/Brand Section */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-blue-600 mb-4 shadow-glow">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              نظام خدمة العملاء
            </h1>
            <p className="text-blue-200/80 mt-2">شركة علي صالح الشهري القابضة</p>
          </div>

          {/* Auth Card */}
          <Card className="backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl animate-fade-in delay-200">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-bold text-white">أهلاً وسهلاً</CardTitle>
              <CardDescription className="text-blue-200/80">
                سجل دخولك أو أنشئ حساب جديد للمتابعة
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <Tabs defaultValue="signin" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-white/10 border border-white/20">
                  <TabsTrigger 
                    value="signin" 
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-blue-600 data-[state=active]:text-white text-blue-200"
                  >
                    تسجيل الدخول
                  </TabsTrigger>
                  <TabsTrigger 
                    value="signup"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-blue-600 data-[state=active]:text-white text-blue-200"
                  >
                    إنشاء حساب
                  </TabsTrigger>
                  <TabsTrigger 
                    value="reset"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-red-600 data-[state=active]:text-white text-blue-200"
                  >
                    نسيت كلمة المرور
                  </TabsTrigger>
                </TabsList>
                
                {/* Sign In Tab */}
                <TabsContent value="signin" className="animate-fade-in">
                  <form onSubmit={handleSignIn} className="space-y-6 mt-6">
                    <div className="space-y-2">
                      <Label htmlFor="signin-email" className="text-white flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        البريد الإلكتروني
                      </Label>
                      <Input
                        id="signin-email"
                        name="email"
                        type="email"
                        required
                        placeholder="أدخل بريدك الإلكتروني"
                        className="bg-white/10 border-white/20 text-white placeholder:text-blue-200/60 focus:border-primary/50 focus:ring-primary/20"
                        dir="ltr"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signin-password" className="text-white flex items-center gap-2">
                        <Lock className="w-4 h-4" />
                        كلمة المرور
                      </Label>
                      <div className="relative">
                        <Input
                          id="signin-password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          required
                          placeholder="أدخل كلمة المرور"
                          className="bg-white/10 border-white/20 text-white placeholder:text-blue-200/60 focus:border-primary/50 focus:ring-primary/20 pl-12"
                          dir="ltr"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute left-0 top-0 h-full px-3 py-2 text-blue-200/80 hover:text-white hover:bg-white/10"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white font-medium py-3 hover-scale" 
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                          جارٍ تسجيل الدخول...
                        </>
                      ) : (
                        <>
                          تسجيل الدخول
                          <ArrowRight className="mr-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </TabsContent>
                
                {/* Sign Up Tab */}
                <TabsContent value="signup" className="animate-fade-in">
                  <form onSubmit={handleSignUp} className="space-y-4 mt-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-white flex items-center gap-2">
                          <User className="w-4 h-4" />
                          الاسم الأول
                        </Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          required
                          placeholder="الاسم الأول"
                          className="bg-white/10 border-white/20 text-white placeholder:text-blue-200/60 focus:border-primary/50 focus:ring-primary/20"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-white flex items-center gap-2">
                          <User className="w-4 h-4" />
                          الاسم الأخير
                        </Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          required
                          placeholder="الاسم الأخير"
                          className="bg-white/10 border-white/20 text-white placeholder:text-blue-200/60 focus:border-primary/50 focus:ring-primary/20"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signup-email" className="text-white flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        البريد الإلكتروني
                      </Label>
                      <Input
                        id="signup-email"
                        name="email"
                        type="email"
                        required
                        placeholder="أدخل بريدك الإلكتروني"
                        className="bg-white/10 border-white/20 text-white placeholder:text-blue-200/60 focus:border-primary/50 focus:ring-primary/20"
                        dir="ltr"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-white flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        رقم الهاتف
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="رقم الهاتف"
                        className="bg-white/10 border-white/20 text-white placeholder:text-blue-200/60 focus:border-primary/50 focus:ring-primary/20"
                        dir="ltr"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="company" className="text-white flex items-center gap-2">
                        <Building2 className="w-4 h-4" />
                        الشركة (اختياري)
                      </Label>
                      <Input
                        id="company"
                        name="company"
                        placeholder="اسم الشركة"
                        className="bg-white/10 border-white/20 text-white placeholder:text-blue-200/60 focus:border-primary/50 focus:ring-primary/20"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signup-password" className="text-white flex items-center gap-2">
                        <Lock className="w-4 h-4" />
                        كلمة المرور
                      </Label>
                      <div className="relative">
                        <Input
                          id="signup-password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          required
                          placeholder="أدخل كلمة المرور"
                          className="bg-white/10 border-white/20 text-white placeholder:text-blue-200/60 focus:border-primary/50 focus:ring-primary/20 pl-12"
                          minLength={6}
                          dir="ltr"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute left-0 top-0 h-full px-3 py-2 text-blue-200/80 hover:text-white hover:bg-white/10"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white font-medium py-3 hover-scale" 
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                          جارٍ إنشاء الحساب...
                        </>
                      ) : (
                        <>
                          إنشاء حساب جديد
                          <CheckCircle className="mr-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </TabsContent>
                
                {/* Password Reset Tab */}
                <TabsContent value="reset" className="animate-fade-in">
                  <form onSubmit={handlePasswordReset} className="space-y-6 mt-6">
                    <div className="space-y-2">
                      <Label htmlFor="reset-email" className="text-white flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        البريد الإلكتروني
                      </Label>
                      <Input
                        id="reset-email"
                        name="reset-email"
                        type="email"
                        required
                        placeholder="أدخل بريدك الإلكتروني"
                        className="bg-white/10 border-white/20 text-white placeholder:text-blue-200/60 focus:border-red-500/50 focus:ring-red-500/20"
                        dir="ltr"
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-500/90 hover:to-red-600/90 text-white font-medium py-3 hover-scale" 
                      disabled={resetLoading}
                    >
                      {resetLoading ? (
                        <>
                          <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                          جارٍ الإرسال...
                        </>
                      ) : (
                        <>
                          إرسال رابط إعادة التعيين
                          <ArrowRight className="mr-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                    
                    {resetMessage && (
                      <Alert className="bg-green-500/10 border-green-500/20 animate-fade-in">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        <AlertDescription className="text-green-200">{resetMessage}</AlertDescription>
                      </Alert>
                    )}
                  </form>
                </TabsContent>
              </Tabs>
              
              {error && (
                <Alert className="mt-4 bg-red-500/10 border-red-500/20 animate-fade-in">
                  <AlertDescription className="text-red-200">{error}</AlertDescription>
                </Alert>
              )}
              
              {/* Features */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="space-y-2">
                    <Star className="w-6 h-6 text-yellow-400 mx-auto" />
                    <p className="text-xs text-blue-200/80">خدمات متميزة</p>
                  </div>
                  <div className="space-y-2">
                    <CheckCircle className="w-6 h-6 text-green-400 mx-auto" />
                    <p className="text-xs text-blue-200/80">أمان عالي</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Back to Home */}
          <div className="text-center mt-6 animate-fade-in delay-400">
            <Button 
              variant="ghost" 
              className="text-blue-200/80 hover:text-white hover:bg-white/10"
              onClick={() => navigate('/')}
            >
              العودة للصفحة الرئيسية
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}