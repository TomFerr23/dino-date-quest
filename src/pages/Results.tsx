// src/pages/Results.tsx
import React from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import Card from "../components/Card"
import Button from "../components/Button"
import { useStore } from "../store"

type DateIdea = {
  title: string
  blurb: string
  estCost: "€" | "€€" | "€€€"
  tags: string[]
  steps: string[]
}

export default function Results() {
  const navigate = useNavigate()

  // global progress (works for Memory already)
  const scales = useStore((s: any) => s.scales) as Array<{ id: string; value?: any }>
  const results = useStore((s: any) => s.results) as Record<string, any>

  // chosen idea (from Quiz)
  const [idea, setIdea] = React.useState<DateIdea | null>(null)
  React.useEffect(() => {
    try {
      const v = localStorage.getItem("chosen_date_idea")
      if (v) setIdea(JSON.parse(v))
    } catch {}
  }, [])

  function printCoupon() {
    window.print()
  }

  // Memory: real status (already wired)
  const memoryOk = results?.memory?.won ?? !!scales?.find((x) => x.id === "memory")

  // === Hard-coded completions (no changes to other pages needed) ===
  const unblurOk = true
  const chefOk = true
  // Optional decorative text
  const unblurInfo = "Score: 4/4 • Mistakes used: 0"
  const chefInfo = "Dish approved 👨‍🍳 • Pasta assembled"

  return (
    <div className="min-h-screen max-w-6xl mx-auto px-4 py-8">
      {/* PRINT CSS: only coupon should print */}
      <style>{`
        @media print {
          .print-hide { display: none !important; }
          #coupon-print { display: block !important; }
          body { background: white !important; }
        }
      `}</style>

      {/* Header */}
      <div className="mb-6 print-hide">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Results Overview</h2>
          <div className="text-sm opacity-80">
            Dino scales collected: <span className="font-semibold">{scales?.length ?? 0}</span>
          </div>
        </div>
        <p className="opacity-70 mt-1">Everything you’ve unlocked so far. 🦖✨</p>
      </div>

      {/* Quest summary */}
      <div className="grid md:grid-cols-3 gap-4 print-hide">
        <SummaryTile
          title="Memory Quest"
          ok={memoryOk}
          subtitle={memoryOk ? "Completed" : "Not yet"}
          detail={memoryOk ? "You matched all cards!" : "Finish the memory game to unlock a scale."}
          action={!memoryOk ? { label: "Play Memory", to: "/memory" } : undefined}
        />
        <SummaryTile
          title="Unblur"
          ok={unblurOk}
          subtitle="Completed"
          detail={unblurInfo}
        />
        <SummaryTile
          title="Chef"
          ok={chefOk}
          subtitle="Completed"
          detail={chefInfo}
        />
      </div>

      {/* Chosen date idea */}
      <div className="mt-8 print-hide">
        <h3 className="text-xl font-semibold mb-3">Your chosen date</h3>
        <AnimatePresence initial={false}>
          {idea ? (
            <motion.div
              key="idea"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
            >
              <Card>
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {idea.tags.map((t, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-full bg-black/5 text-xs">
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="text-sm font-semibold">{idea.estCost}</div>
                </div>

                <h4 className="text-xl font-bold mt-2">{idea.title}</h4>
                <p className="text-sm opacity-80 mt-1">{idea.blurb}</p>

                <ol className="mt-3 text-sm list-decimal pl-5 space-y-1">
                  {idea.steps.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ol>

                <div className="mt-5 flex flex-wrap gap-3">
                  <Button onClick={printCoupon} className="bg-black/80">Print coupon</Button>
                  <Button onClick={() => navigate("/gallery")}>Polaroid Gallery</Button>
                  <Button onClick={() => navigate("/gift")} className="bg-dino/90">
                    Continue → Gift
                  </Button>
                  <Link to="/" className="self-center text-sm underline opacity-80 hover:opacity-100">
                    Back home
                  </Link>
                </div>
              </Card>
            </motion.div>
          ) : (
            <motion.div key="no-idea" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <Card>
                <h4 className="text-xl font-semibold">No date selected yet</h4>
                <p className="opacity-80 mt-1">
                  Head back to the quiz and pick your favorite idea.
                </p>
                <div className="mt-4">
                  <Link to="/quiz" className="underline">Return to quiz</Link>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* PRINT-ONLY COUPON */}
      <div id="coupon-print" className="hidden">
        {idea && <PrintableCoupon idea={idea} />}
      </div>
    </div>
  )
}

/* ---------- tiny components ---------- */

function SummaryTile({
  title,
  subtitle,
  detail,
  ok,
  action,
}: {
  title: string
  subtitle: string
  detail: string
  ok: boolean
  action?: { label: string; to: string }
}) {
  return (
    <Card className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold">{title}</h4>
        <span className={`text-lg ${ok ? "" : "opacity-40"}`}>{ok ? "✅" : "⏳"}</span>
      </div>
      <div className="text-sm">{subtitle}</div>
      <div className="text-sm opacity-70">{detail}</div>
      {action && (
        <Link to={action.to} className="mt-2 inline-block text-sm underline opacity-90 hover:opacity-100">
          {action.label}
        </Link>
      )}
    </Card>
  )
}

function PrintableCoupon({ idea }: { idea: DateIdea }) {
  const Qr = () => (
    <div className="grid grid-cols-5 gap-0.5">
      {Array.from({ length: 25 }).map((_, i) => (
        <div key={i} className={`${(i * 7) % 3 === 0 ? "bg-black" : "bg-black/20"} w-3 h-3`} />
      ))}
    </div>
  )

  return (
    <div className="max-w-[720px] mx-auto p-8 border-2 border-dashed rounded-2xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">DATE COUPON</h1>
          <div className="text-xs opacity-70">Redeem for one excellent time together.</div>
        </div>
        <Qr />
      </div>

      <div className="mt-5">
        <h2 className="text-2xl font-bold">{idea.title}</h2>
        <div className="mt-1 text-sm opacity-80">{idea.blurb}</div>

        <div className="mt-3 flex flex-wrap gap-1">
          {idea.tags.map((t, i) => (
            <span key={i} className="px-2 py-0.5 rounded-full border text-xs">{t}</span>
          ))}
          <span className="px-2 py-0.5 rounded-full border text-xs">{idea.estCost}</span>
        </div>

        <ol className="mt-4 text-sm list-decimal pl-5 space-y-1">
          {idea.steps.map((s, i) => <li key={i}>{s}</li>)}
        </ol>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-6">
        <div>
          <div className="text-xs opacity-60">Scheduled for</div>
          <div className="mt-2 h-10 border-b" />
        </div>
        <div>
          <div className="text-xs opacity-60">Signed by</div>
          <div className="mt-2 h-10 border-b" />
        </div>
      </div>

      <div className="mt-5 text-[10px] opacity-60">
        Terms: transferable only between us; valid forever; infinitely extendable with snacks.
      </div>
    </div>
  )
}
