import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Globe, ChevronDown, Heart } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

export default function HeroCarousel() {
  return (
    <section className="relative overflow-hidden">
      <Carousel
        opts={{ loop: false }}
        className="w-full"
      >
        <CarouselContent>
          {/* Slide 1 */}
          <CarouselItem>
            <div className="relative min-h-[75vh] md:min-h-[85vh] w-full">
              <img src={heroBg} alt="الهوية المؤسسية لشركة قابضة" className="absolute inset-0 w-full h-full object-cover" loading="eager" />
              <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/30" />
              <div className="absolute inset-0 bg-grid-pattern opacity-20" />
              <div className="absolute top-1/4 left-8 w-24 h-24 bg-secondary/30 rounded-full blur-2xl animate-float" />
              <div className="absolute bottom-1/4 right-8 w-32 h-32 bg-accent/25 rounded-full blur-3xl animate-float-delayed" />
              <div className="relative z-10 h-full container mx-auto px-4 flex items-center">
                <div className="max-w-3xl text-white animate-enter">
                  <Badge className="mb-4 bg-white/20 text-white border-white/30">شركة رائدة منذ 2016</Badge>
                  <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-4">شركة علي صالح الشهري القابضة</h1>
                  <p className="text-lg md:text-xl text-white/90 mb-8">رؤية مستقبلية في التقنية والإعلام، نبني جسوراً نحو الابتكار والتميز العالمي</p>
                  <div className="flex flex-wrap gap-3">
                    <Button className="bg-secondary text-secondary-foreground hover:opacity-90 hover-scale" asChild>
                      <a href="/subsidiaries">
                        <Globe className="w-4 h-4 ml-2" /> استكشف شركاتنا
                        <ChevronDown className="w-4 h-4 mr-2" />
                      </a>
                    </Button>
                    <Button variant="outline" className="border-white/60 text-white hover:bg-white/10 hover-scale" asChild>
                      <a href="/vision">
                        <Heart className="w-4 h-4 ml-2" /> رؤيتنا التفصيلية
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CarouselItem>
        </CarouselContent>

      </Carousel>
    </section>
  );
}