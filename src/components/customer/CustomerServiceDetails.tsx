/**
 * Service Details Page
 * Individual service page with request form and animations
 */

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { type Service } from "@/lib/api/services";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Clock,
  FileText,
  Loader2,
  Package,
  Send,
  Sparkles,
  Star,
  User,
  Phone,
  Mail,
  MessageSquare,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Form schema
const requestFormSchema = z.object({
  fullName: z.string().min(3, "الاسم يجب أن يكون 3 أحرف على الأقل"),
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  phone: z.string().min(9, "رقم الجوال غير صحيح"),
  description: z.string().min(10, "يرجى وصف متطلباتك بشكل أفضل (10 أحرف على الأقل)"),
});

type RequestFormData = z.infer<typeof requestFormSchema>;

export function CustomerServiceDetails() {
  const { serviceId } = useParams<{ serviceId: string }>();
  const { language } = useLanguage();
  const isRTL = language === "ar";
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  const [service, setService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const BackIcon = isRTL ? ArrowRight : ArrowLeft;

  const form = useForm<RequestFormData>({
    resolver: zodResolver(requestFormSchema),
    defaultValues: {
      fullName: profile?.full_name || "",
      email: profile?.email || "",
      phone: profile?.phone || "",
      description: "",
    },
  });

  // Update form when profile loads
  useEffect(() => {
    if (profile) {
      form.setValue("fullName", profile.full_name || "");
      form.setValue("email", profile.email || "");
      form.setValue("phone", profile.phone || "");
    }
  }, [profile, form]);

  // Fetch service details
  useEffect(() => {
    const fetchService = async () => {
      if (!serviceId) return;

      try {
        const { data, error } = await supabase
          .from("services")
          .select("*")
          .eq("id", serviceId)
          .single();

        if (error) throw error;
        setService(data as unknown as Service);
      } catch (error) {
        console.error("Error fetching service:", error);
        toast({
          title: isRTL ? "خطأ في تحميل الخدمة" : "Error loading service",
          variant: "destructive",
        });
        navigate("/app/services");
      } finally {
        setIsLoading(false);
      }
    };

    fetchService();
  }, [serviceId, isRTL, navigate]);

  // Generate unique order number
  const generateOrderNumber = () => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `ORD-${timestamp}-${random}`;
  };

  // Submit order
  const onSubmit = async (data: RequestFormData) => {
    if (!user || !service) return;

    setIsSubmitting(true);

    try {
      const orderNumber = generateOrderNumber();
      
      const { error } = await supabase.from("orders").insert({
        order_number: orderNumber,
        customer_id: user.id,
        service_id: service.id,
        title: service.name,
        title_ar: service.name_ar,
        description: data.description,
        status: "pending",
        metadata: {
          customer_name: data.fullName,
          customer_email: data.email,
          customer_phone: data.phone,
          service_name: service.name,
          service_name_ar: service.name_ar,
        },
      });

      if (error) throw error;

      toast({
        title: isRTL ? "تم إرسال طلبك بنجاح!" : "Your request has been submitted!",
        description: isRTL
          ? `رقم الطلب: ${orderNumber}`
          : `Order number: ${orderNumber}`,
      });

      // Navigate to orders page
      navigate("/app/orders");
    } catch (error) {
      console.error("Error submitting order:", error);
      toast({
        title: isRTL ? "خطأ في إرسال الطلب" : "Error submitting request",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-32" />
        <div className="grid lg:grid-cols-2 gap-6">
          <Skeleton className="h-96 rounded-2xl" />
          <Skeleton className="h-96 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="text-center py-16">
        <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
        <h3 className="text-lg font-semibold mb-2">
          {isRTL ? "الخدمة غير موجودة" : "Service not found"}
        </h3>
        <Button onClick={() => navigate("/app/services")}>
          {isRTL ? "العودة للخدمات" : "Back to Services"}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <BackIcon className="h-4 w-4" />
          {isRTL ? "العودة" : "Back"}
        </Button>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Service Details Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          {/* Service Image */}
          <div className="relative rounded-2xl overflow-hidden aspect-video bg-gradient-to-br from-primary/20 to-primary/5">
            {service.image_url ? (
              <motion.img
                src={service.image_url}
                alt={service.name}
                className="w-full h-full object-cover"
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.6 }}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <Package className="h-20 w-20 text-primary/30" />
              </div>
            )}
            
            {/* Category Badge */}
            {service.category && (
              <Badge className="absolute top-4 start-4 bg-background/90 text-foreground">
                {service.category}
              </Badge>
            )}
          </div>

          {/* Service Info Card */}
          <Card className="border-2">
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                  {isRTL ? service.name_ar || service.name : service.name}
                </h1>
                <p className="text-muted-foreground leading-relaxed">
                  {isRTL
                    ? service.description_ar || service.description
                    : service.description}
                </p>
              </div>

              {/* Features */}
              <div className="pt-4 border-t space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <Star className="h-4 w-4 text-amber-500" />
                  {isRTL ? "مميزات الخدمة" : "Service Features"}
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: CheckCircle, textAr: "جودة عالية", textEn: "High Quality" },
                    { icon: Clock, textAr: "تسليم سريع", textEn: "Fast Delivery" },
                    { icon: FileText, textAr: "توثيق كامل", textEn: "Full Documentation" },
                    { icon: Sparkles, textAr: "دعم مستمر", textEn: "Ongoing Support" },
                  ].map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                      className="flex items-center gap-2 text-sm"
                    >
                      <feature.icon className="h-4 w-4 text-primary" />
                      <span className="text-foreground/80">
                        {isRTL ? feature.textAr : feature.textEn}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Request Form Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5 text-primary" />
                {isRTL ? "طلب الخدمة" : "Request Service"}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {isRTL
                  ? "املأ النموذج التالي وسنتواصل معك في أقرب وقت"
                  : "Fill out the form and we'll contact you soon"}
              </p>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  {/* Full Name */}
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          {isRTL ? "الاسم الكامل" : "Full Name"}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={isRTL ? "أدخل اسمك الكامل" : "Enter your full name"}
                            {...field}
                            className="bg-background"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Email */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          {isRTL ? "البريد الإلكتروني" : "Email"}
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder={isRTL ? "example@email.com" : "example@email.com"}
                            {...field}
                            className="bg-background"
                            dir="ltr"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Phone */}
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          {isRTL ? "رقم الجوال" : "Phone Number"}
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder={isRTL ? "05xxxxxxxx" : "05xxxxxxxx"}
                            {...field}
                            className="bg-background"
                            dir="ltr"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Description */}
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4" />
                          {isRTL ? "تفاصيل الطلب" : "Request Details"}
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={
                              isRTL
                                ? "اشرح لنا متطلباتك بالتفصيل..."
                                : "Describe your requirements in detail..."
                            }
                            rows={5}
                            {...field}
                            className="bg-background resize-none"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Submit Button */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="submit"
                      className="w-full h-12 text-base gap-2"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          {isRTL ? "جاري الإرسال..." : "Submitting..."}
                        </>
                      ) : (
                        <>
                          <Send className="h-5 w-5" />
                          {isRTL ? "إرسال الطلب" : "Submit Request"}
                        </>
                      )}
                    </Button>
                  </motion.div>

                  {/* Info Note */}
                  <p className="text-xs text-center text-muted-foreground">
                    {isRTL
                      ? "بإرسال هذا النموذج، فإنك توافق على شروط الخدمة"
                      : "By submitting this form, you agree to our terms of service"}
                  </p>
                </form>
              </Form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
