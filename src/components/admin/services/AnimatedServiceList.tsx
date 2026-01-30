/**
 * AnimatedServiceList - Drag & Drop with RTL-aware animations
 * Professional, subtle animations for enterprise dashboards
 */

import { useState, useRef, useEffect } from 'react';
import { motion, Reorder, useDragControls, AnimatePresence } from 'framer-motion';
import { 
  Package, 
  Edit, 
  Trash2, 
  MoreVertical,
  Eye,
  CheckCircle,
  XCircle,
  GripVertical,
  Copy,
  EyeOff,
  ChevronUp,
  ChevronDown
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

interface AnimatedServiceListProps {
  services: Service[];
  onReorder: (services: Service[]) => void;
  onView: (service: Service) => void;
  onEdit: (service: Service) => void;
  onDelete: (service: Service) => void;
  onToggleStatus: (service: Service) => void;
  onToggleVisibility: (service: Service) => void;
  onDuplicate: (service: Service) => void;
  onMoveUp: (service: Service) => void;
  onMoveDown: (service: Service) => void;
  getCategoryLabel: (category: string | null) => string;
  isRTL?: boolean;
}

// Animation configuration - all durations < 250ms
const ANIMATION_CONFIG = {
  duration: 0.2,
  ease: [0.25, 0.1, 0.25, 1], // Custom cubic-bezier for smooth feel
};

// RTL-aware slide direction
const getSlideDirection = (isRTL: boolean) => ({
  initial: isRTL ? -20 : 20,
  exit: isRTL ? 20 : -20,
});

export function AnimatedServiceList({
  services,
  onReorder,
  onView,
  onEdit,
  onDelete,
  onToggleStatus,
  onToggleVisibility,
  onDuplicate,
  onMoveUp,
  onMoveDown,
  getCategoryLabel,
  isRTL = true,
}: AnimatedServiceListProps) {
  const [items, setItems] = useState(services);
  const [isDragging, setIsDragging] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);
  const slideDirection = getSlideDirection(isRTL);

  // Sync external services with internal state
  useEffect(() => {
    setItems(services);
    // Mark as initialized after first render to skip initial animations
    if (!hasInitialized) {
      requestAnimationFrame(() => setHasInitialized(true));
    }
  }, [services, hasInitialized]);

  // Handle reorder completion
  const handleReorder = (newOrder: Service[]) => {
    setItems(newOrder);
  };

  // Commit reorder to backend on drag end
  const handleDragEnd = () => {
    setIsDragging(false);
    if (JSON.stringify(items.map(i => i.id)) !== JSON.stringify(services.map(s => s.id))) {
      onReorder(items);
    }
  };

  if (services.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
        <p>لا توجد خدمات</p>
      </div>
    );
  }

  return (
    <Reorder.Group
      axis="y"
      values={items}
      onReorder={handleReorder}
      className="divide-y divide-border"
    >
      <AnimatePresence mode="popLayout">
        {items.map((service, index) => (
          <ServiceListItem
            key={service.id}
            service={service}
            index={index}
            totalItems={items.length}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={handleDragEnd}
            isDragging={isDragging}
            hasInitialized={hasInitialized}
            slideDirection={slideDirection}
            isRTL={isRTL}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggleStatus={onToggleStatus}
            onToggleVisibility={onToggleVisibility}
            onDuplicate={onDuplicate}
            onMoveUp={onMoveUp}
            onMoveDown={onMoveDown}
            getCategoryLabel={getCategoryLabel}
          />
        ))}
      </AnimatePresence>
    </Reorder.Group>
  );
}

interface ServiceListItemProps {
  service: Service;
  index: number;
  totalItems: number;
  onDragStart: () => void;
  onDragEnd: () => void;
  isDragging: boolean;
  hasInitialized: boolean;
  slideDirection: { initial: number; exit: number };
  isRTL: boolean;
  onView: (service: Service) => void;
  onEdit: (service: Service) => void;
  onDelete: (service: Service) => void;
  onToggleStatus: (service: Service) => void;
  onToggleVisibility: (service: Service) => void;
  onDuplicate: (service: Service) => void;
  onMoveUp: (service: Service) => void;
  onMoveDown: (service: Service) => void;
  getCategoryLabel: (category: string | null) => string;
}

