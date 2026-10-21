'use client'

import { useEffect, useState } from 'react'

const WEBRING_URL = 'https://www.uwaterloo.network'
const WEBRING_USER = 'nicholas-kim'

type Member = { id: string; name: string; website: string }

export default function Webring() {
  const [members, setMembers] = useState<Member[]>([])
  const [index, setIndex] = useState(0)

  useEffect(() => {
    fetch(`${WEBRING_URL}/api/webring?user=${WEBRING_USER}`)
      .then((res) => res.json())
      .then((data: { members?: Member[] }) => {
        const list = data.members ?? []
        setMembers(list)
        setIndex(Math.floor(Math.random() * list.length))
      })
      .catch(() => {})
  }, [])

  const go = (step: number) => {
    if (members.length === 0) return
    const next = (index + step + members.length) % members.length
    setIndex(next)
    window.open(members[next].website, '_blank', 'noopener,noreferrer')
  }

  const disabled = members.length === 0
  const arrowClass =
    'text-xl leading-none text-ink-faint transition hover:scale-125 hover:text-ink disabled:pointer-events-none disabled:opacity-30'

  return (
    <div className="flex items-center gap-4">
      <button type="button" onClick={() => go(-1)} disabled={disabled} aria-label="Previous site in the UWaterloo webring" className={arrowClass}>
        ←
      </button>
      <a
        href={`${WEBRING_URL}?ref=${WEBRING_USER}`}
        target="_blank"
        rel="noopener noreferrer"
        title="Visit uwaterloo.network"
        className="text-ink transition hover:scale-110 hover:text-orange-500"
      >
        <span
          aria-hidden="true"
          className="block h-6 w-6 bg-current"
          style={{
            mask: `url(${WEBRING_URL}/icon.svg) center/contain no-repeat`,
            WebkitMask: `url(${WEBRING_URL}/icon.svg) center/contain no-repeat`,
          }}
        />
        <span className="sr-only">UWaterloo webring</span>
      </a>
      <button type="button" onClick={() => go(1)} disabled={disabled} aria-label="Next site in the UWaterloo webring" className={arrowClass}>
        →
      </button>
    </div>
  )
}
