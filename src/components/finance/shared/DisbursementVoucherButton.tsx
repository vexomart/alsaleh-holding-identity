/**
 * Disbursement Voucher Button Component
 * زر سند الصرف
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Receipt, Download, Eye, Printer, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import type { DisbursementVoucherData } from "@/lib/finance/disbursement-voucher/types";

interface DisbursementVoucherButtonProps {
  voucherData: DisbursementVoucherData;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export function DisbursementVoucherButton({
  voucherData,
  variant = "outline",
  size = "default",
  className,
}: DisbursementVoucherButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handlePreview = async () => {
    setIsLoading(true);
    try {
      const module = await import("@/lib/finance/disbursement-voucher");
      module.previewVoucher(voucherData);
      toast.success("تم فتح سند الصرف");
    } catch (error) {
      toast.error("حدث خطأ أثناء فتح سند الصرف");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    setIsLoading(true);
    try {
      const module = await import("@/lib/finance/disbursement-voucher");
      module.downloadVoucher(voucherData);
      toast.success("تم تحميل سند الصرف");
    } catch (error) {
      toast.error("حدث خطأ أثناء تحميل سند الصرف");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = async () => {
    setIsLoading(true);
    try {
      const module = await import("@/lib/finance/disbursement-voucher");
      module.printVoucher(voucherData);
    } catch (error) {
      toast.error("حدث خطأ أثناء طباعة سند الصرف");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className={className} disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin ml-2" />
          ) : (
            <Receipt className="h-4 w-4 ml-2" />
          )}
          سند الصرف
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
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

export default DisbursementVoucherButton;
