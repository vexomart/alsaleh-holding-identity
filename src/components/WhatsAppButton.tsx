import { MessageCircle } from "lucide-react";

const WhatsAppButton = () => {
  const handleWhatsAppClick = () => {
    const phoneNumber = "966555812567"; // رقم الواتساب بدون الصفر والمع رمز البلد
    const message = encodeURIComponent("السلام عليكم، أرغب في الاستفسار عن خدماتكم");
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <button
      onClick={handleWhatsAppClick}
      className="fixed bottom-4 sm:bottom-6 left-4 sm:left-6 z-50 w-12 h-12 sm:w-14 sm:h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-glow flex items-center justify-center transition-all duration-300 hover:scale-110 mobile-touch"
      aria-label="تواصل عبر واتساب"
    >
      <MessageCircle className="w-5 h-5 sm:w-7 sm:h-7" />
    </button>
  );
};

export default WhatsAppButton;