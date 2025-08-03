import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Code, 
  Zap, 
  Globe, 
  Smartphone, 
  Database, 
  Cloud, 
  Shield, 
  Search,
  Filter,
  Grid,
  List,
  ChevronRight,
  Calendar,
  Eye,
  Star
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const TechProjects = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Empty projects array - will be populated later
  const projects: any[] = [];

  const projectCategories = [
    { id: 'all', name: 'جميع المشاريع', count: projects.length },
    { id: 'web', name: 'تطبيقات الويب', count: 0 },
    { id: 'mobile', name: 'تطبيقات الهاتف', count: 0 },
    { id: 'ai', name: 'الذكاء الاصطناعي', count: 0 },
    { id: 'cloud', name: 'الحوسبة السحابية', count: 0 },
    { id: 'security', name: 'الأمن السيبراني', count: 0 }
  ];

  const stats = [
    { label: 'إجمالي المشاريع', value: '0', icon: Code, color: 'text-blue-400' },
    { label: 'المشاريع النشطة', value: '0', icon: Zap, color: 'text-green-400' },
    { label: 'المشاريع المكتملة', value: '0', icon: Shield, color: 'text-purple-400' },
    { label: 'المشاريع قيد التطوير', value: '0', icon: Cloud, color: 'text-orange-400' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-b border-slate-700/50">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-l from-blue-500/10 to-purple-500/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-6 py-20 relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-8">
            <Link to="/" className="text-slate-400 hover:text-white transition-colors">
              الرئيسية
            </Link>
            <ChevronRight className="w-4 h-4 text-slate-500" />
            <span className="text-white font-medium">المشاريع التقنية</span>
          </nav>

          <div className="max-w-4xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl border border-blue-500/20">
                <Code className="w-8 h-8 text-blue-400" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                  المشاريع التقنية
                </h1>
                <p className="text-xl text-slate-300">
                  استكشف مشاريعنا التقنية المبتكرة والحلول الرقمية المتطورة
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <div 
                    key={index}
                    className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 backdrop-blur-sm"
                  >
                    <div className="flex items-center gap-3">
                      <IconComponent className={`w-5 h-5 ${stat.color}`} />
                      <div>
                        <div className="text-2xl font-bold text-white">{stat.value}</div>
                        <div className="text-xs text-slate-400">{stat.label}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        {/* Search and Filter Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="البحث في المشاريع..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 pr-10 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="p-2"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="p-2"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Filter Categories */}
          <div className="flex flex-wrap gap-2">
            {projectCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedFilter(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedFilter === category.id
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                    : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 border border-slate-700/50'
                }`}
              >
                {category.name}
                <span className="mr-2 text-xs opacity-70">({category.count})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Projects Section */}
        <div className="mb-12">
          {projects.length === 0 ? (
            /* Empty State */
            <div className="text-center py-20">
              <div className="max-w-md mx-auto">
                <div className="mb-6">
                  <div className="w-24 h-24 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-700/50">
                    <Code className="w-12 h-12 text-slate-400" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  لا توجد مشاريع تقنية حالياً
                </h3>
                <p className="text-slate-400 mb-8 leading-relaxed">
                  نحن نعمل على تطوير مشاريع تقنية مبتكرة. 
                  سيتم عرض المشاريع هنا فور الانتهاء من تطويرها.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                    <Eye className="w-4 h-4 mr-2" />
                    تابع التحديثات
                  </Button>
                  <Button variant="outline">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    العودة للرئيسية
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            /* Projects Grid/List - Will be used when projects are added */
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
              {/* Projects will be mapped here */}
            </div>
          )}
        </div>

        {/* Call to Action Section */}
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl p-8 border border-blue-500/20 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">
            هل لديك فكرة مشروع تقني؟
          </h3>
          <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
            نحن نساعدك في تحويل أفكارك التقنية إلى واقع. تواصل معنا لمناقشة مشروعك القادم.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
              ابدأ مشروعك الآن
            </Button>
            <Button variant="outline">
              تواصل معنا
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechProjects;