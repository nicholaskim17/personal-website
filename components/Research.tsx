import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { research } from '@/lib/data'

const SELF = 'Nicholas Kim'

export default function Research() {
  return research.map(paper => (
    <article key={paper.href} className="research-entry">
      <div className="experience-item-heading">
        <p>
          Co-authored{' '}
          <a className="inline-link" href={paper.href} target="_blank" rel="noreferrer">
            {paper.title}<ArrowUpRight size={14} aria-hidden="true" />
          </a>
        </p>
        <p className="work-date">{paper.year}</p>
      </div>
      <p className="experience-detail">{paper.description}</p>
      <p className="work-tags">
        {paper.authors.split(SELF).map((part, i) => (
          <span key={i}>{i > 0 && <strong>{SELF}</strong>}{part}</span>
        ))}
        <span className="author-note">{paper.authorNote}</span>
      </p>
      {paper.highlight && (
        <p className="work-tags">
          {paper.highlight.label}{' '}
          <a className="org-highlight" data-tone="violet" href={paper.highlight.venue.href} target="_blank" rel="noreferrer">
            <Image src={paper.highlight.venue.logo} alt="" width={16} height={16} />
            {paper.highlight.venue.name}
          </a>
          {' · '}{paper.venue}
        </p>
      )}
    </article>
  ))
}
