import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { research } from '@/lib/data'
import SectionHeading from './SectionHeading'

const SELF = 'Nicholas Kim'

export default function Research() {
  return (
    <section id="research" className="folio-section">
      <SectionHeading>Research</SectionHeading>
      <ol className="research-list">
        {research.map(paper => (
          <li key={paper.href}>
            <article className="research-paper">
              <div className="research-meta">
                {paper.highlight && (
                  <span className="research-venue">
                    <Image src={paper.highlight.venue.logo} alt="" width={17} height={17} />
                    {paper.highlight.label}{' '}
                    <a className="inline-link" href={paper.highlight.venue.href} target="_blank" rel="noreferrer">{paper.highlight.venue.name}</a>
                  </span>
                )}
                <span className="work-date">{paper.year}</span>
              </div>
              <h3><a className="inline-link" href={paper.href} target="_blank" rel="noreferrer">{paper.title}<ArrowUpRight size={16} aria-hidden="true" /></a></h3>
              <p className="paper-authors">
                {paper.authors.split(SELF).map((part, i) => (
                  <span key={i}>{i > 0 && <strong>{SELF}</strong>}{part}</span>
                ))}
                <span className="author-note">{paper.authorNote}</span>
              </p>
              <p className="work-tags">{paper.venue}</p>
              <p>{paper.description}</p>
            </article>
          </li>
        ))}
      </ol>
    </section>
  )
}
