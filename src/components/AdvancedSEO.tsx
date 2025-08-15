import React from 'react';
import { Helmet } from 'react-helmet-async';

interface AdvancedSEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: string;
  schema?: object;
  lang?: string;
  noindex?: boolean;
}

export const AdvancedSEO: React.FC<AdvancedSEOProps> = ({
  title = "شركة علي صالح الشهري القابضة - الاستثمار التقني والإعلامي",
  description = "شركة قابضة رائدة في الاستثمار التقني والإعلامي في المملكة العربية السعودية",
  keywords = [],
  canonicalUrl,
  ogImage = "/lovable-uploads/1b40cb28-9cbb-4fdf-9a92-f739dad1a3a7.png",
  ogType = "website",
  schema,
  lang = "ar",
  noindex = false
}) => {
  const defaultKeywords = [
    "شركة علي الشهري",
    "استثمار تقني",
    "المملكة العربية السعودية",
    "شركة قابضة",
    "تقنية",
    "إعلام",
    "خدمات رقمية",
    "تطوير مواقع",
    "تصميم",
    "برمجة"
  ];

  const allKeywords = [...defaultKeywords, ...keywords];
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const defaultSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "شركة علي صالح الشهري القابضة",
    "description": description,
    "url": currentUrl,
    "logo": ogImage,
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "SA",
      "addressRegion": "الرياض"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+966555812567",
      "contactType": "customer service",
      "availableLanguage": "Arabic"
    },
    "sameAs": [
      // Add social media links here when available
    ]
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={allKeywords.join(", ")} />
      <meta name="author" content="شركة علي صالح الشهري القابضة" />
      <meta name="robots" content={noindex ? "noindex, nofollow" : "index, follow"} />
      <html lang={lang} dir="rtl" />

      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:locale" content="ar_SA" />
      <meta property="og:site_name" content="شركة علي صالح الشهري القابضة" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Additional Meta Tags for Better SEO */}
      <meta name="application-name" content="شركة علي صالح الشهري القابضة" />
      <meta name="apple-mobile-web-app-title" content="ASH Holdings" />
      <meta name="theme-color" content="#1e293b" />
      <meta name="msapplication-TileColor" content="#1e293b" />

      {/* Preconnect for performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(schema || defaultSchema)}
      </script>

      {/* Additional Performance Hints */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//fonts.gstatic.com" />
    </Helmet>
  );
};