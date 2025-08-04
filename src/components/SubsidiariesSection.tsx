import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Building2, 
  Globe, 
  TrendingUp, 
  Users, 
  Award, 
  Rocket, 
  Zap, 
  Star, 
  ExternalLink, 
  GraduationCap, 
  Monitor, 
  ShoppingCart, 
  BarChart3, 
  MapPin, 
  Clock, 
  Trophy, 
  Target, 
  Shield, 
  Briefcase,
  Brain,
  Database,
  Code,
  Palette,
  HeartHandshake,
  BookOpen,
  Lightbulb,
  Sparkles,
  Microscope,
  FileText,
  Stethoscope,
  FlaskConical,
  Megaphone,
  Presentation,
  Camera,
  Play,
  Hash,
  Calculator,
  Receipt,
  DollarSign,
  CreditCard,
  PieChart,
  Package,
  ShoppingBag,
  Server,
  Laptop,
  Store,
  Calendar,
  Settings,
  Wallet,
  Wrench,
  Layers,
  Network,
  Cog,
  MessageSquare,
  Bot,
  Phone,
  Send
} from "lucide-react";

const SubsidiariesSection = () => {
  const subsidiaries = [
    {
      name: "علي صالح الشهري القابضة",
      nameEn: "Ali Saleh AlShahri Holdings", 
      description: "بورتال شركة علي صالح الشهري القابضة - مجموعة متنوعة من الاستثمارات والمشاريع الرائدة",
      category: "الشركة القابضة",
      established: "2016",
      icon: Building2,
      color: "from-amber-600 to-orange-600",
      website: "https://ash.holdings",
      isPortal: true
    },
    {
      name: "Feklah Holding",
      nameEn: "", 
      description: "شركة متخصصة في تقديم الخدمات التعليمية المبتكرة والحلول التقنية للتعليم",
      category: "الخدمات التعليمية",
      established: "2018",
      icon: GraduationCap,
      color: "from-blue-600 to-indigo-600",
      website: "https://fekrah-holding.com",
      isEducation: true
    },
    {
      name: "فكرة أكاديمي",
      nameEn: "Fekrah Academy", 
      description: "أكاديمية متخصصة في الطب والنشر والأبحاث العلمية مع برامج تدريبية متقدمة",
      category: "التعليم الأكاديمي والأبحاث",
      established: "2025",
      icon: Brain,
      color: "from-emerald-600 to-teal-600",
      website: "https://fekrah-academy.com",
      isAcademic: true
    },
    {
      name: "Advixo Media",
      nameEn: "", 
      description: "وكالة إبداعية متخصصة في التسويق الرقمي والإعلان مع حلول مبتكرة للعلامات التجارية",
      category: "التسويق والإعلان",
      established: "2025",
      icon: Megaphone,
      color: "from-pink-600 to-rose-600",
      website: "http://advixo.media/",
      isMarketing: true,
      inDevelopment: true,
      launchDate: "30-08-2025"
    },
    {
      name: "نيوماكسيو",
      nameEn: "Numaxio", 
      description: "نظام حسابي متكامل لإدارة الحسابات والفواتير والموارد البشرية ونقاط البيع للشركات",
      category: "الأنظمة المحاسبية",
      established: "2025",
      icon: Calculator,
      color: "from-purple-600 to-violet-600",
      website: "http://numaxio.com",
      isAccounting: true,
      inDevelopment: true,
      launchDate: "30-12-2025"
    },
    {
      name: "Plutecode",
      nameEn: "", 
      description: "منصة متخصصة في بيع وتأجير المتاجر الإلكترونية والمواقع والأنظمة الجاهزة للشركات",
      category: "المتاجر والأنظمة الجاهزة",
      established: "2025",
      icon: Package,
      color: "from-cyan-600 to-blue-600",
      website: "https://plutecode.com",
      isEcommerce: true,
      inDevelopment: true,
      launchDate: "20-10-2025"
    },
    {
      name: "Vexomart",
      nameEn: "", 
      description: "منصة متكاملة لتأجير المتاجر الإلكترونية مع قوالب احترافية وجميع طرق الدفع",
      category: "تأجير المتاجر الإلكترونية",
      established: "2025",
      icon: Store,
      color: "from-green-600 to-emerald-600",
      website: "https://vexomart.com",
      isRental: true,
      inDevelopment: true,
      launchDate: "01-10-2025"
    },
    {
      name: "Khadmat Work",
      nameEn: "", 
      description: "منصة متخصصة في الخدمات المصغرة والحلول التقنية المتقدمة للشركات والأفراد",
      category: "الخدمات المصغرة",
      established: "2025",
      icon: Layers,
      color: "from-orange-600 to-amber-600",
      website: "https://khadmat-work.com",
      isMicroservices: true,
      inDevelopment: true,
      launchDate: "01-01-2026"
    },
    {
      name: "ليجو شات",
      nameEn: "Lego Chat", 
      description: "منصة متطورة لواتساب بوت مع ردود تفاعلية ذكية وحلول آلية متقدمة للأعمال",
      category: "واتساب بوت والردود التفاعلية",
      established: "2025",
      icon: MessageSquare,
      color: "from-emerald-600 to-green-600",
      website: "https://legochat.com",
      isChatBot: true,
      inDevelopment: true,
      launchDate: "10-12-2025"
    }
  ];  // سيتم إضافة المزيد من الشركات

  const renderPortalCard = (company) => {
    const IconComponent = company.icon;
    
    return (
      <div className="relative h-[600px] col-span-full lg:col-span-2 xl:col-span-3">
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl border border-amber-500/20 hover:border-amber-400/40 transition-all duration-700 group h-full">
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23f59e0b%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30 group-hover:opacity-50 transition-opacity duration-700"></div>
          
          {/* Glowing Border Animation */}
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-all duration-700 group-hover:blur-2xl"></div>
          
          <CardContent className="relative z-10 p-8 h-full flex flex-col justify-between">
            {/* Header Section */}
            <div className="text-center mb-6">
              <div className="relative inline-flex items-center justify-center w-24 h-24 mb-4">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-600 rounded-full animate-pulse"></div>
                <div className="relative w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl">
                  <IconComponent className="w-12 h-12 text-amber-600" />
                </div>
                {/* Floating Particles */}
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-amber-400 rounded-full animate-bounce delay-100"></div>
                <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-orange-500 rounded-full animate-bounce delay-300"></div>
              </div>
            </div>

            {/* Company Info */}
            <div className="text-center mb-6 flex-grow">
              <h2 className="text-3xl font-bold text-white mb-2 group-hover:text-amber-100 transition-colors duration-300">
                {company.name}
              </h2>
              {company.nameEn && (
                <h3 className="text-xl font-medium text-amber-400 mb-4">
                  {company.nameEn}
                </h3>
              )}
              
              <div className="flex items-center justify-center gap-3 mb-4">
                <Badge className="bg-amber-500/20 text-amber-300 border-amber-400/30 px-3 py-1 text-sm">
                  {company.category}
                </Badge>
                <Badge className="bg-white/10 text-white border-white/20 px-3 py-1 text-sm">
                  تأسست {company.established}
                </Badge>
              </div>
              
              <p className="text-slate-300 text-base leading-relaxed max-w-lg mx-auto">
                {company.description}
              </p>
            </div>

            {/* Portal Features */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl mx-auto mb-2 flex items-center justify-center">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <p className="text-white text-xs font-medium">الشركات التابعة</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl mx-auto mb-2 flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <p className="text-white text-xs font-medium">التقارير المالية</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl mx-auto mb-2 flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <p className="text-white text-xs font-medium">فريق الإدارة</p>
              </div>
            </div>

            {/* CTA Button */}
            <div className="text-center">
              <Button asChild className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-6 py-3 text-base font-semibold rounded-2xl border-0 shadow-2xl hover:shadow-amber-500/30 transition-all duration-300 group/btn">
                <a href={company.website} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 ml-2 group-hover/btn:rotate-45 transition-transform duration-300" />
                  دخول البورتال الرئيسي
                </a>
              </Button>
            </div>
          </CardContent>
        </div>
      </div>
    );
  };

  const renderEducationCard = (company) => {
    const IconComponent = company.icon;
    
    return (
      <div className="relative h-[600px]">
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 rounded-3xl border-2 border-blue-200/60 hover:border-blue-400/80 transition-all duration-700 group h-full">
          {/* Educational Pattern Background */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%220%200%2040%2040%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22%234f46e5%22%20fill-opacity%3D%220.08%22%3E%3Cpath%20d%3D%22M20%2010l10%2010-10%2010-10-10z%22/%3E%3C/g%3E%3C/svg%3E')] opacity-40 group-hover:opacity-60 transition-opacity duration-700"></div>
          
          {/* Interactive Floating Elements */}
          <div className="absolute top-4 right-4 w-8 h-8 bg-blue-400/20 rounded-full animate-bounce delay-75 group-hover:bg-blue-500/30 transition-colors duration-300">
            <Brain className="w-4 h-4 text-blue-600 m-2" />
          </div>
          <div className="absolute top-8 left-6 w-6 h-6 bg-indigo-400/20 rounded-full animate-bounce delay-150 group-hover:bg-indigo-500/30 transition-colors duration-300">
            <Sparkles className="w-3 h-3 text-indigo-600 m-1.5" />
          </div>
          <div className="absolute bottom-6 right-8 w-4 h-4 bg-blue-500/20 rounded-full animate-bounce delay-300 group-hover:bg-blue-600/30 transition-colors duration-300">
            <Target className="w-2 h-2 text-blue-700 m-1" />
          </div>
          <div className="absolute bottom-8 left-4 w-5 h-5 bg-purple-400/20 rounded-full animate-bounce delay-500 group-hover:bg-purple-500/30 transition-colors duration-300">
            <Rocket className="w-2.5 h-2.5 text-purple-600 m-1.25" />
          </div>
          
          <CardContent className="relative z-10 p-10">
            {/* Header Section */}
            <div className="text-center mb-8">
              <div className="relative inline-flex items-center justify-center w-24 h-24 mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl rotate-6 group-hover:rotate-12 transition-transform duration-500"></div>
                <div className="relative w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-xl">
                  <IconComponent className="w-10 h-10 text-blue-600 group-hover:scale-110 transition-transform duration-300" />
                </div>
                {/* Interactive Academic Symbols */}
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-xs group-hover:animate-spin">📚</div>
                <div className="absolute -bottom-1 -left-1 w-5 h-5 bg-green-400 rounded-full flex items-center justify-center text-xs group-hover:animate-pulse">🎓</div>
              </div>
              
              <Badge className="bg-blue-500/20 text-blue-700 border-blue-300/50 px-4 py-2 mb-4 group-hover:bg-blue-600/30 transition-colors duration-300">
                {company.category}
              </Badge>
            </div>

            {/* Company Info */}
            <div className="space-y-4 mb-8 text-center">
              <h3 className="text-2xl font-bold text-slate-800 group-hover:text-blue-800 transition-colors duration-300">
                {company.name}
              </h3>
              {company.nameEn && (
                <p className="text-xl font-medium text-blue-600">
                  {company.nameEn}
                </p>
              )}
              <p className="text-slate-600 leading-relaxed">
                {company.description}
              </p>
            </div>

            {/* Interactive Educational Features */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="text-center p-4 bg-white/60 rounded-2xl group-hover:bg-white/80 transition-all duration-300 hover:scale-105">
                <div className="relative">
                  <BookOpen className="w-8 h-8 text-blue-500 mx-auto mb-2 group-hover:animate-pulse" />
                  <div className="absolute -top-1 -right-2 w-3 h-3 bg-blue-400 rounded-full animate-ping"></div>
                </div>
                <p className="text-sm font-medium text-slate-700">مناهج تفاعلية</p>
              </div>
              <div className="text-center p-4 bg-white/60 rounded-2xl group-hover:bg-white/80 transition-all duration-300 hover:scale-105">
                <div className="relative">
                  <Lightbulb className="w-8 h-8 text-indigo-500 mx-auto mb-2 group-hover:animate-bounce" />
                  <div className="absolute -top-1 -right-2 w-3 h-3 bg-yellow-400 rounded-full animate-ping delay-200"></div>
                </div>
                <p className="text-sm font-medium text-slate-700">تقنيات حديثة</p>
              </div>
            </div>

            {/* Established Badge */}
            <div className="text-center mb-6">
              <Badge variant="outline" className="bg-white/80 text-slate-600 border-slate-300 px-3 py-1">
                تأسست {company.established}
              </Badge>
            </div>
            
            {/* CTA Button */}
            <Button asChild className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 py-3 rounded-2xl shadow-lg hover:shadow-blue-500/30 transition-all duration-300 group/btn">
              <a href={company.website} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 ml-2 group-hover/btn:rotate-45 transition-transform duration-300" />
                اكتشف الحلول التعليمية
              </a>
            </Button>
          </CardContent>
        </div>
      </div>
    );
  };

  const renderAcademicCard = (company) => {
    const IconComponent = company.icon;
    
    return (
      <div className="relative h-[600px]">
        <div className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 rounded-3xl border-2 border-emerald-200/60 hover:border-emerald-400/80 transition-all duration-700 group h-full">
          {/* Medical/Research Pattern Background */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20width%3D%2250%22%20height%3D%2250%22%20viewBox%3D%220%200%2050%2050%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22%2310b981%22%20fill-opacity%3D%220.06%22%3E%3Cpath%20d%3D%22M25%2015l8%208-8%208-8-8z%22/%3E%3Ccircle%20cx%3D%2225%22%20cy%3D%2225%22%20r%3D%223%22/%3E%3C/g%3E%3C/svg%3E')] opacity-50 group-hover:opacity-70 transition-opacity duration-700"></div>
          
          {/* Interactive Medical/Research Elements */}
          <div className="absolute top-4 right-4 w-8 h-8 bg-emerald-400/20 rounded-full animate-bounce delay-75 group-hover:bg-emerald-500/30 transition-colors duration-300">
            <Stethoscope className="w-4 h-4 text-emerald-600 m-2" />
          </div>
          <div className="absolute top-8 left-6 w-6 h-6 bg-teal-400/20 rounded-full animate-bounce delay-150 group-hover:bg-teal-500/30 transition-colors duration-300">
            <Microscope className="w-3 h-3 text-teal-600 m-1.5" />
          </div>
          <div className="absolute bottom-6 right-8 w-4 h-4 bg-green-500/20 rounded-full animate-bounce delay-300 group-hover:bg-green-600/30 transition-colors duration-300">
            <FlaskConical className="w-2 h-2 text-green-700 m-1" />
          </div>
          <div className="absolute bottom-8 left-4 w-5 h-5 bg-emerald-400/20 rounded-full animate-bounce delay-500 group-hover:bg-emerald-500/30 transition-colors duration-300">
            <FileText className="w-2.5 h-2.5 text-emerald-600 m-1.25" />
          </div>
          
          <CardContent className="relative z-10 p-8 h-full flex flex-col justify-between">
            {/* Header Section */}
            <div className="text-center mb-6">
              <div className="relative inline-flex items-center justify-center w-20 h-20 mb-4">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl rotate-6 group-hover:rotate-12 transition-transform duration-500"></div>
                <div className="relative w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-xl">
                  <IconComponent className="w-8 h-8 text-emerald-600 group-hover:scale-110 transition-transform duration-300" />
                </div>
                {/* Interactive Academic Symbols */}
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-400 rounded-full flex items-center justify-center text-xs group-hover:animate-spin">🩺</div>
                <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-blue-400 rounded-full flex items-center justify-center text-xs group-hover:animate-pulse">🔬</div>
              </div>
              
              <Badge className="bg-emerald-500/20 text-emerald-700 border-emerald-300/50 px-3 py-1 text-sm group-hover:bg-emerald-600/30 transition-colors duration-300">
                {company.category}
              </Badge>
            </div>

            {/* Company Info */}
            <div className="text-center mb-6 flex-grow">
              <h3 className="text-2xl font-bold text-slate-800 group-hover:text-emerald-800 transition-colors duration-300 mb-2">
                {company.name}
              </h3>
              {company.nameEn && (
                <p className="text-lg font-medium text-emerald-600 mb-3">
                  {company.nameEn}
                </p>
              )}
              <p className="text-slate-600 leading-relaxed text-sm">
                {company.description}
              </p>
            </div>

            {/* Interactive Academic Features */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="text-center p-3 bg-white/60 rounded-xl group-hover:bg-white/80 transition-all duration-300 hover:scale-105">
                <div className="relative">
                  <Stethoscope className="w-6 h-6 text-emerald-500 mx-auto mb-1 group-hover:animate-pulse" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-400 rounded-full animate-ping"></div>
                </div>
                <p className="text-xs font-medium text-slate-700">الطب</p>
              </div>
              <div className="text-center p-3 bg-white/60 rounded-xl group-hover:bg-white/80 transition-all duration-300 hover:scale-105">
                <div className="relative">
                  <FileText className="w-6 h-6 text-teal-500 mx-auto mb-1 group-hover:animate-bounce" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-400 rounded-full animate-ping delay-100"></div>
                </div>
                <p className="text-xs font-medium text-slate-700">النشر</p>
              </div>
              <div className="text-center p-3 bg-white/60 rounded-xl group-hover:bg-white/80 transition-all duration-300 hover:scale-105">
                <div className="relative">
                  <Microscope className="w-6 h-6 text-green-500 mx-auto mb-1 group-hover:animate-pulse" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-ping delay-200"></div>
                </div>
                <p className="text-xs font-medium text-slate-700">الأبحاث</p>
              </div>
            </div>

            {/* Established Badge */}
            <div className="text-center mb-4">
              <Badge variant="outline" className="bg-white/80 text-slate-600 border-slate-300 px-3 py-1 text-sm">
                تأسست {company.established}
              </Badge>
            </div>
            
            {/* CTA Button */}
            <div className="text-center">
              <Button asChild className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white border-0 py-3 rounded-2xl shadow-lg hover:shadow-emerald-500/30 transition-all duration-300 group/btn">
                <a href={company.website} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 ml-2 group-hover/btn:rotate-45 transition-transform duration-300" />
                  استكشف البرامج الأكاديمية
                </a>
              </Button>
            </div>
          </CardContent>
        </div>
      </div>
    );
  };

  const renderMarketingCard = (company) => {
    const IconComponent = company.icon;
    
    return (
      <div className="relative h-[600px]">
        <div className="relative overflow-hidden bg-gradient-to-br from-pink-50 via-rose-50 to-red-50 rounded-3xl border-2 border-pink-200/60 hover:border-pink-400/80 transition-all duration-700 group h-full">
          {/* Development Banner with Launch Date */}
          {company.inDevelopment && (
            <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-r from-orange-500 to-red-500 text-white text-center py-2 text-sm font-bold animate-pulse">
              <div className="flex items-center justify-center gap-2">
                <span>🚧</span>
                <span>قيد التطوير - الإطلاق المتوقع {company.launchDate}</span>
                <span>🚧</span>
              </div>
            </div>
          )}
          
          {/* Marketing Pattern Background */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20width%3D%2245%22%20height%3D%2245%22%20viewBox%3D%220%200%2045%2045%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22%23ec4899%22%20fill-opacity%3D%220.08%22%3E%3Cpath%20d%3D%22M22.5%2010l7%207-7%207-7-7z%22/%3E%3Ccircle%20cx%3D%2222.5%22%20cy%3D%2222.5%22%20r%3D%222%22/%3E%3C/g%3E%3C/svg%3E')] opacity-40 group-hover:opacity-60 transition-opacity duration-700"></div>
          
          {/* Interactive Marketing Elements */}
          <div className="absolute top-12 right-4 w-8 h-8 bg-pink-400/20 rounded-full animate-bounce delay-75 group-hover:bg-pink-500/30 transition-colors duration-300">
            <Megaphone className="w-4 h-4 text-pink-600 m-2" />
          </div>
          <div className="absolute top-16 left-6 w-6 h-6 bg-rose-400/20 rounded-full animate-bounce delay-150 group-hover:bg-rose-500/30 transition-colors duration-300">
            <Camera className="w-3 h-3 text-rose-600 m-1.5" />
          </div>
          <div className="absolute bottom-6 right-8 w-4 h-4 bg-red-500/20 rounded-full animate-bounce delay-300 group-hover:bg-red-600/30 transition-colors duration-300">
            <Play className="w-2 h-2 text-red-700 m-1" />
          </div>
          <div className="absolute bottom-8 left-4 w-5 h-5 bg-pink-400/20 rounded-full animate-bounce delay-500 group-hover:bg-pink-500/30 transition-colors duration-300">
            <Hash className="w-2.5 h-2.5 text-pink-600 m-1.25" />
          </div>
          
          <CardContent className={`relative z-10 p-8 h-full flex flex-col justify-between ${company.inDevelopment ? 'pt-12' : 'pt-8'}`}>
            {/* Header Section */}
            <div className="text-center mb-6">
              <div className="relative inline-flex items-center justify-center w-20 h-20 mb-4">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl rotate-6 group-hover:rotate-12 transition-transform duration-500"></div>
                <div className="relative w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-xl">
                  <IconComponent className="w-8 h-8 text-pink-600 group-hover:scale-110 transition-transform duration-300" />
                </div>
                {/* Interactive Marketing Symbols */}
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-400 rounded-full flex items-center justify-center text-xs group-hover:animate-spin">📱</div>
                <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-green-400 rounded-full flex items-center justify-center text-xs group-hover:animate-pulse">📈</div>
              </div>
              
              <Badge className="bg-pink-500/20 text-pink-700 border-pink-300/50 px-3 py-1 text-sm group-hover:bg-pink-600/30 transition-colors duration-300">
                {company.category}
              </Badge>
            </div>

            {/* Company Info */}
            <div className="text-center mb-6 flex-grow">
              <h3 className="text-2xl font-bold text-slate-800 group-hover:text-pink-800 transition-colors duration-300 mb-2">
                {company.name}
              </h3>
              {company.nameEn && (
                <p className="text-lg font-medium text-pink-600 mb-3">
                  {company.nameEn}
                </p>
              )}
              <p className="text-slate-600 leading-relaxed text-sm">
                {company.description}
              </p>
            </div>

            {/* Interactive Marketing Features */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="text-center p-3 bg-white/60 rounded-xl group-hover:bg-white/80 transition-all duration-300 hover:scale-105">
                <div className="relative">
                  <Megaphone className="w-6 h-6 text-pink-500 mx-auto mb-1 group-hover:animate-pulse" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-pink-400 rounded-full animate-ping"></div>
                </div>
                <p className="text-xs font-medium text-slate-700">التسويق</p>
              </div>
              <div className="text-center p-3 bg-white/60 rounded-xl group-hover:bg-white/80 transition-all duration-300 hover:scale-105">
                <div className="relative">
                  <Camera className="w-6 h-6 text-rose-500 mx-auto mb-1 group-hover:animate-bounce" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-rose-400 rounded-full animate-ping delay-100"></div>
                </div>
                <p className="text-xs font-medium text-slate-700">الإعلان</p>
              </div>
              <div className="text-center p-3 bg-white/60 rounded-xl group-hover:bg-white/80 transition-all duration-300 hover:scale-105">
                <div className="relative">
                  <Presentation className="w-6 h-6 text-red-500 mx-auto mb-1 group-hover:animate-pulse" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-400 rounded-full animate-ping delay-200"></div>
                </div>
                <p className="text-xs font-medium text-slate-700">الحملات</p>
              </div>
            </div>

            {/* Established Badge */}
            <div className="text-center mb-4">
              <Badge variant="outline" className="bg-white/80 text-slate-600 border-slate-300 px-3 py-1 text-sm">
                تأسست {company.established}
              </Badge>
            </div>
            
            {/* CTA Button */}
            <div className="text-center">
              <Button className={`w-full bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white border-0 py-3 rounded-2xl shadow-lg hover:shadow-pink-500/30 transition-all duration-300 group/btn ${company.inDevelopment ? 'opacity-75 cursor-not-allowed' : ''}`} disabled={company.inDevelopment}>
                <ExternalLink className="w-4 h-4 ml-2 group-hover/btn:rotate-45 transition-transform duration-300" />
                {company.inDevelopment ? `قريباً - ${company.launchDate}` : 'استكشف خدماتنا التسويقية'}
              </Button>
            </div>
          </CardContent>
        </div>
      </div>
    );
  };

  const renderAccountingCard = (company) => {
    const IconComponent = company.icon;
    
    return (
      <div className="relative h-[600px]">
        <div className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-50 rounded-3xl border-2 border-purple-200/60 hover:border-purple-400/80 transition-all duration-700 group h-full">
          {/* Development Banner with Launch Date */}
          {company.inDevelopment && (
            <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-r from-purple-500 via-violet-500 to-purple-500 text-white text-center py-2 text-sm font-bold">
              <div className="flex items-center justify-center gap-2 animate-pulse">
                <span>🔧</span>
                <span>قيد التطوير - الإطلاق المتوقع {company.launchDate}</span>
                <span>🔧</span>
              </div>
            </div>
          )}
          
          {/* Accounting Pattern Background */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20width%3D%2248%22%20height%3D%2248%22%20viewBox%3D%220%200%2048%2048%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22%238b5cf6%22%20fill-opacity%3D%220.07%22%3E%3Cpath%20d%3D%22M24%2012l6%206-6%206-6-6z%22/%3E%3Ccircle%20cx%3D%2224%22%20cy%3D%2224%22%20r%3D%222%22/%3E%3Crect%20x%3D%2220%22%20y%3D%228%22%20width%3D%228%22%20height%3D%222%22/%3E%3C/g%3E%3C/svg%3E')] opacity-40 group-hover:opacity-60 transition-opacity duration-700"></div>
          
          {/* Interactive Accounting Elements */}
          <div className="absolute top-12 right-4 w-8 h-8 bg-purple-400/20 rounded-full animate-bounce delay-75 group-hover:bg-purple-500/30 transition-colors duration-300">
            <Calculator className="w-4 h-4 text-purple-600 m-2" />
          </div>
          <div className="absolute top-16 left-6 w-6 h-6 bg-violet-400/20 rounded-full animate-bounce delay-150 group-hover:bg-violet-500/30 transition-colors duration-300">
            <Receipt className="w-3 h-3 text-violet-600 m-1.5" />
          </div>
          <div className="absolute bottom-6 right-8 w-4 h-4 bg-indigo-500/20 rounded-full animate-bounce delay-300 group-hover:bg-indigo-600/30 transition-colors duration-300">
            <DollarSign className="w-2 h-2 text-indigo-700 m-1" />
          </div>
          <div className="absolute bottom-8 left-4 w-5 h-5 bg-purple-400/20 rounded-full animate-bounce delay-500 group-hover:bg-purple-500/30 transition-colors duration-300">
            <PieChart className="w-2.5 h-2.5 text-purple-600 m-1.25" />
          </div>
          
          <CardContent className={`relative z-10 p-8 h-full flex flex-col justify-between ${company.inDevelopment ? 'pt-12' : 'pt-8'}`}>
            {/* Header Section */}
            <div className="text-center mb-6">
              <div className="relative inline-flex items-center justify-center w-20 h-20 mb-4">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl rotate-6 group-hover:rotate-12 transition-transform duration-500"></div>
                <div className="relative w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-xl">
                  <IconComponent className="w-8 h-8 text-purple-600 group-hover:scale-110 transition-transform duration-300" />
                </div>
                {/* Interactive Accounting Symbols */}
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-400 rounded-full flex items-center justify-center text-xs group-hover:animate-spin">💰</div>
                <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-blue-400 rounded-full flex items-center justify-center text-xs group-hover:animate-pulse">📊</div>
              </div>
              
              <Badge className="bg-purple-500/20 text-purple-700 border-purple-300/50 px-3 py-1 text-sm group-hover:bg-purple-600/30 transition-colors duration-300">
                {company.category}
              </Badge>
            </div>

            {/* Company Info */}
            <div className="text-center mb-6 flex-grow">
              <h3 className="text-2xl font-bold text-slate-800 group-hover:text-purple-800 transition-colors duration-300 mb-2">
                {company.name}
              </h3>
              {company.nameEn && (
                <p className="text-lg font-medium text-purple-600 mb-3">
                  {company.nameEn}
                </p>
              )}
              <p className="text-slate-600 leading-relaxed text-sm">
                {company.description}
              </p>
            </div>

            {/* Interactive Accounting Features */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="text-center p-3 bg-white/60 rounded-xl group-hover:bg-white/80 transition-all duration-300 hover:scale-105">
                <div className="relative">
                  <Calculator className="w-6 h-6 text-purple-500 mx-auto mb-1 group-hover:animate-pulse" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-purple-400 rounded-full animate-ping"></div>
                </div>
                <p className="text-xs font-medium text-slate-700">الحسابات</p>
              </div>
              <div className="text-center p-3 bg-white/60 rounded-xl group-hover:bg-white/80 transition-all duration-300 hover:scale-105">
                <div className="relative">
                  <Receipt className="w-6 h-6 text-violet-500 mx-auto mb-1 group-hover:animate-bounce" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-violet-400 rounded-full animate-ping delay-100"></div>
                </div>
                <p className="text-xs font-medium text-slate-700">الفواتير</p>
              </div>
              <div className="text-center p-3 bg-white/60 rounded-xl group-hover:bg-white/80 transition-all duration-300 hover:scale-105">
                <div className="relative">
                  <Users className="w-6 h-6 text-indigo-500 mx-auto mb-1 group-hover:animate-pulse" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-indigo-400 rounded-full animate-ping delay-200"></div>
                </div>
                <p className="text-xs font-medium text-slate-700">الموارد البشرية</p>
              </div>
              <div className="text-center p-3 bg-white/60 rounded-xl group-hover:bg-white/80 transition-all duration-300 hover:scale-105">
                <div className="relative">
                  <CreditCard className="w-6 h-6 text-purple-500 mx-auto mb-1 group-hover:animate-bounce" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-purple-400 rounded-full animate-ping delay-300"></div>
                </div>
                <p className="text-xs font-medium text-slate-700">نقاط البيع</p>
              </div>
            </div>

            {/* Established Badge */}
            <div className="text-center mb-4">
              <Badge variant="outline" className="bg-white/80 text-slate-600 border-slate-300 px-3 py-1 text-sm">
                تأسست {company.established}
              </Badge>
            </div>
            
            {/* CTA Button */}
            <div className="text-center">
              <Button className={`w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white border-0 py-3 rounded-2xl shadow-lg hover:shadow-purple-500/30 transition-all duration-300 group/btn ${company.inDevelopment ? 'opacity-75 cursor-not-allowed' : ''}`} disabled={company.inDevelopment}>
                <ExternalLink className="w-4 h-4 ml-2 group-hover/btn:rotate-45 transition-transform duration-300" />
                {company.inDevelopment ? `قريباً - ${company.launchDate}` : 'استكشف النظام المحاسبي'}
              </Button>
            </div>
          </CardContent>
        </div>
      </div>
    );
  };

  const renderEcommerceCard = (company) => {
    const IconComponent = company.icon;
    
    return (
      <div className="relative h-[600px]">
        <div className="relative overflow-hidden bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 rounded-3xl border-2 border-cyan-200/60 hover:border-cyan-400/80 transition-all duration-700 group h-full">
          {/* Development Banner with Launch Date */}
          {company.inDevelopment && (
            <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500 text-white text-center py-2 text-sm font-bold">
              <div className="flex items-center justify-center gap-2 animate-pulse">
                <span>⚡</span>
                <span>قيد التطوير - الإطلاق المتوقع {company.launchDate}</span>
                <span>⚡</span>
              </div>
            </div>
          )}
          
          {/* E-commerce Pattern Background */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20width%3D%2242%22%20height%3D%2242%22%20viewBox%3D%220%200%2042%2042%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22%230891b2%22%20fill-opacity%3D%220.08%22%3E%3Cpath%20d%3D%22M21%208l6%206-6%206-6-6z%22/%3E%3Ccircle%20cx%3D%2221%22%20cy%3D%2221%22%20r%3D%223%22/%3E%3Crect%20x%3D%2217%22%20y%3D%2217%22%20width%3D%228%22%20height%3D%222%22/%3E%3C/g%3E%3C/svg%3E')] opacity-40 group-hover:opacity-60 transition-opacity duration-700"></div>
          
          {/* Interactive E-commerce Elements */}
          <div className="absolute top-4 right-4 w-8 h-8 bg-cyan-400/20 rounded-full animate-bounce delay-75 group-hover:bg-cyan-500/30 transition-colors duration-300">
            <Package className="w-4 h-4 text-cyan-600 m-2" />
          </div>
          <div className="absolute top-8 left-6 w-6 h-6 bg-blue-400/20 rounded-full animate-bounce delay-150 group-hover:bg-blue-500/30 transition-colors duration-300">
            <ShoppingBag className="w-3 h-3 text-blue-600 m-1.5" />
          </div>
          <div className="absolute bottom-6 right-8 w-4 h-4 bg-indigo-500/20 rounded-full animate-bounce delay-300 group-hover:bg-indigo-600/30 transition-colors duration-300">
            <Server className="w-2 h-2 text-indigo-700 m-1" />
          </div>
          <div className="absolute bottom-8 left-4 w-5 h-5 bg-cyan-400/20 rounded-full animate-bounce delay-500 group-hover:bg-cyan-500/30 transition-colors duration-300">
            <Laptop className="w-2.5 h-2.5 text-cyan-600 m-1.25" />
          </div>
          
          <CardContent className={`relative z-10 p-8 h-full flex flex-col justify-between ${company.inDevelopment ? 'pt-12' : 'pt-8'}`}>
            {/* Header Section */}
            <div className="text-center mb-6">
              <div className="relative inline-flex items-center justify-center w-20 h-20 mb-4">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl rotate-6 group-hover:rotate-12 transition-transform duration-500"></div>
                <div className="relative w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-xl">
                  <IconComponent className="w-8 h-8 text-cyan-600 group-hover:scale-110 transition-transform duration-300" />
                </div>
                {/* Interactive E-commerce Symbols */}
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-orange-400 rounded-full flex items-center justify-center text-xs group-hover:animate-spin">🛒</div>
                <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-green-400 rounded-full flex items-center justify-center text-xs group-hover:animate-pulse">💻</div>
              </div>
              
              <Badge className="bg-cyan-500/20 text-cyan-700 border-cyan-300/50 px-3 py-1 text-sm group-hover:bg-cyan-600/30 transition-colors duration-300">
                {company.category}
              </Badge>
            </div>

            {/* Company Info */}
            <div className="text-center mb-6 flex-grow">
              <h3 className="text-2xl font-bold text-slate-800 group-hover:text-cyan-800 transition-colors duration-300 mb-2">
                {company.name}
              </h3>
              {company.nameEn && (
                <p className="text-lg font-medium text-cyan-600 mb-3">
                  {company.nameEn}
                </p>
              )}
              <p className="text-slate-600 leading-relaxed text-sm">
                {company.description}
              </p>
            </div>

            {/* Interactive E-commerce Features */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="text-center p-3 bg-white/60 rounded-xl group-hover:bg-white/80 transition-all duration-300 hover:scale-105">
                <div className="relative">
                  <ShoppingBag className="w-6 h-6 text-cyan-500 mx-auto mb-1 group-hover:animate-pulse" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-cyan-400 rounded-full animate-ping"></div>
                </div>
                <p className="text-xs font-medium text-slate-700">بيع المتاجر</p>
              </div>
              <div className="text-center p-3 bg-white/60 rounded-xl group-hover:bg-white/80 transition-all duration-300 hover:scale-105">
                <div className="relative">
                  <Clock className="w-6 h-6 text-blue-500 mx-auto mb-1 group-hover:animate-bounce" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-400 rounded-full animate-ping delay-100"></div>
                </div>
                <p className="text-xs font-medium text-slate-700">تأجير المواقع</p>
              </div>
              <div className="text-center p-3 bg-white/60 rounded-xl group-hover:bg-white/80 transition-all duration-300 hover:scale-105">
                <div className="relative">
                  <Server className="w-6 h-6 text-indigo-500 mx-auto mb-1 group-hover:animate-pulse" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-indigo-400 rounded-full animate-ping delay-200"></div>
                </div>
                <p className="text-xs font-medium text-slate-700">أنظمة جاهزة</p>
              </div>
              <div className="text-center p-3 bg-white/60 rounded-xl group-hover:bg-white/80 transition-all duration-300 hover:scale-105">
                <div className="relative">
                  <Package className="w-6 h-6 text-cyan-500 mx-auto mb-1 group-hover:animate-bounce" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-cyan-400 rounded-full animate-ping delay-300"></div>
                </div>
                <p className="text-xs font-medium text-slate-700">حلول متكاملة</p>
              </div>
            </div>

            {/* Established Badge */}
            <div className="text-center mb-4">
              <Badge variant="outline" className="bg-white/80 text-slate-600 border-slate-300 px-3 py-1 text-sm">
                تأسست {company.established}
              </Badge>
            </div>
            
            {/* CTA Button */}
            <div className="text-center">
              <Button className={`w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white border-0 py-3 rounded-2xl shadow-lg hover:shadow-cyan-500/30 transition-all duration-300 group/btn ${company.inDevelopment ? 'opacity-75 cursor-not-allowed' : ''}`} disabled={company.inDevelopment}>
                <ExternalLink className="w-4 h-4 ml-2 group-hover/btn:rotate-45 transition-transform duration-300" />
                {company.inDevelopment ? `قريباً - ${company.launchDate}` : 'استكشف المتاجر والأنظمة'}
              </Button>
            </div>
          </CardContent>
        </div>
      </div>
    );
  };

  const renderRentalCard = (company) => {
    const IconComponent = company.icon;
    
    return (
      <div className="relative h-[600px]">
        <div className="relative overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-3xl border-2 border-green-200/60 hover:border-green-400/80 transition-all duration-700 group h-full">
          {/* Development Banner with Launch Date */}
          {company.inDevelopment && (
            <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-r from-green-500 via-emerald-500 to-green-500 text-white text-center py-2 text-sm font-bold">
              <div className="flex items-center justify-center gap-2 animate-pulse">
                <span>🚀</span>
                <span>قيد التطوير - الإطلاق المتوقع {company.launchDate}</span>
                <span>🚀</span>
              </div>
            </div>
          )}
          
          {/* Rental Pattern Background */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20width%3D%2244%22%20height%3D%2244%22%20viewBox%3D%220%200%2044%2044%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22%2316a34a%22%20fill-opacity%3D%220.08%22%3E%3Cpath%20d%3D%22M22%209l7%207-7%207-7-7z%22/%3E%3Ccircle%20cx%3D%2222%22%20cy%3D%2222%22%20r%3D%222%22/%3E%3Crect%20x%3D%2218%22%20y%3D%2218%22%20width%3D%228%22%20height%3D%222%22/%3E%3C/g%3E%3C/svg%3E')] opacity-40 group-hover:opacity-60 transition-opacity duration-700"></div>
          
          {/* Interactive Rental Elements */}
          <div className="absolute top-4 right-4 w-8 h-8 bg-green-400/20 rounded-full animate-bounce delay-75 group-hover:bg-green-500/30 transition-colors duration-300">
            <Store className="w-4 h-4 text-green-600 m-2" />
          </div>
          <div className="absolute top-8 left-6 w-6 h-6 bg-emerald-400/20 rounded-full animate-bounce delay-150 group-hover:bg-emerald-500/30 transition-colors duration-300">
            <Calendar className="w-3 h-3 text-emerald-600 m-1.5" />
          </div>
          <div className="absolute bottom-6 right-8 w-4 h-4 bg-teal-500/20 rounded-full animate-bounce delay-300 group-hover:bg-teal-600/30 transition-colors duration-300">
            <Wallet className="w-2 h-2 text-teal-700 m-1" />
          </div>
          <div className="absolute bottom-8 left-4 w-5 h-5 bg-green-400/20 rounded-full animate-bounce delay-500 group-hover:bg-green-500/30 transition-colors duration-300">
            <Settings className="w-2.5 h-2.5 text-green-600 m-1.25" />
          </div>
          
          <CardContent className={`relative z-10 p-8 h-full flex flex-col justify-between ${company.inDevelopment ? 'pt-12' : 'pt-8'}`}>
            {/* Header Section */}
            <div className="text-center mb-6">
              <div className="relative inline-flex items-center justify-center w-20 h-20 mb-4">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl rotate-6 group-hover:rotate-12 transition-transform duration-500"></div>
                <div className="relative w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-xl">
                  <IconComponent className="w-8 h-8 text-green-600 group-hover:scale-110 transition-transform duration-300" />
                </div>
                {/* Interactive Rental Symbols */}
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-400 rounded-full flex items-center justify-center text-xs group-hover:animate-spin">🏪</div>
                <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center text-xs group-hover:animate-pulse">⏰</div>
              </div>
              
              <Badge className="bg-green-500/20 text-green-700 border-green-300/50 px-3 py-1 text-sm group-hover:bg-green-600/30 transition-colors duration-300">
                {company.category}
              </Badge>
            </div>

            {/* Company Info */}
            <div className="text-center mb-6 flex-grow">
              <h3 className="text-2xl font-bold text-slate-800 group-hover:text-green-800 transition-colors duration-300 mb-2">
                {company.name}
              </h3>
              {company.nameEn && (
                <p className="text-lg font-medium text-green-600 mb-3">
                  {company.nameEn}
                </p>
              )}
              <p className="text-slate-600 leading-relaxed text-sm">
                {company.description}
              </p>
            </div>

            {/* Interactive Rental Features */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="text-center p-3 bg-white/60 rounded-xl group-hover:bg-white/80 transition-all duration-300 hover:scale-105">
                <div className="relative">
                  <Store className="w-6 h-6 text-green-500 mx-auto mb-1 group-hover:animate-pulse" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                </div>
                <p className="text-xs font-medium text-slate-700">متاجر جاهزة</p>
              </div>
              <div className="text-center p-3 bg-white/60 rounded-xl group-hover:bg-white/80 transition-all duration-300 hover:scale-105">
                <div className="relative">
                  <Palette className="w-6 h-6 text-emerald-500 mx-auto mb-1 group-hover:animate-bounce" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full animate-ping delay-100"></div>
                </div>
                <p className="text-xs font-medium text-slate-700">قوالب احترافية</p>
              </div>
              <div className="text-center p-3 bg-white/60 rounded-xl group-hover:bg-white/80 transition-all duration-300 hover:scale-105">
                <div className="relative">
                  <Wallet className="w-6 h-6 text-teal-500 mx-auto mb-1 group-hover:animate-pulse" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-teal-400 rounded-full animate-ping delay-200"></div>
                </div>
                <p className="text-xs font-medium text-slate-700">طرق الدفع</p>
              </div>
              <div className="text-center p-3 bg-white/60 rounded-xl group-hover:bg-white/80 transition-all duration-300 hover:scale-105">
                <div className="relative">
                  <Calendar className="w-6 h-6 text-green-500 mx-auto mb-1 group-hover:animate-bounce" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-ping delay-300"></div>
                </div>
                <p className="text-xs font-medium text-slate-700">تأجير مرن</p>
              </div>
            </div>

            {/* Established Badge */}
            <div className="text-center mb-4">
              <Badge variant="outline" className="bg-white/80 text-slate-600 border-slate-300 px-3 py-1 text-sm">
                تأسست {company.established}
              </Badge>
            </div>
            
            {/* CTA Button */}
            <div className="text-center">
              <Button className={`w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-0 py-3 rounded-2xl shadow-lg hover:shadow-green-500/30 transition-all duration-300 group/btn ${company.inDevelopment ? 'opacity-75 cursor-not-allowed' : ''}`} disabled={company.inDevelopment}>
                <ExternalLink className="w-4 h-4 ml-2 group-hover/btn:rotate-45 transition-transform duration-300" />
                {company.inDevelopment ? `قريباً - ${company.launchDate}` : 'استكشف منصة التأجير'}
              </Button>
            </div>
          </CardContent>
        </div>
      </div>
    );
  };

  const renderCompanyCard = (company, index) => {
    const IconComponent = company.icon;
    
    return (
      <div className="relative h-[600px]">
        <div className="relative overflow-hidden bg-white/95 backdrop-blur-sm rounded-3xl border border-slate-200/60 hover:border-blue-300/60 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-700 transform hover:scale-[1.02] group h-full">
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${company.color}`}></div>
          
          <CardContent className="p-8 relative z-10">
            <div className="flex items-start justify-between mb-6">
              <div className={`w-16 h-16 bg-gradient-to-br ${company.color} rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg`}>
                <IconComponent className="w-8 h-8 text-white" />
              </div>
              <Badge variant="secondary" className="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-blue-200">
                تأسست {company.established}
              </Badge>
            </div>
            
            <div className="space-y-3 mb-6">
              <h3 className="text-2xl font-bold text-slate-800 group-hover:text-blue-800 transition-colors duration-300">{company.name}</h3>
              <p className="text-lg text-blue-600 font-medium">{company.nameEn}</p>
              <Badge variant="outline" className="text-xs text-slate-600 border-slate-300">
                {company.category}
              </Badge>
            </div>
            
            <p className="text-slate-600 text-sm leading-relaxed mb-8">{company.description}</p>
            
            <Button asChild className={`w-full bg-gradient-to-r ${company.color} text-white border-0 hover:shadow-lg transition-all duration-300`}>
              <a href={company.website} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 ml-2" />
                زيارة الموقع الرسمي
              </a>
            </Button>
          </CardContent>
        </div>
      </div>
    );
  };

  const renderMicroservicesCard = (company) => {
    const IconComponent = company.icon;
    
    return (
      <div className="relative h-[600px]">
        <div className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 rounded-3xl border-2 border-orange-200/60 hover:border-orange-400/80 transition-all duration-700 group h-full">
          {/* Development Banner with Launch Date */}
          {company.inDevelopment && (
            <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 text-white text-center py-2 text-sm font-bold">
              <div className="flex items-center justify-center gap-2 animate-pulse">
                <span>⚙️</span>
                <span>قيد التطوير - الإطلاق المتوقع {company.launchDate}</span>
                <span>⚙️</span>
              </div>
            </div>
          )}
          
          {/* Microservices Pattern Background */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20width%3D%2246%22%20height%3D%2246%22%20viewBox%3D%220%200%2046%2046%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22%23ea580c%22%20fill-opacity%3D%220.08%22%3E%3Cpath%20d%3D%22M23%2011l6%206-6%206-6-6z%22/%3E%3Ccircle%20cx%3D%2223%22%20cy%3D%2223%22%20r%3D%222%22/%3E%3Crect%20x%3D%2219%22%20y%3D%229%22%20width%3D%228%22%20height%3D%222%22/%3E%3C/g%3E%3C/svg%3E')] opacity-40 group-hover:opacity-60 transition-opacity duration-700"></div>
          
          {/* Interactive Microservices Elements */}
          <div className="absolute top-12 right-4 w-8 h-8 bg-orange-400/20 rounded-full animate-bounce delay-75 group-hover:bg-orange-500/30 transition-colors duration-300">
            <Layers className="w-4 h-4 text-orange-600 m-2" />
          </div>
          <div className="absolute top-16 left-6 w-6 h-6 bg-amber-400/20 rounded-full animate-bounce delay-150 group-hover:bg-amber-500/30 transition-colors duration-300">
            <Network className="w-3 h-3 text-amber-600 m-1.5" />
          </div>
          <div className="absolute bottom-6 right-8 w-4 h-4 bg-yellow-500/20 rounded-full animate-bounce delay-300 group-hover:bg-yellow-600/30 transition-colors duration-300">
            <Cog className="w-2 h-2 text-yellow-700 m-1" />
          </div>
          <div className="absolute bottom-8 left-4 w-5 h-5 bg-orange-400/20 rounded-full animate-bounce delay-500 group-hover:bg-orange-500/30 transition-colors duration-300">
            <Wrench className="w-2.5 h-2.5 text-orange-600 m-1.25" />
          </div>
          
          <CardContent className={`relative z-10 p-8 h-full flex flex-col justify-between ${company.inDevelopment ? 'pt-12' : 'pt-8'}`}>
            {/* Header Section */}
            <div className="text-center mb-6">
              <div className="relative inline-flex items-center justify-center w-20 h-20 mb-4">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl rotate-6 group-hover:rotate-12 transition-transform duration-500"></div>
                <div className="relative w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-xl">
                  <IconComponent className="w-8 h-8 text-orange-600 group-hover:scale-110 transition-transform duration-300" />
                </div>
                {/* Interactive Microservices Symbols */}
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-400 rounded-full flex items-center justify-center text-xs group-hover:animate-spin">🔧</div>
                <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-green-400 rounded-full flex items-center justify-center text-xs group-hover:animate-pulse">⚡</div>
              </div>
              
              <Badge className="bg-orange-500/20 text-orange-700 border-orange-300/50 px-3 py-1 text-sm group-hover:bg-orange-600/30 transition-colors duration-300">
                {company.category}
              </Badge>
            </div>

            {/* Company Info */}
            <div className="text-center mb-6 flex-grow">
              <h3 className="text-2xl font-bold text-slate-800 group-hover:text-orange-800 transition-colors duration-300 mb-2">
                {company.name}
              </h3>
              {company.nameEn && (
                <p className="text-lg font-medium text-orange-600 mb-3">
                  {company.nameEn}
                </p>
              )}
              <p className="text-slate-600 leading-relaxed text-sm">
                {company.description}
              </p>
            </div>

            {/* Interactive Microservices Features */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="text-center p-3 bg-white/60 rounded-xl group-hover:bg-white/80 transition-all duration-300 hover:scale-105">
                <div className="relative">
                  <Layers className="w-6 h-6 text-orange-500 mx-auto mb-1 group-hover:animate-pulse" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-400 rounded-full animate-ping"></div>
                </div>
                <p className="text-xs font-medium text-slate-700">خدمات مصغرة</p>
              </div>
              <div className="text-center p-3 bg-white/60 rounded-xl group-hover:bg-white/80 transition-all duration-300 hover:scale-105">
                <div className="relative">
                  <Network className="w-6 h-6 text-amber-500 mx-auto mb-1 group-hover:animate-bounce" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-amber-400 rounded-full animate-ping delay-100"></div>
                </div>
                <p className="text-xs font-medium text-slate-700">ربط الشبكات</p>
              </div>
              <div className="text-center p-3 bg-white/60 rounded-xl group-hover:bg-white/80 transition-all duration-300 hover:scale-105">
                <div className="relative">
                  <Cog className="w-6 h-6 text-yellow-500 mx-auto mb-1 group-hover:animate-pulse" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-ping delay-200"></div>
                </div>
                <p className="text-xs font-medium text-slate-700">حلول تقنية</p>
              </div>
              <div className="text-center p-3 bg-white/60 rounded-xl group-hover:bg-white/80 transition-all duration-300 hover:scale-105">
                <div className="relative">
                  <Wrench className="w-6 h-6 text-orange-500 mx-auto mb-1 group-hover:animate-bounce" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-400 rounded-full animate-ping delay-300"></div>
                </div>
                <p className="text-xs font-medium text-slate-700">صيانة وتطوير</p>
              </div>
            </div>

            {/* Established Badge */}
            <div className="text-center mb-4">
              <Badge variant="outline" className="bg-white/80 text-slate-600 border-slate-300 px-3 py-1 text-sm">
                تأسست {company.established}
              </Badge>
            </div>
            
            {/* CTA Button */}
            <div className="text-center">
              <Button className={`w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white border-0 py-3 rounded-2xl shadow-lg hover:shadow-orange-500/30 transition-all duration-300 group/btn ${company.inDevelopment ? 'opacity-75 cursor-not-allowed' : ''}`} disabled={company.inDevelopment}>
                <ExternalLink className="w-4 h-4 ml-2 group-hover/btn:rotate-45 transition-transform duration-300" />
                {company.inDevelopment ? `قريباً - ${company.launchDate}` : 'استكشف الخدمات المصغرة'}
              </Button>
            </div>
          </CardContent>
        </div>
      </div>
    );
  };

  const renderChatBotCard = (company) => {
    const IconComponent = company.icon;
    
    return (
      <div className="relative h-[600px]">
        <div className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 rounded-3xl border-2 border-emerald-200/60 hover:border-emerald-400/80 transition-all duration-700 group h-full">
          {/* Development Banner with Launch Date */}
          {company.inDevelopment && (
            <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-500 text-white text-center py-2 text-sm font-bold">
              <div className="flex items-center justify-center gap-2 animate-pulse">
                <span>💬</span>
                <span>قيد التطوير - الإطلاق المتوقع {company.launchDate}</span>
                <span>💬</span>
              </div>
            </div>
          )}
          
          {/* ChatBot Pattern Background */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20width%3D%2248%22%20height%3D%2248%22%20viewBox%3D%220%200%2048%2048%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22%2310b981%22%20fill-opacity%3D%220.07%22%3E%3Cpath%20d%3D%22M24%2012l6%206-6%206-6-6z%22/%3E%3Ccircle%20cx%3D%2224%22%20cy%3D%2224%22%20r%3D%223%22/%3E%3Crect%20x%3D%2220%22%20y%3D%2210%22%20width%3D%228%22%20height%3D%222%22/%3E%3C/g%3E%3C/svg%3E')] opacity-40 group-hover:opacity-60 transition-opacity duration-700"></div>
          
          {/* Interactive ChatBot Elements */}
          <div className="absolute top-12 right-4 w-8 h-8 bg-emerald-400/20 rounded-full animate-bounce delay-75 group-hover:bg-emerald-500/30 transition-colors duration-300">
            <MessageSquare className="w-4 h-4 text-emerald-600 m-2" />
          </div>
          <div className="absolute top-16 left-6 w-6 h-6 bg-green-400/20 rounded-full animate-bounce delay-150 group-hover:bg-green-500/30 transition-colors duration-300">
            <Bot className="w-3 h-3 text-green-600 m-1.5" />
          </div>
          <div className="absolute bottom-6 right-8 w-4 h-4 bg-teal-500/20 rounded-full animate-bounce delay-300 group-hover:bg-teal-600/30 transition-colors duration-300">
            <Send className="w-2 h-2 text-teal-700 m-1" />
          </div>
          <div className="absolute bottom-8 left-4 w-5 h-5 bg-emerald-400/20 rounded-full animate-bounce delay-500 group-hover:bg-emerald-500/30 transition-colors duration-300">
            <Phone className="w-2.5 h-2.5 text-emerald-600 m-1.25" />
          </div>
          
          <CardContent className={`relative z-10 p-8 h-full flex flex-col justify-between ${company.inDevelopment ? 'pt-12' : 'pt-8'}`}>
            {/* Header Section */}
            <div className="text-center mb-6">
              <div className="relative inline-flex items-center justify-center w-20 h-20 mb-4">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl rotate-6 group-hover:rotate-12 transition-transform duration-500"></div>
                <div className="relative w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-xl">
                  <IconComponent className="w-8 h-8 text-emerald-600 group-hover:scale-110 transition-transform duration-300" />
                </div>
                {/* Interactive ChatBot Symbols */}
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-400 rounded-full flex items-center justify-center text-xs group-hover:animate-spin">💬</div>
                <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center text-xs group-hover:animate-pulse">🤖</div>
              </div>
              
              <Badge className="bg-emerald-500/20 text-emerald-700 border-emerald-300/50 px-3 py-1 text-sm group-hover:bg-emerald-600/30 transition-colors duration-300">
                {company.category}
              </Badge>
            </div>

            {/* Company Info */}
            <div className="text-center mb-6 flex-grow">
              <h3 className="text-2xl font-bold text-slate-800 group-hover:text-emerald-800 transition-colors duration-300 mb-2">
                {company.name}
              </h3>
              {company.nameEn && (
                <p className="text-lg font-medium text-emerald-600 mb-3">
                  {company.nameEn}
                </p>
              )}
              <p className="text-slate-600 leading-relaxed text-sm">
                {company.description}
              </p>
            </div>

            {/* Interactive ChatBot Features */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="text-center p-3 bg-white/60 rounded-xl group-hover:bg-white/80 transition-all duration-300 hover:scale-105">
                <div className="relative">
                  <Bot className="w-6 h-6 text-emerald-500 mx-auto mb-1 group-hover:animate-pulse" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full animate-ping"></div>
                </div>
                <p className="text-xs font-medium text-slate-700">بوت ذكي</p>
              </div>
              <div className="text-center p-3 bg-white/60 rounded-xl group-hover:bg-white/80 transition-all duration-300 hover:scale-105">
                <div className="relative">
                  <MessageSquare className="w-6 h-6 text-green-500 mx-auto mb-1 group-hover:animate-bounce" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-ping delay-100"></div>
                </div>
                <p className="text-xs font-medium text-slate-700">ردود تفاعلية</p>
              </div>
              <div className="text-center p-3 bg-white/60 rounded-xl group-hover:bg-white/80 transition-all duration-300 hover:scale-105">
                <div className="relative">
                  <Phone className="w-6 h-6 text-teal-500 mx-auto mb-1 group-hover:animate-pulse" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-teal-400 rounded-full animate-ping delay-200"></div>
                </div>
                <p className="text-xs font-medium text-slate-700">واتساب API</p>
              </div>
              <div className="text-center p-3 bg-white/60 rounded-xl group-hover:bg-white/80 transition-all duration-300 hover:scale-105">
                <div className="relative">
                  <Send className="w-6 h-6 text-emerald-500 mx-auto mb-1 group-hover:animate-bounce" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full animate-ping delay-300"></div>
                </div>
                <p className="text-xs font-medium text-slate-700">رسائل آلية</p>
              </div>
            </div>

            {/* Established Badge */}
            <div className="text-center mb-4">
              <Badge variant="outline" className="bg-white/80 text-slate-600 border-slate-300 px-3 py-1 text-sm">
                تأسست {company.established}
              </Badge>
            </div>
            
            {/* CTA Button */}
            <div className="text-center">
              <Button className={`w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white border-0 py-3 rounded-2xl shadow-lg hover:shadow-emerald-500/30 transition-all duration-300 group/btn ${company.inDevelopment ? 'opacity-75 cursor-not-allowed' : ''}`} disabled={company.inDevelopment}>
                <ExternalLink className="w-4 h-4 ml-2 group-hover/btn:rotate-45 transition-transform duration-300" />
                {company.inDevelopment ? `قريباً - ${company.launchDate}` : 'استكشف منصة البوت'}
              </Button>
            </div>
          </CardContent>
        </div>
      </div>
    );
  };

  return (
    <section className="py-20 md:py-28 relative overflow-hidden bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-purple-100/40"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20 animate-fade-in">
          <div className="inline-flex items-center gap-3 mb-6 p-4 bg-white/20 rounded-full backdrop-blur-sm border border-white/30">
            <Building2 className="w-6 h-6 text-blue-600 animate-pulse" />
            <span className="text-sm font-medium text-blue-700">شركات تابعة • نمو عالمي</span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-800 mb-8 leading-tight">
            شركاتنا <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">التابعة</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
            مجموعة متنوعة من الشركات المتخصصة عالمياً التي تعمل في مجالات مختلفة لتقديم حلول شاملة ومتكاملة
          </p>
        </div>

        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-16">
          {subsidiaries.map((company, index) => (
            <div key={index} style={{ animationDelay: `${index * 0.15}s` }}>
              {company.isPortal 
                ? renderPortalCard(company) 
                : company.isEducation 
                  ? renderEducationCard(company)
                  : company.isAcademic 
                    ? renderAcademicCard(company)
                    : company.isMarketing 
                      ? renderMarketingCard(company)
                      : company.isAccounting 
                        ? renderAccountingCard(company)
                        : company.isEcommerce 
                          ? renderEcommerceCard(company)
                          : company.isRental 
                            ? renderRentalCard(company)
                            : company.isMicroservices 
                              ? renderMicroservicesCard(company)
                              : company.isChatBot 
                                ? renderChatBotCard(company)
                                : renderCompanyCard(company, index)
              }
            </div>
          ))}
        </div>

        <div className="text-center animate-fade-in">
          <div className="bg-gradient-to-r from-white/10 to-slate-100/10 rounded-3xl p-12 backdrop-blur-sm border border-white/20">
            <h3 className="text-3xl font-bold text-slate-800 mb-8">إنجازاتنا الجماعية</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">6</div>
                <div className="text-slate-600">شركات متخصصة</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">500+</div>
                <div className="text-slate-600">مشروع منجز</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-indigo-600 mb-2">1000+</div>
                <div className="text-slate-600">عميل راضي</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-emerald-600 mb-2">15</div>
                <div className="text-slate-600">دولة حول العالم</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SubsidiariesSection;
