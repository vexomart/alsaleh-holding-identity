import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

interface Project {
  id: number;
  title: string;
  location: string;
  image: string;
  status: string;
  area: string;
  year: string;
}

interface ConstructionProjectsProps {
  projects: Project[];
  isPreview?: boolean;
  onViewAll?: () => void;
}

const ConstructionProjects = ({ projects, isPreview = false, onViewAll }: ConstructionProjectsProps) => {
  const displayProjects = isPreview ? projects.slice(0, 3) : projects;

  return (
    <section className="py-20 bg-gradient-to-b from-blue-50/30 to-slate-100">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-amber-100 text-amber-800">
            🏆 {isPreview ? "مشاريع رائدة" : "جميع مشاريعنا"}
          </Badge>
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-slate-800 to-amber-700 bg-clip-text text-transparent">
            {isPreview ? "إنجازات تتحدث عن نفسها" : "مشاريعنا المنجزة"}
          </h2>
          {!isPreview && (
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              تصفح مجموعة من أبرز مشاريعنا المنجزة حول العالم
            </p>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          {displayProjects.map((project, index) => (
            <Card 
              key={project.id} 
              className="overflow-hidden hover:shadow-2xl transition-all duration-500 hover-scale group border-0"
            >
              <div className="aspect-[4/3] relative overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute top-6 right-6">
                  <Badge className={project.status === "مكتمل" ? "bg-green-500" : "bg-blue-500"}>
                    {project.status}
                  </Badge>
                </div>
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">{project.title}</h3>
                  <div className="flex items-center text-blue-200">
                    <MapPin className="h-5 w-5 ml-2" />
                    {project.location}
                  </div>
                </div>
              </div>
              <CardContent className="p-6 bg-gradient-to-r from-white to-blue-50/50">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">المساحة: <span className="font-bold text-slate-800">{project.area}</span></span>
                  <span className="text-slate-600">السنة: <span className="font-bold text-slate-800">{project.year}</span></span>
                </div>
                {!isPreview && (
                  <div className="mt-4">
                    <Button variant="outline" className="w-full">
                      تفاصيل المشروع
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {isPreview && onViewAll && (
          <div className="text-center mt-12">
            <Button 
              size="lg" 
              onClick={onViewAll}
              className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-8 py-4"
            >
              عرض جميع المشاريع
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ConstructionProjects;