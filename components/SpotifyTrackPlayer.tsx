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

  async function togglePreview() {
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

  return (
    <div className="portrait-track-summary">
      <span className="portrait-track-source">
        <span>Last played</span>
        <Image className="spotify-logo-dark" src="/images/spotify-logo-white.svg" alt="Spotify" width={70} height={21} />
        <Image className="spotify-logo-light" src="/images/spotify-logo-black.svg" alt="Spotify" width={70} height={21} />
      </span>
      {preview ? (
        <button
          className="portrait-track-play"
          type="button"
          aria-label={playing ? `Pause preview of ${track.title}` : `Play preview of ${track.title}`}
          onClick={togglePreview}
        >
          {playing ? <Pause size={15} aria-hidden="true" /> : <Play size={15} aria-hidden="true" />}
        </button>
      ) : (
        <a
          className="portrait-track-play"
          href={track.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Play ${track.title} on Spotify (opens in a new tab)`}
          title="Play on Spotify"
        >
          <Play size={15} aria-hidden="true" />
        </a>
      )}
      <a
        className="portrait-track-link"
        href={track.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Last played: ${track.title} by ${track.artist}. Listen on Spotify.`}
      >
        <span className="portrait-track-text">
          <strong>{track.title}</strong>
          <span>{track.artist}</span>
        </span>
      </a>
      {track.artworkUrl && (
        <a
          className="portrait-track-album"
          href={track.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${track.title} on Spotify`}
        >
          <span className="portrait-album-disc" data-playing={playing}>
            <Image src={track.artworkUrl} alt="" width={24} height={24} unoptimized />
          </span>
        </a>
      )}
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
