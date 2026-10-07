import type { ReactNode } from 'react'

interface RevealProps {
  children: ReactNode
  className?: string
}

/** Layout wrapper for grouped content without scroll-triggered entrance effects. */
export default function Reveal({ children, className }: RevealProps) {
  return <div className={className}>{children}</div>
}
