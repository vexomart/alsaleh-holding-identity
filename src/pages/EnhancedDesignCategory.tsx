import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import Footer from "@/components/Footer";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Sparkles, CreditCard, Loader2, Lock, Calendar, Clock, ArrowLeft, CheckCircle,
  Palette, Megaphone, MessageCircle, Printer, MonitorSmartphone, Wrench, Crown,
  IdCard, FileText, BookOpen, Package, Shirt, Gift, Edit3, Layout, Image, Layers,
  BadgeCheck, BarChart3, Mail, Star, Users, Zap, TrendingUp, Eye, Heart, Award,
  Download, Share2, Play, ChevronLeft, ChevronDown, Filter, Search, Grid3X3,
  List, Shield, Target, Lightbulb, Brush, Rocket, Globe, Tablet, Smartphone,
  Cpu, Wand2, Gem, MousePointer2, Paintbrush2, Pen, PenTool, Scissors, Move3D
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Enhanced catalog with animated icons instead of images
const enhancedCatalog = {
  "brand-identity": {
    title: "تصاميم الهوية البصرية",
    subtitle: "بناء هوية قوية ومتسقة ترسخ علامتك في أذهان عملائك",
    description: "نصمم هويات بصرية متكاملة تعكس شخصية علامتك التجارية وتميزها عن المنافسين. من الشعار إلى دليل الاستخدام الكامل.",
    icon: Crown,
    hero: {
      stats: [
        { number: "500+", label: "هوية تم تصميمها", icon: Award },
        { number: "95%", label: "رضا العملاء", icon: Heart },
        { number: "48", label: "ساعة متوسط التسليم", icon: Clock }
      ],
      features: [
        { text: "تصميم فريد ومبتكر", icon: Sparkles },
        { text: "ملفات احترافية عالية الجودة", icon: BadgeCheck },
        { text: "دعم فني مجاني لمدة شهر", icon: Shield },
        { text: "تعديلات غير محدودة", icon: Zap }
      ]
    },
    accent: {
      gradient: "from-blue-500 via-purple-500 to-pink-500",
      headerBg: "bg-gradient-to-br from-primary/10 via-blue-50 to-indigo-50 dark:from-primary/15 dark:via-slate-900 dark:to-slate-800",
    },
    services: [
      { 
        name: "تصميم الشعار الاحترافي",
        desc: "شعار فريد يعكس شخصية علامتك التجارية ويترك انطباعاً لا يُنسى",
        price: 1499, 
        originalPrice: 2000,
        delivery: "4-7 أيام", 
        complexity: "متوسط",
        icon: Crown,
        animationType: "bounce",
        features: [
          "3 مقترحات أولية مختلفة", 
          "تعديلات غير محدودة حتى الاعتماد",
          "ملفات مفتوحة ومتجهية (AI, EPS, SVG)",
          "نسخ بدقة عالية للطباعة والويب",
          "دليل استخدام مبسط"
        ],
        includes: ["PNG", "SVG", "AI", "EPS", "PDF"],
        popular: true,
        rating: 4.9,
        reviews: 127,
        color: "from-yellow-400 to-orange-500"
      },
      { 
        name: "حزمة الهوية البصرية المتكاملة",
        desc: "حل شامل لجميع احتياجات الهوية البصرية لشركتك أو مشروعك",
        price: 6999, 
        originalPrice: 9500,
        delivery: "2-3 أسابيع",
        complexity: "متقدم",
        icon: Package,
        animationType: "pulse",
        features: [
          "تصميم شعار احترافي",
          "هوية مطبوعة ورقمية كاملة", 
          "دليل استخدام الهوية التفصيلي",
          "قوالب المراسلات والأوراق الرسمية",
          "تصميم بطاقات العمل",
          "أغلفة وسائل التواصل الاجتماعي"
        ],
        includes: ["كل الملفات المصدر", "دليل الهوية", "قوالب جاهزة"],
        premium: true,
        rating: 5.0,
        reviews: 89,
        color: "from-purple-500 to-blue-600"
      },
      { 
        name: "تصميم بطاقة الأعمال الفاخرة",
        desc: "بطاقة أعمال احترافية تترك انطباعاً إيجابياً وتعزز من صورة علامتك التجارية",
        price: 699, 
        originalPrice: 999,
        delivery: "2-4 أيام",
        complexity: "بسيط",
        icon: IdCard,
        animationType: "spin",
        features: [
          "تصميم مبتكر وعصري",
          "طباعة على أوراق فاخرة",
          "تصميم للوجهين الأمامي والخلفي",
          "ملفات جاهزة للطباعة بجودة عالية"
        ],
        includes: ["PDF", "PNG", "AI"],
        rating: 4.7,
        reviews: 156,
        color: "from-green-400 to-blue-500"
      }
    ],
    testimonials: [
      {
        name: "أحمد سليمان",
        company: "شركة الابتكار للتقنية",
        text: "تصميم رائع وخدمة متميزة. حصلنا على هوية بصرية قوية تميز شركتنا.",
        rating: 5,
        avatar: "👨‍💼"
      },
      {
        name: "فاطمة النور",
        company: "مطعم الضيافة",
        text: "فريق محترف جداً والنتيجة فاقت توقعاتي. أنصح بهم بشدة!",
        rating: 5,
        avatar: "👩‍💼"
      }
    ]
  },
    "marketing-designs": {
    title: "التصاميم التسويقية",
    subtitle: "تصاميم تسويقية جذابة تضاعف تأثير حملاتك الإعلانية",
    description: "نصمم مواد تسويقية احترافية تجذب الانتباه وتحقق أهدافك التسويقية بكفاءة عالية.",
    icon: Megaphone,
    hero: {
      stats: [
        { number: "1000+", label: "تصميم تسويقي", icon: BarChart3 },
        { number: "98%", label: "معدل التحويل", icon: TrendingUp },
        { number: "24", label: "ساعة تسليم سريع", icon: Zap }
      ],
      features: [
        { text: "تصاميم جذابة ومؤثرة", icon: Eye },
        { text: "مناسبة لجميع المنصات", icon: Globe },
        { text: "تصميم يركز على التحويل", icon: Target },
        { text: "مراجعة استراتيجية مجانية", icon: Lightbulb }
      ]
    },
    accent: {
      gradient: "from-green-500 via-emerald-500 to-teal-500",
      headerBg: "bg-gradient-to-br from-success/10 via-green-50 to-emerald-50 dark:from-success/15 dark:via-slate-900 dark:to-slate-800",
    },
    services: [
      {
        name: "بروشور تسويقي احترافي",
        desc: "بروشور مطوي احترافي يعرض خدماتك ومنتجاتك بطريقة جذابة ومنظمة",
        price: 899,
        originalPrice: 1299,
        delivery: "3-5 أيام",
        complexity: "متوسط",
        icon: FileText,
        animationType: "bounce",
        features: [
          "تصميم ثلاثي الطي احترافي",
          "محتوى مرتب وجذاب",
          "صور عالية الجودة",
          "ملفات جاهزة للطباعة"
        ],
        includes: ["PDF", "PNG", "AI"],
        popular: true,
        rating: 4.8,
        reviews: 203,
        color: "from-cyan-400 to-blue-500"
      },
      {
        name: "فلاير إعلاني مميز",
        desc: "فلاير احترافي لحملاتك الإعلانية يجذب العملاء ويحقق أهدافك التسويقية",
        price: 599,
        originalPrice: 799,
        delivery: "2-3 أيام",
        complexity: "بسيط",
        icon: Layout,
        animationType: "pulse",
        features: [
          "تصميم جذاب وملفت للنظر",
          "رسائل تسويقية واضحة",
          "ألوان محترفة ومتناسقة",
          "جاهز للطباعة والنشر الرقمي"
        ],
        includes: ["PDF", "PNG", "JPG"],
        rating: 4.6,
        reviews: 156,
        color: "from-pink-400 to-red-500"
      },
      {
        name: "كتالوج منتجات شامل",
        desc: "كتالوج احترافي يعرض منتجاتك أو خدماتك بطريقة منظمة وجذابة",
        price: 1299,
        originalPrice: 1699,
        delivery: "5-7 أيام",
        complexity: "متقدم",
        icon: BookOpen,
        animationType: "spin",
        features: [
          "تصميم متعدد الصفحات",
          "عرض منتجات منظم",
          "معلومات شاملة وواضحة",
          "تصميم قابل للطباعة والعرض الرقمي"
        ],
        includes: ["PDF", "AI", "InDesign"],
        premium: true,
        rating: 4.9,
        reviews: 89,
        color: "from-purple-500 to-indigo-600"
      }
    ],
    testimonials: [
      {
        name: "محمد العتيبي",
        company: "شركة الإبداع التسويقي",
        text: "تصاميم تسويقية رائعة ساعدتنا في زيادة المبيعات بنسبة 40%",
        rating: 5,
        avatar: "👨‍💼"
      },
      {
        name: "نورا السعد",
        company: "متجر الأناقة",
        text: "كتالوج المنتجات فاق توقعاتي، تصميم احترافي وجذاب جداً",
        rating: 5,
        avatar: "👩‍💼"
      }
    ]
  },
  "social-media": {
    title: "تصاميم وسائل التواصل الاجتماعي",
    subtitle: "محتوى بصري يجذب المتابعين ويزيد التفاعل",
    description: "نصمم محتوى بصري مميز لجميع منصات التواصل الاجتماعي لزيادة التفاعل والوصول.",
    icon: Share2,
    hero: {
      stats: [
        { number: "2500+", label: "منشور تم تصميمه", icon: Image },
        { number: "300%", label: "زيادة التفاعل", icon: Heart },
        { number: "12", label: "ساعة تسليم فوري", icon: Zap }
      ],
      features: [
        { text: "تصاميم تواكب الترندات", icon: TrendingUp },
        { text: "محتوى فيروسي وجذاب", icon: Sparkles },
        { text: "مناسب لجميع المنصات", icon: Smartphone },
        { text: "استراتيجية محتوى شاملة", icon: Target }
      ]
    },
    accent: {
      gradient: "from-pink-500 via-rose-500 to-red-500",
      headerBg: "bg-gradient-to-br from-accent/10 via-pink-50 to-rose-50 dark:from-accent/15 dark:via-slate-900 dark:to-slate-800",
    },
    services: [
      {
        name: "منشورات السوشيال ميديا",
        desc: "منشورات جذابة لجميع منصات التواصل الاجتماعي تزيد التفاعل والمتابعين",
        price: 399,
        originalPrice: 599,
        delivery: "1-2 أيام",
        complexity: "بسيط",
        icon: Share2,
        animationType: "bounce",
        features: [
          "تصميم لجميع المنصات",
          "محتوى جذاب ومؤثر",
          "ألوان وخطوط متناسقة",
          "تصاميم ترندي وعصرية"
        ],
        includes: ["PNG", "JPG", "Stories", "Posts"],
        popular: true,
        rating: 4.8,
        reviews: 342,
        color: "from-purple-400 to-pink-500"
      },
      {
        name: "أغلفة السوشيال ميديا",
        desc: "أغلفة احترافية لحساباتك على جميع منصات التواصل الاجتماعي",
        price: 699,
        originalPrice: 999,
        delivery: "2-3 أيام",
        complexity: "متوسط",
        icon: Image,
        animationType: "pulse",
        features: [
          "تصميم لجميع المنصات",
          "أحجام مناسبة لكل منصة",
          "تصميم متجاوب وجذاب",
          "ملفات عالية الجودة"
        ],
        includes: ["Facebook", "Twitter", "LinkedIn", "YouTube"],
        rating: 4.7,
        reviews: 198,
        color: "from-blue-400 to-purple-500"
      },
      {
        name: "قوالب القصص التفاعلية",
        desc: "قوالب جاهزة للقصص على إنستغرام وسناب شات بتصاميم عصرية وجذابة",
        price: 899,
        originalPrice: 1299,
        delivery: "3-4 أيام",
        complexity: "متقدم",
        icon: Smartphone,
        animationType: "spin",
        features: [
          "قوالب متعددة الأشكال",
          "تصاميم تفاعلية",
          "سهولة التعديل والتخصيص",
          "مناسبة للعلامات التجارية"
        ],
        includes: ["Instagram", "Snapchat", "WhatsApp", "PSD"],
        premium: true,
        rating: 4.9,
        reviews: 156,
        color: "from-gradient-to-r from-yellow-400 to-orange-500"
      }
    ],
    testimonials: [
      {
        name: "سارة أحمد",
        company: "مطعم الذوق الرفيع",
        text: "تصاميم السوشيال ميديا زادت التفاعل مع حساباتنا بشكل ملحوظ",
        rating: 5,
        avatar: "👩‍💼"
      }
    ]
  },
  "print-ads": {
    title: "التصاميم الإعلانية المطبوعة",
    subtitle: "إعلانات مطبوعة تجمع بين الأناقة والتأثير",
    description: "نصمم إعلانات مطبوعة احترافية تحقق أقصى تأثير في الصحف والمجلات واللوحات الإعلانية.",
    icon: Printer,
    hero: {
      stats: [
        { number: "800+", label: "إعلان مطبوع", icon: Layout },
        { number: "92%", label: "معدل الاستجابة", icon: Eye },
        { number: "5", label: "أيام متوسط التسليم", icon: Calendar }
      ],
      features: [
        { text: "تصاميم عالية الدقة", icon: BadgeCheck },
        { text: "مناسبة للطباعة التجارية", icon: Printer },
        { text: "ألوان دقيقة ومعايرة", icon: Palette },
        { text: "تصاميم تجذب الانتباه", icon: Eye }
      ]
    },
    accent: {
      gradient: "from-orange-500 via-amber-500 to-yellow-500",
      headerBg: "bg-gradient-to-br from-secondary/10 via-orange-50 to-yellow-50 dark:from-secondary/15 dark:via-slate-900 dark:to-slate-800",
    },
    services: [
      {
        name: "لوحة إعلانية كبيرة",
        desc: "لوحة إعلانية احترافية للطرقات والشوارع بتصميم جذاب ومؤثر",
        price: 1999,
        originalPrice: 2599,
        delivery: "5-7 أيام",
        complexity: "متقدم",
        icon: Layout,
        animationType: "bounce",
        features: [
          "تصميم عالي الدقة للطباعة الكبيرة",
          "رسائل واضحة ومؤثرة",
          "ألوان زاهية وجذابة",
          "مناسب للعرض الخارجي"
        ],
        includes: ["PDF", "AI", "EPS", "PNG"],
        popular: true,
        rating: 4.8,
        reviews: 167,
        color: "from-red-500 to-orange-600"
      },
      {
        name: "إعلان صحيفة احترافي",
        desc: "إعلان مطبوع للصحف والمجلات بتصميم أنيق ومحترف",
        price: 799,
        originalPrice: 1099,
        delivery: "3-4 أيام",
        complexity: "متوسط",
        icon: FileText,
        animationType: "pulse",
        features: [
          "تصميم مناسب للطباعة الصحفية",
          "محتوى منظم وواضح",
          "ألوان محافظة ومهنية",
          "جودة طباعة عالية"
        ],
        includes: ["PDF", "AI", "PNG"],
        rating: 4.6,
        reviews: 134,
        color: "from-blue-500 to-indigo-600"
      },
      {
        name: "رول أب احترافي",
        desc: "رول أب قابل للطي للمعارض والفعاليات بتصميم جذاب وعملي",
        price: 699,
        originalPrice: 999,
        delivery: "4-5 أيام",
        complexity: "متوسط",
        icon: Image,
        animationType: "spin",
        features: [
          "تصميم مناسب لأحجام الرول أب",
          "معلومات منظمة وواضحة",
          "تصميم جذاب للمعارض",
          "جودة طباعة عالية"
        ],
        includes: ["PDF", "AI", "PNG", "مقاسات مختلفة"],
        rating: 4.7,
        reviews: 198,
        color: "from-green-500 to-teal-600"
      }
    ],
    testimonials: [
      {
        name: "خالد الراشد",
        company: "شركة البناء المتطور",
        text: "اللوحات الإعلانية التي صممتموها لنا جذبت انتباه العملاء بشكل كبير",
        rating: 5,
        avatar: "👨‍💼"
      }
    ]
  },
  "digital-designs": {
    title: "التصاميم الرقمية المتطورة",
    subtitle: "تصاميم رقمية تواكب أحدث التقنيات",
    description: "نصمم واجهات وتجارب رقمية متطورة تجمع بين الجمال والوظائف العملية.",
    icon: MonitorSmartphone,
    hero: {
      stats: [
        { number: "400+", label: "مشروع رقمي", icon: Cpu },
        { number: "99%", label: "تجربة مستخدم ممتازة", icon: Users },
        { number: "7", label: "أيام متوسط التطوير", icon: Rocket }
      ],
      features: [
        { text: "تصاميم متجاوبة وحديثة", icon: Tablet },
        { text: "تجربة مستخدم استثنائية", icon: Users },
        { text: "تقنيات متطورة", icon: Cpu },
        { text: "أداء محسن ومتطور", icon: Zap }
      ]
    },
    accent: {
      gradient: "from-indigo-500 via-purple-500 to-pink-500",
      headerBg: "bg-gradient-to-br from-purple-500/10 via-indigo-50 to-pink-50 dark:from-purple-500/15 dark:via-slate-900 dark:to-slate-800",
    },
    services: [
      {
        name: "تصميم واجهة موقع إلكتروني",
        desc: "تصميم واجهة موقع إلكتروني حديثة ومتجاوبة توفر تجربة مستخدم استثنائية",
        price: 2999,
        originalPrice: 3999,
        delivery: "7-10 أيام",
        complexity: "متقدم",
        icon: MonitorSmartphone,
        animationType: "bounce",
        features: [
          "تصميم متجاوب لجميع الأجهزة",
          "واجهة مستخدم حديثة وجذابة",
          "تجربة مستخدم محسنة",
          "تصميم محسن لمحركات البحث"
        ],
        includes: ["Figma", "Adobe XD", "Sketch", "HTML/CSS"],
        premium: true,
        rating: 4.9,
        reviews: 145,
        color: "from-blue-500 to-purple-600"
      },
      {
        name: "تصميم تطبيق جوال",
        desc: "تصميم واجهة تطبيق جوال عصري وسهل الاستخدام",
        price: 3999,
        originalPrice: 5499,
        delivery: "10-14 أيام",
        complexity: "متقدم",
        icon: Smartphone,
        animationType: "pulse",
        features: [
          "تصميم لأنظمة iOS و Android",
          "واجهات تفاعلية وحديثة",
          "تجربة مستخدم متميزة",
          "أيقونات وعناصر مخصصة"
        ],
        includes: ["Figma", "Adobe XD", "Prototypes", "Assets"],
        premium: true,
        rating: 5.0,
        reviews: 89,
        color: "from-purple-500 to-pink-600"
      },
      {
        name: "بانر رقمي تفاعلي",
        desc: "بانر رقمي متحرك وتفاعلي للمواقع والإعلانات الرقمية",
        price: 899,
        originalPrice: 1299,
        delivery: "3-5 أيام",
        complexity: "متوسط",
        icon: Layout,
        animationType: "spin",
        features: [
          "تصميم متحرك وجذاب",
          "تحسين لسرعة التحميل",
          "مقاسات متعددة للإعلانات",
          "تفاعل مع المستخدم"
        ],
        includes: ["GIF", "HTML5", "CSS3", "JavaScript"],
        popular: true,
        rating: 4.7,
        reviews: 234,
        color: "from-green-500 to-blue-500"
      }
    ],
    testimonials: [
      {
        name: "أحمد التميمي",
        company: "شركة التقنية المتقدمة",
        text: "تصميم الموقع الإلكتروني كان رائعاً ومتجاوباً مع جميع الأجهزة",
        rating: 5,
        avatar: "👨‍💻"
      }
    ]
  },
  "custom-designs": {
    title: "التصاميم المخصصة والفريدة",
    subtitle: "تصاميم حصرية تلبي احتياجاتك الفريدة",
    description: "نصمم حلول بصرية مخصصة ومبتكرة تتناسب مع رؤيتك الخاصة وتحقق أهدافك الفريدة.",
    icon: Wand2,
    hero: {
      stats: [
        { number: "200+", label: "تصميم مخصص", icon: Gem },
        { number: "100%", label: "تصاميم حصرية", icon: Crown },
        { number: "متغير", label: "وقت التسليم", icon: Clock }
      ],
      features: [
        { text: "تصاميم حصرية 100%", icon: Crown },
        { text: "استشارة شخصية مجانية", icon: Users },
        { text: "مرونة كاملة في التصميم", icon: Wand2 },
        { text: "متابعة شخصية للمشروع", icon: Heart }
      ]
    },
    accent: {
      gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
      headerBg: "bg-gradient-to-br from-violet-500/10 via-purple-50 to-fuchsia-50 dark:from-violet-500/15 dark:via-slate-900 dark:to-slate-800",
    },
    services: [
      {
        name: "تصميم هدايا دعائية مخصصة",
        desc: "تصميم هدايا دعائية فريدة ومخصصة تعكس شخصية علامتك التجارية",
        price: 1499,
        originalPrice: 1999,
        delivery: "5-8 أيام",
        complexity: "متقدم",
        icon: Gift,
        animationType: "bounce",
        features: [
          "تصميم حصري ومبتكر",
          "مناسب لجميع أنواع الهدايا",
          "تصميم يعكس الهوية التجارية",
          "ملفات جاهزة للإنتاج"
        ],
        includes: ["AI", "PDF", "PNG", "استشارة مجانية"],
        popular: true,
        rating: 4.8,
        reviews: 156,
        color: "from-emerald-500 to-cyan-600"
      },
      {
        name: "تصميم معرض أو حدث خاص",
        desc: "تصميم شامل للمعارض والفعاليات بما يشمل الهوية البصرية والمواد الترويجية",
        price: 4999,
        originalPrice: 6999,
        delivery: "2-3 أسابيع",
        complexity: "معقد",
        icon: Layout,
        animationType: "pulse",
        features: [
          "تصميم هوية كاملة للفعالية",
          "مواد ترويجية شاملة",
          "تصميم أكشاك ومساحات",
          "دليل تطبيق الهوية"
        ],
        includes: ["تصميم شامل", "دليل الاستخدام", "ملفات الإنتاج"],
        premium: true,
        rating: 5.0,
        reviews: 67,
        color: "from-purple-600 to-pink-600"
      },
      {
        name: "مشروع تصميم خاص",
        desc: "مشروع تصميم مخصص بالكامل حسب احتياجاتك ومتطلباتك الفريدة",
        price: 2999,
        originalPrice: 3999,
        delivery: "حسب المشروع",
        complexity: "متغير",
        icon: Wand2,
        animationType: "spin",
        features: [
          "استشارة مخصصة مجانية",
          "تصميم حسب المواصفات",
          "مرونة كاملة في التعديل",
          "دعم مستمر للمشروع"
        ],
        includes: ["استشارة", "تصميم مخصص", "دعم مستمر"],
        exclusive: true,
        rating: 4.9,
        reviews: 89,
        color: "from-gradient-to-r from-yellow-400 to-orange-500"
      }
    ],
    testimonials: [
      {
        name: "عبدالله المنصور",
        company: "شركة الإبداع الخاص",
        text: "تصميم المعرض كان استثنائياً وحقق لنا نجاحاً كبيراً في الفعالية",
        rating: 5,
        avatar: "👨‍💼"
      }
    ]
  }
};

