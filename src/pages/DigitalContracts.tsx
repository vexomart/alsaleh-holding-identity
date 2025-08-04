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
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, pdf, Font } from '@react-pdf/renderer';
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
    
    // إضافة خط مساعد للتوقيع
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(50, canvas.height - 30);
    ctx.lineTo(canvas.width - 50, canvas.height - 30);
    ctx.stroke();
    ctx.setLineDash([]);
  };

  // إضافة خط مساعد عند تحميل الصفحة
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

  // تهيئة مربع التوقيع عند التحميل
  useEffect(() => {
    const timer = setTimeout(() => {
      initializeSignatureCanvas();
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // تحديث contract form edge function بإرسال البيانات الصحيحة
  const generateContractPDF = (): Promise<jsPDF> => {
    return new Promise((resolve) => {
      const contractDate = new Date().toLocaleDateString('ar-SA', {
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
      
      // خلفية مع حواف
      doc.setFillColor(245, 248, 255);
      doc.rect(10, 10, 190, 277, 'F');
      
      // حواف خارجية
      doc.setDrawColor(59, 130, 246);
      doc.setLineWidth(1);
      doc.rect(10, 10, 190, 277);
      
      // حواف داخلية
      doc.setDrawColor(147, 197, 253);
      doc.setLineWidth(0.5);
      doc.rect(15, 15, 180, 267);

      // هيدر الشركة مع شعار
      doc.setFillColor(59, 130, 246);
      doc.rect(15, 15, 180, 40, 'F');
      
      // شعار الشركة (مربع تمثيلي)
      doc.setFillColor(255, 255, 255);
      doc.rect(25, 22, 26, 26, 'F');
      doc.setDrawColor(59, 130, 246);
      doc.rect(25, 22, 26, 26);
      
      // نص الشعار
      doc.setFontSize(8);
      doc.setTextColor(59, 130, 246);
      doc.text('LOGO', 35, 32);
      doc.text('شركة', 35, 36);
      doc.text('علي الشهري', 30, 40);
      doc.text('القابضة', 32, 44);

      // اسم الشركة
      doc.setFontSize(24);
      doc.setTextColor(255, 255, 255);
      doc.text('شركة علي صالح الشهري القابضة', 195, 30, { align: 'right' });
      
      // عنوان العقد
      doc.setFontSize(18);
      doc.text('عقد تقديم خدمات تقنية متطورة', 195, 40, { align: 'right' });
      
      // رقم العقد
      doc.setFontSize(12);
      const contractNumber = `C${new Date().getFullYear()}${Math.random().toString().slice(2, 8)}`;
      doc.text(`رقم العقد: ${contractNumber}`, 195, 48, { align: 'right' });

      let yPos = 70;
      
      // الطرف الأول - مع خلفية ملونة
      doc.setFillColor(239, 246, 255);
      doc.rect(20, yPos - 5, 170, 35, 'F');
      doc.setDrawColor(59, 130, 246);
      doc.rect(20, yPos - 5, 170, 35);
      
      doc.setFontSize(14);
      doc.setTextColor(59, 130, 246);
      doc.text('الطرف الأول (مقدم الخدمة):', 185, yPos, { align: 'right' });
      
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      yPos += 8;
      doc.text('شركة علي صالح الشهري القابضة', 185, yPos, { align: 'right' });
      yPos += 6;
      doc.text('رقم السجل التجاري: 4030394026', 185, yPos, { align: 'right' });
      yPos += 6;
      doc.text('الرقم الضريبي: 311234567890003', 185, yPos, { align: 'right' });
      yPos += 6;
      doc.text('العنوان: المملكة العربية السعودية - الرياض', 185, yPos, { align: 'right' });
      yPos += 6;
      doc.text('البريد الإلكتروني: info@alialshehriholding.com', 185, yPos, { align: 'right' });

      yPos += 15;
      
      // الطرف الثاني - مع خلفية ملونة
      doc.setFillColor(254, 249, 195);
      doc.rect(20, yPos - 5, 170, 35, 'F');
      doc.setDrawColor(245, 158, 11);
      doc.rect(20, yPos - 5, 170, 35);
      
      doc.setFontSize(14);
      doc.setTextColor(245, 158, 11);
      doc.text('الطرف الثاني (العميل):', 185, yPos, { align: 'right' });
      
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      yPos += 8;
      doc.text(formData.clientName || 'اسم العميل', 185, yPos, { align: 'right' });
      yPos += 6;
      doc.text(`البريد الإلكتروني: ${formData.clientEmail || ''}`, 185, yPos, { align: 'right' });
      yPos += 6;
      doc.text(`الهاتف: ${formData.clientPhone || ''}`, 185, yPos, { align: 'right' });
      
      if (formData.clientType === 'individual' && formData.clientIdNumber) {
        yPos += 6;
        doc.text(`رقم الهوية: ${formData.clientIdNumber}`, 185, yPos, { align: 'right' });
      }
      
      if (formData.clientType !== 'individual') {
        if (formData.commercialRegister) {
          yPos += 6;
          doc.text(`السجل التجاري: ${formData.commercialRegister}`, 185, yPos, { align: 'right' });
        }
        if (formData.taxNumber) {
          yPos += 6;
          doc.text(`الرقم الضريبي: ${formData.taxNumber}`, 185, yPos, { align: 'right' });
        }
        if (formData.authorizedPerson) {
          yPos += 6;
          doc.text(`المفوض بالتوقيع: ${formData.authorizedPerson}`, 185, yPos, { align: 'right' });
        }
      }

      yPos += 20;
      
      // تفاصيل الخدمة
      doc.setFillColor(220, 252, 231);
      doc.rect(20, yPos - 5, 170, 40, 'F');
      doc.setDrawColor(34, 197, 94);
      doc.rect(20, yPos - 5, 170, 40);
      
      doc.setFontSize(14);
      doc.setTextColor(22, 163, 74);
      doc.text('تفاصيل الخدمة المتفق عليها:', 185, yPos, { align: 'right' });
      
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      yPos += 8;
      
      if (selectedOfferDetails) {
        doc.text(`اسم الخدمة: ${selectedOfferDetails.title}`, 185, yPos, { align: 'right' });
        yPos += 6;
        doc.text(`قيمة العقد: ${selectedOfferDetails.price} ريال سعودي (شامل الضريبة)`, 185, yPos, { align: 'right' });
        yPos += 6;
        // استخدام مدة التنفيذ من العرض المحدد بدلاً من 15 يوم ثابت
        doc.text(`مدة التنفيذ: ${selectedOfferDetails.duration}`, 185, yPos, { align: 'right' });
        yPos += 6;
        doc.text('تاريخ بداية التنفيذ: من تاريخ التوقيع واستلام الدفعة', 185, yPos, { align: 'right' });
      }
      
      if (formData.serviceDescription) {
        yPos += 8;
        doc.text(`وصف إضافي: ${formData.serviceDescription}`, 185, yPos, { align: 'right' });
      }

      yPos += 20;
      
      // بطاقة الحساب البنكي مع أيقونة البنك
      doc.setFillColor(237, 233, 254);
      doc.rect(20, yPos - 5, 170, 45, 'F');
      doc.setDrawColor(139, 92, 246);
      doc.rect(20, yPos - 5, 170, 45);
      
      // أيقونة البنك (مربع تمثيلي لشعار الراجحي)
      doc.setFillColor(0, 102, 204);
      doc.rect(25, yPos, 20, 15, 'F');
      doc.setFontSize(8);
      doc.setTextColor(255, 255, 255);
      doc.text('البنك', 30, yPos + 6);
      doc.text('الراجحي', 28, yPos + 10);
      
      doc.setFontSize(14);
      doc.setTextColor(139, 92, 246);
      doc.text('معلومات الحساب البنكي للتحويل:', 185, yPos, { align: 'right' });
      
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      yPos += 8;
      doc.text('بنك الراجحي', 185, yPos, { align: 'right' });
      yPos += 6;
      doc.text('اسم الحساب: شركة علي صالح الشهري القابضة', 185, yPos, { align: 'right' });
      yPos += 6;
      doc.text('رقم الحساب: 161000010006086071040', 185, yPos, { align: 'right' });
      yPos += 6;
      doc.text('الآيبان: SA1980000161608016071040', 185, yPos, { align: 'right' });

      yPos += 20;
      
      // الشروط والأحكام
      doc.setFillColor(254, 242, 242);
      doc.rect(20, yPos - 5, 170, 50, 'F');
      doc.setDrawColor(239, 68, 68);
      doc.rect(20, yPos - 5, 170, 50);
      
      doc.setFontSize(14);
      doc.setTextColor(220, 38, 38);
      doc.text('الشروط والأحكام الأساسية:', 185, yPos, { align: 'right' });
      
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      yPos += 8;
      doc.text('١. يتم تنفيذ المشروع وفقاً للمدة المحددة في تفاصيل الخدمة أعلاه', 185, yPos, { align: 'right' });
      yPos += 5;
      doc.text('٢. إرسال العقد للمراجعة لا يعني الاتفاق النهائي بين الطرفين', 185, yPos, { align: 'right' });
      yPos += 5;
      doc.text('٣. يتم اعتماد العقد نهائياً بعد دفع المبلغ المتفق عليه للحساب المذكور أعلاه', 185, yPos, { align: 'right' });
      yPos += 5;
      doc.text('٤. ترسل الشركة اعتماد العقد رسمياً من طرفها بعد استلام الدفعة', 185, yPos, { align: 'right' });
      yPos += 5;
      doc.text('٥. جميع التعديلات تتم بموافقة خطية من الطرفين', 185, yPos, { align: 'right' });
      yPos += 5;
      doc.text('٦. هذا العقد خاضع للأنظمة السعودية النافذة', 185, yPos, { align: 'right' });
      yPos += 5;
      doc.text('٧. أي نزاع يحل ودياً أو يحال للجهات المختصة', 185, yPos, { align: 'right' });

      yPos += 20;
      
      // التوقيعات
      doc.setDrawColor(107, 114, 128);
      doc.rect(25, yPos, 70, 25);
      doc.rect(115, yPos, 70, 25);
      
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text('توقيع الطرف الأول', 90, yPos + 5, { align: 'center' });
      doc.text('شركة علي صالح الشهري القابضة', 90, yPos + 10, { align: 'center' });
      
      doc.text('توقيع الطرف الثاني', 25, yPos + 5, { align: 'center' });
      doc.text(formData.clientName || 'العميل', 25, yPos + 10, { align: 'center' });
      doc.text('[توقيع رقمي مرفق]', 25, yPos + 15, { align: 'center' });

      // التاريخ
      yPos += 35;
      doc.setFillColor(59, 130, 246);
      doc.rect(20, yPos - 3, 170, 15, 'F');
      doc.setFontSize(14);
      doc.setTextColor(255, 255, 255);
      doc.text(`تاريخ العقد: ${contractDate}`, 105, yPos + 5, { align: 'center' });

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

  const downloadContract = async () => {
    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4'
      });

      // Create a temporary div with RTL content
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.top = '-9999px';
      tempDiv.style.left = '-9999px';
      tempDiv.style.width = '595px';
      tempDiv.style.fontFamily = 'Arial, "Segoe UI", sans-serif';
      tempDiv.style.fontSize = '14px';
      tempDiv.style.lineHeight = '1.6';
      tempDiv.style.direction = 'rtl';
      tempDiv.style.textAlign = 'right';
      tempDiv.style.padding = '40px';
      tempDiv.style.background = 'white';

      const contractNumber = `C${Math.floor(Math.random() * 1000) + 1}`;
      const contractDate = new Date().toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      tempDiv.innerHTML = `
        <div style="direction: rtl; text-align: right; font-family: Arial, sans-serif;">
          <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #1e40af; padding-bottom: 20px;">
            <h1 style="color: #1e40af; font-size: 24px; margin: 0;">عقد تقديم خدمات تقنية</h1>
            <h2 style="color: #374151; font-size: 18px; margin: 10px 0;">رقم العقد: ${contractNumber}</h2>
            <p style="color: #6b7280; margin: 5px 0;">التاريخ: ${contractDate}</p>
          </div>

          <div style="margin-bottom: 25px; background: #f8fafc; padding: 20px; border-right: 4px solid #1e40af;">
            <h3 style="color: #1e40af; margin-top: 0; font-size: 16px;">الطرف الأول - مقدم الخدمة</h3>
            <p style="margin: 8px 0;"><strong>اسم الشركة:</strong> شركة علي صالح الشهري القابضة</p>
            <p style="margin: 8px 0;"><strong>العنوان:</strong> الرياض، المملكة العربية السعودية</p>
            <p style="margin: 8px 0;"><strong>البريد الإلكتروني:</strong> info@alialshehriholding.com</p>
            <p style="margin: 8px 0;"><strong>الهاتف:</strong> +966 555 812 567</p>
          </div>

          <div style="margin-bottom: 25px; background: #f0f9ff; padding: 20px; border-right: 4px solid #3b82f6;">
            <h3 style="color: #1e40af; margin-top: 0; font-size: 16px;">الطرف الثاني - العميل</h3>
            <p style="margin: 8px 0;"><strong>الاسم:</strong> ${formData.clientName}</p>
            <p style="margin: 8px 0;"><strong>البريد الإلكتروني:</strong> ${formData.clientEmail}</p>
            <p style="margin: 8px 0;"><strong>رقم الهاتف:</strong> ${formData.clientPhone}</p>
            ${formData.clientAddress ? `<p style="margin: 8px 0;"><strong>العنوان:</strong> ${formData.clientAddress}</p>` : ''}
            ${formData.clientIdNumber ? `<p style="margin: 8px 0;"><strong>رقم الهوية:</strong> ${formData.clientIdNumber}</p>` : ''}
            ${formData.commercialRegister ? `<p style="margin: 8px 0;"><strong>السجل التجاري:</strong> ${formData.commercialRegister}</p>` : ''}
            ${formData.taxNumber ? `<p style="margin: 8px 0;"><strong>الرقم الضريبي:</strong> ${formData.taxNumber}</p>` : ''}
            ${formData.authorizedPerson ? `<p style="margin: 8px 0;"><strong>المفوض بالتوقيع:</strong> ${formData.authorizedPerson}</p>` : ''}
          </div>

          <div style="margin-bottom: 25px; background: #f0fdf4; padding: 20px; border-right: 4px solid #10b981;">
            <h3 style="color: #065f46; margin-top: 0; font-size: 16px;">تفاصيل الخدمة المطلوبة</h3>
            <p style="margin: 8px 0;"><strong>نوع الخدمة:</strong> ${selectedOfferDetails?.title || formData.selectedOffer}</p>
            <p style="margin: 8px 0;"><strong>وصف الخدمة:</strong> ${selectedOfferDetails?.description || formData.serviceDescription}</p>
            <p style="margin: 8px 0;"><strong>قيمة الخدمة:</strong> ${selectedOfferDetails?.price || "0"} ريال سعودي</p>
            <p style="margin: 8px 0;"><strong>مدة التنفيذ:</strong> ${selectedOfferDetails?.duration || "حسب الاتفاق"}</p>
            <p style="margin: 8px 0;"><strong>مدة تنفيذ الطلب:</strong> 15 يوم عمل من تاريخ التوقيع</p>
            ${formData.customRequirements ? `<p style="margin: 8px 0;"><strong>متطلبات إضافية:</strong> ${formData.customRequirements}</p>` : ''}
          </div>

          <div style="margin-bottom: 25px; background: #fef3c7; padding: 20px; border-right: 4px solid #f59e0b;">
            <h3 style="color: #92400e; margin-top: 0; font-size: 16px;">الشروط والأحكام</h3>
            <p style="margin: 8px 0; line-height: 1.6;">
              • تم الاتفاق بين الطرفين على تنفيذ الخدمة المذكورة أعلاه<br>
              • مدة تنفيذ الطلب: 15 يوم عمل من تاريخ التوقيع على العقد<br>
              • إرسال العقد للمراجعة لا يعني الاتفاق النهائي بين الطرفين<br>
              • يتم اعتماد العقد نهائياً بعد الدفع عن طريق التحويل البنكي لحساب الشركة<br>
              • الشركة ملتزمة بتقديم الخدمة وفقاً للمواصفات المتفق عليها<br>
              • العميل ملتزم بدفع المبلغ المتفق عليه في المواعيد المحددة
            </p>
          </div>

          <div style="margin-bottom: 25px; background: #ecfdf5; padding: 20px; border-right: 4px solid #10b981;">
            <h3 style="color: #065f46; margin-top: 0; font-size: 16px;">معلومات الحساب البنكي للدفع</h3>
            <p style="margin: 8px 0;"><strong>اسم البنك:</strong> مصرف الراجحي</p>
            <p style="margin: 8px 0;"><strong>اسم الحساب:</strong> شركة علي صالح الشهري القابضة</p>
            <p style="margin: 8px 0;"><strong>رقم الحساب:</strong> 161000010006086071040</p>
            <p style="margin: 8px 0;"><strong>رقم الآيبان:</strong> SA1980000161608016071040</p>
          </div>

          <div style="margin-top: 40px; border-top: 2px solid #e5e7eb; padding-top: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div style="text-align: right; width: 45%;">
                <p style="margin: 0; font-weight: bold;">الطرف الأول (الشركة)</p>
                <p style="margin: 5px 0 0 0;">شركة علي صالح الشهري القابضة</p>
                <div style="margin-top: 40px; border-bottom: 1px solid #000; width: 200px;"></div>
                <p style="margin: 5px 0 0 0; font-size: 12px;">التوقيع والختم</p>
              </div>
              <div style="text-align: right; width: 45%;">
                <p style="margin: 0; font-weight: bold;">الطرف الثاني (العميل)</p>
                <p style="margin: 5px 0 0 0;">${formData.clientName}</p>
                <div style="margin-top: 40px; border-bottom: 1px solid #000; width: 200px;"></div>
                <p style="margin: 5px 0 0 0; font-size: 12px;">التوقيع</p>
              </div>
            </div>
          </div>

          <div style="text-align: center; margin-top: 30px; font-size: 12px; color: #6b7280;">
            <p>هذا العقد صادر من شركة علي صالح الشهري القابضة - ${contractDate}</p>
          </div>
        </div>
      `;

      document.body.appendChild(tempDiv);

      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 595.28; // A4 width in points
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= 841.89; // A4 height in points

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= 841.89;
      }

      document.body.removeChild(tempDiv);
      pdf.save(`عقد-${contractNumber}-${formData.clientName}.pdf`);
      
      toast({
        title: "تم تحميل العقد بنجاح",
        description: "تم إنشاء وتحميل ملف العقد بصيغة PDF مع النص العربي بشكل صحيح",
      });
    } catch (error) {
      console.error("PDF generation error:", error);
      toast({
        title: "خطأ في تحميل العقد",
        description: "حدث خطأ أثناء إنشاء ملف PDF. يرجى المحاولة مرة أخرى.",
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
                    <Signature className="w-5 h-5 text-primary" />
                    التوقيع الرقمي *
                  </Label>
                  
                  <Card className="bg-gradient-to-br from-slate-50 to-blue-50 border-2 border-dashed border-blue-300">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="text-center text-sm text-gray-600 mb-4">
                          <Shield className="w-5 h-5 mx-auto mb-2 text-green-600" />
                          <p>التوقيع الرقمي معتمد قانونياً ومشفر بأعلى معايير الأمان</p>
                        </div>
                        
                        <div className="relative bg-white rounded-lg border-2 border-gray-200 shadow-sm">
                          <canvas
                            ref={signatureCanvasRef}
                            width={500}
                            height={250}
                            className="w-full h-auto max-w-full cursor-crosshair rounded-lg"
                            onMouseDown={startDrawing}
                            onMouseMove={draw}
                            onMouseUp={stopDrawing}
                            onMouseLeave={stopDrawing}
                            onTouchStart={startDrawing}
                            onTouchMove={draw}
                            onTouchEnd={stopDrawing}
                            style={{ touchAction: 'none' }}
                          />
                          
                          {/* زر المسح داخل المربع */}
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm"
                            onClick={clearSignature}
                            className="absolute top-2 right-2 bg-white/80 hover:bg-white border border-gray-200 text-gray-600 hover:text-gray-800"
                          >
                            <div className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                              مسح
                            </div>
                          </Button>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2 text-gray-600">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span>استخدم الماوس أو اللمس للتوقيع</span>
                          </div>
                          
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              clearSignature();
                              setTimeout(initializeSignatureCanvas, 100);
                            }}
                            className="border-blue-200 text-blue-600 hover:bg-blue-50"
                          >
                            إعادة تعيين
                          </Button>
                        </div>
                        
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <p className="text-xs text-blue-800 text-center">
                            💡 نصيحة: استخدم خط واضح ومقروء. يمكنك مسح التوقيع وإعادة كتابته حتى تحصل على النتيجة المطلوبة
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
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