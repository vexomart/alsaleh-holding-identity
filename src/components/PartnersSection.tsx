import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Star,
  TrendingUp,
  Users,
  Globe,
  ArrowRight,
  CheckCircle,
  Award,
  Handshake
} from "lucide-react";
import { Link } from "react-router-dom";

const partners = [
  {
    id: 1,
    name: "مايكروسوفت",
    nameEn: "Microsoft",
    logo: "/src/assets/partners/microsoft-logo.png",
    category: "التقنية السحابية",
    description: "شريك تقني في حلول Azure والحوسبة السحابية",
    type: "platinum",
    since: "2020"
  },
  {
    id: 2,
    name: "أمازون",
    nameEn: "Amazon Web Services",
    logo: "/src/assets/partners/aws-logo.png",
    category: "الخدمات السحابية",
    description: "شريك معتمد في خدمات AWS وحلول البنية التحتية",
    type: "platinum",
    since: "2019"
  },
  {
    id: 3,
    name: "جوجل",
    nameEn: "Google Cloud",
    logo: "/src/assets/partners/google-cloud-logo.png",
    category: "الذكاء الاصطناعي",
    description: "شريك في تطوير حلول الذكاء الاصطناعي والتعلم الآلي",
    type: "gold",
    since: "2021"
  },
  {
    id: 4,
    name: "فيجما",
    nameEn: "Figma",
    logo: "/src/assets/partners/figma-logo.png",
    category: "التصميم",
    description: "شريك في أدوات التصميم والنماذج التفاعلية",
    type: "gold",
    since: "2022"
  },
  {
    id: 5,
    name: "مونجو دي بي",
    nameEn: "MongoDB",
    logo: "/src/assets/partners/mongodb-logo.png",
    category: "قواعد البيانات",
    description: "شريك في حلول قواعد البيانات المتقدمة",
    type: "silver",
    since: "2021"
  },
  {
    id: 6,
    name: "دوكر",
    nameEn: "Docker",
    logo: "/src/assets/partners/docker-logo.png",
    category: "التطوير",
    description: "شريك في حلول الحاويات والنشر المتقدم",
    type: "silver",
    since: "2022"
  },
  {
    id: 7,
    name: "كوبرنيتس",
    nameEn: "Kubernetes",
    logo: "/src/assets/partners/kubernetes-logo.svg",
    category: "البنية التحتية",
    description: "شريك في إدارة الحاويات والتطبيقات الموزعة",
    type: "silver",
    since: "2023"
  },
  {
    id: 8,
    name: "AWS",
    nameEn: "AWS Clean",
    logo: "/src/assets/partners/aws-clean-logo.png",
    category: "الحلول المتقدمة",
    description: "شريك في الحلول السحابية المتقدمة والأمان",
    type: "platinum",
    since: "2020"
  }
];

const partnerTypes = {
  platinum: {
    color: "from-slate-400 to-slate-600",
    bgColor: "bg-slate-500/10",
    borderColor: "border-slate-500/20",
    textColor: "text-slate-400",
    label: "شريك بلاتيني"
  },
  gold: {
    color: "from-yellow-400 to-yellow-600",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/20",
    textColor: "text-yellow-500",
    label: "شريك ذهبي"
  },
  silver: {
    color: "from-gray-400 to-gray-600",
    bgColor: "bg-gray-500/10",
    borderColor: "border-gray-500/20",
    textColor: "text-gray-400",
    label: "شريك فضي"
  }
};

