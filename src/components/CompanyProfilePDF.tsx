import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";

// Add Arabic font support
const addArabicFont = (pdf: jsPDF) => {
  // Use a more compatible approach for Arabic text
  pdf.setLanguage("ar");
  pdf.setR2L(true);
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
      
      // Create PDF directly using jsPDF
      const pdf = new jsPDF("p", "mm", "a4");
      
      // Page 1 - Cover Page
      pdf.setFillColor(30, 64, 175); // Blue background
      pdf.rect(0, 0, 210, 297, 'F');
      
      // Company Logo Area (white circle)
      pdf.setFillColor(255, 255, 255, 0.15);
      pdf.circle(105, 80, 25, 'F');
      
      // English Company Name (works with standard fonts)
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(24);
      pdf.setFont("helvetica", "bold");
      pdf.text("ALI SALEH AL-SHAHRI HOLDING COMPANY", 105, 130, { align: "center" });
      
      // Subtitle
      pdf.setFontSize(16);
      pdf.setFont("helvetica", "normal");
      pdf.text("Leading in Technology & Integrated Solutions since 2018", 105, 145, { align: "center" });
      
      // Company description in English
      pdf.setFontSize(14);
      pdf.text("Innovation - Excellence - Quality", 105, 165, { align: "center" });
      
      // Stats boxes
      pdf.setFillColor(255, 255, 255, 0.15);
      
      // Year box
      pdf.rect(40, 190, 35, 25, 'F');
      pdf.setFontSize(18);
      pdf.setFont("helvetica", "bold");
      pdf.text("2018", 57.5, 205, { align: "center" });
      pdf.setFontSize(10);
      pdf.text("Since", 57.5, 212, { align: "center" });
      
      // Projects box
      pdf.rect(85, 190, 35, 25, 'F');
      pdf.setFontSize(18);
      pdf.setFont("helvetica", "bold");
      pdf.text("500+", 102.5, 205, { align: "center" });
      pdf.setFontSize(10);
      pdf.text("Projects", 102.5, 212, { align: "center" });
      
      // Employees box
      pdf.rect(130, 190, 35, 25, 'F');
      pdf.setFontSize(18);
      pdf.setFont("helvetica", "bold");
      pdf.text("50+", 147.5, 205, { align: "center" });
      pdf.setFontSize(10);
      pdf.text("Employees", 147.5, 212, { align: "center" });
      
      // Footer
      pdf.setFontSize(12);
      pdf.text(`Official Company Profile | ${new Date().getFullYear()}`, 105, 280, { align: "center" });
      
      // Page 2 - Company Overview
      pdf.addPage();
      pdf.setFillColor(255, 255, 255); // White background
      pdf.rect(0, 0, 210, 297, 'F');
      
      // Header
      pdf.setTextColor(30, 64, 175);
      pdf.setFontSize(22);
      pdf.setFont("helvetica", "bold");
      pdf.text("Company Overview", 105, 30, { align: "center" });
      
      // Blue line under header
      pdf.setDrawColor(30, 64, 175);
      pdf.setLineWidth(1);
      pdf.line(30, 35, 180, 35);
      
      // Company Description
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "normal");
      
      const companyText = [
        "Ali Saleh Al-Shahri Holding Company was founded in 2018 as a leading",
        "company in the field of technology and integrated solutions. We take pride in",
        "being the trusted partner for companies and institutions in their digital",
        "transformation journey, providing a comprehensive range of innovative",
        "technical and commercial services.",
        "",
        "Through our specialized team and accumulated expertise, we strive to provide",
        "innovative solutions that meet our clients' needs and help them achieve their",
        "business and technical goals with the highest standards of quality and efficiency.",
        "",
        "Our company is distinguished by providing diverse services including custom",
        "software development, artificial intelligence solutions, creative design,",
        "business consulting, and advanced cloud solutions."
      ];
      
      let yPosition = 55;
      companyText.forEach(line => {
        if (line === "") {
          yPosition += 5;
        } else {
          pdf.text(line, 105, yPosition, { align: "center", maxWidth: 150 });
          yPosition += 8;
        }
      });
      
      // Statistics Section
      pdf.setTextColor(30, 64, 175);
      pdf.setFontSize(16);
      pdf.setFont("helvetica", "bold");
      pdf.text("Company Statistics", 105, 160, { align: "center" });
      
      // Stats boxes with colors
      const stats = [
        { value: "2018", label: "Established", color: [30, 64, 175], x: 40 },
        { value: "500+", label: "Projects", color: [5, 150, 105], x: 85 },
        { value: "50+", label: "Employees", color: [124, 58, 237], x: 130 },
        { value: "100+", label: "Clients", color: [220, 38, 38], x: 175 }
      ];
      
      stats.forEach(stat => {
        pdf.setFillColor(stat.color[0], stat.color[1], stat.color[2]);
        pdf.rect(stat.x - 15, 175, 30, 25, 'F');
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(14);
        pdf.setFont("helvetica", "bold");
        pdf.text(stat.value, stat.x, 190, { align: "center" });
        pdf.setFontSize(8);
        pdf.text(stat.label, stat.x, 197, { align: "center" });
      });
      
      // Vision and Mission
      pdf.setTextColor(30, 64, 175);
      pdf.setFontSize(16);
      pdf.setFont("helvetica", "bold");
      pdf.text("Vision & Mission", 105, 220, { align: "center" });
      
      // Vision box
      pdf.setFillColor(30, 64, 175);
      pdf.rect(20, 235, 80, 40, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.text("Vision", 60, 245, { align: "center" });
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "normal");
      const visionText = [
        "To be the leading company in the region",
        "in technology and innovative solutions"
      ];
      visionText.forEach((line, index) => {
        pdf.text(line, 60, 255 + (index * 7), { align: "center", maxWidth: 70 });
      });
      
      // Mission box
      pdf.setFillColor(5, 150, 105);
      pdf.rect(110, 235, 80, 40, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.text("Mission", 150, 245, { align: "center" });
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "normal");
      const missionText = [
        "Providing advanced technical solutions",
        "and high-quality services to help our clients achieve their goals"
      ];
      missionText.forEach((line, index) => {
        pdf.text(line, 150, 255 + (index * 7), { align: "center", maxWidth: 70 });
      });
      
      // Page 3 - Services
      pdf.addPage();
      pdf.setFillColor(255, 255, 255);
      pdf.rect(0, 0, 210, 297, 'F');
      
      // Services Header
      pdf.setTextColor(30, 64, 175);
      pdf.setFontSize(22);
      pdf.setFont("helvetica", "bold");
      pdf.text("Our Distinguished Services", 105, 30, { align: "center" });
      
      pdf.setDrawColor(30, 64, 175);
      pdf.line(30, 35, 180, 35);
      
      // Services Grid
      const services = [
        {
          title: "Advanced Technical Solutions",
          items: [
            "• Custom software development and applications",
            "• AI and machine learning solutions",
            "• Cloud solutions and information security",
            "• Database management systems"
          ],
          color: [30, 64, 175]
        },
        {
          title: "Design Services",
          items: [
            "• Professional visual identity design",
            "• Graphic and advertising design",
            "• Website and application design",
            "• Printing and marketing materials"
          ],
          color: [5, 150, 105]
        },
        {
          title: "Business Services",
          items: [
            "• Business and management consulting",
            "• Project management and planning",
            "• Digital and electronic marketing",
            "• Business development and strategies"
          ],
          color: [217, 119, 6]
        },
        {
          title: "AI and Innovation",
          items: [
            "• Custom artificial intelligence solutions",
            "• Machine learning models development",
            "• Natural language processing",
            "• Computer vision and smart analysis"
          ],
          color: [124, 58, 237]
        }
      ];
      
      let serviceY = 50;
      services.forEach((service, index) => {
        const isLeft = index % 2 === 0;
        const x = isLeft ? 25 : 110;
        
        // Service box background
        pdf.setFillColor(service.color[0], service.color[1], service.color[2], 0.1);
        pdf.rect(x, serviceY, 80, 55, 'F');
        
        // Service title
        pdf.setTextColor(service.color[0], service.color[1], service.color[2]);
        pdf.setFontSize(11);
        pdf.setFont("helvetica", "bold");
        pdf.text(service.title, x + 40, serviceY + 10, { align: "center", maxWidth: 75 });
        
        // Service items
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(8);
        pdf.setFont("helvetica", "normal");
        service.items.forEach((item, itemIndex) => {
          pdf.text(item, x + 5, serviceY + 20 + (itemIndex * 8), { maxWidth: 70 });
        });
        
        if (index % 2 === 1) {
          serviceY += 65;
        }
      });
      
      // Contact Info
      pdf.setTextColor(30, 64, 175);
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text("Contact Information", 105, 260, { align: "center" });
      
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      pdf.text("Email: info@alialshehriholding.com", 105, 270, { align: "center" });
      pdf.text("Kingdom of Saudi Arabia", 105, 280, { align: "center" });
      
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