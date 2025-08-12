import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Globe, ChevronDown, Heart, Shield, Award, Building2, Users } from "lucide-react";
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
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 w-full">
                  {/* Left: Headline & CTAs */}
                  <div className="max-w-2xl text-white animate-enter">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                      <Badge className="bg-white/15 text-white border-white/30">شركة قابضة رسمية</Badge>
                      <Badge className="bg-white/10 text-white border-white/20">معايير حوكمة عالية</Badge>
                    </div>

                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-4">
                      شركة علي صالح الشهري القابضة
                    </h1>

                    <p className="text-base md:text-lg lg:text-xl text-white/90 mb-8 max-w-prose">
                      نمكّن الأعمال عبر حلول تقنية واستثمارية متكاملة، برؤية مؤسسية رصينة وبمنهجية تنفيذ دقيقة.
                    </p>

                    <div className="flex flex-wrap gap-3">
                      <Button className="bg-secondary text-secondary-foreground hover:opacity-90 hover-scale" asChild>
                        <a href="/subsidiaries" className="story-link">
                          <Globe className="w-4 h-4 ml-2" /> استكشف شركاتنا
                          <ChevronDown className="w-4 h-4 mr-2" />
                        </a>
                      </Button>
                      <Button variant="outline" className="border-white/60 text-white hover:bg-white/10 hover-scale" asChild>
                        <a href="/start-with-us">
                          ابدأ معنا الآن
                        </a>
                      </Button>
                    </div>

                    {/* Trust badges */}
                    <div className="flex flex-wrap items-center gap-4 mt-8 text-white/80">
                      <div className="inline-flex items-center gap-2">
                        <Shield className="w-4 h-4 text-secondary" />
                        <span className="text-sm">امتثال وأمان عالي</span>
                      </div>
                      <div className="inline-flex items-center gap-2">
                        <Award className="w-4 h-4 text-accent" />
                        <span className="text-sm">اعتمادات ومعايير جودة</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Corporate Stats */}
                  <div className="grid grid-cols-2 gap-4 lg:gap-6 self-center animate-fade-in" style={{ animationDelay: '0.15s' }}>
                    <div className="glass-effect rounded-2xl border border-white/20 p-5 backdrop-blur-md hover:shadow-glow transition-all duration-300">
                      <div className="flex items-center gap-3 mb-2">
                        <Building2 className="w-5 h-5 text-secondary" />
                        <span className="text-sm text-white/80">سنة التأسيس</span>
                      </div>
                      <div className="text-3xl font-black">2016</div>
                    </div>
                    <div className="glass-effect rounded-2xl border border-white/20 p-5 backdrop-blur-md hover:shadow-glow transition-all duration-300">
                      <div className="flex items-center gap-3 mb-2">
                        <Users className="w-5 h-5 text-accent" />
                        <span className="text-sm text-white/80">عملاء وشركاء</span>
                      </div>
                      <div className="text-3xl font-black">+1700</div>
                    </div>
                    <div className="glass-effect rounded-2xl border border-white/20 p-5 backdrop-blur-md hover:shadow-glow transition-all duration-300">
                      <div className="flex items-center gap-3 mb-2">
                        <Award className="w-5 h-5 text-primary" />
                        <span className="text-sm text-white/80">مشاريع منجزة</span>
                      </div>
                      <div className="text-3xl font-black">+2800</div>
                    </div>
                    <div className="glass-effect rounded-2xl border border-white/20 p-5 backdrop-blur-md hover:shadow-glow transition-all duration-300">
                      <div className="flex items-center gap-3 mb-2">
                        <Shield className="w-5 h-5 text-secondary" />
                        <span className="text-sm text-white/80">التزام بالحوكمة</span>
                      </div>
                      <div className="text-3xl font-black">عالي</div>
                    </div>
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