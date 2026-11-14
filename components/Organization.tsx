import Image from 'next/image'
import type { HighlightTone } from '@/lib/data'

export default function Organization({ name, href, logo, highlight }: {
  name: string
  href?: string
  logo: string
  highlight: HighlightTone
}) {
  const label = (
    <>
      <Image src={logo} alt="" width={16} height={16} />
      {name}
    </>
  )

  return href ? (
    <a className="org-button" data-tone={highlight} href={href} target="_blank" rel="noreferrer">
      {label}
    </a>
  ) : (
    <span className="org-button" data-tone={highlight}>{label}</span>
  )
}
