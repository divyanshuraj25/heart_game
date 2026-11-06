import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { CONFIG } from './config'
import * as fx from './fx'
import * as snd from './audio'
import { Btn, Face, Diya, Gift } from './components'

const pick = (a) => a[Math.floor(Math.random() * a.length)]
const title = 'font-display font-extrabold text-3xl sm:text-5xl leading-tight text-cream drop-shadow-[0_2px_18px_#ff4d8d88]'

export function Welcome({ next }) {
  return (
    <div className="flex flex-col items-center text-center gap-5">
      <div className="flex items-end justify-center gap-4 sm:gap-10">
        <Diya className="w-12 sm:w-16" />
        <motion.div animate={{ y: [0, -12, 0] }} transition={{ repeat: Infinity, duration: 2.6 }}><Face mood="happy" size={150} /></motion.div>
        <Diya className="w-12 sm:w-16" />
      </div>
      <motion.div animate={{ rotate: [-6, 6, -6] }} transition={{ repeat: Infinity, duration: 1.8 }} className="text-6xl" aria-hidden>🎁</motion.div>
      <h1 className={title}>{CONFIG.welcomeTitle}</h1>
      <p className="max-w-md text-lg text-cream/85">{CONFIG.welcomeSub}</p>
      <Btn kind="welcome" tone="gold" className="text-2xl px-10 py-4" onClick={() => setTimeout(next, 900)}>Let's Play! 🎮</Btn>
    </div>
  )
}

export function Level1({ next, say }) {
  const [clicks, setClicks] = useState(0)
  const mood = clicks === 0 ? 'angry' : clicks === 1 ? 'sad' : 'happy'
  const labels = ['Thoda sa maan jao 🥺', 'Abhi bhi gussa ho? 😤', 'Okay, one more chance ❤️']
  const press = (i) => { setClicks((c) => c + 1); say(CONFIG.replies[i]) }
  return (
    <div className="flex flex-col items-center text-center gap-5">
      <h2 className={title}>Level 1: Thoda sa gussa kam karein? 🥺</h2>
      <motion.div key={mood} initial={{ scale: 0.7 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}><Face mood={mood} size={150} /></motion.div>
      <p className="max-w-md text-lg">I know you're angry with me... But can I have one chance to make you smile?</p>
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        {labels.map((l, i) => <Btn key={l} tone={['rose', 'plum', 'gold'][i]} onClick={() => press(i)}>{l}</Btn>)}
      </div>
      <AnimatePresence>{clicks > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-2">
          <p className="text-sm text-cream/70">No pressure, continue only when you feel like it 💛</p>
          <Btn tone="gold" onClick={() => setTimeout(next, 700)}>Next level ➜</Btn>
        </motion.div>)}
      </AnimatePresence>
    </div>
  )
}

export function Level2({ next, say }) {
  const [hearts, setHearts] = useState([]); const [score, setScore] = useState(0)
  const id = useRef(0); const done = score >= 10
  useEffect(() => {
    if (done) return
    const t = setInterval(() => {
      const n = ++id.current
      setHearts((h) => [...h.slice(-7), { id: n, x: 6 + Math.random() * 82, s: 38 + Math.random() * 28, d: 6 + Math.random() * 3, c: pick(['💗', '💖', '💕', '💘']) }])
    }, 700)
    return () => clearInterval(t)
  }, [done])
  useEffect(() => { if (done) { fx.fire('level'); snd.win(); setHearts([]) } }, [done])
  const grab = (hh, e) => {
    setHearts((h) => h.filter((x) => x.id !== hh.id)); setScore((s) => s + 1)
    fx.mini(e.clientX, e.clientY); snd.pop()
    if (score % 3 === 2) say(pick(CONFIG.popups))
  }
  return (
    <div className="flex flex-col items-center text-center gap-5">
      <h2 className={title}>Level 2: Collect Some Happiness!</h2>
      <p className="text-lg">Tap the floating hearts. Collect 10!</p>
      <div className="glass rounded-full px-6 py-2 font-display text-2xl font-bold" aria-live="polite">💗 {Math.min(score, 10)} / 10</div>
      {!done && <p className="text-cream/60 text-sm">Hearts are floating up from the bottom...</p>}
      <div className="fixed inset-0 z-20 overflow-hidden pointer-events-none">
        {hearts.map((h) => (
          <button key={h.id} aria-label="Collect heart" className="rise" onAnimationEnd={() => setHearts((a) => a.filter((x) => x.id !== h.id))}
            style={{ left: h.x + '%', fontSize: h.s, animationDuration: h.d + 's' }} onPointerDown={(e) => grab(h, e)}>{h.c}</button>
        ))}
      </div>
      <AnimatePresence>{done && (
        <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring' }} className="glass rounded-3xl p-6 max-w-md flex flex-col items-center gap-4">
          <div className="text-5xl">🏆</div>
          <p className="font-display text-2xl font-bold">Yayyy! You collected 10 hearts! You're officially the happiness champion! ❤️</p>
          <Btn tone="gold" onClick={() => setTimeout(next, 700)}>On to the surprise ➜</Btn>
        </motion.div>)}
      </AnimatePresence>
    </div>
  )
}

