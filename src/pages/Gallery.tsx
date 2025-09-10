import React from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const IMAGES: string[] = [
  "https://res.cloudinary.com/dwxa3tffm/image/upload/v1756905331/IMG_8151_1-min_o9t2t9.png",
  "https://res.cloudinary.com/dwxa3tffm/image/upload/v1756905329/IMG_3369_2_1-min_ex4yh7.png",
  "https://res.cloudinary.com/dwxa3tffm/image/upload/v1756905328/IMG_8069_1-min_ircdnt.png",
  "https://res.cloudinary.com/dwxa3tffm/image/upload/v1756905327/IMG_7378_1-min_iklssh.png",
  "https://res.cloudinary.com/dwxa3tffm/image/upload/v1756905325/IMG_6898_1-min_kbftql.png",
  "https://res.cloudinary.com/dwxa3tffm/image/upload/v1756905324/IMG_7991_1-min_gzoiia.png",
  "https://res.cloudinary.com/dwxa3tffm/image/upload/v1756905322/IMG_5624_VSCO_1-min_lkssgj.png",
  "https://res.cloudinary.com/dwxa3tffm/image/upload/v1756905320/IMG_6182_1-min_mwh3b7.png",
  "https://res.cloudinary.com/dwxa3tffm/image/upload/v1756905321/IMG_7066_1-min_lk9qeb.png",
  "https://res.cloudinary.com/dwxa3tffm/image/upload/v1756905318/IMG_6445_1-min_pg54pl.png",
  "https://res.cloudinary.com/dwxa3tffm/image/upload/v1756905316/IMG_8794_1-min_dgtbko.png",
  "https://res.cloudinary.com/dwxa3tffm/image/upload/v1756905314/IMG_7093_1-min_t4ided.png",
  "https://res.cloudinary.com/dwxa3tffm/image/upload/v1756905313/IMG_6782_1-min_e1bwgc.png",
  "https://res.cloudinary.com/dwxa3tffm/image/upload/v1756905311/IMG_5367_1-min_ouzoih.png",
  "https://res.cloudinary.com/dwxa3tffm/image/upload/v1756905310/IMG_5235_1-min_kp7vez.png",
  "https://res.cloudinary.com/dwxa3tffm/image/upload/v1756905308/IMG_6193_1-min_obtim9.png",
  "https://res.cloudinary.com/dwxa3tffm/image/upload/v1756905307/IMG_6671_1-min_dsxbl4.png",
  "https://res.cloudinary.com/dwxa3tffm/image/upload/v1756905305/IMG_3212_1-min_l94koe.png",
  "https://res.cloudinary.com/dwxa3tffm/image/upload/v1756905304/IMG_8791_1-min_dfb3sf.png",
  "https://res.cloudinary.com/dwxa3tffm/image/upload/v1756905302/IMG_2687_2_1-min_fyda9f.png",
  "https://res.cloudinary.com/dwxa3tffm/image/upload/v1756905301/IMG_9775_2_1-min_yvznyp.png",
  "https://res.cloudinary.com/dwxa3tffm/image/upload/v1756905299/IMG_8830_1-min_kksvnl.png",
  "https://res.cloudinary.com/dwxa3tffm/image/upload/v1756905298/IMG_7450_1-min_vex4b7.png",
  "https://res.cloudinary.com/dwxa3tffm/image/upload/v1756905296/IMG_5868_1-min_sswqre.png",
  "https://res.cloudinary.com/dwxa3tffm/image/upload/v1756905295/IMG_6329_1-min_kmkkpk.png",
  "https://res.cloudinary.com/dwxa3tffm/image/upload/v1756905293/IMG_8208_1-min_wnf2wm.png",
  "https://res.cloudinary.com/dwxa3tffm/image/upload/v1756905292/IMG_6683_1-min_fopq3y.png",
  "https://res.cloudinary.com/dwxa3tffm/image/upload/v1756905290/ab71fb4c-8e99-4924-b19f-7176c1bb7023_1-min_awyn7t.png",
  "https://res.cloudinary.com/dwxa3tffm/image/upload/v1756905289/IMG_6394_1-min_vsz6mh.png",
  "https://res.cloudinary.com/dwxa3tffm/image/upload/v1756905288/20250627_172253_F5A563_1-min_1_qv8ywz.png",
  "https://res.cloudinary.com/dwxa3tffm/image/upload/v1756905286/IMG_2615_1-min_eqtoli.png",
  "https://res.cloudinary.com/dwxa3tffm/image/upload/v1756905285/IMG_6034_1-min_zeebzb.png",
  "https://res.cloudinary.com/dwxa3tffm/image/upload/v1756905284/20250627_094855_F76578_1-min_kus3au.png",
  "https://res.cloudinary.com/dwxa3tffm/image/upload/v1756905282/56f86152-ab4d-4bec-ba3f-4576f5fa931a_1-min_1_gonlf6.png",
  "https://res.cloudinary.com/dwxa3tffm/image/upload/v1756905281/20250626_203401_F9AB90_1-min_1_nmpvsa.png",
  "https://res.cloudinary.com/dwxa3tffm/image/upload/v1756904420/7f891593-88e2-4f5c-87b4-669301593869_1-min_htbjjl.png",
  "https://res.cloudinary.com/dwxa3tffm/image/upload/v1756904410/IMG_3369_2_1-min_gmnn9o.png",
  "https://res.cloudinary.com/dwxa3tffm/image/upload/v1756904401/20250627_172253_F5A563_1-min_vnlns7.png",
]

