import Image from 'next/image'
import { work } from '@/lib/data'
import Reveal from './Reveal'

export default function Work() {
  return (
    <section id="work" className="px-6 py-20 md:px-10 md:py-24">
      <div className="mx-auto max-w-content">
        <Reveal>
          <h2 className="font-playfair text-2xl font-semibold text-ink">Work</h2>
        </Reveal>

        <ol className="mt-10 divide-y divide-border border-y border-border">
          {work.map(entry => (
            <li
              key={`${entry.organization}-${entry.title}`}
              className="grid gap-3 py-7 md:grid-cols-[minmax(0,1fr)_12rem] md:gap-8 md:py-8"
            >
              <div>
                <h3 className="font-playfair text-xl font-semibold text-ink">
                  {entry.title}{' '}
                  <span className="font-sans text-base font-normal text-ink-faint">at</span>{' '}
                  <span className="inline-flex items-center gap-2 align-middle">
                    <span className="relative inline-block h-6 w-6 shrink-0 overflow-hidden rounded-sm bg-white align-middle">
                      <Image
                        src={entry.logo}
                        alt={entry.organizationHref ? '' : entry.logoAlt}
                        fill
                        sizes="24px"
                        className="object-contain"
                      />
                    </span>
                    {entry.organizationHref ? (
                      <a
                        href={entry.organizationHref}
                        target="_blank"
                        rel="noreferrer"
                        className="underline decoration-border underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
                      >
                        {entry.organization}
                      </a>
                    ) : (
                      entry.organization
                    )}
                  </span>
                </h3>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-ink-muted md:text-base">
                  {entry.description}
                </p>
                <p className="mt-3 text-sm text-ink-faint">{entry.tags.join(' · ')}</p>
              </div>
              <p className="text-sm text-ink-faint md:pt-1 md:text-right">{entry.dates}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
