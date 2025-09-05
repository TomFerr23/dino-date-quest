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

const TOTAL_STEPS = 5

const Landing: React.FC = () => {
  const navigate = useNavigate()
  const step = useStore((s) => s.step)
  const scaleCount = useStore(s => s.scales.length)
  const setStep = useStore((s) => s.setStep)

  const [fireConfetti, setFireConfetti] = React.useState(false)
  const [showSplash, setShowSplash] = React.useState(true)

  const progressPct = Math.min((step / TOTAL_STEPS) * 100, 100)

  const startQuest = () => {
    setFireConfetti(true)
    setStep(1)
    setTimeout(() => navigate('/memory'), 600)
  }

  // Profile image (config override supported)
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
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm opacity-70">Welcome,</div>
                <h2 className="text-3xl md:text-4xl font-extrabold leading-tight">
                  {PERSON.name}
                </h2>
                {/* Force a.k.a. Bobíí */}
                <div className="text-sm opacity-70 -mt-1">a.k.a. Bobíí</div>
              </div>

              <img
                src={PROFILE_IMG}
                alt={`${PERSON.name} profile`}
                className="w-14 h-14 md:w-16 md:h-16 rounded-full object-cover shadow-soft border border-black/5"
              />
            </div>

            {/* Updated copy (no spoilers) */}
            <p className="mt-4 opacity-80">
              Your objective is simple: complete {TOTAL_STEPS} quick quests. That’s it.
              No hints, no spoilers—just follow the dino footprints and crush the challenges.
            </p>

            {/* CTAs with equal height */}
            <div className="mt-6 flex flex-wrap gap-3">
              <motion.button
                onClick={startQuest}
                whileTap={{ scale: 0.98 }}
                className="h-12 px-6 inline-flex items-center justify-center bg-blush text-white rounded-2xl shadow-soft font-medium"
              >
                Begin the quests
              </motion.button>

              <Link to="/quiz">
                <Button className="h-12 px-6 py-0 inline-flex items-center justify-center bg-black/80">
                  Skip to preferences
                </Button>
              </Link>

              <Link to="/gallery" className="self-center text-sm underline opacity-80 hover:opacity-100">
                Polaroid Gallery
              </Link>
              <Link to="/gift" className="self-center text-sm underline opacity-80 hover:opacity-100">
                Open Gift (later)
              </Link>
            </div>

            {/* Progress */}
            <div className="mt-7">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Progress</span>
                <span className="text-sm opacity-70">
                  {step}/{TOTAL_STEPS} challenges
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
              <ul className="mt-3 flex gap-2 text-xl" aria-label="Challenge badges">
                {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                  <li key={i} aria-hidden>
                    {i < step ? '🟩' : '⬜️'}
                  </li>
                ))}
              </ul>
            </div>
          </Card>

          {/* RIGHT (tighter Lottie) */}
          <Card className="md:col-span-2 flex items-center justify-center">
            <div className="w-full">
              <DotLottieReact
                src="https://lottie.host/c6c18a98-91dd-4115-a51a-563b9c44b039/J7xFdY315Q.lottie"
                loop
                autoplay
                style={{
                  width: '100%',
                  maxWidth: 340,      // tighter than before
                  minHeight: 200,
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

        {/* How it works */}
        <div className="mt-6 grid md:grid-cols-3 gap-4">
          <Card>
            <h3 className="font-semibold mb-1">1) Play tiny challenges</h3>
            <p className="text-sm opacity-80">Memory Match, Photo Unblur, Chef’s Kiss, Mosaic, This-or-That.</p>
          </Card>
          <Card>
            <h3 className="font-semibold mb-1">2) Dial in your vibe</h3>
            <p className="text-sm opacity-80">Answer quick preferences to get 3 perfect date ideas.</p>
          </Card>
          <Card>
            <h3 className="font-semibold mb-1">3) Claim your gift 🎁</h3>
            <p className="text-sm opacity-80">Print your coupons and open a little surprise.</p>
          </Card>
        </div>
      </div>
    </>
  )
}

export default Landing
