import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  FileText, 
  Download, 
  Send, 
  CheckCircle, 
  Clock, 
  Signature,
  Shield,
  Award,
  Zap,
  Star
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Current offers data (matching CurrentOffers.tsx)
const currentOffers = [
  {
    id: 1,
    title: "عرض الموقع الاحترافي الكامل",
    price: "8500",
    originalPrice: "15000",
    features: [
      "تصميم مخصص وفريد",
      "استضافة مجانية لسنة كاملة",
      "شهادة SSL مجانية",
      "دعم فني 24/7",
      "تحسين محركات البحث SEO",
      "نظام إدارة المحتوى",
      "تصميم متجاوب للجوال",
      "ربط وسائل التواصل الاجتماعي"
    ],
    duration: "3-4 أسابيع"
  },
  {
    id: 2,
    title: "باقة التسويق الرقمي المتكاملة",
    price: "7200",
    originalPrice: "12000",
    features: [
      "استراتيجية تسويق مخصصة",
      "إدارة حسابات التواصل الاجتماعي",
      "حملات إعلانية مدفوعة",
      "تحليل وتقارير مفصلة",
      "تصميم محتوى إبداعي",
      "استهداف دقيق للجمهور",
      "تحسين معدل التحويل",
      "دعم واستشارة مستمرة"
    ],
    duration: "شهر - 3 أشهر"
  },
  {
    id: 3,
    title: "حزمة الهوية البصرية الشاملة",
    price: "4800",
    originalPrice: "8000",
    features: [
      "تصميم الشعار الاحترافي",
      "دليل الهوية البصرية",
      "تصميم البطاقات التجارية",
      "تصميم الخطابات الرسمية",
      "قوالب وسائل التواصل",
      "تصميم اللافتات والإعلانات",
      "ملفات بجودة عالية",
      "حقوق الملكية الكاملة"
    ],
    duration: "2-3 أسابيع"
  }
];

