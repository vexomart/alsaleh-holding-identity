/**
 * Transaction Detail Dialog - PHASE FIN-4
 * Full transaction details with timeline and actions
 */

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useLanguage } from '@/hooks/useLanguage';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { 
  Copy, 
  ExternalLink,
  CheckCircle2,
  Clock,
  XCircle,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { toast } from 'sonner';
import { TransactionTimeline } from './TransactionTimeline';
import { STATUS_LABELS, TYPE_LABELS, getAllowedTransitions } from '@/lib/financial/status-machine';
import type { TransactionStatus, TransactionType } from '@/lib/financial/status-machine';

interface Transaction {
  id: string;
  transaction_type: TransactionType;
  amount: number;
  currency: string;
  status: TransactionStatus;
  provider: string | null;
  provider_reference: string | null;
  description: string | null;
  description_ar: string | null;
  related_invoice_id: string | null;
  related_order_id: string | null;
  customer_user_id: string;
  wallet_id: string | null;
  idempotency_key: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  processed_at: string | null;
}

interface TransactionDetailDialogProps {
  transactionId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusChange?: () => void;
}

export function TransactionDetailDialog({
  transactionId,
  open,
  onOpenChange,
  onStatusChange,
}: TransactionDetailDialogProps) {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<{ name: string; uid: string } | null>(null);
  const [invoiceNumber, setInvoiceNumber] = useState<string | null>(null);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  useEffect(() => {
    if (open && transactionId) {
      fetchTransaction();
    }
  }, [open, transactionId]);

  const fetchTransaction = async () => {
    if (!transactionId) return;
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('financial_transactions')
        .select('*')
        .eq('id', transactionId)
        .single();

      if (error) throw error;
      setTransaction(data as Transaction);

      // Fetch related data in parallel
      const promises = [];

      // Customer info
      promises.push(
        supabase
          .from('profiles')
          .select('full_name, customer_uid')
          .eq('id', data.customer_user_id)
          .single()
          .then(({ data: profile }) => {
            if (profile) {
              setCustomerInfo({
                name: profile.full_name || '',
                uid: profile.customer_uid || '',
              });
            }
          })
      );

      // Invoice number
      if (data.related_invoice_id) {
        promises.push(
          supabase
            .from('invoices')
            .select('invoice_number')
            .eq('id', data.related_invoice_id)
            .single()
            .then(({ data: invoice }) => {
              if (invoice) setInvoiceNumber(invoice.invoice_number);
            })
        );
      }

      // Order number
      if (data.related_order_id) {
        promises.push(
          supabase
            .from('orders')
            .select('order_number')
            .eq('id', data.related_order_id)
            .single()
            .then(({ data: order }) => {
              if (order) setOrderNumber(order.order_number);
            })
        );
      }

      await Promise.all(promises);
    } catch (error) {
      console.error('Error fetching transaction:', error);
      toast.error(isRTL ? 'فشل في جلب المعاملة' : 'Failed to fetch transaction');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number, currency: string = 'SAR') => {
    return new Intl.NumberFormat(isRTL ? 'ar-SA' : 'en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Intl.DateTimeFormat(isRTL ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateStr));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success(isRTL ? 'تم النسخ' : 'Copied');
  };

  const getStatusBadge = (status: TransactionStatus) => {
    const configs: Record<string, { icon: React.ElementType; className: string }> = {
      succeeded: {
        icon: CheckCircle2,
        className: 'bg-green-500/10 text-green-600 border-green-500/30',
      },
      pending: {
        icon: Clock,
        className: 'bg-amber-500/10 text-amber-600 border-amber-500/30',
      },
      processing: {
        icon: Loader2,
        className: 'bg-blue-500/10 text-blue-600 border-blue-500/30',
      },
      failed: {
        icon: XCircle,
        className: 'bg-red-500/10 text-red-600 border-red-500/30',
      },
      cancelled: {
        icon: XCircle,
        className: 'bg-gray-500/10 text-gray-600 border-gray-500/30',
      },
      refunded: {
        icon: RefreshCw,
        className: 'bg-purple-500/10 text-purple-600 border-purple-500/30',
      },
    };

    const config = configs[status] || configs.pending;
    const Icon = config.icon;
    const label = STATUS_LABELS[status];

    return (
      <Badge variant="outline" className={cn('gap-1', config.className)}>
        <Icon className="h-3 w-3" />
        {isRTL ? label?.ar : label?.en}
      </Badge>
    );
  };

  if (!transaction) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" dir={isRTL ? 'rtl' : 'ltr'}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span>{isRTL ? 'تفاصيل المعاملة' : 'Transaction Details'}</span>
            {getStatusBadge(transaction.status)}
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Amount Section */}
            <div className="text-center py-4 bg-muted/30 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">
                {isRTL ? 'المبلغ' : 'Amount'}
              </p>
              <p className="text-3xl font-bold" dir="ltr">
                {formatCurrency(transaction.amount, transaction.currency)}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {isRTL 
                  ? TYPE_LABELS[transaction.transaction_type]?.ar 
                  : TYPE_LABELS[transaction.transaction_type]?.en
                }
              </p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4">
              <DetailItem
                label={isRTL ? 'معرف المعاملة' : 'Transaction ID'}
                value={transaction.id}
                copyable
                onCopy={copyToClipboard}
                isRTL={isRTL}
              />
              {transaction.provider_reference && (
                <DetailItem
                  label={isRTL ? 'مرجع المزود' : 'Provider Reference'}
                  value={transaction.provider_reference}
                  copyable
                  onCopy={copyToClipboard}
                  isRTL={isRTL}
                />
              )}
              {customerInfo && (
                <>
                  <DetailItem
                    label={isRTL ? 'رقم العميل' : 'Customer ID'}
                    value={customerInfo.uid}
                    copyable
                    onCopy={copyToClipboard}
                    isRTL={isRTL}
                  />
                  <DetailItem
                    label={isRTL ? 'اسم العميل' : 'Customer Name'}
                    value={customerInfo.name}
                    isRTL={isRTL}
                  />
                </>
              )}
              {invoiceNumber && (
                <DetailItem
                  label={isRTL ? 'رقم الفاتورة' : 'Invoice Number'}
                  value={invoiceNumber}
                  copyable
                  onCopy={copyToClipboard}
                  isRTL={isRTL}
                />
              )}
              {orderNumber && (
                <DetailItem
                  label={isRTL ? 'رقم الطلب' : 'Order Number'}
                  value={orderNumber}
                  copyable
                  onCopy={copyToClipboard}
                  isRTL={isRTL}
                />
              )}
              {transaction.provider && (
                <DetailItem
                  label={isRTL ? 'المزود' : 'Provider'}
                  value={transaction.provider}
                  isRTL={isRTL}
                />
              )}
              <DetailItem
                label={isRTL ? 'تاريخ الإنشاء' : 'Created At'}
                value={formatDate(transaction.created_at)}
                isRTL={isRTL}
              />
              {transaction.processed_at && (
                <DetailItem
                  label={isRTL ? 'تاريخ المعالجة' : 'Processed At'}
                  value={formatDate(transaction.processed_at)}
                  isRTL={isRTL}
                />
              )}
            </div>

            {/* Description */}
            {(transaction.description || transaction.description_ar) && (
              <>
                <Separator />
                <div>
                  <p className="text-sm font-medium mb-2">
                    {isRTL ? 'الوصف' : 'Description'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? transaction.description_ar : transaction.description}
                  </p>
                </div>
              </>
            )}

            <Separator />

            {/* Timeline */}
            <TransactionTimeline transactionId={transaction.id} isOpen />

            {/* Allowed Transitions Info */}
            {getAllowedTransitions(transaction.status, transaction.transaction_type).length > 0 && (
              <>
                <Separator />
                <div>
                  <p className="text-sm font-medium mb-2">
                    {isRTL ? 'التحويلات المسموحة' : 'Allowed Transitions'}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {getAllowedTransitions(transaction.status, transaction.transaction_type).map((status) => (
                      <Badge key={status} variant="secondary">
                        {isRTL ? STATUS_LABELS[status]?.ar : STATUS_LABELS[status]?.en}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

interface DetailItemProps {
  label: string;
  value: string;
  copyable?: boolean;
  onCopy?: (text: string) => void;
  isRTL: boolean;
}

function DetailItem({ label, value, copyable, onCopy, isRTL }: DetailItemProps) {
  return (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="flex items-center gap-2">
        <p className="text-sm font-medium truncate" dir="ltr" title={value}>
          {value}
        </p>
        {copyable && onCopy && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => onCopy(value)}
          >
            <Copy className="h-3 w-3" />
          </Button>
        )}
      </div>
    </div>
  );
}
