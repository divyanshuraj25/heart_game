import { useEffect } from 'react'
import { motion } from 'framer-motion'
import * as fx from './fx'
import * as snd from './audio'

// Every button fires a heart firework (kind picks the show) + a sound.
export function Btn({ kind = 'game', children, onClick, className = '', tone = 'rose' }) {
  const tones = {
    rose: 'bg-gradient-to-b from-rose to-[#d62a74] text-white shadow-[0_6px_0_#8f1650,0_12px_30px_#ff4d8d55]',
    gold: 'bg-gradient-to-b from-gold to-[#f09a2a] text-[#3a1500] shadow-[0_6px_0_#9c5a0c,0_12px_30px_#ffc85755]',
    plum: 'bg-gradient-to-b from-[#6b2fa0] to-[#45197a] text-cream shadow-[0_6px_0_#2a0c4d,0_12px_30px_#8f5bff44]'
  }
  return (
    <motion.button whileHover={{ scale: 1.06, rotate: -1.5 }} whileTap={{ scale: 0.9, y: 4 }}
      className={`font-display font-bold text-lg sm:text-xl px-6 py-3 rounded-full focus-visible:outline focus-visible:outline-4 focus-visible:outline-gold ${tones[tone]} ${className}`}
      onClick={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        fx.fire(kind, e.clientX || r.left + r.width / 2, e.clientY || r.top)
        snd.boom(); onClick?.(e)
      }}>{children}</motion.button>
  )
}

export function Face({ mood = 'happy', size = 140 }) {
  const brow = mood === 'angry' ? ['M34 40 L52 48', 'M86 40 L68 48'] : mood === 'sad' ? ['M34 48 L52 41', 'M86 48 L68 41'] : ['M34 42 Q43 37 52 42', 'M68 42 Q77 37 86 42']
  const mouth = mood === 'angry' ? 'M44 84 Q60 72 76 84' : mood === 'sad' ? 'M46 82 Q60 74 74 82' : 'M42 76 Q60 98 78 76'
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} style={mood === 'angry' ? { animation: 'shake .5s infinite' } : undefined}>
      <defs><radialGradient id={'f' + mood} cx="40%" cy="30%"><stop offset="0" stopColor={mood === 'angry' ? '#ffb199' : '#ffe2b0'} /><stop offset="1" stopColor={mood === 'angry' ? '#ff6a5c' : '#ffb86b'} /></radialGradient></defs>
      <circle cx="60" cy="62" r="52" fill={`url(#f${mood})`} />
      <circle cx="30" cy="70" r="8" fill="#ff4d8d" opacity=".35" /><circle cx="90" cy="70" r="8" fill="#ff4d8d" opacity=".35" />
      <circle cx="44" cy="58" r="5" fill="#3a1030" /><circle cx="76" cy="58" r="5" fill="#3a1030" />
      <circle cx="45.5" cy="56" r="1.6" fill="#fff" /><circle cx="77.5" cy="56" r="1.6" fill="#fff" />
      {brow.map((d) => <path key={d} d={d} stroke="#3a1030" strokeWidth="4" strokeLinecap="round" fill="none" />)}
      <path d={mouth} stroke="#3a1030" strokeWidth="4" strokeLinecap="round" fill={mood === 'happy' ? '#ff6b8a' : 'none'} />
      {mood === 'sad' && <path d="M40 66 q-3 10 0 14 q3 -4 0 -14" fill="#7ad7ff" />}
    </svg>
  )
}

export function Diya({ className = 'w-14' }) {
  return (
    <svg viewBox="0 0 64 48" className={className} style={{ filter: 'drop-shadow(0 0 14px #ffb73aaa)' }}>
      <defs><linearGradient id="dg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffd36e" /><stop offset="1" stopColor="#c46a12" /></linearGradient></defs>
      <path d="M4 24 Q32 54 60 24 Z" fill="url(#dg)" />
      <path d="M12 26 Q32 36 52 26" stroke="#fff1c4" strokeWidth="1.5" fill="none" opacity=".6" />
      <g className="flame"><path d="M32 2 C41 13 41 21 32 24 C23 21 23 13 32 2Z" fill="#ffb43a" /><path d="M32 11 C37 16 37 21 32 23 C27 21 27 16 32 11Z" fill="#fff6d0" /></g>
    </svg>
  )
}

