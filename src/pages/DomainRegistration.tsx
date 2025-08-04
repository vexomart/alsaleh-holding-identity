import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Globe, Shield, Clock, ExternalLink, Check } from "lucide-react";
import { toast } from "sonner";

const DomainRegistration = () => {
  const [searchDomain, setSearchDomain] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const domainExtensions = [
    { ext: ".com", price: "50 ريال/سنة", popular: true },
    { ext: ".net", price: "45 ريال/سنة", popular: false },
    { ext: ".org", price: "40 ريال/سنة", popular: false },
    { ext: ".info", price: "35 ريال/سنة", popular: false },
    { ext: ".sa", price: "150 ريال/سنة", popular: true },
    { ext: ".com.sa", price: "120 ريال/سنة", popular: false },
  ];

  const features = [
    { icon: Shield, title: "حماية متقدمة", description: "حماية من التصيد الإلكتروني والبرمجيات الخبيثة" },
    { icon: Clock, title: "تفعيل فوري", description: "تفعيل النطاق خلال دقائق من التسجيل" },
    { icon: Globe, title: "إدارة سهلة", description: "لوحة تحكم سهلة الاستخدام لإدارة نطاقاتك" },
  ];

  const handleSearch = async () => {
    if (!searchDomain.trim()) {
      toast.error("يرجى إدخال اسم النطاق");
      return;
    }

    setIsSearching(true);
    
    // محاكاة البحث - في التطبيق الحقيقي ستتصل بـ API
    setTimeout(() => {
      const results = domainExtensions.map(ext => ({
        domain: searchDomain + ext.ext,
        available: Math.random() > 0.5,
        price: ext.price,
        popular: ext.popular
      }));
      setSearchResults(results);
      setIsSearching(false);
    }, 2000);
  };

  const handleRegister = (domain: string) => {
    // ربط مع Namecheap
    const namecheapUrl = `https://www.namecheap.com/domains/registration/results/?domain=${encodeURIComponent(domain)}`;
    window.open(namecheapUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-6 py-20">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            تسجيل النطاقات
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            احجز نطاقك المثالي واحصل على هوية رقمية قوية لموقعك أو نشاطك التجاري
          </p>
          
          {/* Search Section */}
          <div className="max-w-2xl mx-auto">
            <div className="flex gap-4 mb-6">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="ابحث عن النطاق المطلوب (مثال: mywebsite)"
                  value={searchDomain}
                  onChange={(e) => setSearchDomain(e.target.value)}
                  className="h-12 text-lg"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <Button 
                onClick={handleSearch}
                disabled={isSearching}
                size="lg"
                className="h-12 px-8"
              >
                {isSearching ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    جاري البحث...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5 mr-2" />
                    بحث
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              نتائج البحث لـ "{searchDomain}"
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {searchResults.map((result, index) => (
                <Card key={index} className={`relative ${result.popular ? 'ring-2 ring-blue-500' : ''}`}>
                  {result.popular && (
                    <Badge className="absolute -top-2 right-4 bg-blue-600">
                      الأكثر شيوعاً
                    </Badge>
                  )}
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="w-5 h-5 text-blue-600" />
                      {result.domain}
                    </CardTitle>
                    <CardDescription className="text-lg font-semibold text-green-600">
                      {result.price}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {result.available ? (
                          <>
                            <Check className="w-5 h-5 text-green-500" />
                            <span className="text-green-600 font-medium">متاح</span>
                          </>
                        ) : (
                          <>
                            <span className="w-5 h-5 text-red-500">✗</span>
                            <span className="text-red-600 font-medium">غير متاح</span>
                          </>
                        )}
                      </div>
                      {result.available && (
                        <Button 
                          size="sm"
                          onClick={() => handleRegister(result.domain)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          سجل الآن
                          <ExternalLink className="w-4 h-4 mr-2" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Features Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            لماذا تختار خدماتنا؟
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Popular Extensions */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            أسعار امتدادات النطاقات
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-4xl mx-auto">
            {domainExtensions.map((ext, index) => (
              <Card key={index} className={`text-center ${ext.popular ? 'ring-2 ring-blue-500' : ''}`}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{ext.ext}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-blue-600 font-semibold">{ext.price}</p>
                  {ext.popular && (
                    <Badge variant="secondary" className="mt-2">شائع</Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-12">
            <Button 
              size="lg"
              onClick={() => window.open('https://www.namecheap.com', '_blank')}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              تصفح جميع الامتدادات على Namecheap
              <ExternalLink className="w-5 h-5 mr-2" />
            </Button>
          </div>
        </div>

        {/* Contact Section */}
        <div className="text-center mt-16 bg-gray-50 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            هل تحتاج مساعدة؟
          </h3>
          <p className="text-gray-600 mb-6">
            فريقنا جاهز لمساعدتك في اختيار النطاق المناسب وإعداده
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="outline">
              <a href="tel:+966555812567">
                اتصل بنا: +966 555 812 567
              </a>
            </Button>
            <Button asChild>
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

export default DomainRegistration;