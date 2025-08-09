import { useState, useEffect } from "react";
import { Clock, Calendar, Coffee, Sun, Moon, Timer } from "lucide-react";
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
          subText: `سنفتح خلال ${timeUntilChange}`,
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
        "w-full py-2 px-4 text-center relative overflow-hidden",
        statusInfo.bgColor,
        statusInfo.animation
      )}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent transform -skew-x-12 animate-slide-in-right"></div>
      </div>
      
      <div className="relative z-10 flex flex-col items-center justify-center gap-1">
        {/* Status Badge */}
        <div className={cn("px-3 py-1 rounded-full text-xs font-bold", statusInfo.badgeColor)}>
          {statusInfo.badge}
        </div>
        
        {/* Main Content */}
        <div className="flex items-center justify-center gap-3">
          <StatusIcon className={cn("w-5 h-5", statusInfo.textColor)} />
          <div className="flex flex-col items-center gap-1">
            <span className={cn("text-sm font-medium", statusInfo.textColor)}>
              {statusInfo.text}
            </span>
            <div className="flex items-center gap-3">
              <span className={cn("text-xs font-semibold", statusInfo.textColor)}>
                {statusInfo.subText}
              </span>
              <Timer className={cn("w-3 h-3", statusInfo.textColor)} />
              <span className={cn("text-xs font-mono", statusInfo.textColor)}>
                {currentTime.toLocaleTimeString('ar-SA', { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  hour12: true 
                })}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Moving line animation */}
      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-white/30">
        <div className="h-full bg-white/60 animate-slide-in-right"></div>
      </div>
    </div>
  );
};

export default WorkingHoursNotification;