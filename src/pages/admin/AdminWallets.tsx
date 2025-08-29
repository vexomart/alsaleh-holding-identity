import { CustomerWalletsList } from "@/components/admin/CustomerWalletsList";
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";
import { Wallet } from "lucide-react";

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
        {/* عرض قائمة المحافظ المحدثة */}
        <CustomerWalletsList />
      </div>
    </PageContainer>
  );
};

export default AdminWallets;