import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

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

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Back button clicked!'); // للتتبع
    
    // Always go back to business services page for these detail pages
    if (window.location.pathname.includes('/business-services/')) {
      navigate('/business-services');
    } else {
      navigate(-1);
    }
  };

  const sizeClasses = {
    sm: "h-8 px-2",
    md: "h-10 px-4", 
    lg: "h-12 px-6"
  };

  return (
    <button
      onClick={handleBack}
      className={`${sizeClasses[size]} ${className} inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground group hover:shadow-md transition-all duration-200 cursor-pointer`}
      type="button"
    >
      <ArrowLeft className="w-4 h-4 ml-2 group-hover:-translate-x-1 transition-transform duration-200" />
      {showText && (
        <span className="text-sm font-medium">{customText}</span>
      )}
    </button>
  );
};

export default BackButton;