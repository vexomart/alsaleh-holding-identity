import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronLeft } from "lucide-react";

interface BackButtonProps {
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  showText?: boolean;
  customText?: string;
}

const BackButton = ({ 
  variant = "outline", 
  size = "md", 
  className = "",
  showText = true,
  customText = "رجوع"
}: BackButtonProps) => {
  const navigate = useNavigate();

  const handleBack = () => {
    // Always go back to business services page for these detail pages
    if (window.location.pathname.includes('/business-services/')) {
      navigate('/business-services');
    } else if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  const sizeClasses = {
    sm: "h-8 px-2",
    md: "h-10 px-4", 
    lg: "h-12 px-6"
  };

  return (
    <Button
      variant={variant}
      onClick={handleBack}
      className={`${sizeClasses[size]} ${className} group hover:shadow-md transition-all duration-200 cursor-pointer`}
      type="button"
    >
      <ArrowLeft className="w-4 h-4 ml-2 group-hover:-translate-x-1 transition-transform duration-200" />
      {showText && (
        <span className="text-sm font-medium">{customText}</span>
      )}
    </Button>
  );
};

export default BackButton;