const DigitalContracts = () => {
  const { toast } = useToast();
  const signatureCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    clientType: "",
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    clientIdNumber: "",
    clientAddress: "",
    commercialRegister: "",
    taxNumber: "",
    authorizedPerson: "",
    selectedOffer: "",
    serviceDescription: "",
    customRequirements: "",
    agreeToTerms: false,
    agreeToPrivacy: false
  });

  const [selectedOfferDetails, setSelectedOfferDetails] = useState<any>(null);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (field === "selectedOffer" && value) {
      const offer = currentOffers.find(o => o.id.toString() === value);
      setSelectedOfferDetails(offer || null);
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const generateContractPDF = async () => {
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // إعداد الخط للنص العربي
      pdf.setFont('Arial');
      pdf.setFontSize(12);
      
      // عنوان العقد
      pdf.setFontSize(16);
      pdf.setFont('Arial', 'bold');
      pdf.text('عقد تقديم خدمات تقنية', 105, 20, { align: 'center' });
      
      // معلومات الطرف الأول
      pdf.setFontSize(12);
      pdf.setFont('Arial', 'bold');
      pdf.text('الطرف الأول:', 20, 40);
      pdf.setFont('Arial', 'normal');
      pdf.text('شركة علي صالح الشهري القابضة', 20, 50);
      pdf.text('رقم السجل التجاري: 4030394026', 20, 58);
      pdf.text('الرقم الضريبي: 311234567890003', 20, 66);
      pdf.text('العنوان: المملكة العربية السعودية', 20, 74);
      pdf.text('البريد الإلكتروني: info@alialshehriholding.com', 20, 82);
      
      // معلومات الطرف الثاني
      pdf.setFont('Arial', 'bold');
      pdf.text('الطرف الثاني:', 20, 100);
      pdf.setFont('Arial', 'normal');
      pdf.text(`الاسم: ${formData.clientName}`, 20, 110);
      pdf.text(`البريد الإلكتروني: ${formData.clientEmail}`, 20, 118);
      pdf.text(`رقم الهاتف: ${formData.clientPhone}`, 20, 126);
      
      if (formData.clientType === 'individual' && formData.clientIdNumber) {
        pdf.text(`رقم الهوية: ${formData.clientIdNumber}`, 20, 134);
      }
      
      if (formData.clientType !== 'individual') {
        if (formData.commercialRegister) {
          pdf.text(`السجل التجاري: ${formData.commercialRegister}`, 20, 134);
        }
        if (formData.taxNumber) {
          pdf.text(`الرقم الضريبي: ${formData.taxNumber}`, 20, 142);
        }
        if (formData.authorizedPerson) {
          pdf.text(`المفوض بالتوقيع: ${formData.authorizedPerson}`, 20, 150);
        }
      }
      
      if (formData.clientAddress) {
        pdf.text(`العنوان: ${formData.clientAddress}`, 20, 158);
      }
      
      // تفاصيل الخدمة
      pdf.setFont('Arial', 'bold');
      pdf.text('تفاصيل الخدمة:', 20, 180);
      pdf.setFont('Arial', 'normal');
      
      if (selectedOfferDetails) {
        pdf.text(`الخدمة: ${selectedOfferDetails.title}`, 20, 190);
        pdf.text(`السعر: ${selectedOfferDetails.price} ريال سعودي`, 20, 198);
        pdf.text(`مدة التنفيذ: ${selectedOfferDetails.duration}`, 20, 206);
      }
      
      if (formData.serviceDescription) {
        pdf.text('وصف الخدمة:', 20, 220);
        const splitDescription = pdf.splitTextToSize(formData.serviceDescription, 170);
        pdf.text(splitDescription, 20, 230);
      }
      
      // شروط العقد
      pdf.setFont('Arial', 'bold');
      pdf.text('شروط وأحكام العقد:', 20, 260);
      pdf.setFont('Arial', 'normal');
      
      const terms = [
        '1. مدة تنفيذ الطلب: 15 يوم عمل من تاريخ التوقيع على العقد واستلام الدفعة المقدمة',
        '2. إرسال العقد للمراجعة لا يعني الاتفاق النهائي بين الطرفين',
        '3. يتم اعتماد العقد نهائياً بعد دفع المبلغ المتفق عليه عن طريق التحويل البنكي',
        '4. ترسل الشركة اعتماد العقد رسمياً بعد استلام الدفعة',
        '5. جميع التعديلات والتغييرات تتم بموافقة خطية من الطرفين',
        '6. هذا العقد خاضع للأنظمة السعودية النافذة'
      ];
      
      let yPosition = 270;
      terms.forEach(term => {
        const splitTerm = pdf.splitTextToSize(term, 170);
        pdf.text(splitTerm, 20, yPosition);
        yPosition += splitTerm.length * 6 + 4;
      });
      
      // تاريخ العقد
      pdf.setFont('Arial', 'bold');
      pdf.text(`تاريخ العقد: ${new Date().toLocaleDateString('ar-SA')}`, 20, yPosition + 10);
      
      // توقيع العميل (إذا كان متوفراً)
      if (signatureCanvasRef.current) {
        const canvas = signatureCanvasRef.current;
        const signatureDataURL = canvas.toDataURL();
        // يمكن إضافة التوقيع كصورة هنا
        pdf.text('توقيع العميل:', 120, yPosition + 30);
      }
      
      return pdf.output('blob');
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw new Error('فشل في إنشاء ملف PDF');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.clientName || !formData.clientEmail || !formData.clientPhone || !formData.selectedOffer) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    if (!formData.agreeToTerms || !formData.agreeToPrivacy) {
      toast({
        title: "يجب الموافقة على الشروط",
        description: "يرجى الموافقة على الشروط والأحكام وسياسة الخصوصية",
        variant: "destructive"
      });
      return;
    }

    // Check if signature exists
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const hasSignature = imageData.data.some(channel => channel !== 0);

    if (!hasSignature) {
      toast({
        title: "التوقيع مطلوب",
        description: "يرجى إضافة توقيعك الرقمي",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Get signature as base64
      const signatureDataURL = canvas.toDataURL();

      // Prepare contract data
      const contractData = {
        ...formData,
        servicePrice: selectedOfferDetails?.price || "0",
        contractDuration: selectedOfferDetails?.duration || "حسب الاتفاق",
        currency: "SAR",
        signature: signatureDataURL
      };

      // Submit to contract-form edge function
      const { data, error } = await supabase.functions.invoke('contract-form', {
        body: {
          formType: formData.clientType,
          ...contractData
        }
      });

      if (error) {
        throw new Error(error.message || "فشل في إرسال العقد");
      }

      // Success response
      toast({
        title: "تم إرسال العقد بنجاح!",
        description: "سنتواصل معك قريباً لتأكيد تفاصيل العقد. إرسال العقد للمراجعة لا يعني الاتفاق النهائي بين الطرفين.",
      });

      // Reset form
      setFormData({
        clientType: "",
        clientName: "",
        clientEmail: "",
        clientPhone: "",
        clientIdNumber: "",
        clientAddress: "",
        commercialRegister: "",
        taxNumber: "",
        authorizedPerson: "",
        selectedOffer: "",
        serviceDescription: "",
        customRequirements: "",
        agreeToTerms: false,
        agreeToPrivacy: false
      });
      setSelectedOfferDetails(null);
      clearSignature();
    } catch (error) {
      console.error("Contract submission error:", error);
      toast({
        title: "خطأ في إرسال العقد",
        description: error instanceof Error ? error.message : "حدث خطأ أثناء إرسال العقد. يرجى المحاولة مرة أخرى.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const downloadContract = async () => {
    try {
      const pdfBlob = await generateContractPDF();
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `contract_${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      toast({
        title: "خطأ في تحميل العقد",
        description: "حدث خطأ أثناء تحميل العقد",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/10 to-blue-500/10 rounded-full mb-4">
              <FileText className="w-5 h-5 text-primary" />
              <span className="text-primary font-medium">نظام التعاقد الإلكتروني</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              إنشاء عقد إلكتروني موثق
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              قم بإنشاء عقد رسمي موثق مع التوقيع الرقمي لضمان حقوق جميع الأطراف
            </p>
          </div>

          {/* Benefits */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <div className="text-center p-6 bg-white rounded-xl shadow-sm">
              <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">آمن وموثق</h3>
              <p className="text-gray-600 text-sm">عقود مشفرة وموثقة قانونياً</p>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-sm">
              <Signature className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">توقيع رقمي</h3>
              <p className="text-gray-600 text-sm">توقيع إلكتروني معتمد</p>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-sm">
              <Clock className="w-12 h-12 text-orange-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">سريع ومباشر</h3>
              <p className="text-gray-600 text-sm">إنجاز فوري للعقود</p>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-sm">
              <Download className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">تحميل فوري</h3>
              <p className="text-gray-600 text-sm">احصل على نسختك الآن</p>
            </div>
          </div>

          {/* Contract Form */}
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl text-center">بيانات التعاقد</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Client Type */}
                <div className="space-y-4">
                  <Label className="text-lg font-semibold">نوع العميل</Label>
                  <Select value={formData.clientType} onValueChange={(value) => handleInputChange("clientType", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر نوع العميل" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="individual">فرد</SelectItem>
                      <SelectItem value="company">شركة</SelectItem>
                      <SelectItem value="institution">مؤسسة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Basic Information */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="clientName">
                      {formData.clientType === "individual" ? "الاسم الكامل" : "اسم الشركة/المؤسسة"} *
                    </Label>
                    <Input
                      id="clientName"
                      value={formData.clientName}
                      onChange={(e) => handleInputChange("clientName", e.target.value)}
                      placeholder="أدخل الاسم"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="clientEmail">البريد الإلكتروني *</Label>
                    <Input
                      id="clientEmail"
                      type="email"
                      value={formData.clientEmail}
                      onChange={(e) => handleInputChange("clientEmail", e.target.value)}
                      placeholder="example@email.com"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="clientPhone">رقم الهاتف *</Label>
                    <Input
                      id="clientPhone"
                      value={formData.clientPhone}
                      onChange={(e) => handleInputChange("clientPhone", e.target.value)}
                      placeholder="+966 5X XXX XXXX"
                      required
                    />
                  </div>

                  {formData.clientType === "individual" && (
                    <div className="space-y-2">
                      <Label htmlFor="clientIdNumber">رقم الهوية</Label>
                      <Input
                        id="clientIdNumber"
                        value={formData.clientIdNumber}
                        onChange={(e) => handleInputChange("clientIdNumber", e.target.value)}
                        placeholder="رقم الهوية الوطنية"
                      />
                    </div>
                  )}

                  {(formData.clientType === "company" || formData.clientType === "institution") && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="commercialRegister">السجل التجاري</Label>
                        <Input
                          id="commercialRegister"
                          value={formData.commercialRegister}
                          onChange={(e) => handleInputChange("commercialRegister", e.target.value)}
                          placeholder="رقم السجل التجاري"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="taxNumber">الرقم الضريبي</Label>
                        <Input
                          id="taxNumber"
                          value={formData.taxNumber}
                          onChange={(e) => handleInputChange("taxNumber", e.target.value)}
                          placeholder="الرقم الضريبي"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="authorizedPerson">المفوض بالتوقيع</Label>
                        <Input
                          id="authorizedPerson"
                          value={formData.authorizedPerson}
                          onChange={(e) => handleInputChange("authorizedPerson", e.target.value)}
                          placeholder="اسم المفوض بالتوقيع"
                        />
                      </div>
                    </>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="clientAddress">العنوان</Label>
                  <Textarea
                    id="clientAddress"
                    value={formData.clientAddress}
                    onChange={(e) => handleInputChange("clientAddress", e.target.value)}
                    placeholder="العنوان الكامل"
                    rows={3}
                  />
                </div>

                {/* Service Selection */}
                <div className="space-y-4">
                  <Label className="text-lg font-semibold">اختيار الخدمة *</Label>
                  <Select value={formData.selectedOffer} onValueChange={(value) => handleInputChange("selectedOffer", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر من العروض الحالية" />
                    </SelectTrigger>
                    <SelectContent>
                      {currentOffers.map((offer) => (
                        <SelectItem key={offer.id} value={offer.id.toString()}>
                          {offer.title} - {offer.price} ريال
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {selectedOfferDetails && (
                    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Star className="w-5 h-5 text-yellow-500" />
                          {selectedOfferDetails.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <p className="text-sm text-gray-600 mb-2">السعر:</p>
                            <div className="flex items-center gap-2">
                              <span className="text-xl font-bold text-green-600">{selectedOfferDetails.price} ريال</span>
                              <span className="text-sm text-gray-500 line-through">{selectedOfferDetails.originalPrice} ريال</span>
                            </div>
                            <p className="text-sm text-gray-600 mt-2">مدة التنفيذ: {selectedOfferDetails.duration}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 mb-2">ما يشمله العرض:</p>
                            <div className="max-h-32 overflow-y-auto space-y-1">
                              {selectedOfferDetails.features.slice(0, 4).map((feature: string, idx: number) => (
                                <div key={idx} className="flex items-start gap-2">
                                  <CheckCircle className="w-3 h-3 text-green-500 mt-1 flex-shrink-0" />
                                  <span className="text-sm text-gray-700">{feature}</span>
                                </div>
                              ))}
                              {selectedOfferDetails.features.length > 4 && (
                                <p className="text-sm text-gray-500">... و {selectedOfferDetails.features.length - 4} مميزات أخرى</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="serviceDescription">وصف الخدمة التفصيلي</Label>
                  <Textarea
                    id="serviceDescription"
                    value={formData.serviceDescription}
                    onChange={(e) => handleInputChange("serviceDescription", e.target.value)}
                    placeholder="اكتب وصف تفصيلي للخدمة المطلوبة"
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customRequirements">متطلبات إضافية</Label>
                  <Textarea
                    id="customRequirements"
                    value={formData.customRequirements}
                    onChange={(e) => handleInputChange("customRequirements", e.target.value)}
                    placeholder="أي متطلبات أو ملاحظات إضافية"
                    rows={3}
                  />
                </div>

                {/* Digital Signature */}
                <div className="space-y-4">
                  <Label className="text-lg font-semibold flex items-center gap-2">
                    <Signature className="w-5 h-5" />
                    التوقيع الرقمي *
                  </Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    <canvas
                      ref={signatureCanvasRef}
                      width={400}
                      height={200}
                      className="border border-gray-200 rounded bg-white w-full cursor-crosshair"
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                    />
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-sm text-gray-600">ارسم توقيعك في المنطقة أعلاه</p>
                      <Button type="button" variant="outline" size="sm" onClick={clearSignature}>
                        مسح التوقيع
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="space-y-4">
                  <div className="flex items-start space-x-2 rtl:space-x-reverse">
                    <Checkbox 
                      id="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked as boolean)}
                    />
                    <Label htmlFor="agreeToTerms" className="text-sm leading-6">
                      أوافق على <a href="/terms" className="text-primary hover:underline">الشروط والأحكام</a> وأتعهد بتنفيذ جميع بنود العقد *
                    </Label>
                  </div>
                  
                  <div className="flex items-start space-x-2 rtl:space-x-reverse">
                    <Checkbox 
                      id="agreeToPrivacy"
                      checked={formData.agreeToPrivacy}
                      onCheckedChange={(checked) => handleInputChange("agreeToPrivacy", checked as boolean)}
                    />
                    <Label htmlFor="agreeToPrivacy" className="text-sm leading-6">
                      أوافق على <a href="/privacy" className="text-primary hover:underline">سياسة الخصوصية</a> وأسمح بمعالجة بياناتي لأغراض التعاقد *
                    </Label>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <Button 
                    type="submit" 
                    size="lg" 
                    disabled={isSubmitting}
                    className="flex-1 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90"
                  >
                    {isSubmitting ? (
                      <>جاري الإرسال...</>
                    ) : (
                      <>
                        <Send className="w-5 h-5 ml-2" />
                        إرسال العقد للمراجعة
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="lg"
                    onClick={downloadContract}
                    className="flex-1"
                  >
                    <Download className="w-5 h-5 ml-2" />
                    تحميل نموذج العقد
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Legal Notice */}
          <div className="max-w-4xl mx-auto mt-8">
            <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <Award className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                  <div className="space-y-2">
                    <h3 className="font-semibold text-amber-900">إشعار قانوني مهم</h3>
                    <p className="text-sm text-amber-800 leading-relaxed">
                      هذا العقد مُصاغ وفقاً للأنظمة السعودية والقوانين النافذة. التوقيع الرقمي معتمد قانونياً ويحمل نفس القوة القانونية للتوقيع التقليدي. 
                      جميع البيانات محمية ومشفرة وفقاً لأعلى معايير الأمان. سيتم التواصل معكم خلال 24 ساعة لتأكيد تفاصيل العقد وإجراءات التنفيذ.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DigitalContracts;