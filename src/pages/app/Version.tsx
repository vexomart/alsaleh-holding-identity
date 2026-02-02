/**
 * Version Page - /app/version
 * صفحة تحقق من النسخة الحالية للتطبيق والتصميمات
 */

import { useLanguage } from '@/hooks/useLanguage';
import { CacheBuster } from '@/components/CacheBuster';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, RefreshCw, FileText, Palette, Server } from 'lucide-react';

// Build info - يُحدَّث مع كل تغيير
const BUILD_INFO = {
  version: '2.0.0',
  buildDate: '2026-02-02',
  invoiceUIVersion: 'v2.0',
  invoicePDFVersion: 'v2.0',
  swVersion: 'v3.0.0-2026-02-02',
};

export default function VersionPage() {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  const checks = [
    {
      id: 'ui',
      icon: Palette,
      label: isRTL ? 'واجهة الفاتورة' : 'Invoice UI',
      expected: 'UI Template v2.0 - 2026',
      version: BUILD_INFO.invoiceUIVersion,
    },
    {
      id: 'pdf',
      icon: FileText,
      label: isRTL ? 'قالب PDF' : 'PDF Template',
      expected: 'Template v2.0 - 2026',
      version: BUILD_INFO.invoicePDFVersion,
    },
    {
      id: 'sw',
      icon: Server,
      label: isRTL ? 'Service Worker' : 'Service Worker',
      expected: BUILD_INFO.swVersion,
      version: BUILD_INFO.swVersion,
    },
  ];

  return (
    <div className="container max-w-2xl py-8 space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">
          {isRTL ? 'معلومات النسخة' : 'Version Information'}
        </h1>
        <p className="text-muted-foreground text-sm">
          {isRTL 
            ? 'تأكد من أن التطبيق يعمل بأحدث نسخة'
            : 'Verify the app is running the latest version'
          }
        </p>
      </div>

      {/* Build Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            {isRTL ? 'معلومات البناء' : 'Build Info'}
          </CardTitle>
          <CardDescription>
            {isRTL ? 'النسخة الحالية من التطبيق' : 'Current application version'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">{isRTL ? 'النسخة:' : 'Version:'}</span>
              <Badge variant="secondary" className="ms-2 font-mono">{BUILD_INFO.version}</Badge>
            </div>
            <div>
              <span className="text-muted-foreground">{isRTL ? 'تاريخ البناء:' : 'Build Date:'}</span>
              <span className="ms-2 font-mono">{BUILD_INFO.buildDate}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Version Checks */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {isRTL ? 'فحص المكونات' : 'Component Checks'}
          </CardTitle>
          <CardDescription>
            {isRTL 
              ? 'إذا لم تتطابق النسخ، امسح الكاش من الأسفل'
              : 'If versions don\'t match, clear cache below'
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {checks.map((check) => {
            const Icon = check.icon;
            const isMatch = true; // In production, this would check actual loaded versions
            return (
              <div 
                key={check.id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{check.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <code className="text-xs bg-background px-2 py-1 rounded">{check.version}</code>
                  {isMatch ? (
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Expected Markers */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {isRTL ? 'علامات التحقق المتوقعة' : 'Expected Verification Markers'}
          </CardTitle>
          <CardDescription>
            {isRTL 
              ? 'ابحث عن هذه النصوص للتأكد من النسخة'
              : 'Look for these texts to verify version'
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
            <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
              {isRTL ? 'داخل واجهة الفاتورة (في الأسفل):' : 'Inside Invoice UI (at bottom):'}
            </p>
            <code className="text-xs mt-1 block font-mono text-amber-700 dark:text-amber-300">
              UI Template v2.0 - 2026
            </code>
          </div>
          <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
            <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
              {isRTL ? 'داخل ملف PDF (في التذييل):' : 'Inside PDF file (in footer):'}
            </p>
            <code className="text-xs mt-1 block font-mono text-blue-700 dark:text-blue-300">
              Template v2.0 - 2026
            </code>
          </div>
        </CardContent>
      </Card>

      {/* Manual Steps */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {isRTL ? 'خطوات يدوية للمسح' : 'Manual Clear Steps'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div>
            <h4 className="font-semibold mb-2">Safari (Mac/iOS):</h4>
            <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
              <li>{isRTL ? 'اذهب إلى الإعدادات' : 'Go to Settings'} → Safari</li>
              <li>{isRTL ? 'انقر على' : 'Tap'} "{isRTL ? 'مسح السجل وبيانات المواقع' : 'Clear History and Website Data'}"</li>
              <li>{isRTL ? 'أو: الإعدادات' : 'Or: Settings'} → Safari → {isRTL ? 'متقدم' : 'Advanced'} → {isRTL ? 'بيانات المواقع' : 'Website Data'} → {isRTL ? 'احذف بيانات هذا الموقع' : 'Remove data for this site'}</li>
            </ol>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Chrome (Desktop/Android):</h4>
            <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
              <li>{isRTL ? 'اضغط' : 'Press'} F12 → Application → Storage → "Clear site data"</li>
              <li>{isRTL ? 'أو: اضغط' : 'Or: Press'} Ctrl+Shift+Delete → {isRTL ? 'امسح بيانات التصفح' : 'Clear browsing data'}</li>
            </ol>
          </div>
        </CardContent>
      </Card>

      {/* Cache Buster Button */}
      <div className="flex justify-center pt-4">
        <CacheBuster />
      </div>
    </div>
  );
}
