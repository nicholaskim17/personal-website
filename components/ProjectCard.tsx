import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import type { Project } from '@/lib/data'

export default function ProjectCard({ project }: { project: Project }) {
  const links = [
    { href: project.sourceHref, label: project.sourceLabel ?? 'Source' },
    { href: project.demoHref, label: project.demoLabel ?? 'Demo' },
    { href: project.devpostHref, label: 'Devpost' },
    { href: project.imageHref, label: 'Project link' },
  ].filter((link, index, all) => link.href && index === all.findIndex(other => other.href === link.href))

  return (
    <article className="project-card">
      {(project.image || project.video) && (
        <div className="project-media">
          {project.video ? (
            <video
              src={project.video}
              poster={project.poster}
              aria-label={`${project.title} project video`}
              className="h-full w-full object-contain"
              autoPlay
              muted
              loop
              playsInline
            />
          ) : project.image && (
            <Image
              src={project.image}
              alt={project.imageAlt ?? `${project.title} project preview`}
              fill
              sizes="(min-width: 1160px) 400px, (min-width: 620px) 46vw, 100vw"
              className="object-contain"
            />
          )}
        </div>
      )}
      <div className="project-title">
        <h3>{project.title}</h3>
        {project.year != null && <span className="work-date">{project.year}</span>}
      </div>
      <p>{project.description}</p>
      {project.result && <p className="project-result">{project.result}</p>}
      <p className="work-tags">{project.tags.join(' · ')}</p>
      {links.length > 0 && (
        <div className="project-links">
          {links.map(({ href, label }) => (
            <a className="inline-link" key={href} href={href} target="_blank" rel="noreferrer" aria-label={`${project.title}: ${label}`}>
              {label} <ArrowUpRight size={13} aria-hidden="true" />
            </a>
          ))}
        </div>
      )}
    </article>
  )
}
