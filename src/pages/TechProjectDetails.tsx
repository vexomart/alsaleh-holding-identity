import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Code, 
  Calendar, 
  Users, 
  Star, 
  Clock,
  CheckCircle,
  Circle,
  ChevronRight,
  Download,
  Eye,
  Share2,
  Heart,
  MessageCircle,
  Phone,
  Mail,
  Globe,
  Target,
  Zap,
  Shield,
  Database,
  Smartphone,
  Monitor
} from "lucide-react";
import { Link, useParams } from "react-router-dom";

const TechProjectDetails = () => {
  const { projectId } = useParams();
  
  // Projects data
  const projects = [
    {
      id: 1,
      title: "نظام المحاسبة والفواتير",
      description: "نظام شامل لإدارة المحاسبة والفواتير مع تقارير مالية متطورة وإدارة العملاء والموردين بطريقة احترافية ومتطورة",
      category: "web",
      status: "قيد التطوير",
      progress: 65,
      technologies: ["React", "Node.js", "PostgreSQL", "TypeScript", "Docker", "AWS"],
      startDate: "2025-07-23",
      estimatedCompletion: "2025-08-15",
      budget: "12,600 ريال",
      client: "داخلي - مبادرة الشركة",
      features: [
        "إدارة الفواتير والعروض",
        "تتبع المدفوعات والمستحقات",
        "تقارير مالية تفصيلية",
        "إدارة العملاء والموردين",
        "نظام الإشعارات الذكي",
        "تكامل مع البنوك السعودية",
        "دعم الفواتير الإلكترونية",
        "تقارير الضرائب المضافة",
        "نظام الموافقات متعدد المستويات",
        "تحليلات مالية متقدمة"
      ],
      milestones: [
        { title: "تحليل المتطلبات", status: "completed", date: "2025-07-23", progress: 100 },
        { title: "تصميم قاعدة البيانات", status: "completed", date: "2025-07-30", progress: 100 },
        { title: "تطوير واجهات المستخدم", status: "in-progress", date: "2025-08-05", progress: 75 },
        { title: "تطوير APIs الخلفية", status: "in-progress", date: "2025-08-08", progress: 60 },
        { title: "التكامل والاختبار", status: "pending", date: "2025-08-12", progress: 0 },
        { title: "النشر والتسليم", status: "pending", date: "2025-08-15", progress: 0 }
      ],
      objectives: [
        "تطوير نظام محاسبة متكامل وحديث",
        "تحسين كفاءة العمليات المالية",
        "توفير تقارير مالية دقيقة وفورية",
        "ضمان الامتثال للوائح المحاسبية السعودية",
        "تقليل الأخطاء البشرية في العمليات المالية"
      ],
      challenges: [
        "التكامل مع الأنظمة المحاسبية الموجودة",
        "ضمان أمان البيانات المالية الحساسة",
        "تطوير واجهة مستخدم بديهية ومرنة",
        "تحقيق الامتثال للوائح الحكومية"
      ],
      images: [
        "/placeholder.svg",
        "/placeholder.svg",
        "/placeholder.svg",
        "/placeholder.svg"
      ]
    },
    {
      id: 2,
      title: "مساعد الذكاء الاصطناعي لخدمة العملاء",
      description: "برنامج ذكاء اصطناعي متطور مصمم ومطور لخدمة العملاء على الموقع الرسمي للشركة مع إجابات فورية وذكية ومعالجة طبيعية للغة",
      category: "ai",
      status: "مكتمل",
      progress: 100,
      technologies: ["Python", "TensorFlow", "OpenAI API", "Node.js", "React", "WebSocket", "NLP", "Machine Learning"],
      startDate: "2025-07-01",
      estimatedCompletion: "2025-07-29",
      budget: "7,000 ريال",
      client: "داخلي - مبادرة الشركة",
      features: [
        "إجابات فورية على استفسارات العملاء",
        "دعم اللغة العربية والإنجليزية",
        "تكامل مع قاعدة بيانات الشركة",
        "تعلم مستمر من التفاعلات",
        "واجهة دردشة تفاعلية وذكية",
        "تحليلات لسلوك العملاء",
        "إدارة التذاكر الآلية",
        "تصعيد للموظفين عند الحاجة",
        "دعم ملفات متعددة الوسائط",
        "تتبع رضا العملاء"
      ],
      milestones: [
        { title: "تحليل متطلبات الذكاء الاصطناعي", status: "completed", date: "2024-10-01", progress: 100 },
        { title: "تطوير نموذج المعالجة الطبيعية", status: "completed", date: "2024-10-15", progress: 100 },
        { title: "تطوير واجهة الدردشة", status: "completed", date: "2024-11-01", progress: 100 },
        { title: "التكامل مع قاعدة البيانات", status: "completed", date: "2024-11-15", progress: 100 },
        { title: "الاختبار والتحسين", status: "completed", date: "2024-12-01", progress: 100 },
        { title: "النشر والتفعيل", status: "completed", date: "2024-12-15", progress: 100 }
      ],
      objectives: [
        "تطوير مساعد ذكي لخدمة العملاء على مدار الساعة",
        "تحسين تجربة العملاء وتقليل أوقات الانتظار",
        "توفير إجابات دقيقة ومفيدة للاستفسارات الشائعة",
        "تقليل العبء على فريق خدمة العملاء",
        "جمع وتحليل بيانات تفاعل العملاء"
      ],
      challenges: [
        "فهم اللغة العربية والسياق المحلي",
        "تدريب النموذج على بيانات الشركة الخاصة",
        "ضمان الاستجابة السريعة والدقيقة",
        "التكامل مع الأنظمة الموجودة"
      ],
      images: [
        "/placeholder.svg",
        "/placeholder.svg",
        "/placeholder.svg",
        "/placeholder.svg"
      ]
    }
  ];

  // Find project by ID
  const project = projects.find(p => p.id === parseInt(projectId || '1')) || projects[0];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'in-progress':
        return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
      case 'pending':
        return 'text-slate-400 bg-slate-500/20 border-slate-500/30';
      default:
        return 'text-slate-400 bg-slate-500/20 border-slate-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'in-progress':
        return <Clock className="w-4 h-4 text-orange-400" />;
      case 'pending':
        return <Circle className="w-4 h-4 text-slate-400" />;
      default:
        return <Circle className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-b border-slate-700/50">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-l from-blue-500/10 to-purple-500/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-6 py-12 relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-8">
            <Link to="/" className="text-slate-400 hover:text-white transition-colors">
              الرئيسية
            </Link>
            <ChevronRight className="w-4 h-4 text-slate-500" />
            <Link to="/tech-projects" className="text-slate-400 hover:text-white transition-colors">
              المشاريع التقنية
            </Link>
            <ChevronRight className="w-4 h-4 text-slate-500" />
            <span className="text-white font-medium">{project.title}</span>
          </nav>

          {/* Project Header */}
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <Badge className={getStatusColor(project.status.replace('قيد التطوير', 'in-progress'))}>
                  {project.status}
                </Badge>
                <div className="text-slate-400 text-sm flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {project.startDate} - {project.estimatedCompletion}
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {project.title}
              </h1>
              
              <p className="text-xl text-slate-300 leading-relaxed mb-6">
                {project.description}
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                  <div className="text-2xl font-bold text-blue-400">{project.progress}%</div>
                  <div className="text-sm text-slate-400">نسبة الإنجاز</div>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                  <div className="text-2xl font-bold text-purple-400">{project.budget}</div>
                  <div className="text-sm text-slate-400">الميزانية</div>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                  <div className="text-2xl font-bold text-orange-400">{project.technologies.length}</div>
                  <div className="text-sm text-slate-400">التقنيات</div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                <Eye className="w-4 h-4 mr-2" />
                عرض العرض التوضيحي
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                تحميل المستندات
              </Button>
              <Button variant="outline">
                <Share2 className="w-4 h-4 mr-2" />
                مشاركة المشروع
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Progress Overview */}
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-400" />
                  تقدم المشروع
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-300">التقدم الإجمالي</span>
                    <span className="text-blue-400 font-bold">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-3" />
                </div>
                
                <div className="space-y-4">
                  {project.milestones.map((milestone, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 bg-slate-700/30 rounded-lg">
                      {getStatusIcon(milestone.status)}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-white font-medium">{milestone.title}</h4>
                          <span className="text-sm text-slate-400">{milestone.date}</span>
                        </div>
                        <Progress value={milestone.progress} className="h-2" />
                      </div>
                      <span className="text-sm text-slate-400">{milestone.progress}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Project Features */}
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  ميزات المشروع
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {project.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <span className="text-slate-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Project Objectives */}
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Target className="w-5 h-5 text-green-400" />
                  أهداف المشروع
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {project.objectives.map((objective, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-slate-300">{objective}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Technical Challenges */}
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-red-400" />
                  التحديات التقنية
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {project.challenges.map((challenge, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-slate-300">{challenge}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Project Info */}
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Code className="w-5 h-5 text-blue-400" />
                  معلومات المشروع
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm text-slate-400 mb-1">العميل</div>
                  <div className="text-white">{project.client}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-400 mb-1">الفئة</div>
                  <Badge variant="outline" className={`${
                    project.category === 'ai' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                    project.category === 'web' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                    'bg-blue-500/20 text-blue-400 border-blue-500/30'
                  }`}>
                    {project.category === 'ai' ? 'الذكاء الاصطناعي' : 'تطبيقات الويب'}
                  </Badge>
                </div>
                <Separator className="bg-slate-700" />
                <div>
                  <div className="text-sm text-slate-400 mb-1">تاريخ البدء</div>
                  <div className="text-white">{project.startDate}</div>
                </div>
                <Separator className="bg-slate-700" />
                <div>
                  <div className="text-sm text-slate-400 mb-1">تاريخ الانتهاء المتوقع</div>
                  <div className="text-white">{project.estimatedCompletion}</div>
                </div>
              </CardContent>
            </Card>

            {/* Technologies */}
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Database className="w-5 h-5 text-purple-400" />
                  التقنيات المستخدمة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, index) => (
                    <Badge key={index} variant="outline" className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-orange-400" />
                  تواصل معنا
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">
                  <Phone className="w-4 h-4 mr-2" />
                  اتصل بنا
                </Button>
                <Button variant="outline" className="w-full">
                  <Mail className="w-4 h-4 mr-2" />
                  أرسل رسالة
                </Button>
                <Button variant="outline" className="w-full">
                  <Globe className="w-4 h-4 mr-2" />
                  زيارة الموقع
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-12 text-center">
          <Link to="/tech-projects">
            <Button variant="outline" className="px-8">
              <ArrowLeft className="w-4 h-4 mr-2" />
              العودة للمشاريع التقنية
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TechProjectDetails;