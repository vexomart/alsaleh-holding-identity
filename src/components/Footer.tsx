const Footer = () => {
  return (
    <footer className="bg-primary py-12">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold text-primary-foreground mb-4">
              شركة علي صالح الشهري القابضة
            </h3>
            <p className="text-primary-foreground/80 leading-relaxed">
              شركة قابضة رائدة في الاستثمار التقني والإعلامي، نساهم في بناء مستقبل أفضل 
              من خلال دعم الابتكار والشركات الناشئة.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-primary-foreground mb-4">
              روابط سريعة
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#about" className="text-primary-foreground/80 hover:text-secondary transition-colors duration-200">
                  من نحن
                </a>
              </li>
              <li>
                <a href="#companies" className="text-primary-foreground/80 hover:text-secondary transition-colors duration-200">
                  شركاتنا الفرعية
                </a>
              </li>
              <li>
                <a href="#contact" className="text-primary-foreground/80 hover:text-secondary transition-colors duration-200">
                  تواصل معنا
                </a>
              </li>
              <li>
                <a href="/job-application" className="text-primary-foreground/80 hover:text-secondary transition-colors duration-200">
                  طلب توظيف
                </a>
              </li>
            </ul>
          </div>
          
          {/* Our Companies */}
          <div>
            <h4 className="text-lg font-semibold text-primary-foreground mb-4">
              شركاتنا
            </h4>
            <ul className="space-y-2">
              <li className="text-primary-foreground/80">شركة فكرة</li>
              <li className="text-primary-foreground/80">advixo.media</li>
              <li className="text-primary-foreground/80">فكرة تيك</li>
              <li className="text-primary-foreground/80">فكرة هولدينق</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center">
          <p className="text-primary-foreground/60">
            © 2024 شركة علي صالح الشهري القابضة. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;