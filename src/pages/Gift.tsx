// src/pages/Gift.tsx
import React from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { DotLottieReact } from "@lottiefiles/dotlottie-react"
import Card from "../components/Card"
import Button from "../components/Button"
import { useStore } from "../store"

type DateIdea = {
  title: string
  blurb: string
  estCost?: "€" | "€€" | "€€€"
  tags?: string[]
  steps?: string[]
}

export default function Gift() {
  const navigate = useNavigate()

  // Pull from store (fallback to localStorage just in case)
  const selectedFromStore = useStore((s: any) => s.results?.selectedIdea ?? s.selectedIdea ?? null)

  const [idea, setIdea] = React.useState<DateIdea | null>(null)
  React.useEffect(() => {
    if (selectedFromStore) {
      const s = selectedFromStore as any
      setIdea({
        title: s.title || s.name || "Your Date",
        blurb: s.blurb || s.text || s.description || s.details || "",
        estCost: s.estCost,
        tags: s.tags,
        steps: s.steps,
      })
      return
    }
    try {
      const v = localStorage.getItem("chosen_date_idea")
      if (v) setIdea(JSON.parse(v))
    } catch {}
  }, [selectedFromStore])

  function printCoupon() {
    window.print()
  }

  return (
    <div className="min-h-screen max-w-5xl mx-auto px-4 py-8">
      {/* PRINT CSS: only coupon should print */}
      <style>{`
        @media print {
          .print-hide { display: none !important; }
          #coupon-print { display: block !important; }
          body { background: white !important; }
        }
      `}</style>

      {/* Header */}
      <div className="mb-4 flex items-center justify-between print-hide">
        <h1 className="text-2xl md:text-3xl font-extrabold">Your Gift</h1>
        <Link to="/" className="text-sm underline opacity-80 hover:opacity-100">Back home</Link>
      </div>

      {/* Gift animation */}
      <motion.div
        className="print-hide"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
      >
        <Card className="overflow-hidden">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-xl font-semibold">A little present… 🎁</h2>
              <p className="opacity-80 mt-2">
                We wrapped your hand-picked date into a classy coupon. Print it, save it, or just bask in the cuteness.
              </p>
            </div>
            <div className="order-1 md:order-2">
              <DotLottieReact
                src="https://lottie.host/0cdbfe52-6658-4c79-a7ba-30d889abcbf0/qNdo8NohNK.lottie"
                loop
                autoplay
                style={{ width: "100%", height: 260 }}
              />
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Coupon (screen view) */}
      <div className="mt-8 print-hide">
        <AnimatePresence mode="wait">
          {idea ? (
            <motion.div
              key="coupon"
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
            >
              <PrettyCoupon idea={idea} />

              <div className="mt-5 flex flex-wrap gap-3">
                <Button onClick={printCoupon} className="bg-black/80">Print coupon</Button>
                <Button onClick={() => navigate("/gallery")}>Polaroid Gallery</Button>
                <Button onClick={() => navigate("/results")} className="bg-dino/90">Back to Results</Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="text-center">
                <p className="opacity-80">
                  No date selected yet. Pick one in Results and your gift will appear here.
                </p>
                <div className="mt-4">
                  <Button onClick={() => navigate("/results")}>Go to Results</Button>
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

/* ---------- Coupon components ---------- */

function PrettyCoupon({ idea }: { idea: DateIdea }) {
  // decorative “ribbon” + faux QR + ticket edges
  return (
    <div className="relative">
      {/* ribbon */}
      <div className="absolute -top-3 left-4 right-4 h-6 bg-dino/80 rounded-md blur-[1px]" />
      <div className="relative rounded-3xl bg-white shadow-[0_30px_60px_rgba(0,0,0,.12)] border border-black/10 overflow-hidden">
        {/* ticket notches */}
        <div className="absolute -left-5 top-16 w-10 h-10 rounded-full bg-[#F7F5F2] border border-black/10" />
        <div className="absolute -right-5 top-16 w-10 h-10 rounded-full bg-[#F7F5F2] border border-black/10" />

        <div className="p-6 md:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-[11px] tracking-widest uppercase opacity-60">Admit Two</div>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1">
                {idea.title || "Lovely Date"}
              </h2>
              {idea.blurb && <p className="opacity-80 mt-2">{idea.blurb}</p>}
            </div>
            <FakeQr />
          </div>

          {!!(idea.tags && idea.tags.length) && (
            <div className="mt-4 flex flex-wrap gap-1">
              {idea.tags!.map((t, i) => (
                <span key={i} className="px-2 py-0.5 rounded-full border text-xs">{t}</span>
              ))}
              {idea.estCost && (
                <span className="px-2 py-0.5 rounded-full border text-xs">{idea.estCost}</span>
              )}
            </div>
          )}

          {!!(idea.steps && idea.steps.length) && (
            <ol className="mt-5 text-sm list-decimal pl-5 space-y-1">
              {idea.steps!.map((s, i) => <li key={i}>{s}</li>)}
            </ol>
          )}

          <div className="mt-6 grid grid-cols-2 gap-6">
            <LineField label="Scheduled for" />
            <LineField label="Signed by" />
          </div>

          <div className="mt-5 text-[10px] opacity-60">
            Terms: transferable only between us; valid forever; infinitely extendable with snacks.
          </div>
        </div>
      </div>
    </div>
  )
}

function PrintableCoupon({ idea }: { idea: DateIdea }) {
  return (
    <div className="max-w-[720px] mx-auto p-8 border-2 border-dashed rounded-2xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">DATE COUPON</h1>
          <div className="text-xs opacity-70">Redeem for one excellent time together.</div>
        </div>
        <FakeQr />
      </div>

      <div className="mt-5">
        <h2 className="text-2xl font-bold">{idea.title}</h2>
        {idea.blurb && <div className="mt-1 text-sm opacity-80">{idea.blurb}</div>}

        {!!(idea.tags && idea.tags.length) && (
          <div className="mt-3 flex flex-wrap gap-1">
            {idea.tags!.map((t, i) => (
              <span key={i} className="px-2 py-0.5 rounded-full border text-xs">{t}</span>
            ))}
            {idea.estCost && (
              <span className="px-2 py-0.5 rounded-full border text-xs">{idea.estCost}</span>
            )}
          </div>
        )}

        {!!(idea.steps && idea.steps.length) && (
          <ol className="mt-4 text-sm list-decimal pl-5 space-y-1">
            {idea.steps!.map((s, i) => <li key={i}>{s}</li>)}
          </ol>
        )}
      </div>

      <div className="mt-8 grid grid-cols-2 gap-6">
        <LineField label="Scheduled for" />
        <LineField label="Signed by" />
      </div>

      <div className="mt-5 text-[10px] opacity-60">
        Terms: transferable only between us; valid forever; infinitely extendable with snacks.
      </div>
    </div>
  )
}

/* ---------- bits ---------- */
function FakeQr() {
  return (
    <div className="grid grid-cols-5 gap-0.5">
      {Array.from({ length: 25 }).map((_, i) => (
        <div key={i} className={`${(i * 7) % 3 === 0 ? "bg-black" : "bg-black/20"} w-3 h-3`} />
      ))}
    </div>
  )
}

function LineField({ label }: { label: string }) {
  return (
    <div>
      <div className="text-xs opacity-60">{label}</div>
      <div className="mt-2 h-10 border-b" />
    </div>
  )
}
