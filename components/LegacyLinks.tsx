'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

const movedSections = new Map([
  ['#about', '/about'],
  ['#experience', '/about#experience'],
  ['#work', '/about#work'],
  ['#research', '/about#research'],
  ['#projects', '/work'],
  ['#hobbies', '/misc'],
  ['#contact', '/contact'],
])

export default function LegacyLinks() {
  const router = useRouter()

  useEffect(() => {
    function followLegacyLink() {
      const destination = movedSections.get(window.location.hash)
      if (destination) router.replace(destination)
    }

    followLegacyLink()
    window.addEventListener('hashchange', followLegacyLink)
    return () => window.removeEventListener('hashchange', followLegacyLink)
  }, [router])

  return null
}
