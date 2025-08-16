import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface CompanyProfilePDFProps {
  className?: string;
}

export const CompanyProfilePDF: React.FC<CompanyProfilePDFProps> = ({ className }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateCompanyProfilePDF = async () => {
    setIsGenerating(true);
    try {
      // Create a temporary element to hold the PDF content
      const element = document.createElement("div");
      element.style.position = "absolute";
      element.style.left = "-9999px";
      element.style.top = "0";
      element.style.width = "210mm";
      element.style.minHeight = "297mm";
      element.style.padding = "0";
      element.style.margin = "0";
      element.style.backgroundColor = "#ffffff";
      element.style.fontFamily = "'Amiri', 'Arial', sans-serif";
      element.style.direction = "rtl";
      element.style.textAlign = "right";

      element.innerHTML = `
        <div style="padding: 40px; line-height: 1.6; color: #1a1a1a;">
          <!-- Header Section -->
          <div style="text-align: center; margin-bottom: 40px; border-bottom: 3px solid #1e40af; padding-bottom: 30px;">
            <div style="background: linear-gradient(135deg, #1e40af, #3b82f6); padding: 30px; border-radius: 15px; color: white; margin-bottom: 20px;">
              <h1 style="font-size: 36px; font-weight: bold; margin: 0 0 10px 0; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">
                شركة علي صالح الشهري القابضة
              </h1>
              <p style="font-size: 18px; margin: 0; opacity: 0.9;">
                الريادة في التكنولوجيا والحلول المتكاملة
              </p>
            </div>
            <p style="font-size: 16px; color: #6b7280; margin: 10px 0;">
              الملف التعريفي الرسمي للشركة | ${new Date().getFullYear()}
            </p>
          </div>

          <!-- Company Overview -->
          <div style="margin-bottom: 40px;">
            <h2 style="font-size: 24px; color: #1e40af; margin-bottom: 20px; border-right: 4px solid #3b82f6; padding-right: 15px;">
              نظرة عامة على الشركة
            </h2>
            <div style="background: #f8fafc; padding: 25px; border-radius: 10px; border: 1px solid #e2e8f0;">
              <p style="font-size: 16px; line-height: 1.8; margin-bottom: 15px;">
                تأسست شركة علي صالح الشهري القابضة كشركة رائدة في مجال التكنولوجيا والحلول المتكاملة، حيث نقدم خدمات متنوعة تشمل تطوير البرمجيات، الذكاء الاصطناعي، التصميم، والحلول التجارية المبتكرة.
              </p>
              <p style="font-size: 16px; line-height: 1.8; margin-bottom: 15px;">
                نسعى لتكون الشريك الموثوق للشركات والمؤسسات في رحلة التحول الرقمي، من خلال فريق متخصص وخبرات متراكمة في مختلف المجالات التقنية والتجارية.
              </p>
              <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 25px;">
                <div style="text-align: center; padding: 15px; background: white; border-radius: 8px; border: 1px solid #e2e8f0;">
                  <div style="font-size: 28px; font-weight: bold; color: #1e40af;">2018</div>
                  <div style="font-size: 14px; color: #6b7280;">سنة التأسيس</div>
                </div>
                <div style="text-align: center; padding: 15px; background: white; border-radius: 8px; border: 1px solid #e2e8f0;">
                  <div style="font-size: 28px; font-weight: bold; color: #1e40af;">500+</div>
                  <div style="font-size: 14px; color: #6b7280;">مشروع منجز</div>
                </div>
                <div style="text-align: center; padding: 15px; background: white; border-radius: 8px; border: 1px solid #e2e8f0;">
                  <div style="font-size: 28px; font-weight: bold; color: #1e40af;">50+</div>
                  <div style="font-size: 14px; color: #6b7280;">موظف متخصص</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Vision and Mission -->
          <div style="margin-bottom: 40px;">
            <h2 style="font-size: 24px; color: #1e40af; margin-bottom: 20px; border-right: 4px solid #3b82f6; padding-right: 15px;">
              الرؤية والرسالة
            </h2>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 25px;">
              <div style="background: linear-gradient(135deg, #1e40af, #3b82f6); padding: 25px; border-radius: 10px; color: white;">
                <h3 style="font-size: 20px; margin-bottom: 15px; text-align: center;">رؤيتنا</h3>
                <p style="font-size: 16px; line-height: 1.7; text-align: center;">
                  أن نكون الشركة الرائدة في المنطقة في مجال التكنولوجيا والحلول المبتكرة، ونساهم في بناء مستقبل رقمي متطور للمملكة العربية السعودية.
                </p>
              </div>
              <div style="background: linear-gradient(135deg, #059669, #10b981); padding: 25px; border-radius: 10px; color: white;">
                <h3 style="font-size: 20px; margin-bottom: 15px; text-align: center;">رسالتنا</h3>
                <p style="font-size: 16px; line-height: 1.7; text-align: center;">
                  تقديم حلول تقنية متطورة وخدمات عالية الجودة تساعد عملاءنا على تحقيق أهدافهم وتطوير أعمالهم بكفاءة وفعالية.
                </p>
              </div>
            </div>
          </div>

          <!-- Services Section -->
          <div style="margin-bottom: 40px;">
            <h2 style="font-size: 24px; color: #1e40af; margin-bottom: 20px; border-right: 4px solid #3b82f6; padding-right: 15px;">
              خدماتنا الرئيسية
            </h2>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;">
              <div style="background: #f8fafc; padding: 20px; border-radius: 10px; border: 1px solid #e2e8f0;">
                <h3 style="font-size: 18px; color: #1e40af; margin-bottom: 15px;">الحلول التقنية المتقدمة</h3>
                <ul style="list-style: none; padding: 0; margin: 0;">
                  <li style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">• تطوير البرمجيات المخصصة</li>
                  <li style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">• تطبيقات الذكاء الاصطناعي</li>
                  <li style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">• الحلول السحابية</li>
                  <li style="padding: 8px 0;">• أمن المعلومات والحماية السيبرانية</li>
                </ul>
              </div>
              <div style="background: #f8fafc; padding: 20px; border-radius: 10px; border: 1px solid #e2e8f0;">
                <h3 style="font-size: 18px; color: #1e40af; margin-bottom: 15px;">الخدمات التصميمية</h3>
                <ul style="list-style: none; padding: 0; margin: 0;">
                  <li style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">• تصميم الهوية البصرية</li>
                  <li style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">• التصميم الجرافيكي الاحترافي</li>
                  <li style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">• تصميم المواقع والتطبيقات</li>
                  <li style="padding: 8px 0;">• الطباعة والإعلان</li>
                </ul>
              </div>
              <div style="background: #f8fafc; padding: 20px; border-radius: 10px; border: 1px solid #e2e8f0;">
                <h3 style="font-size: 18px; color: #1e40af; margin-bottom: 15px;">الخدمات التجارية</h3>
                <ul style="list-style: none; padding: 0; margin: 0;">
                  <li style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">• الاستشارات التجارية</li>
                  <li style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">• إدارة المشاريع</li>
                  <li style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">• التسويق الرقمي</li>
                  <li style="padding: 8px 0;">• تطوير الأعمال</li>
                </ul>
              </div>
              <div style="background: #f8fafc; padding: 20px; border-radius: 10px; border: 1px solid #e2e8f0;">
                <h3 style="font-size: 18px; color: #1e40af; margin-bottom: 15px;">خدمات متخصصة</h3>
                <ul style="list-style: none; padding: 0; margin: 0;">
                  <li style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">• التدريب والتطوير</li>
                  <li style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">• الدعم الفني المتقدم</li>
                  <li style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">• حلول التجارة الإلكترونية</li>
                  <li style="padding: 8px 0;">• أنظمة إدارة المحتوى</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Subsidiaries -->
          <div style="margin-bottom: 40px;">
            <h2 style="font-size: 24px; color: #1e40af; margin-bottom: 20px; border-right: 4px solid #3b82f6; padding-right: 15px;">
              الشركات التابعة
            </h2>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;">
              <div style="background: white; padding: 20px; border-radius: 10px; border: 2px solid #e2e8f0; text-align: center;">
                <div style="width: 60px; height: 60px; background: #1e40af; border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px; font-weight: bold;">إ</div>
                <h3 style="font-size: 16px; margin-bottom: 10px; color: #1e40af;">شركة إمكان للتقنية</h3>
                <p style="font-size: 14px; color: #6b7280;">الحلول التقنية المتقدمة</p>
              </div>
              <div style="background: white; padding: 20px; border-radius: 10px; border: 2px solid #e2e8f0; text-align: center;">
                <div style="width: 60px; height: 60px; background: #059669; border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px; font-weight: bold;">ت</div>
                <h3 style="font-size: 16px; margin-bottom: 10px; color: #1e40af;">شركة تسهيل للخدمات</h3>
                <p style="font-size: 14px; color: #6b7280;">الخدمات اللوجستية</p>
              </div>
              <div style="background: white; padding: 20px; border-radius: 10px; border: 2px solid #e2e8f0; text-align: center;">
                <div style="width: 60px; height: 60px; background: #7c3aed; border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px; font-weight: bold;">م</div>
                <h3 style="font-size: 16px; margin-bottom: 10px; color: #1e40af;">شركة مدفوع للمدفوعات</h3>
                <p style="font-size: 14px; color: #6b7280;">حلول الدفع الإلكتروني</p>
              </div>
            </div>
          </div>

          <!-- Achievements -->
          <div style="margin-bottom: 40px;">
            <h2 style="font-size: 24px; color: #1e40af; margin-bottom: 20px; border-right: 4px solid #3b82f6; padding-right: 15px;">
              إنجازاتنا وشراكاتنا
            </h2>
            <div style="background: #f8fafc; padding: 25px; border-radius: 10px; border: 1px solid #e2e8f0;">
              <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 25px; margin-bottom: 25px;">
                <div>
                  <h3 style="font-size: 18px; color: #1e40af; margin-bottom: 15px;">الجوائز والتقديرات</h3>
                  <ul style="list-style: none; padding: 0; margin: 0;">
                    <li style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">🏆 جائزة أفضل شركة تقنية ناشئة 2023</li>
                    <li style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">⭐ شهادة الجودة ISO 9001:2015</li>
                    <li style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">🎯 عضوية الاتحاد السعودي للأمن السيبراني</li>
                    <li style="padding: 8px 0;">🚀 شريك معتمد لدى مايكروسوفت</li>
                  </ul>
                </div>
                <div>
                  <h3 style="font-size: 18px; color: #1e40af; margin-bottom: 15px;">الشراكات الاستراتيجية</h3>
                  <ul style="list-style: none; padding: 0; margin: 0;">
                    <li style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">☁️ شريك Amazon Web Services</li>
                    <li style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">🔄 شريك Google Cloud Platform</li>
                    <li style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">🎨 شريك Adobe Creative Suite</li>
                    <li style="padding: 8px 0;">🔧 شريك GitHub Enterprise</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <!-- Contact Information -->
          <div style="margin-bottom: 30px;">
            <h2 style="font-size: 24px; color: #1e40af; margin-bottom: 20px; border-right: 4px solid #3b82f6; padding-right: 15px;">
              معلومات الاتصال
            </h2>
            <div style="background: linear-gradient(135deg, #1e40af, #3b82f6); padding: 25px; border-radius: 10px; color: white;">
              <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 25px;">
                <div>
                  <h3 style="font-size: 18px; margin-bottom: 15px;">الاتصال المباشر</h3>
                  <div style="margin-bottom: 10px;">📞 الهاتف: +966 11 234 5678</div>
                  <div style="margin-bottom: 10px;">📱 الجوال: +966 50 123 4567</div>
                  <div style="margin-bottom: 10px;">✉️ البريد: info@alshahriholding.com</div>
                  <div>🌐 الموقع: www.alshahriholding.com</div>
                </div>
                <div>
                  <h3 style="font-size: 18px; margin-bottom: 15px;">العنوان الرئيسي</h3>
                  <div style="margin-bottom: 10px;">📍 الرياض - المملكة العربية السعودية</div>
                  <div style="margin-bottom: 10px;">🏢 حي الملقا - طريق الملك فهد</div>
                  <div style="margin-bottom: 10px;">⏰ ساعات العمل: 8:00 ص - 6:00 م</div>
                  <div>📅 الأحد - الخميس</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div style="text-align: center; padding-top: 20px; border-top: 2px solid #e2e8f0; color: #6b7280;">
            <p style="margin: 0; font-size: 14px;">
              © ${new Date().getFullYear()} شركة علي صالح الشهري القابضة - جميع الحقوق محفوظة
            </p>
            <p style="margin: 5px 0 0 0; font-size: 12px;">
              تم إنشاء هذا الملف بتاريخ: ${new Date().toLocaleDateString('ar-SA')}
            </p>
          </div>
        </div>
      `;

      document.body.appendChild(element);

      // Generate the PDF
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        width: element.offsetWidth,
        height: element.offsetHeight,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      // Add first page
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      // Save the PDF
      pdf.save(`الملف-التعريفي-شركة-علي-صالح-الشهري-القابضة-${new Date().getFullYear()}.pdf`);

      // Clean up
      document.body.removeChild(element);
      
      toast.success("تم تحميل الملف التعريفي بنجاح!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("حدث خطأ أثناء إنشاء الملف التعريفي");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      onClick={generateCompanyProfilePDF}
      disabled={isGenerating}
      variant="ghost"
      className={`relative px-3 py-2 text-sm text-gray-700 hover:text-blue-600 font-medium transition-all duration-300 group ${className}`}
    >
      {isGenerating ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin ml-2" />
          جاري التحميل...
        </>
      ) : (
        <>
          <Download className="h-4 w-4 ml-2" />
          الملف التعريفي
        </>
      )}
      <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></div>
    </Button>
  );
};