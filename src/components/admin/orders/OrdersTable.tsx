/**
 * OrdersTable - Dark Theme Table Component
 * Premium table with inline actions and animations
 */

import { motion, AnimatePresence } from 'framer-motion';
import { 
  Hash, 
  User, 
  Calendar, 
  Clock, 
  Eye, 
  MoreVertical,
  FileText,
  Copy,
  CheckCircle,
  XCircle,
  Package,
  Truck,
  CreditCard,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  Edit,
  Send
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useState } from 'react';

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

interface OrdersTableProps {
  orders: Order[];
  isRTL: boolean;
  onStatusChange: (orderId: string, newStatus: string) => void;
  onViewDetails: (orderId: string) => void;
  onDownloadPDF: (order: Order) => void;
  onCopyOrderNumber: (orderNumber: string) => void;
  onPriceUpdate: (orderId: string, newPrice: number) => void;
}

const statusConfig: Record<string, { 
  labelAr: string; 
  labelEn: string; 
  color: string; 
  bgColor: string;
  borderColor: string;
  icon: React.ElementType;
}> = {
  pending: { 
    labelAr: "قيد الانتظار", 
    labelEn: "Pending", 
    color: "text-amber-400", 
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/30",
    icon: Clock,
  },
  processing: { 
    labelAr: "قيد المعالجة", 
    labelEn: "Processing", 
    color: "text-blue-400", 
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
    icon: Package,
  },
  in_progress: { 
    labelAr: "قيد التنفيذ", 
    labelEn: "In Progress", 
    color: "text-indigo-400", 
    bgColor: "bg-indigo-500/10",
    borderColor: "border-indigo-500/30",
    icon: Truck,
  },
  completed: { 
    labelAr: "مكتمل", 
    labelEn: "Completed", 
    color: "text-emerald-400", 
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/30",
    icon: CheckCircle,
  },
  cancelled: { 
    labelAr: "ملغي", 
    labelEn: "Cancelled", 
    color: "text-red-400", 
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/30",
    icon: XCircle,
  },
  refunded: { 
    labelAr: "مسترد", 
    labelEn: "Refunded", 
    color: "text-purple-400", 
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/30",
    icon: CreditCard,
  },
};

