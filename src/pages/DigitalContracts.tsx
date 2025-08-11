import React, { useState, useRef, useEffect } from 'react';
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';
import { Download, PenTool, Stamp } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import SignatureCanvas from 'react-signature-canvas';

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
  { id: '11', name: 'الدعم التقني', description: 'دعم شهري أو سنوي', basePrice: 2000, category: 'support' },
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

  const filteredServices = selectedCategory === 'all' 
    ? COMPANY_SERVICES 
    : COMPANY_SERVICES.filter(service => service.category === selectedCategory);

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

  // دالة إنشاء HTML للعقد
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

    const contractElement = document.createElement('div');
    contractElement.style.cssText = `
        width: 210mm;
        min-height: 297mm;
        padding: 15mm;
        background: white;
        font-family: 'Arial', 'Tahoma', sans-serif;
        font-size: 11pt;
        line-height: 1.4;
        direction: rtl;
        text-align: right;
        color: #000;
        position: absolute;
        top: -9999px;
        left: -9999px;
        box-sizing: border-box;
        margin: 0;
        page-break-inside: avoid;
    `;

    contractElement.innerHTML = `
      <div style="width: 100%; height: 100%; background: white;">
        
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
                رقم العقد: ASH-${Date.now().toString().slice(-8)}
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
        <div style="margin-bottom: 15pt;">
          <h3 style="font-size: 12pt; font-weight: bold; color: #1e3a8a; margin: 0 0 10pt 0; border-bottom: 1px solid #d1d5db; padding-bottom: 5pt;">
            موضوع العقد والخدمات المطلوبة
          </h3>
          <div style="border: 1px solid #d1d5db; padding: 12pt; background: #f9fafb;">
            <p style="margin: 0 0 12pt 0; font-weight: bold; color: #1e3a8a;">الخدمات المتفق عليها:</p>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 15pt;">
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
            الشروط والأحكام
          </h3>
          <div style="border: 1px solid #d1d5db; padding: 12pt;">
            <div style="margin-bottom: 10pt;">
              <strong>المادة الأولى - مدة العقد:</strong><br>
              يبدأ العقد من تاريخ التوقيع ويستمر حتى تسليم المشروع كاملاً وفق المواصفات المتفق عليها.
            </div>
            <div style="margin-bottom: 10pt;">
              <strong>المادة الثانية - الالتزامات:</strong><br>
              يلتزم الطرف الأول بتقديم الخدمة وفق أعلى معايير الجودة، ويلتزم الطرف الثاني بتوفير المتطلبات اللازمة والسداد في المواعيد المحددة.
            </div>
            <div style="margin-bottom: 10pt;">
              <strong>المادة الثالثة - الضمان:</strong><br>
              تضمن الشركة سلامة العمل لمدة ستة أشهر من تاريخ التسليم النهائي مع توفير الدعم التقني المجاني.
            </div>
            <div style="margin-bottom: 10pt;">
              <strong>المادة الرابعة - السرية:</strong><br>
              يتعهد الطرفان بالحفاظ على سرية جميع المعلومات المتبادلة وعدم إفشائها لأي طرف ثالث.
            </div>
            <div>
              <strong>المادة الخامسة - حل النزاعات:</strong><br>
              في حالة نشوء أي نزاع، يتم حله ودياً، وإلا فيحال للتحكيم وفق الأنظمة السعودية المعمول بها.
            </div>
          </div>
        </div>
        
        <!-- القيمة المالية -->
        <div style="margin-bottom: 15pt;">
          <h3 style="font-size: 12pt; font-weight: bold; color: #1e3a8a; margin: 0 0 10pt 0; border-bottom: 1px solid #d1d5db; padding-bottom: 5pt;">
            القيمة المالية وطريقة السداد
          </h3>
          <table style="width: 100%; border-collapse: collapse; border: 1px solid #d1d5db;">
            <tr style="background: #f3f4f6;">
              <th style="padding: 10pt; border: 1px solid #d1d5db; text-align: center;">البيان</th>
              <th style="padding: 10pt; border: 1px solid #d1d5db; text-align: center;">القيمة</th>
            </tr>
            <tr>
              <td style="padding: 10pt; border: 1px solid #d1d5db; font-weight: bold;">قيمة الخدمات الأساسية</td>
              <td style="padding: 10pt; border: 1px solid #d1d5db; text-align: center;">${formData.totalPrice.toLocaleString()} ريال</td>
            </tr>
            <tr>
              <td style="padding: 10pt; border: 1px solid #d1d5db; font-weight: bold;">ضريبة القيمة المضافة (15%)</td>
              <td style="padding: 10pt; border: 1px solid #d1d5db; text-align: center;">${(formData.totalPrice * 0.15).toLocaleString()} ريال</td>
            </tr>
            <tr style="background: #f3f4f6;">
              <td style="padding: 10pt; border: 1px solid #d1d5db; font-weight: bold;">القيمة الإجمالية شاملة الضريبة</td>
              <td style="padding: 10pt; border: 1px solid #d1d5db; text-align: center; font-weight: bold;">${(formData.totalPrice * 1.15).toLocaleString()} ريال</td>
            </tr>
          </table>
          <div style="margin-top: 10pt; padding: 8pt; background: #f0f9ff; border: 1px solid #3b82f6; border-radius: 4pt;">
            <strong>طريقة السداد:</strong> يتم السداد على دفعات متفق عليها، مع دفعة مقدمة قدرها 50% عند بداية العمل والباقي عند التسليم النهائي.
          </div>
        </div>
        
        <!-- التوقيعات والأختام الرقمية -->
        <div style="margin-top: 30pt;">
          <h3 style="font-size: 12pt; font-weight: bold; color: #1e3a8a; margin: 0 0 15pt 0; border-bottom: 1px solid #d1d5db; padding-bottom: 5pt;">
            التوقيعات والأختام الرقمية
          </h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="width: 50%; padding: 20pt; border: 1px solid #d1d5db; text-align: center; vertical-align: top;">
                <div style="margin-bottom: 15pt;">
                  <img src="${createDigitalStamp()}" style="width: 120pt; height: 120pt;" alt="ختم الشركة الرقمي">
                </div>
                <strong>الطرف الأول</strong><br>
                شركة علي صالح الشهري القابضة<br>
                الأستاذ / علي صالح الشهري<br>
                المدير العام<br>
                <div style="margin-top: 8pt; font-size: 9pt; color: #64748b;">
                  الختم الرقمي المعتمد
                </div>
              </td>
              <td style="width: 50%; padding: 20pt; border: 1px solid #d1d5db; text-align: center; vertical-align: top;">
                ${formData.digitalSignature ? `
                  <div style="margin-bottom: 15pt; border: 1px solid #d1d5db; padding: 10pt;">
                    <img src="${formData.digitalSignature}" style="width: 150pt; height: 80pt;" alt="توقيع العميل الرقمي">
                  </div>
                ` : `
                  <div style="border: 1px solid #d1d5db; height: 100pt; margin-bottom: 15pt; display: flex; align-items: center; justify-content: center; background: #f9fafb;">
                    <span style="color: #64748b; font-size: 10pt;">منطقة التوقيع الرقمي</span>
                  </div>
                `}
                <strong>الطرف الثاني</strong><br>
                ${formData.clientName || 'العميل المحترم'}<br>
                ${formData.clientID ? `رقم الهوية: ${formData.clientID}` : 'رقم الهوية: ______'}<br>
                <div style="margin-top: 8pt; font-size: 9pt; color: #64748b;">
                  التوقيع الرقمي المعتمد
                </div>
              </td>
            </tr>
          </table>
        </div>
        
        <!-- ختم الصفحة -->
        <div style="text-align: center; margin-top: 20pt; padding-top: 15pt; border-top: 1px solid #d1d5db; font-size: 9pt; color: #64748b;">
          تم إنشاء هذا العقد إلكترونياً بتاريخ ${contractDate} - شركة علي صالح الشهري القابضة
        </div>
        
      </div>
    `;

    return contractElement;
  };

  // إنشاء وإرجاع PDF للعقد
  const generateContractPDF = () => {
    return new Promise<jsPDF>((resolve, reject) => {
      try {
        const contractElement = createContractHTML();
        document.body.appendChild(contractElement);
        
        setTimeout(() => {
          html2canvas(contractElement, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff'
          }).then((canvas) => {
            document.body.removeChild(contractElement);
            
            const pdf = new jsPDF({
              orientation: 'portrait',
              unit: 'mm',
              format: 'a4'
            });

            const imgData = canvas.toDataURL('image/png');
            const imgWidth = 210;
            const pageHeight = 295;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;

            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
              position = heightLeft - imgHeight;
              pdf.addPage();
              pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
              heightLeft -= pageHeight;
            }

            resolve(pdf);
          }).catch((error) => {
            if (document.body.contains(contractElement)) {
              document.body.removeChild(contractElement);
            }
            reject(error);
          });
        }, 100);
      } catch (error) {
        reject(error);
      }
    });
  };

  const handleDownloadPDF = async () => {
    try {
      const pdfDoc = await generateContractPDF();
      (pdfDoc as any).save(`contract-${formData.clientName || 'client'}-${Date.now()}.pdf`);
      
      toast.success('تم تحميل العقد بنجاح');
    } catch (error) {
      toast.error('حدث خطأ أثناء إنشاء ملف PDF');
    }
  };

  const handleInputChange = (field: keyof FormData, value: string | boolean | number | Service[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-12" dir="rtl">
        <Card className="max-w-6xl mx-auto shadow-xl">
          <CardHeader className="text-center space-y-4 pb-8">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto">
              <span className="text-primary-foreground font-bold text-xl">ASH</span>
            </div>
            <CardTitle className="text-3xl font-bold text-primary">نظام التعاقد الإلكتروني المتقدم</CardTitle>
            <p className="text-muted-foreground">شركة علي صالح الشهري القابضة للتقنية والحلول الرقمية</p>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* بيانات العميل */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="clientName" className="text-right block font-semibold">اسم العميل الكامل</Label>
                <Input
                  id="clientName"
                  value={formData.clientName}
                  onChange={(e) => handleInputChange('clientName', e.target.value)}
                  placeholder="أدخل اسم العميل الكامل"
                  className="text-right"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="clientID" className="text-right block font-semibold">رقم الهوية / السجل التجاري</Label>
                <Input
                  id="clientID"
                  value={formData.clientID}
                  onChange={(e) => handleInputChange('clientID', e.target.value)}
                  placeholder="أدخل رقم الهوية أو السجل التجاري"
                  className="text-right"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="clientPhone" className="text-right block font-semibold">رقم الجوال</Label>
                <Input
                  id="clientPhone"
                  value={formData.clientPhone}
                  onChange={(e) => handleInputChange('clientPhone', e.target.value)}
                  placeholder="أدخل رقم الجوال"
                  className="text-right"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="clientEmail" className="text-right block font-semibold">البريد الإلكتروني</Label>
                <Input
                  id="clientEmail"
                  type="email"
                  value={formData.clientEmail}
                  onChange={(e) => handleInputChange('clientEmail', e.target.value)}
                  placeholder="أدخل البريد الإلكتروني"
                  className="text-right"
                />
              </div>
            </div>

            {/* اختيار الخدمات */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-primary">اختيار الخدمات</h3>
                <Button 
                  onClick={() => setShowServices(!showServices)}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  {showServices ? 'إخفاء الخدمات' : 'عرض الخدمات'}
                </Button>
              </div>

              {showServices && (
                <div className="space-y-4">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="اختر فئة الخدمات" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الخدمات</SelectItem>
                      <SelectItem value="design">خدمات التصميم</SelectItem>
                      <SelectItem value="web">تطوير المواقع</SelectItem>
                      <SelectItem value="mobile">تطبيقات الجوال</SelectItem>
                      <SelectItem value="systems">الأنظمة</SelectItem>
                      <SelectItem value="cloud">الحلول السحابية</SelectItem>
                      <SelectItem value="security">أمن المعلومات</SelectItem>
                      <SelectItem value="ai">الذكاء الاصطناعي</SelectItem>
                      <SelectItem value="consulting">الاستشارات</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                    {filteredServices.map(service => (
                      <Card key={service.id} className="cursor-pointer hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <h4 className="font-semibold text-sm mb-2">{service.name}</h4>
                          <p className="text-xs text-muted-foreground mb-3">{service.description}</p>
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-primary">{service.basePrice.toLocaleString()} ريال</span>
                            <Button 
                              size="sm"
                              onClick={() => addService(service)}
                              disabled={formData.selectedServices.some(s => s.id === service.id)}
                            >
                              {formData.selectedServices.some(s => s.id === service.id) ? 'مُضافة' : 'إضافة'}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* الخدمات المختارة */}
              {formData.selectedServices.length > 0 && (
                <div className="space-y-4">
                  <h4 className="font-semibold">الخدمات المختارة:</h4>
                  <div className="space-y-2">
                    {formData.selectedServices.map(service => (
                      <div key={service.id} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                        <div>
                          <span className="font-medium">{service.name}</span>
                          <span className="text-sm text-muted-foreground mr-2">- {service.basePrice.toLocaleString()} ريال</span>
                        </div>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => removeService(service.id)}
                        >
                          حذف
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="text-lg font-bold text-primary text-center p-4 bg-primary/10 rounded-lg">
                    المجموع: {formData.totalPrice.toLocaleString()} ريال (شامل الضريبة: {(formData.totalPrice * 1.15).toLocaleString()} ريال)
                  </div>
                </div>
              )}
            </div>

            {/* وصف المشروع */}
            <div className="space-y-2">
              <Label htmlFor="projectDescription" className="text-right block font-semibold">وصف إضافي للمشروع</Label>
              <Textarea
                id="projectDescription"
                value={formData.projectDescription}
                onChange={(e) => handleInputChange('projectDescription', e.target.value)}
                placeholder="أدخل أي متطلبات إضافية أو تفاصيل خاصة بالمشروع"
                rows={4}
                className="text-right resize-none"
              />
            </div>

            {/* التوقيع الرقمي */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-primary flex items-center gap-2">
                <PenTool className="w-5 h-5" />
                التوقيع الرقمي
              </h3>
              <div className="border-2 border-dashed border-muted-foreground rounded-lg p-4">
                <SignatureCanvas
                  ref={signatureRef}
                  canvasProps={{
                    width: 500,
                    height: 200,
                    className: 'signature-canvas w-full border rounded'
                  }}
                />
                <div className="flex gap-2 mt-2">
                  <Button onClick={clearSignature} variant="outline" size="sm">مسح التوقيع</Button>
                  <Button onClick={saveSignature} size="sm">حفظ التوقيع</Button>
                </div>
              </div>
            </div>

            {/* الموافقات */}
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-3 space-x-reverse">
                <Checkbox 
                  id="terms" 
                  checked={formData.agreeToTerms}
                  onCheckedChange={(checked) => handleInputChange('agreeToTerms', !!checked)}
                />
                <Label htmlFor="terms" className="text-sm font-medium cursor-pointer">أوافق على الشروط والأحكام</Label>
              </div>

              <div className="flex items-center justify-center space-x-3 space-x-reverse">
                <Checkbox 
                  id="privacy" 
                  checked={formData.agreeToPrivacy}
                  onCheckedChange={(checked) => handleInputChange('agreeToPrivacy', !!checked)}
                />
                <Label htmlFor="privacy" className="text-sm font-medium cursor-pointer">أوافق على سياسة الخصوصية</Label>
              </div>
            </div>

            {/* إنشاء العقد */}
            <div className="flex justify-center pt-6">
              <Button 
                onClick={handleDownloadPDF} 
                className="flex items-center gap-3 px-8 py-3"
                size="lg"
                disabled={!formData.agreeToTerms || !formData.agreeToPrivacy || formData.selectedServices.length === 0}
              >
                <Download className="w-5 h-5" />
                <Stamp className="w-5 h-5" />
                إنشاء العقد الرقمي PDF
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default DigitalContracts;