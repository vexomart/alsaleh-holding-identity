import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";

// Enhanced Arabic text handling with better encoding
const addArabicText = (pdf: jsPDF, text: string, x: number, y: number, options: any = {}) => {
  try {
    // Convert Arabic text to a compatible format
    const arabicText = text;
    pdf.text(arabicText, x, y, { 
      align: options.align || "right",
      direction: "rtl",
      ...options 
    });
  } catch (error) {
    // Fallback to English transliteration if Arabic fails
    const englishFallback = text
      .replace(/شركة/g, "Company")
      .replace(/علي صالح الشهري القابضة/g, "Ali Saleh Al-Shahri Holding")
      .replace(/المملكة العربية السعودية/g, "Kingdom of Saudi Arabia");
    pdf.text(englishFallback, x, y, options);
  }
};

interface CompanyProfilePDFProps {
  className?: string;
}

export const CompanyProfilePDF: React.FC<CompanyProfilePDFProps> = ({ className }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateCompanyProfilePDF = async () => {
    setIsGenerating(true);
    try {
      console.log("Starting PDF generation...");
      
      // Create PDF with better Arabic support
      const pdf = new jsPDF("p", "mm", "a4");
      
      // Add triangle helper function
      (pdf as any).triangle = function(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, style: string) {
        this.lines([[x2-x1, y2-y1], [x3-x2, y3-y2], [x1-x3, y1-y3]], x1, y1, [1, 1], style, true);
      };
      
      // Add global partners background pattern
      const addGlobalPartnersBg = () => {
        // Add subtle geometric patterns representing global partnerships
        pdf.setFillColor(240, 248, 255, 0.3);
        for (let i = 0; i < 20; i++) {
          const x = Math.random() * 210;
          const y = Math.random() * 297;
          pdf.circle(x, y, 2, 'F');
        }
        
        // Add corner decorative elements
        pdf.setFillColor(30, 64, 175, 0.1);
        pdf.rect(0, 0, 30, 30, 'F');
        pdf.rect(180, 0, 30, 30, 'F');
        pdf.rect(0, 267, 30, 30, 'F');
        pdf.rect(180, 267, 30, 30, 'F');
      };
      
      // Page 1 - Cover Page with Professional Design
      // Create gradient-like background
      pdf.setFillColor(15, 32, 87); // Dark blue
      pdf.rect(0, 0, 210, 297, 'F');
      
      // Add lighter blue overlay for depth
      pdf.setFillColor(30, 64, 175, 0.8);
      pdf.rect(0, 0, 210, 100, 'F');
      
      // Global pattern background
      addGlobalPartnersBg();
      
      // Company Logo Area with enhanced design
      pdf.setFillColor(255, 255, 255, 0.95);
      pdf.circle(105, 80, 30, 'F');
      pdf.setFillColor(30, 64, 175);
      pdf.circle(105, 80, 25, 'F');
      
      // Add crown-like decoration
      pdf.setFillColor(255, 215, 0);
      pdf.rect(100, 60, 10, 8, 'F');
      pdf.triangle(95, 60, 105, 50, 115, 60, 'F');
      
      // Arabic Company Name
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(18);
      pdf.setFont("helvetica", "bold");
      addArabicText(pdf, "شركة علي صالح الشهري القابضة", 105, 120, { align: "center" });
      
      // English subtitle
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "normal");
      pdf.text("ALI SALEH AL-SHAHRI HOLDING COMPANY", 105, 135, { align: "center" });
      
      // Arabic subtitle
      pdf.setFontSize(12);
      addArabicText(pdf, "رائدة في التكنولوجيا والحلول المتكاملة منذ ٢٠١٨", 105, 150, { align: "center" });
      
      // Arabic slogan
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      addArabicText(pdf, "الإبداع - التميز - الجودة", 105, 170, { align: "center" });
      
      // Enhanced stats boxes with Arabic
      const statsBoxes = [
        { value: "٢٠١٨", label: "التأسيس", x: 45 },
        { value: "٥٠٠+", label: "مشروع", x: 87.5 },
        { value: "٥٠+", label: "موظف", x: 130 },
        { value: "١٠٠+", label: "عميل", x: 172.5 }
      ];
      
      statsBoxes.forEach((stat, index) => {
        const colors = [
          [30, 64, 175],   // Blue
          [5, 150, 105],   // Green
          [124, 58, 237],  // Purple
          [220, 38, 38]    // Red
        ];
        
        pdf.setFillColor(255, 255, 255, 0.9);
        pdf.rect(stat.x - 17.5, 190, 35, 30, 'F');
        
        pdf.setFillColor(colors[index][0], colors[index][1], colors[index][2]);
        pdf.rect(stat.x - 17.5, 190, 35, 8, 'F');
        
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(16);
        pdf.setFont("helvetica", "bold");
        pdf.text(stat.value, stat.x, 196, { align: "center" });
        
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(10);
        addArabicText(pdf, stat.label, stat.x, 210, { align: "center" });
      });
      
      // Footer with Arabic
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(12);
      addArabicText(pdf, `الملف التعريفي الرسمي للشركة | ${new Date().getFullYear()}`, 105, 280, { align: "center" });
      
      // Page 2 - Company Overview (Arabic)
      pdf.addPage();
      pdf.setFillColor(255, 255, 255);
      pdf.rect(0, 0, 210, 297, 'F');
      
      // Add background pattern
      addGlobalPartnersBg();
      
      // Header with Arabic
      pdf.setTextColor(30, 64, 175);
      pdf.setFontSize(22);
      pdf.setFont("helvetica", "bold");
      addArabicText(pdf, "نظرة عامة على الشركة", 105, 30, { align: "center" });
      
      // Decorative line
      pdf.setDrawColor(30, 64, 175);
      pdf.setLineWidth(2);
      pdf.line(30, 35, 180, 35);
      
      // Add decorative elements
      pdf.setFillColor(30, 64, 175, 0.1);
      pdf.circle(40, 50, 8, 'F');
      pdf.circle(170, 50, 8, 'F');
      
      // Company Description in Arabic
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "normal");
      
      const arabicCompanyText = [
        "تأسست شركة علي صالح الشهري القابضة في عام ٢٠١٨",
        "كشركة رائدة في مجال التكنولوجيا والحلول المتكاملة",
        "",
        "نفتخر بكوننا الشريك الموثوق للشركات والمؤسسات",
        "في رحلة التحول الرقمي من خلال تقديم مجموعة شاملة",
        "من الخدمات التقنية والتجارية المبتكرة",
        "",
        "من خلال فريقنا المتخصص وخبرتنا المتراكمة",
        "نسعى لتقديم حلول مبتكرة تلبي احتياجات عملائنا",
        "وتساعدهم في تحقيق أهدافهم بأعلى معايير الجودة"
      ];
      
      let yPos = 60;
      arabicCompanyText.forEach(line => {
        if (line === "") {
          yPos += 5;
        } else {
          addArabicText(pdf, line, 105, yPos, { align: "center", maxWidth: 150 });
          yPos += 10;
        }
      });
      
      // Global Partners Section
      pdf.setTextColor(30, 64, 175);
      pdf.setFontSize(16);
      pdf.setFont("helvetica", "bold");
      addArabicText(pdf, "شركاء النجاح العالميين", 105, 160, { align: "center" });
      
      // Partner logos representation (simplified)
      const partnerBoxes = [
        { name: "AWS", x: 30, color: [255, 153, 0] },
        { name: "Microsoft", x: 70, color: [0, 120, 215] },
        { name: "Google", x: 110, color: [66, 133, 244] },
        { name: "Docker", x: 150, color: [0, 188, 242] }
      ];
      
      partnerBoxes.forEach(partner => {
        pdf.setFillColor(partner.color[0], partner.color[1], partner.color[2], 0.2);
        pdf.rect(partner.x, 175, 35, 20, 'F');
        pdf.setTextColor(partner.color[0], partner.color[1], partner.color[2]);
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "bold");
        pdf.text(partner.name, partner.x + 17.5, 188, { align: "center" });
      });
      
      // Vision and Mission in Arabic
      pdf.setTextColor(30, 64, 175);
      pdf.setFontSize(16);
      pdf.setFont("helvetica", "bold");
      addArabicText(pdf, "الرؤية والرسالة", 105, 220, { align: "center" });
      
      // Vision box
      pdf.setFillColor(30, 64, 175);
      pdf.rect(20, 235, 80, 45, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      addArabicText(pdf, "الرؤية", 60, 248, { align: "center" });
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      addArabicText(pdf, "أن نكون الشركة الرائدة في المنطقة", 60, 258, { align: "center", maxWidth: 70 });
      addArabicText(pdf, "في مجال التكنولوجيا والحلول المبتكرة", 60, 268, { align: "center", maxWidth: 70 });
      
      // Mission box
      pdf.setFillColor(5, 150, 105);
      pdf.rect(110, 235, 80, 45, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      addArabicText(pdf, "الرسالة", 150, 248, { align: "center" });
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      addArabicText(pdf, "تقديم حلول تقنية متطورة وخدمات عالية الجودة", 150, 258, { align: "center", maxWidth: 70 });
      addArabicText(pdf, "لمساعدة عملائنا في تحقيق أهدافهم", 150, 268, { align: "center", maxWidth: 70 });
      
      // Page 3 - Services (Arabic)
      pdf.addPage();
      pdf.setFillColor(255, 255, 255);
      pdf.rect(0, 0, 210, 297, 'F');
      
      // Add background pattern
      addGlobalPartnersBg();
      
      // Services Header in Arabic
      pdf.setTextColor(30, 64, 175);
      pdf.setFontSize(22);
      pdf.setFont("helvetica", "bold");
      addArabicText(pdf, "خدماتنا المتميزة", 105, 30, { align: "center" });
      
      pdf.setDrawColor(30, 64, 175);
      pdf.setLineWidth(2);
      pdf.line(30, 35, 180, 35);
      
      // Services Grid in Arabic
      const arabicServices = [
        {
          title: "الحلول التقنية المتطورة",
          items: [
            "• تطوير البرمجيات والتطبيقات المخصصة",
            "• حلول الذكاء الاصطناعي والتعلم الآلي",
            "• الحلول السحابية وأمن المعلومات",
            "• أنظمة إدارة قواعد البيانات"
          ],
          color: [30, 64, 175]
        },
        {
          title: "خدمات التصميم",
          items: [
            "• تصميم الهوية البصرية الاحترافية",
            "• التصميم الجرافيكي والإعلاني",
            "• تصميم المواقع والتطبيقات",
            "• المواد المطبوعة والتسويقية"
          ],
          color: [5, 150, 105]
        },
        {
          title: "الخدمات التجارية",
          items: [
            "• الاستشارات التجارية والإدارية",
            "• إدارة المشاريع والتخطيط",
            "• التسويق الرقمي والإلكتروني",
            "• تطوير الأعمال والاستراتيجيات"
          ],
          color: [217, 119, 6]
        },
        {
          title: "الذكاء الاصطناعي والابتكار",
          items: [
            "• حلول الذكاء الاصطناعي المخصصة",
            "• تطوير نماذج التعلم الآلي",
            "• معالجة اللغة الطبيعية",
            "• الرؤية الحاسوبية والتحليل الذكي"
          ],
          color: [124, 58, 237]
        }
      ];
      
      let serviceY = 50;
      arabicServices.forEach((service, index) => {
        const isLeft = index % 2 === 0;
        const x = isLeft ? 25 : 110;
        
        // Service box background with gradient effect
        pdf.setFillColor(service.color[0], service.color[1], service.color[2], 0.05);
        pdf.rect(x, serviceY, 80, 60, 'F');
        
        // Service header bar
        pdf.setFillColor(service.color[0], service.color[1], service.color[2]);
        pdf.rect(x, serviceY, 80, 12, 'F');
        
        // Service title
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(12);
        pdf.setFont("helvetica", "bold");
        addArabicText(pdf, service.title, x + 40, serviceY + 8, { align: "center", maxWidth: 75 });
        
        // Service items
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(9);
        pdf.setFont("helvetica", "normal");
        service.items.forEach((item, itemIndex) => {
          addArabicText(pdf, item, x + 75, serviceY + 25 + (itemIndex * 10), { align: "right", maxWidth: 70 });
        });
        
        if (index % 2 === 1) {
          serviceY += 70;
        }
      });
      
      // Digital Signature Section
      pdf.setTextColor(30, 64, 175);
      pdf.setFontSize(16);
      pdf.setFont("helvetica", "bold");
      addArabicText(pdf, "التوقيع الرقمي والاعتماد", 105, 240, { align: "center" });
      
      // Digital stamp/seal
      pdf.setFillColor(30, 64, 175, 0.1);
      pdf.circle(105, 265, 25, 'F');
      pdf.setDrawColor(30, 64, 175);
      pdf.setLineWidth(2);
      pdf.circle(105, 265, 25);
      pdf.circle(105, 265, 20);
      
      // Company seal content
      pdf.setTextColor(30, 64, 175);
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "bold");
      addArabicText(pdf, "شركة علي صالح الشهري القابضة", 105, 258, { align: "center", maxWidth: 40 });
      pdf.setFontSize(8);
      addArabicText(pdf, "المملكة العربية السعودية", 105, 268, { align: "center" });
      pdf.setFontSize(8);
      pdf.text(`${new Date().getFullYear()}`, 105, 275, { align: "center" });
      
      // Digital verification code
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(8);
      pdf.setFont("helvetica", "normal");
      const verificationCode = `DC-${Date.now().toString(36).toUpperCase()}`;
      pdf.text(`رمز التحقق الرقمي: ${verificationCode}`, 105, 285, { align: "center" });
      
      // Contact Info in Arabic
      pdf.setTextColor(30, 64, 175);
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      addArabicText(pdf, "معلومات التواصل", 20, 260, { align: "right" });
      
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      pdf.text("info@alialshehriholding.com :البريد الإلكتروني", 20, 270, { align: "left" });
      addArabicText(pdf, "المملكة العربية السعودية", 20, 280, { align: "right" });
      
      // Save the PDF
      pdf.save(`Ali-Saleh-Al-Shahri-Holding-Company-Profile-${new Date().getFullYear()}.pdf`);
      
      toast.success("Company profile downloaded successfully!");
      
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