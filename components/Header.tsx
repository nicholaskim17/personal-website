'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Github, Guitar, Linkedin, Mail } from 'lucide-react'
import { hero, navLinks, site, socialLinks } from '@/lib/data'
import ThemeToggle from './ThemeToggle'
import XBrandIcon from './XBrandIcon'

const iconFor = { github: Github, linkedin: Linkedin, x: XBrandIcon } as const

export default function Header({ landing = false }: { landing?: boolean }) {
  const pathname = usePathname()
  const portraitSizes = landing ? "(max-width: 479px) 180px, 288px" : "(min-width: 800px) 256px, 1px"
  const name = (
    <span className="name-mark" aria-hidden="true">
      {hero.name}
      <span className="name-mark-flourish">
        <Guitar className="name-mark-guitar" strokeWidth={1.5} />
      </span>
    </span>
  )

  return (
    <header className={landing ? "site-sidebar landing-header" : "site-sidebar"}>
      <div className="sidebar-tools"><ThemeToggle /></div>
      <div className="sidebar-identity">
        {landing ? (
          <h1 className="sidebar-name"><span className="sr-only">{hero.name}</span>{name}</h1>
        ) : (
          <Link href="/" className="sidebar-name" aria-label={`${hero.name}, home`}>{name}</Link>
        )}
        <p className="sidebar-caption">engineering @ waterloo</p>
        <div className="sidebar-socials" aria-label="Social links">
          <a href={`mailto:${site.email}`} aria-label="Email Nick"><Mail size={17} aria-hidden="true" /></a>
          {socialLinks.map(({ label, href, icon }) => {
            const Icon = iconFor[icon]
            return <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}><Icon size={17} aria-hidden="true" /></a>
          })}
        </div>
        <nav aria-label="Primary navigation" className="sidebar-nav">
          <ul>
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <Link href={href} aria-current={href === pathname ? 'page' : undefined}>{label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <figure className="sidebar-portrait">
        <div className="portrait-frame">
          <Image src={hero.portraitSrc} alt={hero.portraitAlt} fill sizes={portraitSizes} priority className="portrait-photo" />
          <Image src={hero.hoverPortraitSrc} alt="" fill sizes={portraitSizes} className="portrait-alt" />
        </div>
      </figure>
    </header>
  )
}
