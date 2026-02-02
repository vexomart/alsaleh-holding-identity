/**
 * Relationship Timeline
 * Vertical timeline showing client journey
 */

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';
import { 
  UserPlus,
  ShoppingBag,
  FileText,
  RefreshCw,
  FileSignature,
  CheckCircle,
  Shield,
  Receipt,
  CreditCard,
  ArrowDownCircle,
  ArrowUpCircle,
  MessageSquare,
} from 'lucide-react';
import { TimelineEvent, TIMELINE_EVENT_CONFIG, TimelineEventType } from './types';

interface RelationshipTimelineProps {
  events: TimelineEvent[];
  maxEvents?: number;
  className?: string;
}

const iconMap: Record<string, React.ElementType> = {
  UserPlus,
  ShoppingBag,
  FileText,
  RefreshCw,
  FileSignature,
  CheckCircle,
  Shield,
  Receipt,
  CreditCard,
  ArrowDownCircle,
  ArrowUpCircle,
  MessageSquare,
};

export function RelationshipTimeline({ 
  events, 
  maxEvents,
  className 
}: RelationshipTimelineProps) {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  const displayEvents = maxEvents ? events.slice(0, maxEvents) : events;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    // Relative time for recent events
    if (diffDays === 0) {
      return isRTL ? 'اليوم' : 'Today';
    }
    if (diffDays === 1) {
      return isRTL ? 'أمس' : 'Yesterday';
    }
    if (diffDays < 7) {
      return isRTL ? `منذ ${diffDays} أيام` : `${diffDays} days ago`;
    }

    // Full date for older events
    return new Intl.DateTimeFormat(isRTL ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const formatTime = (dateString: string) => {
    return new Intl.DateTimeFormat(isRTL ? 'ar-SA' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateString));
  };

  const getActorLabel = (actor: TimelineEvent['actor'], actorName?: string) => {
    if (actorName) return actorName;
    switch (actor) {
      case 'system': return isRTL ? 'النظام' : 'System';
      case 'admin': return isRTL ? 'الإدارة' : 'Admin';
      case 'client': return isRTL ? 'العميل' : 'Client';
      default: return '';
    }
  };

  if (displayEvents.length === 0) {
    return (
      <div className={cn('text-center py-12 text-muted-foreground', className)}>
        {isRTL ? 'لا توجد أحداث بعد' : 'No events yet'}
      </div>
    );
  }

  return (
    <div className={cn('relative', className)}>
      {/* Timeline Line */}
      <div 
        className={cn(
          'absolute top-0 bottom-0 w-0.5 bg-border',
          isRTL ? 'right-5' : 'left-5'
        )} 
      />

      {/* Events */}
      <div className="space-y-6">
        {displayEvents.map((event, index) => {
          const config = TIMELINE_EVENT_CONFIG[event.type as TimelineEventType] || TIMELINE_EVENT_CONFIG.status_changed;
          const Icon = iconMap[config.icon] || RefreshCw;

          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: index * 0.05 }}
              className={cn(
                'relative flex gap-4',
                isRTL && 'flex-row-reverse'
              )}
            >
              {/* Icon Node */}
              <div className={cn(
                'relative z-10 flex-shrink-0 w-10 h-10 rounded-full border-2 border-background bg-card flex items-center justify-center shadow-sm',
              )}>
                <Icon className={cn('h-4 w-4', config.color)} />
              </div>

              {/* Content */}
              <div className={cn(
                'flex-1 bg-card border rounded-lg p-4',
                isRTL ? 'text-right' : 'text-left'
              )}>
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h4 className="font-semibold text-foreground">
                    {isRTL ? event.titleAr : event.title}
                  </h4>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatTime(event.timestamp)}
                  </span>
                </div>

                {/* Description */}
                {(event.description || event.descriptionAr) && (
                  <p className="text-sm text-muted-foreground mb-2">
                    {isRTL && event.descriptionAr ? event.descriptionAr : event.description}
                  </p>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{formatDate(event.timestamp)}</span>
                  <span className="flex items-center gap-1">
                    <span className={cn(
                      'w-1.5 h-1.5 rounded-full',
                      event.actor === 'system' && 'bg-slate-400',
                      event.actor === 'admin' && 'bg-amber-500',
                      event.actor === 'client' && 'bg-blue-500'
                    )} />
                    {getActorLabel(event.actor, event.actorName)}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Show More Indicator */}
      {maxEvents && events.length > maxEvents && (
        <div className="text-center mt-6">
          <span className="text-sm text-muted-foreground">
            {isRTL 
              ? `+ ${events.length - maxEvents} حدث آخر`
              : `+ ${events.length - maxEvents} more events`
            }
          </span>
        </div>
      )}
    </div>
  );
}
