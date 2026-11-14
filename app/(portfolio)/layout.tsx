import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="site-shell" id="top">
      <Header />
      <div className="site-content">
        <main id="main" tabIndex={-1}>{children}</main>
        <Footer />
      </div>
    </div>
  )
}
