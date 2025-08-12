import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Copy, X } from 'lucide-react';
import { toast } from 'sonner';

interface STCPayModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    merchant_number: string;
    amount: string;
    currency: string;
    reference: string;
    instructions_ar: string;
    instructions_en: string;
  };
}

export const STCPayModal: React.FC<STCPayModalProps> = ({ isOpen, onClose, data }) => {
  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`تم نسخ ${label} بنجاح`);
    } catch (error) {
      console.error('Failed to copy:', error);
      toast.error('فشل في النسخ');
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4"
      onClick={onClose}
    >
      <Card 
        className="w-full max-w-sm sm:max-w-md lg:max-w-lg max-h-[95vh] sm:max-h-[90vh] overflow-hidden animate-scale-in"
        dir="rtl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-l from-orange-500 to-orange-600 text-white p-4 sm:p-6 text-center">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </Button>
            <div className="flex-1">
              <div className="text-xl sm:text-2xl font-bold">STC Pay</div>
              <div className="text-orange-100 text-sm mt-1">تعليمات الدفع</div>
            </div>
            <div className="w-8"></div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-4 overflow-y-auto max-h-[calc(95vh-200px)]">
          {/* Merchant Number */}
          <div className="text-center">
            <div className="text-sm sm:text-base text-gray-600 mb-2">رقم التاجر</div>
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-orange-600 bg-orange-50 rounded-lg py-2 sm:py-3 px-2 sm:px-4 border break-all font-mono">
              {data.merchant_number}
            </div>
            <Button
              onClick={() => copyToClipboard(data.merchant_number, 'رقم التاجر')}
              className="mt-2 sm:mt-3 bg-orange-100 hover:bg-orange-200 text-orange-800 text-xs sm:text-sm"
              variant="outline"
              size="sm"
            >
              <Copy className="h-3 w-3 mr-1" />
              نسخ رقم التاجر
            </Button>
          </div>

          {/* Amount */}
          <div className="text-center">
            <div className="text-sm sm:text-base text-gray-600 mb-2">المبلغ</div>
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600">
              {data.amount} {data.currency}
            </div>
          </div>

          {/* Reference */}
          <div className="text-center">
            <div className="text-sm sm:text-base text-gray-600 mb-2">رقم المرجع</div>
            <div className="text-sm sm:text-base lg:text-lg font-bold text-gray-800 font-mono bg-gray-50 rounded-lg py-2 sm:py-3 px-2 sm:px-4 border break-all">
              {data.reference}
            </div>
            <Button
              onClick={() => copyToClipboard(data.reference, 'رقم المرجع')}
              className="mt-2 sm:mt-3 bg-orange-100 hover:bg-orange-200 text-orange-800 text-xs sm:text-sm"
              variant="outline"
              size="sm"
            >
              <Copy className="h-3 w-3 mr-1" />
              نسخ المرجع
            </Button>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 rounded-lg p-3 sm:p-4">
            <div className="text-sm sm:text-base text-blue-800 whitespace-pre-line">
              {data.instructions_ar}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 border-t bg-gray-50 flex flex-col sm:flex-row gap-2 sm:gap-3">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 order-2 sm:order-1"
          >
            إغلاق
          </Button>
          <Button
            onClick={() => copyToClipboard(data.merchant_number, 'رقم التاجر')}
            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 order-1 sm:order-2"
          >
            <Copy className="h-4 w-4 mr-2" />
            نسخ الرقم
          </Button>
        </div>
      </Card>
    </div>
  );
};