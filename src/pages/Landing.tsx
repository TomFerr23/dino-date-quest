// src/pages/Landing.tsx
import React from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Confetti from 'react-confetti'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import Card from '../components/Card'
import Button from '../components/Button'
import { useStore } from '../store'
import IntroSplash from '../components/IntroSplash'
import { PERSON } from '../config'

const TOTAL_STEPS = 3

// Animated background color cycle for the second featured image
const bgCycle = {
  animate: {
    backgroundColor: ['#ffe5ec', '#e0f7fa', '#fff9c4', '#f3e5f5', '#ffe5ec'],
    transition: { duration: 8, repeat: Infinity, ease: 'easeInOut' },
  },
}

const Landing: React.FC = () => {
  const navigate = useNavigate()
  const step = useStore((s) => s.step)
  const scaleCount = useStore((s) => s.scales.length)
  const setStep = useStore((s) => s.setStep)

  const [fireConfetti, setFireConfetti] = React.useState(false)
  const [showSplash, setShowSplash] = React.useState(true)

  const completed = Math.min(step, TOTAL_STEPS)
  const progressPct = Math.min((completed / TOTAL_STEPS) * 100, 100)

  const startQuest = () => {
    setFireConfetti(true)
    setStep(1)
    setTimeout(() => navigate('/memory'), 600)
  }

  const PROFILE_IMG =
    (PERSON as any).profileImage ||
    'https://res.cloudinary.com/dwxa3tffm/image/upload/v1756897821/profile-image_gxd1tq.png'

  return (
    <>
      {showSplash && <IntroSplash onDone={() => setShowSplash(false)} />}

      <div className="min-h-screen max-w-6xl mx-auto px-4 py-10">
        {fireConfetti && <Confetti recycle={false} numberOfPieces={220} />}

        {/* Header */}
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-dino">
            🦕 {PERSON.title}
          </h1>
          <div className="text-xs md:text-sm opacity-70">Scales collected: {scaleCount}</div>
        </header>

        {/* Main Grid */}
        <div className="grid md:grid-cols-5 gap-6 items-stretch">
          {/* LEFT */}
          <Card className="md:col-span-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-sm opacity-70">Welcome,</div>
                <h2 className="text-3xl md:text-4xl font-extrabold leading-tight">
                  {PERSON.name}
                </h2>
                <div className="text-sm opacity-70 -mt-1">a.k.a. Bobíí</div>
              </div>

              <img
                src={PROFILE_IMG}
                alt={`${PERSON.name} profile`}
                className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover shadow-soft border border-black/5"
              />
            </div>

            <p className="mt-4 opacity-80">
              Your objective is simple: complete <strong>{TOTAL_STEPS}</strong> quick quests:
              Memory, Unblur, and Quiz. No spoilers—follow the dino footprints and crush it. 🫶
            </p>

            {/* CTAs */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <motion.button
                onClick={startQuest}
                whileTap={{ scale: 0.98 }}
                className="h-12 px-6 inline-flex items-center justify-center bg-blush text-white rounded-2xl shadow-soft font-medium"
              >
                Begin the quests
              </motion.button>

              <Link to="/quiz" className="text-sm underline opacity-70 hover:opacity-100">
                Skip to preferences
              </Link>
              <Link to="/gallery" className="text-sm underline opacity-70 hover:opacity-100">
                Polaroid Gallery
              </Link>
              <Link to="/gift" className="text-sm underline opacity-70 hover:opacity-100">
                Open Gift (later)
              </Link>
            </div>

            {/* Progress */}
            <div className="mt-7">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Quest progress</span>
                <span className="text-sm opacity-70">
                  {completed}/{TOTAL_STEPS} quests
                </span>
              </div>
              <div className="h-3 bg-black/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-dino rounded-full transition-all"
                  style={{ width: `${progressPct}%` }}
                  aria-valuenow={progressPct}
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
              </div>
              <ul className="mt-3 flex gap-2 text-xl" aria-label="Quest badges">
                {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                  <li key={i} aria-hidden>
                    {i < completed ? '🟩' : '⬜️'}
                  </li>
                ))}
              </ul>
            </div>
          </Card>

          {/* RIGHT (tight Lottie) */}
          <Card className="md:col-span-2 flex items-center justify-center">
            <div className="w-full">
              <DotLottieReact
                src="https://lottie.host/c6c18a98-91dd-4115-a51a-563b9c44b039/J7xFdY315Q.lottie"
                loop
                autoplay
                style={{
                  width: '100%',
                  maxWidth: 360,
                  minHeight: 220,
                  marginInline: 'auto',
                  display: 'block',
                }}
              />
              <p className="text-center text-sm opacity-70 mt-2">
                Sir Snuggles the Dino, your quest guide 🦖
              </p>
            </div>
          </Card>
        </div>

        {/* Featured images */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Featured images</h2>
          <div className="flex flex-col md:flex-row gap-6 justify-center">
            {/* First static image */}
            <div className="rounded-2xl overflow-hidden shadow-soft max-w-md mx-auto">
              <img
                src="https://res.cloudinary.com/dwxa3tffm/image/upload/v1757140140/mexican-nat_dw8ivv.png"
                alt="Featured Mexican Nat"
                className="w-full h-auto object-cover"
              />
            </div>

            {/* Second image with animated background */}
            <motion.div
              variants={bgCycle}
              animate="animate"
              className="p-4 rounded-2xl shadow-soft flex items-center justify-center max-w-md mx-auto"
            >
              <img
                src="https://res.cloudinary.com/dwxa3tffm/image/upload/v1757140412/vaping-nat_vswrlo.png"
                alt="Featured Vaping Nat"
                className="max-h-[320px] w-auto object-contain"
              />
            </motion.div>
          </div>
        </div>

        {/* How it works */}
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          <Card>
            <h3 className="font-semibold mb-1">1) Play the quests</h3>
            <p className="text-sm opacity-80">Memory Match, Photo Unblur, and the Date Quiz.</p>
          </Card>
          <Card>
            <h3 className="font-semibold mb-1">2) Pick a date</h3>
            <p className="text-sm opacity-80">We’ll generate fun ideas tailored to your vibe.</p>
          </Card>
          <Card>
            <h3 className="font-semibold mb-1">3) Claim your gift 🎁</h3>
            <p className="text-sm opacity-80">Print your coupon and enjoy the adventure.</p>
          </Card>
        </div>
      </div>
    </>
  )
}

export default Landing
