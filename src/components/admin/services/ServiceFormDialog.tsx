/**
 * ServiceFormDialog - Dark Theme Form Dialog
 * Premium form for adding/editing services
 */

import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package,
  X,
  Save,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ServiceFormData {
  name: string;
  name_ar: string;
  description: string;
  description_ar: string;
  short_description: string;
  short_description_ar: string;
  price: string;
  currency: string;
  include_vat: boolean;
  category: string;
  icon: string;
  image_url: string;
  is_active: boolean;
  is_visible_to_customers: boolean;
  sort_order: string;
}

interface ServiceFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: ServiceFormData;
  onFormDataChange: (data: ServiceFormData) => void;
  onSubmit: () => void;
  isEditing: boolean;
  isSaving: boolean;
  categories: { value: string; label: string; labelEn: string }[];
}

export function ServiceFormDialog({
  open,
  onOpenChange,
  formData,
  onFormDataChange,
  onSubmit,
  isEditing,
  isSaving,
  categories,
}: ServiceFormDialogProps) {
  const updateField = <K extends keyof ServiceFormData>(
    field: K,
    value: ServiceFormData[K]
  ) => {
    onFormDataChange({ ...formData, [field]: value });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0 gap-0 bg-[#0a0e1a] border-slate-800 overflow-hidden">
        {/* Header */}
        <DialogHeader className="p-6 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600">
              <Package className="h-5 w-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-xl text-white">
                {isEditing ? 'تعديل الخدمة' : 'إضافة خدمة جديدة'}
              </DialogTitle>
              <DialogDescription className="text-slate-400">
                {isEditing ? 'قم بتعديل بيانات الخدمة' : 'أدخل بيانات الخدمة الجديدة'}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Form Content */}
        <ScrollArea className="max-h-[60vh]">
          <div className="p-6 space-y-6">
            {/* Names Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <span className="w-1 h-4 bg-blue-500 rounded-full" />
                المعلومات الأساسية
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-slate-300">الاسم (English) *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    placeholder="Service Name"
                    dir="ltr"
                    className="bg-[#0f1629] border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name_ar" className="text-slate-300">الاسم (عربي) *</Label>
                  <Input
                    id="name_ar"
                    value={formData.name_ar}
                    onChange={(e) => updateField('name_ar', e.target.value)}
                    placeholder="اسم الخدمة"
                    className="bg-[#0f1629] border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Descriptions Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <span className="w-1 h-4 bg-purple-500 rounded-full" />
                الوصف
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-slate-300">الوصف (English)</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => updateField('description', e.target.value)}
                    placeholder="Service description"
                    dir="ltr"
                    rows={3}
                    className="bg-[#0f1629] border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 resize-none"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description_ar" className="text-slate-300">الوصف (عربي)</Label>
                  <Textarea
                    id="description_ar"
                    value={formData.description_ar}
                    onChange={(e) => updateField('description_ar', e.target.value)}
                    placeholder="وصف الخدمة"
                    rows={3}
                    className="bg-[#0f1629] border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <span className="w-1 h-4 bg-emerald-500 rounded-full" />
                التسعير والتصنيف
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-slate-300">السعر</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => updateField('price', e.target.value)}
                    placeholder="0.00"
                    dir="ltr"
                    className="bg-[#0f1629] border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency" className="text-slate-300">العملة</Label>
                  <Select value={formData.currency} onValueChange={(v) => updateField('currency', v)}>
                    <SelectTrigger className="bg-[#0f1629] border-slate-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0f1629] border-slate-700">
                      <SelectItem value="SAR" className="text-white hover:bg-slate-800">ريال سعودي</SelectItem>
                      <SelectItem value="USD" className="text-white hover:bg-slate-800">دولار أمريكي</SelectItem>
                      <SelectItem value="EUR" className="text-white hover:bg-slate-800">يورو</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-slate-300">التصنيف</Label>
                  <Select value={formData.category} onValueChange={(v) => updateField('category', v)}>
                    <SelectTrigger className="bg-[#0f1629] border-slate-700 text-white">
                      <SelectValue placeholder="اختر التصنيف" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0f1629] border-slate-700">
                      {categories.map(cat => (
                        <SelectItem key={cat.value} value={cat.value} className="text-white hover:bg-slate-800">
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Media Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <span className="w-1 h-4 bg-amber-500 rounded-full" />
                الصور والعرض
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="image_url" className="text-slate-300">رابط الصورة</Label>
                  <Input
                    id="image_url"
                    value={formData.image_url}
                    onChange={(e) => updateField('image_url', e.target.value)}
                    placeholder="https://..."
                    dir="ltr"
                    className="bg-[#0f1629] border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sort_order" className="text-slate-300">ترتيب العرض</Label>
                  <Input
                    id="sort_order"
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => updateField('sort_order', e.target.value)}
                    placeholder="0"
                    dir="ltr"
                    className="bg-[#0f1629] border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Toggles Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <span className="w-1 h-4 bg-cyan-500 rounded-full" />
                الإعدادات
              </h3>
              <div className="space-y-3">
                <div className={cn(
                  "flex items-center justify-between p-4 rounded-xl",
                  "bg-slate-800/50 border border-slate-700"
                )}>
                  <div>
                    <Label htmlFor="is_active" className="text-white cursor-pointer">
                      الخدمة نشطة
                    </Label>
                    <p className="text-xs text-slate-400 mt-0.5">تفعيل أو إيقاف الخدمة</p>
                  </div>
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => updateField('is_active', checked)}
                    className="data-[state=checked]:bg-emerald-500"
                  />
                </div>

                <div className={cn(
                  "flex items-center justify-between p-4 rounded-xl",
                  "bg-slate-800/50 border border-slate-700"
                )}>
                  <div>
                    <Label htmlFor="is_visible" className="text-white cursor-pointer">
                      مرئية للعملاء
                    </Label>
                    <p className="text-xs text-slate-400 mt-0.5">إظهار الخدمة في بوابة العملاء</p>
                  </div>
                  <Switch
                    id="is_visible"
                    checked={formData.is_visible_to_customers}
                    onCheckedChange={(checked) => updateField('is_visible_to_customers', checked)}
                    className="data-[state=checked]:bg-blue-500"
                  />
                </div>

                <div className={cn(
                  "flex items-center justify-between p-4 rounded-xl",
                  "bg-slate-800/50 border border-slate-700"
                )}>
                  <div>
                    <Label htmlFor="include_vat" className="text-white cursor-pointer">
                      شامل ضريبة القيمة المضافة
                    </Label>
                    <p className="text-xs text-slate-400 mt-0.5">السعر يشمل VAT 15%</p>
                  </div>
                  <Switch
                    id="include_vat"
                    checked={formData.include_vat}
                    onCheckedChange={(checked) => updateField('include_vat', checked)}
                    className="data-[state=checked]:bg-amber-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Footer */}
        <DialogFooter className="p-6 pt-4 border-t border-slate-800">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="bg-transparent border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            إلغاء
          </Button>
          <Button
            onClick={onSubmit}
            disabled={isSaving || !formData.name || !formData.name_ar}
            className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                جاري الحفظ...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                {isEditing ? 'حفظ التغييرات' : 'إضافة الخدمة'}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
