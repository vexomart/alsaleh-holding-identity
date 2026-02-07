/**
 * ServiceCard - Dark Theme Premium Service Card
 * Modern, responsive card design for services
 */

import { motion } from 'framer-motion';
import { 
  Package, 
  Edit, 
  Trash2, 
  MoreVertical,
  Eye,
  CheckCircle,
  XCircle,
  Copy,
  EyeOff,
  TrendingUp,
  DollarSign,
  Star,
  Zap
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
import { Switch } from '@/components/ui/switch';

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
  legal: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' },
  consulting: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30' },
  technical: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/30' },
  financial: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  marketing: { bg: 'bg-pink-500/10', text: 'text-pink-400', border: 'border-pink-500/30' },
  development: { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/30' },
  design: { bg: 'bg-violet-500/10', text: 'text-violet-400', border: 'border-violet-500/30' },
  support: { bg: 'bg-teal-500/10', text: 'text-teal-400', border: 'border-teal-500/30' },
  training: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' },
  other: { bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-500/30' },
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
  const categoryStyle = categoryColors[service.category || 'other'] || categoryColors.other;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ y: -4 }}
      className="group"
    >
      <div className={cn(
        "relative overflow-hidden rounded-2xl",
        "bg-[#0f1629] border border-slate-800",
        "hover:border-slate-700 transition-all duration-300",
        "hover:shadow-lg hover:shadow-slate-900/50"
      )}>
        {/* Status Gradient Top Bar */}
        <div className={cn(
          "absolute top-0 inset-x-0 h-1 bg-gradient-to-r",
          service.is_active 
            ? "from-emerald-500 via-teal-500 to-cyan-500" 
            : "from-slate-600 to-slate-700"
        )} />

        {/* Card Content */}
        <div className="p-5">
          {/* Header Row */}
          <div className="flex items-start justify-between gap-4 mb-4">
            {/* Service Icon/Image */}
            <div className={cn(
              "relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0",
              "bg-gradient-to-br from-slate-800 to-slate-900",
              "flex items-center justify-center",
              "ring-2 ring-slate-700/50"
            )}>
              {service.image_url ? (
                <img 
                  src={service.image_url} 
                  alt={service.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <Package className="h-7 w-7 text-slate-400" />
              )}
              {/* Active indicator */}
              {service.is_active && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[#0f1629] flex items-center justify-center">
                  <Zap className="h-2.5 w-2.5 text-white" />
                </div>
              )}
            </div>

            {/* Actions Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="bg-[#0f1629] border-slate-700 text-slate-200"
              >
                <DropdownMenuItem 
                  onClick={() => onView(service)}
                  className="hover:bg-slate-800 focus:bg-slate-800"
                >
                  <Eye className="h-4 w-4 me-2 text-blue-400" />
                  عرض التفاصيل
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onEdit(service)}
                  className="hover:bg-slate-800 focus:bg-slate-800"
                >
                  <Edit className="h-4 w-4 me-2 text-amber-400" />
                  تعديل
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDuplicate(service)}
                  className="hover:bg-slate-800 focus:bg-slate-800"
                >
                  <Copy className="h-4 w-4 me-2 text-purple-400" />
                  نسخ
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-slate-700" />
                <DropdownMenuItem 
                  onClick={() => onToggleVisibility(service)}
                  className="hover:bg-slate-800 focus:bg-slate-800"
                >
                  {service.is_visible_to_customers ? (
                    <>
                      <EyeOff className="h-4 w-4 me-2 text-slate-400" />
                      إخفاء عن العملاء
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 me-2 text-cyan-400" />
                      إظهار للعملاء
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-slate-700" />
                <DropdownMenuItem 
                  onClick={() => onDelete(service)}
                  className="text-red-400 hover:bg-red-500/10 focus:bg-red-500/10 focus:text-red-400"
                >
                  <Trash2 className="h-4 w-4 me-2" />
                  حذف
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Service Info */}
          <div className="space-y-3">
            {/* Name */}
            <h3 className="font-bold text-lg text-white line-clamp-1 group-hover:text-blue-400 transition-colors">
              {service.name_ar || service.name}
            </h3>

            {/* Description */}
            <p className="text-sm text-slate-400 line-clamp-2 min-h-[2.5rem]">
              {service.description_ar || service.description || 'لا يوجد وصف متاح'}
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
                  className="text-xs bg-orange-500/10 text-orange-400 border-orange-500/30 gap-1"
                >
                  <EyeOff className="h-3 w-3" />
                  مخفي
                </Badge>
              )}

              {/* VAT Badge */}
              {service.include_vat && (
                <Badge 
                  variant="outline" 
                  className="text-xs bg-green-500/10 text-green-400 border-green-500/30"
                >
                  شامل VAT
                </Badge>
              )}
            </div>
          </div>

          {/* Footer Row */}
          <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-800">
            {/* Price */}
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-500/10">
                <DollarSign className="h-4 w-4 text-emerald-400" />
              </div>
              <span className="font-bold text-white">
                {service.price != null ? (
                  <>
                    {service.price.toLocaleString('ar-SA')}
                    <span className="text-xs text-slate-400 mr-1">
                      {service.currency || 'SAR'}
                    </span>
                  </>
                ) : (
                  <span className="text-slate-500">غير محدد</span>
                )}
              </span>
            </div>

            {/* Quick Status Toggle */}
            <div className="flex items-center gap-2">
              <span className={cn(
                "text-xs",
                service.is_active ? "text-emerald-400" : "text-slate-500"
              )}>
                {service.is_active ? 'نشط' : 'متوقف'}
              </span>
              <Switch
                checked={service.is_active ?? false}
                onCheckedChange={() => onToggleStatus(service)}
                className="data-[state=checked]:bg-emerald-500 data-[state=unchecked]:bg-slate-700"
              />
            </div>
          </div>
        </div>

        {/* Hover Glow Effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5" />
        </div>
      </div>
    </motion.div>
  );
}
