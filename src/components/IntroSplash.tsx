import React from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { PERSON } from '../config'

type Props = { onDone: () => void }

const clamp = (min: number, v: number, max: number) => Math.max(min, Math.min(v, max))

export default function IntroSplash({ onDone }: Props) {
  const prefersReduced = useReducedMotion()

  let imgs = PERSON.images && PERSON.images.length
    ? PERSON.images
    : [
        'https://picsum.photos/seed/a/800/1100',
        'https://picsum.photos/seed/b/800/1100',
        'https://picsum.photos/seed/c/800/1100',
        'https://picsum.photos/seed/d/800/1100',
      ]
  imgs = imgs.slice(0, 16)
  const count = Math.max(1, imgs.length)

  const vw = typeof window !== 'undefined' ? window.innerWidth : 1024
  const vh = typeof window !== 'undefined' ? window.innerHeight : 768

  const stageW = Math.min(vw * 0.94, 980)
  const stageH = Math.min(vh * 0.78, 720)
  const stageHalf = Math.min(stageW, stageH) / 2

  const panelW = clamp(300, vw * 0.65, 520)

  // 👉 Make cards bigger
  let cardW = vw < 360 ? 110 : vw < 480 ? 130 : vw < 768 ? 160 : 190
  let cardH = Math.round(cardW * 4 / 3)

  // 👉 Make radius smaller (tighter ring)
  const safety = 12
  const minRadiusFromPanel = Math.round(panelW / 2 + cardW * 0.55 + safety)
  const maxRadiusFromStage  = Math.floor(stageHalf - Math.max(cardW, cardH) / 2 - safety)
  const targetRadiusFromCount = Math.round(150 + (count - 6) * 12) // smaller base & less growth

  let radius = Math.min(maxRadiusFromStage, Math.max(minRadiusFromPanel, targetRadiusFromCount))
  radius = clamp(
    Math.round(panelW / 2 + cardW * 0.55 + safety),
    radius,
    Math.floor(stageHalf - Math.max(cardW, cardH) / 2 - safety)
  )

  // 👉 Images closer: add a tighter angle offset
  const angleOffset = Math.PI / 24 // smaller gap, tighter clustering

  const ring = imgs.map((src, i) => {
    const angle = angleOffset + (i / count) * Math.PI * 2
    const x = Math.cos(angle) * radius
    const y = Math.sin(angle) * radius
    const deg = (angle * 180) / Math.PI
    return { src, x, y, angleDeg: deg }
  })

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

  const floatAnimate = prefersReduced
    ? {}
    : {
        y: [0, -6, 0, 4, 0],
        transition: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
      }

  return (
    <AnimatePresence>
      <motion.div
        key="intro-ring-big"
        className="fixed inset-0 z-[60] bg-gradient-to-b from-cream via-white to-cream"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35 }}
      >
        {/* Ring stage */}
        <div className="absolute inset-0 grid place-items-center overflow-hidden">
          <div className="relative" style={{ width: stageW, height: stageH }}>
            <motion.div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              animate={ringSpin}
              transition={ringSpinTransition}
            >
              {ring.map(({ src, x, y, angleDeg }, i) => (
                <motion.div
                  key={src + i}
                  className="absolute"
                  style={{ left: 0, top: 0, zIndex: 5 + i }}
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
                      animate={floatAnimate}
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

        {/* Center glass panel */}
        <div className="relative z-[80] h-full grid place-items-center px-4">
          <div className="relative" style={{ width: panelW }}>
            <div className="absolute -inset-3 rounded-3xl bg-white/72 backdrop-blur-md shadow-soft" />
            <div className="relative rounded-3xl p-6 md:p-10 text-center">
              <h1 className="text-3xl md:text-5xl font-extrabold">{PERSON.title}</h1>
              <p className="mt-2 text-sm md:text-base opacity-80">
                Welcome {PERSON.nickname || PERSON.name}. Please refrain from feeding the dinosaurs.
              </p>
              <p className="text-xs md:text-sm opacity-60">
                5 tiny trials. Immense bragging rights. 🦖
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
