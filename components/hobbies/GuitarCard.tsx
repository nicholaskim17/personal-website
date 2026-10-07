import Image from 'next/image'
import { Guitar, ExternalLink } from 'lucide-react'
import { hobbies } from '@/lib/data'

export default function GuitarCard() {
  return (
    <article className="min-w-0 border-t border-border pt-5">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div className="flex items-center gap-2">
          <Guitar size={16} className="text-accent" aria-hidden="true" />
          <h3 className="font-playfair text-base font-semibold text-ink">{hobbies.guitar.heading}</h3>
        </div>
        <a
          href={hobbies.guitar.tiktokHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Watch ${hobbies.guitar.tiktokHandle}'s guitar covers on TikTok`}
          className="inline-flex items-center gap-1 text-xs text-ink-faint transition-colors hover:text-accent"
        >
          Covers <ExternalLink size={12} aria-hidden="true" />
        </a>
      </div>

      <div className="relative mt-4 aspect-[4/3] w-full overflow-hidden rounded-sm">
        <Image src={hobbies.guitar.image} alt={hobbies.guitar.imageAlt} fill sizes="200px" className="object-cover" />
      </div>

      <p className="mt-3 text-sm leading-6 text-ink-muted">{hobbies.guitar.sentence}</p>
      <p className="mt-1 text-xs text-ink-faint">{hobbies.guitar.tiktokHandle}</p>
    </article>
  )
}
