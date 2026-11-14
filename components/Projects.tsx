import { projects } from '@/lib/data'
import ProjectCard from './ProjectCard'
import SectionHeading from './SectionHeading'

export default function Projects() {
  return (
    <section id="projects" className="folio-section">
      <SectionHeading level={1}>Coding projects</SectionHeading>
      <div className="project-grid">
        {projects.map(project => <ProjectCard key={project.title} project={project} />)}
      </div>
    </section>
  )
}
