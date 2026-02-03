/**
 * Advanced Wallet Actions - Quick action cards for wallet features
 * إجراءات المحفظة المتقدمة - بطاقات إجراءات سريعة
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/hooks/useLanguage";
import { Card } from "@/components/ui/card";
import {
  ArrowUpRight,
  Building2,
  FileText,
  Receipt,
  CreditCard,
  Send,
  History,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { WalletTopupDialog } from "./WalletTopupDialog";
import { WithdrawalRequestDialog } from "./WithdrawalRequestDialog";
import { WalletStatementDialog } from "./WalletStatementDialog";

interface WalletQuickActionsProps {
  walletNumber: string;
  customerUid: string;
  currentBalance: number;
  onBankTransferClick: () => void;
}

interface ActionCard {
  id: string;
  icon: React.ElementType;
  label_ar: string;
  label_en: string;
  description_ar: string;
  description_en: string;
  color: string;
  bgColor: string;
  onClick?: () => void;
  component?: React.ReactNode;
}

export function WalletQuickActions({
  walletNumber,
  customerUid,
  currentBalance,
  onBankTransferClick,
}: WalletQuickActionsProps) {
  const { language } = useLanguage();
  const isRTL = language === "ar";
  
  const [showWithdrawal, setShowWithdrawal] = useState(false);
  const [showStatement, setShowStatement] = useState(false);

  const actions: ActionCard[] = [
    {
      id: 'topup',
      icon: CreditCard,
      label_ar: 'شحن الرصيد',
      label_en: 'Top Up',
      description_ar: 'شحن سريع بالبطاقة',
      description_en: 'Quick card payment',
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10 hover:bg-emerald-500/20',
      component: (
        <WalletTopupDialog>
          <ActionCardContent
            icon={CreditCard}
            label={isRTL ? 'شحن الرصيد' : 'Top Up'}
            description={isRTL ? 'شحن سريع بالبطاقة' : 'Quick card payment'}
            color="text-emerald-500"
            bgColor="bg-emerald-500/10 hover:bg-emerald-500/20"
            isRTL={isRTL}
          />
        </WalletTopupDialog>
      ),
    },
    {
      id: 'bank_transfer',
      icon: Building2,
      label_ar: 'تحويل بنكي',
      label_en: 'Bank Transfer',
      description_ar: 'إيداع عبر التحويل',
      description_en: 'Deposit via transfer',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10 hover:bg-blue-500/20',
      onClick: onBankTransferClick,
    },
    {
      id: 'withdrawal',
      icon: ArrowUpRight,
      label_ar: 'طلب سحب',
      label_en: 'Withdraw',
      description_ar: 'سحب للحساب البنكي',
      description_en: 'Withdraw to bank',
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10 hover:bg-amber-500/20',
      onClick: () => setShowWithdrawal(true),
    },
    {
      id: 'statement',
      icon: FileText,
      label_ar: 'كشف حساب',
      label_en: 'Statement',
      description_ar: 'تحميل كشف الحساب',
      description_en: 'Download statement',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10 hover:bg-purple-500/20',
      onClick: () => setShowStatement(true),
    },
  ];

  return (
    <>
      <Card className="p-4 border border-border/50 bg-card/50 backdrop-blur-sm">
        <h3 className="font-semibold text-sm text-muted-foreground mb-4">
          {isRTL ? "إجراءات سريعة" : "Quick Actions"}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {actions.map((action, index) => (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
            >
              {action.component ? (
                action.component
              ) : (
                <ActionCardContent
                  icon={action.icon}
                  label={isRTL ? action.label_ar : action.label_en}
                  description={isRTL ? action.description_ar : action.description_en}
                  color={action.color}
                  bgColor={action.bgColor}
                  isRTL={isRTL}
                  onClick={action.onClick}
                />
              )}
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Dialogs */}
      <WithdrawalRequestDialog
        open={showWithdrawal}
        onOpenChange={setShowWithdrawal}
        currentBalance={currentBalance}
      />
      <WalletStatementDialog
        open={showStatement}
        onOpenChange={setShowStatement}
        walletNumber={walletNumber}
        customerUid={customerUid}
        currentBalance={currentBalance}
      />
    </>
  );
}

function ActionCardContent({
  icon: Icon,
  label,
  description,
  color,
  bgColor,
  isRTL,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  description: string;
  color: string;
  bgColor: string;
  isRTL: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full p-4 rounded-xl transition-all duration-200 text-start group",
        bgColor
      )}
    >
      <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center mb-3", bgColor)}>
        <Icon className={cn("h-5 w-5", color)} />
      </div>
      <p className="font-semibold text-sm mb-0.5 group-hover:text-primary transition-colors">
        {label}
      </p>
      <p className="text-xs text-muted-foreground">
        {description}
      </p>
    </button>
  );
}
