import { about } from '@/lib/data'
import SectionHeading from './SectionHeading'
import RecentGallery from './RecentGallery'
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
      <RecentGallery photos={about.gallery} />
    </section>
  )
}
