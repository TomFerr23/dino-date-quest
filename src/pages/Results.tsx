import React from 'react'
import Card from '../components/Card'
import Button from '../components/Button'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

type DateIdea = {
  title: string
  blurb: string
  estCost: '€' | '€€' | '€€€'
  tags: string[]
  steps: string[]
}

export default function Results() {
  const navigate = useNavigate()
  const [idea, setIdea] = React.useState<DateIdea | null>(null)

  React.useEffect(() => {
    try {
      const v = localStorage.getItem('chosen_date_idea')
      if (v) setIdea(JSON.parse(v))
    } catch {}
  }, [])

  function printCoupon() {
    window.print()
  }

  if (!idea) {
    return (
      <div className="min-h-screen max-w-6xl mx-auto px-4 py-10">
        <Card>
          <h2 className="text-xl font-semibold">No date selected yet</h2>
          <p className="opacity-80 mt-1">Go back to the quiz and pick your favorite idea.</p>
          <div className="mt-4">
            <Link to="/quiz" className="underline">Return to quiz</Link>
          </div>
        </Card>
      </div>
    )
  }

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

      <div className="print-hide">
        <h2 className="text-2xl font-semibold mb-4">Your chosen date</h2>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-1">
                {idea.tags.map((t,i)=>(
                  <span key={i} className="px-2 py-0.5 rounded-full bg-black/5 text-xs">{t}</span>
                ))}
              </div>
              <div className="text-sm font-semibold">{idea.estCost}</div>
            </div>
            <h3 className="text-xl font-bold mt-2">{idea.title}</h3>
            <p className="text-sm opacity-80 mt-1">{idea.blurb}</p>
            <ol className="mt-3 text-sm list-decimal pl-5 space-y-1">
              {idea.steps.map((s, i) => <li key={i}>{s}</li>)}
            </ol>

            <div className="mt-5 flex flex-wrap gap-3">
              <Button onClick={printCoupon} className="bg-black/80">Print coupon</Button>
              <Button onClick={() => navigate('/gallery')}>Polaroid Gallery</Button>
              <Link to="/" className="self-center text-sm underline opacity-80 hover:opacity-100">Back home</Link>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* PRINT-ONLY COUPON */}
      <div id="coupon-print" className="hidden">
        <PrintableCoupon idea={idea} />
      </div>
    </div>
  )
}

function PrintableCoupon({ idea }: { idea: DateIdea }) {
  const Qr = () => (
    <div className="grid grid-cols-5 gap-0.5">
      {Array.from({length:25}).map((_,i)=>(
        <div key={i} className={`${(i*7)%3===0?'bg-black':'bg-black/20'} w-3 h-3`} />
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
          {idea.tags.map((t,i)=>(
            <span key={i} className="px-2 py-0.5 rounded-full border text-xs">{t}</span>
          ))}
          <span className="px-2 py-0.5 rounded-full border text-xs">{idea.estCost}</span>
        </div>

        <ol className="mt-4 text-sm list-decimal pl-5 space-y-1">
          {idea.steps.map((s,i)=> <li key={i}>{s}</li>)}
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
