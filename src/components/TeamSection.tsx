import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Crown, 
  Users, 
  Code, 
  TrendingUp, 
  Building2, 
  Shield, 
  Star, 
  Award, 
  ChevronRight, 
  Sparkles, 
  Brain, 
  Mail,
  MapPin,
  Calendar,
  Briefcase,
  Target,
  Linkedin,
  ExternalLink,
  GraduationCap,
  Zap,
  ArrowUpRight
} from "lucide-react";
import { useState } from "react";

const TeamSection = () => {
  const [selectedMember, setSelectedMember] = useState<number | null>(null);

  const teamMembers = [
    {
      name: "أ/علي صالح الشهري",
      nameEn: "Ali Saleh Al-Shahri",
      position: "رئيس مجلس الإدارة والمؤسس",
      positionEn: "Chairman & Founder",
      department: "القيادة الاستراتيجية",
      departmentEn: "Strategic Leadership",
      specialties: ["الريادة الاستراتيجية", "الإبداع والابتكار", "التخطيط طويل المدى"],
      achievements: "قائد أكثر من 100 مشروع عالمي",
      experience: "15+ سنة",
      education: "ماجستير إدارة الأعمال - هارفارد",
      certifications: ["PMP", "Six Sigma Black Belt", "Certified CEO"],
      color: "from-purple-600 to-blue-600",
      icon: Crown,
      bgEffect: "from-purple-500/10 to-blue-500/10",
      location: "الرياض، المملكة العربية السعودية",
      joinDate: "2018",
      bio: "رائد أعمال متميز بخبرة واسعة في قيادة المؤسسات التقنية والتحول الرقمي على المستوى العالمي."
    },
    {
      name: "خالد بن محمد الحارثي",
      nameEn: "Khalid Bin Mohammed Al-Harthi",
      position: "المدير التنفيذي للعمليات",
      positionEn: "Chief Operating Officer",
      department: "العمليات والتطوير",
      departmentEn: "Operations & Development",
      specialties: ["إدارة العمليات المتقدمة", "التحسين المستمر", "الكفاءة التشغيلية"],
      achievements: "تحقيق زيادة في الكفاءة بنسبة 300%",
      experience: "12+ سنة",
      education: "ماجستير الهندسة الصناعية",
      certifications: ["Lean Six Sigma", "Operations Excellence", "Change Management"],
      color: "from-emerald-600 to-teal-600",
      icon: Building2,
      bgEffect: "from-emerald-500/10 to-teal-500/10",
      location: "الرياض، المملكة العربية السعودية",
      joinDate: "2019",
      bio: "خبير متميز في تطوير العمليات وتحقيق الكفاءة التشغيلية القصوى للمؤسسات."
    },
    {
      name: "محمد عبدالله الأحمري",
      nameEn: "Mohammed Abdullah Al-Ahmari",
      position: "رئيس قسم الموارد البشرية",
      positionEn: "Chief Human Resources Officer",
      department: "تطوير المواهب والقيادة",
      departmentEn: "Talent Development & Leadership",
      specialties: ["تطوير المواهب", "التدريب التنفيذي", "الثقافة المؤسسية"],
      achievements: "تطوير وتدريب أكثر من 850 موظف",
      experience: "10+ سنة",
      education: "ماجستير علم النفس التنظيمي",
      certifications: ["SHRM-CP", "Certified Leadership Coach", "Talent Management"],
      color: "from-blue-600 to-cyan-600",
      icon: Users,
      bgEffect: "from-blue-500/10 to-cyan-500/10",
      location: "الرياض، المملكة العربية السعودية",
      joinDate: "2019",
      bio: "متخصص في بناء وتطوير المواهب البشرية وخلق بيئات عمل محفزة للإبداع والابتكار."
    },
    {
      name: "محمود عبد الخالق السعيد",
      nameEn: "Mahmoud Abdul Khaliq Al-Saeed",
      position: "رئيس قسم التقنية والابتكار",
      positionEn: "Chief Technology & Innovation Officer",
      department: "التقنية والذكاء الاصطناعي",
      departmentEn: "Technology & Artificial Intelligence",
      specialties: ["الذكاء الاصطناعي", "هندسة البرمجيات", "الابتكار التقني"],
      achievements: "تطوير أكثر من 50 منتج تقني مبتكر",
      experience: "14+ سنة",
      education: "دكتوراه علوم الحاسوب - MIT",
      certifications: ["AWS Solutions Architect", "Google Cloud Professional", "Microsoft Azure Expert"],
      color: "from-indigo-600 to-purple-600",
      icon: Code,
      bgEffect: "from-indigo-500/10 to-purple-500/10",
      location: "الرياض، المملكة العربية السعودية",
      joinDate: "2018",
      bio: "عالم حاسوب متميز متخصص في تطوير حلول الذكاء الاصطناعي والتقنيات المتقدمة."
    },
    {
      name: "عبدالرحمن فهد الدوسري",
      nameEn: "Abdulrahman Fahad Al-Dosari",
      position: "مدير الاستثمارات والنمو",
      positionEn: "Chief Investment & Growth Officer",
      department: "الاستثمار والتطوير المالي",
      departmentEn: "Investment & Financial Development",
      specialties: ["الاستثمار الاستراتيجي", "التحليل المالي المتقدم", "استراتيجيات النمو"],
      achievements: "إدارة محفظة استثمارية تزيد عن 500 مليون",
      experience: "13+ سنة",
      education: "ماجستير المالية - وارتون",
      certifications: ["CFA", "FRM", "Investment Banking Certified"],
      color: "from-orange-600 to-red-600",
      icon: TrendingUp,
      bgEffect: "from-orange-500/10 to-red-500/10",
      location: "الرياض، المملكة العربية السعودية",
      joinDate: "2020",
      bio: "محلل مالي ومستثمر خبير في تطوير استراتيجيات النمو والاستثمار طويل المدى."
    },
    {
      name: "سعود فهد الشمري",
      nameEn: "Saud Fahad Al-Shamri",
      position: "مدير الجودة والامتثال",
      positionEn: "Chief Quality & Compliance Officer",
      department: "الجودة والحوكمة المؤسسية",
      departmentEn: "Quality & Corporate Governance",
      specialties: ["إدارة الجودة الشاملة", "الامتثال التنظيمي", "إدارة المخاطر"],
      achievements: "تحقيق معدل جودة 99.8% عبر جميع المشاريع",
      experience: "11+ سنة",
      education: "ماجستير إدارة الجودة",
      certifications: ["ISO 9001 Lead Auditor", "Risk Management Professional", "Compliance Officer"],
      color: "from-green-600 to-emerald-600",
      icon: Shield,
      bgEffect: "from-green-500/10 to-emerald-500/10",
      location: "الرياض، المملكة العربية السعودية",
      joinDate: "2020",
      bio: "خبير في أنظمة الجودة والحوكمة مع التركيز على الامتثال للمعايير الدولية."
    }
  ];

  return (
    <section className="py-20 md:py-28 relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-gray-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Modern Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100/20 via-transparent to-purple-100/20 dark:from-blue-900/20 dark:to-purple-900/20"></div>
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]"></div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Professional Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-3 mb-6 px-6 py-3 bg-white/80 dark:bg-slate-800/80 rounded-full backdrop-blur-sm border border-gray-200/50 dark:border-slate-700/50 shadow-lg">
            <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">فريق القيادة التنفيذية</span>
            <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
              6 خبراء
            </Badge>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            فريق <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">القيادة</span>
          </h2>
          
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8">
            نخبة من القادة المتميزين الذين يوجهون رؤيتنا الاستراتيجية ويقودون التحول الرقمي
            <br />
            <span className="text-base text-gray-500 dark:text-gray-400">بخبرة جماعية تزيد عن 85 عاماً في القطاعات التقنية والمالية</span>
          </p>
        </div>

        {/* Executive Team Grid */}
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-20">
          {teamMembers.map((member, index) => {
            const IconComponent = member.icon;
            const isSelected = selectedMember === index;
            
            return (
              <Card 
                key={index} 
                className={`group relative overflow-hidden bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-gray-200/50 dark:border-slate-700/50 hover:border-blue-300/50 dark:hover:border-blue-600/50 transition-all duration-500 cursor-pointer hover:shadow-xl hover:shadow-blue-500/10 ${
                  isSelected ? 'ring-2 ring-blue-500 scale-105' : 'hover:scale-102'
                }`}
                onClick={() => setSelectedMember(isSelected ? null : index)}
              >
                {/* Premium background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${member.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                
                <CardContent className="p-8 relative z-10">
                  {/* Professional Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-16 h-16 bg-gradient-to-br ${member.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      
                      <div className="flex flex-col">
                        <Badge variant="outline" className="w-fit text-xs font-medium mb-2 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300">
                          {member.department}
                        </Badge>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-xs text-green-600 dark:text-green-400 font-medium">متاح</span>
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      <Mail className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {/* Executive Information */}
                  <div className="space-y-4 mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                        {member.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                        {member.nameEn}
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-4 border-l-4 border-blue-500">
                      <p className="text-base font-semibold text-gray-900 dark:text-white mb-1">
                        {member.position}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {member.positionEn}
                      </p>
                    </div>
                  </div>

                  {/* Professional Details */}
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-3 text-sm">
                      <GraduationCap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-gray-600 dark:text-gray-300">{member.education}</span>
                    </div>
                    
                    <div className="flex items-center gap-3 text-sm">
                      <Briefcase className="w-4 h-4 text-green-600 dark:text-green-400" />
                      <span className="text-gray-600 dark:text-gray-300">{member.experience} خبرة</span>
                    </div>
                    
                    <div className="flex items-center gap-3 text-sm">
                      <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      <span className="text-gray-600 dark:text-gray-300">انضم في {member.joinDate}</span>
                    </div>
                    
                    <div className="flex items-center gap-3 text-sm">
                      <MapPin className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                      <span className="text-gray-600 dark:text-gray-300">{member.location}</span>
                    </div>
                  </div>

                  {/* Key Achievement */}
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg p-4 mb-6 border border-yellow-200/50 dark:border-yellow-800/50">
                    <div className="flex items-start gap-3">
                      <Award className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                      <div>
                        <div className="text-xs font-semibold text-yellow-700 dark:text-yellow-300 mb-1">الإنجاز الرئيسي</div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                          {member.achievements}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Specialties */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      التخصصات الرئيسية
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {member.specialties.map((specialty, specialtyIndex) => (
                        <Badge 
                          key={specialtyIndex} 
                          variant="secondary"
                          className="text-xs bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                        >
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Expand Button */}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full group-hover:bg-blue-50 dark:group-hover:bg-blue-900/50 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedMember(isSelected ? null : index);
                    }}
                  >
                    {isSelected ? 'إخفاء التفاصيل' : 'عرض التفاصيل'}
                    <ChevronRight className={`w-4 h-4 mr-2 transition-transform ${isSelected ? 'rotate-90' : ''}`} />
                  </Button>

                  {/* Expanded Details */}
                  {isSelected && (
                    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-slate-700 space-y-4 animate-fade-in">
                      <div>
                        <h5 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">نبذة شخصية</h5>
                        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                          {member.bio}
                        </p>
                      </div>
                      
                      <div>
                        <h5 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">الشهادات المهنية</h5>
                        <div className="flex flex-wrap gap-2">
                          {member.certifications.map((cert, certIndex) => (
                            <Badge 
                              key={certIndex} 
                              className={`text-xs bg-gradient-to-r ${member.color} text-white border-0`}
                            >
                              {cert}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex gap-2 pt-4">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Linkedin className="w-4 h-4 mr-2" />
                          LinkedIn
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Mail className="w-4 h-4 mr-2" />
                          تواصل
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Progress indicator */}
                  <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${member.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`} />
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Executive Summary */}
        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-3xl p-12 border border-gray-200/50 dark:border-slate-700/50 shadow-xl">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Sparkles className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                فريق القيادة التنفيذية
              </h3>
              <Zap className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
              قيادة استراتيجية متميزة تجمع بين الخبرة العالمية والفهم العميق للسوق المحلي
            </p>
          </div>
          
          {/* Leadership Statistics */}
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="text-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl p-6 border border-blue-200/50 dark:border-blue-800/50">
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">85+</div>
              <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">سنة خبرة جماعية</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Years Combined Experience</div>
            </div>
            
            <div className="text-center bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-2xl p-6 border border-green-200/50 dark:border-green-800/50">
              <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">1,200+</div>
              <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">مشروع بقيادتهم</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Projects Under Leadership</div>
            </div>
            
            <div className="text-center bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-2xl p-6 border border-purple-200/50 dark:border-purple-800/50">
              <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">98.5%</div>
              <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">معدل نجاح القيادة</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Leadership Success Rate</div>
            </div>
            
            <div className="text-center bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-2xl p-6 border border-orange-200/50 dark:border-orange-800/50">
              <div className="text-4xl font-bold text-orange-600 dark:text-orange-400 mb-2">500M+</div>
              <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">قيمة الاستثمارات</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Investment Portfolio Value</div>
            </div>
          </div>

          {/* Professional Recognition */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-xl p-6 text-center">
              <Award className="w-8 h-8 mx-auto mb-3" />
              <div className="font-bold mb-1">أفضل فريق قيادي</div>
              <div className="text-sm opacity-90">الشرق الأوسط 2023</div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-6 text-center">
              <Star className="w-8 h-8 mx-auto mb-3" />
              <div className="font-bold mb-1">قادة الابتكار التقني</div>
              <div className="text-sm opacity-90">مجلة التكنولوجيا العربية</div>
            </div>
            
            <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl p-6 text-center">
              <Target className="w-8 h-8 mx-auto mb-3" />
              <div className="font-bold mb-1">رواد التحول الرقمي</div>
              <div className="text-sm opacity-90">رؤية 2030</div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-8">
            <h4 className="text-2xl font-bold mb-4">
              قيادة استراتيجية • رؤية مستقبلية • تنفيذ متميز
            </h4>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              فريق متكامل من القادة المتميزين يعمل على تحقيق رؤية المملكة 2030 وقيادة التحول الرقمي
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="outline" 
                className="bg-white/10 border-white/30 text-white hover:bg-white hover:text-blue-600"
              >
                تواصل مع الفريق
                <Mail className="w-4 h-4 mr-2" />
              </Button>
              <Button 
                variant="outline" 
                className="bg-white/10 border-white/30 text-white hover:bg-white hover:text-blue-600"
              >
                عرض السيرة التفصيلية
                <ExternalLink className="w-4 h-4 mr-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;