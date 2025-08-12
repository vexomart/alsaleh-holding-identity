import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Globe, ChevronDown, Rocket, Heart } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import digitalBanner from "@/assets/digital-services-banner.jpg";
import brandService from "@/assets/brand-identity-service.jpg";

export default function HeroCarousel() {
  return (
    <section className="relative overflow-hidden">
      <Carousel
        opts={{ loop: true }}
        plugins={[Autoplay({ delay: 5000 })]}
        className="w-full"
      >
        <CarouselContent>
          {/* Slide 1 */}
          <CarouselItem>
            <div className="relative h-[70vh] md:h-[80vh] w-full">
              <img src={heroBg} alt="الهوية المؤسسية لشركة قابضة" className="absolute inset-0 w-full h-full object-cover" loading="eager" />
              <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/30" />
              <div className="absolute inset-0 bg-grid-pattern opacity-20" />
              <div className="relative z-10 h-full container mx-auto px-4 flex items-center">
                <div className="max-w-3xl text-white animate-enter">
                  <Badge className="mb-4 bg-white/20 text-white border-white/30">شركة رائدة منذ 2016</Badge>
                  <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-4">شركة علي صالح الشهري القابضة</h1>
                  <p className="text-lg md:text-xl text-white/90 mb-8">رؤية مستقبلية في التقنية والإعلام، نبني جسوراً نحو الابتكار والتميز العالمي</p>
                  <div className="flex flex-wrap gap-3">
                    <Button className="bg-secondary text-secondary-foreground hover:opacity-90">
                      <Globe className="w-4 h-4 ml-2" /> استكشف شركاتنا
                      <ChevronDown className="w-4 h-4 mr-2" />
                    </Button>
                    <Button variant="outline" className="border-white/60 text-white hover:bg-white/10">
                      <Heart className="w-4 h-4 ml-2" /> رؤيتنا التفصيلية
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CarouselItem>
          {/* Slide 2 */}
          <CarouselItem>
            <div className="relative h-[70vh] md:h-[80vh] w-full">
              <img src={digitalBanner} alt="حلول رقمية متقدمة للشركات" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary/60 to-primary/40" />
              <div className="relative z-10 h-full container mx-auto px-4 flex items-center">
                <div className="max-w-3xl text-white animate-enter">
                  <Badge className="mb-4 bg-white/20 text-white border-white/30">خدمات رقمية متكاملة</Badge>
                  <h2 className="text-3xl md:text-5xl font-extrabold leading-tight mb-4">حلول رقمية تدعم نمو الشركات</h2>
                  <p className="text-lg md:text-xl text-white/90 mb-8">من الاستشارات إلى التنفيذ، نقدم منظومة متكاملة تحقق نتائج مؤثرة</p>
                  <div className="flex gap-3">
                    <Button className="bg-accent text-white hover:opacity-90">
                      اكتشف خدماتنا
                    </Button>
                    <Button variant="ghost" className="text-white hover:bg-white/10">
                      <Rocket className="w-4 h-4 ml-2" /> ابدأ معنا
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CarouselItem>
          {/* Slide 3 */}
          <CarouselItem>
            <div className="relative h-[70vh] md:h-[80vh] w-full">
              <img src={brandService} alt="هوية بصرية وموارد العلامة" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-black/40 to-black/30" />
              <div className="relative z-10 h-full container mx-auto px-4 flex items-center">
                <div className="max-w-3xl text-white animate-enter">
                  <Badge className="mb-4 bg-white/20 text-white border-white/30">علامة تجارية قوية</Badge>
                  <h2 className="text-3xl md:text-5xl font-extrabold leading-tight mb-4">نصنع هويات قوية تعكس قيمكم</h2>
                  <p className="text-lg md:text-xl text-white/90 mb-8">حلول هوية بصرية متكاملة تدعم مكانتكم كشركة قابضة</p>
                  <div className="flex gap-3">
                    <Button variant="outline" className="border-white/60 text-white hover:bg-white/10">
                      تفاصيل أكثر
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CarouselItem>
        </CarouselContent>

        <CarouselPrevious className="left-4 bg-white/80 backdrop-blur hover:bg-white" />
        <CarouselNext className="right-4 bg-white/80 backdrop-blur hover:bg-white" />
      </Carousel>
    </section>
  );
}