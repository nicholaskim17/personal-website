import Image from 'next/image'

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
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      {doodles.map(doodle => (
        <div
          key={doodle.name}
          className={`absolute ${doodle.visibility} ${doodle.position} opacity-[0.32]`}
          style={{ rotate: doodle.rotate }}
        >
          <Image src={doodle.src} alt="" width={doodle.width} height={doodle.height} className="dark:invert" />
        </div>
      ))}
    </div>
  )
}
