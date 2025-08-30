import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ForgotPasswordProps {
  onBack: () => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onBack }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('يرجى إدخال البريد الإلكتروني');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('يرجى إدخال بريد إلكتروني صحيح');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.functions.invoke('reset-password', {
        body: {
          action: 'send-reset',
          email
        }
      });

      if (error) throw error;

      if (data.success) {
        setSuccess(true);
        toast.success(data.message);
      } else {
        setError(data.error || 'حدث خطأ أثناء إرسال رابط إعادة التعيين');
      }
    } catch (error: any) {
      console.error('Forgot password error:', error);
      setError(error.message || 'حدث خطأ أثناء إرسال رابط إعادة التعيين');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-primary">تم الإرسال!</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني. يرجى فحص البريد الوارد والمجلد الخاص بالرسائل المرفوضة.
          </p>
          <Button onClick={onBack} variant="outline" className="w-full">
            العودة لتسجيل الدخول
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
          <Mail className="w-8 h-8 text-primary" />
        </div>
        <CardTitle className="text-2xl text-primary">نسيت كلمة المرور؟</CardTitle>
        <p className="text-muted-foreground">
          أدخل بريدك الإلكتروني وسنرسل لك رابط لإعادة تعيين كلمة المرور
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div>
            <Label htmlFor="email">البريد الإلكتروني</Label>
            <Input
              id="email"
              type="email"
              placeholder="example@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="text-right"
            />
          </div>

          <Button 
            type="submit"
            disabled={loading || !email}
            className="w-full"
          >
            {loading ? 'جارٍ الإرسال...' : 'إرسال رابط إعادة التعيين'}
          </Button>

          <Button 
            type="button"
            variant="ghost"
            onClick={onBack}
            className="w-full"
          >
            <ArrowLeft className="w-4 h-4 ml-2" />
            العودة لتسجيل الدخول
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ForgotPassword;