/**
 * ServiceCard - Modern Unified Design
 * Premium responsive card design for services
 */

import { motion } from 'framer-motion';
import { 
  Package, 
  Edit, 
  Trash2, 
  MoreVertical,
  Eye,
  Copy,
  EyeOff,
  DollarSign,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';
import { useLanguage } from '@/hooks/useLanguage';

interface Service {
  id: string;
  name: string;
  name_ar: string | null;
  description: string | null;
  description_ar: string | null;
  short_description: string | null;
  short_description_ar: string | null;
  price: number | null;
  currency: string | null;
  include_vat: boolean | null;
  category: string | null;
  icon: string | null;
  image_url: string | null;
  is_active: boolean | null;
  is_visible_to_customers: boolean | null;
  sort_order: number | null;
  tenant_id: string | null;
  created_at: string | null;
  updated_at: string | null;
}

interface ServiceCardProps {
  service: Service;
  index: number;
  onView: (service: Service) => void;
  onEdit: (service: Service) => void;
  onDelete: (service: Service) => void;
  onToggleStatus: (service: Service) => void;
  onToggleVisibility: (service: Service) => void;
  onDuplicate: (service: Service) => void;
  getCategoryLabel: (category: string | null) => string;
}

// Category color mapping
const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  legal: { bg: 'bg-primary/10', text: 'text-primary', border: 'border-primary/30' },
  consulting: { bg: 'bg-secondary/10', text: 'text-secondary', border: 'border-secondary/30' },
  technical: { bg: 'bg-primary/10', text: 'text-primary', border: 'border-primary/30' },
  financial: { bg: 'bg-accent/10', text: 'text-accent', border: 'border-accent/30' },
  marketing: { bg: 'bg-secondary/10', text: 'text-secondary', border: 'border-secondary/30' },
  development: { bg: 'bg-primary/10', text: 'text-primary', border: 'border-primary/30' },
  design: { bg: 'bg-secondary/10', text: 'text-secondary', border: 'border-secondary/30' },
  support: { bg: 'bg-accent/10', text: 'text-accent', border: 'border-accent/30' },
  training: { bg: 'bg-secondary/10', text: 'text-secondary', border: 'border-secondary/30' },
  other: { bg: 'bg-muted', text: 'text-muted-foreground', border: 'border-border' },
};

export function ServiceCard({
  service,
  index,
  onView,
  onEdit,
  onDelete,
  onToggleStatus,
  onToggleVisibility,
  onDuplicate,
  getCategoryLabel,
}: ServiceCardProps) {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const categoryStyle = categoryColors[service.category || 'other'] || categoryColors.other;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ y: -4 }}
      className="group"
    >
      <Card className={cn(
        "relative overflow-hidden border-border/50 shadow-sm",
        "hover:shadow-md hover:border-border transition-all duration-300"
      )}>
        {/* Status Gradient Top Bar */}
        <div className={cn(
          "absolute top-0 inset-x-0 h-1 bg-gradient-to-r",
          service.is_active 
            ? "from-accent via-accent/80 to-primary" 
            : "from-muted to-muted-foreground/20"
        )} />

        <CardContent className="p-5 pt-6">
          {/* Header Row */}
          <div className="flex items-start justify-between gap-4 mb-4">
            {/* Service Icon/Image */}
            <div className={cn(
              "relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0",
              "bg-muted flex items-center justify-center"
            )}>
              {service.image_url ? (
                <img 
                  src={service.image_url} 
                  alt={service.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <Package className="h-7 w-7 text-muted-foreground" />
              )}
              {/* Active indicator */}
              {service.is_active && (
                <div className="absolute -bottom-1 -end-1 w-4 h-4 bg-accent rounded-full border-2 border-background flex items-center justify-center">
                  <Zap className="h-2.5 w-2.5 text-accent-foreground" />
                </div>
              )}
            </div>

            {/* Actions Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onView(service)}>
                  <Eye className="h-4 w-4 me-2 text-primary" />
                  {isRTL ? 'عرض التفاصيل' : 'View Details'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit(service)}>
                  <Edit className="h-4 w-4 me-2 text-secondary" />
                  {isRTL ? 'تعديل' : 'Edit'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDuplicate(service)}>
                  <Copy className="h-4 w-4 me-2 text-muted-foreground" />
                  {isRTL ? 'نسخ' : 'Duplicate'}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onToggleVisibility(service)}>
                  {service.is_visible_to_customers ? (
                    <>
                      <EyeOff className="h-4 w-4 me-2" />
                      {isRTL ? 'إخفاء عن العملاء' : 'Hide from customers'}
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 me-2" />
                      {isRTL ? 'إظهار للعملاء' : 'Show to customers'}
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => onDelete(service)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4 me-2" />
                  {isRTL ? 'حذف' : 'Delete'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Service Info */}
          <div className="space-y-3">
            {/* Name */}
            <h3 className="font-bold text-lg text-foreground line-clamp-1 group-hover:text-primary transition-colors">
              {isRTL ? (service.name_ar || service.name) : service.name}
            </h3>

            {/* Description */}
            <p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">
              {isRTL 
                ? (service.description_ar || service.description || 'لا يوجد وصف متاح')
                : (service.description || 'No description available')
              }
            </p>

            {/* Badges Row */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Category Badge */}
              {service.category && (
                <Badge 
                  variant="outline" 
                  className={cn(
                    "text-xs border",
                    categoryStyle.bg,
                    categoryStyle.text,
                    categoryStyle.border
                  )}
                >
                  {getCategoryLabel(service.category)}
                </Badge>
              )}

              {/* Visibility Badge */}
              {!service.is_visible_to_customers && (
                <Badge 
                  variant="outline" 
                  className="text-xs gap-1"
                >
                  <EyeOff className="h-3 w-3" />
                  {isRTL ? 'مخفي' : 'Hidden'}
                </Badge>
              )}

              {/* VAT Badge */}
              {service.include_vat && (
                <Badge 
                  variant="outline" 
                  className="text-xs bg-accent/10 text-accent border-accent/30"
                >
                  {isRTL ? 'شامل VAT' : 'Incl. VAT'}
                </Badge>
              )}
            </div>
          </div>

          {/* Footer Row */}
          <div className="flex items-center justify-between mt-5 pt-4 border-t">
            {/* Price */}
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-accent/10">
                <DollarSign className="h-4 w-4 text-accent" />
              </div>
              <span className="font-bold text-foreground">
                {service.price != null ? (
                  <>
                    {service.price.toLocaleString(isRTL ? 'ar-SA' : 'en-US')}
                    <span className="text-xs text-muted-foreground ms-1">
                      {service.currency || 'SAR'}
                    </span>
                  </>
                ) : (
                  <span className="text-muted-foreground">
                    {isRTL ? 'غير محدد' : 'Not set'}
                  </span>
                )}
              </span>
            </div>

            {/* Quick Status Toggle */}
            <div className="flex items-center gap-2">
              <span className={cn(
                "text-xs",
                service.is_active ? "text-accent" : "text-muted-foreground"
              )}>
                {service.is_active 
                  ? (isRTL ? 'نشط' : 'Active') 
                  : (isRTL ? 'متوقف' : 'Inactive')}
              </span>
              <Switch
                checked={service.is_active ?? false}
                onCheckedChange={() => onToggleStatus(service)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
