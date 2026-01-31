/**
 * Transaction Timeline Component - PHASE FIN-4
 * Shows detailed event timeline for a transaction
 */

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  Clock, 
  XCircle, 
  RefreshCw,
  CreditCard,
  ArrowRightLeft,
  FileText,
  User,
  AlertTriangle,
  Loader2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { EVENT_LABELS, type TransactionEventType } from '@/lib/financial/status-machine';

interface TransactionEvent {
  id: string;
  transaction_id: string;
  event_type: string;
  previous_status: string | null;
  new_status: string | null;
  metadata: Record<string, unknown>;
  provider_payload: Record<string, unknown> | null;
  performed_by: string | null;
  created_at: string;
}

interface TransactionTimelineProps {
  transactionId: string;
  isOpen?: boolean;
}

const eventIcons: Record<string, React.ElementType> = {
  created: FileText,
  paylink_invoice_created: CreditCard,
  customer_redirected: ArrowRightLeft,
  webhook_received: RefreshCw,
  verified: CheckCircle2,
  status_changed: ArrowRightLeft,
  manual_adjustment: User,
  refund_initiated: RefreshCw,
  refund_completed: CheckCircle2,
  cancelled_by_user: XCircle,
  cancelled_by_admin: XCircle,
  payment_timeout: AlertTriangle,
  retry_initiated: RefreshCw,
};

const eventColors: Record<string, string> = {
  created: 'text-blue-500 bg-blue-500/10',
  paylink_invoice_created: 'text-purple-500 bg-purple-500/10',
  customer_redirected: 'text-indigo-500 bg-indigo-500/10',
  webhook_received: 'text-cyan-500 bg-cyan-500/10',
  verified: 'text-green-500 bg-green-500/10',
  status_changed: 'text-amber-500 bg-amber-500/10',
  manual_adjustment: 'text-orange-500 bg-orange-500/10',
  refund_initiated: 'text-yellow-500 bg-yellow-500/10',
  refund_completed: 'text-green-500 bg-green-500/10',
  cancelled_by_user: 'text-gray-500 bg-gray-500/10',
  cancelled_by_admin: 'text-red-500 bg-red-500/10',
  payment_timeout: 'text-red-500 bg-red-500/10',
  retry_initiated: 'text-blue-500 bg-blue-500/10',
};

export function TransactionTimeline({ transactionId, isOpen = false }: TransactionTimelineProps) {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const [events, setEvents] = useState<TransactionEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [expanded, setExpanded] = useState(isOpen);
  const [showMetadata, setShowMetadata] = useState<string | null>(null);

  useEffect(() => {
    if (expanded && transactionId) {
      fetchEvents();
    }
  }, [expanded, transactionId]);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('transaction_events')
        .select('*')
        .eq('transaction_id', transactionId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setEvents((data || []) as TransactionEvent[]);
    } catch (error) {
      console.error('Error fetching transaction events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Intl.DateTimeFormat(isRTL ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(new Date(dateStr));
  };

  const getEventLabel = (eventType: string) => {
    const labels = EVENT_LABELS[eventType as TransactionEventType];
    return labels ? (isRTL ? labels.ar : labels.en) : eventType;
  };

  const getStatusTransitionText = (previous: string | null, current: string | null) => {
    if (!previous || !current) return null;
    return isRTL 
      ? `${previous} ← ${current}`
      : `${previous} → ${current}`;
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <Button
        variant="ghost"
        className="w-full justify-between px-4 py-3 h-auto"
        onClick={() => setExpanded(!expanded)}
      >
        <span className="font-medium text-sm">
          {isRTL ? 'الجدول الزمني للمعاملة' : 'Transaction Timeline'}
        </span>
        {expanded ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </Button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-2 border-t">
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-3">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : events.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  {isRTL ? 'لا توجد أحداث مسجلة' : 'No events recorded'}
                </p>
              ) : (
                <div className="relative">
                  {/* Timeline line */}
                  <div 
                    className={cn(
                      "absolute top-0 bottom-0 w-0.5 bg-border",
                      isRTL ? "right-4" : "left-4"
                    )} 
                  />

                  <div className="space-y-4">
                    {events.map((event, index) => {
                      const Icon = eventIcons[event.event_type] || Clock;
                      const colorClass = eventColors[event.event_type] || 'text-gray-500 bg-gray-500/10';
                      
                      return (
                        <motion.div
                          key={event.id}
                          initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className={cn(
                            "relative flex gap-4",
                            isRTL ? "flex-row-reverse" : "flex-row"
                          )}
                        >
                          {/* Icon */}
                          <div className={cn(
                            "relative z-10 flex items-center justify-center h-8 w-8 rounded-full",
                            colorClass
                          )}>
                            <Icon className="h-4 w-4" />
                          </div>

                          {/* Content */}
                          <div className="flex-1 pb-4">
                            <div className="flex items-start justify-between gap-2 flex-wrap">
                              <div>
                                <p className="font-medium text-sm">
                                  {getEventLabel(event.event_type)}
                                </p>
                                {event.previous_status && event.new_status && (
                                  <Badge variant="outline" className="mt-1 text-xs">
                                    {getStatusTransitionText(event.previous_status, event.new_status)}
                                  </Badge>
                                )}
                              </div>
                              <span className="text-xs text-muted-foreground whitespace-nowrap">
                                {formatDate(event.created_at)}
                              </span>
                            </div>

                            {/* Metadata toggle */}
                            {(event.metadata && Object.keys(event.metadata).length > 0) || event.provider_payload ? (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="mt-2 h-7 text-xs"
                                onClick={() => setShowMetadata(
                                  showMetadata === event.id ? null : event.id
                                )}
                              >
                                {showMetadata === event.id 
                                  ? (isRTL ? 'إخفاء التفاصيل' : 'Hide Details')
                                  : (isRTL ? 'عرض التفاصيل' : 'Show Details')
                                }
                              </Button>
                            ) : null}

                            {/* Metadata content */}
                            <AnimatePresence>
                              {showMetadata === event.id && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="overflow-hidden"
                                >
                                  <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-x-auto max-h-40" dir="ltr">
                                    {JSON.stringify({
                                      metadata: event.metadata,
                                      provider_payload: event.provider_payload 
                                        ? '*** sanitized ***' 
                                        : null,
                                    }, null, 2)}
                                  </pre>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