export function Level3({ next }) {
  const [phase, setPhase] = useState('idle'); const [n, setN] = useState(3)
  useEffect(() => {
    if (phase !== 'count') return
    if (n === 0) { setPhase('open'); fx.fire('gift'); snd.win(); return }
    const t = setTimeout(() => setN((x) => x - 1), 850); return () => clearTimeout(t)
  }, [phase, n])
  return (
    <div className="flex flex-col items-center text-center gap-5">
      <h2 className={title}>One Last Surprise For You...</h2>
      <motion.div animate={phase === 'idle' ? { rotate: [-3, 3, -3], y: [0, -8, 0] } : {}} transition={{ repeat: Infinity, duration: 1.6 }}><Gift open={phase === 'open'} size={190} /></motion.div>
      {phase === 'idle' && <Btn tone="gold" className="text-2xl px-8" onClick={() => setPhase('count')}>Open Your Surprise 🎁</Btn>}
      {phase === 'count' && (
        <AnimatePresence mode="wait"><motion.div key={n} initial={{ scale: 2.2, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.4, opacity: 0 }}
          className="font-display font-extrabold text-7xl text-gold drop-shadow-[0_0_24px_#ffc857]">{n || '🎆'}</motion.div></AnimatePresence>)}
      {phase === 'open' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass rounded-3xl p-6 max-w-md flex flex-col items-center gap-4">
          <p className="font-display text-2xl font-bold">A little Diwali light, just for you 🪔✨</p>
          <Btn tone="rose" onClick={() => setTimeout(next, 700)}>Read my note 💌</Btn>
        </motion.div>)}
    </div>
  )
}

export function Finale({ replay }) {
  const [modal, setModal] = useState(false)
  useEffect(() => { fx.startFinale(); return fx.stopFinale }, [])
  return (
    <div className="flex flex-col items-center text-center gap-5">
      <div className="flex gap-6 justify-center"><Diya className="w-12" /><Diya className="w-16" /><Diya className="w-12" /></div>
      <h2 className={title}>{CONFIG.finalTitle.replace('{name}', CONFIG.friendName)}</h2>
      <div className="glass rounded-3xl p-5 sm:p-8 max-w-xl flex flex-col gap-3 text-lg leading-relaxed bg-plum/50">
        {CONFIG.message.map((p, i) => <motion.p key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.55 }}>{p}</motion.p>)}
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 + CONFIG.message.length * 0.55 }} className="flex flex-col items-center gap-4">
        <Btn kind="send" tone="rose" className="text-xl" onClick={() => setTimeout(() => setModal(true), 700)}>Send Some Happiness Back 💌</Btn>
        <Btn kind="game" tone="plum" className="text-base py-2" onClick={() => setTimeout(replay, 600)}>Play again 🔁</Btn>
        <p className="text-cream/70 text-sm pb-6">{CONFIG.footer}</p>
      </motion.div>
      <AnimatePresence>{modal && (
        <motion.div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModal(false)}>
          <motion.div initial={{ scale: 0.6, rotate: -4 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring' }} className="glass rounded-3xl p-8 max-w-sm text-center relative bg-plum/80" onClick={(e) => e.stopPropagation()}>
            <button aria-label="Close" className="absolute top-3 right-3 text-cream/70" onClick={() => setModal(false)}><X /></button>
            <div className="text-6xl mb-3">❤️</div>
            <p className="font-display text-2xl font-bold">{CONFIG.finalPopup}</p>
          </motion.div>
        </motion.div>)}
      </AnimatePresence>
    </div>
  )
}
