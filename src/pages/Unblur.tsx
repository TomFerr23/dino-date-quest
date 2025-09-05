import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import Card from "../components/Card"
import Button from "../components/Button"
import { useNavigate, Link } from "react-router-dom"
import Confetti from "react-confetti"
import { useStore } from "../store"

// ============== Config ==============

const IMAGE_URL =
  "https://res.cloudinary.com/dwxa3tffm/image/upload/v1756905316/IMG_8794_1-min_dgtbko.png"

type Q = {
  id: string
  prompt: string
  options: string[]
  answer: number // index of correct option
}

// 4 questions total
const QUESTIONS: Q[] = [
  {
    id: "country",
    prompt: "Which country did this memory take place in?",
    options: [
      "🇮🇹 Italy",
      "🇨🇿 Czech Republic",
      "🇹🇭 Thailand",
      "🇳🇱 Netherlands",
    ],
    answer: 0,
  },
  {
    id: "city",
    prompt: "In what city was this memory?",
    options: ["San Felice", "Terracina", "Priverno", "Sabaudia"],
    answer: 1,
  },
  {
    id: "pasta",
    prompt: "What was the name of the pasta dish?",
    options: [
      "Spaghetti alle vongole",
      "Spaghetti allo scoglio",
      "Spaghetti al vicoletto",
      "Spaghetti volanti",
    ],
    answer: 2,
  },
  {
    id: "bill",
    prompt: "How did it end up when Natka tried to pay?",
    options: [
      "Natka stands up and pays smoothly, leaving a tip",
      "Natka asks the waiter to pay and he tells her to sit down",
      'Natka asks “Eee il conto per favore” and gets free limoncello',
      "Natka never tries again to pay for dinner in Italy",
    ],
    answer: 1,
  },
]

// ============== Utils ==============

function playDuoChime() {
  const AudioCtx =
    (window as any).AudioContext || (window as any).webkitAudioContext
  const ctx = new AudioCtx()
  const t0 = ctx.currentTime
  const notes = [523.25, 659.25, 783.99, 1046.5] // C E G C

  notes.forEach((freq, i) => {
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.type = "sine"
    o.frequency.value = freq
    o.connect(g)
    g.connect(ctx.destination)

    const start = t0 + i * 0.08
    const end = start + 0.25
    g.gain.setValueAtTime(0.0001, start)
    g.gain.exponentialRampToValueAtTime(0.25, start + 0.04)
    g.gain.exponentialRampToValueAtTime(0.0001, end)
    o.start(start)
    o.stop(end + 0.01)
  })
}

function useWindowSize() {
  const [size, setSize] = React.useState({ w: 0, h: 0 })
  React.useEffect(() => {
    const update = () => setSize({ w: window.innerWidth, h: window.innerHeight })
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])
  return size
}

// ============== Page ==============

