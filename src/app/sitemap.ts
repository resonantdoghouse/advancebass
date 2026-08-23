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

  const serviceRoutes = [
    '',
    '/bass-lessons',
    '/bassist-for-hire',
    '/recording',
    '/contact',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 1.0,
  }))

  const contentRoutes = [
    '/transcriptions',
    '/tools',
    '/tools/metronome',
    '/tools/tuner',
    '/tools/arpeggio-visualizer',
    '/tools/scale-visualizer',
    '/tools/circle-of-fifths',
    '/tools/ear-training',
    '/tools/drum-machine',
    '/tools/video-looper',
    '/tools/fretboard-lab',
    '/tools/fretboard-trainer',
    '/tools/practice-routine',
    '/tools/string-tension-calculator',
    '/tools/strudel-generator',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [...serviceRoutes, ...contentRoutes, ...articles]
}
