import { useState, useEffect } from "react";
import { Clock, Calendar, Coffee } from "lucide-react";
import { cn } from "@/lib/utils";

const WorkingHoursNotification = () => {
  const [currentStatus, setCurrentStatus] = useState<'working' | 'closed' | 'weekend'>('working');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const updateStatus = () => {
      const now = new Date();
      setCurrentTime(now);
      
      const currentHour = now.getHours();
      const currentDay = now.getDay(); // 0 = Sunday, 6 = Saturday
      
      // Weekend check (Friday and Saturday in Saudi Arabia)
      if (currentDay === 5 || currentDay === 6) {
        setCurrentStatus('weekend');
        return;
      }
      
      // Working hours: 8 AM to 6 PM (Sunday to Thursday)
      if (currentHour >= 8 && currentHour < 18) {
        setCurrentStatus('working');
      } else {
        setCurrentStatus('closed');
      }
    };

    updateStatus();
    const interval = setInterval(updateStatus, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const getStatusInfo = () => {
    switch (currentStatus) {
      case 'working':
        return {
          text: "مفتوح الآن - ساعات العمل: 8:00 ص - 6:00 م",
          icon: Clock,
          bgColor: "bg-gradient-to-r from-green-500 to-emerald-600",
          textColor: "text-white",
          animation: "animate-pulse"
        };
      case 'closed':
        return {
          text: "مغلق الآن - ساعات العمل: 8:00 ص - 6:00 م (الأحد - الخميس)",
          icon: Coffee,
          bgColor: "bg-gradient-to-r from-orange-500 to-red-500",
          textColor: "text-white",
          animation: "animate-bounce"
        };
      case 'weekend':
        return {
          text: "إجازة نهاية الأسبوع - سنعود يوم الأحد الساعة 8:00 ص",
          icon: Calendar,
          bgColor: "bg-gradient-to-r from-blue-500 to-purple-600",
          textColor: "text-white",
          animation: "animate-pulse"
        };
    }
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

  return (
    <div 
      className={cn(
        "w-full py-2 px-4 text-center relative overflow-hidden",
        statusInfo.bgColor,
        statusInfo.animation
      )}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent transform -skew-x-12 animate-slide-in-right"></div>
      </div>
      
      <div className="relative z-10 flex items-center justify-center gap-2">
        <StatusIcon className={cn("w-4 h-4", statusInfo.textColor)} />
        <span className={cn("text-sm font-medium", statusInfo.textColor)}>
          {statusInfo.text}
        </span>
        <span className={cn("text-xs opacity-80", statusInfo.textColor)}>
          {currentTime.toLocaleTimeString('ar-SA', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
          })}
        </span>
      </div>
      
      {/* Moving line animation */}
      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-white/30">
        <div className="h-full bg-white/60 animate-slide-in-right"></div>
      </div>
    </div>
  );
};

export default WorkingHoursNotification;