import { SidebarLayout } from "@/components/SidebarLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Users, 
  Award, 
  Clock,
  BarChart3,
  Activity,
  Building2,
  Globe
} from "lucide-react";

const Dashboard = () => {
  const stats = [
    {
      title: "سنوات من الإبداع",
      value: "10+",
      description: "من الخبرة والتميز",
      icon: Clock,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "عميل سعيد",
      value: "14,883+",
      description: "بخدماتنا المميزة",
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "مشروع ناجح",
      value: "9,472+",
      description: "يفخر به فريقنا",
      icon: Award,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      title: "نمو متواصل",
      value: "98%",
      description: "معدل رضا العملاء",
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    }
  ];

  return (
    <SidebarLayout>
      <div className="p-6 space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">مرحباً بك في لوحة التحكم</h1>
              <p className="text-blue-100 text-lg">شركة علي صالح الشهري القابضة</p>
            </div>
            <div className="hidden md:block">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                <Building2 className="w-10 h-10 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </div>
                <p className="text-xs text-gray-500">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" />
                الأنشطة الحديثة
              </CardTitle>
              <CardDescription>آخر التحديثات والأنشطة</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { action: "تم إضافة مشروع جديد", time: "منذ ساعتين", status: "success" },
                  { action: "عميل جديد انضم للمنصة", time: "منذ 4 ساعات", status: "info" },
                  { action: "تم إكمال مشروع تقني", time: "أمس", status: "success" },
                  { action: "تحديث في الخدمات", time: "منذ يومين", status: "warning" }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                    <Badge 
                      variant={activity.status === "success" ? "default" : 
                             activity.status === "warning" ? "secondary" : "outline"}
                    >
                      {activity.status === "success" ? "مكتمل" : 
                       activity.status === "warning" ? "جديد" : "معلومات"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Performance Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-green-600" />
                نظرة على الأداء
              </CardTitle>
              <CardDescription>إحصائيات الأداء الشهرية</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { metric: "المشاريع المكتملة", value: "124", change: "+12%", trend: "up" },
                  { metric: "العملاء الجدد", value: "89", change: "+8%", trend: "up" },
                  { metric: "معدل الرضا", value: "98%", change: "+2%", trend: "up" },
                  { metric: "وقت الاستجابة", value: "2.1س", change: "-15%", trend: "down" }
                ].map((metric, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{metric.metric}</p>
                      <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                    </div>
                    <div className="text-left">
                      <Badge 
                        variant={metric.trend === "up" ? "default" : "secondary"}
                        className={metric.trend === "up" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                      >
                        {metric.change}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Global Presence Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-600" />
              انتشارنا العالمي
            </CardTitle>
            <CardDescription>نخدم عملاءنا في جميع أنحاء العالم</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { region: "المملكة العربية السعودية", clients: "12,450", growth: "+15%" },
                { region: "دول الخليج العربي", clients: "2,103", growth: "+22%" },
                { region: "الشرق الأوسط وشمال أفريقيا", clients: "330", growth: "+8%" }
              ].map((region, index) => (
                <div key={index} className="text-center p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl">
                  <h3 className="font-semibold text-gray-900 mb-2">{region.region}</h3>
                  <p className="text-3xl font-bold text-blue-600 mb-1">{region.clients}</p>
                  <p className="text-sm text-gray-600">عميل</p>
                  <Badge className="mt-2 bg-green-100 text-green-800">{region.growth}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </SidebarLayout>
  );
};

export default Dashboard;