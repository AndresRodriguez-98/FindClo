import { useEffect, useRef } from 'react'
import styles from './ScrollSequence.module.css'

const TOTAL_FRAMES = 120
const FOLDER_PATH = '/fotogramas_background'

export default function ScrollSequence({ children }) {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const stateRef = useRef({
    images: new Array(TOTAL_FRAMES),
    currentFrame: 0,
    targetFrame: 0,
    rafId: null,
  })

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext('2d')
    const state = stateRef.current

    function resizeCanvas() {
      const dpr = window.devicePixelRatio || 1
      canvas.width = Math.round(window.innerWidth * dpr)
      canvas.height = Math.round(window.innerHeight * dpr)
      canvas.style.width = window.innerWidth + 'px'
      canvas.style.height = window.innerHeight + 'px'
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'
      drawFrame(Math.round(state.currentFrame))
    }

    function drawFrame(index) {
      const clampedIndex = Math.max(0, Math.min(TOTAL_FRAMES - 1, index))
      let img = state.images[clampedIndex]

      if (!img?.complete || img.naturalWidth === 0) {
        for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
          const prev = state.images[clampedIndex - offset]
          const next = state.images[clampedIndex + offset]
          if (prev?.complete && prev.naturalWidth > 0) { img = prev; break }
          if (next?.complete && next.naturalWidth > 0) { img = next; break }
        }
      }

      const pw = canvas.width
      const ph = canvas.height

      ctx.clearRect(0, 0, pw, ph)
      if (!img?.complete || img.naturalWidth === 0) return

      const iw = img.naturalWidth
      const ih = img.naturalHeight
      const scale = Math.max(pw / iw, ph / ih)
      const nw = iw * scale
      const nh = ih * scale
      const cx = (pw - nw) * 0.5
      const cy = (ph - nh) * 0.5

      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'
      ctx.drawImage(img, 0, 0, iw, ih, cx, cy, nw, nh)
    }

    function updateTarget() {
      const scrollTop = window.scrollY
      const maxScroll = Math.max(1, container.scrollHeight - window.innerHeight)
      const progress = Math.max(0, Math.min(1, scrollTop / maxScroll))
      state.targetFrame = progress * (TOTAL_FRAMES - 1)
    }

    function animate() {
      const diff = state.targetFrame - state.currentFrame
      if (Math.abs(diff) > 0.001) {
        state.currentFrame += diff * 0.14
      } else {
        state.currentFrame = state.targetFrame
      }
      drawFrame(Math.round(state.currentFrame))
      state.rafId = requestAnimationFrame(animate)
    }

    function preloadImages() {
      for (let i = 0; i < TOTAL_FRAMES; i++) {
        const frameNumber = String(i + 1).padStart(4, '0')
        const img = new Image()
        img.src = `${FOLDER_PATH}/fotograma_${frameNumber}.webp`
        img.onload = () => {
          if (i === 0) { resizeCanvas() }
          drawFrame(Math.round(state.currentFrame))
        }
        state.images[i] = img
      }
    }

    function onScroll() { updateTarget() }
    function onResize() { resizeCanvas(); updateTarget() }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize, { passive: true })

    resizeCanvas()
    updateTarget()
    preloadImages()
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
        <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
        {children}
      </div>
    </section>
  )
}
