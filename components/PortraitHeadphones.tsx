import { useId } from 'react'

const soundWavePath = 'M8 -4.6 Q13 0 8 4.6'
const earcupTransforms = ['translate(34.5 43.5) scale(-1 1)', 'translate(67.5 43.5)']

export default function PortraitHeadphones() {
  const cushionId = useId()
  const bandId = useId()

  return (
    <svg className="portrait-accessories" viewBox="0 0 100 100" aria-hidden="true">
      <defs>
        <linearGradient id={bandId} x1="0" x2="0" y1="0" y2="1">
          <stop stopColor="#a8a5a0" />
          <stop offset="1" stopColor="#494643" />
        </linearGradient>
        <radialGradient id={cushionId} cx=".38" cy=".34" r=".74">
          <stop stopColor="#e89750" />
          <stop offset=".65" stopColor="#ce783b" />
          <stop offset="1" stopColor="#944820" />
        </radialGradient>
      </defs>
      <g className="portrait-sound-waves">
        {earcupTransforms.map(transform => (
          <g key={transform} transform={transform}>
            {[1, 2, 3].map(ripple => <path key={ripple} d={soundWavePath} />)}
          </g>
        ))}
      </g>
      <g fill="none" strokeLinecap="round">
        <path d="M66 47.3C64 52 66 55 62 62C58 70 54 81 51.9 100" stroke="#272320" strokeWidth=".53" />
        <path d="M35.5 42V36C36 31 41 23 47 22.3C55 21.5 60.5 22.7 64.7 31C66.9 35.2 67 38 67 42" stroke="#292625" strokeWidth="1.65" />
        <path d="M35.5 36C36 31 41 23 47 22.3C55 21.5 60.5 22.7 64.7 31C66.9 35.2 67 38 67 42" stroke={`url(#${bandId})`} strokeWidth=".85" />
      </g>
      <ellipse cx="35.4" cy="43.5" rx="1.52" ry="3.7" fill="#34302e" transform="rotate(-8 35.4 43.5)" />
      <ellipse cx="67.5" cy="43.5" rx="1.52" ry="3.7" fill="#34302e" transform="rotate(8 67.5 43.5)" />
      <ellipse cx="37.15" cy="43.8" rx="1.95" ry="4.25" fill={`url(#${cushionId})`} stroke="#844823" strokeWidth=".45" transform="rotate(-7 37.15 43.8)" />
      <ellipse cx="65.75" cy="43.8" rx="1.95" ry="4.25" fill={`url(#${cushionId})`} stroke="#844823" strokeWidth=".45" transform="rotate(7 65.75 43.8)" />
    </svg>
  )
}
