/**
 * BidiNumber - RTL-safe numeric display component
 * 
 * Numbers, IDs, and technical values must always render LTR
 * even when embedded in RTL context. This component handles:
 * - Order/Contract/Invoice numbers
 * - Phone numbers
 * - IBANs
 * - Emails
 * - Transaction IDs
 * - Currency amounts
 * - Any alphanumeric reference
 */

import { cn } from "@/lib/utils";
import { forwardRef } from "react";

export interface BidiNumberProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** The value to display (number, string, or mixed) */
  value: string | number | null | undefined;
  /** Whether to use monospace font (default: true) */
  mono?: boolean;
  /** Whether to use tabular numbers for alignment (default: true) */
  tabular?: boolean;
  /** Visual variant */
  variant?: "default" | "muted" | "code" | "badge";
  /** Optional prefix (e.g., "SAR", "#", "$") - rendered before value */
  prefix?: string;
  /** Optional suffix (e.g., "ر.س", "%") - rendered after value */
  suffix?: string;
}

/**
 * Renders a value in LTR direction regardless of parent RTL context.
 * Essential for maintaining readability of IDs, numbers, and technical values.
 * 
 * @example
 * // Contract number
 * <BidiNumber value="CTR-2026-0001" />
 * 
 * // Currency
 * <BidiNumber value="1,500.00" suffix="ر.س" />
 * 
 * // Phone
 * <BidiNumber value="+966 50 123 4567" mono={false} />
 * 
 * // Code reference
 * <BidiNumber value="INV-2026-001234" variant="code" />
 */
export const BidiNumber = forwardRef<HTMLSpanElement, BidiNumberProps>(
  ({ 
    value, 
    mono = true, 
    tabular = true, 
    variant = "default",
    prefix,
    suffix,
    className, 
    ...props 
  }, ref) => {
    // Handle null/undefined gracefully
    if (value === null || value === undefined || value === "") {
      return (
        <span 
          ref={ref}
          className={cn("text-muted-foreground", className)} 
          {...props}
        >
          —
        </span>
      );
    }

    const variantStyles = {
      default: "",
      muted: "text-muted-foreground",
      code: "bg-muted/50 px-1.5 py-0.5 rounded text-xs",
      badge: "bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs font-medium",
    };

    return (
      <span
        ref={ref}
        dir="ltr"
        className={cn(
          // Force LTR with Unicode isolation
          "inline-flex items-center",
          "unicode-bidi-isolate",
          // Font styles
          mono && "font-mono",
          tabular && "tabular-nums",
          // Variant styles
          variantStyles[variant],
          className
        )}
        style={{ 
          direction: "ltr", 
          unicodeBidi: "isolate",
          textAlign: "inherit" // Let parent control alignment
        }}
        {...props}
      >
        {prefix && <span className="me-1 text-muted-foreground">{prefix}</span>}
        {String(value)}
        {suffix && <span className="ms-1 text-muted-foreground">{suffix}</span>}
      </span>
    );
  }
);

BidiNumber.displayName = "BidiNumber";

/**
 * Specialized component for currency display
 */
export interface BidiCurrencyProps extends Omit<BidiNumberProps, "value"> {
  amount: number | string | null | undefined;
  currency?: "SAR" | "USD" | "EUR" | string;
  locale?: string;
  showSign?: boolean;
}

export const BidiCurrency = forwardRef<HTMLSpanElement, BidiCurrencyProps>(
  ({ 
    amount, 
    currency = "SAR", 
    locale = "ar-SA",
    showSign = false,
    className,
    ...props 
  }, ref) => {
    if (amount === null || amount === undefined) {
      return <BidiNumber ref={ref} value={null} className={className} {...props} />;
    }

    const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
    
    // Format the number with proper locale
    const formatted = new Intl.NumberFormat(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Math.abs(numAmount));

    // Currency symbol/suffix based on currency
    const currencyDisplay = {
      SAR: "ر.س",
      USD: "$",
      EUR: "€",
    }[currency] || currency;

    const sign = showSign && numAmount !== 0 
      ? (numAmount > 0 ? "+" : "-") 
      : (numAmount < 0 ? "-" : "");

    return (
      <BidiNumber
        ref={ref}
        value={formatted}
        prefix={sign || undefined}
        suffix={currencyDisplay}
        className={cn(
          numAmount < 0 && "text-destructive",
          numAmount > 0 && showSign && "text-success",
          className
        )}
        {...props}
      />
    );
  }
);

BidiCurrency.displayName = "BidiCurrency";

/**
 * Specialized component for phone numbers
 */
export const BidiPhone = forwardRef<HTMLSpanElement, Omit<BidiNumberProps, "value"> & { phone: string | null | undefined }>(
  ({ phone, className, ...props }, ref) => (
    <BidiNumber
      ref={ref}
      value={phone}
      mono={false}
      tabular={false}
      className={cn("tracking-wide", className)}
      {...props}
    />
  )
);

BidiPhone.displayName = "BidiPhone";

/**
 * Specialized component for emails
 */
export const BidiEmail = forwardRef<HTMLSpanElement, Omit<BidiNumberProps, "value"> & { email: string | null | undefined }>(
  ({ email, className, ...props }, ref) => (
    <BidiNumber
      ref={ref}
      value={email}
      mono={false}
      tabular={false}
      className={cn("lowercase", className)}
      {...props}
    />
  )
);

BidiEmail.displayName = "BidiEmail";

export default BidiNumber;
