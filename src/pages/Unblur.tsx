import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import Card from "../components/Card"
import Button from "../components/Button"
import { useNavigate, Link } from "react-router-dom"
import { useStore } from "../store"

// ================== Config ==================

const IMAGE_URL =
  "https://res.cloudinary.com/dwxa3tffm/image/upload/v1756905316/IMG_8794_1-min_dgtbko.png"

/**
 * Feel free to customize these.
 * type: 'choice' currently (multiple-choice). You can add more later if you like.
 * answer is the index in options that is correct.
 */
type Q = {
  id: string
  prompt: string
  options: string[]
  answer: number
  hint?: string
}

const QUESTIONS: Q[] = [
  {
    id: "dino",
    prompt: "What’s the creature theme of this whole quest?",
    options: ["Dragons", "Dinosaur", "Unicorns", "Koalas"],
    answer: 1,
    hint: "🦖",
  },
  {
    id: "nickname",
    prompt: "What’s the correct nickname?",
    options: ["Nati", "Bobi", "Bobíí", "Nika"],
    answer: 2,
    hint: "Double í",
  },
  {
    id: "drinks",
    prompt: "Which of these is NOT her thing?",
    options: ["Tea", "Milkshakes & lattes", "Sparkling water", "Hot chocolate"],
    answer: 1,
    hint: "We avoided these in the quiz.",
  },
  {
    id: "flow",
    prompt: "What comes right after this Unblur quest?",
    options: ["Gallery", "Gift", "Quiz", "Memory again"],
    answer: 2,
    hint: "We tune preferences next.",
  },
  {
    id: "who",
    prompt: "Who’s this adventure for?",
    options: ["Natalie Baranova (Natka)", "Random Stranger", "Bob Ross", "Dino Dan"],
    answer: 0,
    hint: "💖",
  },
]

// ================ Tiny sounds =================

function playDing() {
  const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
  const osc = ctx.createOscillator()
  const g = ctx.createGain()
  osc.type = "sine"
  osc.frequency.value = 880
  osc.connect(g)
  g.connect(ctx.destination)
  const now = ctx.currentTime
  g.gain.setValueAtTime(0.0001, now)
  g.gain.exponentialRampToValueAtTime(0.3, now + 0.02)
  g.gain.exponentialRampToValueAtTime(0.0001, now + 0.25)
  osc.start(now)
  osc.stop(now + 0.26)
}

// ================ Page =================

export default function Unblur() {
  const navigate = useNavigate()
  const setStep = useStore((s: any) => s.setStep)
  const step = useStore((s: any) => s.step)

  const [idx, setIdx] = React.useState(0)
  const [correctCount, setCorrectCount] = React.useState(0)
  const [answered, setAnswered] = React.useState<null | { choice: number; correct: boolean }>(null)
  const [shakeKey, setShakeKey] = React.useState(0)

  const total = QUESTIONS.length
  const progress = Math.round((correctCount / total) * 100)
  const done = progress >= 100

  React.useEffect(() => {
    if (done) {
      // mark quest progression
      setStep(step + 1)
    }
  }, [done, setStep, step])

  const current = QUESTIONS[idx]

  const onChoose = (choice: number) => {
    if (answered) return
    const ok = choice === current.answer
    setAnswered({ choice, correct: ok })
    if (ok) {
      playDing()
      setCorrectCount((c) => c + 1)
      // small delay then move to next question (unless last)
      setTimeout(() => {
        if (idx < total - 1) {
          setIdx(idx + 1)
          setAnswered(null)
        }
      }, 650)
    } else {
      // shake the card
      setShakeKey((k) => k + 1)
    }
  }

  const goNext = () => navigate("/quiz")

  // blur value smoothly decreases as progress rises
  const blurPx = Math.max(12 - (progress / 100) * 12, 0)
  const brightness = 0.6 + progress / 200 // 0.6 → 1.1

  return (
    <div className="min-h-screen max-w-4xl mx-auto px-4 py-8">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-extrabold">Photo Unblur</h1>
        <Link to="/" className="text-sm underline opacity-80 hover:opacity-100">Back home</Link>
      </div>

      <Card>
        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Left: The photo that unblurs */}
          <div className="order-2 md:order-1">
            <div className="relative w-full max-w-md mx-auto">
              <motion.img
                key={progress} // ensures filter animates on change
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
                <div className="mt-1 text-center text-xs opacity-70">{progress}% revealed</div>
              </div>
            </div>
          </div>

          {/* Right: Questions */}
          <div className="order-1 md:order-2">
            {!done ? (
              <motion.div
  key={`${current.id}-${shakeKey}`}
  initial={{ opacity: 0, y: 8 }}
  animate={
    answered?.correct === false
      ? { opacity: 1, y: 0, x: [0, -8, 8, -6, 6, -3, 3, 0] } // shake on wrong
      : { opacity: 1, y: 0, x: 0 }
  }
  transition={
    answered?.correct === false
      ? { duration: 0.4 }
      : { type: "spring", damping: 24, stiffness: 260 }
  }
  style={{ transformOrigin: "center" }}
>
  <div className="text-sm opacity-70 mb-2">
    Question {idx + 1} of {total}
  </div>
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
            isCorrect ? "bg-green-50 border-green-300" :
            isWrong ? "bg-rose-50 border-rose-300" :
            "bg-white border-black/10 hover:bg-black/5"
          ].join(" ")}
          whileTap={{ scale: answered ? 1 : 0.98 }}
        >
          {opt}
        </motion.button>
      )
    })}
  </div>

  <AnimatePresence>
    {answered && !answered.correct && current.hint && (
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        className="mt-3 text-sm opacity-70"
      >
        Hint: {current.hint}
      </motion.div>
    )}
  </AnimatePresence>
</motion.div>

            ) : (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", damping: 22, stiffness: 260 }}
              >
                <h2 className="text-xl font-semibold">Revealed! 🎉</h2>
                <p className="opacity-80 mt-1">
                  You nailed the mini-quiz. Ready for the next part?
                </p>
                <div className="mt-4">
                  <Button onClick={goNext} className="px-6">Continue to Quiz</Button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}
