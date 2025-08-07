import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Car,
  Calendar,
  MapPin,
  Clock,
  Users,
  Shield,
  Star,
  CheckCircle,
  CreditCard,
  Phone,
  Mail,
  ChevronRight,
  Filter,
  Search
} from "lucide-react";

const CarFleet = () => {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [bookingData, setBookingData] = useState({
    pickupDate: "",
    returnDate: "",
    pickupLocation: "",
    carId: "",
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    drivingLicense: "",
    notes: ""
  });

  const carFleet = [
    {
      id: 1,
      name: "تويوتا كامري 2024",
      category: "economy",
      price: 120,
      image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      features: ["تكييف", "أوتوماتيك", "4 مقاعد", "GPS"],
      fuel: "بنزين",
      transmission: "أوتوماتيك",
      seats: 5,
      rating: 4.8,
      available: true,
      specs: {
        engine: "2.5L",
        consumption: "7.5L/100km",
        bags: 3
      }
    },
    {
      id: 2,
      name: "مرسيدس E-Class 2024",
      category: "luxury",
      price: 350,
      image: "https://images.unsplash.com/photo-1563720223185-11003d516935?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      features: ["تكييف", "أوتوماتيك", "جلد", "نظام صوتي متقدم"],
      fuel: "بنزين",
      transmission: "أوتوماتيك",
      seats: 5,
      rating: 4.9,
      available: true,
      specs: {
        engine: "3.0L",
        consumption: "9.2L/100km",
        bags: 4
      }
    },
    {
      id: 3,
      name: "BMW X5 2024",
      category: "suv",
      price: 280,
      image: "https://images.unsplash.com/photo-1594736797933-d0ce6979bd84?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      features: ["دفع رباعي", "تكييف خلفي", "مقاعد جلد", "شاشة كبيرة"],
      fuel: "بنزين",
      transmission: "أوتوماتيك",
      seats: 7,
      rating: 4.7,
      available: true,
      specs: {
        engine: "3.0L",
        consumption: "10.5L/100km",
        bags: 5
      }
    },
    {
      id: 4,
      name: "مازدا CX-5 2024",
      category: "suv",
      price: 200,
      image: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      features: ["دفع أمامي", "تكييف", "بلوتوث", "كاميرا خلفية"],
      fuel: "بنزين",
      transmission: "أوتوماتيك",
      seats: 5,
      rating: 4.6,
      available: true,
      specs: {
        engine: "2.5L",
        consumption: "8.1L/100km",
        bags: 4
      }
    },
    {
      id: 5,
      name: "BMW M3 2024",
      category: "sports",
      price: 500,
      image: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      features: ["رياضية", "محرك قوي", "تحكم رياضي", "صوت عالي"],
      fuel: "بنزين",
      transmission: "أوتوماتيك",
      seats: 4,
      rating: 4.9,
      available: false,
      specs: {
        engine: "3.0L Twin Turbo",
        consumption: "11.2L/100km",
        bags: 2
      }
    },
    {
      id: 6,
      name: "هيونداي إلنترا 2024",
      category: "economy",
      price: 110,
      image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      features: ["اقتصادية", "تكييف", "راديو", "أمان عالي"],
      fuel: "بنزين",
      transmission: "أوتوماتيك",
      seats: 5,
      rating: 4.5,
      available: true,
      specs: {
        engine: "2.0L",
        consumption: "6.8L/100km",
        bags: 3
      }
    }
  ];

  const categories = [
    { id: "all", name: "جميع السيارات", count: carFleet.length },
    { id: "economy", name: "اقتصادية", count: carFleet.filter(car => car.category === "economy").length },
    { id: "luxury", name: "فاخرة", count: carFleet.filter(car => car.category === "luxury").length },
    { id: "suv", name: "SUV", count: carFleet.filter(car => car.category === "suv").length },
    { id: "sports", name: "رياضية", count: carFleet.filter(car => car.category === "sports").length }
  ];

  const filteredCars = carFleet.filter(car => {
    const categoryMatch = selectedCategory === "all" || car.category === selectedCategory;
    const searchMatch = car.name.toLowerCase().includes(searchTerm.toLowerCase());
    return categoryMatch && searchMatch;
  });

  const handleBooking = (carId: number) => {
    setBookingData({ ...bookingData, carId: carId.toString() });
    // هنا يمكن فتح نموذج الحجز أو الانتقال لصفحة الحجز
    toast({
      title: "بدء عملية الحجز",
      description: "سيتم نقلك إلى صفحة إتمام الحجز",
    });
  };

  const locations = [
    "الرياض - المطار",
    "الرياض - وسط المدينة",
    "جدة - المطار",
    "جدة - كورنيش",
    "الدمام - المطار",
    "الدمام - الواجهة البحرية"
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">أسطول السيارات</h1>
            <p className="text-xl opacity-90">اختر السيارة المثالية لرحلتك</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  البحث والتصفية
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Search */}
                <div>
                  <Label>البحث عن سيارة</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <Input
                      placeholder="اسم السيارة..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <Label className="mb-3 block">نوع السيارة</Label>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`w-full text-right p-3 rounded-lg transition-colors ${
                          selectedCategory === category.id
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span>{category.name}</span>
                          <Badge variant="secondary">{category.count}</Badge>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick Booking */}
                <div className="pt-4 border-t">
                  <Label className="mb-3 block">حجز سريع</Label>
                  <div className="space-y-3">
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="مكان الاستلام" />
                      </SelectTrigger>
                      <SelectContent>
                        {locations.map((location) => (
                          <SelectItem key={location} value={location}>
                            {location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input type="date" placeholder="تاريخ الاستلام" />
                    <Input type="date" placeholder="تاريخ التسليم" />
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600">
                      <Calendar className="w-4 h-4 ml-2" />
                      ابحث عن السيارات
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Cars Grid */}
          <div className="lg:col-span-3">
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-900">
                السيارات المتاحة ({filteredCars.length})
              </h2>
              <Select defaultValue="price-low">
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="ترتيب حسب" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price-low">السعر: منخفض إلى عالي</SelectItem>
                  <SelectItem value="price-high">السعر: عالي إلى منخفض</SelectItem>
                  <SelectItem value="rating">التقييم</SelectItem>
                  <SelectItem value="newest">الأحدث</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCars.map((car) => (
                <Card key={car.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <div className="relative">
                    <img 
                      src={car.image} 
                      alt={car.name}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4">
                      {car.available ? (
                        <Badge className="bg-green-500">متاح</Badge>
                      ) : (
                        <Badge variant="destructive">غير متاح</Badge>
                      )}
                    </div>
                    <div className="absolute top-4 left-4">
                      <div className="flex items-center gap-1 bg-white/90 rounded-full px-2 py-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                        <span className="text-xs font-medium">{car.rating}</span>
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-slate-900 mb-2">{car.name}</h3>
                      <div className="text-2xl font-bold text-blue-600">
                        {car.price} ر.س
                        <span className="text-sm text-slate-500 font-normal">/يوم</span>
                      </div>
                    </div>

                    {/* Car Specs */}
                    <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                      <div className="text-center">
                        <Users className="w-4 h-4 mx-auto mb-1 text-slate-400" />
                        <div className="text-slate-600">{car.seats} مقاعد</div>
                      </div>
                      <div className="text-center">
                        <Car className="w-4 h-4 mx-auto mb-1 text-slate-400" />
                        <div className="text-slate-600">{car.transmission}</div>
                      </div>
                      <div className="text-center">
                        <Shield className="w-4 h-4 mx-auto mb-1 text-slate-400" />
                        <div className="text-slate-600">{car.fuel}</div>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {car.features.slice(0, 3).map((feature, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                        {car.features.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{car.features.length - 3} المزيد
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Additional Specs */}
                    <div className="text-xs text-slate-500 mb-4 space-y-1">
                      <div>المحرك: {car.specs.engine}</div>
                      <div>الاستهلاك: {car.specs.consumption}</div>
                      <div>الحقائب: {car.specs.bags} حقائب</div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2">
                      <Button 
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-105 transition-transform"
                        onClick={() => handleBooking(car.id)}
                        disabled={!car.available}
                      >
                        {car.available ? (
                          <>
                            <Calendar className="w-4 h-4 ml-2" />
                            احجز الآن
                          </>
                        ) : (
                          "غير متاح حالياً"
                        )}
                      </Button>
                      <Button variant="outline" className="w-full">
                        <Phone className="w-4 h-4 ml-2" />
                        استفسار
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredCars.length === 0 && (
              <div className="text-center py-12">
                <Car className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  لا توجد سيارات متاحة
                </h3>
                <p className="text-slate-600">
                  جرب تعديل معايير البحث للعثور على سيارات أخرى
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarFleet;