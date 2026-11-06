import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Volume2, VolumeX } from 'lucide-react'
import * as fx from './fx'
import * as snd from './audio'
import { Sky, Progress, HeartCursor } from './components'
import { Welcome, Level1, Level2, Level3, Finale } from './screens'

const SCREENS = [Welcome, Level1, Level2, Level3, Finale]

export default function App() {
  const [step, setStep] = useState(0); const [sound, setSound] = useState(false); const [toast, setToast] = useState(null)
  const canvas = useRef(null)
  useEffect(() => fx.mount(canvas.current), [])
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(null), 2300); return () => clearTimeout(t) }, [toast])
  const Screen = SCREENS[step]
  return (
    <div className="relative min-h-[100dvh] font-body">
      <Sky />
      {/* fireworks live BEHIND the content and never block taps */}
      <canvas ref={canvas} className="fixed inset-0 w-full h-full z-[1] pointer-events-none" />
      <HeartCursor />
      <header className="relative z-30 flex items-center gap-3 p-4">
        <div className="flex-1"><Progress step={step} /></div>
        <button aria-label={sound ? 'Mute' : 'Unmute'} onClick={() => setSound(snd.toggle())} className="glass rounded-full p-2.5 text-gold">
          {sound ? <Volume2 size={20} /> : <VolumeX size={20} />}
        </button>
      </header>
      <AnimatePresence>{toast && (
        <motion.div key={toast.k} initial={{ y: -30, opacity: 0, scale: 0.8 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
          className="fixed top-20 inset-x-0 z-50 flex justify-center pointer-events-none px-4">
          <div className="glass rounded-full px-5 py-2.5 font-semibold text-center">{toast.m}</div>
        </motion.div>)}
      </AnimatePresence>
      <main className="relative z-10 px-4 pt-4 pb-10 mx-auto max-w-3xl">
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, y: 30, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -30, scale: 0.97 }} transition={{ duration: 0.45 }}>
            <Screen next={() => setStep((s) => s + 1)} replay={() => setStep(0)} say={(m) => setToast({ m, k: Date.now() })} />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}
