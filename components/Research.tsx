import Image from 'next/image'
import { research } from '@/lib/data'

export default function Research() {
  return research.map(paper => (
    <article key={paper.href} className="research-entry">
      <p>
        {paper.authorNote} on{' '}
        <a className="inline-link" href={paper.href} target="_blank" rel="noreferrer">
          {paper.title}
        </a>
      </p>
      {paper.highlight && (
        <p className="research-acceptance">
          {paper.highlight.label}{' '}
          <a className="org-highlight" data-tone="violet" href={paper.highlight.venue.href} target="_blank" rel="noreferrer">
            <Image src={paper.highlight.venue.logo} alt="" width={16} height={16} />
            {paper.highlight.venue.name}
          </a>
          {' in Paris, France'}
        </p>
      )}
    </article>
  ))
}
