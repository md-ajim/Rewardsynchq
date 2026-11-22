/**
 * Programmatic URL Canonicalization Utility
 * Strips out search params and fragments to prevent duplicate content penalties.
 */
export type CanonicalRouteType = 'brand' | 'product' | 'deal' | 'category' | 'app' | 'blog' | 'digital-asset';

export function getCanonicalUrl(slug: string, type: CanonicalRouteType = 'deal'): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  
  // Strip out URL parameters and hash fragments, and trim whitespace
  let cleanSlug = slug.split('?')[0].split('#')[0].trim();
  
  // Remove leading and trailing slashes from the slug
  while (cleanSlug.startsWith('/')) {
    cleanSlug = cleanSlug.slice(1);
  }
  while (cleanSlug.endsWith('/')) {
    cleanSlug = cleanSlug.slice(0, -1);
  }
  
  // Define programmatic path mappings
  let path = '';
  switch (type) {
    case 'brand':
      path = cleanSlug ? `/cashback/brands/${cleanSlug}` : `/cashback`;
      break;
    case 'category':
      path = cleanSlug ? `/digital-asset?category=${cleanSlug}` : `/digital-asset`;
      break;
    case 'app':
      if (!cleanSlug || cleanSlug === 'apps-cashback') {
        path = `/apps-cashback`;
      } else {
        path = `/apps-cashback/${cleanSlug}`;
      }
      break;
    case 'blog':
      if (!cleanSlug || cleanSlug === 'blog') {
        path = `/blog`;
      } else {
        path = `/blog/${cleanSlug}`;
      }
      break;
    case 'digital-asset':
      if (!cleanSlug || cleanSlug === 'digital-asset') {
        path = `/digital-asset`;
      } else {
        path = `/digital-asset/${cleanSlug}`;
      }
      break;
    case 'product':
      if (!cleanSlug || cleanSlug === 'products') {
        path = `/products`;
      } else {
        path = `/products/${cleanSlug}`;
      }
      break;
    case 'deal':
    default:
      path = `/brands-deals`; // Deals do not have standalone pages
      break;
  }
  
  // Ensure we don't have double slashes and form final URL
  const formattedPath = path.startsWith('/') ? path : `/${path}`;
  return `${cleanBaseUrl}${formattedPath}`;
}
