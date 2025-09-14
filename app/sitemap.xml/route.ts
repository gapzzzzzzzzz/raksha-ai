import { MetadataRoute } from 'next'

export async function GET(): Promise<Response> {
  const sitemap: MetadataRoute.Sitemap = [
    {
      url: 'https://raksha-ai-lac.vercel.app',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: 'https://raksha-ai-lac.vercel.app/triage',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: 'https://raksha-ai-lac.vercel.app/lite',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: 'https://raksha-ai-lac.vercel.app/privacy',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: 'https://raksha-ai-lac.vercel.app/disclaimer',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemap.map(item => `  <url>
    <loc>${item.url}</loc>
    <lastmod>${item.lastModified instanceof Date ? item.lastModified.toISOString() : item.lastModified}</lastmod>
    <changefreq>${item.changeFrequency}</changefreq>
    <priority>${item.priority}</priority>
  </url>`).join('\n')}
</urlset>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  })
}
