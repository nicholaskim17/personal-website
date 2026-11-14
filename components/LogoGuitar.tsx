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

  function pluck(index: number, context: AudioContext) {
    if (context.state !== 'running') return
    const source = context.createBufferSource()
    const buffer = buffers.current[index] ?? createPluck(context, guitarStrings[index].frequency)
    buffers.current[index] = buffer
    source.buffer = buffer
    source.connect(context.destination)
    source.onended = () => source.disconnect()
    source.start()

    const note = { id: ++sequence.current, string: index }
    setNotes(previous => [...previous.slice(-7), note])
  }

  async function activate(index: number) {
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
        <svg className="logo-guitar-shape" viewBox="0 0 100 180" fill="none" aria-hidden="true">
          <path className="guitar-body" d="M38 89c-11-1-20 6-20 17 0 10 9 13 7 22-1 5-9 10-10 20-2 17 12 27 35 27s37-10 35-27c-1-10-9-15-10-20-2-9 7-12 7-22 0-11-9-18-20-17-4 0-7 3-12 3s-8-3-12-3Z" />
          <path className="guitar-neck" d="M34 30h32v88H34zM34 30V12q0-5 5-5h22q5 0 5 5v18Z" />
          <circle className="guitar-sound-hole" cx="50" cy="126" r="14" />
          <path className="guitar-frets" d="M34 35h32m-32 9h32m-32 10h32m-32 12h32m-32 13h32m-32 14h32m-32 15h32M28 12h6m32 0h6M28 18h6m32 0h6M28 24h6m32 0h6" />
          <rect className="guitar-bridge" x="31" y="148" width="38" height="6" rx="2" />
        </svg>
        <div className="logo-guitar-strings">
          {guitarStrings.map(({ note }, index) => (
            <button
              key={note}
              type="button"
              aria-label={`Pluck ${note}`}
              onClick={() => void activate(index)}
              onPointerEnter={event => {
                if (event.pointerType !== 'touch' && audio.current?.state === 'running') {
                  pluck(index, audio.current)
                }
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
      <span id={hintId} className="logo-guitar-hint" aria-live="polite">
        {sound === 'on' ? 'Strum the strings' : sound === 'unavailable' ? 'Sound unavailable' : 'Tap a string to play'}
      </span>
    </div>
  )
}
