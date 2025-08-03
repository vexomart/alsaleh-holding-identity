import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import InteractiveMap from "@/components/InteractiveMap";
import { 
  MapPin, 
  Building2, 
  Users, 
  Calendar, 
  Phone, 
  Mail, 
  Globe, 
  Award,
  TrendingUp,
  Filter,
  ExternalLink,
  CheckCircle,
  ArrowRight,
  Clock,
  Target,
  Zap
} from "lucide-react";

interface Office {
  id: string;
  name: string;
  nameEn: string;
  type: 'headquarters' | 'main-branch' | 'regional' | 'representative' | 'coordination' | 'european';
  country: string;
  city: string;
  coordinates: { lat: number; lng: number };
  established: string;
  employees: number;
  services: string[];
  contact: {
    phone: string;
    email: string;
    address: string;
  };
  description: string;
  color: string;
  priority: number;
  achievements?: string[];
}

const offices: Office[] = [
  {
    id: 'jeddah',
    name: 'جدة - المقر الرئيسي',
    nameEn: 'Jeddah - Headquarters',
    type: 'headquarters',
    country: 'المملكة العربية السعودية',
    city: 'جدة',
    coordinates: { lat: 21.5433, lng: 39.1728 },
    established: '2016',
    employees: 150,
    services: ['الإدارة العامة', 'التطوير', 'المبيعات', 'التسويق', 'الدعم الفني'],
    contact: {
      phone: '+966555812567',
      email: 'jeddah@ash.holdings',
      address: 'جدة، المملكة العربية السعودية'
    },
    description: 'المقر الرئيسي للشركة والمركز الإداري الأساسي لجميع العمليات التقنية والاستثمارية',
    color: '#dc2626',
    priority: 1,
    achievements: ['مركز القيادة الرئيسي', 'أكبر فريق عمل', 'مركز الابتكار التقني']
  },
  {
    id: 'riyadh',
    name: 'الرياض - الفرع الرئيسي',
    nameEn: 'Riyadh - Main Branch',
    type: 'main-branch',
    country: 'المملكة العربية السعودية',
    city: 'الرياض',
    coordinates: { lat: 24.7136, lng: 46.6753 },
    established: '2018',
    employees: 85,
    services: ['الحلول الذكية', 'الاستشارات', 'التدريب', 'الدعم التقني'],
    contact: {
      phone: '+966114567890',
      email: 'riyadh@ash.holdings',
      address: 'الرياض، المملكة العربية السعودية'
    },
    description: 'الفرع الرئيسي المتخصص في الحلول التقنية الذكية والاستشارات الاستراتيجية لدعم رؤية 2030',
    color: '#16a34a',
    priority: 2,
    achievements: ['مركز الحلول الذكية', 'شراكات حكومية', 'برامج التدريب المتقدمة']
  },
  {
    id: 'dubai',
    name: 'دبي - المكتب الإقليمي',
    nameEn: 'Dubai - Regional Office',
    type: 'regional',
    country: 'دولة الإمارات العربية المتحدة',
    city: 'دبي',
    coordinates: { lat: 25.2048, lng: 55.2708 },
    established: '2019',
    employees: 45,
    services: ['التوسع الإقليمي', 'الشراكات الدولية', 'التطوير التجاري'],
    contact: {
      phone: '+971501234567',
      email: 'dubai@ash.holdings',
      address: 'دبي، الإمارات العربية المتحدة'
    },
    description: 'المكتب الإقليمي لمنطقة الخليج العربي ومركز التوسع الدولي والشراكات الاستراتيجية',
    color: '#2563eb',
    priority: 3,
    achievements: ['بوابة الخليج التقنية', 'شراكات إقليمية', 'مركز التوسع الدولي']
  },
  {
    id: 'muscat',
    name: 'مسقط - المكتب التمثيلي',
    nameEn: 'Muscat - Representative Office',
    type: 'representative',
    country: 'سلطنة عمان',
    city: 'مسقط',
    coordinates: { lat: 23.5859, lng: 58.4059 },
    established: '2020',
    employees: 25,
    services: ['التمثيل التجاري', 'تطوير الأعمال', 'الدعم المحلي'],
    contact: {
      phone: '+96812345678',
      email: 'muscat@ash.holdings',
      address: 'مسقط، سلطنة عمان'
    },
    description: 'المكتب التمثيلي لخدمة السوق العماني وتطوير الأعمال المحلية والحلول التقنية المتخصصة',
    color: '#ca8a04',
    priority: 4,
    achievements: ['تمثيل تجاري متميز', 'شراكات محلية قوية', 'نمو مستدام']
  },
  {
    id: 'amman',
    name: 'عمان - مكتب التنسيق',
    nameEn: 'Amman - Coordination Office',
    type: 'coordination',
    country: 'المملكة الأردنية الهاشمية',
    city: 'عمان',
    coordinates: { lat: 31.9539, lng: 35.9106 },
    established: '2021',
    employees: 20,
    services: ['التنسيق الإقليمي', 'إدارة المشاريع', 'الدعم اللوجستي'],
    contact: {
      phone: '+96212345678',
      email: 'amman@ash.holdings',
      address: 'عمان، الأردن'
    },
    description: 'مكتب التنسيق الإقليمي لإدارة المشاريع والعمليات في منطقة بلاد الشام والتنسيق اللوجستي',
    color: '#ea580c',
    priority: 5,
    achievements: ['تنسيق إقليمي فعال', 'إدارة مشاريع احترافية', 'كفاءة عالية']
  },
  {
    id: 'berlin',
    name: 'برلين - المكتب الأوروبي',
    nameEn: 'Berlin - European Office',
    type: 'european',
    country: 'جمهورية ألمانيا الاتحادية',
    city: 'برلين',
    coordinates: { lat: 52.5200, lng: 13.4050 },
    established: '2022',
    employees: 30,
    services: ['التوسع الأوروبي', 'التكنولوجيا المتقدمة', 'البحث والتطوير'],
    contact: {
      phone: '+493012345678',
      email: 'berlin@ash.holdings',
      address: 'Berlin, Germany'
    },
    description: 'المكتب الأوروبي المتخصص في التكنولوجيا المتقدمة والبحث والتطوير والشراكات الأوروبية',
    color: '#7c3aed',
    priority: 6,
    achievements: ['بوابة أوروبا التقنية', 'تقنيات متقدمة', 'شراكات دولية مهمة']
  }
];

