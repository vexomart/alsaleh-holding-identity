import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <div className={cn(
      "min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50",
      "relative overflow-x-hidden",
      className
    )}>
      <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
      <div className="relative z-10 w-full">
        {children}
      </div>
    </div>
  );
}