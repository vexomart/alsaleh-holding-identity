import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Shield, Lock, ArrowRight, Loader2, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { AUTH_ROUTES, AUTH_MESSAGES } from '@/auth/new-auth-system';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      setError('يرجى إدخال البريد الإلكتروني وكلمة المرور');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // TODO: Implement actual admin login logic
      console.log('Admin login attempt:', { email, realm: 'admin' });
      
      // مثال مؤقت
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success(AUTH_MESSAGES.SUCCESS.LOGIN);
      navigate(AUTH_ROUTES.ADMIN.DASHBOARD);
    } catch (error: any) {
      setError(error.message || AUTH_MESSAGES.ERROR.INVALID_CREDENTIALS);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden" dir="rtl">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(56,189,248,0.1),transparent_70%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_48%,rgba(56,189,248,0.03)_49%,rgba(56,189,248,0.03)_51%,transparent_52%)] bg-[length:20px_20px]" />

      <div className="relative w-full max-w-md z-10">
        <div className="mb-6 text-center">
          <Link
            to="/"
            className="inline-flex items-center text-slate-400 hover:text-white transition-colors group"
          >
            <ArrowRight className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
            العودة للرئيسية
          </Link>
        </div>

        <Card className="bg-white/5 backdrop-blur-lg border-white/10 shadow-2xl">
          <CardHeader className="text-center pb-8">
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-full bg-blue-500/20 border border-blue-400/30 backdrop-blur-sm">
                <Shield className="w-8 h-8 text-blue-400" />
              </div>
            </div>
            
            <CardTitle className="text-2xl text-white mb-2 font-bold">
              لوحة إدارة النظام
            </CardTitle>
            <p className="text-slate-400">
              مدخل المدراء المعتمدين فقط
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive" className="bg-red-500/10 border-red-500/20 text-red-300">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-300">
                البريد الإلكتروني
              </Label>
              <div className="relative">
                <Mail className="absolute right-3 top-3 w-4 h-4 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@alishehri.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                  onKeyPress={handleKeyPress}
                  className="bg-white/5 border-white/10 text-white placeholder:text-slate-400 focus:border-blue-400/50 focus:ring-blue-400/20 pr-10"
                  dir="ltr"
                  style={{ textAlign: 'left' }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-300">
                كلمة المرور
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="كلمة المرور"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError('');
                  }}
                  onKeyPress={handleKeyPress}
                  className="bg-white/5 border-white/10 text-white placeholder:text-slate-400 focus:border-blue-400/50 focus:ring-blue-400/20 pl-12"
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
                  className="absolute left-0 top-0 h-full px-3 py-2 hover:bg-white/10 text-slate-400 hover:text-white"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <Button 
              onClick={handleLogin}
              disabled={loading || !email || !password}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                  جارٍ تسجيل الدخول...
                </div>
              ) : (
                <div className="flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Lock className="w-4 h-4 ml-2" />
                  تسجيل الدخول
                </div>
              )}
            </Button>

            <div className="text-center">
              <p className="text-slate-400 text-sm leading-relaxed">
                🔒 هذا النظام محمي ومخصص للمدراء المعتمدين فقط
                <br />
                جميع محاولات الوصول غير المصرح بها مسجلة ومراقبة
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminLoginPage;