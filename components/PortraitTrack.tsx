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
          <SpotifyTrackPlayer key={track.previewUrl ?? track.url} track={track} onPlaybackChange={setPlaying} />
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
