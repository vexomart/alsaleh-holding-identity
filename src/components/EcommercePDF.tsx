import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Loader } from 'lucide-react';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface EcommercePDFProps {
  className?: string;
}

const EcommercePDF = ({ className }: EcommercePDFProps) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateEcommercePDF = async () => {
    setIsGenerating(true);
    
    try {
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.width = '794px';
      tempDiv.style.backgroundColor = 'white';
      tempDiv.style.fontFamily = 'Arial, sans-serif';
      tempDiv.style.direction = 'rtl';
      tempDiv.style.textAlign = 'right';
      
      tempDiv.innerHTML = `
        <div style="padding: 40px; min-height: 1123px;">
          <!-- Header Section -->
          <div style="background: linear-gradient(135deg, #e11d48 0%, #f97316 100%); 
                      color: white; 
                      padding: 30px; 
                      border-radius: 15px; 
                      margin-bottom: 30px;
                      box-shadow: 0 10px 30px rgba(0,0,0,0.2);">
            <div style="text-align: center;">
              <div style="width: 80px; height: 80px; background: white; border-radius: 50%; 
                          margin: 0 auto 20px; display: flex; align-items: center; 
                          justify-content: center; box-shadow: 0 5px 15px rgba(0,0,0,0.3);">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="#e11d48">
                  <path d="M7 4V2C7 1.45 7.45 1 8 1H16C16.55 1 17 1.45 17 2V4H20C20.55 4 21 4.45 21 5S20.55 6 20 6H19V19C19 20.1 18.1 21 17 21H7C5.9 21 5 20.1 5 19V6H4C3.45 6 3 5.55 3 5S3.45 4 4 4H7ZM9 3V4H15V3H9ZM7 6V19H17V6H7Z"/>
                </svg>
              </div>
              <h1 style="font-size: 32px; font-weight: bold; margin: 0 0 10px 0;">
                شركة علي صالح الشهري القابضة
              </h1>
              <p style="font-size: 18px; opacity: 0.9; margin: 0;">
                مواصفات تطبيق التجارة الإلكترونية الذكي
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
          <div style="background: linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%); 
                      padding: 25px; 
                      border-radius: 12px; 
                      margin-bottom: 25px;
                      border-right: 5px solid #f59e0b;">
            <h2 style="font-size: 28px; color: #92400e; margin: 0 0 15px 0; font-weight: bold;">
              🛒 تطبيق التجارة الإلكترونية الذكي
            </h2>
            <div style="display: flex; gap: 15px; flex-wrap: wrap;">
              <div style="background: #dbeafe; color: #1e40af; padding: 8px 16px; 
                          border-radius: 20px; font-size: 14px; font-weight: 500;">
                ⏱️ مدة التنفيذ: 4-6 أسابيع
              </div>
              <div style="background: #dcfce7; color: #16a34a; padding: 8px 16px; 
                          border-radius: 20px; font-size: 14px; font-weight: 500;">
                💰 السعر الشامل: 10,000 ريال
              </div>
              <div style="background: #fef3c7; color: #d97706; padding: 8px 16px; 
                          border-radius: 20px; font-size: 14px; font-weight: 500;">
                🚀 جاهز للتطوير
              </div>
              <div style="background: #fce7f3; color: #be185d; padding: 8px 16px; 
                          border-radius: 20px; font-size: 14px; font-weight: 500;">
                📱 متوافق مع جميع الأجهزة
              </div>
            </div>
          </div>

          <!-- Service Description -->
          <div style="background: white; 
                      padding: 25px; 
                      border-radius: 12px; 
                      margin-bottom: 25px;
                      box-shadow: 0 4px 6px rgba(0,0,0,0.05);
                      border: 1px solid #e2e8f0;">
            <h3 style="font-size: 20px; color: #1e293b; margin: 0 0 15px 0; 
                       display: flex; align-items: center; gap: 10px;">
              📝 وصف الخدمة
            </h3>
            <p style="font-size: 16px; line-height: 1.8; color: #475569; margin: 0;">
              منصة تجارة إلكترونية متكاملة مع نظام دفع آمن يدعم جميع الطرق المحلية (مدى، STC Pay، تابي، تمارا) والعالمية. 
              تشمل إدارة المخزون الذكية، نظام العروض، وتحليلات المبيعات المتقدمة. التطبيق مصمم ليكون سهل الاستخدام 
              ومتوافق مع جميع الأجهزة مع واجهة عصرية وتجربة مستخدم متميزة.
            </p>
          </div>

          <!-- Key Features Section -->
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
              <div style="display: flex; align-items: center; gap: 10px; 
                          padding: 12px; background: #f8fafc; border-radius: 8px;">
                <div style="width: 8px; height: 8px; background: #e11d48; 
                            border-radius: 50%; flex-shrink: 0;"></div>
                <span style="font-size: 14px; color: #475569;">عربة تسوق ذكية</span>
              </div>
              <div style="display: flex; align-items: center; gap: 10px; 
                          padding: 12px; background: #f8fafc; border-radius: 8px;">
                <div style="width: 8px; height: 8px; background: #e11d48; 
                            border-radius: 50%; flex-shrink: 0;"></div>
                <span style="font-size: 14px; color: #475569;">إدارة المخزون المتقدمة</span>
              </div>
              <div style="display: flex; align-items: center; gap: 10px; 
                          padding: 12px; background: #f8fafc; border-radius: 8px;">
                <div style="width: 8px; height: 8px; background: #e11d48; 
                            border-radius: 50%; flex-shrink: 0;"></div>
                <span style="font-size: 14px; color: #475569;">نظام دفع متعدد الطرق</span>
              </div>
              <div style="display: flex; align-items: center; gap: 10px; 
                          padding: 12px; background: #f8fafc; border-radius: 8px;">
                <div style="width: 8px; height: 8px; background: #e11d48; 
                            border-radius: 50%; flex-shrink: 0;"></div>
                <span style="font-size: 14px; color: #475569;">تحليلات المبيعات الذكية</span>
              </div>
              <div style="display: flex; align-items: center; gap: 10px; 
                          padding: 12px; background: #f8fafc; border-radius: 8px;">
                <div style="width: 8px; height: 8px; background: #e11d48; 
                            border-radius: 50%; flex-shrink: 0;"></div>
                <span style="font-size: 14px; color: #475569;">نظام إدارة العروض</span>
              </div>
              <div style="display: flex; align-items: center; gap: 10px; 
                          padding: 12px; background: #f8fafc; border-radius: 8px;">
                <div style="width: 8px; height: 8px; background: #e11d48; 
                            border-radius: 50%; flex-shrink: 0;"></div>
                <span style="font-size: 14px; color: #475569;">تتبع الطلبات المباشر</span>
              </div>
              <div style="display: flex; align-items: center; gap: 10px; 
                          padding: 12px; background: #f8fafc; border-radius: 8px;">
                <div style="width: 8px; height: 8px; background: #e11d48; 
                            border-radius: 50%; flex-shrink: 0;"></div>
                <span style="font-size: 14px; color: #475569;">لوحة تحكم شاملة</span>
              </div>
              <div style="display: flex; align-items: center; gap: 10px; 
                          padding: 12px; background: #f8fafc; border-radius: 8px;">
                <div style="width: 8px; height: 8px; background: #e11d48; 
                            border-radius: 50%; flex-shrink: 0;"></div>
                <span style="font-size: 14px; color: #475569;">تطبيق الجوال الذكي</span>
              </div>
            </div>
          </div>

          <!-- Payment Methods Section -->
          <div style="background: white; 
                      padding: 25px; 
                      border-radius: 12px; 
                      margin-bottom: 25px;
                      box-shadow: 0 4px 6px rgba(0,0,0,0.05);
                      border: 1px solid #e2e8f0;">
            <h3 style="font-size: 20px; color: #1e293b; margin: 0 0 20px 0; 
                       display: flex; align-items: center; gap: 10px;">
              💳 طرق الدفع المدعومة
            </h3>
            <div style="display: flex; flex-wrap: wrap; gap: 10px;">
              <div style="background: linear-gradient(135deg, #16a34a 0%, #15803d 100%); 
                          color: white; 
                          padding: 10px 16px; 
                          border-radius: 25px; 
                          font-size: 14px; 
                          font-weight: 500;
                          box-shadow: 0 3px 10px rgba(0,0,0,0.2);">
                💳 مدى
              </div>
              <div style="background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%); 
                          color: white; 
                          padding: 10px 16px; 
                          border-radius: 25px; 
                          font-size: 14px; 
                          font-weight: 500;
                          box-shadow: 0 3px 10px rgba(0,0,0,0.2);">
                📱 STC Pay
              </div>
              <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); 
                          color: white; 
                          padding: 10px 16px; 
                          border-radius: 25px; 
                          font-size: 14px; 
                          font-weight: 500;
                          box-shadow: 0 3px 10px rgba(0,0,0,0.2);">
                🛍️ تابي
              </div>
              <div style="background: linear-gradient(135deg, #ec4899 0%, #db2777 100%); 
                          color: white; 
                          padding: 10px 16px; 
                          border-radius: 25px; 
                          font-size: 14px; 
                          font-weight: 500;
                          box-shadow: 0 3px 10px rgba(0,0,0,0.2);">
                💰 تمارا
              </div>
              <div style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); 
                          color: white; 
                          padding: 10px 16px; 
                          border-radius: 25px; 
                          font-size: 14px; 
                          font-weight: 500;
                          box-shadow: 0 3px 10px rgba(0,0,0,0.2);">
                🌍 Visa & MasterCard
              </div>
              <div style="background: linear-gradient(135deg, #1f2937 0%, #374151 100%); 
                          color: white; 
                          padding: 10px 16px; 
                          border-radius: 25px; 
                          font-size: 14px; 
                          font-weight: 500;
                          box-shadow: 0 3px 10px rgba(0,0,0,0.2);">
                🔐 Apple Pay
              </div>
            </div>
          </div>

          <!-- Technical Specifications -->
          <div style="background: white; 
                      padding: 25px; 
                      border-radius: 12px; 
                      margin-bottom: 25px;
                      box-shadow: 0 4px 6px rgba(0,0,0,0.05);
                      border: 1px solid #e2e8f0;">
            <h3 style="font-size: 20px; color: #1e293b; margin: 0 0 20px 0; 
                       display: flex; align-items: center; gap: 10px;">
              🔧 المواصفات التقنية
            </h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
              <div>
                <h4 style="font-size: 16px; color: #3b82f6; margin: 0 0 12px 0; font-weight: bold;">
                  🖥️ تقنيات التطوير
                </h4>
                <ul style="list-style: none; padding: 0; margin: 0;">
                  <li style="padding: 6px 0; color: #64748b; font-size: 14px;">✓ React.js للواجهة الأمامية</li>
                  <li style="padding: 6px 0; color: #64748b; font-size: 14px;">✓ Node.js للخادم الخلفي</li>
                  <li style="padding: 6px 0; color: #64748b; font-size: 14px;">✓ MongoDB لقاعدة البيانات</li>
                  <li style="padding: 6px 0; color: #64748b; font-size: 14px;">✓ PWA للتطبيق المحمول</li>
                </ul>
              </div>
              <div>
                <h4 style="font-size: 16px; color: #16a34a; margin: 0 0 12px 0; font-weight: bold;">
                  🔒 الأمان والحماية
                </h4>
                <ul style="list-style: none; padding: 0; margin: 0;">
                  <li style="padding: 6px 0; color: #64748b; font-size: 14px;">✓ تشفير SSL متقدم</li>
                  <li style="padding: 6px 0; color: #64748b; font-size: 14px;">✓ حماية من الهجمات السيبرانية</li>
                  <li style="padding: 6px 0; color: #64748b; font-size: 14px;">✓ نسخ احتياطية آمنة</li>
                  <li style="padding: 6px 0; color: #64748b; font-size: 14px;">✓ مراقبة الأمان 24/7</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Implementation Timeline -->
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
                            background: #e11d48; border-radius: 50%; border: 3px solid white; 
                            box-shadow: 0 0 0 2px #e11d48;"></div>
                <h4 style="font-size: 14px; color: #e11d48; margin: 0 0 5px 0; font-weight: bold;">
                  الأسبوع 1-2: التخطيط والتصميم
                </h4>
                <p style="font-size: 13px; color: #64748b; margin: 0;">
                  تحليل المتطلبات، تصميم قاعدة البيانات، تصميم واجهة المستخدم والتجربة
                </p>
              </div>
              
              <div style="position: relative; padding-right: 50px; margin-bottom: 20px;">
                <div style="position: absolute; right: 11px; top: 5px; width: 12px; height: 12px; 
                            background: #f59e0b; border-radius: 50%; border: 3px solid white; 
                            box-shadow: 0 0 0 2px #f59e0b;"></div>
                <h4 style="font-size: 14px; color: #f59e0b; margin: 0 0 5px 0; font-weight: bold;">
                  الأسبوع 3-4: التطوير الأساسي
                </h4>
                <p style="font-size: 13px; color: #64748b; margin: 0;">
                  برمجة الوظائف الأساسية، تطوير نظام الدفع، إدارة المنتجات والطلبات
                </p>
              </div>
              
              <div style="position: relative; padding-right: 50px; margin-bottom: 20px;">
                <div style="position: absolute; right: 11px; top: 5px; width: 12px; height: 12px; 
                            background: #7c3aed; border-radius: 50%; border: 3px solid white; 
                            box-shadow: 0 0 0 2px #7c3aed;"></div>
                <h4 style="font-size: 14px; color: #7c3aed; margin: 0 0 5px 0; font-weight: bold;">
                  الأسبوع 5: المميزات المتقدمة
                </h4>
                <p style="font-size: 13px; color: #64748b; margin: 0;">
                  إضافة التحليلات، نظام الإشعارات، تحسين الأداء والأمان
                </p>
              </div>
              
              <div style="position: relative; padding-right: 50px;">
                <div style="position: absolute; right: 11px; top: 5px; width: 12px; height: 12px; 
                            background: #16a34a; border-radius: 50%; border: 3px solid white; 
                            box-shadow: 0 0 0 2px #16a34a;"></div>
                <h4 style="font-size: 14px; color: #16a34a; margin: 0 0 5px 0; font-weight: bold;">
                  الأسبوع 6: الاختبار والتسليم
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
                  <p style="margin: 0; font-size: 16px; font-weight: bold;">info@alialshehriholding.com</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div style="text-align: center; 
                      padding: 20px; 
                      background: #f8fafc; 
                      border-radius: 10px; 
                      border-top: 3px solid #e11d48;">
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

      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      document.body.removeChild(tempDiv);

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 210;
      const pageHeight = 297;
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

      const fileName = `مواصفات_تطبيق_التجارة_الإلكترونية.pdf`;
      pdf.save(fileName);

      toast.success('تم تحميل مواصفات تطبيق التجارة الإلكترونية بنجاح', {
        description: 'تم إنشاء ملف PDF متقدم بتصميم احترافي'
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
      onClick={generateEcommercePDF}
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

export default EcommercePDF;