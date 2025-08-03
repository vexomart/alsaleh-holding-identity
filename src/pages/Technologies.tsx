import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { 
  Code2, 
  Globe, 
  Smartphone, 
  Monitor, 
  Database, 
  Server, 
  Brain, 
  Cloud, 
  Settings,
  Zap,
  Coffee,
  Layers,
  Cpu,
  HardDrive,
  Activity,
  BarChart3,
  Shield,
  GitBranch,
  Eye,
  TestTube,
  Gauge,
  Workflow
} from "lucide-react";

const Technologies = () => {
  const technologySections = [
    {
      title: "الويب",
      icon: Globe,
      color: "from-blue-500 to-cyan-500",
      bgColor: "from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20",
      sections: [
        {
          subtitle: "برامج الواجهة الخلفية (BACK END)",
          icon: Server,
          technologies: ["Microsoft .NET", "Java", "Python", "Node.js", "PHP", "C++", "Go"]
        },
        {
          subtitle: "برامج الواجهة الأمامية (FRONT END)",
          icon: Layers,
          technologies: ["HTML5", "CSS", "JavaScript", "Angular", "React JS", "MeteorJS", "Vue.js", "Ember.js"]
        }
      ]
    },
    {
      title: "الجوال",
      icon: Smartphone,
      color: "from-purple-500 to-pink-500",
      bgColor: "from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20",
      technologies: ["iOS", "Android", "Xamarin", "Apache Cordova", "Progressive Web Apps", "React Native", "Flutter"]
    },
    {
      title: "سطح المكتب",
      icon: Monitor,
      color: "from-emerald-500 to-teal-500",
      bgColor: "from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20",
      technologies: ["C++", "Qt", "C#", "Python", "Objective-C", "Swift"]
    },
    {
      title: "الأنظمة الأساسية",
      icon: Settings,
      color: "from-orange-500 to-red-500",
      bgColor: "from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20",
      technologies: ["Microsoft Dynamics 365", "Salesforce", "Adobe Commerce", "SharePoint", "ServiceNow", "Power BI", "SAP"]
    },
    {
      title: "قواعد البيانات / مخازن البيانات",
      icon: Database,
      color: "from-indigo-500 to-blue-500",
      bgColor: "from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20",
      technologies: [
        "Microsoft SQL Server", "MySQL", "Oracle", "PostgreSQL", 
        "Azure Synapse Analytics", "Azure SQL Database", "Amazon RDS", 
        "Amazon S3", "GCP SQL"
      ]
    },
    {
      title: "البيانات الضخمة",
      icon: HardDrive,
      color: "from-violet-500 to-purple-500",
      bgColor: "from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20",
      technologies: [
        "Apache Hadoop", "Apache Spark", "Apache Cassandra", "Apache Kafka",
        "Apache Hive", "Apache ZooKeeper", "Apache HBase", "Azure Cosmos DB",
        "Azure Blob Storage", "Azure Data Lake"
      ]
    },
    {
      title: "تعلم الآلة",
      icon: Brain,
      color: "from-pink-500 to-rose-500",
      bgColor: "from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20",
      sections: [
        {
          subtitle: "لغات الترجمة",
          icon: Coffee,
          technologies: ["Matlab", "GNU Octave", "R"]
        },
        {
          subtitle: "أُطر العمل (FRAMEWORKS)",
          icon: Cpu,
          technologies: [
            "Apache Mahout", "Caffe", "Apache MXNet", "TensorFlow", 
            "Keras", "Torch", "OpenCV 2.x, 3.x", "Theano"
          ]
        },
        {
          subtitle: "المكتبات",
          icon: Activity,
          technologies: ["Apache Spark MLlib", "Scikit Learn", "Gensim", "SpaCy"]
        },
        {
          subtitle: "الخوادم السحابية",
          icon: Cloud,
          technologies: [
            "Amazon Machine Learning", "Amazon SageMaker", 
            "Azure Machine Learning", "Google Cloud AI Platform"
          ]
        }
      ]
    },
    {
      title: "نماذج ديف أوبس (DevOps)",
      icon: Zap,
      color: "from-yellow-500 to-orange-500",
      bgColor: "from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20",
      sections: [
        {
          subtitle: "تعبئة الحاويات",
          icon: Layers,
          technologies: ["Docker", "Kubernetes", "Red Hat OpenShift", "Apache Mesos"]
        },
        {
          subtitle: "الأتمتة",
          icon: Workflow,
          technologies: [
            "Ansible", "Puppet", "Chef", "Saltstack", 
            "HashiCorp Terraform", "HashiCorp Packer"
          ]
        },
        {
          subtitle: "أدوات التكامل المستمر (CI)/النشر المستمر (CD)",
          icon: GitBranch,
          technologies: [
            "AWS Developer Tools", "Azure DevOps", "Google Developer Tools",
            "GitLab CI/CD", "Jenkins", "TeamCity"
          ]
        },
        {
          subtitle: "المراقبة",
          icon: Eye,
          technologies: [
            "Zabbix", "Nagios", "Elasticsearch", "Prometheus", "Grafana", "Datadog"
          ]
        },
        {
          subtitle: "أدوات أتمتة الاختبار",
          icon: TestTube,
          technologies: [
            "Selenium", "Appium", "Protractor", "fMBT", "XCTest", "TestStack WHITE",
            "Cuit", "Ranorex", "Postman", "Apache JMeter", "HP QuickTest Professional",
            "Unified Functional Testing"
          ]
        }
      ]
    },
    {
      title: "الخدمات السحابية",
      icon: Cloud,
      color: "from-sky-500 to-blue-500",
      bgColor: "from-sky-50 to-blue-50 dark:from-sky-900/20 dark:to-blue-900/20",
      technologies: [
        "Amazon Web Services", "Microsoft Azure", "Google Cloud Platform", 
        "DigitalOcean", "Rackspace Technology"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10" />
        <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-56 h-56 bg-gradient-to-br from-indigo-400/20 to-cyan-400/20 rounded-full blur-2xl" />
        
        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full border border-blue-500/20 mb-8">
            <Code2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <span className="text-lg font-semibold text-blue-800 dark:text-blue-300">التقنيات والأنظمة</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6">
            التقنيات والأنظمة الأساسية
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              التي نعمل معها
            </span>
          </h1>
          
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            نحن نعمل مع أحدث التقنيات والأنظمة الأساسية لتقديم حلول متطورة ومبتكرة تلبي احتياجات عملائنا في العصر الرقمي
          </p>
        </div>
      </section>

      {/* Technologies Sections */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid gap-12 lg:gap-16">
            {technologySections.map((section, index) => {
              const IconComponent = section.icon;
              
              return (
                <div
                  key={index}
                  className="group animate-fade-in"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <Card className="overflow-hidden border-0 shadow-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl hover:shadow-3xl transition-all duration-700 hover:scale-[1.01] relative">
                    {/* Decorative background pattern */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-slate-100/5" />
                    <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl -translate-y-20 translate-x-20" />
                    
                    <CardHeader className={`bg-gradient-to-r ${section.bgColor} border-b border-slate-200/30 dark:border-slate-600/30 relative overflow-hidden py-8`}>
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/10 to-transparent group-hover:from-white/30 transition-all duration-700" />
                      <div className="flex items-center gap-6 relative z-10">
                        <div className={`p-5 rounded-2xl bg-gradient-to-r ${section.color} text-white shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 animate-scale-in`}>
                          <IconComponent className="w-8 h-8" />
                        </div>
                        <div>
                          <CardTitle className="text-3xl font-bold text-slate-900 dark:text-white group-hover:text-slate-800 dark:group-hover:text-slate-100 transition-colors mb-2">
                            {section.title}
                          </CardTitle>
                          <div className={`h-1 w-20 bg-gradient-to-r ${section.color} rounded-full`} />
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="p-10 relative">
                      {section.sections ? (
                        <div className="space-y-12">
                          {section.sections.map((subsection, subIndex) => {
                            const SubIcon = subsection.icon;
                            return (
                              <div 
                                key={subIndex}
                                className="animate-fade-in"
                                style={{ animationDelay: `${(index * 200) + (subIndex * 150)}ms` }}
                              >
                                <div className="flex items-center gap-4 mb-6">
                                  <div className={`p-3 rounded-xl bg-gradient-to-r ${section.color} text-white shadow-lg hover:scale-110 transition-transform duration-300`}>
                                    <SubIcon className="w-5 h-5" />
                                  </div>
                                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">
                                    {subsection.subtitle}
                                  </h3>
                                </div>
                                
                                {/* Grid layout for technology badges */}
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mr-8">
                                  {subsection.technologies.map((tech, techIndex) => (
                                    <div
                                      key={techIndex}
                                      className="group/tech animate-fade-in hover-scale"
                                      style={{ animationDelay: `${(index * 200) + (subIndex * 150) + (techIndex * 100)}ms` }}
                                    >
                                      <div className={`relative p-4 rounded-xl bg-gradient-to-br ${section.bgColor} border border-slate-200/50 dark:border-slate-600/30 hover:shadow-xl hover:scale-105 transition-all duration-400 cursor-pointer overflow-hidden`}>
                                        {/* Tech icon placeholder */}
                                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${section.color} mb-3 flex items-center justify-center`}>
                                          <Code2 className="w-4 h-4 text-white" />
                                        </div>
                                        
                                        <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 leading-tight">
                                          {tech}
                                        </div>
                                        
                                        {/* Hover effect overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/20 opacity-0 group-hover/tech:opacity-100 transition-opacity duration-300" />
                                        
                                        {/* Decorative corner */}
                                        <div className="absolute top-0 right-0 w-6 h-6 bg-gradient-to-br from-white/20 to-transparent rounded-bl-lg" />
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                          {section.technologies?.map((tech, techIndex) => (
                            <div
                              key={techIndex}
                              className="group/tech animate-fade-in hover-scale"
                              style={{ animationDelay: `${(index * 200) + (techIndex * 100)}ms` }}
                            >
                              <div className={`relative p-4 rounded-xl bg-gradient-to-br ${section.bgColor} border border-slate-200/50 dark:border-slate-600/30 hover:shadow-xl hover:scale-105 transition-all duration-400 cursor-pointer overflow-hidden`}>
                                {/* Tech icon placeholder */}
                                <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${section.color} mb-3 flex items-center justify-center`}>
                                  <IconComponent className="w-4 h-4 text-white" />
                                </div>
                                
                                <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 leading-tight">
                                  {tech}
                                </div>
                                
                                {/* Hover effect overlay */}
                                <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/20 opacity-0 group-hover/tech:opacity-100 transition-opacity duration-300" />
                                
                                {/* Decorative corner */}
                                <div className="absolute top-0 right-0 w-6 h-6 bg-gradient-to-br from-white/20 to-transparent rounded-bl-lg" />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {/* Decorative elements */}
                      <div className="absolute bottom-6 right-6 w-24 h-24 bg-gradient-to-br from-white/5 to-transparent rounded-full" />
                      <div className="absolute top-6 right-6 w-12 h-12 bg-gradient-to-br from-white/10 to-transparent rounded-full" />
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Technologies;