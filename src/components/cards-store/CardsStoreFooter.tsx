import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  ShoppingCart,
  MessageCircle,
  Phone,
  Mail,
  Clock,
  Globe,
  ArrowRight,
  Heart,
  Shield,
  Award,
  Zap
} from "lucide-react";

interface CardsStoreFooterProps {
  onCategorySelect?: (category: string) => void;
}

export function CardsStoreFooter({ onCategorySelect }: CardsStoreFooterProps) {
  const navigationItems = [
    { name: "الرئيسية", href: "/cards-store" },
    { name: "عن المتجر", href: "/cards-store/about" },
    { name: "تواصل معنا", href: "/cards-store/contact" },
    { name: "الأسئلة الشائعة", href: "/cards-store/faq" },
    { name: "الشروط والأحكام", href: "/cards-store/terms" },
    { name: "سياسة الخصوصية", href: "/cards-store/privacy" }
  ];

  const categories = [
    { name: "الألعاب", emoji: "🎮" },
    { name: "التطبيقات", emoji: "📱" },
    { name: "الموسيقى", emoji: "🎵" },
    { name: "التسوق", emoji: "🛒" },
    { name: "الترفيه", emoji: "🎬" }
  ];

  const features = [
    { 
      title: "أمان مضمون", 
      description: "جميع البطاقات أصلية ومضمونة",
      icon: Shield,
      color: "text-green-500"
    },
    { 
      title: "توصيل فوري", 
      description: "احصل على بطاقتك خلال دقائق",
      icon: Zap,
      color: "text-yellow-500"
    },
    { 
      title: "خدمة مميزة", 
      description: "دعم عملاء على مدار الساعة",
      icon: Award,
      color: "text-purple-500"
    }
  ];

  const socialMedia = [
    { 
      name: "واتساب", 
      color: "bg-green-600 hover:bg-green-700", 
      url: "https://wa.me/966500000000",
      icon: MessageCircle
    },
    { 
      name: "تويتر", 
      color: "bg-blue-500 hover:bg-blue-600", 
      url: "#",
      icon: MessageCircle
    },
    { 
      name: "انستغرام", 
      color: "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600", 
      url: "#",
      icon: MessageCircle
    }
  ];

  return (
    <motion.footer 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="bg-slate-900 text-white relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none"></div>
      
      {/* Main Footer Content */}
      <div className="relative py-16">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Logo & Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-primary via-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <ShoppingCart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">متجر البطاقات الإلكترونية</h3>
                  <p className="text-sm text-slate-400">المتجر الأول في المملكة</p>
                </div>
              </div>
              <p className="text-slate-400 leading-relaxed mb-6">
                المتجر الأول والأكثر ثقة في المملكة العربية السعودية لبيع البطاقات الإلكترونية والرقمية 
                بأفضل الأسعار وأعلى معايير الجودة والأمان.
              </p>
              
              {/* Social Media */}
              <div className="flex gap-3">
                {socialMedia.map((social) => {
                  const IconComponent = social.icon;
                  return (
                    <motion.a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.9 }}
                      className={`w-10 h-10 ${social.color} rounded-lg flex items-center justify-center text-white shadow-lg transition-all duration-300`}
                    >
                      <IconComponent className="w-5 h-5" />
                    </motion.a>
                  );
                })}
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
                <ArrowRight className="w-5 h-5 text-primary" />
                روابط سريعة
              </h4>
              <ul className="space-y-3">
                {navigationItems.map((item) => (
                  <li key={item.name}>
                    <Link 
                      to={item.href}
                      className="text-slate-400 hover:text-white transition-colors duration-300 flex items-center gap-2 group"
                    >
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Categories */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-primary" />
                فئات البطاقات
              </h4>
              <ul className="space-y-3">
                {categories.map((category) => (
                  <li key={category.name}>
                    <button 
                      onClick={() => onCategorySelect?.(category.name)}
                      className="text-slate-400 hover:text-white transition-colors duration-300 flex items-center gap-2 group"
                    >
                      <span className="text-lg">{category.emoji}</span>
                      {category.name}
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-primary" />
                معلومات التواصل
              </h4>
              <div className="space-y-4">
                <motion.a
                  href="https://wa.me/966500000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-3 text-slate-400 hover:text-green-400 transition-colors duration-300 group"
                >
                  <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <MessageCircle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">واتساب</p>
                    <p className="text-sm">+966 50 000 0000</p>
                  </div>
                </motion.a>

                <motion.a
                  href="tel:+966500000000"
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-3 text-slate-400 hover:text-blue-400 transition-colors duration-300 group"
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Phone className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">مكالمة هاتفية</p>
                    <p className="text-sm">+966 50 000 0000</p>
                  </div>
                </motion.a>

                <div className="flex items-center gap-3 text-slate-400">
                  <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                    <Mail className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">البريد الإلكتروني</p>
                    <p className="text-sm">info@cards-store.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-slate-400">
                  <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
                    <Clock className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">ساعات العمل</p>
                    <p className="text-sm">دعم 24/7</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Features Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 pt-8 border-t border-slate-700"
          >
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-xl backdrop-blur-sm border border-slate-700 hover:border-primary/30 transition-all duration-300"
                >
                  <div className={`w-12 h-12 bg-slate-700 rounded-xl flex items-center justify-center ${feature.color}`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div>
                    <h5 className="font-bold text-white mb-1">{feature.title}</h5>
                    <p className="text-sm text-slate-400">{feature.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Bottom Section */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="border-t border-slate-700 pt-8 text-center"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-slate-400 flex items-center gap-2">
                © 2024 متجر البطاقات الإلكترونية. جميع الحقوق محفوظة.
                <Heart className="w-4 h-4 text-red-500 animate-pulse" />
              </p>
              <p className="text-slate-400">
                تم التطوير بواسطة{" "}
                <span className="text-primary font-bold">شركة علي صالح الشهري القابضة</span>
              </p>
            </div>
            
            <div className="mt-4 flex flex-wrap justify-center gap-4 text-sm text-slate-500">
              <span className="flex items-center gap-1">
                <Globe className="w-4 h-4" />
                المملكة العربية السعودية
              </span>
              <span className="flex items-center gap-1">
                <Shield className="w-4 h-4" />
                بطاقات أصلية مضمونة
              </span>
              <span className="flex items-center gap-1">
                <Zap className="w-4 h-4" />
                توصيل فوري
              </span>
              <span className="flex items-center gap-1">
                <Award className="w-4 h-4" />
                خدمة عملاء متميزة
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.footer>
  );
}