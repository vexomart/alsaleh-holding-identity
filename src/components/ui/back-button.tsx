import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BackButtonProps {
  className?: string;
  showText?: boolean;
  customText?: string;
  fallbackPath?: string;
}

const BackButton = ({ 
  className = "",
  showText = true,
  customText = "رجوع",
  fallbackPath = "/"
}: BackButtonProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(fallbackPath);
    }
  };

  return (
    <Button
      onClick={handleClick}
      variant="outline"
      size="sm"
      className={`inline-flex items-center gap-2 bg-white/90 hover:bg-white border-slate-200 text-slate-700 hover:text-slate-900 shadow-sm ${className}`}
    >
      <ArrowLeft className="w-4 h-4" />
      {showText && <span>{customText}</span>}
    </Button>
  );
};

export default BackButton;