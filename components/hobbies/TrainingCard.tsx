'use client'

import { Dumbbell, ExternalLink } from 'lucide-react'
import { hobbies } from '@/lib/data'
import { useJsonFetch } from '@/lib/useJsonFetch'
import type { HevyDashboardData } from '@/lib/hevy'
import CalendarGrid from './CalendarGrid'

export default function TrainingCard() {
  const state = useJsonFetch<HevyDashboardData>('/api/hevy')

  return (
    <article className="min-w-0 border-t border-border pt-5">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div className="flex items-center gap-2">
          <Dumbbell size={16} className="text-accent" aria-hidden="true" />
          <h3 className="font-playfair text-base font-semibold text-ink">{hobbies.training.heading}</h3>
        </div>
        <a
          href={hobbies.training.hevyProfileHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={hobbies.training.profileLinkLabel}
          className="inline-flex items-center gap-1 text-xs text-ink-faint transition-colors hover:text-accent"
        >
          Hevy <ExternalLink size={12} aria-hidden="true" />
        </a>
      </div>

      {state.status === 'loading' && <TrainingSkeleton />}
      {state.status === 'error' && <TrainingUnavailable />}
      {state.status === 'ready' && <TrainingContent data={state.data} />}
    </article>
  )
}

function TrainingContent({ data }: { data: HevyDashboardData }) {
  return (
    <div className="mt-4">
      <CalendarGrid days={data.calendar} />

      <dl className="mt-4 grid w-full grid-cols-3 gap-3 border-t border-border pt-3 text-center">
        <div>
          <dt className="text-xs text-ink-faint">Streak</dt>
          <dd className="mt-1 font-playfair text-lg font-semibold leading-7 text-ink">
            {data.streakDays}d <span className="inline-block leading-none" aria-hidden="true">🔥</span>
          </dd>
        </div>
        <div>
          <dt className="text-xs text-ink-faint">Week</dt>
          <dd className="mt-1 font-playfair text-lg font-semibold leading-7 text-ink">
            {data.workoutsThisWeek}x
          </dd>
        </div>
        <div>
          <dt className="text-xs text-ink-faint">Month</dt>
          <dd className="mt-1 font-playfair text-lg font-semibold leading-7 text-ink">
            {data.workoutsThisMonth}x
          </dd>
        </div>
      </dl>
    </div>
  )
}

function TrainingSkeleton() {
  return (
    <div className="mt-4 space-y-4" role="status" aria-label="Loading training data">
      <div className="h-24 animate-pulse bg-border/40" />
      <div className="grid grid-cols-3 gap-3 border-t border-border pt-3">
        <div className="h-10 animate-pulse bg-border/40" />
        <div className="h-10 animate-pulse bg-border/40" />
        <div className="h-10 animate-pulse bg-border/40" />
      </div>
    </div>
  )
}

function TrainingUnavailable() {
  return (
    <div className="mt-5 text-sm text-ink-muted">
      <p>Training data is unavailable right now.</p>
      <p className="mt-1 text-xs text-ink-faint">Check back soon.</p>
    </div>
  )
}
