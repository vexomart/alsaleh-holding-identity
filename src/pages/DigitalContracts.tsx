import React, { useState, useRef, useEffect } from 'react';
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from 'sonner';
import { Download } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface FormData {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientID?: string;
  selectedOffer: string;
  projectDescription?: string;
  projectPrice?: string;
  totalPrice?: string;
  agreeToTerms: boolean;
  agreeToPrivacy: boolean;
}

const DigitalContracts = () => {
  const [formData, setFormData] = useState<FormData>({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    clientID: '',
    selectedOffer: '',
    projectDescription: '',
    projectPrice: '',
    totalPrice: '',
    agreeToTerms: false,
    agreeToPrivacy: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

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
        
        <!-- موضوع العقد -->
        <div style="margin-bottom: 15pt;">
          <h3 style="font-size: 12pt; font-weight: bold; color: #1e3a8a; margin: 0 0 10pt 0; border-bottom: 1px solid #d1d5db; padding-bottom: 5pt;">
            موضوع العقد
          </h3>
          <div style="border: 1px solid #d1d5db; padding: 12pt; background: #f9fafb;">
            <p style="margin: 0 0 8pt 0; font-weight: bold;">الخدمة المطلوبة:</p>
            <p style="margin: 0 0 8pt 0;">${formData.selectedOffer || 'خدمة تقنية متقدمة'}</p>
            <p style="margin: 0 0 8pt 0; font-weight: bold;">وصف الخدمة:</p>
            <p style="margin: 0;">${formData.projectDescription || 'تقديم حلول تقنية متكاملة ومتقدمة وفق أحدث المعايير والتقنيات العالمية.'}</p>
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
              <td style="padding: 10pt; border: 1px solid #d1d5db; font-weight: bold;">قيمة الخدمة الأساسية</td>
              <td style="padding: 10pt; border: 1px solid #d1d5db; text-align: center;">${formData.projectPrice || 'حسب الاتفاق'}</td>
            </tr>
            <tr>
              <td style="padding: 10pt; border: 1px solid #d1d5db; font-weight: bold;">ضريبة القيمة المضافة (15%)</td>
              <td style="padding: 10pt; border: 1px solid #d1d5db; text-align: center;">مضافة</td>
            </tr>
            <tr style="background: #f3f4f6;">
              <td style="padding: 10pt; border: 1px solid #d1d5db; font-weight: bold;">القيمة الإجمالية</td>
              <td style="padding: 10pt; border: 1px solid #d1d5db; text-align: center; font-weight: bold;">${formData.totalPrice || 'حسب الاتفاق شامل الضريبة'}</td>
            </tr>
          </table>
          <div style="margin-top: 10pt; padding: 8pt; background: #f0f9ff; border: 1px solid #3b82f6; border-radius: 4pt;">
            <strong>طريقة السداد:</strong> يتم السداد على دفعات متفق عليها، مع دفعة مقدمة قدرها 50% عند بداية العمل والباقي عند التسليم النهائي.
          </div>
        </div>
        
        <!-- التوقيعات -->
        <div style="margin-top: 30pt;">
          <h3 style="font-size: 12pt; font-weight: bold; color: #1e3a8a; margin: 0 0 15pt 0; border-bottom: 1px solid #d1d5db; padding-bottom: 5pt;">
            التوقيعات
          </h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="width: 50%; padding: 20pt; border: 1px solid #d1d5db; text-align: center; vertical-align: bottom;">
                <div style="border-bottom: 1px solid #000; margin-bottom: 8pt; height: 40pt;"></div>
                <strong>الطرف الأول</strong><br>
                شركة علي صالح الشهري القابضة<br>
                الأستاذ / علي صالح الشهري<br>
                المدير العام
              </td>
              <td style="width: 50%; padding: 20pt; border: 1px solid #d1d5db; text-align: center; vertical-align: bottom;">
                <div style="border-bottom: 1px solid #000; margin-bottom: 8pt; height: 40pt;"></div>
                <strong>الطرف الثاني</strong><br>
                ${formData.clientName || 'العميل المحترم'}<br>
                التوقيع والختم
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

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">نظام التعاقد الإلكتروني</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="clientName">اسم العميل</Label>
                <Input
                  id="clientName"
                  value={formData.clientName}
                  onChange={(e) => handleInputChange('clientName', e.target.value)}
                  placeholder="أدخل اسم العميل الكامل"
                />
              </div>
              
              <div>
                <Label htmlFor="clientPhone">رقم الجوال</Label>
                <Input
                  id="clientPhone"
                  value={formData.clientPhone}
                  onChange={(e) => handleInputChange('clientPhone', e.target.value)}
                  placeholder="أدخل رقم الجوال"
                />
              </div>
              
              <div>
                <Label htmlFor="clientEmail">البريد الإلكتروني</Label>
                <Input
                  id="clientEmail"
                  type="email"
                  value={formData.clientEmail}
                  onChange={(e) => handleInputChange('clientEmail', e.target.value)}
                  placeholder="أدخل البريد الإلكتروني"
                />
              </div>
              
              <div>
                <Label htmlFor="selectedOffer">الخدمة المطلوبة</Label>
                <Input
                  id="selectedOffer"
                  value={formData.selectedOffer}
                  onChange={(e) => handleInputChange('selectedOffer', e.target.value)}
                  placeholder="أدخل نوع الخدمة المطلوبة"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="projectDescription">وصف المشروع</Label>
              <Textarea
                id="projectDescription"
                value={formData.projectDescription}
                onChange={(e) => handleInputChange('projectDescription', e.target.value)}
                placeholder="أدخل وصف تفصيلي للمشروع"
                rows={4}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="terms" 
                checked={formData.agreeToTerms}
                onCheckedChange={(checked) => handleInputChange('agreeToTerms', !!checked)}
              />
              <Label htmlFor="terms">أوافق على الشروط والأحكام</Label>
            </div>

            <div className="flex gap-4 justify-center">
              <Button 
                onClick={handleDownloadPDF} 
                className="flex items-center gap-2"
                size="lg"
              >
                <Download className="w-4 h-4" />
                تحميل العقد PDF
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