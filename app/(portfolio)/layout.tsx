'use client'

import { usePathname } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  const landing = usePathname() === '/'

  return (
    <div className={landing ? 'landing-page' : 'site-shell'} id={landing ? undefined : 'top'}>
      <div
        className={landing ? 'landing-main' : 'site-header'}
        id={landing ? 'main' : undefined}
        role={landing ? 'main' : undefined}
        tabIndex={landing ? -1 : undefined}
      >
        <Header landing={landing} />
        {landing && children}
      </div>
      {landing ? <Footer landing /> : (
        <div className="site-content">
          <main id="main" tabIndex={-1}>{children}</main>
          <Footer />
        </div>
      )}
    </div>
  )
}
