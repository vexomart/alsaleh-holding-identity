import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Crown, Users, Code, DollarSign, Building } from "lucide-react";

const TeamSection = () => {
  const teamMembers = [
    {
      name: "علي صالح محمد الشهري",
      position: "رئيس مجلس الإدارة",
      department: "الإدارة العليا",
      initials: "ع.ش",
      color: "bg-primary",
      icon: Crown
    },
    {
      name: "عبدالعزيز سعد التميمي",
      position: "المدير العام",
      department: "الإدارة العليا",
      initials: "ع.ت",
      color: "bg-primary",
      icon: Building
    },
    {
      name: "سعود بن عبدالله الشمري",
      position: "مدير الموارد البشرية",
      department: "الموارد البشرية",
      initials: "س.ش",
      color: "bg-secondary",
      icon: Users
    },
    {
      name: "فهد محمد الأحمري",
      position: "مدير القسم التقني",
      department: "التقنية",
      initials: "ف.أ",
      color: "bg-blue-500",
      icon: Code
    },
    {
      name: "حسين بن عبدالله الزهراني",
      position: "مدير المالية",
      department: "المالية",
      initials: "ح.ز",
      color: "bg-green-500",
      icon: DollarSign
    }
  ];

  return (
    <section className="section-spacing bg-background">
      <div className="container mx-auto container-responsive">
        <div className="text-center mb-12 md:mb-16 animate-fade-in">
          <h2 className="responsive-title text-primary mb-4 md:mb-6">
            فريق العمل
          </h2>
          <p className="responsive-text text-muted-foreground max-w-3xl mx-auto">
            نفخر بفريق عمل متميز من الخبراء والمختصين الذين يقودون شركتنا نحو التميز والنجاح
          </p>
        </div>
        
        <div className="responsive-team-grid">
          {teamMembers.map((member, index) => {
            const IconComponent = member.icon;
            return (
              <Card 
                key={index} 
                className="card-animated shadow-elegant border-0 bg-card animate-scale-in group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-4 sm:p-6 text-center">
                  <div className="mb-4 sm:mb-6">
                    <div className={`w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 rounded-full ${member.color} flex items-center justify-center icon-float group-hover:icon-glow transition-all duration-300`}>
                      <IconComponent className="w-8 h-8 sm:w-10 sm:h-10 text-white group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <Badge variant="outline" className="text-xs border-primary/30 text-primary mb-2">
                      {member.department}
                    </Badge>
                  </div>
                  
                  <h3 className="text-base sm:text-lg font-bold text-primary mb-2">
                    {member.name}
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground font-medium">
                    {member.position}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;