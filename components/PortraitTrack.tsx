'use client'

import Image from 'next/image'
import type { RecentTrack } from '@/lib/spotify'
import { useJsonFetch } from '@/lib/useJsonFetch'

export default function PortraitTrack() {
  const state = useJsonFetch<{ track: RecentTrack | null }>('/api/spotify/recent', 90_000)
  const track = state.status === 'ready' ? state.data.track : null

  return (
    <figcaption className="portrait-track">
      {track ? (
        <a
          className="portrait-track-link"
          href={track.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Last played: ${track.title} by ${track.artist}. Listen on Spotify.`}
        >
          <span className="portrait-track-source">
            <span>Last played</span>
            <Image className="spotify-logo-dark" src="/images/spotify-logo-white.svg" alt="Spotify" width={70} height={21} />
            <Image className="spotify-logo-light" src="/images/spotify-logo-black.svg" alt="Spotify" width={70} height={21} />
          </span>
          <span className="portrait-track-text" key={track.url}>
            <strong>{track.title}</strong>
            <span>{track.artist}</span>
          </span>
        </a>
      ) : (
        <span className="portrait-track-text">song stuck in my head…</span>
      )}
    </figcaption>
  )
}
