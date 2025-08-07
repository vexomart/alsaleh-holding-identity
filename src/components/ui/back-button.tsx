import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BackButtonProps {
  className?: string;
  showText?: boolean;
  customText?: string;
  fallbackPath?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "default" | "lg";
  showHomeButton?: boolean;
}

const BackButton = ({ 
  className = "",
  showText = true,
  customText = "رجوع",
  fallbackPath = "/",
  variant = "outline",
  size = "sm",
  showHomeButton = true
}: BackButtonProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(fallbackPath);
    }
  };

  const handleHome = () => {
    navigate("/");
  };

  // Don't show on homepage
  if (isHomePage) return null;

  return (
    <div className="flex items-center gap-3 mb-6">
      <Button
        onClick={handleBack}
        variant={variant}
        size={size}
        className={`inline-flex items-center gap-2 hover-scale transition-all duration-300 shadow-sm hover:shadow-md ${className}`}
      >
        <ArrowLeft className="w-4 h-4" />
        {showText && <span>{customText}</span>}
      </Button>
      
      {showHomeButton && (
        <Button
          onClick={handleHome}
          variant="ghost"
          size={size}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-300"
        >
          <Home className="w-4 h-4" />
          <span>الرئيسية</span>
        </Button>
      )}
    </div>
  );
};

export default BackButton;