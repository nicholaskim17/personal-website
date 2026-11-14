import Image from 'next/image'
import { research } from '@/lib/data'

export default function Research() {
  return research.map(paper => (
    <p key={paper.href} className="research-entry">
      <a className="inline-link" href={paper.href} target="_blank" rel="noreferrer" title={paper.title}>
        {paper.authorNote}
      </a>
      {paper.highlight && (
        <>
          {' at '}
          <a className="org-highlight" data-tone="violet" href={paper.highlight.venue.href} target="_blank" rel="noreferrer">
            <Image src={paper.highlight.venue.logo} alt="" width={16} height={16} />
            {paper.highlight.venue.name}
          </a>
        </>
      )}
    </p>
  ))
}
