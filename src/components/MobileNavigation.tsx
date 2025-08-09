import { useState } from "react";
import { Menu, X, Home, Users, Globe, Phone, Star, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface MobileNavigationProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function MobileNavigation({ isOpen, onToggle }: MobileNavigationProps) {
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);

  const menuItems = [
    { name: "الرئيسية", href: "/", icon: Home },
    { name: "من نحن", href: "/about", icon: Users },
    { 
      name: "خدماتنا", 
      icon: Globe, 
      submenu: [
        { name: "حلول التصميم", href: "/design-solutions" },
        { name: "الخدمات التقنية", href: "/tech-services" },
        { name: "الاستشارات", href: "/consulting" },
        { name: "التطوير", href: "/development" }
      ]
    },
    { name: "تواصل معنا", href: "/contact", icon: Phone },
    { name: "التقييمات", href: "/reviews", icon: Star }
  ];

  const handleSubmenuToggle = (itemName: string) => {
    setActiveSubmenu(activeSubmenu === itemName ? null : itemName);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggle}
        className="nav-mobile-visible touch-target p-2"
        aria-label="فتح القائمة"
      >
        {isOpen ? (
          <X className="icon-responsive" />
        ) : (
          <Menu className="icon-responsive" />
        )}
      </Button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onToggle}
          />
          
          {/* Menu Panel */}
          <div className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl transform transition-transform duration-300 ease-out safe-top safe-bottom">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="text-lg font-bold text-gray-900">القائمة الرئيسية</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onToggle}
                  className="touch-target"
                >
                  <X className="icon-responsive" />
                </Button>
              </div>

              {/* Menu Items */}
              <div className="flex-1 overflow-y-auto mobile-scroll p-4">
                <nav className="space-y-2">
                  {menuItems.map((item, index) => (
                    <div key={index}>
                      {item.submenu ? (
                        <>
                          {/* Submenu Parent */}
                          <button
                            onClick={() => handleSubmenuToggle(item.name)}
                            className="w-full flex items-center justify-between p-3 text-right hover:bg-gray-50 rounded-lg transition-colors touch-target"
                          >
                            <ChevronRight 
                              className={cn(
                                "icon-responsive-sm transition-transform",
                                activeSubmenu === item.name && "rotate-90"
                              )} 
                            />
                            <div className="flex items-center gap-3">
                              <span className="font-medium text-gray-900">{item.name}</span>
                              <item.icon className="icon-responsive text-gray-600" />
                            </div>
                          </button>
                          
                          {/* Submenu Items */}
                          {activeSubmenu === item.name && (
                            <div className="mr-4 mt-2 space-y-1">
                              {item.submenu.map((subItem, subIndex) => (
                                <a
                                  key={subIndex}
                                  href={subItem.href}
                                  onClick={onToggle}
                                  className="block p-2 pr-8 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors touch-target"
                                >
                                  {subItem.name}
                                </a>
                              ))}
                            </div>
                          )}
                        </>
                      ) : (
                        /* Regular Menu Item */
                        <a
                          href={item.href}
                          onClick={onToggle}
                          className="flex items-center justify-between p-3 text-right hover:bg-gray-50 rounded-lg transition-colors touch-target"
                        >
                          <div className="flex items-center gap-3">
                            <span className="font-medium text-gray-900">{item.name}</span>
                            <item.icon className="icon-responsive text-gray-600" />
                          </div>
                        </a>
                      )}
                    </div>
                  ))}
                </nav>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-gray-200 space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>متاح الآن للخدمة</span>
                </div>
                <a 
                  href="tel:+966555812567"
                  className="flex items-center gap-2 p-2 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors touch-target"
                >
                  <Phone className="icon-responsive-sm text-blue-600" />
                  <span className="text-blue-700 font-medium">0555812567</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}