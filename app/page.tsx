import Footer from '@/components/Footer'
import Header from '@/components/Header'
import LegacyLinks from '@/components/LegacyLinks'

export default function Home() {
  return (
    <div className="landing-page">
      <LegacyLinks />
      <main id="main" tabIndex={-1}>
        <Header landing />
      </main>
      <Footer landing />
    </div>
  )
}
