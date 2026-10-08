'use client'

import Image from 'next/image'
import { useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'

// Static hand-drawn details around the hero.

interface Doodle {
  name: string
  src: string
  width: number
  height: number
  rotate: string
  position: string
  visibility: string
}

const doodles: Doodle[] = [
  {
    name: 'guitar',
    src: '/images/doodles/guitar.png',
    width: 72,
    height: 69,
    rotate: '-9deg',
    position: 'top-[14%] left-[5%]',
    visibility: 'block',
  },
  {
    name: 'hockey stick and puck',
    src: '/images/doodles/hockey.png',
    width: 66,
    height: 61,
    rotate: '8deg',
    position: 'bottom-[16%] right-[5%]',
    visibility: 'block',
  },
  {
    name: 'dumbbell',
    src: '/images/doodles/dumbbell.png',
    width: 64,
    height: 39,
    rotate: '7deg',
    position: 'top-[16%] right-[6%]',
    visibility: 'hidden sm:block',
  },
  {
    name: 'laptop',
    src: '/images/doodles/laptop.png',
    width: 74,
    height: 63,
    rotate: '-6deg',
    position: 'bottom-[14%] left-[6%]',
    visibility: 'hidden sm:block',
  },
  {
    name: 'golf flag and ball',
    src: '/images/doodles/golf.png',
    width: 54,
    height: 55,
    rotate: '-5deg',
    position: 'top-[42%] left-[3%]',
    visibility: 'hidden md:block',
  },
  {
    name: 'piano keyboard',
    src: '/images/doodles/piano.png',
    width: 76,
    height: 42,
    rotate: '4deg',
    position: 'top-[52%] right-[3%]',
    visibility: 'hidden lg:block',
  },
  {
    name: 'calculator',
    src: '/images/doodles/calculator.png',
    width: 50,
    height: 62,
    rotate: '-7deg',
    position: 'bottom-[38%] left-[3%]',
    visibility: 'hidden lg:block',
  },
  {
    name: 'volleyball',
    src: '/images/doodles/volleyball.png',
    width: 58,
    height: 58,
    rotate: '6deg',
    position: 'top-[32%] right-[5%]',
    visibility: 'hidden lg:block',
  },
]

export default function HeroDoodles() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {doodles.map(doodle => (
        <DraggableDoodle key={doodle.name} doodle={doodle} />
      ))}
    </div>
  )
}

function DraggableDoodle({ doodle }: { doodle: Doodle }) {
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [dragStart, setDragStart] = useState<{ pointerId: number; x: number; y: number; offsetX: number; offsetY: number } | null>(null)

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)
    setDragStart({
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      offsetX: offset.x,
      offsetY: offset.y,
    })
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (!dragStart || event.pointerId !== dragStart.pointerId) return
    setOffset({
      x: dragStart.offsetX + event.clientX - dragStart.x,
      y: dragStart.offsetY + event.clientY - dragStart.y,
    })
  }

  function handlePointerUp(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.pointerId === dragStart?.pointerId) setDragStart(null)
  }

  return (
    <>
      <div
        className={`pointer-events-none absolute z-0 ${doodle.visibility} ${doodle.position} transition-opacity duration-150 ${dragStart ? 'opacity-100' : 'opacity-[0.32]'}`}
        style={{ rotate: doodle.rotate, transform: `translate3d(${offset.x}px, ${offset.y}px, 0)` }}
      >
        <Image
          src={doodle.src}
          alt=""
          width={doodle.width}
          height={doodle.height}
          draggable={false}
          className={`pointer-events-none transition-transform duration-150 ${dragStart ? 'scale-110' : 'dark:invert'}`}
          style={dragStart ? {
            filter: 'brightness(0) saturate(100%) invert(59%) sepia(94%) saturate(1472%) hue-rotate(1deg) brightness(104%) contrast(103%)',
          } : undefined}
        />
      </div>
      <div
        className={`pointer-events-auto absolute z-20 touch-none select-none opacity-0 ${doodle.visibility} ${doodle.position} ${dragStart ? 'cursor-grabbing' : 'cursor-grab'}`}
        style={{ rotate: doodle.rotate, transform: `translate3d(${offset.x}px, ${offset.y}px, 0)` }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <Image src={doodle.src} alt="" width={doodle.width} height={doodle.height} draggable={false} />
      </div>
    </>
  )
}
