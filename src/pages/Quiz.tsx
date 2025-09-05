import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Card from '../components/Card'
import Button from '../components/Button'
import { useStore } from '../store'
import { useNavigate, Link } from 'react-router-dom'

type Answers = {
  time: 'morning' | 'afternoon' | 'evening'
  vibe: 'cozy' | 'adventurous' | 'romantic' | 'silly'
  budget: number // 0..100
  place: 'indoor' | 'outdoor' | 'either'
  energy: 'low' | 'medium' | 'high'
  food: Array<'coffee' | 'brunch' | 'pizza' | 'asian' | 'dessert' | 'cocktails' | 'picnic'>
}

type DateIdea = {
  title: string
  blurb: string
  estCost: '€' | '€€' | '€€€'
  tags: string[]
  steps: string[]
}

const STEPS = 6

export default function Quiz() {
  const navigate = useNavigate()
  const setStep = useStore(s => s.setStep)

  const [answers, setAnswers] = React.useState<Partial<Answers>>({})
  const [submitted, setSubmitted] = React.useState(false)
  const [ideas, setIdeas] = React.useState<DateIdea[] | null>(null)
  const [selectedIdx, setSelectedIdx] = React.useState<number | null>(null)

  // ref to scroll to ideas on generate
  const ideasRef = React.useRef<HTMLDivElement | null>(null)

  const answeredCount = [
    answers.time, answers.vibe, answers.budget !== undefined ? 1 : undefined,
    answers.place, answers.energy, answers.food && answers.food.length ? 1 : undefined
  ].filter(Boolean).length

  const progressPct = Math.round((answeredCount / STEPS) * 100)

  function setA<K extends keyof Answers>(key: K, value: Answers[K]) {
    setAnswers(a => ({ ...a, [key]: value }))
  }
  function toggleFood(tag: Answers['food'][number]) {
    setAnswers(a => {
      const arr = new Set(a.food ?? [])
      if (arr.has(tag)) arr.delete(tag); else arr.add(tag)
      return { ...a, food: Array.from(arr) as Answers['food'] }
    })
  }

  function onSubmit() {
    setSubmitted(true)
    if (!isValid()) return
    const made = buildIdeas(answers as Answers)
    setIdeas(made)
    setStep(3)
    setSelectedIdx(null)

    // smooth scroll to the ideas section
    setTimeout(() => {
      ideasRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 50)
  }

  function isValid() {
    const a = answers as Partial<Answers>
    return !!(a.time && a.vibe && typeof a.budget === 'number' && a.place && a.energy && a.food && a.food.length)
  }

  function persistSelection() {
    if (selectedIdx == null || !ideas) return
    try { localStorage.setItem('chosen_date_idea', JSON.stringify(ideas[selectedIdx])) } catch {}
  }

  function printSelected() {
    if (selectedIdx == null || !ideas) return
    persistSelection()
    window.print()
  }

  function goChef() {
    if (selectedIdx == null) return
    persistSelection()
    navigate('/chef')
  }

  return (
    <div className="min-h-screen max-w-6xl mx-auto px-4 py-8">
      {/* PRINT CSS: show only coupon when printing */}
      <style>{`
        @media print {
          .print-hide { display: none !important; }
          #coupon-print { display: block !important; }
          body { background: white !important; }
        }
      `}</style>

      {/* Header */}
      <div className="mb-4 flex items-center justify-between print-hide">
        <h2 className="text-2xl font-semibold">Date Preferences</h2>
        <div className="text-sm opacity-80">Progress: {answeredCount}/{STEPS}</div>
      </div>

      {/* Progress */}
      <div className="mb-6 print-hide">
        <div className="h-3 bg-black/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-dino rounded-full transition-all"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Questions (mobile-friendly grid) */}
      <div className="grid gap-4 sm:gap-6 md:grid-cols-2 print-hide">
        <QTime value={answers.time} onChange={v => setA('time', v)} submitted={submitted} />
        <QVibe value={answers.vibe} onChange={v => setA('vibe', v)} submitted={submitted} />
        <QBudget value={answers.budget} onChange={v => setA('budget', v)} submitted={submitted} />
        <QPlace value={answers.place} onChange={v => setA('place', v)} submitted={submitted} />
        <QEnergy value={answers.energy} onChange={v => setA('energy', v)} submitted={submitted} />
        <QFood value={answers.food ?? []} onToggle={toggleFood} submitted={submitted} />
      </div>

      {/* Actions */}
      <div className="mt-6 flex flex-col sm:flex-row gap-3 print-hide">
        <Button onClick={onSubmit} className="w-full sm:w-auto">Generate date ideas</Button>
        <Link to="/" className="self-center text-sm underline opacity-80 hover:opacity-100">Back</Link>
      </div>

      {/* Output */}
      <div ref={ideasRef} />
      <AnimatePresence>
        {ideas && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
          >
            <h3 className="text-xl font-semibold mb-3 print-hide">Pick your favorite:</h3>

            {/* Responsive cards: 1 col on mobile, 2 on md, 3 on lg */}
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 print-hide">
              {ideas.map((it, idx) => {
                const selected = selectedIdx === idx
                return (
                  <motion.button
                    key={idx}
                    onClick={() => setSelectedIdx(idx)}
                    whileTap={{ scale: 0.98 }}
                    className={`text-left rounded-2xl border shadow-soft p-4 transition ${
                      selected ? 'border-dino ring-2 ring-dino/40 bg-dino/5' : 'border-black/10 bg-white'
                    }`}
                    aria-pressed={selected}
                  >
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <div className="flex flex-wrap gap-1">
                        {it.tags.map((t,i)=>(
                          <span key={i} className="px-2 py-0.5 rounded-full bg-black/5 text-xs">{t}</span>
                        ))}
                      </div>
                      <div className="text-sm font-semibold">{it.estCost}</div>
                    </div>
                    <h4 className="mt-2 text-lg font-bold">{it.title}</h4>
                    <p className="mt-1 text-sm opacity-80">{it.blurb}</p>
                    <ol className="mt-3 text-sm list-decimal pl-5 space-y-1">
                      {it.steps.map((s, i) => <li key={i}>{s}</li>)}
                    </ol>
                  </motion.button>
                )
              })}
            </div>

            {/* Post-choices actions */}
            <div className="mt-5 flex flex-col sm:flex-row gap-3 print-hide">
              <Button onClick={printSelected} className="bg-black/80 w-full sm:w-auto" disabled={selectedIdx==null}>
                Print selected coupon
              </Button>
              <Button onClick={goChef} className="w-full sm:w-auto" disabled={selectedIdx==null}>
                Continue → Chef
              </Button>
            </div>

            {/* PRINT-ONLY COUPON (only this prints) */}
            <div id="coupon-print" className="hidden">
              {selectedIdx!=null && ideas[selectedIdx] && (
                <PrintableCoupon idea={ideas[selectedIdx]} />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* -------------------- Printable Coupon -------------------- */

type CouponProps = { idea: DateIdea }
function PrintableCoupon({ idea }: CouponProps) {
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

/* -------------------- Question blocks -------------------- */

function Section({
  title, hint, invalid, children
}: { title: string; hint?: string; invalid?: boolean; children: React.ReactNode }) {
  return (
    <Card className={`${invalid ? 'ring-2 ring-red-300' : ''}`}>
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">{title}</h3>
        {hint && <span className="text-xs opacity-60">{hint}</span>}
      </div>
      <div className="mt-3">{children}</div>
    </Card>
  )
}

function ChoiceCard({
  label, selected, onClick, emoji
}: { label: string; selected?: boolean; onClick?: () => void; emoji?: string }) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`w-full text-left rounded-2xl px-4 py-3 border ${selected ? 'border-dino bg-dino/10' : 'border-black/10 bg-white'} shadow-soft`}
    >
      <div className="flex items-center gap-3">
        {emoji && <span className="text-xl">{emoji}</span>}
        <span className="font-medium">{label}</span>
      </div>
    </motion.button>
  )
}

function Chip({
  label, selected, onClick
}: { label: string; selected?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full border text-sm ${selected ? 'bg-dino/10 border-dino' : 'bg-white border-black/10'}`}
    >
      {label}
    </button>
  )
}

function QTime({ value, onChange, submitted }: {
  value?: Answers['time']; onChange: (v: Answers['time']) => void; submitted: boolean
}) {
  const invalid = submitted && !value
  return (
    <Section title="When are we doing this?" hint="Pick one" invalid={invalid}>
      <div className="grid grid-cols-1 gap-2">
        <ChoiceCard label="Morning" emoji="🌞" selected={value==='morning'} onClick={() => onChange('morning')} />
        <ChoiceCard label="Afternoon" emoji="🌤️" selected={value==='afternoon'} onClick={() => onChange('afternoon')} />
        <ChoiceCard label="Evening" emoji="🌙" selected={value==='evening'} onClick={() => onChange('evening')} />
      </div>
    </Section>
  )
}

function QVibe({ value, onChange, submitted }: {
  value?: Answers['vibe']; onChange: (v: Answers['vibe']) => void; submitted: boolean
}) {
  const invalid = submitted && !value
  return (
    <Section title="What’s the vibe?" hint="Pick one" invalid={invalid}>
      <div className="grid grid-cols-2 gap-2">
        <ChoiceCard label="Cozy & cute" emoji="🫶" selected={value==='cozy'} onClick={() => onChange('cozy')} />
        <ChoiceCard label="Adventurous" emoji="🧗" selected={value==='adventurous'} onClick={() => onChange('adventurous')} />
        <ChoiceCard label="Romantic" emoji="💘" selected={value==='romantic'} onClick={() => onChange('romantic')} />
        <ChoiceCard label="Silly & fun" emoji="🤪" selected={value==='silly'} onClick={() => onChange('silly')} />
      </div>
    </Section>
  )
}

function QBudget({ value, onChange, submitted }: {
  value?: number; onChange: (v: number) => void; submitted: boolean
}) {
  const invalid = submitted && (value === undefined)
  return (
    <Section title="Budget comfort" hint="Drag to set" invalid={invalid}>
      <div className="mt-2">
        <input
          type="range"
          min={0} max={100} step={5}
          value={value ?? 40}
          onChange={e => onChange(Number(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-xs opacity-70 mt-1">
          <span>€</span><span>€€</span><span>€€€</span>
        </div>
      </div>
    </Section>
  )
}

function QPlace({ value, onChange, submitted }: {
  value?: Answers['place']; onChange: (v: Answers['place']) => void; submitted: boolean
}) {
  const invalid = submitted && !value
  return (
    <Section title="Inside or outside?" hint="Pick one" invalid={invalid}>
      <div className="grid grid-cols-3 gap-2">
        <ChoiceCard label="Indoor" emoji="🏠" selected={value==='indoor'} onClick={() => onChange('indoor')} />
        <ChoiceCard label="Outdoor" emoji="🌳" selected={value==='outdoor'} onClick={() => onChange('outdoor')} />
        <ChoiceCard label="Either" emoji="🔀" selected={value==='either'} onClick={() => onChange('either')} />
      </div>
    </Section>
  )
}

function QEnergy({ value, onChange, submitted }: {
  value?: Answers['energy']; onChange: (v: Answers['energy']) => void; submitted: boolean
}) {
  const invalid = submitted && !value
  return (
    <Section title="Energy level" hint="Pick one" invalid={invalid}>
      <div className="grid grid-cols-3 gap-2">
        <ChoiceCard label="Low-key" emoji="🛋️" selected={value==='low'} onClick={() => onChange('low')} />
        <ChoiceCard label="Medium" emoji="🚶" selected={value==='medium'} onClick={() => onChange('medium')} />
        <ChoiceCard label="High" emoji="🏃" selected={value==='high'} onClick={() => onChange('high')} />
      </div>
    </Section>
  )
}

function QFood({ value, onToggle, submitted }: {
  value: Answers['food']; onToggle: (v: Answers['food'][number]) => void; submitted: boolean
}) {
  const invalid = submitted && (!value || value.length === 0)
  const options: Answers['food'] = ['coffee','brunch','pizza','asian','dessert','cocktails','picnic']
  return (
    <Section title="Pick some flavors" hint="Choose 1–3" invalid={invalid}>
      <div className="flex flex-wrap gap-2">
        {options.map(op => (
          <Chip key={op} label={pretty(op)} selected={value.includes(op)} onClick={() => onToggle(op)} />
        ))}
      </div>
    </Section>
  )
}

/* -------------------- Idea generator -------------------- */

function buildIdeas(a: Answers): DateIdea[] {
  const band = a.budget <= 33 ? '€' : a.budget <= 66 ? '€€' : '€€€'

  const basePool: DateIdea[] = [
    {
      title: 'Museum Crawl + Dessert Quest',
      blurb: 'Wander through exhibits, then hunt down the best sweet thing nearby.',
      estCost: band,
      tags: [a.place === 'outdoor' ? 'mostly indoor' : 'indoor', a.time, a.vibe],
      steps: [
        'Pick a museum or gallery you haven’t tried.',
        'Do one room each choosing the “must-see”.',
        'Dessert stop: split something that looks ridiculous (in a good way).',
      ],
    },
    {
      title: 'Park Picnic & Polaroids',
      blurb: 'Sun, snacks, and 10/10 photos. Bring your inner model.',
      estCost: band === '€€€' ? '€€' : band,
      tags: ['outdoor', a.time, a.vibe, a.energy],
      steps: [
        'Assemble a snack box with your chosen flavors.',
        'Find a park bench or blanket spot.',
        'Silly photoshoot: recreate an album cover.',
      ],
    },
    {
      title: 'DIY Pasta Night + Movie Draft',
      blurb: 'Cook together and draft a movie lineup like GMs of Cinema.',
      estCost: band,
      tags: ['indoor', 'cozy', 'evening'],
      steps: [
        'Groceries: fresh pasta, sauce, one wildcard topping.',
        'Cook & plate like a tiny restaurant.',
        'Each drafts 2 movies; coin flip picks the winner.',
      ],
    },
    {
      title: 'Arcade Run & Fries',
      blurb: 'Button mashing followed by crispy fries. Loser owes the ketchup art.',
      estCost: band === '€' ? '€€' : band,
      tags: [a.place === 'indoor' ? 'indoor' : 'either', 'silly', a.energy],
      steps: [
        'Pick 3 arcade games each (loser owes fries).',
        'Try a game neither has touched before.',
        'Scoreboard roast + fries taste test.',
      ],
    },
    {
      title: 'Sunset Walk & Photo Bingo',
      blurb: 'Chase golden hour while completing a silly photo bingo card.',
      estCost: '€',
      tags: ['outdoor', 'evening', a.energy],
      steps: [
        'Make a quick bingo list (dog, bicycle, red door…).',
        'Walk a new route; snap each square.',
        'Winner chooses the snack stop.',
      ],
    },
    {
      title: 'Pottery Class + Clay Chaos',
      blurb: 'Spin a bowl, make a mess, leave with a wobbly masterpiece.',
      estCost: band,
      tags: ['indoor', 'cozy', a.time],
      steps: [
        'Hands-on pottery class (wheel or hand-building).',
        'Each crafts a “surprise” for the other.',
        'Post-class photo with the messiest apron as the winner.',
      ],
    },
  ]

  // apply high/low energy bias + basic filters
  const filtered = basePool
    .filter(x => (a.place === 'either' ? true : x.tags.includes(a.place)))
    .filter(x => (a.vibe ? x.tags.includes(a.vibe) || true : true))
    .filter(x => (a.time ? x.tags.includes(a.time) || true : true))

  const energyPick = (arr: DateIdea[]) => {
    if ((a as Answers).energy === 'high') return arr.filter(x => !x.tags.includes('cozy')).slice(0, 5)
    if ((a as Answers).energy === 'low') return arr.filter(x => !x.tags.includes('high')).slice(0, 5)
    return arr
  }

  // flavor tweaks (Beer stop instead of Tea stop)
  const flavor = a.food
  function withFlavor(it: DateIdea): DateIdea {
    const s = [...it.steps]
    // Replace the previous "Tea stop" concept with a beer stop when coffee was chosen
    if (flavor.includes('coffee')) s.splice(1, 0, 'Beer stop: try a local brew and rate it 1–10.')
    if (flavor.includes('dessert')) s.push('Dessert boss picks the final bite.')
    if (flavor.includes('picnic')) s.unshift('Pack a tiny picnic kit: blanket, fruit, something bubbly.')
    if (flavor.includes('pizza')) s.splice(1, 0, 'Pizza slice showdown: swap a bite and rank toppings.')
    if (flavor.includes('asian')) s.splice(1, 0, 'Asian bites: dumplings/noodles taste test (share two).')
    if (flavor.includes('cocktails')) s.push('Nightcap challenge: invent a mocktail/cocktail name from the date.')
    if (flavor.includes('brunch')) s.splice(0, 0, 'Brunch pre-game: pancakes vs. eggs (you choose).')
    return { ...it, steps: s }
  }

  const pool = energyPick(filtered.length ? filtered : basePool).map(withFlavor)

  // pick top 3 diverse ideas
  const out: DateIdea[] = []
  const seen = new Set<string>()
  for (const idea of pool) {
    const key = idea.title.split(' ')[0]
    if (!seen.has(key)) { out.push(idea); seen.add(key) }
    if (out.length >= 3) break
  }
  while (out.length < 3) out.push(basePool[out.length])
  return out.map(it => ({ ...it, estCost: it.estCost }))
}

/* -------------------- helpers -------------------- */
function pretty(tag: string) {
  return tag
    .replace('asian', 'Asian')
    .replace('picnic', 'Picnic')
    .replace('coffee', 'Coffee')
    .replace('brunch', 'Brunch')
    .replace('pizza', 'Pizza')
    .replace('dessert', 'Dessert')
    .replace('cocktails', 'Cocktails')
}
