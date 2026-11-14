import { ArrowUpRight } from 'lucide-react'
import { research } from '@/lib/data'
import Organization from './Organization'

export default function Research() {
  return research.map(paper => (
    <article key={paper.href} className="experience-item-heading research-entry">
      <div>
        <p>
          {paper.authorNote} on{' '}
          <a className="research-paper-link" href={paper.href} target="_blank" rel="noreferrer">
            “{paper.title}”{'\u00a0'}<ArrowUpRight size={15} aria-hidden="true" />
          </a>
        </p>
        {paper.highlight && (
          <p className="research-acceptance">
            {paper.highlight.label}{' '}
            <Organization {...paper.highlight.venue} compact />
            {' in Paris, France'}
          </p>
        )}
      </div>
      <time className="work-date" dateTime={paper.dateTime}>{paper.dateLabel}</time>
    </article>
  ))
}
