// src/pages/Chef.tsx
import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate, Link } from "react-router-dom"
import Card from "../components/Card"
import Button from "../components/Button"
import { useStore } from "../store"
import { DotLottieReact } from "@lottiefiles/dotlottie-react"

/* ------------ utils ------------ */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/* ------------ data ------------ */
type Ingredient = { id: string; label: string; emoji: string }

const INGREDIENTS: Ingredient[] = [
  { id: "water",  label: "Boiling Water", emoji: "💧" },
  { id: "salt",   label: "Salt",          emoji: "🧂" },
  { id: "pasta",  label: "Pasta",         emoji: "🍝" },
  { id: "garlic", label: "Garlic",        emoji: "🧄" },
  { id: "oil",    label: "Olive Oil",     emoji: "🫒" },
  { id: "cheese", label: "Parmesan",      emoji: "🧀" },
]

const RECIPE_ORDER = ["water", "salt", "pasta", "garlic", "oil", "cheese"]
const MAX_LIVES = 2

/* orbit coordinates around a circle (for mixing animation) */
function orbitStyle(index: number, count: number, radius: number) {
  const angle = (index / count) * Math.PI * 2
  const x = Math.cos(angle) * radius
  const y = Math.sin(angle) * radius
  return { transform: `translate(${x}px, ${y}px)` }
}

