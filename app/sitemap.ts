import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return ['/about', '/work', '/misc', '/contact'].map(path => ({
    url: new URL(path, 'https://nickkim.dev').href,
    changeFrequency: 'monthly',
  }))
}
