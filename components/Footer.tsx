import { footer } from '@/lib/data'
import Webring from '@/components/Webring'

export default function Footer({ landing = false }: { landing?: boolean }) {
  return (
    <footer className={landing ? "site-footer landing-footer" : "site-footer"}>
      <p>{footer.attribution}</p>
      <Webring />
    </footer>
  )
}
