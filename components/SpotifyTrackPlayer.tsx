'use client'

import Image from 'next/image'
import { Play, X } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
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
    window.onSpotifyIframeApiReady = resolve
    script.onerror = () => {
      script.remove()
      reject(new Error('Spotify player could not load.'))
    }
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
  const uri = `spotify:track:${new URL(track.url).pathname.split('/').at(-1)}`
  const panelId = useId()
  const toggle = useRef<HTMLButtonElement>(null)
  const close = useRef<HTMLButtonElement>(null)
  const panel = useRef<HTMLDivElement>(null)
  const host = useRef<HTMLDivElement>(null)
  const readyController = useRef<EmbedController | null>(null)
  const playWhenReady = useRef(false)
  const restoreFocus = useRef(false)
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState<'loading' | 'ready' | 'unavailable'>('loading')

  useEffect(() => {
    if (open) close.current?.focus({ preventScroll: true })
    else if (restoreFocus.current) {
      restoreFocus.current = false
      toggle.current?.focus({ preventScroll: true })
    }
  }, [open])

  useEffect(() => {
    if (!open || status !== 'loading') return
    // Spotify's iframe loads lazily, so start the timeout when the player is visible.
    const timeout = window.setTimeout(() => setStatus('unavailable'), 12_000)
    return () => window.clearTimeout(timeout)
  }, [open, status])

  useEffect(() => {
    const container = host.current
    if (!container) return
    const placeholder = document.createElement('div')
    container.appendChild(placeholder)
    let disposed = false
    let controller: EmbedController | undefined
    let playbackEnd: number | undefined

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
          readyController.current = embed
          setStatus('ready')
          if (playWhenReady.current) {
            playWhenReady.current = false
            embed.resume()
          }
        })
        embed.addListener('playback_update', ({ data }) => {
          window.clearTimeout(playbackEnd)
          if (disposed || panel.current?.hidden) return
          const remaining = data.duration - data.position
          const playing = data.playingURI === uri && !data.isPaused && !data.isBuffering && remaining > 0
          onPlaybackChange(playing)
          // Spotify can show its end screen without sending a final pause update.
          if (playing) playbackEnd = window.setTimeout(() => onPlaybackChange(false), remaining)
        })
      })
    }).catch(() => {
      if (!disposed) setStatus('unavailable')
    })

    return () => {
      disposed = true
      window.clearTimeout(playbackEnd)
      readyController.current = null
      controller?.destroy()
      placeholder.remove()
      onPlaybackChange(false)
    }
  }, [uri, onPlaybackChange])

  function openPlayer() {
    setOpen(true)
    if (readyController.current) readyController.current.resume()
    else playWhenReady.current = true
  }

  function closePlayer() {
    playWhenReady.current = false
    readyController.current?.pause()
    restoreFocus.current = true
    setOpen(false)
    onPlaybackChange(false)
  }

  return (
    <>
      <div className="portrait-track-summary" hidden={open}>
        <div className="portrait-track-heading">
          <span className="portrait-track-source">
            <span>Last played</span>
            <Image className="spotify-logo-dark" src="/images/spotify-logo-white.svg" alt="Spotify" width={70} height={21} />
            <Image className="spotify-logo-light" src="/images/spotify-logo-black.svg" alt="Spotify" width={70} height={21} />
          </span>
          <button
            ref={toggle}
            className="portrait-track-play"
            type="button"
            aria-label={`Play ${track.title}`}
            aria-controls={panelId}
            onClick={openPlayer}
          >
            <Play size={15} aria-hidden="true" />
          </button>
        </div>
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
      </div>
      <div
        ref={panel}
        id={panelId}
        className="portrait-player"
        role="region"
        aria-label="Spotify player"
        hidden={!open}
        onKeyDown={event => {
          if (event.key === 'Escape') closePlayer()
        }}
      >
        <div className="portrait-player-toolbar">
          {status === 'loading' && <span role="status">Loading Spotify…</span>}
          {status === 'unavailable' && <a href={track.url} target="_blank" rel="noopener noreferrer">Open in Spotify ↗</a>}
          <button ref={close} className="portrait-player-close" type="button" aria-label="Close Spotify player" onClick={closePlayer}>
            <X size={18} aria-hidden="true" />
          </button>
        </div>
        <div ref={host} hidden={status === 'unavailable'} />
      </div>
    </>
  )
}
