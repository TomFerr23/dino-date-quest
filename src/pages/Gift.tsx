import React from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import Card from "../components/Card"
import Button from "../components/Button"
import { useStore } from "../store"

type Idea = { title?: string; name?: string; text?: string; description?: string; details?: string } | string
type QuizAnswers = Record<string, string | string[] | number>
type MemoryStats = { pairs?: number; moves?: number; seconds?: number; streak?: number; bestStreak?: number }

export default function Gift() {
  const navigate = useNavigate()

  // ——— Pull from store (robust to different shapes/names) ———
  const selectedIdea: Idea | null = useStore((s: any) =>
    s.selectedIdea ?? s.results?.selectedIdea ?? null
  )
  const quizAnswers: QuizAnswers | null = useStore((s: any) =>
    s.quiz?.answers ?? s.quizAnswers ?? null
  )
  const quizIdeas: any[] | null = useStore((s: any) =>
    s.quiz?.ideas ?? s.quizIdeas ?? null
  )
  const memoryStats: MemoryStats | null = useStore((s: any) =>
    s.memory?.stats ?? s.memoryStats ?? null
  )
  const matchedThumbs: string[] | null = useStore((s: any) =>
    s.memory?.matchedThumbs ?? s.memory?.matchedUrls ?? s.memoryThumbs ?? null
  )

  // Normalize the selected idea into {title, text}
  const idea = React.useMemo(() => {
    if (!selectedIdea) return null
    if (typeof selectedIdea === "string") {
      return { title: "Your Date", text: selectedIdea }
    }
    const obj = selectedIdea as any
    const title = obj.title || obj.name || "Your Date"
    const text = obj.text || obj.description || obj.details || ""
    return { title, text }
  }, [selectedIdea])

  // Helpers
  const hasQuiz = !!quizAnswers && Object.keys(quizAnswers).length > 0
  const hasMemory = !!(memoryStats && (memoryStats.pairs || memoryStats.moves || memoryStats.seconds))
  const hasThumbs = !!(matchedThumbs && matchedThumbs.length)

  return (
    <div className="min-h-screen max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl md:text-3xl font-extrabold">Quest Recap</h1>
        <Link to="/" className="text-sm underline opacity-80 hover:opacity-100">
          Back home
        </Link>
      </div>

      {/* If nothing is selected yet, nudge user */}
      {!idea && !hasQuiz && !hasMemory ? (
        <Card className="text-center">
          <p className="opacity-80">
            Looks like you haven’t finished the quests yet. Do the Memory game and the Quiz to unlock your recap!
          </p>
          <div className="mt-4 flex gap-3 justify-center flex-wrap">
            <Button onClick={() => navigate("/memory")}>Play Memory</Button>
            <Button className="bg-black/70" onClick={() => navigate("/quiz")}>Go to Preferences</Button>
          </div>
        </Card>
      ) : (
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Left: Date idea + Quiz answers */}
          <div className="space-y-6">
            <Card>
              <div className="flex items-start justify-between">
                <h2 className="text-xl font-semibold">Your Date Pick</h2>
                <div className="flex gap-2">
                  <Button onClick={() => navigate("/results")}>Change idea</Button>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {idea ? (
                  <motion.div
                    key="idea"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ type: "spring", stiffness: 260, damping: 22 }}
                    className="mt-3"
                  >
                    <h3 className="text-lg font-bold">{idea.title}</h3>
                    {idea.text && <p className="mt-2 opacity-80 whitespace-pre-wrap">{idea.text}</p>}
                  </motion.div>
                ) : (
                  <motion.div
                    key="noidea"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="mt-3 opacity-70"
                  >
                    No date selected yet. Pick one from the results.
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>

            {hasQuiz && (
              <Card>
                <h2 className="text-xl font-semibold">Your Preferences</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {Object.entries(quizAnswers!).map(([k, v], i) => {
                    const val = Array.isArray(v) ? v.join(", ") : String(v)
                    return <Pill key={k + i} label={k} value={val} />
                  })}
                </div>

                {!!(quizIdeas && quizIdeas.length) && (
                  <div className="mt-4">
                    <p className="text-sm opacity-70 mb-2">Other ideas we considered:</p>
                    <ul className="text-sm list-disc pl-5 space-y-1 opacity-80">
                      {quizIdeas.slice(0, 3).map((it: any, idx: number) => {
                        const title = it?.title || it?.name || `Idea ${idx + 1}`
                        return <li key={idx}>{title}</li>
                      })}
                    </ul>
                  </div>
                )}
              </Card>
            )}
          </div>

          {/* Right: Memory summary */}
          <div className="space-y-6">
            {hasMemory && (
              <Card>
                <h2 className="text-xl font-semibold">Memory Match</h2>
                <div className="mt-3 grid grid-cols-3 gap-3">
                  <Stat label="Pairs" value={memoryStats?.pairs ?? "—"} />
                  <Stat label="Moves" value={memoryStats?.moves ?? "—"} />
                  <Stat label="Time" value={formatSeconds(memoryStats?.seconds)} />
                </div>
                {(memoryStats?.streak || memoryStats?.bestStreak) && (
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    {"streak" in (memoryStats || {}) && <Stat label="Streak" value={memoryStats?.streak ?? "—"} />}
                    {"bestStreak" in (memoryStats || {}) && <Stat label="Best" value={memoryStats?.bestStreak ?? "—"} />}
                  </div>
                )}
              </Card>
            )}

            {hasThumbs && (
              <Card>
                <h3 className="text-lg font-semibold mb-2">Moments you matched</h3>
                <Mosaic images={matchedThumbs!} />
              </Card>
            )}

            {!hasMemory && !hasThumbs && (
              <Card className="text-center">
                <p className="opacity-80">Play the Memory game to see your stats and a mosaic of the photos you matched.</p>
                <div className="mt-4"><Button onClick={() => navigate("/memory")}>Play Memory</Button></div>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

/* ---------------- Small components ---------------- */

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-black/10 px-3 py-2 bg-white/60">
      <div className="text-xs opacity-60">{label}</div>
      <div className="font-semibold">{value}</div>
    </div>
  )
}

function Pill({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-black/10 px-3 py-1.5 bg-white/70">
      <span className="text-[11px] uppercase tracking-wide opacity-60">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  )
}

function Mosaic({ images }: { images: string[] }) {
  // responsive row height / count
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
      {images.slice(0, 24).map((src, i) => (
        <motion.div
          key={src + i}
          initial={{ opacity: 0, scale: 0.96, y: 6 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: i * 0.02, type: "spring", damping: 22, stiffness: 240 }}
          className="aspect-square overflow-hidden rounded-lg border border-black/10 bg-black"
        >
          <img src={src} alt="" className="w-full h-full object-cover" loading="lazy" />
        </motion.div>
      ))}
      {images.length > 24 && (
        <div className="col-span-full text-center text-sm opacity-60 mt-1">
          +{images.length - 24} more memories
        </div>
      )}
    </div>
  )
}

function formatSeconds(s?: number) {
  if (!s && s !== 0) return "—"
  const m = Math.floor(s / 60)
  const r = s % 60
  return `${m}:${String(r).padStart(2, "0")}`
}
