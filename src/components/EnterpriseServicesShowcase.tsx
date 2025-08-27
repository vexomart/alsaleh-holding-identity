import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Code2,
  Palette,
  Monitor,
  Smartphone,
  Cloud,
  Shield,
  Zap,
  TrendingUp,
  Globe,
  Building2,
  Settings,
  Brain,
  ArrowRight,
  Star,
  CheckCircle,
  Users,
  Award,
  Target,
  Rocket,
  BarChart3,
  Crown,
  Sparkles,
  ChevronRight,
  Play,
  Briefcase
} from "lucide-react";
import { Link } from "react-router-dom";

const enterpriseServices = [
  {
    id: 1,
    title: "Enterprise Application Development",
    arabicTitle: "تطوير التطبيقات المؤسسية",
    description: "نبني حلول تقنية متقدمة للشركات العالمية بأعلى معايير الأداء والأمان",
    icon: Code2,
    category: "Development",
    tier: "Premium",
    color: "from-blue-500 via-cyan-500 to-blue-700",
    bgColor: "bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100",
    borderColor: "border-blue-200/50",
    textColor: "text-blue-600",
    features: [
      "Microservices Architecture",
      "Cloud-Native Solutions", 
      "Real-time Analytics",
      "Advanced Security"
    ],
    stats: { projects: "250+", clients: "50+", rating: 4.9 },
    link: "/enterprise/development"
  },
  {
    id: 2,
    title: "Global Brand Identity",
    arabicTitle: "الهوية البصرية العالمية",
    description: "تصميم هويات بصرية احترافية تعكس قوة وتميز علامتك التجارية عالمياً",
    icon: Palette,
    category: "Design",
    tier: "Premium",
    color: "from-purple-500 via-pink-500 to-purple-700",
    bgColor: "bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100",
    borderColor: "border-purple-200/50",
    textColor: "text-purple-600",
    features: [
      "International Standards",
      "Multi-Cultural Design",
      "Brand Guidelines",
      "360° Brand Experience"
    ],
    stats: { projects: "180+", clients: "40+", rating: 4.8 },
    link: "/enterprise/branding"
  },
  {
    id: 3,
    title: "Digital Transformation",
    arabicTitle: "التحول الرقمي المؤسسي",
    description: "نقود رحلة التحول الرقمي لمؤسستك بحلول متطورة ومبتكرة",
    icon: Rocket,
    category: "Strategy",
    tier: "Enterprise",
    color: "from-green-500 via-emerald-500 to-green-700",
    bgColor: "bg-gradient-to-br from-green-50 via-emerald-50 to-green-100",
    borderColor: "border-green-200/50",
    textColor: "text-green-600",
    features: [
      "Digital Strategy",
      "Process Automation",
      "Change Management",
      "ROI Optimization"
    ],
    stats: { projects: "120+", clients: "30+", rating: 4.9 },
    link: "/enterprise/transformation"
  },
  {
    id: 4,
    title: "AI & Machine Learning",
    arabicTitle: "الذكاء الاصطناعي وتعلم الآلة",
    description: "حلول ذكية متقدمة تعتمد على أحدث تقنيات الذكاء الاصطناعي",
    icon: Brain,
    category: "AI/ML",
    tier: "Premium",
    color: "from-indigo-500 via-purple-500 to-indigo-700",
    bgColor: "bg-gradient-to-br from-indigo-50 via-purple-50 to-indigo-100",
    borderColor: "border-indigo-200/50",
    textColor: "text-indigo-600",
    features: [
      "Predictive Analytics",
      "Computer Vision",
      "Natural Language Processing",
      "Deep Learning Models"
    ],
    stats: { projects: "95+", clients: "25+", rating: 4.9 },
    link: "/enterprise/ai"
  },
  {
    id: 5,
    title: "Cloud Infrastructure",
    arabicTitle: "البنية التحتية السحابية",
    description: "حلول سحابية عالمية متطورة مع أعلى مستويات الأمان والموثوقية",
    icon: Cloud,
    category: "Infrastructure",
    tier: "Enterprise",
    color: "from-cyan-500 via-blue-500 to-cyan-700",
    bgColor: "bg-gradient-to-br from-cyan-50 via-blue-50 to-cyan-100",
    borderColor: "border-cyan-200/50",
    textColor: "text-cyan-600",
    features: [
      "Multi-Cloud Strategy",
      "DevOps Automation",
      "Disaster Recovery",
      "Global CDN"
    ],
    stats: { projects: "200+", clients: "45+", rating: 4.8 },
    link: "/enterprise/cloud"
  },
  {
    id: 6,
    title: "Cybersecurity Solutions",
    arabicTitle: "حلول الأمن السيبراني",
    description: "حماية شاملة ومتقدمة لأصولك الرقمية ضد التهديدات المتطورة",
    icon: Shield,
    category: "Security",
    tier: "Premium",
    color: "from-red-500 via-orange-500 to-red-700",
    bgColor: "bg-gradient-to-br from-red-50 via-orange-50 to-red-100",
    borderColor: "border-red-200/50",
    textColor: "text-red-600",
    features: [
      "Zero Trust Architecture",
      "Threat Intelligence",
      "SOC Operations",
      "Compliance Management"
    ],
    stats: { projects: "150+", clients: "35+", rating: 4.9 },
    link: "/enterprise/security"
  }
];

