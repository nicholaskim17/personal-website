import Reveal from './Reveal'
import TrainingCard from './hobbies/TrainingCard'
import LastWorkoutCard from './hobbies/LastWorkoutCard'
import GuitarCard from './hobbies/GuitarCard'

export default function Hobbies() {
  return (
    <section id="hobbies" className="px-6 py-20 md:px-10 md:py-24">
      <div className="mx-auto max-w-content">
        <Reveal>
          <h2 className="font-playfair text-2xl font-semibold text-ink">Hobbies</h2>
        </Reveal>

        <div className="mt-10 grid items-start gap-x-8 gap-y-10 md:grid-cols-3">
          <Reveal>
            <TrainingCard />
          </Reveal>

          <Reveal>
            <LastWorkoutCard />
          </Reveal>

          <Reveal>
            <GuitarCard />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
