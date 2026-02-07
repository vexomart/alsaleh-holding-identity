/**
 * Service Journey Timeline - Visual Order Progress
 * End-to-end service journey visualization
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  ShoppingCart,
  FileSignature,
  UserCheck,
  Receipt,
  CreditCard,
  CheckCircle2,
  Package,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  ArrowRight,
  Clock,
  Truck,
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

interface ServiceJourneyTimelineProps {
  orders: Order[];
  isRTL: boolean;
}

// Journey stages
const journeyStages = [
  {
    id: 'request',
    titleAr: 'تقديم الطلب',
    titleEn: 'Request',
    icon: ShoppingCart,
    statusMatch: ['pending'],
  },
  {
    id: 'contract',
    titleAr: 'مراجعة العقد',
    titleEn: 'Contract',
    icon: FileSignature,
    statusMatch: [],
    conditional: true,
  },
  {
    id: 'approval',
    titleAr: 'موافقة الإدارة',
    titleEn: 'Approval',
    icon: UserCheck,
    statusMatch: ['pending'],
  },
  {
    id: 'invoice',
    titleAr: 'إصدار الفاتورة',
    titleEn: 'Invoice',
    icon: Receipt,
    statusMatch: ['processing'],
  },
  {
    id: 'payment',
    titleAr: 'الدفع',
    titleEn: 'Payment',
    icon: CreditCard,
    statusMatch: ['processing'],
  },
  {
    id: 'progress',
    titleAr: 'قيد التنفيذ',
    titleEn: 'In Progress',
    icon: Truck,
    statusMatch: ['in_progress'],
  },
  {
    id: 'delivery',
    titleAr: 'التسليم',
    titleEn: 'Delivery',
    icon: CheckCircle2,
    statusMatch: ['completed'],
  },
];

// Calculate journey progress
function calculateJourneyProgress(order: Order): number {
  const status = order.status;
  
  switch (status) {
    case 'pending':
      return order.contract_pre_approved ? 30 : 15;
    case 'processing':
      return 50;
    case 'in_progress':
      return 75;
    case 'completed':
      return 100;
    case 'cancelled':
      return 0;
    default:
      return 10;
  }
}

// Get current stage index
function getCurrentStage(order: Order): number {
  const status = order.status;
  
  switch (status) {
    case 'pending':
      return order.requires_contract && !order.contract_pre_approved ? 1 : 2;
    case 'processing':
      return 4;
    case 'in_progress':
      return 5;
    case 'completed':
      return 6;
    default:
      return 0;
  }
}

export function ServiceJourneyTimeline({ orders, isRTL }: ServiceJourneyTimelineProps) {
  const navigate = useNavigate();
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(
    orders.length > 0 ? orders[0].id : null
  );
  
  const rtlRow = isRTL ? "flex-row-reverse" : "flex-row";
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  const toggleOrder = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  if (orders.length === 0) return null;

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className={cn("flex items-center justify-between", rtlRow)}>
          <CardTitle className={cn("flex items-center gap-2 text-lg", rtlRow)}>
            <Package className="h-5 w-5 text-primary" />
            {isRTL ? "رحلة الخدمة" : "Service Journey"}
          </CardTitle>
          <Badge variant="secondary" className="gap-1">
            <Clock className="h-3 w-3" />
            {isRTL ? "التتبع المباشر" : "Live Tracking"}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-4">
          {orders.map((order) => {
            const isExpanded = expandedOrderId === order.id;
            const progress = calculateJourneyProgress(order);
            const currentStage = getCurrentStage(order);
            
            // Filter stages based on order type
            const visibleStages = journeyStages.filter(stage => {
              if (stage.conditional && stage.id === 'contract') {
                return order.requires_contract;
              }
              return true;
            });

            return (
              <div
                key={order.id}
                className="border rounded-xl overflow-hidden"
              >
                {/* Order Header */}
                <div
                  className={cn(
                    "flex items-center gap-4 p-4 cursor-pointer hover:bg-muted/50 transition-colors",
                    rtlRow
                  )}
                  onClick={() => toggleOrder(order.id)}
                >
                  <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                    <Package className="h-4 w-4 text-primary" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className={cn("flex items-center gap-2 flex-wrap", rtlRow)}>
                      <h4 className="font-medium truncate">
                        {isRTL ? order.title_ar || order.title : order.title}
                      </h4>
                      <span className="text-xs text-muted-foreground font-mono" dir="ltr">
                        {order.order_number}
                      </span>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mt-2">
                      <div className={cn("flex items-center gap-2 mb-1", rtlRow)}>
                        <span className="text-xs text-muted-foreground">
                          {isRTL ? "التقدم" : "Progress"}
                        </span>
                        <span className="text-xs font-medium" dir="ltr">
                          {progress}%
                        </span>
                      </div>
                      <Progress value={progress} className="h-1.5" />
                    </div>
                  </div>

                  <Button variant="ghost" size="sm" className="shrink-0">
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
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-4 pb-4 pt-2 border-t bg-muted/30">
                        {/* Timeline */}
                        <div className="relative">
                          {/* Connecting Line */}
                          <div 
                            className={cn(
                              "absolute h-0.5 bg-muted top-5",
                              isRTL ? "right-5 left-5" : "left-5 right-5"
                            )} 
                          />
                          <div 
                            className={cn(
                              "absolute h-0.5 bg-primary top-5 transition-all",
                              isRTL ? "right-5" : "left-5"
                            )}
                            style={{
                              width: `${(currentStage / (visibleStages.length - 1)) * 100}%`,
                              maxWidth: 'calc(100% - 40px)',
                            }}
                          />
                          
                          {/* Stages */}
                          <div className={cn("flex justify-between relative z-10", rtlRow)}>
                            {visibleStages.map((stage, index) => {
                              const StageIcon = stage.icon;
                              const isActive = index <= currentStage;
                              const isCurrent = index === currentStage;
                              
                              return (
                                <div
                                  key={stage.id}
                                  className="flex flex-col items-center"
                                >
                                  <div
                                    className={cn(
                                      "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                                      isActive 
                                        ? "bg-primary text-primary-foreground" 
                                        : "bg-muted text-muted-foreground",
                                      isCurrent && "ring-4 ring-primary/30 scale-110"
                                    )}
                                  >
                                    <StageIcon className="h-4 w-4" />
                                  </div>
                                  <span className={cn(
                                    "text-xs mt-2 text-center max-w-[60px]",
                                    isActive ? "text-foreground font-medium" : "text-muted-foreground"
                                  )}>
                                    {isRTL ? stage.titleAr : stage.titleEn}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* View Details Button */}
                        <div className={cn("flex mt-4 pt-3 border-t", rtlRow, "justify-end")}>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate("/portal/orders");
                            }}
                            className={cn("gap-1.5", rtlRow)}
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
        </div>
      </CardContent>
    </Card>
  );
}
