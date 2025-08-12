import { useState } from "react";
import { Building2, Award, Globe, Mail, Phone, MapPin, Calendar, CheckCircle2, ArrowRight, Star, Users, Clock, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const ConstructionWebsite = () => {
  const [activeProject, setActiveProject] = useState(0);

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

  return (
    <div className="min-h-screen bg-background">
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