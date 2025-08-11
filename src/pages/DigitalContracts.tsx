import React, { useState, useRef } from 'react';
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from 'sonner';
import { 
  Download, 
  PenTool, 
  Stamp, 
  FileText, 
  Users, 
  CreditCard, 
  CheckCircle2, 
  Building2,
  FileCheck,
  Shield,
  AlertTriangle,
  Info,
  User,
  Mail,
  Phone,
  IdCard,
  FileSignature,
  Plus,
  Minus,
  Eye,
  Trash2,
  Save,
  Undo2,
  Eraser,
  Calendar,
  Clock,
  Star,
  Award,
  Zap
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import SignatureCanvas from 'react-signature-canvas';
import SEO from "@/components/SEO";
import { supabase } from "@/integrations/supabase/client";

interface Service {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  category: string;
}

interface FormData {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientID: string;
  selectedServices: Service[];
  projectDescription: string;
  totalPrice: number;
  agreeToTerms: boolean;
  agreeToPrivacy: boolean;
  digitalSignature: string;
}

const COMPANY_SERVICES: Service[] = [
  // خدمات التصميم
  { id: '1', name: 'تصميم الهوية البصرية الكاملة', description: 'شعار + كتيب + خطابات رسمية + مطبوعات', basePrice: 15000, category: 'design' },
  { id: '2', name: 'تصميم المواقع الإلكترونية', description: 'موقع متجاوب مع لوحة تحكم', basePrice: 25000, category: 'web' },
  { id: '3', name: 'تطبيقات الجوال', description: 'تطبيق iOS و Android', basePrice: 40000, category: 'mobile' },
  { id: '4', name: 'أنظمة إدارة المحتوى', description: 'CMS مخصص حسب المتطلبات', basePrice: 35000, category: 'systems' },
  
  // الخدمات التقنية
  { id: '5', name: 'الحلول السحابية', description: 'استضافة وخدمات AWS/Azure', basePrice: 8000, category: 'cloud' },
  { id: '6', name: 'أمن المعلومات', description: 'حماية وتشفير البيانات', basePrice: 20000, category: 'security' },
  { id: '7', name: 'الذكاء الاصطناعي', description: 'حلول AI مخصصة', basePrice: 50000, category: 'ai' },
  { id: '8', name: 'التجارة الإلكترونية', description: 'متجر إلكتروني متكامل', basePrice: 30000, category: 'ecommerce' },
  
  // الخدمات الاستشارية
  { id: '9', name: 'استشارات تقنية', description: 'دراسة وتحليل المشاريع', basePrice: 5000, category: 'consulting' },
  { id: '10', name: 'التدريب التقني', description: 'دورات وورش عمل', basePrice: 3000, category: 'training' },
  { id: '11', name: 'الدعم التقني', description: 'دعم شهري أو سنوي', basePrice: 100, category: 'support' },
  { id: '12', name: 'تحليل البيانات', description: 'Business Intelligence', basePrice: 18000, category: 'analytics' }
];

const DigitalContracts = () => {
  const [formData, setFormData] = useState<FormData>({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    clientID: '',
    selectedServices: [],
    projectDescription: '',
    totalPrice: 0,
    agreeToTerms: false,
    agreeToPrivacy: false,
    digitalSignature: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showServices, setShowServices] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const signatureRef = useRef<SignatureCanvas>(null);
  const [penColor, setPenColor] = useState<string>("#1e40af");
  const [contractFormType, setContractFormType] = useState<'individual' | 'institution' | 'company'>('individual');

  // SEO structured data for services
  const servicesJsonLd = COMPANY_SERVICES.map((s) => ({
    "@type": "Service",
    name: s.name,
    description: s.description,
    areaServed: "SA",
    offers: {
      "@type": "Offer",
      priceCurrency: "SAR",
      price: s.basePrice,
      availability: "https://schema.org/InStock"
    }
  }));

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "نظام التعاقد الإلكتروني",
      description: "عقد إلكتروني احترافي يشمل جميع الخدمات مع توقيع وختم رقمي وتنبيهات الدفع.",
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: servicesJsonLd.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item,
      })),
    },
  ];

  const addService = (service: Service) => {
    if (!formData.selectedServices.find(s => s.id === service.id)) {
      const newServices = [...formData.selectedServices, service];
      setFormData(prev => ({
        ...prev,
        selectedServices: newServices,
        totalPrice: newServices.reduce((sum, s) => sum + s.basePrice, 0)
      }));
    }
  };

  const removeService = (serviceId: string) => {
    const newServices = formData.selectedServices.filter(s => s.id !== serviceId);
    setFormData(prev => ({
      ...prev,
      selectedServices: newServices,
      totalPrice: newServices.reduce((sum, s) => sum + s.basePrice, 0)
    }));
  };

  const clearSignature = () => {
    signatureRef.current?.clear();
  };

  const saveSignature = () => {
    if (signatureRef.current) {
      const signatureData = signatureRef.current.toDataURL();
      setFormData(prev => ({ ...prev, digitalSignature: signatureData }));
      toast.success('تم حفظ التوقيع بنجاح');
    }
  };

  // تراجع عن آخر ضربة قلم
  const undoSignature = () => {
    if (!signatureRef.current) return;
    const data = signatureRef.current.toData();
    if (!data || data.length === 0) return;
    data.pop();
    signatureRef.current.fromData(data);
  };

  const filteredServices = selectedCategory === 'all'
    ? COMPANY_SERVICES
    : COMPANY_SERVICES.filter(service => service.category === selectedCategory);

  // دالة التحقق من صحة النموذج
  const isFormValid = () => {
    return (
      formData.clientName &&
      formData.clientEmail &&
      formData.clientPhone &&
      formData.clientID &&
      formData.selectedServices.length > 0 &&
      formData.agreeToTerms &&
      formData.agreeToPrivacy &&
      formData.digitalSignature
    );
  };

  // دالة حساب نسبة إكمال النموذج
  const getFormProgress = () => {
    const fields = [
      formData.clientName,
      formData.clientEmail,
      formData.clientPhone,
      formData.clientID,
      formData.selectedServices.length > 0,
      formData.projectDescription,
      formData.agreeToTerms,
      formData.agreeToPrivacy,
      formData.digitalSignature
    ];
    
    const completedFields = fields.filter(Boolean).length;
    return (completedFields / fields.length) * 100;
  };

  // بدء الدفع للدفعة المقدمة 50%
  const handlePayDeposit = async () => {
    if (!isFormValid()) {
      toast.error('يرجى إكمال جميع الحقول المطلوبة وحفظ التوقيع قبل المتابعة');
      return;
    }
    try {
      setIsSubmitting(true);
      const depositAmount = Math.round(formData.totalPrice * 0.5);

      const description = `دفعة مقدمة 50% لعقد خدمات: ${formData.selectedServices.map(s => s.name).join('، ') || 'خدمات تقنية'} — إجمالي العقد: ${formData.totalPrice.toLocaleString()} SAR`;

      const contract_data = {
        clientName: formData.clientName,
        clientEmail: formData.clientEmail,
        clientPhone: formData.clientPhone,
        clientID: formData.clientID,
        projectDescription: formData.projectDescription,
        totalPrice: formData.totalPrice,
        contractFormType: contractFormType,
        selectedServices: formData.selectedServices.map(s => ({ id: s.id, name: s.name, description: s.description, basePrice: s.basePrice })),
      };

      const { data: resp, error } = await supabase.functions.invoke('paylink-payment', {
        body: {
          amount: depositAmount,
          currency: 'SAR',
          customer_name: formData.clientName,
          customer_email: formData.clientEmail,
          customer_phone: formData.clientPhone,
          offer_title: 'عقد خدمات تقنية',
          description,
          success_url: window.location.origin,
          contract_data,
        },
      });

      if (error) throw error;
      if (resp?.payment_url) {
        toast.success('سيتم تحويلك لصفحة Paylink لإتمام الدفعة المقدمة');
        window.location.href = resp.payment_url;
      } else {
        throw new Error('تعذر إنشاء جلسة الدفع');
      }
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message || 'حدث خطأ أثناء بدء عملية الدفع');
      setIsSubmitting(false);
    }
  };

  // دالة إنشاء الختم الرقمي للشركة
  const createDigitalStamp = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 200;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // رسم الختم الدائري
      ctx.fillStyle = '#1e3a8a';
      ctx.beginPath();
      ctx.arc(100, 100, 90, 0, 2 * Math.PI);
      ctx.fill();
      
      // إضافة النص
      ctx.fillStyle = 'white';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('شركة علي صالح الشهري', 100, 80);
      ctx.fillText('القابضة للتقنية', 100, 100);
      ctx.fillText('والحلول الرقمية', 100, 120);
      
      // تاريخ اليوم
      ctx.font = '12px Arial';
      ctx.fillText(new Date().toLocaleDateString('ar-SA'), 100, 140);
    }
    
    return canvas.toDataURL();
  };

  // ختم رقمي رسمي (SVG كسلسلة)
  const getOfficialStampSVG = (opts?: {
    companyNameAr?: string;
    companyNameEn?: string;
    crNumber?: string;
    vatNumber?: string;
    city?: string;
    contractNumber?: string;
    date?: string;
    status?: 'approved' | 'preview';
    size?: number;
  }) => {
    const {
      companyNameAr = "شركة علي صالح الشهري القابضة",
      companyNameEn = "Alsaleh Holding Company",
      crNumber = "4030554749",
      vatNumber = "—",
      city = "جدة",
      contractNumber,
      date,
      status = "preview",
      size = 140,
    } = opts || {};
    return `
  <svg width="${size}" height="${size}" viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg" aria-label="الختم الرقمي" role="img" style="color: rgba(30,64,175,0.8);">
    <circle cx="120" cy="120" r="112" fill="none" stroke="currentColor" stroke-width="4" />
    <circle cx="120" cy="120" r="95" fill="none" stroke="currentColor" stroke-width="2" />
    <circle cx="120" cy="120" r="78" fill="none" stroke="currentColor" stroke-width="1.5" />
    <path id="topArc" d="M 35 120 A 85 85 0 0 1 205 120" fill="none" />
    <text font-size="12" font-weight="700" fill="currentColor" text-anchor="middle" direction="rtl">
      <textPath href="#topArc" startOffset="50%">${companyNameAr}</textPath>
    </text>
    <path id="bottomArc" d="M 205 120 A 85 85 0 0 1 35 120" fill="none" />
    <text font-size="11" fill="currentColor" text-anchor="middle">
      <textPath href="#bottomArc" startOffset="50%">${companyNameEn}</textPath>
    </text>
    <text x="120" y="105" text-anchor="middle" font-size="16" font-weight="800" fill="currentColor" direction="rtl">
      ${status === 'approved' ? "ختم إلكتروني" : "غير معتمد"}
    </text>
    <text x="120" y="122" text-anchor="middle" font-size="10" fill="currentColor">
      ${status === 'approved' ? "Digital E-Stamp" : "Not Approved"}
    </text>
    <text x="120" y="142" text-anchor="middle" font-size="10" fill="currentColor" direction="rtl">
      ${crNumber ? `السجل التجاري: ${crNumber}` : "السجل التجاري: —"}
    </text>
    <text x="120" y="158" text-anchor="middle" font-size="10" fill="currentColor" direction="rtl">
      ${vatNumber ? `الرقم الضريبي: ${vatNumber}` : "الرقم الضريبي: —"}
    </text>
    <text x="120" y="176" text-anchor="middle" font-size="9" fill="currentColor" direction="rtl">
      ${city ? `${city} • المملكة العربية السعودية` : "المملكة العربية السعودية"}
    </text>
    <text x="120" y="192" text-anchor="middle" font-size="9" fill="currentColor" direction="rtl">
      ${contractNumber ? `رقم العقد: ${contractNumber} • التاريخ: ${date || ""}` : `التاريخ: ${date || ""}`}
    </text>
    ${status === 'preview' ? `
      <g opacity="0.18">
        <rect x="-20" y="108" width="280" height="24" fill="currentColor" transform="rotate(-20 120 120)" rx="4" />
        <text x="120" y="124" text-anchor="middle" font-size="14" font-weight="800" fill="#ffffff" transform="rotate(-20 120 120)">
          غير معتمد إلا بعد الدفع
        </text>
      </g>` : ''}
  </svg>
  `;
  };

  // دالة إنشاء HTML للعقد
  const createContractHTML = (showWatermark: boolean = true) => {
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

    const contractId = `ASH-${Date.now().toString().slice(-8)}`;

    const contractElement = document.createElement('div');
    contractElement.style.cssText = `
        width: 794px; /* A4 width at ~96 DPI */
        padding: 40px;
        background: white;
        font-family: 'Arial', 'Tahoma', sans-serif;
        font-size: 11pt;
        line-height: 1.4;
        direction: rtl;
        text-align: right;
        color: #000;
        position: fixed; /* keep in flow for layout */
        top: 0;
        left: -10000px; /* move off-screen but keep opacity for rendering */
        opacity: 1;
        pointer-events: none;
        box-sizing: border-box;
        margin: 0;
        page-break-inside: avoid;
    `;

    contractElement.innerHTML = `
      <div style="position: relative; width: 100%; height: 100%; background: white;">
        ${showWatermark ? `<div style="position:absolute; inset:0; z-index:9999; pointer-events:none; display:grid; grid-template-columns:repeat(3,1fr); gap:40px; transform: rotate(-25deg); transform-origin:center; opacity:0.12;">
          ${Array(18).fill('<div style="font-size:28pt; font-weight:800; text-align:center; color:#ef4444; letter-spacing:1px;">غير معتمد إلا بعد الدفع</div>').join('')}
        </div>` : ''}
        
        <!-- الترويسة الرسمية -->
        <div style="border: 2px solid #1e3a8a; padding: 20pt; margin-bottom: 15pt; text-align: center; background: #f8fafc;">
          <div style="border: 1px solid #3b82f6; padding: 15pt; background: white;">
            
            <!-- الشعار -->
            <div style="background: #1e3a8a; color: white; width: 60pt; height: 60pt; border-radius: 50%; margin: 0 auto 15pt; display: flex; align-items: center; justify-content: center;">
              <div style="font-size: 14pt; font-weight: bold; text-align: center;">ASH</div>
            </div>
            
            <!-- اسم الشركة -->
            <h1 style="margin: 0 0 10pt 0; font-size: 18pt; font-weight: bold; color: #1e3a8a;">
              شركة علي صالح الشهري القابضة
            </h1>
            <div style="font-size: 12pt; color: #64748b; margin-bottom: 10pt;">
              للتقنية والحلول الرقمية المتقدمة
            </div>
            <div style="font-size: 10pt; color: #64748b; margin-bottom: 15pt;">
              السجل التجاري: 4030554749 | جدة - المملكة العربية السعودية
            </div>
            
            <!-- معلومات الاتصال -->
            <div style="border-top: 1px solid #e5e7eb; padding-top: 10pt;">
              <div style="display: inline-block; margin: 0 15pt;">
                <strong>الهاتف:</strong> 0555812567
              </div>
              <div style="display: inline-block;">
                <strong>البريد الإلكتروني:</strong> info@alialshehriholding.com
              </div>
            </div>
          </div>
        </div>
        
        <!-- معلومات العقد -->
        <div style="border: 1px solid #d1d5db; padding: 15pt; margin-bottom: 15pt; background: #f9fafb;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="width: 50%; padding: 8pt; border: 1px solid #d1d5db; background: white; font-weight: bold;">
                رقم العقد: ${contractId}
              </td>
              <td style="width: 50%; padding: 8pt; border: 1px solid #d1d5db; background: white;">
                التاريخ الميلادي: ${contractDate}
              </td>
            </tr>
            <tr>
              <td style="padding: 8pt; border: 1px solid #d1d5db; background: white; font-weight: bold;">
                التاريخ الهجري: ${hijriDate}
              </td>
              <td style="padding: 8pt; border: 1px solid #d1d5db; background: white;">
                مكان الإصدار: جدة - المملكة العربية السعودية
              </td>
            </tr>
          </table>
        </div>
        
        <!-- عنوان العقد -->
        <div style="text-align: center; margin: 20pt 0; padding: 15pt; border: 2px solid #1e3a8a; background: #f0f9ff;">
          <h2 style="margin: 0; font-size: 16pt; font-weight: bold; color: #1e3a8a;">
            عقد تقديم الخدمات التقنية والاستشارية
          </h2>
          <div style="font-size: 10pt; color: #64748b; margin-top: 8pt;">
            وفقاً للأنظمة واللوائح المعمول بها في المملكة العربية السعودية
          </div>
        </div>
        
        <!-- أطراف العقد -->
        <div style="margin-bottom: 15pt;">
          <h3 style="font-size: 12pt; font-weight: bold; color: #1e3a8a; margin: 0 0 10pt 0; border-bottom: 1px solid #d1d5db; padding-bottom: 5pt;">
            أطراف العقد
          </h3>
          <table style="width: 100%; border-collapse: collapse; border: 1px solid #d1d5db;">
            <tr style="background: #f3f4f6;">
              <th style="padding: 10pt; border: 1px solid #d1d5db; text-align: center; font-weight: bold;">الطرف</th>
              <th style="padding: 10pt; border: 1px solid #d1d5db; text-align: center; font-weight: bold;">البيانات</th>
            </tr>
            <tr>
              <td style="padding: 10pt; border: 1px solid #d1d5db; font-weight: bold; background: #fafafa;">الطرف الأول</td>
              <td style="padding: 10pt; border: 1px solid #d1d5db;">شركة علي صالح الشهري القابضة للتقنية والحلول الرقمية</td>
            </tr>
            <tr>
              <td style="padding: 10pt; border: 1px solid #d1d5db; font-weight: bold; background: #fafafa;">الممثل القانوني</td>
              <td style="padding: 10pt; border: 1px solid #d1d5db;">الأستاذ / علي صالح الشهري - المدير العام</td>
            </tr>
            <tr>
              <td style="padding: 10pt; border: 1px solid #d1d5db; font-weight: bold; background: #fafafa;">الطرف الثاني</td>
              <td style="padding: 10pt; border: 1px solid #d1d5db;">${formData.clientName || 'العميل المحترم'}</td>
            </tr>
            <tr>
              <td style="padding: 10pt; border: 1px solid #d1d5db; font-weight: bold; background: #fafafa;">رقم الهوية/السجل</td>
              <td style="padding: 10pt; border: 1px solid #d1d5db;">${formData.clientID || 'يُملأ عند التوقيع'}</td>
            </tr>
            <tr>
              <td style="padding: 10pt; border: 1px solid #d1d5db; font-weight: bold; background: #fafafa;">رقم الجوال</td>
              <td style="padding: 10pt; border: 1px solid #d1d5db;">${formData.clientPhone || 'يُملأ عند التوقيع'}</td>
            </tr>
            <tr>
              <td style="padding: 10pt; border: 1px solid #d1d5db; font-weight: bold; background: #fafafa;">البريد الإلكتروني</td>
              <td style="padding: 10pt; border: 1px solid #d1d5db;">${formData.clientEmail || 'يُملأ عند التوقيع'}</td>
            </tr>
          </table>
        </div>
        
        <!-- موضوع العقد والخدمات -->
        <div style="margin-bottom: 15pt; page-break-inside: avoid; break-inside: avoid;">
          <h3 style="font-size: 12pt; font-weight: bold; color: #1e3a8a; margin: 0 0 10pt 0; border-bottom: 1px solid #d1d5db; padding-bottom: 5pt;">
            موضوع العقد والخدمات المطلوبة
          </h3>
          <div style="border: 1px solid #d1d5db; padding: 12pt; background: #f9fafb; page-break-inside: avoid; break-inside: avoid;">
            <p style="margin: 0 0 12pt 0; font-weight: bold; color: #1e3a8a;">الخدمات المتفق عليها:</p>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 15pt; page-break-inside: avoid; break-inside: avoid;">
              <tr style="background: #1e3a8a; color: white;">
                <th style="padding: 8pt; border: 1px solid #d1d5db; text-align: center; font-size: 10pt;">م</th>
                <th style="padding: 8pt; border: 1px solid #d1d5db; text-align: center; font-size: 10pt;">الخدمة</th>
                <th style="padding: 8pt; border: 1px solid #d1d5db; text-align: center; font-size: 10pt;">الوصف</th>
                <th style="padding: 8pt; border: 1px solid #d1d5db; text-align: center; font-size: 10pt;">القيمة (ريال)</th>
              </tr>
              ${formData.selectedServices.map((service, index) => `
                <tr style="background: ${index % 2 === 0 ? '#f8fafc' : 'white'};">
                  <td style="padding: 8pt; border: 1px solid #d1d5db; text-align: center; font-size: 9pt;">${index + 1}</td>
                  <td style="padding: 8pt; border: 1px solid #d1d5db; font-size: 9pt;">${service.name}</td>
                  <td style="padding: 8pt; border: 1px solid #d1d5db; font-size: 9pt;">${service.description}</td>
                  <td style="padding: 8pt; border: 1px solid #d1d5db; text-align: center; font-size: 9pt;">${service.basePrice.toLocaleString()}</td>
                </tr>
              `).join('')}
            </table>
            <p style="margin: 0 0 8pt 0; font-weight: bold;">وصف إضافي للمشروع:</p>
            <p style="margin: 0;">${formData.projectDescription || 'تقديم حلول تقنية متكاملة ومتقدمة وفق أحدث المعايير والتقنيات العالمية مع ضمان الجودة والأداء العالي.'}</p>
          </div>
        </div>
        
        <!-- الشروط والأحكام -->
        <div style="margin-bottom: 15pt;">
          <h3 style="font-size: 12pt; font-weight: bold; color: #1e3a8a; margin: 0 0 10pt 0; border-bottom: 1px solid #d1d5db; padding-bottom: 5pt;">
            الشروط والأحكام العامة (وفق أفضل الممارسات العالمية)
          </h3>
          <div style="border: 1px solid #d1d5db; padding: 12pt;">
            <!-- تمهيد وتعريفات -->
            <div style="margin-bottom: 10pt;">
              <strong style="color: #1e3a8a;">المادة الأولى - التمهيد والتعريفات:</strong><br>
              يُعد التمهيد وما ورد أعلاه جزءاً لا يتجزأ من هذا العقد. يُقصد بـ "الطرف الأول" شركة علي صالح الشهري القابضة، وبـ "الطرف الثاني" العميل الموضّحة بياناته أعلاه، وبـ "الخدمات" الأعمال الواردة في جدول نطاق العمل ومخرجاته.
            </div>

            <!-- بدء السريان -->
            <div style="margin-bottom: 10pt;">
              <strong style="color: #1e3a8a;">المادة الثانية - بدء السريان واعتماد العقد:</strong><br>
              يبدأ سريان العقد ويلتزم الطرفان به عند سداد الدفعة المقدمة الأولى وقدرها 50% من قيمة العقد. ولا يُعد هذا العقد نافذاً قبل ذلك.
            </div>

            <!-- نطاق العمل ومخرجاته -->
            <div style="margin-bottom: 10pt;">
              <strong style="color: #1e3a8a;">المادة الثالثة - نطاق العمل ومخرجاته:</strong><br>
              يلتزم الطرف الأول بتنفيذ الخدمات وفق نطاق العمل التالي ومخرجاته المتفق عليها:
              <table style="width: 100%; border-collapse: collapse; margin-top: 8pt;">
                <tr style="background:#f3f4f6;">
                  <th style="padding:8pt; border:1px solid #d1d5db; font-size:9pt;">#</th>
                  <th style="padding:8pt; border:1px solid #d1d5db; font-size:9pt;">المخرج</th>
                  <th style="padding:8pt; border:1px solid #d1d5db; font-size:9pt;">الوصف</th>
                </tr>
                ${formData.selectedServices.map((s, i) => `
                <tr>
                  <td style="padding:8pt; border:1px solid #d1d5db; text-align:center; font-size:9pt;">${i+1}</td>
                  <td style="padding:8pt; border:1px solid #d1d5db; font-size:9pt;">${s.name}</td>
                  <td style="padding:8pt; border:1px solid #d1d5db; font-size:9pt;">${s.description}</td>
                </tr>`).join('')}
              </table>
            </div>

            <!-- الجدول الزمني والمعالم -->
            <div style="margin-bottom: 10pt;">
              <strong style="color: #1e3a8a;">المادة الرابعة - الجدول الزمني والمعالم الرئيسية:</strong><br>
              يلتزم الطرف الأول بالجدول الزمني التالي على أن يتم التحديث كتابةً عند أي تغيير متفق عليه:
              <table style="width: 100%; border-collapse: collapse; margin-top: 8pt;">
                <tr style="background:#f3f4f6;">
                  <th style="padding:8pt; border:1px solid #d1d5db; font-size:9pt;">المعلم</th>
                  <th style="padding:8pt; border:1px solid #d1d5db; font-size:9pt;">الوصف</th>
                  <th style="padding:8pt; border:1px solid #d1d5db; font-size:9pt;">المدة المتوقعة</th>
                </tr>
                <tr>
                  <td style="padding:8pt; border:1px solid #d1d5db; font-size:9pt;">التحليل والمواءمة</td>
                  <td style="padding:8pt; border:1px solid #d1d5db; font-size:9pt;">جمع المتطلبات وتوثيقها ومراجعتها</td>
                  <td style="padding:8pt; border:1px solid #d1d5db; font-size:9pt;">5 - 10 أيام عمل</td>
                </tr>
                <tr>
                  <td style="padding:8pt; border:1px solid #d1d5db; font-size:9pt;">التنفيذ والتطوير</td>
                  <td style="padding:8pt; border:1px solid #d1d5db; font-size:9pt;">بناء الحلول وفق المواصفات المعتمدة</td>
                  <td style="padding:8pt; border:1px solid #d1d5db; font-size:9pt;">15 - 30 يوم عمل</td>
                </tr>
                <tr>
                  <td style="padding:8pt; border:1px solid #d1d5db; font-size:9pt;">الاختبارات والتسليم</td>
                  <td style="padding:8pt; border:1px solid #d1d5db; font-size:9pt;">اختبارات القبول والتسليم النهائي</td>
                  <td style="padding:8pt; border:1px solid #d1d5db; font-size:9pt;">5 - 10 أيام عمل</td>
                </tr>
              </table>
            </div>

            <!-- الدفعات وجدول السداد -->
            <div style="margin-bottom: 10pt;">
              <strong style="color: #1e3a8a;">المادة الخامسة - الدفعات وجدول السداد:</strong><br>
              القيمة الإجمالية للعقد: ${formData.totalPrice.toLocaleString()} ريال سعودي.
              <table style="width: 100%; border-collapse: collapse; margin-top: 8pt;">
                <tr style="background:#f3f4f6;">
                  <th style="padding:8pt; border:1px solid #d1d5db; font-size:9pt;">الدفعة</th>
                  <th style="padding:8pt; border:1px solid #d1d5db; font-size:9pt;">النسبة</th>
                  <th style="padding:8pt; border:1px solid #d1d5db; font-size:9pt;">القيمة</th>
                  <th style="padding:8pt; border:1px solid #d1d5db; font-size:9pt;">موعد الاستحقاق</th>
                </tr>
                <tr>
                  <td style="padding:8pt; border:1px solid #d1d5db; font-size:9pt;">دفعة مقدمة</td>
                  <td style="padding:8pt; border:1px solid #d1d5db; text-align:center; font-size:9pt;">50%</td>
                  <td style="padding:8pt; border:1px solid #d1d5db; text-align:center; font-size:9pt;">${Math.round(formData.totalPrice * 0.5).toLocaleString()}</td>
                  <td style="padding:8pt; border:1px solid #d1d5db; font-size:9pt;">عند توقيع العقد</td>
                </tr>
                <tr>
                  <td style="padding:8pt; border:1px solid #d1d5db; font-size:9pt;">الدفعة النهائية</td>
                  <td style="padding:8pt; border:1px solid #d1d5db; text-align:center; font-size:9pt;">50%</td>
                  <td style="padding:8pt; border:1px solid #d1d5db; text-align:center; font-size:9pt;">${Math.round(formData.totalPrice * 0.5).toLocaleString()}</td>
                  <td style="padding:8pt; border:1px solid #d1d5db; font-size:9pt;">قبل التسليم النهائي</td>
                </tr>
              </table>
            </div>

            <!-- التغييرات والنطاق -->
            <div style="margin-bottom: 10pt;">
              <strong style="color: #1e3a8a;">المادة السادسة - إدارة التغييرات:</strong><br>
              أي تعديل على نطاق العمل أو المخرجات يكون عبر طلب تغيير مكتوب يوضح الأثر الزمني والمالي ويُعتمد من الطرفين قبل التنفيذ.
            </div>

            <!-- السرية والبيانات -->
            <div style="margin-bottom: 10pt;">
              <strong style="color: #1e3a8a;">المادة السابعة - السرية وحماية البيانات (سياسة الخصوصية):</strong><br>
              يلتزم الطرفان بالحفاظ على سرية جميع المعلومات والبيانات المتبادلة وعدم الإفصاح عنها لأي طرف ثالث إلا بموافقة كتابية مسبقة، مع الالتزام بالأنظمة السعودية لحماية البيانات.
            </div>

            <!-- الملكية الفكرية -->
            <div style="margin-bottom: 10pt;">
              <strong style="color: #1e3a8a;">المادة الثامنة - الملكية الفكرية:</strong><br>
              تنتقل ملكية المخرجات النهائية للطرف الثاني بعد السداد الكامل لكافة المستحقات، ويحتفظ الطرف الأول بحقوقه في الأدوات والمنهجيات والمواد العامة غير الخاصة بالمشروع.
            </div>

            <!-- الضمان والمسؤولية -->
            <div style="margin-bottom: 10pt;">
              <strong style="color: #1e3a8a;">المادة التاسعة - الضمان وحدود المسؤولية:</strong><br>
              يوفر الطرف الأول ضماناً لمدة 6 أشهر على المخرجات ضد العيوب الفنية، ولا يسأل عن أي أضرار غير مباشرة أو تبعية. يقتصر التعويض - إن ثبت - على ما لا يتجاوز مجموع المبالغ المدفوعة.
            </div>

            <!-- الإنهاء -->
            <div style="margin-bottom: 10pt;">
              <strong style="color: #1e3a8a;">المادة العاشرة - الإنهاء:</strong><br>
              يجوز لأي طرف إنهاء العقد بإشعار خطي مسبق (15) يوماً عند إخلال الطرف الآخر بالتزاماته الجوهرية وعدم معالجتها خلال مدة معقولة. تُسوى المستحقات حتى تاريخ الإنهاء.
            </div>

            <!-- القوة القاهرة -->
            <div style="margin-bottom: 10pt;">
              <strong style="color: #1e3a8a;">المادة الحادية عشرة - القوة القاهرة:</strong><br>
              لا يتحمل أي طرف المسؤولية عن التأخير أو التقصير الناتج عن أحداث خارجة عن الإرادة مثل الكوارث أو القرارات السيادية أو الأعطال العامة.
            </div>

            <!-- القبول ومعايير التسليم -->
            <div style="margin-bottom: 10pt;">
              <strong style="color: #1e3a8a;">المادة الثانية عشرة - القبول ومعايير التسليم:</strong><br>
              يُعد التسليم نهائياً بعد اجتياز اختبارات القبول (UAT) وإقرار الطرف الثاني خلال (5) أيام عمل، وإلا اعتُبر القبول ضمنياً مع معالجة الملاحظات المتفق عليها.
            </div>

            <!-- مستوى الخدمة (SLA) -->
            <div style="margin-bottom: 10pt;">
              <strong style="color: #1e3a8a;">المادة الثالثة عشرة - مستوى الخدمة (SLA):</strong><br>
              أوقات العمل الرسمية: الأحد - الخميس من 9 صباحاً حتى 6 مساءً. أزمنة الاستجابة للحالات: حرجة 4 ساعات، عالية 1 يوم عمل، متوسطة 2 يوم عمل.
              <table style="width: 100%; border-collapse: collapse; margin-top: 8pt;">
                <tr style="background:#f3f4f6;">
                  <th style="padding:8pt; border:1px solid #d1d5db; font-size:9pt;">الأولوية</th>
                  <th style="padding:8pt; border:1px solid #d1d5db; font-size:9pt;">وقت الاستجابة</th>
                  <th style="padding:8pt; border:1px solid #d1d5db; font-size:9pt;">وقت المعالجة المبدئي</th>
                </tr>
                <tr>
                  <td style="padding:8pt; border:1px solid #d1d5db; font-size:9pt;">حرجة</td>
                  <td style="padding:8pt; border:1px solid #d1d5db; font-size:9pt;">≤ 4 ساعات</td>
                  <td style="padding:8pt; border:1px solid #d1d5db; font-size:9pt;">≤ 1 يوم</td>
                </tr>
                <tr>
                  <td style="padding:8pt; border:1px solid #d1d5db; font-size:9pt;">عالية</td>
                  <td style="padding:8pt; border:1px solid #d1d5db; font-size:9pt;">≤ 1 يوم</td>
                  <td style="padding:8pt; border:1px solid #d1d5db; font-size:9pt;">≤ 2 يوم</td>
                </tr>
                <tr>
                  <td style="padding:8pt; border:1px solid #d1d5db; font-size:9pt;">متوسطة</td>
                  <td style="padding:8pt; border:1px solid #d1d5db; font-size:9pt;">≤ 2 يوم</td>
                  <td style="padding:8pt; border:1px solid #d1d5db; font-size:9pt;">≤ 3 يوم</td>
                </tr>
              </table>
            </div>

            <!-- القانون والاختصاص -->
            <div style="margin-bottom: 10pt;">
              <strong style="color: #1e3a8a;">المادة الرابعة عشرة - القانون والاختصاص:</strong><br>
              يخضع هذا العقد للأنظمة واللوائح المعمول بها في المملكة العربية السعودية، ويكون الاختصاص القضائي لمحاكم مدينة جدة ما لم يُتفق خلاف ذلك.
            </div>

            <!-- ملاحظات عامة -->
            <div style="margin-bottom: 0; background:#fff7ed; border:1px dashed #f59e0b; padding:10pt;">
              <strong style="color:#92400e;">ملاحظة:</strong> يُعد هذا العقد صارماً ويلتزم بمعايير الشركات العالمية في الحوكمة وإدارة المشاريع، وأي استثناءات يجب أن تُوثّق كتابياً.
            </div>
          </div>
        </div>
        
        <!-- التوقيعات والأختام -->
        <div style="margin-top: 30pt; page-break-inside: avoid; break-inside: avoid;">
          <table style="width: 100%; border-collapse: collapse; page-break-inside: avoid; break-inside: avoid;">
            <tr>
              <td style="width: 50%; padding: 20pt; text-align: center; border: 1px solid #d1d5db;">
                <div style="margin-bottom: 15pt;">
                  <strong>الطرف الأول (الشركة)</strong>
                </div>
                <div style="margin-bottom: 40pt;">
                  ${getOfficialStampSVG({
                    companyNameAr: "شركة علي صالح الشهري القابضة",
                    companyNameEn: "Alsaleh Holding Company",
                    crNumber: "4030554749",
                    vatNumber: "—",
                    city: "جدة",
                    contractNumber: contractId,
                    date: contractDate,
                    status: showWatermark ? 'preview' : 'approved',
                    size: 128
                  })}
                </div>
                <div style="border-top: 1px solid #000; padding-top: 8pt;">
                  <strong>علي صالح الشهري</strong><br>
                  المدير العام
                </div>
              </td>
              <td style="width: 50%; padding: 20pt; text-align: center; border: 1px solid #d1d5db;">
                <div style="margin-bottom: 15pt;">
                  <strong>الطرف الثاني (العميل)</strong>
                </div>
                <div style="margin-bottom: 40pt;">
                  ${formData.digitalSignature ? `<img src="${formData.digitalSignature}" style="max-width: 150pt; max-height: 80pt;" />` : 'التوقيع الرقمي'}
                </div>
                <div style="border-top: 1px solid #000; padding-top: 8pt;">
                  <strong>${formData.clientName || 'اسم العميل'}</strong><br>
                  التوقيع والختم
                </div>
              </td>
            </tr>
          </table>
        </div>
        
        <!-- تذييل قانوني -->
        <div style="margin-top: 20pt; padding: 15pt; border: 1px solid #d1d5db; background: #f8fafc; text-align: center; font-size: 9pt;">
          <p style="margin: 0 0 8pt 0;">هذا العقد محرر ومؤرخ في جدة بالمملكة العربية السعودية</p>
          <p style="margin: 0 0 8pt 0;">ويخضع للأنظمة واللوائح المعمول بها في المملكة العربية السعودية</p>
          <p style="margin: 0;">العقد الإلكتروني موثق رقمياً ومعتمد قانونياً</p>
        </div>
      </div>
    `;

    return contractElement;
  };

  const handleDownloadPDF = async () => {
    const params = new URLSearchParams(window.location.search);
    const isPaid = params.get('paid') === 'true';
    const contractElement = createContractHTML(!isPaid);
    document.body.appendChild(contractElement);

    try {
      // توليد صورة من العقد باستخدام html2canvas
      const canvas = await html2canvas(contractElement as unknown as HTMLElement, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // حساب أبعاد الصورة داخل PDF مع الحفاظ على التناسب
      const imgProps = pdf.getImageProperties(imgData as any);
      const imgWidth = pdfWidth; // ملء عرض الصفحة
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        pdf.addPage();
        position = -(imgHeight - heightLeft);
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
        heightLeft -= pdfHeight;
      }

      const contractNumber = `ASH-${Date.now().toString().slice(-8)}`;
      pdf.save(`عقد-${contractNumber}.pdf`);
      toast.success('تم تحميل العقد بصيغة PDF بنجاح!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('حدث خطأ في إنشاء ملف PDF');
    } finally {
      document.body.removeChild(contractElement);
    }
  };

  const handleSubmit = async () => {
    if (!isFormValid()) {
      toast.error('يرجى ملء جميع الحقول المطلوبة والموافقة على الشروط');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const response = await fetch('/api/contract-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          formType: contractFormType, 
          ...formData,
          contractNumber: `ASH-${Date.now().toString().slice(-8)}`,
          createdAt: new Date().toISOString()
        }),
      });

      if (response.ok) {
        toast.success('✅ تم إرسال العقد بنجاح! ستصلك رسالة تأكيد عبر البريد الإلكتروني');
        
        // إعادة تعيين النموذج
        setFormData({
          clientName: '',
          clientEmail: '',
          clientPhone: '',
          clientID: '',
          selectedServices: [],
          projectDescription: '',
          totalPrice: 0,
          agreeToTerms: false,
          agreeToPrivacy: false,
          digitalSignature: '',
        });
        setContractFormType('individual');
        clearSignature();
        setShowServices(false);
        setSelectedCategory('all');
      } else {
        const errorData = await response.json();
        toast.error(`❌ حدث خطأ في إرسال العقد: ${errorData.message || 'يرجى المحاولة مرة أخرى'}`);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('❌ حدث خطأ في الشبكة. يرجى التحقق من اتصالك بالإنترنت');
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateContract = async () => {
    try {
      await handleDownloadPDF();
    } catch (error) {
      toast.error('حدث خطأ في إنشاء العقد');
    }
  };

  return (
    <>
      <SEO
        title="نظام التعاقد الإلكتروني المتقدم - شركة علي صالح الشهري القابضة"
        description="عقد إلكتروني احترافي يشمل جميع الخدمات مع توقيع وختم رقمي وتنبيهات الدفع. تجربة تعاقد موثوقة وآمنة."
        jsonLd={jsonLd}
      />
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-br from-primary via-primary/90 to-primary/80 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.05)_50%,transparent_75%)]"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-4 py-16">
          {/* Hero Content */}
          <div className="text-center text-white mb-16" dir="rtl">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur text-white/90 text-sm font-medium mb-6">
              <Stamp className="w-4 h-4 ml-2" />
              نظام التعاقد الإلكتروني المتقدم
            </div>
            
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 bg-gradient-to-l from-white via-white to-white/80 bg-clip-text text-transparent">
              عقد إلكتروني بمعايير عالمية
              <br />
              وموثوقية سعودية
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
              تجربة تعاقد احترافية تشمل كل خدماتنا وختم وتوقيع رقمي، مع تنبيهات دفع واضحة لضمان حقوق الطرفين
            </p>
            
            {/* Steps Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto mb-12">
              {[
                { icon: FileCheck, title: "اختيار الخدمات", desc: "حدد ما تحتاجه" },
                { icon: FileSignature, title: "إدخال البيانات", desc: "املأ النموذج" },
                { icon: CreditCard, title: "سداد الدفعة", desc: "50% مقدم" },
                { icon: CheckCircle2, title: "التنفيذ", desc: "تسليم احترافي" }
              ].map((step, idx) => (
                <div key={idx} className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur border border-white/10">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/10 flex items-center justify-center">
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                  <p className="text-white/80 text-sm">{step.desc}</p>
                </div>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => document.getElementById('contract-form')?.scrollIntoView({ behavior: 'smooth' })}
                size="lg" 
                className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6 h-auto"
              >
                ابدأ التعاقد الآن
                <FileSignature className="w-5 h-5 mr-2" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-white/20 text-white hover:bg-white/10 text-lg px-8 py-6 h-auto bg-transparent"
              >
                استعراض الخدمات
                <Eye className="w-5 h-5 mr-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Contract Form Section */}
      <section id="contract-form" className="py-20 bg-gradient-to-br from-background via-muted/30 to-accent/5">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16" dir="rtl">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">نظام التعاقد الإلكتروني المتطور</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                عقد موثق رقمياً يضمن حقوق جميع الأطراف مع أعلى معايير الأمان والشفافية
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* نموذج التعاقد الرئيسي */}
              <div className="lg:col-span-2">
                <Card className="shadow-2xl border-0 bg-card/95 backdrop-blur overflow-hidden animate-fade-in">
                  <CardHeader className="bg-gradient-to-l from-primary to-primary/80 text-primary-foreground p-8">
                    <CardTitle className="text-2xl font-bold text-right flex items-center gap-3">
                      <FileSignature className="w-8 h-8" />
                      نموذج التعاقد الإلكتروني
                    </CardTitle>
                    <p className="text-primary-foreground/90 text-right mt-2">
                      املأ جميع البيانات المطلوبة لإنشاء عقد موثق قانونياً
                    </p>
                  </CardHeader>
                  
                  <CardContent className="p-8 space-y-8" dir="rtl">
                    {/* مؤشر التقدم */}
                    <div className="mb-8">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-medium">التقدم في النموذج</span>
                        <span className="text-sm text-muted-foreground">{Math.round(getFormProgress())}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-500"
                          style={{ width: `${getFormProgress()}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* اختيار نوع العقد */}
                    <div className="space-y-4">
                      <Label className="text-xl font-bold flex items-center gap-2">
                        <Building2 className="w-6 h-6 text-primary" />
                        نوع التعاقد
                      </Label>
                      <div className="grid grid-cols-3 gap-4">
                        {[
                          { type: 'individual', label: 'عقد فردي', icon: User, desc: 'للأفراد والمستقلين' },
                          { type: 'institution', label: 'عقد مؤسسة', icon: Building2, desc: 'للمؤسسات الصغيرة' },
                          { type: 'company', label: 'عقد شركة', icon: Users, desc: 'للشركات الكبيرة' }
                        ].map((contract) => (
                          <div
                            key={contract.type}
                            onClick={() => setContractFormType(contract.type as any)}
                            className={`p-4 border-2 rounded-xl cursor-pointer transition-all hover:shadow-md ${
                              contractFormType === contract.type
                                ? 'border-primary bg-primary/5 shadow-lg'
                                : 'border-border hover:border-primary/50'
                            }`}
                          >
                            <div className="text-center space-y-2">
                              <contract.icon className={`w-8 h-8 mx-auto ${
                                contractFormType === contract.type ? 'text-primary' : 'text-muted-foreground'
                              }`} />
                              <div className="font-medium">{contract.label}</div>
                              <div className="text-xs text-muted-foreground">{contract.desc}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator className="my-8" />

                    {/* بيانات العميل */}
                    <div className="space-y-6">
                      <Label className="text-xl font-bold flex items-center gap-2">
                        <User className="w-6 h-6 text-primary" />
                        بيانات {contractFormType === 'individual' ? 'العميل' : contractFormType === 'institution' ? 'المؤسسة' : 'الشركة'}
                      </Label>
                      
                      <div className="grid gap-6">
                        <div className="space-y-3">
                          <Label htmlFor="clientName" className="text-lg flex items-center gap-2">
                            <IdCard className="w-5 h-5 text-primary" />
                            {contractFormType === 'individual' ? 'الاسم الكامل' : contractFormType === 'institution' ? 'اسم المؤسسة' : 'اسم الشركة'}
                          </Label>
                          <Input
                            id="clientName"
                            value={formData.clientName}
                            onChange={(e) => setFormData(prev => ({...prev, clientName: e.target.value}))}
                            className="text-right h-12 text-lg"
                            placeholder={`أدخل ${contractFormType === 'individual' ? 'الاسم الكامل' : contractFormType === 'institution' ? 'اسم المؤسسة' : 'اسم الشركة'}`}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <Label htmlFor="clientEmail" className="text-lg flex items-center gap-2">
                              <Mail className="w-5 h-5 text-primary" />
                              البريد الإلكتروني
                            </Label>
                            <Input
                              id="clientEmail"
                              type="email"
                              value={formData.clientEmail}
                              onChange={(e) => setFormData(prev => ({...prev, clientEmail: e.target.value}))}
                              className="text-right h-12 text-lg"
                              placeholder="example@domain.com"
                            />
                          </div>

                          <div className="space-y-3">
                            <Label htmlFor="clientPhone" className="text-lg flex items-center gap-2">
                              <Phone className="w-5 h-5 text-primary" />
                              رقم الجوال
                            </Label>
                            <Input
                              id="clientPhone"
                              value={formData.clientPhone}
                              onChange={(e) => setFormData(prev => ({...prev, clientPhone: e.target.value}))}
                              className="text-right h-12 text-lg"
                              placeholder="05XXXXXXXX"
                            />
                          </div>
                        </div>

                        <div className="space-y-3">
                          <Label htmlFor="clientID" className="text-lg flex items-center gap-2">
                            <IdCard className="w-5 h-5 text-primary" />
                            {contractFormType === 'individual' ? 'رقم الهوية الوطنية' : 'رقم السجل التجاري'}
                          </Label>
                          <Input
                            id="clientID"
                            value={formData.clientID}
                            onChange={(e) => setFormData(prev => ({...prev, clientID: e.target.value}))}
                            className="text-right h-12 text-lg"
                            placeholder={contractFormType === 'individual' ? '1XXXXXXXXX' : '4XXXXXXXXX'}
                          />
                        </div>
                      </div>
                    </div>

                    <Separator className="my-8" />

                    {/* اختيار الخدمات */}
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <Label className="text-xl font-bold flex items-center gap-2">
                          <FileCheck className="w-6 h-6 text-primary" />
                          اختيار الخدمات المطلوبة
                        </Label>
                        <Button
                          onClick={() => setShowServices(!showServices)}
                          variant="outline"
                          className="flex items-center gap-2"
                        >
                          {showServices ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                          {showServices ? 'إخفاء' : 'إظهار'} قائمة الخدمات
                        </Button>
                      </div>

                      {/* فلترة الخدمات */}
                      {showServices && (
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                              <SelectTrigger className="h-12 text-lg">
                                <SelectValue placeholder="اختر فئة الخدمات" />
                              </SelectTrigger>
                              <SelectContent className="bg-background border shadow-xl z-50 max-h-80">
                                <SelectItem value="all">🔧 جميع الخدمات</SelectItem>
                                <SelectItem value="design">🎨 خدمات التصميم</SelectItem>
                                <SelectItem value="web">🌐 تطوير المواقع</SelectItem>
                                <SelectItem value="mobile">📱 تطبيقات الجوال</SelectItem>
                                <SelectItem value="systems">⚙️ الأنظمة</SelectItem>
                                <SelectItem value="cloud">☁️ الحلول السحابية</SelectItem>
                                <SelectItem value="security">🔐 أمن المعلومات</SelectItem>
                                <SelectItem value="ai">🤖 الذكاء الاصطناعي</SelectItem>
                                <SelectItem value="ecommerce">🛒 التجارة الإلكترونية</SelectItem>
                                <SelectItem value="consulting">💼 الاستشارات</SelectItem>
                                <SelectItem value="training">📚 التدريب</SelectItem>
                                <SelectItem value="support">🛠️ الدعم التقني</SelectItem>
                                <SelectItem value="analytics">📊 تحليل البيانات</SelectItem>
                              </SelectContent>
                            </Select>
                            
                            <div className="text-center">
                              <Badge variant="secondary" className="text-lg px-4 py-2">
                                {filteredServices.length} خدمة متاحة
                              </Badge>
                            </div>
                          </div>

                          {/* عرض الخدمات */}
                          <div className="grid gap-4 max-h-96 overflow-y-auto pr-2">
                            {filteredServices.map((service) => (
                              <div
                                key={service.id}
                                className={`p-6 border-2 rounded-xl transition-all hover:shadow-lg ${
                                  formData.selectedServices.some(s => s.id === service.id)
                                    ? 'border-primary bg-primary/5 shadow-lg'
                                    : 'border-border hover:border-primary/50'
                                }`}
                              >
                                <div className="flex items-start justify-between gap-4">
                                  <div className="flex-1 text-right space-y-2">
                                    <h4 className="font-bold text-lg">{service.name}</h4>
                                    <p className="text-muted-foreground">{service.description}</p>
                                    <div className="text-2xl font-bold text-primary">
                                      {service.basePrice.toLocaleString()} ريال
                                    </div>
                                  </div>
                                  
                                  <Button
                                    onClick={() => {
                                      const isSelected = formData.selectedServices.some(s => s.id === service.id);
                                      if (isSelected) {
                                        removeService(service.id);
                                      } else {
                                        addService(service);
                                      }
                                    }}
                                    size="lg"
                                    variant={formData.selectedServices.some(s => s.id === service.id) ? "secondary" : "default"}
                                    className="min-w-[120px]"
                                  >
                                    {formData.selectedServices.some(s => s.id === service.id) ? (
                                      <>
                                        <CheckCircle2 className="w-5 h-5 ml-2" />
                                        مختارة
                                      </>
                                    ) : (
                                      <>
                                        <Plus className="w-5 h-5 ml-2" />
                                        اختيار
                                      </>
                                    )}
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* ملخص الخدمات المختارة */}
                      {formData.selectedServices.length > 0 && (
                        <div className="space-y-4">
                          <Label className="text-xl font-bold">
                            الخدمات المختارة ({formData.selectedServices.length})
                          </Label>
                          
                          <div className="space-y-3 max-h-60 overflow-y-auto">
                            {formData.selectedServices.map((service) => (
                              <div key={service.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-xl border">
                                <div className="text-right flex-1">
                                  <div className="font-bold">{service.name}</div>
                                  <div className="text-sm text-muted-foreground">{service.description}</div>
                                  <div className="text-lg font-bold text-primary">{service.basePrice.toLocaleString()} ريال</div>
                                </div>
                                <Button
                                  onClick={() => removeService(service.id)}
                                  variant="ghost"
                                  size="sm"
                                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                >
                                  <Trash2 className="w-5 h-5" />
                                </Button>
                              </div>
                            ))}
                          </div>
                          
                          <div className="p-6 bg-gradient-to-l from-primary/10 to-primary/5 rounded-xl border border-primary/20">
                            <div className="flex justify-between items-center">
                              <div className="text-right">
                                <div className="text-sm text-muted-foreground">المجموع الكلي</div>
                                <div className="text-3xl font-bold text-primary">{formData.totalPrice.toLocaleString()} ريال</div>
                                <div className="text-sm text-muted-foreground">
                                  الدفعة المقدمة: {Math.round(formData.totalPrice * 0.5).toLocaleString()} ريال
                                </div>
                              </div>
                              <div className="text-center">
                                <CreditCard className="w-12 h-12 text-primary mx-auto mb-2" />
                                <div className="text-xs text-muted-foreground">مطلوب للبدء</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <Separator className="my-8" />

                    {/* وصف المشروع */}
                    <div className="space-y-4">
                      <Label htmlFor="projectDescription" className="text-xl font-bold flex items-center gap-2">
                        <FileText className="w-6 h-6 text-primary" />
                        وصف المشروع والمتطلبات الإضافية
                      </Label>
                      <Textarea
                        id="projectDescription"
                        value={formData.projectDescription}
                        onChange={(e) => setFormData(prev => ({...prev, projectDescription: e.target.value}))}
                        className="min-h-40 text-right text-lg"
                        placeholder="اكتب وصفاً تفصيلياً للمشروع ومتطلباته الخاصة، الجدول الزمني المتوقع، وأي ملاحظات أخرى مهمة..."
                      />
                    </div>

                    <Separator className="my-8" />

                    {/* التوقيع الرقمي */}
                    <div className="space-y-6">
                      <Label className="text-xl font-bold flex items-center gap-2">
                        <PenTool className="w-6 h-6 text-primary" />
                        التوقيع الرقمي الموثق
                      </Label>
                      
                      <div className="p-6 border-2 border-dashed border-primary/30 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5">
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                          <div className="flex items-center gap-4">
                            <Label className="font-medium">لون القلم:</Label>
                            <div className="flex items-center gap-2">
                              {[
                                { color: '#1e40af', name: 'أزرق' },
                                { color: '#dc2626', name: 'أحمر' },
                                { color: '#059669', name: 'أخضر' },
                                { color: '#7c3aed', name: 'بنفسجي' },
                                { color: '#ea580c', name: 'برتقالي' }
                              ].map((pen) => (
                                <button
                                  key={pen.color}
                                  onClick={() => setPenColor(pen.color)}
                                  className={`w-10 h-10 rounded-full border-3 transition-all hover:scale-110 ${
                                    penColor === pen.color ? 'border-foreground shadow-lg scale-110' : 'border-border'
                                  }`}
                                  style={{ backgroundColor: pen.color }}
                                  title={pen.name}
                                />
                              ))}
                            </div>
                          </div>
                          
                          <div className="flex gap-3">
                            <Button onClick={undoSignature} variant="outline" size="sm" className="flex items-center gap-2">
                              <Undo2 className="w-4 h-4" />
                              تراجع
                            </Button>
                            <Button onClick={clearSignature} variant="outline" size="sm" className="flex items-center gap-2">
                              <Eraser className="w-4 h-4" />
                              مسح الكل
                            </Button>
                            <Button onClick={saveSignature} variant="default" size="sm" className="flex items-center gap-2">
                              <Save className="w-4 h-4" />
                              حفظ التوقيع
                            </Button>
                          </div>
                        </div>
                        
                        <div className="bg-white rounded-xl border-2 border-dashed border-primary/20 p-4 shadow-inner">
                          <SignatureCanvas
                            ref={signatureRef}
                            penColor={penColor}
                            minWidth={2.5}
                            maxWidth={2.5}
                            canvasProps={{
                              width: 600,
                              height: 250,
                              className: 'signature-canvas w-full h-48 md:h-60 rounded-lg'
                            }}
                          />
                        </div>
                        
                        <div className="mt-4 text-center">
                          <p className="text-sm text-muted-foreground">
                            🖋️ وقّع بالماوس أو باللمس في المنطقة البيضاء أعلاه
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            التوقيع سيتم تشفيره وحفظه بشكل آمن مع العقد
                          </p>
                        </div>
                      </div>
                    </div>

                    <Separator className="my-8" />

                    {/* الموافقات والإقرارات */}
                    <div className="space-y-6">
                      <Label className="text-xl font-bold flex items-center gap-2">
                        <Shield className="w-6 h-6 text-primary" />
                        الموافقات والإقرارات القانونية
                      </Label>
                      
                      <div className="space-y-4 p-6 bg-muted/30 rounded-xl border">
                        <div className="flex items-start gap-4">
                          <Checkbox
                            id="agreeToTerms"
                            checked={formData.agreeToTerms}
                            onCheckedChange={(checked) =>
                              setFormData(prev => ({...prev, agreeToTerms: checked as boolean}))
                            }
                            className="mt-1 w-5 h-5"
                          />
                          <Label htmlFor="agreeToTerms" className="text-lg leading-relaxed cursor-pointer">
                            أوافق على <strong className="text-primary">الشروط والأحكام العامة</strong> للخدمات التقنية والاستشارية المقدمة من شركة علي صالح الشهري القابضة
                          </Label>
                        </div>

                        <div className="flex items-start gap-4">
                          <Checkbox
                            id="agreeToPrivacy"
                            checked={formData.agreeToPrivacy}
                            onCheckedChange={(checked) =>
                              setFormData(prev => ({...prev, agreeToPrivacy: checked as boolean}))
                            }
                            className="mt-1 w-5 h-5"
                          />
                          <Label htmlFor="agreeToPrivacy" className="text-lg leading-relaxed cursor-pointer">
                            أوافق على <strong className="text-primary">سياسة الخصوصية</strong> وحماية البيانات الشخصية وفقاً للأنظمة السعودية
                          </Label>
                        </div>
                      </div>
                    </div>

                    {/* أزرار الإجراءات الرئيسية */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-8">
                      <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting || !isFormValid()}
                        size="lg"
                        className="flex-1 h-16 text-xl font-bold"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin ml-2"></div>
                            جاري إرسال العقد...
                          </>
                        ) : (
                          <>
                            <FileSignature className="w-6 h-6 ml-2" />
                            إرسال العقد للمراجعة
                          </>
                        )}
                      </Button>
                      
                      <Button
                        onClick={generateContract}
                        variant="outline"
                        disabled={!isFormValid()}
                        size="lg"
                        className="h-16 px-8 text-lg font-bold"
                      >
                        <Eye className="w-6 h-6 ml-2" />
                        معاينة العقد
                      </Button>
                    </div>
                    <div className="pt-2 text-sm text-destructive/80 text-right">
                      تنبيه: هذا العقد غير معتمد إلا بعد الدفع
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* لوحة المعلومات الجانبية */}
              <div className="space-y-6">
                {/* معلومات مهمة */}
                <Card className="border-warning/20 bg-warning/5 shadow-lg">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-bold text-right flex items-center gap-2 text-warning">
                      <AlertTriangle className="w-6 h-6" />
                      معلومات مهمة حول التعاقد
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4" dir="rtl">
                    <div className="flex items-start gap-3 p-3 bg-white/50 rounded-lg">
                      <Info className="w-5 h-5 text-warning mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">بداية العقد</p>
                        <p className="text-sm text-muted-foreground">العقد يصبح معتمداً فقط بعد سداد الدفعة المقدمة (50% من القيمة الإجمالية)</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-3 bg-white/50 rounded-lg">
                      <CreditCard className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">نظام الدفع</p>
                        <p className="text-sm text-muted-foreground">دفعة أولى 50% للبدء + المتبقي عند التسليم النهائي</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-3 bg-white/50 rounded-lg">
                      <Shield className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">الضمان الشامل</p>
                        <p className="text-sm text-muted-foreground">ضمان شامل لمدة 6 أشهر على جميع الخدمات مع دعم مجاني</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* طرق الدفع المتاحة */}
                <Card className="shadow-lg">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-bold text-right flex items-center gap-2">
                      <CreditCard className="w-6 h-6 text-primary" />
                      طرق الدفع المتاحة
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4" dir="rtl">
                    <div className="grid grid-cols-1 gap-3">
                      {[
                        { name: 'البطاقات الائتمانية', icon: CreditCard, color: 'text-blue-600', bg: 'bg-blue-50' },
                        { name: 'التحويل البنكي', icon: Building2, color: 'text-green-600', bg: 'bg-green-50' },
                        { name: 'STC Pay', icon: Phone, color: 'text-purple-600', bg: 'bg-purple-50' },
                        { name: 'تابي - تمارا', icon: CheckCircle2, color: 'text-orange-600', bg: 'bg-orange-50' }
                      ].map((payment, idx) => (
                        <div key={idx} className={`flex items-center gap-3 p-4 ${payment.bg} rounded-lg border`}>
                          <payment.icon className={`w-6 h-6 ${payment.color}`} />
                          <span className="font-medium">{payment.name}</span>
                        </div>
                      ))}
                    </div>
                    <div className="pt-2">
                      <Button
                        className="w-full"
                        disabled={!isFormValid() || isSubmitting}
                        onClick={handlePayDeposit}
                      >
                        ادفع الدفعة المقدمة 50% عبر Paylink
                      </Button>
                      <p className="text-xs text-muted-foreground mt-2">
                        🔒 الدفع آمن عبر Paylink. سيتم إصدار العقد تلقائياً بعد نجاح الدفع وإشعار الطرفين عبر البريد.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* إحصائيات وثقة */}
                <Card className="shadow-lg">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-bold text-right">الثقة والإنجازات</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4" dir="rtl">
                    {[
                      { value: '500+', label: 'عقد مكتمل', color: 'text-primary', bg: 'bg-primary/10' },
                      { value: '99%', label: 'رضا العملاء', color: 'text-green-600', bg: 'bg-green-50' },
                      { value: '24/7', label: 'دعم مستمر', color: 'text-blue-600', bg: 'bg-blue-50' },
                      { value: '6', label: 'أشهر ضمان', color: 'text-orange-600', bg: 'bg-orange-50' }
                    ].map((stat, idx) => (
                      <div key={idx} className={`text-center p-4 ${stat.bg} rounded-xl border`}>
                        <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                        <div className="text-sm text-muted-foreground">{stat.label}</div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* دعم العملاء */}
                <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 shadow-lg">
                  <CardContent className="p-6 text-center" dir="rtl">
                    <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Phone className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">هل تحتاج مساعدة؟</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      فريق الدعم متاح 24/7 لمساعدتك في إتمام التعاقد
                    </p>
                    <div className="space-y-2">
                      <Button variant="outline" size="sm" className="w-full">
                        <Phone className="w-4 h-4 ml-2" />
                        0555812567
                      </Button>
                      <Button variant="outline" size="sm" className="w-full">
                        <Mail className="w-4 h-4 ml-2" />
                        تواصل معنا
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </>
  );
};

export default DigitalContracts;