import { useState, useEffect } from "react";
import { PageLayout } from "@/components/PageLayout";
import { ResponsiveContainer } from "@/components/ResponsiveContainer";
import { ResponsiveGrid } from "@/components/ResponsiveGrid";
import { ResponsiveText } from "@/components/ResponsiveText";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

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
  Wifi,
  Play,
  Pause,
  ChevronRight,
  Infinity,
  Layers,
  Settings,
  Monitor,
  Tablet,
  Palette,
  Package,
  PhoneCall
} from "lucide-react";

const About = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activePartner, setActivePartner] = useState(0);
  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const visionRef = useRef(null);
  const partnersRef = useRef(null);
  const valuesRef = useRef(null);
  
  const heroInView = useInView(heroRef, { once: true });
  const statsInView = useInView(statsRef, { once: true });
  const visionInView = useInView(visionRef, { once: true });
  const partnersInView = useInView(partnersRef, { once: true });
  const valuesInView = useInView(valuesRef, { once: true });

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActivePartner(prev => (prev + 1) % globalPartners.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { 
      number: "150+", 
      label: "مشروع منجز", 
      sublabel: "Completed Projects",
      icon: Trophy,
      color: "from-blue-600 to-blue-800",
      delay: 0.1
    },
    { 
      number: "500+", 
      label: "عميل راضٍ", 
      sublabel: "Satisfied Clients",
      icon: Users,
      color: "from-emerald-600 to-emerald-800",
      delay: 0.2
    },
    { 
      number: "2016", 
      label: "سنة التأسيس", 
      sublabel: "Foundation Year",
      icon: Building2,
      color: "from-purple-600 to-purple-800",
      delay: 0.3
    },
    { 
      number: "98%", 
      label: "معدل الرضا", 
      sublabel: "Satisfaction Rate",
      icon: Star,
      color: "from-amber-600 to-amber-800",
      delay: 0.4
    }
  ];

  const globalPartners = [
    {
      name: "Microsoft Azure",
      logo: "🔷",
      category: "Cloud Computing",
      description: "شراكة استراتيجية في الحلول السحابية والذكاء الاصطناعي المتقدم",
      region: "عالمي",
      projects: "40+",
      value: "$2M+",
      technologies: ["Azure AI", "Power Platform", "Office 365", "Dynamics"],
      impact: "تحسين الإنتاجية بنسبة 65%"
    },
    {
      name: "Amazon AWS",
      logo: "☁️",
      category: "Cloud Infrastructure", 
      description: "حلول البنية التحتية السحابية والخدمات المتقدمة للمؤسسات",
      region: "عالمي",
      projects: "35+",
      value: "$1.8M+",
      technologies: ["EC2", "Lambda", "RDS", "S3"],
      impact: "تقليل التكاليف بنسبة 45%"
    },
    {
      name: "Google Cloud",
      logo: "🌐",
      category: "Data Analytics",
      description: "تحليل البيانات الضخمة وحلول التعلم الآلي والذكاء الاصطناعي",
      region: "عالمي",
      projects: "28+",
      value: "$1.5M+",
      technologies: ["BigQuery", "ML Engine", "Kubernetes", "TensorFlow"],
      impact: "تسريع القرارات بنسبة 70%"
    },
    {
      name: "Oracle Corporation",
      logo: "🔴",
      category: "Database Solutions",
      description: "أنظمة إدارة قواعد البيانات المتقدمة والحلول المؤسسية",
      region: "عالمي",
      projects: "22+",
      value: "$1.2M+",
      technologies: ["Oracle Database", "Java", "MySQL", "Cloud Infrastructure"],
      impact: "تحسين الأداء بنسبة 80%"
    },
    {
      name: "SAP",
      logo: "💼",
      category: "Enterprise Software",
      description: "حلول تخطيط موارد المؤسسات والإدارة المالية المتقدمة",
      region: "أوروبا والشرق الأوسط",
      projects: "18+",
      value: "$900K+",
      technologies: ["SAP ERP", "HANA", "SuccessFactors", "Ariba"],
      impact: "تحسين العمليات بنسبة 60%"
    },
    {
      name: "Cisco Systems",
      logo: "🌟",
      category: "Networking & Security",
      description: "حلول الشبكات والأمن السيبراني والاتصالات المتقدمة",
      region: "عالمي",
      projects: "30+",
      value: "$1.3M+",
      technologies: ["Cisco Catalyst", "ASA", "Meraki", "WebEx"],
      impact: "تعزيز الأمان بنسبة 90%"
    }
  ];

  const companyValues = [
    {
      icon: Rocket,
      title: "الابتكار والتطوير",
      description: "نسعى دائماً لاستكشاف آفاق جديدة وتطوير حلول مبتكرة تلبي احتياجات المستقبل وتحقق التميز",
      color: "from-blue-500 to-cyan-500",
      features: ["تقنيات حديثة", "حلول مبتكرة", "رؤية مستقبلية"],
      stats: "200+ مشروع مبتكر"
    },
    {
      icon: Shield,
      title: "الثقة والأمان",
      description: "نبني علاقاتنا على أساس الثقة المتبادلة والشفافية مع أعلى معايير الأمان والحماية",
      color: "from-emerald-500 to-teal-500",
      features: ["شفافية كاملة", "أمان البيانات", "ثقة متبادلة"],
      stats: "99.9% وقت تشغيل"
    },
    {
      icon: Trophy,
      title: "التميز والجودة",
      description: "نلتزم بأعلى معايير الجودة في جميع خدماتنا ونسعى للتميز في كل ما نقوم به",
      color: "from-purple-500 to-pink-500",
      features: ["معايير عالمية", "جودة مضمونة", "أداء متميز"],
      stats: "15+ جائزة تقدير"
    },
    {
      icon: Users,
      title: "الشراكة والتعاون",
      description: "نؤمن بقوة الشراكة والعمل الجماعي لتحقيق أهداف مشتركة وبناء علاقات طويلة الأمد",
      color: "from-orange-500 to-red-500",
      features: ["فريق متخصص", "شراكات قوية", "تعاون مثمر"],
      stats: "500+ شريك عالمي"
    }
  ];

  const expertiseAreas = [
    {
      icon: Monitor,
      title: "تطوير التطبيقات",
      description: "حلول تطبيقات متقدمة للويب والموبايل مع أحدث التقنيات",
      technologies: ["React", "Flutter", "Node.js", "Python"],
      projects: "120+",
      color: "from-blue-600 to-indigo-600"
    },
    {
      icon: Cloud,
      title: "الحلول السحابية",
      description: "خدمات سحابية متطورة لتحسين الأداء وخفض التكاليف",
      technologies: ["AWS", "Azure", "Google Cloud", "DevOps"],
      projects: "85+",
      color: "from-cyan-600 to-blue-600"
    },
    {
      icon: Database,
      title: "إدارة البيانات",
      description: "حلول ذكية لإدارة وتحليل البيانات الضخمة",
      technologies: ["Big Data", "Analytics", "AI/ML", "BI"],
      projects: "60+",
      color: "from-emerald-600 to-teal-600"
    },
    {
      icon: Shield,
      title: "الأمن السيبراني",
      description: "حماية شاملة للأنظمة والبيانات من التهديدات",
      technologies: ["Cybersecurity", "Penetration Testing", "SOC"],
      projects: "45+",
      color: "from-red-600 to-pink-600"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-950">
        
        {/* Hero Section */}
        <motion.section 
          ref={heroRef}
          initial="hidden"
          animate={heroInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="relative py-20 lg:py-32 overflow-hidden"
        >
          {/* Background Effects */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 dark:from-blue-800/30 dark:to-purple-800/30"></div>
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-400/30 to-cyan-400/30 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-400/30 to-pink-400/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>
          </div>

          <ResponsiveContainer className="relative z-10">
            <div className="text-center max-w-5xl mx-auto">
              <motion.div
                variants={itemVariants}
                className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full mb-8 border border-white/20"
              >
                <Globe className="w-6 h-6 text-blue-600 animate-pulse" />
                <span className="text-slate-700 dark:text-slate-300 font-semibold tracking-wide">ASH HOLDING</span>
                <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0">منذ 2016</Badge>
              </motion.div>
              
              <motion.h1 
                variants={itemVariants}
                className="text-5xl lg:text-7xl font-bold bg-gradient-to-r from-blue-700 via-purple-600 to-indigo-700 dark:from-blue-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent mb-8 leading-tight"
              >
                نبني مستقبل التكنولوجيا
                <br />
                <span className="text-4xl lg:text-6xl bg-gradient-to-r from-emerald-600 to-cyan-600 dark:from-emerald-400 dark:to-cyan-400 bg-clip-text text-transparent">
                  بحلول مبتكرة ومتقدمة
                </span>
              </motion.h1>
              
              <motion.p 
                variants={itemVariants}
                className="text-xl lg:text-2xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto mb-12 leading-relaxed"
              >
                شريكك الاستراتيجي في رحلة التحول الرقمي، نقدم حلولاً تقنية متطورة تدعم النمو المستدام وتحقق رؤية المملكة 2030
              </motion.p>

              <motion.div 
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-6 justify-center items-center"
              >
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-6 text-lg rounded-2xl shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300"
                >
                  <Rocket className="w-6 h-6 ml-3" />
                  اكتشف خدماتنا
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-2 border-slate-300 dark:border-slate-600 hover:bg-white/10 backdrop-blur-sm px-10 py-6 text-lg rounded-2xl transition-all duration-300"
                >
                  <Globe className="w-6 h-6 ml-3" />
                  شركاؤنا العالميون
                </Button>
              </motion.div>
            </div>
          </ResponsiveContainer>
        </motion.section>

        {/* Stats Section */}
        <motion.section 
          ref={statsRef}
          initial="hidden"
          animate={statsInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="py-20 relative"
        >
          <ResponsiveContainer>
            <ResponsiveGrid cols="1-2-4" gap="lg">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    whileHover={{ y: -10, scale: 1.05 }}
                    className="group"
                  >
                    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-0 shadow-xl hover:shadow-2xl transition-all duration-500 h-full">
                      <CardContent className="p-8 text-center">
                        <div className={`w-20 h-20 mx-auto mb-6 bg-gradient-to-r ${stat.color} rounded-3xl flex items-center justify-center group-hover:rotate-12 transition-all duration-500 shadow-lg`}>
                          <IconComponent className="w-10 h-10 text-white" />
                        </div>
                        <motion.div 
                          className="text-4xl font-bold text-slate-800 dark:text-white mb-3"
                          initial={{ scale: 0 }}
                          animate={statsInView ? { scale: 1 } : { scale: 0 }}
                          transition={{ delay: stat.delay, type: "spring", stiffness: 200 }}
                        >
                          {stat.number}
                        </motion.div>
                        <div className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">{stat.label}</div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">{stat.sublabel}</div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </ResponsiveGrid>
          </ResponsiveContainer>
        </motion.section>

        {/* Vision & Mission */}
        <motion.section 
          ref={visionRef}
          initial="hidden"
          animate={visionInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="py-24 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md"
        >
          <ResponsiveContainer>
            <ResponsiveGrid cols="1-2" gap="lg" className="items-center">
              <motion.div variants={itemVariants} className="space-y-8">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl shadow-lg">
                    <Eye className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-slate-800 dark:text-white">رؤيتنا</h2>
                </div>
                <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
                  أن نكون الشركة القابضة الرائدة في المنطقة، نساهم في بناء مستقبل تقني مستدام 
                  ومبتكر يخدم المجتمع ويحقق التنمية الاقتصادية المستدامة.
                </p>
                <div className="flex flex-wrap gap-3">
                  {["الريادة التقنية", "الاستدامة", "الابتكار"].map((tag, index) => (
                    <Badge key={index} className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 text-sm">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-8">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl shadow-lg">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-slate-800 dark:text-white">مهمتنا</h2>
                </div>
                <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
                  تمكين الشركات والمؤسسات من تحقيق أهدافها من خلال حلول تقنية متطورة 
                  واستثمارات ذكية تساهم في النمو الاقتصادي وتحقيق رؤية المملكة 2030.
                </p>
                <div className="flex flex-wrap gap-3">
                  {["تمكين الأعمال", "النمو المستدام", "رؤية 2030"].map((tag, index) => (
                    <Badge key={index} className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 text-sm">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </motion.div>
            </ResponsiveGrid>
          </ResponsiveContainer>
        </motion.section>

        {/* Global Partners Section */}
        <motion.section 
          ref={partnersRef}
          initial="hidden"
          animate={partnersInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="py-24 relative overflow-hidden"
        >
          <ResponsiveContainer>
            <div className="text-center mb-16">
              <motion.div 
                variants={itemVariants}
                className="inline-flex items-center gap-3 mb-8 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-full border border-purple-500/20"
              >
                <Globe className="w-8 h-8 text-purple-600 animate-spin" style={{ animationDuration: '8s' }} />
                <span className="text-purple-700 dark:text-purple-300 font-bold text-xl">شركاؤنا العالميون</span>
              </motion.div>
              <motion.h2 
                variants={itemVariants}
                className="text-4xl lg:text-5xl font-bold text-slate-800 dark:text-white mb-6"
              >
                نتعاون مع أفضل الشركات العالمية
              </motion.h2>
              <motion.p 
                variants={itemVariants}
                className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto"
              >
                شراكات استراتيجية مع عمالقة التكنولوجيا لتقديم أحدث الحلول والخدمات المتطورة
              </motion.p>
            </div>

            <ResponsiveGrid cols="1-2-3" gap="lg">
              {globalPartners.map((partner, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -15, scale: 1.02 }}
                  className={`group transition-all duration-500 ${activePartner === index ? 'scale-105' : ''}`}
                >
                  <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border-0 shadow-xl hover:shadow-2xl transition-all duration-500 h-full overflow-hidden">
                    <CardContent className="p-8">
                      <div className="text-center mb-6">
                        <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300 filter drop-shadow-lg">
                          {partner.logo}
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
                          {partner.name}
                        </h3>
                        <Badge className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-0 mb-4">
                          {partner.category}
                        </Badge>
                      </div>
                      
                      <div className="space-y-4">
                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                          {partner.description}
                        </p>
                        
                        <div className="grid grid-cols-2 gap-4 text-center">
                          <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg">
                            <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{partner.projects}</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">مشاريع</div>
                          </div>
                          <div className="bg-emerald-50 dark:bg-emerald-900/30 p-3 rounded-lg">
                            <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{partner.value}</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">القيمة</div>
                          </div>
                        </div>
                        
                        <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                          <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">التقنيات:</div>
                          <div className="flex flex-wrap gap-1">
                            {partner.technologies.slice(0, 3).map((tech, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div className="text-center text-xs text-slate-600 dark:text-slate-300 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 p-3 rounded-lg">
                          <TrendingUp className="w-4 h-4 inline-block ml-1" />
                          {partner.impact}
                        </div>
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
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="py-24 bg-slate-50 dark:bg-slate-900"
        >
          <ResponsiveContainer>
            <div className="text-center mb-16">
              <motion.h2 
                variants={itemVariants}
                className="text-4xl lg:text-5xl font-bold text-slate-800 dark:text-white mb-6"
              >
                مجالات خبرتنا
              </motion.h2>
              <motion.p 
                variants={itemVariants}
                className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto"
              >
                نقدم خدمات متكاملة في جميع مجالات التكنولوجيا الحديثة بأعلى معايير الجودة العالمية
              </motion.p>
            </div>

            <ResponsiveGrid cols="1-2" gap="lg">
              {expertiseAreas.map((area, index) => {
                const IconComponent = area.icon;
                return (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    whileHover={{ scale: 1.05 }}
                    className="group"
                  >
                    <Card className="bg-white dark:bg-slate-800 border-0 shadow-xl hover:shadow-2xl transition-all duration-500 h-full overflow-hidden">
                      <CardContent className="p-8">
                        <div className={`w-16 h-16 mb-6 bg-gradient-to-r ${area.color} rounded-2xl flex items-center justify-center group-hover:rotate-6 transition-all duration-300 shadow-lg`}>
                          <IconComponent className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">{area.title}</h3>
                        <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">{area.description}</p>
                        
                        <div className="flex items-center justify-between mb-4">
                          <Badge className={`bg-gradient-to-r ${area.color} text-white border-0`}>
                            {area.projects} مشروع
                          </Badge>
                        </div>
                        
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
          </ResponsiveContainer>
        </motion.section>

        {/* Company Values */}
        <motion.section 
          ref={valuesRef}
          initial="hidden"
          animate={valuesInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="py-24 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 dark:from-blue-800/10 dark:to-purple-800/10"></div>
          
          <ResponsiveContainer className="relative z-10">
            <div className="text-center mb-16">
              <motion.h2 
                variants={itemVariants}
                className="text-4xl lg:text-5xl font-bold text-slate-800 dark:text-white mb-6"
              >
                قيمنا الأساسية
              </motion.h2>
              <motion.p 
                variants={itemVariants}
                className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto"
              >
                المبادئ التي نؤمن بها ونسعى لتطبيقها في جميع جوانب عملنا وعلاقاتنا
              </motion.p>
            </div>

            <ResponsiveGrid cols="1-2" gap="lg">
              {companyValues.map((value, index) => {
                const IconComponent = value.icon;
                return (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    whileHover={{ y: -10 }}
                    className="group"
                  >
                    <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border-0 shadow-xl hover:shadow-2xl transition-all duration-500 h-full">
                      <CardContent className="p-8">
                        <div className={`w-20 h-20 mb-6 bg-gradient-to-r ${value.color} rounded-3xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}>
                          <IconComponent className="w-10 h-10 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">{value.title}</h3>
                        <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">{value.description}</p>
                        
                        <div className="space-y-3 mb-6">
                          {value.features.map((feature, i) => (
                            <div key={i} className="flex items-center gap-3">
                              <CheckCircle className="w-5 h-5 text-emerald-500" />
                              <span className="text-slate-600 dark:text-slate-300">{feature}</span>
                            </div>
                          ))}
                        </div>
                        
                        <div className={`text-center p-4 bg-gradient-to-r ${value.color} bg-opacity-10 rounded-xl`}>
                          <div className="text-lg font-bold text-slate-800 dark:text-white">{value.stats}</div>
                        </div>
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
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="py-24 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-800 dark:to-purple-800 text-white relative overflow-hidden"
        >
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-full h-full opacity-20">
              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-300 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>
          </div>
          
          <ResponsiveContainer className="relative z-10 text-center">
            <motion.h2 
              variants={itemVariants}
              className="text-4xl lg:text-5xl font-bold mb-6"
            >
              ابدأ رحلة التحول الرقمي معنا
            </motion.h2>
            <motion.p 
              variants={itemVariants}
              className="text-xl mb-12 max-w-3xl mx-auto opacity-90"
            >
              انضم إلى مئات الشركات التي وثقت بنا لتحويل أعمالها وتحقيق أهدافها التقنية
            </motion.p>
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-6 justify-center"
            >
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-slate-100 px-10 py-6 text-lg rounded-2xl shadow-2xl hover:shadow-white/25 transform hover:scale-105 transition-all duration-300"
              >
                <PhoneCall className="w-6 h-6 ml-3" />
                تواصل معنا اليوم
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-white text-white hover:bg-white/10 backdrop-blur-sm px-10 py-6 text-lg rounded-2xl transition-all duration-300"
              >
                <Package className="w-6 h-6 ml-3" />
                اطلب عرض سعر
              </Button>
            </motion.div>
          </ResponsiveContainer>
        </motion.section>
      </div>
    </PageLayout>
  );
};

export default About;