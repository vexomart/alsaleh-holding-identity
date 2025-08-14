import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  Crown, Sparkles, Phone, Clock, Instagram, Facebook, Twitter, 
  MessageCircle, ShoppingBag, Heart, Flower
} from 'lucide-react';
import abayaPatternBg from '@/assets/abaya-pattern-bg.jpg';

interface AbayaHeaderProps {
  onContactClick?: () => void;
  onShopClick?: () => void;
}

const AbayaHeader: React.FC<AbayaHeaderProps> = ({ 
  onContactClick = () => {
    const message = "👗 أرغب في التواصل مع فريق متجر عبايتي";
    const phone = "966500000000";
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  },
  onShopClick = () => {
    window.location.href = '/abayati-store';
  }
}) => {
  return (
    <header className="relative bg-gradient-to-r from-purple-900 via-rose-800 to-pink-900 text-white overflow-hidden shadow-2xl">
      <div 
        className="absolute inset-0 bg-black/40"
        style={{ 
          backgroundImage: `url(${abayaPatternBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'overlay'
        }}
      ></div>
      <div className="absolute inset-0">
        <div className="absolute top-10 right-10 w-20 h-20 border border-rose-300/30 rounded-full animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-16 h-16 border border-purple-300/30 rounded-full animate-pulse"></div>
        <div className="absolute top-1/2 left-1/4 w-3 h-3 bg-rose-300/40 rounded-full animate-ping"></div>
        <div className="absolute top-1/4 right-1/3 w-2 h-2 bg-purple-300/40 rounded-full animate-ping"></div>
        <div className="absolute top-3/4 left-1/2 w-4 h-4 bg-pink-300/30 rounded-full animate-pulse"></div>
      </div>
      
        <div className="relative container mx-auto px-4">
          {/* Top Bar */}
          <div className="hidden md:flex items-center justify-between py-3 border-b border-white/20">
            <div className="flex items-center gap-6 text-sm animate-fade-in">
              <div className="flex items-center gap-2 hover:text-rose-200 transition-colors">
                <Phone className="w-4 h-4 animate-pulse" />
                <span className="hidden lg:inline">966500000000+</span>
                <span className="lg:hidden">اتصلي بنا</span>
              </div>
              <div className="flex items-center gap-2 hover:text-purple-200 transition-colors">
                <Clock className="w-4 h-4" />
                <span className="hidden lg:inline">الأحد - الخميس: 9ص - 10م</span>
                <span className="lg:hidden">أوقات العمل</span>
              </div>
              <div className="hidden lg:flex items-center gap-2 text-rose-200">
                <Flower className="w-4 h-4 animate-pulse" />
                <span className="font-arabic">أناقة عربية أصيلة</span>
              </div>
            </div>
            <div className="flex items-center gap-4 animate-fade-in">
              <a href="#" className="text-white/80 hover:text-rose-300 transition-all duration-300 hover:scale-110">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-white/80 hover:text-purple-300 transition-all duration-300 hover:scale-110">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-white/80 hover:text-pink-300 transition-all duration-300 hover:scale-110">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Main Header */}
          <div className="flex flex-col md:flex-row items-center justify-between py-4 md:py-6 animate-fade-in">
            <Link to="/abayati-store" className="flex items-center gap-4 md:gap-6 hover:scale-105 transition-transform duration-300 mb-4 md:mb-0">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-rose-400 via-purple-500 to-pink-600 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
                <Crown className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
              <div className="text-center md:text-right">
                <h1 className="text-2xl md:text-4xl lg:text-6xl font-bold mb-1 md:mb-2 bg-gradient-to-r from-rose-200 via-purple-200 to-pink-200 bg-clip-text text-transparent animate-scale-in">
                  متجر عبايتي
                </h1>
                <p className="text-sm md:text-lg text-purple-100 flex items-center justify-center md:justify-start gap-2 animate-fade-in">
                  <Sparkles className="w-4 h-4 md:w-5 md:h-5 animate-pulse" />
                  <span className="hidden sm:inline">بيت الأناقة والجمال العربي الأصيل</span>
                  <span className="sm:hidden">أناقة عربية أصيلة</span>
                  <Heart className="w-3 h-3 md:w-4 md:h-4 text-rose-300 animate-pulse" />
                </p>
              </div>
            </Link>
            
            <div className="flex flex-col sm:flex-row items-center gap-3 md:gap-4 animate-fade-in w-full md:w-auto">
              <Button 
                className="w-full sm:w-auto bg-white/10 backdrop-blur-sm border border-white/30 text-white hover:bg-white/20 px-4 md:px-6 py-2 md:py-3 text-sm md:text-base transition-all duration-300 hover:scale-105 shadow-lg"
                onClick={onContactClick}
              >
                <MessageCircle className="w-4 h-4 md:w-5 md:h-5 ml-2 animate-pulse" />
                تواصلي معنا
              </Button>
              <Button 
                className="w-full sm:w-auto bg-gradient-to-r from-rose-500 via-purple-500 to-pink-500 hover:from-rose-600 hover:via-purple-600 hover:to-pink-600 text-white px-4 md:px-6 py-2 md:py-3 text-sm md:text-base shadow-2xl transition-all duration-300 hover:scale-105 animate-pulse"
                onClick={onShopClick}
              >
                <ShoppingBag className="w-4 h-4 md:w-5 md:h-5 ml-2" />
                تسوقي الآن
              </Button>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="pb-2 md:pb-4 animate-fade-in">
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 text-xs md:text-sm overflow-x-auto">
              <Link to="/abayati-store" className="whitespace-nowrap text-white/90 hover:text-rose-300 transition-all duration-300 py-2 border-b-2 border-transparent hover:border-rose-300 hover:scale-105">
                الرئيسية
              </Link>
              <Link to="/abayati-store/luxury" className="whitespace-nowrap text-white/90 hover:text-purple-300 transition-all duration-300 py-2 border-b-2 border-transparent hover:border-purple-300 hover:scale-105">
                <span className="hidden sm:inline">العبايات الملكية</span>
                <span className="sm:hidden">ملكية</span>
              </Link>
              <Link to="/abayati-store/casual" className="whitespace-nowrap text-white/90 hover:text-pink-300 transition-all duration-300 py-2 border-b-2 border-transparent hover:border-pink-300 hover:scale-105">
                <span className="hidden sm:inline">العبايات اليومية</span>
                <span className="sm:hidden">يومية</span>
              </Link>
              <Link to="/abayati-store/formal" className="whitespace-nowrap text-white/90 hover:text-rose-300 transition-all duration-300 py-2 border-b-2 border-transparent hover:border-rose-300 hover:scale-105">
                <span className="hidden sm:inline">العبايات الرسمية</span>
                <span className="sm:hidden">رسمية</span>
              </Link>
              <Link to="/abayati-store/about" className="whitespace-nowrap text-white/90 hover:text-purple-300 transition-all duration-300 py-2 border-b-2 border-transparent hover:border-purple-300 hover:scale-105">
                من نحن
              </Link>
              <Link to="/abayati-store/contact" className="whitespace-nowrap text-white/90 hover:text-pink-300 transition-all duration-300 py-2 border-b-2 border-transparent hover:border-pink-300 hover:scale-105">
                <span className="hidden sm:inline">اتصلي بنا</span>
                <span className="sm:hidden">اتصال</span>
              </Link>
            </div>
          </nav>
      </div>
    </header>
  );
};

export default AbayaHeader;