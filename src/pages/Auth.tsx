import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // التحقق من حالة تسجيل الدخول
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        navigate("/dashboard");
      }
    });

    // التحقق من الجلسة الحالية
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        navigate("/dashboard");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: {
            full_name: fullName,
            phone,
            company,
          },
        },
      });

      if (error) {
        if (error.message.includes("already registered")) {
          toast({
            title: "خطأ في التسجيل",
            description: "هذا البريد الإلكتروني مسجل مسبقاً. يرجى تسجيل الدخول بدلاً من ذلك.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "خطأ في التسجيل",
            description: error.message,
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "تم التسجيل بنجاح",
          description: "تم إنشاء حسابك بنجاح. يمكنك الآن تسجيل الدخول.",
        });
      }
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRequestOtp = async () => {
    if (!email) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال البريد الإلكتروني أولاً",
        variant: "destructive",
      });
      return;
    }

    setOtpLoading(true);
    try {
      const { error } = await supabase.functions.invoke('otp-auth', {
        body: {
          action: 'generate',
          email: email
        }
      });

      if (error) {
        throw error;
      }

      setOtpSent(true);
      setShowOtpInput(true);
      toast({
        title: "تم الإرسال",
        description: "تم إرسال رمز التحقق إلى بريدك الإلكتروني",
      });
    } catch (error: any) {
      toast({
        title: "خطأ في الإرسال",
        description: error.message || "فشل في إرسال رمز التحقق",
        variant: "destructive",
      });
    } finally {
      setOtpLoading(false);
    }
  };

  const handleOtpSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.functions.invoke('otp-auth', {
        body: {
          action: 'verify',
          email: email,
          otp: otp
        }
      });

      if (error) {
        throw error;
      }

      // تسجيل دخول المستخدم بعد التحقق من OTP
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: 'temp_password_for_otp' // مؤقت للاختبار
      });

      if (signInError) {
        // إذا فشل تسجيل الدخول العادي، نحاول العثور على المستخدم وتسجيل دخوله
        toast({
          title: "تم التحقق بنجاح",
          description: "رمز التحقق صحيح. يرجى استخدام كلمة المرور العادية لتسجيل الدخول",
        });
        setShowOtpInput(false);
        setOtpSent(false);
        setOtp("");
      }
    } catch (error: any) {
      toast({
        title: "خطأ في التحقق",
        description: error.message || "رمز التحقق غير صحيح",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "خطأ في تسجيل الدخول",
          description: "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader 
        title="تسجيل الدخول"
        description="قم بتسجيل الدخول أو إنشاء حساب جديد لإدارة خدماتك"
      />
      
      <div className="flex justify-center">
        <Card className="w-full max-w-md">
          <Tabs defaultValue="signin" className="w-full">
            <CardHeader>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">تسجيل الدخول</TabsTrigger>
                <TabsTrigger value="signup">حساب جديد</TabsTrigger>
              </TabsList>
            </CardHeader>

            <CardContent>
              <TabsContent value="signin">
                <div className="space-y-4">
                  <CardTitle className="text-center mb-4">تسجيل الدخول</CardTitle>
                  <CardDescription className="text-center mb-6">
                    أدخل بياناتك لتسجيل الدخول إلى حسابك
                  </CardDescription>

                  <div className="space-y-2">
                    <Label htmlFor="email">البريد الإلكتروني</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      dir="ltr"
                    />
                  </div>

                  {showOtpInput ? (
                    <form onSubmit={handleOtpSignIn} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="otp">رمز التحقق</Label>
                        <Input
                          id="otp"
                          type="text"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          placeholder="أدخل الرمز المكون من 6 أرقام"
                          maxLength={6}
                          required
                          dir="ltr"
                          className="text-center text-lg tracking-widest"
                        />
                        <p className="text-sm text-muted-foreground text-center">
                          تم إرسال رمز التحقق إلى {email}
                        </p>
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={loading || otp.length !== 6}
                      >
                        {loading ? "جاري التحقق..." : "تحقق من الرمز"}
                      </Button>
                      
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="w-full" 
                        onClick={handleRequestOtp}
                        disabled={otpLoading}
                      >
                        {otpLoading ? "جاري الإرسال..." : "إعادة إرسال الرمز"}
                      </Button>

                      <Button 
                        type="button" 
                        variant="ghost" 
                        className="w-full" 
                        onClick={() => {
                          setShowOtpInput(false);
                          setOtpSent(false);
                          setOtp("");
                        }}
                      >
                        العودة لتسجيل الدخول العادي
                      </Button>
                    </form>
                  ) : (
                    <form onSubmit={handleSignIn} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="password">كلمة المرور</Label>
                        <Input
                          id="password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          dir="ltr"
                        />
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={loading}
                      >
                        {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
                      </Button>
                      
                      <div className="text-center">
                        <span className="text-sm text-muted-foreground">أو</span>
                      </div>
                      
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="w-full" 
                        onClick={handleRequestOtp}
                        disabled={otpLoading || !email}
                      >
                        {otpLoading ? "جاري الإرسال..." : "تسجيل الدخول برمز التحقق"}
                      </Button>
                    </form>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <CardTitle className="text-center mb-4">إنشاء حساب جديد</CardTitle>
                  <CardDescription className="text-center mb-6">
                    أدخل بياناتك لإنشاء حساب جديد
                  </CardDescription>

                  <div className="space-y-2">
                    <Label htmlFor="fullName">الاسم الكامل</Label>
                    <Input
                      id="fullName"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signupEmail">البريد الإلكتروني</Label>
                    <Input
                      id="signupEmail"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      dir="ltr"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">رقم الهاتف</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="05xxxxxxxx"
                      dir="ltr"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company">اسم الشركة (اختياري)</Label>
                    <Input
                      id="company"
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signupPassword">كلمة المرور</Label>
                    <Input
                      id="signupPassword"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      dir="ltr"
                      minLength={6}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={loading}
                  >
                    {loading ? "جاري إنشاء الحساب..." : "إنشاء حساب"}
                  </Button>
                </form>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </PageContainer>
  );
};

export default Auth;