import { useState } from "react";
import { Building2, Award, Globe, Mail, Phone, MapPin, Calendar, CheckCircle2, ArrowRight, Star, Users, Clock, Truck, Menu, X, Home, Briefcase, Phone as PhoneIcon, Info, FileText, Settings, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

const ConstructionWebsite = () => {
  const [activeProject, setActiveProject] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("home");

  const projects = [
    {
      id: 1,
      title: "مجمع برج الإمارات",
      location: "دبي، الإمارات",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
      status: "مكتمل",
      area: "250,000 م²",
      year: "2023"
    },
    {
      id: 2,
      title: "مشروع الملك عبدالله",
      location: "الرياض، السعودية",
      image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80",
      status: "قيد التنفيذ",
      area: "500,000 م²",
      year: "2024"
    },
    {
      id: 3,
      title: "مجمع الأعمال الدولي",
      location: "الدوحة، قطر",
      image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80",
      status: "مكتمل",
      area: "180,000 م²",
      year: "2022"
    }
  ];

  const services = [
    {
      icon: Building2,
      title: "البناء والتشييد",
      description: "تنفيذ مشاريع البناء السكنية والتجارية بأعلى معايير الجودة"
    },
    {
      icon: Award,
      title: "الاستشارات الهندسية",
      description: "خدمات استشارية متخصصة في التصميم والتخطيط الهندسي"
    },
    {
      icon: Truck,
      title: "إدارة المشاريع",
      description: "إدارة شاملة للمشاريع من البداية حتى التسليم النهائي"
    },
    {
      icon: CheckCircle2,
      title: "ضمان الجودة",
      description: "نظام شامل لضمان الجودة ومراقبة جميع مراحل التنفيذ"
    }
  ];

  const stats = [
    { number: "200+", label: "مشروع مكتمل", icon: Building2 },
    { number: "15+", label: "سنة خبرة", icon: Clock },
    { number: "50+", label: "مهندس متخصص", icon: Users },
    { number: "98%", label: "رضا العملاء", icon: Star }
  ];

  const navigationItems = [
    { id: "home", label: "الرئيسية", icon: Home },
    { id: "services", label: "خدماتنا", icon: Briefcase },
    { id: "projects", label: "مشاريعنا", icon: Building2 },
    { id: "about", label: "من نحن", icon: Info },
    { id: "careers", label: "الوظائف", icon: Users },
    { id: "contact", label: "تواصل معنا", icon: PhoneIcon }
  ];

  const renderPage = () => {
    switch(currentPage) {
      case "services":
        return <ServicesPage />;
      case "projects":
        return <ProjectsPage />;
      case "about":
        return <AboutPage />;
      case "careers":
        return <CareersPage />;
      case "contact":
        return <ContactPage />;
      default:
        return <HomePage />;
    }
  };

  const HomePage = () => (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1920&q=80')"
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-800/80 to-slate-900/70"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-6 text-center text-white">
          <div className="animate-fade-in">
            <Badge className="mb-6 bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border-amber-500/30 px-6 py-2 text-lg">
              ✨ الشركة الرائدة في البناء والتشييد عالمياً
            </Badge>
            <h1 className="text-6xl md:text-8xl font-bold mb-8 bg-gradient-to-r from-white via-blue-100 to-amber-200 bg-clip-text text-transparent leading-tight">
              نبني أحلامكم
              <span className="block bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">بلمسة عالمية</span>
            </h1>
            <p className="text-2xl md:text-3xl mb-10 max-w-4xl mx-auto leading-relaxed text-blue-100">
              من ناطحات السحاب إلى المجمعات السكنية، نحول رؤيتكم إلى واقع ملموس بتقنيات متطورة وخبرة تمتد لعقود
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
              <Button size="lg" className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-10 py-6 text-xl shadow-2xl shadow-amber-500/25 hover-scale">
                🚀 ابدأ مشروعك الآن
                <ArrowRight className="mr-2 h-6 w-6" />
              </Button>
              <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 px-10 py-6 text-xl backdrop-blur-sm">
                📋 احصل على عرض سعر
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="animate-fade-in text-center" style={{animationDelay: `${index * 0.2}s`}}>
                  <div className="text-4xl md:text-5xl font-bold text-amber-400 mb-2">{stat.number}</div>
                  <div className="text-blue-200 text-sm md:text-base">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-blue-50/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-blue-100 text-blue-800">🏗️ خدماتنا المتميزة</Badge>
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-slate-800 to-blue-800 bg-clip-text text-transparent">
              حلول شاملة لكل احتياجاتكم
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="hover:shadow-2xl transition-all duration-500 hover-scale group bg-gradient-to-br from-white to-blue-50/50 border-0 shadow-lg">
                <CardContent className="p-8 text-center">
                  <div className="bg-gradient-to-br from-blue-500 to-indigo-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-xl group-hover:shadow-blue-500/25 transition-all duration-500">
                    <service.icon className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-slate-800">{service.title}</h3>
                  <p className="text-slate-600 leading-relaxed text-lg">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-20 bg-gradient-to-b from-blue-50/30 to-slate-100">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-amber-100 text-amber-800">🏆 مشاريع رائدة</Badge>
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-slate-800 to-amber-700 bg-clip-text text-transparent">
              إنجازات تتحدث عن نفسها
            </h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-10">
            {projects.slice(0, 3).map((project, index) => (
              <Card 
                key={project.id} 
                className="overflow-hidden hover:shadow-2xl transition-all duration-500 hover-scale group border-0"
              >
                <div className="aspect-[4/3] relative overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <div className="absolute top-6 right-6">
                    <Badge className={project.status === "مكتمل" ? "bg-green-500" : "bg-blue-500"}>
                      {project.status}
                    </Badge>
                  </div>
                  <div className="absolute bottom-6 left-6 text-white">
                    <h3 className="text-2xl font-bold mb-2">{project.title}</h3>
                    <div className="flex items-center text-blue-200">
                      <MapPin className="h-5 w-5 ml-2" />
                      {project.location}
                    </div>
                  </div>
                </div>
                <CardContent className="p-6 bg-gradient-to-r from-white to-blue-50/50">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">المساحة: <span className="font-bold text-slate-800">{project.area}</span></span>
                    <span className="text-slate-600">السنة: <span className="font-bold text-slate-800">{project.year}</span></span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );

  const ServicesPage = () => (
    <div className="pt-24 pb-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6">خدماتنا المتخصصة</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">نقدم مجموعة شاملة من الخدمات الإنشائية والهندسية</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="p-8 hover:shadow-xl transition-all duration-300">
              <service.icon className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">{service.description}</p>
              <Button>اعرف المزيد</Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );

  const ProjectsPage = () => (
    <div className="pt-24 pb-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6">مشاريعنا</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">تصفح مجموعة من أبرز مشاريعنا المنجزة</p>
        </div>
        <div className="grid lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <Card key={project.id} className="overflow-hidden hover:shadow-xl transition-all duration-300">
              <img src={project.image} alt={project.title} className="w-full h-64 object-cover" />
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                <p className="text-muted-foreground mb-4">{project.location}</p>
                <div className="flex justify-between text-sm">
                  <span>المساحة: {project.area}</span>
                  <span>السنة: {project.year}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );

  const AboutPage = () => (
    <div className="pt-24 pb-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6">من نحن</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">شركة رائدة في مجال البناء والتشييد</p>
        </div>
        <div className="max-w-4xl mx-auto space-y-8">
          <Card className="p-8">
            <h2 className="text-3xl font-bold mb-4">رؤيتنا</h2>
            <p className="text-lg leading-relaxed">أن نكون الشركة الرائدة عالمياً في مجال البناء والتشييد</p>
          </Card>
          <Card className="p-8">
            <h2 className="text-3xl font-bold mb-4">رسالتنا</h2>
            <p className="text-lg leading-relaxed">تقديم حلول إنشائية متطورة بأعلى معايير الجودة والسلامة</p>
          </Card>
        </div>
      </div>
    </div>
  );

  const CareersPage = () => (
    <div className="pt-24 pb-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6">انضم لفريقنا</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">فرص وظيفية متميزة في شركة رائدة</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="p-8">
            <h3 className="text-2xl font-bold mb-4">مهندس مدني</h3>
            <p className="text-muted-foreground mb-4">نبحث عن مهندس مدني ذو خبرة للانضمام لفريقنا</p>
            <Button>قدم الآن</Button>
          </Card>
          <Card className="p-8">
            <h3 className="text-2xl font-bold mb-4">مدير مشاريع</h3>
            <p className="text-muted-foreground mb-4">فرصة لإدارة مشاريع كبرى مع فريق محترف</p>
            <Button>قدم الآن</Button>
          </Card>
        </div>
      </div>
    </div>
  );

  const ContactPage = () => (
    <div className="pt-24 pb-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6">تواصل معنا</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">نحن هنا لمساعدتك في تحقيق مشروعك</p>
        </div>
        <div className="max-w-2xl mx-auto">
          <Card className="p-8">
            <div className="space-y-6">
              <div className="flex items-center">
                <Phone className="h-6 w-6 ml-3 text-primary" />
                <span className="text-lg">+966 11 234 5678</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-6 w-6 ml-3 text-primary" />
                <span className="text-lg">info@globalconstruction.com</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-6 w-6 ml-3 text-primary" />
                <span className="text-lg">الرياض، المملكة العربية السعودية</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Demo Site Alert */}
      <Alert className="border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 border-b rounded-none">
        <AlertTriangle className="h-5 w-5 text-amber-600" />
        <AlertDescription className="text-amber-800 font-medium text-center">
          🚧 هذا موقع تجريبي للمعاينة فقط - تم تطويره بواسطة شركة إمكان للتقنيات المتقدمة
        </AlertDescription>
      </Alert>

      {/* Header/Navigation */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/50 shadow-sm">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-3 rounded-xl shadow-lg">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-blue-800 bg-clip-text text-transparent">
                  المقاولات العالمية
                </h1>
                <p className="text-sm text-slate-500">بناء المستقبل بأيدي محترفة</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8 space-x-reverse">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  className={`flex items-center space-x-2 space-x-reverse px-4 py-2 rounded-lg transition-all duration-300 ${
                    currentPage === item.id 
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg' 
                      : 'text-slate-700 hover:bg-blue-50 hover:text-blue-600'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </nav>

            {/* CTA Button */}
            <div className="hidden lg:flex items-center space-x-4 space-x-reverse">
              <Button className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg">
                احصل على عرض سعر
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="lg:hidden py-4 border-t border-slate-200/50">
              <nav className="space-y-2">
                {navigationItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentPage(item.id);
                      setIsMenuOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 space-x-reverse px-4 py-3 rounded-lg transition-all duration-300 ${
                      currentPage === item.id 
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white' 
                        : 'text-slate-700 hover:bg-blue-50'
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Page Content */}
      {renderPage()}

      {/* Footer */}
      <footer className="py-16 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-xl mr-3">
                  <Building2 className="h-8 w-8 text-white" />
                </div>
                <div>
                  <span className="text-2xl font-bold">المقاولات العالمية</span>
                  <p className="text-slate-400 text-sm">بناء المستقبل</p>
                </div>
              </div>
              <p className="text-slate-300 leading-relaxed">
                شركة رائدة في مجال البناء والتشييد، نقدم حلولاً متكاملة ومتطورة لجميع احتياجاتكم الإنشائية
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-6 text-blue-300">خدماتنا</h4>
              <ul className="space-y-3 text-slate-300">
                <li className="hover:text-blue-300 cursor-pointer transition-colors">البناء والتشييد</li>
                <li className="hover:text-blue-300 cursor-pointer transition-colors">الاستشارات الهندسية</li>
                <li className="hover:text-blue-300 cursor-pointer transition-colors">إدارة المشاريع</li>
                <li className="hover:text-blue-300 cursor-pointer transition-colors">ضمان الجودة</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-6 text-blue-300">الشركة</h4>
              <ul className="space-y-3 text-slate-300">
                <li className="hover:text-blue-300 cursor-pointer transition-colors">من نحن</li>
                <li className="hover:text-blue-300 cursor-pointer transition-colors">مشاريعنا</li>
                <li className="hover:text-blue-300 cursor-pointer transition-colors">شهاداتنا</li>
                <li className="hover:text-blue-300 cursor-pointer transition-colors">الوظائف</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-6 text-blue-300">تواصل معنا</h4>
              <div className="space-y-4">
                <div className="flex items-center text-slate-300">
                  <Phone className="h-5 w-5 ml-3 text-blue-400" />
                  <span>+966 11 234 5678</span>
                </div>
                <div className="flex items-center text-slate-300">
                  <Mail className="h-5 w-5 ml-3 text-blue-400" />
                  <span>info@construction.com</span>
                </div>
                <div className="flex items-center text-slate-300">
                  <MapPin className="h-5 w-5 ml-3 text-blue-400" />
                  <span>الرياض، السعودية</span>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-700 mt-12 pt-8 text-center">
            <p className="text-slate-400">
              &copy; 2024 شركة المقاولات العالمية. جميع الحقوق محفوظة. 
              <span className="text-blue-400"> | موقع تجريبي بواسطة إمكان للتقنيات</span>
            </p>
          </div>
        </div>
      </footer>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1920&q=80')"
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-800/70 to-transparent"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-6 text-center text-white">
          <div className="animate-fade-in">
            <Badge className="mb-4 bg-primary/20 text-primary-foreground border-primary/30">
              شركة المقاولات العالمية
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
              بناء المستقبل
              <span className="block text-primary">بأيدي محترفة</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
              نحن رواد صناعة البناء والتشييد في المنطقة، نقدم حلولاً متكاملة لجميع احتياجاتكم الإنشائية
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg">
                اطلب استشارة مجانية
                <ArrowRight className="mr-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg">
                تصفح مشاريعنا
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 hover-scale">
                <CardContent className="p-6">
                  <stat.icon className="h-10 w-10 text-primary mx-auto mb-4" />
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.number}</div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="mb-4">خدماتنا</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              نقدم حلولاً شاملة
              <span className="block text-primary">لجميع احتياجاتكم</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              من التصميم والتخطيط إلى التنفيذ والتسليم، نحن معكم في كل خطوة
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300 hover-scale group">
                <CardContent className="p-6 text-center">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                    <service.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="mb-4">مشاريعنا</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              أعمالنا تتحدث
              <span className="block text-primary">عن جودتنا</span>
            </h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <Card 
                key={project.id} 
                className={`cursor-pointer transition-all duration-500 hover-scale ${
                  activeProject === index ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setActiveProject(index)}
              >
                <div className="aspect-video relative overflow-hidden rounded-t-lg">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge variant={project.status === "مكتمل" ? "default" : "secondary"}>
                      {project.status}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                  <div className="flex items-center text-muted-foreground mb-3">
                    <MapPin className="h-4 w-4 ml-2" />
                    {project.location}
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>المساحة: {project.area}</span>
                    <span>السنة: {project.year}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge className="mb-4">من نحن</Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                خبرة عالمية
                <span className="block text-primary">وجودة محلية</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                منذ أكثر من 15 عاماً، نحن نبني المستقبل بأيدي محترفة وخبرة عالمية. 
                شركتنا متخصصة في تنفيذ المشاريع الكبرى والمعقدة بأعلى معايير الجودة والسلامة.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <CheckCircle2 className="h-6 w-6 text-primary ml-3" />
                  <span>معتمدون من أهم الجهات العالمية</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle2 className="h-6 w-6 text-primary ml-3" />
                  <span>فريق عمل متخصص ومؤهل</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle2 className="h-6 w-6 text-primary ml-3" />
                  <span>التزام بالمواعيد والجودة</span>
                </div>
              </div>
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                اعرف أكثر عنا
                <ArrowRight className="mr-2 h-5 w-5" />
              </Button>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=800&q=80"
                alt="About us"
                className="rounded-lg shadow-2xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-primary text-primary-foreground p-6 rounded-lg shadow-xl">
                <div className="text-3xl font-bold">200+</div>
                <div className="text-sm">مشروع مكتمل</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                ابدأ مشروعك معنا
                <span className="block text-primary-foreground/80">اليوم</span>
              </h2>
              <p className="text-xl mb-8 text-primary-foreground/90 leading-relaxed">
                تواصل معنا الآن واحصل على استشارة مجانية لمشروعك القادم
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Phone className="h-6 w-6 ml-3" />
                  <span className="text-lg">+966 11 234 5678</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-6 w-6 ml-3" />
                  <span className="text-lg">info@globalconstruction.com</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-6 w-6 ml-3" />
                  <span className="text-lg">الرياض، المملكة العربية السعودية</span>
                </div>
              </div>
            </div>
            <Card className="bg-white/10 border-white/20">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-6 text-white">احجز استشارة مجانية</h3>
                <div className="space-y-4">
                  <div>
                    <input 
                      type="text" 
                      placeholder="الاسم الكامل"
                      className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/70"
                    />
                  </div>
                  <div>
                    <input 
                      type="email" 
                      placeholder="البريد الإلكتروني"
                      className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/70"
                    />
                  </div>
                  <div>
                    <input 
                      type="tel" 
                      placeholder="رقم الهاتف"
                      className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/70"
                    />
                  </div>
                  <div>
                    <textarea 
                      placeholder="تفاصيل المشروع"
                      rows={4}
                      className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/70 resize-none"
                    ></textarea>
                  </div>
                  <Button size="lg" className="w-full bg-white text-primary hover:bg-white/90">
                    <Calendar className="ml-2 h-5 w-5" />
                    احجز الآن
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-900 text-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Building2 className="h-8 w-8 text-primary ml-2" />
                <span className="text-xl font-bold">شركة المقاولات العالمية</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                نبني المستقبل بخبرة عالمية وجودة محلية، شريككم الموثوق في تنفيذ المشاريع الكبرى
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">خدماتنا</h4>
              <ul className="space-y-2 text-slate-400">
                <li>البناء والتشييد</li>
                <li>الاستشارات الهندسية</li>
                <li>إدارة المشاريع</li>
                <li>ضمان الجودة</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">الشركة</h4>
              <ul className="space-y-2 text-slate-400">
                <li>من نحن</li>
                <li>مشاريعنا</li>
                <li>شهاداتنا</li>
                <li>تواصل معنا</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">تابعنا</h4>
              <div className="flex space-x-4 space-x-reverse">
                <Globe className="h-6 w-6 text-slate-400 hover:text-primary cursor-pointer" />
                <Mail className="h-6 w-6 text-slate-400 hover:text-primary cursor-pointer" />
              </div>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
            <p>&copy; 2024 شركة المقاولات العالمية. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ConstructionWebsite;