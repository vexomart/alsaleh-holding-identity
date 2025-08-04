import { Wifi, Globe, Users, Shield, Clock, Star, CheckCircle, Building } from "lucide-react";

const RemoteWorkSection = () => {
  const remoteStats = [
    {
      icon: Globe,
      number: "88%",
      label: "من الشركات العالمية",
      sublabel: "تعتمد العمل عن بُعد",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      icon: Users,
      number: "74%",
      label: "من الموظفين",
      sublabel: "يفضلون العمل المرن",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      icon: Star,
      number: "95%",
      label: "رضا العملاء",
      sublabel: "مع فرق العمل عن بُعد",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      icon: Shield,
      number: "99.9%",
      label: "موثوقية الخدمة",
      sublabel: "في بيئة العمل الرقمية",
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  const trustedCompanies = [
    { name: "Microsoft", logo: "🖥️" },
    { name: "Google", logo: "🔍" },
    { name: "Amazon", logo: "📦" },
    { name: "Apple", logo: "🍎" },
    { name: "Meta", logo: "📱" },
    { name: "Tesla", logo: "🚗" },
  ];

  const remoteAdvantages = [
    {
      icon: Clock,
      title: "مرونة في العمل",
      description: "نعمل في المناطق الزمنية المناسبة لعملائنا لضمان التواصل المستمر"
    },
    {
      icon: Globe,
      title: "وصول عالمي",
      description: "نوظف أفضل المواهب من جميع أنحاء العالم لخدمة مشاريعكم"
    },
    {
      icon: Shield,
      title: "أمان وموثوقية",
      description: "بروتوكولات أمان متقدمة وأنظمة حماية للبيانات على أعلى مستوى"
    },
    {
      icon: Users,
      title: "فرق متخصصة",
      description: "فرق عمل مدربة ومعتمدة في أحدث التقنيات والممارسات العالمية"
    },
  ];

  return (
    <div className="py-16 md:py-24 bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-50 dark:from-emerald-950 dark:via-cyan-950 dark:to-blue-950 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mb-6 shadow-lg">
            <Wifi className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            نعمل عن <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">بُعد بثقة</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            نحن رواد في العمل عن بُعد، نقدم خدماتنا بأعلى جودة من خلال فرق متخصصة تعمل بمرونة وكفاءة عالية
          </p>
        </div>

        {/* Remote Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {remoteStats.map((stat, index) => (
            <div
              key={index}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 hover:scale-105"
            >
              <div className={`inline-flex items-center justify-center w-14 h-14 ${stat.bgColor} dark:bg-gray-700 rounded-full mb-4`}>
                <stat.icon className={`w-7 h-7 ${stat.color} dark:text-gray-300`} />
              </div>
              <div className={`text-3xl font-bold mb-2 ${stat.color} dark:text-white`}>
                {stat.number}
              </div>
              <div className="text-gray-900 dark:text-white font-semibold text-sm mb-1">
                {stat.label}
              </div>
              <div className="text-gray-600 dark:text-gray-400 text-xs">
                {stat.sublabel}
              </div>
            </div>
          ))}
        </div>

        {/* Trusted Companies */}
        <div className="text-center mb-16">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
            الشركات العالمية التي تثق في العمل عن بُعد
          </h3>
          <div className="flex flex-wrap justify-center items-center gap-8">
            {trustedCompanies.map((company, index) => (
              <div
                key={index}
                className="flex items-center gap-3 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl px-6 py-3 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50"
              >
                <span className="text-2xl">{company.logo}</span>
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  {company.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Remote Work Advantages */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {remoteAdvantages.map((advantage, index) => (
            <div
              key={index}
              className="flex items-start gap-4 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 hover:scale-[1.02]"
            >
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                <advantage.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {advantage.title}
                </h4>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {advantage.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Building Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 md:p-12 text-center text-white shadow-2xl">
          <Building className="w-16 h-16 mx-auto mb-6 text-blue-100" />
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            ثقة مبنية على النجاح والشفافية
          </h3>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
            نؤمن بأن العمل عن بُعد ليس مجرد اتجاه، بل مستقبل الأعمال. نقدم لعملائنا تجربة موثوقة وشفافة مع إمكانية تتبع التقدم والتواصل المستمر
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center">
              <CheckCircle className="w-10 h-10 text-green-300 mb-3" />
              <h4 className="font-semibold mb-2">تواصل مستمر</h4>
              <p className="text-blue-100 text-sm">متاحون 24/7 لخدمة عملائنا</p>
            </div>
            <div className="flex flex-col items-center">
              <CheckCircle className="w-10 h-10 text-green-300 mb-3" />
              <h4 className="font-semibold mb-2">شفافية كاملة</h4>
              <p className="text-blue-100 text-sm">تقارير مفصلة ومتابعة دورية</p>
            </div>
            <div className="flex flex-col items-center">
              <CheckCircle className="w-10 h-10 text-green-300 mb-3" />
              <h4 className="font-semibold mb-2">جودة مضمونة</h4>
              <p className="text-blue-100 text-sm">معايير عالمية في التسليم</p>
            </div>
          </div>
        </div>
      </div>

      {/* Background Decorations */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200/20 rounded-full blur-2xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-48 h-48 bg-indigo-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/3 w-20 h-20 bg-purple-200/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
    </div>
  );
};

export default RemoteWorkSection;