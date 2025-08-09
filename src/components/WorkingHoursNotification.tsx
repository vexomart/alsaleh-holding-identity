import { useState, useEffect } from "react";
import { Clock, Calendar, Coffee, Sun, Moon, Timer, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

const WorkingHoursNotification = () => {
  const [currentStatus, setCurrentStatus] = useState<'working' | 'closed' | 'weekend'>('working');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timeUntilChange, setTimeUntilChange] = useState<string>("");

  useEffect(() => {
    const updateStatus = () => {
      const now = new Date();
      setCurrentTime(now);
      
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const currentDay = now.getDay(); // 0 = Sunday, 6 = Saturday
      
      // Weekend check (Friday and Saturday in Saudi Arabia)
      if (currentDay === 5 || currentDay === 6) {
        setCurrentStatus('weekend');
        // Calculate time until Sunday 8 AM
        const daysUntilSunday = currentDay === 5 ? 2 : 1;
        const nextWorkDay = new Date(now);
        nextWorkDay.setDate(now.getDate() + daysUntilSunday);
        nextWorkDay.setHours(8, 0, 0, 0);
        const hoursLeft = Math.floor((nextWorkDay.getTime() - now.getTime()) / (1000 * 60 * 60));
        setTimeUntilChange(`${hoursLeft} ساعة`);
        return;
      }
      
      // Working hours: 8 AM to 6 PM (Sunday to Thursday)
      if (currentHour >= 8 && currentHour < 18) {
        setCurrentStatus('working');
        // Calculate time until closing (6 PM)
        const minutesLeft = (17 - currentHour) * 60 + (60 - currentMinute);
        const hoursLeft = Math.floor(minutesLeft / 60);
        const minsLeft = minutesLeft % 60;
        setTimeUntilChange(`${hoursLeft}:${minsLeft.toString().padStart(2, '0')}`);
      } else {
        setCurrentStatus('closed');
        // Calculate time until opening (8 AM next day or Monday if weekend)
        let nextOpenTime = new Date(now);
        if (currentHour >= 18 && currentDay < 5) {
          // After hours today, open tomorrow
          nextOpenTime.setDate(now.getDate() + 1);
          nextOpenTime.setHours(8, 0, 0, 0);
        } else if (currentDay === 0) {
          // Sunday before 8 AM
          nextOpenTime.setHours(8, 0, 0, 0);
        } else {
          // Saturday night or Sunday after hours
          const daysUntilMonday = currentDay === 0 ? 1 : (8 - currentDay);
          nextOpenTime.setDate(now.getDate() + daysUntilMonday);
          nextOpenTime.setHours(8, 0, 0, 0);
        }
        const hoursLeft = Math.floor((nextOpenTime.getTime() - now.getTime()) / (1000 * 60 * 60));
        setTimeUntilChange(`${hoursLeft} ساعة`);
      }
    };

    updateStatus();
    const interval = setInterval(updateStatus, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const getStatusInfo = () => {
    const currentHour = currentTime.getHours();
    switch (currentStatus) {
      case 'working':
        return {
          text: "مفتوح الآن - ساعات العمل: 8:00 ص - 6:00 م",
          subText: `متبقي ${timeUntilChange} حتى الإغلاق`,
          icon: currentHour < 12 ? Sun : Clock,
          bgColor: "bg-gradient-to-r from-emerald-500 via-green-500 to-teal-600",
          textColor: "text-white",
          animation: "animate-pulse",
          badge: "مفتوح",
          badgeColor: "bg-white/20 text-white"
        };
      case 'closed':
        return {
          text: "مغلق الآن - ساعات العمل: 8:00 ص - 6:00 م (الأحد - الخميس)",
          subText: `عودة العمل خلال ${timeUntilChange}`,
          icon: Moon,
          bgColor: "bg-gradient-to-r from-red-600 via-rose-500 to-pink-600",
          textColor: "text-white",
          animation: "animate-bounce",
          badge: "مغلق",
          badgeColor: "bg-white/20 text-white"
        };
      case 'weekend':
        return {
          text: "إجازة نهاية الأسبوع - سنعود يوم الأحد الساعة 8:00 ص",
          subText: `عودة العمل خلال ${timeUntilChange}`,
          icon: Calendar,
          bgColor: "bg-gradient-to-r from-purple-600 via-violet-500 to-indigo-600",
          textColor: "text-white",
          animation: "animate-pulse",
          badge: "إجازة",
          badgeColor: "bg-white/20 text-white"
        };
    }
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

  return (
    <div 
      className={cn(
        "w-full max-w-md mx-auto lg:mx-0 lg:max-w-none lg:w-auto",
        "flex flex-col lg:flex-row items-start lg:items-center gap-2 lg:gap-3",
        "p-3 lg:p-4 rounded-xl lg:rounded-lg border backdrop-blur-sm shadow-sm mobile-tap",
        statusInfo.bgColor,
        "border-white/20"
      )}
    >
      {/* Header Row - Status & Badge */}
      <div className="flex items-center justify-between w-full lg:w-auto lg:flex-shrink-0">
        <div className="flex items-center gap-2">
          <StatusIcon className={cn("w-4 h-4 lg:w-3 lg:h-3", statusInfo.textColor)} />
          <span className={cn("font-bold text-sm lg:text-xs", statusInfo.textColor)}>
            {statusInfo.badge}
          </span>
        </div>
        
        {/* Current Time - Mobile */}
        <div className="flex items-center gap-1 lg:hidden">
          <Timer className={cn("w-3 h-3", statusInfo.textColor)} />
          <span className={cn("font-mono text-xs", statusInfo.textColor)}>
            {currentTime.toLocaleTimeString('ar-SA', { 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: true 
            })}
          </span>
        </div>
      </div>
      
      {/* Main Status Text */}
      <div className="w-full lg:flex-1">
        <p className={cn("text-xs lg:text-xs leading-relaxed", statusInfo.textColor)}>
          <span className="lg:hidden">{statusInfo.subText}</span>
          <span className="hidden lg:inline">{statusInfo.text}</span>
        </p>
        
        {/* Countdown - Mobile Only */}
        <div className="lg:hidden mt-1">
          <p className={cn("text-xs font-medium", statusInfo.textColor)}>
            {statusInfo.subText}
          </p>
        </div>
      </div>
      
      {/* Desktop Time */}
      <div className="hidden lg:flex items-center gap-1 flex-shrink-0">
        <Timer className={cn("w-3 h-3", statusInfo.textColor)} />
        <span className={cn("font-mono text-xs whitespace-nowrap", statusInfo.textColor)}>
          {currentTime.toLocaleTimeString('ar-SA', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
          })}
        </span>
      </div>
    </div>
  );
};

export default WorkingHoursNotification;