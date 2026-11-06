// Heart-shaped fireworks engine (plain Canvas 2D, no dependencies)
const TAU = Math.PI * 2
const rnd = (a, b) => a + Math.random() * (b - a)
const pick = (a) => a[Math.floor(Math.random() * a.length)]
export const PAL = {
  pink: ['#ff4d8d', '#ff7eb6', '#ffc2de'], red: ['#ff2d55', '#ff6b6b'],
  purple: ['#b46bff', '#8f5bff', '#e0b3ff'], gold: ['#ffc857', '#ffe08a', '#fff1c4']
}
const ALL = Object.values(PAL).flat()
let cv, ctx, w = 0, h = 0, parts = [], rockets = [], raf = 0, last = 0, timer = 0
const reduce = () => matchMedia('(prefers-reduced-motion: reduce)').matches
const scale = () => (w < 520 ? 0.7 : 1) * (reduce() ? 0.5 : 1)

function resize() {
  const d = Math.min(devicePixelRatio || 1, 2)
  w = innerWidth; h = innerHeight
  cv.width = w * d; cv.height = h * d
  ctx.setTransform(d, 0, 0, d, 0, 0)
}
export function mount(c) {
  cv = c; ctx = c.getContext('2d'); resize()
  addEventListener('resize', resize)
  return () => { removeEventListener('resize', resize); cancelAnimationFrame(raf); raf = 0; parts = []; rockets = []; stopFinale() }
}
const kick = () => { if (!raf) { last = performance.now(); raf = requestAnimationFrame(loop) } }

function heartGlyph(x, y, s) {
  ctx.beginPath(); ctx.moveTo(x, y + s * 0.4)
  ctx.bezierCurveTo(x - s * 1.2, y - s * 0.3, x - s * 0.6, y - s * 1.1, x, y - s * 0.45)
  ctx.bezierCurveTo(x + s * 0.6, y - s * 1.1, x + s * 1.2, y - s * 0.3, x, y + s * 0.4)
  ctx.fill()
}
function loop(t) {
  const dt = Math.min(0.033, (t - last) / 1000); last = t
  ctx.globalCompositeOperation = 'destination-out'          // fades old frames => glowing trails
  ctx.fillStyle = 'rgba(0,0,0,0.2)'; ctx.fillRect(0, 0, w, h)
  ctx.globalCompositeOperation = 'lighter'

  for (let i = rockets.length - 1; i >= 0; i--) {
    const r = rockets[i]; r.p += dt / r.dur
    const e = 1 - Math.pow(1 - Math.min(r.p, 1), 3)         // ease-out
    r.x = r.x0 + (r.o.x - r.x0) * e + Math.sin(r.p * 14) * 3
    r.y = r.y0 + (r.o.y - r.y0) * e
    parts.push({ x: r.x, y: r.y, vx: rnd(-18, 18), vy: rnd(10, 50), life: 0.5, age: 0, r: 1.6, c: pick(PAL.gold), drag: 0.1, g: 0, gs: 0, kind: 'dot' })
    ctx.fillStyle = '#fff3c4'; ctx.beginPath(); ctx.arc(r.x, r.y, 2.6, 0, TAU); ctx.fill()
    if (r.p >= 1) { explode(r.o); rockets.splice(i, 1) }
  }
  for (let i = parts.length - 1; i >= 0; i--) {
    const p = parts[i]; p.age += dt
    if (p.age >= p.life) { parts.splice(i, 1); continue }
    const k = Math.pow(p.drag, dt)
    p.vx *= k; p.vy *= k
    if (p.age > p.gs) p.vy += p.g * dt
    p.x += p.vx * dt; p.y += p.vy * dt
    let a = Math.min(1, (p.life - p.age) / (p.life * 0.6))
    if (p.tw) a *= 0.6 + 0.4 * Math.sin(p.age * 30 + p.x)
    ctx.fillStyle = p.c
    if (p.kind === 'heart') { ctx.globalAlpha = a; heartGlyph(p.x, p.y, p.r) }
    else {
      ctx.globalAlpha = a * 0.25; ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 2.8, 0, TAU); ctx.fill()
      ctx.globalAlpha = a; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, TAU); ctx.fill()
    }
  }
  ctx.globalAlpha = 1
  if (!parts.length && !rockets.length) { ctx.clearRect(0, 0, w, h); raf = 0; return }
  raf = requestAnimationFrame(loop)
}

