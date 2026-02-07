/**
 * Service Journey Card - Visual Order Progress
 * TRUE RTL: Progress fills RIGHT → LEFT, steps ordered RTL
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import {
  ShoppingCart,
  FileSignature,
  UserCheck,
  Receipt,
  CreditCard,
  CheckCircle2,
  Truck,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Package,
  Clock,
} from "lucide-react";

interface Order {
  id: string;
  order_number: string;
  title: string;
  title_ar?: string;
  status: string;
  total_amount?: number;
  requires_contract?: boolean;
  contract_pre_approved?: boolean;
  created_at: string;
}

interface ServiceJourneyCardProps {
  orders: Order[];
  isLoading: boolean;
  isRTL: boolean;
}

const journeyStages = [
  { id: "request", titleAr: "الطلب", titleEn: "Request", icon: ShoppingCart },
  { id: "contract", titleAr: "العقد", titleEn: "Contract", icon: FileSignature, conditional: true },
  { id: "approval", titleAr: "الموافقة", titleEn: "Approval", icon: UserCheck },
  { id: "invoice", titleAr: "الفاتورة", titleEn: "Invoice", icon: Receipt },
  { id: "payment", titleAr: "الدفع", titleEn: "Payment", icon: CreditCard },
  { id: "progress", titleAr: "التنفيذ", titleEn: "Progress", icon: Truck },
  { id: "delivery", titleAr: "التسليم", titleEn: "Delivery", icon: CheckCircle2 },
];

function calculateProgress(order: Order): number {
  switch (order.status) {
    case "pending": return order.contract_pre_approved ? 30 : 15;
    case "processing": return 50;
    case "in_progress": return 75;
    case "completed": return 100;
    case "cancelled": return 0;
    default: return 10;
  }
}

function getCurrentStage(order: Order): number {
  switch (order.status) {
    case "pending": return order.requires_contract && !order.contract_pre_approved ? 1 : 2;
    case "processing": return 4;
    case "in_progress": return 5;
    case "completed": return 6;
    default: return 0;
  }
}

export function ServiceJourneyCard({ orders, isLoading, isRTL }: ServiceJourneyCardProps) {
  const navigate = useNavigate();
  const reducedMotion = useReducedMotion();
  const [expandedId, setExpandedId] = useState<string | null>(orders[0]?.id || null);
  const ArrowIcon = isRTL ? ChevronLeft : ChevronRight;

  if (isLoading) {
    return (
      <Card className="rounded-2xl">
        <CardHeader className="pb-4">
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32 w-full rounded-xl" />
        </CardContent>
      </Card>
    );
  }

  if (orders.length === 0) return null;

  // Only show active orders (not completed/cancelled)
  const activeOrders = orders.filter((o) => !["completed", "cancelled"].includes(o.status));
  if (activeOrders.length === 0) return null;

  return (
    <Card className="rounded-2xl">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Package className="h-5 w-5 text-primary" />
            {isRTL ? "رحلة الخدمة" : "Service Journey"}
          </CardTitle>
          <Badge variant="secondary" className="gap-1 text-xs">
            <Clock className="h-3 w-3" />
            {isRTL ? "التتبع المباشر" : "Live Tracking"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-4">
        {activeOrders.slice(0, 3).map((order) => {
          const isExpanded = expandedId === order.id;
          const progress = calculateProgress(order);
          const currentStage = getCurrentStage(order);

          // Filter visible stages
          let visibleStages = journeyStages.filter((stage) => {
            if (stage.conditional && stage.id === "contract") {
              return order.requires_contract;
            }
            return true;
          });

          // CRITICAL: Reverse stages array in RTL for proper visual flow
          const displayStages = isRTL ? [...visibleStages].reverse() : visibleStages;
          // Adjust current stage index for RTL
          const displayCurrentStage = isRTL 
            ? visibleStages.length - 1 - currentStage 
            : currentStage;

          return (
            <div key={order.id} className="border rounded-xl overflow-hidden">
              {/* Order Header */}
              <div
                className="flex items-center gap-4 p-4 cursor-pointer hover:bg-muted/50 transition-colors min-h-[72px]"
                onClick={() => setExpandedId(isExpanded ? null : order.id)}
              >
                <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                  <Package className="h-4 w-4 text-primary" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-medium text-sm truncate">
                      {isRTL ? order.title_ar || order.title : order.title}
                    </h4>
                    {/* Order number ALWAYS LTR */}
                    <span dir="ltr" className="text-xs text-muted-foreground font-mono tabular-nums">
                      {order.order_number}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-2">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-muted-foreground">
                        {isRTL ? "التقدم" : "Progress"}
                      </span>
                      <span dir="ltr" className="text-xs font-medium tabular-nums">
                        {progress}%
                      </span>
                    </div>
                    {/* Progress bar with RTL transform */}
                    <div className="relative h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <div 
                        className="absolute h-full bg-primary rounded-full transition-all duration-300"
                        style={{
                          width: `${progress}%`,
                          // In RTL, progress fills from right
                          ...(isRTL ? { right: 0 } : { left: 0 })
                        }}
                      />
                    </div>
                  </div>
                </div>

                <Button variant="ghost" size="sm" className="shrink-0 h-10 w-10 p-0 min-h-[44px]">
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </div>

              {/* Expanded Timeline */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={reducedMotion ? {} : { height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={reducedMotion ? {} : { height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-4 pb-4 pt-2 border-t bg-muted/30">
                      {/* Timeline Stepper - TRUE RTL */}
                      <div className="relative py-4 overflow-x-auto">
                        {/* Background Line */}
                        <div className="absolute h-0.5 bg-muted top-[calc(50%-12px)] inset-x-4" />
                        
                        {/* Progress Line - respects RTL via CSS */}
                        <div
                          className="absolute h-0.5 bg-primary top-[calc(50%-12px)] transition-all duration-300"
                          style={{
                            width: `${Math.min((currentStage / (visibleStages.length - 1)) * 100, 100)}%`,
                            maxWidth: "calc(100% - 32px)",
                            // RTL: anchor to right, LTR: anchor to left
                            ...(isRTL 
                              ? { right: '16px', left: 'auto' }
                              : { left: '16px', right: 'auto' }
                            )
                          }}
                        />

                        {/* Stages - use displayStages (reversed in RTL) */}
                        <div className="flex justify-between relative z-10 min-w-[280px]">
                          {displayStages.map((stage, displayIndex) => {
                            const StageIcon = stage.icon;
                            // Calculate actual stage index
                            const actualIndex = isRTL 
                              ? visibleStages.length - 1 - displayIndex 
                              : displayIndex;
                            const isActive = actualIndex <= currentStage;
                            const isCurrent = actualIndex === currentStage;

                            return (
                              <div key={stage.id} className="flex flex-col items-center shrink-0">
                                <div
                                  className={cn(
                                    "w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all",
                                    isActive
                                      ? "bg-primary text-primary-foreground"
                                      : "bg-muted text-muted-foreground",
                                    isCurrent && "ring-4 ring-primary/30 scale-110"
                                  )}
                                >
                                  <StageIcon className="h-3.5 w-3.5 md:h-4 md:w-4" />
                                </div>
                                <span
                                  className={cn(
                                    "text-[10px] md:text-xs mt-2 text-center max-w-[50px] md:max-w-[60px]",
                                    isActive ? "text-foreground font-medium" : "text-muted-foreground"
                                  )}
                                >
                                  {isRTL ? stage.titleAr : stage.titleEn}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* View Details */}
                      <div className="flex justify-end mt-2 pt-3 border-t">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate("/portal/orders");
                          }}
                          className="gap-1.5 h-10 min-h-[44px]"
                        >
                          {isRTL ? "عرض التفاصيل" : "View Details"}
                          <ArrowIcon className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
