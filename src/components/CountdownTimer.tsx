import { useState, useEffect } from "react";
import { Clock, Timer } from "lucide-react";

interface CountdownTimerProps {
  targetDate: Date;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const CountdownTimer = ({ targetDate, className = "", size = "md" }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance < 0) {
        setIsExpired(true);
        clearInterval(timer);
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const sizeClasses = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-3 py-2", 
    lg: "text-base px-4 py-3"
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5"
  };

  if (isExpired) {
    return (
      <div className={`flex items-center gap-2 bg-gray-500/90 text-white rounded-full ${sizeClasses[size]} font-medium shadow-lg ${className}`}>
        <Timer className={iconSizes[size]} />
        <span>انتهت المدة</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-full ${sizeClasses[size]} font-medium shadow-lg animate-pulse ${className}`}>
      <Clock className={iconSizes[size]} />
      <span>
        {timeLeft.days > 0 && `${timeLeft.days}ي `}
        {timeLeft.hours.toString().padStart(2, '0')}:
        {timeLeft.minutes.toString().padStart(2, '0')}:
        {timeLeft.seconds.toString().padStart(2, '0')}
      </span>
    </div>
  );
};