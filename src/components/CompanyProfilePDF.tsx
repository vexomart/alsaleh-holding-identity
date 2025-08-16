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
        <div style="width: 210mm; min-height: 297mm; padding: 0; margin: 0; background: #ffffff; font-family: 'Amiri', 'Cairo', Arial, sans-serif; direction: rtl; color: #1a1a1a; page-break-after: always;">
          <!-- Page 1: Cover Page -->
          <div style="height: 297mm; display: flex; flex-direction: column; justify-content: center; align-items: center; background: linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%); color: white; text-align: center; position: relative; overflow: hidden;">
            <!-- Background Pattern -->
            <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; opacity: 0.1; background: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIiAvPjwvc3ZnPg==') repeat;"></div>
            
            <!-- Company Logo Placeholder -->
            <div style="width: 150px; height: 150px; background: rgba(255,255,255,0.15); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 40px; border: 3px solid rgba(255,255,255,0.3); backdrop-filter: blur(10px);">
              <span style="font-size: 48px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">ASH</span>
            </div>
            
            <h1 style="font-size: 48px; font-weight: bold; margin: 0 0 20px 0; text-shadow: 3px 3px 6px rgba(0,0,0,0.4); letter-spacing: 2px;">
              شركة علي صالح الشهري القابضة
            </h1>
            <h2 style="font-size: 24px; margin: 0 0 30px 0; opacity: 0.9; font-weight: 300;">
              ALI SALEH AL-SHAHRI HOLDING COMPANY
            </h2>
            <div style="width: 200px; height: 2px; background: rgba(255,255,255,0.5); margin: 30px 0;"></div>
            <p style="font-size: 20px; margin: 0 0 40px 0; opacity: 0.95; max-width: 600px; line-height: 1.6;">
              الريادة في التكنولوجيا والحلول المتكاملة منذ 2018
            </p>
            
            <!-- Company Info Cards -->
            <div style="display: flex; gap: 30px; margin-top: 50px;">
              <div style="background: rgba(255,255,255,0.15); padding: 20px 30px; border-radius: 15px; backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.2);">
                <div style="font-size: 32px; font-weight: bold;">2018</div>
                <div style="font-size: 14px; opacity: 0.9;">سنة التأسيس</div>
              </div>
              <div style="background: rgba(255,255,255,0.15); padding: 20px 30px; border-radius: 15px; backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.2);">
                <div style="font-size: 32px; font-weight: bold;">500+</div>
                <div style="font-size: 14px; opacity: 0.9;">مشروع منجز</div>
              </div>
              <div style="background: rgba(255,255,255,0.15); padding: 20px 30px; border-radius: 15px; backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.2);">
                <div style="font-size: 32px; font-weight: bold;">50+</div>
                <div style="font-size: 14px; opacity: 0.9;">موظف متخصص</div>
              </div>
            </div>
            
            <div style="position: absolute; bottom: 30px; left: 0; right: 0; text-align: center;">
              <p style="font-size: 16px; opacity: 0.8;">الملف التعريفي الرسمي للشركة | ${new Date().getFullYear()}</p>
            </div>
          </div>
        </div>

        <!-- Page 2: Company Overview -->
        <div style="width: 210mm; min-height: 297mm; padding: 40px; background: #ffffff; page-break-after: always;">
          <!-- Header -->
          <div style="text-align: center; margin-bottom: 50px; border-bottom: 3px solid #1e40af; padding-bottom: 30px;">
            <h1 style="font-size: 36px; color: #1e40af; margin: 0 0 10px 0; font-weight: bold;">
              نظرة عامة على الشركة
            </h1>
            <p style="font-size: 18px; color: #6b7280; margin: 0;">تعرف على شركة علي صالح الشهري القابضة</p>
          </div>

          <!-- Company Description -->
          <div style="margin-bottom: 50px;">
            <div style="background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); padding: 35px; border-radius: 20px; border: 2px solid #e2e8f0; position: relative; overflow: hidden;">
              <div style="position: absolute; top: -20px; right: -20px; width: 100px; height: 100px; background: rgba(30, 64, 175, 0.1); border-radius: 50%;"></div>
              <div style="position: absolute; bottom: -30px; left: -30px; width: 120px; height: 120px; background: rgba(16, 185, 129, 0.1); border-radius: 50%;"></div>
              
              <h2 style="font-size: 28px; color: #1e40af; margin-bottom: 25px; text-align: center; font-weight: bold;">
                من نحن؟
              </h2>
              <p style="font-size: 18px; line-height: 2; margin-bottom: 20px; text-align: justify; color: #374151;">
                تأسست شركة علي صالح الشهري القابضة في عام 2018 كشركة رائدة في مجال التكنولوجيا والحلول المتكاملة. نحن نفخر بكوننا الشريك الموثوق للشركات والمؤسسات في رحلة التحول الرقمي، حيث نقدم مجموعة شاملة من الخدمات التقنية والتجارية المبتكرة.
              </p>
              <p style="font-size: 18px; line-height: 2; margin-bottom: 20px; text-align: justify; color: #374151;">
                نسعى من خلال فريقنا المتخصص وخبراتنا المتراكمة إلى تقديم حلول مبتكرة تلبي احتياجات عملائنا وتساعدهم على تحقيق أهدافهم التجارية والتقنية بأعلى معايير الجودة والكفاءة.
              </p>
              <p style="font-size: 18px; line-height: 2; text-align: justify; color: #374151;">
                تتميز شركتنا بتقديم خدمات متنوعة تشمل تطوير البرمجيات المخصصة، حلول الذكاء الاصطناعي، التصميم الإبداعي، الاستشارات التجارية، والحلول السحابية المتقدمة.
              </p>
            </div>
          </div>

          <!-- Key Statistics -->
          <div style="margin-bottom: 50px;">
            <h2 style="font-size: 24px; color: #1e40af; margin-bottom: 30px; text-align: center; border-bottom: 2px solid #3b82f6; padding-bottom: 15px;">
              إحصائيات الشركة
            </h2>
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 25px;">
              <div style="background: linear-gradient(135deg, #1e40af, #3b82f6); padding: 30px 20px; border-radius: 15px; color: white; text-align: center; box-shadow: 0 10px 25px rgba(30, 64, 175, 0.2);">
                <div style="font-size: 36px; font-weight: bold; margin-bottom: 10px;">2018</div>
                <div style="font-size: 16px; opacity: 0.9;">سنة التأسيس</div>
              </div>
              <div style="background: linear-gradient(135deg, #059669, #10b981); padding: 30px 20px; border-radius: 15px; color: white; text-align: center; box-shadow: 0 10px 25px rgba(5, 150, 105, 0.2);">
                <div style="font-size: 36px; font-weight: bold; margin-bottom: 10px;">500+</div>
                <div style="font-size: 16px; opacity: 0.9;">مشروع منجز</div>
              </div>
              <div style="background: linear-gradient(135deg, #7c3aed, #a855f7); padding: 30px 20px; border-radius: 15px; color: white; text-align: center; box-shadow: 0 10px 25px rgba(124, 58, 237, 0.2);">
                <div style="font-size: 36px; font-weight: bold; margin-bottom: 10px;">50+</div>
                <div style="font-size: 16px; opacity: 0.9;">موظف متخصص</div>
              </div>
              <div style="background: linear-gradient(135deg, #dc2626, #ef4444); padding: 30px 20px; border-radius: 15px; color: white; text-align: center; box-shadow: 0 10px 25px rgba(220, 38, 38, 0.2);">
                <div style="font-size: 36px; font-weight: bold; margin-bottom: 10px;">100+</div>
                <div style="font-size: 16px; opacity: 0.9;">عميل راضٍ</div>
              </div>
            </div>
          </div>

          <!-- Vision and Mission -->
          <div style="margin-bottom: 40px;">
            <h2 style="font-size: 24px; color: #1e40af; margin-bottom: 30px; text-align: center; border-bottom: 2px solid #3b82f6; padding-bottom: 15px;">
              الرؤية والرسالة
            </h2>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px;">
              <div style="background: linear-gradient(135deg, #1e40af, #3b82f6); padding: 35px; border-radius: 20px; color: white; position: relative; overflow: hidden;">
                <div style="position: absolute; top: -15px; right: -15px; width: 80px; height: 80px; background: rgba(255,255,255,0.1); border-radius: 50%;"></div>
                <h3 style="font-size: 24px; margin-bottom: 20px; text-align: center; font-weight: bold;">🎯 رؤيتنا</h3>
                <p style="font-size: 17px; line-height: 1.8; text-align: center;">
                  أن نكون الشركة الرائدة في المنطقة في مجال التكنولوجيا والحلول المبتكرة، ونساهم في بناء مستقبل رقمي متطور للمملكة العربية السعودية ودول المنطقة.
                </p>
              </div>
              <div style="background: linear-gradient(135deg, #059669, #10b981); padding: 35px; border-radius: 20px; color: white; position: relative; overflow: hidden;">
                <div style="position: absolute; top: -15px; left: -15px; width: 80px; height: 80px; background: rgba(255,255,255,0.1); border-radius: 50%;"></div>
                <h3 style="font-size: 24px; margin-bottom: 20px; text-align: center; font-weight: bold;">🚀 رسالتنا</h3>
                <p style="font-size: 17px; line-height: 1.8; text-align: center;">
                  تقديم حلول تقنية متطورة وخدمات عالية الجودة تساعد عملاءنا على تحقيق أهدافهم وتطوير أعمالهم بكفاءة وفعالية، مع الالتزام بأعلى معايير الجودة والابتكار.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Page 3: Services -->
        <div style="width: 210mm; min-height: 297mm; padding: 40px; background: #ffffff; page-break-after: always;">
          <div style="text-align: center; margin-bottom: 50px; border-bottom: 3px solid #1e40af; padding-bottom: 30px;">
            <h1 style="font-size: 36px; color: #1e40af; margin: 0 0 10px 0; font-weight: bold;">
              خدماتنا المتميزة
            </h1>
            <p style="font-size: 18px; color: #6b7280; margin: 0;">نقدم مجموعة شاملة من الخدمات التقنية والتجارية</p>
          </div>

          <!-- Main Services Grid -->
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 25px; margin-bottom: 40px;">
            <!-- Technology Services -->
            <div style="background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); padding: 30px; border-radius: 15px; border: 2px solid #1e40af; position: relative;">
              <div style="position: absolute; top: -10px; right: 20px; background: #1e40af; color: white; padding: 8px 15px; border-radius: 20px; font-size: 12px; font-weight: bold;">⭐ الأكثر طلباً</div>
              <h3 style="font-size: 22px; color: #1e40af; margin-bottom: 20px; text-align: center; font-weight: bold;">💻 الحلول التقنية المتقدمة</h3>
              <ul style="list-style: none; padding: 0; margin: 0;">
                <li style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; font-size: 16px; display: flex; align-items: center;">
                  <span style="color: #1e40af; margin-left: 10px;">▪</span> تطوير البرمجيات المخصصة والتطبيقات
                </li>
                <li style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; font-size: 16px; display: flex; align-items: center;">
                  <span style="color: #1e40af; margin-left: 10px;">▪</span> حلول الذكاء الاصطناعي وتعلم الآلة
                </li>
                <li style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; font-size: 16px; display: flex; align-items: center;">
                  <span style="color: #1e40af; margin-left: 10px;">▪</span> الحلول السحابية وأمن المعلومات
                </li>
                <li style="padding: 12px 0; font-size: 16px; display: flex; align-items: center;">
                  <span style="color: #1e40af; margin-left: 10px;">▪</span> أنظمة إدارة قواعد البيانات
                </li>
              </ul>
            </div>

            <!-- Design Services -->
            <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); padding: 30px; border-radius: 15px; border: 2px solid #059669;">
              <h3 style="font-size: 22px; color: #059669; margin-bottom: 20px; text-align: center; font-weight: bold;">🎨 الخدمات التصميمية</h3>
              <ul style="list-style: none; padding: 0; margin: 0;">
                <li style="padding: 12px 0; border-bottom: 1px solid #dcfce7; font-size: 16px; display: flex; align-items: center;">
                  <span style="color: #059669; margin-left: 10px;">▪</span> تصميم الهوية البصرية الاحترافية
                </li>
                <li style="padding: 12px 0; border-bottom: 1px solid #dcfce7; font-size: 16px; display: flex; align-items: center;">
                  <span style="color: #059669; margin-left: 10px;">▪</span> التصميم الجرافيكي والإعلاني
                </li>
                <li style="padding: 12px 0; border-bottom: 1px solid #dcfce7; font-size: 16px; display: flex; align-items: center;">
                  <span style="color: #059669; margin-left: 10px;">▪</span> تصميم المواقع والتطبيقات
                </li>
                <li style="padding: 12px 0; font-size: 16px; display: flex; align-items: center;">
                  <span style="color: #059669; margin-left: 10px;">▪</span> الطباعة والمواد التسويقية
                </li>
              </ul>
            </div>

            <!-- Business Services -->
            <div style="background: linear-gradient(135deg, #fefce8 0%, #fef3c7 100%); padding: 30px; border-radius: 15px; border: 2px solid #d97706;">
              <h3 style="font-size: 22px; color: #d97706; margin-bottom: 20px; text-align: center; font-weight: bold;">📊 الخدمات التجارية</h3>
              <ul style="list-style: none; padding: 0; margin: 0;">
                <li style="padding: 12px 0; border-bottom: 1px solid #fef3c7; font-size: 16px; display: flex; align-items: center;">
                  <span style="color: #d97706; margin-left: 10px;">▪</span> الاستشارات التجارية والإدارية
                </li>
                <li style="padding: 12px 0; border-bottom: 1px solid #fef3c7; font-size: 16px; display: flex; align-items: center;">
                  <span style="color: #d97706; margin-left: 10px;">▪</span> إدارة المشاريع والتخطيط
                </li>
                <li style="padding: 12px 0; border-bottom: 1px solid #fef3c7; font-size: 16px; display: flex; align-items: center;">
                  <span style="color: #d97706; margin-left: 10px;">▪</span> التسويق الرقمي والإلكتروني
                </li>
                <li style="padding: 12px 0; font-size: 16px; display: flex; align-items: center;">
                  <span style="color: #d97706; margin-left: 10px;">▪</span> تطوير الأعمال والاستراتيجيات
                </li>
              </ul>
            </div>

            <!-- AI & Innovation Services -->
            <div style="background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%); padding: 30px; border-radius: 15px; border: 2px solid #7c3aed; position: relative;">
              <div style="position: absolute; top: -10px; right: 20px; background: #7c3aed; color: white; padding: 8px 15px; border-radius: 20px; font-size: 12px; font-weight: bold;">🚀 جديد</div>
              <h3 style="font-size: 22px; color: #7c3aed; margin-bottom: 20px; text-align: center; font-weight: bold;">🤖 الذكاء الاصطناعي والابتكار</h3>
              <ul style="list-style: none; padding: 0; margin: 0;">
                <li style="padding: 12px 0; border-bottom: 1px solid #f3e8ff; font-size: 16px; display: flex; align-items: center;">
                  <span style="color: #7c3aed; margin-left: 10px;">▪</span> حلول الذكاء الاصطناعي المخصصة
                </li>
                <li style="padding: 12px 0; border-bottom: 1px solid #f3e8ff; font-size: 16px; display: flex; align-items: center;">
                  <span style="color: #7c3aed; margin-left: 10px;">▪</span> معالجة اللغات الطبيعية
                </li>
                <li style="padding: 12px 0; border-bottom: 1px solid #f3e8ff; font-size: 16px; display: flex; align-items: center;">
                  <span style="color: #7c3aed; margin-left: 10px;">▪</span> أتمتة العمليات الذكية
                </li>
                <li style="padding: 12px 0; font-size: 16px; display: flex; align-items: center;">
                  <span style="color: #7c3aed; margin-left: 10px;">▪</span> التحليلات التنبؤية المتقدمة
                </li>
              </ul>
            </div>
          </div>

          <!-- Additional Services -->
          <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 30px; border-radius: 20px; color: white; margin-bottom: 30px;">
            <h3 style="font-size: 24px; margin-bottom: 25px; text-align: center; font-weight: bold;">⚡ خدمات إضافية متخصصة</h3>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;">
              <div style="text-align: center; padding: 20px; background: rgba(255,255,255,0.1); border-radius: 10px; backdrop-filter: blur(10px);">
                <div style="font-size: 24px; margin-bottom: 10px;">📚</div>
                <div style="font-size: 16px; font-weight: bold; margin-bottom: 8px;">التدريب والتطوير</div>
                <div style="font-size: 14px; opacity: 0.9;">برامج تدريبية متخصصة</div>
              </div>
              <div style="text-align: center; padding: 20px; background: rgba(255,255,255,0.1); border-radius: 10px; backdrop-filter: blur(10px);">
                <div style="font-size: 24px; margin-bottom: 10px;">🛠️</div>
                <div style="font-size: 16px; font-weight: bold; margin-bottom: 8px;">الدعم الفني</div>
                <div style="font-size: 14px; opacity: 0.9;">دعم فني على مدار الساعة</div>
              </div>
              <div style="text-align: center; padding: 20px; background: rgba(255,255,255,0.1); border-radius: 10px; backdrop-filter: blur(10px);">
                <div style="font-size: 24px; margin-bottom: 10px;">🏪</div>
                <div style="font-size: 16px; font-weight: bold; margin-bottom: 8px;">التجارة الإلكترونية</div>
                <div style="font-size: 14px; opacity: 0.9;">حلول متاجر إلكترونية متكاملة</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Page 4: Subsidiaries & Projects -->
        <div style="width: 210mm; min-height: 297mm; padding: 40px; background: #ffffff; page-break-after: always;">
          <div style="text-align: center; margin-bottom: 50px; border-bottom: 3px solid #1e40af; padding-bottom: 30px;">
            <h1 style="font-size: 36px; color: #1e40af; margin: 0 0 10px 0; font-weight: bold;">
              الشركات التابعة والمشاريع
            </h1>
            <p style="font-size: 18px; color: #6b7280; margin: 0;">نظرة على مجموعة شركاتنا ومشاريعنا الرائدة</p>
          </div>

          <!-- Active Companies -->
          <div style="margin-bottom: 50px;">
            <h2 style="font-size: 26px; color: #059669; margin-bottom: 25px; text-align: center; border-bottom: 2px solid #10b981; padding-bottom: 15px;">
              🏢 الشركات النشطة
            </h2>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 25px;">
              <div style="background: linear-gradient(135deg, #1e40af, #3b82f6); padding: 25px; border-radius: 15px; color: white; text-align: center; position: relative; overflow: hidden;">
                <div style="position: absolute; top: -20px; right: -20px; width: 80px; height: 80px; background: rgba(255,255,255,0.1); border-radius: 50%;"></div>
                <div style="width: 80px; height: 80px; background: rgba(255,255,255,0.2); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px; font-weight: bold; backdrop-filter: blur(10px);">ASH</div>
                <h4 style="font-size: 18px; margin-bottom: 12px; font-weight: bold;">علي صالح الشهري القابضة</h4>
                <p style="font-size: 14px; margin-bottom: 10px; opacity: 0.9;">الشركة القابضة الرئيسية - الخدمات التقنية الشاملة</p>
                <p style="font-size: 12px; background: rgba(5, 150, 105, 0.3); padding: 8px 12px; border-radius: 20px; display: inline-block;">✅ نشطة منذ 2018</p>
              </div>
              <div style="background: linear-gradient(135deg, #059669, #10b981); padding: 25px; border-radius: 15px; color: white; text-align: center; position: relative; overflow: hidden;">
                <div style="position: absolute; top: -20px; left: -20px; width: 80px; height: 80px; background: rgba(255,255,255,0.1); border-radius: 50%;"></div>
                <div style="width: 80px; height: 80px; background: rgba(255,255,255,0.2); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px; font-weight: bold; backdrop-filter: blur(10px);">FH</div>
                <h4 style="font-size: 18px; margin-bottom: 12px; font-weight: bold;">Feklah Holding</h4>
                <p style="font-size: 14px; margin-bottom: 10px; opacity: 0.9;">شركة الخدمات التعليمية والأكاديمية المبتكرة</p>
                <p style="font-size: 12px; background: rgba(30, 64, 175, 0.3); padding: 8px 12px; border-radius: 20px; display: inline-block;">✅ نشطة منذ 2020</p>
              </div>
            </div>
          </div>

          <!-- Upcoming Companies -->
          <div style="margin-bottom: 40px;">
            <h2 style="font-size: 26px; color: #7c3aed; margin-bottom: 25px; text-align: center; border-bottom: 2px solid #a855f7; padding-bottom: 15px;">
              🚀 الشركات قيد التطوير - إطلاق 2025
            </h2>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 30px;">
              <div style="background: white; padding: 20px; border-radius: 12px; border: 2px dashed #7c3aed; text-align: center; box-shadow: 0 4px 15px rgba(124, 58, 237, 0.1);">
                <div style="width: 50px; height: 50px; background: #7c3aed; border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center; color: white; font-size: 16px; font-weight: bold;">FA</div>
                <h4 style="font-size: 14px; margin-bottom: 10px; color: #1e40af; font-weight: bold;">فكرة أكاديمي</h4>
                <p style="font-size: 12px; color: #6b7280; margin-bottom: 8px;">الطب والنشر والأبحاث العلمية</p>
                <p style="font-size: 11px; color: #7c3aed; font-weight: bold;">🔄 30-08-2025</p>
              </div>
              <div style="background: white; padding: 20px; border-radius: 12px; border: 2px dashed #059669; text-align: center; box-shadow: 0 4px 15px rgba(5, 150, 105, 0.1);">
                <div style="width: 50px; height: 50px; background: #059669; border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center; color: white; font-size: 16px; font-weight: bold;">AM</div>
                <h4 style="font-size: 14px; margin-bottom: 10px; color: #1e40af; font-weight: bold;">Advixo Media</h4>
                <p style="font-size: 12px; color: #6b7280; margin-bottom: 8px;">التسويق الرقمي والإعلان المتطور</p>
                <p style="font-size: 11px; color: #059669; font-weight: bold;">🔄 30-08-2025</p>
              </div>
              <div style="background: white; padding: 20px; border-radius: 12px; border: 2px dashed #dc2626; text-align: center; box-shadow: 0 4px 15px rgba(220, 38, 38, 0.1);">
                <div style="width: 50px; height: 50px; background: #dc2626; border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center; color: white; font-size: 16px; font-weight: bold;">NX</div>
                <h4 style="font-size: 14px; margin-bottom: 10px; color: #1e40af; font-weight: bold;">نيوماكسيو</h4>
                <p style="font-size: 12px; color: #6b7280; margin-bottom: 8px;">الأنظمة المحاسبية المتطورة</p>
                <p style="font-size: 11px; color: #dc2626; font-weight: bold;">🔄 30-12-2025</p>
              </div>
              <div style="background: white; padding: 20px; border-radius: 12px; border: 2px dashed #ea580c; text-align: center; box-shadow: 0 4px 15px rgba(234, 88, 12, 0.1);">
                <div style="width: 50px; height: 50px; background: #ea580c; border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center; color: white; font-size: 16px; font-weight: bold;">PC</div>
                <h4 style="font-size: 14px; margin-bottom: 10px; color: #1e40af; font-weight: bold;">Plutecode</h4>
                <p style="font-size: 12px; color: #6b7280; margin-bottom: 8px;">المتاجر والأنظمة الجاهزة</p>
                <p style="font-size: 11px; color: #ea580c; font-weight: bold;">🔄 20-10-2025</p>
              </div>
              <div style="background: white; padding: 20px; border-radius: 12px; border: 2px dashed #0ea5e9; text-align: center; box-shadow: 0 4px 15px rgba(14, 165, 233, 0.1);">
                <div style="width: 50px; height: 50px; background: #0ea5e9; border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center; color: white; font-size: 16px; font-weight: bold;">VM</div>
                <h4 style="font-size: 14px; margin-bottom: 10px; color: #1e40af; font-weight: bold;">Vexomart</h4>
                <p style="font-size: 12px; color: #6b7280; margin-bottom: 8px;">تأجير المتاجر الإلكترونية</p>
                <p style="font-size: 11px; color: #0ea5e9; font-weight: bold;">🔄 01-10-2025</p>
              </div>
              <div style="background: white; padding: 20px; border-radius: 12px; border: 2px dashed #16a34a; text-align: center; box-shadow: 0 4px 15px rgba(22, 163, 74, 0.1);">
                <div style="width: 50px; height: 50px; background: #16a34a; border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center; color: white; font-size: 16px; font-weight: bold;">AI</div>
                <h4 style="font-size: 14px; margin-bottom: 10px; color: #1e40af; font-weight: bold;">FEKRAH AI</h4>
                <p style="font-size: 12px; color: #6b7280; margin-bottom: 8px;">حلول الذكاء الاصطناعي المتقدمة</p>
                <p style="font-size: 11px; color: #16a34a; font-weight: bold;">🔄 20-12-2025</p>
              </div>
            </div>
          </div>

          <!-- Major Projects -->
          <div style="background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); padding: 30px; border-radius: 20px; border: 2px solid #1e40af;">
            <h3 style="font-size: 22px; color: #1e40af; margin-bottom: 25px; text-align: center; font-weight: bold;">🏆 مشاريعنا الرائدة</h3>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;">
              <div style="background: white; padding: 20px; border-radius: 10px; border-right: 4px solid #059669;">
                <h4 style="font-size: 16px; color: #059669; margin-bottom: 10px; font-weight: bold;">متاجر كشخة للعبايات</h4>
                <p style="font-size: 14px; color: #6b7280; line-height: 1.6;">منصة تجارة إلكترونية متخصصة في العبايات النسائية بتصميم عصري ونظام دفع متطور</p>
              </div>
              <div style="background: white; padding: 20px; border-radius: 10px; border-right: 4px solid #7c3aed;">
                <h4 style="font-size: 16px; color: #7c3aed; margin-bottom: 10px; font-weight: bold;">متجر البطاقات الإلكترونية</h4>
                <p style="font-size: 14px; color: #6b7280; line-height: 1.6;">نظام متكامل لبيع البطاقات الرقمية والألعاب مع واجهة مستخدم متطورة</p>
              </div>
              <div style="background: white; padding: 20px; border-radius: 10px; border-right: 4px solid #dc2626;">
                <h4 style="font-size: 16px; color: #dc2626; margin-bottom: 10px; font-weight: bold;">موقع تأجير السيارات</h4>
                <p style="font-size: 14px; color: #6b7280; line-height: 1.6;">منصة شاملة لخدمات تأجير السيارات مع نظام حجز ذكي وإدارة متقدمة</p>
              </div>
              <div style="background: white; padding: 20px; border-radius: 10px; border-right: 4px solid #ea580c;">
                <h4 style="font-size: 16px; color: #ea580c; margin-bottom: 10px; font-weight: bold;">منصة إدارة المشاريع</h4>
                <p style="font-size: 14px; color: #6b7280; line-height: 1.6;">نظام متكامل لإدارة المشاريع والعقود مع أدوات تحليل وتقارير متقدمة</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Page 5: Achievements & Contact -->
        <div style="width: 210mm; min-height: 297mm; padding: 40px; background: #ffffff;">
          <div style="text-align: center; margin-bottom: 50px; border-bottom: 3px solid #1e40af; padding-bottom: 30px;">
            <h1 style="font-size: 36px; color: #1e40af; margin: 0 0 10px 0; font-weight: bold;">
              إنجازاتنا وتواصل معنا
            </h1>
            <p style="font-size: 18px; color: #6b7280; margin: 0;">جوائزنا وشراكاتنا ومعلومات الاتصال</p>
          </div>

          <!-- Achievements Section -->
          <div style="margin-bottom: 50px;">
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 30px; margin-bottom: 40px;">
              <div style="background: linear-gradient(135deg, #059669, #10b981); padding: 30px; border-radius: 15px; color: white;">
                <h3 style="font-size: 24px; margin-bottom: 20px; text-align: center; font-weight: bold;">🏆 الجوائز والتقديرات</h3>
                <ul style="list-style: none; padding: 0; margin: 0;">
                  <li style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.2); font-size: 16px; display: flex; align-items: center;">
                    <span style="margin-left: 10px;">🏆</span> جائزة أفضل شركة تقنية ناشئة 2023
                  </li>
                  <li style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.2); font-size: 16px; display: flex; align-items: center;">
                    <span style="margin-left: 10px;">⭐</span> شهادة الجودة ISO 9001:2015
                  </li>
                  <li style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.2); font-size: 16px; display: flex; align-items: center;">
                    <span style="margin-left: 10px;">🎯</span> عضوية الاتحاد السعودي للأمن السيبراني
                  </li>
                  <li style="padding: 12px 0; font-size: 16px; display: flex; align-items: center;">
                    <span style="margin-left: 10px;">🚀</span> شريك معتمد لدى مايكروسوفت
                  </li>
                </ul>
              </div>
              <div style="background: linear-gradient(135deg, #1e40af, #3b82f6); padding: 30px; border-radius: 15px; color: white;">
                <h3 style="font-size: 24px; margin-bottom: 20px; text-align: center; font-weight: bold;">🤝 الشراكات الاستراتيجية</h3>
                <ul style="list-style: none; padding: 0; margin: 0;">
                  <li style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.2); font-size: 16px; display: flex; align-items: center;">
                    <span style="margin-left: 10px;">☁️</span> شريك Amazon Web Services
                  </li>
                  <li style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.2); font-size: 16px; display: flex; align-items: center;">
                    <span style="margin-left: 10px;">🌐</span> شريك Google Cloud Platform
                  </li>
                  <li style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.2); font-size: 16px; display: flex; align-items: center;">
                    <span style="margin-left: 10px;">💻</span> شريك معتمد لدى مايكروسوفت Azure
                  </li>
                  <li style="padding: 12px 0; font-size: 16px; display: flex; align-items: center;">
                    <span style="margin-left: 10px;">🔒</span> شريك في الأمن السيبراني
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Contact Information -->
          <div style="background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); padding: 40px; border-radius: 20px; border: 2px solid #1e40af; margin-bottom: 40px;">
            <h3 style="font-size: 28px; color: #1e40af; margin-bottom: 30px; text-align: center; font-weight: bold;">📞 تواصل معنا</h3>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 25px;">
              <div style="text-align: center; padding: 25px; background: white; border-radius: 15px; border: 2px solid #059669;">
                <div style="width: 60px; height: 60px; background: #059669; border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px;">📱</div>
                <h4 style="font-size: 18px; color: #1e40af; margin-bottom: 10px; font-weight: bold;">الهاتف والواتساب</h4>
                <p style="font-size: 16px; color: #374151; margin: 0; direction: ltr;">+966 50 123 4567</p>
              </div>
              <div style="text-align: center; padding: 25px; background: white; border-radius: 15px; border: 2px solid #7c3aed;">
                <div style="width: 60px; height: 60px; background: #7c3aed; border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px;">✉️</div>
                <h4 style="font-size: 18px; color: #1e40af; margin-bottom: 10px; font-weight: bold;">البريد الإلكتروني</h4>
                <p style="font-size: 16px; color: #374151; margin: 0; direction: ltr;">info@ash-holding.com</p>
              </div>
              <div style="text-align: center; padding: 25px; background: white; border-radius: 15px; border: 2px solid #dc2626;">
                <div style="width: 60px; height: 60px; background: #dc2626; border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px;">🌐</div>
                <h4 style="font-size: 18px; color: #1e40af; margin-bottom: 10px; font-weight: bold;">الموقع الإلكتروني</h4>
                <p style="font-size: 16px; color: #374151; margin: 0; direction: ltr;">www.ash-holding.com</p>
              </div>
            </div>
            
            <!-- Address -->
            <div style="text-align: center; margin-top: 30px; padding: 25px; background: white; border-radius: 15px;">
              <h4 style="font-size: 20px; color: #1e40af; margin-bottom: 15px; font-weight: bold;">📍 العنوان</h4>
              <p style="font-size: 18px; color: #374151; line-height: 1.6;">
                المملكة العربية السعودية - الرياض<br>
                حي النخيل - شارع الملك فهد<br>
                مجمع الأعمال التقني - الطابق الثالث
              </p>
            </div>
          </div>

          <!-- Footer -->
          <div style="text-align: center; padding: 30px; background: linear-gradient(135deg, #1e40af, #3b82f6); border-radius: 15px; color: white;">
            <h4 style="font-size: 24px; margin-bottom: 15px; font-weight: bold;">شكراً لاختياركم شركة علي صالح الشهري القابضة</h4>
            <p style="font-size: 16px; margin-bottom: 20px; opacity: 0.9;">نحن في خدمتكم دائماً لتحقيق رؤيتكم وأهدافكم التقنية والتجارية</p>
            <div style="width: 100px; height: 2px; background: rgba(255,255,255,0.5); margin: 20px auto;"></div>
            <p style="font-size: 14px; margin: 0; opacity: 0.8;">© ${new Date().getFullYear()} شركة علي صالح الشهري القابضة - جميع الحقوق محفوظة</p>
          </div>
        </div>`;

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