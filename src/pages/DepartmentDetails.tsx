import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Star, TrendingUp, Users, Award, ExternalLink, CheckCircle, Zap } from "lucide-react";
import React, { useState } from "react";

// Department data - complete with all sections
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
  },
  {
    id: "ai-data-science",
    name: "علوم البيانات والذكاء الاصطناعي",
    description: "تحليل البيانات الضخمة وتطوير نماذج الذكاء الاصطناعي المتقدمة",
    fullDescription: "نختص في تطوير حلول الذكاء الاصطناعي وعلوم البيانات المتقدمة، حيث نساعد الشركات على استخراج رؤى قيمة من بياناتها وأتمتة العمليات المعقدة باستخدام خوارزميات التعلم الآلي المتطورة.",
    services: ["Machine Learning", "Big Data Analytics", "تعلم الآلة العميق", "معالجة اللغة الطبيعية", "Computer Vision", "Neural Networks"],
    color: "from-orange-600 to-red-500",
    globalTech: ["Python", "TensorFlow", "PyTorch", "AWS SageMaker", "Apache Spark", "Jupyter"],
    projects: "200+",
    rating: "5.0",
    trend: "+60%",
    teamSize: "30+ خبير ذكاء اصطناعي",
    certifications: ["AWS Machine Learning", "Google Cloud AI", "Microsoft Azure AI"],
    portfolio: [
      { name: "نظام التنبؤ المالي", tech: "Deep Learning + Time Series", accuracy: "95%" },
      { name: "محرك التوصيات الذكي", tech: "Collaborative Filtering + NLP", engagement: "+80%" },
      { name: "نظام تحليل الصور الطبية", tech: "Computer Vision + CNN", precision: "98%" }
    ]
  },
  {
    id: "cybersecurity",
    name: "الأمن السيبراني المتقدم",
    description: "حماية متطورة بأحدث تقنيات الأمان العالمية والذكاء الاصطناعي",
    fullDescription: "نوفر حلول الأمن السيبراني الشاملة والمتقدمة لحماية البنية التحتية الرقمية للمؤسسات. فريقنا من خبراء الأمن يعمل على تطوير وتنفيذ استراتيجيات أمنية متطورة تتضمن الذكاء الاصطناعي لمكافحة التهديدات المتقدمة.",
    services: ["AI-Powered Security", "Zero Trust Architecture", "حماية السحابة", "تحليل التهديدات", "اختبار الاختراق", "إدارة الهوية"],
    color: "from-gray-700 to-slate-600",
    globalTech: ["Microsoft Sentinel", "CrowdStrike", "Splunk", "Palo Alto", "Fortinet", "Cisco"],
    projects: "150+",
    rating: "4.9",
    trend: "+45%",
    teamSize: "20+ خبير أمن",
    certifications: ["CISSP", "CEH", "CISSP", "Security+", "CISM"],
    portfolio: [
      { name: "نظام الحماية المصرفية", tech: "AI Threat Detection + SIEM", incidents: "-90%" },
      { name: "بنية الثقة الصفرية", tech: "Zero Trust + IAM", security: "99.9%" },
      { name: "حماية التطبيقات السحابية", tech: "Cloud Security + WAF", protection: "100%" }
    ]
  },
  {
    id: "cloud-solutions",
    name: "الحلول السحابية المتقدمة",
    description: "تطوير وإدارة البنية التحتية السحابية بمعايير المؤسسات العالمية",
    fullDescription: "نقدم حلول سحابية متكاملة ومتقدمة تساعد المؤسسات على الانتقال الرقمي وتحقيق الكفاءة والمرونة. فريقنا يعمل على تصميم وتنفيذ بنية تحتية سحابية قابلة للتوسع وآمنة باستخدام أحدث تقنيات DevOps والحاويات.",
    services: ["Multi-Cloud Strategy", "Kubernetes", "Microservices", "DevOps/GitOps", "Infrastructure as Code", "Container Orchestration"],
    color: "from-indigo-600 to-blue-600",
    globalTech: ["AWS", "Azure", "GCP", "Docker", "Terraform", "Kubernetes"],
    projects: "400+",
    rating: "4.8",
    trend: "+35%",
    teamSize: "40+ مهندس سحابي",
    certifications: ["AWS Solutions Architect", "Azure Expert", "Google Cloud Architect"],
    portfolio: [
      { name: "منصة التجارة الإلكترونية السحابية", tech: "AWS + Kubernetes", scalability: "1000x" },
      { name: "نظام إدارة المحتوى العالمي", tech: "Multi-Cloud + CDN", availability: "99.99%" },
      { name: "بنية تحتية للألعاب", tech: "GCP + Load Balancing", latency: "<50ms" }
    ]
  },
  {
    id: "data-management",
    name: "إدارة البيانات المؤسسية",
    description: "حلول قواعد البيانات المتقدمة وإدارة البيانات الضخمة عالمياً",
    fullDescription: "نتخصص في تصميم وإدارة أنظمة البيانات المعقدة والمتقدمة للمؤسسات الكبيرة. فريقنا يعمل على تطوير حلول تخزين وتحليل البيانات الضخمة مع ضمان الأداء العالي والأمان المتقدم.",
    services: ["Data Warehousing", "Real-time Analytics", "Data Governance", "BI Solutions", "ETL/ELT Pipelines", "Data Lake Architecture"],
    color: "from-teal-600 to-green-500",
    globalTech: ["MongoDB", "PostgreSQL", "Snowflake", "Power BI", "Apache Kafka", "Elasticsearch"],
    projects: "250+",
    rating: "4.7",
    trend: "+28%",
    teamSize: "25+ مهندس بيانات",
    certifications: ["Snowflake Architect", "MongoDB Professional", "Microsoft BI"],
    portfolio: [
      { name: "مستودع البيانات المصرفية", tech: "Snowflake + Real-time Analytics", performance: "10x faster" },
      { name: "منصة ذكاء الأعمال", tech: "Power BI + Data Lake", insights: "360°" },
      { name: "نظام البيانات الضخمة", tech: "Hadoop + Spark", processing: "TB/hour" }
    ]
  },
  {
    id: "innovation-automation",
    name: "الابتكار والأتمتة",
    description: "تطوير حلول الأتمتة الذكية وعمليات الابتكار التقني المتقدم",
    fullDescription: "نركز على تطوير حلول الأتمتة الذكية والابتكار التقني لتحسين كفاءة العمليات وخفض التكاليف. فريقنا يعمل على تصميم وتنفيذ أنظمة أتمتة متطورة تجمع بين الذكاء الاصطناعي وأتمتة العمليات.",
    services: ["RPA Solutions", "Process Automation", "Innovation Labs", "Digital Transformation", "Workflow Optimization", "Smart Robotics"],
    color: "from-yellow-500 to-orange-500",
    globalTech: ["UiPath", "Microsoft Power Platform", "Zapier", "Custom APIs", "Python", "Node.js"],
    projects: "350+",
    rating: "4.8",
    trend: "+50%",
    teamSize: "28+ مطور أتمتة",
    certifications: ["UiPath Advanced", "Microsoft Power Platform", "Automation Anywhere"],
    portfolio: [
      { name: "أتمتة العمليات المصرفية", tech: "RPA + AI", efficiency: "+75%" },
      { name: "نظام الفاتورة الذكي", tech: "OCR + Machine Learning", accuracy: "99%" },
      { name: "منصة الابتكار الرقمي", tech: "Low-Code + APIs", development: "5x faster" }
    ]
  }
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