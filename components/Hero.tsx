import Image from 'next/image'
import { hero } from '@/lib/data'
import HeroDoodles from './HeroDoodles'

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-24 text-center md:px-10"
    >
      <HeroDoodles />

      <div className="relative z-10 flex max-w-2xl flex-col items-center">
        <div className="relative mb-8 h-32 w-32 overflow-hidden rounded-full border border-border bg-surface-raised md:h-36 md:w-36">
          <Image
            src={hero.portraitSrc}
            alt={hero.portraitAlt}
            fill
            sizes="144px"
            priority
            className="object-cover"
          />
        </div>

        <p className="text-sm font-medium uppercase tracking-[0.2em] text-accent">
          {hero.greeting}
        </p>

        <h1 className="mt-3 font-playfair text-5xl font-bold tracking-tight text-ink md:text-7xl">
          {hero.name}
        </h1>

        <p className="mt-5 max-w-lg text-base leading-7 text-ink-muted md:text-lg">
          {hero.tagline}
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <a
            href={hero.primaryCta.href}
            className="rounded-full bg-ink px-6 py-3 text-sm font-medium text-surface transition-transform duration-150 hover:scale-[1.03] active:scale-[0.98]"
          >
            {hero.primaryCta.label}
          </a>
          <a
            href={hero.secondaryCta.href}
            className="rounded-full border border-border px-6 py-3 text-sm font-medium text-ink transition-colors duration-150 hover:border-accent hover:text-accent"
          >
            {hero.secondaryCta.label}
          </a>
        </div>
      </div>
    </section>
  )
}
