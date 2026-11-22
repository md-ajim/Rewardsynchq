const fs = require('fs');
const path = require('path');

// Determine base URLs
const BASE_URL = 'https://RewardSyncHQ.com';
const API_BASE_URL = 'https://b5g2sob5d0.execute-api.us-east-1.amazonaws.com/production/server';

// Helper to format date to W3C format
const formatDate = (dateInput) => {
  try {
    const date = dateInput ? new Date(dateInput) : new Date();
    return date.toISOString().split('T')[0];
  } catch (e) {
    return new Date().toISOString().split('T')[0];
  }
};

// Helper to escape XML characters
const escapeXml = (unsafe) => {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
    }
  });
};

async function fetchJson(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`[Warning] API fetch failed for ${url} with status ${res.status}`);
      return null;
    }
    return await res.json();
  } catch (e) {
    console.error(`[Error] Failed to fetch ${url}:`, e.message);
    return null;
  }
}

async function generate() {
  console.log('Generating sitemap.xml...');
  const currentDate = formatDate();

  // 1. Static Routes
  const staticRoutes = [
    { loc: `${BASE_URL}/`, changefreq: 'daily', priority: '1.0' },
    { loc: `${BASE_URL}/cashback`, changefreq: 'daily', priority: '0.9' },
    { loc: `${BASE_URL}/brands-deals`, changefreq: 'daily', priority: '0.9' },
    { loc: `${BASE_URL}/physical-brands`, changefreq: 'daily', priority: '0.9' },
    { loc: `${BASE_URL}/digital-brands`, changefreq: 'daily', priority: '0.9' },
    { loc: `${BASE_URL}/digital-asset`, changefreq: 'daily', priority: '0.9' },
    { loc: `${BASE_URL}/products`, changefreq: 'daily', priority: '0.9' },
    { loc: `${BASE_URL}/apps-cashback`, changefreq: 'daily', priority: '0.9' },
    { loc: `${BASE_URL}/blog`, changefreq: 'daily', priority: '0.9' },
    { loc: `${BASE_URL}/cashback-policy`, changefreq: 'monthly', priority: '0.5' },
    { loc: `${BASE_URL}/support`, changefreq: 'monthly', priority: '0.5' },
    { loc: `${BASE_URL}/auth/login`, changefreq: 'monthly', priority: '0.5' },
    { loc: `${BASE_URL}/auth/register`, changefreq: 'monthly', priority: '0.5' },
  ];

  const urls = [...staticRoutes];

  // 2. Fetch Dynamic Brands
  console.log('Fetching brands from API...');
  const brandsRes = await fetchJson(`${API_BASE_URL}/brands/`);
  if (brandsRes) {
    const brands = Array.isArray(brandsRes) ? brandsRes : (brandsRes.results || []);
    console.log(`Loaded ${brands.length} brands.`);
    brands.forEach((brand) => {
      if (brand.slug) {
        urls.push({
          loc: `${BASE_URL}/cashback/brands/${brand.slug}`,
          lastmod: formatDate(brand.updated_at),
          changefreq: 'daily',
          priority: '0.8',
        });
      }
    });
  }

  // 3. Fetch Dynamic App Rewards
  console.log('Fetching app rewards from API...');
  const appRewardsRes = await fetchJson(`${API_BASE_URL}/app-rewards/`);
  if (appRewardsRes) {
    const appRewards = Array.isArray(appRewardsRes) ? appRewardsRes : (appRewardsRes.results || []);
    console.log(`Loaded ${appRewards.length} app rewards.`);
    appRewards.forEach((app) => {
      if (app.slug) {
        urls.push({
          loc: `${BASE_URL}/apps-cashback/${app.slug}`,
          lastmod: formatDate(app.updated_at),
          changefreq: 'daily',
          priority: '0.7',
        });
      }
    });
  }

  // 4. Fetch Dynamic Blog Posts
  console.log('Fetching blog posts from API...');
  const blogPostsRes = await fetchJson(`${API_BASE_URL}/blog/posts/`);
  if (blogPostsRes) {
    const blogPosts = Array.isArray(blogPostsRes) ? blogPostsRes : (blogPostsRes.results || []);
    console.log(`Loaded ${blogPosts.length} blog posts.`);
    blogPosts.forEach((post) => {
      if (post.slug) {
        urls.push({
          loc: `${BASE_URL}/blog/${post.slug}`,
          lastmod: formatDate(post.updated_at || post.published_date),
          changefreq: 'weekly',
          priority: '0.7',
        });
      }
    });
  }

  // 5. Fetch Dynamic Products
  console.log('Fetching products from API...');
  const productsRes = await fetchJson(`${API_BASE_URL}/products/`);
  if (productsRes) {
    const products = Array.isArray(productsRes) ? productsRes : (productsRes.results || []);
    console.log(`Loaded ${products.length} products.`);
    products.forEach((product) => {
      if (product.slug) {
        urls.push({
          loc: `${BASE_URL}/products/${product.slug}`,
          lastmod: formatDate(product.updated_at),
          changefreq: 'daily',
          priority: '0.7',
        });
      }
    });
  }

  // 6. Fetch Dynamic Digital Assets
  console.log('Fetching digital assets from API...');
  const digitalAssetsRes = await fetchJson(`${API_BASE_URL}/digital-assets/`);
  if (digitalAssetsRes) {
    const digitalAssets = Array.isArray(digitalAssetsRes) ? digitalAssetsRes : (digitalAssetsRes.results || []);
    console.log(`Loaded ${digitalAssets.length} digital assets.`);
    digitalAssets.forEach((asset) => {
      if (asset.slug) {
        urls.push({
          loc: `${BASE_URL}/digital-asset/${asset.slug}`,
          lastmod: formatDate(asset.updated_at),
          changefreq: 'daily',
          priority: '0.7',
        });
      }
    });
  }

  // Generate XML Content
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  urls.forEach((url) => {
    xml += '  <url>\n';
    xml += `    <loc>${escapeXml(url.loc)}</loc>\n`;
    if (url.lastmod || currentDate) {
      xml += `    <lastmod>${url.lastmod || currentDate}</lastmod>\n`;
    }
    if (url.changefreq) {
      xml += `    <changefreq>${url.changefreq}</changefreq>\n`;
    }
    if (url.priority) {
      xml += `    <priority>${url.priority}</priority>\n`;
    }
    xml += '  </url>\n';
  });

  xml += '</urlset>\n';

  // Ensure output directory exists and write sitemap
  const publicDir = path.join(__dirname, '..', 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const sitemapPath = path.join(publicDir, 'sitemap.xml');
  fs.writeFileSync(sitemapPath, xml, 'utf8');
  console.log(`Sitemap successfully written to: ${sitemapPath}`);
  console.log(`Total URLs indexed: ${urls.length}`);
}

generate().catch((err) => {
  console.error('Fatal error during sitemap generation:', err);
  process.exit(1);
});
