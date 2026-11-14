'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { Music, Music2 } from 'lucide-react'
import { createPluck, guitarStrings } from '@/lib/guitarAudio'

export default function LogoGuitar() {
  const audio = useRef<AudioContext | null>(null)
  const buffers = useRef<AudioBuffer[]>([])
  const sequence = useRef(0)
  const [sound, setSound] = useState<'off' | 'on' | 'unavailable'>('off')
  const [notes, setNotes] = useState<{ id: number; string: number }[]>([])
  const hintId = useId()

  useEffect(() => {
    return () => {
      const context = audio.current
      audio.current = null
      if (context && context.state !== 'closed') void context.close().catch(() => {})
    }
  }, [])

  function emitNote(index: number) {
    const note = { id: ++sequence.current, string: index }
    setNotes(previous => [...previous.slice(-7), note])
  }

  function pluck(index: number, context: AudioContext) {
    if (context.state !== 'running') return
    const source = context.createBufferSource()
    const buffer = buffers.current[index] ?? createPluck(context, guitarStrings[index].frequency)
    buffers.current[index] = buffer
    source.buffer = buffer
    source.connect(context.destination)
    source.onended = () => source.disconnect()
    source.start()
  }

  async function activate(index: number) {
    emitNote(index)
    try {
      const context = audio.current ?? new AudioContext()
      audio.current = context
      if (context.state !== 'running') await context.resume()
      if (audio.current !== context) return
      setSound('on')
      pluck(index, context)
    } catch {
      setSound('unavailable')
    }
  }

  return (
    <div className="logo-guitar" role="group" aria-label="Playable guitar" aria-describedby={hintId}>
      <div className="logo-guitar-instrument">
        <svg className="logo-guitar-shape" viewBox="0 0 100 248" fill="none" aria-hidden="true">
          <path className="guitar-body" transform="translate(0 68)" d="M38 91c-8-1-16 5-16 15 0 9 10 14 8 22-2 6-9 13-9 22 0 15 11 23 29 23s29-8 29-23c0-9-7-16-9-22-2-8 8-13 8-22 0-10-8-16-16-15-5 0-8 3-12 3s-7-3-12-3Z" />
          <path className="guitar-neck" d="M39 30h22v156H39zM37 30V12q0-5 5-5h16q5 0 5 5v18Z" />
          <circle className="guitar-sound-hole" cx="50" cy="194" r="11" />
          <path className="guitar-frets" d="M39 35h22m-22 9h22m-22 10h22m-22 11h22m-22 12h22m-22 13h22m-22 14h22m-22 15h22m-22 16h22m-22 17h22m-22 18h22M31 12h6m26 0h6M31 18h6m26 0h6M31 24h6m26 0h6" />
          <rect className="guitar-bridge" x="31" y="216" width="38" height="6" rx="2" />
        </svg>
        <div className="logo-guitar-strings">
          {guitarStrings.map(({ note }, index) => (
            <button
              key={note}
              type="button"
              aria-label={`Pluck ${note}`}
              onClick={() => void activate(index)}
              onPointerEnter={event => {
                if (event.pointerType === 'touch') return
                emitNote(index)
                if (audio.current?.state === 'running') pluck(index, audio.current)
              }}
            >
              <span className="guitar-string" aria-hidden="true" />
            </button>
          ))}
        </div>
        <span className="logo-guitar-notes" aria-hidden="true">
          {notes.map(({ id, string }) => {
            const Icon = string % 2 === 0 ? Music2 : Music
            return <Icon key={id} data-string={string} strokeWidth={2.1} />
          })}
        </span>
      </div>
      <div className="logo-guitar-callout" aria-hidden="true">
        <span>strum :)</span>
        <svg viewBox="0 0 39 24" fill="none">
          <path d="M36 3C29 15 18 19 4 16m0 0 8-7m-8 7 10 5" />
        </svg>
      </div>
      <span id={hintId} className="sr-only" aria-live="polite">
        {sound === 'on'
          ? 'Move across the strings or tap to play.'
          : sound === 'unavailable'
            ? 'Sound unavailable.'
            : 'Click or tap a string to start playing.'}
      </span>
    </div>
  )
}
