import { useParams, Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft,
  Star,
  Clock,
  DollarSign,
  Users,
  CheckCircle,
  Download,
  Play,
  MessageCircle,
  ExternalLink,
  Shield,
  Globe,
  Zap,
  Code,
  FileText,
  Building2,
  GraduationCap,
  Award,
  TrendingUp,
  Activity,
  Smartphone,
  Database,
  Cloud,
  Settings,
  Target,
  Layers
} from "lucide-react";

const ProjectDetails = () => {
  const { projectId } = useParams();
  
  // بيانات المشاريع (نفس البيانات من ReadyProjects)
  const projects = [
    {
      id: 2,
      title: "نظام إدارة المحتوى المتقدم",
      description: "نظام شامل لإدارة المحتوى الرقمي مع إمكانيات الذكاء الاصطناعي ونشر متعدد القنوات",
      detailedDescription: "نظام إدارة محتوى متطور يدعم النشر على منصات متعددة مع إمكانيات الذكاء الاصطناعي لتحسين المحتوى وتحليل الأداء. يشمل محرر نصوص متقدم، إدارة الوسائط، وأدوات SEO قوية.",
      features: ["إدارة المحتوى", "الذكاء الاصطناعي", "النشر التلقائي", "التحليلات", "محرر متقدم", "تحسين SEO"],
      technologies: ["Vue.js", "Laravel", "MySQL", "Redis", "AI APIs", "AWS"],
      price: "7,999 ريال",
      duration: "3-4 أسابيع للتنفيذ",
      status: "جاهز للنشر",
      category: "أنظمة المحتوى",
      icon: FileText,
      color: "emerald",
      gradient: "from-emerald-500 to-teal-600",
      rating: "4.8",
      clients: "18+",
      updates: "تحديثات مجانية لسنة",
      support: "دعم فني متقدم",
      fullFeatures: [
        "محرر نصوص متقدم بتقنية WYSIWYG",
        "إدارة الوسائط والصور بسهولة",
        "نظام تصنيف المحتوى الذكي",
        "النشر التلقائي على منصات متعددة",
        "تحليلات الأداء المتقدمة",
        "تحسين SEO تلقائي",
        "إدارة المستخدمين والصلاحيات",
        "نظام التعليقات والمراجعة",
        "البحث المتقدم في المحتوى",
        "التكامل مع وسائل التواصل الاجتماعي"
      ],
      screenshots: [
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
      ]
    },
    {
      id: 3,
      title: "تطبيق التجارة الإلكترونية الذكي",
      description: "منصة تجارة إلكترونية شاملة مع تكامل طرق الدفع المحلية والعالمية ونظام إدارة المخزون",
      detailedDescription: "منصة تجارة إلكترونية متكاملة مع نظام دفع آمن يدعم جميع الطرق المحلية (مدى، STC Pay، تابي، تمارا) والعالمية. تشمل إدارة المخزون الذكية، نظام العروض، وتحليلات المبيعات المتقدمة.",
      features: ["متجر إلكتروني", "طرق دفع متعددة", "إدارة المخزون", "تحليلات المبيعات", "نظام العروض", "تطبيق موبايل"],
      technologies: ["Next.js", "Stripe", "PayPal", "MySQL", "PWA", "Firebase"],
      price: "10,000 ريال",
      duration: "4-6 أسابيع للتنفيذ",
      status: "جاهز للنشر",
      category: "التجارة الإلكترونية",
      icon: Building2,
      color: "orange",
      gradient: "from-orange-500 to-red-600",
      rating: "4.7",
      clients: "32+",
      updates: "تحديثات مجانية لسنتين",
      support: "دعم تجاري متخصص",
      fullFeatures: [
        "واجهة متجر حديثة ومتجاوبة",
        "نظام إدارة المنتجات الشامل",
        "عربة تسوق ذكية",
        "طرق دفع متعددة (مدى، فيزا، ماستركارد)",
        "تكامل مع تابي وتمارا للدفع بالتقسيط",
        "نظام إدارة المخزون التلقائي",
        "تحليلات المبيعات المتقدمة",
        "نظام العروض والخصومات",
        "إدارة الطلبات والشحن",
        "تطبيق موبايل متكامل",
        "دعم متعدد اللغات",
        "نظام تقييم المنتجات"
      ],
      screenshots: [
        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1512428813834-c702c7702b78?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
      ]
    },
    {
      id: 4,
      title: "منصة التعلم الذكي",
      description: "منصة تعليمية تفاعلية تستخدم الذكاء الاصطناعي لتخصيص تجربة التعلم لكل طالب",
      detailedDescription: "منصة تعليمية متطورة تستخدم الذكاء الاصطناعي لتحليل أسلوب تعلم كل طالب وتقديم مسار تعليمي مخصص. تحتوي على مكتبة ضخمة من المحتوى التفاعلي، أدوات التقييم، ونظام شهادات معتمد.",
      features: ["التعلم التكيفي", "محتوى تفاعلي", "تتبع التقدم", "شهادات معتمدة", "تحليل الأداء", "مسارات مخصصة"],
      technologies: ["React", "Python", "TensorFlow", "PostgreSQL", "WebRTC", "Docker"],
      price: "17,000 ريال",
      duration: "5-7 أسابيع للتنفيذ",
      status: "جاهز للنشر",
      category: "التعليم التقني",
      icon: GraduationCap,
      color: "purple",
      gradient: "from-purple-500 to-pink-600",
      rating: "4.9",
      clients: "15+",
      updates: "تحديثات المحتوى دورية",
      support: "دعم تعليمي متخصص",
      fullFeatures: [
        "نظام تعلم تكيفي بالذكاء الاصطناعي",
        "مكتبة محتوى تفاعلي شاملة",
        "أدوات تقييم متقدمة",
        "نظام شهادات معتمد دولياً",
        "تحليل تقدم الطلاب بالتفصيل",
        "مسارات تعليمية مخصصة",
        "فصول افتراضية تفاعلية",
        "أدوات التعاون والمناقشة",
        "نظام الواجبات والمشاريع",
        "تكامل مع أنظمة إدارة التعلم",
        "تطبيق موبايل للطلاب",
        "لوحة تحكم للمعلمين والإدارة"
      ],
      screenshots: [
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1501504905252-473c47e087f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
      ]
    },
    {
      id: 5,
      title: "نظام إدارة علاقات العملاء المتطور",
      description: "نظام CRM شامل لإدارة العملاء والمبيعات مع تكامل الذكاء الاصطناعي للتنبؤ بسلوك العملاء",
      detailedDescription: "نظام CRM متقدم يجمع بين إدارة العملاء التقليدية والذكاء الاصطناعي للتنبؤ بسلوك العملاء وتحسين المبيعات. يشمل أتمتة العمليات، تحليل البيانات، وتكامل مع أنظمة المحاسبة.",
      features: ["إدارة العملاء", "أتمتة المبيعات", "التحليلات الذكية", "التكامل مع الأنظمة", "تنبؤات AI", "تقارير متقدمة"],
      technologies: ["Angular", "NestJS", "PostgreSQL", "Redis", "ML Models", "GraphQL"],
      price: "25,000 ريال",
      duration: "4-5 أسابيع للتنفيذ",
      status: "قيد التطوير النهائي",
      category: "أنظمة إدارية",
      icon: Users,
      color: "indigo",
      gradient: "from-indigo-500 to-blue-600",
      rating: "قريباً",
      clients: "في الاختبار",
      updates: "تحديثات مجانية لسنة",
      support: "دعم فني شامل",
      fullFeatures: [
        "إدارة شاملة لبيانات العملاء",
        "نظام متابعة العملاء المحتملين",
        "أتمتة عمليات المبيعات",
        "تحليلات ذكية بالذكاء الاصطناعي",
        "تنبؤات سلوك العملاء",
        "إدارة الفرص التجارية",
        "نظام إدارة المهام والأنشطة",
        "تقارير مبيعات تفصيلية",
        "تكامل مع أنظمة المحاسبة",
        "تكامل مع البريد الإلكتروني",
        "تطبيق موبايل لفريق المبيعات",
        "لوحة تحكم تنفيذية متقدمة"
      ],
      screenshots: [
        "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1553028826-f4804a6dba3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
      ]
    },
    {
      id: 6,
      title: "تطبيق إدارة الموارد البشرية",
      description: "نظام شامل لإدارة الموارد البشرية يشمل التوظيف والرواتب وتقييم الأداء",
      detailedDescription: "نظام متكامل لإدارة الموارد البشرية يغطي جميع احتياجات الشركات من التوظيف والتدريب إلى إدارة الأداء والرواتب. مع واجهات منفصلة للموظفين والإدارة وتقارير تحليلية شاملة.",
      features: ["إدارة الموظفين", "نظام الرواتب", "تقييم الأداء", "إدارة الإجازات", "التوظيف الذكي", "تدريب الموظفين"],
      technologies: ["React Native", "Express.js", "MongoDB", "JWT", "Push Notifications", "Charts.js"],
      price: "10,000 ريال",
      duration: "3-4 أسابيع للتنفيذ",
      status: "جاهز للنشر",
      category: "الموارد البشرية",
      icon: Award,
      color: "teal",
      gradient: "from-teal-500 to-cyan-600",
      rating: "4.8",
      clients: "22+",
      updates: "تحديثات مجانية لسنة",
      support: "دعم فني 24/7",
      fullFeatures: [
        "إدارة شاملة لبيانات الموظفين",
        "نظام التوظيف والتجنيد",
        "إدارة الرواتب والمستحقات",
        "نظام تقييم الأداء الدوري",
        "إدارة الإجازات والعطل",
        "نظام الحضور والانصراف",
        "إدارة التدريب والتطوير",
        "تقارير الموارد البشرية",
        "نظام الخدمة الذاتية للموظفين",
        "إدارة المسارات الوظيفية",
        "تطبيق موبايل للموظفين",
        "نظام إشعارات متقدم"
      ],
      screenshots: [
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
      ]
    },
    {
      id: 7,
      title: "منصة التسويق الرقمي المتكاملة",
      description: "منصة شاملة لإدارة الحملات التسويقية الرقمية عبر جميع القنوات مع تحليلات متقدمة",
      detailedDescription: "منصة متطورة تجمع جميع أدوات التسويق الرقمي في مكان واحد. إدارة حملات Google Ads، Facebook، Instagram، LinkedIn مع تحليلات موحدة وأتمتة الحملات بالذكاء الاصطناعي.",
      features: ["إدارة الحملات", "تحليلات متقدمة", "أتمتة التسويق", "تكامل المنصات", "تتبع ROI", "تقارير ذكية"],
      technologies: ["React", "Python", "APIs Integration", "MongoDB", "Machine Learning", "D3.js"],
      price: "25,000 ريال",
      duration: "5-6 أسابيع للتنفيذ",
      status: "جاهز للنشر",
      category: "التسويق الرقمي",
      icon: TrendingUp,
      color: "pink",
      gradient: "from-pink-500 to-rose-600",
      rating: "4.9",
      clients: "28+",
      updates: "تحديثات شهرية",
      support: "دعم تسويقي متخصص",
      fullFeatures: [
        "إدارة حملات Google Ads",
        "إدارة حملات وسائل التواصل الاجتماعي",
        "نظام إدارة المحتوى التسويقي",
        "تحليلات متقدمة وتقارير ROI",
        "أتمتة الحملات بالذكاء الاصطناعي",
        "إدارة قوائم البريد الإلكتروني",
        "نظام تتبع التحويلات",
        "إدارة المؤثرين والشراكات",
        "تحليل المنافسين",
        "نظام إدارة العملاء المحتملين",
        "تكامل مع أنظمة CRM",
        "لوحة تحكم تحليلية شاملة"
      ],
      screenshots: [
        "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
      ]
    },
    {
      id: 8,
      title: "نظام إدارة المستشفيات الذكي",
      description: "نظام شامل لإدارة المستشفيات والعيادات مع إدارة المواعيد والسجلات الطبية الإلكترونية",
      detailedDescription: "نظام طبي متكامل يشمل إدارة المرضى، المواعيد، السجلات الطبية، الصيدلية، والفواتير. مع تكامل مع أجهزة طبية وأنظمة المعامل ودعم للتطبيب عن بعد.",
      features: ["إدارة المرضى", "السجلات الطبية", "نظام المواعيد", "إدارة الصيدلية", "التطبيب عن بعد", "تقارير طبية"],
      technologies: ["Vue.js", "Laravel", "MySQL", "WebRTC", "HL7 Integration", "Security"],
      price: "48,000 ريال",
      duration: "8-10 أسابيع للتنفيذ",
      status: "جاهز للنشر",
      category: "الأنظمة الطبية",
      icon: Activity,
      color: "red",
      gradient: "from-red-500 to-pink-600",
      rating: "4.8",
      clients: "12+",
      updates: "تحديثات مجانية لسنتين",
      support: "دعم طبي متخصص 24/7",
      fullFeatures: [
        "إدارة شاملة لبيانات المرضى",
        "نظام الحجوزات والمواعيد الذكي",
        "السجلات الطبية الإلكترونية",
        "إدارة الصيدلية والأدوية",
        "نظام الفواتير الطبية",
        "إدارة غرف العمليات والأسِرة",
        "تكامل مع أجهزة طبية",
        "نظام المعامل والتحاليل",
        "التطبيب عن بُعد",
        "تقارير طبية وإحصائيات",
        "نظام الطوارئ والإسعاف",
        "إدارة الموظفين الطبيين",
        "تطبيق موبايل للمرضى",
        "نظام أمان وخصوصية متقدم"
      ],
      screenshots: [
        "https://images.unsplash.com/photo-1584515933487-779824d29309?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
      ]
    },
    {
      id: 9,
      title: "نظام تأجير السيارات الذكي",
      description: "منصة شاملة لإدارة تأجير السيارات مع نظام حجز متقدم وإدارة الأسطول والدفع الإلكتروني",
      detailedDescription: "نظام متكامل لإدارة شركات تأجير السيارات يشمل إدارة الأسطول، نظام الحجز الذكي، تتبع GPS للمركبات، إدارة العملاء والسائقين، والدفع الإلكتروني. مع واجهة ويب للإدارة وتطبيق موبايل للعملاء ونظام تقارير شامل.",
      features: ["إدارة الأسطول", "نظام الحجز الذكي", "تتبع GPS", "الدفع الإلكتروني", "إدارة العملاء", "تطبيق موبايل"],
      technologies: ["React", "Node.js", "MongoDB", "GPS Tracking", "Payment Gateway", "Mobile App"],
      price: "35,000 ريال",
      duration: "6-8 أسابيع للتنفيذ",
      status: "جاهز للنشر",
      category: "إدارة الأعمال",
      icon: Building2,
      color: "blue",
      gradient: "from-blue-500 to-indigo-600",
      rating: "4.7",
      clients: "20+",
      updates: "تحديثات مجانية لسنة ونصف",
      support: "دعم فني متخصص 24/7",
      fullFeatures: [
        "إدارة شاملة لأسطول السيارات",
        "نظام حجز ذكي عبر الإنترنت",
        "تتبع GPS مباشر للمركبات",
        "إدارة العملاء والسائقين",
        "نظام دفع إلكتروني آمن",
        "تطبيق موبايل للعملاء",
        "إدارة العقود والاتفاقيات",
        "نظام التأمين والضمانات",
        "إدارة الصيانة والخدمة",
        "تقارير مالية وتشغيلية",
        "نظام تقييم السيارات",
        "إدارة الفروع المتعددة",
        "نظام إشعارات تلقائي",
        "تكامل مع أنظمة المحاسبة",
        "لوحة تحكم تحليلية متقدمة"
      ],
      screenshots: [
        "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1502877338535-766e1452684a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
      ]
    },
    {
      id: 10,
      title: "منصة الخدمات المصغرة المتكاملة",
      description: "منصة شاملة للخدمات المصغرة مثل خمسات وفايفر مع نظام مدفوعات آمن وإدارة المشاريع",
      detailedDescription: "منصة متكاملة تربط مقدمي الخدمات المصغرة بالعملاء في بيئة آمنة ومتطورة. تشمل نظام عرض الخدمات بفئات متنوعة، إدارة الطلبات والمشاريع، نظام مدفوعات آمن متعدد الطرق، تقييم الخدمات والبائعين، ونظام رسائل فوري. مع لوحات تحكم متقدمة للبائعين والمشترين والإدارة.",
      features: ["عرض الخدمات", "نظام الطلبات", "المدفوعات الآمنة", "تقييم الخدمات", "نظام الرسائل", "لوحة تحكم شاملة"],
      technologies: ["React", "Laravel", "MySQL", "Payment Gateway", "Real-time Chat", "File Upload"],
      price: "15,000 ريال",
      duration: "5-7 أسابيع للتنفيذ",
      status: "جاهز للنشر",
      category: "منصات الخدمات",
      icon: Users,
      color: "green",
      gradient: "from-green-500 to-emerald-600",
      rating: "4.8",
      clients: "35+",
      updates: "تحديثات مجانية لسنة",
      support: "دعم فني وتجاري متخصص",
      fullFeatures: [
        "نظام تسجيل وإدارة المستخدمين",
        "عرض الخدمات بفئات متنوعة",
        "محرك بحث متقدم للخدمات",
        "نظام طلب وإدارة المشاريع",
        "مدفوعات آمنة متعددة الطرق",
        "نظام ضمان الأموال (Escrow)",
        "تقييم وتعليق الخدمات",
        "نظام رسائل فوري متقدم",
        "رفع وتبادل الملفات بأمان",
        "نظام عمولات مرن",
        "لوحة تحكم للبائعين",
        "لوحة تحكم للمشترين",
        "لوحة إدارة شاملة",
        "تقارير مالية وإحصائيات",
        "نظام دعم فني متكامل",
        "تطبيق موبايل للمنصة"
      ],
      screenshots: [
        "https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
      ]
    },
    {
      id: 11,
      title: "نظام إدارة العقارات المتكامل",
      description: "منصة شاملة لإدارة العقارات مع نظام المبيعات والإيجارات وإدارة المطورين والوسطاء",
      detailedDescription: "نظام عقاري متطور يجمع المطورين والوسطاء والعملاء في منصة واحدة. يشمل إدارة العقارات، المبيعات، الإيجارات، المدفوعات، نظام الجولات الافتراضية، وتحليلات السوق المتقدمة. مع تطبيق موبايل متكامل ونظام إدارة شامل.",
      features: ["إدارة العقارات", "المبيعات والإيجارات", "نظام الجولات الافتراضية", "إدارة المطورين", "تحليلات السوق", "تطبيق موبايل"],
      technologies: ["React", "Node.js", "PostgreSQL", "Maps API", "Virtual Tours", "Mobile App"],
      price: "30,000 ريال",
      duration: "7-9 أسابيع للتنفيذ",
      status: "جاهز للنشر",
      category: "الأنظمة العقارية",
      icon: Building2,
      color: "amber",
      gradient: "from-amber-500 to-orange-600",
      rating: "4.8",
      clients: "18+",
      updates: "تحديثات مجانية لسنة ونصف",
      support: "دعم فني وتجاري متخصص 24/7",
      fullFeatures: [
        "إدارة شاملة لقاعدة بيانات العقارات",
        "نظام البحث المتقدم مع فلاتر ذكية",
        "إدارة المبيعات والإيجارات",
        "نظام الجولات الافتراضية ثلاثية الأبعاد",
        "إدارة العملاء والوسطاء",
        "نظام المواعيد والزيارات",
        "إدارة العقود والوثائق",
        "نظام المدفوعات والفواتير",
        "تحليلات السوق والأسعار",
        "نظام التقييم العقاري الذكي",
        "إدارة الصيانة والخدمات",
        "تقارير مبيعات وإيجارات شاملة",
        "تطبيق موبايل للعملاء والوسطاء",
        "تكامل مع خرائط جوجل",
        "نظام إشعارات متقدم",
        "لوحة تحكم تحليلية متقدمة",
        "نظام أمان وصلاحيات متعدد المستويات",
        "تكامل مع أنظمة البنوك للتمويل"
      ],
      screenshots: [
        "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1582407947304-fd86f028f716?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
      ]
    },
    {
      id: 12,
      title: "موقع تعريفي للشركات",
      description: "موقع إلكتروني احترافي وأنيق للشركات مع تصميم متجاوب وإدارة محتوى سهلة",
      detailedDescription: "موقع إلكتروني تعريفي متكامل للشركات والمؤسسات يتضمن صفحات رئيسية، خدمات، عن الشركة، فريق العمل، معرض الأعمال، ونموذج تواصل. مصمم ليكون سريع التحميل ومتوافق مع محركات البحث ومتجاوب مع جميع الأجهزة.",
      features: ["تصميم متجاوب", "صفحات متعددة", "إدارة محتوى", "تحسين SEO", "سرعة تحميل", "نموذج تواصل"],
      technologies: ["React", "Next.js", "Tailwind CSS", "Framer Motion", "Contact Forms", "SEO"],
      price: "5,000 ريال",
      duration: "1-2 أسبوع للتنفيذ",
      status: "جاهز للنشر",
      category: "المواقع التعريفية",
      icon: Globe,
      color: "sky",
      gradient: "from-sky-500 to-blue-600",
      rating: "4.9",
      clients: "50+",
      updates: "تحديثات مجانية لسنة",
      support: "دعم فني شامل",
      fullFeatures: [
        "تصميم احترافي متجاوب مع جميع الأجهزة",
        "صفحة رئيسية جذابة مع عناصر تفاعلية",
        "صفحة خدمات مفصلة مع أيقونات مميزة",
        "صفحة عن الشركة مع تاريخ وقيم المؤسسة",
        "صفحة فريق العمل مع صور وتخصصات",
        "معرض أعمال ومشاريع بتصميم أنيق",
        "صفحة تواصل مع نموذج ذكي وخريطة",
        "تحسين SEO متقدم لمحركات البحث",
        "سرعة تحميل فائقة وأداء محسن",
        "تكامل مع وسائل التواصل الاجتماعي",
        "نظام إدارة محتوى سهل الاستخدام",
        "دعم متعدد اللغات (عربي/إنجليزي)",
        "تحليلات الزوار مع Google Analytics",
        "شهادة SSL مجانية للأمان",
        "استضافة مجانية لسنة كاملة"
      ],
      screenshots: [
        "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
      ]
    },
    {
      id: 13,
      title: "الحل الكامل لإدارة المطاعم",
      description: "نظام شامل لإدارة المطاعم مع نقاط البيع وإدارة الطلبات والمخزون وتطبيق توصيل",
      detailedDescription: "نظام متكامل لإدارة المطاعم والمقاهي يشمل نظام نقاط البيع (POS)، إدارة الطلبات والقوائم، إدارة المخزون والموردين، نظام التوصيل، إدارة الموظفين، والتقارير المالية. مع تطبيق موبايل للعملاء ولوحة تحكم شاملة للإدارة.",
      features: ["نظام POS", "إدارة الطلبات", "إدارة المخزون", "تطبيق توصيل", "تقارير مالية", "إدارة الموظفين"],
      technologies: ["React", "Node.js", "PostgreSQL", "Payment Gateway", "Mobile App", "Real-time"],
      price: "12,000 ريال",
      duration: "4-5 أسابيع للتنفيذ",
      status: "جاهز للنشر",
      category: "إدارة المطاعم",
      icon: Building2,
      color: "orange",
      gradient: "from-orange-500 to-red-600",
      rating: "4.8",
      clients: "45+",
      updates: "تحديثات مجانية لسنة ونصف",
      support: "دعم فني وتجاري متخصص",
      fullFeatures: [
        "نظام نقاط البيع (POS) متكامل",
        "إدارة القوائم والوجبات والأسعار",
        "نظام الطلبات المباشرة والأونلاين",
        "إدارة الطاولات والحجوزات",
        "إدارة المخزون والمواد الخام",
        "نظام إدارة الموردين والمشتريات",
        "تطبيق موبايل للعملاء (طلب وتوصيل)",
        "نظام التوصيل وتتبع الطلبات",
        "إدارة الموظفين والشيفات",
        "نظام نقاط الولاء والعروض",
        "تقارير مالية ومحاسبية شاملة",
        "تحليل المبيعات والأرباح",
        "إدارة طرق الدفع المتعددة",
        "نظام الفواتير والضرائب",
        "تكامل مع أنظمة المحاسبة",
        "نظام الإشعارات والتنبيهات",
        "لوحة تحكم تحليلية للإدارة",
        "نظام النسخ الاحتياطي التلقائي"
      ],
      screenshots: [
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1544148103-0773bf10d330?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
      ]
    }
    // يمكن إضافة المزيد من المشاريع هنا
  ];

  const project = projects.find(p => p.id === parseInt(projectId || "0"));

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <Navigation />
        <div className="container mx-auto px-6 py-32 text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">المشروع غير موجود</h1>
          <p className="text-xl text-slate-600 mb-8">لم نتمكن من العثور على هذا المشروع</p>
          <Button asChild>
            <Link to="/ready-projects">العودة إلى المشاريع</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const IconComponent = project.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/5 to-emerald-600/10" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-6xl mx-auto">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-8 text-slate-600">
              <Link to="/" className="hover:text-blue-600 transition-colors">الرئيسية</Link>
              <span>/</span>
              <Link to="/ready-projects" className="hover:text-blue-600 transition-colors">المشاريع الجاهزة</Link>
              <span>/</span>
              <span className="text-slate-900">{project.title}</span>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-16 h-16 bg-gradient-to-r ${project.gradient} rounded-2xl flex items-center justify-center`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <Badge className={`mb-2`} variant="outline">
                      {project.category}
                    </Badge>
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-500 fill-current" />
                      <span className="font-bold text-slate-900">{project.rating}</span>
                      <span className="text-slate-600">({project.clients} عميل)</span>
                    </div>
                  </div>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                  {project.title}
                </h1>
                
                <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                  {project.detailedDescription}
                </p>

                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="text-center p-4 bg-white/70 rounded-xl border border-slate-200/50">
                    <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-slate-900">{project.price}</div>
                    <div className="text-sm text-slate-600">السعر الشامل</div>
                  </div>
                  <div className="text-center p-4 bg-white/70 rounded-xl border border-slate-200/50">
                    <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-slate-900">{project.duration}</div>
                    <div className="text-sm text-slate-600">مدة التنفيذ</div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0"
                    asChild
                  >
                    <a href={`https://wa.me/966555812567?text=مرحباً، أريد الاستفسار عن ${project.title}`} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="w-5 h-5 mr-2" />
                      طلب عرض سعر
                    </a>
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="border-slate-300 hover:border-blue-400 hover:text-blue-600"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    تحميل المواصفات
                  </Button>
                </div>
              </div>

              <div className="relative">
                <div className="aspect-video bg-gradient-to-br from-slate-200 to-slate-300 rounded-2xl overflow-hidden shadow-2xl">
                  <img 
                    src={project.screenshots[0]} 
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <Badge className="bg-white/90 text-slate-900 border-0">
                      {project.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 text-center">
              المميزات والخصائص
            </h2>
            <p className="text-xl text-slate-600 mb-12 text-center max-w-3xl mx-auto">
              تعرف على جميع المميزات والخصائص المتقدمة التي يوفرها هذا المشروع
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {project.fullFeatures.map((feature, index) => (
                <div key={index} className="flex items-center gap-3 p-4 bg-white/70 rounded-xl border border-slate-200/50 hover:shadow-lg transition-all duration-300">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-slate-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Technologies Section */}
      <section className="py-20 bg-gradient-to-r from-slate-100/50 to-blue-50/30">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 text-center">
              التقنيات المستخدمة
            </h2>
            <p className="text-xl text-slate-600 mb-12 text-center max-w-3xl mx-auto">
              مبني بأحدث التقنيات والأدوات المتطورة لضمان الأداء العالي والموثوقية
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {project.technologies.map((tech, index) => (
                <div key={index} className="text-center p-6 bg-white/70 rounded-2xl border border-slate-200/50 hover:shadow-lg transition-all duration-300">
                  <Code className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-slate-900">{tech}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Support & Updates Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center p-6 bg-white/70 border-slate-200/50">
                <CardHeader className="pb-4">
                  <Shield className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <CardTitle className="text-xl text-slate-900">الدعم الفني</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">{project.support}</p>
                </CardContent>
              </Card>

              <Card className="text-center p-6 bg-white/70 border-slate-200/50">
                <CardHeader className="pb-4">
                  <Zap className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <CardTitle className="text-xl text-slate-900">التحديثات</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">{project.updates}</p>
                </CardContent>
              </Card>

              <Card className="text-center p-6 bg-white/70 border-slate-200/50">
                <CardHeader className="pb-4">
                  <Users className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                  <CardTitle className="text-xl text-slate-900">العملاء</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">تم تنفيذه بنجاح لأكثر من {project.clients} عميل</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-purple-600/90" />
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  هل أنت مستعد لبدء مشروعك؟
                </h2>
                <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                  تواصل معنا الآن لطلب عرض سعر مخصص أو للحصول على استشارة مجانية
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    size="lg"
                    className="bg-white text-blue-600 hover:bg-slate-100 border-0"
                    asChild
                  >
                    <a href={`https://wa.me/966555812567?text=مرحباً، أريد طلب عرض سعر لـ ${project.title}`} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="w-5 h-5 mr-2" />
                      طلب عرض سعر
                    </a>
                  </Button>
                  <Button 
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white/10 border-2"
                    asChild
                  >
                    <Link to="/contact">
                      <Users className="w-5 h-5 mr-2" />
                      استشارة مجانية
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Back Navigation */}
      <div className="container mx-auto px-6 py-8">
        <Link 
          to="/ready-projects" 
          className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          العودة إلى المشاريع الجاهزة
        </Link>
      </div>

      <Footer />
    </div>
  );
};

export default ProjectDetails;