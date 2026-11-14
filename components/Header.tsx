'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Github, Linkedin, Mail } from 'lucide-react'
import { hero, navLinks, site, socialLinks } from '@/lib/data'
import LogoGuitar from './LogoGuitar'
import PortraitTrack from './PortraitTrack'
import ThemeToggle from './ThemeToggle'
import XBrandIcon from './XBrandIcon'

const iconFor = { github: Github, linkedin: Linkedin, x: XBrandIcon } as const
const soundWavePaths = [
  'M 3 -3 Q 6 0 3 3',
  'M 6.5 -5.5 Q 11.5 0 6.5 5.5',
  'M 10 -8 Q 17 0 10 8',
]

export default function Header({ landing = false }: { landing?: boolean }) {
  const pathname = usePathname()
  const portraitSizes = landing ? "(max-width: 479px) 180px, 288px" : "(min-width: 800px) 256px, 1px"

  return (
    <header className={landing ? "site-sidebar landing-header" : "site-sidebar"}>
      <div className="sidebar-tools"><ThemeToggle /></div>
      <div className="sidebar-identity">
        <div className="sidebar-brand">
          <div className="sidebar-brand-name">
            {landing ? (
              <h1 className="sidebar-name">{hero.name}</h1>
            ) : (
              <Link href="/" className="sidebar-name" aria-label={`${hero.name}, home`}>{hero.name}</Link>
            )}
            <div className="sidebar-socials" aria-label="Social links">
              <a href={`mailto:${site.email}`} aria-label="Email Nick"><Mail size={17} aria-hidden="true" /></a>
              {socialLinks.map(({ label, href, icon }) => {
                const Icon = iconFor[icon]
                return <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}><Icon size={17} aria-hidden="true" /></a>
              })}
            </div>
          </div>
          <LogoGuitar />
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
        <PortraitTrack />
        <div className="portrait-frame">
          <Image src={hero.portraitSrc} alt={hero.portraitAlt} fill sizes={portraitSizes} priority unoptimized className="portrait-photo" />
          <svg className="portrait-sound-waves" viewBox="0 0 100 100" aria-hidden="true">
            <g transform="translate(34 43) scale(-1 1)">
              {soundWavePaths.map(path => <path key={path} d={path} />)}
            </g>
            <g transform="translate(68 43)">
              {soundWavePaths.map(path => <path key={path} d={path} />)}
            </g>
          </svg>
        </div>
      </figure>
    </header>
  )
}
