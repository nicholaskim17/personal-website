'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowDown } from 'lucide-react'
import { about } from '@/lib/data'

const COLS = 2
const CONTAINER_W = 350
const CONTAINER_H = 380
const GAP = 14
const CELL_W = (CONTAINER_W - GAP * (COLS - 1)) / COLS
const CELL_H = (CONTAINER_H - GAP * 2) / 3
const PHOTO_W = 210
const PHOTO_H = 140

// Hand-placed offsets/rotations so the resting stack reads as a loose pile of prints.
const STACK_LAYOUT = [
  { x: -11, y: 8, rotate: -9 },
  { x: 14, y: -11, rotate: 7 },
  { x: -16, y: -8, rotate: -4 },
  { x: 8, y: 14, rotate: 10 },
  { x: 16, y: 3, rotate: -12 },
  { x: -5, y: -5, rotate: 4 },
]

function gridTarget(index: number) {
  const col = index % COLS
  const row = Math.floor(index / COLS)
  const cellCenterX = col * (CELL_W + GAP) + CELL_W / 2
  const cellCenterY = row * (CELL_H + GAP) + CELL_H / 2
  return {
    x: cellCenterX - CONTAINER_W / 2,
    y: cellCenterY - CONTAINER_H / 2,
    width: CELL_W,
    height: CELL_H,
    marginLeft: -CELL_W / 2,
    marginTop: -CELL_H / 2,
  }
}

export default function PhotoStack() {
  const [hovered, setHovered] = useState(false)
  const shouldReduceMotion = useReducedMotion()
  const photos = about.gallery

  return (
    <div
      className="relative mx-auto shrink-0"
      style={{ width: CONTAINER_W, height: CONTAINER_H }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      tabIndex={0}
      role="group"
      aria-label="Photo stack, focus or hover to arrange into a grid"
    >
      <div className="pointer-events-none absolute left-1/2 top-1 z-20 -translate-x-1/2">
        <motion.div
          className="flex flex-col items-center gap-0.5 text-sm font-medium text-ink-muted"
          initial={false}
          animate={
            shouldReduceMotion
              ? { opacity: hovered ? 0 : 1 }
              : { opacity: hovered ? 0 : 1, y: hovered ? -6 : 0 }
          }
          transition={{ duration: 0.25, ease: 'easeOut' }}
          aria-hidden="true"
        >
          <span>Recently</span>
          <ArrowDown size={17} strokeWidth={1.7} className="text-accent" />
        </motion.div>
      </div>

      {photos.map((photo, i) => {
        const rest = STACK_LAYOUT[i % STACK_LAYOUT.length]
        const target = gridTarget(i)

        return (
          <motion.div
            key={photo.src}
            className="absolute left-1/2 top-1/2 overflow-hidden rounded-sm border border-border/60 bg-surface-raised shadow-md"
            style={{
              width: PHOTO_W,
              height: PHOTO_H,
              marginLeft: -PHOTO_W / 2,
              marginTop: -PHOTO_H / 2,
              zIndex: hovered ? 10 + i : STACK_LAYOUT.length - i,
            }}
            initial={false}
            animate={
              shouldReduceMotion
                ? undefined
                : hovered
                  ? {
                      x: target.x,
                      y: target.y,
                      width: target.width,
                      height: target.height,
                      marginLeft: target.marginLeft,
                      marginTop: target.marginTop,
                      rotate: 0,
                    }
                  : {
                      x: rest.x,
                      y: rest.y,
                      width: PHOTO_W,
                      height: PHOTO_H,
                      marginLeft: -PHOTO_W / 2,
                      marginTop: -PHOTO_H / 2,
                      rotate: rest.rotate,
                    }
            }
            transition={{
              type: 'spring',
              stiffness: 260,
              damping: 24,
              delay: hovered ? i * 0.04 : (photos.length - i) * 0.02,
            }}
          >
            <Image src={photo.src} alt={photo.alt} fill sizes="210px" className="object-cover" />
          </motion.div>
        )
      })}
    </div>
  )
}
