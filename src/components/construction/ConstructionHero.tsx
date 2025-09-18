import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

interface ConstructionHeroProps {
  stats: Array<{
    number: string;
    label: string;
    icon: any;
  }>;
}

const ConstructionHero = ({ stats }: ConstructionHeroProps) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1920&q=80')"
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-800/80 to-slate-900/70"></div>
      </div>
      
      <div className="relative z-10 container mx-auto px-6 text-center text-white">
        <div className="animate-fade-in">
          <Badge className="mb-6 bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border-amber-500/30 px-6 py-2 text-lg">
            ✨ الشركة الرائدة في البناء والتشييد عالمياً
          </Badge>
          <h1 className="text-6xl md:text-8xl font-bold mb-8 bg-gradient-to-r from-white via-blue-100 to-amber-200 bg-clip-text text-transparent leading-tight">
            نبني أحلامكم
            <span className="block bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">بلمسة عالمية</span>
          </h1>
          <p className="text-2xl md:text-3xl mb-10 max-w-4xl mx-auto leading-relaxed text-blue-100">
            من ناطحات السحاب إلى المجمعات السكنية، نحول رؤيتكم إلى واقع ملموس بتقنيات متطورة وخبرة تمتد لعقود
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
            <Link to="/start-project">
              <Button size="lg" className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-10 py-6 text-xl shadow-2xl shadow-amber-500/25 hover-scale">
                🚀 ابدأ مشروعك الآن
                <ArrowRight className="mr-2 h-6 w-6" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 px-10 py-6 text-xl backdrop-blur-sm">
              📋 احصل على عرض سعر
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="animate-fade-in text-center" style={{animationDelay: `${index * 0.2}s`}}>
                <div className="text-4xl md:text-5xl font-bold text-amber-400 mb-2">{stat.number}</div>
                <div className="text-blue-200 text-sm md:text-base">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConstructionHero;