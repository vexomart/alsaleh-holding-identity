/**
 * Customer Wallet Page - Premium Bank-Grade Design
 * Full wallet view with balance, transaction history, and bank transfers
 * Full RTL support with modern glassmorphism design
 */

import { useState } from "react";
import { CustomerWalletCard } from "./wallet/CustomerWalletCard";
import { BankTransferDialog } from "./wallet/BankTransferDialog";
import { BankTransferList } from "./wallet/BankTransferList";
import { useLanguage } from "@/hooks/useLanguage";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Building2, 
  Wallet, 
  History, 
  ArrowUpRight,
  Shield,
  Sparkles,
} from "lucide-react";

export function CustomerWallet() {
  const { language } = useLanguage();
  const isRTL = language === "ar";
  const [showBankTransfer, setShowBankTransfer] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 w-full min-h-screen"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Hero Header with Gradient Background */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-primary/70 p-6 md:p-8">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -right-1/4 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute -bottom-1/2 -left-1/4 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        </div>
        
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Wallet className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  {isRTL ? "المحفظة الرقمية" : "Digital Wallet"}
                </h1>
              </div>
              <p className="text-white/80 text-sm md:text-base max-w-md">
                {isRTL 
                  ? "إدارة رصيدك بأمان وسهولة مع حماية بنكية متقدمة"
                  : "Manage your balance securely with advanced banking protection"
                }
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                onClick={() => setShowBankTransfer(true)} 
                variant="secondary"
                className="gap-2 bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm"
              >
                <Building2 className="h-4 w-4" />
                {isRTL ? "تحويل بنكي" : "Bank Transfer"}
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center gap-4 mt-6 pt-4 border-t border-white/10">
            <div className="flex items-center gap-2 text-white/70 text-xs">
              <Shield className="h-4 w-4" />
              <span>{isRTL ? "حماية بنكية" : "Bank-grade Security"}</span>
            </div>
            <div className="flex items-center gap-2 text-white/70 text-xs">
              <Sparkles className="h-4 w-4" />
              <span>{isRTL ? "تحديثات فورية" : "Real-time Updates"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs - Modern Design */}
      <Tabs defaultValue="wallet" className="space-y-6 w-full" dir={isRTL ? "rtl" : "ltr"}>
        <TabsList className="w-full md:w-auto bg-muted/50 p-1 rounded-xl border border-border/50">
          <TabsTrigger 
            value="wallet" 
            className="gap-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm px-6"
          >
            <Wallet className="h-4 w-4" />
            {isRTL ? "المحفظة" : "Wallet"}
          </TabsTrigger>
          <TabsTrigger 
            value="bank-transfers" 
            className="gap-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm px-6"
          >
            <Building2 className="h-4 w-4" />
            {isRTL ? "التحويلات البنكية" : "Bank Transfers"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="wallet" className="mt-4 space-y-4">
          <CustomerWalletCard />
        </TabsContent>

        <TabsContent value="bank-transfers" className="mt-4">
          <BankTransferList />
        </TabsContent>
      </Tabs>

      {/* Bank Transfer Dialog */}
      <BankTransferDialog open={showBankTransfer} onOpenChange={setShowBankTransfer} />
    </motion.div>
  );
}
