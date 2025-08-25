import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MessageCircle, Send, X, Bot } from 'lucide-react';

// مكون ChatBot مبسط بدون hooks لتجنب مشاكل dispatcher
const SimpleChatBot = () => {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button 
        className="w-14 h-14 rounded-full bg-primary hover:bg-primary/90 shadow-lg"
        onClick={() => {
          // فتح WhatsApp مباشرة بدلاً من نافذة chat معقدة
          window.open('https://wa.me/966555812567', '_blank');
        }}
      >
        <MessageCircle className="w-6 h-6" />
      </Button>
    </div>
  );
};

export default SimpleChatBot;