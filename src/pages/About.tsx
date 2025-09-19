import { useState, useEffect } from "react";
import { PageLayout } from "@/components/PageLayout";
import { ResponsiveContainer } from "@/components/ResponsiveContainer";
import { ResponsiveGrid } from "@/components/ResponsiveGrid";
import { ResponsiveText } from "@/components/ResponsiveText";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

import { 
  Users, 
  Target, 
  Heart, 
  Trophy, 
  Globe, 
  Zap, 
  Shield, 
  Star,
  TrendingUp,
  Award,
  CheckCircle,
  Lightbulb,
  Building2,
  Clock,
  MapPin,
  Calendar,
  Crown,
  Sparkles,
  ArrowRight,
  Quote,
  Eye,
  Compass,
  Rocket,
  BarChart3,
  UserCheck,
  Handshake,
  Briefcase,
  Laptop,
  Smartphone,
  Database,
  Cloud,
  Code,
  Cpu,
  Network,
  Wifi
} from "lucide-react";

const About = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const stats = [
    { 
      number: "50+", 
      label: "مشروع منجز", 
      sublabel: "Completed Projects",
      icon: Trophy,
      color: "from-primary to-primary-foreground"
    },
    { 
      number: "100+", 
      label: "عميل راضٍ", 
      sublabel: "Satisfied Clients",
      icon: Users,
      color: "from-secondary to-accent"
    },
    { 
      number: "2016", 
      label: "سنة التأسيس", 
      sublabel: "Foundation Year",
      icon: Building2,
      color: "from-primary to-secondary"
    },
    { 
      number: "98%", 
      label: "معدل الرضا", 
      sublabel: "Satisfaction Rate",
      icon: Star,
      color: "from-accent to-primary"
    }
  ];

  const globalPartners = [
    {
      name: "Microsoft Azure",
      logo: "🔷",
      category: "Cloud Computing",
      description: "شراكة استراتيجية في الحلول السحابية والذكاء الاصطناعي",
      region: "عالمي"
    },
    {
      name: "Amazon AWS",
      logo: "☁️",
      category: "Cloud Infrastructure", 
      description: "حلول البنية التحتية السحابية والخدمات المتقدمة",
      region: "عالمي"
    },
    {
      name: "Google Cloud",
      logo: "🌐",
      category: "Data Analytics",
      description: "تحليل البيانات الضخمة وحلول التعلم الآلي",
      region: "عالمي"
    },
    {
      name: "Oracle",
      logo: "🔴",
      category: "Database Solutions",
      description: "أنظمة إدارة قواعد البيانات المتقدمة",
      region: "عالمي"
    },
    {
      name: "SAP",
      logo: "💼",
      category: "Enterprise Software",
      description: "حلول تخطيط موارد المؤسسات",
      region: "أوروبا والشرق الأوسط"
    },
    {
      name: "Cisco",
      logo: "🌟",
      category: "Networking",
      description: "حلول الشبكات والأمن السيبراني",
      region: "عالمي"
    }
  ];

  const companyValues = [
    {
      icon: Heart,
      title: "الشغف والالتزام",
      description: "نؤمن بقوة الشغف في تحقيق التميز وتقديم أفضل الحلول التقنية المبتكرة",
      color: "from-primary to-primary-foreground",
      features: ["التميز في الخدمة", "الالتزام بالمواعيد", "جودة عالية"]
    },
    {
      icon: Shield,
      title: "الثقة والشفافية",
      description: "نبني علاقاتنا على أساس الثقة المتبادلة والشفافية في جميع تعاملاتنا",
      color: "from-secondary to-accent",
      features: ["شفافية كاملة", "أمان البيانات", "ثقة متبادلة"]
    },
    {
      icon: Lightbulb,
      title: "الابتكار والإبداع",
      description: "نسعى دائماً لاستكشاف آفاق جديدة وتطوير حلول مبتكرة تلبي احتياجات المستقبل",
      color: "from-accent to-primary",
      features: ["تقنيات حديثة", "حلول مبتكرة", "رؤية مستقبلية"]
    },
    {
      icon: Trophy,
      title: "التميز والجودة",
      description: "نلتزم بأعلى معايير الجودة في جميع خدماتنا ونسعى للتميز في كل ما نقوم به",
      color: "from-primary to-secondary",
      features: ["معايير عالمية", "جودة مضمونة", "أداء متميز"]
    }
  ];

  const expertiseAreas = [
    {
      icon: Laptop,
      title: "تطوير البرمجيات",
      description: "حلول برمجية متقدمة ومخصصة لجميع احتياجات الأعمال",
      technologies: ["React", "Node.js", "Python", "Mobile Apps"]
    },
    {
      icon: Cloud,
      title: "الحلول السحابية",
      description: "خدمات سحابية متطورة لتحسين الأداء وخفض التكاليف",
      technologies: ["AWS", "Azure", "Google Cloud", "DevOps"]
    },
    {
      icon: Database,
      title: "إدارة البيانات",
      description: "حلول ذكية لإدارة وتحليل البيانات الضخمة",
      technologies: ["Big Data", "Analytics", "AI/ML", "Business Intelligence"]
    },
    {
      icon: Shield,
      title: "الأمن السيبراني",
      description: "حماية شاملة للأنظمة والبيانات من التهديدات السيبرانية",
      technologies: ["Cybersecurity", "Penetration Testing", "Security Audits"]
    }
  ];

  return (
    <PageLayout>
      <ResponsiveContainer className="py-8 md:py-16">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="section-corporate-hero py-16 md:py-24 rounded-3xl mb-16 md:mb-24 text-center"
        >
          <div className="bg-executive-pattern absolute inset-0 opacity-30"></div>
          <div className="relative">
            <div className="inline-flex items-center gap-2 bg-primary/10 backdrop-blur-sm px-6 py-3 rounded-full mb-8 border border-primary/20">
              <Globe className="w-5 h-5 text-primary" />
              <span className="text-primary font-executive-bold">ASH HOLDING</span>
            </div>
            
             <ResponsiveText size="3xl" className="font-title-executive text-primary mb-6 leading-tight">
               نبني مستقبل التكنولوجيا بحلول مبتكرة ومتقدمة
             </ResponsiveText>
             
             <ResponsiveText size="lg" className="font-executive text-muted-foreground max-w-4xl mx-auto mb-8 leading-relaxed text-center">
               شريكك الاستراتيجي في رحلة التحول الرقمي، نقدم حلولاً تقنية متطورة تدعم النمو المستدام وتحقق رؤية المملكة 2030
             </ResponsiveText>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="font-executive-medium px-8 py-6 text-lg shadow-glow hover:shadow-xl">
                تعرف على خدماتنا
                <ArrowRight className="w-5 h-5 mr-2" />
              </Button>
              <Button size="lg" variant="outline" className="font-executive-medium px-8 py-6 text-lg border-2 hover:bg-primary/5">
                شركاؤنا العالميون
                <Globe className="w-5 h-5 mr-2" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="section-executive py-12 rounded-2xl mb-20"
        >
          <ResponsiveContainer>
            <ResponsiveGrid cols="1-2-4" gap="lg">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="card-executive group text-center h-full">
                      <CardContent className="p-8">
                        <div className={`w-20 h-20 mx-auto mb-6 bg-gradient-to-r ${stat.color} rounded-3xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}>
                          <IconComponent className="w-10 h-10 text-white" />
                        </div>
                        <div className="font-title-executive text-4xl text-primary mb-3 group-hover:scale-110 transition-transform duration-300">
                          {stat.number}
                        </div>
                        <div className="font-executive-bold text-foreground mb-2 text-lg">{stat.label}</div>
                        <div className="font-executive text-sm text-muted-foreground">{stat.sublabel}</div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </ResponsiveGrid>
          </ResponsiveContainer>
        </motion.div>

        {/* Vision & Mission */}
        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="section-executive py-16 md:py-24 rounded-3xl mb-20 overflow-hidden"
        >
          <div className="bg-executive-pattern absolute inset-0 opacity-20"></div>
          <ResponsiveContainer className="relative">
            <ResponsiveGrid cols="1-2" gap="lg" className="items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20">
                    <Eye className="w-10 h-10 text-primary" />
                  </div>
                  <ResponsiveText size="2xl" className="font-title-executive text-primary">رؤيتنا</ResponsiveText>
                </div>
                <ResponsiveText size="lg" className="font-executive text-muted-foreground leading-relaxed mb-8">
                  أن نكون الشركة القابضة الرائدة في المنطقة، نساهم في بناء مستقبل تقني مستدام 
                  ومبتكر يخدم المجتمع ويحقق التنمية الاقتصادية المستدامة.
                </ResponsiveText>
                <div className="flex flex-wrap gap-3">
                  <Badge className="bg-gradient-to-r from-primary to-primary-variant text-white px-4 py-2 font-executive-medium">الريادة التقنية</Badge>
                  <Badge className="bg-gradient-to-r from-secondary to-secondary-dark text-white px-4 py-2 font-executive-medium">الاستدامة</Badge>
                  <Badge className="bg-gradient-to-r from-accent to-accent-light text-white px-4 py-2 font-executive-medium">الابتكار</Badge>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-secondary/10 rounded-2xl border border-secondary/20">
                    <Target className="w-10 h-10 text-secondary" />
                  </div>
                  <ResponsiveText size="2xl" className="font-title-executive text-primary">مهمتنا</ResponsiveText>
                </div>
                <ResponsiveText size="lg" className="font-executive text-muted-foreground leading-relaxed mb-8">
                  تمكين الشركات والمؤسسات من تحقيق أهدافها من خلال حلول تقنية متطورة 
                  واستثمارات ذكية تساهم في النمو الاقتصادي وتحقيق رؤية المملكة 2030.
                </ResponsiveText>
                <div className="flex flex-wrap gap-3">
                  <Badge className="bg-gradient-to-r from-primary to-accent text-white px-4 py-2 font-executive-medium">تمكين الأعمال</Badge>
                  <Badge className="bg-gradient-to-r from-secondary to-primary text-white px-4 py-2 font-executive-medium">النمو المستدام</Badge>
                  <Badge className="bg-gradient-to-r from-accent to-secondary text-white px-4 py-2 font-executive-medium">رؤية 2030</Badge>
                </div>
              </motion.div>
            </ResponsiveGrid>
          </ResponsiveContainer>
        </motion.section>

        {/* Global Partners Section */}
        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="section-partners py-16 rounded-2xl mb-20"
        >
          <ResponsiveContainer>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-3 mb-8 p-4 bg-secondary/10 backdrop-blur-sm rounded-full border border-secondary/20">
                <Globe className="w-7 h-7 text-secondary animate-pulse" />
                <span className="text-secondary font-executive-bold text-lg">شركاؤنا العالميون</span>
              </div>
              <ResponsiveText size="3xl" className="font-title-executive text-primary mb-6">
                نتعاون مع أفضل الشركات العالمية
              </ResponsiveText>
              <ResponsiveText size="lg" className="font-executive text-muted-foreground max-w-3xl mx-auto">
                شراكات استراتيجية مع عمالقة التكنولوجيا لتقديم أحدث الحلول والخدمات المتطورة
              </ResponsiveText>
            </div>

            <ResponsiveGrid cols="1-2-3" gap="lg">
              {globalPartners.map((partner, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="card-executive group text-center h-full">
                    <CardContent className="p-8 h-full flex flex-col">
                      <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">
                        {partner.logo}
                      </div>
                      <ResponsiveText size="lg" className="font-executive-bold text-primary mb-3">
                        {partner.name}
                      </ResponsiveText>
                      <Badge className="mb-4 bg-secondary/10 text-secondary border-secondary/20 font-executive-medium">
                        {partner.category}
                      </Badge>
                      <ResponsiveText size="sm" className="font-executive text-muted-foreground mb-6 flex-grow leading-relaxed">
                        {partner.description}
                      </ResponsiveText>
                      <div className="text-xs text-muted-foreground font-executive-medium flex items-center justify-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {partner.region}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </ResponsiveGrid>
          </ResponsiveContainer>
        </motion.section>

        {/* Expertise Areas */}
        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="section-expertise py-16 rounded-2xl mb-20"
        >
          <ResponsiveContainer>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-3 mb-8 p-4 bg-accent/10 backdrop-blur-sm rounded-full border border-accent/20">
                <Rocket className="w-7 h-7 text-accent animate-pulse" />
                <span className="text-accent font-executive-bold text-lg">مجالات خبرتنا</span>
              </div>
              <ResponsiveText size="3xl" className="font-title-executive text-primary mb-6">
                حلول تقنية شاملة ومتطورة
              </ResponsiveText>
              <ResponsiveText size="lg" className="font-executive text-muted-foreground max-w-3xl mx-auto">
                نقدم خدمات متكاملة في جميع مجالات التكنولوجيا الحديثة بأعلى معايير الجودة العالمية
              </ResponsiveText>
            </div>

            <ResponsiveGrid cols="1-2" gap="lg">
              {expertiseAreas.map((area, index) => {
                const IconComponent = area.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="card-executive group h-full">
                      <CardContent className="p-8 h-full">
                        <div className="p-4 bg-accent/10 rounded-3xl w-fit mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 border border-accent/20">
                          <IconComponent className="w-10 h-10 text-accent" />
                        </div>
                        
                        <ResponsiveText size="xl" className="font-executive-bold text-primary mb-4">
                          {area.title}
                        </ResponsiveText>
                        
                        <ResponsiveText size="base" className="font-executive text-muted-foreground mb-6 leading-relaxed">
                          {area.description}
                        </ResponsiveText>

                        <div className="flex flex-wrap gap-2">
                          {area.technologies.map((tech, i) => (
                            <Badge key={i} variant="outline" className="text-xs font-executive-medium border-accent/30 text-accent">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </ResponsiveGrid>
          </ResponsiveContainer>
        </motion.section>

        {/* Company Values */}
        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="section-values py-16 rounded-2xl mb-20"
        >
          <ResponsiveContainer>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-3 mb-8 p-4 bg-primary/10 backdrop-blur-sm rounded-full border border-primary/20">
                <Star className="w-7 h-7 text-primary animate-pulse" />
                <span className="text-primary font-executive-bold text-lg">قيمنا الأساسية</span>
              </div>
              <ResponsiveText size="3xl" className="font-title-executive text-primary mb-6">
                القيم التي تقودنا للتميز
              </ResponsiveText>
              <ResponsiveText size="lg" className="font-executive text-muted-foreground max-w-3xl mx-auto">
                المبادئ الأساسية التي تحكم كل قرار نتخذه وكل خطوة نخطوها نحو التميز
              </ResponsiveText>
            </div>

            <ResponsiveGrid cols="1-2" gap="lg">
              {companyValues.map((value, index) => {
                const IconComponent = value.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="card-executive group overflow-hidden h-full">
                      <CardContent className="p-8 relative h-full">
                        <div className={`absolute inset-0 bg-gradient-to-br ${value.color} opacity-0 group-hover:opacity-5 transition-all duration-500`} />
                        
                        <div className="relative">
                          <div className={`w-20 h-20 bg-gradient-to-br ${value.color} rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}>
                            <IconComponent className="w-10 h-10 text-white" />
                          </div>
                          
                          <ResponsiveText size="xl" className="font-executive-bold text-primary mb-4">
                            {value.title}
                          </ResponsiveText>
                          
                          <ResponsiveText size="base" className="font-executive text-muted-foreground leading-relaxed mb-6">
                            {value.description}
                          </ResponsiveText>

                          <div className="space-y-3">
                            {value.features.map((feature, i) => (
                              <div key={i} className="flex items-center gap-3">
                                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                                <span className="font-executive-medium text-sm text-muted-foreground">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${value.color} transform scale-x-0 group-hover:scale-x-100 transition-all duration-500`} />
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </ResponsiveGrid>
          </ResponsiveContainer>
        </motion.section>

        {/* Call to Action */}
        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="section-cta-executive py-16 md:py-24 rounded-3xl overflow-hidden"
        >
          <div className="bg-executive-pattern absolute inset-0 opacity-10"></div>
          <ResponsiveContainer className="text-center relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.4 }}
            >
              <ResponsiveText size="3xl" className="font-title-executive text-white mb-6 leading-tight">
                ابدأ رحلتك معنا اليوم
              </ResponsiveText>
              
              <ResponsiveText size="lg" className="font-executive text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
                انضم إلى المئات من العملاء الذين يثقون بخبرتنا وخدماتنا المتميزة في رحلة التحول الرقمي
              </ResponsiveText>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  variant="secondary"
                  className="font-executive-bold bg-white text-primary hover:bg-white/90 px-8 py-6 text-lg shadow-xl hover:scale-105 transition-all duration-300"
                  asChild
                >
                  <a href="/contact">
                    تواصل معنا الآن
                    <ArrowRight className="w-5 h-5 mr-2" />
                  </a>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="font-executive-medium border-2 border-white text-white hover:bg-white/10 px-8 py-6 text-lg hover:scale-105 transition-all duration-300"
                  asChild
                >
                  <a href="https://wa.me/966555812567" target="_blank" rel="noopener noreferrer">
                    واتساب مباشر
                    <Smartphone className="w-5 h-5 mr-2" />
                  </a>
                </Button>
              </div>
            </motion.div>
          </ResponsiveContainer>
        </motion.section>
      </ResponsiveContainer>
    </PageLayout>
  );
};

export default About;