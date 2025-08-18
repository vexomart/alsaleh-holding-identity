import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const clientFormSchema = z.object({
  legal_name: z.string().min(2, "الاسم التجاري مطلوب"),
  display_name: z.string().optional(),
  tax_number: z.string().optional(),
  commercial_register: z.string().optional(),
  sector: z.enum(["government", "private", "semi_government"]),
  status: z.enum(["prospect", "active", "inactive", "blocked"]).default("prospect"),
  billing_email: z.string().email("بريد إلكتروني صحيح مطلوب"),
  phone: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  country: z.string().default("SA"),
  city: z.string().optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
});

type ClientFormValues = z.infer<typeof clientFormSchema>;

interface ClientFormProps {
  onSuccess: () => void;
  initialData?: Partial<ClientFormValues>;
}

export function ClientForm({ onSuccess, initialData }: ClientFormProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      legal_name: "",
      display_name: "",
      tax_number: "",
      commercial_register: "",
      sector: "private",
      status: "prospect",
      billing_email: "",
      phone: "",
      website: "",
      country: "SA",
      city: "",
      address: "",
      notes: "",
      ...initialData,
    },
  });

  const onSubmit = async (values: ClientFormValues) => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("يجب تسجيل الدخول أولاً");
        return;
      }

      const clientData = {
        ...values,
        created_by: user.id,
        website: values.website || null,
      };

      const { error } = await supabase
        .from('clients')
        .insert(clientData);

      if (error) throw error;

      toast.success("تم إضافة العميل بنجاح");
      onSuccess();
    } catch (error: any) {
      console.error('Error adding client:', error);
      toast.error("حدث خطأ أثناء إضافة العميل");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="legal_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>الاسم التجاري *</FormLabel>
                <FormControl>
                  <Input placeholder="اسم الشركة الرسمي" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="display_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>الاسم المختصر</FormLabel>
                <FormControl>
                  <Input placeholder="الاسم التجاري المختصر" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tax_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>الرقم الضريبي</FormLabel>
                <FormControl>
                  <Input placeholder="الرقم الضريبي للشركة" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="commercial_register"
            render={({ field }) => (
              <FormItem>
                <FormLabel>السجل التجاري</FormLabel>
                <FormControl>
                  <Input placeholder="رقم السجل التجاري" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sector"
            render={({ field }) => (
              <FormItem>
                <FormLabel>القطاع *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر القطاع" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="government">حكومي</SelectItem>
                    <SelectItem value="private">خاص</SelectItem>
                    <SelectItem value="semi_government">شبه حكومي</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>الحالة *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الحالة" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="prospect">عميل محتمل</SelectItem>
                    <SelectItem value="active">نشط</SelectItem>
                    <SelectItem value="inactive">غير نشط</SelectItem>
                    <SelectItem value="blocked">محظور</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="billing_email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>البريد الإلكتروني للفوترة *</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="email@company.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>رقم الهاتف</FormLabel>
                <FormControl>
                  <Input placeholder="+966 50 123 4567" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>الموقع الإلكتروني</FormLabel>
                <FormControl>
                  <Input placeholder="https://company.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>المدينة</FormLabel>
                <FormControl>
                  <Input placeholder="الرياض" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>العنوان</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="العنوان التفصيلي للشركة"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ملاحظات</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="ملاحظات إضافية عن العميل"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button type="submit" disabled={loading}>
            {loading ? "جاري الحفظ..." : "حفظ العميل"}
          </Button>
        </div>
      </form>
    </Form>
  );
}