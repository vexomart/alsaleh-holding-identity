import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Palette, 
  Crown, 
  Globe, 
  Sparkles, 
  Target,
  CheckCircle,
  ArrowRight,
  Star,
  Users,
  Award,
  Brush,
  Eye,
  Heart,
  Lightbulb,
  Play,
  Zap
} from "lucide-react";
import { Link } from "react-router-dom";

const brandingServices = [
  {
    icon: Crown,
    title: "Brand Strategy",
    arabicTitle: "استراتيجية العلامة التجارية",
    desc: "تطوير هوية فريدة تعكس قيم وأهداف مؤسستك بطريقة مبتكرة ومميزة"
  },
  {
    icon: Eye,
    title: "Visual Identity",
    arabicTitle: "الهوية البصرية",
    desc: "تصميم شعارات وعناصر بصرية احترافية تترك انطباعاً قوياً ودائماً"
  },
  {
    icon: Heart,
    title: "Brand Experience",
    arabicTitle: "تجربة العلامة التجارية",
    desc: "خلق تجارب متميزة ومتسقة عبر جميع نقاط التفاعل مع عملائك"
  },
  {
    icon: Lightbulb,
    title: "Creative Direction",
    arabicTitle: "التوجه الإبداعي",
    desc: "إرشاد وتوجيه إبداعي شامل لضمان التماسك والتميز في جميع المواد"
  }
];

const portfolioItems = [
  {
    title: "Tech Giant Rebranding",
    client: "International Technology Company",
    category: "Complete Rebrand",
    result: "400% brand recognition increase",
    image: "🚀",
    services: ["Logo Design", "Brand Guidelines", "Marketing Materials"]
  },
  {
    title: "Luxury Hotel Chain",
    client: "5-Star Hotel Group",
    category: "Hospitality Branding",
    result: "50% customer loyalty boost",
    image: "🏨",
    services: ["Visual Identity", "Environmental Design", "Digital Assets"]
  },
  {
    title: "Financial Institution",
    client: "Leading Investment Bank",
    category: "Corporate Identity",
    result: "Trust rating improved by 60%",
    image: "🏦",
    services: ["Corporate Branding", "Presentation Templates", "Signage"]
  }
];

const designTools = [
  { name: "Adobe Creative Suite", icon: "🎨", specialty: "Industry Standard" },
  { name: "Figma", icon: "🔧", specialty: "Collaborative Design" },
  { name: "Sketch", icon: "✏️", specialty: "UI/UX Design" },
  { name: "Cinema 4D", icon: "🎬", specialty: "3D Branding" },
  { name: "After Effects", icon: "🎞️", specialty: "Motion Graphics" },
  { name: "Blender", icon: "🌟", specialty: "3D Modeling" }
];

const brandingFeatures = [
  "Brand Strategy & Positioning",
  "Logo & Visual Identity Design", 
  "Brand Guidelines Development",
  "Marketing Collateral Design",
  "Digital Asset Creation",
  "Brand Experience Design",
  "International Brand Adaptation",
  "Trademark & Legal Support"
];

