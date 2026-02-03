/**
 * Glowing Orbs - Premium Ambient Light Effect
 * Creates floating, glowing orbs for a futuristic feel
 */

import { memo } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

interface GlowingOrbsProps {
  className?: string;
}

export const GlowingOrbs = memo(function GlowingOrbs({ className }: GlowingOrbsProps) {
  const reducedMotion = useReducedMotion();

  const orbs = [
    {
      id: 1,
      color: "from-primary/40 to-emerald-500/30",
      size: "w-[500px] h-[500px]",
      position: "top-0 end-0 -translate-y-1/2 translate-x-1/4",
      delay: 0,
    },
    {
      id: 2,
      color: "from-amber-500/30 to-orange-500/20",
      size: "w-[400px] h-[400px]",
      position: "bottom-0 start-0 translate-y-1/2 -translate-x-1/4",
      delay: 2,
    },
    {
      id: 3,
      color: "from-violet-500/20 to-fuchsia-500/10",
      size: "w-[300px] h-[300px]",
      position: "top-1/2 start-1/3 -translate-y-1/2",
      delay: 4,
    },
  ];

  return (
    <div className={cn("absolute inset-0 pointer-events-none overflow-hidden", className)}>
      {orbs.map((orb) => (
        <motion.div
          key={orb.id}
          className={cn(
            "absolute rounded-full blur-3xl",
            `bg-gradient-to-br ${orb.color}`,
            orb.size,
            orb.position
          )}
          initial={{ opacity: 0.4, scale: 1 }}
          animate={
            reducedMotion
              ? {}
              : {
                  opacity: [0.4, 0.7, 0.4],
                  scale: [1, 1.1, 1],
                }
          }
          transition={{
            duration: 8,
            delay: orb.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
});
