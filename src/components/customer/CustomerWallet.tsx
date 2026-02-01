/**
 * Customer Wallet Page
 * Full wallet view with balance, transaction history, and bank transfers
 */

import { useState } from "react";
import { CustomerWalletCard } from "./wallet/CustomerWalletCard";
import { BankTransferDialog } from "./wallet/BankTransferDialog";
import { BankTransferList } from "./wallet/BankTransferList";
import { useLanguage } from "@/hooks/useLanguage";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Wallet, Plus } from "lucide-react";

export function CustomerWallet() {
  const { language } = useLanguage();
  const isRTL = language === "ar";
  const [showBankTransfer, setShowBankTransfer] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Page Header */}
      <div className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
        <div className={isRTL ? "text-right" : "text-left"}>
          <h1 className="text-2xl font-bold text-foreground">
            {isRTL ? "المحفظة الرقمية" : "Digital Wallet"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isRTL 
              ? "إدارة رصيدك ومتابعة معاملاتك المالية"
              : "Manage your balance and track financial transactions"
            }
          </p>
        </div>
        <Button onClick={() => setShowBankTransfer(true)} variant="outline" className="gap-2">
          <Building2 className="h-4 w-4" />
          {isRTL ? "تحويل بنكي" : "Bank Transfer"}
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="wallet" className="space-y-4">
        <TabsList>
          <TabsTrigger value="wallet" className="gap-2">
            <Wallet className="h-4 w-4" />
            {isRTL ? "المحفظة" : "Wallet"}
          </TabsTrigger>
          <TabsTrigger value="bank-transfers" className="gap-2">
            <Building2 className="h-4 w-4" />
            {isRTL ? "التحويلات البنكية" : "Bank Transfers"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="wallet">
          <CustomerWalletCard />
        </TabsContent>

        <TabsContent value="bank-transfers">
          <BankTransferList />
        </TabsContent>
      </Tabs>

      {/* Bank Transfer Dialog */}
      <BankTransferDialog open={showBankTransfer} onOpenChange={setShowBankTransfer} />
    </motion.div>
  );
}
