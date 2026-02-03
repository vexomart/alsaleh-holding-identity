/**
 * Service Category Card V2 - Premium animated card
 */

import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { Service } from "@/lib/api/services";

interface CategoryConfig {
  nameAr: string;
  nameEn: string;
  descAr: string;
  descEn: string;
  icon: React.ElementType;
  color: string;
  gradient: string;
  glowColor: string;
}

interface ServiceCategoryCardV2Props {
  category: {
    key: string;
    config: CategoryConfig;
    services: Service[];
  };
  index: number;
  isRTL: boolean;
  onClick: () => void;
}

export function ServiceCategoryCardV2({ 
  category, 
  index, 
  isRTL, 
  onClick 
}: ServiceCategoryCardV2Props) {
  const Icon = category.config.icon;
  const NavIcon = isRTL ? ArrowLeft : ArrowRight;

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.95 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut" as const,
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      whileHover={{ 
        y: -8, 
        scale: 1.02,
        transition: { duration: 0.3 }
      }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="cursor-pointer group"
    >
      <div
        className={cn(
          "relative h-full overflow-hidden rounded-2xl md:rounded-3xl",
          "bg-card/80 backdrop-blur-sm",
          "border border-border/50",
          "transition-all duration-500",
          "hover:border-primary/30 hover:shadow-2xl",
        )}
        style={{
          boxShadow: `0 0 0 0 ${category.config.glowColor}`,
        }}
      >
        {/* Animated glow effect on hover */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle at 50% 0%, ${category.config.glowColor}, transparent 70%)`,
          }}
        />

        {/* Animated background gradient */}
        <motion.div
          className={cn(
            "absolute inset-0 opacity-30 group-hover:opacity-50",
            "bg-gradient-to-br",
            `from-[${category.config.color}]/10 to-transparent`
          )}
          initial={false}
          animate={{
            background: [
              `linear-gradient(135deg, ${category.config.color}10 0%, transparent 50%)`,
              `linear-gradient(135deg, ${category.config.color}20 0%, transparent 60%)`,
            ],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />

        {/* Corner decoration */}
        <div className="absolute -top-10 -end-10 w-32 h-32 rounded-full bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="relative p-5 md:p-6 flex flex-col h-full min-h-[200px] md:min-h-[220px]">
          {/* Icon with animated ring */}
          <div className="relative mb-4 md:mb-5">
            <motion.div
              className="absolute inset-0 rounded-2xl"
              style={{ backgroundColor: category.config.color }}
              initial={{ scale: 1, opacity: 0 }}
              animate={{ scale: [1, 1.4, 1.4], opacity: [0, 0.2, 0] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 1,
              }}
            />
            <motion.div
              className={cn(
                "relative w-12 h-12 md:w-14 md:h-14 rounded-2xl",
                "flex items-center justify-center",
                "transition-all duration-300",
                "group-hover:scale-110 group-hover:rotate-3"
              )}
              style={{ 
                backgroundColor: `${category.config.color}20`,
                boxShadow: `0 8px 32px ${category.config.color}30`,
              }}
            >
              <Icon
                className="h-6 w-6 md:h-7 md:w-7 transition-transform duration-300 group-hover:scale-110"
                style={{ color: category.config.color }}
              />
            </motion.div>
          </div>

          {/* Content */}
          <div className="flex-1">
            <h3 className="font-bold text-base md:text-lg mb-2 text-foreground group-hover:text-primary transition-colors duration-300">
              {isRTL ? category.config.nameAr : category.config.nameEn}
            </h3>
            <p className="text-xs md:text-sm text-foreground/60 line-clamp-2 leading-relaxed">
              {isRTL ? category.config.descAr : category.config.descEn}
            </p>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-1.5"
            >
              <Badge
                variant="secondary"
                className={cn(
                  "text-[10px] md:text-xs px-2.5 py-1",
                  "bg-background/80 backdrop-blur-sm",
                  "border border-border/60",
                  "font-semibold"
                )}
              >
                <span style={{ color: category.config.color }}>
                  {category.services.length}
                </span>
                <span className="text-foreground/60 ms-1">
                  {isRTL ? "خدمة" : "services"}
                </span>
              </Badge>
            </motion.div>

            {/* Arrow with animation */}
            <motion.div
              className={cn(
                "w-8 h-8 rounded-full",
                "flex items-center justify-center",
                "bg-primary/10 group-hover:bg-primary/20",
                "transition-all duration-300"
              )}
              whileHover={{ scale: 1.1 }}
              animate={{
                x: isRTL ? [0, -4, 0] : [0, 4, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatDelay: 0.5,
              }}
            >
              <NavIcon
                className="h-4 w-4 text-primary"
              />
            </motion.div>
          </div>

          {/* Trending indicator (for popular categories) */}
          {category.services.length > 20 && (
            <motion.div
              initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="absolute top-3 end-3"
            >
              <Badge
                className={cn(
                  "bg-gradient-to-r from-amber-500 to-orange-500",
                  "text-white text-[9px] px-2 py-0.5",
                  "shadow-lg shadow-amber-500/30"
                )}
              >
                <TrendingUp className="h-3 w-3 me-1" />
                {isRTL ? "شائع" : "Popular"}
              </Badge>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default ServiceCategoryCardV2;
