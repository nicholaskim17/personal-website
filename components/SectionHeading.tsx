import type { ReactNode } from 'react'

export default function SectionHeading({ children, level = 2 }: {
  children: ReactNode
  level?: 1 | 2
}) {
  const Heading = level === 1 ? 'h1' : 'h2'

  return (
    <div className="section-heading">
      <div className="section-heading-line">
        <Heading>{children}</Heading>
        <span aria-hidden="true" className="section-rule"><span>✧</span></span>
      </div>
    </div>
  )
}
