const wavePath = 'M8 -4.6 Q13 0 8 4.6'
const earcupTransforms = ['translate(34 43) scale(-1 1)', 'translate(68 43)']

export default function PortraitSoundWaves() {
  return (
    <svg className="portrait-sound-waves" viewBox="0 0 100 100" aria-hidden="true">
      {earcupTransforms.map(transform => (
        <g key={transform} transform={transform}>
          {[1, 2, 3].map(ripple => <path key={ripple} d={wavePath} />)}
        </g>
      ))}
    </svg>
  )
}
