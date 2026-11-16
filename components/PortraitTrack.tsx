'use client'

import Image from 'next/image'
import { useState } from 'react'
import { hero } from '@/lib/data'
import type { RecentTrack } from '@/lib/spotify'
import { useJsonFetch } from '@/lib/useJsonFetch'
import PortraitSoundWaves from './PortraitSoundWaves'
import SpotifyTrackPlayer from './SpotifyTrackPlayer'

export default function PortraitTrack({ sizes }: { sizes: string }) {
  const state = useJsonFetch<{ track: RecentTrack | null }>('/api/spotify/recent', 90_000)
  const track = state.status === 'ready' ? state.data.track : null
  const [playing, setPlaying] = useState(false)

  return (
    <figure className="sidebar-portrait">
      <figcaption className="portrait-track">
        {track ? (
          <>
            <div className="portrait-track-heading">
              <span className="portrait-track-source">
                <span>Last played</span>
                <Image className="spotify-logo-dark" src="/images/spotify-logo-white.svg" alt="Spotify" width={70} height={21} />
                <Image className="spotify-logo-light" src="/images/spotify-logo-black.svg" alt="Spotify" width={70} height={21} />
              </span>
              <SpotifyTrackPlayer key={track.url} track={track} playing={playing} onPlaybackChange={setPlaying} />
            </div>
            <a
              className="portrait-track-link"
              href={track.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Last played: ${track.title} by ${track.artist}. Listen on Spotify.`}
            >
              <span className="portrait-track-text" key={track.url}>
                <strong>{track.title}</strong>
                <span>{track.artist}</span>
              </span>
            </a>
          </>
        ) : (
          <span className="portrait-track-text">song stuck in my head…</span>
        )}
      </figcaption>
      <div className="portrait-frame">
        <Image src={hero.portraitSrc} alt={hero.portraitAlt} fill sizes={sizes} priority unoptimized className="object-cover" />
        {playing && <PortraitSoundWaves />}
      </div>
    </figure>
  )
}
