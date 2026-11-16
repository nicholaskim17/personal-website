'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Github, Linkedin, Mail, Menu, X } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import { hero, navLinks, site, socialLinks } from '@/lib/data'
import LogoGuitar from './LogoGuitar'
import PortraitSoundWaves from './PortraitSoundWaves'
import PortraitTrack from './PortraitTrack'
import ThemeToggle from './ThemeToggle'
import XBrandIcon from './XBrandIcon'

const iconFor = { github: Github, linkedin: Linkedin, x: XBrandIcon } as const
const mobileLinks = [{ href: '/', label: 'Home' }, ...navLinks]

function SocialLinks() {
  return (
    <div className="sidebar-socials" aria-label="Social links">
      <a href={`mailto:${site.email}`} aria-label="Email Nick"><Mail size={17} aria-hidden="true" /></a>
      {socialLinks.map(({ label, href, icon }) => {
        const Icon = iconFor[icon]
        return <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}><Icon size={17} aria-hidden="true" /></a>
      })}
    </div>
  )
}

function MobileNavigation({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false)
  const menu = useRef<HTMLDivElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const panelId = useId()

  useEffect(() => {
    if (!open) return

    function closeOnOutsidePress(event: PointerEvent) {
      if (event.target instanceof Node && !menu.current?.contains(event.target)) setOpen(false)
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key !== 'Escape' || event.defaultPrevented) return
      setOpen(false)
      trigger.current?.focus()
    }

    document.addEventListener('pointerdown', closeOnOutsidePress)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsidePress)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [open])

  return (
    <div className="mobile-navigation" ref={menu}>
      <button
        ref={trigger}
        type="button"
        className="mobile-menu-toggle"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen(previous => !previous)}
      >
        {open ? <X size={23} aria-hidden="true" /> : <Menu size={23} aria-hidden="true" />}
      </button>
      <div id={panelId} className="mobile-menu-panel" hidden={!open}>
        <nav aria-label="Mobile navigation">
          <ul>
            {mobileLinks.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={href === pathname ? 'page' : undefined}
                  onClick={() => {
                    setOpen(false)
                    if (href === pathname) trigger.current?.focus()
                  }}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mobile-menu-actions">
          <SocialLinks />
          <ThemeToggle />
        </div>
      </div>
    </div>
  )
}

export default function Header({ landing = false }: { landing?: boolean }) {
  const pathname = usePathname()
  const portraitSizes = landing ? "(min-width: 800px) and (min-height: 620px) 320px, (max-width: 479px) 180px, 288px" : "(min-width: 800px) 256px, 1px"
  const wordmark = (
    <>
      <span className="name-bench-press" aria-hidden="true">
        <span className="bench-press-floor" />
        <span className="bench-press-rack" />
        <span className="bench-press-bench" />
        <span className="bench-press-lifter" />
        <span className="bench-press-arm" />
        <span className="bench-press-plate" />
      </span>
      {hero.name}
    </>
  )

  return (
    <>
      <MobileNavigation key={pathname} pathname={pathname} />
      <header className={landing ? "site-sidebar landing-header" : "site-sidebar"}>
        <div className="sidebar-tools"><ThemeToggle /></div>
        <div className="sidebar-identity">
          <div className="sidebar-brand-name">
            {landing ? (
              <h1 className="sidebar-name">{wordmark}</h1>
            ) : (
              <Link href="/" className="sidebar-name" aria-label={`${hero.name}, home`}>{wordmark}</Link>
            )}
            <SocialLinks />
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
        <LogoGuitar />
        <figure className="sidebar-portrait">
          <PortraitTrack />
          <div className="portrait-frame">
            <Image src={hero.portraitSrc} alt={hero.portraitAlt} fill sizes={portraitSizes} priority unoptimized className="object-cover" />
            <PortraitSoundWaves />
          </div>
        </figure>
      </header>
    </>
  )
}