export function Gift({ open, size = 170 }) {
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} style={{ filter: 'drop-shadow(0 8px 24px #ff4d8d66)' }}>
      {open && <motion.circle cx="60" cy="60" r="10" fill="#ffe08a" initial={{ r: 4, opacity: 1 }} animate={{ r: 56, opacity: 0 }} transition={{ duration: 0.9 }} />}
      <rect x="18" y="52" width="84" height="56" rx="8" fill="#d62a74" /><rect x="53" y="52" width="14" height="56" fill="#ffc857" />
      <motion.g animate={{ y: open ? -34 : 0, rotate: open ? -16 : 0 }} style={{ originX: '20px', originY: '52px' }} transition={{ type: 'spring', stiffness: 120, damping: 11 }}>
        <rect x="12" y="38" width="96" height="20" rx="8" fill="#ff4d8d" /><rect x="53" y="38" width="14" height="20" fill="#ffc857" />
        <path d="M60 38 C40 14 22 30 60 38 C98 30 80 14 60 38Z" fill="#ffc857" />
      </motion.g>
      <motion.g animate={{ y: open ? [0, 0] : 0 }}>{open && <text x="48" y="92" fontSize="30">❤️</text>}</motion.g>
    </svg>
  )
}

export function Progress({ step }) {
  const labels = ['Start', 'Mood', 'Hearts', 'Surprise', 'Wish']
  return (
    <div className="w-full max-w-sm mx-auto px-4" aria-label={`Step ${step + 1} of 5`}>
      <div className="relative h-2.5 rounded-full bg-white/10 overflow-hidden">
        <motion.div className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-rose via-[#b46bff] to-gold" animate={{ width: `${(step / 4) * 100}%` }} transition={{ type: 'spring', stiffness: 80 }} />
      </div>
      <div className="flex justify-between mt-1.5 text-[11px] font-semibold text-cream/70">
        {labels.map((l, i) => <span key={l} className={i <= step ? 'text-gold' : ''}>{i <= step ? '❤️' : '🤍'} {l}</span>)}
      </div>
    </div>
  )
}

// Slowly floating CSS hearts + glowing night sky behind everything
export function Sky() {
  const hearts = Array.from({ length: 14 }, (_, i) => ({ l: (i * 7.3 + 5) % 96, s: 14 + (i * 5) % 22, d: 12 + (i * 3) % 12, dl: -(i * 2.3), c: ['💗', '💖', '💜', '✨'][i % 4] }))
  return (
    <div className="fixed inset-0 night-bg overflow-hidden">
      <div className="absolute inset-0 stars" />
      <div className="absolute -top-32 -left-20 w-80 h-80 rounded-full bg-[#8f5bff]/20 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-72 rounded-full bg-rose/20 blur-3xl" />
      {hearts.map((h, i) => <span key={i} className="bg-heart" style={{ left: h.l + '%', fontSize: h.s, animationDuration: h.d + 's', animationDelay: h.dl + 's' }}>{h.c}</span>)}
    </div>
  )
}

export function HeartCursor() {
  useEffect(() => {
    if (!matchMedia('(hover:hover) and (pointer:fine)').matches) return
    let t = 0
    const mv = (e) => {
      const n = performance.now(); if (n - t < 70) return; t = n
      const s = document.createElement('span'); s.className = 'cursor-heart'; s.textContent = ['💗', '💖', '✨'][Math.floor(Math.random() * 3)]
      s.style.left = e.clientX + 6 + 'px'; s.style.top = e.clientY + 6 + 'px'; s.style.fontSize = 10 + Math.random() * 8 + 'px'
      document.body.appendChild(s); s.addEventListener('animationend', () => s.remove())
    }
    addEventListener('mousemove', mv); return () => removeEventListener('mousemove', mv)
  }, [])
  return null
}
