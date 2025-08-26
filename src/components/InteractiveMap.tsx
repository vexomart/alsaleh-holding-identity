import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Navigation, 
  Clock, 
  Phone, 
  Star,
  Car,
  Users,
  Shield
} from "lucide-react";

const InteractiveMap = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [hoveredLocation, setHoveredLocation] = useState(null);

  // مواقع الفروع مع تفاصيل كاملة
  const locations = [
    {
      id: 1,
      name: "فرع الرياض الرئيسي",
      address: "طريق الملك فهد، حي العليا",
      city: "الرياض",
      coordinates: { x: 45, y: 30 }, // نسبة موقع على الخريطة
      phone: "+966 11 123 4567",
      hours: "24/7",
      carsAvailable: 85,
      rating: 4.9,
      reviews: 234,
      features: ["مطار", "توصيل مجاني", "خدمة سريعة"],
      isMain: true,
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop"
    },
    {
      id: 2,
      name: "فرع مطار الملك خالد",
      address: "مطار الملك خالد الدولي",
      city: "الرياض",
      coordinates: { x: 52, y: 25 },
      phone: "+966 11 234 5678",
      hours: "24/7",
      carsAvailable: 120,
      rating: 4.8,
      reviews: 189,
      features: ["مطار", "استلام فوري", "مواقف مجانية"],
      isMain: false,
      image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=300&h=200&fit=crop"
    },
    {
      id: 3,
      name: "فرع جدة - الكورنيش",
      address: "كورنيش جدة، حي الشاطئ",
      city: "جدة",
      coordinates: { x: 25, y: 45 },
      phone: "+966 12 345 6789",
      hours: "6:00 - 00:00",
      carsAvailable: 67,
      rating: 4.7,
      reviews: 156,
      features: ["إطلالة بحرية", "سيارات فاخرة", "خدمة VIP"],
      isMain: false,
      image: "https://images.unsplash.com/photo-1564639883071-b3b6bb6e4498?w=300&h=200&fit=crop"
    },
    {
      id: 4,
      name: "فرع الدمام الواجهة",
      address: "الواجهة البحرية، الدمام",
      city: "الدمام",
      coordinates: { x: 75, y: 52 },
      phone: "+966 13 456 7890",
      hours: "7:00 - 23:00",
      carsAvailable: 43,
      rating: 4.6,
      reviews: 92,
      features: ["واجهة بحرية", "مواقف واسعة", "خدمة عائلات"],
      isMain: false,
      image: "https://images.unsplash.com/photo-1512733596533-7b00ccf8ebaf?w=300&h=200&fit=crop"
    },
    {
      id: 5,
      name: "فرع مكة المكرمة",
      address: "طريق المدينة المنورة",
      city: "مكة",
      coordinates: { x: 30, y: 65 },
      phone: "+966 12 567 8901",
      hours: "24/7",
      carsAvailable: 38,
      rating: 4.8,
      reviews: 127,
      features: ["قريب من الحرم", "خدمة حجاج", "أسعار خاصة"],
      isMain: false,
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop"
    }
  ];

  const [mapSize, setMapSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateSize = () => {
      const mapElement = document.getElementById('interactive-map');
      if (mapElement) {
        setMapSize({
          width: mapElement.offsetWidth,
          height: mapElement.offsetHeight
        });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return (
    <div className="space-y-6">
      {/* خريطة تفاعلية */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            مواقع فروعنا في المملكة
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div 
            id="interactive-map"
            className="relative h-96 bg-gradient-to-br from-blue-50 to-green-50 overflow-hidden rounded-lg"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23e0e7ff' fill-opacity='0.3'%3E%3Cpath d='M0 0h40v40H0V0zm10 10h20v20H10V10z'/%3E%3C/g%3E%3C/svg%3E")`,
            }}
          >
            {/* خلفية المملكة التقريبية */}
            <div className="absolute inset-0 flex items-center justify-center opacity-10">
              <div className="w-64 h-80 bg-gradient-to-b from-green-600 to-green-800 rounded-3xl transform rotate-12"></div>
            </div>

            {/* نقاط المواقع */}
            {locations.map((location) => (
              <div
                key={location.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                style={{
                  left: `${location.coordinates.x}%`,
                  top: `${location.coordinates.y}%`
                }}
                onMouseEnter={() => setHoveredLocation(location)}
                onMouseLeave={() => setHoveredLocation(null)}
                onClick={() => setSelectedLocation(location)}
              >
                {/* النقطة */}
                <div className={`relative z-10 w-4 h-4 rounded-full border-2 border-white shadow-lg transition-all duration-200 ${
                  location.isMain 
                    ? 'bg-red-500 scale-125' 
                    : hoveredLocation?.id === location.id || selectedLocation?.id === location.id
                      ? 'bg-blue-500 scale-150'
                      : 'bg-blue-400'
                }`}>
                  {/* تأثير النبض */}
                  <div className={`absolute inset-0 rounded-full animate-ping ${
                    location.isMain ? 'bg-red-400' : 'bg-blue-400'
                  } opacity-75`}></div>
                </div>

                {/* تسمية المدينة */}
                <div className="absolute top-6 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-slate-700 whitespace-nowrap bg-white/90 px-2 py-1 rounded shadow-sm">
                  {location.city}
                </div>

                {/* معلومات سريعة عند التحويم */}
                {hoveredLocation?.id === location.id && (
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white rounded-lg shadow-xl border p-3 w-48 z-20 animate-fade-in">
                    <h4 className="font-semibold text-sm mb-1">{location.name}</h4>
                    <p className="text-xs text-gray-600 mb-2">{location.address}</p>
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1">
                        <Car className="w-3 h-3" />
                        <span>{location.carsAvailable} سيارة</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-400" />
                        <span>{location.rating}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* خطوط الربط بين المدن الرئيسية */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <defs>
                <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.3" />
                </linearGradient>
              </defs>
              <path
                d={`M ${45 * mapSize.width / 100} ${30 * mapSize.height / 100} Q ${35 * mapSize.width / 100} ${37 * mapSize.height / 100} ${25 * mapSize.width / 100} ${45 * mapSize.height / 100}`}
                stroke="url(#pathGradient)"
                strokeWidth="2"
                fill="none"
                strokeDasharray="5,5"
                className="animate-pulse"
              />
            </svg>
          </div>
        </CardContent>
      </Card>

      {/* تفاصيل الموقع المحدد */}
      {selectedLocation && (
        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* صورة الفرع */}
              <div className="md:w-1/3">
                <img 
                  src={selectedLocation.image}
                  alt={selectedLocation.name}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>

              {/* معلومات الفرع */}
              <div className="md:w-2/3 space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold">{selectedLocation.name}</h3>
                    {selectedLocation.isMain && (
                      <Badge className="bg-red-500">الفرع الرئيسي</Badge>
                    )}
                  </div>
                  <p className="text-gray-600 flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {selectedLocation.address}
                  </p>
                </div>

                {/* إحصائيات الفرع */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Car className="w-4 h-4 text-blue-500" />
                      <span className="font-bold text-lg">{selectedLocation.carsAvailable}</span>
                    </div>
                    <p className="text-xs text-gray-500">سيارة متاحة</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="font-bold text-lg">{selectedLocation.rating}</span>
                    </div>
                    <p className="text-xs text-gray-500">التقييم</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Users className="w-4 h-4 text-green-500" />
                      <span className="font-bold text-lg">{selectedLocation.reviews}</span>
                    </div>
                    <p className="text-xs text-gray-500">مراجعة</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Clock className="w-4 h-4 text-purple-500" />
                      <span className="font-bold text-sm">{selectedLocation.hours}</span>
                    </div>
                    <p className="text-xs text-gray-500">ساعات العمل</p>
                  </div>
                </div>

                {/* مميزات الفرع */}
                <div>
                  <h4 className="font-semibold mb-2">مميزات الفرع:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedLocation.features.map((feature, index) => (
                      <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* أزرار الإجراءات */}
                <div className="flex gap-2 pt-2">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Car className="w-4 h-4 ml-1" />
                    احجز من هذا الفرع
                  </Button>
                  <Button variant="outline">
                    <Phone className="w-4 h-4 ml-1" />
                    {selectedLocation.phone}
                  </Button>
                  <Button variant="outline">
                    <Navigation className="w-4 h-4 ml-1" />
                    الاتجاهات
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* قائمة سريعة بجميع الفروع */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {locations.map((location) => (
          <Card 
            key={location.id} 
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedLocation?.id === location.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
            }`}
            onClick={() => setSelectedLocation(location)}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${location.isMain ? 'bg-red-500' : 'bg-blue-500'}`}></div>
                <div className="flex-1">
                  <h4 className="font-semibold text-sm">{location.city}</h4>
                  <p className="text-xs text-gray-500">{location.carsAvailable} سيارة متاحة</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-400" />
                    <span className="text-sm font-medium">{location.rating}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default InteractiveMap;