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
        <svg className="logo-guitar-shape" viewBox="0 0 100 212" fill="none" aria-hidden="true">
          <path className="guitar-body" transform="translate(0 32)" d="M38 91c-8-1-16 5-16 15 0 9 10 14 8 22-2 6-9 13-9 22 0 15 11 23 29 23s29-8 29-23c0-9-7-16-9-22-2-8 8-13 8-22 0-10-8-16-16-15-5 0-8 3-12 3s-7-3-12-3Z" />
          <path className="guitar-neck" d="M34 30h32v120H34zM34 30V12q0-5 5-5h22q5 0 5 5v18Z" />
          <circle className="guitar-sound-hole" cx="50" cy="158" r="11" />
          <path className="guitar-frets" d="M34 35h32m-32 8h32m-32 9h32m-32 10h32m-32 11h32m-32 12h32m-32 13h32m-32 14h32m-32 15h32m-32 16h32M28 12h6m32 0h6M28 18h6m32 0h6M28 24h6m32 0h6" />
          <rect className="guitar-bridge" x="31" y="180" width="38" height="6" rx="2" />
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
        {sound === 'on' ? 'Strum' : sound === 'unavailable' ? 'Sound unavailable' : 'Pluck a string'}
      </span>
    </div>
  )
}
