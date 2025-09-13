// تكوين SEO شامل للموقع
export interface SEOConfig {
  siteName: string;
  siteUrl: string;
  defaultTitle: string;
  titleTemplate: string;
  defaultDescription: string;
  keywords: string[];
  author: string;
  type: string;
  locale: string;
  sitemap: string;
  robots: string;
  twitterHandle?: string;
  organizationSchema: {
    name: string;
    url: string;
    logo: string;
    address: {
      streetAddress: string;
      addressCountry: string;
    };
    telephone: string;
    taxID: string;
    identifier: string;
  };
}

export const seoConfig: SEOConfig = {
  siteName: "شركة علي صالح الشهري القابضة",
  siteUrl: "https://alialshehriholding.com",
  defaultTitle: "شركة علي صالح الشهري القابضة | الاستثمار والتقنية",
  titleTemplate: "%s | شركة علي صالح الشهري القابضة",
  defaultDescription: "شركة قابضة سعودية تركز على الاستثمار في التقنية والإعلام. السجل التجاري 4030554749. هاتف 0555812567.",
  keywords: [
    "شركة علي الشهري",
    "استثمار تقني", 
    "المملكة العربية السعودية",
    "شركة قابضة",
    "تقنية",
    "إعلام",
    "الاستثمار",
    "التطوير التقني",
    "الحلول الرقمية",
    "الابتكار",
    "ريادة الأعمال"
  ],
  author: "شركة علي صالح الشهري القابضة",
  type: "website",
  locale: "ar_SA",
  sitemap: "https://alialshehriholding.com/sitemap.xml",
  robots: "https://alialshehriholding.com/robots.txt",
  organizationSchema: {
    name: "شركة علي صالح الشهري القابضة",
    url: "https://alialshehriholding.com",
    logo: "https://alialshehriholding.com/logo.png",
    address: {
      streetAddress: "5081 شارع الأمير سلطان – حي البساتين",
      addressCountry: "SA"
    },
    telephone: "+966555812567",
    taxID: "310123456700003",
    identifier: "CR 4030554749"
  }
};

// ميتا تاجز لكل صفحة
export const pageMetadata = {
  home: {
    title: "الصفحة الرئيسية",
    description: "شركة علي صالح الشهري القابضة - شركة قابضة رائدة في الاستثمار التقني والإعلامي بالمملكة العربية السعودية",
    keywords: ["الصفحة الرئيسية", "شركة قابضة", "استثمار تقني"] as string[]
  },
  about: {
    title: "عن الشركة",
    description: "تعرف على شركة علي صالح الشهري القابضة، رؤيتنا، رسالتنا، وقيمنا في الاستثمار التقني والإعلامي",
    keywords: ["عن الشركة", "رؤية", "رسالة", "قيم"] as string[]
  },
  services: {
    title: "خدماتنا",
    description: "اكتشف خدماتنا المتميزة في التقنية والاستثمار والإعلام والحلول الرقمية المبتكرة",
    keywords: ["خدمات", "حلول تقنية", "استشارات"] as string[]
  },
  projects: {
    title: "مشاريعنا",
    description: "استعرض مجموعة مشاريعنا المتميزة في مجال التقنية والاستثمار والابتكار",
    keywords: ["مشاريع", "محفظة أعمال", "انجازات"]
  },
  partners: {
    title: "شركاؤنا",
    description: "تعرف على شركائنا الاستراتيجيين وعلاقاتنا التجارية المتميزة",
    keywords: ["شركاء", "تعاون", "علاقات تجارية"]
  },
  contact: {
    title: "تواصل معنا",
    description: "تواصل مع شركة علي صالح الشهري القابضة. هاتف: 0555812567 | البريد: info@alialshehriholding.com",
    keywords: ["تواصل", "اتصال", "عنوان", "هاتف"] as string[]
  },
  privacy: {
    title: "سياسة الخصوصية",
    description: "اطلع على سياسة الخصوصية وحماية البيانات الخاصة بشركة علي صالح الشهري القابضة",
    keywords: ["خصوصية", "حماية بيانات", "سياسة"]
  },
  terms: {
    title: "الشروط والأحكام",
    description: "اقرأ الشروط والأحكام الخاصة باستخدام موقع وخدمات شركة علي صالح الشهري القابضة",
    keywords: ["شروط", "أحكام", "استخدام"]
  }
} as const;

// دالة إنشاء البيانات المنظمة
export const generateStructuredData = (type: 'Organization' | 'Website' | 'BreadcrumbList', data?: any) => {
  const { organizationSchema } = seoConfig;
  
  switch (type) {
    case 'Organization':
      return {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": organizationSchema.name,
        "url": organizationSchema.url,
        "logo": organizationSchema.logo,
        "address": {
          "@type": "PostalAddress",
          "streetAddress": organizationSchema.address.streetAddress,
          "addressCountry": organizationSchema.address.addressCountry
        },
        "telephone": organizationSchema.telephone,
        "taxID": organizationSchema.taxID,
        "identifier": organizationSchema.identifier,
        "sameAs": [
          "https://twitter.com/alishehriholding",
          "https://linkedin.com/company/alishehriholding"
        ]
      };
      
    case 'Website':
      return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": seoConfig.siteName,
        "url": seoConfig.siteUrl,
        "potentialAction": {
          "@type": "SearchAction",
          "target": `${seoConfig.siteUrl}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string"
        }
      };
      
    case 'BreadcrumbList':
      return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": data?.breadcrumbs?.map((item: any, index: number) => ({
          "@type": "ListItem",
          "position": index + 1,
          "name": item.name,
          "item": `${seoConfig.siteUrl}${item.path}`
        })) || []
      };
      
    default:
      return null;
  }
};