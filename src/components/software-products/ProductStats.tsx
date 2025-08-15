import { Card, CardContent } from "@/components/ui/card";
import { Package, Zap } from "lucide-react";

interface ProductStatsProps {
  products: any[];
}

export const ProductStats = ({ products }: ProductStatsProps) => {
  const stats = [
    {
      title: "إجمالي المنتجات",
      value: `${products.length}`,
      icon: Package,
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20",
      borderColor: "border-blue-200 dark:border-blue-800",
      textColor: "text-blue-600 dark:text-blue-400",
      valueColor: "text-blue-700 dark:text-blue-300",
      emoji: "📦"
    },
    {
      title: "المنتجات المتاحة",
      value: `${products.filter(p => p.status === "متاح الآن").length}`,
      icon: Zap,
      color: "from-green-500 to-green-600",
      bgColor: "from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20",
      borderColor: "border-green-200 dark:border-green-800",
      textColor: "text-green-600 dark:text-green-400",
      valueColor: "text-green-700 dark:text-green-300",
      emoji: "⚡"
    },
    {
      title: "منتجات حصرية",
      value: `${products.filter(p => p.isExclusive).length}`,
      icon: Package,
      color: "from-purple-500 to-purple-600",
      bgColor: "from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20",
      borderColor: "border-purple-200 dark:border-purple-800",
      textColor: "text-purple-600 dark:text-purple-400",
      valueColor: "text-purple-700 dark:text-purple-300",
      emoji: "👑"
    },
    {
      title: "منتجات مميزة",
      value: `${products.filter(p => p.isFeatured).length}`,
      icon: Zap,
      color: "from-orange-500 to-orange-600",
      bgColor: "from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20",
      borderColor: "border-orange-200 dark:border-orange-800",
      textColor: "text-orange-600 dark:text-orange-400",
      valueColor: "text-orange-700 dark:text-orange-300",
      emoji: "⭐"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <Card 
            key={index}
            className={`${stat.bgColor} ${stat.borderColor} hover:shadow-2xl transition-all duration-500 hover:scale-105 group animate-fade-in border-2 backdrop-blur-sm`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`${stat.textColor} text-sm font-medium mb-2 flex items-center gap-1`}>
                    <span className="text-lg">{stat.emoji}</span>
                    {stat.title}
                  </p>
                  <p className={`${stat.valueColor} text-3xl font-bold animate-pulse`}>
                    {stat.value}
                  </p>
                </div>
                <div className={`w-14 h-14 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-2xl animate-bounce`}>
                  <IconComponent className="w-7 h-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};