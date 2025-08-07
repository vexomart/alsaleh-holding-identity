import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Code, 
  Database, 
  Smartphone, 
  Monitor, 
  Shield, 
  Cloud,
  Layers,
  Zap,
  Download,
  Star,
  Users,
  Globe,
  ChevronRight,
  Package,
  Rocket
} from "lucide-react";

const SoftwareProducts = () => {
  const products: any[] = [];

  const categories = ["جميع المنتجات"];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "متاح الآن":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100";
      case "تحت التطوير":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100";
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-100";
    }
  };

  return (
    <PageContainer>
      <PageHeader 
        title="منتجاتنا البرمجية"
        description="مجموعة من الحلول البرمجية المتطورة التي تلبي احتياجات الأعمال المختلفة"
      />

      <div className="container mx-auto px-4 lg:px-6 space-y-8">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">إجمالي المنتجات</p>
                  <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">0</p>
                </div>
                <Package className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 dark:text-green-400 text-sm font-medium">المنتجات المتاحة</p>
                  <p className="text-2xl font-bold text-green-700 dark:text-green-300">0</p>
                </div>
                <Zap className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 dark:text-purple-400 text-sm font-medium">إجمالي التحميلات</p>
                  <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">0</p>
                </div>
                <Download className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-600 dark:text-orange-400 text-sm font-medium">متوسط التقييم</p>
                  <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">0</p>
                </div>
                <Star className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Products Grid */}
          <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/20 dark:to-slate-800/20 border-slate-200 dark:border-slate-800">
            <CardContent className="p-12 text-center">
              <div className="flex flex-col items-center justify-center space-y-4">
                <Package className="w-16 h-16 text-slate-300 dark:text-slate-600" />
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                    لا توجد منتجات برمجية حالياً
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    نحن نعمل على تطوير منتجات برمجية مبتكرة. سيتم عرضها هنا قريباً
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-primary/10 via-blue-50 to-indigo-50 dark:from-primary/20 dark:via-slate-800 dark:to-slate-900 border-primary/20">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              هل تحتاج حلول برمجية مخصصة؟
            </h3>
            <p className="text-slate-600 dark:text-slate-300 mb-6 max-w-2xl mx-auto">
              نحن نقدم خدمات تطوير برمجيات مخصصة لتلبية احتياجات عملك الفريدة
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-primary to-primary/80">
                طلب استشارة مجانية
                <ChevronRight className="w-4 h-4 mr-2" />
              </Button>
              <Button size="lg" variant="outline">
                تواصل مع فريق التطوير
                <Code className="w-4 h-4 mr-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};

export default SoftwareProducts;