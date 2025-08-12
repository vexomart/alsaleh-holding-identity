import { useState } from "react";
import { Building2, Menu, X, Home, Briefcase, Phone as PhoneIcon, Info, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface ConstructionHeaderProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

const ConstructionHeader = ({ currentPage, onPageChange }: ConstructionHeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigationItems = [
    { id: "home", label: "الرئيسية", icon: Home },
    { id: "services", label: "خدماتنا", icon: Briefcase },
    { id: "projects", label: "مشاريعنا", icon: Building2 },
    { id: "about", label: "من نحن", icon: Info },
    { id: "careers", label: "الوظائف", icon: Users },
    { id: "contact", label: "تواصل معنا", icon: PhoneIcon }
  ];

  return (
    <>
      {/* Demo Site Alert */}
      <Alert className="border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 border-b rounded-none">
        <AlertTriangle className="h-5 w-5 text-amber-600" />
        <AlertDescription className="text-amber-800 font-medium text-center">
          🚧 هذا موقع تجريبي للمعاينة فقط - تم تطويره بواسطة شركة علي صالح الشهري القابضة
        </AlertDescription>
      </Alert>

      {/* Header/Navigation */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/50 shadow-sm">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-3 rounded-xl shadow-lg">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-blue-800 bg-clip-text text-transparent">
                  المقاولات العالمية
                </h1>
                <p className="text-sm text-slate-500">بناء المستقبل بأيدي محترفة</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8 space-x-reverse">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onPageChange(item.id)}
                  className={`flex items-center space-x-2 space-x-reverse px-4 py-2 rounded-lg transition-all duration-300 ${
                    currentPage === item.id 
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg' 
                      : 'text-slate-700 hover:bg-blue-50 hover:text-blue-600'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </nav>

            {/* CTA Button */}
            <div className="hidden lg:flex items-center space-x-4 space-x-reverse">
              <Button className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg">
                احصل على عرض سعر
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="lg:hidden py-4 border-t border-slate-200/50">
              <nav className="space-y-2">
                {navigationItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      onPageChange(item.id);
                      setIsMenuOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 space-x-reverse px-4 py-3 rounded-lg transition-all duration-300 ${
                      currentPage === item.id 
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white' 
                        : 'text-slate-700 hover:bg-blue-50'
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default ConstructionHeader;