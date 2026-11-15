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
          <h3 className="text-base font-semibold text-ink">{hobbies.training.heading}</h3>
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
    </div>
  )
}

function TrainingSkeleton() {
  return (
    <div className="mt-4 space-y-4" role="status" aria-label="Loading training data">
      <div className="h-24 animate-pulse bg-border/40" />
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
