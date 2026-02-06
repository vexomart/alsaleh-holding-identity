import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Code, 
  Zap, 
  Globe, 
  Smartphone, 
  Database, 
  Cloud, 
  Shield, 
  Search,
  Grid,
  List,
  ChevronRight,
  Calendar,
  Eye,
  Star,
  Clock,
  Users,
  CheckCircle,
  Sparkles,
  Rocket,
  TrendingUp,
  Target,
  Layers,
  Brain,
  ExternalLink
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { PageLayout } from "@/components/PageLayout";
import { motion } from "framer-motion";

const TechProjects = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const projects = [
    {
      id: 1,
      title: "نظام المحاسبة والفواتير",
      description: "نظام شامل لإدارة المحاسبة والفواتير مع تقارير مالية متطورة وإدارة العملاء",
      category: "web",
      status: "مكتمل",
      progress: 100,
      technologies: ["React", "Node.js", "PostgreSQL", "TypeScript"],
      startDate: "2025-07-23",
      estimatedCompletion: "2025-08-15",
      budget: "12,600 ريال",
      client: "داخلي - مبادرة الشركة",
      features: [
        "إدارة الفواتير والعروض",
        "تتبع المدفوعات والمستحقات",
        "تقارير مالية تفصيلية",
        "إدارة العملاء والموردين",
        "نظام الإشعارات الذكي"
      ],
      icon: Database,
      gradient: "from-emerald-500 to-teal-600"
    },
    {
      id: 2,
      title: "مساعد الذكاء الاصطناعي",
      description: "برنامج ذكاء اصطناعي متطور مصمم لخدمة العملاء مع إجابات فورية وذكية",
      category: "ai",
      status: "مكتمل",
      progress: 100,
      technologies: ["Python", "TensorFlow", "OpenAI API", "Node.js", "React", "WebSocket"],
      startDate: "2025-07-01",
      estimatedCompletion: "2025-07-29",
      budget: "7,000 ريال",
      client: "داخلي - مبادرة الشركة",
      features: [
        "إجابات فورية على استفسارات العملاء",
        "دعم اللغة العربية والإنجليزية",
        "تكامل مع قاعدة بيانات الشركة",
        "تعلم مستمر من التفاعلات"
      ],
      icon: Brain,
      gradient: "from-violet-500 to-purple-600"
    }
  ];

  const projectCategories = [
    { id: 'all', name: 'جميع المشاريع', count: projects.length, icon: Layers },
    { id: 'web', name: 'تطبيقات الويب', count: projects.filter(p => p.category === 'web').length, icon: Globe },
    { id: 'mobile', name: 'تطبيقات الهاتف', count: projects.filter(p => p.category === 'mobile').length, icon: Smartphone },
    { id: 'ai', name: 'الذكاء الاصطناعي', count: projects.filter(p => p.category === 'ai').length, icon: Brain },
    { id: 'cloud', name: 'الحوسبة السحابية', count: projects.filter(p => p.category === 'cloud').length, icon: Cloud },
    { id: 'security', name: 'الأمن السيبراني', count: projects.filter(p => p.category === 'security').length, icon: Shield }
  ];

  const stats = [
    { label: 'إجمالي المشاريع', value: projects.length.toString(), icon: Code, gradient: 'from-blue-500 to-cyan-500' },
    { label: 'المشاريع المكتملة', value: projects.filter(p => p.status === 'مكتمل').length.toString(), icon: CheckCircle, gradient: 'from-emerald-500 to-green-500' },
    { label: 'قيد التطوير', value: projects.filter(p => p.status === 'قيد التطوير').length.toString(), icon: Zap, gradient: 'from-amber-500 to-orange-500' },
    { label: 'معدل النجاح', value: '100%', icon: TrendingUp, gradient: 'from-violet-500 to-purple-500' }
  ];

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.includes(searchQuery) || project.description.includes(searchQuery);
    const matchesFilter = selectedFilter === 'all' || project.category === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-blue-500/5 to-violet-500/5" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-r from-violet-500/20 to-purple-500/20 rounded-full blur-3xl opacity-50" />
        
        <div className="container mx-auto px-6 relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-8">
            <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
              الرئيسية
            </Link>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <span className="text-foreground font-medium">المشاريع التقنية</span>
          </nav>

          <div className="max-w-4xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-4 bg-gradient-to-br from-primary to-blue-600 rounded-2xl shadow-lg shadow-primary/25">
                <Rocket className="w-10 h-10 text-white" />
              </div>
              <div>
                <Badge className="mb-2 bg-primary/10 text-primary border-primary/20">
                  <Sparkles className="w-3 h-3 ml-1" />
                  مشاريعنا التقنية
                </Badge>
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground via-primary to-blue-600 bg-clip-text text-transparent">
                  المشاريع التقنية
                </h1>
              </div>
            </div>
            
            <p className="text-xl text-muted-foreground leading-relaxed mb-10 max-w-2xl">
              استكشف مشاريعنا التقنية المبتكرة والحلول الرقمية المتطورة التي نبنيها بأحدث التقنيات العالمية
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group"
                  >
                    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-card/80 backdrop-blur-sm overflow-hidden">
                      <div className={`h-1 bg-gradient-to-r ${stat.gradient}`} />
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                            <IconComponent className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                            <div className="text-xs text-muted-foreground">{stat.label}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          {/* Search and Controls */}
          <div className="mb-10">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-6">
              {/* Search */}
              <div className="relative w-full lg:max-w-md">
                <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <input
                  type="text"
                  placeholder="ابحث في المشاريع..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-card border border-border rounded-2xl px-5 py-3.5 pr-12 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                />
              </div>

              {/* View Toggle */}
              <div className="flex items-center gap-2 p-1 bg-muted rounded-xl">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-lg"
                >
                  <Grid className="w-4 h-4 ml-1" />
                  شبكة
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-lg"
                >
                  <List className="w-4 h-4 ml-1" />
                  قائمة
                </Button>
              </div>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-3">
              {projectCategories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedFilter(category.id)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-medium transition-all duration-300 ${
                      selectedFilter === category.id
                        ? 'bg-gradient-to-r from-primary to-blue-600 text-white shadow-lg shadow-primary/25'
                        : 'bg-card text-muted-foreground hover:bg-accent hover:text-foreground border border-border'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    {category.name}
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      selectedFilter === category.id
                        ? 'bg-white/20 text-white'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {category.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Projects Display */}
          <div className="mb-16">
            {filteredProjects.length === 0 ? (
              /* Empty State */
              <Card className="border-dashed border-2 bg-card/50">
                <CardContent className="py-20 text-center">
                  <div className="max-w-md mx-auto">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Code className="w-10 h-10 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-3">
                      لا توجد مشاريع في هذه الفئة
                    </h3>
                    <p className="text-muted-foreground mb-8">
                      جرب اختيار فئة أخرى أو استخدم البحث للعثور على المشاريع
                    </p>
                    <Button onClick={() => setSelectedFilter('all')}>
                      عرض جميع المشاريع
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              /* Projects Grid */
              <div className={viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 gap-8' 
                : 'space-y-6'
              }>
                {filteredProjects.map((project, index) => {
                  const ProjectIcon = project.icon;
                  return (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.15 }}
                    >
                      <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-card">
                        {/* Top Gradient Bar */}
                        <div className={`h-2 bg-gradient-to-r ${project.gradient}`} />
                        
                        <CardHeader className="pb-4">
                          <div className="flex items-start justify-between mb-4">
                            {/* Icon & Badge */}
                            <div className="flex items-center gap-3">
                              <div className={`p-3 rounded-2xl bg-gradient-to-br ${project.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                <ProjectIcon className="w-6 h-6 text-white" />
                              </div>
                              <Badge 
                                className={`${
                                  project.status === 'قيد التطوير' 
                                    ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' 
                                    : 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                                } font-medium`}
                              >
                                <CheckCircle className="w-3 h-3 ml-1" />
                                {project.status}
                              </Badge>
                            </div>
                            
                            {/* Progress */}
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <div className="text-sm font-bold">{project.progress}%</div>
                              <div className="w-12 h-2 bg-muted rounded-full overflow-hidden">
                                <div 
                                  className={`h-full rounded-full bg-gradient-to-r ${project.gradient}`}
                                  style={{ width: `${project.progress}%` }}
                                />
                              </div>
                            </div>
                          </div>
                          
                          <CardTitle className="text-2xl text-foreground mb-3 group-hover:text-primary transition-colors">
                            {project.title}
                          </CardTitle>
                          
                          <CardDescription className="text-muted-foreground leading-relaxed text-base">
                            {project.description}
                          </CardDescription>
                        </CardHeader>
                        
                        <CardContent className="pt-0 space-y-6">
                          {/* Technologies */}
                          <div>
                            <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                              <Code className="w-4 h-4 text-primary" />
                              التقنيات المستخدمة
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {project.technologies.map((tech, techIndex) => (
                                <Badge 
                                  key={techIndex} 
                                  variant="secondary"
                                  className="bg-primary/5 text-primary border-primary/10 font-medium"
                                >
                                  {tech}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {/* Features Preview */}
                          <div>
                            <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                              <Star className="w-4 h-4 text-amber-500" />
                              أبرز المميزات
                            </h4>
                            <div className="grid grid-cols-2 gap-2">
                              {project.features.slice(0, 4).map((feature, featureIndex) => (
                                <div key={featureIndex} className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                                  <span className="truncate">{feature}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Timeline & Budget */}
                          <div className="flex items-center justify-between py-4 border-t border-border">
                            <div className="flex items-center gap-4 text-sm">
                              <div className="flex items-center gap-1.5 text-muted-foreground">
                                <Calendar className="w-4 h-4" />
                                <span>{project.startDate}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-muted-foreground">
                                <Target className="w-4 h-4" />
                                <span>{project.budget}</span>
                              </div>
                            </div>
                          </div>

                          {/* Action Button */}
                          <Link to={`/tech-projects/${project.id}`} className="block">
                            <Button 
                              size="lg"
                              className={`w-full bg-gradient-to-r ${project.gradient} hover:opacity-90 text-white shadow-lg group-hover:shadow-xl transition-all duration-300`}
                            >
                              <Eye className="w-4 h-4 ml-2" />
                              عرض تفاصيل المشروع
                              <ExternalLink className="w-4 h-4 mr-2" />
                            </Button>
                          </Link>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* CTA Section */}
          <Card className="border-0 bg-gradient-to-br from-primary/5 via-blue-500/5 to-violet-500/5 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-blue-500 to-violet-500" />
            <CardContent className="py-16 text-center relative">
              <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2" />
              <div className="absolute top-1/2 right-1/4 w-48 h-48 bg-violet-500/10 rounded-full blur-3xl -translate-y-1/2" />
              
              <div className="relative z-10 max-w-2xl mx-auto">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/25">
                  <Rocket className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-3xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent mb-4">
                  هل لديك فكرة مشروع تقني؟
                </h3>
                <p className="text-lg text-muted-foreground mb-8">
                  نحن نساعدك في تحويل أفكارك التقنية إلى واقع ملموس باستخدام أحدث التقنيات
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/consultation">
                    <Button size="lg" className="bg-gradient-to-r from-primary to-blue-600 hover:opacity-90 shadow-lg px-8">
                      <Sparkles className="w-5 h-5 ml-2" />
                      ابدأ مشروعك الآن
                    </Button>
                  </Link>
                  <Link to="/contact">
                    <Button size="lg" variant="outline" className="px-8">
                      تواصل معنا
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </PageLayout>
  );
};

export default TechProjects;
