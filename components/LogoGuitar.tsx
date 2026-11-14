'use client'

import { useCallback, useEffect, useId, useRef, useState, type CSSProperties, type PointerEvent } from 'react'
import { Music, Music2 } from 'lucide-react'
import { createPluck, guitarChords, guitarFrequency, guitarStrings } from '@/lib/guitarAudio'

type GuitarPoint = { x: number; y: number }
type GuitarNote = { string: number; fret?: number }
type GuitarChord = (typeof guitarChords)[number]

const viewBoxTop = -26
const viewBoxHeight = 259
const stringLeft = 39
const stringRight = 61
const nutY = 30
const firstFretY = 43
const stringBottom = 196
const stringSpacing = (stringRight - stringLeft) / guitarStrings.length
const guitarLayout = {
  aspectRatio: `100 / ${viewBoxHeight}`,
  '--guitar-nut': `${(nutY - viewBoxTop) / viewBoxHeight * 100}%`,
  '--guitar-first-fret': `${(firstFretY - viewBoxTop) / viewBoxHeight * 100}%`,
  '--guitar-bridge-inset': `${(viewBoxTop + viewBoxHeight - stringBottom) / viewBoxHeight * 100}%`,
} as CSSProperties
const acousticBody = 'M38 127C29 125 20 124 17 135C14 145 21 154 19 163C17 175 10 183 10 198C10 217 25 227 50 227C75 227 90 217 90 198C90 183 83 175 81 163C79 154 86 145 83 135C80 124 71 125 62 127C57 128 55 130 50 130C45 130 43 128 38 127Z'

function stringAt(x: number) {
  return Math.max(-1, Math.min(guitarStrings.length, Math.floor((x - stringLeft) / stringSpacing)))
}

