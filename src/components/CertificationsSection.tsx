import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  CheckCircle, 
  Award, 
  FileCheck, 
  Building2, 
  Globe, 
  Star, 
  Crown,
  Zap,
  Eye,
  Lock,
  Verified,
  ExternalLink,
  Download,
  Calendar,
  MapPin,
  Phone,
  Mail
} from "lucide-react";

const CertificationsSection = () => {
  const certifications = [
    {
      id: "MOC_001",
      title: "وزارة التجارة والاستثمار",
      titleEn: "Ministry of Commerce & Investment",
      description: "ترخيص رسمي لممارسة النشاط التجاري والاستثماري في المملكة العربية السعودية",
      issuer: "وزارة التجارة والاستثمار",
      issueDate: "2024-01-15",
      expiryDate: "2026-01-15",
      certificateNumber: "MC-2024-ASH-001",
      status: "ساري المفعول",
      type: "government",
      icon: Building2,
      color: "from-green-600 to-emerald-600",
      bgEffect: "from-green-500/10 to-emerald-500/10",
      verificationUrl: "#verify-moc",
      documentUrl: "#download-moc"
    },
    {
      id: "SAGIA_001", 
      title: "هيئة الاستثمار السعودية",
      titleEn: "Saudi Investment Authority",
      description: "ترخيص الاستثمار الأجنبي والمحلي وفقاً لأنظمة المملكة العربية السعودية",
      issuer: "هيئة الاستثمار السعودية",
      issueDate: "2024-02-20",
      expiryDate: "2027-02-20",
      certificateNumber: "SIA-2024-7823",
      status: "معتمد",
      type: "authority",
      icon: Crown,
      color: "from-blue-600 to-cyan-600",
      bgEffect: "from-blue-500/10 to-cyan-500/10",
      verificationUrl: "#verify-sagia",
      documentUrl: "#download-sagia"
    },
    {
      id: "ZATCA_001",
      title: "هيئة الزكاة والضريبة والجمارك",
      titleEn: "ZATCA Tax Registration",
      description: "تسجيل ضريبي معتمد وشهادة امتثال للقوانين الضريبية في المملكة",
      issuer: "هيئة الزكاة والضريبة والجمارك",
      issueDate: "2024-01-10",
      expiryDate: "2025-01-10",
      certificateNumber: "ZATCA-310012345600003",
      status: "نشط",
      type: "tax",
      icon: FileCheck,
      color: "from-purple-600 to-pink-600",
      bgEffect: "from-purple-500/10 to-pink-500/10",
      verificationUrl: "#verify-zatca",
      documentUrl: "#download-zatca"
    },
    {
      id: "ISO_001",
      title: "شهادة آيزو 9001:2015",
      titleEn: "ISO 9001:2015 Certification",
      description: "شهادة نظام إدارة الجودة العالمية للخدمات والعمليات التجارية",
      issuer: "المنظمة الدولية للمعايير",
      issueDate: "2023-12-01",
      expiryDate: "2026-12-01", 
      certificateNumber: "ISO-9001-ASH-2023",
      status: "معتمد دولياً",
      type: "international",
      icon: Award,
      color: "from-orange-600 to-red-600",
      bgEffect: "from-orange-500/10 to-red-500/10",
      verificationUrl: "#verify-iso",
      documentUrl: "#download-iso"
    },
    {
      id: "CYBER_001",
      title: "شهادة الأمن السيبراني",
      titleEn: "Cybersecurity Certification",
      description: "شهادة معتمدة لأمان المعلومات والحماية السيبرانية من الهيئة الوطنية للأمن السيبراني",
      issuer: "الهيئة الوطنية للأمن السيبراني",
      issueDate: "2024-03-15",
      expiryDate: "2025-03-15",
      certificateNumber: "NCA-SEC-2024-001",
      status: "محمي",
      type: "security",
      icon: Shield,
      color: "from-red-600 to-pink-600",
      bgEffect: "from-red-500/10 to-pink-500/10",
      verificationUrl: "#verify-cyber",
      documentUrl: "#download-cyber"
    },
    {
      id: "QUALITY_001",
      title: "شهادة الجودة السعودية",
      titleEn: "Saudi Quality Assurance",
      description: "شهادة معايير الجودة السعودية للخدمات المتميزة والامتياز في الأداء",
      issuer: "هيئة المواصفات والمقاييس",
      issueDate: "2024-01-25",
      expiryDate: "2026-01-25",
      certificateNumber: "SASO-Q-2024-456",
      status: "متميز",
      type: "quality",
      icon: Star,
      color: "from-yellow-600 to-orange-600",
      bgEffect: "from-yellow-500/10 to-orange-500/10",
      verificationUrl: "#verify-quality",
      documentUrl: "#download-quality"
    }
  ];

  const getStatusColor = (type: string) => {
    switch (type) {
      case 'government': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'authority': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'tax': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'international': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'security': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'quality': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <section className="py-24 bg-gradient-subtle relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      <div className="absolute top-1/4 right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 left-10 w-32 h-32 bg-secondary/10 rounded-full blur-3xl animate-float-delayed" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20 animate-fade-in">
          <div className="inline-flex items-center gap-3 mb-6 p-3 bg-white/10 rounded-full backdrop-blur-sm">
            <Verified className="w-6 h-6 text-primary animate-pulse" />
            <span className="text-sm font-medium text-primary">توثيقات رسمية • مصادق عليها</span>
          </div>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-primary mb-8 leading-tight">
            التوثيقات <span className="text-gradient-primary">الرسمية</span>
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            جميع تراخيصنا وشهاداتنا معتمدة من الجهات الحكومية والدولية المختصة في المملكة العربية السعودية
          </p>
        </div>

        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-16">
          {certifications.map((cert, index) => {
            const IconComponent = cert.icon;
            
            return (
              <Card 
                key={cert.id} 
                className="group premium-card hover:shadow-glow transition-all duration-700 border-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl overflow-hidden animate-fade-in hover:transform hover:scale-105 hover:-translate-y-2"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-8 relative h-full">
                  {/* Background overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${cert.bgEffect} opacity-0 group-hover:opacity-100 transition-all duration-700`} />
                  
                  <div className="relative z-10 h-full flex flex-col">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div className={`w-16 h-16 bg-gradient-to-br ${cert.color} rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-xl`}>
                        <IconComponent className="w-8 h-8 text-white group-hover:animate-pulse" />
                      </div>
                      <Badge className={`${getStatusColor(cert.type)} font-bold text-xs`}>
                        {cert.status}
                      </Badge>
                    </div>
                    
                    {/* Certificate Info */}
                    <div className="mb-6 flex-grow">
                      <h3 className="text-xl font-bold text-primary mb-2 group-hover:text-gradient-primary transition-all duration-300 leading-tight">
                        {cert.title}
                      </h3>
                      <p className="text-sm text-secondary/80 font-medium mb-3">
                        {cert.titleEn}
                      </p>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                        {cert.description}
                      </p>
                      
                      {/* Certificate Details */}
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-3 h-3 text-primary" />
                          <span className="text-muted-foreground">الجهة المصدرة: {cert.issuer}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3 h-3 text-green-500" />
                          <span className="text-muted-foreground">تاريخ الإصدار: {cert.issueDate}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3 h-3 text-orange-500" />
                          <span className="text-muted-foreground">تاريخ الانتهاء: {cert.expiryDate}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FileCheck className="w-3 h-3 text-blue-500" />
                          <span className="text-muted-foreground font-mono text-xs">رقم الشهادة: {cert.certificateNumber}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        className={`flex-1 bg-gradient-to-r ${cert.color} text-white border-0 hover:scale-105 transition-transform duration-200`}
                      >
                        <Eye className="w-3 h-3 mr-2" />
                        التحقق
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="px-3 hover:scale-105 transition-transform duration-200"
                      >
                        <Download className="w-3 h-3" />
                      </Button>
                    </div>

                    {/* Bottom Accent */}
                    <div className={`absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r ${cert.color} transform scale-x-0 group-hover:scale-x-100 transition-all duration-500 rounded-b-xl`} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Verification Portal */}
        <div className="text-center bg-gradient-to-br from-white/15 to-white/10 backdrop-blur-md rounded-3xl p-12 animate-fade-in border border-white/10 shadow-2xl">
          <div className="flex items-center justify-center gap-3 mb-8">
            <Lock className="w-8 h-8 text-primary animate-pulse" />
            <h3 className="text-4xl font-bold text-primary">بوابة التحقق الإلكترونية</h3>
            <Verified className="w-8 h-8 text-secondary animate-bounce" />
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div className="group relative bg-white/5 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 border border-white/10">
              <div className="text-5xl font-bold text-gradient-primary mb-3 group-hover:scale-110 transition-transform duration-300">100%</div>
              <div className="text-xl font-semibold text-primary mb-1">معدل التوثيق</div>
              <div className="text-sm text-muted-foreground">Verification Rate</div>
            </div>
            
            <div className="group relative bg-white/5 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 border border-white/10">
              <div className="text-5xl font-bold text-gradient-primary mb-3 group-hover:scale-110 transition-transform duration-300">24/7</div>
              <div className="text-xl font-semibold text-primary mb-1">خدمة التحقق</div>
              <div className="text-sm text-muted-foreground">Verification Service</div>
            </div>
            
            <div className="group relative bg-white/5 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 border border-white/10">
              <div className="text-5xl font-bold text-gradient-primary mb-3 group-hover:scale-110 transition-transform duration-300">6</div>
              <div className="text-xl font-semibold text-primary mb-1">جهات معتمدة</div>
              <div className="text-sm text-muted-foreground">Certified Authorities</div>
            </div>
          </div>

          {/* Contact Info for Verification */}
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-6 border border-primary/20 mb-8">
            <h4 className="text-xl font-bold text-primary mb-4 flex items-center justify-center gap-2">
              <Phone className="w-5 h-5" />
              للتحقق من صحة التوثيقات
            </h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 justify-center">
                <Phone className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">هاتف التحقق: 0555812567</span>
              </div>
              <div className="flex items-center gap-2 justify-center">
                <Mail className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">info@ash.holdings</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 px-8 py-6 text-lg font-bold shadow-glow transition-all duration-300 hover:scale-105 group"
            >
              <ExternalLink className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
              التحقق من جميع الشهادات
            </Button>
            
            <Button 
              size="lg" 
              variant="outline"
              className="border-2 border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground px-8 py-6 text-lg font-bold transition-all duration-300 hover:scale-105"
            >
              <Download className="w-5 h-5 mr-2" />
              تحميل جميع الوثائق
            </Button>
          </div>

          <div className="text-center mt-6">
            <p className="text-lg text-primary font-semibold mb-2">
              جميع شهاداتنا وتراخيصنا متاحة للتحقق العام والشفافية الكاملة
            </p>
            <div className="flex justify-center items-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>محدثة تلقائياً وصالحة حتى تاريخ انتهاء كل شهادة</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CertificationsSection;