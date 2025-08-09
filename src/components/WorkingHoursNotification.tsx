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
        
        const totalMinutes = Math.floor((nextWorkDay.getTime() - now.getTime()) / (1000 * 60));
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        
        if (hours > 24) {
          const days = Math.floor(hours / 24);
          const remainingHours = hours % 24;
          setTimeUntilChange(`${days} يوم و ${remainingHours} ساعة`);
        } else {
          setTimeUntilChange(`${hours} ساعة و ${minutes} دقيقة`);
        }
        return;
      }
      
      // Working hours: 8 AM to 6 PM (Sunday to Thursday)
      if (currentHour >= 8 && currentHour < 18) {
        setCurrentStatus('working');
        // Calculate time until closing (6 PM)
        const minutesLeft = (17 - currentHour) * 60 + (60 - currentMinute);
        const hoursLeft = Math.floor(minutesLeft / 60);
        const minsLeft = minutesLeft % 60;
        setTimeUntilChange(`${hoursLeft} ساعة و ${minsLeft} دقيقة`);
      } else {
        setCurrentStatus('closed');
        // Calculate time until opening
        let nextOpenTime = new Date(now);
        if (currentHour >= 18 && currentDay < 5) {
          // After hours today, open tomorrow
          nextOpenTime.setDate(now.getDate() + 1);
          nextOpenTime.setHours(8, 0, 0, 0);
        } else if (currentHour < 8 && currentDay >= 1 && currentDay <= 4) {
          // Before hours today (Sunday-Thursday)
          nextOpenTime.setHours(8, 0, 0, 0);
        } else {
          // Weekend or Sunday after hours
          const daysUntilMonday = currentDay === 0 ? 1 : (8 - currentDay);
          nextOpenTime.setDate(now.getDate() + daysUntilMonday);
          nextOpenTime.setHours(8, 0, 0, 0);
        }
        
        const totalMinutes = Math.floor((nextOpenTime.getTime() - now.getTime()) / (1000 * 60));
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        
        if (hours > 24) {
          const days = Math.floor(hours / 24);
          const remainingHours = hours % 24;
          setTimeUntilChange(`${days} يوم و ${remainingHours} ساعة`);
        } else {
          setTimeUntilChange(`${hours} ساعة و ${minutes} دقيقة`);
        }
      }
    };

    updateStatus();
    const interval = setInterval(updateStatus, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const getStatusInfo = () => {
    const currentHour = currentTime.getHours();
    const currentDay = currentTime.getDay();
    
    // Dynamic colors based on day and status
    const getDayColor = () => {
      if (currentStatus === 'working') {
        // Different green shades for working days
        const workingColors = [
          'bg-gradient-to-r from-emerald-500 via-green-500 to-teal-600', // Sunday
          'bg-gradient-to-r from-green-500 via-emerald-500 to-lime-600', // Monday  
          'bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500',     // Tuesday
          'bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500', // Wednesday
          'bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500'  // Thursday
        ];
        return workingColors[currentDay] || workingColors[0];
      } else if (currentStatus === 'closed') {
        // Different warm colors for closed hours
        const closedColors = [
          'bg-gradient-to-r from-orange-500 via-red-500 to-pink-600',    // Sunday
          'bg-gradient-to-r from-red-500 via-rose-500 to-pink-600',     // Monday
          'bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-600', // Tuesday
          'bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600', // Wednesday
          'bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600'     // Thursday
        ];
        return closedColors[currentDay] || closedColors[0];
      } else {
        // Weekend colors
        return currentDay === 5 ? 
          'bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-700' : // Friday
          'bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-700';  // Saturday
      }
    };

    switch (currentStatus) {
      case 'working':
        return {
          status: "مفتوح الآن",
          mainText: "ساعات العمل: 8:00 ص - 6:00 م",
          countdown: `متبقي ${timeUntilChange} حتى الإغلاق`,
          icon: currentHour < 12 ? Sun : Clock,
          bgColor: getDayColor(),
          textColor: "text-white",
          animation: "animate-pulse",
          badge: "🟢 مفتوح",
          alertType: "success"
        };
      case 'closed':
        return {
          status: "مغلق الآن", 
          mainText: "ساعات العمل: 8:00 ص - 6:00 م (الأحد - الخميس)",
          countdown: `سنفتح خلال ${timeUntilChange}`,
          icon: Moon,
          bgColor: getDayColor(),
          textColor: "text-white",
          animation: "animate-bounce",
          badge: "🔴 مغلق",
          alertType: "warning"
        };
      case 'weekend':
        const dayName = currentDay === 5 ? 'الجمعة' : 'السبت';
        return {
          status: `إجازة ${dayName}`,
          mainText: "سنعود يوم الأحد الساعة 8:00 ص",
          countdown: `عودة العمل خلال ${timeUntilChange}`,
          icon: Calendar,
          bgColor: getDayColor(),
          textColor: "text-white", 
          animation: "animate-pulse",
          badge: "🟡 إجازة",
          alertType: "info"
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
          <span className="lg:hidden">{statusInfo.status}</span>
          <span className="hidden lg:inline">{statusInfo.mainText}</span>
        </p>
        
        {/* Countdown - Mobile Only */}
        <div className="lg:hidden mt-1">
          <p className={cn("text-xs font-medium", statusInfo.textColor)}>
            {statusInfo.countdown}
          </p>
        </div>
        
        {/* Desktop Countdown */}
        <div className="hidden lg:block mt-1">
          <p className={cn("text-xs font-medium", statusInfo.textColor)}>
            {statusInfo.countdown}
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