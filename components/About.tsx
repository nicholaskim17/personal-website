import { about, hero } from '@/lib/data'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import SectionHeading from './SectionHeading'

const mentions = [about.waterloo, about.watAI]
const mentionPattern = new RegExp(`(${mentions.map(({ name }) => name.replaceAll('.', '\\.')).join('|')})`, 'g')

export default function About() {
  return (
    <section id="about" className="folio-section about-section">
      <SectionHeading level={1}>{`${hero.greeting} ${hero.name}.`}</SectionHeading>
      <p className="intro-line">{hero.tagline}</p>
      <div className="about-copy">
        {about.paragraphs.map((paragraph, index) => (
          <p key={paragraph}>
            {paragraph.split(mentionPattern).map((segment, i) => {
              const mention = mentions.find(({ name }) => name === segment)
              return mention
                ? (
                  <a key={i} className="org-highlight" data-tone={mention.highlight} href={mention.href} target="_blank" rel="noreferrer">
                    <Image src={mention.logo} alt="" width={16} height={16} />
                    {segment}
                  </a>
                )
                : segment
            })}
            {index === about.paragraphs.length - 1 && (
              <> <Link className="inline-link" href={about.hobbiesCta.href}>{about.hobbiesCta.label}<ArrowUpRight size={13} aria-hidden="true" /></Link></>
            )}
          </p>
        ))}
      </div>
      <div className="about-interests">
        <h2>{about.exploring.heading}</h2>
        <ul>
          {about.exploring.items.map(item => <li key={item}>{item}</li>)}
        </ul>
      </div>
      <div className="about-actions">
        {[hero.primaryCta, hero.secondaryCta].map(({ href, label }) => (
          <Link className="inline-link" key={href} href={href}>{label}<ArrowUpRight size={14} aria-hidden="true" /></Link>
        ))}
      </div>
    </section>
  )
}
