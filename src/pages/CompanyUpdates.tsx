import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Calendar, 
  Users, 
  Award, 
  Lightbulb, 
  Target,
  Clock,
  Bell,
  Building2,
  Settings,
  Globe
} from "lucide-react";

const CompanyUpdates = () => {
  const updates: any[] = [];

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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "عالية":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100";
      case "متوسطة":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100";
      case "منخفضة":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100";
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

      <div className="container mx-auto px-4 lg:px-6 space-y-8">
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

        {/* Updates Table */}
        <Card className="shadow-lg border-slate-200 dark:border-slate-800">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                    <th className="text-right p-4 font-semibold text-slate-900 dark:text-slate-100">التحديث</th>
                    <th className="text-center p-4 font-semibold text-slate-900 dark:text-slate-100">النوع</th>
                    <th className="text-center p-4 font-semibold text-slate-900 dark:text-slate-100">الفئة</th>
                    <th className="text-center p-4 font-semibold text-slate-900 dark:text-slate-100">الأولوية</th>
                    <th className="text-center p-4 font-semibold text-slate-900 dark:text-slate-100">التاريخ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {updates.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-12 text-center">
                        <div className="flex flex-col items-center justify-center space-y-4">
                          <Bell className="w-16 h-16 text-slate-300 dark:text-slate-600" />
                          <div>
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                              لا توجد تحديثات حالياً
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400 text-sm">
                              سيتم عرض التحديثات الجديدة هنا عند توفرها
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    updates.map((update) => {
                      const IconComponent = update.icon;
                      return (
                        <tr 
                          key={update.id} 
                          className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-200"
                        >
                          <td className="p-4">
                            <div className="flex items-start gap-4">
                              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                <IconComponent className="w-5 h-5 text-primary" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                                  {update.title}
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                                  {update.description}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-center">
                            <Badge variant="outline" className={getTypeColor(update.type)}>
                              {update.type}
                            </Badge>
                          </td>
                          <td className="p-4 text-center">
                            <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                              {update.category}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <Badge variant="outline" className={getPriorityColor(update.priority)}>
                              {update.priority}
                            </Badge>
                          </td>
                          <td className="p-4 text-center">
                            <div className="flex items-center justify-center gap-2 text-slate-500 dark:text-slate-400">
                              <Calendar className="w-4 h-4" />
                              <span className="text-sm font-medium">
                                {new Date(update.date).toLocaleDateString('ar-SA')}
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};

export default CompanyUpdates;