function ServiceListItem({
  service,
  index,
  totalItems,
  onDragStart,
  onDragEnd,
  isDragging,
  hasInitialized,
  slideDirection,
  isRTL,
  onView,
  onEdit,
  onDelete,
  onToggleStatus,
  onToggleVisibility,
  onDuplicate,
  onMoveUp,
  onMoveDown,
  getCategoryLabel,
}: ServiceListItemProps) {
  const dragControls = useDragControls();
  const itemRef = useRef<HTMLLIElement>(null);

  // Variants for list items - skip initial animation
  const itemVariants = {
    initial: hasInitialized 
      ? { opacity: 0, x: slideDirection.initial } 
      : { opacity: 1, x: 0 },
    animate: { 
      opacity: 1, 
      x: 0,
      transition: ANIMATION_CONFIG
    },
    exit: { 
      opacity: 0, 
      x: slideDirection.exit,
      transition: { duration: 0.15 }
    },
  };

  return (
    <Reorder.Item
      ref={itemRef}
      value={service}
      dragListener={false}
      dragControls={dragControls}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      variants={itemVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      layout
      layoutId={service.id}
      className={cn(
        "list-none",
        "p-4 bg-background",
        "transition-colors duration-150",
        isDragging ? "" : "hover:bg-muted/50"
      )}
      style={{
        position: 'relative',
        zIndex: isDragging ? 50 : 1,
      }}
      whileDrag={{
        scale: 1.02,
        boxShadow: "0 8px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        backgroundColor: "hsl(var(--card))",
        borderRadius: "8px",
        cursor: "grabbing",
      }}
      transition={{
        layout: { duration: 0.2, ease: ANIMATION_CONFIG.ease },
      }}
    >
      <div className="flex items-center gap-4">
        {/* Drag Handle */}
        <motion.div
          className={cn(
            "cursor-grab active:cursor-grabbing p-1 -m-1 rounded",
            "text-muted-foreground/50 hover:text-muted-foreground",
            "transition-colors duration-150"
          )}
          onPointerDown={(e) => {
            e.preventDefault();
            dragControls.start(e);
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <GripVertical className="h-5 w-5" />
        </motion.div>

        {/* Image/Icon */}
        <motion.div 
          className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center overflow-hidden flex-shrink-0"
          layoutId={`image-${service.id}`}
        >
          {service.image_url ? (
            <img 
              src={service.image_url} 
              alt={service.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <Package className="h-6 w-6 text-primary" />
          )}
        </motion.div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-medium text-foreground truncate">
              {service.name_ar || service.name}
            </h3>
            <motion.div layout="position">
              <Badge 
                variant={service.is_active ? 'default' : 'secondary'} 
                className="text-xs"
              >
                {service.is_active ? 'نشط' : 'متوقف'}
              </Badge>
            </motion.div>
            {!service.is_visible_to_customers && (
              <motion.div layout="position">
                <Badge variant="outline" className="text-xs gap-1">
                  <EyeOff className="h-3 w-3" />
                  مخفي
                </Badge>
              </motion.div>
            )}
            {service.category && (
              <motion.div layout="position">
                <Badge variant="outline" className="text-xs">
                  {getCategoryLabel(service.category)}
                </Badge>
              </motion.div>
            )}
          </div>
          <p className="text-sm text-muted-foreground truncate mt-1">
            {service.description_ar || service.description || 'لا يوجد وصف'}
          </p>
          {service.price != null && (
            <p className="text-sm font-medium text-primary mt-1">
              {service.price} {service.currency || 'SAR'}
            </p>
          )}
        </div>

        {/* Quick Sort Buttons */}
        <div className="flex flex-col gap-0.5">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => onMoveUp(service)}
            disabled={index === 0}
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => onMoveDown(service)}
            disabled={index === totalItems - 1}
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>

        {/* Actions Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="flex-shrink-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align={isRTL ? "start" : "end"}>
            <DropdownMenuItem onClick={() => onView(service)}>
              <Eye className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
              عرض التفاصيل
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(service)}>
              <Edit className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
              تعديل
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDuplicate(service)}>
              <Copy className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
              نسخ
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onToggleStatus(service)}>
              {service.is_active ? (
                <>
                  <XCircle className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
                  إلغاء التفعيل
                </>
              ) : (
                <>
                  <CheckCircle className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
                  تفعيل
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onToggleVisibility(service)}>
              {service.is_visible_to_customers ? (
                <>
                  <EyeOff className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
                  إخفاء عن العملاء
                </>
              ) : (
                <>
                  <Eye className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
                  إظهار للعملاء
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => onDelete(service)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
              حذف
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Reorder.Item>
  );
}

export default AnimatedServiceList;
