/**
 * Admin Finance Center - Enterprise Grade Financial Management
 * 
 * Tabs: Overview, Transactions, Invoices, Wallets, Ledger
 * Full RTL support with Arabic-first design
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/hooks/useLanguage";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Receipt,
  Wallet,
  BookOpen,
} from "lucide-react";
import { FinanceOverview } from "./FinanceOverview";
import { FinanceTransactions } from "./FinanceTransactions";
import { FinanceInvoices } from "./FinanceInvoices";
import { FinanceWallets } from "./FinanceWallets";
import { FinanceLedger } from "./FinanceLedger";

const tabs = [
  { id: "overview", icon: LayoutDashboard, labelAr: "نظرة عامة", labelEn: "Overview" },
  { id: "transactions", icon: ArrowLeftRight, labelAr: "المعاملات", labelEn: "Transactions" },
  { id: "invoices", icon: Receipt, labelAr: "الفواتير", labelEn: "Invoices" },
  { id: "wallets", icon: Wallet, labelAr: "المحافظ", labelEn: "Wallets" },
  { id: "ledger", icon: BookOpen, labelAr: "دفتر الأستاذ", labelEn: "Ledger" },
];

export function FinanceCenter() {
  const { language } = useLanguage();
  const isRTL = language === "ar";
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Page Header */}
      <div className={isRTL ? "text-right" : "text-left"}>
        <h1 className="text-2xl font-bold text-foreground">
          {isRTL ? "المركز المالي" : "Financial Center"}
        </h1>
        <p className="text-muted-foreground mt-1">
          {isRTL
            ? "إدارة شاملة للعمليات المالية والمحاسبية"
            : "Comprehensive financial and accounting management"}
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full flex justify-start bg-muted/50 p-1 rounded-lg overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="flex items-center gap-2 px-4 py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                <Icon className="h-4 w-4" />
                <span className="whitespace-nowrap">
                  {isRTL ? tab.labelAr : tab.labelEn}
                </span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        <div className="mt-6">
          <TabsContent value="overview" className="m-0">
            <FinanceOverview />
          </TabsContent>
          
          <TabsContent value="transactions" className="m-0">
            <FinanceTransactions />
          </TabsContent>
          
          <TabsContent value="invoices" className="m-0">
            <FinanceInvoices />
          </TabsContent>
          
          <TabsContent value="wallets" className="m-0">
            <FinanceWallets />
          </TabsContent>
          
          <TabsContent value="ledger" className="m-0">
            <FinanceLedger />
          </TabsContent>
        </div>
      </Tabs>
    </motion.div>
  );
}
