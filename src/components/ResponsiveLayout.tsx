import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface ResponsiveLayoutProps {
  children: ReactNode;
  className?: string;
  containerSize?: "sm" | "md" | "lg" | "xl" | "full";
  padding?: "none" | "sm" | "md" | "lg" | "xl";
  spacing?: "none" | "sm" | "md" | "lg" | "xl";
}

const containerSizes = {
  sm: "max-w-2xl",
  md: "max-w-4xl", 
  lg: "max-w-6xl",
  xl: "max-w-7xl",
  full: "max-w-full"
};

const paddingSizes = {
  none: "",
  sm: "px-4 sm:px-6",
  md: "px-4 sm:px-6 lg:px-8",
  lg: "px-4 sm:px-6 lg:px-8 xl:px-12",
  xl: "px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16"
};

const spacingSizes = {
  none: "",
  sm: "space-y-8 sm:space-y-12",
  md: "space-y-12 sm:space-y-16 lg:space-y-20",
  lg: "space-y-16 sm:space-y-20 lg:space-y-24 xl:space-y-32",
  xl: "space-y-20 sm:space-y-24 lg:space-y-32 xl:space-y-40"
};

export function ResponsiveLayout({ 
  children, 
  className,
  containerSize = "xl",
  padding = "md",
  spacing = "md"
}: ResponsiveLayoutProps) {
  return (
    <div className={cn(
      "w-full mx-auto",
      containerSizes[containerSize],
      paddingSizes[padding],
      spacingSizes[spacing],
      className
    )}>
      {children}
    </div>
  );
}

// Component variants for common layouts
export function ResponsiveSection({ 
  children, 
  className,
  background = "transparent",
  ...props 
}: ResponsiveLayoutProps & { background?: "transparent" | "muted" | "primary" }) {
  const backgroundClasses = {
    transparent: "",
    muted: "bg-muted/30",
    primary: "bg-primary/5"
  };

  return (
    <section className={cn(
      "relative py-16 sm:py-20 lg:py-24 xl:py-32",
      backgroundClasses[background],
      className
    )}>
      <ResponsiveLayout {...props}>
        {children}
      </ResponsiveLayout>
    </section>
  );
}

export function ResponsiveGrid({ 
  children,
  columns = "auto",
  gap = "md",
  className
}: {
  children: ReactNode;
  columns?: "1" | "2" | "3" | "4" | "auto";
  gap?: "sm" | "md" | "lg";
  className?: string;
}) {
  const columnClasses = {
    "1": "grid-cols-1",
    "2": "grid-cols-1 sm:grid-cols-2",
    "3": "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    "4": "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
    "auto": "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
  };

  const gapClasses = {
    sm: "gap-4 sm:gap-6",
    md: "gap-6 sm:gap-8 lg:gap-10",
    lg: "gap-8 sm:gap-10 lg:gap-12"
  };

  return (
    <div className={cn(
      "grid",
      columnClasses[columns],
      gapClasses[gap],
      className
    )}>
      {children}
    </div>
  );
}

export function ResponsiveCard({ 
  children,
  className,
  size = "md",
  hover = true
}: {
  children: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
  hover?: boolean;
}) {
  const sizeClasses = {
    sm: "p-4 sm:p-6 rounded-lg sm:rounded-xl",
    md: "p-6 sm:p-8 lg:p-10 rounded-xl sm:rounded-2xl",
    lg: "p-8 sm:p-10 lg:p-12 rounded-2xl sm:rounded-3xl"
  };

  const hoverClasses = hover 
    ? "transition-all duration-300 hover:shadow-lg hover:scale-105" 
    : "";

  return (
    <div className={cn(
      "bg-card border border-border shadow-sm",
      sizeClasses[size],
      hoverClasses,
      className
    )}>
      {children}
    </div>
  );
}

export function ResponsiveFlex({ 
  children,
  direction = "col-sm-row",
  align = "start",
  justify = "start",
  gap = "md",
  className
}: {
  children: ReactNode;
  direction?: "row" | "col" | "col-sm-row" | "row-sm-col";
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "end" | "between" | "around";
  gap?: "sm" | "md" | "lg";
  className?: string;
}) {
  const directionClasses = {
    row: "flex-row",
    col: "flex-col",
    "col-sm-row": "flex-col sm:flex-row",
    "row-sm-col": "flex-row sm:flex-col"
  };

  const alignClasses = {
    start: "items-start",
    center: "items-center", 
    end: "items-end",
    stretch: "items-stretch"
  };

  const justifyClasses = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
    between: "justify-between",
    around: "justify-around"
  };

  const gapClasses = {
    sm: "gap-4 sm:gap-6",
    md: "gap-6 sm:gap-8 lg:gap-10",
    lg: "gap-8 sm:gap-10 lg:gap-12"
  };

  return (
    <div className={cn(
      "flex",
      directionClasses[direction],
      alignClasses[align],
      justifyClasses[justify],
      gapClasses[gap],
      className
    )}>
      {children}
    </div>
  );
}

export function ResponsiveText({ 
  children,
  as: Component = "p",
  size = "base",
  weight = "normal",
  color = "foreground",
  align = "right",
  className
}: {
  children: ReactNode;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";
  size?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl";
  weight?: "normal" | "medium" | "semibold" | "bold";
  color?: "foreground" | "muted" | "primary" | "secondary" | "accent";
  align?: "right" | "center" | "left";
  className?: string;
}) {
  const sizeClasses = {
    xs: "text-xs sm:text-sm",
    sm: "text-sm sm:text-base", 
    base: "text-base sm:text-lg",
    lg: "text-lg sm:text-xl lg:text-2xl",
    xl: "text-xl sm:text-2xl lg:text-3xl",
    "2xl": "text-2xl sm:text-3xl lg:text-4xl xl:text-5xl",
    "3xl": "text-3xl sm:text-4xl lg:text-5xl xl:text-6xl",
    "4xl": "text-4xl sm:text-5xl lg:text-6xl xl:text-7xl",
    "5xl": "text-5xl sm:text-6xl lg:text-7xl xl:text-8xl",
    "6xl": "text-6xl sm:text-7xl lg:text-8xl xl:text-9xl"
  };

  const weightClasses = {
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold", 
    bold: "font-bold"
  };

  const colorClasses = {
    foreground: "text-foreground",
    muted: "text-muted-foreground",
    primary: "text-primary",
    secondary: "text-secondary",
    accent: "text-accent"
  };

  const alignClasses = {
    right: "text-right",
    center: "text-center",
    left: "text-left"
  };

  return (
    <Component className={cn(
      sizeClasses[size],
      weightClasses[weight],
      colorClasses[color],
      alignClasses[align],
      "leading-relaxed",
      className
    )}>
      {children}
    </Component>
  );
}