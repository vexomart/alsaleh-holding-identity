import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Globe, Shield, Clock, Check, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface DomainResult {
  domain: string;
  available: boolean;
  price: number;
  extension: string;
}

interface DomainPrice {
  extension: string;
  price: number;
  is_popular: boolean;
}

const DomainRegistration = () => {
  const [searchDomain, setSearchDomain] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<DomainResult[]>([]);
  const [domainPrices, setDomainPrices] = useState<DomainPrice[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<DomainResult | null>(null);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    notes: "",
    period: 1,
    autoRenew: false
  });

  const features = [
    { icon: Shield, title: "حماية متقدمة", description: "حماية من التصيد الإلكتروني والبرمجيات الخبيثة" },
    { icon: Clock, title: "تفعيل فوري", description: "تفعيل النطاق خلال دقائق من الموافقة" },
    { icon: Globe, title: "إدارة سهلة", description: "لوحة تحكم سهلة الاستخدام لإدارة نطاقاتك" },
  ];

  useEffect(() => {
    fetchDomainPrices();
  }, []);

  const fetchDomainPrices = async () => {
    try {
      const response = await fetch(`https://ibfcgweykqkzdodrfmci.supabase.co/functions/v1/domain-management`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'get_prices' })
      });

      const data = await response.json();
      if (data.prices) {
        setDomainPrices(data.prices);
      }
    } catch (error) {
      console.error('Error fetching domain prices:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchDomain.trim()) {
      toast.error("يرجى إدخال اسم النطاق");
      return;
    }

    setIsSearching(true);
    
    try {
      const results: DomainResult[] = [];
      
      // Check each extension
      for (const priceData of domainPrices) {
        const response = await fetch(`https://ibfcgweykqkzdodrfmci.supabase.co/functions/v1/domain-management`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            action: 'check_availability',
            domain: searchDomain,
            extension: priceData.extension
          })
        });

        const data = await response.json();
        results.push({
          domain: data.domain,
          available: data.available,
          price: data.price,
          extension: priceData.extension
        });
      }
      
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching domains:', error);
      toast.error("حدث خطأ أثناء البحث");
    } finally {
      setIsSearching(false);
    }
  };

  const handleDomainRequest = (domain: DomainResult) => {
    setSelectedDomain(domain);
    setShowRequestForm(true);
  };

  const submitDomainRequest = async () => {
    if (!selectedDomain || !formData.name || !formData.email) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch(`https://ibfcgweykqkzdodrfmci.supabase.co/functions/v1/domain-management`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          action: 'submit_request',
          domain: selectedDomain.domain.replace(selectedDomain.extension, ''),
          extension: selectedDomain.extension,
          customerData: formData
        })
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success(data.message);
        setShowRequestForm(false);
        setFormData({
          name: "",
          email: "",
          phone: "",
          company: "",
          notes: "",
          period: 1,
          autoRenew: false
        });
      } else {
        throw new Error(data.error || 'فشل في إرسال الطلب');
      }
    } catch (error) {
      console.error('Error submitting request:', error);
      toast.error("حدث خطأ أثناء إرسال الطلب");
    } finally {
      setIsSubmitting(false);
    }
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
              {searchResults.map((result, index) => {
                const priceData = domainPrices.find(p => p.extension === result.extension);
                return (
                  <Card key={index} className={`relative ${priceData?.is_popular ? 'ring-2 ring-blue-500' : ''}`}>
                    {priceData?.is_popular && (
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
                        {result.price} ريال/سنة
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
                              <X className="w-5 h-5 text-red-500" />
                              <span className="text-red-600 font-medium">غير متاح</span>
                            </>
                          )}
                        </div>
                        {result.available && (
                          <Button 
                            size="sm"
                            onClick={() => handleDomainRequest(result)}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            طلب النطاق
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Domain Request Form Dialog */}
        <Dialog open={showRequestForm} onOpenChange={setShowRequestForm}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>طلب تسجيل نطاق</DialogTitle>
              <DialogDescription>
                {selectedDomain && `نطاق: ${selectedDomain.domain} - ${selectedDomain.price} ريال/سنة`}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">الاسم الكامل *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="أدخل اسمك الكامل"
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">البريد الإلكتروني *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="example@domain.com"
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone">رقم الهاتف</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="+966 5xxxxxxxx"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="company">اسم الشركة (اختياري)</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                    placeholder="اسم الشركة"
                  />
                </div>
                
                <div>
                  <Label htmlFor="period">مدة التسجيل</Label>
                  <Select value={formData.period.toString()} onValueChange={(value) => setFormData({...formData, period: parseInt(value)})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">سنة واحدة</SelectItem>
                      <SelectItem value="2">سنتان</SelectItem>
                      <SelectItem value="3">3 سنوات</SelectItem>
                      <SelectItem value="5">5 سنوات</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="autoRenew"
                    checked={formData.autoRenew}
                    onCheckedChange={(checked) => setFormData({...formData, autoRenew: checked})}
                  />
                  <Label htmlFor="autoRenew">التجديد التلقائي</Label>
                </div>
              </div>
              
              <div className="md:col-span-2">
                <Label htmlFor="notes">ملاحظات إضافية</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="أي ملاحظات أو طلبات خاصة..."
                  rows={3}
                />
              </div>
            </div>
            
            <div className="flex gap-4 pt-4">
              <Button 
                onClick={submitDomainRequest}
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    جاري الإرسال...
                  </>
                ) : (
                  'إرسال الطلب'
                )}
              </Button>
              <Button variant="outline" onClick={() => setShowRequestForm(false)}>
                إلغاء
              </Button>
            </div>
          </DialogContent>
        </Dialog>

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
            {domainPrices.map((ext, index) => (
              <Card key={index} className={`text-center ${ext.is_popular ? 'ring-2 ring-blue-500' : ''}`}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{ext.extension}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-blue-600 font-semibold">{ext.price} ريال/سنة</p>
                  {ext.is_popular && (
                    <Badge variant="secondary" className="mt-2">شائع</Badge>
                  )}
                </CardContent>
              </Card>
            ))}
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
              <a href="mailto:info@alialshehriholding.com">
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