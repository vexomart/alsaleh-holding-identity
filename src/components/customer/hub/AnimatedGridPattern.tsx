/**
 * Animated Grid Pattern - Futuristic Grid Background
 * Creates a subtle animated grid for tech feel
 */

import { memo } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

interface AnimatedGridPatternProps {
  className?: string;
}

export const AnimatedGridPattern = memo(function AnimatedGridPattern({
  className,
}: AnimatedGridPatternProps) {
  const reducedMotion = useReducedMotion();

  return (
    <div className={cn("absolute inset-0 pointer-events-none overflow-hidden", className)}>
      {/* Base Grid */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Animated Scan Line */}
      {!reducedMotion && (
        <motion.div
          className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"
          initial={{ top: 0, opacity: 0 }}
          animate={{
            top: ["0%", "100%", "0%"],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      )}

      {/* Corner Accents */}
      <div className="absolute top-4 start-4 w-8 h-8 border-s-2 border-t-2 border-primary/20 rounded-tl-lg" />
      <div className="absolute top-4 end-4 w-8 h-8 border-e-2 border-t-2 border-primary/20 rounded-tr-lg" />
      <div className="absolute bottom-4 start-4 w-8 h-8 border-s-2 border-b-2 border-primary/20 rounded-bl-lg" />
      <div className="absolute bottom-4 end-4 w-8 h-8 border-e-2 border-b-2 border-primary/20 rounded-br-lg" />
    </div>
  );
});
