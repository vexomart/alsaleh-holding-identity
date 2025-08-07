import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { 
  Calendar,
  MapPin,
  Clock,
  Users,
  Car,
  CreditCard,
  Shield,
  CheckCircle,
  AlertCircle,
  FileText,
  Phone
} from "lucide-react";

const CarBooking = () => {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    // بيانات الحجز
    pickupDate: "",
    returnDate: "",
    pickupTime: "",
    returnTime: "",
    pickupLocation: "",
    returnLocation: "",
    carCategory: "",
    
    // بيانات العميل
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    customerAge: "",
    drivingLicense: "",
    licenseExpiry: "",
    nationality: "",
    
    // بيانات إضافية
    additionalServices: [],
    specialRequests: "",
    
    // شروط وأحكام
    termsAccepted: false,
    insuranceAccepted: false
  });

  const [selectedCar, setSelectedCar] = useState(null);
  const [totalCost, setTotalCost] = useState(0);

  const locations = [
    "الرياض - مطار الملك خالد الدولي",
    "الرياض - وسط المدينة",
    "الرياض - حي السليمانية",
    "جدة - مطار الملك عبدالعزيز الدولي",
    "جدة - كورنيش جدة",
    "جدة - حي الروضة",
    "الدمام - مطار الملك فهد الدولي",
    "الدمام - الواجهة البحرية",
    "الخبر - مجمع الراشد",
    "مكة المكرمة - المسجد الحرام",
    "المدينة المنورة - المسجد النبوي"
  ];

  const carCategories = [
    { id: "economy", name: "اقتصادية", price: 120, image: "🚗" },
    { id: "comfort", name: "كومفورت", price: 180, image: "🚙" },
    { id: "luxury", name: "فاخرة", price: 350, image: "🏎️" },
    { id: "suv", name: "SUV", price: 250, image: "🚙" },
    { id: "sports", name: "رياضية", price: 500, image: "🏁" }
  ];

  const additionalServices = [
    { id: "gps", name: "نظام GPS", price: 25 },
    { id: "childSeat", name: "مقعد أطفال", price: 30 },
    { id: "wifi", name: "واي فاي محمول", price: 20 },
    { id: "driver", name: "سائق خاص", price: 200 },
    { id: "delivery", name: "توصيل السيارة", price: 50 },
    { id: "fuel", name: "تعبئة الوقود", price: 100 }
  ];

  const timeSlots = [
    "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", 
    "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"
  ];

  const handleInputChange = (field, value) => {
    setBookingData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleServiceChange = (serviceId, checked) => {
    if (checked) {
      setBookingData(prev => ({
        ...prev,
        additionalServices: [...prev.additionalServices, serviceId]
      }));
    } else {
      setBookingData(prev => ({
        ...prev,
        additionalServices: prev.additionalServices.filter(id => id !== serviceId)
      }));
    }
  };

  const calculateTotal = () => {
    if (!bookingData.pickupDate || !bookingData.returnDate || !selectedCar) return 0;
    
    const startDate = new Date(bookingData.pickupDate);
    const endDate = new Date(bookingData.returnDate);
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    let total = selectedCar.price * days;
    
    // إضافة تكلفة الخدمات الإضافية
    bookingData.additionalServices.forEach(serviceId => {
      const service = additionalServices.find(s => s.id === serviceId);
      if (service) {
        total += service.price * days;
      }
    });
    
    return total;
  };

  const handleSubmit = () => {
    const total = calculateTotal();
    toast({
      title: "تم إرسال طلب الحجز",
      description: `المبلغ الإجمالي: ${total} ريال. سيتم التواصل معك قريباً لتأكيد الحجز.`,
    });
  };

  const nextStep = () => {
    if (step < 4) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const renderStepIndicator = () => (
    <div className="flex justify-center mb-8">
      <div className="flex items-center space-x-4">
        {[1, 2, 3, 4].map((stepNumber) => (
          <div key={stepNumber} className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              step >= stepNumber 
                ? 'bg-blue-600 text-white' 
                : 'bg-slate-200 text-slate-400'
            }`}>
              {stepNumber}
            </div>
            {stepNumber < 4 && (
              <div className={`w-12 h-1 ${
                step > stepNumber ? 'bg-blue-600' : 'bg-slate-200'
              }`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">حجز السيارة</h1>
            <p className="text-xl opacity-90">أكمل بياناتك لإتمام عملية الحجز</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {renderStepIndicator()}

        <div className="max-w-4xl mx-auto">
          {/* الخطوة 1: تفاصيل الحجز */}
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  تفاصيل الحجز
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label>تاريخ الاستلام</Label>
                      <Input
                        type="date"
                        value={bookingData.pickupDate}
                        onChange={(e) => handleInputChange('pickupDate', e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div>
                      <Label>وقت الاستلام</Label>
                      <Select value={bookingData.pickupTime} onValueChange={(value) => handleInputChange('pickupTime', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر الوقت" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots.map((time) => (
                            <SelectItem key={time} value={time}>{time}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>مكان الاستلام</Label>
                      <Select value={bookingData.pickupLocation} onValueChange={(value) => handleInputChange('pickupLocation', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر مكان الاستلام" />
                        </SelectTrigger>
                        <SelectContent>
                          {locations.map((location) => (
                            <SelectItem key={location} value={location}>{location}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label>تاريخ التسليم</Label>
                      <Input
                        type="date"
                        value={bookingData.returnDate}
                        onChange={(e) => handleInputChange('returnDate', e.target.value)}
                        min={bookingData.pickupDate || new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div>
                      <Label>وقت التسليم</Label>
                      <Select value={bookingData.returnTime} onValueChange={(value) => handleInputChange('returnTime', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر الوقت" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots.map((time) => (
                            <SelectItem key={time} value={time}>{time}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>مكان التسليم</Label>
                      <Select value={bookingData.returnLocation} onValueChange={(value) => handleInputChange('returnLocation', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر مكان التسليم" />
                        </SelectTrigger>
                        <SelectContent>
                          {locations.map((location) => (
                            <SelectItem key={location} value={location}>{location}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* اختيار نوع السيارة */}
                <div>
                  <Label className="text-lg mb-4 block">اختر نوع السيارة</Label>
                  <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {carCategories.map((category) => (
                      <Card 
                        key={category.id}
                        className={`cursor-pointer transition-all ${
                          selectedCar?.id === category.id ? 'ring-2 ring-blue-600 bg-blue-50' : 'hover:shadow-md'
                        }`}
                        onClick={() => setSelectedCar(category)}
                      >
                        <CardContent className="p-4 text-center">
                          <div className="text-3xl mb-2">{category.image}</div>
                          <h3 className="font-semibold mb-1">{category.name}</h3>
                          <p className="text-blue-600 font-bold">{category.price} ر.س/يوم</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={nextStep} disabled={!selectedCar || !bookingData.pickupDate || !bookingData.returnDate}>
                    التالي
                    <CheckCircle className="w-4 h-4 mr-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* الخطوة 2: بيانات العميل */}
          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  بيانات العميل
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label>الاسم الكامل *</Label>
                      <Input
                        value={bookingData.customerName}
                        onChange={(e) => handleInputChange('customerName', e.target.value)}
                        placeholder="أدخل الاسم الكامل"
                      />
                    </div>
                    <div>
                      <Label>رقم الجوال *</Label>
                      <Input
                        value={bookingData.customerPhone}
                        onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                        placeholder="05xxxxxxxx"
                      />
                    </div>
                    <div>
                      <Label>البريد الإلكتروني *</Label>
                      <Input
                        type="email"
                        value={bookingData.customerEmail}
                        onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                        placeholder="example@email.com"
                      />
                    </div>
                    <div>
                      <Label>العمر *</Label>
                      <Input
                        type="number"
                        value={bookingData.customerAge}
                        onChange={(e) => handleInputChange('customerAge', e.target.value)}
                        placeholder="يجب أن يكون 21 سنة أو أكثر"
                        min="21"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label>رقم رخصة القيادة *</Label>
                      <Input
                        value={bookingData.drivingLicense}
                        onChange={(e) => handleInputChange('drivingLicense', e.target.value)}
                        placeholder="رقم الرخصة"
                      />
                    </div>
                    <div>
                      <Label>تاريخ انتهاء الرخصة *</Label>
                      <Input
                        type="date"
                        value={bookingData.licenseExpiry}
                        onChange={(e) => handleInputChange('licenseExpiry', e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div>
                      <Label>الجنسية *</Label>
                      <Select value={bookingData.nationality} onValueChange={(value) => handleInputChange('nationality', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر الجنسية" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="saudi">سعودي</SelectItem>
                          <SelectItem value="gcc">خليجي</SelectItem>
                          <SelectItem value="expat">مقيم</SelectItem>
                          <SelectItem value="visitor">زائر</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-yellow-800 mb-2">متطلبات مهمة:</h4>
                      <ul className="text-sm text-yellow-700 space-y-1">
                        <li>• الحد الأدنى للعمر 21 سنة</li>
                        <li>• رخصة قيادة سارية المفعول</li>
                        <li>• بطاقة هوية سارية المفعول</li>
                        <li>• بطاقة ائتمانية للضمان</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={prevStep}>
                    السابق
                  </Button>
                  <Button onClick={nextStep} disabled={!bookingData.customerName || !bookingData.customerPhone || !bookingData.customerEmail}>
                    التالي
                    <CheckCircle className="w-4 h-4 mr-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* الخطوة 3: الخدمات الإضافية */}
          {step === 3 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="w-5 h-5" />
                  الخدمات الإضافية
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  {additionalServices.map((service) => (
                    <div key={service.id} className="flex items-center space-x-3 space-x-reverse p-4 border rounded-lg hover:bg-slate-50">
                      <Checkbox
                        id={service.id}
                        checked={bookingData.additionalServices.includes(service.id)}
                        onCheckedChange={(checked) => handleServiceChange(service.id, checked)}
                      />
                      <div className="flex-1">
                        <Label htmlFor={service.id} className="cursor-pointer">
                          {service.name}
                        </Label>
                        <p className="text-sm text-slate-600">{service.price} ر.س/يوم</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div>
                  <Label>طلبات خاصة</Label>
                  <Textarea
                    value={bookingData.specialRequests}
                    onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                    placeholder="أي طلبات أو ملاحظات خاصة..."
                    rows={4}
                  />
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={prevStep}>
                    السابق
                  </Button>
                  <Button onClick={nextStep}>
                    التالي
                    <CheckCircle className="w-4 h-4 mr-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* الخطوة 4: المراجعة والدفع */}
          {step === 4 && (
            <div className="space-y-6">
              {/* ملخص الحجز */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    ملخص الحجز
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">تفاصيل الحجز</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>السيارة:</span>
                          <span>{selectedCar?.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>من:</span>
                          <span>{bookingData.pickupDate} - {bookingData.pickupTime}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>إلى:</span>
                          <span>{bookingData.returnDate} - {bookingData.returnTime}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>مكان الاستلام:</span>
                          <span>{bookingData.pickupLocation}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-3">بيانات العميل</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>الاسم:</span>
                          <span>{bookingData.customerName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>الجوال:</span>
                          <span>{bookingData.customerPhone}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>البريد:</span>
                          <span>{bookingData.customerEmail}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* تفاصيل التكلفة */}
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-3">تفاصيل التكلفة</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>تأجير السيارة:</span>
                        <span>{selectedCar?.price} ر.س × {Math.ceil((new Date(bookingData.returnDate).getTime() - new Date(bookingData.pickupDate).getTime()) / (1000 * 60 * 60 * 24))} أيام</span>
                      </div>
                      {bookingData.additionalServices.map(serviceId => {
                        const service = additionalServices.find(s => s.id === serviceId);
                        return (
                          <div key={serviceId} className="flex justify-between text-sm">
                            <span>{service?.name}:</span>
                            <span>{service?.price} ر.س</span>
                          </div>
                        );
                      })}
                      <div className="border-t pt-2 flex justify-between font-bold text-lg">
                        <span>المجموع:</span>
                        <span>{calculateTotal()} ر.س</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* الشروط والأحكام */}
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3 space-x-reverse">
                      <Checkbox
                        id="terms"
                        checked={bookingData.termsAccepted}
                        onCheckedChange={(checked) => handleInputChange('termsAccepted', checked)}
                      />
                      <Label htmlFor="terms" className="text-sm cursor-pointer">
                        أوافق على <a href="#" className="text-blue-600 underline">الشروط والأحكام</a> وسياسة الخصوصية
                      </Label>
                    </div>
                    <div className="flex items-start space-x-3 space-x-reverse">
                      <Checkbox
                        id="insurance"
                        checked={bookingData.insuranceAccepted}
                        onCheckedChange={(checked) => handleInputChange('insuranceAccepted', checked)}
                      />
                      <Label htmlFor="insurance" className="text-sm cursor-pointer">
                        أوافق على شروط التأمين وأتحمل المسؤولية عن أي أضرار
                      </Label>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-between">
                <Button variant="outline" onClick={prevStep}>
                  السابق
                </Button>
                <Button 
                  onClick={handleSubmit}
                  disabled={!bookingData.termsAccepted || !bookingData.insuranceAccepted}
                  className="bg-gradient-to-r from-blue-600 to-purple-600"
                >
                  <CreditCard className="w-4 h-4 ml-2" />
                  تأكيد الحجز والدفع
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarBooking;