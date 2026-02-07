/**
 * OrderCard - Premium Dark Theme Order Card
 * Modern card with status, actions, and animations
 */

import { motion } from 'framer-motion';
import { 
  Hash, 
  User, 
  Calendar, 
  Clock, 
  Eye, 
  MoreVertical,
  Phone,
  Mail,
  FileText,
  Edit,
  Trash2,
  Copy,
  CheckCircle,
  XCircle,
  Package,
  Truck,
  CreditCard,
  DollarSign,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface Order {
  id: string;
  order_number: string;
  title: string;
  title_ar: string | null;
  status: string | null;
  priority: number | null;
  total_amount: number | null;
  currency: string | null;
  customer_id: string | null;
  due_date: string | null;
  created_at: string | null;
  description: string | null;
  customer?: {
    full_name: string | null;
    phone: string | null;
    email: string | null;
  } | null;
}

interface OrderCardProps {
  order: Order;
  index: number;
  isRTL: boolean;
  onStatusChange: (orderId: string, newStatus: string) => void;
  onViewDetails: (orderId: string) => void;
  onDownloadPDF: (order: Order) => void;
  onCopyOrderNumber: (orderNumber: string) => void;
}

const statusConfig: Record<string, { 
  labelAr: string; 
  labelEn: string; 
  color: string; 
  bgColor: string;
  borderColor: string;
  icon: React.ElementType;
  gradient: string;
}> = {
  pending: { 
    labelAr: "قيد الانتظار", 
    labelEn: "Pending", 
    color: "text-amber-400", 
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/30",
    icon: Clock,
    gradient: "from-amber-500 to-orange-500"
  },
  processing: { 
    labelAr: "قيد المعالجة", 
    labelEn: "Processing", 
    color: "text-blue-400", 
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
    icon: Package,
    gradient: "from-blue-500 to-indigo-500"
  },
  in_progress: { 
    labelAr: "قيد التنفيذ", 
    labelEn: "In Progress", 
    color: "text-indigo-400", 
    bgColor: "bg-indigo-500/10",
    borderColor: "border-indigo-500/30",
    icon: Truck,
    gradient: "from-indigo-500 to-purple-500"
  },
  completed: { 
    labelAr: "مكتمل", 
    labelEn: "Completed", 
    color: "text-emerald-400", 
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/30",
    icon: CheckCircle,
    gradient: "from-emerald-500 to-teal-500"
  },
  cancelled: { 
    labelAr: "ملغي", 
    labelEn: "Cancelled", 
    color: "text-red-400", 
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/30",
    icon: XCircle,
    gradient: "from-red-500 to-rose-500"
  },
  refunded: { 
    labelAr: "مسترد", 
    labelEn: "Refunded", 
    color: "text-purple-400", 
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/30",
    icon: CreditCard,
    gradient: "from-purple-500 to-pink-500"
  },
};

const priorityConfig: Record<number, { labelAr: string; labelEn: string; color: string }> = {
  1: { labelAr: 'منخفضة', labelEn: 'Low', color: 'text-slate-400' },
  2: { labelAr: 'متوسطة', labelEn: 'Medium', color: 'text-amber-400' },
  3: { labelAr: 'عالية', labelEn: 'High', color: 'text-red-400' },
};

export function OrderCard({
  order,
  index,
  isRTL,
  onStatusChange,
  onViewDetails,
  onDownloadPDF,
  onCopyOrderNumber,
}: OrderCardProps) {
  const config = statusConfig[order.status || 'pending'];
  const StatusIcon = config.icon;
  const priority = priorityConfig[order.priority || 1];
  const ArrowIcon = isRTL ? ChevronLeft : ChevronRight;

  const formatCurrency = (amount: number | null) => {
    if (!amount) return '-';
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: order.currency || 'SAR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Intl.DateTimeFormat(isRTL ? 'ar-SA' : 'en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(dateString));
  };

  const formatTime = (dateString: string | null) => {
    if (!dateString) return '';
    return new Intl.DateTimeFormat(isRTL ? 'ar-SA' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateString));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ scale: 1.01, y: -2 }}
      className="group"
    >
      <div 
        className={cn(
          "relative overflow-hidden rounded-xl cursor-pointer",
          "bg-[#0f1629] border border-slate-800",
          "hover:border-slate-700 transition-all duration-300",
          "hover:shadow-xl hover:shadow-slate-900/50"
        )}
        onClick={() => onViewDetails(order.id)}
      >
        {/* Status gradient line */}
        <div className={cn(
          "absolute top-0 inset-x-0 h-1 bg-gradient-to-r",
          config.gradient
        )} />

        {/* Card content */}
        <div className="p-5 space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className={cn(
                "p-2.5 rounded-xl shrink-0",
                config.bgColor
              )}>
                <StatusIcon className={cn("h-5 w-5", config.color)} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-blue-400">
                    #{order.order_number}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 text-slate-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      onCopyOrderNumber(order.order_number);
                    }}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
                <h3 className="font-semibold text-white truncate mt-0.5">
                  {isRTL ? order.title_ar || order.title : order.title}
                </h3>
              </div>
            </div>

            {/* Actions */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-800"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="bg-[#0f1629] border-slate-700 w-48"
              >
                <DropdownMenuItem 
                  className="text-slate-200 focus:bg-slate-800 gap-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewDetails(order.id);
                  }}
                >
                  <Eye className="h-4 w-4" />
                  {isRTL ? 'عرض التفاصيل' : 'View Details'}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-slate-200 focus:bg-slate-800 gap-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDownloadPDF(order);
                  }}
                >
                  <FileText className="h-4 w-4" />
                  {isRTL ? 'تحميل الفاتورة' : 'Download Invoice'}
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-slate-700" />
                <DropdownMenuItem 
                  className="text-slate-200 focus:bg-slate-800 gap-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    onStatusChange(order.id, 'processing');
                  }}
                >
                  <Package className="h-4 w-4" />
                  {isRTL ? 'بدء المعالجة' : 'Start Processing'}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-emerald-400 focus:bg-slate-800 gap-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    onStatusChange(order.id, 'completed');
                  }}
                >
                  <CheckCircle className="h-4 w-4" />
                  {isRTL ? 'تحديد كمكتمل' : 'Mark Completed'}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-red-400 focus:bg-slate-800 gap-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    onStatusChange(order.id, 'cancelled');
                  }}
                >
                  <XCircle className="h-4 w-4" />
                  {isRTL ? 'إلغاء الطلب' : 'Cancel Order'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Description */}
          {order.description && (
            <p className="text-sm text-slate-400 line-clamp-2">
              {order.description}
            </p>
          )}

          {/* Customer Info */}
          {order.customer && (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-900/50 border border-slate-800">
              <div className="p-2 rounded-full bg-slate-800">
                <User className="h-4 w-4 text-slate-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-white truncate">
                  {order.customer.full_name || (isRTL ? 'عميل' : 'Customer')}
                </p>
                {order.customer.phone && (
                  <p className="text-xs text-slate-400 font-mono">
                    {order.customer.phone}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-800">
            <div className="flex items-center gap-4">
              {/* Amount */}
              <div className="flex items-center gap-1.5">
                <DollarSign className="h-4 w-4 text-emerald-400" />
                <span className="text-sm font-bold text-emerald-400">
                  {formatCurrency(order.total_amount)}
                </span>
              </div>

              {/* Priority */}
              <Badge 
                variant="outline" 
                className={cn(
                  "text-[10px] border-slate-700",
                  priority?.color
                )}
              >
                {isRTL ? priority?.labelAr : priority?.labelEn}
              </Badge>
            </div>

            {/* Date */}
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Calendar className="h-3.5 w-3.5" />
              <span>{formatDate(order.created_at)}</span>
            </div>
          </div>

          {/* Status Badge */}
          <div className={cn(
            "flex items-center justify-between p-3 rounded-lg",
            config.bgColor,
            "border",
            config.borderColor
          )}>
            <div className="flex items-center gap-2">
              <StatusIcon className={cn("h-4 w-4", config.color)} />
              <span className={cn("text-sm font-medium", config.color)}>
                {isRTL ? config.labelAr : config.labelEn}
              </span>
            </div>
            <ArrowIcon className={cn("h-4 w-4", config.color)} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