async function getSignature(password: string, folder = "gallery") {
  const r = await fetch("/api/cloudinary-sign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password: password.trim(), folder }),
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) {
    throw new Error(data?.error || "sign_failed");
  }
  return data as {
    cloudName: string;
    apiKey: string;
    folder: string;
    timestamp: number;
    signature: string;
  };
}


// util: deterministic small random for tilt/jitter
function prand(i: number, seed = 1337) {
  let x = Math.sin(i * 999 + seed) * 10000
  return x - Math.floor(x)
}

export default function Gallery() {
  const [selected, setSelected] = React.useState<string | null>(null)
  const [phase, setPhase] = React.useState<'intro' | 'grid'>('intro')
  const headerRef = React.useRef<HTMLDivElement | null>(null)
  const [headerH, setHeaderH] = React.useState(0)

  // ✅ keep original IMAGES, but allow appending uploads
  const [images, setImages] = React.useState<string[]>(IMAGES)

  // Fetch latest images from Cloudinary folder on mount
React.useEffect(() => {
  let cancelled = false;

  (async () => {
    try {
      const r = await fetch('/api/cloudinary-list?folder=gallery');
      const j = await r.json();
      if (!r.ok) throw new Error(j?.error || 'list_failed');

      // Merge with seeded IMAGES (avoid dupes)
      const merged = Array.from(new Set([...(j.urls || []), ...IMAGES]));
      if (!cancelled) setImages(merged);
    } catch (e) {
      // soft-fail: keep seeded IMAGES
      console.warn('list_failed', e);
    }
  })();

  return () => { cancelled = true; };
}, []);


  // ⬇️ uploader modal state
  const [open, setOpen] = React.useState(false)
  const [pass, setPass] = React.useState('')
  const [file, setFile] = React.useState<File | null>(null)
  const [busy, setBusy] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    const measure = () => setHeaderH(headerRef.current?.offsetHeight ?? 0)
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setSelected(null) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // short intro → grid
  React.useEffect(() => {
    if (phase !== 'intro') return
    const t = setTimeout(() => setPhase('grid'), 2800) // ~2.8s
    return () => clearTimeout(t)
  }, [phase])

  async function onUpload() {
  if (!file) {
    setError("Pick a photo first.");
    return;
  }
  setBusy(true);
  setError(null);
  try {
    // 1) get signed payload (password-protected)
    const { cloudName, apiKey, timestamp, folder, signature } = await getSignature(pass, "gallery");

    // 2) upload to Cloudinary
    const fd = new FormData();
    fd.append("file", file);
    fd.append("api_key", apiKey);
    fd.append("timestamp", String(timestamp));
    fd.append("folder", folder);
    fd.append("signature", signature);

    const upload = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: fd,
    });

    const upJson = await upload.json();
    if (!upload.ok) throw new Error(upJson?.error?.message || "upload_failed");

    // 3) success → prepend to gallery and close
setImages((prev) => [upJson.secure_url as string, ...prev]);
setFile(null);
setPass("");
setOpen(false);

// ⬇️ stash uploaded image in localStorage
try {
  const stored = JSON.parse(localStorage.getItem('gallery_uploaded') || '[]');
  localStorage.setItem(
    'gallery_uploaded',
    JSON.stringify([upJson.secure_url as string, ...stored])
  );
} catch {}
} catch (e: any) {
  setError(e?.message || "Upload failed");
} finally {
  setBusy(false);
}

}


  return (
    <div className="min-h-screen w-full relative px-4 pt-6 pb-14">
      <div ref={headerRef} className="relative z-20 w-full flex items-center justify-between pb-4">
        <h2 className="text-2xl font-semibold">Polaroid Gallery</h2>
        <div className="flex items-center gap-3">
          {phase === 'intro' ? (
            <button className="text-sm underline opacity-80 hover:opacity-100" onClick={() => setPhase('grid')}>
              Skip
            </button>
          ) : (
            <button className="text-sm underline opacity-80 hover:opacity-100" onClick={() => setPhase('intro')}>
              Replay intro
            </button>
          )}
          <Link to="/" className="text-sm underline opacity-80 hover:opacity-100">Back home</Link>
        </div>
      </div>

      <div className="relative w-full" style={{ minHeight: '74vh' }}>
        <AnimatePresence mode="wait">
          {phase === 'intro' ? (
            <IntroCircle
              key="intro"
              images={images}
              topOffset={headerH + 12}
              onDone={() => setPhase('grid')}
            />
          ) : (
            <GridStage
              key="grid"
              images={images}
              topPadding={headerH + 12}
              onPhotoClick={setSelected}
            />
          )}
        </AnimatePresence>
      </div>

      {/* LIGHTBOX */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm grid place-items-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ type: 'spring', damping: 22, stiffness: 220 }}
              className="relative max-w-5xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img src={selected} alt="" className="w-full h-auto max-h-[80vh] object-contain rounded-2xl shadow-2xl" />
              <button onClick={() => setSelected(null)} className="absolute -top-3 -right-3 bg-white rounded-full px-3 py-1 shadow-soft text-sm">
                Close ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ⬇️ Floating “Add photo” button (opens password + upload modal) */}
      <div className="fixed right-4 bottom-4 z-40">
        <button
          onClick={() => setOpen(true)}
          className="px-5 py-3 rounded-2xl bg-dino text-white shadow-lg active:scale-95 transition"
        >
          + Add photo
        </button>
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !busy && setOpen(false)}
          >
            <motion.div
              initial={{ y: 20, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0, scale: 0.98 }}
              className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold">Upload a photo</h3>
              <p className="text-sm opacity-70 mt-1">Enter the password and pick an image (JPG/PNG).</p>

              <div className="mt-4 grid gap-3">
                <div>
                  <label className="text-xs opacity-70">Password</label>
                  <input
                    type="password"
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-black/15 px-3 py-2"
                    placeholder="••••••••"
                    disabled={busy}
                  />
                </div>

                <div>
                  <label className="text-xs opacity-70">Image file</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="mt-1 block w-full text-sm"
                    disabled={busy}
                  />
                </div>

                {file && (
                  <div className="mt-1 rounded-xl border border-black/10 overflow-hidden">
                    <img
                      src={URL.createObjectURL(file)}
                      alt="preview"
                      className="w-full h-48 object-cover"
                    />
                  </div>
                )}

                {error && <div className="text-sm text-red-600">{error}</div>}

                <div className="mt-2 flex gap-2 justify-end">
                  <button
                    className="px-4 py-2 rounded-xl bg-black/70 text-white"
                    onClick={() => setOpen(false)}
                    disabled={busy}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 rounded-xl bg-dino text-white disabled:opacity-60"
                    onClick={onUpload}
                    disabled={busy || !pass || !file}
                  >
                    {busy ? 'Uploading…' : 'Upload'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ---------------- Intro: stagger in → circle (bounce), then we fade to grid ---------------- */

function IntroCircle({
  images, topOffset, onDone,
}: { images: string[]; topOffset: number; onDone: () => void }) {
  const [dims, setDims] = React.useState({ w: 1200, h: 700 })
  React.useEffect(() => {
    const upd = () => setDims({ w: window.innerWidth, h: window.innerHeight })
    upd()
    window.addEventListener('resize', upd)
    return () => window.removeEventListener('resize', upd)
  }, [])

  const stageW = Math.max(960, dims.w - 32)
  const stageH = Math.max(520, dims.h * 0.74 - topOffset)
  const cx = stageW / 2
  const cy = stageH / 2
  const R = Math.min(stageW, stageH) / 2 - 80

  React.useEffect(() => {
    const t = setTimeout(onDone, 2800)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <motion.div
      className="absolute left-1/2 -translate-x-1/2"
      style={{ top: topOffset, width: stageW, height: stageH }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {images.map((src, i) => {
        const angle = (i / images.length) * 360
        const rad = (angle * Math.PI) / 180
        const x = cx + R * Math.cos(rad)
        const y = cy + R * Math.sin(rad)

        const sizes = [
          { w: 160, h: 190 }, { w: 175, h: 175 }, { w: 180, h: 160 }, { w: 168, h: 186 },
        ]
        const size = sizes[i % sizes.length]
        const tilt = (Math.round((prand(i) - 0.5) * 22) / 10)

        return (
          <motion.div
            key={src}
            layoutId={`img-${i}`}
            className="absolute"
            initial={{ opacity: 0, x: 120, y: 0, rotate: 4 }}
            animate={{ opacity: 1, x: 0, y: 0, rotate: 0 }}
            transition={{ delay: i * 0.045, type: 'spring', stiffness: 420, damping: 26, bounce: 0.35 }}
            style={{ left: x - size.w / 2, top: y - size.h / 2 }}
          >
            <Polaroid src={src} index={i} size={size} outerTilt={tilt} />
          </motion.div>
        )
      })}
    </motion.div>
  )
}

/* ---------------- Grid (final) ---------------- */

function GridStage({
  images, topPadding, onPhotoClick,
}: { images: string[]; topPadding: number; onPhotoClick: (src: string) => void }) {
  const [cols, setCols] = React.useState(4)
  React.useEffect(() => {
    const set = () => {
      const w = window.innerWidth
      if (w < 640) return setCols(2)
      if (w < 900) return setCols(3)
      if (w < 1280) return setCols(4)
      return setCols(5)
    }
    set()
    window.addEventListener('resize', set)
    return () => window.removeEventListener('resize', set)
  }, [])

  return (
    <motion.div
      className="w-full"
      style={{ paddingTop: topPadding }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ type: 'spring', damping: 24, stiffness: 260, bounce: 0.3 }}
    >
      <div className="mx-auto" style={{ maxWidth: '1400px' }}>
        <div
          className="grid gap-6"
          style={{ gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))`, alignItems: 'start' }}
        >
          {images.map((src, i) => {
            const buckets = [
              { w: 220, h: 240 }, { w: 230, h: 210 }, { w: 220, h: 220 }, { w: 240, h: 220 }, { w: 210, h: 230 },
            ]
            const size = buckets[i % buckets.length]
            const yJitter = Math.round((prand(i + 12) - 0.5) * 12)
            const tilt = Math.round((prand(i) - 0.5) * 22) / 10

            return (
              <motion.button
                key={src}
                layoutId={`img-${i}`}
                onClick={() => onPhotoClick(src)}
                initial={{ opacity: 0, x: 24, rotate: 2 }}
                animate={{ opacity: 1, x: 0, rotate: tilt }}
                transition={{ delay: Math.min(0.4 + i * 0.02, 0.9), type: 'spring', stiffness: 320, damping: 24, bounce: 0.28 }}
                className="group w-full"
                style={{ transformOrigin: 'center' }}
              >
                <div className="w-full flex justify-center" style={{ transform: `translateY(${yJitter}px)` }}>
                  <Polaroid src={src} index={i} size={size} />
                </div>
              </motion.button>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}

/* ---------------- Polaroid ---------------- */

function Polaroid({
  src,
  index,
  size,
  outerTilt = 0,
  onClick,
}: {
  src: string
  index: number
  size: { w: number; h: number }
  outerTilt?: number
  onClick?: () => void
}) {
  const tilt = React.useMemo(() => {
    let h = 0
    for (let i = 0; i < src.length; i++) h = ((h << 5) - h) + src.charCodeAt(i)
    const r = ((h % 7) + 7) % 7
    return (r - 3) * 1.8
  }, [src])

  return (
    <button
      onClick={onClick}
      className="group relative shrink-0"
      style={{ width: size.w, height: size.h }}
      aria-label={`Open Memory #${index + 1}`}
    >
      <div
        className="w-full h-full bg-white rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.12)] border border-black/10 p-2 pb-6 transition-transform duration-200 group-hover:-translate-y-1"
        style={{ rotate: `${outerTilt || tilt}deg` }}
      >
        <div
          className="w-full rounded-md overflow-hidden"
          style={{ height: 'calc(100% - 1.5rem)' }}
        >
          <img
            src={src}
            alt=""
            className="w-full h-full object-cover block rounded-md"
            loading="lazy"
          />
        </div>
        <div className="absolute left-1/2 -translate-x-1/2 bottom-1 text-[10px] tracking-wide uppercase opacity-60">
          Memory #{index + 1}
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 rounded-xl ring-0 group-hover:ring-2 ring-dino/50 transition" />
    </button>
  )
}
