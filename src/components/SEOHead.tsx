import { Helmet } from "react-helmet-async";
import { seoConfig, generateStructuredData, pageMetadata } from "@/config/seo";

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: string;
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    section?: string;
    tags?: string[];
  };
  structuredData?: any;
  noIndex?: boolean;
  canonical?: string;
}

export const SEOHead = ({
  title,
  description,
  keywords = [],
  image,
  url,
  type = "website",
  article,
  structuredData,
  noIndex = false,
  canonical
}: SEOHeadProps) => {
  const pageTitle = title 
    ? `${title} | ${seoConfig.siteName}` 
    : seoConfig.defaultTitle;
    
  const pageDescription = description || seoConfig.defaultDescription;
  const pageUrl = url ? `${seoConfig.siteUrl}${url}` : seoConfig.siteUrl;
  const pageImage = image ? `${seoConfig.siteUrl}${image}` : `${seoConfig.siteUrl}/og-image.jpg`;
  const allKeywords = [...seoConfig.keywords, ...keywords].join(", ");
  const canonicalUrl = canonical ? `${seoConfig.siteUrl}${canonical}` : pageUrl;

  // إنشاء البيانات المنظمة
  const organizationSchema = generateStructuredData('Organization');
  const websiteSchema = generateStructuredData('Website');

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta name="keywords" content={allKeywords} />
      <meta name="author" content={seoConfig.author} />
      <meta name="robots" content={noIndex ? "noindex,nofollow" : "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"} />
      <meta name="language" content="ar" />
      <meta name="revisit-after" content="7 days" />
      <meta name="rating" content="general" />
      <meta name="distribution" content="global" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:image" content={pageImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={pageTitle} />
      <meta property="og:site_name" content={seoConfig.siteName} />
      <meta property="og:locale" content={seoConfig.locale} />
      
      {/* Article Meta Tags */}
      {article && type === "article" && (
        <>
          {article.publishedTime && (
            <meta property="article:published_time" content={article.publishedTime} />
          )}
          {article.modifiedTime && (
            <meta property="article:modified_time" content={article.modifiedTime} />
          )}
          {article.author && (
            <meta property="article:author" content={article.author} />
          )}
          {article.section && (
            <meta property="article:section" content={article.section} />
          )}
          {article.tags && article.tags.map(tag => (
            <meta key={tag} property="article:tag" content={tag} />
          ))}
        </>
      )}
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={pageImage} />
      <meta name="twitter:image:alt" content={pageTitle} />
      {seoConfig.twitterHandle && (
        <meta name="twitter:site" content={seoConfig.twitterHandle} />
      )}
      
      {/* Additional Meta Tags */}
      <meta name="theme-color" content="#1e293b" />
      <meta name="msapplication-TileColor" content="#1e293b" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content={seoConfig.siteName} />
      
      {/* Geo Tags for Saudi Arabia */}
      <meta name="geo.region" content="SA" />
      <meta name="geo.country" content="Saudi Arabia" />
      <meta name="geo.placename" content="Riyadh" />
      
      {/* Business Info */}
      <meta name="business:contact_data:street_address" content="5081 شارع الأمير سلطان – حي البساتين" />
      <meta name="business:contact_data:locality" content="الرياض" />
      <meta name="business:contact_data:region" content="الرياض" />
      <meta name="business:contact_data:postal_code" content="11564" />
      <meta name="business:contact_data:country_name" content="السعودية" />
      <meta name="business:contact_data:phone_number" content="+966555812567" />
      <meta name="business:contact_data:email" content="info@alialshehriholding.com" />
      
      {/* Structured Data - Organization */}
      {organizationSchema && (
        <script type="application/ld+json">
          {JSON.stringify(organizationSchema)}
        </script>
      )}
      
      {/* Structured Data - Website */}
      {websiteSchema && (
        <script type="application/ld+json">
          {JSON.stringify(websiteSchema)}
        </script>
      )}
      
      {/* Custom Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
      
      {/* Sitemap and Robots */}
      <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
      
      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://api.whatsapp.com" />
      
      {/* DNS Prefetch */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//fonts.gstatic.com" />
      <link rel="dns-prefetch" href="//wa.me" />
      
      {/* Favicon and Icons */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/manifest.json" />
      
      {/* Language and Direction */}
      <html lang="ar" dir="rtl" />
    </Helmet>
  );
};

// مكون مساعد لصفحات محددة
export const HomePageSEO = () => (
  <SEOHead
    title={pageMetadata.home.title}
    description={pageMetadata.home.description}
    keywords={pageMetadata.home.keywords}
    url="/"
  />
);

export const AboutPageSEO = () => (
  <SEOHead
    title={pageMetadata.about.title}
    description={pageMetadata.about.description}
    keywords={pageMetadata.about.keywords}
    url="/about"
  />
);

export const ServicesPageSEO = () => (
  <SEOHead
    title={pageMetadata.services.title}
    description={pageMetadata.services.description}
    keywords={pageMetadata.services.keywords}
    url="/services"
  />
);

export const ContactPageSEO = () => (
  <SEOHead
    title={pageMetadata.contact.title}
    description={pageMetadata.contact.description}
    keywords={pageMetadata.contact.keywords}
    url="/contact"
  />
);