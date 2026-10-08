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
  const media = (
    <div className="relative aspect-video overflow-hidden border border-border bg-surface-raised">
      {project.video ? (
        <video
          src={project.video}
          aria-label={`${project.title} project video`}
          className="h-full w-full object-contain"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        />
      ) : project.image ? (
        <Image
          src={project.image}
          alt={project.imageAlt ?? `${project.title} project preview`}
          fill
          sizes={imageSizes}
          className="object-contain"
        />
      ) : null}
    </div>
  )

  return (
    <article className="min-w-0">
      {media}

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
        <div className="flex items-center gap-3">
          <h3 className="font-sans text-2xl font-bold tracking-tight text-ink">{project.title}</h3>
          {project.year != null && <span className="text-sm text-ink-faint">{project.year}</span>}
        </div>

        <div className="ml-auto flex items-center gap-4 text-ink-muted">
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
        </div>
      </div>

      <div className="mt-3 text-base leading-7 text-ink-muted md:text-lg">
        <p>{project.description}</p>
        {project.result && <p className="mt-1">{project.result}</p>}
      </div>
    </article>
  )
}
