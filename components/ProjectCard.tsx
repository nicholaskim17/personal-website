import Image from 'next/image'
import { ExternalLink, Github } from 'lucide-react'
import type { Project } from '@/lib/data'

interface ProjectCardProps {
  project: Project
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const imageSizes = '(min-width: 1248px) 560px, (min-width: 768px) 45vw, 100vw'
  const imageActionHref =
    project.imageHref &&
    ![project.sourceHref, project.demoHref, project.devpostHref].includes(project.imageHref)
      ? project.imageHref
      : undefined
  const image = (
    <div className="relative aspect-video overflow-hidden border border-border bg-surface-raised">
      <Image
        src={project.image}
        alt={project.imageAlt}
        fill
        sizes={imageSizes}
        className="object-contain"
      />
    </div>
  )

  return (
    <article className="min-w-0">
      {image}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <h3 className="font-sans text-2xl font-bold tracking-tight text-ink">{project.title}</h3>

        <div className="flex items-center gap-4 text-ink-muted">
          {project.sourceHref && (
            <a
              href={project.sourceHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.title} ${project.sourceLabel ?? 'source'}`}
              className="transition-colors hover:text-accent"
            >
              <Github size={22} aria-hidden="true" />
            </a>
          )}
          {project.demoHref && (
            <a
              href={project.demoHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.title} ${project.demoLabel ?? 'live demo'}`}
              className="transition-colors hover:text-accent"
            >
              <ExternalLink size={22} aria-hidden="true" />
            </a>
          )}
          {project.devpostHref && (
            <a
              href={project.devpostHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.title} on Devpost`}
              className="transition-colors hover:text-accent"
            >
              <ExternalLink size={22} aria-hidden="true" />
            </a>
          )}
          {imageActionHref && (
            <a
              href={imageActionHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.title} project link`}
              className="transition-colors hover:text-accent"
            >
              <ExternalLink size={22} aria-hidden="true" />
            </a>
          )}
          {project.year != null && <span className="text-base text-ink-muted">{project.year}</span>}
        </div>
      </div>

      <div className="mt-3 text-base leading-7 text-ink-muted md:text-lg">
        <p>{project.description}</p>
        {project.result && <p className="mt-1">{project.result}</p>}
      </div>
    </article>
  )
}
