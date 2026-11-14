import About from './About'
import Research from './Research'
import Work from './Work'

export default function AboutPage() {
  return (
    <>
      <About />
      <div id="experience">
        <Work />
        <Research />
      </div>
    </>
  )
}
