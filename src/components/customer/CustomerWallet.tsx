/**
 * Customer Wallet Page
 * Full wallet view with balance and transaction history
 */

import { CustomerWalletCard } from "./wallet/CustomerWalletCard";
import { useLanguage } from "@/hooks/useLanguage";
import { motion } from "framer-motion";

export function CustomerWallet() {
  const { language } = useLanguage();
  const isRTL = language === "ar";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Page Header */}
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

      {/* Wallet Card - Full Width */}
      <CustomerWalletCard />
    </motion.div>
  );
}
