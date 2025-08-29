import React from 'react';
import { Clock, MapPin } from 'lucide-react';
import { usePrayerTimes } from '@/hooks/usePrayerTimes';
import { cn } from '@/lib/utils';

interface PrayerTimesBarProps {
  className?: string;
}

export const PrayerTimesBar: React.FC<PrayerTimesBarProps> = ({ className }) => {
  const { prayerData, loading } = usePrayerTimes();

  if (loading) {
    return (
      <div className={cn(
        "w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-2 px-4 shadow-sm",
        className
      )}>
        <div className="flex items-center justify-center gap-2 animate-pulse">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">جاري تحميل أوقات الصلاة...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Prayer Times Bar */}
      <div className={cn(
        "w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-2 px-4 shadow-sm",
        className
      )}>
        <div className="flex items-center justify-between text-sm max-w-7xl mx-auto">
          {/* Current Time */}
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 animate-pulse" />
            <span className="font-medium">توقيت مكة المكرمة: {prayerData.currentTime}</span>
          </div>

          {/* Prayer Times */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-1">
              <span className="text-xs opacity-90">الفجر:</span>
              <span className="font-medium">{prayerData.times.Fajr}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs opacity-90">الظهر:</span>
              <span className="font-medium">{prayerData.times.Dhuhr}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs opacity-90">العصر:</span>
              <span className="font-medium">{prayerData.times.Asr}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs opacity-90">المغرب:</span>
              <span className="font-medium">{prayerData.times.Maghrib}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs opacity-90">العشاء:</span>
              <span className="font-medium">{prayerData.times.Isha}</span>
            </div>
          </div>

          {/* Next Prayer */}
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span className="text-xs opacity-90">الصلاة القادمة:</span>
            <span className="font-medium">{prayerData.nextPrayer.name}</span>
            <span className="text-xs opacity-90">خلال:</span>
            <span className="font-mono font-bold">{prayerData.nextPrayer.timeRemaining}</span>
          </div>
        </div>
      </div>

      {/* Prayer Alert */}
      {prayerData.isPrayerTime && (
        <div className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 px-4 shadow-lg animate-pulse">
          <div className="flex items-center justify-center gap-3 max-w-7xl mx-auto">
            <MapPin className="w-5 h-5 animate-bounce" />
            <span className="text-sm font-medium text-center">
              {prayerData.prayerMessage}
            </span>
            <MapPin className="w-5 h-5 animate-bounce" />
          </div>
        </div>
      )}
    </>
  );
};