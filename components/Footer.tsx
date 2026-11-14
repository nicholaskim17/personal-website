'use client'

import { ArrowUp } from 'lucide-react'
import { footer } from '@/lib/data'
import Webring from '@/components/Webring'

export default function Footer({ landing = false }: { landing?: boolean }) {
  return (
    <footer className={landing ? "site-footer landing-footer" : "site-footer"}>
      <p>{footer.attribution}</p>
      <Webring />
      {!landing && (
        <a
          className="inline-link"
          href="#top"
          onClick={event => {
            if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
            event.preventDefault()
            document.getElementById('main')?.focus({ preventScroll: true })
            window.scrollTo({ top: 0, behavior: 'instant' })
          }}
        >
          Back to top<ArrowUp size={13} aria-hidden="true" />
        </a>
      )}
    </footer>
  )
}
