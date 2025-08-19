import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, UserPlus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export default function AdminSetup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [checkingAdmins, setCheckingAdmins] = useState(true);
  const [adminExists, setAdminExists] = useState(false);

  useEffect(() => {
    checkForExistingAdmins();
  }, []);

  const checkForExistingAdmins = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('admin-setup', {
        body: { action: 'check_admin_exists' }
      });

      if (error) {
        console.error('Error checking admins:', error);
        setError('حدث خطأ أثناء التحقق من المديرين');
      } else {
        setAdminExists(data.admin_exists);
      }
    } catch (err) {
      console.error('Failed to check admins:', err);
      setError('حدث خطأ أثناء التحقق من النظام');
    } finally {
      setCheckingAdmins(false);
    }
  };

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.functions.invoke('admin-setup', {
        body: {
          action: 'create_first_admin',
          email,
          password,
          fullName,
          role: 'owner' // First admin is always owner
        }
      });

      if (error) {
        setError(data?.error || 'حدث خطأ أثناء إنشاء المدير');
        return;
      }

      setSuccess(true);
      setError('');
    } catch (err: any) {
      console.error('Admin setup error:', err);
      setError('حدث خطأ أثناء إعداد النظام');
    } finally {
      setLoading(false);
    }
  };

  if (checkingAdmins) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">جاري التحقق من النظام...</p>
        </div>
      </div>
    );
  }

  if (adminExists) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">النظام جاهز</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground mb-4">
              تم إعداد النظام مسبقاً. يرجى استخدام صفحة تسجيل الدخول.
            </p>
            <Button 
              onClick={() => window.location.href = '/admin'} 
              className="w-full"
            >
              الانتقال لتسجيل الدخول
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-600">تم الإعداد بنجاح</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground mb-4">
              تم إنشاء حساب المدير الأول بنجاح. يمكنك الآن تسجيل الدخول إلى لوحة الإدارة.
            </p>
            <Button 
              onClick={() => window.location.href = '/admin'} 
              className="w-full"
            >
              تسجيل الدخول الآن
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
            <UserPlus className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">إعداد المدير الأول</CardTitle>
          <p className="text-muted-foreground">
            مرحباً بك! يرجى إنشاء حساب المدير الأول للنظام
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSetup} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="name">الاسم الكامل</Label>
              <Input
                id="name"
                type="text"
                placeholder="أدخل الاسم الكامل"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@alialshehriholding.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">كلمة المرور</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                minLength={8}
              />
              <p className="text-xs text-muted-foreground">
                يجب أن تكون كلمة المرور 8 أحرف على الأقل
              </p>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              <UserPlus className="w-4 h-4 mr-2" />
              {loading ? 'جاري إنشاء المدير الأول...' : 'إنشاء المدير الأول'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}