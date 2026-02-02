/**
 * Admin Finance Management - لوحة إدارة التمويل
 * Comprehensive admin dashboard for finance operations
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/hooks/useLanguage";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  CreditCard,
  Users,
  Shield,
  ClipboardList,
} from "lucide-react";
import { ApplicationsTab } from "./tabs/ApplicationsTab";
import { ContractsTab } from "./tabs/ContractsTab";
import { PaymentsTab } from "./tabs/PaymentsTab";
import { EntitiesTab } from "./tabs/EntitiesTab";
import { RiskTab } from "./tabs/RiskTab";
import { FinanceOverviewTab } from "./tabs/FinanceOverviewTab";

const tabs = [
  { id: "overview", icon: LayoutDashboard, labelAr: "نظرة عامة", labelEn: "Overview" },
  { id: "applications", icon: ClipboardList, labelAr: "الطلبات", labelEn: "Applications" },
  { id: "contracts", icon: FileText, labelAr: "العقود", labelEn: "Contracts" },
  { id: "payments", icon: CreditCard, labelAr: "الأقساط", labelEn: "Payments" },
  { id: "entities", icon: Users, labelAr: "الكيانات", labelEn: "Entities" },
  { id: "risk", icon: Shield, labelAr: "المخاطر", labelEn: "Risk" },
];

export function FinanceManagement() {
  const { language } = useLanguage();
  const isRTL = language === "ar";
  const [activeTab, setActiveTab] = useState("overview");

  const visibleTabs = isRTL ? [...tabs].reverse() : tabs;

  return (
    <section dir={isRTL ? "rtl" : "ltr"} className={cn("w-full", isRTL && "text-right")}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {isRTL ? "إدارة التمويل الداخلي" : "Internal Finance Management"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isRTL
              ? "إدارة طلبات التمويل والعقود والأقساط والكيانات"
              : "Manage finance applications, contracts, payments, and entities"}
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList
            className={cn(
              "flex items-center gap-2 p-1 rounded-lg bg-muted/50",
              "overflow-x-auto whitespace-nowrap scrollbar-hide",
              isRTL ? "justify-end" : "justify-start"
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
                  <span
                    className={cn(
                      "inline-flex items-center gap-2",
                      isRTL && "flex-row-reverse"
                    )}
                  >
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
              <FinanceOverviewTab />
            </TabsContent>

            <TabsContent value="applications" className="m-0">
              <ApplicationsTab />
            </TabsContent>

            <TabsContent value="contracts" className="m-0">
              <ContractsTab />
            </TabsContent>

            <TabsContent value="payments" className="m-0">
              <PaymentsTab />
            </TabsContent>

            <TabsContent value="entities" className="m-0">
              <EntitiesTab />
            </TabsContent>

            <TabsContent value="risk" className="m-0">
              <RiskTab />
            </TabsContent>
          </div>
        </Tabs>
      </motion.div>
    </section>
  );
}
