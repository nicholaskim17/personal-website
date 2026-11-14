import { about } from '@/lib/data'
import Image from 'next/image'
import SectionHeading from './SectionHeading'
import TrainingCard from './hobbies/TrainingCard'
import LastWorkoutCard from './hobbies/LastWorkoutCard'
import GuitarCard from './hobbies/GuitarCard'

export default function Hobbies() {
  return (
    <section id="hobbies" className="folio-section">
      <SectionHeading level={1}>Touching Grass</SectionHeading>
      <div className="hobbies-grid">
        <TrainingCard />
        <LastWorkoutCard />
        <GuitarCard />
      </div>
      <h3 className="gallery-title">Recently</h3>
      <div className="gallery-grid">
        {about.gallery.map(photo => (
          <div className="gallery-photo" key={photo.src}>
            <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 1160px) 260px, (min-width: 620px) 31vw, 50vw" className="object-cover" />
          </div>
        ))}
      </div>
    </section>
  )
}
