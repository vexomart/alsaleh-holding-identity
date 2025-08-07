import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Search, 
  Calendar, 
  MapPin, 
  Car, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Phone,
  Mail,
  Navigation
} from "lucide-react";

const BookingTracker = () => {
  const { toast } = useToast();
  const [bookingId, setBookingId] = useState("");
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(false);

  // بيانات حجز تجريبية
  const mockBookings = {
    "CR2024001": {
      id: "CR2024001",
      status: "confirmed",
      statusText: "مؤكد",
      customerName: "أحمد محمد",
      carName: "تويوتا كامري 2024",
      carImage: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=300&h=200&fit=crop",
      pickupDate: "2024-08-15",
      returnDate: "2024-08-20",
      pickupLocation: "الرياض - المطار",
      returnLocation: "الرياض - المطار",
      totalAmount: 600,
      timeline: [
        { status: "booked", text: "تم إنشاء الحجز", date: "2024-08-10", completed: true },
        { status: "confirmed", text: "تم تأكيد الحجز", date: "2024-08-12", completed: true },
        { status: "pickup", text: "استلام السيارة", date: "2024-08-15", completed: false },
        { status: "return", text: "إرجاع السيارة", date: "2024-08-20", completed: false }
      ]
    },
    "CR2024002": {
      id: "CR2024002", 
      status: "in_progress",
      statusText: "قيد التنفيذ",
      customerName: "فاطمة السعيد",
      carName: "مرسيدس E-Class 2024",
      carImage: "https://images.unsplash.com/photo-1563720223185-11003d516935?w=300&h=200&fit=crop",
      pickupDate: "2024-08-08",
      returnDate: "2024-08-12",
      pickupLocation: "جدة - كورنيش",
      returnLocation: "جدة - المطار",
      totalAmount: 1400,
      timeline: [
        { status: "booked", text: "تم إنشاء الحجز", date: "2024-08-05", completed: true },
        { status: "confirmed", text: "تم تأكيد الحجز", date: "2024-08-06", completed: true },
        { status: "pickup", text: "استلام السيارة", date: "2024-08-08", completed: true },
        { status: "return", text: "إرجاع السيارة", date: "2024-08-12", completed: false }
      ]
    }
  };

  const searchBooking = () => {
    if (!bookingId) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال رقم الحجز",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    // محاكاة API call
    setTimeout(() => {
      const booking = mockBookings[bookingId];
      if (booking) {
        setBookingData(booking);
        toast({
          title: "تم العثور على الحجز",
          description: "تم تحميل بيانات الحجز بنجاح"
        });
      } else {
        toast({
          title: "لم يتم العثور على الحجز",
          description: "تأكد من صحة رقم الحجز",
          variant: "destructive"
        });
        setBookingData(null);
      }
      setLoading(false);
    }, 1000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed": return "bg-green-500";
      case "in_progress": return "bg-blue-500";
      case "completed": return "bg-gray-500";
      case "cancelled": return "bg-red-500";
      default: return "bg-gray-400";
    }
  };

  return (
    <div className="space-y-6">
      {/* بحث الحجز */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            تتبع حجزك
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="أدخل رقم الحجز (مثل: CR2024001)"
                value={bookingId}
                onChange={(e) => setBookingId(e.target.value.toUpperCase())}
              />
            </div>
            <Button 
              onClick={searchBooking} 
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? "جاري البحث..." : "بحث"}
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            جرب: CR2024001 أو CR2024002
          </p>
        </CardContent>
      </Card>

      {/* نتائج البحث */}
      {bookingData && (
        <div className="space-y-6">
          {/* معلومات الحجز الأساسية */}
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold mb-2">حجز رقم: {bookingData.id}</h3>
                  <Badge className={`${getStatusColor(bookingData.status)} text-white`}>
                    {bookingData.statusText}
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">{bookingData.totalAmount} ر.س</p>
                  <p className="text-sm text-gray-500">المبلغ الإجمالي</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* بيانات السيارة */}
                <div className="flex gap-4">
                  <img 
                    src={bookingData.carImage} 
                    alt={bookingData.carName}
                    className="w-20 h-16 object-cover rounded-lg"
                  />
                  <div>
                    <h4 className="font-semibold">{bookingData.carName}</h4>
                    <p className="text-sm text-gray-500">العميل: {bookingData.customerName}</p>
                  </div>
                </div>

                {/* تواريخ الحجز */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">الاستلام: {bookingData.pickupDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">الإرجاع: {bookingData.returnDate}</span>
                  </div>
                </div>
              </div>

              {/* مواقع الاستلام والإرجاع */}
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-green-500" />
                  <div>
                    <p className="text-sm font-medium">مكان الاستلام</p>
                    <p className="text-sm text-gray-600">{bookingData.pickupLocation}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-red-500" />
                  <div>
                    <p className="text-sm font-medium">مكان الإرجاع</p>
                    <p className="text-sm text-gray-600">{bookingData.returnLocation}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* تتبع مراحل الحجز */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                مراحل الحجز
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bookingData.timeline.map((step, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step.completed ? 'bg-green-500' : 'bg-gray-300'
                    }`}>
                      {step.completed ? (
                        <CheckCircle className="w-4 h-4 text-white" />
                      ) : (
                        <Clock className="w-4 h-4 text-gray-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium ${step.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                        {step.text}
                      </p>
                      <p className="text-sm text-gray-500">{step.date}</p>
                    </div>
                    {step.completed && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        مكتمل
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* إجراءات سريعة */}
          <div className="grid md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-16">
              <div className="text-center">
                <Phone className="w-5 h-5 mx-auto mb-1" />
                <span className="text-sm">اتصل بنا</span>
              </div>
            </Button>
            <Button variant="outline" className="h-16">
              <div className="text-center">
                <Mail className="w-5 h-5 mx-auto mb-1" />
                <span className="text-sm">راسلنا</span>
              </div>
            </Button>
            <Button variant="outline" className="h-16">
              <div className="text-center">
                <Navigation className="w-5 h-5 mx-auto mb-1" />
                <span className="text-sm">الموقع</span>
              </div>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingTracker;