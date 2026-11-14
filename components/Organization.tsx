import Image from 'next/image'
import type { WorkEntry } from '@/lib/data'

export default function Organization({ name, href, logo, highlight }: {
  name: string
  href?: string
  logo: string
  highlight?: WorkEntry['highlight']
}) {
  const className = highlight ? 'org-highlight' : 'org-button'
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
