import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  className?: string;
  showText?: boolean;
  customText?: string;
}

const BackButton = ({ 
  className = "",
  showText = true,
  customText = "رجوع"
}: BackButtonProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    console.log('Back button clicked! Current path:', window.location.pathname);
    navigate('/business-services');
  };

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-white/30 text-white hover:bg-white/10 transition-all duration-200 cursor-pointer z-50 relative ${className}`}
      type="button"
    >
      <ArrowLeft className="w-4 h-4" />
      {showText && <span>{customText}</span>}
    </button>
  );
};

export default BackButton;