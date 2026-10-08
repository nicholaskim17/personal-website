import { research } from '@/lib/data'
import Reveal from './Reveal'

export default function Research() {
  return (
    <section id="research" className="px-6 py-20 md:px-10 md:py-24">
      <div className="mx-auto max-w-content">
        <Reveal>
          <h2 className="font-playfair text-2xl font-semibold text-ink">Research</h2>
        </Reveal>

        <ol className="mt-10 divide-y divide-border border-y border-border">
          {research.map(paper => (
            <li key={paper.title} className="py-7 md:py-8">
              <article>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <h3 className="font-playfair text-xl font-semibold text-ink">
                    <a
                      href={paper.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-colors hover:text-accent"
                    >
                      {paper.title}
                    </a>
                  </h3>
                  <span className="text-sm text-ink-faint">{paper.year}</span>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
                  <p className="text-sm leading-6 text-ink-muted md:text-base">{paper.authors}</p>
                  <span className="rounded-full border border-border px-2.5 py-1 text-xs font-medium text-ink-faint">
                    {paper.authorNote}
                  </span>
                </div>

                <p className="mt-3 text-sm leading-6 text-ink-faint md:text-base">{paper.venue}</p>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-ink-muted md:text-base">
                  {paper.description}
                </p>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
