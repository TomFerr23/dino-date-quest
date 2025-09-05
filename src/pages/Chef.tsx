// src/pages/Chef.tsx
import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate, Link } from "react-router-dom"
import Card from "../components/Card"
import Button from "../components/Button"
import { useStore } from "../store"

type Ingredient = {
  id: string
  label: string
  emoji: string
}

const INGREDIENTS: Ingredient[] = [
  { id: "water", label: "Boiling water", emoji: "💧" },
  { id: "salt", label: "Salt", emoji: "🧂" },
  { id: "pasta", label: "Pasta", emoji: "🍝" },
  { id: "garlic", label: "Garlic", emoji: "🧄" },
  { id: "oil", label: "Olive oil", emoji: "🫒" },
  { id: "parsley", label: "Parsley", emoji: "🌿" },
]

const RECIPE_ORDER = ["water", "salt", "pasta", "garlic", "oil", "parsley"]

export default function Chef() {
  const navigate = useNavigate()
  const setStep = useStore((s) => s.setStep)
  const stepIndex = useStore((s) => s.step)

  const [added, setAdded] = React.useState<string[]>([])
  const [lives, setLives] = React.useState(2)
  const [done, setDone] = React.useState(false)
  const [shake, setShake] = React.useState(0)

  React.useEffect(() => {
    if (done) setStep(stepIndex + 1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done])

  function onAdd(ing: Ingredient) {
    if (done) return
    const nextExpected = RECIPE_ORDER[added.length]

    if (ing.id === nextExpected) {
      // correct ingredient
      setAdded((prev) => [...prev, ing.id])
      if (added.length + 1 === RECIPE_ORDER.length) {
        setDone(true)
      }
    } else {
      // wrong ingredient
      setLives((prev) => {
        const next = prev - 1
        if (next <= 0) {
          setAdded([])
          return 2
        }
        setShake((k) => k + 1)
        return next
      })
    }
  }

  function goResults() {
    navigate("/results")
  }

  return (
    <div className="min-h-screen max-w-5xl mx-auto px-4 py-8">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-extrabold">Chef Challenge 👨‍🍳</h1>
        <Link to="/" className="text-sm underline opacity-80 hover:opacity-100">
          Back home
        </Link>
      </div>

      <Card>
        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Left: Pot + status */}
          <motion.div
            key={shake}
            animate={
              shake
                ? { x: [0, -8, 8, -6, 6, -3, 3, 0] }
                : { x: 0 }
            }
            transition={{ duration: 0.5 }}
            className="relative flex flex-col items-center justify-center"
          >
            <div className="text-sm opacity-70">Lives left</div>
            <div className="mt-1 flex gap-1 text-xl">
              {Array.from({ length: 2 }).map((_, i) => (
                <span key={i} className={i < lives ? "" : "opacity-30"}>
                  💖
                </span>
              ))}
            </div>

            {/* Pot / pan */}
            <div className="mt-8 w-40 h-40 rounded-full bg-gray-200 flex items-center justify-center text-4xl shadow-inner relative">
              {added.map((id, i) => {
                const ing = INGREDIENTS.find((x) => x.id === id)!
                return (
                  <motion.div
                    key={i}
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: "spring", damping: 15, stiffness: 200 }}
                    className="absolute"
                  >
                    {ing.emoji}
                  </motion.div>
                )
              })}
            </div>

            {done && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 text-center"
              >
                <h2 className="text-xl font-semibold">Perfectly cooked! 🎉</h2>
                <p className="opacity-80 mt-1">The chef approves your pasta dish.</p>
                <div className="mt-4">
                  <Button onClick={goResults}>Finish → Results</Button>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Right: Ingredients to click */}
          <div>
            <div className="text-sm opacity-70 mb-2">Add ingredients in the right order:</div>
            <div className="grid grid-cols-2 gap-3">
              {INGREDIENTS.map((ing) => {
                const isUsed = added.includes(ing.id)
                return (
                  <motion.button
                    key={ing.id}
                    whileTap={{ scale: 0.95 }}
                    disabled={isUsed || done}
                    onClick={() => onAdd(ing)}
                    className={[
                      "px-4 py-3 rounded-xl border text-left transition flex items-center gap-3",
                      isUsed ? "opacity-50 cursor-default" : "hover:bg-black/5",
                    ].join(" ")}
                  >
                    <span className="text-2xl">{ing.emoji}</span>
                    <span className="font-medium">{ing.label}</span>
                  </motion.button>
                )
              })}
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