export default function Unblur() {
  const navigate = useNavigate()
  const setStep = useStore((s: any) => s.setStep)

  const total = QUESTIONS.length
  const TOTAL_LIVES = 2

  const [idx, setIdx] = React.useState(0)
  const [correctCount, setCorrectCount] = React.useState(0)
  const [answered, setAnswered] =
    React.useState<null | { choice: number; correct: boolean }>(null)
  const [shakeKey, setShakeKey] = React.useState(0)
  const [livesLeft, setLivesLeft] = React.useState(TOTAL_LIVES)
  const [failed, setFailed] = React.useState(false)
  const [burst, setBurst] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)
  const [recordedProgress, setRecordedProgress] = React.useState(false)

  const { w, h } = useWindowSize()
  React.useEffect(() => setMounted(true), [])

  const progress = Math.round((correctCount / total) * 100)
  const done = progress >= 100

  // Record quest progression ONCE to avoid infinite loops
  React.useEffect(() => {
    if (done && !recordedProgress) {
      setStep((s: number) => s + 1)
      setRecordedProgress(true)
    }
  }, [done, recordedProgress, setRecordedProgress, setStep])

  // auto clear confetti flag
  React.useEffect(() => {
    if (!burst) return
    const t = setTimeout(() => setBurst(false), 900)
    return () => clearTimeout(t)
  }, [burst])

  const current = QUESTIONS[idx]

  const onChoose = (choice: number) => {
    if (answered || failed || done) return
    const ok = choice === current.answer
    setAnswered({ choice, correct: ok })

    if (ok) {
      setCorrectCount((c) => c + 1)
      playDuoChime()
      setBurst(true)

      setTimeout(() => {
        if (idx < total - 1) {
          setIdx((i) => i + 1)
          setAnswered(null)
        }
      }, 700)
    } else {
      setShakeKey((k) => k + 1)
      setLivesLeft((l) => {
        const next = l - 1
        if (next <= 0) setFailed(true)
        return next
      })
    }
  }

  const restart = () => {
    setIdx(0)
    setCorrectCount(0)
    setAnswered(null)
    setLivesLeft(TOTAL_LIVES)
    setFailed(false)
    setBurst(false)
    setRecordedProgress(false)
  }

  const goNext = () => navigate("/quiz")

  // image reveal as you progress
  const blurPx = Math.max(12 - (progress / 100) * 12, 0) // 12 → 0
  const brightness = 0.6 + progress / 200 // 0.6 → 1.1

  // hearts UI
  const hearts =
    "❤️".repeat(Math.max(livesLeft, 0)) +
    "🤍".repeat(TOTAL_LIVES - Math.max(livesLeft, 0))

  return (
    <div className="min-h-screen max-w-4xl mx-auto px-4 py-8">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-extrabold">Photo Unblur</h1>
        <Link to="/" className="text-sm underline opacity-80 hover:opacity-100">
          Back home
        </Link>
      </div>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm opacity-70">
            {failed ? "Game Over" : `Question ${Math.min(idx + 1, total)} of ${total}`}
          </div>
          <div className="text-sm">{hearts}</div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Left: The photo that unblurs */}
          <div className="order-2 md:order-1">
            <div className="relative w-full max-w-md mx-auto">
              <motion.img
                key={progress} // re-trigger filter tween
                src={IMAGE_URL}
                alt="Hidden memory"
                className="rounded-2xl w-full h-auto shadow-[0_16px_36px_rgba(0,0,0,0.12)]"
                initial={{ filter: `blur(${blurPx}px) brightness(${brightness})` }}
                animate={{ filter: `blur(${blurPx}px) brightness(${brightness})` }}
                transition={{ duration: 0.35 }}
              />

              {/* Progress bar overlay */}
              <div className="absolute -bottom-4 left-0 right-0">
                <div className="h-3 bg-black/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-dino rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ type: "spring", damping: 22, stiffness: 220 }}
                  />
                </div>
                <div className="mt-1 text-center text-xs opacity-70">
                  {progress}% revealed
                </div>
              </div>
            </div>
          </div>

          {/* Right: Questions / Results */}
          <div className="order-1 md:order-2">
            {/* While playing */}
            {!done && !failed && (
              <motion.div
                key={`${current.id}-${shakeKey}`}
                initial={{ opacity: 0, y: 8 }}
                animate={
                  answered?.correct === false
                    ? { opacity: 1, y: 0, x: [0, -8, 8, -6, 6, -3, 3, 0] }
                    : { opacity: 1, y: 0, x: 0 }
                }
                transition={
                  answered?.correct === false
                    ? { duration: 0.4 }
                    : { type: "spring", damping: 24, stiffness: 260 }
                }
                style={{ transformOrigin: "center" }}
              >
                <h2 className="text-xl font-semibold mb-3">{current.prompt}</h2>

                <div className="grid gap-2">
                  {current.options.map((opt, i) => {
                    const isPicked = answered?.choice === i
                    const isCorrect = answered?.correct && isPicked
                    const isWrong = answered && isPicked && !answered.correct

                    return (
                      <motion.button
                        key={i}
                        onClick={() => onChoose(i)}
                        disabled={!!answered}
                        className={[
                          "text-left px-4 py-3 rounded-xl border transition",
                          "disabled:opacity-100 disabled:cursor-default",
                          isCorrect
                            ? "bg-green-50 border-green-300"
                            : isWrong
                            ? "bg-rose-50 border-rose-300"
                            : "bg-white border-black/10 hover:bg-black/5",
                        ].join(" ")}
                        whileTap={{ scale: answered ? 1 : 0.98 }}
                      >
                        {opt}
                      </motion.button>
                    )
                  })}
                </div>
              </motion.div>
            )}

            {/* Failed state */}
            {failed && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", damping: 22, stiffness: 260 }}
              >
                <h2 className="text-xl font-semibold">Out of hearts 💔</h2>
                <p className="opacity-80 mt-1">
                  You can be wrong only twice in the whole game. Want to try again?
                </p>
                <div className="mt-4 flex gap-2">
                  <Button onClick={restart} className="px-6">Restart</Button>
                  <Link to="/" className="self-center underline text-sm opacity-80">
                    Back home
                  </Link>
                </div>
              </motion.div>
            )}

            {/* Done state */}
            {done && !failed && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", damping: 22, stiffness: 260 }}
              >
                <h2 className="text-xl font-semibold">Revealed! 🎉</h2>
                <p className="opacity-80 mt-1">
                  You nailed it. Ready for the next quest?
                </p>
                <div className="mt-4">
                  <Button onClick={goNext} className="px-6">Continue to Quiz</Button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </Card>

      {/* Confetti on correct answers (guarded for SSR/first paint) */}
      <AnimatePresence>
        {mounted && burst && (
          <Confetti
            width={w || 1000}
            height={h || 800}
            numberOfPieces={250}
            recycle={false}
            gravity={0.25}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
