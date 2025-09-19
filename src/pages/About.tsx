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
          className="text-center mb-16 md:mb-24"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-6">
            <Globe className="w-5 h-5 text-primary" />
            <span className="text-primary font-semibold">شركة آل الشهري القابضة</span>
          </div>
          
          <ResponsiveText size="3xl" weight="bold" color="primary" className="mb-6 leading-tight">
            نبني مستقبل التكنولوجيا
            <br />
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              بحلول مبتكرة ومتقدمة
            </span>
          </ResponsiveText>
          
          <ResponsiveText size="lg" color="secondary" className="max-w-3xl mx-auto mb-8">
            شريكك الاستراتيجي في رحلة التحول الرقمي، نقدم حلولاً تقنية متطورة تدعم النمو المستدام وتحقق رؤية المملكة 2030
          </ResponsiveText>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="px-8 py-6 text-lg">
              تعرف على خدماتنا
              <ArrowRight className="w-5 h-5 mr-2" />
            </Button>
            <Button size="lg" variant="outline" className="px-8 py-6 text-lg">
              شركاؤنا العالميون
              <Globe className="w-5 h-5 mr-2" />
            </Button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-20"
        >
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
                  <Card className="group bg-gradient-to-br from-card to-card/50 backdrop-blur-md border-primary/20 hover:border-primary/40 transition-all duration-300 hover:scale-105 hover-scale">
                    <CardContent className="p-6 text-center">
                      <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <div className="text-3xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform duration-300">
                        {stat.number}
                      </div>
                      <div className="font-semibold text-foreground mb-1">{stat.label}</div>
                      <div className="text-sm text-muted-foreground">{stat.sublabel}</div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </ResponsiveGrid>
        </motion.div>

        {/* Vision & Mission */}
        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="py-16 md:py-24 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 relative rounded-3xl mb-20 overflow-hidden"
        >
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <ResponsiveContainer className="relative">
            <ResponsiveGrid cols="1-2" gap="lg" className="items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-primary/10 rounded-xl">
                    <Eye className="w-8 h-8 text-primary" />
                  </div>
                  <ResponsiveText size="2xl" weight="bold" color="primary">رؤيتنا</ResponsiveText>
                </div>
                <ResponsiveText size="lg" color="secondary" className="leading-relaxed mb-6">
                  أن نكون الشركة القابضة الرائدة في المنطقة، نساهم في بناء مستقبل تقني مستدام 
                  ومبتكر يخدم المجتمع ويحقق التنمية الاقتصادية المستدامة.
                </ResponsiveText>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-gradient-to-r from-primary to-secondary text-white px-4 py-2">الريادة التقنية</Badge>
                  <Badge className="bg-gradient-to-r from-secondary to-accent text-white px-4 py-2">الاستدامة</Badge>
                  <Badge className="bg-gradient-to-r from-accent to-primary text-white px-4 py-2">الابتكار</Badge>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-secondary/10 rounded-xl">
                    <Target className="w-8 h-8 text-secondary" />
                  </div>
                  <ResponsiveText size="2xl" weight="bold" color="primary">مهمتنا</ResponsiveText>
                </div>
                <ResponsiveText size="lg" color="secondary" className="leading-relaxed mb-6">
                  تمكين الشركات والمؤسسات من تحقيق أهدافها من خلال حلول تقنية متطورة 
                  واستثمارات ذكية تساهم في النمو الاقتصادي وتحقيق رؤية المملكة 2030.
                </ResponsiveText>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-gradient-to-r from-primary to-accent text-white px-4 py-2">تمكين الأعمال</Badge>
                  <Badge className="bg-gradient-to-r from-secondary to-primary text-white px-4 py-2">النمو المستدام</Badge>
                  <Badge className="bg-gradient-to-r from-accent to-secondary text-white px-4 py-2">رؤية 2030</Badge>
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
          className="mb-20"
        >
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 mb-6 p-3 bg-secondary/10 rounded-full">
              <Globe className="w-6 h-6 text-secondary animate-pulse" />
              <span className="text-secondary font-semibold">شركاؤنا العالميون</span>
            </div>
            <ResponsiveText size="3xl" weight="bold" color="primary" className="mb-6">
              نتعاون مع أفضل الشركات العالمية
            </ResponsiveText>
            <ResponsiveText size="lg" color="secondary" className="max-w-3xl mx-auto">
              شراكات استراتيجية مع عمالقة التكنولوجيا لتقديم أحدث الحلول والخدمات
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
                <Card className="group bg-gradient-to-br from-card to-card/50 backdrop-blur-md border-secondary/20 hover:border-secondary/40 transition-all duration-300 hover:scale-105 hover-scale h-full">
                  <CardContent className="p-6 text-center h-full flex flex-col">
                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                      {partner.logo}
                    </div>
                    <ResponsiveText size="lg" weight="semibold" color="primary" className="mb-2">
                      {partner.name}
                    </ResponsiveText>
                    <Badge className="mb-4 bg-secondary/10 text-secondary">
                      {partner.category}
                    </Badge>
                    <ResponsiveText size="sm" color="secondary" className="mb-4 flex-grow">
                      {partner.description}
                    </ResponsiveText>
                    <div className="text-xs text-muted-foreground">
                      📍 {partner.region}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </ResponsiveGrid>
        </motion.section>

        {/* Expertise Areas */}
        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mb-20"
        >
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 mb-6 p-3 bg-accent/10 rounded-full">
              <Rocket className="w-6 h-6 text-accent animate-pulse" />
              <span className="text-accent font-semibold">مجالات خبرتنا</span>
            </div>
            <ResponsiveText size="3xl" weight="bold" color="primary" className="mb-6">
              حلول تقنية شاملة ومتطورة
            </ResponsiveText>
            <ResponsiveText size="lg" color="secondary" className="max-w-3xl mx-auto">
              نقدم خدمات متكاملة في جميع مجالات التكنولوجيا الحديثة
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
                  <Card className="group bg-gradient-to-br from-card to-card/50 backdrop-blur-md border-accent/20 hover:border-accent/40 transition-all duration-300 hover:scale-105 hover-scale h-full">
                    <CardContent className="p-8 h-full">
                      <div className="p-3 bg-accent/10 rounded-2xl w-fit mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                        <IconComponent className="w-8 h-8 text-accent" />
                      </div>
                      
                      <ResponsiveText size="xl" weight="semibold" color="primary" className="mb-4">
                        {area.title}
                      </ResponsiveText>
                      
                      <ResponsiveText size="base" color="secondary" className="mb-6 leading-relaxed">
                        {area.description}
                      </ResponsiveText>

                      <div className="flex flex-wrap gap-2">
                        {area.technologies.map((tech, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
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
        </motion.section>

        {/* Company Values */}
        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="mb-20"
        >
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 mb-6 p-3 bg-primary/10 rounded-full">
              <Star className="w-6 h-6 text-primary animate-pulse" />
              <span className="text-primary font-semibold">قيمنا الأساسية</span>
            </div>
            <ResponsiveText size="3xl" weight="bold" color="primary" className="mb-6">
              القيم التي تقودنا للتميز
            </ResponsiveText>
            <ResponsiveText size="lg" color="secondary" className="max-w-3xl mx-auto">
              المبادئ الأساسية التي تحكم كل قرار نتخذه وكل خطوة نخطوها
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
                  <Card className="group bg-gradient-to-br from-card to-card/50 backdrop-blur-md border-primary/20 hover:border-primary/40 transition-all duration-500 overflow-hidden hover-scale h-full">
                    <CardContent className="p-8 relative h-full">
                      <div className={`absolute inset-0 bg-gradient-to-br ${value.color} opacity-0 group-hover:opacity-5 transition-all duration-500`} />
                      
                      <div className="relative">
                        <div className={`w-16 h-16 bg-gradient-to-br ${value.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                          <IconComponent className="w-8 h-8 text-white" />
                        </div>
                        
                        <ResponsiveText size="xl" weight="semibold" color="primary" className="mb-4">
                          {value.title}
                        </ResponsiveText>
                        
                        <ResponsiveText size="base" color="secondary" className="leading-relaxed mb-6">
                          {value.description}
                        </ResponsiveText>

                        <div className="space-y-2">
                          {value.features.map((feature, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                              <span className="text-sm text-muted-foreground">{feature}</span>
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
        </motion.section>

        {/* Call to Action */}
        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="py-16 md:py-24 bg-gradient-to-r from-primary via-secondary to-accent relative overflow-hidden rounded-3xl"
        >
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
          <ResponsiveContainer className="text-center relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.4 }}
            >
              <ResponsiveText size="3xl" weight="bold" className="text-white mb-6 leading-tight">
                ابدأ رحلتك معنا اليوم
              </ResponsiveText>
              
              <ResponsiveText size="lg" className="text-white/90 mb-8 max-w-2xl mx-auto">
                انضم إلى المئات من العملاء الذين يثقون بخبرتنا وخدماتنا المتميزة في رحلة التحول الرقمي
              </ResponsiveText>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  variant="secondary"
                  className="bg-white text-primary hover:bg-white/90 px-8 py-6 text-lg font-semibold hover-scale"
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
                  className="border-2 border-white text-white hover:bg-white/10 px-8 py-6 text-lg font-semibold hover-scale"
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