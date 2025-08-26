import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';

// مكون ChatBot مبسط تماماً بدون أي hooks
const SafeChatBot = () => {
  const handleClick = () => {
    try {
      window.open('https://wa.me/966555812567', '_blank');
    } catch (error) {
      console.warn('ChatBot error:', error);
      // fallback
      window.location.href = 'https://wa.me/966555812567';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button 
        className="w-14 h-14 rounded-full bg-primary hover:bg-primary/90 shadow-lg transition-all duration-300 hover:scale-110"
        onClick={handleClick}
      >
        <MessageCircle className="w-6 h-6" />
      </Button>
    </div>
  );
};

export default SafeChatBot;