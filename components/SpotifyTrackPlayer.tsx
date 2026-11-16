'use client'

import Image from 'next/image'
import { Pause, Play } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { RecentTrack } from '@/lib/spotify'

interface SpotifyTrackPlayerProps {
  track: RecentTrack
  onPlaybackChange: (playing: boolean) => void
}

export default function SpotifyTrackPlayer({ track, onPlaybackChange }: SpotifyTrackPlayerProps) {
  const audio = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [previewFailed, setPreviewFailed] = useState(false)
  const preview = previewFailed ? undefined : track.previewUrl

  useEffect(() => () => onPlaybackChange(false), [onPlaybackChange])

  function updatePlayback(active: boolean) {
    setPlaying(active)
    onPlaybackChange(active)
  }

  function handlePreviewError() {
    setPreviewFailed(true)
    updatePlayback(false)
  }

  async function togglePlayback() {
    const player = audio.current
    if (!player) return
    if (!player.paused) {
      player.pause()
      return
    }
    try {
      await player.play()
    } catch (error) {
      if (audio.current === player && !(error instanceof DOMException && error.name === 'AbortError')) {
        handlePreviewError()
      }
    }
  }

  const playLabel = `${playing ? 'Pause' : 'Play'} ${track.title}`
  const unavailableLabel = 'Spotify preview unavailable'

  return (
    <div className="portrait-track-summary">
      <a
        className="portrait-track-link"
        href={track.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Last played: ${track.title} by ${track.artist}. Open in Spotify.`}
      >
        <span className="portrait-track-source">
          <span>Last played</span>
          <Image className="spotify-logo-dark" src="/images/spotify-logo-white.svg" alt="Spotify" width={70} height={21} />
          <Image className="spotify-logo-light" src="/images/spotify-logo-black.svg" alt="Spotify" width={70} height={21} />
        </span>
        <span className="portrait-track-text">
          <strong>{track.title}</strong>
          <span>{track.artist}</span>
        </span>
        {track.artworkUrl && (
          <span className="portrait-track-album">
            <Image className="portrait-album-disc" data-playing={playing} src={track.artworkUrl} alt="" width={40} height={40} unoptimized />
          </span>
        )}
      </a>
      <button
        className="portrait-track-play"
        type="button"
        disabled={!preview}
        aria-label={preview ? playLabel : unavailableLabel}
        title={preview ? undefined : unavailableLabel}
        onClick={togglePlayback}
      >
        {playing ? <Pause size={15} aria-hidden="true" /> : <Play size={15} fill="currentColor" aria-hidden="true" />}
      </button>
      {preview && (
        <audio
          ref={audio}
          src={preview}
          hidden
          preload="none"
          onPlaying={() => updatePlayback(true)}
          onPause={() => updatePlayback(false)}
          onEnded={() => updatePlayback(false)}
          onError={handlePreviewError}
        />
      )}
    </div>
  )
}
