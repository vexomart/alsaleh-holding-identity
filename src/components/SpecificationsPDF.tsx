import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileText, Loader } from 'lucide-react';
import { toast } from 'sonner';
import jsPDF from 'jspdf';

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

  const generatePDF = async () => {
    setIsGenerating(true);
    
    try {
      // إنشاء مستند PDF جديد
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // إعداد الخط العربي (يحتاج لتحميل خط يدعم العربية)
      pdf.setFont('helvetica');
      
      // الهيدر مع شعار الشركة
      pdf.setFillColor(37, 99, 235); // لون أزرق
      pdf.rect(0, 0, 210, 40, 'F');
      
      // عنوان الشركة
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(24);
      pdf.text('شركة علي صالح الشهري القابضة', 105, 20, { align: 'center' });
      
      pdf.setFontSize(14);
      pdf.text('مواصفات المشروع التقنية', 105, 30, { align: 'center' });

      // معلومات الاتصال
      pdf.setTextColor(100, 100, 100);
      pdf.setFontSize(10);
      pdf.text('info@alsalahshehriholding.com | 0555812567', 105, 35, { align: 'center' });

      // محتوى المستند
      let yPosition = 60;

      // عنوان المشروع
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(20);
      pdf.text(`Project: ${projectTitle}`, 20, yPosition);
      yPosition += 15;

      // خط فاصل
      pdf.setDrawColor(200, 200, 200);
      pdf.line(20, yPosition, 190, yPosition);
      yPosition += 15;

      // وصف المشروع
      pdf.setFontSize(14);
      pdf.text('Project Description:', 20, yPosition);
      yPosition += 10;
      
      pdf.setFontSize(11);
      const descriptionLines = pdf.splitTextToSize(projectDescription, 170);
      pdf.text(descriptionLines, 20, yPosition);
      yPosition += descriptionLines.length * 5 + 10;

      // المميزات
      pdf.setFontSize(14);
      pdf.text('Key Features:', 20, yPosition);
      yPosition += 10;
      
      pdf.setFontSize(11);
      features.forEach((feature, index) => {
        pdf.text(`• ${feature}`, 25, yPosition);
        yPosition += 6;
      });
      yPosition += 10;

      // التقنيات المستخدمة
      pdf.setFontSize(14);
      pdf.text('Technologies Used:', 20, yPosition);
      yPosition += 10;
      
      pdf.setFontSize(11);
      technologies.forEach((tech, index) => {
        pdf.text(`• ${tech}`, 25, yPosition);
        yPosition += 6;
      });
      yPosition += 15;

      // معلومات المشروع
      pdf.setFillColor(248, 250, 252);
      pdf.rect(20, yPosition, 170, 40, 'F');
      
      pdf.setFontSize(14);
      pdf.text('Project Information:', 25, yPosition + 10);
      
      pdf.setFontSize(11);
      pdf.text(`Duration: ${duration}`, 25, yPosition + 20);
      if (price) {
        pdf.text(`Price: ${price}`, 25, yPosition + 30);
      }
      yPosition += 50;

      // معلومات الشركة
      pdf.setFillColor(37, 99, 235);
      pdf.rect(20, yPosition, 170, 30, 'F');
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(12);
      pdf.text('Contact Information:', 25, yPosition + 10);
      pdf.text('Phone: +966 555 812 567', 25, yPosition + 18);
      pdf.text('Email: info@alsalahshehriholding.com', 25, yPosition + 25);

      // الفوتر
      pdf.setTextColor(100, 100, 100);
      pdf.setFontSize(8);
      pdf.text(`Generated on: ${new Date().toLocaleDateString('ar-SA')}`, 20, 280);
      pdf.text('© 2024 Al Salah Shehri Holding Company', 105, 280, { align: 'center' });

      // حفظ الملف
      const fileName = `${projectTitle.replace(/\s+/g, '_')}_Specifications.pdf`;
      pdf.save(fileName);

      toast.success('تم تحميل مواصفات المشروع بنجاح');
    } catch (error) {
      console.error('خطأ في إنشاء PDF:', error);
      toast.error('حدث خطأ أثناء إنشاء ملف PDF');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button 
      size="lg" 
      variant="outline"
      className={`border-slate-300 hover:border-blue-400 hover:text-blue-600 ${className}`}
      onClick={generatePDF}
      disabled={isGenerating}
    >
      {isGenerating ? (
        <>
          <Loader className="w-5 h-5 mr-2 animate-spin" />
          جاري الإنشاء...
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