/* ------------ component ------------ */
export default function Chef() {
  const navigate = useNavigate()
  const setStep = useStore(s => s.setStep)
  const stepIndex = useStore(s => s.step)

  const [added, setAdded] = React.useState<string[]>([])
  const [lives, setLives] = React.useState(MAX_LIVES)
  const [done, setDone] = React.useState(false)
  const [shake, setShake] = React.useState(0)
  const [celebrateVisible, setCelebrateVisible] = React.useState(false)

  // shuffle the ingredient buttons once per mount
  const shuffled = React.useRef<Ingredient[]>(shuffle(INGREDIENTS)).current

  const nextExpected = RECIPE_ORDER[added.length]

  React.useEffect(() => {
    if (done) {
      setStep(stepIndex + 1)
      setCelebrateVisible(true)
      const t = setTimeout(() => setCelebrateVisible(false), 2300)
      return () => clearTimeout(t)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done])

  function onAdd(ing: Ingredient) {
    if (done) return
    if (ing.id === nextExpected) {
      setAdded(prev => {
        const next = [...prev, ing.id]
        if (next.length === RECIPE_ORDER.length) setDone(true)
        return next
      })
    } else {
      setShake(k => k + 1)
      setLives(prev => {
        const next = prev - 1
        if (next <= 0) {
          // reset the round
          setAdded([])
          return MAX_LIVES
        }
        return next
      })
    }
  }

  function goResults() {
    navigate("/results")
  }

  // sauce/boil level rises as you add ingredients
  const fillPct = added.length / RECIPE_ORDER.length
  const sauceHeight = Math.round(40 + fillPct * 70) // px inside pot

  return (
    <div className="min-h-screen max-w-5xl mx-auto px-4 py-8">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-extrabold">Chef Challenge 👩‍🍳</h1>
        <Link to="/" className="text-sm underline opacity-80 hover:opacity-100">Back home</Link>
      </div>

      <Card>
        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* LEFT: Pot, bubbles, orbiting mix */}
          <motion.div
            key={shake}
            animate={shake ? { x: [0, -10, 10, -8, 8, -4, 4, 0] } : { x: 0 }}
            transition={{ duration: 0.5 }}
            className="relative flex flex-col items-center"
          >
            {/* Lives */}
            <div className="text-sm opacity-70">Lives</div>
            <div className="mt-1 flex gap-1 text-xl">
              {Array.from({ length: MAX_LIVES }).map((_, i) => (
                <span key={i} className={i < lives ? "" : "opacity-30"}>💖</span>
              ))}
            </div>

            {/* Pot */}
            <div className="mt-6 relative w-[220px] h-[220px]">
              {/* body */}
              <div className="absolute inset-0 rounded-full bg-gray-200/85 shadow-inner border border-black/10 overflow-hidden" />
              {/* rim */}
              <div className="absolute inset-0 rounded-full ring-4 ring-black/10 pointer-events-none" />

              {/* sauce fill */}
              <motion.div
                className="absolute left-1/2 -translate-x-1/2 bottom-6 w-[160px] rounded-full bg-[rgba(255,116,99,0.75)]"
                style={{ height: sauceHeight }}
                initial={false}
                animate={{ height: sauceHeight }}
                transition={{ type: "spring", stiffness: 120, damping: 18 }}
              />

              {/* simmer shimmer */}
              <motion.div
                className="absolute left-1/2 -translate-x-1/2 bottom-[88px] w-[150px] h-8 rounded-full bg-white/25 blur-[2px]"
                animate={{ opacity: [0.25, 0.45, 0.25], scaleX: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              />

              {/* steam */}
              <AnimatePresence>
                {added.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="absolute -top-8 left-1/2 -translate-x-1/2 text-2xl"
                  >
                    <motion.span
                      animate={{ y: [-6, -14, -6], opacity: [0.4, 0.9, 0.4] }}
                      transition={{ repeat: Infinity, duration: 1.8 }}
                    >
                      ♨️
                    </motion.span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* orbiting ingredients (mixing) */}
              <motion.div
                className="absolute inset-0 grid place-items-center"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 9, ease: "linear" }}
              >
                {added.map((id, i) => {
                  const ing = INGREDIENTS.find(x => x.id === id)!
                  const count = Math.max(added.length, 1)
                  const radius = 48 + (i % 2) * 10 // slight varied radii for depth
                  return (
                    <motion.div
                      key={id + i}
                      className="absolute text-3xl"
                      style={orbitStyle(i, count, radius)}
                      initial={{ scale: 0.7, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 220, damping: 16 }}
                    >
                      {ing.emoji}
                    </motion.div>
                  )
                })}
              </motion.div>

              {/* bubbles rising */}
              {Array.from({ length: 7 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute bottom-10 left-1/2 w-2 h-2 rounded-full bg-white/70"
                  style={{ marginLeft: (i - 3) * 14 }}
                  animate={{ y: [-10, -120], opacity: [0, 1, 0] }}
                  transition={{ repeat: Infinity, duration: 1.6 + i * 0.15, ease: "easeOut" }}
                />
              ))}
            </div>

            {!done && (
              <div className="mt-3 text-sm opacity-80 text-center">
                Step {added.length + 1} of {RECIPE_ORDER.length} — add the next ingredient.
              </div>
            )}

            {/* Finish CTAs (visible after the celebration modal closes) */}
            <AnimatePresence>
              {done && !celebrateVisible && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-6 text-center"
                >
                  <h2 className="text-xl font-semibold">Perfectly cooked! 🎉</h2>
                  <p className="opacity-80 mt-1">The chef approves your pasta dish.</p>
                  <div className="mt-4">
                    <Button onClick={goResults}>Finish → Results</Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* RIGHT: Ingredient buttons (shuffled, mobile-friendly labels) */}
          <div>
            <div className="text-sm opacity-70 mb-2">Tap the ingredients (order stays secret 😉)</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {shuffled.map((ing) => {
                const isUsed = added.includes(ing.id)
                return (
                  <motion.button
                    key={ing.id}
                    whileTap={{ scale: 0.97 }}
                    disabled={isUsed || done}
                    onClick={() => onAdd(ing)}
                    className={[
                      "rounded-2xl border border-black/10 bg-white shadow-sm",
                      "px-3 py-3 flex flex-col items-center text-center transition",
                      isUsed ? "opacity-50 cursor-default" : "hover:bg-black/5",
                    ].join(" ")}
                  >
                    <span className="text-3xl leading-none">{ing.emoji}</span>
                    <span className="mt-2 text-sm font-medium leading-tight whitespace-normal break-words">
                      {ing.label}
                    </span>
                  </motion.button>
                )
              })}
            </div>

            {!done && (
              <div className="mt-3 text-xs opacity-60">
                Wrong pick shakes the pot and costs a heart. Two mistakes reset the recipe.
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Celebration Modal */}
      <AnimatePresence>
        {celebrateVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-6"
          >
            <motion.div
              initial={{ scale: 0.9, y: 8, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              transition={{ type: "spring", stiffness: 220, damping: 20 }}
              className="bg-white rounded-3xl p-5 w-full max-w-md text-center shadow-xl"
            >
              <DotLottieReact
                src="https://lottie.host/c85d47b9-5c00-4eb2-90e3-6ec06641505c/Fzm2BrnnWe.lottie"
                loop
                autoplay
                style={{ width: "100%", height: "auto" }}
              />
              <div className="mt-2 text-2xl font-extrabold tracking-tight">Brava, benissimo! 🇮🇹</div>
              <p className="opacity-70 mt-1">Chef’s kiss. That’s pasta perfection.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
