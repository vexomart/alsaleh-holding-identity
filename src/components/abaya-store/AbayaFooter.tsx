import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { 
  Crown, Sparkles, Phone, Mail, MapPin, Clock, Instagram, Facebook, Twitter,
  Heart, Award, CreditCard, Truck, RotateCcw, Shield, Headphones
} from 'lucide-react';

const AbayaFooter: React.FC = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-10 right-10 w-24 h-24 border border-white/10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-16 h-16 border border-white/10 rounded-full animate-pulse"></div>
        <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-white/20 rounded-full animate-ping"></div>
        <div className="absolute top-1/4 right-1/3 w-2 h-2 bg-white/20 rounded-full animate-ping"></div>
      </div>
      
      <div className="relative container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-rose-400 to-purple-600 rounded-full flex items-center justify-center animate-pulse">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-3xl font-bold bg-gradient-to-r from-rose-300 to-purple-300 bg-clip-text text-transparent">
                متجر عبايتي
              </h4>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed text-lg">
              بيت الأناقة والجمال العربي الأصيل، حيث نصنع لك عباءة أحلامك التي تعكس 
              شخصيتك المميزة وتبرز جمالك الطبيعي بأسلوب راقي وعصري.
            </p>
            <div className="flex flex-wrap gap-3">
              <Badge className="bg-gradient-to-r from-rose-600 to-purple-600 text-white border-0 px-4 py-2">
                <Crown className="w-4 h-4 ml-2" />
                تصاميم ملكية
              </Badge>
              <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 px-4 py-2">
                <Award className="w-4 h-4 ml-2" />
                جودة استثنائية
              </Badge>
              <Badge className="bg-gradient-to-r from-pink-600 to-rose-600 text-white border-0 px-4 py-2">
                <Heart className="w-4 h-4 ml-2" />
                صنع بحب
              </Badge>
            </div>
          </div>
          
          <div>
            <h5 className="text-xl font-semibold mb-6 text-rose-300 flex items-center gap-2">
              <Crown className="w-5 h-5" />
              مجموعات العبايات
            </h5>
            <ul className="space-y-3 text-gray-300">
              <li>
                <Link to="/abayati-store/luxury" className="hover:text-rose-300 transition-colors flex items-center gap-2">
                  <Crown className="w-4 h-4" />
                  العبايات الملكية الفاخرة
                </Link>
              </li>
              <li>
                <Link to="/abayati-store/casual" className="hover:text-rose-300 transition-colors flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  العبايات اليومية العملية
                </Link>
              </li>
              <li>
                <Link to="/abayati-store/formal" className="hover:text-rose-300 transition-colors flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  العبايات الرسمية الأنيقة
                </Link>
              </li>
              <li>
                <Link to="/abayati-store/sports" className="hover:text-rose-300 transition-colors flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  العبايات الرياضية النشطة
                </Link>
              </li>
              <li>
                <Link to="/abayati-store/wedding" className="hover:text-rose-300 transition-colors flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  عبايات الأفراح والمناسبات
                </Link>
              </li>
              <li>
                <Link to="/abayati-store/traditional" className="hover:text-rose-300 transition-colors flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  العبايات التراثية الأصيلة
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-xl font-semibold mb-6 text-purple-300 flex items-center gap-2">
              <Headphones className="w-5 h-5" />
              خدمة العملاء
            </h5>
            <ul className="space-y-3 text-gray-300">
              <li>
                <Link to="/abayati-store/shipping-delivery" className="hover:text-purple-300 transition-colors flex items-center gap-2">
                  <Truck className="w-4 h-4 text-blue-400" />
                  الشحن والتوصيل
                </Link>
              </li>
              <li>
                <Link to="/abayati-store/return-procedures" className="hover:text-purple-300 transition-colors flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-orange-400" />
                  إجراءات الإرجاع
                </Link>
              </li>
              <li>
                <Link to="/abayati-store/return-policy" className="hover:text-purple-300 transition-colors flex items-center gap-2">
                  <Shield className="w-4 h-4 text-purple-400" />
                  سياسة الإرجاع
                </Link>
              </li>
              <li>
                <Link to="/abayati-store/help-center" className="hover:text-purple-300 transition-colors flex items-center gap-2">
                  <Headphones className="w-4 h-4 text-green-400" />
                  مركز المساعدة
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-green-400" />
                طرق دفع متنوعة وآمنة
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-rose-400" />
                دعم فني 24/7
              </li>
              <li className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-yellow-400" />
                تصاميم حصرية ومميزة
              </li>
            </ul>
          </div>
        </div>

        {/* Contact Section */}
        <div className="border-t border-white/10 pt-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center animate-pulse">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-lg">الواتساب</p>
                <p className="text-gray-300">966500000000+</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center animate-pulse">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-lg">البريد الإلكتروني</p>
                <p className="text-gray-300">info@abayati.com</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center animate-pulse">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-lg">العنوان</p>
                <p className="text-gray-300">الرياض، المملكة العربية السعودية</p>
              </div>
            </div>
          </div>
        </div>

        {/* Working Hours & Social Media */}
        <div className="border-t border-white/10 pt-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
              <p className="text-lg text-purple-200 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                أوقات العمل
              </p>
              <p className="text-gray-300 mb-2">الأحد - الخميس: 9 صباحاً - 10 مساءً</p>
              <p className="text-gray-300">الجمعة - السبت: 2 ظهراً - 11 مساءً</p>
            </div>

            <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
              <p className="text-lg text-purple-200 mb-4">تابعينا على وسائل التواصل</p>
              <div className="flex gap-4">
                <a href="#" className="w-12 h-12 bg-gradient-to-r from-pink-600 to-rose-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300">
                  <Instagram className="w-6 h-6 text-white" />
                </a>
                <a href="#" className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300">
                  <Facebook className="w-6 h-6 text-white" />
                </a>
                <a href="#" className="w-12 h-12 bg-gradient-to-r from-cyan-600 to-cyan-700 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300">
                  <Twitter className="w-6 h-6 text-white" />
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8 text-center">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm">
              &copy; 2024 متجر عبايتي. جميع الحقوق محفوظة.
            </p>
            <p className="text-gray-400 text-sm flex items-center gap-2">
              تطوير بحب في 
              <span className="text-purple-300 font-semibold">شركة علي صالح الشهري القابضة</span>
              <Heart className="w-4 h-4 text-rose-400 animate-pulse" />
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AbayaFooter;