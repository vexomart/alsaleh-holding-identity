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
import DigitalStamp from "@/components/DigitalStamp";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Current offers data (matching CurrentOffers.tsx)
const currentOffers = [
  {
    id: 1,
    title: "عرض الموقع الاحترافي الكامل",
    price: "15",
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

  // إنشاء عنصر HTML للعقد مع دعم كامل للغة العربية
  const createContractHTML = () => {
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

    // إنشاء div مؤقت للعقد
    const contractElement = document.createElement('div');
    contractElement.style.cssText = `
      width: 794px;
      min-height: 1400px;
      padding: 40px;
      background: white;
      font-family: 'Arial', 'Tahoma', sans-serif;
      font-size: 14px;
      line-height: 1.6;
      direction: rtl;
      text-align: right;
      color: #000;
      position: absolute;
      top: -9999px;
      left: -9999px;
      overflow: visible;
    `;

    contractElement.innerHTML = `
      <div style="border: 3px solid #0066cc; min-height: 1600px; padding: 30px; position: relative;">
        <!-- إطار داخلي -->
        <div style="border: 1px solid #ddd; min-height: 1540px; padding: 20px; position: relative;">
          
          <!-- الترويسة الرسمية للشركة -->
          <div style="background: linear-gradient(135deg, #0066cc, #004499); color: white; padding: 25px; margin: -20px -20px 30px -20px; text-align: center; border-radius: 0;">
            <!-- شعار الشركة -->
            <div style="background: white; color: #0066cc; width: 120px; height: 120px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: bold; text-align: center; line-height: 1.2; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
              <div>
                <div style="font-size: 14px;">شركة</div>
                <div style="font-size: 10px;">علي صالح الشهري</div>
                <div style="font-size: 12px;">القابضة</div>
              </div>
            </div>
            
            <h1 style="margin: 0; font-size: 28px; font-weight: bold; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">
              شركة علي صالح الشهري القابضة
            </h1>
            <div style="font-size: 16px; margin: 10px 0; opacity: 0.9;">
              للتقنية والحلول الرقمية المتقدمة
            </div>
            <div style="font-size: 14px; opacity: 0.8;">
              السجل التجاري: 4030554749 | الرياض - المملكة العربية السعودية
            </div>
            <div style="border-top: 2px solid rgba(255,255,255,0.3); margin: 15px auto 0; width: 60%;"></div>
          </div>
          
          <!-- معلومات التاريخ والعقد -->
          <div style="display: flex; justify-content: space-between; margin-bottom: 25px; background: #f8fafc; padding: 15px; border-left: 4px solid #0066cc;">
            <div>
              <div style="color: #0066cc; font-weight: bold; font-size: 16px;">رقم العقد: ${Date.now().toString().slice(-8)}</div>
              <div style="color: #666; font-size: 12px; margin-top: 5px;">تاريخ الإصدار: ${hijriDate}</div>
            </div>
            <div style="text-align: left;">
              <div style="color: #0066cc; font-weight: bold; font-size: 16px;">Contract No: ${Date.now().toString().slice(-8)}</div>
              <div style="color: #666; font-size: 12px; margin-top: 5px;">Issue Date: ${contractDate}</div>
            </div>
          </div>
          
          <!-- العنوان الرئيسي للعقد -->
          <h1 style="text-align: center; color: #0066cc; font-size: 26px; margin: 30px 0; font-weight: bold; border: 2px solid #0066cc; padding: 15px; background: linear-gradient(45deg, #f0f8ff, #e6f3ff);">
            عقد تقديم الخدمات التقنية والاستشارية
          </h1>
          
          <!-- مقدمة العقد -->
          <div style="background: #f8fafc; border: 2px solid #ddd; padding: 20px; margin: 25px 0; border-radius: 8px;">
            <p style="font-size: 14px; line-height: 1.8; margin: 0; text-align: justify;">
              بحمد الله وتوفيقه، يُبرم هذا العقد بين الطرفين المذكورين أدناه، وذلك وفقاً لأحكام النظام التجاري السعودي ولوائحه التنفيذية، 
              ونظام العمل والعمال، واللوائح والقرارات ذات العلاقة المعمول بها في المملكة العربية السعودية، 
              وقد اتفق الطرفان على الشروط والأحكام التالية:
            </p>
          </div>
          
          <!-- معلومات الطرف الأول -->
          <div style="background: #f0f8ff; border: 3px solid #0066cc; padding: 25px; margin: 25px 0; border-radius: 10px;">
            <h2 style="color: #0066cc; font-size: 18px; margin: 0 0 20px 0; font-weight: bold; border-bottom: 2px solid #0066cc; padding-bottom: 10px;">
              الطرف الأول - مقدم الخدمة (المقاول)
            </h2>
            <div style="font-size: 14px; line-height: 2;">
              <div style="display: flex; margin-bottom: 8px;"><span style="font-weight: bold; width: 150px;">اسم الشركة:</span> شركة علي صالح الشهري القابضة</div>
              <div style="display: flex; margin-bottom: 8px;"><span style="font-weight: bold; width: 150px;">السجل التجاري:</span> 4030554749</div>
              <div style="display: flex; margin-bottom: 8px;"><span style="font-weight: bold; width: 150px;">الرقم الضريبي:</span> 300445123700003</div>
              <div style="display: flex; margin-bottom: 8px;"><span style="font-weight: bold; width: 150px;">العنوان:</span> الرياض، حي النرجس، المملكة العربية السعودية</div>
              <div style="display: flex; margin-bottom: 8px;"><span style="font-weight: bold; width: 150px;">البريد الإلكتروني:</span> info@alialshehriholding.com</div>
              <div style="display: flex; margin-bottom: 8px;"><span style="font-weight: bold; width: 150px;">الهاتف:</span> +966 567 812 555</div>
              <div style="display: flex; margin-bottom: 8px;"><span style="font-weight: bold; width: 150px;">الممثل القانوني:</span> علي صالح الشهري</div>
            </div>
          </div>
          
          <!-- معلومات الطرف الثاني -->
          <div style="background: #f0f8ff; border: 3px solid #0066cc; padding: 25px; margin: 25px 0; border-radius: 10px;">
            <h2 style="color: #0066cc; font-size: 18px; margin: 0 0 20px 0; font-weight: bold; border-bottom: 2px solid #0066cc; padding-bottom: 10px;">
              الطرف الثاني - العميل (صاحب العمل)
            </h2>
            <div style="font-size: 14px; line-height: 2;">
              <div style="display: flex; margin-bottom: 8px;"><span style="font-weight: bold; width: 150px;">الاسم:</span> ${formData.clientName || 'علي صالح الشهري'}</div>
              <div style="display: flex; margin-bottom: 8px;"><span style="font-weight: bold; width: 150px;">البريد الإلكتروني:</span> ${formData.clientEmail || 'ali6c205@gmail.com'}</div>
              ${formData.clientPhone ? `<div style="display: flex; margin-bottom: 8px;"><span style="font-weight: bold; width: 150px;">الهاتف:</span> ${formData.clientPhone}</div>` : ''}
              ${formData.clientIdNumber ? `<div style="display: flex; margin-bottom: 8px;"><span style="font-weight: bold; width: 150px;">رقم الهوية:</span> ${formData.clientIdNumber}</div>` : ''}
              ${formData.clientAddress ? `<div style="display: flex; margin-bottom: 8px;"><span style="font-weight: bold; width: 150px;">العنوان:</span> ${formData.clientAddress}</div>` : ''}
              ${formData.commercialRegister ? `<div style="display: flex; margin-bottom: 8px;"><span style="font-weight: bold; width: 150px;">السجل التجاري:</span> ${formData.commercialRegister}</div>` : ''}
              ${formData.taxNumber ? `<div style="display: flex; margin-bottom: 8px;"><span style="font-weight: bold; width: 150px;">الرقم الضريبي:</span> ${formData.taxNumber}</div>` : ''}
              ${formData.authorizedPerson ? `<div style="display: flex; margin-bottom: 8px;"><span style="font-weight: bold; width: 150px;">المخول بالتوقيع:</span> ${formData.authorizedPerson}</div>` : ''}
            </div>
          </div>
          
          <!-- تفاصيل الخدمة والنطاق -->
          <div style="background: #f0fff0; border: 3px solid #009600; padding: 25px; margin: 25px 0; border-radius: 10px;">
            <h2 style="color: #009600; font-size: 18px; margin: 0 0 20px 0; font-weight: bold; border-bottom: 2px solid #009600; padding-bottom: 10px;">
              المادة الأولى: موضوع العقد ونطاق العمل
            </h2>
            <div style="font-size: 14px; line-height: 2;">
              <div style="display: flex; margin-bottom: 10px;"><span style="font-weight: bold; width: 150px;">نوع الخدمة:</span> ${selectedOfferDetails?.title || 'عرض الموقع الاحترافي الكامل'}</div>
              <div style="display: flex; margin-bottom: 10px;"><span style="font-weight: bold; width: 150px;">وصف الخدمة:</span> ${formData.serviceDescription || selectedOfferDetails?.title || 'تطوير وتصميم موقع إلكتروني متكامل'}</div>
              <div style="display: flex; margin-bottom: 10px;"><span style="font-weight: bold; width: 150px;">المتطلبات الخاصة:</span> ${formData.customRequirements || 'وفقاً للمواصفات المتفق عليها'}</div>
              
              <h3 style="color: #009600; margin: 20px 0 10px 0;">المخرجات المتوقعة:</h3>
              <ul style="margin: 10px 0; padding-right: 20px;">
                ${selectedOfferDetails?.features?.map(feature => `<li style="margin-bottom: 5px;">${feature}</li>`).join('') || 
                  '<li>تصميم وتطوير موقع إلكتروني احترافي</li><li>استضافة مجانية لمدة سنة</li><li>دعم فني شامل</li>'}
              </ul>
            </div>
          </div>
          
          <!-- المادة المالية -->
          <div style="background: #fff5f5; border: 3px solid #dc2626; padding: 25px; margin: 25px 0; border-radius: 10px;">
            <h2 style="color: #dc2626; font-size: 18px; margin: 0 0 20px 0; font-weight: bold; border-bottom: 2px solid #dc2626; padding-bottom: 10px;">
              المادة الثانية: القيمة المالية وطريقة الدفع
            </h2>
            <div style="font-size: 14px; line-height: 2;">
              <div style="display: flex; margin-bottom: 10px;"><span style="font-weight: bold; width: 200px;">القيمة الإجمالية للعقد:</span> ${selectedOfferDetails?.price || '15'} ريال سعودي</div>
              <div style="display: flex; margin-bottom: 10px;"><span style="font-weight: bold; width: 200px;">ضريبة القيمة المضافة (15%):</span> ${(parseFloat(selectedOfferDetails?.price || '15') * 0.15).toFixed(2)} ريال سعودي</div>
              <div style="display: flex; margin-bottom: 10px;"><span style="font-weight: bold; width: 200px;">إجمالي المبلغ شامل الضريبة:</span> ${(parseFloat(selectedOfferDetails?.price || '15') * 1.15).toFixed(2)} ريال سعودي</div>
              <div style="display: flex; margin-bottom: 10px;"><span style="font-weight: bold; width: 200px;">طريقة الدفع:</span> تحويل بنكي</div>
              <div style="display: flex; margin-bottom: 10px;"><span style="font-weight: bold; width: 200px;">الدفعة المقدمة (50%):</span> ${(parseFloat(selectedOfferDetails?.price || '15') * 1.15 * 0.5).toFixed(2)} ريال سعودي</div>
              <div style="display: flex; margin-bottom: 10px;"><span style="font-weight: bold; width: 200px;">الدفعة الأخيرة (50%):</span> ${(parseFloat(selectedOfferDetails?.price || '15') * 1.15 * 0.5).toFixed(2)} ريال سعودي</div>
            </div>
          </div>
          
          <!-- الجدول الزمني -->
          <div style="background: #f0f4ff; border: 3px solid #6366f1; padding: 25px; margin: 25px 0; border-radius: 10px;">
            <h2 style="color: #6366f1; font-size: 18px; margin: 0 0 20px 0; font-weight: bold; border-bottom: 2px solid #6366f1; padding-bottom: 10px;">
              المادة الثالثة: الجدول الزمني للتنفيذ
            </h2>
            <div style="font-size: 14px; line-height: 2;">
              <div style="display: flex; margin-bottom: 10px;"><span style="font-weight: bold; width: 200px;">مدة التنفيذ الإجمالية:</span> ${selectedOfferDetails?.duration || '3-4 أسابيع'}</div>
              <div style="display: flex; margin-bottom: 10px;"><span style="font-weight: bold; width: 200px;">تاريخ بداية العمل:</span> خلال 3 أيام عمل من استلام الدفعة المقدمة</div>
              <div style="display: flex; margin-bottom: 10px;"><span style="font-weight: bold; width: 200px;">تاريخ التسليم المتوقع:</span> يحدد بعد بداية العمل وفقاً للجدول الزمني</div>
              <div style="display: flex; margin-bottom: 10px;"><span style="font-weight: bold; width: 200px;">فترة الضمان:</span> 6 أشهر من تاريخ التسليم النهائي</div>
            </div>
          </div>
          
          <!-- الشروط والأحكام التفصيلية -->
          <div style="background: #fffbeb; border: 3px solid #f59e0b; padding: 25px; margin: 25px 0; border-radius: 10px;">
            <h2 style="color: #d97706; font-size: 18px; margin: 0 0 20px 0; font-weight: bold; border-bottom: 2px solid #f59e0b; padding-bottom: 10px;">
              المادة الرابعة: الشروط والأحكام العامة
            </h2>
            <div style="font-size: 13px; line-height: 1.8;">
              <h3 style="color: #d97706; margin: 15px 0 10px 0;">4.1 التزامات الطرف الأول (مقدم الخدمة):</h3>
              <ul style="margin: 10px 0; padding-right: 20px;">
                <li>تنفيذ الخدمة وفقاً للمواصفات والمعايير المتفق عليها</li>
                <li>الالتزام بالجدول الزمني المحدد للتسليم</li>
                <li>توفير الدعم الفني اللازم خلال فترة التنفيذ</li>
                <li>ضمان جودة العمل وفقاً لأفضل الممارسات المهنية</li>
                <li>المحافظة على سرية المعلومات والبيانات</li>
              </ul>
              
              <h3 style="color: #d97706; margin: 15px 0 10px 0;">4.2 التزامات الطرف الثاني (العميل):</h3>
              <ul style="margin: 10px 0; padding-right: 20px;">
                <li>دفع المبالغ المستحقة في المواعيد المحددة</li>
                <li>توفير المعلومات والبيانات اللازمة للمشروع</li>
                <li>التعاون مع فريق العمل وتقديم التغذية الراجعة</li>
                <li>مراجعة واعتماد المراحل المختلفة للمشروع</li>
              </ul>
              
              <h3 style="color: #d97706; margin: 15px 0 10px 0;">4.3 أحكام عامة:</h3>
              <ul style="margin: 10px 0; padding-right: 20px;">
                <li>يعتبر هذا العقد ساري المفعول من تاريخ توقيعه من الطرفين</li>
                <li>إرسال العقد للمراجعة لا يعني الاتفاق النهائي بين الطرفين</li>
                <li>يتم اعتماد العقد نهائياً بعد الدفع والبدء في تنفيذ الخدمة</li>
                <li>أي تعديل على هذا العقد يجب أن يكون كتابياً وموقعاً من الطرفين</li>
                <li>في حالة النزاع، يحال الأمر للجهات المختصة في المملكة العربية السعودية</li>
                <li>يخضع هذا العقد لأحكام النظام التجاري السعودي</li>
              </ul>
            </div>
          </div>
          
          <!-- معلومات الحساب البنكي -->
          <div style="background: #f0fff4; border: 3px solid #10b981; padding: 25px; margin: 25px 0; border-radius: 10px; position: relative;">
            <!-- شعار البنك -->
            <div style="position: absolute; left: 20px; top: 20px; background: #0066cc; color: white; padding: 10px 15px; border-radius: 8px; font-size: 12px; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.2);">
              <div style="font-weight: bold;">مصرف</div>
              <div style="font-weight: bold;">الراجحي</div>
            </div>
            
            <h2 style="color: #10b981; font-size: 18px; margin: 0 0 20px 0; font-weight: bold; border-bottom: 2px solid #10b981; padding-bottom: 10px;">
              المادة الخامسة: معلومات الحساب البنكي للدفع
            </h2>
            <div style="font-size: 14px; line-height: 2;">
              <div style="display: flex; margin-bottom: 10px;"><span style="font-weight: bold; width: 150px;">اسم البنك:</span> مصرف الراجحي</div>
              <div style="display: flex; margin-bottom: 10px;"><span style="font-weight: bold; width: 150px;">اسم الحساب:</span> شركة علي صالح الشهري القابضة</div>
              <div style="display: flex; margin-bottom: 10px;"><span style="font-weight: bold; width: 150px;">رقم الحساب:</span> 161000010006086071040</div>
              <div style="display: flex; margin-bottom: 10px;"><span style="font-weight: bold; width: 150px;">رقم الآيبان:</span> SA1980000161608016071040</div>
              <div style="background: #fef3c7; padding: 15px; margin-top: 15px; border-radius: 5px; border-left: 4px solid #f59e0b;">
                <strong>ملاحظة مهمة:</strong> يرجى إرسال إيصال التحويل فور إتمام الدفع لتفعيل العقد وبدء العمل.
              </div>
            </div>
          </div>
          
          <!-- منطقة التوقيعات -->
          <div style="background: #f8fafc; border: 3px solid #374151; padding: 25px; margin: 25px 0; border-radius: 10px;">
            <h2 style="color: #374151; font-size: 18px; margin: 0 0 20px 0; font-weight: bold; text-align: center;">
              التوقيعات والاعتماد
            </h2>
            <div style="display: flex; justify-content: space-between; gap: 30px;">
              <!-- توقيع الطرف الأول مع الختم الرقمي -->
              <div style="border: 3px solid #0066cc; padding: 20px; flex: 1; text-align: center; min-height: 150px; position: relative; border-radius: 8px; background: white;">
                <div style="color: #0066cc; font-weight: bold; margin-bottom: 10px; font-size: 14px;">الطرف الأول - مقدم الخدمة</div>
                <div style="font-size: 13px; margin-bottom: 10px; color: #666;">شركة علي صالح الشهري القابضة</div>
                
                <!-- الختم الرقمي -->
                <div style="margin: 15px auto; display: flex; justify-content: center;">
                  <div style="
                    width: 90px;
                    height: 90px;
                    border: 3px solid #0066cc;
                    border-radius: 50%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                    direction: rtl;
                    font-size: 7px;
                    font-weight: bold;
                    color: #0066cc;
                    font-family: Arial, sans-serif;
                    line-height: 1.1;
                    padding: 8px;
                    box-sizing: border-box;
                    position: relative;
                    background: white;
                    box-shadow: 0 2px 8px rgba(0,102,204,0.3);
                  ">
                    <div style="font-size: 8px; font-weight: bold; margin-bottom: 2px;">شركة علي صالح الشهري القابضة</div>
                    <div style="font-size: 6px; margin-bottom: 1px;">سجل تجاري</div>
                    <div style="font-size: 7px; font-weight: bold;">4030554749</div>
                    <!-- دائرة داخلية للزينة -->
                    <div style="
                      position: absolute;
                      top: 50%;
                      left: 50%;
                      transform: translate(-50%, -50%);
                      width: 70%;
                      height: 70%;
                      border: 1px solid #0066cc;
                      border-radius: 50%;
                      opacity: 0.3;
                    "></div>
                  </div>
                </div>
                
                <div style="margin-top: 10px; border-bottom: 2px solid #0066cc; width: 120px; margin-left: auto; margin-right: auto;"></div>
                <div style="font-size: 11px; margin-top: 8px; color: #666;">التوقيع والختم</div>
                <div style="font-size: 10px; margin-top: 5px; color: #999;">التاريخ: ${hijriDate}</div>
              </div>
              
              <!-- توقيع الطرف الثاني -->
              <div style="border: 3px solid #0066cc; padding: 20px; flex: 1; text-align: center; min-height: 150px; position: relative; border-radius: 8px; background: white;">
                <div style="color: #0066cc; font-weight: bold; margin-bottom: 10px; font-size: 14px;">الطرف الثاني - العميل</div>
                <div style="font-size: 13px; margin-bottom: 15px; color: #666;">${formData.clientName || 'علي صالح الشهري'}</div>
                <div id="signature-area" style="margin: 20px auto; height: 70px; display: flex; align-items: center; justify-content: center;">
                  ${(() => {
                    const canvas = signatureCanvasRef.current;
                    if (canvas) {
                      try {
                        const ctx = canvas.getContext('2d');
                        if (ctx) {
                          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                          const hasSignature = imageData.data.some((channel, index) => {
                            if (index % 4 === 3) return false;
                            return channel !== 255;
                          });
                          
                          if (hasSignature) {
                            const signatureData = canvas.toDataURL('image/png');
                            return `<img src="${signatureData}" style="max-width: 100%; max-height: 70px; border: 1px solid #ddd; border-radius: 4px;" alt="توقيع العميل" />`;
                          }
                        }
                      } catch (error) {
                        console.error('خطأ في إضافة التوقيع:', error);
                      }
                    }
                    return '<div style="border-bottom: 2px solid #0066cc; width: 120px; margin: 0 auto;"></div>';
                  })()}
                </div>
                <div style="font-size: 11px; margin-top: 8px; color: #666;">التوقيع</div>
                <div style="font-size: 10px; margin-top: 5px; color: #999;">التاريخ: ${hijriDate}</div>
              </div>
            </div>
          </div>
          
          <!-- التذييل الرسمي -->
          <div style="margin-top: 40px; border-top: 3px solid #0066cc; padding-top: 20px; text-align: center; background: #f8fafc; margin-left: -20px; margin-right: -20px; margin-bottom: -20px; padding-left: 20px; padding-right: 20px; padding-bottom: 20px;">
            <div style="color: #0066cc; font-size: 16px; font-weight: bold; margin-bottom: 10px;">
              شركة علي صالح الشهري القابضة للتقنية والحلول الرقمية
            </div>
            <div style="color: #666; font-size: 12px; margin-bottom: 5px;">
              تم إنشاء هذا العقد بتاريخ: ${contractDate} الموافق ${hijriDate}
            </div>
            <div style="color: #666; font-size: 11px;">
              العنوان: الرياض - حي النرجس | الهاتف: +966 567 812 555 | البريد الإلكتروني: info@alialshehriholding.com
            </div>
          </div>
        </div>
      </div>
    `;

    return contractElement;
  };

  // إنشاء PDF من HTML باستخدام html2canvas
  const generateContractPDF = async (): Promise<jsPDF> => {
    return new Promise(async (resolve, reject) => {
      try {
        // إنشاء عنصر HTML للعقد
        const contractElement = createContractHTML();
        
        // إضافة العنصر مؤقتاً للدوم
        document.body.appendChild(contractElement);
        
        // انتظار قصير للتأكد من تحميل كامل للعنصر
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // تحويل HTML إلى canvas بضبط الارتفاع تلقائياً
        const canvas = await html2canvas(contractElement, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          logging: false,
          scrollX: 0,
          scrollY: 0,
          windowWidth: contractElement.scrollWidth,
          windowHeight: contractElement.scrollHeight
        });
        
        // إزالة العنصر المؤقت
        document.body.removeChild(contractElement);
        
        // حساب النسبة الصحيحة لـ PDF
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        
        // إنشاء PDF بأبعاد A4
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        });
        
        // أبعاد A4 بالملليمتر
        const pdfWidth = 210;
        const pdfHeight = 297;
        
        // حساب النسبة للحفاظ على التناسب
        const ratio = Math.min(pdfWidth / (canvasWidth / 3.779), pdfHeight / (canvasHeight / 3.779));
        const imgWidth = (canvasWidth / 3.779) * ratio;
        const imgHeight = (canvasHeight / 3.779) * ratio;
        
        // توسيط الصورة في الصفحة
        const x = (pdfWidth - imgWidth) / 2;
        const y = 0;
        
        // إضافة الصورة للـ PDF
        const imgData = canvas.toDataURL('image/png', 1.0);
        pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
        
        resolve(pdf);
      } catch (error) {
        console.error('خطأ في إنشاء PDF:', error);
        reject(error);
      }
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