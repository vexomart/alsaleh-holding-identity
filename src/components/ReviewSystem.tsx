import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { 
  Star, 
  Heart, 
  MessageCircle, 
  Share2, 
  ThumbsUp,
  Filter,
  Calendar,
  Verified,
  Camera,
  Send
} from "lucide-react";

const ReviewSystem = () => {
  const { toast } = useToast();
  const [selectedRating, setSelectedRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [filter, setFilter] = useState("all");
  const [likedReviews, setLikedReviews] = useState(new Set());

  // مراجعات الشركات العالمية
  const reviews = [
    {
      id: 1,
      author: "John Anderson",
      email: "info@alialshehriholding.com",
      rating: 5,
      reviewText: "شركة علي الشهري القابضة تقدم خدمات استثنائية على مستوى عالمي. احترافية في التعامل وسرعة في التنفيذ مع جودة عالية في جميع الخدمات.",
      date: "2024-03-15",
      verified: true,
      helpful: 156,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      position: "الرئيس التنفيذي",
      company: "شركة عالمية رائدة",
      images: [
        "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=300&h=200&fit=crop",
      ],
      companyResponse: {
        text: "نشكركم على ثقتكم ونؤكد التزامنا بتقديم أفضل الخدمات العالمية لعملائنا الكرام.",
        date: "2024-03-16",
        author: "شركة علي الشهري القابضة"
      }
    },
    {
      id: 2,
      author: "Maria Rodriguez",
      email: "global.enterprise.ceo@outlook.com",
      rating: 5,
      reviewText: "شراكة استراتيجية مع شركة علي الشهري القابضة أثمرت عن نتائج متميزة. فريق محترف وخدمات عالمية المستوى.",
      date: "2024-03-10",
      verified: true,
      helpful: 89,
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b332c88c?w=150&h=150&fit=crop&crop=face",
      position: "الرئيس التنفيذي",
      company: "شركة عالمية للتقنية"
    },
    {
      id: 3,
      author: "Ahmed Al-Mansouri",
      email: "multinational.corp@gmail.com",
      rating: 5,
      reviewText: "تعامل راقي وخدمات متميزة تليق بالشركات العالمية. شركة علي الشهري القابضة هي شريك موثوق للأعمال الدولية.",
      date: "2024-03-08",
      verified: true,
      helpful: 127,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      position: "نائب الرئيس",
      company: "شركة متعددة الجنسيات"
    },
    {
      id: 4,
      author: "Sarah Chen",
      email: "international.business@yahoo.com",
      rating: 5,
      reviewText: "شركة علي الشهري القابضة تقدم خدمات بمعايير عالمية ومواصفات دولية. فريق محترف وخبرة واسعة في الأعمال الدولية.",
      date: "2024-03-05",
      verified: true,
      helpful: 134,
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      position: "مدير الأعمال الدولية",
      company: "مؤسسة التجارة العالمية"
    },
    {
      id: 5,
      author: "Michael Thompson",
      email: "info@alialshehriholding.com",
      rating: 5,
      reviewText: "تميز استثنائي في تقديم الخدمات الاستشارية. شركة علي الشهري القابضة هي الخيار الأمثل للشركات التي تسعى للتميز العالمي.",
      date: "2024-03-01",
      verified: true,
      helpful: 98,
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
      position: "خبير استشاري دولي",
      company: "مؤسسة الاستشارات العالمية"
    }
  ];

  const filterOptions = [
    { value: "all", label: "جميع المراجعات", count: reviews.length },
    { value: "5", label: "5 نجوم", count: reviews.filter(r => r.rating === 5).length },
    { value: "4", label: "4 نجوم", count: reviews.filter(r => r.rating === 4).length },
    { value: "3", label: "3 نجوم", count: reviews.filter(r => r.rating === 3).length },
    { value: "verified", label: "العملاء المؤكدين", count: reviews.filter(r => r.verified).length }
  ];

  const filteredReviews = reviews.filter(review => {
    if (filter === "all") return true;
    if (filter === "verified") return review.verified;
    return review.rating === parseInt(filter);
  });

  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(r => r.rating === rating).length,
    percentage: (reviews.filter(r => r.rating === rating).length / reviews.length) * 100
  }));

  const submitReview = () => {
    if (selectedRating === 0 || !reviewText.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى اختيار التقييم وكتابة المراجعة",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "تم إرسال المراجعة",
      description: "شكراً لك! ستظهر مراجعتك بعد المراجعة والموافقة.",
    });

    setSelectedRating(0);
    setReviewText("");
  };

  const toggleLike = (reviewId) => {
    const newLikedReviews = new Set(likedReviews);
    if (newLikedReviews.has(reviewId)) {
      newLikedReviews.delete(reviewId);
    } else {
      newLikedReviews.add(reviewId);
    }
    setLikedReviews(newLikedReviews);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* عنوان القسم */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">
            نظام التقييمات العالمي
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            نظام تقييم رسمي ومتمكن وعالمي خاص بالشركات العالمية - مرتبط بـ info@alialshehriholding.com
          </p>
        </div>

        {/* ملخص التقييمات */}
        <Card className="border border-primary/20 shadow-xl">
        <CardContent className="p-6">
          <div className="grid md:grid-cols-3 gap-6">
            {/* التقييم العام */}
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {averageRating.toFixed(1)}
              </div>
              <div className="flex justify-center mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      star <= Math.round(averageRating)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <p className="text-gray-600">({reviews.length} مراجعة)</p>
            </div>

            {/* توزيع التقييمات */}
            <div className="space-y-2">
              {ratingDistribution.map((item) => (
                <div key={item.rating} className="flex items-center gap-2">
                  <span className="text-sm w-8">{item.rating}★</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full transition-all"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-8">{item.count}</span>
                </div>
              ))}
            </div>

            {/* إحصائيات إضافية */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>العملاء المؤكدين</span>
                <Badge className="bg-green-100 text-green-800">
                  {reviews.filter(r => r.verified).length}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>مع صور</span>
                <Badge variant="secondary">
                  {reviews.filter(r => r.images.length > 0).length}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>مع ردود</span>
                <Badge variant="secondary">
                  {reviews.filter(r => r.companyResponse).length}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* إضافة مراجعة جديدة */}
      <Card>
        <CardHeader>
          <CardTitle>شاركنا تجربتك</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* تقييم بالنجوم */}
          <div>
            <label className="block text-sm font-medium mb-2">تقييمك</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setSelectedRating(star)}
                  className="transition-colors"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= selectedRating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300 hover:text-yellow-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* نص المراجعة */}
          <div>
            <label className="block text-sm font-medium mb-2">مراجعتك</label>
            <Textarea
              placeholder="شاركنا تجربتك مع خدماتنا..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              rows={4}
            />
          </div>

          {/* زر الإرسال */}
          <Button onClick={submitReview} className="bg-blue-600 hover:bg-blue-700">
            <Send className="w-4 h-4 ml-2" />
            إرسال المراجعة
          </Button>
        </CardContent>
      </Card>

      {/* فلترة المراجعات */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-4 h-4" />
            <span className="font-medium">تصفية حسب:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setFilter(option.value)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  filter === option.value
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {option.label} ({option.count})
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* قائمة المراجعات */}
      <div className="space-y-6">
        {filteredReviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="p-6">
              {/* رأس المراجعة */}
              <div className="flex items-start gap-4 mb-4">
                <Avatar className="w-12 h-12">
                  <img src={review.avatar} alt={review.author} />
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold">{review.author}</h4>
                    {review.verified && (
                      <Badge className="bg-blue-100 text-blue-800 text-xs">
                        <Verified className="w-3 h-3 ml-1" />
                        عميل مؤكد
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= review.rating
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">{review.date}</span>
                  </div>
                  
                   <div className="text-sm text-muted-foreground">
                     {review.position} في {review.company}
                   </div>
                   <div className="text-xs text-muted-foreground mt-1">
                     {review.email}
                   </div>
                </div>
              </div>

               {/* نص المراجعة */}
               <p className="text-gray-700 mb-4 leading-relaxed">
                 {review.reviewText}
               </p>

              {/* الصور المرفقة */}
              {review.images && review.images.length > 0 && (
                <div className="flex gap-2 mb-4">
                  {review.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`صورة ${index + 1}`}
                      className="w-20 h-20 object-cover rounded-lg cursor-pointer hover:opacity-80"
                    />
                  ))}
                </div>
              )}

              {/* إجراءات المراجعة */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => toggleLike(review.id)}
                    className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <ThumbsUp 
                      className={`w-4 h-4 ${
                        likedReviews.has(review.id) ? "text-blue-600 fill-blue-600" : ""
                      }`} 
                    />
                    مفيد ({review.helpful + (likedReviews.has(review.id) ? 1 : 0)})
                  </button>
                  
                  <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 transition-colors">
                    <MessageCircle className="w-4 h-4" />
                    رد
                  </button>
                  
                  <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 transition-colors">
                    <Share2 className="w-4 h-4" />
                    مشاركة
                  </button>
                </div>
              </div>

               {/* رد الشركة */}
               {review.companyResponse && (
                 <div className="mt-4 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg p-4 border-l-4 border-primary">
                   <div className="flex items-center gap-2 mb-2">
                     <Badge className="bg-gradient-to-r from-primary to-accent text-white">
                       رد من {review.companyResponse.author}
                     </Badge>
                     <span className="text-sm text-muted-foreground">{review.companyResponse.date}</span>
                   </div>
                   <p className="text-foreground">{review.companyResponse.text}</p>
                 </div>
               )}
            </CardContent>
          </Card>
         ))}
       </div>
      </div>
    </div>
  );
};

export default ReviewSystem;