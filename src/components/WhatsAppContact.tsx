import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  MessageCircle, 
  X, 
  Send, 
  Phone,
  User,
  Mail,
  MessageSquare,
  CreditCard,
  Sparkles,
  Building2,
  Globe,
  ShoppingBag,
  Crown,
  Star
} from 'lucide-react';

interface SmartCardsContactProps {
  className?: string;
  defaultMessage?: string;
  showAsButton?: boolean;
  buttonText?: string;
  pageTitle?: string;
}

const AnimatedIcon = ({ icon: Icon, delay = 0 }: { icon: any; delay?: number }) => (
  <motion.div
    initial={{ scale: 0, rotate: -180 }}
    animate={{ scale: 1, rotate: 0 }}
    transition={{ 
      delay, 
      type: "spring", 
      stiffness: 200, 
      damping: 15 
    }}
    whileHover={{ scale: 1.1, rotate: 10 }}
    className="inline-block"
  >
    <Icon className="h-5 w-5" />
  </motion.div>
);

export const SmartCardsContact: React.FC<SmartCardsContactProps> = ({
  className = "",
  defaultMessage = "",
  showAsButton = true,
  buttonText = "متجر البطاقات الذكي - تواصل معنا",
  pageTitle = "متجر البطاقات الإلكترونية الذكي"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: defaultMessage
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleWhatsAppSend = () => {
    const message = `🌟 مرحباً من متجر البطاقات الإلكترونية الذكي
    
🏢 *ASH HOLDING*
🎯 ${pageTitle}

👤 *معلومات العميل:*
• الاسم: ${formData.name || 'غير محدد'}
• الجوال: ${formData.phone || 'غير محدد'}  
• الإيميل: ${formData.email || 'غير محدد'}

💬 *الطلب/الاستفسار:*
${formData.message || 'استفسار عام عن خدماتكم'}

⚡ نحن في انتظار تواصلكم السريع لخدمتكم على أفضل وجه
🎁 أفضل العروض والخدمات المميزة في انتظاركم`;

    const whatsappUrl = `https://wa.me/9660555812567?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    setIsOpen(false);
    
    setFormData({
      name: '',
      email: '',
      phone: '',
      message: defaultMessage
    });
  };

  const handleDirectWhatsApp = () => {
    const message = `🌟 مرحباً من متجر البطاقات الإلكترونية الذكي
🏢 ASH HOLDING

أرجو التواصل لمزيد من المعلومات عن خدماتكم المميزة.`;

    const whatsappUrl = `https://wa.me/9660555812567?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (showAsButton) {
    return (
      <>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={() => setIsOpen(true)}
            className={`relative overflow-hidden bg-gradient-to-r from-green-500 via-green-600 to-emerald-600 hover:from-green-600 hover:via-green-700 hover:to-emerald-700 text-white font-bold shadow-xl hover:shadow-2xl transition-all duration-300 ${className}`}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
            />
            <AnimatedIcon icon={CreditCard} />
            <span className="mx-2">{buttonText}</span>
            <AnimatedIcon icon={Sparkles} delay={0.2} />
          </Button>
        </motion.div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setIsOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.7, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.7, opacity: 0, y: 50 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-lg"
              >
                <Card className="relative overflow-hidden bg-gradient-to-br from-white via-gray-50 to-green-50 shadow-2xl border-0">
                  {/* Animated Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-emerald-500/5 to-blue-500/5" />
                  
                  {/* Close Button */}
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute top-4 left-4 z-20"
                  >
                    <Button
                      onClick={() => setIsOpen(false)}
                      variant="ghost"
                      size="sm"
                      className="rounded-full hover:bg-red-100 hover:text-red-600"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </motion.div>

                  {/* Header */}
                  <CardHeader className="text-center pb-6 pt-8 relative">
                    <motion.div 
                      className="flex justify-center items-center gap-3 mb-4"
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <AnimatedIcon icon={Building2} />
                      <div className="h-8 w-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                        <Crown className="h-4 w-4 text-white" />
                      </div>
                      <AnimatedIcon icon={CreditCard} delay={0.1} />
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <CardTitle className="text-xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-blue-600 bg-clip-text text-transparent">
                        متجر البطاقات الإلكترونية الذكي
                      </CardTitle>
                      <motion.p 
                        className="text-sm text-gray-600 mt-2 font-medium"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        ASH HOLDING
                      </motion.p>
                    </motion.div>

                    {/* Floating Stars */}
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute"
                        style={{
                          left: `${20 + i * 30}%`,
                          top: `${10 + i * 10}%`
                        }}
                        animate={{
                          y: [-5, 5, -5],
                          rotate: [0, 360],
                          scale: [0.8, 1.2, 0.8]
                        }}
                        transition={{
                          duration: 3 + i,
                          repeat: Infinity,
                          delay: i * 0.5
                        }}
                      >
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                      </motion.div>
                    ))}
                  </CardHeader>

                  {/* Form Content */}
                  <CardContent className="space-y-6 px-8 pb-8 relative">
                    {/* Name and Phone Row */}
                    <motion.div 
                      className="grid grid-cols-1 md:grid-cols-2 gap-4"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <User className="h-4 w-4 text-green-600" />
                          الاسم الكريم
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="أدخل اسمك الكريم"
                          className="border-2 border-gray-200 focus:border-green-500 rounded-xl transition-all duration-300 hover:border-green-300"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <Phone className="h-4 w-4 text-green-600" />
                          رقم الجوال
                        </Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="05xxxxxxxx"
                          className="border-2 border-gray-200 focus:border-green-500 rounded-xl transition-all duration-300 hover:border-green-300"
                        />
                      </div>
                    </motion.div>

                    {/* Email */}
                    <motion.div 
                      className="space-y-2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <Label htmlFor="email" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <Mail className="h-4 w-4 text-green-600" />
                        البريد الإلكتروني (اختياري)
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="example@email.com"
                        className="border-2 border-gray-200 focus:border-green-500 rounded-xl transition-all duration-300 hover:border-green-300"
                      />
                    </motion.div>

                    {/* Message */}
                    <motion.div 
                      className="space-y-2"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <Label htmlFor="message" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-green-600" />
                        رسالتك / طلبك
                      </Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="اكتب طلبك أو استفسارك هنا..."
                        rows={4}
                        className="border-2 border-gray-200 focus:border-green-500 rounded-xl transition-all duration-300 hover:border-green-300 resize-none"
                      />
                    </motion.div>

                    {/* Action Buttons */}
                    <motion.div 
                      className="flex flex-col sm:flex-row gap-3 pt-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                    >
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1"
                      >
                        <Button
                          onClick={handleWhatsAppSend}
                          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          <Send className="h-4 w-4 mr-2" />
                          إرسال عبر الواتساب
                          <Sparkles className="h-4 w-4 ml-2" />
                        </Button>
                      </motion.div>
                      
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1"
                      >
                        <Button
                          onClick={handleDirectWhatsApp}
                          variant="outline"
                          className="w-full border-2 border-green-500 text-green-600 hover:bg-green-50 font-bold py-3 rounded-xl transition-all duration-300"
                        >
                          <Phone className="h-4 w-4 mr-2" />
                          تواصل مباشر
                        </Button>
                      </motion.div>
                    </motion.div>

                    {/* Footer Note */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 }}
                      className="text-center"
                    >
                      <p className="text-xs text-gray-500 bg-gray-100 rounded-lg p-3">
                        <Globe className="h-3 w-3 inline mr-1" />
                        سيتم فتح تطبيق الواتساب مع رسالتك جاهزة للإرسال
                      </p>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }

  // Floating Contact Button
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 200 }}
      className={`fixed bottom-6 right-6 z-40 ${className}`}
    >
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{ 
          boxShadow: [
            "0 0 20px rgba(34, 197, 94, 0.3)",
            "0 0 40px rgba(34, 197, 94, 0.6)",
            "0 0 20px rgba(34, 197, 94, 0.3)"
          ]
        }}
        transition={{ 
          boxShadow: { duration: 2, repeat: Infinity }
        }}
      >
        <Button
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 via-emerald-600 to-green-600 hover:from-green-600 hover:via-emerald-700 hover:to-green-700 text-white shadow-2xl transition-all duration-300 relative overflow-hidden"
          size="sm"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ShoppingBag className="h-7 w-7" />
          </motion.div>
        </Button>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            className="absolute bottom-20 right-0 w-96 max-w-[90vw]"
          >
            <Card className="shadow-2xl border-0 bg-gradient-to-br from-white via-green-50 to-emerald-50 overflow-hidden">
              {/* Compact Header */}
              <CardHeader className="bg-gradient-to-r from-green-500 via-emerald-600 to-green-600 text-white p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <CreditCard className="h-5 w-5" />
                    </motion.div>
                    <CardTitle className="text-sm font-bold">متجر البطاقات الذكي</CardTitle>
                  </div>
                  <Button
                    onClick={() => setIsOpen(false)}
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20 rounded-full"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs opacity-90 mt-1">شركة علي صالح الشهري القابضة</p>
              </CardHeader>

              {/* Compact Form */}
              <CardContent className="p-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="الاسم"
                    className="text-sm border-green-200 focus:border-green-500 rounded-lg"
                  />
                  <Input
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="الجوال"
                    className="text-sm border-green-200 focus:border-green-500 rounded-lg"
                  />
                </div>
                
                <Textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="اكتب طلبك هنا..."
                  rows={3}
                  className="text-sm border-green-200 focus:border-green-500 rounded-lg resize-none"
                />
                
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={handleWhatsAppSend}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold text-sm py-2 rounded-lg shadow-lg"
                  >
                    <Send className="h-3 w-3 mr-2" />
                    إرسال الطلب
                    <Star className="h-3 w-3 ml-2 text-yellow-300" />
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SmartCardsContact;