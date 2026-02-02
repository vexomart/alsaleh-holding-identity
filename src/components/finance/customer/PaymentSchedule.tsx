/**
 * Payment Schedule - جدول الأقساط
 * Timeline view with status indicators
 */

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
  CreditCard,
  Banknote,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { FinancePayment, PAYMENT_STATUS_CONFIG, formatCurrencySAR } from "@/types/finance";

interface PaymentScheduleProps {
  payments: FinancePayment[];
  onPayment?: (paymentId: string) => void;
}

export function PaymentSchedule({ payments, onPayment }: PaymentScheduleProps) {
  const sortedPayments = [...payments].sort((a, b) => a.installment_no - b.installment_no);

  const stats = {
    total: payments.length,
    paid: payments.filter((p) => p.status === "paid").length,
    overdue: payments.filter((p) => p.status === "overdue").length,
    upcoming: payments.filter((p) => p.status === "scheduled").length,
    totalPaid: payments
      .filter((p) => p.status === "paid")
      .reduce((sum, p) => sum + p.amount_sar, 0),
    totalRemaining: payments
      .filter((p) => p.status !== "paid")
      .reduce((sum, p) => sum + p.amount_sar, 0),
  };

  const getStatusIcon = (status: FinancePayment["status"]) => {
    switch (status) {
      case "paid":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "overdue":
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case "scheduled":
        return <Clock className="h-5 w-5 text-blue-500" />;
      default:
        return <Clock className="h-5 w-5 text-muted-foreground" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-green-500/10 border-green-200">
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-700">{stats.paid}</p>
            <p className="text-sm text-green-600">أقساط مدفوعة</p>
          </CardContent>
        </Card>

        <Card className="bg-blue-500/10 border-blue-200">
          <CardContent className="p-4 text-center">
            <Clock className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-700">{stats.upcoming}</p>
            <p className="text-sm text-blue-600">أقساط قادمة</p>
          </CardContent>
        </Card>

        {stats.overdue > 0 && (
          <Card className="bg-red-500/10 border-red-200">
            <CardContent className="p-4 text-center">
              <AlertTriangle className="h-6 w-6 text-red-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-red-700">{stats.overdue}</p>
              <p className="text-sm text-red-600">أقساط متأخرة</p>
            </CardContent>
          </Card>
        )}

        <Card className="bg-muted/50">
          <CardContent className="p-4 text-center">
            <Banknote className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
            <p className="text-2xl font-bold">{formatCurrencySAR(stats.totalRemaining)}</p>
            <p className="text-sm text-muted-foreground">المبلغ المتبقي</p>
          </CardContent>
        </Card>
      </div>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            جدول الأقساط
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute right-6 top-0 bottom-0 w-0.5 bg-border" />

            <div className="space-y-4">
              {sortedPayments.map((payment, index) => {
                const statusConfig = PAYMENT_STATUS_CONFIG[payment.status];
                const isOverdue = payment.status === "overdue";
                const isPaid = payment.status === "paid";

                return (
                  <motion.div
                    key={payment.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={cn(
                      "relative pr-14 py-4 px-4 rounded-lg border transition-colors",
                      isOverdue && "bg-red-500/5 border-red-200",
                      isPaid && "bg-green-500/5 border-green-200",
                      !isOverdue && !isPaid && "bg-card hover:bg-muted/50"
                    )}
                  >
                    {/* Timeline dot */}
                    <div
                      className={cn(
                        "absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 bg-background",
                        isPaid && "border-green-500 bg-green-500",
                        isOverdue && "border-red-500 bg-red-500",
                        !isPaid && !isOverdue && "border-blue-500"
                      )}
                    />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {getStatusIcon(payment.status)}
                        <div>
                          <p className="font-semibold">القسط {payment.installment_no}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(payment.due_date).toLocaleDateString("ar-SA", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-left">
                          <p className="font-bold text-lg">
                            {formatCurrencySAR(payment.amount_sar)}
                          </p>
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-xs",
                              statusConfig.variant === "success" &&
                                "bg-green-500/10 text-green-600 border-green-200",
                              statusConfig.variant === "warning" &&
                                "bg-yellow-500/10 text-yellow-600 border-yellow-200",
                              statusConfig.variant === "destructive" &&
                                "bg-red-500/10 text-red-600 border-red-200",
                              statusConfig.variant === "secondary" &&
                                "bg-muted text-muted-foreground"
                            )}
                          >
                            {statusConfig.label}
                          </Badge>
                        </div>

                        {(isOverdue || payment.status === "scheduled") && onPayment && (
                          <Button
                            size="sm"
                            variant={isOverdue ? "destructive" : "default"}
                            onClick={() => onPayment(payment.id)}
                          >
                            <CreditCard className="h-4 w-4 ml-1" />
                            دفع
                          </Button>
                        )}
                      </div>
                    </div>

                    {isPaid && payment.paid_at && (
                      <p className="text-xs text-green-600 mt-2">
                        تم الدفع في{" "}
                        {new Date(payment.paid_at).toLocaleDateString("ar-SA")}
                        {payment.method && ` • ${payment.method}`}
                      </p>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
