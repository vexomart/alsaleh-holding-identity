import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle,
  Clock,
  Eye,
  Banknote,
  Settings,
  Rocket,
  Heart,
  Share2
} from "lucide-react";

interface ProductCardProps {
  product: any;
  index: number;
  isProductLoading: boolean;
  onPurchase: (product: any) => void;
}

export const ProductCard = ({ product, index, isProductLoading, onPurchase }: ProductCardProps) => {
  const IconComponent = product.icon;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "متاح الآن":
        return "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg";
      case "تحت التطوير":
        return "bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg";
      case "قريباً":
        return "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg";
      default:
        return "bg-gradient-to-r from-gray-500 to-slate-500 text-white shadow-lg";
    }
  };

  const getStatusEmoji = (status: string) => {
    switch (status) {
      case "متاح الآن":
        return "✅";
      case "تحت التطوير":
        return "🚧";
      case "قريباً":
        return "🔜";
      default:
        return "⏳";
    }
  };

  return (
    <Card 
      className={`group hover:shadow-2xl transition-all duration-500 hover:scale-105 border-2 rounded-3xl overflow-hidden bg-gradient-to-br from-white/90 to-slate-50/90 dark:from-slate-900/90 dark:to-slate-800/90 backdrop-blur-xl animate-fade-in ${
        product.isFeatured ? 'ring-4 ring-primary/20' : ''
      }`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {product.isExclusive && (
        <div className="absolute top-4 left-4 z-10">
          <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-xl font-bold shadow-lg animate-pulse">
            👑 حصري
          </Badge>
        </div>
      )}
      
      {product.discount && (
        <div className="absolute top-4 right-4 z-10">
          <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-xl font-bold shadow-lg animate-bounce">
            🔥 خصم {product.discount}
          </Badge>
        </div>
      )}

      <CardHeader className="relative pb-4">
        <div className={`w-20 h-20 bg-gradient-to-r ${product.color} rounded-3xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-2xl mx-auto animate-bounce`}>
          <span className="text-3xl">{product.emoji}</span>
          <IconComponent className="w-8 h-8 text-white absolute" />
        </div>
        <CardTitle className="text-xl font-bold text-center group-hover:text-primary transition-colors duration-300">
          {product.name}
        </CardTitle>
        <CardDescription className="text-center text-slate-600 dark:text-slate-400 leading-relaxed">
          {product.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-0 space-y-6">
        {/* Features */}
        <div className="space-y-2">
          <h4 className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500 animate-pulse" />
            ✨ المميزات الحصرية:
          </h4>
          <ul className="space-y-1 text-sm">
            {product.features.slice(0, 4).map((feature: string, idx: number) => (
              <li key={idx} className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Price & Delivery */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl font-bold text-primary">{product.price}</span>
              {product.originalPrice && (
                <span className="text-lg text-slate-400 line-through">{product.originalPrice}</span>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <Clock className="w-4 h-4 text-blue-500 animate-pulse" />
              <span>🚚 التسليم: {product.estimatedDelivery}</span>
            </div>
          </div>
          <Badge className={`${getStatusColor(product.status)} px-3 py-1 rounded-xl font-bold animate-pulse`}>
            <span className="mr-1">{getStatusEmoji(product.status)}</span>
            {product.status}
          </Badge>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {product.tags.slice(0, 3).map((tag: string, idx: number) => (
            <Badge key={idx} variant="outline" className="text-xs px-2 py-1 rounded-lg bg-primary/5 border-primary/20 text-primary hover:bg-primary/10 transition-colors duration-300">
              #{tag}
            </Badge>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-2 pt-4">
          {product.demoUrl !== "#" && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => window.open(product.demoUrl, '_blank')}
              className="w-full sm:flex-1 rounded-xl font-bold hover:bg-primary/5 hover:border-primary/30 transition-all duration-300 hover:scale-105 py-3"
            >
              <Eye className="w-4 h-4 ml-1 animate-pulse" />
              👁️ معاينة مباشرة
            </Button>
          )}
          
          <Button 
            size="sm" 
            onClick={() => onPurchase(product)}
            disabled={product.status === "تحت التطوير" || isProductLoading}
            className={`w-full sm:flex-1 rounded-xl font-bold transition-all duration-300 hover:scale-105 py-3 ${
              product.status === "متاح الآن" 
                ? "bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 shadow-2xl text-white" 
                : product.status === "قريباً"
                ? "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 shadow-2xl text-white"
                : "opacity-50 cursor-not-allowed bg-gray-400"
            }`}
          >
            {isProductLoading ? (
              <>
                <Clock className="w-4 h-4 ml-1 animate-spin" />
                ⏳ جاري المعالجة...
              </>
            ) : (
              <>
                {product.status === "متاح الآن" && (
                  <>
                    <Banknote className="w-4 h-4 ml-1 animate-bounce" />
                    💰 ادفع الآن
                  </>
                )}
                {product.status === "قريباً" && (
                  <>
                    <Clock className="w-4 h-4 ml-1 animate-pulse" />
                    🔜 قريباً
                  </>
                )}
                {product.status === "تحت التطوير" && (
                  <>
                    <Settings className="w-4 h-4 ml-1 animate-spin" />
                    🚧 تحت التطوير
                  </>
                )}
              </>
            )}
          </Button>
        </div>

        {/* Delivery Info */}
        <div className="flex items-center justify-between text-xs text-slate-500 border-t pt-3 mt-3">
          <span className="flex items-center gap-1">
            <Rocket className="w-3 h-3 animate-pulse" />
            🚀 التسليم السريع
          </span>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-1 hover:text-primary transition-colors">
              <Heart className="w-3 h-3" />
              <span>❤️</span>
            </button>
            <button className="flex items-center gap-1 hover:text-primary transition-colors">
              <Share2 className="w-3 h-3" />
              <span>🔗</span>
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};