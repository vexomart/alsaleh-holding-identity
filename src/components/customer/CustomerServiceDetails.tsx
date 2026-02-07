/**
 * Service Details Page - Premium Edition
 * Individual service page with request form and contract pre-approval flow
 */

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { type Service } from "@/lib/api/services";
import { useServiceContract, createPreApprovedContract } from "@/hooks/useContracts";
import { ContractPreviewStep } from "./ContractPreviewStep";
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
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Clock,
  FileText,
  Loader2,
  Package,
  Send,
  Star,
  User,
  Phone,
  Mail,
  MessageSquare,
  Shield,
  Award,
  HeartHandshake,
  Rocket,
  Code2,
  Settings,
  Lock,
  RefreshCw,
  Headphones,
  FileSignature,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Form schema
const requestFormSchema = z.object({
  fullName: z.string().min(3, "الاسم يجب أن يكون 3 أحرف على الأقل"),
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  phone: z.string().min(9, "رقم الجوال غير صحيح"),
  projectType: z.string().optional(),
  budget: z.string().optional(),
  timeline: z.string().optional(),
  description: z.string().min(10, "يرجى وصف متطلباتك بشكل أفضل (10 أحرف على الأقل)"),
});

type RequestFormData = z.infer<typeof requestFormSchema>;

// Flow steps
type FlowStep = 'form' | 'contract_preview';

// Service-specific content mapping
const serviceContentMap: Record<string, {
  highlights: { icon: React.ElementType; textAr: string; textEn: string }[];
  benefits: { titleAr: string; titleEn: string; descAr: string; descEn: string }[];
  processSteps: { titleAr: string; titleEn: string }[];
}> = {
  default: {
    highlights: [
      { icon: CheckCircle, textAr: "جودة عالية مضمونة", textEn: "Guaranteed High Quality" },
      { icon: Clock, textAr: "تسليم في الوقت المحدد", textEn: "On-Time Delivery" },
      { icon: Shield, textAr: "حماية وأمان كامل", textEn: "Complete Security" },
      { icon: HeartHandshake, textAr: "دعم فني متواصل", textEn: "Continuous Support" },
    ],
    benefits: [
      { titleAr: "تقنيات حديثة", titleEn: "Modern Technologies", descAr: "نستخدم أحدث التقنيات والأدوات", descEn: "We use the latest technologies and tools" },
      { titleAr: "فريق خبير", titleEn: "Expert Team", descAr: "فريق من المطورين المحترفين", descEn: "Team of professional developers" },
      { titleAr: "أسعار تنافسية", titleEn: "Competitive Pricing", descAr: "أفضل قيمة مقابل المال", descEn: "Best value for money" },
    ],
    processSteps: [
      { titleAr: "تحليل المتطلبات", titleEn: "Requirements Analysis" },
      { titleAr: "التصميم والتخطيط", titleEn: "Design & Planning" },
      { titleAr: "التطوير والتنفيذ", titleEn: "Development" },
      { titleAr: "الاختبار والتسليم", titleEn: "Testing & Delivery" },
    ],
  },
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

const scaleVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

export function CustomerServiceDetails() {
  const { serviceId } = useParams<{ serviceId: string }>();
  const { language } = useLanguage();
  const isRTL = language === "ar";
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  const [service, setService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState<FlowStep>('form');
  const [pendingFormData, setPendingFormData] = useState<RequestFormData | null>(null);

  // Check if service requires contract
  const { requiresContract, template, isLoading: isLoadingContract } = useServiceContract(serviceId);

  const BackIcon = isRTL ? ArrowRight : ArrowLeft;

  const form = useForm<RequestFormData>({
    resolver: zodResolver(requestFormSchema),
    defaultValues: {
      fullName: profile?.full_name || "",
      email: profile?.email || "",
      phone: profile?.phone || "",
      projectType: "",
      budget: "",
      timeline: "",
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
        navigate("/portal/services");
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

  // Handle form submission - check if contract is required
  const onFormSubmit = async (data: RequestFormData) => {
    if (!user || !service) return;

    // If service requires contract, show preview first
    if (requiresContract && template) {
      setPendingFormData(data);
      setCurrentStep('contract_preview');
      return;
    }

    // Otherwise, submit directly
    await submitOrder(data);
  };

  // Submit order with optional contract pre-approval
  const submitOrder = async (data: RequestFormData, withContract: boolean = false) => {
    if (!user || !service) return;

    setIsSubmitting(true);

    try {
      const orderNumber = generateOrderNumber();
      
      // Create order
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert({
          order_number: orderNumber,
          customer_id: user.id,
          service_id: service.id,
          title: service.name,
          title_ar: service.name_ar,
          description: data.description,
          status: "pending",
          requires_contract: withContract,
          contract_pre_approved: withContract,
          metadata: {
            customer_name: data.fullName,
            customer_email: data.email,
            customer_phone: data.phone,
            project_type: data.projectType,
            budget: data.budget,
            timeline: data.timeline,
            service_name: service.name,
            service_name_ar: service.name_ar,
          },
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // If contract is required, create pre-approved contract
      if (withContract && requiresContract) {
        const { contractId, error: contractError } = await createPreApprovedContract(
          user.id,
          service.id,
          orderData.id
        );

        if (contractError) {
          console.error('Error creating contract:', contractError);
          // Don't fail the whole request, just log
          toast({
            title: isRTL ? "تم إرسال الطلب مع ملاحظة" : "Request submitted with note",
            description: isRTL 
              ? "تم إرسال طلبك ولكن حدث خطأ في إنشاء العقد المبدئي" 
              : "Your request was submitted but there was an error creating the preliminary contract",
          });
        } else {
          toast({
            title: isRTL ? "تم إرسال طلبك بنجاح! 🎉" : "Your request has been submitted! 🎉",
            description: isRTL
              ? `رقم الطلب: ${orderNumber} - تم إنشاء العقد المبدئي`
              : `Order number: ${orderNumber} - Preliminary contract created`,
          });
        }
      } else {
        toast({
          title: isRTL ? "تم إرسال طلبك بنجاح! 🎉" : "Your request has been submitted! 🎉",
          description: isRTL
            ? `رقم الطلب: ${orderNumber}`
            : `Order number: ${orderNumber}`,
        });
      }

      navigate("/portal/orders");
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

  // Handle contract acceptance
  const handleContractAccept = async () => {
    if (!pendingFormData) return;
    await submitOrder(pendingFormData, true);
  };

  // Handle back from contract preview
  const handleContractBack = () => {
    setCurrentStep('form');
    setPendingFormData(null);
  };

  const serviceContent = serviceContentMap.default;

  if (isLoading || isLoadingContract) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto px-4">
        <Skeleton className="h-10 w-32" />
        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 space-y-6">
            <Skeleton className="h-72 rounded-2xl" />
            <Skeleton className="h-48 rounded-2xl" />
          </div>
          <div className="lg:col-span-2">
            <Skeleton className="h-[600px] rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-16"
      >
        <Package className="h-20 w-20 mx-auto mb-4 text-muted-foreground/30" />
        <h3 className="text-xl font-semibold mb-4">
          {isRTL ? "الخدمة غير موجودة" : "Service not found"}
        </h3>
        <Button onClick={() => navigate("/portal/services")} size="lg">
          {isRTL ? "العودة للخدمات" : "Back to Services"}
        </Button>
      </motion.div>
    );
  }

  // Show contract preview step
  if (currentStep === 'contract_preview' && template) {
    return (
      <div className="max-w-4xl mx-auto">
        <ContractPreviewStep
          template={template}
          serviceName={service.name}
          serviceNameAr={service.name_ar}
          price={service.price}
          currency={service.currency || 'SAR'}
          onAccept={handleContractAccept}
          onBack={handleContractBack}
          isLoading={isSubmitting}
        />
      </div>
    );
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 max-w-7xl mx-auto"
    >
      {/* Back Button */}
      <motion.div variants={itemVariants}>
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="gap-2 text-muted-foreground hover:text-foreground group"
        >
          <BackIcon className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          {isRTL ? "العودة" : "Back"}
        </Button>
      </motion.div>

      <div className="grid lg:grid-cols-5 gap-6 lg:gap-8">
        {/* Service Details Section - Takes 3 columns */}
        <div className="lg:col-span-3 space-y-6">
          {/* Hero Image with Overlay */}
          <motion.div variants={scaleVariants} className="relative">
            <div className="relative rounded-3xl overflow-hidden aspect-[16/9] bg-gradient-to-br from-primary/20 via-primary/10 to-transparent shadow-xl">
              {service.image_url ? (
                <>
                  <motion.img
                    src={service.image_url}
                    alt={service.name}
                    className="w-full h-full object-cover"
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                </>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                  <Code2 className="h-24 w-24 text-primary/40" />
                </div>
              )}
              
              {/* Category Badge */}
              <div className="absolute top-4 start-4 flex items-center gap-2">
                <Badge className="bg-primary text-primary-foreground px-4 py-1.5 text-sm font-medium">
                  {isRTL ? "تطوير برمجي" : "Development"}
                </Badge>
                {requiresContract && (
                  <Badge variant="outline" className="bg-background/80 gap-1.5">
                    <FileSignature className="h-3.5 w-3.5" />
                    {isRTL ? "يتطلب عقد" : "Contract Required"}
                  </Badge>
                )}
              </div>

              {/* Service Title Overlay */}
              <div className="absolute bottom-0 start-0 end-0 p-6">
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground drop-shadow-lg"
                >
                  {isRTL ? service.name_ar || service.name : service.name}
                </motion.h1>
              </div>
            </div>
          </motion.div>

          {/* Service Description Card */}
          <motion.div variants={itemVariants}>
            <Card className="border-2 border-border/50 shadow-lg overflow-hidden">
              <CardContent className="p-6 space-y-6">
                {/* Description */}
                <div className="space-y-3">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    {isRTL ? "نبذة عن الخدمة" : "About This Service"}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed text-base">
                    {isRTL
                      ? service.description_ar || service.description || "نقدم لك خدمة احترافية متكاملة تلبي جميع احتياجاتك التقنية بأعلى معايير الجودة والأمان، مع فريق من الخبراء المتخصصين الجاهزين لتحويل رؤيتك إلى واقع."
                      : service.description || "We provide you with a comprehensive professional service that meets all your technical needs with the highest standards of quality and security, with a team of specialized experts ready to turn your vision into reality."}
                  </p>
                </div>

                {/* Key Highlights */}
                <div className="pt-4 border-t space-y-4">
                  <h3 className="font-semibold flex items-center gap-2 text-lg">
                    <Star className="h-5 w-5 text-amber-500" />
                    {isRTL ? "مميزات الخدمة" : "Service Highlights"}
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {serviceContent.highlights.map((highlight, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <div className="p-2 rounded-lg bg-primary/10">
                          <highlight.icon className="h-5 w-5 text-primary" />
                        </div>
                        <span className="text-sm font-medium text-foreground">
                          {isRTL ? highlight.textAr : highlight.textEn}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Process Steps */}
          <motion.div variants={itemVariants}>
            <Card className="border-2 border-border/50 shadow-lg overflow-hidden bg-gradient-to-br from-primary/5 to-transparent">
              <CardContent className="p-6">
                <h3 className="font-semibold flex items-center gap-2 text-lg mb-6">
                  <Rocket className="h-5 w-5 text-primary" />
                  {isRTL ? "مراحل التنفيذ" : "Our Process"}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {serviceContent.processSteps.map((step, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + index * 0.15 }}
                      className="relative text-center"
                    >
                      <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/30">
                        <span className="text-lg font-bold text-primary">{index + 1}</span>
                      </div>
                      <p className="text-sm font-medium text-foreground">
                        {isRTL ? step.titleAr : step.titleEn}
                      </p>
                      {index < serviceContent.processSteps.length - 1 && (
                        <div className="hidden md:block absolute top-6 start-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary/30 to-transparent" />
                      )}
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Benefits Grid */}
          <motion.div variants={itemVariants}>
            <Card className="border-2 border-border/50 shadow-lg">
              <CardContent className="p-6">
                <h3 className="font-semibold flex items-center gap-2 text-lg mb-6">
                  <Award className="h-5 w-5 text-primary" />
                  {isRTL ? "لماذا تختارنا؟" : "Why Choose Us?"}
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {serviceContent.benefits.map((benefit, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      className="p-4 rounded-xl bg-muted/50 border border-border/50 hover:border-primary/30 transition-all"
                    >
                      <h4 className="font-semibold text-foreground mb-2">
                        {isRTL ? benefit.titleAr : benefit.titleEn}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {isRTL ? benefit.descAr : benefit.descEn}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Request Form Section - Takes 2 columns */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <div className="sticky top-4">
            <Card className="border-2 border-primary/30 shadow-2xl bg-gradient-to-br from-card via-card to-primary/5 overflow-hidden">
              {/* Form Header */}
              <CardHeader className="pb-4 border-b border-border/50 bg-gradient-to-r from-primary/10 to-transparent">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 rounded-lg bg-primary/20">
                    <Send className="h-5 w-5 text-primary" />
                  </div>
                  {isRTL ? "طلب الخدمة" : "Request Service"}
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-2">
                  {requiresContract 
                    ? (isRTL ? "هذه الخدمة تتطلب موافقة مبدئية على العقد" : "This service requires preliminary contract approval")
                    : (isRTL ? "املأ النموذج وسيتواصل معك فريقنا خلال 24 ساعة" : "Fill out the form and our team will contact you within 24 hours")}
                </p>
                {requiresContract && (
                  <Badge variant="outline" className="w-fit mt-2 gap-1.5 bg-amber-50 text-amber-700 border-amber-200">
                    <FileSignature className="h-3.5 w-3.5" />
                    {isRTL ? "يتطلب عقد مبدئي" : "Requires Preliminary Contract"}
                  </Badge>
                )}
              </CardHeader>

              <CardContent className="p-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-5">
                    {/* Personal Info Section */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <User className="h-4 w-4" />
                        {isRTL ? "المعلومات الشخصية" : "Personal Information"}
                      </div>

                      {/* Full Name */}
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs text-muted-foreground">
                              {isRTL ? "الاسم الكامل" : "Full Name"}
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder={isRTL ? "أدخل اسمك الكامل" : "Enter your full name"}
                                {...field}
                                className="bg-background/50 border-border/50 focus:border-primary h-11"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Email & Phone Row */}
                      <div className="grid grid-cols-1 gap-4">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs text-muted-foreground flex items-center gap-1.5">
                                <Mail className="h-3.5 w-3.5" />
                                {isRTL ? "البريد الإلكتروني" : "Email"}
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="email"
                                  placeholder="example@email.com"
                                  {...field}
                                  className="bg-background/50 border-border/50 focus:border-primary h-11"
                                  dir="ltr"
                                />
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
                              <FormLabel className="text-xs text-muted-foreground flex items-center gap-1.5">
                                <Phone className="h-3.5 w-3.5" />
                                {isRTL ? "رقم الجوال" : "Phone Number"}
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="tel"
                                  placeholder="05xxxxxxxx"
                                  {...field}
                                  className="bg-background/50 border-border/50 focus:border-primary h-11"
                                  dir="ltr"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* Project Details Section */}
                    <div className="space-y-4 pt-4 border-t border-border/50">
                      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <Settings className="h-4 w-4" />
                        {isRTL ? "تفاصيل المشروع" : "Project Details"}
                      </div>

                      {/* Project Type */}
                      <FormField
                        control={form.control}
                        name="projectType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs text-muted-foreground">
                              {isRTL ? "نوع المشروع" : "Project Type"}
                            </FormLabel>
                            <FormControl>
                              <select
                                {...field}
                                className="flex h-11 w-full rounded-md border border-border/50 bg-background/50 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                              >
                                <option value="">{isRTL ? "اختر نوع المشروع" : "Select project type"}</option>
                                <option value="new">{isRTL ? "مشروع جديد" : "New Project"}</option>
                                <option value="update">{isRTL ? "تطوير مشروع قائم" : "Update Existing"}</option>
                                <option value="maintenance">{isRTL ? "صيانة ودعم" : "Maintenance & Support"}</option>
                                <option value="consultation">{isRTL ? "استشارة تقنية" : "Technical Consultation"}</option>
                              </select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Timeline */}
                      <FormField
                        control={form.control}
                        name="timeline"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs text-muted-foreground flex items-center gap-1.5">
                              <Clock className="h-3.5 w-3.5" />
                              {isRTL ? "الجدول الزمني المتوقع" : "Expected Timeline"}
                            </FormLabel>
                            <FormControl>
                              <select
                                {...field}
                                className="flex h-11 w-full rounded-md border border-border/50 bg-background/50 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                              >
                                <option value="">{isRTL ? "اختر المدة" : "Select timeline"}</option>
                                <option value="urgent">{isRTL ? "عاجل (أقل من أسبوع)" : "Urgent (Less than a week)"}</option>
                                <option value="2weeks">{isRTL ? "أسبوعين" : "2 Weeks"}</option>
                                <option value="1month">{isRTL ? "شهر واحد" : "1 Month"}</option>
                                <option value="2months">{isRTL ? "شهرين" : "2 Months"}</option>
                                <option value="flexible">{isRTL ? "مرن" : "Flexible"}</option>
                              </select>
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
                            <FormLabel className="text-xs text-muted-foreground flex items-center gap-1.5">
                              <MessageSquare className="h-3.5 w-3.5" />
                              {isRTL ? "تفاصيل الطلب" : "Request Details"}
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder={
                                  isRTL
                                    ? "اشرح لنا متطلباتك بالتفصيل... ما هي الميزات المطلوبة؟ ما هي المشاكل التي تريد حلها؟"
                                    : "Describe your requirements in detail... What features do you need? What problems do you want to solve?"
                                }
                                rows={4}
                                {...field}
                                className="bg-background/50 border-border/50 focus:border-primary resize-none"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Submit Button */}
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className="pt-2"
                    >
                      <Button
                        type="submit"
                        className="w-full h-12 text-base font-semibold gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/20"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            {isRTL ? "جاري الإرسال..." : "Submitting..."}
                          </>
                        ) : requiresContract ? (
                          <>
                            <FileSignature className="h-5 w-5" />
                            {isRTL ? "متابعة لمراجعة العقد" : "Continue to Review Contract"}
                          </>
                        ) : (
                          <>
                            <Send className="h-5 w-5" />
                            {isRTL ? "إرسال الطلب" : "Submit Request"}
                          </>
                        )}
                      </Button>
                    </motion.div>

                    {/* Trust Badges */}
                    <div className="flex items-center justify-center gap-4 pt-4 border-t border-border/30">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Lock className="h-3.5 w-3.5" />
                        {isRTL ? "آمن 100%" : "100% Secure"}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Headphones className="h-3.5 w-3.5" />
                        {isRTL ? "دعم 24/7" : "24/7 Support"}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <RefreshCw className="h-3.5 w-3.5" />
                        {isRTL ? "ضمان الجودة" : "Quality Guaranteed"}
                      </div>
                    </div>

                    {/* Terms Note */}
                    <p className="text-[10px] text-center text-muted-foreground/70">
                      {isRTL
                        ? "بإرسال هذا النموذج، فإنك توافق على شروط الخدمة وسياسة الخصوصية"
                        : "By submitting this form, you agree to our terms of service and privacy policy"}
                    </p>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
