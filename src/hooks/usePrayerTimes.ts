import { useState, useEffect } from 'react';

interface PrayerTimes {
  Fajr: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

interface PrayerData {
  times: PrayerTimes;
  nextPrayer: {
    name: string;
    time: string;
    timeRemaining: string;
  };
  currentTime: string;
  isPrayerTime: boolean;
  prayerMessage: string;
}

export const usePrayerTimes = () => {
  const [prayerData, setPrayerData] = useState<PrayerData>({
    times: {
      Fajr: '',
      Dhuhr: '',
      Asr: '',
      Maghrib: '',
      Isha: ''
    },
    nextPrayer: {
      name: '',
      time: '',
      timeRemaining: ''
    },
    currentTime: '',
    isPrayerTime: false,
    prayerMessage: ''
  });

  const [loading, setLoading] = useState(true);

  const fetchPrayerTimes = async () => {
    try {
      // Mecca coordinates
      const response = await fetch(
        'https://api.aladhan.com/v1/timings?latitude=21.3891&longitude=39.8579&method=4&tune=0,0,0,0,0,0,0,0,0'
      );
      const data = await response.json();
      
      if (data.code === 200) {
        const times = data.data.timings;
        updatePrayerData(times);
      }
    } catch (error) {
      console.error('Error fetching prayer times:', error);
    } finally {
      setLoading(false);
    }
  };

  const updatePrayerData = (times: any) => {
    const now = new Date();
    const currentTimeString = now.toLocaleTimeString('ar-SA', {
      timeZone: 'Asia/Riyadh',
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    const prayerNames = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    const prayerTimesArray = prayerNames.map(name => ({
      name,
      time: times[name],
      date: new Date(`${now.toDateString()} ${times[name]}`)
    }));

    // Check if it's currently prayer time (within 15 minutes of prayer)
    let isPrayerTime = false;
    let currentPrayerName = '';

    for (const prayer of prayerTimesArray) {
      const timeDiff = Math.abs(now.getTime() - prayer.date.getTime());
      if (timeDiff <= 15 * 60 * 1000) { // 15 minutes
        isPrayerTime = true;
        currentPrayerName = prayer.name;
        break;
      }
    }

    // Find next prayer
    let nextPrayer = prayerTimesArray.find(prayer => prayer.date > now);
    if (!nextPrayer) {
      // If no prayer today, get Fajr of next day
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      nextPrayer = {
        name: 'Fajr',
        time: times.Fajr,
        date: new Date(`${tomorrow.toDateString()} ${times.Fajr}`)
      };
    }

    const timeRemaining = calculateTimeRemaining(nextPrayer.date);

    setPrayerData({
      times: {
        Fajr: times.Fajr,
        Dhuhr: times.Dhuhr,
        Asr: times.Asr,
        Maghrib: times.Maghrib,
        Isha: times.Isha
      },
      nextPrayer: {
        name: getPrayerNameInArabic(nextPrayer.name),
        time: nextPrayer.time,
        timeRemaining
      },
      currentTime: currentTimeString,
      isPrayerTime,
      prayerMessage: isPrayerTime 
        ? `حان وقت صلاة ${getPrayerNameInArabic(currentPrayerName)} - جميع الموظفين وخدمة العملاء حالياً لن يتمكنوا من الرد لأداء الصلاة، سنعود قريباً إن شاء الله` 
        : ''
    });
  };

  const calculateTimeRemaining = (targetDate: Date): string => {
    const now = new Date();
    const diff = targetDate.getTime() - now.getTime();
    
    if (diff <= 0) return '00:00:00';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getPrayerNameInArabic = (name: string): string => {
    const names: { [key: string]: string } = {
      'Fajr': 'الفجر',
      'Dhuhr': 'الظهر',
      'Asr': 'العصر',
      'Maghrib': 'المغرب',
      'Isha': 'العشاء'
    };
    return names[name] || name;
  };

  useEffect(() => {
    fetchPrayerTimes();
    
    // Update every second for real-time display
    const interval = setInterval(() => {
      if (prayerData.times.Fajr) {
        updatePrayerData({
          Fajr: prayerData.times.Fajr,
          Dhuhr: prayerData.times.Dhuhr,
          Asr: prayerData.times.Asr,
          Maghrib: prayerData.times.Maghrib,
          Isha: prayerData.times.Isha
        });
      }
    }, 1000);

    // Refresh prayer times daily
    const dailyInterval = setInterval(() => {
      fetchPrayerTimes();
    }, 24 * 60 * 60 * 1000);

    return () => {
      clearInterval(interval);
      clearInterval(dailyInterval);
    };
  }, []);

  return { prayerData, loading };
};