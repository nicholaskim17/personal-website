import Image from 'next/image'
import { work } from '@/lib/data'
import SectionHeading from './SectionHeading'

export default function Work() {
  return (
    <section id="work" className="folio-section">
      <SectionHeading>Past and present</SectionHeading>
      <ol className="work-timeline">
        {work.map(entry => (
          <li key={entry.organization}>
            <div className="work-mark">
              <Image src={entry.logo} alt="" fill sizes="38px" />
            </div>
            <div className="work-entry">
              <div className="work-entry-heading">
                <h3>{entry.title}{' '}<span>at</span>{' '}
                  {entry.organizationHref
                    ? <a className="inline-link" href={entry.organizationHref} target="_blank" rel="noreferrer">{entry.organization}</a>
                    : entry.organization}
                </h3>
                <p className="work-date">{entry.dates}</p>
              </div>
              <p className="work-description">{entry.description}</p>
              <p className="work-tags">{entry.tags.join(' · ')}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