const EnterpriseServicesShowcase = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [visibleCards, setVisibleCards] = useState<number[]>([]);
  const [currentCategory, setCurrentCategory] = useState<string>("All");
  const sectionRef = useRef<HTMLDivElement>(null);

  const categories = ["All", "Development", "Design", "Strategy", "AI/ML", "Infrastructure", "Security"];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cardIndex = parseInt(entry.target.getAttribute('data-index') || '0');
            setVisibleCards(prev => [...prev, cardIndex]);
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    const cards = document.querySelectorAll('.service-card');
    cards.forEach(card => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  const filteredServices = currentCategory === "All" 
    ? enterpriseServices 
    : enterpriseServices.filter(service => service.category === currentCategory);

  return (
    <section ref={sectionRef} className="relative py-32 overflow-hidden">
      {/* Sophisticated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-gray-50"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/30 via-transparent to-purple-100/20"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-emerald-100/20 via-transparent to-cyan-100/30"></div>
      </div>

      {/* Animated Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-2xl animate-float"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-br from-emerald-400/10 to-cyan-400/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '4s' }}></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Premium Header */}
        <div className="text-center mb-20 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="relative">
              <Crown className="w-8 h-8 text-yellow-500 animate-pulse" />
              <div className="absolute inset-0 w-8 h-8 bg-yellow-400/20 rounded-full blur-md"></div>
            </div>
            <Badge className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white px-6 py-2 text-sm font-semibold shadow-lg">
              <Sparkles className="w-4 h-4 mr-2" />
              ENTERPRISE SOLUTIONS
            </Badge>
            <div className="relative">
              <Crown className="w-8 h-8 text-yellow-500 animate-pulse" style={{ animationDelay: '0.5s' }} />
              <div className="absolute inset-0 w-8 h-8 bg-yellow-400/20 rounded-full blur-md"></div>
            </div>
          </div>
          
          <h2 className="text-6xl lg:text-8xl font-black mb-8 bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 bg-clip-text text-transparent leading-tight tracking-tight">
            خدماتنا المتميزة
          </h2>
          
          <div className="max-w-4xl mx-auto mb-12">
            <p className="text-2xl text-slate-600 leading-relaxed font-medium mb-4">
              نقدم حلول تقنية متطورة للشركات العالمية الرائدة
            </p>
            <p className="text-lg text-slate-500 leading-relaxed">
              مع أكثر من 1000+ مشروع ناجح و 150+ عميل عالمي، نحن شريكك الاستراتيجي في التحول الرقمي
            </p>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mb-12">
            {[
              { value: "1000+", label: "مشروع عالمي", icon: Target },
              { value: "150+", label: "عميل دولي", icon: Building2 },
              { value: "4.9/5", label: "تقييم العملاء", icon: Star },
              { value: "24/7", label: "دعم مستمر", icon: Users }
            ].map((stat, index) => (
              <div key={index} className="text-center group cursor-pointer">
                <div className="flex items-center justify-center mb-2">
                  <stat.icon className="w-6 h-6 text-blue-600 group-hover:scale-110 transition-transform" />
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
                <div className="text-sm text-slate-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {categories.map((category) => (
            <Button
              key={category}
              variant={currentCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentCategory(category)}
              className={`
                relative overflow-hidden transition-all duration-300 hover:scale-105
                ${currentCategory === category 
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg" 
                  : "hover:bg-slate-50"
                }
              `}
            >
              {category === "All" ? "الكل" : category}
              {currentCategory === category && (
                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
              )}
            </Button>
          ))}
        </div>

        {/* Enterprise Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service, index) => {
            const IconComponent = service.icon;
            const isVisible = visibleCards.includes(index);
            const isHovered = hoveredCard === service.id;
            
            return (
              <div
                key={service.id}
                data-index={index}
                className={`
                  service-card group relative transition-all duration-700 ease-out
                  ${isVisible ? 'animate-fade-in opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
                `}
                style={{ animationDelay: `${index * 0.1}s` }}
                onMouseEnter={() => setHoveredCard(service.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <Card className={`
                  relative overflow-hidden h-full border-0 shadow-xl hover:shadow-2xl
                  transition-all duration-500 hover:scale-[1.02] cursor-pointer
                  ${service.bgColor} backdrop-blur-sm
                `}>
                  {/* Premium Overlay */}
                  <div className={`
                    absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 
                    group-hover:opacity-10 transition-opacity duration-500
                  `}></div>

                  {/* Tier Badge */}
                  <div className="absolute top-4 right-4 z-20">
                    <Badge className={`
                      ${service.tier === 'Enterprise' 
                        ? 'bg-gradient-to-r from-yellow-400 to-orange-500' 
                        : 'bg-gradient-to-r from-purple-500 to-pink-500'
                      } text-white shadow-lg
                    `}>
                      <Crown className="w-3 h-3 mr-1" />
                      {service.tier}
                    </Badge>
                  </div>

                  {/* Corner Decoration */}
                  <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-white/20 to-transparent rounded-br-full"></div>

                  <CardContent className="p-8 relative z-10">
                    {/* Icon and Category */}
                    <div className="flex items-start justify-between mb-6">
                      <div className={`
                        relative p-4 rounded-2xl ${service.color.replace('from-', 'bg-').split(' ')[0]}/10
                        group-hover:scale-110 transition-transform duration-300 shadow-lg
                      `}>
                        <IconComponent className={`w-8 h-8 ${service.textColor} group-hover:animate-pulse`} />
                        {/* Glow Effect */}
                        <div className={`
                          absolute inset-0 rounded-2xl bg-gradient-to-br ${service.color} opacity-0 
                          group-hover:opacity-20 transition-opacity duration-300 blur-sm
                        `}></div>
                      </div>
                      
                      <Badge variant="outline" className="text-xs opacity-70 group-hover:opacity-100 transition-opacity">
                        {service.category}
                      </Badge>
                    </div>

                    {/* Content */}
                    <div className="space-y-4 mb-6">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-700 transition-colors">
                          {service.arabicTitle}
                        </h3>
                        <h4 className="text-sm font-medium text-slate-600 mb-3">
                          {service.title}
                        </h4>
                      </div>
                      
                      <p className="text-slate-600 leading-relaxed text-sm">
                        {service.description}
                      </p>
                    </div>

                    {/* Features */}
                    <div className="space-y-2 mb-6">
                      {service.features.map((feature, featureIndex) => (
                        <div 
                          key={featureIndex}
                          className="flex items-center text-sm text-slate-600 group-hover:text-slate-700 transition-colors"
                        >
                          <CheckCircle className="w-4 h-4 text-emerald-500 mr-3 flex-shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-6 pb-4 border-b border-slate-200/50">
                      <div className="flex items-center gap-1">
                        <Award className="w-3 h-3" />
                        <span>{service.stats.projects}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span>{service.stats.clients}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span>{service.stats.rating}</span>
                      </div>
                    </div>

                    {/* Action */}
                    <Link to={service.link} className="block">
                      <Button 
                        className={`
                          w-full bg-gradient-to-r ${service.color} hover:shadow-lg 
                          text-white group-hover:scale-105 transition-all duration-300
                          shadow-md hover:shadow-xl
                        `}
                      >
                        <span className="flex items-center justify-center">
                          <Play className="w-4 h-4 mr-2" />
                          استكشف الحلول
                          <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </Button>
                    </Link>
                  </CardContent>

                  {/* Hover Effect Particles */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400/60 rounded-full animate-ping"></div>
                    <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-purple-400/60 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                    <div className="absolute bottom-1/4 left-3/4 w-1.5 h-1.5 bg-emerald-400/60 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>

        {/* Enterprise CTA */}
        <div className="text-center mt-20 animate-fade-in" style={{ animationDelay: '1s' }}>
          <div className="relative max-w-5xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-emerald-500/20 rounded-3xl blur-xl"></div>
            <div className="relative bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 rounded-3xl p-12 text-white overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='white' fill-opacity='0.3'%3E%3Cpath d='M20 20c0 0 0-8.2-8.2-8.2S3.8 12 3.8 20 12 28.2 20 20'/%3E%3C/g%3E%3C/svg%3E")`,
                }}></div>
              </div>

              <div className="relative z-10">
                <div className="flex items-center justify-center gap-4 mb-6">
                  <Briefcase className="w-8 h-8 text-yellow-400" />
                  <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-400/30">
                    شريك استراتيجي معتمد
                  </Badge>
                  <Briefcase className="w-8 h-8 text-yellow-400" />
                </div>
                
                <h3 className="text-4xl font-bold mb-4">
                  هل أنت مستعد لقيادة التحول الرقمي؟
                </h3>
                
                <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                  انضم إلى أكثر من 150 شركة عالمية وضعت ثقتها في خبرتنا. 
                  دعنا نصمم مستقبل مؤسستك الرقمي معاً
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/contact">
                    <Button size="lg" className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-slate-900 font-bold px-8 py-4 group">
                      <Rocket className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                      ابدأ مشروعك الآن
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  
                  <Link to="/consultation">
                    <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 px-8 py-4">
                      <Users className="w-5 h-5 mr-2" />
                      استشارة مجانية
                    </Button>
                  </Link>
                </div>
                
                <div className="flex justify-center items-center gap-8 mt-8 text-sm text-slate-400">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>ضمان الجودة</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>دعم 24/7</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>شراكة طويلة المدى</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EnterpriseServicesShowcase;