import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import BackButton from "@/components/ui/back-button";
import CarRentalFooter from "@/components/CarRentalFooter";
import { 
  Shield,
  CheckCircle,
  AlertTriangle,
  FileText,
  Download,
  Phone,
  Mail,
  Car,
  DollarSign,
  Clock,
  Users,
  MapPin,
  Star,
  Award,
  Zap,
  Heart,
  Target,
  Umbrella,
  ShieldCheck,
  TrendingUp,
  Lightbulb,
  CreditCard,
  Settings,
  ChevronRight,
  Info,
  Headphones
} from "lucide-react";

const InsurancePolicy = () => {
  const [activeTab, setActiveTab] = useState('coverage');
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const insuranceTypes = [
    {
      id: 'basic',
      name: 'التأمين الأساسي',
      price: 'مشمول مجاناً',
      description: 'التغطية الأساسية لجميع السيارات',
      icon: Shield,
      color: 'from-blue-500 to-cyan-500',
      features: [
        'تأمين ضد الحوادث المرورية',
        'تأمين ضد الأضرار الجسيمة',
        'المسؤولية المدنية تجاه الغير',
        'خدمة المساعدة على الطريق',
        'سحب السيارة في حالة العطل'
      ],
      coverage: 'حتى 100,000 ريال',
      deductible: '1,000 ريال'
    },
    {
      id: 'comprehensive',
      name: 'التأمين الشامل',
      price: '50 ريال/يوم',
      description: 'حماية شاملة مع تغطية موسعة',
      icon: ShieldCheck,
      color: 'from-green-500 to-emerald-500',
      features: [
        'جميع مزايا التأمين الأساسي',
        'تأمين ضد السرقة والحريق',
        'تأمين ضد الكوارث الطبيعية',
        'تأمين الممتلكات الشخصية',
        'سيارة بديلة فورية',
        'تغطية الأضرار الطفيفة',
        'خدمة الإصلاح السريع'
      ],
      coverage: 'حتى 500,000 ريال',
      deductible: '500 ريال'
    },
    {
      id: 'premium',
      name: 'التأمين المميز',
      price: '100 ريال/يوم',
      description: 'أعلى مستوى من الحماية والخدمات',
      icon: Award,
      color: 'from-purple-500 to-indigo-500',
      features: [
        'جميع مزايا التأمين الشامل',
        'تأمين ضد جميع المخاطر',
        'تغطية السائق والركاب',
        'خدمة VIP على الطريق',
        'سيارة فاخرة بديلة',
        'تأمين الرحلات الدولية',
        'دعم عملاء متخصص 24/7',
        'تغطية الحوادث الشخصية'
      ],
      coverage: 'تغطية كاملة بدون حدود',
      deductible: 'بدون تحمل'
    }
  ];

  const claimSteps = [
    {
      step: 1,
      title: 'الإبلاغ الفوري',
      description: 'اتصل بنا فور وقوع الحادث على الرقم الساخن',
      icon: Phone,
      timeframe: 'فوري'
    },
    {
      step: 2,
      title: 'توثيق الحادث',
      description: 'التقط صور للسيارة والحادث من جميع الزوايا',
      icon: FileText,
      timeframe: 'في مكان الحادث'
    },
    {
      step: 3,
      title: 'تقرير الشرطة',
      description: 'احصل على تقرير رسمي من شرطة المرور',
      icon: Shield,
      timeframe: 'خلال ساعة'
    },
    {
      step: 4,
      title: 'تقييم الأضرار',
      description: 'مقيم معتمد سيتواصل معك لفحص السيارة',
      icon: Settings,
      timeframe: '24-48 ساعة'
    },
    {
      step: 5,
      title: 'معالجة المطالبة',
      description: 'سيتم معالجة مطالبتك وإشعارك بالنتيجة',
      icon: CheckCircle,
      timeframe: '3-5 أيام'
    }
  ];

  const exclusions = [
    {
      title: 'القيادة تحت تأثير المواد المخدرة أو الكحول',
      description: 'أي حادث ناتج عن القيادة في حالة عدم الأهلية',
      severity: 'high'
    },
    {
      title: 'الاستخدام في الأنشطة غير القانونية',
      description: 'استخدام السيارة في أنشطة مخالفة للقانون',
      severity: 'high'
    },
    {
      title: 'الأضرار المتعمدة',
      description: 'أي ضرر متعمد للسيارة من قبل المستأجر',
      severity: 'high'
    },
    {
      title: 'القيادة خارج المناطق المصرح بها',
      description: 'استخدام السيارة في مناطق محظورة أو خطيرة',
      severity: 'medium'
    },
    {
      title: 'عدم اتباع تعليمات الصيانة',
      description: 'الأضرار الناتجة عن إهمال الصيانة الدورية',
      severity: 'medium'
    },
    {
      title: 'الكوارث الطبيعية الاستثنائية',
      description: 'أحداث طبيعية نادرة غير مشمولة في التأمين الأساسي',
      severity: 'low'
    }
  ];

  const tabs = [
    { id: 'coverage', label: 'أنواع التغطية', icon: Umbrella },
    { id: 'claims', label: 'إجراءات المطالبات', icon: FileText },
    { id: 'exclusions', label: 'الاستثناءات', icon: AlertTriangle },
    { id: 'terms', label: 'الشروط والأحكام', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="absolute inset-0 bg-grid-pattern opacity-20 dark:opacity-10"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-white/20 dark:border-slate-700/50">
          <div className="container mx-auto px-6 py-8">
            <div className="flex items-center gap-4 mb-6">
              <BackButton fallbackPath="/car-rental-landing" />
              <div className="flex-1">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                  سياسة التأمين
                </h1>
                <p className="text-lg text-muted-foreground">
                  حماية شاملة لراحة بالك وأمان رحلتك
                </p>
              </div>
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                تحميل الوثيقة
              </Button>
            </div>

            {/* Hero Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[
                { label: 'تغطية تأمينية', value: '500K+ ريال', icon: Shield, color: 'text-blue-500' },
                { label: 'مطالبات معالجة', value: '99.9%', icon: CheckCircle, color: 'text-green-500' },
                { label: 'زمن الاستجابة', value: '< 24 ساعة', icon: Clock, color: 'text-orange-500' },
                { label: 'رضا العملاء', value: '4.9/5', icon: Star, color: 'text-yellow-500' }
              ].map((stat, index) => (
                <Card key={index} className="text-center bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-white/20 dark:border-slate-700/50 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <stat.icon className={`w-8 h-8 mx-auto mb-3 ${stat.color}`} />
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-8">
          {/* Navigation Tabs */}
          <div className="flex flex-wrap gap-2 mb-8 p-2 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl border border-white/20 dark:border-slate-700/50">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-blue-500 text-white shadow-lg scale-105'
                    : 'text-muted-foreground hover:bg-gray-100 dark:hover:bg-slate-700'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="animate-fade-in">
            {activeTab === 'coverage' && (
              <div className="space-y-8">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold mb-4">اختر مستوى التغطية المناسب</h2>
                  <p className="text-lg text-muted-foreground">
                    نوفر ثلاثة مستويات من التأمين لتناسب احتياجاتك وميزانيتك
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {insuranceTypes.map((insurance, index) => (
                    <Card key={insurance.id} className={`relative group hover:shadow-2xl transition-all duration-500 transform hover:scale-105 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-white/20 dark:border-slate-700/50 ${index === 1 ? 'ring-2 ring-blue-500 scale-105' : ''}`}>
                      {index === 1 && (
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                          <Badge className="bg-blue-500 text-white px-4 py-1">الأكثر شعبية</Badge>
                        </div>
                      )}
                      
                      <CardHeader className="text-center pb-4">
                        <div className={`w-20 h-20 rounded-full bg-gradient-to-r ${insurance.color} mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                          <insurance.icon className="w-10 h-10 text-white" />
                        </div>
                        <CardTitle className="text-2xl mb-2">{insurance.name}</CardTitle>
                        <div className="text-3xl font-bold text-blue-600 mb-2">{insurance.price}</div>
                        <p className="text-muted-foreground">{insurance.description}</p>
                      </CardHeader>

                      <CardContent className="space-y-6">
                        <div className="space-y-3">
                          {insurance.features.map((feature, featureIndex) => (
                            <div key={featureIndex} className="flex items-center gap-3">
                              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                              <span className="text-sm">{feature}</span>
                            </div>
                          ))}
                        </div>

                        <div className="border-t pt-4 space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">حد التغطية:</span>
                            <span className="text-sm font-medium">{insurance.coverage}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">قيمة التحمل:</span>
                            <span className="text-sm font-medium">{insurance.deductible}</span>
                          </div>
                        </div>

                        <Button className={`w-full bg-gradient-to-r ${insurance.color} text-white border-0 hover:shadow-lg transition-all duration-300`}>
                          اختيار هذه الخطة
                          <ChevronRight className="w-4 h-4 mr-2" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'claims' && (
              <div className="space-y-8">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold mb-4">إجراءات المطالبات</h2>
                  <p className="text-lg text-muted-foreground">
                    خطوات بسيطة وواضحة للحصول على التعويض بسرعة
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                  {claimSteps.map((step, index) => (
                    <Card key={step.step} className="relative group hover:shadow-xl transition-all duration-300 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-white/20 dark:border-slate-700/50">
                      <CardContent className="p-6 text-center">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto mb-4 flex items-center justify-center text-white font-bold text-xl group-hover:scale-110 transition-transform duration-300">
                          {step.step}
                        </div>
                        <step.icon className="w-8 h-8 mx-auto mb-3 text-blue-500" />
                        <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{step.description}</p>
                        <Badge variant="outline" className="text-xs">
                          <Clock className="w-3 h-3 mr-1" />
                          {step.timeframe}
                        </Badge>
                      </CardContent>
                      
                      {index < claimSteps.length - 1 && (
                        <div className="hidden lg:block absolute top-1/2 -left-3 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center z-10">
                          <ChevronRight className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </Card>
                  ))}
                </div>

                {/* Emergency Contact */}
                <Card className="bg-gradient-to-r from-red-500 to-orange-500 text-white">
                  <CardContent className="p-8 text-center">
                    <AlertTriangle className="w-16 h-16 mx-auto mb-4 opacity-80" />
                    <h3 className="text-2xl font-bold mb-4">خط الطوارئ</h3>
                    <p className="text-lg mb-6 opacity-90">
                      في حالة وقوع حادث، اتصل بنا فوراً على الرقم التالي
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button variant="secondary" size="lg" className="flex items-center gap-2 bg-white text-red-600 hover:bg-gray-100">
                        <Phone className="w-5 h-5" />
                        الاتصال الآن: 0555812567
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'exclusions' && (
              <div className="space-y-8">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold mb-4">الاستثناءات والقيود</h2>
                  <p className="text-lg text-muted-foreground">
                    احرص على قراءة هذه الاستثناءات لتجنب مشاكل التغطية التأمينية
                  </p>
                </div>

                <div className="space-y-6">
                  {exclusions.map((exclusion, index) => (
                    <Card key={index} className={`group hover:shadow-lg transition-all duration-300 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-white/20 dark:border-slate-700/50 ${
                      exclusion.severity === 'high' ? 'border-r-4 border-r-red-500' :
                      exclusion.severity === 'medium' ? 'border-r-4 border-r-orange-500' :
                      'border-r-4 border-r-yellow-500'
                    }`}>
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                            exclusion.severity === 'high' ? 'bg-red-100 text-red-600' :
                            exclusion.severity === 'medium' ? 'bg-orange-100 text-orange-600' :
                            'bg-yellow-100 text-yellow-600'
                          }`}>
                            <AlertTriangle className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-lg mb-2">{exclusion.title}</h3>
                            <p className="text-muted-foreground">{exclusion.description}</p>
                          </div>
                          <Badge variant={
                            exclusion.severity === 'high' ? 'destructive' :
                            exclusion.severity === 'medium' ? 'default' :
                            'secondary'
                          }>
                            {exclusion.severity === 'high' ? 'عالي' :
                             exclusion.severity === 'medium' ? 'متوسط' : 'منخفض'}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Important Notice */}
                <Card className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                  <CardContent className="p-8 text-center">
                    <Info className="w-16 h-16 mx-auto mb-4 opacity-80" />
                    <h3 className="text-2xl font-bold mb-4">إشعار هام</h3>
                    <p className="text-lg opacity-90">
                      يرجى قراءة جميع الشروط والاستثناءات بعناية قبل توقيع عقد التأجير. 
                      في حالة وجود أي استفسار، لا تتردد في التواصل مع فريق خدمة العملاء.
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'terms' && (
              <div className="space-y-8">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold mb-4">الشروط والأحكام العامة</h2>
                  <p className="text-lg text-muted-foreground">
                    الشروط الأساسية التي تحكم خدمات التأمين لدينا
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-white/20 dark:border-slate-700/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-blue-500" />
                        شروط التغطية
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-sm">يجب أن يكون المستأجر حاصلاً على رخصة قيادة سارية المفعول</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-sm">الحد الأدنى لعمر المستأجر 21 سنة</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-sm">يجب الإبلاغ عن أي حادث خلال 24 ساعة</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-sm">التأمين ساري المفعول داخل المملكة العربية السعودية فقط</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-white/20 dark:border-slate-700/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-green-500" />
                        شروط الدفع
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-sm">يتم دفع أقساط التأمين مقدماً مع الحجز</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-sm">لا يمكن استرداد أقساط التأمين بعد بدء الرحلة</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-sm">يجب دفع قيمة التحمل قبل معالجة المطالبة</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-sm">التعويضات تتم خلال 7-14 يوم عمل</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-white/20 dark:border-slate-700/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-purple-500" />
                        مسؤوليات المستأجر
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-sm">القيادة الآمنة وفقاً لقوانين المرور</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-sm">الحفاظ على السيارة في حالة جيدة</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-sm">الإبلاغ الفوري عن أي مشاكل أو حوادث</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-sm">التعاون الكامل في إجراءات المطالبات</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-white/20 dark:border-slate-700/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Settings className="w-5 h-5 text-orange-500" />
                        أحكام عامة
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-sm">تخضع هذه الوثيقة للقوانين السعودية</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-sm">يحق للشركة تعديل الشروط بإشعار مسبق</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-sm">حل النزاعات يتم عبر التحكيم التجاري</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-sm">النسخة العربية هي المرجع في حالة الاختلاف</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>

          {/* Contact Section */}
          <Card className="mt-12 bg-gradient-to-r from-indigo-500 to-purple-600 text-white animate-fade-in">
            <CardContent className="p-8 text-center">
              <Headphones className="w-16 h-16 mx-auto mb-4 opacity-80" />
              <h3 className="text-2xl font-bold mb-4">نحن هنا لمساعدتك</h3>
              <p className="text-lg mb-6 opacity-90">
                فريق متخصص في التأمين جاهز للإجابة على جميع استفساراتك
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="secondary" size="lg" className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  0555812567
                </Button>
                <Button variant="outline" size="lg" className="flex items-center gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20">
                  <Mail className="w-5 h-5" />
                  info@ash-holding.sa
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        
        <CarRentalFooter />
      </div>
    </div>
  );
};

export default InsurancePolicy;