const EnterpriseBranding = () => {
  useEffect(() => {
    document.title = "Global Brand Identity & Design | ASH HOLDING";
    const desc = "خدمات تصميم الهوية البصرية العالمية للشركات الرائدة. تصميم احترافي، استراتيجية متطورة، وتجربة علامة تجارية متميزة.";
    
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
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-purple-200/30 via-transparent to-pink-200/20"></div>
          
          {/* Floating Design Elements */}
          <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-2xl animate-float"></div>
          <div className="absolute bottom-20 left-20 w-40 h-40 bg-gradient-to-br from-orange-400/20 to-red-400/20 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }}></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="mb-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2">
                <Crown className="w-4 h-4 mr-2" />
                Global Branding Excellence
              </Badge>
              
              <h1 className="text-5xl lg:text-7xl font-black mb-6 bg-gradient-to-r from-purple-900 via-pink-800 to-orange-900 bg-clip-text text-transparent leading-tight">
                الهوية البصرية العالمية
              </h1>
              
              <p className="text-xl text-slate-600 mb-8 leading-relaxed max-w-3xl mx-auto">
                نصمم هويات بصرية استثنائية تعكس شخصية علامتك التجارية وتترك أثراً قوياً 
                في أذهان عملائك حول العالم بأحدث معايير التصميم العالمية
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Link to="/consultation">
                  <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-8 py-4 group">
                    <Brush className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                    ابدأ تصميم هويتك
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="px-8 py-4">
                  <Eye className="w-5 h-5 mr-2" />
                  شاهد معرض الأعمال
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { value: "180+", label: "مشروع تصميم", icon: Brush },
                  { value: "40+", label: "علامة عالمية", icon: Globe },
                  { value: "4.8/5", label: "تقييم الإبداع", icon: Star },
                  { value: "95%", label: "رضا العملاء", icon: Heart }
                ].map((stat, index) => (
                  <div key={index} className="text-center group hover:scale-105 transition-transform">
                    <div className="flex justify-center mb-2">
                      <stat.icon className="w-6 h-6 text-purple-600 group-hover:animate-pulse" />
                    </div>
                    <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                    <div className="text-sm text-slate-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 text-slate-900">خدمات التصميم الشاملة</h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                من الفكرة إلى التنفيذ، نقدم حلول تصميم متكاملة تغطي جميع احتياجاتك
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {brandingServices.map((service, index) => (
                <Card key={index} className="group hover:shadow-xl transition-all duration-500 border-0 shadow-lg overflow-hidden">
                  <div className="h-2 bg-gradient-to-r from-purple-500 to-pink-500"></div>
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                      <service.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-bold mb-2 text-slate-900">{service.arabicTitle}</h3>
                    <h4 className="text-sm font-medium text-purple-600 mb-3">{service.title}</h4>
                    <p className="text-slate-600 text-sm leading-relaxed">{service.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 text-slate-900">ما نقدمه لك</h2>
              <p className="text-xl text-slate-600">خدمات تصميم شاملة لبناء هوية قوية ومتميزة</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {brandingFeatures.map((feature, index) => (
                <Card key={index} className="group hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm border-0">
                  <CardContent className="p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                      <span className="text-sm font-medium text-slate-700">{feature}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Portfolio Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 text-slate-900">مشاريع ملهمة</h2>
              <p className="text-xl text-slate-600">اكتشف كيف ساعدنا العلامات التجارية في تحقيق النجاح</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {portfolioItems.map((item, index) => (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-12 text-center">
                    <div className="text-6xl mb-4">{item.image}</div>
                    <Badge className="bg-purple-500 text-white">{item.category}</Badge>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl text-slate-900 group-hover:text-purple-600 transition-colors">
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center text-sm text-slate-600">
                      <Users className="w-4 h-4 mr-2" />
                      {item.client}
                    </div>
                    <div className="pt-2 border-t">
                      <div className="flex items-center text-green-600 font-semibold mb-3">
                        <Zap className="w-4 h-4 mr-2" />
                        {item.result}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {item.services.map((service, serviceIndex) => (
                          <Badge key={serviceIndex} variant="outline" className="text-xs">
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Tools Section */}
        <section className="py-20 bg-gradient-to-br from-slate-50 to-purple-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 text-slate-900">أدوات التصميم المتقدمة</h2>
              <p className="text-xl text-slate-600">نستخدم أحدث برامج التصميم العالمية لإنتاج أعمال استثنائية</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {designTools.map((tool, index) => (
                <Card key={index} className="group hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl mb-2">{tool.icon}</div>
                    <h3 className="font-bold text-slate-900 text-sm mb-1">{tool.name}</h3>
                    <p className="text-xs text-slate-600">{tool.specialty}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-purple-900 via-pink-900 to-orange-900 text-white">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-center gap-4 mb-6">
                <Sparkles className="w-8 h-8 text-yellow-400 animate-pulse" />
                <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-400/30">
                  تصميم لا يُنسى
                </Badge>
                <Sparkles className="w-8 h-8 text-yellow-400 animate-pulse" />
              </div>
              
              <h2 className="text-4xl font-bold mb-6">
                هل أنت مستعد لإنشاء هوية بصرية قوية؟
              </h2>
              <p className="text-xl mb-8 text-purple-100">
                دعنا نحول رؤيتك إلى هوية بصرية مؤثرة تتحدث عن علامتك التجارية بقوة وثقة
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/consultation">
                  <Button size="lg" className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-slate-900 font-bold px-8 py-4 group">
                    <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                    ابدأ مشروع التصميم
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10 px-8 py-4">
                    <Palette className="w-5 h-5 mr-2" />
                    استشارة تصميم مجانية
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

export default EnterpriseBranding;