export function OrdersTable({
  orders,
  isRTL,
  onStatusChange,
  onViewDetails,
  onDownloadPDF,
  onCopyOrderNumber,
  onPriceUpdate,
}: OrdersTableProps) {
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [editingPriceValue, setEditingPriceValue] = useState<string>('');

  const formatCurrency = (amount: number | null, currency?: string) => {
    if (!amount) return '-';
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: currency || 'SAR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Intl.DateTimeFormat(isRTL ? 'ar-SA' : 'en-US', {
      month: 'short',
      day: 'numeric',
    }).format(new Date(dateString));
  };

  const formatTime = (dateString: string | null) => {
    if (!dateString) return '';
    return new Intl.DateTimeFormat(isRTL ? 'ar-SA' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateString));
  };

  const handlePriceSubmit = (orderId: string) => {
    const newPrice = parseFloat(editingPriceValue);
    if (!isNaN(newPrice) && newPrice >= 0) {
      onPriceUpdate(orderId, newPrice);
    }
    setEditingPriceId(null);
    setEditingPriceValue('');
  };

  const startEditingPrice = (order: Order, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingPriceId(order.id);
    setEditingPriceValue(order.total_amount?.toString() || '');
  };

  return (
    <div className="rounded-xl overflow-hidden border border-slate-800 bg-[#0f1629]">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-900/50 border-b border-slate-800 hover:bg-slate-900/50">
              <TableHead className="text-slate-400 font-semibold text-xs uppercase tracking-wider">
                {isRTL ? 'رقم الطلب' : 'Order #'}
              </TableHead>
              <TableHead className="text-slate-400 font-semibold text-xs uppercase tracking-wider">
                {isRTL ? 'العميل' : 'Customer'}
              </TableHead>
              <TableHead className="text-slate-400 font-semibold text-xs uppercase tracking-wider">
                {isRTL ? 'الخدمة' : 'Service'}
              </TableHead>
              <TableHead className="text-slate-400 font-semibold text-xs uppercase tracking-wider">
                {isRTL ? 'الحالة' : 'Status'}
              </TableHead>
              <TableHead className="text-slate-400 font-semibold text-xs uppercase tracking-wider">
                {isRTL ? 'المبلغ' : 'Amount'}
              </TableHead>
              <TableHead className="text-slate-400 font-semibold text-xs uppercase tracking-wider">
                {isRTL ? 'التاريخ' : 'Date'}
              </TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence mode="popLayout">
              {orders.map((order, index) => {
                const config = statusConfig[order.status || 'pending'];
                const StatusIcon = config.icon;
                
                return (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: index * 0.02 }}
                    className="group border-b border-slate-800 last:border-0 hover:bg-slate-800/50 cursor-pointer"
                    onClick={() => onViewDetails(order.id)}
                  >
                    {/* Order Number */}
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-blue-500/10">
                          <Hash className="h-3.5 w-3.5 text-blue-400" />
                        </div>
                        <div>
                          <span className="font-mono text-sm font-bold text-blue-400">
                            {order.order_number}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5 ms-1 text-slate-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation();
                              onCopyOrderNumber(order.order_number);
                            }}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </TableCell>

                    {/* Customer */}
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-full bg-slate-800">
                          <User className="h-3.5 w-3.5 text-slate-400" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-white truncate max-w-[150px]">
                            {order.customer?.full_name || (isRTL ? 'عميل' : 'Customer')}
                          </p>
                          {order.customer?.phone && (
                            <p className="text-xs text-slate-500 font-mono">
                              {order.customer.phone}
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>

                    {/* Service/Title */}
                    <TableCell className="max-w-[200px]">
                      <p className="text-sm font-medium text-white truncate">
                        {isRTL ? order.title_ar || order.title : order.title}
                      </p>
                      {order.description && (
                        <p className="text-xs text-slate-500 truncate">
                          {order.description}
                        </p>
                      )}
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <div className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
                        config.bgColor,
                        config.color,
                        config.borderColor
                      )}>
                        <StatusIcon className="h-3 w-3" />
                        {isRTL ? config.labelAr : config.labelEn}
                      </div>
                    </TableCell>

                    {/* Amount */}
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      {editingPriceId === order.id ? (
                        <div className="flex items-center gap-1">
                          <Input
                            type="number"
                            value={editingPriceValue}
                            onChange={(e) => setEditingPriceValue(e.target.value)}
                            className="h-8 w-24 text-sm bg-slate-900 border-slate-700 text-white"
                            placeholder="0"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handlePriceSubmit(order.id);
                              if (e.key === 'Escape') {
                                setEditingPriceId(null);
                                setEditingPriceValue('');
                              }
                            }}
                          />
                          <Button
                            size="icon"
                            className="h-8 w-8 bg-emerald-600 hover:bg-emerald-700"
                            onClick={() => handlePriceSubmit(order.id)}
                          >
                            <Send className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <div 
                          className="flex items-center gap-1.5 group/price cursor-pointer"
                          onClick={(e) => startEditingPrice(order, e)}
                        >
                          <DollarSign className="h-4 w-4 text-emerald-400" />
                          <span className="text-sm font-bold text-emerald-400">
                            {formatCurrency(order.total_amount, order.currency || 'SAR')}
                          </span>
                          <Edit className="h-3 w-3 text-slate-500 opacity-0 group-hover/price:opacity-100 transition-opacity" />
                        </div>
                      )}
                    </TableCell>

                    {/* Date */}
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm text-white">{formatDate(order.created_at)}</span>
                        <span className="text-xs text-slate-500">{formatTime(order.created_at)}</span>
                      </div>
                    </TableCell>

                    {/* Actions */}
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-800 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            onViewDetails(order.id);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
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
                    </TableCell>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
