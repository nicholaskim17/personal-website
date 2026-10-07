'use client'

import { ExternalLink, ListChecks } from 'lucide-react'
import { hobbies } from '@/lib/data'
import { useJsonFetch } from '@/lib/useJsonFetch'
import type { HevyDashboardData, WorkoutSet } from '@/lib/hevy'

export default function LastWorkoutCard() {
  const state = useJsonFetch<HevyDashboardData>('/api/hevy')

  return (
    <article className="min-w-0 border-t border-border pt-5">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div className="flex items-center gap-2">
          <ListChecks size={16} className="text-accent" aria-hidden="true" />
          <h3 className="font-playfair text-base font-semibold text-ink">Last workout</h3>
        </div>
        <a
          href={hobbies.training.hevyProfileHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open my latest workouts on Hevy"
          className="inline-flex items-center gap-1 text-xs text-ink-faint transition-colors hover:text-accent"
        >
          Hevy <ExternalLink size={12} aria-hidden="true" />
        </a>
      </div>

      {state.status === 'loading' && <LastWorkoutSkeleton />}
      {state.status === 'error' && <LastWorkoutUnavailable />}
      {state.status === 'ready' && <LastWorkoutContent data={state.data} />}
    </article>
  )
}

function LastWorkoutContent({ data }: { data: HevyDashboardData }) {
  const workout = data.mostRecent

  if (!workout) {
    return (
      <div className="mt-4">
        <p className="text-sm text-ink-faint">No workouts logged yet.</p>
      </div>
    )
  }

  return (
    <div className="mt-4">
      <div className="flex items-baseline justify-between gap-2">
        <p className="text-sm font-medium text-ink">{workout.title}</p>
        <p className="flex-shrink-0 text-xs text-ink-faint">
          {formatShortDate(workout.date)} · {workout.durationMinutes} min
        </p>
      </div>

      <ul className="mt-4 divide-y divide-border">
        {workout.exercises.map(exercise => (
          <li key={exercise.name} className="py-3 first:pt-0 last:pb-0">
            <p className="text-sm font-medium text-ink">{exercise.name}</p>
            <p className="mt-1 text-xs leading-5 text-ink-muted">
              {exercise.sets.map(formatSet).join(' · ')}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}

function formatSet(set: WorkoutSet): string {
  if (set.weightLb !== null && set.reps !== null) return `${formatWeight(set.weightLb)} lb × ${set.reps}`
  if (set.reps !== null) return `${set.reps} reps`
  if (set.durationSeconds !== null) return `${Math.round(set.durationSeconds / 60)} min`
  if (set.distanceMeters !== null) return `${(set.distanceMeters / 1000).toFixed(1)} km`
  return 'Logged'
}

function formatWeight(weightLb: number): string {
  return Number.isInteger(weightLb) ? String(weightLb) : weightLb.toFixed(1)
}

function LastWorkoutSkeleton() {
  return (
    <div className="mt-4 space-y-4" role="status" aria-label="Loading last workout">
      <div className="h-4 w-2/3 animate-pulse bg-border/40" />
      {[0, 1, 2].map(i => (
        <div key={i} className="space-y-2 border-t border-border pt-3">
          <div className="h-3.5 w-1/2 animate-pulse bg-border/40" />
          <div className="h-3 w-4/5 animate-pulse bg-border/40" />
        </div>
      ))}
    </div>
  )
}

function LastWorkoutUnavailable() {
  return (
    <div className="mt-5 text-sm text-ink-muted">
      <p>Last workout data is unavailable right now.</p>
      <p className="mt-1 text-xs text-ink-faint">Check back soon.</p>
    </div>
  )
}

function formatShortDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