const PartnersSection = () => {
  const [hoveredPartner, setHoveredPartner] = useState<number | null>(null);

  const achievements = [
    {
      icon: Users,
      value: "50+",
      label: "شراكة استراتيجية",
      color: "text-blue-500"
    },
    {
      icon: Globe,
      value: "15",
      label: "دولة حول العالم",
      color: "text-green-500"
    },
    {
      icon: Award,
      value: "25+",
      label: "جائزة تميز",
      color: "text-purple-500"
    },
    {
      icon: TrendingUp,
      value: "95%",
      label: "معدل نجاح المشاريع",
      color: "text-orange-500"
    }
  ];

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background with Beautiful Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-secondary/5 to-primary/10"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-accent/8 via-transparent to-secondary/5"></div>
      
      {/* Animated Background Elements */}
      <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-br from-secondary/20 to-accent/10 rounded-full blur-2xl animate-pulse"></div>
      <div className="absolute bottom-20 left-20 w-40 h-40 bg-gradient-to-br from-primary/15 to-secondary/8 rounded-full blur-2xl animate-float"></div>
      <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-gradient-to-br from-accent/8 to-primary/6 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

      {/* Floating Geometric Elements */}
      <div className="absolute top-40 left-1/4 w-4 h-4 bg-secondary/30 rotate-45 animate-bounce" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-40 right-1/4 w-3 h-3 bg-primary/40 rounded-full animate-pulse" style={{ animationDelay: '3s' }}></div>
      <div className="absolute top-60 right-10 w-2 h-2 bg-accent/50 animate-ping" style={{ animationDelay: '4s' }}></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16 animate-fade-in">
          <Badge className="mb-4 bg-secondary/10 text-secondary border-secondary/20 px-4 py-2">
            <Handshake className="w-4 h-4 mr-2" />
            شركاؤنا في النجاح
          </Badge>
          
          <h2 className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-br from-foreground via-secondary/80 to-primary/60 bg-clip-text text-transparent">
            شراكات عالمية مميزة
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            نفخر بشراكاتنا الاستراتيجية مع أكبر الشركات التقنية العالمية
            <br />
            لنقدم لك أفضل الحلول والخدمات المبتكرة
          </p>
        </div>

        {/* Achievements Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {achievements.map((achievement, index) => {
            const IconComponent = achievement.icon;
            return (
              <Card key={index} className="text-center group hover:scale-105 transition-all duration-300 bg-background/50 backdrop-blur-sm border-border/50">
                <CardContent className="p-6">
                  <div className={`w-16 h-16 ${achievement.color.replace('text-', 'bg-')}/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className={`w-8 h-8 ${achievement.color}`} />
                  </div>
                  <div className="text-2xl font-bold text-foreground mb-2">{achievement.value}</div>
                  <div className="text-sm text-muted-foreground">{achievement.label}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 mb-16">
          {partners.map((partner, index) => {
            const partnerStyle = partnerTypes[partner.type as keyof typeof partnerTypes];
            const isHovered = hoveredPartner === partner.id;
            
            return (
              <Card
                key={partner.id}
                className={`
                  group relative overflow-hidden transition-all duration-500 ease-out
                  hover:scale-110 hover:shadow-xl hover:shadow-primary/20
                  ${partnerStyle.bgColor} ${partnerStyle.borderColor}
                  backdrop-blur-sm border animate-fade-in aspect-square
                `}
                style={{ animationDelay: `${index * 0.05}s` }}
                onMouseEnter={() => setHoveredPartner(partner.id)}
                onMouseLeave={() => setHoveredPartner(null)}
              >
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${partnerStyle.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                
                {/* Partner Type Badge - Only for larger screens */}
                <div className="absolute top-1 right-1 z-20 hidden sm:block">
                  <div className={`w-2 h-2 rounded-full ${partnerStyle.color.replace('from-', 'bg-').replace(' to-slate-600', '').replace(' to-yellow-600', '').replace(' to-gray-600', '')} opacity-60`}></div>
                </div>

                {/* Simplified Corner Element */}
                <div className="absolute top-0 left-0 w-8 h-8 bg-gradient-to-br from-primary/5 to-transparent rounded-br-full transform -translate-x-2 -translate-y-2 group-hover:-translate-x-1 group-hover:-translate-y-1 transition-transform duration-500"></div>

                <CardContent className="p-3 relative z-10 h-full flex flex-col items-center justify-center">
                  {/* Logo Section - Simplified */}
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-full h-full bg-white/95 rounded-lg flex items-center justify-center p-2 group-hover:bg-white transition-colors duration-300 shadow-sm max-w-[80px] max-h-[80px]">
                      <img 
                        src={partner.logo} 
                        alt={`${partner.name} logo`} 
                        className="max-w-full max-h-full object-contain opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.parentElement!.innerHTML = `<div class="text-lg font-bold ${partnerStyle.textColor}">${partner.nameEn.substring(0, 2)}</div>`;
                        }}
                      />
                    </div>
                  </div>

                  {/* Tooltip Content - Shows on Hover */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-30">
                    <div className="bg-background/95 backdrop-blur-sm border border-border/50 rounded-lg p-3 shadow-lg min-w-[200px]">
                      <div className="text-center">
                        <h4 className="text-sm font-semibold text-foreground mb-1">
                          {partner.name}
                        </h4>
                        <p className="text-xs text-muted-foreground mb-2">
                          {partner.category}
                        </p>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {partner.description}
                        </p>
                        <div className="flex items-center justify-center mt-2 text-xs">
                          <CheckCircle className="w-3 h-3 text-green-500 mr-1" />
                          <span className="text-muted-foreground">شريك منذ {partner.since}</span>
                        </div>
                      </div>
                      {/* Tooltip Arrow */}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-background/95"></div>
                    </div>
                  </div>
                </CardContent>

                {/* Subtle Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              </Card>
            );
          })}
        </div>

        {/* Partnership Benefits */}
        <div className="bg-gradient-to-r from-primary/10 via-secondary/5 to-accent/10 rounded-3xl p-8 backdrop-blur-sm border border-primary/20 mb-16">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-4 text-foreground">
              فوائد شراكاتنا الاستراتيجية
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              تمكننا شراكاتنا من تقديم حلول متطورة وخدمات عالية الجودة
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-blue-500" />
              </div>
              <h4 className="text-lg font-semibold mb-2">تقنيات متطورة</h4>
              <p className="text-sm text-muted-foreground">
                الوصول إلى أحدث التقنيات والأدوات المتطورة
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-green-500" />
              </div>
              <h4 className="text-lg font-semibold mb-2">شهادات معتمدة</h4>
              <p className="text-sm text-muted-foreground">
                فريق معتمد من أكبر الشركات التقنية العالمية
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-purple-500" />
              </div>
              <h4 className="text-lg font-semibold mb-2">دعم مستمر</h4>
              <p className="text-sm text-muted-foreground">
                دعم تقني مستمر من الشركاء لضمان أفضل الحلول
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center animate-fade-in" style={{ animationDelay: '0.8s' }}>
          <div className="bg-gradient-to-r from-secondary/10 via-primary/5 to-accent/10 rounded-3xl p-8 backdrop-blur-sm border border-secondary/20">
            <h3 className="text-2xl font-bold mb-4 text-foreground">
              هل تريد أن تصبح شريكاً معنا؟
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              انضم إلى شبكة شركائنا واستفد من فرص التعاون والنمو المشترك
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/partnerships">
                <Button size="lg" className="group px-8">
                  اعرف المزيد عن الشراكات
                  <ArrowRight className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" size="lg" className="px-8">
                  تواصل معنا للشراكة
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;