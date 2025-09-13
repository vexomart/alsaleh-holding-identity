import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

interface DiagnosticResult {
  userId: string;
  email: string;
  status: string;
  passwordAlgo: string;
  issues: string[];
}

export const AuthDiagnostics = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [error, setError] = useState('');

  const runDiagnostic = async () => {
    if (!email) return;
    
    setLoading(true);
    setError('');
    setResult(null);
    
    try {
      // For now, show a placeholder result
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setResult({
        userId: 'test-user-id',
        email: email,
        status: 'active',
        passwordAlgo: 'bcrypt',
        issues: []
      });
    } catch (err: any) {
      setError('حدث خطأ أثناء التشخيص');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'disabled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>تشخيص المصادقة</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">البريد الإلكتروني للمستخدم</Label>
          <Input
            id="email"
            type="email"
            placeholder="أدخل البريد الإلكتروني"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        
        <Button 
          onClick={runDiagnostic} 
          disabled={loading || !email}
          className="w-full"
        >
          {loading ? 'جارٍ التشخيص...' : 'تشخيص المستخدم'}
        </Button>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {result && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-md">
            <h3 className="font-semibold">نتائج التشخيص</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>معرف المستخدم</Label>
                <p className="text-sm text-muted-foreground">{result.userId}</p>
              </div>
              <div>
                <Label>البريد الإلكتروني</Label>
                <p className="text-sm text-muted-foreground">{result.email}</p>
              </div>
              <div>
                <Label>الحالة</Label>
                <Badge className={getStatusColor(result.status)}>
                  {result.status}
                </Badge>
              </div>
              <div>
                <Label>خوارزمية كلمة المرور</Label>
                <p className="text-sm text-muted-foreground">{result.passwordAlgo}</p>
              </div>
            </div>

            {result.issues.length > 0 && (
              <div>
                <Label>المشاكل المكتشفة</Label>
                <ul className="list-disc list-inside text-sm text-red-600">
                  {result.issues.map((issue, index) => (
                    <li key={index}>{issue}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                إعادة تعيين كلمة المرور
              </Button>
              <Button variant="outline" size="sm">
                إصلاح تلقائي
              </Button>
              <Button variant="outline" size="sm" onClick={runDiagnostic}>
                إعادة التشخيص
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};