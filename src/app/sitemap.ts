import { MetadataRoute } from 'next'
import { getAllArticles, getArticleUrl } from '@/lib/data'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const allArticles = await getAllArticles()
  const baseUrl = 'https://advancebass.com'

  const articles = allArticles.map((article) => ({
    url: `${baseUrl}${getArticleUrl(article)}`,
    lastModified: new Date(article.date),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  const routes = [
    '',
    '/contact',
    '/transcriptions',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 1.0,
  }))

  return [...routes, ...articles]
}
