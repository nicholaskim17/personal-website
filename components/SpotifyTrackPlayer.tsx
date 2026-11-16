'use client'

import Image from 'next/image'
import { Pause, Play } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { RecentTrack } from '@/lib/spotify'

type PlaybackUpdate = {
  playingURI: string
  isPaused: boolean
  isBuffering: boolean
  duration: number
  position: number
}

type EmbedController = {
  addListener(event: 'ready', listener: () => void): void
  addListener(event: 'playback_update', listener: (event: { data: PlaybackUpdate }) => void): void
  resume(): void
  pause(): void
  destroy(): void
}

type EmbedApi = {
  createController(
    element: HTMLElement,
    options: { uri: string; width: string; height: number },
    onCreate: (controller: EmbedController) => void,
  ): void
}

declare global {
  interface Window {
    onSpotifyIframeApiReady?: (api: EmbedApi) => void
  }
}

let embedApi: Promise<EmbedApi> | undefined

function loadEmbedApi() {
  return embedApi ??= new Promise<EmbedApi>((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://open.spotify.com/embed/iframe-api/v1'
    script.async = true
    const timeout = window.setTimeout(fail, 10_000)

    function fail() {
      window.clearTimeout(timeout)
      script.remove()
      delete window.onSpotifyIframeApiReady
      reject(new Error('Spotify player could not load.'))
    }

    window.onSpotifyIframeApiReady = api => {
      window.clearTimeout(timeout)
      resolve(api)
    }
    script.onerror = fail
    document.head.appendChild(script)
  }).catch(error => {
    embedApi = undefined
    throw error
  })
}

interface SpotifyTrackPlayerProps {
  track: RecentTrack
  onPlaybackChange: (playing: boolean) => void
}

export default function SpotifyTrackPlayer({ track, onPlaybackChange }: SpotifyTrackPlayerProps) {
  const audio = useRef<HTMLAudioElement>(null)
  const embedHost = useRef<HTMLDivElement>(null)
  const embedController = useRef<EmbedController | null>(null)
  const [playing, setPlaying] = useState(false)
  const [previewFailed, setPreviewFailed] = useState(false)
  const [embedAttempt, setEmbedAttempt] = useState(0)
  const [embedStatus, setEmbedStatus] = useState<'loading' | 'ready' | 'failed'>('loading')
  const preview = previewFailed ? undefined : track.previewUrl
  const uri = `spotify:track:${new URL(track.url).pathname.split('/').at(-1)}`

  const updatePlayback = useCallback((active: boolean) => {
    setPlaying(active)
    onPlaybackChange(active)
  }, [onPlaybackChange])

  useEffect(() => () => onPlaybackChange(false), [onPlaybackChange])

  useEffect(() => {
    if (!preview) void loadEmbedApi().catch(() => {})
  }, [preview])

  useEffect(() => {
    const host = embedHost.current
    if (!embedAttempt || !host) return
    const placeholder = document.createElement('div')
    host.appendChild(placeholder)
    let disposed = false
    let controller: EmbedController | undefined
    let playbackEnd: number | undefined
    const readyTimeout = window.setTimeout(() => setEmbedStatus('failed'), 12_000)

    loadEmbedApi().then(api => {
      if (disposed) return
      api.createController(placeholder, { uri, width: '100%', height: 80 }, embed => {
        if (disposed) {
          embed.destroy()
          return
        }
        controller = embed
        embed.addListener('ready', () => {
          if (disposed) return
          window.clearTimeout(readyTimeout)
          embedController.current = embed
          setEmbedStatus('ready')
          embed.resume()
        })
        embed.addListener('playback_update', ({ data }) => {
          if (disposed) return
          window.clearTimeout(playbackEnd)
          const remaining = data.duration - data.position
          const active = data.playingURI === uri && !data.isPaused && !data.isBuffering && remaining > 0
          updatePlayback(active)
          if (active) playbackEnd = window.setTimeout(() => updatePlayback(false), remaining)
        })
      })
    }).catch(() => {
      window.clearTimeout(readyTimeout)
      if (!disposed) setEmbedStatus('failed')
    })

    return () => {
      disposed = true
      window.clearTimeout(readyTimeout)
      window.clearTimeout(playbackEnd)
      embedController.current = null
      controller?.destroy()
      placeholder.remove()
    }
  }, [embedAttempt, uri, updatePlayback])

  function startEmbed() {
    setEmbedStatus('loading')
    setEmbedAttempt(attempt => attempt + 1)
  }

  function handlePreviewError() {
    setPreviewFailed(true)
    updatePlayback(false)
    setEmbedAttempt(attempt => attempt || 1)
  }

  async function togglePlayback() {
    if (!preview) {
      const embed = embedController.current
      if (embed) {
        if (playing) embed.pause()
        else embed.resume()
      } else if (!embedAttempt || embedStatus === 'failed') {
        startEmbed()
      }
      return
    }
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
    <>
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
          aria-label={`${playing ? 'Pause' : 'Play'} ${track.title}`}
          aria-busy={embedAttempt > 0 && embedStatus === 'loading'}
          onClick={togglePlayback}
        >
          {playing ? <Pause size={15} aria-hidden="true" /> : <Play size={15} aria-hidden="true" />}
        </button>
      </div>
      {embedAttempt > 0 && (
        <div className="portrait-spotify-embed">
          {embedStatus === 'loading' && <span role="status">Loading Spotify…</span>}
          {embedStatus === 'failed' && <span role="status">Spotify couldn’t load. Press Play to retry.</span>}
          <div ref={embedHost} />
        </div>
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
    </>
  )
}
