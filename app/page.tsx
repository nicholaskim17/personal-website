import Header from '@/components/Header'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Research from '@/components/Research'
import Work from '@/components/Work'
import Projects from '@/components/Projects'
import Hobbies from '@/components/Hobbies'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <>
      <a id="top" className="sr-only" aria-hidden="true" />
      <Header />
      <main id="main">
        <Hero />
        <About />
        <div id="experience">
          <Research />
          <Work />
          <Projects />
        </div>
        <Hobbies />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
