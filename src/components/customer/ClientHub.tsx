/**
 * Client Hub - World-Class Overview Dashboard
 * Premium mobile-first design with RTL support
 */

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/hooks/useAuth";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

// Hub Components
import { OverviewHeader } from "./hub/OverviewHeaderV2";
import { QuickActionPillsV2 as QuickActionPills } from "./hub/QuickActionPillsV2";
import { KPICardsV2 as KPICards } from "./hub/KPICardsV2";
import { ActionRequiredStrip } from "./hub/ActionRequiredStrip";
import { ActivityFeed } from "./hub/ActivityFeed";
import { ServiceJourneyCard } from "./hub/ServiceJourneyCard";

export interface ActionItem {
  id: string;
  type: "contract_signature" | "pending_invoice" | "order_update" | "contract_approval";
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  link: string;
  priority: "high" | "medium" | "low";
  createdAt: string;
  metadata?: Record<string, any>;
}

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

export function ClientHub() {
  const { language } = useLanguage();
  const isRTL = language === "ar";
  const { user, profile } = useAuth();
  const reducedMotion = useReducedMotion();

  const [data, setData] = useState<ClientHubData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return isRTL ? "صباح الخير" : "Good Morning";
    if (hour < 17) return isRTL ? "مساء الخير" : "Good Afternoon";
    return isRTL ? "مساء الخير" : "Good Evening";
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(isRTL ? "ar-SA" : "en-US", {
      style: "currency",
      currency: "SAR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
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
          .filter((c: any) => c.status === "pending_signature")
          .forEach((c: any) => {
            actionItems.push({
              id: c.id,
              type: "contract_signature",
              titleAr: "عقد بانتظار التوقيع",
              titleEn: "Contract Pending Signature",
              descriptionAr: `عقد ${c.service?.name_ar || "خدمة"} جاهز للتوقيع`,
              descriptionEn: `${c.service?.name || "Service"} contract ready for signature`,
              link: `/portal/contracts/${c.id}`,
              priority: "high",
              createdAt: c.created_at,
              metadata: { contractNumber: c.contract_number },
            });
          });

        // Invoices pending payment
        invoices
          .filter((i: any) => i.status === "issued")
          .forEach((i: any) => {
            actionItems.push({
              id: i.id,
              type: "pending_invoice",
              titleAr: "فاتورة بانتظار الدفع",
              titleEn: "Invoice Pending Payment",
              descriptionAr: `فاتورة بقيمة ${i.total} ريال`,
              descriptionEn: `Invoice for ${i.total} SAR`,
              link: `/portal/orders`,
              priority: "high",
              createdAt: i.created_at,
              metadata: { invoiceNumber: i.invoice_number, amount: i.total },
            });
          });

        // Orders awaiting admin action
        orders
          .filter((o: any) => o.status === "pending" && o.requires_contract && !o.contract_pre_approved)
          .forEach((o: any) => {
            actionItems.push({
              id: o.id,
              type: "contract_approval",
              titleAr: "طلب بانتظار الموافقة",
              titleEn: "Order Awaiting Approval",
              descriptionAr: `طلب ${o.title_ar || o.title} قيد المراجعة`,
              descriptionEn: `${o.title} is under review`,
              link: `/portal/orders`,
              priority: "medium",
              createdAt: o.created_at,
              metadata: { orderNumber: o.order_number },
            });
          });

        // Calculate stats
        const totalSpent = invoices
          .filter((i: any) => i.status === "paid")
          .reduce((sum: number, i: any) => sum + (i.total || 0), 0);

        setData({
          pendingOrders: orders.filter((o: any) =>
            ["pending", "processing", "in_progress"].includes(o.status)
          ).length,
          activeContracts: contracts.filter(
            (c: any) => !["signed", "cancelled"].includes(c.status)
          ).length,
          pendingInvoices: invoices.filter((i: any) => i.status === "issued").length,
          unreadNotifications: notifications.length,
          walletBalance: wallet?.balance || 0,
          totalSpent,
          completedOrders: orders.filter((o: any) => o.status === "completed").length,
          recentOrders: orders.slice(0, 6),
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
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders", filter: `customer_id=eq.${user.id}` },
        fetchData
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "contracts", filter: `customer_user_id=eq.${user.id}` },
        fetchData
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "invoices", filter: `customer_id=eq.${user.id}` },
        fetchData
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "notifications", filter: `user_id=eq.${user.id}` },
        fetchData
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // Animation variants
  const pageVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: reducedMotion ? 0 : 0.08,
      },
    },
  };

  const sectionVariants = {
    hidden: reducedMotion ? {} : { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-6 px-1">
        <Skeleton className="h-48 w-full rounded-2xl" />
        <div className="flex gap-2 flex-wrap">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-11 w-28 rounded-full" />
          ))}
        </div>
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <Skeleton className="h-72 lg:col-span-2 rounded-2xl" />
          <Skeleton className="h-72 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="show"
      className="space-y-4 pb-6"
    >
      {/* 1. Header Section */}
      <motion.div variants={sectionVariants}>
        <OverviewHeader
          greeting={getGreeting()}
          userName={profile?.full_name || profile?.email?.split("@")[0] || ""}
          customerId={profile?.customer_uid}
          isVerified={profile?.is_kyc_verified}
          isRTL={isRTL}
        />
      </motion.div>

      {/* 2. Quick Action Pills */}
      <motion.div variants={sectionVariants}>
        <QuickActionPills isRTL={isRTL} />
      </motion.div>

      {/* 3. KPI Cards */}
      <motion.div variants={sectionVariants}>
        <KPICards
          data={data}
          isLoading={false}
          isRTL={isRTL}
          formatCurrency={formatCurrency}
        />
      </motion.div>

      {/* 4. Action Required Strip (conditional) */}
      {data && data.actionItems.length > 0 && (
        <motion.div variants={sectionVariants}>
          <ActionRequiredStrip items={data.actionItems} isRTL={isRTL} />
        </motion.div>
      )}

      {/* 5. Main Content Grid: Service Journey + Activity Feed */}
      <div className="grid gap-4 lg:grid-cols-5">
        {/* Service Journey - compact sidebar */}
        <motion.div variants={sectionVariants} className="lg:col-span-2">
          <ServiceJourneyCard
            orders={data?.recentOrders || []}
            isLoading={false}
            isRTL={isRTL}
          />
        </motion.div>

        {/* Activity Feed - main area */}
        <motion.div variants={sectionVariants} className="lg:col-span-3">
          <ActivityFeed
            orders={data?.recentOrders || []}
            isLoading={false}
            isRTL={isRTL}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
