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

  // إنشاء عنصر HTML للعقد الرسمي المحدث
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

    // إنشاء div مؤقت للعقد بتصميم محسن
    const contractElement = document.createElement('div');
    contractElement.style.cssText = `
        width: 100%;
        max-width: 794px;
        min-height: auto;
        padding: 30px 20px;
        background: white;
        font-family: 'Tajawal', 'Arial', sans-serif;
        font-size: 12px;
        line-height: 1.7;
        direction: rtl;
        text-align: right;
        color: #000;
        position: absolute;
        top: -9999px;
        left: -9999px;
        box-sizing: border-box;
        margin: 0 auto;
        page-break-inside: auto;
        overflow: visible;
    `;

    contractElement.innerHTML = `
      <div style="border: 4px solid #0066cc; min-height: auto; padding: 50px; position: relative; background: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%);">
        <!-- إطار داخلي -->
        <div style="border: 2px solid #e2e8f0; min-height: auto; padding: 45px; position: relative; border-radius: 8px; background: white;">
          
          <!-- الترويسة الرسمية المطورة -->
          <div style="background: linear-gradient(135deg, #0066cc 0%, #1e40af 50%, #1e3a8a 100%); color: white; padding: 40px; margin: -30px -30px 50px -30px; border-radius: 0; position: relative; overflow: hidden;">
            <!-- خلفية مزخرفة -->
            <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-image: radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 2px, transparent 2px), radial-gradient(circle at 80% 50%, rgba(255,255,255,0.1) 2px, transparent 2px); background-size: 30px 30px; opacity: 0.3;"></div>
            
            <!-- المحتوى الرئيسي للترويسة -->
            <div style="position: relative; z-index: 2;">
              <!-- شعار الشركة المطور ومتجاوب -->
              <div style="background: linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%); color: #0066cc; width: 120px; height: 120px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; font-weight: bold; text-align: center; line-height: 1.1; box-shadow: 0 8px 25px rgba(0,0,0,0.4); border: 4px solid #f8fafc; position: relative;">
                <div style="text-align: center;">
                  <div style="font-size: 16px; margin-bottom: 4px;">🏢</div>
                  <div style="font-size: 11px; color: #1e40af; line-height: 1;">Ali Saleh</div>
                  <div style="font-size: 11px; color: #0066cc; line-height: 1;">Al-Shehri</div>
                  <div style="font-size: 11px; font-weight: bold; color: #1e3a8a; line-height: 1;">Holding</div>
                  <div style="font-size: 8px; margin-top: 3px; color: #64748b;">⚡ Tech Solutions ⚡</div>
                </div>
                <!-- حلقة زخرفية -->
                <div style="position: absolute; top: -6px; left: -6px; right: -6px; bottom: -6px; border: 2px solid rgba(255,255,255,0.3); border-radius: 50%;"></div>
              </div>
              
              <h1 style="margin: 0; font-size: 20px; font-weight: bold; text-shadow: 0 3px 8px rgba(0,0,0,0.5); text-align: center; letter-spacing: 0.3px; line-height: 1.2;">
                Ali Saleh Al-Shehri Holding Company
              </h1>
              <div style="font-size: 16px; margin: 15px 0; opacity: 0.95; text-align: center; font-weight: 500;">
                🚀 للتقنية والحلول الرقمية المتقدمة 🌟
              </div>
              <div style="font-size: 14px; opacity: 0.9; text-align: center; margin-bottom: 20px;">
                📍 السجل التجاري: 4030554749 | جدة - المملكة العربية السعودية 🇸🇦
              </div>
              
              <!-- جدول معلومات الشركة المطور والمتجاوب -->
              <table style="width: 100%; margin-top: 20px; border-collapse: collapse; background: rgba(255,255,255,0.15); border-radius: 10px; overflow: hidden; box-shadow: 0 6px 20px rgba(0,0,0,0.25); font-size: 11px;">
                <tr>
                  <td style="padding: 10px 8px; border: 1px solid rgba(255,255,255,0.4); color: white; font-weight: bold; text-align: center;">📞 الهاتف</td>
                  <td style="padding: 10px 8px; border: 1px solid rgba(255,255,255,0.4); color: white; text-align: center;">0555812567</td>
                  <td style="padding: 10px 8px; border: 1px solid rgba(255,255,255,0.4); color: white; font-weight: bold; text-align: center;">📧 البريد الإلكتروني</td>
                  <td style="padding: 10px 8px; border: 1px solid rgba(255,255,255,0.4); color: white; text-align: center; font-size: 10px;">info@alialshehriholding.com</td>
                </tr>
                <tr>
                  <td style="padding: 10px 8px; border: 1px solid rgba(255,255,255,0.4); color: white; font-weight: bold; text-align: center;">🏛️ الرقم الضريبي</td>
                  <td style="padding: 10px 8px; border: 1px solid rgba(255,255,255,0.4); color: white; text-align: center;">300445123700003</td>
                  <td style="padding: 10px 8px; border: 1px solid rgba(255,255,255,0.4); color: white; font-weight: bold; text-align: center;">👤 المدير العام</td>
                  <td style="padding: 15px; border: 1px solid rgba(255,255,255,0.4); color: white; text-align: center;">علي صالح الشهري</td>
                </tr>
              </table>
              
              <div style="border-top: 4px solid rgba(255,255,255,0.5); margin: 30px auto 0; width: 80%; border-radius: 2px;"></div>
            </div>
          </div>
          
          <!-- معلومات التاريخ والعقد المطورة -->
          <div style="background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); border: 4px solid #0066cc; padding: 30px; margin-bottom: 50px; border-radius: 20px; box-shadow: 0 12px 35px rgba(0,102,204,0.2);">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="width: 50%; padding: 20px; border: 3px solid #0066cc; background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%); border-radius: 12px; text-align: center; box-shadow: 0 6px 20px rgba(0,0,0,0.1);">
                  <div style="color: #0066cc; font-weight: bold; font-size: 24px; margin-bottom: 15px;">📋 رقم العقد الرسمي</div>
                  <div style="font-size: 28px; font-weight: bold; color: #1e40af; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">ASH-${Date.now().toString().slice(-8)}</div>
                  <div style="color: #64748b; font-size: 16px; margin-top: 12px;">📅 تاريخ الإصدار الهجري</div>
                  <div style="color: #334155; font-size: 18px; font-weight: bold; margin-top: 5px;">${hijriDate}</div>
                </td>
                <td style="width: 50%; padding: 20px; border: 3px solid #0066cc; background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%); border-radius: 12px; text-align: center; box-shadow: 0 6px 20px rgba(0,0,0,0.1);">
                  <div style="color: #0066cc; font-weight: bold; font-size: 24px; margin-bottom: 15px;">🗓️ Contract Number</div>
                  <div style="font-size: 28px; font-weight: bold; color: #1e40af; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">ASH-${Date.now().toString().slice(-8)}</div>
                  <div style="color: #64748b; font-size: 16px; margin-top: 12px;">📆 Issue Date (Gregorian)</div>
                  <div style="color: #334155; font-size: 18px; font-weight: bold; margin-top: 5px;">${contractDate}</div>
                </td>
              </tr>
            </table>
          </div>
          
          <!-- العنوان الرئيسي للعقد المطور -->
          <h1 style="text-align: center; color: #0066cc; font-size: 38px; margin: 60px 0; font-weight: bold; border: 5px solid #0066cc; padding: 35px; background: linear-gradient(135deg, #f0f8ff 0%, #dbeafe 30%, #bfdbfe 70%, #93c5fd 100%); border-radius: 20px; box-shadow: 0 15px 40px rgba(0,102,204,0.3); text-shadow: 0 3px 6px rgba(0,0,0,0.1);">
            📋 عقد تقديم الخدمات التقنية والاستشارية 💼
            <div style="font-size: 16px; margin-top: 15px; color: #64748b; font-weight: normal;">تحت إشراف الأنظمة السعودية المعتمدة</div>
          </h1>
          
          <!-- الأساس القانوني والنظامي -->
          <div style="background: linear-gradient(135deg, #fefce8 0%, #fef3c7 50%, #fed7aa 100%); border: 4px solid #f59e0b; padding: 30px; margin: 40px 0; border-radius: 15px; box-shadow: 0 10px 30px rgba(245,158,11,0.2);">
            <h2 style="color: #d97706; font-size: 24px; margin: 0 0 25px 0; font-weight: bold; text-align: center; border-bottom: 3px solid #f59e0b; padding-bottom: 15px;">
              ⚖️ الأساس القانوني والنظامي للعقد
            </h2>
            <div style="background: white; padding: 25px; border-radius: 12px; border-left: 6px solid #f59e0b; box-shadow: 0 6px 20px rgba(0,0,0,0.1);">
              <p style="margin: 0 0 20px 0; font-size: 16px; font-weight: bold; text-align: center; color: #d97706;">
                🏛️ يستند هذا العقد إلى الأنظمة والقوانين السعودية التالية:
              </p>
              
              <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                <tr style="background: #f59e0b; color: white;">
                  <th style="padding: 15px; border: 2px solid #d97706; text-align: center; font-weight: bold;">⚖️ النظام</th>
                  <th style="padding: 15px; border: 2px solid #d97706; text-align: center; font-weight: bold;">📜 المادة</th>
                  <th style="padding: 15px; border: 2px solid #d97706; text-align: center; font-weight: bold;">📋 التفاصيل</th>
                </tr>
                <tr>
                  <td style="padding: 12px; border: 2px solid #fed7aa; background: #fefce8; font-weight: bold;">النظام التجاري السعودي</td>
                  <td style="padding: 12px; border: 2px solid #fed7aa; background: white; text-align: center;">المادة (1)</td>
                  <td style="padding: 12px; border: 2px solid #fed7aa; background: white;">المرسوم الملكي رقم (م/32) تاريخ 1419/6/16هـ</td>
                </tr>
                <tr>
                  <td style="padding: 12px; border: 2px solid #fed7aa; background: #fefce8; font-weight: bold;">نظام العمل السعودي</td>
                  <td style="padding: 12px; border: 2px solid #fed7aa; background: white; text-align: center;">المادة (25)</td>
                  <td style="padding: 12px; border: 2px solid #fed7aa; background: white;">المرسوم الملكي رقم (م/51) تاريخ 1426/8/23هـ</td>
                </tr>
                <tr>
                  <td style="padding: 12px; border: 2px solid #fed7aa; background: #fefce8; font-weight: bold;">نظام ضريبة القيمة المضافة</td>
                  <td style="padding: 12px; border: 2px solid #fed7aa; background: white; text-align: center;">المادة (3)</td>
                  <td style="padding: 12px; border: 2px solid #fed7aa; background: white;">اللائحة التنفيذية لضريبة القيمة المضافة</td>
                </tr>
                <tr>
                  <td style="padding: 12px; border: 2px solid #fed7aa; background: #fefce8; font-weight: bold;">نظام حماية البيانات</td>
                  <td style="padding: 12px; border: 2px solid #fed7aa; background: white; text-align: center;">المادة (7)</td>
                  <td style="padding: 12px; border: 2px solid #fed7aa; background: white;">نظام حماية البيانات الشخصية 2021م</td>
                </tr>
                <tr>
                  <td style="padding: 12px; border: 2px solid #fed7aa; background: #fefce8; font-weight: bold;">نظام التحكيم السعودي</td>
                  <td style="padding: 12px; border: 2px solid #fed7aa; background: white; text-align: center;">المادة (15)</td>
                  <td style="padding: 12px; border: 2px solid #fed7aa; background: white;">قانون حل المنازعات التجارية</td>
                </tr>
              </table>
            </div>
          </div>
          
          <!-- مقدمة العقد وأطرافه -->
          <div style="background: linear-gradient(135deg, #f0f9ff 0%, #dbeafe 50%, #bfdbfe 100%); border: 4px solid #0284c7; padding: 30px; margin: 40px 0; border-radius: 15px; box-shadow: 0 10px 30px rgba(2,132,199,0.2);">
            <h2 style="color: #0284c7; font-size: 22px; margin: 0 0 25px 0; font-weight: bold; text-align: center; border-bottom: 3px solid #0284c7; padding-bottom: 15px;">
              🤝 مقدمة العقد وتعريف الأطراف المتعاقدة
            </h2>
            <div style="background: white; padding: 25px; border-radius: 12px; border-left: 6px solid #0284c7; box-shadow: 0 6px 20px rgba(0,0,0,0.1);">
              <p style="font-size: 17px; line-height: 2.2; margin: 0 0 25px 0; text-align: justify; color: #1e293b;">
                بحمد الله وتوفيقه، اتفق الطرفان المذكوران أدناه على إبرام هذا العقد، وذلك استناداً إلى الأنظمة السعودية المعمول بها، 
                وبناءً على مبدأ العدالة والشفافية في التعاملات التجارية، وحفظاً لحقوق الطرفين، والالتزام بأحكام الشريعة الإسلامية.
              </p>
              
              <table style="width: 100%; border-collapse: collapse; margin-top: 25px; box-shadow: 0 6px 20px rgba(0,0,0,0.1); border-radius: 12px; overflow: hidden;">
                <tr style="background: #0284c7; color: white;">
                  <th style="padding: 18px; border: 2px solid #0369a1; font-weight: bold; text-align: center;">🏷️ تعريف الطرف</th>
                  <th style="padding: 18px; border: 2px solid #0369a1; font-weight: bold; text-align: center;">📋 البيانات الرسمية</th>
                </tr>
                <tr>
                  <td style="padding: 15px; border: 2px solid #bfdbfe; background: #f0f9ff; font-weight: bold; text-align: center; font-size: 16px;">🏢 الطرف الأول</td>
                  <td style="padding: 15px; border: 2px solid #bfdbfe; background: white; font-size: 16px;">شركة علي صالح الشهري القابضة للتقنية والحلول الرقمية</td>
                </tr>
                <tr>
                  <td style="padding: 15px; border: 2px solid #bfdbfe; background: #f0f9ff; font-weight: bold; text-align: center; font-size: 16px;">👤 الممثل القانوني</td>
                  <td style="padding: 15px; border: 2px solid #bfdbfe; background: white; font-size: 16px;">الأستاذ / علي صالح الشهري - المدير العام</td>
                </tr>
                <tr>
                  <td style="padding: 15px; border: 2px solid #bfdbfe; background: #f0f9ff; font-weight: bold; text-align: center; font-size: 16px;">🤝 الطرف الثاني</td>
                  <td style="padding: 15px; border: 2px solid #bfdbfe; background: white; font-size: 16px;">${formData.clientName || 'العميل المحترم'}</td>
                </tr>
                <tr>
                  <td style="padding: 15px; border: 2px solid #bfdbfe; background: #f0f9ff; font-weight: bold; text-align: center; font-size: 16px;">📍 محل التعاقد</td>
                  <td style="padding: 15px; border: 2px solid #bfdbfe; background: white; font-size: 16px;">المملكة العربية السعودية - جدة</td>
                </tr>
              </table>
              
              <div style="background: linear-gradient(135deg, #0284c7, #0369a1); color: white; padding: 20px; margin: 25px 0 0 0; border-radius: 10px; text-align: center; box-shadow: 0 6px 20px rgba(2,132,199,0.3);">
                <p style="font-size: 16px; line-height: 1.8; margin: 0; font-weight: bold;">
                  ⚖️ وقد اتفق الطرفان على الشروط والأحكام التالية بموجب هذا العقد الملزم قانونياً ⚖️
                </p>
              </div>
            </div>
          </div>
          
          <!-- معلومات الطرف الأول بجدول مطور -->
          <div style="background: linear-gradient(135deg, #f0f8ff 0%, #e0e7ff 50%, #c7d2fe 100%); border: 4px solid #0066cc; padding: 30px; margin: 40px 0; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,102,204,0.2);">
            <h2 style="color: #0066cc; font-size: 22px; margin: 0 0 30px 0; font-weight: bold; border-bottom: 3px solid #0066cc; padding-bottom: 15px; text-align: center;">
              🏢 بيانات الطرف الأول - مقدم الخدمة (المقاول)
            </h2>
            
            <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 25px rgba(0,0,0,0.15);">
              <tr style="background: linear-gradient(135deg, #0066cc, #1e40af); color: white;">
                <th style="padding: 18px; border: 2px solid #1e40af; font-weight: bold; text-align: center; font-size: 16px;">📋 البيان</th>
                <th style="padding: 18px; border: 2px solid #1e40af; font-weight: bold; text-align: center; font-size: 16px;">📝 التفاصيل الرسمية</th>
              </tr>
              <tr>
                <td style="padding: 15px; border: 2px solid #e0e7ff; background: #f0f8ff; font-weight: bold; font-size: 14px;">🏢 اسم الشركة</td>
                <td style="padding: 15px; border: 2px solid #e0e7ff; background: white; font-size: 14px;">شركة علي صالح الشهري القابضة للتقنية والحلول الرقمية</td>
              </tr>
              <tr>
                <td style="padding: 15px; border: 2px solid #e0e7ff; background: #f0f8ff; font-weight: bold; font-size: 14px;">👤 الممثل القانوني</td>
                <td style="padding: 15px; border: 2px solid #e0e7ff; background: white; font-size: 14px;">الأستاذ / علي صالح الشهري - المدير العام والمالك</td>
              </tr>
              <tr>
                <td style="padding: 15px; border: 2px solid #e0e7ff; background: #f0f8ff; font-weight: bold; font-size: 14px;">📋 السجل التجاري</td>
                <td style="padding: 15px; border: 2px solid #e0e7ff; background: white; font-size: 14px; color: #dc2626; font-weight: bold;">4030554749</td>
              </tr>
              <tr>
                <td style="padding: 15px; border: 2px solid #e0e7ff; background: #f0f8ff; font-weight: bold; font-size: 14px;">🏛️ الرقم الضريبي</td>
                <td style="padding: 15px; border: 2px solid #e0e7ff; background: white; font-size: 14px; color: #dc2626; font-weight: bold;">300445123700003</td>
              </tr>
              <tr>
                <td style="padding: 15px; border: 2px solid #e0e7ff; background: #f0f8ff; font-weight: bold; font-size: 14px;">📍 العنوان الرسمي</td>
                <td style="padding: 15px; border: 2px solid #e0e7ff; background: white; font-size: 14px;">جدة، حي الروضة، شارع الأمير سلطان، المملكة العربية السعودية</td>
              </tr>
              <tr>
                <td style="padding: 15px; border: 2px solid #e0e7ff; background: #f0f8ff; font-weight: bold; font-size: 14px;">📧 البريد الإلكتروني</td>
                <td style="padding: 15px; border: 2px solid #e0e7ff; background: white; font-size: 14px; color: #2563eb;">info@alialshehriholding.com</td>
              </tr>
              <tr>
                <td style="padding: 15px; border: 2px solid #e0e7ff; background: #f0f8ff; font-weight: bold; font-size: 14px;">📞 الهاتف الرسمي</td>
                <td style="padding: 15px; border: 2px solid #e0e7ff; background: white; font-size: 14px; color: #dc2626; font-weight: bold;">0555812567</td>
              </tr>
              <tr>
                <td style="padding: 15px; border: 2px solid #e0e7ff; background: #f0f8ff; font-weight: bold; font-size: 14px;">🎯 طبيعة النشاط</td>
                <td style="padding: 15px; border: 2px solid #e0e7ff; background: white; font-size: 14px;">خدمات تقنية واستشارية وحلول رقمية متقدمة</td>
              </tr>
            </table>
          </div>
          
          <!-- معلومات الطرف الثاني بجدول مطور -->
          <div style="background: linear-gradient(135deg, #f0f8ff 0%, #e0e7ff 50%, #c7d2fe 100%); border: 4px solid #0066cc; padding: 30px; margin: 40px 0; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,102,204,0.2);">
            <h2 style="color: #0066cc; font-size: 22px; margin: 0 0 30px 0; font-weight: bold; border-bottom: 3px solid #0066cc; padding-bottom: 15px; text-align: center;">
              👤 بيانات الطرف الثاني - العميل (صاحب العمل)
            </h2>
            
            <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 25px rgba(0,0,0,0.15);">
              <tr style="background: linear-gradient(135deg, #0066cc, #1e40af); color: white;">
                <th style="padding: 18px; border: 2px solid #1e40af; font-weight: bold; text-align: center; font-size: 16px;">📋 البيان</th>
                <th style="padding: 18px; border: 2px solid #1e40af; font-weight: bold; text-align: center; font-size: 16px;">📝 التفاصيل المقدمة</th>
              </tr>
              <tr>
                <td style="padding: 15px; border: 2px solid #e0e7ff; background: #f0f8ff; font-weight: bold; font-size: 14px;">👤 الاسم الكامل</td>
                <td style="padding: 15px; border: 2px solid #e0e7ff; background: white; font-size: 14px;">${formData.clientName || 'علي صالح الشهري'}</td>
              </tr>
              <tr>
                <td style="padding: 15px; border: 2px solid #e0e7ff; background: #f0f8ff; font-weight: bold; font-size: 14px;">📧 البريد الإلكتروني</td>
                <td style="padding: 15px; border: 2px solid #e0e7ff; background: white; font-size: 14px; color: #2563eb;">${formData.clientEmail || 'ali6c205@gmail.com'}</td>
              </tr>
              ${formData.clientPhone ? `
              <tr>
                <td style="padding: 15px; border: 2px solid #e0e7ff; background: #f0f8ff; font-weight: bold; font-size: 14px;">📞 رقم الهاتف</td>
                <td style="padding: 15px; border: 2px solid #e0e7ff; background: white; font-size: 14px; color: #dc2626; font-weight: bold;">${formData.clientPhone}</td>
              </tr>` : ''}
              ${formData.clientIdNumber ? `
              <tr>
                <td style="padding: 15px; border: 2px solid #e0e7ff; background: #f0f8ff; font-weight: bold; font-size: 14px;">🆔 رقم الهوية الوطنية</td>
                <td style="padding: 15px; border: 2px solid #e0e7ff; background: white; font-size: 14px; color: #dc2626; font-weight: bold;">${formData.clientIdNumber}</td>
              </tr>` : ''}
              ${formData.clientAddress ? `
              <tr>
                <td style="padding: 15px; border: 2px solid #e0e7ff; background: #f0f8ff; font-weight: bold; font-size: 14px;">📍 العنوان</td>
                <td style="padding: 15px; border: 2px solid #e0e7ff; background: white; font-size: 14px;">${formData.clientAddress}</td>
              </tr>` : ''}
              ${formData.commercialRegister ? `
              <tr>
                <td style="padding: 15px; border: 2px solid #e0e7ff; background: #f0f8ff; font-weight: bold; font-size: 14px;">📋 السجل التجاري</td>
                <td style="padding: 15px; border: 2px solid #e0e7ff; background: white; font-size: 14px; color: #dc2626; font-weight: bold;">${formData.commercialRegister}</td>
              </tr>` : ''}
              ${formData.taxNumber ? `
              <tr>
                <td style="padding: 15px; border: 2px solid #e0e7ff; background: #f0f8ff; font-weight: bold; font-size: 14px;">🏛️ الرقم الضريبي</td>
                <td style="padding: 15px; border: 2px solid #e0e7ff; background: white; font-size: 14px; color: #dc2626; font-weight: bold;">${formData.taxNumber}</td>
              </tr>` : ''}
              ${formData.authorizedPerson ? `
              <tr>
                <td style="padding: 15px; border: 2px solid #e0e7ff; background: #f0f8ff; font-weight: bold; font-size: 14px;">✍️ المخول بالتوقيع</td>
                <td style="padding: 15px; border: 2px solid #e0e7ff; background: white; font-size: 14px;">${formData.authorizedPerson}</td>
              </tr>` : ''}
            </table>
          </div>
          
          <!-- تفاصيل الخدمة والنطاق بجدول مطور -->
          <div style="background: linear-gradient(135deg, #f0fff0 0%, #dcfce7 50%, #bbf7d0 100%); border: 4px solid #22c55e; padding: 30px; margin: 40px 0; border-radius: 15px; box-shadow: 0 10px 30px rgba(34,197,94,0.2);">
            <h2 style="color: #15803d; font-size: 22px; margin: 0 0 30px 0; font-weight: bold; border-bottom: 3px solid #22c55e; padding-bottom: 15px; text-align: center;">
              📋 المادة الأولى: موضوع العقد ونطاق العمل التفصيلي
            </h2>
            
            <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 25px rgba(0,0,0,0.15); margin-bottom: 25px;">
              <tr style="background: linear-gradient(135deg, #22c55e, #16a34a); color: white;">
                <th style="padding: 18px; border: 2px solid #16a34a; font-weight: bold; text-align: center; font-size: 16px;">🔍 عنصر الخدمة</th>
                <th style="padding: 18px; border: 2px solid #16a34a; font-weight: bold; text-align: center; font-size: 16px;">📝 التفاصيل والمواصفات</th>
              </tr>
              <tr>
                <td style="padding: 15px; border: 2px solid #dcfce7; background: #f0fff0; font-weight: bold; font-size: 14px;">🎯 نوع الخدمة الرئيسية</td>
                <td style="padding: 15px; border: 2px solid #dcfce7; background: white; font-size: 14px;">${selectedOfferDetails?.title || 'عرض الموقع الاحترافي الكامل'}</td>
              </tr>
              <tr>
                <td style="padding: 15px; border: 2px solid #dcfce7; background: #f0fff0; font-weight: bold; font-size: 14px;">📄 وصف الخدمة التفصيلي</td>
                <td style="padding: 15px; border: 2px solid #dcfce7; background: white; font-size: 14px;">${formData.serviceDescription || selectedOfferDetails?.title || 'تطوير وتصميم موقع إلكتروني متكامل'}</td>
              </tr>
              <tr>
                <td style="padding: 15px; border: 2px solid #dcfce7; background: #f0fff0; font-weight: bold; font-size: 14px;">⚙️ المتطلبات الخاصة</td>
                <td style="padding: 15px; border: 2px solid #dcfce7; background: white; font-size: 14px;">${formData.customRequirements || 'وفقاً للمواصفات المتفق عليها والمعايير الدولية'}</td>
              </tr>
              <tr>
                <td style="padding: 15px; border: 2px solid #dcfce7; background: #f0fff0; font-weight: bold; font-size: 14px;">📅 مدة التنفيذ</td>
                <td style="padding: 15px; border: 2px solid #dcfce7; background: white; font-size: 14px; color: #dc2626; font-weight: bold;">${selectedOfferDetails?.duration || '3-4 أسابيع'}</td>
              </tr>
              <tr>
                <td style="padding: 15px; border: 2px solid #dcfce7; background: #f0fff0; font-weight: bold; font-size: 14px;">🏆 معايير الجودة</td>
                <td style="padding: 15px; border: 2px solid #dcfce7; background: white; font-size: 14px;">معايير الجودة العالمية ISO 9001 ومعايير الويب W3C</td>
              </tr>
            </table>
            
            <h3 style="color: #15803d; margin: 25px 0 20px 0; font-size: 18px; font-weight: bold; text-align: center; background: rgba(34,197,94,0.1); padding: 15px; border-radius: 8px;">
              🎯 المخرجات والتسليمات المتوقعة
            </h3>
            <div style="background: white; padding: 20px; border-radius: 12px; border-left: 6px solid #22c55e; box-shadow: 0 6px 20px rgba(0,0,0,0.1);">
              <table style="width: 100%; border-collapse: collapse;">
                <tr style="background: #22c55e; color: white;">
                  <th style="padding: 12px; border: 1px solid #16a34a; text-align: center; font-weight: bold;">✅ المخرج</th>
                  <th style="padding: 12px; border: 1px solid #16a34a; text-align: center; font-weight: bold;">📋 التفاصيل</th>
                </tr>
                ${selectedOfferDetails?.features?.map(feature => `
                <tr>
                  <td style="padding: 10px; border: 1px solid #dcfce7; background: #f0fff0; font-weight: bold; text-align: center;">✅</td>
                  <td style="padding: 10px; border: 1px solid #dcfce7; background: white;">${feature}</td>
                </tr>
                `).join('') || `
                <tr>
                  <td style="padding: 10px; border: 1px solid #dcfce7; background: #f0fff0; font-weight: bold; text-align: center;">✅</td>
                  <td style="padding: 10px; border: 1px solid #dcfce7; background: white;">تطوير وتصميم موقع إلكتروني متكامل</td>
                </tr>
                `}
              </table>
            </div>
          </div>
          
          <!-- القيمة المالية والدفع بجدول مطور -->
          <div style="background: linear-gradient(135deg, #fff7ed 0%, #fed7aa 50%, #fb923c 100%); border: 4px solid #ea580c; padding: 30px; margin: 40px 0; border-radius: 15px; box-shadow: 0 10px 30px rgba(234,88,12,0.2);">
            <h2 style="color: #ea580c; font-size: 22px; margin: 0 0 30px 0; font-weight: bold; border-bottom: 3px solid #ea580c; padding-bottom: 15px; text-align: center;">
              💰 المادة الثانية: القيمة المالية وشروط الدفع التفصيلية
            </h2>
            
            <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 25px rgba(0,0,0,0.15);">
              <tr style="background: linear-gradient(135deg, #ea580c, #dc2626); color: white;">
                <th style="padding: 18px; border: 2px solid #dc2626; font-weight: bold; text-align: center; font-size: 16px;">💸 البيان المالي</th>
                <th style="padding: 18px; border: 2px solid #dc2626; font-weight: bold; text-align: center; font-size: 16px;">💵 القيمة بالريال السعودي</th>
              </tr>
              <tr>
                <td style="padding: 15px; border: 2px solid #fed7aa; background: #fff7ed; font-weight: bold; font-size: 14px;">💼 قيمة الخدمة الأساسية</td>
                <td style="padding: 15px; border: 2px solid #fed7aa; background: white; font-weight: bold; color: #ea580c; font-size: 16px; text-align: center;">${selectedOfferDetails?.price || '15'} ريال سعودي</td>
              </tr>
              <tr>
                <td style="padding: 15px; border: 2px solid #fed7aa; background: #fff7ed; font-weight: bold; font-size: 14px;">🏛️ ضريبة القيمة المضافة (15%)</td>
                <td style="padding: 15px; border: 2px solid #fed7aa; background: white; font-weight: bold; color: #dc2626; font-size: 16px; text-align: center;">${(parseFloat(selectedOfferDetails?.price || '15') * 0.15).toFixed(2)} ريال سعودي</td>
              </tr>
              <tr style="background: linear-gradient(135deg, #f97316, #ea580c); color: white;">
                <td style="padding: 15px; border: 2px solid #dc2626; font-weight: bold; font-size: 16px;">💯 إجمالي المبلغ شامل الضريبة</td>
                <td style="padding: 15px; border: 2px solid #dc2626; font-weight: bold; font-size: 18px; text-align: center;">${(parseFloat(selectedOfferDetails?.price || '15') * 1.15).toFixed(2)} ريال سعودي</td>
              </tr>
              <tr>
                <td style="padding: 15px; border: 2px solid #fed7aa; background: #fff7ed; font-weight: bold; font-size: 14px;">🏦 طريقة الدفع المعتمدة</td>
                <td style="padding: 15px; border: 2px solid #fed7aa; background: white; font-size: 14px; text-align: center;">تحويل بنكي مباشر</td>
              </tr>
              <tr style="background: rgba(220,38,38,0.1);">
                <td style="padding: 15px; border: 2px solid #fed7aa; background: #fff7ed; font-weight: bold; font-size: 14px;">💳 الدفعة المقدمة (50%)</td>
                <td style="padding: 15px; border: 2px solid #fed7aa; background: white; font-weight: bold; color: #dc2626; font-size: 16px; text-align: center;">${(parseFloat(selectedOfferDetails?.price || '15') * 1.15 * 0.5).toFixed(2)} ريال سعودي</td>
              </tr>
              <tr style="background: rgba(34,197,94,0.1);">
                <td style="padding: 15px; border: 2px solid #fed7aa; background: #fff7ed; font-weight: bold; font-size: 14px;">✅ الدفعة النهائية (50%)</td>
                <td style="padding: 15px; border: 2px solid #fed7aa; background: white; font-weight: bold; color: #22c55e; font-size: 16px; text-align: center;">${(parseFloat(selectedOfferDetails?.price || '15') * 1.15 * 0.5).toFixed(2)} ريال سعودي</td>
              </tr>
            </table>
            
            <div style="background: rgba(234,88,12,0.1); border: 2px solid #ea580c; padding: 20px; margin-top: 20px; border-radius: 10px;">
              <h4 style="color: #ea580c; margin: 0 0 15px 0; font-size: 16px; font-weight: bold; text-align: center;">📋 شروط الدفع الإضافية</h4>
              <ul style="margin: 0; padding-right: 20px; line-height: 2; color: #7c2d12;">
                <li>💳 الدفعة المقدمة مطلوبة قبل البدء في العمل</li>
                <li>✅ الدفعة النهائية تستحق عند التسليم النهائي</li>
                <li>🏦 جميع التحويلات تتم للحساب البنكي المعتمد</li>
                <li>📄 إرسال إيصال التحويل إجباري لتفعيل العقد</li>
              </ul>
            </div>
          </div>
          
          <!-- الجدول الزمني للتنفيذ -->
          <div style="background: linear-gradient(135deg, #f0f4ff 0%, #e0e7ff 50%, #c7d2fe 100%); border: 4px solid #6366f1; padding: 30px; margin: 40px 0; border-radius: 15px; box-shadow: 0 10px 30px rgba(99,102,241,0.2);">
            <h2 style="color: #4338ca; font-size: 22px; margin: 0 0 30px 0; font-weight: bold; border-bottom: 3px solid #6366f1; padding-bottom: 15px; text-align: center;">
              ⏰ المادة الثالثة: الجدول الزمني للتنفيذ والتسليم
            </h2>
            
            <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 25px rgba(0,0,0,0.15);">
              <tr style="background: linear-gradient(135deg, #6366f1, #4338ca); color: white;">
                <th style="padding: 18px; border: 2px solid #4338ca; font-weight: bold; text-align: center; font-size: 16px;">📅 المرحلة الزمنية</th>
                <th style="padding: 18px; border: 2px solid #4338ca; font-weight: bold; text-align: center; font-size: 16px;">⏳ المدة المحددة</th>
              </tr>
              <tr>
                <td style="padding: 15px; border: 2px solid #e0e7ff; background: #f0f4ff; font-weight: bold; font-size: 14px;">🎯 مدة التنفيذ الإجمالية</td>
                <td style="padding: 15px; border: 2px solid #e0e7ff; background: white; font-size: 14px; color: #dc2626; font-weight: bold; text-align: center;">${selectedOfferDetails?.duration || '3-4 أسابيع'}</td>
              </tr>
              <tr>
                <td style="padding: 15px; border: 2px solid #e0e7ff; background: #f0f4ff; font-weight: bold; font-size: 14px;">🚀 تاريخ بداية العمل</td>
                <td style="padding: 15px; border: 2px solid #e0e7ff; background: white; font-size: 14px; text-align: center;">خلال 3 أيام عمل من استلام الدفعة المقدمة</td>
              </tr>
              <tr>
                <td style="padding: 15px; border: 2px solid #e0e7ff; background: #f0f4ff; font-weight: bold; font-size: 14px;">📋 تاريخ التسليم المبدئي</td>
                <td style="padding: 15px; border: 2px solid #e0e7ff; background: white; font-size: 14px; text-align: center;">يحدد بعد بداية العمل وفقاً للجدول الزمني المعتمد</td>
              </tr>
              <tr>
                <td style="padding: 15px; border: 2px solid #e0e7ff; background: #f0f4ff; font-weight: bold; font-size: 14px;">✅ التسليم النهائي</td>
                <td style="padding: 15px; border: 2px solid #e0e7ff; background: white; font-size: 14px; text-align: center;">بعد اعتماد العميل واستلام الدفعة النهائية</td>
              </tr>
              <tr>
                <td style="padding: 15px; border: 2px solid #e0e7ff; background: #f0f4ff; font-weight: bold; font-size: 14px;">🛡️ فترة الضمان</td>
                <td style="padding: 15px; border: 2px solid #e0e7ff; background: white; font-size: 14px; color: #22c55e; font-weight: bold; text-align: center;">6 أشهر من تاريخ التسليم النهائي</td>
              </tr>
              <tr>
                <td style="padding: 15px; border: 2px solid #e0e7ff; background: #f0f4ff; font-weight: bold; font-size: 14px;">📞 الدعم الفني</td>
                <td style="padding: 15px; border: 2px solid #e0e7ff; background: white; font-size: 14px; text-align: center;">متاح 24/7 خلال فترة الضمان</td>
              </tr>
            </table>
          </div>

          <!-- تنبيه هام: سريان العقد وسياسة الاسترداد -->
          <div style="background: linear-gradient(135deg, #dc2626, #b91c1c); color: white; border: 4px solid #991b1b; padding: 35px; margin: 40px 0; border-radius: 20px; position: relative; box-shadow: 0 15px 40px rgba(220, 38, 38, 0.4);">
            <!-- خلفية زخرفية للتنبيه -->
            <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-image: radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 2px, transparent 2px); background-size: 20px 20px; opacity: 0.3; border-radius: 16px;"></div>
            
            <div style="position: relative; z-index: 2;">
              <h2 style="color: white; font-size: 28px; margin: 0 0 30px 0; font-weight: bold; text-align: center; text-shadow: 0 3px 6px rgba(0,0,0,0.6);">
                🚨 تنبيه هام: سريان العقد وسياسة الاسترداد 🚨
              </h2>
              
              <div style="background: rgba(255,255,255,0.15); border: 3px solid rgba(255,255,255,0.4); padding: 25px; border-radius: 15px; margin-bottom: 25px;">
                <div style="margin-bottom: 25px;">
                  <h3 style="color: #fef2f2; font-size: 20px; margin: 0 0 20px 0; font-weight: bold; border-bottom: 2px solid rgba(255,255,255,0.5); padding-bottom: 10px;">
                    ✅ شروط سريان العقد وبدء التنفيذ:
                  </h3>
                  <table style="width: 100%; border-collapse: collapse; background: rgba(255,255,255,0.1); border-radius: 10px; overflow: hidden;">
                    <tr>
                      <td style="padding: 12px; border: 1px solid rgba(255,255,255,0.3); font-weight: bold;">📋 سريان العقد</td>
                      <td style="padding: 12px; border: 1px solid rgba(255,255,255,0.3);">يعتبر ساري المفعول وموافق عليه نهائياً فور تحويل المبلغ</td>
                    </tr>
                    <tr>
                      <td style="padding: 12px; border: 1px solid rgba(255,255,255,0.3); font-weight: bold;">📄 إيصال التحويل</td>
                      <td style="padding: 12px; border: 1px solid rgba(255,255,255,0.3);">يجب إرساله خلال 24 ساعة لتفعيل العقد</td>
                    </tr>
                    <tr>
                      <td style="padding: 12px; border: 1px solid rgba(255,255,255,0.3); font-weight: bold;">🚀 بدء العمل</td>
                      <td style="padding: 12px; border: 1px solid rgba(255,255,255,0.3);">فوراً بعد تأكيد استلام المبلغ المحول</td>
                    </tr>
                    <tr style="background: rgba(255,255,255,0.2);">
                      <td style="padding: 12px; border: 1px solid rgba(255,255,255,0.3); font-weight: bold;">💰 المبلغ المطلوب</td>
                      <td style="padding: 12px; border: 1px solid rgba(255,255,255,0.3); font-weight: bold; font-size: 16px;">${(parseFloat(selectedOfferDetails?.price || '15') * 1.15 * 0.5).toFixed(2)} ريال سعودي (الدفعة المقدمة)</td>
                    </tr>
                  </table>
                </div>
                
                <div style="border-top: 3px solid rgba(255,255,255,0.4); padding-top: 25px;">
                  <h3 style="color: #fef2f2; font-size: 20px; margin: 0 0 20px 0; font-weight: bold; border-bottom: 2px solid rgba(255,255,255,0.5); padding-bottom: 10px;">
                    ❌ سياسة الاسترداد الصارمة:
                  </h3>
                  <table style="width: 100%; border-collapse: collapse; background: rgba(255,255,255,0.1); border-radius: 10px; overflow: hidden;">
                    <tr>
                      <td style="padding: 12px; border: 1px solid rgba(255,255,255,0.3); font-weight: bold;">🚫 عدم الاسترداد</td>
                      <td style="padding: 12px; border: 1px solid rgba(255,255,255,0.3);">لا يمكن استرداد المبلغ بأي حال من الأحوال بعد بدء العمل</td>
                    </tr>
                    <tr>
                      <td style="padding: 12px; border: 1px solid rgba(255,255,255,0.3); font-weight: bold;">📝 الموافقة المسبقة</td>
                      <td style="padding: 12px; border: 1px solid rgba(255,255,255,0.3);">الاسترداد يتطلب موافقة خطية من الشركة فقط</td>
                    </tr>
                    <tr>
                      <td style="padding: 12px; border: 1px solid rgba(255,255,255,0.3); font-weight: bold;">⚠️ إلغاء المشروع</td>
                      <td style="padding: 12px; border: 1px solid rgba(255,255,255,0.3);">في حالة الإلغاء من العميل، لا يسترد أي مبلغ</td>
                    </tr>
                    <tr>
                      <td style="padding: 12px; border: 1px solid rgba(255,255,255,0.3); font-weight: bold;">📚 المسؤولية</td>
                      <td style="padding: 12px; border: 1px solid rgba(255,255,255,0.3);">العميل مسؤول عن قراءة وفهم جميع الشروط</td>
                    </tr>
                    <tr style="background: rgba(255,255,255,0.2);">
                      <td style="padding: 12px; border: 1px solid rgba(255,255,255,0.3); font-weight: bold;">✅ القبول النهائي</td>
                      <td style="padding: 12px; border: 1px solid rgba(255,255,255,0.3); font-weight: bold;">التوقيع يعني القبول التام لسياسة عدم الاسترداد</td>
                    </tr>
                  </table>
                </div>
              </div>
              
              <div style="background: rgba(255,255,255,0.95); color: #dc2626; padding: 20px; border-radius: 12px; text-align: center; font-weight: bold; border: 3px solid rgba(255,255,255,0.6); box-shadow: 0 6px 20px rgba(0,0,0,0.3);">
                <span style="font-size: 18px;">⚠️ بالتوقيع أدناه، فإنك توافق على جميع الشروط والأحكام المذكورة أعلاه وتتحمل المسؤولية القانونية الكاملة ⚠️</span>
              </div>
            </div>
          </div>
          
          <!-- معلومات الحساب البنكي المطورة -->
          <div style="background: linear-gradient(135deg, #f0fff4 0%, #dcfce7 50%, #bbf7d0 100%); border: 4px solid #22c55e; padding: 30px; margin: 40px 0; border-radius: 15px; position: relative; box-shadow: 0 10px 30px rgba(34,197,94,0.2);">
            <!-- شعار البنك المطور -->
            <div style="position: absolute; left: 25px; top: 25px; background: linear-gradient(135deg, #0066cc, #1e40af); color: white; padding: 15px 20px; border-radius: 12px; font-size: 14px; text-align: center; box-shadow: 0 8px 25px rgba(0,102,204,0.4); border: 3px solid #f8fafc;">
              <div style="font-weight: bold; font-size: 16px;">🏦 مصرف</div>
              <div style="font-weight: bold; font-size: 16px;">الراجحي</div>
              <div style="font-size: 10px; margin-top: 5px; opacity: 0.9;">معتمد رسمياً</div>
            </div>
            
            <h2 style="color: #15803d; font-size: 22px; margin: 0 0 30px 0; font-weight: bold; border-bottom: 3px solid #22c55e; padding-bottom: 15px; text-align: center;">
              💳 المادة الخامسة: معلومات الحساب البنكي المعتمد للدفع
            </h2>
            
            <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 25px rgba(0,0,0,0.15);">
              <tr style="background: linear-gradient(135deg, #22c55e, #16a34a); color: white;">
                <th style="padding: 18px; border: 2px solid #16a34a; font-weight: bold; text-align: center; font-size: 16px;">🏦 البيان البنكي</th>
                <th style="padding: 18px; border: 2px solid #16a34a; font-weight: bold; text-align: center; font-size: 16px;">📋 التفاصيل المصرفية</th>
              </tr>
              <tr>
                <td style="padding: 15px; border: 2px solid #dcfce7; background: #f0fff4; font-weight: bold; font-size: 14px;">🏦 اسم البنك</td>
                <td style="padding: 15px; border: 2px solid #dcfce7; background: white; font-size: 14px; font-weight: bold; color: #0066cc;">مصرف الراجحي (Al Rajhi Bank)</td>
              </tr>
              <tr>
                <td style="padding: 15px; border: 2px solid #dcfce7; background: #f0fff4; font-weight: bold; font-size: 14px;">👤 اسم صاحب الحساب</td>
                <td style="padding: 15px; border: 2px solid #dcfce7; background: white; font-size: 14px; font-weight: bold;">شركة علي صالح الشهري القابضة</td>
              </tr>
              <tr>
                <td style="padding: 15px; border: 2px solid #dcfce7; background: #f0fff4; font-weight: bold; font-size: 14px;">💳 رقم الحساب</td>
                <td style="padding: 15px; border: 2px solid #dcfce7; background: white; font-size: 16px; font-weight: bold; color: #dc2626; text-align: center;">161000010006086071040</td>
              </tr>
              <tr>
                <td style="padding: 15px; border: 2px solid #dcfce7; background: #f0fff4; font-weight: bold; font-size: 14px;">🌐 رقم الآيبان الدولي</td>
                <td style="padding: 15px; border: 2px solid #dcfce7; background: white; font-size: 16px; font-weight: bold; color: #dc2626; text-align: center;">SA1980000161608016071040</td>
              </tr>
              <tr>
                <td style="padding: 15px; border: 2px solid #dcfce7; background: #f0fff4; font-weight: bold; font-size: 14px;">💱 العملة المعتمدة</td>
                <td style="padding: 15px; border: 2px solid #dcfce7; background: white; font-size: 14px; text-align: center;">الريال السعودي (SAR)</td>
              </tr>
            </table>
            
            <div style="background: linear-gradient(135deg, #fef3c7, #fed7aa); border: 3px solid #f59e0b; padding: 20px; margin-top: 25px; border-radius: 12px; box-shadow: 0 6px 20px rgba(245,158,11,0.2);">
              <h4 style="color: #d97706; margin: 0 0 15px 0; font-size: 18px; font-weight: bold; text-align: center;">⚠️ تعليمات هامة للتحويل البنكي</h4>
              <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden;">
                <tr>
                  <td style="padding: 10px; border: 1px solid #fed7aa; background: #fef3c7; font-weight: bold; width: 30%;">📄 إيصال التحويل</td>
                  <td style="padding: 10px; border: 1px solid #fed7aa; background: white;">يجب إرساله فور إتمام التحويل لتفعيل العقد فوراً</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border: 1px solid #fed7aa; background: #fef3c7; font-weight: bold;">⏰ مدة التفعيل</td>
                  <td style="padding: 10px; border: 1px solid #fed7aa; background: white;">العقد يُفعّل خلال 24 ساعة من استلام إيصال التحويل</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border: 1px solid #fed7aa; background: #fef3c7; font-weight: bold;">📧 طريقة الإرسال</td>
                  <td style="padding: 10px; border: 1px solid #fed7aa; background: white;">عبر البريد الإلكتروني أو الواتساب الرسمي للشركة</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border: 1px solid #fed7aa; background: #fef3c7; font-weight: bold;">🚀 بدء العمل</td>
                  <td style="padding: 10px; border: 1px solid #fed7aa; background: white;">يبدأ خلال 3 أيام عمل من تأكيد استلام المبلغ</td>
                </tr>
              </table>
            </div>
          </div>
          
          <!-- منطقة التوقيعات والاعتماد المطورة -->
          <div style="background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%); border: 4px solid #475569; padding: 35px; margin: 40px 0; border-radius: 15px; box-shadow: 0 12px 35px rgba(71,85,105,0.3);">
            <h2 style="color: #334155; font-size: 24px; margin: 0 0 35px 0; font-weight: bold; text-align: center; border-bottom: 3px solid #475569; padding-bottom: 15px;">
              ✍️ التوقيعات والاعتماد النهائي للعقد
            </h2>
            <div style="display: flex; justify-content: space-between; gap: 40px;">
              <!-- توقيع الطرف الأول مع الختم الرقمي المطور -->
              <div style="border: 4px solid #0066cc; padding: 25px; flex: 1; text-align: center; min-height: 200px; position: relative; border-radius: 15px; background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%); box-shadow: 0 8px 25px rgba(0,102,204,0.2);">
                <div style="color: #0066cc; font-weight: bold; margin-bottom: 15px; font-size: 16px; border-bottom: 2px solid #0066cc; padding-bottom: 8px;">الطرف الأول - مقدم الخدمة</div>
                <div style="font-size: 14px; margin-bottom: 15px; color: #64748b; font-weight: bold;">شركة علي صالح الشهري القابضة</div>
                
                <!-- الختم الرقمي المطور -->
                <div style="margin: 20px auto; display: flex; justify-content: center;">
                  <div style="
                    width: 110px;
                    height: 110px;
                    border: 4px solid #0066cc;
                    border-radius: 50%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                    direction: rtl;
                    font-size: 8px;
                    font-weight: bold;
                    color: #0066cc;
                    font-family: Arial, sans-serif;
                    line-height: 1.2;
                    padding: 10px;
                    box-sizing: border-box;
                    position: relative;
                    background: linear-gradient(135deg, #ffffff 0%, #f0f8ff 100%);
                    box-shadow: 0 8px 25px rgba(0,102,204,0.4);
                  ">
                    <div style="font-size: 9px; font-weight: bold; margin-bottom: 3px;">شركة علي صالح الشهري القابضة</div>
                    <div style="font-size: 7px; margin-bottom: 2px; color: #64748b;">سجل تجاري</div>
                    <div style="font-size: 8px; font-weight: bold; color: #dc2626;">4030554749</div>
                    <div style="font-size: 6px; margin-top: 2px; color: #64748b;">جدة - السعودية</div>
                    <!-- دوائر زخرفية -->
                    <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 80%; height: 80%; border: 2px solid #0066cc; border-radius: 50%; opacity: 0.3;"></div>
                    <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 60%; height: 60%; border: 1px solid #0066cc; border-radius: 50%; opacity: 0.2;"></div>
                  </div>
                </div>
                
                <div style="margin-top: 15px; border-bottom: 3px solid #0066cc; width: 150px; margin-left: auto; margin-right: auto;"></div>
                <div style="font-size: 12px; margin-top: 10px; color: #64748b; font-weight: bold;">التوقيع والختم الرسمي</div>
                <div style="font-size: 11px; margin-top: 8px; color: #94a3b8;">التاريخ: ${hijriDate}</div>
              </div>
              
              <!-- توقيع الطرف الثاني المطور -->
              <div style="border: 4px solid #0066cc; padding: 25px; flex: 1; text-align: center; min-height: 200px; position: relative; border-radius: 15px; background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%); box-shadow: 0 8px 25px rgba(0,102,204,0.2);">
                <div style="color: #0066cc; font-weight: bold; margin-bottom: 15px; font-size: 16px; border-bottom: 2px solid #0066cc; padding-bottom: 8px;">الطرف الثاني - العميل</div>
                <div style="font-size: 14px; margin-bottom: 20px; color: #64748b; font-weight: bold;">${formData.clientName || 'العميل المحترم'}</div>
                <div id="signature-area" style="margin: 25px auto; height: 90px; display: flex; align-items: center; justify-content: center; border: 2px dashed #cbd5e1; border-radius: 8px; background: #f8fafc;">
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
                            const dataURL = canvas.toDataURL();
                            return `<img src="${dataURL}" style="max-width: 140px; max-height: 80px; border-radius: 4px;" />`;
                          }
                        }
                      } catch (error) {
                        console.error('Error getting signature:', error);
                      }
                    }
                    return '<div style="color: #94a3b8; font-size: 12px;">منطقة التوقيع الرقمي</div>';
                  })()}
                </div>
                <div style="margin-top: 15px; border-bottom: 3px solid #0066cc; width: 150px; margin-left: auto; margin-right: auto;"></div>
                <div style="font-size: 12px; margin-top: 10px; color: #64748b; font-weight: bold;">توقيع العميل</div>
                <div style="font-size: 11px; margin-top: 8px; color: #94a3b8;">التاريخ: ${contractDate}</div>
              </div>
            </div>
            
            <!-- اعتماد نهائي -->
            <div style="background: linear-gradient(135deg, #0066cc, #1e40af); color: white; padding: 25px; margin-top: 30px; border-radius: 12px; text-align: center; box-shadow: 0 8px 25px rgba(0,102,204,0.4);">
              <h3 style="margin: 0 0 15px 0; font-size: 18px; font-weight: bold;">🏛️ اعتماد العقد الرسمي</h3>
              <p style="margin: 0; font-size: 14px; line-height: 1.8;">
                هذا العقد معتمد ومصدق وفقاً للأنظمة السعودية المعمول بها، وهو ملزم قانونياً لكلا الطرفين 
                من تاريخ التوقيع والدفع، ويخضع لاختصاص المحاكم السعودية في جدة.
              </p>
              <div style="margin-top: 15px; font-size: 12px; opacity: 0.9;">
                تم إنشاء هذا العقد بواسطة النظام الإلكتروني المعتمد | ${new Date().toLocaleString('ar-SA')}
              </div>
            </div>
          </div>
          
        </div>
      </div>
    `;

    return contractElement;
  };

  // إنشاء وإرجاع PDF للعقد
  const generateContractPDF = () => {
    return new Promise<jsPDF>((resolve, reject) => {
      try {
        // إنشاء عنصر العقد
        const contractElement = createContractHTML();
        
        // إضافة العنصر للصفحة مؤقتاً
        document.body.appendChild(contractElement);
        
        // انتظار قصير للتأكد من تحميل كامل للعنصر
        setTimeout(async () => {
          try {
            // تحويل HTML إلى canvas بإعدادات محسنة
            const canvas = await html2canvas(contractElement, {
              scale: 3,
              useCORS: true,
              allowTaint: true,
              backgroundColor: '#ffffff',
              logging: false,
              scrollX: 0,
              scrollY: 0,
              width: contractElement.scrollWidth,
              height: contractElement.scrollHeight,
              windowWidth: contractElement.scrollWidth,
              windowHeight: contractElement.scrollHeight,
              imageTimeout: 15000,
              removeContainer: true
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
              format: 'a3',
              compress: false
            });
            
            // أبعاد A3 بالملليمتر
            const pdfWidth = 297;
            const pdfHeight = 420;
            
            // حساب النسبة لتغطية كامل الصفحة
            const scaleX = pdfWidth / (canvasWidth / 3.779);
            const scaleY = pdfHeight / (canvasHeight / 3.779);
            const scale = Math.max(scaleX, scaleY) * 0.98; // أكبر نسبة لملء الصفحة
            
            const imgWidth = (canvasWidth / 3.779) * scale;
            const imgHeight = (canvasHeight / 3.779) * scale;
            
            // توسيط الصورة في الصفحة
            const x = (pdfWidth - imgWidth) / 2;
            const y = (pdfHeight - imgHeight) / 2;
            
            // إضافة الصورة للـ PDF بجودة عالية لملء الصفحة بالكامل
            const imgData = canvas.toDataURL('image/png', 1.0);
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
            
            resolve(pdf);
          } catch (error) {
            console.error('خطأ في إنشاء PDF:', error);
            reject(error);
          }
        }, 500);
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
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-4">
            العقود الرقمية المطورة
          </h1>
          <p className="text-xl text-muted-foreground">
            إنشاء وتوقيع العقود الرسمية بشكل إلكتروني آمن ومعتمد
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* نموذج العقد */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-6 w-6" />
                بيانات العقد
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* نوع العميل */}
                <div>
                  <Label htmlFor="clientType">نوع العميل *</Label>
                  <Select value={formData.clientType} onValueChange={(value) => handleInputChange("clientType", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر نوع العميل" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="individual">فرد</SelectItem>
                      <SelectItem value="company">شركة</SelectItem>
                      <SelectItem value="organization">مؤسسة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* البيانات الأساسية */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="clientName">الاسم الكامل *</Label>
                    <Input
                      id="clientName"
                      value={formData.clientName}
                      onChange={(e) => handleInputChange("clientName", e.target.value)}
                      placeholder="أدخل الاسم الكامل"
                      required
                    />
                  </div>
                  <div>
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
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="clientPhone">رقم الهاتف *</Label>
                    <Input
                      id="clientPhone"
                      value={formData.clientPhone}
                      onChange={(e) => handleInputChange("clientPhone", e.target.value)}
                      placeholder="05xxxxxxxx"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="clientIdNumber">رقم الهوية/الإقامة</Label>
                    <Input
                      id="clientIdNumber"
                      value={formData.clientIdNumber}
                      onChange={(e) => handleInputChange("clientIdNumber", e.target.value)}
                      placeholder="1234567890"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="clientAddress">العنوان</Label>
                  <Input
                    id="clientAddress"
                    value={formData.clientAddress}
                    onChange={(e) => handleInputChange("clientAddress", e.target.value)}
                    placeholder="المدينة، الحي، الشارع"
                  />
                </div>

                {formData.clientType === "company" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="commercialRegister">السجل التجاري</Label>
                      <Input
                        id="commercialRegister"
                        value={formData.commercialRegister}
                        onChange={(e) => handleInputChange("commercialRegister", e.target.value)}
                        placeholder="1234567890"
                      />
                    </div>
                    <div>
                      <Label htmlFor="taxNumber">الرقم الضريبي</Label>
                      <Input
                        id="taxNumber"
                        value={formData.taxNumber}
                        onChange={(e) => handleInputChange("taxNumber", e.target.value)}
                        placeholder="300123456789003"
                      />
                    </div>
                  </div>
                )}

                {formData.clientType === "company" && (
                  <div>
                    <Label htmlFor="authorizedPerson">المخول بالتوقيع</Label>
                    <Input
                      id="authorizedPerson"
                      value={formData.authorizedPerson}
                      onChange={(e) => handleInputChange("authorizedPerson", e.target.value)}
                      placeholder="اسم المخول بالتوقيع"
                    />
                  </div>
                )}

                {/* اختيار العرض */}
                <div>
                  <Label htmlFor="selectedOffer">اختيار العرض *</Label>
                  <Select value={formData.selectedOffer} onValueChange={(value) => handleInputChange("selectedOffer", value)}>
                    <SelectTrigger>
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

                {/* وصف الخدمة */}
                <div>
                  <Label htmlFor="serviceDescription">وصف الخدمة التفصيلي</Label>
                  <Textarea
                    id="serviceDescription"
                    value={formData.serviceDescription}
                    onChange={(e) => handleInputChange("serviceDescription", e.target.value)}
                    placeholder="اكتب وصفاً تفصيلياً للخدمة المطلوبة..."
                    rows={4}
                  />
                </div>

                {/* المتطلبات الخاصة */}
                <div>
                  <Label htmlFor="customRequirements">المتطلبات الخاصة</Label>
                  <Textarea
                    id="customRequirements"
                    value={formData.customRequirements}
                    onChange={(e) => handleInputChange("customRequirements", e.target.value)}
                    placeholder="أي متطلبات أو ملاحظات خاصة..."
                    rows={3}
                  />
                </div>

                {/* التوقيع الرقمي */}
                <div>
                  <Label>التوقيع الرقمي *</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <canvas
                      ref={signatureCanvasRef}
                      width={400}
                      height={150}
                      className="border border-gray-200 rounded cursor-crosshair mx-auto"
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      onTouchStart={startDrawing}
                      onTouchMove={draw}
                      onTouchEnd={stopDrawing}
                    />
                    <div className="mt-2 flex justify-center">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={clearSignature}
                      >
                        مسح التوقيع
                      </Button>
                    </div>
                  </div>
                </div>

                {/* الموافقات */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Checkbox
                      id="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked)}
                    />
                    <Label htmlFor="agreeToTerms" className="text-sm">
                      أوافق على الشروط والأحكام *
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Checkbox
                      id="agreeToPrivacy"
                      checked={formData.agreeToPrivacy}
                      onCheckedChange={(checked) => handleInputChange("agreeToPrivacy", checked)}
                    />
                    <Label htmlFor="agreeToPrivacy" className="text-sm">
                      أوافق على سياسة الخصوصية *
                    </Label>
                  </div>
                </div>

                {/* أزرار العمل */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleDownloadPDF}
                    className="flex-1"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    تحميل العقد PDF
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    {isSubmitting ? (
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4 mr-2" />
                    )}
                    {isSubmitting ? "جاري الإرسال..." : "إرسال العقد"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* معلومات العرض */}
          <div className="space-y-6">
            {selectedOfferDetails && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    تفاصيل العرض
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-bold text-lg">{selectedOfferDetails.title}</h3>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-2xl font-bold text-primary">
                          {selectedOfferDetails.price} ريال
                        </span>
                        <span className="text-sm text-muted-foreground line-through">
                          {selectedOfferDetails.originalPrice} ريال
                        </span>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">المميزات المشمولة:</h4>
                      <ul className="space-y-1">
                        {selectedOfferDetails.features.map((feature: string, index: number) => (
                          <li key={index} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-4 border-t">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">مدة التنفيذ: {selectedOfferDetails.duration}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* مميزات العقود الرقمية */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-500" />
                  مميزات العقود الرقمية
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">معتمد قانونياً</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm">سريع وآمن</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">توقيع إلكتروني</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-purple-500" />
                    <span className="text-sm">نسخة PDF مدمجة</span>
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