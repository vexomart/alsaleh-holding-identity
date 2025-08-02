import { useState, useEffect } from "react";
import { Building, Users, Briefcase, Globe } from "lucide-react";

const StatsSection = () => {
  const [counters, setCounters] = useState({
    projects: 0,
    clients: 0,
    countries: 0,
    years: 0
  });

  const stats = [
    {
      icon: Briefcase,
      number: 5868,
      label: "مشروع منجز",
      description: "مشاريع متنوعة ومبتكرة",
      color: "from-blue-600 to-purple-600"
    },
    {
      icon: Users,
      number: 2941,
      label: "عميل راضي",
      description: "ثقة عملائنا هي أولويتنا",
      color: "from-green-600 to-teal-600"
    },
    {
      icon: Globe,
      number: 45,
      label: "دولة حول العالم",
      description: "انتشار عالمي واسع",
      color: "from-orange-600 to-red-600"
    },
    {
      icon: Building,
      number: 15,
      label: "سنة من الخبرة",
      description: "تجربة راسخة في السوق",
      color: "from-indigo-600 to-blue-600"
    }
  ];

  useEffect(() => {
    const animateCounters = () => {
      const duration = 2000; // 2 seconds
      const steps = 60;
      const stepDuration = duration / steps;

      let currentStep = 0;
      const interval = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        
        setCounters({
          projects: Math.floor(5868 * progress),
          clients: Math.floor(2941 * progress),
          countries: Math.floor(45 * progress),
          years: Math.floor(15 * progress)
        });

        if (currentStep >= steps) {
          clearInterval(interval);
          setCounters({
            projects: 5868,
            clients: 2941,
            countries: 45,
            years: 15
          });
        }
      }, stepDuration);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          animateCounters();
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    const element = document.getElementById('stats-section');
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, []);

  const getCounterValue = (index: number) => {
    switch (index) {
      case 0: return counters.projects;
      case 1: return counters.clients;
      case 2: return counters.countries;
      case 3: return counters.years;
      default: return 0;
    }
  };

  return (
    <section id="stats-section" className="py-20 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            إنجازاتنا بالأرقام
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            نفخر بما حققناه من إنجازات وثقة عملائنا حول العالم
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="group relative bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-500`} />
                
                {/* Icon with gradient background */}
                <div className={`relative w-16 h-16 mx-auto mb-6 rounded-xl bg-gradient-to-br ${stat.color} p-3 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-full h-full text-white" />
                </div>

                {/* Animated Number */}
                <div className="text-center">
                  <div className={`text-4xl md:text-5xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300`}>
                    {getCounterValue(index).toLocaleString('ar-SA')}
                    {index === 0 && "+"}
                    {index === 1 && "+"}
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2">
                    {stat.label}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {stat.description}
                  </p>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-4 left-4 w-6 h-6 bg-gradient-to-br from-green-100 to-teal-100 dark:from-green-900/20 dark:to-teal-900/20 rounded-full opacity-30 group-hover:opacity-70 transition-opacity duration-300" />
              </div>
            );
          })}
        </div>

        {/* Bottom Decorative Section */}
        <div className="mt-16 text-center animate-fade-in" style={{ animationDelay: "0.5s" }}>
          <div className="inline-flex items-center gap-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full px-6 py-3 border border-slate-200 dark:border-slate-700 shadow-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
              نواصل النمو والتطور يومياً
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;