const AnimatedIcon = ({ 
  icon: Icon, 
  animationType = "pulse", 
  color = "from-primary to-primary-glow",
  size = "w-12 h-12",
  className = ""
}) => {
  const getAnimation = () => {
    switch (animationType) {
      case "bounce": return "animate-bounce";
      case "spin": return "animate-spin";
      case "pulse": return "animate-pulse";
      case "ping": return "animate-ping";
      default: return "animate-pulse";
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className={`absolute inset-0 bg-gradient-to-r ${color} rounded-full blur-lg opacity-50 ${getAnimation()}`}></div>
      <div className={`relative inline-flex items-center justify-center ${size} rounded-full bg-background/90 border-2 border-primary/20 shadow-lg backdrop-blur-sm`}>
        <Icon className={`${size === "w-12 h-12" ? "w-6 h-6" : size === "w-16 h-16" ? "w-8 h-8" : "w-10 h-10"} text-primary ${getAnimation()}`} style={{ animationDuration: '2s' }} />
      </div>
    </div>
  );
};

const EnhancedDesignCategory = () => {
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [viewMode, setViewMode] = useState("grid");
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  
  const currentCategory = enhancedCatalog[slug as keyof typeof enhancedCatalog];

  console.log("Current slug param:", slug);
  console.log("Current category data:", currentCategory);
  console.log("Available categories:", Object.keys(enhancedCatalog));
  
  const whatsappNumber = "966555812567";

  useEffect(() => {
    if (!currentCategory) return;
    
    document.title = `${currentCategory.title} | شركة ASH HOLDING`;
    const desc = currentCategory.description;

    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = desc;

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = window.location.origin + window.location.pathname;
  }, [currentCategory]);

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            entry.target.classList.add('animate-fade-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    const animateElements = document.querySelectorAll('.animate-on-scroll');
    animateElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  if (!currentCategory) {
    return (
      <div className="min-h-screen bg-background" dir="rtl">
        <main className="container mx-auto px-6 py-20">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">القسم غير موجود</h1>
            <p className="text-muted-foreground mb-8">عذراً، لم نتمكن من العثور على القسم المطلوب.</p>
            <Link to="/design-solutions">
              <Button>العودة لحلول التصميم</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const filteredServices = currentCategory.services
    .filter(service => 
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.desc.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low": return a.price - b.price;
        case "price-high": return b.price - a.price;
        case "rating": return (b.rating || 0) - (a.rating || 0);
        case "popular": return (b.popular ? 1 : 0) - (a.popular ? 1 : 0);
        default: return 0;
      }
    });

  console.log("Current category services:", currentCategory?.services);
  console.log("Filtered services:", filteredServices);
  console.log("Services length:", filteredServices?.length);

  const handleOrderSubmit = async (formData: any) => {
    if (!selectedService) return;

    setIsLoading(true);
    try {
      // Instead of using Supabase, use WhatsApp redirect
      const message = `مرحباً، أود طلب خدمة: ${selectedService.name}
      
الاسم: ${formData.name}
البريد: ${formData.email}
الهاتف: ${formData.phone}
تفاصيل المشروع: ${formData.details}
السعر: ${selectedService.price} ر.س
مدة التسليم: ${selectedService.delivery}`;

      window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');

      toast({
        title: "تم توجيهك لواتساب!",
        description: "سيتم فتح واتساب لإكمال طلبك. سنتواصل معك فوراً.",
      });

      setIsOrderDialogOpen(false);
      setSelectedService(null);
    } catch (error: any) {
      toast({
        title: "حدث خطأ",
        description: "لم نتمكن من إرسال طلبك. حاول مرة أخرى أو تواصل معنا مباشرة.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const CategoryIcon = currentCategory.icon;

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Hero Section with Enhanced Design */}
      <section className={`relative py-20 ${currentCategory.accent.headerBg} overflow-hidden`} dir="rtl">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-success/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-3/4 right-3/4 w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-5xl mx-auto">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8 animate-fade-in">
              <Link to="/design-solutions" className="hover:text-primary transition-colors">حلول التصميم</Link>
              <ChevronLeft className="w-4 h-4" />
              <span className="text-foreground">{currentCategory.title}</span>
            </nav>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Content */}
              <div className="space-y-8 animate-on-scroll">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <AnimatedIcon 
                      icon={CategoryIcon} 
                      size="w-16 h-16"
                      color={currentCategory.accent.gradient}
                      animationType="bounce"
                    />
                    <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r ${currentCategory.accent.gradient} text-white text-sm font-bold shadow-lg`}>
                      <Sparkles className="w-4 h-4 animate-spin" style={{ animationDuration: '3s' }} />
                      <span>قسم متخصص</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                      <span className={`bg-gradient-to-r ${currentCategory.accent.gradient} bg-clip-text text-transparent`}>
                        {currentCategory.title}
                      </span>
                    </h1>
                    <p className="text-xl text-muted-foreground leading-relaxed">
                      {currentCategory.subtitle}
                    </p>
                    <p className="text-lg text-muted-foreground/80 leading-relaxed">
                      {currentCategory.description}
                    </p>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-foreground">مميزات حصرية:</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {currentCategory.hero.features.map((feature, index) => {
                      const FeatureIcon = feature.icon;
                      return (
                        <div key={index} className="flex items-center gap-3 p-4 rounded-xl bg-card/60 backdrop-blur-sm border border-border/50 hover:shadow-lg transition-all duration-300 group">
                          <div className="relative">
                            <div className={`absolute inset-0 bg-gradient-to-r ${currentCategory.accent.gradient} rounded-lg blur-sm opacity-50 group-hover:opacity-100 transition-opacity`}></div>
                            <div className="relative inline-flex items-center justify-center w-10 h-10 rounded-lg bg-background/90 border border-border/30">
                              <FeatureIcon className="w-5 h-5 text-primary animate-pulse" />
                            </div>
                          </div>
                          <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{feature.text}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    size="lg" 
                    className={`bg-gradient-to-l ${currentCategory.accent.gradient} hover:shadow-xl transition-all duration-300 hover:scale-105 text-white group`}
                    onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                    dir="rtl"
                  >
                    <ChevronLeft className="w-5 h-5 ml-2 transition-transform group-hover:-translate-x-1" />
                    <span>استكشف الخدمات</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={() => window.open(`https://wa.me/${whatsappNumber}?text=مرحباً، أود الاستفسار عن ${currentCategory.title}`, '_blank')}
                    className="border-2 hover:bg-success hover:text-white hover:border-success transition-all duration-300 group"
                    dir="rtl"
                  >
                    <MessageCircle className="w-5 h-5 ml-2 group-hover:scale-110 transition-transform" />
                    <span>تواصل واتساب</span>
                  </Button>
                </div>
              </div>

              {/* Stats */}
              <div className="space-y-8 animate-on-scroll" style={{ animationDelay: '200ms' }}>
                <div className="grid grid-cols-1 gap-6">
                  {currentCategory.hero.stats.map((stat, index) => {
                    const StatIcon = stat.icon;
                    return (
                      <Card key={index} className="p-6 bg-card/60 backdrop-blur-sm border-2 border-primary/10 hover:border-primary/30 transition-all duration-500 group hover:shadow-xl hover:scale-105">
                        <div className="flex items-center gap-4">
                          <AnimatedIcon 
                            icon={StatIcon} 
                            size="w-12 h-12"
                            color={currentCategory.accent.gradient}
                            animationType={index % 2 === 0 ? "bounce" : "pulse"}
                          />
                          <div className="space-y-1">
                            <div className={`text-3xl font-bold bg-gradient-to-r ${currentCategory.accent.gradient} bg-clip-text text-transparent`}>
                              {stat.number}
                            </div>
                            <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-muted/30" dir="rtl">
        <div className="container mx-auto px-6">
          {/* Section Header */}
          <div className="text-center mb-16 space-y-6 animate-on-scroll">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full border-2 bg-card/80 border-primary/20 shadow-lg backdrop-blur-sm">
              <Package className="w-6 h-6 text-primary animate-spin" style={{ animationDuration: '4s' }} />
              <span className="text-lg font-bold text-foreground">خدماتنا المتميزة</span>
              <Sparkles className="w-5 h-5 text-success animate-pulse" />
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold">
              <span className={`bg-gradient-to-r ${currentCategory.accent.gradient} bg-clip-text text-transparent`}>
                اختر الخدمة المناسبة
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              مجموعة شاملة من الخدمات المصممة خصيصاً لتلبية احتياجاتك وتحقيق أهدافك
            </p>
          </div>

          {/* Search and Filter Controls */}
          <div className="flex flex-col md:flex-row gap-4 mb-12 animate-on-scroll">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="ابحث في الخدمات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10 text-right"
                dir="rtl"
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="flex items-center gap-2"
              >
                <Grid3X3 className="w-4 h-4" />
                <span>شبكة</span>
              </Button>
              
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="flex items-center gap-2"
              >
                <List className="w-4 h-4" />
                <span>قائمة</span>
              </Button>
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 rounded-lg border border-border bg-background text-foreground text-right"
              dir="rtl"
            >
              <option value="popular">الأكثر طلباً</option>
              <option value="price-low">السعر من الأقل</option>
              <option value="price-high">السعر من الأعلى</option>
              <option value="rating">الأعلى تقييماً</option>
            </select>
          </div>

          {/* Services Grid/List */}
          <div className={`${viewMode === "grid" ? "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8" : "space-y-6"}`}>
            {filteredServices.map((service, index) => {
              const ServiceIcon = service.icon;
              return (
                <Card 
                  key={index}
                  className="group relative overflow-hidden rounded-3xl border-2 border-primary/10 hover:border-primary/30 transition-all duration-700 hover:shadow-2xl hover:scale-105 bg-card/60 backdrop-blur-sm animate-on-scroll"
                  style={{ animationDelay: `${index * 100}ms` }}
                  dir="rtl"
                >
                  {/* Background Effects */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className={`absolute -top-8 -right-8 w-32 h-32 rounded-full bg-gradient-to-br ${service.color} opacity-20 blur-2xl transition-all duration-700 group-hover:scale-150 group-hover:opacity-40`} />
                    <div className="absolute -bottom-8 -left-8 w-28 h-28 rounded-full bg-gradient-to-tr from-accent/20 to-secondary/20 blur-2xl transition-all duration-700 group-hover:scale-125" />
                  </div>

                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2 z-20">
                    {service.popular && (
                      <Badge className="bg-yellow-500 text-black text-xs flex items-center gap-1" dir="rtl">
                        <span>الأكثر طلباً</span>
                        <TrendingUp className="w-3 h-3" />
                      </Badge>
                    )}
                    {(service as any).premium && (
                      <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs flex items-center gap-1" dir="rtl">
                        <span>مميز</span>
                        <Crown className="w-3 h-3" />
                      </Badge>
                    )}
                  </div>

                  {/* Animated Icon */}
                  <div className="absolute top-4 right-4 z-20">
                    <AnimatedIcon 
                      icon={ServiceIcon} 
                      size="w-16 h-16"
                      color={service.color}
                      animationType={service.animationType}
                    />
                  </div>

                  <div className="p-8 pt-20 space-y-6">
                    {/* Service Info */}
                    <div className="space-y-4">
                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${service.color} text-white text-sm font-bold shadow-lg`} dir="rtl">
                        <span>{service.complexity}</span>
                        <BadgeCheck className="w-4 h-4" />
                      </div>
                      
                      <h3 className="text-2xl font-bold tracking-tight group-hover:text-primary transition-colors">
                        {service.name}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {service.desc}
                      </p>
                    </div>

                    {/* Features */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-foreground flex items-center gap-2" dir="rtl">
                        <span>المميزات المتضمنة:</span>
                        <CheckCircle className="w-4 h-4 text-success" />
                      </h4>
                      <ul className="space-y-2">
                        {service.features.slice(0, 3).map((feature, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground" dir="rtl">
                            <span>{feature}</span>
                            <CheckCircle className="w-4 h-4 text-success animate-pulse" />
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Rating and Reviews */}
                    {service.rating && (
                      <div className="flex items-center gap-2" dir="rtl">
                        <span className="text-sm text-muted-foreground">
                          ({service.reviews} تقييم) {service.rating}
                        </span>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-4 h-4 ${
                                i < Math.floor(service.rating!) 
                                  ? 'text-yellow-500 fill-current' 
                                  : 'text-gray-300'
                              }`} 
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Pricing */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between" dir="rtl">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-primary">{service.price} ر.س</span>
                            {service.originalPrice && (
                              <span className="text-lg text-muted-foreground line-through">{service.originalPrice} ر.س</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>التسليم: {service.delivery}</span>
                            <Clock className="w-4 h-4" />
                          </div>
                        </div>
                        
                        {service.originalPrice && (
                          <Badge variant="destructive" className="text-xs">
                            خصم {Math.round((1 - service.price / service.originalPrice) * 100)}%
                          </Badge>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {service.includes.map((include, i) => (
                          <span key={i} className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-md border">
                            {include}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-3 pt-4 border-t border-border/50">
                      <Button 
                        size="lg" 
                        className={`w-full bg-gradient-to-l ${service.color} hover:shadow-lg transition-all duration-300 group-hover:scale-105 text-white`}
                        onClick={() => {
                          setSelectedService(service);
                          setIsOrderDialogOpen(true);
                        }}
                        dir="rtl"
                      >
                        <ChevronLeft className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:-translate-x-1" />
                        <span>اطلب الخدمة الآن</span>
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.open(`https://wa.me/${whatsappNumber}?text=مرحباً، أود الاستفسار عن ${service.name}`, '_blank')}
                        className="w-full hover:bg-success hover:text-white transition-all duration-300"
                        dir="rtl"
                      >
                        <MessageCircle className="w-4 h-4 ml-2" />
                        <span>استفسار واتساب</span>
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {filteredServices.length === 0 && (
            <div className="text-center py-16 animate-fade-in">
              <div className="space-y-4">
                <div className="w-24 h-24 mx-auto rounded-full bg-muted flex items-center justify-center">
                  <Search className="w-12 h-12 text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-semibold text-foreground">لا توجد خدمات مطابقة</h3>
                <p className="text-muted-foreground">جرب البحث بكلمات مختلفة أو تصفح جميع الخدمات</p>
                <Button onClick={() => setSearchTerm("")} variant="outline">
                  عرض جميع الخدمات
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      {currentCategory.testimonials.length > 0 && (
        <section className="py-20 bg-background" dir="rtl">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16 animate-on-scroll">
              <h2 className="text-4xl font-bold mb-4">آراء عملائنا</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                اكتشف تجارب عملائنا معنا وكيف ساعدناهم في تحقيق أهدافهم
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {currentCategory.testimonials.map((testimonial, idx) => (
                <Card key={idx} className="p-8 animate-on-scroll hover:shadow-xl transition-all duration-300 hover:scale-105" style={{ animationDelay: `${idx * 200}ms` }}>
                  <div className="space-y-4">
                    <div className="flex items-center gap-1" dir="rtl">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                      ))}
                    </div>
                    <p className="text-muted-foreground leading-relaxed italic">"{testimonial.text}"</p>
                    <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                      <div className="text-3xl">{testimonial.avatar}</div>
                      <div>
                        <div className="font-semibold">{testimonial.name}</div>
                        <div className="text-sm text-muted-foreground">{testimonial.company}</div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-muted/50" dir="rtl">
        <div className="container mx-auto px-6">
          <div className={`text-center bg-gradient-to-l ${currentCategory.accent.gradient} rounded-3xl p-12 text-white animate-on-scroll relative overflow-hidden`}>
            {/* Background Effects */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
            </div>
            
            <div className="max-w-3xl mx-auto space-y-8 relative z-10">
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl font-bold">
                  ابدأ مشروعك الآن
                </h2>
                <p className="text-xl text-white/90 leading-relaxed">
                  احصل على تصميم احترافي يميز علامتك التجارية ويحقق أهدافك
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button 
                  size="lg" 
                  variant="secondary"
                  onClick={() => window.open(`https://wa.me/${whatsappNumber}?text=مرحباً، أود الحصول على عرض سعر لـ ${currentCategory.title}`, '_blank')}
                  className="bg-white text-primary hover:bg-white/90 transition-all duration-300 hover:scale-105 group"
                  dir="rtl"
                >
                  <MessageCircle className="w-6 h-6 ml-2 group-hover:scale-110 transition-transform" />
                  <span>تواصل عبر واتساب</span>
                </Button>
                
                <Link to="/book-consultation">
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="bg-transparent border-white text-white hover:bg-white hover:text-primary transition-all duration-300 hover:scale-105"
                    dir="rtl"
                  >
                    <Calendar className="w-5 h-5 ml-2" />
                    <span>احجز استشارة مجانية</span>
                  </Button>
                </Link>
              </div>

              <div className="flex items-center justify-center gap-8 text-white/80 text-sm" dir="rtl">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 animate-pulse" />
                  <span>ضمان الجودة</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 animate-pulse delay-200" />
                  <span>دعم مستمر</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 animate-pulse delay-400" />
                  <span>معايير عالمية</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Order Dialog */}
      <Dialog open={isOrderDialogOpen} onOpenChange={setIsOrderDialogOpen}>
        <DialogContent className="max-w-2xl" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-2xl">طلب خدمة {selectedService?.name}</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target as HTMLFormElement);
            handleOrderSubmit({
              name: formData.get('name'),
              email: formData.get('email'),
              phone: formData.get('phone'),
              details: formData.get('details')
            });
          }} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">الاسم الكامل *</Label>
                <Input id="name" name="name" required placeholder="اكتب اسمك الكامل" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">رقم الهاتف *</Label>
                <Input id="phone" name="phone" required placeholder="05xxxxxxxx" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني *</Label>
              <Input id="email" name="email" type="email" required placeholder="name@example.com" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="details">تفاصيل المشروع</Label>
              <textarea 
                id="details" 
                name="details"
                className="w-full h-32 px-3 py-2 border border-border rounded-lg resize-none bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="اكتب تفاصيل مشروعك، أهدافك، والمواصفات المطلوبة..."
              />
            </div>

            {selectedService && (
              <div className="p-4 bg-muted rounded-lg space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">الخدمة المطلوبة:</span>
                  <span>{selectedService.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold">السعر:</span>
                  <span className="text-primary font-bold">{selectedService.price} ر.س</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold">مدة التسليم:</span>
                  <span>{selectedService.delivery}</span>
                </div>
              </div>
            )}
            
            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    جاري الإرسال...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 mr-2" />
                    إرسال الطلب
                  </>
                )}
              </Button>
              
              <Button type="button" variant="outline" onClick={() => setIsOrderDialogOpen(false)}>
                إلغاء
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Footer />
      
    </div>
  );
};

export default EnhancedDesignCategory;