'use client'

import { Pause, Play, X } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { RecentTrack } from '@/lib/spotify'

type PlaybackUpdate = {
  playingURI: string
  isPaused: boolean
  isBuffering: boolean
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
  playing: boolean
  onPlaybackChange: (playing: boolean) => void
}

export default function SpotifyTrackPlayer({ track, playing, onPlaybackChange }: SpotifyTrackPlayerProps) {
  const uri = `spotify:track:${new URL(track.url).pathname.split('/').at(-1)}`
  const panelId = useId()
  const toggle = useRef<HTMLButtonElement>(null)
  const close = useRef<HTMLButtonElement>(null)
  const panel = useRef<HTMLDivElement>(null)
  const host = useRef<HTMLDivElement>(null)
  const readyController = useRef<EmbedController | null>(null)
  const playWhenReady = useRef(false)
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState<'loading' | 'ready' | 'unavailable'>('loading')

  useEffect(() => {
    if (open) close.current?.focus({ preventScroll: true })
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

    loadEmbedApi().then(api => {
      if (disposed) return
      api.createController(placeholder, { uri, width: '100%', height: 152 }, embed => {
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
          if (disposed || panel.current?.hidden) return
          onPlaybackChange(data.playingURI === uri && !data.isPaused && !data.isBuffering)
        })
      })
    }).catch(() => {
      if (!disposed) setStatus('unavailable')
    })

    return () => {
      disposed = true
      readyController.current = null
      controller?.destroy()
      placeholder.remove()
      onPlaybackChange(false)
    }
  }, [uri, onPlaybackChange])

  function togglePlayback() {
    if (playing) {
      readyController.current?.pause()
      return
    }
    setOpen(true)
    if (readyController.current) readyController.current.resume()
    else playWhenReady.current = true
  }

  function closePlayer() {
    playWhenReady.current = false
    readyController.current?.pause()
    setOpen(false)
    onPlaybackChange(false)
    toggle.current?.focus()
  }

  return (
    <>
      <button
        ref={toggle}
        className="portrait-track-play"
        type="button"
        aria-label={`${playing ? 'Pause' : 'Play'} ${track.title}`}
        aria-controls={panelId}
        onClick={togglePlayback}
      >
        {playing ? <Pause size={15} aria-hidden="true" /> : <Play size={15} aria-hidden="true" />}
      </button>
      {createPortal(
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
          <button ref={close} className="portrait-player-close" type="button" aria-label="Close Spotify player" onClick={closePlayer}>
            <X size={18} aria-hidden="true" />
          </button>
          {status === 'loading' && <p role="status">Loading Spotify…</p>}
          {status === 'unavailable' && <a href={track.url} target="_blank" rel="noopener noreferrer">Open in Spotify ↗</a>}
          <div ref={host} hidden={status === 'unavailable'} />
        </div>,
        document.body,
      )}
    </>
  )
}
