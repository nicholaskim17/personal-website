import Image from 'next/image'

// A small, static set of hand-drawn details around the hero.

interface Doodle {
  name: string
  src: string
  width: number
  height: number
  rotate: string
  position: string
}

const doodles: Doodle[] = [
  {
    name: 'guitar',
    src: '/images/doodles/guitar.png',
    width: 72,
    height: 69,
    rotate: '-9deg',
    position: 'top-[14%] left-[5%]',
  },
  {
    name: 'hockey stick and puck',
    src: '/images/doodles/hockey.png',
    width: 66,
    height: 61,
    rotate: '8deg',
    position: 'bottom-[16%] right-[5%]',
  },
  {
    name: 'dumbbell',
    src: '/images/doodles/dumbbell.png',
    width: 64,
    height: 39,
    rotate: '7deg',
    position: 'top-[16%] right-[6%]',
  },
]

export default function HeroDoodles() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {doodles.map(doodle => (
        <div
          key={doodle.name}
          className={`absolute opacity-[0.24] ${doodle.position} ${doodle.name === 'dumbbell' ? 'hidden sm:block' : ''}`}
          style={{ rotate: doodle.rotate }}
        >
          <Image src={doodle.src} alt="" width={doodle.width} height={doodle.height} className="dark:invert" />
        </div>
      ))}
    </div>
  )
}
