import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const TeamSection = () => {
  const teamMembers = [
    {
      name: "علي صالح محمد الشهري",
      position: "رئيس مجلس الإدارة",
      department: "الإدارة العليا",
      initials: "ع.ش",
      color: "bg-primary"
    },
    {
      name: "سعود بن عبدالله الشمري",
      position: "مدير الموارد البشرية",
      department: "الموارد البشرية",
      initials: "س.ش",
      color: "bg-secondary"
    },
    {
      name: "فهد محمد الأحمري",
      position: "مدير القسم التقني",
      department: "التقنية",
      initials: "ف.أ",
      color: "bg-blue-500"
    },
    {
      name: "حسين بن عبدالله الزهراني",
      position: "مدير المالية",
      department: "المالية",
      initials: "ح.ز",
      color: "bg-green-500"
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            فريق العمل
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            نفخر بفريق عمل متميز من الخبراء والمختصين الذين يقودون شركتنا نحو التميز والنجاح
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <Card key={index} className="shadow-elegant hover:shadow-glow transition-all duration-300 transform hover:-translate-y-2 border-0 bg-card">
              <CardContent className="p-6 text-center">
                <div className="mb-6">
                  <Avatar className="w-20 h-20 mx-auto mb-4">
                    <AvatarImage src="" alt={member.name} />
                    <AvatarFallback className={`${member.color} text-white text-lg font-bold`}>
                      {member.initials}
                    </AvatarFallback>
                  </Avatar>
                  <Badge variant="outline" className="text-xs border-primary/30 text-primary mb-2">
                    {member.department}
                  </Badge>
                </div>
                
                <h3 className="text-lg font-bold text-primary mb-2">
                  {member.name}
                </h3>
                <p className="text-muted-foreground font-medium">
                  {member.position}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;