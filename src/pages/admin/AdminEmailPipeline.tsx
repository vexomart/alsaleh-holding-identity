import React, { useState } from "react";
import { useEmailPipeline } from "@/hooks/useEmailPipeline";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  RefreshCw, 
  Send, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Mail, 
  Filter,
  Play,
  RotateCcw,
  TestTube2,
  BarChart3,
  Users,
  Timer
} from "lucide-react";

const AdminEmailPipeline = () => {
  const {
    emails,
    stats,
    loading,
    filters,
    setFilters,
    retryFailedEmail,
    processQueue,
    retryAllFailed,
    sendTestEmail,
    refreshData,
  } = useEmailPipeline();

  const [testEmail, setTestEmail] = useState("");
  const [testTemplate, setTestTemplate] = useState("wallet_deposit_approved");
  const { toast } = useToast();

  const getStatusBadge = (status: string, retries: number = 0) => {
    switch (status) {
      case 'sent':
        return <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-200">
          <CheckCircle className="w-3 h-3 ml-1" />
          تم الإرسال
        </Badge>;
      case 'failed':
        return <Badge variant="destructive">
          <AlertCircle className="w-3 h-3 ml-1" />
          فشل ({retries})
        </Badge>;
      case 'pending':
        return <Badge variant="secondary">
          <Clock className="w-3 h-3 ml-1" />
          في الانتظار
        </Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTemplateDisplayName = (templateKey: string) => {
    const templates = {
      'wallet_deposit_approved': 'اعتماد الإيداع',
      'wallet_deposit_rejected': 'رفض الإيداع',
      'wallet_withdraw_approved': 'اعتماد السحب',
      'wallet_withdraw_rejected': 'رفض السحب',
      'otp_code': 'رمز التحقق',
    };
    return templates[templateKey as keyof typeof templates] || templateKey;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleSendTestEmail = async () => {
    if (!testEmail) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال بريد إلكتروني للاختبار",
        variant: "destructive",
      });
      return;
    }
    await sendTestEmail(testTemplate, testEmail);
    setTestEmail("");
  };

  return (
    <div className="space-y-6 p-6" dir="rtl">
        {/* العنوان والإحصائيات */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">📧 Email Pipeline</h1>
            <p className="text-muted-foreground">إدارة ومراقبة نظام الإيميلات</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={processQueue} variant="outline" size="sm">
              <Play className="w-4 h-4 ml-2" />
              معالجة الطابور
            </Button>
            <Button onClick={retryAllFailed} variant="outline" size="sm">
              <RotateCcw className="w-4 h-4 ml-2" />
              إعادة محاولة الفاشل
            </Button>
            <Button onClick={refreshData} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 ml-2" />
              تحديث
            </Button>
          </div>
        </div>

        {/* إحصائيات سريعة */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">مرسل اليوم</p>
                  <p className="text-2xl font-bold text-green-600">{stats.sent_today}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">فاشل اليوم</p>
                  <p className="text-2xl font-bold text-red-600">{stats.failed_today}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">في الانتظار</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">إجمالي مرسل</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.total_sent}</p>
                </div>
                <Mail className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">إجمالي فاشل</p>
                  <p className="text-2xl font-bold text-red-600">{stats.total_failed}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="emails" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="emails">الإيميلات</TabsTrigger>
            <TabsTrigger value="test">اختبار الإرسال</TabsTrigger>
          </TabsList>

          <TabsContent value="emails" className="space-y-4">
            {/* فلاتر البحث */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  فلاتر البحث
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="search">البحث (البريد أو الموضوع)</Label>
                    <Input
                      id="search"
                      placeholder="ابحث في الإيميلات..."
                      value={filters.search}
                      onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="status">الحالة</Label>
                    <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                      <SelectTrigger id="status">
                        <SelectValue placeholder="اختر الحالة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">جميع الحالات</SelectItem>
                        <SelectItem value="sent">مرسل</SelectItem>
                        <SelectItem value="failed">فاشل</SelectItem>
                        <SelectItem value="pending">في الانتظار</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="template">نوع القالب</Label>
                    <Select value={filters.template} onValueChange={(value) => setFilters({ ...filters, template: value })}>
                      <SelectTrigger id="template">
                        <SelectValue placeholder="اختر القالب" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">جميع القوالب</SelectItem>
                        <SelectItem value="wallet_deposit_approved">اعتماد الإيداع</SelectItem>
                        <SelectItem value="wallet_deposit_rejected">رفض الإيداع</SelectItem>
                        <SelectItem value="wallet_withdraw_approved">اعتماد السحب</SelectItem>
                        <SelectItem value="wallet_withdraw_rejected">رفض السحب</SelectItem>
                        <SelectItem value="otp_code">رمز التحقق</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* جدول الإيميلات */}
            <Card>
              <CardHeader>
                <CardTitle>آخر 100 إيميل</CardTitle>
                <CardDescription>
                  إجمالي: {emails.length} | 
                  مرسل: {emails.filter(e => e.status === 'sent').length} | 
                  فاشل: {emails.filter(e => e.status === 'failed').length} | 
                  معلق: {emails.filter(e => e.status === 'pending').length}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
                    جاري التحميل...
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-right">البريد الإلكتروني</TableHead>
                          <TableHead className="text-right">الموضوع</TableHead>
                          <TableHead className="text-right">القالب</TableHead>
                          <TableHead className="text-right">الحالة</TableHead>
                          <TableHead className="text-right">المحاولات</TableHead>
                          <TableHead className="text-right">تاريخ الإنشاء</TableHead>
                          <TableHead className="text-right">الإجراءات</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {emails.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                              لا توجد إيميلات مطابقة للفلاتر المحددة
                            </TableCell>
                          </TableRow>
                        ) : (
                          emails.map((email) => (
                            <TableRow key={email.id}>
                              <TableCell className="font-medium">{email.to_email}</TableCell>
                              <TableCell className="max-w-xs truncate">{email.subject}</TableCell>
                              <TableCell>{getTemplateDisplayName(email.template_key)}</TableCell>
                              <TableCell>{getStatusBadge(email.status, email.retries)}</TableCell>
                              <TableCell>{email.retries}</TableCell>
                              <TableCell>{formatDate(email.created_at)}</TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  {email.status === 'failed' && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => retryFailedEmail(email.id)}
                                    >
                                      <RotateCcw className="w-3 h-3" />
                                    </Button>
                                  )}
                                  {email.last_error && (
                                    <Dialog>
                                      <DialogTrigger asChild>
                                        <Button size="sm" variant="outline">
                                          <AlertCircle className="w-3 h-3" />
                                        </Button>
                                      </DialogTrigger>
                                      <DialogContent>
                                        <DialogHeader>
                                          <DialogTitle>تفاصيل الخطأ</DialogTitle>
                                        </DialogHeader>
                                        <div className="space-y-2">
                                          <p><strong>البريد:</strong> {email.to_email}</p>
                                          <p><strong>الموضوع:</strong> {email.subject}</p>
                                          <p><strong>الخطأ:</strong> {email.last_error}</p>
                                          <p><strong>عدد المحاولات:</strong> {email.retries}</p>
                                        </div>
                                      </DialogContent>
                                    </Dialog>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="test" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TestTube2 className="w-5 h-5" />
                  اختبار إرسال الإيميلات
                </CardTitle>
                <CardDescription>
                  اختبر إرسال القوالب المختلفة إلى بريد إلكتروني محدد
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="test-email">البريد الإلكتروني للاختبار</Label>
                    <Input
                      id="test-email"
                      type="email"
                      placeholder="test@example.com"
                      value={testEmail}
                      onChange={(e) => setTestEmail(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="test-template">قالب الاختبار</Label>
                    <Select value={testTemplate} onValueChange={setTestTemplate}>
                      <SelectTrigger id="test-template">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="wallet_deposit_approved">اعتماد الإيداع</SelectItem>
                        <SelectItem value="wallet_deposit_rejected">رفض الإيداع</SelectItem>
                        <SelectItem value="wallet_withdraw_approved">اعتماد السحب</SelectItem>
                        <SelectItem value="wallet_withdraw_rejected">رفض السحب</SelectItem>
                        <SelectItem value="otp_code">رمز التحقق</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Button onClick={handleSendTestEmail} className="w-full">
                  <Send className="w-4 h-4 ml-2" />
                  إرسال إيميل تجريبي
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
    </div>
  );
};

export default AdminEmailPipeline;