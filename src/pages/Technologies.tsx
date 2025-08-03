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
  Zap
} from "lucide-react";

const Technologies = () => {
  const technologySections = [
    {
      title: "الويب",
      icon: Globe,
      sections: [
        {
          subtitle: "برامج الواجهة الخلفية (BACK END)",
          technologies: ["Microsoft .NET", "Java", "Python", "Node.js", "PHP", "C++", "Go"]
        },
        {
          subtitle: "برامج الواجهة الأمامية (FRONT END)",
          technologies: ["HTML5", "CSS", "JavaScript", "Angular", "React JS", "MeteorJS", "Vue.js", "Ember.js"]
        }
      ]
    },
    {
      title: "الجوال",
      icon: Smartphone,
      technologies: ["iOS", "Android", "Xamarin", "Apache Cordova", "Progressive Web Apps", "React Native", "Flutter"]
    },
    {
      title: "سطح المكتب",
      icon: Monitor,
      technologies: ["C++", "Qt", "C#", "Python", "Objective-C", "Swift"]
    },
    {
      title: "الأنظمة الأساسية",
      icon: Settings,
      technologies: ["Microsoft Dynamics 365", "Salesforce", "Adobe Commerce", "SharePoint", "ServiceNow", "Power BI", "SAP"]
    },
    {
      title: "قواعد البيانات / مخازن البيانات",
      icon: Database,
      technologies: [
        "Microsoft SQL Server", "MySQL", "Oracle", "PostgreSQL", 
        "Azure Synapse Analytics", "Azure SQL Database", "Amazon RDS", 
        "Amazon S3", "GCP SQL"
      ]
    },
    {
      title: "البيانات الضخمة",
      icon: Server,
      technologies: [
        "Apache Hadoop", "Apache Spark", "Apache Cassandra", "Apache Kafka",
        "Apache Hive", "Apache ZooKeeper", "Apache HBase", "Azure Cosmos DB",
        "Azure Blob Storage", "Azure Data Lake"
      ]
    },
    {
      title: "تعلم الآلة",
      icon: Brain,
      sections: [
        {
          subtitle: "لغات الترجمة",
          technologies: ["Matlab", "GNU Octave", "R"]
        },
        {
          subtitle: "أُطر العمل (FRAMEWORKS)",
          technologies: [
            "Apache Mahout", "Caffe", "Apache MXNet", "TensorFlow", 
            "Keras", "Torch", "OpenCV 2.x, 3.x", "Theano"
          ]
        },
        {
          subtitle: "المكتبات",
          technologies: ["Apache Spark MLlib", "Scikit Learn", "Gensim", "SpaCy"]
        },
        {
          subtitle: "الخوادم السحابية",
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
      sections: [
        {
          subtitle: "تعبئة الحاويات",
          technologies: ["Docker", "Kubernetes", "Red Hat OpenShift", "Apache Mesos"]
        },
        {
          subtitle: "الأتمتة",
          technologies: [
            "Ansible", "Puppet", "Chef", "Saltstack", 
            "HashiCorp Terraform", "HashiCorp Packer"
          ]
        },
        {
          subtitle: "أدوات التكامل المستمر (CI)/النشر المستمر (CD)",
          technologies: [
            "AWS Developer Tools", "Azure DevOps", "Google Developer Tools",
            "GitLab CI/CD", "Jenkins", "TeamCity"
          ]
        },
        {
          subtitle: "المراقبة",
          technologies: [
            "Zabbix", "Nagios", "Elasticsearch", "Prometheus", "Grafana", "Datadog"
          ]
        },
        {
          subtitle: "أدوات أتمتة الاختبار",
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
                <Card key={index} className="overflow-hidden border-0 shadow-lg bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
                  <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800 dark:to-slate-700 border-b border-slate-200 dark:border-slate-600">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">
                        {section.title}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-8">
                    {section.sections ? (
                      <div className="space-y-8">
                        {section.sections.map((subsection, subIndex) => (
                          <div key={subIndex}>
                            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 border-r-4 border-blue-500 pr-4">
                              {subsection.subtitle}
                            </h3>
                            <div className="flex flex-wrap gap-3">
                              {subsection.technologies.map((tech, techIndex) => (
                                <Badge 
                                  key={techIndex}
                                  variant="secondary"
                                  className="text-sm py-2 px-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-700 hover:shadow-md transition-shadow"
                                >
                                  {tech}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-3">
                        {section.technologies?.map((tech, techIndex) => (
                          <Badge 
                            key={techIndex}
                            variant="secondary"
                            className="text-sm py-2 px-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-700 hover:shadow-md transition-shadow"
                          >
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
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