import { SiteSettings } from '@/types';
import { Head, usePage } from '@inertiajs/react';

export interface SEOProps {
  title: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  siteName?: string;
  locale?: string;
  // Product specific
  product?: {
    price?: number;
    currency?: string;
    availability?: 'in stock' | 'out of stock' | 'preorder';
    brand?: string;
    category?: string;
    sku?: string;
  };
  // Article specific
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
  };
  // Twitter specific
  twitterCard?: 'summary' | 'summary_large_image' | 'product';
  twitterSite?: string;
  // Robots
  noindex?: boolean;
  nofollow?: boolean;
  // Canonical
  canonical?: string;
}

const DEFAULT_LOCALE = 'id_ID';
const DEFAULT_IMAGE = '/images/og-default.jpg';

export const SEOHead: React.FC<SEOProps> = ({
  title,
  description,
  keywords = ['furnitur', 'furniture', 'mebel', 'kursi', 'meja', 'lemari'],
  image = DEFAULT_IMAGE,
  url,
  type = 'website',
  siteName,
  locale = DEFAULT_LOCALE,
  product,
  article,
  twitterCard = 'summary_large_image',
  twitterSite,
  noindex = false,
  nofollow = false,
  canonical,
}) => {
  const { siteSettings } = usePage<{ siteSettings?: SiteSettings }>().props;

  // Use site settings as defaults
  const resolvedSiteName = siteName || siteSettings?.site_name || 'Ronica';
  const resolvedDescription =
    description ||
    siteSettings?.site_description ||
    `${resolvedSiteName} - Furnitur Berkualitas dengan Harga Terjangkau. Temukan koleksi kursi, meja, lemari, dan furnitur custom terbaik.`;
  const safeTitle = title || resolvedSiteName;
  // Don't append siteName here - app.tsx already does this via Inertia title callback
  const fullTitle = safeTitle;
  // For OG/meta use full title with site name
  const metaTitle = safeTitle.includes(resolvedSiteName)
    ? safeTitle
    : `${safeTitle} | ${resolvedSiteName}`;
  const currentUrl =
    url || (typeof window !== 'undefined' ? window.location.href : '');
  const imageUrl = image?.startsWith('http')
    ? image
    : typeof window !== 'undefined'
      ? `${window.location.origin}${image}`
      : image;

  const robotsContent = [
    noindex ? 'noindex' : 'index',
    nofollow ? 'nofollow' : 'follow',
  ].join(', ');

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={resolvedDescription} />
      <meta name="keywords" content={keywords.join(', ')} />
      <meta name="robots" content={robotsContent} />

      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={resolvedDescription} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:site_name" content={resolvedSiteName} />
      <meta property="og:locale" content={locale} />

      {/* Twitter Card */}
      <meta name="twitter:card" content={twitterCard} />
      {twitterSite && <meta name="twitter:site" content={twitterSite} />}
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={resolvedDescription} />
      <meta name="twitter:image" content={imageUrl} />

      {/* Product specific Open Graph */}
      {product && product.price && (
        <meta
          property="product:price:amount"
          content={String(product.price)}
          key="product-price"
        />
      )}
      {product && product.currency && (
        <meta
          property="product:price:currency"
          content={product.currency}
          key="product-currency"
        />
      )}
      {product && product.availability && (
        <meta
          property="product:availability"
          content={product.availability}
          key="product-availability"
        />
      )}
      {product && product.brand && (
        <meta
          property="product:brand"
          content={product.brand}
          key="product-brand"
        />
      )}
      {product && product.category && (
        <meta
          property="product:category"
          content={product.category}
          key="product-category"
        />
      )}

      {/* Article specific Open Graph */}
      {article && article.publishedTime && (
        <meta
          property="article:published_time"
          content={article.publishedTime}
          key="article-published"
        />
      )}
      {article && article.modifiedTime && (
        <meta
          property="article:modified_time"
          content={article.modifiedTime}
          key="article-modified"
        />
      )}
      {article && article.author && (
        <meta
          property="article:author"
          content={article.author}
          key="article-author"
        />
      )}
    </Head>
  );
};

export default SEOHead;
