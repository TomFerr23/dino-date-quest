import React from 'react'
import CardShell from '../components/Card'
import Button from '../components/Button'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Confetti from 'react-confetti'
import { useStore } from '../store'
import { PERSON } from '../config'

type GameCard = {
  id: number
  img: string
  flipped: boolean
  matched: boolean
}

const FALLBACK_IMAGES = [
  "https://res.cloudinary.com/dwxa3tffm/image/upload/v1756899458/IMG_3536_1-min_tgnnd6.png",
  "https://res.cloudinary.com/dwxa3tffm/image/upload/v1756899458/IMG_2920_1-min_l3r0ww.png",
  "https://res.cloudinary.com/dwxa3tffm/image/upload/v1756899456/IMG_4178_2_1-min_c55rvt.png",
  "https://res.cloudinary.com/dwxa3tffm/image/upload/v1756899456/IMG_2627_1-min_je3jfs.png",
  "https://res.cloudinary.com/dwxa3tffm/image/upload/v1756899455/IMG_2895_2_1-min_ewgo1t.png",
  "https://res.cloudinary.com/dwxa3tffm/image/upload/v1756899454/7f891593-88e2-4f5c-87b4-669301593869_1-min_jg5a3k.png",
  "https://res.cloudinary.com/dwxa3tffm/image/upload/v1756899454/IMG_8151_1-min_bwswpm.png",
  "https://res.cloudinary.com/dwxa3tffm/image/upload/v1756899453/20250627_172253_F5A563_1-min_qiam0k.png",
  "https://res.cloudinary.com/dwxa3tffm/image/upload/v1756899452/56f86152-ab4d-4bec-ba3f-4576f5fa931a_1-min_z0rfa5.png",
  "https://res.cloudinary.com/dwxa3tffm/image/upload/v1756899451/IMG_1201_1-min_bkzrcd.png",
  "https://res.cloudinary.com/dwxa3tffm/image/upload/v1756899451/IMG_3369_2_1-min_diaxvw.png",
  "https://res.cloudinary.com/dwxa3tffm/image/upload/v1756899449/20250626_203401_F9AB90_1-min_uaoc5u.png",
]

// ---------- utils ----------
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
function preload(urls: string[]) {
  urls.forEach((u) => { const img = new Image(); img.src = u })
}
function useWindowSize() {
  const [size, set] = React.useState({ w: 1024, h: 768 })
  React.useEffect(() => {
    const update = () => set({ w: window.innerWidth, h: window.innerHeight })
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])
  return size
}
// sounds
function playDing() {
  const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
  const osc = ctx.createOscillator()
  const g = ctx.createGain()
  osc.type = 'sine'
  osc.frequency.value = 880
  osc.connect(g); g.connect(ctx.destination)
  const now = ctx.currentTime
  g.gain.setValueAtTime(0.0001, now)
  g.gain.exponentialRampToValueAtTime(0.3, now + 0.02)
  g.gain.exponentialRampToValueAtTime(0.0001, now + 0.25)
  osc.start(now); osc.stop(now + 0.26)
}
function playWin() {
  const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
  const freqs = [523.25, 659.25, 783.99, 1046.5] // C–E–G + sparkle C
  const now = ctx.currentTime
  freqs.forEach((f, i) => {
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.type = i === 3 ? 'triangle' : 'sine'
    o.frequency.value = f
    o.connect(g); g.connect(ctx.destination)
    g.gain.setValueAtTime(0.0001, now)
    g.gain.exponentialRampToValueAtTime(0.25, now + 0.05)
    g.gain.exponentialRampToValueAtTime(0.0001, now + 1.0)
    o.start(now); o.stop(now + 1.05)
  })
}

