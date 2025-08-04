import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Star, TrendingUp, Users, Award, ExternalLink, CheckCircle, Zap } from "lucide-react";
import { useState } from "react";

// Department data - same as in DepartmentsSection
const departments = [
  {
    id: "mobile-development",
    name: "تطوير التطبيقات المتقدمة",
    description: "تطوير تطبيقات ذكية بتقنيات الذكاء الاصطناعي والواقع المعزز",
    fullDescription: "نقدم حلول تطوير التطبيقات المتقدمة باستخدام أحدث التقنيات العالمية والذكاء الاصطناعي. فريقنا من المطورين المحترفين يعمل على تطوير تطبيقات مبتكرة تلبي احتياجات العملاء وتوفر تجربة مستخدم استثنائية.",
    services: ["تطبيقات AI-powered", "الواقع المعزز AR", "تطبيقات البلوك تشين", "Progressive Web Apps", "تطبيقات الجوال الهجينة", "تكامل IoT"],
    color: "from-blue-600 to-cyan-500",
    globalTech: ["React Native", "Flutter", "Swift", "Kotlin", "TensorFlow", "ARKit", "Firebase"],
    projects: "500+",
    rating: "4.9",
    trend: "+25%",
    teamSize: "45+ مطور",
    certifications: ["AWS Mobile Certified", "Google Mobile Web Specialist", "Apple Developer Program"],
    portfolio: [
      { name: "تطبيق التجارة الإلكترونية الذكي", tech: "React Native + AI", users: "1M+" },
      { name: "تطبيق الواقع المعزز للتسوق", tech: "ARKit + Unity", users: "500K+" },
      { name: "منصة التعلم التفاعلية", tech: "Flutter + ML", users: "2M+" }
    ]
  },
  {
    id: "digital-marketing", 
    name: "التسويق الرقمي العالمي",
    description: "استراتيجيات التسويق الرقمي بمعايير عالمية وذكاء اصطناعي",
    fullDescription: "نقدم حلول التسويق الرقمي المتكاملة باستخدام أحدث تقنيات الذكاء الاصطناعي والتحليل التنبؤي. فريقنا يعمل على تطوير استراتيجيات تسويقية مبتكرة تحقق أفضل النتائج وأعلى معدلات التحويل.",
    services: ["التسويق بالذكاء الاصطناعي", "التحليل التنبؤي", "الأتمتة المتقدمة", "حملات عالمية", "تحليل البيانات الضخمة", "إدارة وسائل التواصل"],
    color: "from-emerald-600 to-teal-500",
    globalTech: ["Google Analytics 4", "Facebook Ads API", "HubSpot", "Salesforce", "Power BI", "Python"],
    projects: "300+",
    rating: "4.8", 
    trend: "+40%",
    teamSize: "35+ خبير تسويق",
    certifications: ["Google Ads Certified", "Facebook Blueprint", "HubSpot Certified"],
    portfolio: [
      { name: "حملة تسويقية للبنوك", tech: "AI + Analytics", roi: "300%" },
      { name: "استراتيجية التجارة الإلكترونية", tech: "Automation + CRM", roi: "250%" },
      { name: "تسويق التطبيقات الجوالة", tech: "Mobile Marketing", roi: "400%" }
    ]
  },
  {
    id: "design-solutions",
    name: "التصميم والإبداع الرقمي", 
    description: "تصميم تجارب مستخدم متطورة بأحدث أدوات التصميم العالمية",
    fullDescription: "نقدم حلول التصميم الإبداعي والتجارب الرقمية المتطورة. فريقنا من المصممين المحترفين يعمل على تطوير هويات بصرية مميزة وتجارب مستخدم استثنائية تجمع بين الجمال والوظائف العملية.",
    services: ["تصميم UX/UI متقدم", "تصميم ثلاثي الأبعاد", "الهوية الرقمية", "Motion Graphics", "تصميم التطبيقات", "تصميم المواقع التفاعلية"],
    color: "from-purple-600 to-pink-500",
    globalTech: ["Figma", "Adobe Creative Suite", "Blender", "After Effects", "Sketch", "Principle"],
    projects: "800+",
    rating: "4.9",
    trend: "+30%",
    teamSize: "25+ مصمم",
    certifications: ["Adobe Certified Expert", "UX Design Institute", "Google UX Design"],
    portfolio: [
      { name: "تطبيق البنك الرقمي", tech: "UI/UX + Animation", awards: "3 جوائز دولية" },
      { name: "موقع التجارة الإلكترونية", tech: "3D Design + Interactive", conversion: "+45%" },
      { name: "هوية الشركة التقنية", tech: "Brand Identity + Motion", recognition: "عالمي" }
    ]
  }
  // يمكن إضافة باقي الأقسام...
];

const DepartmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  const department = departments.find(dept => dept.id === id);

  if (!department) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">القسم غير موجود</h1>
          <Button onClick={() => navigate("/")}>العودة للرئيسية</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-slate-900/40 to-slate-900"></div>
        <div className="container mx-auto px-6 py-12 relative z-10">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/")}
            className="text-white hover:text-purple-300 mb-8"
          >
            <ArrowLeft className="w-4 h-4 ml-2" />
            العودة للرئيسية
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Info */}
            <div className="lg:col-span-2">
              <div className={`w-16 h-16 bg-gradient-to-br ${department.color} rounded-xl flex items-center justify-center mb-6 shadow-lg`}>
                <Zap className="w-8 h-8 text-white" />
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {department.name}
              </h1>
              
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                {department.fullDescription}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="text-center p-4 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10">
                  <div className="text-2xl font-bold text-purple-400">{department.projects}</div>
                  <div className="text-sm text-gray-400">مشروع مكتمل</div>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10">
                  <div className="text-2xl font-bold text-green-400 flex items-center justify-center gap-1">
                    <Star className="w-5 h-5 fill-current" />
                    {department.rating}
                  </div>
                  <div className="text-sm text-gray-400">تقييم العملاء</div>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10">
                  <div className="text-2xl font-bold text-blue-400">{department.teamSize}</div>
                  <div className="text-sm text-gray-400">فريق العمل</div>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10">
                  <div className="text-2xl font-bold text-orange-400">{department.trend}</div>
                  <div className="text-sm text-gray-400">نمو سنوي</div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Services */}
              <Card className="bg-white/5 backdrop-blur-md border border-white/10">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-white mb-4">خدماتنا</h3>
                  <div className="space-y-2">
                    {department.services.map((service, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-sm text-gray-300">{service}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Tech Stack */}
              <Card className="bg-white/5 backdrop-blur-md border border-white/10">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-white mb-4">التقنيات المستخدمة</h3>
                  <div className="flex flex-wrap gap-2">
                    {department.globalTech.map((tech, index) => (
                      <Badge 
                        key={index}
                        variant="outline"
                        className="bg-white/10 border-white/20 text-white text-xs"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Certifications */}
              <Card className="bg-white/5 backdrop-blur-md border border-white/10">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-white mb-4">الشهادات والاعتمادات</h3>
                  <div className="space-y-3">
                    {department.certifications.map((cert, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm text-gray-300">{cert}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Portfolio Section */}
      <div className="container mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">أعمالنا المميزة</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {department.portfolio.map((project, index) => (
            <Card key={index} className="group bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all duration-300">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-white mb-2">{project.name}</h3>
                <p className="text-sm text-purple-400 mb-3">{project.tech}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">
                    {project.users || project.roi || project.awards || project.conversion || project.recognition}
                  </span>
                  <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-purple-400 transition-colors" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button 
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-full"
            onClick={() => navigate("/contact")}
          >
            ابدأ مشروعك معنا
            <ExternalLink className="w-5 h-5 mr-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DepartmentDetails;