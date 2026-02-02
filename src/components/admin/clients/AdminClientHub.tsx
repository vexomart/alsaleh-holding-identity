/**
 * Admin Client Hub - Complete Client Relationship Management
 * Admin sees everything customer sees PLUS internal controls
 */

import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/hooks/useLanguage";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  ArrowLeft,
  User,
  Shield,
  FileText,
  Wallet,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Building2,
  Phone,
  Mail,
  Hash,
  Calendar,
  MessageSquare,
  UserCog,
  Activity,
  CreditCard,
  FileSignature,
  ShoppingCart,
  Plus,
  Save,
} from "lucide-react";

// Import shared client hub components
import { 
  ClientIdentityCard,
  RelationshipTimeline,
  FinancialSnapshot,
  ActiveServicesCard,
  ContractsSummary,
} from "@/components/client-hub";
import { useClientHubData } from "@/hooks/useClientHubData";

interface AdminNote {
  id: string;
  content: string;
  createdAt: string;
  createdBy: string;
}

export function AdminClientHub() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const isRTL = language === "ar";
  const reducedMotion = useReducedMotion();
  const queryClient = useQueryClient();
  
  const [newNote, setNewNote] = useState("");
  const [riskLevel, setRiskLevel] = useState<string>("low");
  const [accountManager, setAccountManager] = useState<string>("");

  // Fetch client data
  const { data: clientData, isLoading: clientLoading } = useQuery({
    queryKey: ["admin-client", id],
    queryFn: async () => {
      if (!id) throw new Error("No client ID");

      const [profileRes, ordersRes, contractsRes, invoicesRes, walletRes, transactionsRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", id).single(),
        supabase.from("orders").select("*, service:services(id, name, name_ar)").eq("customer_id", id).order("created_at", { ascending: false }),
        supabase.from("contracts").select("*, service:services(id, name, name_ar)").eq("customer_user_id", id).order("created_at", { ascending: false }),
        supabase.from("invoices").select("*, order:orders(id, order_number, title)").eq("customer_id", id).order("created_at", { ascending: false }),
        supabase.from("customer_wallets").select("*").eq("customer_user_id", id).single(),
        supabase.from("financial_transactions").select("*").eq("customer_user_id", id).order("created_at", { ascending: false }).limit(50),
      ]);

      return {
        profile: profileRes.data,
        orders: ordersRes.data || [],
        contracts: contractsRes.data || [],
        invoices: invoicesRes.data || [],
        wallet: walletRes.data,
        transactions: transactionsRes.data || [],
      };
    },
    enabled: !!id,
  });

  // Fetch audit logs for this client
  const { data: auditLogs } = useQuery({
    queryKey: ["client-audit-logs", id],
    queryFn: async () => {
      const { data } = await supabase
        .from("audit_logs")
        .select("*")
        .eq("user_id", id)
        .order("created_at", { ascending: false })
        .limit(50);
      return data || [];
    },
    enabled: !!id,
  });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: reducedMotion ? 0 : 0.06 },
    },
  };

  const itemVariants = {
    hidden: reducedMotion ? {} : { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.25 } },
  };

  const BackIcon = isRTL ? ArrowRight : ArrowLeft;

  if (clientLoading) {
    return (
      <div className="space-y-6 p-1" dir={isRTL ? "rtl" : "ltr"}>
        <Skeleton className="h-12 w-48" />
        <div className="grid gap-6 lg:grid-cols-3">
          <Skeleton className="h-64 lg:col-span-2" />
          <Skeleton className="h-64" />
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (!clientData?.profile) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4" dir={isRTL ? "rtl" : "ltr"}>
        <XCircle className="h-16 w-16 text-destructive/50" />
        <p className="text-lg text-muted-foreground">
          {isRTL ? "العميل غير موجود" : "Client not found"}
        </p>
        <Button variant="outline" onClick={() => navigate("/admin/users")}>
          <BackIcon className="h-4 w-4 me-2" />
          {isRTL ? "العودة" : "Go Back"}
        </Button>
      </div>
    );
  }

  const profile = clientData.profile;
  const clientId = profile.customer_uid || `ASH-CL-${profile.id.slice(0, 6).toUpperCase()}`;

  // Calculate stats
  const totalSpent = clientData.invoices
    .filter((i: any) => i.status === "paid")
    .reduce((sum: number, i: any) => sum + (i.total || 0), 0);
  
  const pendingInvoices = clientData.invoices.filter((i: any) => i.status === "issued");
  const activeContracts = clientData.contracts.filter((c: any) => c.status === "signed");
  const pendingOrders = clientData.orders.filter((o: any) => 
    ["pending", "processing", "in_progress"].includes(o.status)
  );

  // Build timeline events for admin view
  const timelineEvents: import("@/components/client-hub/types").TimelineEvent[] = [];
  
  // Account creation
  timelineEvents.push({
    id: `account-${profile.id}`,
    type: "account_created",
    title: "Account Created",
    titleAr: "إنشاء الحساب",
    timestamp: profile.created_at,
    actor: "system",
  });

  // Orders
  clientData.orders.forEach((order: any) => {
    timelineEvents.push({
      id: `order-${order.id}`,
      type: "order_created",
      title: `Order ${order.order_number}`,
      titleAr: `طلب ${order.order_number}`,
      description: order.title,
      descriptionAr: order.title_ar,
      timestamp: order.created_at,
      actor: "client",
      relatedId: order.id,
      relatedType: "order",
    });
  });

  // Contracts
  clientData.contracts.forEach((contract: any) => {
    if (contract.status === "signed" && contract.signed_at) {
      timelineEvents.push({
        id: `contract-signed-${contract.id}`,
        type: "contract_signed",
        title: `Contract ${contract.contract_number} signed`,
        titleAr: `توقيع العقد ${contract.contract_number}`,
        timestamp: contract.signed_at,
        actor: "client",
        relatedId: contract.id,
        relatedType: "contract",
      });
    }
  });

  // Invoices & Payments
  clientData.invoices.forEach((invoice: any) => {
    timelineEvents.push({
      id: `invoice-${invoice.id}`,
      type: "invoice_issued",
      title: `Invoice ${invoice.invoice_number}`,
      titleAr: `فاتورة ${invoice.invoice_number}`,
      timestamp: invoice.created_at,
      actor: "system",
      relatedId: invoice.id,
      relatedType: "invoice",
    });

    if (invoice.status === "paid" && invoice.paid_at) {
      timelineEvents.push({
        id: `payment-${invoice.id}`,
        type: "payment_received",
        title: `Payment ${invoice.total} SAR`,
        titleAr: `دفع ${invoice.total} ر.س`,
        timestamp: invoice.paid_at,
        actor: "client",
        relatedId: invoice.id,
        relatedType: "payment",
      });
    }
  });

  // Sort timeline
  timelineEvents.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6 pb-8"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Header with Back Button */}
      <motion.div variants={itemVariants} className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate("/admin/users")}
          className="shrink-0"
        >
          <BackIcon className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">
            {isRTL ? "ملف العميل" : "Client Profile"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isRTL ? "إدارة علاقة العميل الكاملة" : "Complete client relationship management"}
          </p>
        </div>
      </motion.div>

      {/* Client Identity Header */}
      <motion.div variants={itemVariants}>
        <Card className="border-0 shadow-md bg-gradient-to-br from-slate-900 to-slate-800 text-white overflow-hidden">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center gap-6">
              {/* Avatar & Basic Info */}
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center text-3xl font-bold">
                  {profile.full_name?.[0] || profile.email?.[0]?.toUpperCase() || "C"}
                </div>
                <div>
                  <h2 className="text-2xl font-bold">
                    {isRTL ? profile.full_name_ar || profile.full_name : profile.full_name}
                  </h2>
                  <p className="text-white/70 font-mono text-sm ltr-token">
                    {clientId}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    {profile.is_kyc_verified ? (
                      <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                        <CheckCircle className="h-3 w-3 me-1" />
                        {isRTL ? "موثق" : "Verified"}
                      </Badge>
                    ) : (
                      <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30">
                        <AlertTriangle className="h-3 w-3 me-1" />
                        {isRTL ? "غير موثق" : "Unverified"}
                      </Badge>
                    )}
                    {profile.is_active ? (
                      <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                        {isRTL ? "نشط" : "Active"}
                      </Badge>
                    ) : (
                      <Badge className="bg-red-500/20 text-red-300 border-red-500/30">
                        {isRTL ? "معلق" : "Suspended"}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-4 lg:border-s lg:border-white/10 lg:ps-6">
                <div>
                  <p className="text-white/50 text-xs mb-1">{isRTL ? "البريد" : "Email"}</p>
                  <p className="text-sm font-medium ltr-token">{profile.email}</p>
                </div>
                <div>
                  <p className="text-white/50 text-xs mb-1">{isRTL ? "الهاتف" : "Phone"}</p>
                  <p className="text-sm font-medium ltr-token">{profile.phone || "-"}</p>
                </div>
                <div>
                  <p className="text-white/50 text-xs mb-1">{isRTL ? "الهوية" : "National ID"}</p>
                  <p className="text-sm font-medium ltr-token">{profile.national_id || "-"}</p>
                </div>
                <div>
                  <p className="text-white/50 text-xs mb-1">{isRTL ? "تاريخ التسجيل" : "Registered"}</p>
                  <p className="text-sm font-medium ltr-token">
                    {new Date(profile.created_at).toLocaleDateString(isRTL ? "ar-SA" : "en-US")}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { 
            label: isRTL ? "إجمالي الإنفاق" : "Total Spent", 
            value: `${totalSpent.toLocaleString()} ${isRTL ? "ر.س" : "SAR"}`,
            icon: CreditCard,
            color: "text-emerald-600"
          },
          { 
            label: isRTL ? "رصيد المحفظة" : "Wallet Balance", 
            value: `${(clientData.wallet?.balance || 0).toLocaleString()} ${isRTL ? "ر.س" : "SAR"}`,
            icon: Wallet,
            color: "text-blue-600"
          },
          { 
            label: isRTL ? "العقود النشطة" : "Active Contracts", 
            value: activeContracts.length,
            icon: FileSignature,
            color: "text-purple-600"
          },
          { 
            label: isRTL ? "الطلبات قيد التنفيذ" : "Active Orders", 
            value: pendingOrders.length,
            icon: ShoppingCart,
            color: "text-amber-600"
          },
          { 
            label: isRTL ? "فواتير معلقة" : "Pending Invoices", 
            value: pendingInvoices.length,
            icon: FileText,
            color: "text-red-600"
          },
        ].map((stat, i) => (
          <Card key={i} className="border shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={cn("p-2 rounded-lg bg-muted", stat.color)}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="text-lg font-bold ltr-token">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Main Content Tabs */}
      <motion.div variants={itemVariants}>
        <div dir={isRTL ? "rtl" : "ltr"}>
          <Tabs defaultValue="timeline" className="w-full">
            <TabsList className="w-full justify-start bg-muted/50 p-1 rounded-xl mb-4 overflow-x-auto">
              {(isRTL ? [
                { value: "admin", label: "أدوات الإدارة", icon: UserCog },
                { value: "audit", label: "سجل المراجعة", icon: Activity },
                { value: "finance", label: "المالية", icon: Wallet },
                { value: "contracts", label: "العقود", icon: FileSignature },
                { value: "orders", label: "الطلبات", icon: ShoppingCart },
                { value: "timeline", label: "السجل الزمني", icon: Clock },
              ] : [
                { value: "timeline", label: "Timeline", icon: Clock },
                { value: "orders", label: "Orders", icon: ShoppingCart },
                { value: "contracts", label: "Contracts", icon: FileSignature },
                { value: "finance", label: "Finance", icon: Wallet },
                { value: "audit", label: "Audit Log", icon: Activity },
                { value: "admin", label: "Admin Tools", icon: UserCog },
              ]).map((tab) => (
                <TabsTrigger 
                  key={tab.value} 
                  value={tab.value}
                  className="flex items-center gap-2 px-4 py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg"
                >
                  <tab.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Timeline Tab */}
            <TabsContent value="timeline" className="mt-0">
              <Card className="border shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    {isRTL ? "سجل العلاقة" : "Relationship Timeline"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RelationshipTimeline events={timelineEvents} />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders" className="mt-0">
              <Card className="border shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5 text-primary" />
                    {isRTL ? "الطلبات" : "Orders"} ({clientData.orders.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {clientData.orders.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      {isRTL ? "لا توجد طلبات" : "No orders yet"}
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {clientData.orders.slice(0, 10).map((order: any) => (
                        <div 
                          key={order.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                          onClick={() => navigate(`/admin/orders?order=${order.id}`)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                              <ShoppingCart className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{order.title}</p>
                              <p className="text-xs text-muted-foreground ltr-token">
                                {order.order_number}
                              </p>
                            </div>
                          </div>
                          <div className="text-end">
                            <Badge variant={
                              order.status === "completed" ? "default" :
                              order.status === "cancelled" ? "destructive" : "secondary"
                            }>
                              {order.status}
                            </Badge>
                            <p className="text-xs text-muted-foreground mt-1 ltr-token">
                              {new Date(order.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Contracts Tab */}
            <TabsContent value="contracts" className="mt-0">
              <Card className="border shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileSignature className="h-5 w-5 text-primary" />
                    {isRTL ? "العقود" : "Contracts"} ({clientData.contracts.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {clientData.contracts.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      {isRTL ? "لا توجد عقود" : "No contracts yet"}
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {clientData.contracts.map((contract: any) => (
                        <div 
                          key={contract.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                          onClick={() => navigate(`/admin/contracts?contract=${contract.id}`)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                              <FileSignature className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                              <p className="font-medium">
                                {contract.service?.name_ar || contract.service?.name || isRTL ? "عقد خدمة" : "Service Contract"}
                              </p>
                              <p className="text-xs text-muted-foreground ltr-token">
                                {contract.contract_number}
                              </p>
                            </div>
                          </div>
                          <div className="text-end">
                            <Badge variant={
                              contract.status === "signed" ? "default" :
                              contract.status === "cancelled" ? "destructive" : "secondary"
                            }>
                              {contract.status}
                            </Badge>
                            <p className="text-xs text-muted-foreground mt-1 ltr-token">
                              {contract.signed_at 
                                ? new Date(contract.signed_at).toLocaleDateString()
                                : new Date(contract.created_at).toLocaleDateString()
                              }
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Finance Tab */}
            <TabsContent value="finance" className="mt-0">
              <div className="grid gap-4 lg:grid-cols-2">
                {/* Wallet Info */}
                <Card className="border shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Wallet className="h-5 w-5 text-primary" />
                      {isRTL ? "المحفظة" : "Wallet"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                        <span className="text-muted-foreground">{isRTL ? "الرصيد المتاح" : "Available Balance"}</span>
                        <span className="text-xl font-bold ltr-token">
                          {(clientData.wallet?.balance || 0).toLocaleString()} {isRTL ? "ر.س" : "SAR"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                        <span className="text-muted-foreground">{isRTL ? "الرصيد المحجوز" : "Reserved Balance"}</span>
                        <span className="text-lg font-semibold ltr-token">
                          {(clientData.wallet?.reserved_balance || 0).toLocaleString()} {isRTL ? "ر.س" : "SAR"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                        <span className="text-muted-foreground">{isRTL ? "رقم المحفظة" : "Wallet Number"}</span>
                        <span className="font-mono text-sm ltr-token">
                          {clientData.wallet?.wallet_number || "-"}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Transactions */}
                <Card className="border shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Activity className="h-5 w-5 text-primary" />
                      {isRTL ? "آخر المعاملات" : "Recent Transactions"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {clientData.transactions.length === 0 ? (
                      <p className="text-center text-muted-foreground py-4">
                        {isRTL ? "لا توجد معاملات" : "No transactions"}
                      </p>
                    ) : (
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {clientData.transactions.slice(0, 10).map((tx: any) => (
                          <div key={tx.id} className="flex justify-between items-center p-2 border-b last:border-0">
                            <div>
                              <p className="text-sm font-medium">
                                {isRTL ? tx.description_ar || tx.description : tx.description}
                              </p>
                              <p className="text-xs text-muted-foreground ltr-token">
                                {new Date(tx.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            <span className={cn(
                              "font-semibold ltr-token",
                              tx.transaction_type === "credit" ? "text-emerald-600" : "text-red-600"
                            )}>
                              {tx.transaction_type === "credit" ? "+" : "-"}{tx.amount.toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Audit Log Tab */}
            <TabsContent value="audit" className="mt-0">
              <Card className="border shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    {isRTL ? "سجل المراجعة" : "Audit Log"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {!auditLogs || auditLogs.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      {isRTL ? "لا توجد سجلات" : "No audit logs"}
                    </p>
                  ) : (
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {auditLogs.map((log: any) => (
                        <div key={log.id} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <Activity className="h-4 w-4 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm">{log.action}</p>
                            <p className="text-xs text-muted-foreground truncate">
                              {log.table_name} • {log.record_id?.slice(0, 8)}
                            </p>
                          </div>
                          <p className="text-xs text-muted-foreground ltr-token shrink-0">
                            {new Date(log.created_at).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Admin Tools Tab */}
            <TabsContent value="admin" className="mt-0">
              <div className="grid gap-4 lg:grid-cols-2">
                {/* Internal Notes */}
                <Card className="border shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-primary" />
                      {isRTL ? "ملاحظات داخلية" : "Internal Notes"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Textarea 
                        placeholder={isRTL ? "أضف ملاحظة داخلية..." : "Add internal note..."}
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        className="min-h-24"
                      />
                      <Button className="w-full" disabled={!newNote.trim()}>
                        <Plus className="h-4 w-4 me-2" />
                        {isRTL ? "إضافة ملاحظة" : "Add Note"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Risk & Management */}
                <Card className="border shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Shield className="h-5 w-5 text-primary" />
                      {isRTL ? "إدارة الحساب" : "Account Management"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        {isRTL ? "مستوى المخاطر" : "Risk Level"}
                      </label>
                      <Select value={riskLevel} onValueChange={setRiskLevel}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">
                            <span className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-emerald-500" />
                              {isRTL ? "منخفض" : "Low"}
                            </span>
                          </SelectItem>
                          <SelectItem value="medium">
                            <span className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-amber-500" />
                              {isRTL ? "متوسط" : "Medium"}
                            </span>
                          </SelectItem>
                          <SelectItem value="high">
                            <span className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-red-500" />
                              {isRTL ? "عالي" : "High"}
                            </span>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        {isRTL ? "مدير الحساب" : "Account Manager"}
                      </label>
                      <Select value={accountManager} onValueChange={setAccountManager}>
                        <SelectTrigger>
                          <SelectValue placeholder={isRTL ? "اختر مدير حساب" : "Select manager"} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">{isRTL ? "بدون تعيين" : "Unassigned"}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="pt-2 border-t space-y-2">
                      <Button variant="outline" className="w-full justify-start">
                        <UserCog className="h-4 w-4 me-2" />
                        {isRTL ? "تعديل حالة الحساب" : "Change Account Status"}
                      </Button>
                      <Button variant="outline" className="w-full justify-start text-amber-600 hover:text-amber-700">
                        <AlertTriangle className="h-4 w-4 me-2" />
                        {isRTL ? "تعليق الحساب" : "Suspend Account"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default AdminClientHub;
