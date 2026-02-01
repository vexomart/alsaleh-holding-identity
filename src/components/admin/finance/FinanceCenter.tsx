/**
 * Admin Finance Center - Enterprise Grade Financial Management
 * 
 * Tabs: Overview, Transactions, Invoices, Wallets, Bank Transfers, Ledger
 * Full RTL support with Arabic-first design
 */

import { useState, createContext, useContext } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/hooks/useLanguage";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Receipt,
  Wallet,
  BookOpen,
  Building2,
} from "lucide-react";
import { FinanceOverview } from "./FinanceOverview";
import { FinanceTransactions } from "./FinanceTransactions";
import { FinanceInvoices } from "./FinanceInvoices";
import { FinanceWallets } from "./FinanceWallets";
import { FinanceLedger } from "./FinanceLedger";
import { BankTransfersManagement } from "./BankTransfersManagement";

// RTL Context for finance module
interface FinanceRTLContextValue {
  isRTL: boolean;
  rtlRow: string;
  rtlJustify: string;
  rtlText: string;
  rtlFlex: string;
}

const FinanceRTLContext = createContext<FinanceRTLContextValue>({
  isRTL: false,
  rtlRow: "flex-row",
  rtlJustify: "justify-start",
  rtlText: "text-left",
  rtlFlex: "",
});

export const useFinanceRTL = () => useContext(FinanceRTLContext);

const tabs = [
  { id: "overview", icon: LayoutDashboard, labelAr: "نظرة عامة", labelEn: "Overview" },
  { id: "transactions", icon: ArrowLeftRight, labelAr: "المعاملات", labelEn: "Transactions" },
  { id: "invoices", icon: Receipt, labelAr: "الفواتير", labelEn: "Invoices" },
  { id: "wallets", icon: Wallet, labelAr: "المحافظ", labelEn: "Wallets" },
  { id: "bank-transfers", icon: Building2, labelAr: "التحويلات البنكية", labelEn: "Bank Transfers" },
  { id: "ledger", icon: BookOpen, labelAr: "دفتر الأستاذ", labelEn: "Ledger" },
];

export function FinanceCenter() {
  const { language } = useLanguage();
  const isRTL = language === "ar";
  const [activeTab, setActiveTab] = useState("overview");

  // RTL helper classes - single source of truth
  const rtlRow = isRTL ? "flex-row-reverse" : "flex-row";
  const rtlJustify = isRTL ? "justify-end" : "justify-start";
  const rtlText = isRTL ? "text-right" : "text-left";
  const rtlFlex = isRTL ? "flex-row-reverse" : "";

  // Visual tab order - reversed only for RTL display
  const visibleTabs = isRTL ? [...tabs].reverse() : tabs;

  return (
    <FinanceRTLContext.Provider value={{ isRTL, rtlRow, rtlJustify, rtlText, rtlFlex }}>
      {/* Root wrapper with direction */}
      <section 
        dir={isRTL ? "rtl" : "ltr"} 
        className={cn("w-full", rtlText)}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Page Header */}
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {isRTL ? "المركز المالي" : "Financial Center"}
            </h1>
            <p className="text-muted-foreground mt-1">
              {isRTL
                ? "إدارة شاملة للعمليات المالية والمحاسبية"
                : "Comprehensive financial and accounting management"}
            </p>
          </div>

          {/* Tabs - Using pill-style active state (RTL safe) */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList 
              className={cn(
                "flex items-center gap-2 p-1 rounded-lg bg-muted/50",
                "overflow-x-auto whitespace-nowrap scrollbar-hide",
                rtlJustify
              )}
            >
              {visibleTabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className={cn(
                      "px-4 py-2 rounded-md shrink-0 transition-all",
                      "data-[state=active]:bg-background",
                      "data-[state=active]:text-foreground",
                      "data-[state=active]:shadow-sm"
                    )}
                  >
                    <span className={cn(
                      "inline-flex items-center gap-2",
                      rtlFlex
                    )}>
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="whitespace-nowrap">
                        {isRTL ? tab.labelAr : tab.labelEn}
                      </span>
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
              
              <TabsContent value="bank-transfers" className="m-0">
                <BankTransfersManagement />
              </TabsContent>
              
              <TabsContent value="ledger" className="m-0">
                <FinanceLedger />
              </TabsContent>
            </div>
          </Tabs>
        </motion.div>
      </section>
    </FinanceRTLContext.Provider>
  );
}
