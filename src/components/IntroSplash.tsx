// src/components/IntroSplash.tsx
import React from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { PERSON } from '../config'

type Props = { onDone: () => void }

const clamp = (min: number, v: number, max: number) => Math.max(min, Math.min(v, max))

export default function IntroSplash({ onDone }: Props) {
  const prefersReduced = useReducedMotion()

  // --- Ring images: use whatever is in PERSON.images (fallback to a few pics if empty)
  const ringImgs: string[] = (PERSON.images && PERSON.images.length
    ? PERSON.images
    : [
        'https://picsum.photos/seed/a/800/1100',
        'https://picsum.photos/seed/b/800/1100',
        'https://picsum.photos/seed/c/800/1100',
        'https://picsum.photos/seed/d/800/1100',
      ]
  ).slice(0, 16)

  // --- Extra floaters: ONLY these four (as requested)
  const FLOATERS = [
    "https://res.cloudinary.com/dwxa3tffm/image/upload/v1756905313/IMG_6782_1-min_e1bwgc.png",
    "https://res.cloudinary.com/dwxa3tffm/image/upload/v1756905308/IMG_6193_1-min_obtim9.png",
    "https://res.cloudinary.com/dwxa3tffm/image/upload/v1756905301/IMG_9775_2_1-min_yvznyp.png",
    "https://res.cloudinary.com/dwxa3tffm/image/upload/v1756905281/20250626_203401_F9AB90_1-min_1_nmpvsa.png",
  ]

  const vw = typeof window !== 'undefined' ? window.innerWidth : 1024
  const vh = typeof window !== 'undefined' ? window.innerHeight : 768

  // Stage for the rotating ring
  const stageW = Math.min(vw * 0.94, 980)
  const stageH = Math.min(vh * 0.78, 720)
  const stageHalf = Math.min(stageW, stageH) / 2

  // Center panel size
  const panelW = clamp(300, vw * 0.65, 520)

  // Ring card size
  const cardW = vw < 360 ? 110 : vw < 480 ? 130 : vw < 768 ? 160 : 190
  const cardH = Math.round(cardW * 4 / 3)

  // Ring radius (keeps a clean circle around the center panel)
  const safety = 12
  const minRadiusFromPanel = Math.round(panelW / 2 + cardW * 0.55 + safety)
  const maxRadiusFromStage = Math.floor(stageHalf - Math.max(cardW, cardH) / 2 - safety)
  const targetRadiusFromCount = Math.round(150 + (ringImgs.length - 6) * 12)
  let radius = Math.min(maxRadiusFromStage, Math.max(minRadiusFromPanel, targetRadiusFromCount))
  radius = clamp(
    Math.round(panelW / 2 + cardW * 0.55 + safety),
    radius,
    Math.floor(stageHalf - Math.max(cardW, cardH) / 2 - safety)
  )

  const angleOffset = Math.PI / 24

  const ring = ringImgs.map((src, i) => {
    const angle = angleOffset + (i / ringImgs.length) * Math.PI * 2
    const x = Math.cos(angle) * radius
    const y = Math.sin(angle) * radius
    const deg = (angle * 180) / Math.PI
    return { src, x, y, angleDeg: deg }
  })

  // Animations
  const itemInitial = prefersReduced
    ? { opacity: 0 }
    : { opacity: 0, scale: 0.75, x: 0, y: 0, rotate: -6 }

  const itemAnimate = (x: number, y: number) =>
    prefersReduced
      ? { opacity: 1 }
      : {
          opacity: 1,
          scale: 1,
          x, y, rotate: 0,
          transition: { type: 'spring', stiffness: 120, damping: 16 },
        }

  const ringSpin = prefersReduced ? {} : { rotate: 360 }
  const ringSpinTransition = prefersReduced
    ? { duration: 0 }
    : { duration: 28, ease: 'linear', repeat: Infinity }

  const counterRotate = prefersReduced ? {} : { rotate: [0, -360] }
  const counterRotateTransition = prefersReduced
    ? { duration: 0 }
    : { duration: 28, ease: 'linear', repeat: Infinity }

  const floatBob = prefersReduced
    ? {}
    : { y: [0, -8, 0, 6, 0], transition: { duration: 6, repeat: Infinity, ease: 'easeInOut' } }

  // Carefully chosen spots so they don't collide with the center or ring much.
  // (percent positions; they sit BEHIND the ring but ABOVE the background)
  const floaterSpecs = [
    { left: 12, top: 18, base: vw < 420 ? 90 : vw < 768 ? 110 : 130, phase: 0   }, // top-left
    { left: 86, top: 24, base: vw < 420 ? 92 : vw < 768 ? 114 : 136, phase: 0.4 }, // top-right
    { left: 14, top: 78, base: vw < 420 ? 84 : vw < 768 ? 106 : 126, phase: 0.8 }, // bottom-left
    { left: 88, top: 74, base: vw < 420 ? 96 : vw < 768 ? 118 : 142, phase: 1.2 }, // bottom-right
  ]

  return (
    <AnimatePresence>
      <motion.div
        key="intro-ring"
        className="fixed inset-0 z-[60] bg-gradient-to-b from-cream via-white to-cream"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35 }}
      >
        {/* FLOATERS: exactly the 4 provided URLs, fully opaque & animated */}
        <div className="absolute inset-0 overflow-hidden">
          {FLOATERS.map((src, i) => {
            const spec = floaterSpecs[i % floaterSpecs.length]
            const w = spec.base
            const h = Math.round(w * 4 / 3)

            // little drift + rotate + scale pulse
            const drift = prefersReduced
              ? {}
              : {
                  x: [0, i % 2 === 0 ? 10 : -10, 0, i % 2 === 0 ? -8 : 8, 0],
                  transition: { duration: 10 + i, repeat: Infinity, ease: 'easeInOut', delay: spec.phase },
                }
            const spin = prefersReduced ? {} : { rotate: [0, i % 2 ? 8 : -8, 0] }
            const pulse = prefersReduced ? {} : { scale: [1, 1.02, 1] }

            return (
              <motion.div
                key={src + i}
                className="absolute"
                style={{
                  left: `${spec.left}%`,
                  top: `${spec.top}%`,
                  transform: 'translate(-50%, -50%)',
                  zIndex: 9, // below the ring (10+) and far below the panel (80)
                }}
                animate={drift}
              >
                <motion.div animate={spin} transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}>
                  <motion.div animate={pulse} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}>
                    <motion.div
                      animate={floatBob}
                      className="rounded-2xl overflow-hidden border border-black/10 shadow-md bg-white"
                      style={{ width: w, height: h }}
                    >
                      <img
                        src={src}
                        alt=""
                        className="w-full h-full object-cover"
                        draggable={false}
                        loading="eager"
                      />
                    </motion.div>
                  </motion.div>
                </motion.div>
              </motion.div>
            )
          })}
        </div>

        {/* RING STAGE */}
        <div className="absolute inset-0 grid place-items-center overflow-hidden">
          <div className="relative" style={{ width: stageW, height: stageH }}>
            <motion.div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              animate={ringSpin}
              transition={ringSpinTransition}
              style={{ zIndex: 10 }}
            >
              {ring.map(({ src, x, y, angleDeg }, i) => (
                <motion.div
                  key={src + i}
                  className="absolute"
                  style={{ left: 0, top: 0, zIndex: 10 + i }}
                  initial={itemInitial}
                  animate={itemAnimate(x, y)}
                  transition={{ delay: prefersReduced ? 0 : i * 0.05 }}
                >
                  <motion.div
                    className="-translate-x-1/2 -translate-y-1/2"
                    animate={counterRotate}
                    transition={counterRotateTransition}
                    style={{ rotate: -angleDeg }}
                  >
                    <motion.div
                      animate={floatBob}
                      className="rounded-2xl overflow-hidden shadow-soft border border-black/5 bg-white"
                      style={{ width: cardW, height: cardH }}
                    >
                      <img
                        src={src}
                        alt=""
                        className="w-full h-full object-cover"
                        draggable={false}
                      />
                    </motion.div>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* CENTER PANEL */}
        <div className="relative z-[80] h-full grid place-items-center px-4">
          <div className="relative" style={{ width: panelW }}>
            <div className="absolute -inset-3 rounded-3xl bg-white/72 backdrop-blur-md shadow-soft" />
            <div className="relative rounded-3xl p-6 md:p-10 text-center">
              <h1 className="text-3xl md:text-5xl font-extrabold">{PERSON.title}</h1>
              <p className="mt-2 text-sm md:text-base opacity-80">
                Welcome {PERSON.nickname || PERSON.name}. Please refrain from feeding the dinosaurs.
              </p>
              <p className="text-xs md:text-sm opacity-60">
                3 tiny trials. Immense bragging rights. 🦖
              </p>
              <button
                onClick={onDone}
                className="mt-6 bg-blush text-white px-6 py-3 rounded-2xl shadow-soft font-medium hover:opacity-95 active:scale-95 transition"
              >
                Are you ready?
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
