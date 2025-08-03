import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  Navigation
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
    description: 'المقر الرئيسي للشركة والمركز الإداري الأساسي لجميع العمليات',
    color: '#dc2626',
    priority: 1,
    achievements: ['مركز القيادة الرئيسي', 'أكبر فريق عمل', 'مركز الابتكار']
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
    description: 'الفرع الرئيسي المتخصص في الحلول التقنية والاستشارات الاستراتيجية',
    color: '#16a34a',
    priority: 2,
    achievements: ['مركز الحلول الذكية', 'شراكات حكومية', 'برامج التدريب']
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
    services: ['التوسع الإقليمي', 'الشراكات الدولية', 'التطوير'],
    contact: {
      phone: '+971501234567',
      email: 'dubai@ash.holdings',
      address: 'دبي، الإمارات العربية المتحدة'
    },
    description: 'المكتب الإقليمي لمنطقة الخليج العربي ومركز التوسع الدولي',
    color: '#2563eb',
    priority: 3,
    achievements: ['بوابة الخليج', 'شراكات إقليمية', 'مركز التوسع']
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
    description: 'المكتب التمثيلي لخدمة السوق العماني وتطوير الأعمال المحلية',
    color: '#ca8a04',
    priority: 4,
    achievements: ['تمثيل تجاري', 'شراكات محلية', 'نمو مستدام']
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
    description: 'مكتب التنسيق الإقليمي لإدارة المشاريع والعمليات في المنطقة',
    color: '#ea580c',
    priority: 5,
    achievements: ['تنسيق إقليمي', 'إدارة مشاريع', 'كفاءة عالية']
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
    services: ['التوسع الأوروبي', 'التكنولوجيا', 'البحث والتطوير'],
    contact: {
      phone: '+493012345678',
      email: 'berlin@ash.holdings',
      address: 'Berlin, Germany'
    },
    description: 'المكتب الأوروبي المتخصص في التكنولوجيا المتقدمة والبحث والتطوير',
    color: '#7c3aed',
    priority: 6,
    achievements: ['بوابة أوروبا', 'تقنيات متقدمة', 'شراكات دولية']
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
    <div className="min-h-screen bg-gradient-surface pt-20">
      {/* Header Section */}
      <div className="container-modern section-modern">
        <div className="text-center mb-12">
          <Badge className="mb-4 px-6 py-2 bg-primary/10 text-primary border-primary/20">
            <Globe className="w-4 h-4 ml-2" />
            تواجدنا العالمي
          </Badge>
          <h1 className="heading-hero text-gradient-modern mb-6">
            خريطة مكاتبنا حول العالم
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            نفخر بوجودنا في ستة مكاتب استراتيجية عبر ثلاث قارات، نخدم من خلالها عملائنا ونوسع آفاق أعمالنا عالمياً
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid-features mb-12">
          <Card className="card-premium text-center">
            <CardContent className="pt-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                <Building2 className="w-6 h-6 text-primary" />
              </div>
              <div className="text-3xl font-bold text-primary mb-2">{offices.length}</div>
              <div className="text-sm text-muted-foreground">مكاتب عالمية</div>
            </CardContent>
          </Card>
          
          <Card className="card-premium text-center">
            <CardContent className="pt-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-secondary/10 mb-4">
                <Globe className="w-6 h-6 text-secondary" />
              </div>
              <div className="text-3xl font-bold text-secondary mb-2">{countries}</div>
              <div className="text-sm text-muted-foreground">دول</div>
            </CardContent>
          </Card>
          
          <Card className="card-premium text-center">
            <CardContent className="pt-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-success/10 mb-4">
                <Users className="w-6 h-6 text-success" />
              </div>
              <div className="text-3xl font-bold text-success mb-2">{totalEmployees}</div>
              <div className="text-sm text-muted-foreground">موظف</div>
            </CardContent>
          </Card>
          
          <Card className="card-premium text-center">
            <CardContent className="pt-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-warning/10 mb-4">
                <Calendar className="w-6 h-6 text-warning" />
              </div>
              <div className="text-3xl font-bold text-warning mb-2">2016</div>
              <div className="text-sm text-muted-foreground">سنة التأسيس</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-between items-start sm:items-center">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-48">
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
                <SelectTrigger className="w-48">
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

          <Badge variant="outline" className="text-sm">
            {filteredOffices.length} من {offices.length} مكتب
          </Badge>
        </div>

        {/* World Map Visualization */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <Card className="card-premium overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-primary" />
                  خريطة التواجد العالمي
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-8 h-96 overflow-hidden">
                  {/* World Map Background */}
                  <div className="absolute inset-0 opacity-10">
                    <svg viewBox="0 0 1000 500" className="w-full h-full">
                      {/* Simplified world continents */}
                      <path d="M150 200 Q200 180 250 200 Q300 220 350 200 Q400 180 450 200 Q500 220 550 200 Q600 180 650 200" 
                            stroke="#3b82f6" strokeWidth="2" fill="none" opacity="0.3" />
                      {/* Europe */}
                      <circle cx="500" cy="150" r="80" fill="#3b82f6" opacity="0.1" />
                      {/* Middle East */}
                      <circle cx="550" cy="200" r="120" fill="#3b82f6" opacity="0.1" />
                      {/* Asia */}
                      <circle cx="700" cy="180" r="100" fill="#3b82f6" opacity="0.1" />
                    </svg>
                  </div>

                  {/* Office Markers */}
                  <div className="relative h-full">
                    {filteredOffices.map((office, index) => {
                      // Calculate position based on coordinates (simplified projection)
                      const x = ((office.coordinates.lng + 180) / 360) * 100;
                      const y = ((90 - office.coordinates.lat) / 180) * 100;
                      
                      return (
                        <div
                          key={office.id}
                          className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 hover:scale-125 ${
                            selectedOffice?.id === office.id ? 'scale-125 z-10' : 'hover:z-10'
                          }`}
                          style={{ 
                            left: `${Math.max(10, Math.min(90, x))}%`, 
                            top: `${Math.max(10, Math.min(90, y))}%` 
                          }}
                          onClick={() => setSelectedOffice(office)}
                        >
                          <div 
                            className={`w-6 h-6 rounded-full border-3 border-white shadow-lg animate-pulse ${
                              office.type === 'headquarters' ? 'w-8 h-8' : 
                              office.type === 'main-branch' ? 'w-7 h-7' : 'w-6 h-6'
                            }`}
                            style={{ backgroundColor: office.color }}
                          />
                          <div 
                            className={`absolute top-8 left-1/2 transform -translate-x-1/2 bg-white rounded-lg px-2 py-1 text-xs font-medium shadow-lg border whitespace-nowrap transition-opacity duration-200 ${
                              selectedOffice?.id === office.id ? 'opacity-100' : 'opacity-0 hover:opacity-100'
                            }`}
                          >
                            {office.city}
                            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white border-l border-t rotate-45"></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Connection Lines */}
                  <svg className="absolute inset-0 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                    {offices.slice(0, -1).map((office, index) => {
                      const nextOffice = offices[index + 1];
                      const x1 = ((office.coordinates.lng + 180) / 360) * 100;
                      const y1 = ((90 - office.coordinates.lat) / 180) * 100;
                      const x2 = ((nextOffice.coordinates.lng + 180) / 360) * 100;
                      const y2 = ((90 - nextOffice.coordinates.lat) / 180) * 100;
                      
                      return (
                        <line
                          key={`${office.id}-${nextOffice.id}`}
                          x1={Math.max(10, Math.min(90, x1))}
                          y1={Math.max(10, Math.min(90, y1))}
                          x2={Math.max(10, Math.min(90, x2))}
                          y2={Math.max(10, Math.min(90, y2))}
                          stroke="#3b82f6"
                          strokeWidth="0.2"
                          opacity="0.3"
                          strokeDasharray="1,1"
                        />
                      );
                    })}
                  </svg>
                </div>

                {/* Legend */}
                <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-3">
                  {Array.from(new Set(offices.map(o => o.type))).map(type => {
                    const office = offices.find(o => o.type === type);
                    return (
                      <div key={type} className="flex items-center gap-2 text-sm">
                        <div 
                          className="w-3 h-3 rounded-full border border-white shadow-sm"
                          style={{ backgroundColor: office?.color }}
                        />
                        <span className="text-muted-foreground">{typeLabels[type]}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Office Details Panel */}
          <div>
            <Card className="card-premium sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-primary" />
                  {selectedOffice ? 'تفاصيل المكتب' : 'اختر مكتب من الخريطة'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedOffice ? (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-bold text-lg mb-2">{selectedOffice.name}</h3>
                      <p className="text-muted-foreground text-sm mb-3">{selectedOffice.nameEn}</p>
                      <Badge
                        className="mb-3"
                        style={{ backgroundColor: selectedOffice.color, color: 'white' }}
                      >
                        {typeLabels[selectedOffice.type]}
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span>{selectedOffice.city}, {selectedOffice.country}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>تأسس في {selectedOffice.established}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span>{selectedOffice.employees} موظف</span>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">الخدمات:</h4>
                      <div className="flex flex-wrap gap-1">
                        {selectedOffice.services.map((service, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {selectedOffice.achievements && (
                      <div>
                        <h4 className="font-semibold mb-2">الإنجازات:</h4>
                        <div className="space-y-1">
                          {selectedOffice.achievements.map((achievement, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <Award className="w-3 h-3 text-warning" />
                              <span>{achievement}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="pt-4 border-t space-y-2">
                      <h4 className="font-semibold">معلومات الاتصال:</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <a href={`tel:${selectedOffice.contact.phone}`} className="hover:text-primary">
                            {selectedOffice.contact.phone}
                          </a>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          <a href={`mailto:${selectedOffice.contact.email}`} className="hover:text-primary">
                            {selectedOffice.contact.email}
                          </a>
                        </div>
                        <div className="flex items-center gap-2">
                          <Navigation className="w-4 h-4 text-muted-foreground" />
                          <a 
                            href={`https://maps.google.com/?q=${selectedOffice.coordinates.lat},${selectedOffice.coordinates.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-primary"
                          >
                            عرض في خرائط جوجل
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Globe className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>انقر على أي نقطة في الخريطة لعرض تفاصيل المكتب</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Offices List */}
        <div className="space-y-6">
          <h2 className="heading-modern">قائمة جميع المكاتب مرتبة حسب {sortBy === 'priority' ? 'الأهمية' : sortBy === 'established' ? 'تاريخ التأسيس' : 'عدد الموظفين'}</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {filteredOffices.map((office, index) => (
              <Card 
                key={office.id} 
                className={`card-premium cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
                  selectedOffice?.id === office.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedOffice(office)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">#{index + 1}</Badge>
                        <CardTitle className="text-lg">{office.name}</CardTitle>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{office.nameEn}</p>
                      <Badge
                        className="mb-2"
                        style={{ backgroundColor: office.color, color: 'white' }}
                      >
                        {typeLabels[office.type]}
                      </Badge>
                    </div>
                    <div 
                      className="w-4 h-4 rounded-full border-2 border-white shadow-md animate-pulse"
                      style={{ backgroundColor: office.color }}
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{office.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>تأسس {office.established}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span>{office.employees} موظف</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{office.city}, {office.country}</span>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <a 
                        href={`https://maps.google.com/?q=${office.coordinates.lat},${office.coordinates.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16 p-8 bg-gradient-primary rounded-2xl text-white">
          <h3 className="text-2xl font-bold mb-4">هل تريد الانضمام إلى فريقنا العالمي؟</h3>
          <p className="text-lg mb-6 opacity-90">
            نبحث عن المواهب المتميزة للانضمام إلى مكاتبنا حول العالم
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg" asChild>
              <a href="/jobs">
                تقدم للوظائف الشاغرة
              </a>
            </Button>
            <Button variant="outline" size="lg" className="bg-white/10 border-white/20 text-white hover:bg-white/20" asChild>
              <a href="/contact">
                تواصل معنا
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalPresence;