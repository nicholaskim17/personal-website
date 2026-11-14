export const guitarStrings = [
  { note: 'E2', frequency: 82.41 },
  { note: 'A2', frequency: 110 },
  { note: 'D3', frequency: 146.83 },
  { note: 'G3', frequency: 196 },
  { note: 'B3', frequency: 246.94 },
  { note: 'E4', frequency: 329.63 },
]

// A short burst of noise fed through a damped delay models a plucked string.
export function createPluck(context: AudioContext, frequency: number): AudioBuffer {
  const sampleRate = context.sampleRate
  const period = sampleRate / frequency - 0.5
  const delay = new Float32Array(Math.ceil(period) + 1)
  const length = Math.floor(sampleRate * 1.25)
  const buffer = context.createBuffer(1, length, sampleRate)
  const samples = buffer.getChannelData(0)
  const attack = sampleRate * 0.007
  let previous = 0

  for (let i = 0; i < delay.length; i++) {
    previous = previous * 0.28 + (Math.random() * 2 - 1) * 0.72
    delay[i] = previous
  }

  previous = 0
  for (let i = 0; i < length; i++) {
    const readIndex = (i % delay.length + delay.length - period) % delay.length
    const index = Math.floor(readIndex)
    const fraction = readIndex - index
    const value = delay[index] * (1 - fraction) + delay[(index + 1) % delay.length] * fraction

    delay[i % delay.length] = (value + previous) * 0.498
    previous = value
    const envelope = Math.min(1, i / attack) * Math.pow(1 - i / length, 2)
    samples[i] = value * envelope * 0.32
  }

  return buffer
}
