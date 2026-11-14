import { hero } from '@/lib/data'
import SectionHeading from './SectionHeading'
import Work from './Work'

export default function AboutPage() {
  return (
    <section id="about" className="folio-section">
      <SectionHeading level={1}>{`${hero.greeting} ${hero.name}.`}</SectionHeading>
      <div id="experience">
        <Work />
      </div>
    </section>
  )
}
