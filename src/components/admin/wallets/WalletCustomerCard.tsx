/**
 * Wallet Customer Card Component
 * Modern card displaying customer wallet info with actions
 */

import { memo, forwardRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Eye,
  Wallet,
  Mail,
  Phone,
  Copy,
  Check,
  CreditCard,
  Snowflake,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { CustomerWallet } from "@/types/financial";

interface CustomerWithWallet {
  id: string;
  customer_uid: string | null;
  email: string;
  full_name: string | null;
  phone: string | null;
  wallet?: CustomerWallet;
}

interface WalletCustomerCardProps {
  customer: CustomerWithWallet;
  language: string;
}

export const WalletCustomerCard = memo(forwardRef<HTMLDivElement, WalletCustomerCardProps>(
  function WalletCustomerCard(
    { customer, language },
    ref
  ) {
    const navigate = useNavigate();
    const isRTL = language === "ar";
    const [copiedUid, setCopiedUid] = useState(false);
    
    const displayName = customer.full_name || customer.email.split("@")[0];
    const hasWallet = !!customer.wallet;
    const walletStatus = customer.wallet?.status || "none";
    const balance = Number(customer.wallet?.balance || 0);

    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat(isRTL ? "ar-SA" : "en-US", {
        style: "currency",
        currency: "SAR",
        minimumFractionDigits: 2,
      }).format(amount);
    };

    const formatWalletNumber = (num: string) => {
      return num.replace(/(.{4})/g, "$1 ").trim();
    };

    const copyUid = async (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!customer.customer_uid) return;
      try {
        await navigator.clipboard.writeText(customer.customer_uid);
        setCopiedUid(true);
        setTimeout(() => setCopiedUid(false), 2000);
      } catch (error) {
        console.error("Failed to copy:", error);
      }
    };

    const handleCardClick = () => {
      navigate(`/admin/wallets/${customer.id}`);
    };

    return (
      <motion.div
        ref={ref}
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        whileHover={{ y: -4, scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={handleCardClick}
        className={cn(
          "group relative p-4 rounded-2xl border transition-all duration-200 cursor-pointer",
          "bg-card/50 backdrop-blur-sm hover:bg-card",
          "hover:shadow-xl hover:shadow-primary/10 hover:border-primary/30",
          !hasWallet && "border-dashed border-muted-foreground/30"
        )}
      >
        {/* Hover Indicator */}
        <div className="absolute top-3 end-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <Badge variant="secondary" className="text-xs gap-1 bg-primary/10 text-primary">
            {isRTL ? "عرض التفاصيل" : "View Details"}
            <ArrowRight className={cn("h-3 w-3", isRTL && "rotate-180")} />
          </Badge>
        </div>

        {/* Content */}
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="relative shrink-0">
            <Avatar className="h-14 w-14 ring-2 ring-background shadow-lg">
              <AvatarFallback className={cn(
                "font-semibold text-lg",
                hasWallet 
                  ? "bg-gradient-to-br from-emerald-500 to-teal-600 text-white"
                  : "bg-muted text-muted-foreground"
              )}>
                {displayName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            {/* Wallet Status Indicator */}
            {hasWallet && (
              <div className={cn(
                "absolute -bottom-0.5 -end-0.5 h-5 w-5 rounded-full border-2 border-background flex items-center justify-center",
                walletStatus === "active" ? "bg-emerald-500" : "bg-blue-500"
              )}>
                {walletStatus === "active" ? (
                  <CheckCircle2 className="h-3 w-3 text-white" />
                ) : (
                  <Snowflake className="h-3 w-3 text-white" />
                )}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            {/* Name & UID */}
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="min-w-0">
                <h3 className="font-semibold text-foreground truncate text-base group-hover:text-primary transition-colors">
                  {displayName}
                </h3>
                {customer.customer_uid && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={copyUid}
                        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mt-0.5 transition-colors"
                      >
                        <CreditCard className="h-3 w-3" />
                        <span className="font-mono">{customer.customer_uid}</span>
                        {copiedUid ? (
                          <Check className="h-3 w-3 text-emerald-500" />
                        ) : (
                          <Copy className="h-3 w-3 opacity-50" />
                        )}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {isRTL ? "نسخ رقم العميل" : "Copy customer ID"}
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>

              {/* Balance Badge */}
              {hasWallet ? (
                <Badge 
                  variant="secondary"
                  className={cn(
                    "shrink-0 text-sm font-bold px-3 py-1",
                    balance > 0 
                      ? "bg-emerald-500/20 text-emerald-700 border-emerald-500/30" 
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {formatCurrency(balance)}
                </Badge>
              ) : (
                <Badge variant="outline" className="shrink-0 text-xs text-muted-foreground">
                  {isRTL ? "بدون محفظة" : "No Wallet"}
                </Badge>
              )}
            </div>

            {/* Contact Info */}
            <div className="space-y-1 text-sm text-muted-foreground">
              <div className="flex items-center gap-2 truncate">
                <Mail className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{customer.email}</span>
              </div>
              {customer.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 shrink-0" />
                  <span dir="ltr">{customer.phone}</span>
                </div>
              )}
              {customer.wallet?.wallet_number && (
                <div className="flex items-center gap-2 font-mono text-xs">
                  <Wallet className="h-3.5 w-3.5 shrink-0" />
                  <span dir="ltr">{formatWalletNumber(customer.wallet.wallet_number)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }
));
