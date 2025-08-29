import { CustomerWalletsList } from "@/components/admin/CustomerWalletsList";
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Wallet, Mail, AlertTriangle } from "lucide-react";

const AdminWallets = () => {
  return (
    <PageContainer>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-br from-primary to-primary/80 rounded-xl shadow-lg">
          <Wallet className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">إدارة المحفظة الرقمية</h1>
          <p className="text-muted-foreground">متابعة وإدارة أرصدة العملاء والمعاملات المالية</p>
        </div>
      </div>
      
      <div className="space-y-6">
        {/* إشعار حول الإيميلات */}
        <Card className="bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  إشعارات الإيميل التلقائية
                </h4>
                <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">
                  سيتم إرسال إشعارات تلقائية للعملاء عبر الإيميل عند تنفيذ عمليات الإيداع والسحب.
                </p>
                <div className="flex items-center gap-2 text-xs text-blue-700 dark:text-blue-300">
                  <AlertTriangle className="h-4 w-4" />
                  <span>تأكد من أن العملاء لديهم إيميلات صحيحة مسجلة في النظام</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* عرض قائمة المحافظ المحدثة */}
        <CustomerWalletsList />
      </div>
    </PageContainer>
  );
};

export default AdminWallets;