const typeLabels = {
  headquarters: 'المقر الرئيسي',
  'main-branch': 'فرع رئيسي',
  regional: 'مكتب إقليمي',
  representative: 'مكتب تمثيلي',
  coordination: 'مكتب تنسيق',
  european: 'مكتب أوروبي'
};

const GlobalPresence = () => {
  const [selectedOffice, setSelectedOffice] = useState<Office | null>(null);
  const [filteredOffices, setFilteredOffices] = useState<Office[]>(offices);
  const [sortBy, setSortBy] = useState<'priority' | 'established' | 'employees'>('priority');
  const [filterType, setFilterType] = useState<string>('all');

  // Filter and sort offices
  useEffect(() => {
    let filtered = offices;
    
    if (filterType !== 'all') {
      filtered = offices.filter(office => office.type === filterType);
    }

    filtered.sort((a, b) => {
      if (sortBy === 'priority') return a.priority - b.priority;
      if (sortBy === 'established') return parseInt(a.established) - parseInt(b.established);
      if (sortBy === 'employees') return b.employees - a.employees;
      return 0;
    });

    setFilteredOffices(filtered);
  }, [sortBy, filterType]);

  const totalEmployees = offices.reduce((sum, office) => sum + office.employees, 0);
  const countries = new Set(offices.map(office => office.country)).size;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface to-background">
      <Navigation />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 md:py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-primary/10" />
          <div className="absolute top-20 right-20 w-32 h-32 bg-blue-200/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 left-20 w-24 h-24 bg-purple-200/20 rounded-full blur-3xl animate-float-delayed" />
          
          <div className="container mx-auto px-4 lg:px-6 relative z-10">
            <div className="text-center mb-16 animate-fade-in">
              <div className="inline-flex items-center gap-3 mb-8 p-4 bg-white/80 backdrop-blur-md rounded-full border border-primary/20 shadow-lg">
                <Globe className="w-6 h-6 text-primary animate-pulse" />
                <span className="text-primary font-semibold">تواجدنا العالمي</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
                <span className="text-primary">خريطة </span>
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">مكاتبنا</span>
                <br />
                <span className="text-muted-foreground text-3xl md:text-4xl lg:text-5xl">حول العالم</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                نفخر بوجودنا في ستة مكاتب استراتيجية عبر ثلاث قارات، نخدم من خلالها عملائنا ونوسع آفاق أعمالنا عالمياً
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              <Card className="bg-white/80 backdrop-blur-md border-0 shadow-xl hover:shadow-2xl transition-all duration-500 group hover:scale-105">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Building2 className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-primary mb-2">{offices.length}</div>
                  <div className="font-semibold text-foreground mb-1">مكاتب عالمية</div>
                  <div className="text-sm text-muted-foreground">Global Offices</div>
                </CardContent>
              </Card>
              
              <Card className="bg-white/80 backdrop-blur-md border-0 shadow-xl hover:shadow-2xl transition-all duration-500 group hover:scale-105">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Globe className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-primary mb-2">{countries}</div>
                  <div className="font-semibold text-foreground mb-1">دول</div>
                  <div className="text-sm text-muted-foreground">Countries</div>
                </CardContent>
              </Card>
              
              <Card className="bg-white/80 backdrop-blur-md border-0 shadow-xl hover:shadow-2xl transition-all duration-500 group hover:scale-105">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-primary mb-2">{totalEmployees}</div>
                  <div className="font-semibold text-foreground mb-1">موظف</div>
                  <div className="text-sm text-muted-foreground">Employees</div>
                </CardContent>
              </Card>
              
              <Card className="bg-white/80 backdrop-blur-md border-0 shadow-xl hover:shadow-2xl transition-all duration-500 group hover:scale-105">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Calendar className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-primary mb-2">2016</div>
                  <div className="font-semibold text-foreground mb-1">سنة التأسيس</div>
                  <div className="text-sm text-muted-foreground">Since</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Interactive Map Section */}
        <section className="py-20 bg-gradient-to-br from-secondary/5 to-primary/5">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="text-center mb-12 animate-fade-in">
              <div className="inline-flex items-center gap-3 mb-6 p-3 bg-primary/10 rounded-full">
                <MapPin className="w-6 h-6 text-primary animate-pulse" />
                <span className="text-primary font-semibold">الخريطة التفاعلية</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
                استكشف مكاتبنا بالخريطة
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                خريطة تفاعلية ثلاثية الأبعاد تُظهر مواقع مكاتبنا حول العالم مع تفاصيل كل مكتب
              </p>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-8 justify-between items-start md:items-center">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-48 bg-white/80 backdrop-blur-md">
                      <SelectValue placeholder="فلترة حسب النوع" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع المكاتب</SelectItem>
                      <SelectItem value="headquarters">المقر الرئيسي</SelectItem>
                      <SelectItem value="main-branch">الفروع الرئيسية</SelectItem>
                      <SelectItem value="regional">المكاتب الإقليمية</SelectItem>
                      <SelectItem value="representative">المكاتب التمثيلية</SelectItem>
                      <SelectItem value="coordination">مكاتب التنسيق</SelectItem>
                      <SelectItem value="european">المكاتب الأوروبية</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-muted-foreground" />
                  <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                    <SelectTrigger className="w-48 bg-white/80 backdrop-blur-md">
                      <SelectValue placeholder="ترتيب حسب" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="priority">الأهمية</SelectItem>
                      <SelectItem value="established">تاريخ التأسيس</SelectItem>
                      <SelectItem value="employees">عدد الموظفين</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Badge variant="outline" className="bg-white/80 backdrop-blur-md text-sm">
                {filteredOffices.length} من {offices.length} مكتب
              </Badge>
            </div>

            {/* Map */}
            <div className="mb-12">
              <InteractiveMap 
                offices={filteredOffices}
                selectedOffice={selectedOffice}
                onSelectOffice={setSelectedOffice}
              />
            </div>
          </div>
        </section>

        {/* Office Details Section */}
        {selectedOffice && (
          <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
            <div className="container mx-auto px-4 lg:px-6">
              <Card className="bg-white/95 backdrop-blur-xl border-0 shadow-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-primary to-secondary text-white p-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-3xl font-bold mb-2">
                        {selectedOffice.name}
                      </CardTitle>
                      <p className="text-blue-100 text-lg">{selectedOffice.nameEn}</p>
                      <Badge className="mt-2 bg-white/20 text-white border-white/30">
                        {typeLabels[selectedOffice.type]}
                      </Badge>
                    </div>
                    <div 
                      className="w-20 h-20 rounded-full border-4 border-white shadow-xl"
                      style={{ backgroundColor: selectedOffice.color }}
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="grid lg:grid-cols-2 gap-8">
                    {/* Office Info */}
                    <div>
                      <h3 className="text-2xl font-bold text-primary mb-4">معلومات المكتب</h3>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <MapPin className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <div className="font-semibold">{selectedOffice.country}</div>
                            <div className="text-sm text-muted-foreground">{selectedOffice.contact.address}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <Calendar className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <div className="font-semibold">تأسس في {selectedOffice.established}</div>
                            <div className="text-sm text-muted-foreground">
                              {new Date().getFullYear() - parseInt(selectedOffice.established)} سنوات من الخبرة
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <Users className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <div className="font-semibold">{selectedOffice.employees} موظف</div>
                            <div className="text-sm text-muted-foreground">فريق متخصص ومتفاني</div>
                          </div>
                        </div>
                        
                        <div className="mt-6">
                          <h4 className="font-semibold mb-3">وصف المكتب</h4>
                          <p className="text-muted-foreground leading-relaxed">
                            {selectedOffice.description}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Services & Contact */}
                    <div>
                      <h3 className="text-2xl font-bold text-primary mb-4">الخدمات والتواصل</h3>
                      
                      {/* Services */}
                      <div className="mb-6">
                        <h4 className="font-semibold mb-3">الخدمات المتاحة</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedOffice.services.map((service, index) => (
                            <Badge key={index} variant="outline" className="text-sm">
                              {service}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Achievements */}
                      {selectedOffice.achievements && (
                        <div className="mb-6">
                          <h4 className="font-semibold mb-3">الإنجازات الرئيسية</h4>
                          <div className="space-y-2">
                            {selectedOffice.achievements.map((achievement, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                <span className="text-sm">{achievement}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Contact */}
                      <div className="space-y-3">
                        <h4 className="font-semibold">معلومات التواصل</h4>
                        
                        <div className="flex flex-col sm:flex-row gap-3">
                          <Button className="flex-1 bg-green-600 hover:bg-green-700" asChild>
                            <a href={`tel:${selectedOffice.contact.phone}`}>
                              <Phone className="w-4 h-4 mr-2" />
                              اتصال مباشر
                            </a>
                          </Button>
                          
                          <Button variant="outline" className="flex-1" asChild>
                            <a href={`mailto:${selectedOffice.contact.email}`}>
                              <Mail className="w-4 h-4 mr-2" />
                              إرسال إيميل
                            </a>
                          </Button>
                        </div>

                        <Button 
                          variant="ghost" 
                          className="w-full text-primary"
                          onClick={() => setSelectedOffice(null)}
                        >
                          العودة للخريطة
                          <ArrowRight className="w-4 h-4 mr-2" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        )}

        {/* Offices Grid */}
        <section className="py-20">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="text-center mb-12 animate-fade-in">
              <div className="inline-flex items-center gap-3 mb-6 p-3 bg-primary/10 rounded-full">
                <Building2 className="w-6 h-6 text-primary animate-pulse" />
                <span className="text-primary font-semibold">جميع المكاتب</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
                مكاتبنا بالتفصيل
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                استكشف تفاصيل كل مكتب من مكاتبنا حول العالم
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredOffices.map((office, index) => (
                <Card 
                  key={office.id}
                  className="bg-white/80 backdrop-blur-md border-0 shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden group hover:scale-105 cursor-pointer"
                  onClick={() => setSelectedOffice(office)}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardHeader className="relative overflow-hidden">
                    <div 
                      className="absolute inset-0 opacity-10"
                      style={{ background: `linear-gradient(135deg, ${office.color}22, ${office.color}44)` }}
                    />
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-3">
                        <Badge 
                          className="text-white border-0"
                          style={{ backgroundColor: office.color }}
                        >
                          {typeLabels[office.type]}
                        </Badge>
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: office.color }}
                        />
                      </div>
                      <CardTitle className="text-xl font-bold text-primary group-hover:text-secondary transition-colors duration-300">
                        {office.name}
                      </CardTitle>
                      <p className="text-muted-foreground text-sm">{office.nameEn}</p>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-6">
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span>{office.country}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>تأسس في {office.established}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span>{office.employees} موظف</span>
                      </div>
                    </div>

                    <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
                      {office.description}
                    </p>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {office.services.slice(0, 2).map((service, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {service}
                        </Badge>
                      ))}
                      {office.services.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{office.services.length - 2}
                        </Badge>
                      )}
                    </div>

                    <Button 
                      className="w-full group-hover:bg-secondary transition-colors duration-300"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedOffice(office);
                      }}
                    >
                      عرض التفاصيل
                      <ArrowRight className="w-4 h-4 mr-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 bg-gradient-to-r from-primary to-secondary relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />
          
          <div className="container mx-auto px-4 lg:px-6 relative z-10">
            <div className="text-center animate-fade-in">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                تواصل مع أقرب مكتب لك
              </h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                فريقنا جاهز لخدمتك في جميع مكاتبنا حول العالم
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  variant="secondary"
                  className="bg-white text-primary hover:bg-white/90 px-8 py-6 text-lg font-semibold"
                  asChild
                >
                  <a href="/contact">
                    تواصل معنا
                    <ArrowRight className="w-5 h-5 mr-2" />
                  </a>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white/10 px-8 py-6 text-lg font-semibold"
                  asChild
                >
                  <a href="https://wa.me/966555812567" target="_blank" rel="noopener noreferrer">
                    واتساب مباشر
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default GlobalPresence;