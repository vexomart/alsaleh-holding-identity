import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  Calendar, 
  Users, 
  Award, 
  Lightbulb, 
  Target,
  Clock,
  ChevronRight,
  Bell
} from "lucide-react";

const CompanyUpdates = () => {
  const updates = [
    {
      id: 1,
      title: "إطلاق منصة جديدة للذكاء الاصطناعي",
      description: "تم إطلاق منصة تقنية جديدة تعتمد على الذكاء الاصطناعي لتحسين خدماتنا وتوفير حلول مبتكرة لعملائنا",
      date: "2024-01-15",
      category: "تطوير المنتجات",
      type: "إنجاز",
      icon: Lightbulb,
      color: "bg-blue-500"
    },
    {
      id: 2,
      title: "توسيع الفريق التقني",
      description: "نرحب بانضمام 25 مطور ومهندس جديد إلى فريقنا التقني لتعزيز قدراتنا في التطوير والابتكار",
      date: "2024-01-10",
      category: "الموارد البشرية",
      type: "إعلان",
      icon: Users,
      color: "bg-green-500"
    },
    {
      id: 3,
      title: "حصول الشركة على شهادة الجودة ISO 27001",
      description: "حصلت الشركة على شهادة الجودة الدولية ISO 27001 في مجال أمن المعلومات وحماية البيانات",
      date: "2024-01-05",
      category: "جودة وأمان",
      type: "إنجاز",
      icon: Award,
      color: "bg-purple-500"
    },
    {
      id: 4,
      title: "إطلاق برنامج التدريب المهني الجديد",
      description: "أطلقت الشركة برنامج تدريب مهني شامل للخريجين الجدد في مجال تقنية المعلومات والبرمجة",
      date: "2023-12-28",
      category: "التدريب والتطوير",
      type: "برنامج",
      icon: Target,
      color: "bg-orange-500"
    },
    {
      id: 5,
      title: "افتتاح مكتب جديد في دبي",
      description: "تم افتتاح مكتب جديد للشركة في دبي لتوسيع نطاق خدماتنا في دولة الإمارات العربية المتحدة",
      date: "2023-12-20",
      category: "التوسع الجغرافي",
      type: "إعلان",
      icon: TrendingUp,
      color: "bg-red-500"
    },
    {
      id: 6,
      title: "تحديث نظام إدارة المشاريع الداخلي",
      description: "تم تحديث نظام إدارة المشاريع الداخلي بميزات جديدة لتحسين الإنتاجية وتتبع سير العمل",
      date: "2023-12-15",
      category: "التطوير الداخلي",
      type: "تحديث",
      icon: Clock,
      color: "bg-teal-500"
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case "إنجاز":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100";
      case "إعلان":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100";
      case "برنامج":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100";
      case "تحديث":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100";
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-100";
    }
  };

  return (
    <PageContainer>
      <PageHeader 
        title="تحديثات الشركة"
        description="آخر التطورات والإنجازات والتحديثات الداخلية للشركة"
      />

      <div className="space-y-8">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">إجمالي التحديثات</p>
                  <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">24</p>
                </div>
                <Bell className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 dark:text-green-400 text-sm font-medium">الإنجازات</p>
                  <p className="text-2xl font-bold text-green-700 dark:text-green-300">8</p>
                </div>
                <Award className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 dark:text-purple-400 text-sm font-medium">البرامج الجديدة</p>
                  <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">5</p>
                </div>
                <Target className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-600 dark:text-orange-400 text-sm font-medium">التحديثات التقنية</p>
                  <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">11</p>
                </div>
                <TrendingUp className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Updates List */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">آخر التحديثات</h2>
          
          <div className="grid gap-6">
            {updates.map((update) => {
              const IconComponent = update.icon;
              return (
                <Card key={update.id} className="group hover:shadow-lg transition-all duration-300 border-slate-200 dark:border-slate-800">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className={`p-2 rounded-lg ${update.color} bg-opacity-10`}>
                          <IconComponent className={`w-5 h-5 text-white`} style={{ color: update.color.replace('bg-', '').replace('-500', '') }} />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                            {update.title}
                          </CardTitle>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className={getTypeColor(update.type)}>
                              {update.type}
                            </Badge>
                            <span className="text-sm text-slate-500 dark:text-slate-400">{update.category}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">{new Date(update.date).toLocaleDateString('ar-SA')}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      {update.description}
                    </CardDescription>
                    <Button variant="ghost" className="mt-4 p-0 h-auto text-primary hover:text-primary/80">
                      قراءة المزيد
                      <ChevronRight className="w-4 h-4 mr-2" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Load More Button */}
        <div className="text-center">
          <Button size="lg" className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
            تحميل المزيد من التحديثات
            <ChevronRight className="w-4 h-4 mr-2" />
          </Button>
        </div>
      </div>
    </PageContainer>
  );
};

export default CompanyUpdates;