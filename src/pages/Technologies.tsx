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
          <div className="grid gap-8 lg:gap-12">
            {technologySections.map((section, index) => {
              const IconComponent = section.icon;
              
              return (
                <div
                  key={index}
                  className="group animate-fade-in"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <Card className="overflow-hidden border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] hover-scale">
                    <CardHeader className={`bg-gradient-to-r ${section.bgColor} border-b border-slate-200/50 dark:border-slate-600/50 relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent group-hover:from-white/30 transition-all duration-500" />
                      <div className="flex items-center gap-4 relative z-10">
                        <div className={`p-4 rounded-xl bg-gradient-to-r ${section.color} text-white shadow-lg group-hover:scale-110 transition-transform duration-300 animate-scale-in`}>
                          <IconComponent className="w-7 h-7" />
                        </div>
                        <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-slate-800 dark:group-hover:text-slate-100 transition-colors">
                          {section.title}
                        </CardTitle>
                      </div>
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent rounded-full -translate-y-16 translate-x-16" />
                    </CardHeader>
                    
                    <CardContent className="p-8 relative">
                      {section.sections ? (
                        <div className="space-y-8">
                          {section.sections.map((subsection, subIndex) => {
                            const SubIcon = subsection.icon;
                            return (
                              <div 
                                key={subIndex}
                                className="animate-fade-in"
                                style={{ animationDelay: `${(index * 150) + (subIndex * 100)}ms` }}
                              >
                                <div className="flex items-center gap-3 mb-4">
                                  <div className={`p-2 rounded-lg bg-gradient-to-r ${section.color} text-white shadow-md`}>
                                    <SubIcon className="w-4 h-4" />
                                  </div>
                                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                                    {subsection.subtitle}
                                  </h3>
                                </div>
                                <div className="flex flex-wrap gap-3 mr-6">
                                  {subsection.technologies.map((tech, techIndex) => (
                                    <Badge 
                                      key={techIndex}
                                      variant="secondary"
                                      className={`text-sm py-2 px-4 bg-gradient-to-r ${section.bgColor} text-slate-700 dark:text-slate-300 border border-slate-200/50 dark:border-slate-600/50 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer hover-scale story-link`}
                                    >
                                      {tech}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-3">
                          {section.technologies?.map((tech, techIndex) => (
                            <Badge 
                              key={techIndex}
                              variant="secondary"
                              className={`text-sm py-2 px-4 bg-gradient-to-r ${section.bgColor} text-slate-700 dark:text-slate-300 border border-slate-200/50 dark:border-slate-600/50 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer hover-scale story-link animate-fade-in`}
                              style={{ animationDelay: `${(index * 150) + (techIndex * 50)}ms` }}
                            >
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      )}
                      
                      {/* Decorative elements */}
                      <div className="absolute bottom-4 right-4 w-16 h-16 bg-gradient-to-br from-white/5 to-transparent rounded-full" />
                      <div className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-br from-white/10 to-transparent rounded-full" />
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