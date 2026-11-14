'use client'

import { useEffect, useId, useRef, useState, type PointerEvent } from 'react'
import { Music, Music2 } from 'lucide-react'
import { createPluck, guitarStrings } from '@/lib/guitarAudio'

type GuitarPoint = { x: number; y: number }

const stringLeft = 39
const stringRight = 61
const stringTop = 30
const stringBottom = 191
const stringSpacing = (stringRight - stringLeft) / guitarStrings.length

function stringAt(x: number) {
  return Math.max(-1, Math.min(guitarStrings.length, Math.floor((x - stringLeft) / stringSpacing)))
}

function getStrummedStrings(previous: GuitarPoint | null, current: GuitarPoint) {
  const from = previous ?? current
  if (Math.min(from.y, current.y) > stringBottom || Math.max(from.y, current.y) < stringTop) return []

  // Clip the sweep to the length of the strings before checking which lanes it crossed.
  const xAlongSweep = (point: GuitarPoint) => {
    const y = Math.max(stringTop, Math.min(point.y, stringBottom))
    if (y === point.y) return point.x
    return from.x + (current.x - from.x) * (y - from.y) / (current.y - from.y)
  }
  const first = stringAt(xAlongSweep(from))
  const last = stringAt(xAlongSweep(current))
  const direction = current.x >= from.x ? 1 : -1
  const startInside = previous && from.y >= stringTop && from.y <= stringBottom
  const crossed = []
  for (let index = startInside ? first + direction : first; direction * index <= direction * last; index += direction) {
    if (index >= 0 && index < guitarStrings.length) crossed.push(index)
  }
  return crossed
}

export default function LogoGuitar() {
  const shape = useRef<SVGSVGElement>(null)
  const previousPointer = useRef<GuitarPoint | null>(null)
  const audio = useRef<AudioContext | null>(null)
  const resumingAudio = useRef<Promise<void> | null>(null)
  const buffers = useRef<AudioBuffer[]>([])
  const sequence = useRef(0)
  const [sound, setSound] = useState<'off' | 'on' | 'unavailable'>('off')
  const [notes, setNotes] = useState<{ id: number; string: number }[]>([])
  const hintId = useId()

  useEffect(() => {
    return () => {
      const context = audio.current
      audio.current = null
      resumingAudio.current = null
      buffers.current = []
      if (context && context.state !== 'closed') void context.close().catch(() => {})
    }
  }, [])

  function pluck(index: number, context: AudioContext, when: number) {
    const source = context.createBufferSource()
    const buffer = buffers.current[index] ?? createPluck(context, guitarStrings[index].frequency)
    buffers.current[index] = buffer
    source.buffer = buffer
    source.connect(context.destination)
    source.onended = () => source.disconnect()
    source.start(when)
  }

  async function playStrings(indices: number[], canEnableSound = false) {
    if (!indices.length) return
    const newNotes = indices.map(string => ({ id: ++sequence.current, string }))
    setNotes(previous => [...previous, ...newNotes].slice(-8))

    try {
      const context = audio.current ?? (canEnableSound ? new AudioContext() : null)
      if (!context) return
      audio.current = context
      if (context.state !== 'running') {
        const resumed = resumingAudio.current ??= context.resume()
        try {
          await resumed
        } finally {
          if (resumingAudio.current === resumed) resumingAudio.current = null
        }
      }
      if (audio.current !== context || context.state !== 'running') return
      setSound('on')
      const start = context.currentTime
      indices.forEach((index, offset) => pluck(index, context, start + offset * .012))
    } catch {
      setSound('unavailable')
    }
  }

  function strum(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === 'touch') return
    const transform = shape.current?.getScreenCTM()
    if (!transform) return
    const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(transform.inverse())
    const crossed = getStrummedStrings(previousPointer.current, point)
    previousPointer.current = point
    void playStrings(crossed)
  }

  return (
    <div className="logo-guitar" role="group" aria-label="Playable guitar" aria-describedby={hintId}>
      <div
        className="logo-guitar-instrument"
        onPointerEnter={strum}
        onPointerMove={strum}
        onPointerLeave={event => {
          strum(event)
          previousPointer.current = null
        }}
      >
        <svg ref={shape} className="logo-guitar-shape" viewBox="0 0 100 221" fill="none" aria-hidden="true">
          <path className="guitar-body" transform="translate(0 41)" d="M38 91c-8-1-16 5-16 15 0 9 10 14 8 22-2 6-9 13-9 22 0 15 11 23 29 23s29-8 29-23c0-9-7-16-9-22-2-8 8-13 8-22 0-10-8-16-16-15-5 0-8 3-12 3s-7-3-12-3Z" />
          <path className="guitar-neck" d="M39 30h22v129H39zM37 30V12q0-5 5-5h16q5 0 5 5v18Z" />
          <circle className="guitar-sound-hole" cx="50" cy="167" r="11" />
          <path className="guitar-frets" d="M39 35h22m-22 8h22m-22 9h22m-22 10h22m-22 11h22m-22 12h22m-22 13h22m-22 14h22m-22 15h22m-22 16h22M31 12h6m26 0h6M31 18h6m26 0h6M31 24h6m26 0h6" />
          <rect className="guitar-bridge" x="31" y="189" width="38" height="6" rx="2" />
        </svg>
        <div className="logo-guitar-strings">
          {guitarStrings.map(({ note }, index) => (
            <button
              key={note}
              type="button"
              aria-label={`Pluck ${note}`}
              onClick={() => void playStrings([index], true)}
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
