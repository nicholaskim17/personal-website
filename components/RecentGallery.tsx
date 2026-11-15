'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { GalleryPhoto } from '@/lib/data'

export default function RecentGallery({ photos }: { photos: GalleryPhoto[] }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [canScrollBack, setCanScrollBack] = useState(false)
  const [canScrollForward, setCanScrollForward] = useState(false)

  const updateControls = useCallback(() => {
    const track = trackRef.current
    if (!track) return
    setCanScrollBack(track.scrollLeft > 2)
    setCanScrollForward(track.scrollLeft + track.clientWidth < track.scrollWidth - 2)
  }, [])

  useEffect(() => {
    updateControls()
    window.addEventListener('resize', updateControls)
    return () => window.removeEventListener('resize', updateControls)
  }, [updateControls])

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
      <div
        className="gallery-track"
        ref={trackRef}
        role="region"
        aria-labelledby="recent-gallery-heading"
        tabIndex={0}
        onScroll={updateControls}
      >
        {photos.map(photo => (
          <div className="gallery-photo" key={photo.src} style={{ aspectRatio: `${photo.width} / ${photo.height}` }}>
            <div className="gallery-photo-frame">
              <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 620px) 82vw, 28rem" className="object-cover" draggable={false} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
