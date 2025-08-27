import { Users, Server, Award, Lock, Shield, Clock, Zap } from "lucide-react";
import { useState, useEffect } from "react";

const HostingStats = () => {
  const [animatedNumbers, setAnimatedNumbers] = useState({
    customers: 0,
    uptime: 0,
    support: 0,
    security: 0
  });

  const finalNumbers = {
    customers: 5000,
    uptime: 99.9,
    support: 24,
    security: 100
  };

  useEffect(() => {
    const animateNumbers = () => {
      const duration = 2000; // 2 seconds
      const steps = 60;
      const interval = duration / steps;

      let currentStep = 0;
      const timer = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        
        setAnimatedNumbers({
          customers: Math.floor(finalNumbers.customers * progress),
          uptime: parseFloat((finalNumbers.uptime * progress).toFixed(1)),
          support: Math.floor(finalNumbers.support * progress),
          security: Math.floor(finalNumbers.security * progress)
        });

        if (currentStep >= steps) {
          clearInterval(timer);
          setAnimatedNumbers(finalNumbers);
        }
      }, interval);
    };

    // Start animation after component mounts
    const timeout = setTimeout(animateNumbers, 500);
    return () => clearTimeout(timeout);
  }, []);

  const stats = [
    {
      icon: Users,
      number: `${animatedNumbers.customers.toLocaleString()}+`,
      label: "عميل راض",
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50",
      description: "يثقون في خدماتنا",
      animation: "bounce"
    },
    {
      icon: Server,
      number: `${animatedNumbers.uptime}%`,
      label: "وقت تشغيل",
      gradient: "from-emerald-500 to-green-500",
      bgGradient: "from-emerald-50 to-green-50",
      description: "ضمان الاستمرارية",
      animation: "pulse"
    },
    {
      icon: Clock,
      number: `${animatedNumbers.support}/7`,
      label: "دعم فني",
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50",
      description: "متاح دائماً",
      animation: "spin"
    },
    {
      icon: Shield,
      number: `${animatedNumbers.security}%`,
      label: "حماية آمنة",
      gradient: "from-orange-500 to-red-500",
      bgGradient: "from-orange-50 to-red-50",
      description: "أمان متقدم",
      animation: "ping"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-2 rounded-full mb-6">
            <Award className="w-5 h-5 mr-2" />
            <span className="font-semibold">إحصائياتنا المميزة</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            أرقام تتحدث عن الجودة
          </h2>
          <p className="text-slate-600 text-xl max-w-2xl mx-auto">
            نفخر بثقة عملائنا وجودة خدماتنا المتميزة
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-3xl p-8 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-700 hover:scale-105 cursor-pointer overflow-hidden animate-fade-in"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Animated Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 group-hover:opacity-100 transition-all duration-700`}></div>
              
              {/* Floating Elements */}
              <div className="absolute inset-0 overflow-hidden">
                <div className={`absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-br ${stat.gradient} rounded-full opacity-0 group-hover:opacity-10 transform rotate-45 group-hover:rotate-90 group-hover:scale-150 transition-all duration-1000`}></div>
                <div className={`absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-tr ${stat.gradient} rounded-full opacity-0 group-hover:opacity-5 transform -rotate-45 group-hover:-rotate-90 group-hover:scale-125 transition-all duration-1000 delay-300`}></div>
              </div>

              <div className="relative z-10 text-center">
                {/* Enhanced Interactive Icon */}
                <div className="relative mb-6">
                  <div className={`w-20 h-20 rounded-3xl bg-gradient-to-r ${stat.gradient} flex items-center justify-center mx-auto group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-2xl group-hover:shadow-3xl`}>
                    <stat.icon className="w-10 h-10 text-white group-hover:scale-125 transition-all duration-500 drop-shadow-lg" />
                    
                    {/* Animated Effects */}
                    <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${stat.gradient} opacity-0 group-hover:opacity-30 animate-${stat.animation}`}></div>
                    <div className={`absolute -inset-1 rounded-3xl bg-gradient-to-r ${stat.gradient} opacity-0 group-hover:opacity-20 animate-ping`}></div>
                  </div>
                  
                  {/* Floating Particles */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className={`absolute w-1.5 h-1.5 bg-gradient-to-r ${stat.gradient} rounded-full animate-bounce`}
                        style={{
                          left: `${25 + (i * 15)}%`,
                          top: `${20 + (i % 2) * 60}%`,
                          animationDelay: `${i * 0.3}s`,
                          animationDuration: '2s'
                        }}
                      ></div>
                    ))}
                  </div>
                </div>

                {/* Number Display */}
                <div className={`text-4xl lg:text-5xl font-bold mb-2 bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300`}>
                  {stat.number}
                </div>
                
                {/* Label */}
                <div className="text-slate-800 font-bold text-lg mb-2 group-hover:text-slate-900 transition-colors">
                  {stat.label}
                </div>
                
                {/* Description */}
                <div className="text-slate-600 text-sm opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                  {stat.description}
                </div>

                {/* Bottom Indicator */}
                <div className="mt-6 flex justify-center">
                  <div className={`h-1 rounded-full bg-gradient-to-r ${stat.gradient} transition-all duration-700 opacity-0 group-hover:opacity-100 transform scale-x-0 group-hover:scale-x-100 w-16`}></div>
                </div>
              </div>

              {/* Corner Badge */}
              <div className={`absolute top-4 right-4 w-2 h-2 bg-gradient-to-r ${stat.gradient} rounded-full opacity-60 group-hover:opacity-100 group-hover:scale-150 transition-all duration-300 animate-pulse`}></div>
            </div>
          ))}
        </div>

        {/* Bottom Enhancement */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-8 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-slate-700 font-medium">جميع الخوادم تعمل بكفاءة عالية</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-slate-700 font-medium">فريق الدعم متاح الآن</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
              <span className="text-slate-700 font-medium">نظام الحماية نشط</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HostingStats;