// Particles are placed on the classic heart curve with velocity proportional to
// their offset + strong drag, so the cloud expands into a clear heart and then settles.
function explode({ x, y, size = 90, colors = ALL, count = 70, sparkle = 18 }) {
  if (parts.length > 1100) return
  const s = scale(), K = 3.2, n = Math.round(count * s)
  const layers = [[1, 0.5], [0.64, 0.3], [0.3, 0.2]]
  for (const [L, share] of layers) {
    const m = Math.round(n * share)
    for (let i = 0; i < m; i++) {
      const t = (i / m) * TAU + L
      const hx = Math.sin(t) ** 3
      const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) / 16 - 0.1
      const j = rnd(0.97, 1.03)
      parts.push({ x, y, vx: hx * size * K * L * j, vy: hy * size * K * L * j, life: rnd(1.9, 2.7), age: 0,
        r: L === 1 ? 2.3 : 1.7, c: pick(colors), drag: 0.04, g: 55, gs: 1.1, kind: 'dot' })
    }
  }
  for (let i = 0; i < Math.round(9 * s); i++) { // tiny falling hearts: pink, red, purple, gold
    const a = rnd(0, TAU), v = rnd(0.4, 1) * size * 2.6
    parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: rnd(2.2, 3.2), age: 0, r: rnd(4, 8),
      c: pick(ALL), drag: 0.12, g: 38, gs: 0.2, kind: 'heart' })
  }
  for (let i = 0; i < Math.round(sparkle * s); i++) { // golden sparkles
    const a = rnd(0, TAU), v = rnd(0.2, 1.1) * size * 2.8
    parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: rnd(1, 2), age: 0, r: 1.3,
      c: pick(PAL.gold), drag: 0.06, g: 70, gs: 0.3, tw: true, kind: 'dot' })
  }
  kick()
}
export function launch(o) {
  setTimeout(() => {
    rockets.push({ x0: o.x + rnd(-40, 40), y0: h + 10, x: 0, y: 0, p: 0, dur: rnd(0.6, 0.85), o })
    kick()
  }, o.delay || 0)
}
export function mini(x, y) { explode({ x, y, size: 34, count: 28, sparkle: 8, colors: pick(Object.values(PAL)).concat(PAL.pink) }) }

const giant = () => Math.min(w, h) * 0.3
const mix = () => pick(Object.values(PAL)).concat(pick(Object.values(PAL)))
const spot = () => ({ x: rnd(w * 0.12, w * 0.88), y: rnd(h * 0.15, h * 0.45) })
const cx = () => ({ x: w / 2, y: h * 0.4 })
const big = (extra = {}) => launch({ ...cx(), size: giant(), count: 95, sparkle: 30, colors: PAL.pink.concat(PAL.gold[0]), ...extra })

export function fire(kind, px, py) {
  switch (kind) {
    case 'welcome':
      big(); launch({ x: w * 0.2, y: h * 0.3, size: 60, colors: PAL.purple, delay: 300 })
      launch({ x: w * 0.8, y: h * 0.3, size: 60, colors: PAL.red, delay: 450 }); break
    case 'level':
      for (let i = 0; i < 3; i++) launch({ ...spot(), size: rnd(65, 100), colors: mix(), delay: i * 350 })
      big({ delay: 1000 }); break
    case 'gift':
      big({ colors: PAL.gold.concat(PAL.pink) })
      for (let i = 0; i < 6; i++) launch({ ...spot(), size: rnd(70, 110), colors: i % 2 ? PAL.gold : PAL.pink, delay: 250 + i * 230 }); break
    case 'send':
      big({ size: giant() * 1.1, count: 110 })
      for (let i = 0; i < 4; i++) launch({ ...spot(), size: rnd(60, 95), colors: mix(), delay: 300 + i * 250 }); break
    default: // random colourful heart explosion from a game button
      launch({ x: Math.min(w - 40, Math.max(40, px || w / 2)), y: rnd(h * 0.18, h * 0.42), size: rnd(55, 100), count: 60, colors: mix() })
      if (Math.random() < 0.22) big({ delay: 250 })
  }
}
export function startFinale() {
  stopFinale(); big({ size: giant() * 1.15, count: 110 })
  let n = 0
  timer = setInterval(() => {
    if (document.hidden) return
    n++; const c = 2 + (Math.random() < 0.5 ? 1 : 0)
    for (let i = 0; i < c; i++) launch({ ...spot(), size: rnd(55, 110), colors: mix(), delay: i * 220 })
    if (n % 5 === 0) big({ delay: 300 })
  }, 750)
}
export function stopFinale() { clearInterval(timer); timer = 0 }
