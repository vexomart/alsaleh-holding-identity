import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  Menu, 
  X, 
  Home, 
  Building2, 
  Users, 
  Mail, 
  ChevronDown,
  Globe,
  Settings,
  Brain,
  Target,
  Award,
  TrendingUp
} from "lucide-react";

// مكون Navigation مبسط بدون hooks معقدة
const SimpleNavigation = () => {
  const navItems = [
    { href: "/", label: "الرئيسية", icon: Home },
    { href: "/about", label: "من نحن", icon: Building2 },
    { href: "/ai-intelligence", label: "مركز الذكاء الاصطناعي", icon: Brain, badge: "جديد" },
    { href: "/current-offers", label: "العروض الحالية", icon: Target },
    { href: "/contact", label: "تواصل معنا", icon: Mail },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-border/40 shadow-lg">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">ASH HOLDING</h1>
              <p className="text-xs text-muted-foreground">مؤسسة علي الشهري القابضة</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8 rtl:space-x-reverse">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="flex items-center space-x-2 rtl:space-x-reverse text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
                {item.badge && (
                  <Badge variant="secondary" className="text-xs">
                    {item.badge}
                  </Badge>
                )}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => {
              // تنفيذ بسيط لفتح/إغلاق القائمة بدون state
              const mobileMenu = document.getElementById('mobile-menu');
              if (mobileMenu) {
                mobileMenu.classList.toggle('hidden');
              }
            }}
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>

        {/* Mobile Menu */}
        <div id="mobile-menu" className="hidden lg:hidden pb-4">
          <div className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="flex items-center space-x-2 rtl:space-x-reverse p-3 rounded-lg bg-muted/50 hover:bg-muted text-sm font-medium"
                onClick={() => {
                  // إخفاء القائمة عند النقر على رابط
                  const mobileMenu = document.getElementById('mobile-menu');
                  if (mobileMenu) {
                    mobileMenu.classList.add('hidden');
                  }
                }}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
                {item.badge && (
                  <Badge variant="secondary" className="text-xs ml-auto">
                    {item.badge}
                  </Badge>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default SimpleNavigation;