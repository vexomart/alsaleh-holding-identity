import { useState, useRef, useEffect } from "react";
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

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Setup drawing style
    ctx.strokeStyle = '#1e40af';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
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
    
    // إضافة خلفية بيضاء
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // إضافة خط مساعد للتوقيع
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(50, canvas.height - 30);
    ctx.lineTo(canvas.width - 50, canvas.height - 30);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // إضافة نص مساعد
    ctx.fillStyle = '#9ca3af';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('وقع هنا', canvas.width / 2, canvas.height - 10);
  };

  // تهيئة مربع التوقيع عند التحميل
  const initializeSignatureCanvas = () => {
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // مسح المحتوى أولاً
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // إضافة خلفية بيضاء
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // إضافة خط مساعد للتوقيع
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(50, canvas.height - 30);
    ctx.lineTo(canvas.width - 50, canvas.height - 30);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // إضافة نص مساعد
    ctx.fillStyle = '#9ca3af';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('وقع هنا', canvas.width / 2, canvas.height - 10);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      initializeSignatureCanvas();
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // إنشاء PDF احترافي مع توقيع العميل
  const generateContractPDF = async (): Promise<jsPDF> => {
    return new Promise(async (resolve) => {
      const contractDate = new Date().toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      const hijriDate = new Date().toLocaleDateString('ar-SA-u-ca-islamic', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // إضافة خط عربي
      doc.setFont('helvetica');
      
      // خلفية بيضاء نظيفة
      doc.setFillColor(255, 255, 255);
      doc.rect(0, 0, 210, 297, 'F');
      
      // حدود خارجية زرقاء
      doc.setDrawColor(0, 102, 204);
      doc.setLineWidth(1.5);
      doc.rect(10, 10, 190, 277);
      
      // حدود داخلية رفيعة
      doc.setDrawColor(220, 220, 220);
      doc.setLineWidth(0.5);
      doc.rect(15, 15, 180, 267);

      // الهيدر مع التاريخ
      let yPos = 25;
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text(`التاريخ: ${hijriDate}`, 190, yPos, { align: 'right' });

      yPos += 15;
      
      // العنوان الرئيسي مع حد أزرق
      doc.setDrawColor(0, 102, 204);
      doc.setLineWidth(2);
      doc.line(20, yPos + 5, 190, yPos + 5);
      
      doc.setFontSize(18);
      doc.setTextColor(0, 102, 204);
      doc.text('عقد تقديم خدمات تقنية', 105, yPos, { align: 'center' });
      
      yPos += 20;

      // الطرف الأول مع خلفية زرقاء فاتحة
      doc.setFillColor(240, 248, 255);
      doc.rect(20, yPos - 3, 170, 42, 'F');
      doc.setDrawColor(0, 102, 204);
      doc.setLineWidth(1);
      doc.rect(20, yPos - 3, 170, 42);

      doc.setFontSize(14);
      doc.setTextColor(0, 102, 204);
      doc.text('الطرف الأول - مقدم الخدمة', 185, yPos + 3, { align: 'right' });
      
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      yPos += 10;
      doc.text('اسم الشركة: شركة علي صالح الشهري القابضة', 185, yPos, { align: 'right' });
      yPos += 6;
      doc.text('العنوان: الرياض، المملكة العربية السعودية', 185, yPos, { align: 'right' });
      yPos += 6;
      doc.text('البريد الإلكتروني: info@alialshehriholding.com', 185, yPos, { align: 'right' });
      yPos += 6;
      doc.text('الهاتف: +966 567 812 555', 185, yPos, { align: 'right' });

      yPos += 25;

      // الطرف الثاني مع خلفية زرقاء فاتحة
      doc.setFillColor(240, 248, 255);
      doc.rect(20, yPos - 3, 170, 35, 'F');
      doc.setDrawColor(0, 102, 204);
      doc.rect(20, yPos - 3, 170, 35);
      
      doc.setFontSize(14);
      doc.setTextColor(0, 102, 204);
      doc.text('الطرف الثاني - العميل', 185, yPos + 3, { align: 'right' });
      
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      yPos += 10;
      doc.text(`الاسم: ${formData.clientName || 'علي صالح الشهري'}`, 185, yPos, { align: 'right' });
      yPos += 6;
      doc.text(`البريد الإلكتروني: ${formData.clientEmail || 'ali6c205@gmail.com'}`, 185, yPos, { align: 'right' });
      
      if (formData.clientIdNumber) {
        yPos += 6;
        doc.text(`رقم الهوية: ${formData.clientIdNumber}`, 185, yPos, { align: 'right' });
      }

      yPos += 25;

      // تفاصيل الخدمة مع خلفية خضراء فاتحة
      doc.setFillColor(240, 255, 240);
      doc.rect(20, yPos - 3, 170, 42, 'F');
      doc.setDrawColor(0, 150, 0);
      doc.rect(20, yPos - 3, 170, 42);
      
      doc.setFontSize(14);
      doc.setTextColor(0, 150, 0);
      doc.text('تفاصيل الخدمة المطلوبة', 185, yPos + 3, { align: 'right' });
      
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      yPos += 10;
      
      if (selectedOfferDetails) {
        doc.text(`نوع الخدمة: ${selectedOfferDetails.title}`, 185, yPos, { align: 'right' });
        yPos += 6;
        doc.text(`وصف الخدمة: ${selectedOfferDetails.title}`, 185, yPos, { align: 'right' });
        yPos += 6;
        doc.text(`قيمة الخدمة: ${selectedOfferDetails.price} ريال سعودي`, 185, yPos, { align: 'right' });
        yPos += 6;
        doc.text(`مدة التنفيذ: ${selectedOfferDetails.duration}`, 185, yPos, { align: 'right' });
      } else {
        doc.text('نوع الخدمة: عرض الموقع الاحترافي الكامل', 185, yPos, { align: 'right' });
        yPos += 6;
        doc.text('وصف الخدمة: عرض الموقع الاحترافي الكامل', 185, yPos, { align: 'right' });
        yPos += 6;
        doc.text('قيمة الخدمة: 8500 ريال سعودي', 185, yPos, { align: 'right' });
        yPos += 6;
        doc.text('مدة التنفيذ: 3-4 أسابيع', 185, yPos, { align: 'right' });
      }

      yPos += 30;

      // الشروط والأحكام مع خلفية صفراء فاتحة
      doc.setFillColor(255, 252, 220);
      doc.rect(20, yPos - 3, 170, 50, 'F');
      doc.setDrawColor(255, 180, 0);
      doc.rect(20, yPos - 3, 170, 50);
      
      doc.setFontSize(14);
      doc.setTextColor(255, 140, 0);
      doc.text('الشروط والأحكام', 185, yPos + 3, { align: 'right' });
      
      doc.setFontSize(9);
      doc.setTextColor(0, 0, 0);
      yPos += 10;
      doc.text('• تم الاتفاق بين الطرفين على تنفيذ الخدمة المذكورة أعلاه', 185, yPos, { align: 'right' });
      yPos += 5;
      doc.text('• إرسال العقد للمراجعة لا يعني الاتفاق النهائي بين الطرفين', 185, yPos, { align: 'right' });
      yPos += 5;
      doc.text('• يتم اعتماد العقد نهائياً بعد الدفع عن طريق التحويل البنكي لحساب الشركة', 185, yPos, { align: 'right' });
      yPos += 5;
      doc.text('• الشركة ملتزمة بتقديم الخدمة وفقاً للمواصفات المتفق عليها', 185, yPos, { align: 'right' });
      yPos += 5;
      doc.text('• العميل ملتزم بدفع المبلغ المتفق عليه في المواعيد المحددة', 185, yPos, { align: 'right' });

      yPos += 25;

      // معلومات الحساب البنكي مع خلفية خضراء فاتحة
      doc.setFillColor(240, 255, 240);
      doc.rect(20, yPos - 3, 170, 42, 'F');
      doc.setDrawColor(0, 150, 0);
      doc.rect(20, yPos - 3, 170, 42);
      
      // شعار البنك الراجحي
      doc.setFillColor(0, 102, 204);
      doc.roundedRect(25, yPos + 2, 20, 15, 2, 2, 'F');
      doc.setFontSize(8);
      doc.setTextColor(255, 255, 255);
      doc.text('مصرف', 35, yPos + 8, { align: 'center' });
      doc.text('الراجحي', 35, yPos + 12, { align: 'center' });
      
      doc.setFontSize(14);
      doc.setTextColor(0, 150, 0);
      doc.text('معلومات الحساب البنكي للدفع', 185, yPos + 3, { align: 'right' });
      
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      yPos += 10;
      doc.text('اسم البنك: مصرف الراجحي', 185, yPos, { align: 'right' });
      yPos += 6;
      doc.text('اسم الحساب: شركة علي صالح الشهري القابضة', 185, yPos, { align: 'right' });
      yPos += 6;
      doc.text('رقم الحساب: 161000010006086071040', 185, yPos, { align: 'right' });
      yPos += 6;
      doc.text('رقم الآيبان: SA1980000161608016071040', 185, yPos, { align: 'right' });

      yPos += 30;
      
      // منطقة التوقيعات
      doc.setFillColor(248, 250, 252);
      doc.rect(20, yPos, 170, 40, 'F');
      doc.setDrawColor(100, 100, 100);
      doc.rect(20, yPos, 170, 40);
      
      // توقيع الطرف الأول
      doc.setDrawColor(0, 102, 204);
      doc.setLineWidth(1);
      doc.rect(25, yPos + 5, 70, 30);
      
      doc.setFontSize(12);
      doc.setTextColor(0, 102, 204);
      doc.text('الطرف الأول - مقدم الخدمة', 60, yPos + 12, { align: 'center' });
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text('شركة علي صالح الشهري القابضة', 60, yPos + 18, { align: 'center' });
      doc.text('التوقيع: ________________', 60, yPos + 27, { align: 'center' });
      
      // توقيع الطرف الثاني مع التوقيع الرقمي
      doc.setDrawColor(0, 102, 204);
      doc.rect(105, yPos + 5, 70, 30);
      
      doc.setFontSize(12);
      doc.setTextColor(0, 102, 204);
      doc.text('الطرف الثاني - العميل', 140, yPos + 12, { align: 'center' });
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text(formData.clientName || 'علي صالح الشهري', 140, yPos + 18, { align: 'center' });
      
      // إضافة التوقيع الرقمي للعميل
      const canvas = signatureCanvasRef.current;
      if (canvas) {
        try {
          const signatureData = canvas.toDataURL('image/png');
          // فحص ما إذا كان هناك توقيع حقيقي
          const ctx = canvas.getContext('2d');
          if (ctx) {
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const hasSignature = imageData.data.some((channel, index) => {
              // تجاهل قناة الشفافية (alpha channel)
              if (index % 4 === 3) return false;
              return channel !== 255; // أي لون غير الأبيض
            });
            
            if (hasSignature && signatureData && signatureData !== 'data:,') {
              // تحويل التوقيع إلى صورة وإضافتها للـ PDF
              doc.addImage(signatureData, 'PNG', 110, yPos + 22, 60, 12);
            } else {
              doc.text('التوقيع: ________________', 140, yPos + 27, { align: 'center' });
            }
          } else {
            doc.text('التوقيع: ________________', 140, yPos + 27, { align: 'center' });
          }
        } catch (error) {
          console.error('خطأ في إضافة التوقيع:', error);
          doc.text('التوقيع: ________________', 140, yPos + 27, { align: 'center' });
        }
      } else {
        doc.text('التوقيع: ________________', 140, yPos + 27, { align: 'center' });
      }

      yPos += 50;
      
      // التذييل
      doc.setDrawColor(0, 102, 204);
      doc.setLineWidth(1);
      doc.line(20, yPos, 190, yPos);
      
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`تم إنشاء هذا العقد بتاريخ: ${contractDate}`, 105, yPos + 8, { align: 'center' });

      resolve(doc);
    });
  };

  // معالج تحميل PDF
  const handleDownloadPDF = async () => {
    try {
      const pdfDoc = await generateContractPDF();
      (pdfDoc as any).save(`contract-${formData.clientName || 'client'}-${Date.now()}.pdf`);
      
      toast({
        title: "تم تحميل العقد بنجاح",
        description: "تم إنشاء ملف PDF للعقد وحفظه",
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "خطأ في إنشاء PDF",
        description: "حدث خطأ أثناء إنشاء ملف العقد",
        variant: "destructive"
      });
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

      // إنشاء PDF قبل الإرسال
      const pdfDoc = await generateContractPDF();
      const pdfBlob = (pdfDoc as any).output('blob');
      
      // تحويل PDF إلى base64
      const reader = new FileReader();
      reader.readAsDataURL(pdfBlob);
      
      reader.onload = async () => {
        const pdfBase64 = reader.result as string;
        
        // Prepare contract data
        const contractData = {
          ...formData,
          servicePrice: selectedOfferDetails?.price || "0",
          contractDuration: selectedOfferDetails?.duration || "حسب الاتفاق",
          currency: "SAR",
          signature: signatureDataURL,
          contractPdf: pdfBase64
        };

        // Submit to contract-form edge function
        const { data, error } = await supabase.functions.invoke('contract-form', {
          body: {
            formType: formData.clientType,
            clientName: formData.clientName,
            clientEmail: formData.clientEmail,
            clientPhone: formData.clientPhone,
            clientIdNumber: formData.clientIdNumber,
            clientAddress: formData.clientAddress,
            commercialRegister: formData.commercialRegister,
            taxNumber: formData.taxNumber,
            authorizedPerson: formData.authorizedPerson,
            selectedOffer: selectedOfferDetails?.title || formData.selectedOffer,
            servicePrice: selectedOfferDetails?.price || "0",
            contractDuration: selectedOfferDetails?.duration || "حسب الاتفاق",
            serviceDescription: formData.serviceDescription,
            customRequirements: formData.customRequirements,
            signature: signatureDataURL,
            contractPdf: pdfBase64
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
      };
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="p-4 bg-primary/10 rounded-full">
                <FileText className="h-12 w-12 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              العقود الرقمية المتطورة
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              أنشئ عقدك الرقمي بطريقة احترافية وآمنة مع التوقيع الإلكتروني المعتمد
            </p>
          </div>

          {/* Features Banner */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            {[
              { icon: Shield, title: "آمن ومحمي", desc: "تشفير متقدم" },
              { icon: Zap, title: "سريع ومرن", desc: "إنشاء فوري" },
              { icon: Award, title: "معتمد قانونياً", desc: "وفق الأنظمة السعودية" },
              { icon: Star, title: "توقيع رقمي", desc: "معتمد إلكترونياً" }
            ].map((feature, index) => (
              <Card key={index} className="text-center p-4 border-2 border-primary/20 hover:border-primary/40 transition-colors">
                <feature.icon className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold text-sm">{feature.title}</h3>
                <p className="text-xs text-muted-foreground">{feature.desc}</p>
              </Card>
            ))}
          </div>

          {/* Main Form */}
          <Card className="shadow-xl border-2 border-primary/20">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10">
              <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
                <FileText className="h-6 w-6" />
                إنشاء عقد جديد
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Client Type Selection */}
                <div className="space-y-4">
                  <Label className="text-lg font-semibold">نوع العميل</Label>
                  <Select value={formData.clientType} onValueChange={(value) => handleInputChange("clientType", value)}>
                    <SelectTrigger className="border-2 border-primary/20 focus:border-primary">
                      <SelectValue placeholder="اختر نوع العميل" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="individual">فرد</SelectItem>
                      <SelectItem value="company">شركة</SelectItem>
                      <SelectItem value="government">جهة حكومية</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Basic Information */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="clientName">الاسم الكامل *</Label>
                    <Input
                      id="clientName"
                      value={formData.clientName}
                      onChange={(e) => handleInputChange("clientName", e.target.value)}
                      className="border-2 border-primary/20 focus:border-primary"
                      placeholder="أدخل الاسم الكامل"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="clientEmail">البريد الإلكتروني *</Label>
                    <Input
                      id="clientEmail"
                      type="email"
                      value={formData.clientEmail}
                      onChange={(e) => handleInputChange("clientEmail", e.target.value)}
                      className="border-2 border-primary/20 focus:border-primary"
                      placeholder="example@domain.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="clientPhone">رقم الهاتف *</Label>
                    <Input
                      id="clientPhone"
                      value={formData.clientPhone}
                      onChange={(e) => handleInputChange("clientPhone", e.target.value)}
                      className="border-2 border-primary/20 focus:border-primary"
                      placeholder="+966 5X XXX XXXX"
                    />
                  </div>

                  {formData.clientType === "individual" && (
                    <div className="space-y-2">
                      <Label htmlFor="clientIdNumber">رقم الهوية الوطنية</Label>
                      <Input
                        id="clientIdNumber"
                        value={formData.clientIdNumber}
                        onChange={(e) => handleInputChange("clientIdNumber", e.target.value)}
                        className="border-2 border-primary/20 focus:border-primary"
                        placeholder="10 أرقام"
                      />
                    </div>
                  )}
                </div>

                {/* Company Information */}
                {formData.clientType !== "individual" && (
                  <div className="space-y-6 p-6 bg-secondary/10 rounded-lg border-2 border-secondary/20">
                    <h3 className="text-lg font-semibold text-secondary">معلومات الشركة/الجهة</h3>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="commercialRegister">رقم السجل التجاري</Label>
                        <Input
                          id="commercialRegister"
                          value={formData.commercialRegister}
                          onChange={(e) => handleInputChange("commercialRegister", e.target.value)}
                          className="border-2 border-secondary/20 focus:border-secondary"
                          placeholder="رقم السجل التجاري"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="taxNumber">الرقم الضريبي</Label>
                        <Input
                          id="taxNumber"
                          value={formData.taxNumber}
                          onChange={(e) => handleInputChange("taxNumber", e.target.value)}
                          className="border-2 border-secondary/20 focus:border-secondary"
                          placeholder="الرقم الضريبي"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="authorizedPerson">اسم المفوض بالتوقيع</Label>
                      <Input
                        id="authorizedPerson"
                        value={formData.authorizedPerson}
                        onChange={(e) => handleInputChange("authorizedPerson", e.target.value)}
                        className="border-2 border-secondary/20 focus:border-secondary"
                        placeholder="اسم الشخص المفوض بالتوقيع"
                      />
                    </div>
                  </div>
                )}

                {/* Address */}
                <div className="space-y-2">
                  <Label htmlFor="clientAddress">العنوان</Label>
                  <Textarea
                    id="clientAddress"
                    value={formData.clientAddress}
                    onChange={(e) => handleInputChange("clientAddress", e.target.value)}
                    className="border-2 border-primary/20 focus:border-primary"
                    placeholder="العنوان التفصيلي"
                    rows={3}
                  />
                </div>

                {/* Service Selection */}
                <div className="space-y-6 p-6 bg-accent/10 rounded-lg border-2 border-accent/20">
                  <h3 className="text-lg font-semibold text-accent">تفاصيل الخدمة المطلوبة</h3>
                  
                  <div className="space-y-4">
                    <Label className="text-base font-medium">اختر العرض المطلوب *</Label>
                    <Select value={formData.selectedOffer} onValueChange={(value) => handleInputChange("selectedOffer", value)}>
                      <SelectTrigger className="border-2 border-accent/20 focus:border-accent">
                        <SelectValue placeholder="اختر العرض المناسب" />
                      </SelectTrigger>
                      <SelectContent>
                        {currentOffers.map((offer) => (
                          <SelectItem key={offer.id} value={offer.id.toString()}>
                            {offer.title} - {offer.price} ريال
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Selected Offer Details */}
                  {selectedOfferDetails && (
                    <Card className="border-2 border-accent/30 bg-accent/5">
                      <CardContent className="p-4">
                        <h4 className="font-semibold mb-2">{selectedOfferDetails.title}</h4>
                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <span className="text-sm text-muted-foreground">السعر: </span>
                            <span className="font-semibold text-lg">{selectedOfferDetails.price} ريال</span>
                            {selectedOfferDetails.originalPrice && (
                              <span className="text-sm text-muted-foreground line-through mr-2">
                                {selectedOfferDetails.originalPrice} ريال
                              </span>
                            )}
                          </div>
                          <div>
                            <span className="text-sm text-muted-foreground">مدة التنفيذ: </span>
                            <span className="font-medium">{selectedOfferDetails.duration}</span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">المميزات المشمولة:</p>
                          <div className="grid md:grid-cols-2 gap-1">
                            {selectedOfferDetails.features.map((feature: string, index: number) => (
                              <div key={index} className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <span className="text-sm">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="serviceDescription">وصف تفصيلي للخدمة</Label>
                    <Textarea
                      id="serviceDescription"
                      value={formData.serviceDescription}
                      onChange={(e) => handleInputChange("serviceDescription", e.target.value)}
                      className="border-2 border-accent/20 focus:border-accent"
                      placeholder="أضف تفاصيل إضافية عن الخدمة المطلوبة"
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="customRequirements">متطلبات خاصة</Label>
                    <Textarea
                      id="customRequirements"
                      value={formData.customRequirements}
                      onChange={(e) => handleInputChange("customRequirements", e.target.value)}
                      className="border-2 border-accent/20 focus:border-accent"
                      placeholder="أي متطلبات خاصة أو تعديلات مطلوبة"
                      rows={3}
                    />
                  </div>
                </div>

                {/* Digital Signature */}
                <div className="space-y-6 p-6 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg border-2 border-primary/20">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-2 flex items-center justify-center gap-2">
                      <Signature className="h-5 w-5" />
                      التوقيع الرقمي المعتمد
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      يرجى التوقيع في المربع أدناه باستخدام الماوس أو اللمس
                    </p>
                  </div>

                  <div className="relative">
                    <canvas
                      ref={signatureCanvasRef}
                      width={600}
                      height={200}
                      className="border-2 border-dashed border-primary/40 rounded-lg cursor-crosshair w-full bg-white shadow-inner"
                      style={{ 
                        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                        touchAction: 'none'
                      }}
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      onTouchStart={startDrawing}
                      onTouchMove={draw}
                      onTouchEnd={stopDrawing}
                    />
                    
                    <div className="absolute top-2 left-2 flex items-center gap-2 text-xs text-muted-foreground">
                      <Shield className="h-3 w-3" />
                      <span>مشفر وآمن</span>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={clearSignature}
                      className="border-2 border-destructive/30 text-destructive hover:bg-destructive/10"
                    >
                      مسح التوقيع
                    </Button>
                  </div>

                  <div className="text-center text-xs text-muted-foreground space-y-1">
                    <p>💡 نصائح للتوقيع:</p>
                    <p>• استخدم خطاً واضحاً ومقروءاً</p>
                    <p>• تأكد من اكتمال التوقيع قبل الإرسال</p>
                    <p>• التوقيع مشفر ومحمي قانونياً</p>
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="space-y-4 p-6 bg-muted/50 rounded-lg border-2 border-muted-foreground/20">
                  <h3 className="text-lg font-semibold">الموافقة على الشروط والأحكام</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-2 space-x-reverse">
                      <Checkbox
                        id="agreeToTerms"
                        checked={formData.agreeToTerms}
                        onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked as boolean)}
                        className="mt-1"
                      />
                      <Label htmlFor="agreeToTerms" className="text-sm leading-relaxed">
                        أوافق على الشروط والأحكام الخاصة بالعقد وأقر بأن إرسال هذا العقد للمراجعة لا يعني الاتفاق النهائي بين الطرفين، 
                        ويعتبر العقد نافذاً بعد دفع المبلغ المتفق عليه للحساب البنكي المحدد.
                      </Label>
                    </div>
                    
                    <div className="flex items-start space-x-2 space-x-reverse">
                      <Checkbox
                        id="agreeToPrivacy"
                        checked={formData.agreeToPrivacy}
                        onCheckedChange={(checked) => handleInputChange("agreeToPrivacy", checked as boolean)}
                        className="mt-1"
                      />
                      <Label htmlFor="agreeToPrivacy" className="text-sm leading-relaxed">
                        أوافق على سياسة الخصوصية وعلى استخدام بياناتي لأغراض تنفيذ العقد والتواصل المهني.
                      </Label>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleDownloadPDF}
                    className="flex-1 border-2 border-primary/30 text-primary hover:bg-primary/10"
                    disabled={!formData.clientName || !formData.selectedOffer}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    تحميل معاينة العقد
                  </Button>
                  
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-semibold py-3 shadow-lg"
                  >
                    {isSubmitting ? (
                      <>
                        <Clock className="h-4 w-4 mr-2 animate-spin" />
                        جاري الإرسال...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        إرسال العقد للمراجعة
                      </>
                    )}
                  </Button>
                </div>

                {/* Important Notice */}
                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 text-center">
                  <p className="text-sm text-yellow-800 font-medium">
                    ⚠️ ملاحظة مهمة: إرسال العقد للمراجعة لا يعني الاتفاق النهائي بين الطرفين
                  </p>
                  <p className="text-xs text-yellow-700 mt-1">
                    سيتم التواصل معك لتأكيد التفاصيل واعتماد العقد نهائياً
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default DigitalContracts;