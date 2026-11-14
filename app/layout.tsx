import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import ThemeProvider from '@/components/ThemeProvider'
import { site } from '@/lib/data'
import '@fontsource/bitcount-prop-single/latin-400.css'
import './globals.css'
import { Analytics } from "@vercel/analytics/next"

export const metadata: Metadata = {
  metadataBase: new URL('https://nickkim.dev'),
  title: 'Nick Kim\'s Portfolio',
  description: site.description,
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [{ url: '/images/silversurfer.webp', type: 'image/webp', sizes: '640x640' }],
    shortcut: '/images/silversurfer.webp',
    apple: '/images/silversurfer.webp',
  },
  openGraph: {
    title: 'Nick Kim\'s Portfolio',
    description: site.description,
    url: 'https://nickkim.dev',
    type: 'website',
    images: [{ url: '/images/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nick Kim\'s Portfolio',
    description: site.description,
    images: ['/images/og-image.png'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <body className="min-h-screen bg-surface text-ink antialiased">
        <ThemeProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-white"
          >
            Skip to content
          </a>
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
