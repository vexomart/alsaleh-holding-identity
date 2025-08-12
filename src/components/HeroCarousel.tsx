import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Globe, ChevronDown, Heart, Shield, Award, Building2, Users } from "lucide-react";


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
              <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--primary))_0%,transparent_60%)] opacity-20" />
                <div className="absolute inset-0 bg-grid-pattern opacity-15" />
              </div>
              <div className="relative z-10 h-full container mx-auto px-4 flex items-center">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 w-full">
                  {/* Left: Headline & CTAs */}
                  <div className="max-w-2xl text-white animate-enter">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                      <Badge className="bg-white text-slate-900 border border-slate-200">شركة قابضة رسمية</Badge>
                      <Badge className="bg-white/95 text-slate-900 border border-slate-200">معايير حوكمة عالية</Badge>
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
                    <div className="bg-white/95 dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-white/10 p-5 shadow-lg hover:shadow-xl transition-all duration-300 text-slate-900 dark:text-white">
                      <div className="flex items-center gap-3 mb-2">
                        <Building2 className="w-5 h-5 text-secondary" />
                        <span className="text-sm text-slate-600 dark:text-slate-300">سنة التأسيس</span>
                      </div>
                      <div className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">2016</div>
                    </div>
                    <div className="bg-white/95 dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-white/10 p-5 shadow-lg hover:shadow-xl transition-all duration-300 text-slate-900 dark:text-white">
                      <div className="flex items-center gap-3 mb-2">
                        <Users className="w-5 h-5 text-accent" />
                        <span className="text-sm text-slate-600 dark:text-slate-300">عملاء وشركاء</span>
                      </div>
                      <div className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">+1700</div>
                    </div>
                    <div className="bg-white/95 dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-white/10 p-5 shadow-lg hover:shadow-xl transition-all duration-300 text-slate-900 dark:text-white">
                      <div className="flex items-center gap-3 mb-2">
                        <Award className="w-5 h-5 text-primary" />
                        <span className="text-sm text-slate-600 dark:text-slate-300">مشاريع منجزة</span>
                      </div>
                      <div className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">+2800</div>
                    </div>
                    <div className="bg-white/95 dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-white/10 p-5 shadow-lg hover:shadow-xl transition-all duration-300 text-slate-900 dark:text-white">
                      <div className="flex items-center gap-3 mb-2">
                        <Shield className="w-5 h-5 text-secondary" />
                        <span className="text-sm text-slate-600 dark:text-slate-300">التزام بالحوكمة</span>
                      </div>
                      <div className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">عالي</div>
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