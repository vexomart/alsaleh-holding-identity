import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileText, Loader } from 'lucide-react';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface SpecificationsPDFProps {
  projectTitle: string;
  projectDescription: string;
  features: string[];
  technologies: string[];
  duration: string;
  price?: string;
  className?: string;
}

const SpecificationsPDF = ({ 
  projectTitle, 
  projectDescription, 
  features, 
  technologies, 
  duration, 
  price,
  className 
}: SpecificationsPDFProps) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateAdvancedPDF = async () => {
    setIsGenerating(true);
    
    try {
      // إنشاء عنصر HTML مخفي للتصميم المتقدم
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.width = '794px'; // عرض A4 بـ pixels
      tempDiv.style.backgroundColor = 'white';
      tempDiv.style.fontFamily = 'Arial, sans-serif';
      tempDiv.style.direction = 'rtl';
      tempDiv.style.textAlign = 'right';
      
      tempDiv.innerHTML = `
        <div style="padding: 40px; min-height: 1123px;">
          <!-- Header Section -->
          <div style="background: linear-gradient(135deg, #1e40af 0%, #7c3aed 100%); 
                      color: white; 
                      padding: 30px; 
                      border-radius: 15px; 
                      margin-bottom: 30px;
                      box-shadow: 0 10px 30px rgba(0,0,0,0.2);">
            <div style="text-align: center;">
              <div style="width: 80px; height: 80px; background: white; border-radius: 50%; 
                          margin: 0 auto 20px; display: flex; align-items: center; 
                          justify-content: center; box-shadow: 0 5px 15px rgba(0,0,0,0.3);">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="#1e40af">
                  <path d="M12 2L2 7V10C2 16 6 20.9 12 22C18 20.9 22 16 22 10V7L12 2Z"/>
                </svg>
              </div>
              <h1 style="font-size: 32px; font-weight: bold; margin: 0 0 10px 0;">
                شركة علي صالح الشهري القابضة
              </h1>
              <p style="font-size: 18px; opacity: 0.9; margin: 0;">
                مواصفات تقنية متقدمة للمشروع
              </p>
              <div style="background: rgba(255,255,255,0.2); 
                          border-radius: 25px; 
                          padding: 8px 20px; 
                          display: inline-block; 
                          margin-top: 15px;">
                <span style="font-size: 14px;">تاريخ الإنشاء: ${new Date().toLocaleDateString('ar-SA')}</span>
              </div>
            </div>
          </div>

          <!-- Project Title Section -->
          <div style="background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); 
                      padding: 25px; 
                      border-radius: 12px; 
                      margin-bottom: 25px;
                      border-right: 5px solid #3b82f6;">
            <h2 style="font-size: 28px; color: #1e293b; margin: 0 0 15px 0; font-weight: bold;">
              📊 ${projectTitle}
            </h2>
            <div style="display: flex; gap: 15px; flex-wrap: wrap;">
              <div style="background: #dbeafe; color: #1e40af; padding: 8px 16px; 
                          border-radius: 20px; font-size: 14px; font-weight: 500;">
                ⏱️ مدة التنفيذ: ${duration}
              </div>
              ${price ? `
                <div style="background: #dcfce7; color: #16a34a; padding: 8px 16px; 
                            border-radius: 20px; font-size: 14px; font-weight: 500;">
                  💰 السعر: ${price}
                </div>
              ` : ''}
              <div style="background: #fef3c7; color: #d97706; padding: 8px 16px; 
                          border-radius: 20px; font-size: 14px; font-weight: 500;">
                🚀 جاهز للتنفيذ
              </div>
            </div>
          </div>

          <!-- Project Description -->
          <div style="background: white; 
                      padding: 25px; 
                      border-radius: 12px; 
                      margin-bottom: 25px;
                      box-shadow: 0 4px 6px rgba(0,0,0,0.05);
                      border: 1px solid #e2e8f0;">
            <h3 style="font-size: 20px; color: #1e293b; margin: 0 0 15px 0; 
                       display: flex; align-items: center; gap: 10px;">
              📝 وصف المشروع
            </h3>
            <p style="font-size: 16px; line-height: 1.8; color: #475569; margin: 0;">
              ${projectDescription}
            </p>
          </div>

          <!-- Features Section -->
          <div style="background: white; 
                      padding: 25px; 
                      border-radius: 12px; 
                      margin-bottom: 25px;
                      box-shadow: 0 4px 6px rgba(0,0,0,0.05);
                      border: 1px solid #e2e8f0;">
            <h3 style="font-size: 20px; color: #1e293b; margin: 0 0 20px 0; 
                       display: flex; align-items: center; gap: 10px;">
              ⭐ المميزات الرئيسية
            </h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
              ${features.map((feature, index) => `
                <div style="display: flex; align-items: center; gap: 10px; 
                            padding: 12px; background: #f8fafc; border-radius: 8px;">
                  <div style="width: 8px; height: 8px; background: #3b82f6; 
                              border-radius: 50%; flex-shrink: 0;"></div>
                  <span style="font-size: 14px; color: #475569;">${feature}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Technologies Section -->
          <div style="background: white; 
                      padding: 25px; 
                      border-radius: 12px; 
                      margin-bottom: 25px;
                      box-shadow: 0 4px 6px rgba(0,0,0,0.05);
                      border: 1px solid #e2e8f0;">
            <h3 style="font-size: 20px; color: #1e293b; margin: 0 0 20px 0; 
                       display: flex; align-items: center; gap: 10px;">
              🔧 التقنيات المستخدمة
            </h3>
            <div style="display: flex; flex-wrap: wrap; gap: 10px;">
              ${technologies.map(tech => `
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                            color: white; 
                            padding: 10px 16px; 
                            border-radius: 25px; 
                            font-size: 14px; 
                            font-weight: 500;
                            box-shadow: 0 3px 10px rgba(0,0,0,0.2);">
                  ${tech}
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Services & Support Section -->
          <div style="background: white; 
                      padding: 25px; 
                      border-radius: 12px; 
                      margin-bottom: 25px;
                      box-shadow: 0 4px 6px rgba(0,0,0,0.05);
                      border: 1px solid #e2e8f0;">
            <h3 style="font-size: 20px; color: #1e293b; margin: 0 0 20px 0; 
                       display: flex; align-items: center; gap: 10px;">
              🎯 الخدمات والدعم المتضمن
            </h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
              <div>
                <h4 style="font-size: 16px; color: #3b82f6; margin: 0 0 12px 0; font-weight: bold;">
                  📋 خدمات التطوير
                </h4>
                <ul style="list-style: none; padding: 0; margin: 0;">
                  <li style="padding: 6px 0; color: #64748b; font-size: 14px;">✓ تحليل وتصميم النظام</li>
                  <li style="padding: 6px 0; color: #64748b; font-size: 14px;">✓ برمجة وتطوير متقدم</li>
                  <li style="padding: 6px 0; color: #64748b; font-size: 14px;">✓ اختبار شامل للجودة</li>
                  <li style="padding: 6px 0; color: #64748b; font-size: 14px;">✓ تسليم المشروع كاملاً</li>
                </ul>
              </div>
              <div>
                <h4 style="font-size: 16px; color: #16a34a; margin: 0 0 12px 0; font-weight: bold;">
                  🛠️ الدعم والصيانة
                </h4>
                <ul style="list-style: none; padding: 0; margin: 0;">
                  <li style="padding: 6px 0; color: #64748b; font-size: 14px;">✓ دعم تقني مجاني لمدة 6 أشهر</li>
                  <li style="padding: 6px 0; color: #64748b; font-size: 14px;">✓ تحديثات أمنية دورية</li>
                  <li style="padding: 6px 0; color: #64748b; font-size: 14px;">✓ تدريب فريق العمل</li>
                  <li style="padding: 6px 0; color: #64748b; font-size: 14px;">✓ وثائق تقنية مفصلة</li>
                </ul>
              </div>
            </div>
            
            <div style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); 
                        padding: 20px; 
                        border-radius: 10px; 
                        margin-top: 20px;
                        border-right: 4px solid #3b82f6;">
              <h4 style="font-size: 16px; color: #1e40af; margin: 0 0 10px 0; font-weight: bold;">
                🏆 ضمانات الجودة
              </h4>
              <p style="font-size: 14px; color: #1e293b; margin: 0; line-height: 1.6;">
                نضمن جودة العمل وفقاً لأعلى المعايير الدولية، مع إمكانية المراجعة والتعديل حتى 3 مرات مجاناً. 
                كما نوفر استضافة مجانية لمدة سنة كاملة مع شهادة SSL وحماية متقدمة ضد الهجمات الإلكترونية.
              </p>
            </div>
          </div>

          <!-- Timeline Section -->
          <div style="background: white; 
                      padding: 25px; 
                      border-radius: 12px; 
                      margin-bottom: 25px;
                      box-shadow: 0 4px 6px rgba(0,0,0,0.05);
                      border: 1px solid #e2e8f0;">
            <h3 style="font-size: 20px; color: #1e293b; margin: 0 0 20px 0; 
                       display: flex; align-items: center; gap: 10px;">
              📅 خطة التنفيذ والجدولة الزمنية
            </h3>
            <div style="position: relative;">
              <div style="position: absolute; right: 20px; top: 0; bottom: 0; width: 2px; background: #e2e8f0;"></div>
              
              <div style="position: relative; padding-right: 50px; margin-bottom: 20px;">
                <div style="position: absolute; right: 11px; top: 5px; width: 12px; height: 12px; 
                            background: #3b82f6; border-radius: 50%; border: 3px solid white; 
                            box-shadow: 0 0 0 2px #3b82f6;"></div>
                <h4 style="font-size: 14px; color: #3b82f6; margin: 0 0 5px 0; font-weight: bold;">
                  المرحلة الأولى: التحليل والتصميم (25% من المدة)
                </h4>
                <p style="font-size: 13px; color: #64748b; margin: 0;">
                  دراسة المتطلبات، تصميم واجهة المستخدم، وضع الهيكل التقني
                </p>
              </div>
              
              <div style="position: relative; padding-right: 50px; margin-bottom: 20px;">
                <div style="position: absolute; right: 11px; top: 5px; width: 12px; height: 12px; 
                            background: #f59e0b; border-radius: 50%; border: 3px solid white; 
                            box-shadow: 0 0 0 2px #f59e0b;"></div>
                <h4 style="font-size: 14px; color: #f59e0b; margin: 0 0 5px 0; font-weight: bold;">
                  المرحلة الثانية: التطوير الأساسي (50% من المدة)
                </h4>
                <p style="font-size: 13px; color: #64748b; margin: 0;">
                  برمجة الوظائف الأساسية، تطوير قاعدة البيانات، ربط APIs
                </p>
              </div>
              
              <div style="position: relative; padding-right: 50px;">
                <div style="position: absolute; right: 11px; top: 5px; width: 12px; height: 12px; 
                            background: #16a34a; border-radius: 50%; border: 3px solid white; 
                            box-shadow: 0 0 0 2px #16a34a;"></div>
                <h4 style="font-size: 14px; color: #16a34a; margin: 0 0 5px 0; font-weight: bold;">
                  المرحلة الثالثة: الاختبار والتسليم (25% من المدة)
                </h4>
                <p style="font-size: 13px; color: #64748b; margin: 0;">
                  اختبار شامل، تحسين الأداء، التدريب والتسليم النهائي
                </p>
              </div>
            </div>
          </div>

          <!-- Contact Information -->
          <div style="background: linear-gradient(135deg, #1f2937 0%, #374151 100%); 
                      color: white; 
                      padding: 25px; 
                      border-radius: 12px; 
                      margin-bottom: 20px;">
            <h3 style="font-size: 20px; margin: 0 0 20px 0; text-align: center;">
              📞 معلومات التواصل
            </h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; text-align: center;">
              <div>
                <div style="background: rgba(255,255,255,0.1); 
                            padding: 15px; 
                            border-radius: 10px;">
                  <p style="margin: 0 0 8px 0; font-size: 14px; opacity: 0.8;">خدمة العملاء</p>
                  <p style="margin: 0; font-size: 16px; font-weight: bold;">0555812567</p>
                </div>
              </div>
              <div>
                <div style="background: rgba(255,255,255,0.1); 
                            padding: 15px; 
                            border-radius: 10px;">
                  <p style="margin: 0 0 8px 0; font-size: 14px; opacity: 0.8;">البريد الإلكتروني</p>
                  <p style="margin: 0; font-size: 16px; font-weight: bold;">info@ash-holding.sa</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div style="text-align: center; 
                      padding: 20px; 
                      background: #f8fafc; 
                      border-radius: 10px; 
                      border-top: 3px solid #3b82f6;">
            <p style="margin: 0; font-size: 14px; color: #64748b;">
              © 2024 شركة علي صالح الشهري القابضة - جميع الحقوق محفوظة
            </p>
            <p style="margin: 5px 0 0 0; font-size: 12px; color: #94a3b8;">
              تم إنشاء هذا المستند تلقائياً من نظام إدارة المشاريع
            </p>
          </div>
        </div>
      `;

      document.body.appendChild(tempDiv);

      // تحويل HTML إلى Canvas
      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      document.body.removeChild(tempDiv);

      // إنشاء PDF من Canvas
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 210; // عرض A4
      const pageHeight = 297; // ارتفاع A4
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // إضافة الصفحة الأولى
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // إضافة صفحات إضافية إذا لزم الأمر
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // حفظ الملف
      const fileName = `مواصفات_${projectTitle.replace(/\s+/g, '_')}.pdf`;
      pdf.save(fileName);

      toast.success('تم تحميل مواصفات المشروع بنجاح', {
        description: 'تم إنشاء ملف PDF متقدم بالعربية مع تصميم حديث'
      });
    } catch (error) {
      console.error('خطأ في إنشاء PDF:', error);
      toast.error('حدث خطأ أثناء إنشاء ملف PDF', {
        description: 'يرجى المحاولة مرة أخرى'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button 
      size="lg" 
      variant="outline"
      className={`border-slate-300 hover:border-blue-400 hover:text-blue-600 ${className}`}
      onClick={generateAdvancedPDF}
      disabled={isGenerating}
    >
      {isGenerating ? (
        <>
          <Loader className="w-5 h-5 mr-2 animate-spin" />
          جاري إنشاء PDF...
        </>
      ) : (
        <>
          <Download className="w-5 h-5 mr-2" />
          تحميل المواصفات
        </>
      )}
    </Button>
  );
};

export default SpecificationsPDF;