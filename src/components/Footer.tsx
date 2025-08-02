import { Badge } from "@/components/ui/badge";
import { 
  Home, 
  Mail, 
  Phone, 
  MapPin, 
  Users, 
  Target, 
  Award, 
  Clock, 
  Shield, 
  HeadphonesIcon, 
  MessageCircle, 
  FileText, 
  Globe, 
  Heart, 
  Star, 
  ChevronRight,
  ExternalLink,
  Building2,
  Lightbulb,
  TrendingUp,
  Zap
} from "lucide-react";

const Footer = () => {
  const quickLinks = [
    { name: "الرئيسية", href: "#hero", icon: Home },
    { name: "من نحن", href: "#about", icon: Users },
    { name: "رؤيتنا", href: "#vision", icon: Target },
    { name: "فريق العمل", href: "/team", icon: Award },
    { name: "تواصل معنا", href: "#contact", icon: Mail }
  ];

  const supportLinks = [
    { name: "الدعم الفني", href: "#support", icon: HeadphonesIcon, badge: "24/7" },
    { name: "الأسئلة الشائعة", href: "#faq", icon: MessageCircle },
    { name: "دليل المستخدم", href: "#guide", icon: FileText },
    { name: "سياسة الخصوصية", href: "#privacy", icon: Shield },
    { name: "شروط الاستخدام", href: "#terms", icon: FileText }
  ];

  const services = [
    { name: "الاستثمار التقني", href: "#investment", icon: TrendingUp },
    { name: "التطوير والابتكار", href: "#development", icon: Lightbulb },
    { name: "الاستشارات الإستراتيجية", href: "#consulting", icon: Building2 },
    { name: "الحلول المتكاملة", href: "#solutions", icon: Zap }
  ];

  const contactInfo = [
    { label: "البريد الإلكتروني", value: "info@ash.holdings", icon: Mail },
    { label: "الهاتف", value: "0555812567", icon: Phone },
    { label: "الموقع", value: "ash.holdings", icon: Globe }
  ];

  return (
    <footer className="bg-gradient-to-br from-primary via-primary/95 to-secondary relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />
      <div className="absolute top-10 right-10 w-32 h-32 bg-secondary/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-10 left-10 w-24 h-24 bg-primary-foreground/10 rounded-full blur-2xl animate-float-delayed" />
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-12">
            
            {/* Company Info Section */}
            <div className="lg:col-span-1 space-y-6 animate-fade-in">
              <div>
                <h3 className="text-3xl font-bold text-primary-foreground mb-4 group hover:text-secondary transition-colors duration-300">
                  شركة علي صالح الشهري القابضة
                </h3>
                <p className="text-primary-foreground/80 leading-relaxed text-lg">
                  شركة قابضة رائدة في الاستثمار التقني والإعلامي، نساهم في بناء مستقبل أفضل 
                  من خلال دعم الابتكار والشركات الناشئة.
                </p>
              </div>
              
              {/* Contact Info */}
              <div className="space-y-4">
                <h4 className="text-lg font-bold text-primary-foreground flex items-center gap-2">
                  <MapPin className="w-5 h-5 animate-pulse" />
                  معلومات التواصل
                </h4>
                {contactInfo.map((contact, index) => {
                  const IconComponent = contact.icon;
                  return (
                    <div key={index} className="flex items-center gap-3 group hover:scale-105 transition-transform duration-300">
                      <div className="w-8 h-8 bg-secondary/20 rounded-lg flex items-center justify-center group-hover:bg-secondary/30 transition-colors duration-300">
                        <IconComponent className="w-4 h-4 text-secondary" />
                      </div>
                      <div>
                        <p className="text-xs text-primary-foreground/60">{contact.label}</p>
                        <p className="text-primary-foreground/90 font-medium">{contact.value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Rating Badge */}
              <div className="flex items-center gap-2 mt-6">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                  تقييم ممتاز
                </Badge>
              </div>
            </div>

            {/* Quick Links */}
            <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <h4 className="text-xl font-bold text-primary-foreground mb-6 flex items-center gap-2">
                <ChevronRight className="w-5 h-5 text-secondary animate-pulse" />
                روابط سريعة
              </h4>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => {
                  const IconComponent = link.icon;
                  return (
                    <li key={index}>
                      <a 
                        href={link.href} 
                        className="flex items-center gap-3 text-primary-foreground/80 hover:text-secondary transition-all duration-300 group hover:translate-x-2"
                      >
                        <IconComponent className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                        <span className="group-hover:font-medium transition-all duration-300">
                          {link.name}
                        </span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Help & Support */}
            <div className="animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <h4 className="text-xl font-bold text-primary-foreground mb-6 flex items-center gap-2">
                <HeadphonesIcon className="w-5 h-5 text-secondary animate-pulse" />
                المساعدة والدعم
              </h4>
              <ul className="space-y-3">
                {supportLinks.map((link, index) => {
                  const IconComponent = link.icon;
                  return (
                    <li key={index}>
                      <a 
                        href={link.href} 
                        className="flex items-center justify-between text-primary-foreground/80 hover:text-secondary transition-all duration-300 group hover:translate-x-2"
                      >
                        <div className="flex items-center gap-3">
                          <IconComponent className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                          <span className="group-hover:font-medium transition-all duration-300">
                            {link.name}
                          </span>
                        </div>
                        {link.badge && (
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                            {link.badge}
                          </Badge>
                        )}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Services */}
            <div className="animate-fade-in" style={{ animationDelay: "0.6s" }}>
              <h4 className="text-xl font-bold text-primary-foreground mb-6 flex items-center gap-2">
                <Award className="w-5 h-5 text-secondary animate-pulse" />
                خدماتنا المتميزة
              </h4>
              <ul className="space-y-3">
                {services.map((service, index) => {
                  const IconComponent = service.icon;
                  return (
                    <li key={index}>
                      <a 
                        href={service.href} 
                        className="flex items-center gap-3 text-primary-foreground/80 hover:text-secondary transition-all duration-300 group hover:translate-x-2"
                      >
                        <IconComponent className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                        <span className="group-hover:font-medium transition-all duration-300">
                          {service.name}
                        </span>
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </a>
                    </li>
                  );
                })}
              </ul>

              {/* CTA Section */}
              <div className="mt-8 p-4 bg-secondary/10 rounded-xl border border-secondary/20 group hover:bg-secondary/15 transition-colors duration-300">
                <div className="flex items-center gap-3 mb-2">
                  <Heart className="w-5 h-5 text-secondary animate-pulse" />
                  <h5 className="text-primary-foreground font-bold">ابدأ مشروعك معنا</h5>
                </div>
                <p className="text-primary-foreground/70 text-sm mb-3">
                  انضم إلى رحلة النجاح والابتكار
                </p>
                <a 
                  href="#contact" 
                  className="inline-flex items-center gap-2 text-secondary hover:text-secondary/80 transition-colors duration-300 font-medium text-sm group/cta"
                >
                  <span>تواصل معنا الآن</span>
                  <ChevronRight className="w-4 h-4 group-hover/cta:translate-x-1 transition-transform duration-300" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Bottom Section */}
        <div className="border-t border-primary-foreground/20 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            
            {/* Copyright */}
            <div className="text-center md:text-right">
              <p className="text-primary-foreground/60 text-lg">
                © 2024 شركة علي صالح الشهري القابضة. جميع الحقوق محفوظة.
              </p>
              <p className="text-primary-foreground/40 text-sm mt-1">
                تم التطوير بأحدث التقنيات العالمية
              </p>
            </div>

            {/* Achievements */}
            <div className="flex flex-wrap gap-3">
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 hover:scale-105 transition-transform duration-200">
                🏆 أفضل شركة قابضة 2024
              </Badge>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 hover:scale-105 transition-transform duration-200">
                🌟 ISO معتمد
              </Badge>
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 hover:scale-105 transition-transform duration-200">
                🚀 رائد التقنية
              </Badge>
            </div>

            {/* Status Indicator */}
            <div className="flex items-center gap-2 text-primary-foreground/60">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm">جميع الأنظمة تعمل بكفاءة</span>
              <Clock className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;