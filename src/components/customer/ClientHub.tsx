/**
 * Client Hub - Premium Enterprise Dashboard
 * World-class client experience with RTL-first design
 */

import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { ClientActionItems } from "./hub/ClientActionItems";
import { ClientQuickStats } from "./hub/ClientQuickStats";
import { ClientRecentActivity } from "./hub/ClientRecentActivity";
import { ServiceJourneyTimeline } from "./hub/ServiceJourneyTimeline";
import {
  Sparkles,
  User,
  Shield,
  Copy,
  CheckCircle2,
  ArrowUpRight,
  Plus,
  ChevronLeft,
  ChevronRight,
  Package,
  FileSignature,
  Receipt,
  Wallet,
  Bell,
  TrendingUp,
  Clock,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ClientHubData {
  pendingOrders: number;
  activeContracts: number;
  pendingInvoices: number;
  unreadNotifications: number;
  walletBalance: number;
  totalSpent: number;
  completedOrders: number;
  recentOrders: any[];
  actionItems: ActionItem[];
}

export interface ActionItem {
  id: string;
  type: 'contract_signature' | 'pending_invoice' | 'order_update' | 'contract_approval';
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  link: string;
  priority: 'high' | 'medium' | 'low';
  createdAt: string;
  metadata?: Record<string, any>;
}

export function ClientHub() {
  const { language } = useLanguage();
  const isRTL = language === "ar";
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const [data, setData] = useState<ClientHubData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(false);

  // RTL helpers
  const rtlRow = isRTL ? "flex-row-reverse" : "flex-row";
  const rtlText = isRTL ? "text-right" : "text-left";
  const rtlJustify = isRTL ? "justify-end" : "justify-start";

  // Time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return isRTL ? "صباح الخير" : "Good Morning";
    if (hour < 17) return isRTL ? "مساء الخير" : "Good Afternoon";
    return isRTL ? "مساء الخير" : "Good Evening";
  };

  // Copy client ID
  const copyClientId = () => {
    if (profile?.customer_uid) {
      navigator.clipboard.writeText(profile.customer_uid);
      setCopiedId(true);
      toast({
        title: isRTL ? "تم النسخ" : "Copied",
        description: isRTL ? "تم نسخ رقم العميل" : "Client ID copied to clipboard",
      });
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        // Parallel fetch all data
        const [ordersRes, contractsRes, invoicesRes, notifsRes, walletRes] = await Promise.all([
          supabase
            .from("orders")
            .select("*")
            .eq("customer_id", user.id)
            .order("created_at", { ascending: false }),
          supabase
            .from("contracts")
            .select("*, service:services(name, name_ar)")
            .eq("customer_user_id", user.id)
            .order("created_at", { ascending: false }),
          supabase
            .from("invoices")
            .select("*")
            .eq("customer_id", user.id)
            .order("created_at", { ascending: false }),
          supabase
            .from("notifications")
            .select("*")
            .eq("user_id", user.id)
            .eq("is_read", false),
          supabase
            .from("customer_wallets")
            .select("*")
            .eq("customer_user_id", user.id)
            .single(),
        ]);

        const orders = ordersRes.data || [];
        const contracts = contractsRes.data || [];
        const invoices = invoicesRes.data || [];
        const notifications = notifsRes.data || [];
        const wallet = walletRes.data;

        // Build action items
        const actionItems: ActionItem[] = [];

        // Contracts pending signature
        contracts
          .filter((c: any) => c.status === 'pending_signature')
          .forEach((c: any) => {
            actionItems.push({
              id: c.id,
              type: 'contract_signature',
              titleAr: 'عقد بانتظار التوقيع',
              titleEn: 'Contract Pending Signature',
              descriptionAr: `عقد ${c.service?.name_ar || 'خدمة'} جاهز للتوقيع`,
              descriptionEn: `${c.service?.name || 'Service'} contract ready for signature`,
              link: `/app/contracts/${c.id}`,
              priority: 'high',
              createdAt: c.created_at,
              metadata: { contractNumber: c.contract_number },
            });
          });

        // Invoices pending payment
        invoices
          .filter((i: any) => i.status === 'issued')
          .forEach((i: any) => {
            actionItems.push({
              id: i.id,
              type: 'pending_invoice',
              titleAr: 'فاتورة بانتظار الدفع',
              titleEn: 'Invoice Pending Payment',
              descriptionAr: `فاتورة بقيمة ${i.total} ريال`,
              descriptionEn: `Invoice for ${i.total} SAR`,
              link: `/app/orders`,
              priority: 'high',
              createdAt: i.created_at,
              metadata: { invoiceNumber: i.invoice_number, amount: i.total },
            });
          });

        // Orders awaiting admin action
        orders
          .filter((o: any) => o.status === 'pending' && o.requires_contract && !o.contract_pre_approved)
          .forEach((o: any) => {
            actionItems.push({
              id: o.id,
              type: 'contract_approval',
              titleAr: 'طلب بانتظار الموافقة',
              titleEn: 'Order Awaiting Approval',
              descriptionAr: `طلب ${o.title_ar || o.title} قيد المراجعة`,
              descriptionEn: `${o.title} is under review`,
              link: `/app/orders`,
              priority: 'medium',
              createdAt: o.created_at,
              metadata: { orderNumber: o.order_number },
            });
          });

        // Calculate stats
        const totalSpent = invoices
          .filter((i: any) => i.status === 'paid')
          .reduce((sum: number, i: any) => sum + (i.total || 0), 0);

        setData({
          pendingOrders: orders.filter((o: any) => ['pending', 'processing', 'in_progress'].includes(o.status)).length,
          activeContracts: contracts.filter((c: any) => !['signed', 'cancelled'].includes(c.status)).length,
          pendingInvoices: invoices.filter((i: any) => i.status === 'issued').length,
          unreadNotifications: notifications.length,
          walletBalance: wallet?.balance || 0,
          totalSpent,
          completedOrders: orders.filter((o: any) => o.status === 'completed').length,
          recentOrders: orders.slice(0, 5),
          actionItems: actionItems.sort((a, b) => {
            const priorityOrder = { high: 0, medium: 1, low: 2 };
            return priorityOrder[a.priority] - priorityOrder[b.priority];
          }),
        });
      } catch (error) {
        console.error("Error fetching client hub data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Real-time subscription
    const channel = supabase
      .channel("client-hub")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders", filter: `customer_id=eq.${user.id}` }, fetchData)
      .on("postgres_changes", { event: "*", schema: "public", table: "contracts", filter: `customer_user_id=eq.${user.id}` }, fetchData)
      .on("postgres_changes", { event: "*", schema: "public", table: "invoices", filter: `customer_id=eq.${user.id}` }, fetchData)
      .on("postgres_changes", { event: "*", schema: "public", table: "notifications", filter: `user_id=eq.${user.id}` }, fetchData)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(isRTL ? "ar-SA" : "en-US", {
      style: "currency",
      currency: "SAR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Quick actions
  const quickActions = [
    {
      titleAr: "طلب خدمة جديدة",
      titleEn: "New Service",
      icon: Plus,
      onClick: () => navigate("/app/services"),
      gradient: "from-primary to-primary/70",
    },
    {
      titleAr: "طلباتي",
      titleEn: "My Orders",
      icon: Package,
      onClick: () => navigate("/app/orders"),
      gradient: "from-blue-500 to-blue-600",
    },
    {
      titleAr: "عقودي",
      titleEn: "Contracts",
      icon: FileSignature,
      onClick: () => navigate("/app/contracts"),
      gradient: "from-emerald-500 to-emerald-600",
    },
    {
      titleAr: "المحفظة",
      titleEn: "Wallet",
      icon: Wallet,
      onClick: () => navigate("/app/wallet"),
      gradient: "from-purple-500 to-purple-600",
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6" dir={isRTL ? "rtl" : "ltr"}>
        <Skeleton className="h-48 w-full rounded-2xl" />
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <Skeleton className="h-64 lg:col-span-2 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div 
      className={cn("space-y-6", rtlText)} 
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Hero Section - Client Identity */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 md:p-8"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/15 rounded-full blur-3xl" />
        
        <div className="relative z-10">
          {/* Header Row */}
          <div className={cn("flex items-start justify-between gap-4 flex-wrap", rtlRow)}>
            <div className="space-y-3">
              {/* Portal Badge */}
              <div className={cn("inline-flex items-center gap-2", rtlRow)}>
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-primary text-sm font-medium">
                  {isRTL ? "بوابة العميل" : "Client Portal"}
                </span>
              </div>
              
              {/* Greeting */}
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                {getGreeting()}، {profile?.full_name || profile?.email?.split("@")[0]} 👋
              </h1>
              
              <p className="text-slate-300 text-sm md:text-base max-w-lg">
                {isRTL 
                  ? "مرحباً بك في لوحة التحكم. يمكنك متابعة طلباتك وعقودك من هنا."
                  : "Welcome to your dashboard. Track orders and manage contracts here."
                }
              </p>
            </div>

            {/* Client ID Card */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 min-w-[200px]">
              <div className={cn("flex items-center gap-2 mb-2", rtlRow)}>
                <User className="h-4 w-4 text-primary" />
                <span className="text-xs text-slate-300">
                  {isRTL ? "رقم العميل" : "Client ID"}
                </span>
              </div>
              <div className={cn("flex items-center gap-2", rtlRow)}>
                <span className="font-mono text-white text-sm" dir="ltr">
                  {profile?.customer_uid || "---"}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyClientId}
                  className="h-7 w-7 p-0 text-slate-400 hover:text-white"
                >
                  {copiedId ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </Button>
              </div>
              <div className={cn("flex items-center gap-1.5 mt-2", rtlRow)}>
                <Shield className="h-3 w-3 text-emerald-400" />
                <span className="text-xs text-emerald-400">
                  {profile?.is_kyc_verified
                    ? isRTL ? "موثق" : "Verified"
                    : isRTL ? "غير موثق" : "Not Verified"
                  }
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className={cn("flex flex-wrap gap-3 mt-6 pt-6 border-t border-white/10", rtlRow)}>
            {quickActions.map((action, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
                <Button
                  onClick={action.onClick}
                  variant="secondary"
                  className={cn(
                    "gap-2 bg-white/10 hover:bg-white/20 text-white border-0",
                    rtlRow
                  )}
                >
                  <action.icon className="h-4 w-4" />
                  {isRTL ? action.titleAr : action.titleEn}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Quick Stats Row */}
      <ClientQuickStats
        data={data}
        isRTL={isRTL}
        formatCurrency={formatCurrency}
      />

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Action Items - Priority Section */}
        <div className="lg:col-span-2">
          <ClientActionItems
            items={data?.actionItems || []}
            isRTL={isRTL}
          />
        </div>

        {/* Recent Activity */}
        <div>
          <ClientRecentActivity
            orders={data?.recentOrders || []}
            isRTL={isRTL}
          />
        </div>
      </div>

      {/* Service Journey Section */}
      {data && data.recentOrders.length > 0 && (
        <ServiceJourneyTimeline
          orders={data.recentOrders.slice(0, 3)}
          isRTL={isRTL}
        />
      )}
    </div>
  );
}
