import { ArrowUpRight } from 'lucide-react'
import { footer } from '@/lib/data'
import Webring from '@/components/Webring'

export default function Footer() {
  return (
    <footer className="site-footer">
      <p>{footer.attribution}</p>
      <Webring />
      <a className="inline-link" href="#top">Back to top<ArrowUpRight size={13} aria-hidden="true" /></a>
    </footer>
  )
}
