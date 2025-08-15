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
  MessageSquare
} from 'lucide-react';

interface WhatsAppContactProps {
  className?: string;
  defaultMessage?: string;
  showAsButton?: boolean;
  buttonText?: string;
  pageTitle?: string;
}

export const WhatsAppContact: React.FC<WhatsAppContactProps> = ({
  className = "",
  defaultMessage = "",
  showAsButton = true,
  buttonText = "تواصل معنا عبر الواتساب",
  pageTitle = "صفحة الموقع"
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
    const message = `مرحباً! أتواصل معكم من ${pageTitle}

📝 *معلومات التواصل:*
• الاسم: ${formData.name || 'غير محدد'}
• البريد الإلكتروني: ${formData.email || 'غير محدد'}
• رقم الهاتف: ${formData.phone || 'غير محدد'}

💬 *الرسالة:*
${formData.message || 'لا توجد رسالة محددة'}

أرجو التواصل معي في أقرب وقت ممكن.`;

    const whatsappUrl = `https://wa.me/966555812567?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    setIsOpen(false);
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      message: defaultMessage
    });
  };

  const handleDirectWhatsApp = () => {
    const message = `مرحباً! أتواصل معكم من ${pageTitle}

أرجو التواصل معي لمزيد من المعلومات.`;

    const whatsappUrl = `https://wa.me/966555812567?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (showAsButton) {
    return (
      <>
        <Button
          onClick={() => setIsOpen(true)}
          className={`bg-green-500 hover:bg-green-600 text-white ${className}`}
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          {buttonText}
        </Button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setIsOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md"
              >
                <Card className="relative">
                  <Button
                    onClick={() => setIsOpen(false)}
                    variant="ghost"
                    size="sm"
                    className="absolute top-4 left-4 z-10"
                  >
                    <X className="h-4 w-4" />
                  </Button>

                  <CardHeader className="text-center pb-4">
                    <CardTitle className="flex items-center justify-center gap-2 text-green-600">
                      <MessageCircle className="h-6 w-6" />
                      تواصل معنا عبر الواتساب
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="name">الاسم</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="اسمك الكريم"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">رقم الجوال</Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="05xxxxxxxx"
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email">البريد الإلكتروني (اختياري)</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="example@email.com"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="message">رسالتك</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="اكتب رسالتك هنا..."
                        rows={4}
                        className="mt-1"
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button
                        onClick={handleWhatsAppSend}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                      >
                        <Send className="h-4 w-4 mr-2" />
                        إرسال عبر الواتساب
                      </Button>
                      <Button
                        onClick={handleDirectWhatsApp}
                        variant="outline"
                        className="flex-1"
                      >
                        <Phone className="h-4 w-4 mr-2" />
                        تواصل مباشر
                      </Button>
                    </div>

                    <p className="text-xs text-gray-500 text-center">
                      سيتم فتح تطبيق الواتساب مع رسالتك جاهزة للإرسال
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }

  // Floating WhatsApp button for always visible option
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className={`fixed bottom-6 right-6 z-40 ${className}`}
    >
      <Button
        onClick={() => setIsOpen(true)}
        className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
        size="sm"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute bottom-16 right-0 w-80"
          >
            <Card className="shadow-2xl">
              <CardHeader className="bg-green-500 text-white rounded-t-lg">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-sm">تواصل معنا</CardTitle>
                  <Button
                    onClick={() => setIsOpen(false)}
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-green-600"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="p-4 space-y-3">
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="اسمك الكريم"
                  className="text-sm"
                />
                <Input
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="رقم الجوال"
                  className="text-sm"
                />
                <Textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="رسالتك..."
                  rows={3}
                  className="text-sm"
                />
                <Button
                  onClick={handleWhatsAppSend}
                  className="w-full bg-green-500 hover:bg-green-600 text-white text-sm"
                >
                  <Send className="h-4 w-4 mr-2" />
                  إرسال
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default WhatsAppContact;