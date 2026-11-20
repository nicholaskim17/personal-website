'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { GalleryPhoto } from '@/lib/data'

interface GalleryPreview {
  photo: GalleryPhoto
  left: number
  top: number
  width: number
  height: number
}

export default function RecentGallery({ photos }: { photos: GalleryPhoto[] }) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [canScrollBack, setCanScrollBack] = useState(false)
  const [canScrollForward, setCanScrollForward] = useState(false)
  const [preview, setPreview] = useState<GalleryPreview | null>(null)
  const splitAt = Math.ceil(photos.length / 2)
  const rows = [photos.slice(0, splitAt), photos.slice(splitAt)]

  const updateControls = useCallback(() => {
    const track = trackRef.current
    if (!track) return
    setCanScrollBack(track.scrollLeft > 2)
    setCanScrollForward(track.scrollLeft + track.clientWidth < track.scrollWidth - 2)
  }, [])

  useEffect(() => {
    function handleResize() {
      setPreview(null)
      updateControls()
    }

    updateControls()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [updateControls])

  function magnify(photo: GalleryPhoto, thumbnail: HTMLDivElement, row: number) {
    const viewport = viewportRef.current
    const track = trackRef.current
    if (!viewport || !track) return
    const bounds = viewport.getBoundingClientRect()
    const original = thumbnail.getBoundingClientRect()
    const availableHeight = track.clientHeight - parseFloat(getComputedStyle(track).paddingBottom)
    const scale = Math.min(1.85, track.clientWidth / original.width, availableHeight / original.height)
    const width = original.width * scale
    const height = original.height * scale
    const left = original.left - bounds.left - (width - original.width) / 2
    const top = row === 0 ? original.top - bounds.top : original.bottom - bounds.top - height

    setPreview({
      photo,
      width,
      height,
      left: Math.max(0, Math.min(left, track.clientWidth - width)),
      top: Math.max(0, Math.min(top, availableHeight - height)),
    })
  }

  const scroll = (direction: -1 | 1) => {
    const track = trackRef.current
    if (!track) return
    track.scrollBy({ left: direction * track.clientWidth * 0.75, behavior: 'smooth' })
  }

  return (
    <div className="gallery">
      <div className="gallery-heading">
        <h3 className="gallery-title" id="recent-gallery-heading">Recently</h3>
        <div className="gallery-controls">
          <button type="button" className="gallery-control" aria-label="Scroll recent photos left" disabled={!canScrollBack} onClick={() => scroll(-1)}>
            <ChevronLeft size={18} aria-hidden="true" />
          </button>
          <button type="button" className="gallery-control" aria-label="Scroll recent photos right" disabled={!canScrollForward} onClick={() => scroll(1)}>
            <ChevronRight size={18} aria-hidden="true" />
          </button>
        </div>
      </div>
      <div className="gallery-viewport" ref={viewportRef} onPointerLeave={() => setPreview(null)}>
        <div
          className="gallery-track"
          ref={trackRef}
          role="region"
          aria-labelledby="recent-gallery-heading"
          tabIndex={0}
          onScroll={() => {
            setPreview(null)
            updateControls()
          }}
        >
          {rows.map((row, index) => (
            <div className="gallery-row" key={index}>
              {row.map(photo => (
                <div
                  className="gallery-photo"
                  key={photo.src}
                  style={{ aspectRatio: `${photo.width} / ${photo.height}` }}
                  onPointerEnter={event => {
                    if (event.pointerType === 'mouse') magnify(photo, event.currentTarget, index)
                  }}
                  onPointerLeave={() => setPreview(null)}
                >
                  <div className="gallery-photo-frame">
                    <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 620px) 103vw, 35rem" className="object-cover" draggable={false} />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
        {preview && (
          <div
            className="gallery-preview"
            key={preview.photo.src}
            aria-hidden="true"
            style={{ left: preview.left, top: preview.top, width: preview.width, height: preview.height }}
          >
            <Image src={preview.photo.src} alt="" fill sizes="(max-width: 620px) 103vw, 35rem" className="object-cover" draggable={false} />
          </div>
        )}
      </div>
    </div>
  )
}
