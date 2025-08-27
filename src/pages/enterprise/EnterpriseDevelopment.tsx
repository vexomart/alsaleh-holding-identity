import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Code2, 
  Rocket, 
  Shield, 
  Zap, 
  Cloud, 
  Database, 
  Globe, 
  Target,
  CheckCircle,
  ArrowRight,
  Star,
  Clock,
  Users,
  Award,
  Sparkles,
  Play
} from "lucide-react";
import { Link } from "react-router-dom";

const technologies = [
  { name: "React/Next.js", icon: "⚛️", desc: "Modern frontend frameworks" },
  { name: "Node.js", icon: "🟢", desc: "Server-side JavaScript" },
  { name: "TypeScript", icon: "🔷", desc: "Type-safe development" },
  { name: "Docker", icon: "🐳", desc: "Containerization" },
  { name: "Kubernetes", icon: "☸️", desc: "Container orchestration" },
  { name: "AWS/Azure", icon: "☁️", desc: "Cloud platforms" },
  { name: "GraphQL", icon: "🔗", desc: "API query language" },
  { name: "MongoDB", icon: "🍃", desc: "NoSQL database" }
];

const features = [
  {
    icon: Shield,
    title: "Security First",
    desc: "أمان متقدم مع تشفير end-to-end وحماية ضد التهديدات"
  },
  {
    icon: Zap,
    title: "High Performance",
    desc: "أداء عالي مع تحسين السرعة واستجابة فورية"
  },
  {
    icon: Cloud,
    title: "Cloud Native",
    desc: "حلول سحابية متطورة قابلة للتوسع والنمو"
  },
  {
    icon: Database,
    title: "Data Analytics",
    desc: "تحليل البيانات الذكي واستخراج الرؤى القيمة"
  }
];

const projects = [
  {
    title: "E-Commerce Platform",
    client: "Fortune 500 Company",
    tech: "React, Node.js, AWS",
    result: "300% increase in sales",
    duration: "8 weeks"
  },
  {
    title: "Banking System",
    client: "International Bank",
    tech: "Angular, .NET, Azure",
    result: "99.9% uptime achieved",
    duration: "12 weeks"
  },
  {
    title: "Healthcare App",
    client: "Medical Group",
    tech: "Flutter, Python, GCP",
    result: "1M+ users served",
    duration: "10 weeks"
  }
];

const EnterpriseDevelopment = () => {
  useEffect(() => {
    document.title = "Enterprise Application Development | ASH HOLDING";
    const desc = "حلول تطوير التطبيقات المؤسسية المتقدمة للشركات العالمية. تقنيات حديثة، أمان عالي، وأداء استثنائي.";
    
    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = desc;
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="relative">
        {/* Hero Section */}
        <section className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-200/20 via-transparent to-purple-200/20"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="mb-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2">
                <Sparkles className="w-4 h-4 mr-2" />
                Enterprise Solutions
              </Badge>
              
              <h1 className="text-5xl lg:text-7xl font-black mb-6 bg-gradient-to-r from-blue-900 via-purple-800 to-indigo-900 bg-clip-text text-transparent leading-tight">
                تطوير التطبيقات المؤسسية
              </h1>
              
              <p className="text-xl text-slate-600 mb-8 leading-relaxed max-w-3xl mx-auto">
                نبني حلول تقنية متطورة ومخصصة للشركات العالمية الرائدة باستخدام أحدث التقنيات 
                ومعايير الأمان العالمية لضمان النجاح والنمو المستدام
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Link to="/consultation">
                  <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-8 py-4 group">
                    <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                    ابدأ مشروعك الآن
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="px-8 py-4">
                  <Globe className="w-5 h-5 mr-2" />
                  شاهد أعمالنا
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { value: "250+", label: "مشروع مؤسسي", icon: Target },
                  { value: "50+", label: "عميل عالمي", icon: Globe },
                  { value: "4.9/5", label: "تقييم العملاء", icon: Star },
                  { value: "99.9%", label: "معدل الاستقرار", icon: Shield }
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="flex justify-center mb-2">
                      <stat.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                    <div className="text-sm text-slate-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 text-slate-900">لماذا نحن الخيار الأمثل؟</h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                نجمع بين الخبرة التقنية العميقة والفهم الشامل لاحتياجات الأعمال المؤسسية
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-slate-900">{feature.title}</h3>
                    <p className="text-slate-600">{feature.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Technologies Section */}
        <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 text-slate-900">التقنيات المتقدمة</h2>
              <p className="text-xl text-slate-600">نستخدم أحدث التقنيات العالمية لضمان الجودة والأداء</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {technologies.map((tech, index) => (
                <Card key={index} className="group hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-3">{tech.icon}</div>
                    <h3 className="font-bold text-slate-900 mb-1">{tech.name}</h3>
                    <p className="text-sm text-slate-600">{tech.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 text-slate-900">مشاريع ناجحة</h2>
              <p className="text-xl text-slate-600">شاهد بعض من مشاريعنا المؤسسية الناجحة</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {projects.map((project, index) => (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-600"></div>
                  <CardHeader>
                    <CardTitle className="text-xl text-slate-900 group-hover:text-blue-600 transition-colors">
                      {project.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center text-sm text-slate-600">
                      <Users className="w-4 h-4 mr-2" />
                      {project.client}
                    </div>
                    <div className="flex items-center text-sm text-slate-600">
                      <Code2 className="w-4 h-4 mr-2" />
                      {project.tech}
                    </div>
                    <div className="flex items-center text-sm text-slate-600">
                      <Clock className="w-4 h-4 mr-2" />
                      {project.duration}
                    </div>
                    <div className="pt-2 border-t">
                      <div className="flex items-center text-green-600 font-semibold">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        {project.result}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 text-white">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl font-bold mb-6">
                هل أنت مستعد لتطوير مشروعك المؤسسي؟
              </h2>
              <p className="text-xl mb-8 text-blue-100">
                دعنا نناقش رؤيتك ونحولها إلى حلول تقنية متطورة تقود نجاح مؤسستك
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/consultation">
                  <Button size="lg" className="bg-white text-blue-900 hover:bg-blue-50 px-8 py-4 group">
                    <Rocket className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                    احجز استشارة مجانية
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10 px-8 py-4">
                    تواصل معنا
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default EnterpriseDevelopment;