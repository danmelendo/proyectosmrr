import { useEffect } from "react";
import { useLocation } from "react-router-dom";

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: "website" | "article";
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    section?: string;
    tags?: string[];
  };
  structuredData?: object;
}

const SEO = ({
  title,
  description,
  keywords,
  canonicalUrl,
  ogImage = "https://proyectosmrr.es/isologo.png",
  ogType = "website",
  article,
  structuredData,
}: SEOProps) => {
  const location = useLocation();
  const fullTitle = title.includes("Proyectos MRR") ? title : `${title} | Proyectos MRR`;
  const siteUrl = "https://proyectosmrr.es";
  // Auto-generate canonical from current path if not provided
  const currentPath = location.pathname === "/" ? "" : location.pathname;
  const canonical = canonicalUrl ? `${siteUrl}${canonicalUrl}` : `${siteUrl}${currentPath}`;

  useEffect(() => {
    // Update document title
    document.title = fullTitle;

    // Helper to update or create meta tags
    const updateMeta = (name: string, content: string, isProperty = false) => {
      const attr = isProperty ? "property" : "name";
      let meta = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute(attr, name);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    // Helper to update or create link tags
    const updateLink = (rel: string, href: string) => {
      let link = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
      if (!link) {
        link = document.createElement("link");
        link.rel = rel;
        document.head.appendChild(link);
      }
      link.href = href;
    };

    // Update meta description
    updateMeta("description", description);

    // Update keywords if provided
    if (keywords) {
      updateMeta("keywords", keywords);
    }

    // Update canonical URL (always set)
    updateLink("canonical", canonical);

    // Open Graph tags
    updateMeta("og:title", fullTitle, true);
    updateMeta("og:description", description, true);
    updateMeta("og:type", ogType, true);
    updateMeta("og:image", ogImage, true);
    updateMeta("og:url", canonical, true);
    updateMeta("og:site_name", "Proyectos MRR", true);
    updateMeta("og:locale", "es_ES", true);

    // Twitter Card tags
    updateMeta("twitter:card", "summary_large_image");
    updateMeta("twitter:title", fullTitle);
    updateMeta("twitter:description", description);
    updateMeta("twitter:image", ogImage);

    // Article specific meta tags
    if (article && ogType === "article") {
      if (article.publishedTime) {
        updateMeta("article:published_time", article.publishedTime, true);
      }
      if (article.modifiedTime) {
        updateMeta("article:modified_time", article.modifiedTime, true);
      }
      if (article.author) {
        updateMeta("article:author", article.author, true);
      }
      if (article.section) {
        updateMeta("article:section", article.section, true);
      }
      article.tags?.forEach((tag, index) => {
        updateMeta(`article:tag:${index}`, tag, true);
      });
    }

    // Structured Data (JSON-LD)
    const existingScript = document.querySelector('script[data-seo-structured]');
    if (existingScript) {
      existingScript.remove();
    }

    if (structuredData) {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.setAttribute("data-seo-structured", "true");
      script.textContent = JSON.stringify(structuredData);
      document.head.appendChild(script);
    }

    // Cleanup on unmount
    return () => {
      const structuredScript = document.querySelector('script[data-seo-structured]');
      if (structuredScript) {
        structuredScript.remove();
      }
    };
  }, [fullTitle, description, keywords, canonical, ogImage, ogType, article, structuredData]);

  return null;
};

// Default Organization structured data
export const getOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Proyectos MRR",
  url: "https://proyectosmrr.es",
  logo: "https://proyectosmrr.es/logo.svg",
  description: "Especialistas en reformas sostenibles e inversión inmobiliaria en Madrid",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Calle Jose Calvo 6",
    addressLocality: "Madrid",
    postalCode: "28039",
    addressCountry: "ES",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+34 711 25 33 61",
    contactType: "customer service",
    availableLanguage: ["Spanish"],
  },
  sameAs: [
    "https://www.instagram.com/proyectosmrr",
    "https://www.linkedin.com/company/proyectosmrr",
  ],
});

// Local Business structured data
export const getLocalBusinessSchema = () => ({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://proyectosmrr.es/#organization",
  name: "Proyectos MRR",
  image: "https://proyectosmrr.es/og-image.png",
  url: "https://proyectosmrr.es",
  telephone: "+34 711 25 33 61",
  email: "info@proyectosmrr.es",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Calle Jose Calvo 6",
    addressLocality: "Madrid",
    postalCode: "28039",
    addressCountry: "ES",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 40.4530,
    longitude: -3.7011,
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "09:00",
    closes: "18:00",
  },
  priceRange: "€€",
  areaServed: {
    "@type": "City",
    name: "Madrid",
  },
});

// Service structured data
export const getServiceSchema = (serviceName: string, serviceDescription: string, serviceUrl: string) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  name: serviceName,
  description: serviceDescription,
  provider: getOrganizationSchema(),
  url: `https://proyectosmrr.es${serviceUrl}`,
  areaServed: {
    "@type": "City",
    name: "Madrid",
  },
});

// Article structured data
export const getArticleSchema = (
  title: string,
  description: string,
  url: string,
  image: string,
  publishedDate: string,
  author: string = "Proyectos MRR"
) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: title,
  description: description,
  image: image,
  url: `https://proyectosmrr.es${url}`,
  datePublished: publishedDate,
  dateModified: publishedDate,
  author: {
    "@type": "Organization",
    name: author,
  },
  publisher: {
    "@type": "Organization",
    name: "Proyectos MRR",
    logo: {
      "@type": "ImageObject",
      url: "https://proyectosmrr.es/logo.svg",
    },
  },
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": `https://proyectosmrr.es${url}`,
  },
});

// FAQ structured data
export const getFAQSchema = (faqs: Array<{ question: string; answer: string }>) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
});

// Breadcrumb structured data
export const getBreadcrumbSchema = (items: Array<{ name: string; url: string }>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: `https://proyectosmrr.es${item.url}`,
  })),
});

export default SEO;
