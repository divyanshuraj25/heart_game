// Tiny WebAudio sounds. Silent until the user taps the speaker button.
let ac, on = false, mt = 0, idx = 2
const A = () => (ac ||= new (window.AudioContext || window.webkitAudioContext)())
function tone(f, d = 0.15, type = 'sine', v = 0.07, when = 0) {
  if (!on) return
  const a = A(), o = a.createOscillator(), g = a.createGain(), t = a.currentTime + when
  o.type = type; o.frequency.value = f
  g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(0.0001, t + d)
  o.connect(g).connect(a.destination); o.start(t); o.stop(t + d)
}
export const pop = () => tone(880 + Math.random() * 400, 0.12, 'triangle')
export const boom = () => { tone(110, 0.3, 'sawtooth', 0.05); tone(1300 + Math.random() * 500, 0.25, 'sine', 0.035, 0.12) }
export const win = () => [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.3, 'triangle', 0.07, i * 0.12))
const SC = [392, 440, 523, 587, 659, 784]
export function toggle() {
  on = !on
  if (on) {
    A().resume(); win()
    mt = setInterval(() => { idx = Math.max(0, Math.min(5, idx + pick3())); tone(SC[idx], 1, 'sine', 0.022) }, 560)
  } else clearInterval(mt)
  return on
}
const pick3 = () => [-1, 0, 1][Math.floor(Math.random() * 3)]
