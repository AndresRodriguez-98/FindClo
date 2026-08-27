import { useEffect, useRef } from 'react'
import styles from './ScrollSequence.module.css'

/* ─────────────────────────────────────────────────────────────
   ScrollSequence — Ambient Background Hero
   ──────────────────────────────────────────────────────────
   New video: user interacting with the Findclo app on a phone.
   Frames are vertical (9:16). Desktop viewport is horizontal.

   Architecture: TWO synchronized canvases rendered from the
   same Image[] array in a single shared RAF loop.

   1. bgCanvas — cover-scaled frame + blur(60px) + dark overlay.
      Fills 100% of the section to eliminate letterboxing.

   2. fgCanvas — contain-scaled frame centered at natural
      aspect ratio. Shows the phone crisply, no distortion.

   Both are driven by the same `currentFrame` value so they
   are guaranteed to always show the same image.
   ───────────────────────────────────────────────────────── */

const TOTAL_FRAMES = 190
const FOLDER_PATH  = '/frames_hero'

export default function ScrollSequence({ children }) {
  const containerRef = useRef(null)
  const bgCanvasRef  = useRef(null)
  const fgCanvasRef  = useRef(null)

  const stateRef = useRef({
    images:       new Array(TOTAL_FRAMES).fill(null),
    currentFrame: 0,
    targetFrame:  0,
    rafId:        null,
    lastBg:       -1,   // tracks last drawn frame to skip redundant draws
    lastFg:       -1,
  })

  useEffect(() => {
    const container = containerRef.current
    const bgCanvas  = bgCanvasRef.current
    const fgCanvas  = fgCanvasRef.current
    if (!container || !bgCanvas || !fgCanvas) return

    const bgCtx = bgCanvas.getContext('2d')
    const fgCtx = fgCanvas.getContext('2d')
    const state = stateRef.current

    /* ── Canvas sizing ─────────────────────────────────── */
    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w   = window.innerWidth
      const h   = window.innerHeight

      // Background: full viewport
      bgCanvas.width        = Math.round(w * dpr)
      bgCanvas.height       = Math.round(h * dpr)
      bgCanvas.style.width  = `${w}px`
      bgCanvas.style.height = `${h}px`
      bgCtx.imageSmoothingEnabled = true
      bgCtx.imageSmoothingQuality = 'high'

      // Foreground: same dimensions
      fgCanvas.width        = Math.round(w * dpr)
      fgCanvas.height       = Math.round(h * dpr)
      fgCanvas.style.width  = `${w}px`
      fgCanvas.style.height = `${h}px`
      fgCtx.imageSmoothingEnabled = true
      fgCtx.imageSmoothingQuality = 'high'

      // Invalidate cache so both canvases repaint on next frame
      state.lastBg = -1
      state.lastFg = -1
    }

    /* ── Draw BACKGROUND canvas (cover + blur via CSS filter) ─
       We draw the image cover-scaled. The CSS blur filter on the
       canvas element itself handles the blur — this avoids the
       expensive CanvasRenderingContext2D filter on every frame.
    ─────────────────────────────────────────────────────── */
    function drawBackground(img) {
      const pw = bgCanvas.width
      const ph = bgCanvas.height
      const iw = img.naturalWidth
      const ih = img.naturalHeight

      // Cover scale: fill the entire canvas, crop edges
      const scale = Math.max(pw / iw, ph / ih) * 1.05 // 5% overscan avoids blurred edge halo
      const nw    = iw * scale
      const nh    = ih * scale
      const cx    = (pw - nw) * 0.5
      const cy    = (ph - nh) * 0.5

      bgCtx.clearRect(0, 0, pw, ph)
      bgCtx.drawImage(img, 0, 0, iw, ih, cx, cy, nw, nh)
    }

    /* ── Draw FOREGROUND canvas (contain — preserve aspect ratio) ─
       The vertical frame (9:16) is displayed contain-fit within
       the center of the foreground canvas. On desktop this creates
       a crisp portrait window. On mobile it fills the screen.
    ────────────────────────────────────────────────────────────── */
    function drawForeground(img) {
      const pw = fgCanvas.width
      const ph = fgCanvas.height
      const iw = img.naturalWidth
      const ih = img.naturalHeight

      // Contain scale: fit the entire frame, keep aspect ratio
      const scale = Math.min(pw / iw, ph / ih)
      const nw    = iw * scale
      const nh    = ih * scale
      const cx    = (pw - nw) * 0.5
      const cy    = (ph - nh) * 0.5

      fgCtx.clearRect(0, 0, pw, ph)
      fgCtx.drawImage(img, 0, 0, iw, ih, cx, cy, nw, nh)
    }

    /* ── Nearest-available-frame fallback ───────────────── */
    function getNearestReady(index) {
      const clamped = Math.max(0, Math.min(TOTAL_FRAMES - 1, index))
      if (isReady(state.images[clamped])) return state.images[clamped]
      for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
        const prev = state.images[clamped - offset]
        const next = state.images[clamped + offset]
        if (isReady(prev)) return prev
        if (isReady(next)) return next
      }
      return null
    }

    function isReady(img) {
      return img?.complete && img.naturalWidth > 0
    }

    /* ── Main render call — both canvases from same image ── */
    function renderFrame(frameIndex) {
      const clamped = Math.max(0, Math.min(TOTAL_FRAMES - 1, frameIndex))
      const img     = getNearestReady(clamped)
      if (!img) return

      if (state.lastBg !== clamped) {
        drawBackground(img)
        state.lastBg = clamped
      }
      if (state.lastFg !== clamped) {
        drawForeground(img)
        state.lastFg = clamped
      }
    }

    /* ── Continuous RAF animation loop ─────────────────── */
    function animate() {
      const diff = state.targetFrame - state.currentFrame
      if (Math.abs(diff) > 0.18) {
        state.currentFrame += diff * 0.12   // smooth interpolation
      } else {
        state.currentFrame = state.targetFrame
      }

      renderFrame(Math.round(state.currentFrame))
      state.rafId = requestAnimationFrame(animate)
    }

    /* ── Scroll progress ─────────────────────────────────
       Maps scroll position relative to the scroll container
       to a frame index [0 … TOTAL_FRAMES-1].
       Starts animating as soon as the section enters the
       viewport top, stops mapping at scroll bottom.
    ─────────────────────────────────────────────────── */
    function updateProgress() {
      const scrollTop = window.scrollY
      const maxScroll = Math.max(1, container.scrollHeight - window.innerHeight)
      const progress  = Math.max(0, Math.min(1, scrollTop / maxScroll))
      state.targetFrame = progress * (TOTAL_FRAMES - 1)
    }

    /* ── Preload all frames ────────────────────────────── */
    function preload() {
      // Load first frame immediately, then batch-load the rest
      // so the initial paint happens as fast as possible.
      const loadFrame = (i) => {
        const num = String(i + 1).padStart(4, '0')
        const img = new Image()
        img.onload = () => {
          if (i === 0) {
            resize()
            renderFrame(0)
          }
        }
        img.src = `${FOLDER_PATH}/frame_${num}.webp`
        state.images[i] = img
      }

      // Frame 0 first — then staggered for the rest
      loadFrame(0)
      for (let i = 1; i < TOTAL_FRAMES; i++) {
        // Use a minimal timeout stagger to avoid blocking the
        // main thread on mount while still loading quickly.
        setTimeout(() => loadFrame(i), Math.floor(i / 10) * 4)
      }
    }

    /* ── Event listeners ──────────────────────────────── */
    function onScroll() { updateProgress() }
    function onResize()  { resize(); updateProgress() }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize, { passive: true })

    resize()
    updateProgress()
    preload()
    state.rafId = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      if (state.rafId) cancelAnimationFrame(state.rafId)
    }
  }, [])

  return (
    <section ref={containerRef} className={styles.scrollContainer}>
      <div className={styles.stickyViewport}>
        {/*
          Layer 1 — Ambient background:
          Cover-scaled, CSS-blurred + darkened via an ::after overlay.
          CSS filter is applied on the element; the canvas itself draws
          the image unfiltered, keeping the GPU path clean.
        */}
        <canvas
          ref={bgCanvasRef}
          className={styles.bgCanvas}
          aria-hidden="true"
        />

        {/*
          Layer 2 — Crisp foreground frame:
          Contain-scaled at natural 9:16 ratio. No blur, full fidelity.
          Sits above the ambient background.
        */}
        <canvas
          ref={fgCanvasRef}
          className={styles.fgCanvas}
          aria-hidden="true"
        />

        {/* Hero overlay text content */}
        {children}
      </div>
    </section>
  )
}
