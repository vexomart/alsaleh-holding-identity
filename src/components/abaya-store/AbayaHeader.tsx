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
        <div className="flex items-center justify-between py-3 border-b border-white/20">
          <div className="flex items-center gap-6 text-sm animate-fade-in">
            <div className="flex items-center gap-2 hover:text-rose-200 transition-colors">
              <Phone className="w-4 h-4 animate-pulse" />
              <span>966500000000+</span>
            </div>
            <div className="flex items-center gap-2 hover:text-purple-200 transition-colors">
              <Clock className="w-4 h-4" />
              <span>الأحد - الخميس: 9ص - 10م</span>
            </div>
            <div className="flex items-center gap-2 text-rose-200">
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
        <div className="flex items-center justify-between py-6 animate-fade-in">
          <Link to="/abayati-store" className="flex items-center gap-6 hover:scale-105 transition-transform duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-rose-400 via-purple-500 to-pink-600 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold mb-2 bg-gradient-to-r from-rose-200 via-purple-200 to-pink-200 bg-clip-text text-transparent animate-scale-in">
                متجر عبايتي
              </h1>
              <p className="text-lg text-purple-100 flex items-center gap-2 animate-fade-in">
                <Sparkles className="w-5 h-5 animate-pulse" />
                بيت الأناقة والجمال العربي الأصيل
                <Heart className="w-4 h-4 text-rose-300 animate-pulse" />
              </p>
            </div>
          </Link>
          
          <div className="flex items-center gap-4 animate-fade-in">
            <Button 
              className="bg-white/10 backdrop-blur-sm border border-white/30 text-white hover:bg-white/20 px-6 py-3 transition-all duration-300 hover:scale-105 shadow-lg"
              onClick={onContactClick}
            >
              <MessageCircle className="w-5 h-5 ml-2 animate-pulse" />
              تواصلي معنا
            </Button>
            <Button 
              className="bg-gradient-to-r from-rose-500 via-purple-500 to-pink-500 hover:from-rose-600 hover:via-purple-600 hover:to-pink-600 text-white px-6 py-3 shadow-2xl transition-all duration-300 hover:scale-105 animate-pulse"
              onClick={onShopClick}
            >
              <ShoppingBag className="w-5 h-5 ml-2" />
              تسوقي الآن
            </Button>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="pb-4 animate-fade-in">
          <div className="flex items-center justify-center gap-8 text-sm">
            <Link to="/abayati-store" className="text-white/90 hover:text-rose-300 transition-all duration-300 py-2 border-b-2 border-transparent hover:border-rose-300 hover:scale-105">
              الرئيسية
            </Link>
            <Link to="/abayati-store/luxury" className="text-white/90 hover:text-purple-300 transition-all duration-300 py-2 border-b-2 border-transparent hover:border-purple-300 hover:scale-105">
              العبايات الملكية
            </Link>
            <Link to="/abayati-store/casual" className="text-white/90 hover:text-pink-300 transition-all duration-300 py-2 border-b-2 border-transparent hover:border-pink-300 hover:scale-105">
              العبايات اليومية
            </Link>
            <Link to="/abayati-store/formal" className="text-white/90 hover:text-rose-300 transition-all duration-300 py-2 border-b-2 border-transparent hover:border-rose-300 hover:scale-105">
              العبايات الرسمية
            </Link>
            <Link to="/abayati-store/about" className="text-white/90 hover:text-purple-300 transition-all duration-300 py-2 border-b-2 border-transparent hover:border-purple-300 hover:scale-105">
              من نحن
            </Link>
            <Link to="/abayati-store/contact" className="text-white/90 hover:text-pink-300 transition-all duration-300 py-2 border-b-2 border-transparent hover:border-pink-300 hover:scale-105">
              اتصلي بنا
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default AbayaHeader;