// ---------- component ----------
export default function Memory() {
  const addScale = useStore((s) => s.addScale)
  const setStep = useStore((s) => s.setStep)
  const nav = useNavigate()
  const { w, h } = useWindowSize()

  const images = (PERSON as any).memoryImages?.length
    ? (PERSON as any).memoryImages as string[]
    : FALLBACK_IMAGES

  const pairs = Math.min(8, images.length)
  const picks = images.slice(0, pairs)
  const initialDeck = shuffle(
    picks.flatMap((img, i) => [
      { id: i * 2, img, flipped: false, matched: false },
      { id: i * 2 + 1, img, flipped: false, matched: false },
    ])
  ) as GameCard[]

  const [deck, setDeck] = React.useState<GameCard[]>(initialDeck)
  const [choiceIdxs, setChoiceIdxs] = React.useState<number[]>([])
  const [moves, setMoves] = React.useState(0)
  const [seconds, setSeconds] = React.useState(0)
  const [running, setRunning] = React.useState(true)
  const [won, setWon] = React.useState(false)
  const [justMatchedIds, setJustMatchedIds] = React.useState<number[]>([])

  React.useEffect(() => preload(picks), [])
  React.useEffect(() => {
    if (!running || won) return
    const t = setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => clearInterval(t)
  }, [running, won])

  function flipAt(idx: number) {
    if (won) return
    const c = deck[idx]
    if (c.flipped || c.matched) return
    if (choiceIdxs.length === 2) return

    const next = [...deck]
    next[idx] = { ...c, flipped: true }
    setDeck(next)

    const nextChoices = [...choiceIdxs, idx]
    setChoiceIdxs(nextChoices)

    if (nextChoices.length === 2) {
      const [a, b] = nextChoices
      setMoves((m) => m + 1)
      const same = next[a].img === next[b].img

      if (same) {
        setTimeout(() => {
          const n2 = [...next]
          n2[a] = { ...n2[a], matched: true }
          n2[b] = { ...n2[b], matched: true }
          setDeck(n2)
          setChoiceIdxs([])
          setJustMatchedIds([n2[a].id, n2[b].id])
          playDing()
          setTimeout(() => setJustMatchedIds([]), 950)

          if (n2.every((cc) => cc.matched)) {
            setRunning(false)
            setWon(true)
            playWin()
            addScale()
            setStep(2)
          }
        }, 280)
      } else {
        setTimeout(() => {
          const n2 = [...next]
          n2[a] = { ...n2[a], flipped: false }
          n2[b] = { ...n2[b], flipped: false }
          setDeck(n2)
          setChoiceIdxs([])
        }, 620)
      }
    }
  }

  function reset() {
    const reshuffled = shuffle(initialDeck)
    setDeck(reshuffled)
    setChoiceIdxs([])
    setMoves(0)
    setSeconds(0)
    setRunning(true)
    setWon(false)
    setJustMatchedIds([])
  }

  // ---------- sizing ----------
  const cols = 4, rows = 4
  const pagePadding = 32
  const gap = w < 480 ? 10 : 12
  const chromeEstimate = w < 480 ? 200 : 180
  const availW = Math.max(340, w - pagePadding)
  const availH = Math.max(360, h - chromeEstimate)
  const widthPerCol = (availW - gap * (cols - 1)) / cols
  const heightPerRow = (availH - gap * (rows - 1)) / rows
  const widthFromHeight = heightPerRow * 0.75
  let cardW = Math.floor(Math.min(widthPerCol, widthFromHeight))
  cardW = Math.max(130, Math.min(cardW, 200)) // push min size up
  const cardH = Math.floor(cardW * 4 / 3)

  return (
    <div className="min-h-screen max-w-[1100px] mx-auto px-4 py-6">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-xl md:text-2xl font-semibold">Memory Match</h2>
        <div className="flex items-center gap-3 text-sm opacity-80">
          <span>⏱ {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')}</span>
          <span>•</span>
          <span>Moves: {moves}</span>
        </div>
      </div>

      <CardShell>
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm opacity-70">Find all the pairs to continue.</div>
          <div className="flex gap-2">
            <Button onClick={reset} className="bg-black/80">Reset</Button>
            <Link to="/" className="self-center underline text-sm">Back</Link>
          </div>
        </div>

        <div
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${cols}, ${cardW}px)`,
            gap: `${gap}px`,
            justifyContent: 'center',
          }}
        >
          {deck.map((c, i) => (
            <MemoryCard
              key={c.id}
              id={c.id}
              img={c.img}
              flipped={c.flipped || c.matched}
              justMatched={justMatchedIds.includes(c.id)}
              disabled={c.matched || choiceIdxs.length === 2}
              onClick={() => flipAt(i)}
              width={cardW}
              height={cardH}
            />
          ))}
        </div>

        <AnimatePresence>
          {won && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mt-5 p-4 rounded-2xl bg-green-50 border border-green-200"
            >
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <div className="font-semibold">Nice! All pairs matched.</div>
                  <div className="text-sm opacity-80">
                    Time {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')} • Moves {moves}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => nav('/unblur')}>Continue → Unblur</Button>
                  <Button className="bg-black/80" onClick={reset}>Play again</Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardShell>

      <AnimatePresence>
        {won && (
          <Confetti
            width={w}
            height={h}
            numberOfPieces={300}
            recycle={false}
            gravity={0.25}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

// Single card with flip + match border sweep
function MemoryCard({
  id,
  img,
  flipped,
  justMatched,
  disabled,
  onClick,
  width,
  height,
}: {
  id: number
  img: string
  flipped: boolean
  justMatched: boolean
  disabled?: boolean
  onClick: () => void
  width: number
  height: number
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || flipped}
      className="relative rounded-xl overflow-hidden focus:outline-none focus:ring-2 focus:ring-dino/60 disabled:cursor-default"
      style={{ width, height }}
      aria-label={flipped ? 'Face up card' : 'Face down card'}
    >
      <motion.div
        className="w-full h-full"
        initial={false}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.35 }}
        style={{ transformStyle: 'preserve-3d' as React.CSSProperties['transformStyle'] }}
      >
        {/* Face down */}
        <div
          className="absolute inset-0 grid place-items-center bg-cream text-3xl"
          style={{ backfaceVisibility: 'hidden' as React.CSSProperties['backfaceVisibility'] }}
        >
          🦖
        </div>

        {/* Face up */}
        <div
          className="absolute inset-0"
          style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' } as React.CSSProperties}
        >
          <img src={img} alt="" className="w-full h-full object-cover" />
        </div>
      </motion.div>

      {/* Match border sweep */}
      <AnimatePresence>
        {justMatched && (
          <motion.div
            key={`sweep-${id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none absolute inset-0"
          >
            <div
              className="absolute inset-[2px] rounded-[12px]"
              style={{
                background:
                  'conic-gradient(from 0deg, #ff6b6b, #ffd166, #06d6a0, #4cc9f0, #ff6b6b 360deg)',
                WebkitMask:
                  'radial-gradient(circle closest-side, transparent calc(100% - 5px), black calc(100% - 4px))',
                mask:
                  'radial-gradient(circle closest-side, transparent calc(100% - 5px), black calc(100% - 4px))',
                animation: 'sweep 0.9s linear forwards',
                borderRadius: 12,
              } as React.CSSProperties}
            />
            <style>{`
              @keyframes sweep {
                0% { filter: hue-rotate(0deg); transform: rotate(0deg); }
                100% { filter: hue-rotate(360deg); transform: rotate(360deg); }
              }
            `}</style>
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  )
}