function getStrummedStrings(previous: GuitarPoint | null, current: GuitarPoint, stringTop: number) {
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
  const tabVisit = useRef(0)
  const buffers = useRef<Map<number, AudioBuffer> | null>(null)
  const sequence = useRef(0)
  const [sound, setSound] = useState<'off' | 'on' | 'unavailable'>('off')
  const [notes, setNotes] = useState<{ id: number; string: number }[]>([])
  const [lessonOpen, setLessonOpen] = useState(false)
  const [selectedChord, setSelectedChord] = useState<GuitarChord | null>(null)
  const hintId = useId()
  const spruceId = `${hintId}-spruce`

  const resumeAudio = useCallback((context: AudioContext, fromGesture = false) => {
    if (context.state === 'running') return
    // A click must be able to resume audio even if an earlier hover tried to.
    if (!fromGesture && resumingAudio.current) return resumingAudio.current
    const resumed = context.resume().finally(() => {
      if (resumingAudio.current === resumed) resumingAudio.current = null
    })
    resumingAudio.current = resumed
    return resumed
  }, [])

  useEffect(() => {
    function restoreAudio() {
      previousPointer.current = null
      if (document.hidden) {
        tabVisit.current++
        resumingAudio.current = null
        return
      }
      const context = audio.current
      if (context && context.state !== 'closed') void resumeAudio(context)?.catch(() => {})
    }

    document.addEventListener('visibilitychange', restoreAudio)
    window.addEventListener('focus', restoreAudio)
    return () => {
      document.removeEventListener('visibilitychange', restoreAudio)
      window.removeEventListener('focus', restoreAudio)
      const context = audio.current
      audio.current = null
      resumingAudio.current = null
      buffers.current = null
      if (context && context.state !== 'closed') void context.close().catch(() => {})
    }
  }, [resumeAudio])

  function pluck({ string, fret }: GuitarNote, context: AudioContext, when: number) {
    // Fast Refresh may preserve the array used by the previous cache.
    if (!(buffers.current instanceof Map)) buffers.current = new Map()
    const source = context.createBufferSource()
    const frequency = guitarFrequency(string, fret, lessonOpen ? 1 : 0)
    const buffer = buffers.current.get(frequency) ?? createPluck(context, frequency)
    buffers.current.set(frequency, buffer)
    source.buffer = buffer
    source.connect(context.destination)
    source.onended = () => source.disconnect()
    source.start(when)
  }

  async function playStrings(stringIndexes: number[], canEnableSound = false) {
    const notesToPlay = stringIndexes.flatMap(string => {
      const fret = selectedChord?.frets[string]
      return fret === null ? [] : [{ string, fret }]
    })
    if (document.hidden || (!notesToPlay.length && !canEnableSound)) return
    if (notesToPlay.length) {
      const newNotes = notesToPlay.map(({ string }) => ({ id: ++sequence.current, string }))
      setNotes(previous => [...previous, ...newNotes].slice(-8))
    }

    try {
      const visit = tabVisit.current
      const canStart = canEnableSound || navigator.userActivation?.hasBeenActive
      const context = audio.current ?? (canStart ? new AudioContext() : null)
      if (!context) return
      audio.current = context
      const resumed = resumeAudio(context, canEnableSound)
      if (resumed) await resumed
      if (audio.current !== context || context.state !== 'running' || visit !== tabVisit.current || document.hidden) return
      setSound('on')
      const start = context.currentTime + .01
      notesToPlay.forEach((note, offset) => pluck(note, context, start + offset * .012))
    } catch {
      setSound('unavailable')
    }
  }

  function strum(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === 'touch') return
    const transform = shape.current?.getScreenCTM()
    if (!transform) return
    const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(transform.inverse())
    const crossed = getStrummedStrings(previousPointer.current, point, lessonOpen ? firstFretY : nutY)
    previousPointer.current = point
    void playStrings(crossed)
  }

  return (
    <div
      className="logo-guitar"
      data-capo={lessonOpen ? 1 : undefined}
      role="group"
      aria-label={lessonOpen ? 'Playable guitar, capo on the first fret' : 'Playable guitar'}
      aria-describedby={hintId}
    >
      <div
        className="logo-guitar-instrument"
        style={guitarLayout}
        onPointerEnter={strum}
        onPointerMove={strum}
        onPointerLeave={event => {
          strum(event)
          previousPointer.current = null
        }}
      >
        <svg ref={shape} className="logo-guitar-shape" viewBox={`0 ${viewBoxTop} 100 ${viewBoxHeight}`} fill="none" aria-hidden="true">
          <defs>
            <linearGradient id={spruceId} x2="100%" y2="12%">
              <stop stopColor="#b49a6c" />
              <stop offset=".48" stopColor="#e1cea3" />
              <stop offset=".54" stopColor="#dcc89d" />
              <stop offset="1" stopColor="#c6ae7e" />
            </linearGradient>
          </defs>
          <path d={acousticBody} fill={`url(#${spruceId})`} stroke="#31271f" strokeWidth="3" />
          <path d={acousticBody} stroke="#eddcba" strokeWidth="1.2" />
          <path d="M28 133c-3 27 2 63-2 79M35 134c-2 34 1 56-1 84M65 134c2 34-1 58 1 84M72 132c3 29-2 63 2 80"
            stroke="#785e3f" strokeWidth=".75" opacity=".3" />
          <path d="M63 157c10 3 15 14 15 26 0 8-4 13-9 10-4-2-2-8-7-15-4-5-7-9-7-14Z"
            fill="#302924" stroke="#211c17" />
          <circle cx="50" cy="165" r="15" fill="#383027" stroke="#211a14" />
          <circle cx="50" cy="165" r="12.8" stroke="#c5ac7c" strokeWidth="1.25" />
          <circle cx="50" cy="165" r="10.9" fill="#201b17" />
          <path d="M37-15h-6M37-2h-6M37 11h-6M63-15h6M63-2h6M63 11h6" stroke="#b5b7b4" />
          <path d="M37-17Q37-20 41-20Q50-23 59-20Q63-20 63-17L62 19Q62 24 59 30H41Q38 24 38 19Z"
            fill="#5b4131" stroke="#c4ab85" />
          <path d="M41.5 30 40-15M45 30 40-2M48 30 40 11M52 30 60 11M55 30 60-2M58.5 30 60-15"
            stroke="#ac9c87" strokeWidth=".8" opacity=".8" />
          <path d="M40-15v.1M40-2v.1M40 11v.1M60-15v.1M60-2v.1M60 11v.1"
            stroke="#d0cbbd" strokeWidth="2.1" />
          <path d="M30-17v4m0 9v4m0 9v4M70-17v4m0 9v4m0 9v4"
            stroke="#c8c9c2" strokeWidth="2.8" />
          <path d="M40 30h20l2 126H38Z" fill="#392e27" stroke="#95836b" />
          <path d="M40 30h20" stroke="#ece3ca" strokeWidth="2.4" />
          <path d={`M40 ${firstFretY}h20M39.5 56h21M39.5 68h21M39 79h22M39 89h22M39 98h22M39 107h22M38.5 115h23M38.5 123h23M38.5 130h23M38 137h24M38 143h24M38 149h24M38 154h24`}
            stroke="#a9a497" strokeWidth="1.05" />
          <path d="M50 62v.1M50 84v.1M50 102v.1M50 119v.1M44.5 140v.1M55.5 140v.1"
            stroke="#e6ddc7" strokeWidth="2.6" />
          <path d="M28 192q4 1.5 9 1.5h26q5 0 9-1.5v9q-4-1-9-1H37q-5 0-9 1Z"
            fill="#4f392c" stroke="#30241c" />
          <path d={`M38.5 ${stringBottom}h23`} stroke="#ebe0c9" strokeWidth="1.5" />
        </svg>
        <div className="logo-guitar-strings">
          {guitarStrings.map(({ note, capoNote }, index) => {
            const muted = selectedChord?.frets[index] === null
            const stringLabel = lessonOpen ? capoNote : note
            return (
              <button
                key={note}
                type="button"
                disabled={muted}
                aria-label={muted ? `${note} string muted` : selectedChord ? `Pluck ${note} string in ${selectedChord.name}` : `Pluck ${stringLabel}`}
                onClick={() => void playStrings([index], true)}
              >
                <span className="guitar-string" aria-hidden="true" />
              </button>
            )
          })}
        </div>
        {lessonOpen && <span className="guitar-capo" aria-hidden="true" />}
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
      <details className="logo-guitar-lesson" onToggle={event => {
        const open = event.currentTarget.open
        setLessonOpen(open)
        if (!open) setSelectedChord(null)
        previousPointer.current = null
      }}>
        <summary>wanna play your first song?</summary>
        <div className="logo-guitar-lesson-panel">
          <p>Play Riptide</p>
          <p className="logo-guitar-lesson-hint">Hint&#58; {guitarChords.map(({ name }) => name).join(' · ')}</p>
        </div>
        <div className="logo-guitar-chords" role="group" aria-label="Riptide chords">
          {guitarChords.map(chord => (
            <button
              key={chord.name}
              type="button"
              aria-label={`Select ${chord.name} chord`}
              aria-pressed={selectedChord === chord}
              onClick={() => {
                setSelectedChord(previous => previous === chord ? null : chord)
                previousPointer.current = null
                void playStrings([], true)
              }}
            >
              {chord.name}
            </button>
          ))}
        </div>
      </details>
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
