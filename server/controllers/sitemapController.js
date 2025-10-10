import expressAsnc from 'express-async-handler';
import Accommodations from '../models/accommodationsModels.js';
import MarketingMaterials from '../models/marketingMaterialsModels.js';

const DOMAIN = process.env.SITE_DOMAIN || 'https://john-cezar-waterfun-resort.com';

export const getSitemap = expressAsnc(async (req, res) => {
  // Static pages to include
  const staticUrls = [
    '/',
    '/about-us',
    '/contact-us',
    '/book-now',
    '/faqs',
    '/accommodations',
    '/amenities',
    '/articles',
    '/book-a-reservation',
    '/payment-result',
    '/policies',
    '/gallery',
    '/resort-rates'
  ];

  // Fetch dynamic entries (limit to avoid huge sitemaps)
  const accommodations = await Accommodations.find({ status: 'POSTED' }).select('_id updatedAt').limit(1000).lean();
  const materials = await MarketingMaterials.find({ status: 'POSTED' }).select('_id updatedAt').limit(1000).lean();

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  const pushUrl = (loc, lastmod, priority = 0.5, changefreq = 'monthly') => {
    xml += '  <url>\n';
    xml += `    <loc>${DOMAIN}${loc}</loc>\n`;
    if (lastmod) xml += `    <lastmod>${new Date(lastmod).toISOString()}</lastmod>\n`;
    xml += `    <changefreq>${changefreq}</changefreq>\n`;
    xml += `    <priority>${priority}</priority>\n`;
    xml += '  </url>\n';
  };

  // static
  staticUrls.forEach((u) => pushUrl(u, new Date(), 0.7, 'weekly'));

  // accommodations
  accommodations.forEach((a) => {
    pushUrl(`/accommodations/details/${a._id}`, a.updatedAt, 0.8, 'weekly');
  });

  // marketing materials (articles)
  materials.forEach((m) => {
    pushUrl(`/articles/details/${m._id}`, m.updatedAt, 0.7, 'weekly');
  });

  xml += '</urlset>';

  res.header('Content-Type', 'application/xml');
  res.send(xml);
});

export default getSitemap;
