import { about, work, type WorkEntry } from '@/lib/data'
import Organization from './Organization'
import Research from './Research'

const currentRoles = work.filter(entry => entry.current)
const previousRoles = work.filter(entry => !entry.current)

function WorkItem({ entry }: { entry: WorkEntry }) {
  return (
    <li>
      <div className="experience-item-heading">
        <p>
          {entry.title} at{' '}
          <Organization
            name={entry.organization}
            href={entry.organizationHref}
            logo={entry.logo}
            highlight={entry.highlight}
            compact={!entry.current}
          />
        </p>
        {entry.dates && <p className="work-date">{entry.dates}</p>}
      </div>
    </li>
  )
}

export default function Work() {
  return (
    <div id="work">
      <section className="experience-group" aria-labelledby="currently">
        <h2 id="currently">Currently</h2>
        <ul className="experience-list">
          <li>Studying Engineering at the <Organization {...about.waterloo} /></li>
          {currentRoles.map(entry => <WorkItem key={entry.organization} entry={entry} />)}
        </ul>
      </section>
      <section className="experience-group" aria-labelledby="previously">
        <h2 id="previously">Previously</h2>
        <ul className="experience-list">
          <li id="research"><Research /></li>
          <li>7× Hackathon Winner</li>
          {previousRoles.map(entry => <WorkItem key={entry.organization} entry={entry} />)}
        </ul>
      </section>
    </div>
  )
}
