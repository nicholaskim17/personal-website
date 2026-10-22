import Image from 'next/image'
import { ArrowUpRight, Award } from 'lucide-react'
import { research } from '@/lib/data'
import Reveal from './Reveal'

const SELF = 'Nicholas Kim'

function Authors({ authors }: { authors: string }) {
  return (
    <>
      {authors.split(SELF).map((part, i) => (
        <span key={i}>
          {i > 0 && <span className="font-semibold text-ink">{SELF}</span>}
          {part}
        </span>
      ))}
    </>
  )
}

export default function Research() {
  return (
    <section id="research" className="px-6 py-20 md:px-10 md:py-24">
      <div className="mx-auto max-w-content">
        <Reveal>
          <h2 className="font-playfair text-2xl font-semibold text-ink">Research</h2>
        </Reveal>

        <ol className="mt-10 divide-y divide-border border-y border-border">
          {research.map((paper, i) => (
            <li key={paper.title}>
              <Reveal delay={Math.min(i, 4) * 0.08}>
                <article className="py-7 md:py-8">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    {paper.highlight ? (
                      <p className="inline-flex flex-wrap items-center gap-2 rounded-full bg-accent-soft px-3.5 py-1.5 text-sm font-medium text-ink">
                        <Award size={16} aria-hidden="true" className="text-accent-strong" />
                        {paper.highlight.label}
                        <a
                          href={paper.highlight.venue.href}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 font-semibold text-ink underline decoration-border underline-offset-4 transition-colors hover:text-accent hover:decoration-accent focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                        >
                          <span className="relative inline-block h-5 w-5 overflow-hidden rounded-sm bg-white">
                            <Image src={paper.highlight.venue.logo} alt="" fill sizes="20px" className="object-contain" />
                          </span>
                          {paper.highlight.venue.name}
                        </a>
                      </p>
                    ) : (
                      <span />
                    )}
                    <span className="text-sm text-ink-faint">{paper.year}</span>
                  </div>

                  <h3 className="mt-5 max-w-3xl font-playfair text-2xl font-semibold leading-tight text-ink md:text-3xl">
                    {paper.title}
                  </h3>

                  <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
                    <p className="text-sm leading-6 text-ink-muted md:text-base">
                      <Authors authors={paper.authors} />
                    </p>
                    <span className="rounded-full border border-border px-2.5 py-1 text-xs font-medium text-ink-faint">
                      {paper.authorNote}
                    </span>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-ink-faint md:text-base">{paper.venue}</p>
                  <p className="mt-3 max-w-3xl text-sm leading-6 text-ink-muted md:text-base">
                    {paper.description}
                  </p>

                  <a
                    href={paper.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group mt-6 inline-flex items-center gap-1 text-sm font-medium text-ink underline decoration-border underline-offset-4 transition-colors hover:text-accent hover:decoration-accent focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    Read paper
                    <ArrowUpRight
                      size={15}
                      aria-hidden="true"
                      className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none"
                    />
                  </a>
                </article>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
