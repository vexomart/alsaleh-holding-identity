import React, { useEffect } from "react";

interface SEOProps {
  title: string;
  description?: string;
  canonicalUrl?: string;
  jsonLd?: Record<string, any> | Record<string, any>[];
}

// Lightweight SEO component without external deps
const SEO: React.FC<SEOProps> = ({ title, description, canonicalUrl, jsonLd }) => {
  useEffect(() => {
    document.title = title;

    // Meta description
    let desc = document.querySelector('meta[name="description"]');
    if (!desc) {
      desc = document.createElement('meta');
      desc.setAttribute('name', 'description');
      document.head.appendChild(desc);
    }
    if (description) desc.setAttribute('content', description);

    // Canonical
    let link: HTMLLinkElement | null = document.querySelector("link[rel='canonical']");
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    if (canonicalUrl) link.setAttribute('href', canonicalUrl);

    // JSON-LD structured data
    const existing = Array.from(document.querySelectorAll('script[type="application/ld+json"]'))
      .filter(s => s.getAttribute('data-managed-by') === 'seo');
    existing.forEach(s => s.remove());

    const entries = Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : [];
    entries.forEach(obj => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-managed-by', 'seo');
      script.text = JSON.stringify(obj);
      document.head.appendChild(script);
    });

    return () => {
      // Optional cleanup if route changes
    };
  }, [title, description, canonicalUrl, jsonLd]);

  return null;
};

export default SEO;
