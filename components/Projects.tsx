import { projects } from '@/lib/data'
import ProjectCard from './ProjectCard'
import Reveal from './Reveal'

export default function Projects() {
  return (
    <section id="projects" className="px-6 py-20 md:px-10 md:py-24">
      <div className="mx-auto max-w-content">
        <Reveal>
          <h2 className="font-playfair text-2xl font-semibold text-ink">Projects</h2>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-x-10 gap-y-14 md:grid-cols-2 md:gap-y-16">
          {projects.map(project => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </div>
      </div>
    </section>
  )
}
