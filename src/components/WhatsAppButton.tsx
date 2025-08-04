import { MessageCircle } from "lucide-react";

const WhatsAppButton = () => {
  const handleWhatsAppClick = () => {
    const phoneNumber = "966555812567";
    const message = encodeURIComponent(`🌟 مرحبا بك في شركة علي صالح الشهري القابضة

👋 السلام عليكم ورحمة الله وبركاته

📞 تواصل سريع
═══════════════════

📌 نوع الاستفسار:
🎯 استفسار عام عن الخدمات
💡 طلب استشارة مجانية
📋 معرفة العروض الحالية
🚀 بدء مشروع جديد

🤔 ما يهمني معرفته:
• تفاصيل الخدمات المتاحة
• الأسعار والعروض الحالية
• مدة التنفيذ
• نماذج من الأعمال السابقة

💬 أريد التحدث مع أحد الخبراء

للرد على: info@alialshehriholding.com
شكرا لكم 🙏`);
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