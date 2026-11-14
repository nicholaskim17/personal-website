import Image from 'next/image'
import type { HighlightTone } from '@/lib/data'

export default function Organization({ name, href, logo, highlight, compact = false }: {
  name: string
  href?: string
  logo: string
  highlight: HighlightTone
  compact?: boolean
}) {
  const className = compact ? 'org-button' : 'org-highlight'
  const label = (
    <>
      <Image src={logo} alt="" width={16} height={16} />
      {name}
    </>
  )

  return href ? (
    <a className={className} data-tone={highlight} href={href} target="_blank" rel="noreferrer">
      {label}
    </a>
  ) : (
    <span className={className} data-tone={highlight}>{label}</span>
  )
}
