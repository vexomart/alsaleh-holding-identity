import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe, Code, Palette, Shield, Cloud, Zap, Star, Award } from "lucide-react";

const PartnersSection = () => {
  const globalPartners = [
    { name: "Microsoft", logo: "🟦", category: "Cloud & Enterprise" },
    { name: "Google", logo: "🌐", category: "AI & Analytics" },
    { name: "Amazon AWS", logo: "🟠", category: "Cloud Infrastructure" },
    { name: "Apple", logo: "🍎", category: "Mobile Development" },
    { name: "Adobe", logo: "🔴", category: "Creative Solutions" },
    { name: "Oracle", logo: "🔵", category: "Database Systems" },
    { name: "IBM", logo: "🔷", category: "Enterprise Solutions" },
    { name: "Salesforce", logo: "☁️", category: "CRM Solutions" }
  ];

  const programmingTech = [
    { name: "React", icon: "⚛️", category: "Frontend" },
    { name: "TypeScript", icon: "🟦", category: "Language" },
    { name: "Node.js", icon: "🟢", category: "Backend" },
    { name: "Python", icon: "🐍", category: "AI/ML" },
    { name: "Next.js", icon: "▲", category: "Framework" },
    { name: "GraphQL", icon: "🔗", category: "API" },
    { name: "Docker", icon: "🐳", category: "DevOps" },
    { name: "Kubernetes", icon: "⚙️", category: "Orchestration" },
    { name: "MongoDB", icon: "🍃", category: "Database" },
    { name: "PostgreSQL", icon: "🐘", category: "Database" },
    { name: "Redis", icon: "🔴", category: "Cache" },
    { name: "AWS", icon: "☁️", category: "Cloud" }
  ];

  const designTech = [
    { name: "Adobe Photoshop", icon: "🎨", category: "Image Editing" },
    { name: "Adobe Illustrator", icon: "🖌️", category: "Vector Graphics" },
    { name: "Figma", icon: "🎯", category: "UI/UX Design" },
    { name: "Adobe XD", icon: "💎", category: "Prototyping" },
    { name: "Sketch", icon: "📐", category: "Interface Design" },
    { name: "After Effects", icon: "🎬", category: "Motion Graphics" },
    { name: "Premiere Pro", icon: "🎥", category: "Video Editing" },
    { name: "Blender", icon: "🌀", category: "3D Modeling" }
  ];

  return (
    <section className="py-24 bg-gradient-subtle relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      <div className="absolute top-1/4 right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 left-10 w-32 h-32 bg-secondary/10 rounded-full blur-3xl animate-float-delayed" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20 animate-fade-in">
          <div className="inline-flex items-center gap-3 mb-6 p-3 bg-white/10 rounded-full backdrop-blur-sm">
            <Globe className="w-6 h-6 text-primary animate-pulse" />
            <span className="text-sm font-medium text-primary">شركاء عالميون • تقنيات متقدمة</span>
          </div>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-primary mb-8 leading-tight">
            شركاؤنا <span className="text-gradient-primary">التقنيون العالميون</span>
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            نتعاون مع أكبر الشركات التقنية العالمية ونستخدم أحدث التقنيات في البرمجة والتصميم
          </p>
        </div>

        {/* Global Partners */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-primary mb-4 flex items-center justify-center gap-3">
              <Award className="w-8 h-8 text-secondary" />
              شركاؤنا العالميون
            </h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
            {globalPartners.map((partner, index) => (
              <Card 
                key={index}
                className="group premium-card hover:shadow-glow transition-all duration-500 border-0 bg-white/5 backdrop-blur-md overflow-hidden animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6 text-center relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative z-10">
                    <div className="text-4xl mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                      {partner.logo}
                    </div>
                    <h4 className="text-lg font-bold text-primary mb-2 group-hover:text-gradient-primary transition-all duration-300">
                      {partner.name}
                    </h4>
                    <Badge variant="secondary" className="text-xs bg-white/10 border-white/20">
                      {partner.category}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Programming Technologies */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-primary mb-4 flex items-center justify-center gap-3">
              <Code className="w-8 h-8 text-secondary" />
              تقنيات البرمجة المعتمدة
            </h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {programmingTech.map((tech, index) => (
              <Card 
                key={index}
                className="group premium-card hover:shadow-glow transition-all duration-500 border-0 bg-white/5 backdrop-blur-md overflow-hidden animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <CardContent className="p-4 text-center relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative z-10">
                    <div className="text-3xl mb-3 group-hover:scale-110 transition-all duration-300">
                      {tech.icon}
                    </div>
                    <h4 className="text-sm font-bold text-primary mb-1 group-hover:text-gradient-primary transition-all duration-300">
                      {tech.name}
                    </h4>
                    <Badge variant="outline" className="text-xs bg-white/10 border-white/20">
                      {tech.category}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Design Technologies */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-primary mb-4 flex items-center justify-center gap-3">
              <Palette className="w-8 h-8 text-secondary" />
              تقنيات التصميم المعتمدة
            </h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
            {designTech.map((tech, index) => (
              <Card 
                key={index}
                className="group premium-card hover:shadow-glow transition-all duration-500 border-0 bg-white/5 backdrop-blur-md overflow-hidden animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6 text-center relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative z-10">
                    <div className="text-4xl mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                      {tech.icon}
                    </div>
                    <h4 className="text-lg font-bold text-primary mb-2 group-hover:text-gradient-primary transition-all duration-300">
                      {tech.name}
                    </h4>
                    <Badge variant="secondary" className="text-xs bg-white/10 border-white/20">
                      {tech.category}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Tech Stats */}
        <div className="text-center bg-white/5 backdrop-blur-md rounded-3xl p-10 animate-fade-in">
          <h3 className="text-3xl font-bold text-primary mb-8">خبرتنا التقنية</h3>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="group">
              <div className="text-4xl font-bold text-gradient-primary mb-2 group-hover:scale-110 transition-transform duration-300">20+</div>
              <div className="text-lg font-semibold text-primary">تقنية برمجة</div>
              <div className="text-sm text-muted-foreground">Programming Tech</div>
            </div>
            <div className="group">
              <div className="text-4xl font-bold text-gradient-primary mb-2 group-hover:scale-110 transition-transform duration-300">15+</div>
              <div className="text-lg font-semibold text-primary">أداة تصميم</div>
              <div className="text-sm text-muted-foreground">Design Tools</div>
            </div>
            <div className="group">
              <div className="text-4xl font-bold text-gradient-primary mb-2 group-hover:scale-110 transition-transform duration-300">8+</div>
              <div className="text-lg font-semibold text-primary">شريك عالمي</div>
              <div className="text-sm text-muted-foreground">Global Partners</div>
            </div>
            <div className="group">
              <div className="text-4xl font-bold text-gradient-primary mb-2 group-hover:scale-110 transition-transform duration-300">100%</div>
              <div className="text-lg font-semibold text-primary">تقنيات حديثة</div>
              <div className="text-sm text-muted-foreground">Modern Tech</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;