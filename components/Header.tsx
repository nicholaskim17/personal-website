'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Github, Linkedin, Mail } from 'lucide-react'
import { hero, navLinks, site, socialLinks } from '@/lib/data'
import ThemeToggle from './ThemeToggle'
import XBrandIcon from './XBrandIcon'

const iconFor = { github: Github, linkedin: Linkedin, x: XBrandIcon } as const

export default function Header() {
  const pathname = usePathname()
  const activePath = pathname === '/' ? '/about' : pathname

  return (
    <header className="site-sidebar">
      <div className="sidebar-tools"><ThemeToggle /></div>
      <div className="sidebar-identity">
        <Link href="/about" className="sidebar-name">{hero.name.toLowerCase()}<span>.</span></Link>
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
                <Link href={href} aria-current={href === activePath ? 'page' : undefined}>{label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <figure className="sidebar-portrait">
        <div className="portrait-frame">
          <Image src={hero.portraitSrc} alt={hero.portraitAlt} fill sizes="(min-width: 800px) 256px, 1px" priority className="portrait-photo" />
          <Image src={hero.hoverPortraitSrc} alt="" fill sizes="(min-width: 800px) 256px, 1px" className="portrait-alt" />
        </div>
      </figure>
    </header>
  )
}
