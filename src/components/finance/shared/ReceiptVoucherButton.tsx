/**
 * Receipt Voucher Button Component
 * زر سند القبض
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText, Download, Eye, Printer, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import type { ReceiptVoucherData } from "@/lib/finance/receipt-voucher/types";

interface ReceiptVoucherButtonProps {
  voucherData: ReceiptVoucherData;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  iconOnly?: boolean;
}

export function ReceiptVoucherButton({
  voucherData,
  variant = "ghost",
  size = "sm",
  className,
  iconOnly = false,
}: ReceiptVoucherButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handlePreview = async () => {
    setIsLoading(true);
    try {
      const module = await import("@/lib/finance/receipt-voucher");
      module.previewReceipt(voucherData);
      toast.success("تم فتح سند القبض");
    } catch (error) {
      toast.error("حدث خطأ أثناء فتح سند القبض");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    setIsLoading(true);
    try {
      const module = await import("@/lib/finance/receipt-voucher");
      module.downloadReceipt(voucherData);
      toast.success("تم تحميل سند القبض");
    } catch (error) {
      toast.error("حدث خطأ أثناء تحميل سند القبض");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = async () => {
    setIsLoading(true);
    try {
      const module = await import("@/lib/finance/receipt-voucher");
      module.printReceipt(voucherData);
    } catch (error) {
      toast.error("حدث خطأ أثناء طباعة سند القبض");
    } finally {
      setIsLoading(false);
    }
  };

  if (iconOnly) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant={variant} 
            size="icon" 
            className={className} 
            disabled={isLoading}
            title="سند القبض"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <FileText className="h-4 w-4 text-blue-600" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem onClick={handlePreview} className="gap-2 cursor-pointer">
            <Eye className="h-4 w-4" />
            معاينة
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDownload} className="gap-2 cursor-pointer">
            <Download className="h-4 w-4" />
            تحميل
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handlePrint} className="gap-2 cursor-pointer">
            <Printer className="h-4 w-4" />
            طباعة
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className={className} disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin ml-2" />
          ) : (
            <FileText className="h-4 w-4 ml-2 text-blue-600" />
          )}
          سند القبض
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem onClick={handlePreview} className="gap-2 cursor-pointer">
          <Eye className="h-4 w-4" />
          معاينة
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDownload} className="gap-2 cursor-pointer">
          <Download className="h-4 w-4" />
          تحميل
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handlePrint} className="gap-2 cursor-pointer">
          <Printer className="h-4 w-4" />
          طباعة
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ReceiptVoucherButton;
