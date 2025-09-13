import React from 'react';
import { AuthDiagnostics } from '@/components/admin/AuthDiagnostics';

const AuthDiagnosticsPage = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">تشخيص المصادقة</h1>
        <p className="text-muted-foreground mt-2">
          أداة تشخيص مشاكل تسجيل الدخول وإصلاح حسابات المستخدمين
        </p>
      </div>
      <AuthDiagnostics />
    </div>
  );
};

export default AuthDiagnosticsPage;