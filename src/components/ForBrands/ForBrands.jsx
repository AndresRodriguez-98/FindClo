import { useEffect, useRef } from 'react'
import {
  UserCheck,
  Eye,
  ExternalLink,
  CircleDollarSign,
  Users,
  BarChart3,
  Target,
  Percent,
} from 'lucide-react'
import styles from './ForBrands.module.css'

/* ─────────────────────────────────────────────────────────
   Frame configuration:
   - Uses all 237 available frames (frame_0001.webp to frame_0237.webp)
   - Continuous 60-120fps video-like playback on scroll
───────────────────────────────────────────────────────── */
const TOTAL_FRAMES = 237
const FOLDER_PATH  = '/fotogramas_background_seccion_para_marcas'

/* ─── Data ──────────────────────────────────────────── */
const benefits = [
  {
    num: '01',
    icon: UserCheck,
    title: 'USUARIOS CON INTENCIÓN REAL',
    body: 'Conectamos tus productos con usuarios que ya están activamente buscando y descubriendo moda. Audiencia relevante con intención de compra.',
    note: null,
  },
  {
    num: '02',
    icon: Eye,
    title: 'MÁS VISIBILIDAD PARA TUS PRODUCTOS',
    body: 'Ampliá el alcance de tu catálogo y llegá a nuevos potenciales clientes. Potenciá tus prendas con apariciones destacadas.',
    note: null,
  },
  {
    num: '03',
    icon: ExternalLink,
    title: 'GENERAMOS EL DESCUBRIMIENTO. LA VENTA SIGUE SIENDO TUYA.',
    body: 'El usuario descubre el producto en Findclo y es redirigido directamente al ecommerce oficial de tu marca para realizar la compra.',
    note: 'No cobramos comisión sobre tus ventas.',
  },
  {
    num: '04',
    icon: CircleDollarSign,
    title: 'INVERTÍ SEGÚN LA INTERACCIÓN',
    body: 'Sin costos fijos ni comisión por venta. El modelo es publicitario: la inversión depende de las interacciones reales que generen tus productos.',
    note: null,
  },
]

const metrics = [
  { icon: Users,     title: 'USUARIOS CALIFICADOS', desc: 'Interesados realmente en moda y nuevas tendencias.' },
  { icon: BarChart3, title: 'TRÁFICO DIRECTO',      desc: 'A tu ecommerce oficial, sin intermediarios.' },
  { icon: Target,    title: 'MAYOR ALCANCE',        desc: 'Nuevos clientes que todavía no conocen tu marca.' },
  { icon: Percent,   title: 'COSTOS OPTIMIZADOS',   desc: 'Invertí mejor, con foco directo en resultados.' },
]

/* ─── Component ─────────────────────────────────────── */
export default function ForBrands() {
  const sectionRef = useRef(null)
  const canvasRef  = useRef(null)
  const stateRef   = useRef({
    images:        new Array(TOTAL_FRAMES),
    currentFrame:  0,
    targetFrame:   0,
    lastDrawnFrame: -1,
    rafId:         null,
  })

  useEffect(() => {
    const canvas  = canvasRef.current
    const section = sectionRef.current
    if (!canvas || !section) return

    const ctx   = canvas.getContext('2d', { alpha: false })
    const state = stateRef.current

    /* ── Canvas sizing ─────────────────────────────────── */
    function resizeCanvas() {
      const dpr    = Math.min(window.devicePixelRatio || 1, 2)
      const parent = canvas.parentElement

      // Always measure the actual container — on mobile the rightCol
      // is now full-width sticky (not fixed), so parent.clientWidth === vw.
      // On desktop it's the 52fr column. No hardcoded fractions needed.
      const w = parent ? parent.clientWidth  : window.innerWidth
      const h = window.innerHeight

      canvas.width        = Math.round(w * dpr)
      canvas.height       = Math.round(h * dpr)
      canvas.style.width  = `${w}px`
      canvas.style.height = `${h}px`

      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'

      state.lastDrawnFrame = -1
    }

    /* ── Draw one frame ────────────────────────────────── */
    function drawFrame(index) {
      const clamped = Math.max(0, Math.min(TOTAL_FRAMES - 1, index))
      if (clamped === state.lastDrawnFrame) return

      const pw = canvas.width
      const ph = canvas.height
      if (pw === 0 || ph === 0) return

      let img = state.images[clamped]
      if (!img?.complete || img.naturalWidth === 0) {
        for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
          const prev = state.images[clamped - offset]
          const next = state.images[clamped + offset]
          if (prev?.complete && prev.naturalWidth > 0) { img = prev; break }
          if (next?.complete && next.naturalWidth > 0) { img = next; break }
        }
      }

      ctx.fillStyle = '#050505'
      ctx.fillRect(0, 0, pw, ph)

      if (!img?.complete || img.naturalWidth === 0) return

      const iw    = img.naturalWidth
      const ih    = img.naturalHeight
      const scale = Math.max(pw / iw, ph / ih)
      const nw    = iw * scale
      const nh    = ih * scale
      const cx    = (pw - nw) * 0.5
      const cy    = (ph - nh) * 0.5

      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.drawImage(img, 0, 0, iw, ih, cx, cy, nw, nh)
      state.lastDrawnFrame = clamped
    }

    /* ── Continuous RAF loop ──────────────────────────── */
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

    /* ── Scroll progress calculation ────────────────────
       Starts as soon as the top of the section enters
       the bottom of the viewport for continuous motion.
    ─────────────────────────────────────────────────── */
    function updateProgress() {
      const rect     = section.getBoundingClientRect()
      const sectionH = section.offsetHeight
      const viewH    = window.innerHeight

      const totalSpan = sectionH
      if (totalSpan <= 0) return

      const scrolled = Math.max(0, viewH - rect.top)
      const progress = Math.min(1, Math.max(0, scrolled / totalSpan))

      state.targetFrame = progress * (TOTAL_FRAMES - 1)
    }

    /* ── Preload all 237 frames ───────────────────────── */
    function preloadFrames() {
      for (let i = 0; i < TOTAL_FRAMES; i++) {
        const num = String(i + 1).padStart(4, '0')
        const img = new Image()

        img.onload = () => {
          state.lastDrawnFrame = -1
        }
        img.src = `${FOLDER_PATH}/frame_${num}.webp`
        state.images[i] = img
      }
    }

    let resizeTimer = null
    function onResize() {
      if (resizeTimer) clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        resizeCanvas()
        updateProgress()
      }, 80)
    }

    window.addEventListener('scroll', updateProgress, { passive: true })
    window.addEventListener('resize', onResize,     { passive: true })

    resizeCanvas()
    updateProgress()
    preloadFrames()
    state.rafId = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('scroll', updateProgress)
      window.removeEventListener('resize', onResize)
      if (resizeTimer) clearTimeout(resizeTimer)
      if (state.rafId) cancelAnimationFrame(state.rafId)
    }
  }, [])

  return (
    <section ref={sectionRef} id="nosotros" className={styles.section}>
      <div className={styles.ambientGlow} aria-hidden="true" />

      <div className={styles.container}>
        {/* ═══════════════════════════════════════════
            LEFT COLUMN — Scrollytelling Narrative
        ══════════════════════════════════════════ */}
        <div className={styles.leftCol}>
          {/* BLOQUE 1: Hero statement */}
          <div className={styles.narrativeBlock}>
            <p className={styles.label}>PARA MARCAS</p>
            <h2 className={styles.heading}>
              Más visibilidad.<br />
              Mejores usuarios.<br />
              Tráfico directo<br />
              a tu tienda.<br />
              <span className={styles.headingAccent}>Costos optimizados.</span>
            </h2>
            <p className={styles.description}>
              Findclo conecta tu marca con personas que ya están buscando moda.
              Potenciamos el descubrimiento de tus productos y llevamos tráfico
              calificado directamente a tu tienda online.
            </p>
          </div>

          {/* BLOQUE 2: Benefits 2×2 grid */}
          <div className={styles.narrativeBlock}>
            <div className={styles.blockHeader}>
              <span className={styles.blockSub}>BENEFICIOS CLAVE</span>
              <h3 className={styles.blockTitle}>Diseñado para potenciar tu ecommerce</h3>
            </div>
            <div className={styles.benefitsGrid}>
              {benefits.map((b, i) => (
                <BenefitCard key={b.num} {...b} delay={i * 0.08} />
              ))}
            </div>
          </div>

          {/* BLOQUE 3: Metrics + CTA */}
          <div className={styles.narrativeBlock}>
            <div className={styles.blockHeader}>
              <span className={styles.blockSub}>RESULTADOS DIRECTOS</span>
              <h3 className={styles.blockTitle}>Un modelo publicitario eficiente</h3>
            </div>
            <div className={styles.metricsGrid}>
              {metrics.map((m) => (
                <MetricCard key={m.title} {...m} />
              ))}
            </div>
            <div className={styles.ctaBlock}>
              <a
                href="https://findclo.com/brands"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.ctaBtn}
              >
                <span>SUMÁ TU MARCA A FINDCLO</span>
                <span className={styles.arrow} aria-hidden="true">→</span>
              </a>
              <p className={styles.ctaNote}>
                Registrate y empezá a potenciar tu marca hoy.
              </p>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════
            RIGHT COLUMN — Sticky Animated Canvas
        ══════════════════════════════════════════ */}
        <div className={styles.rightCol}>
          <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
          <div className={styles.canvasVignette} aria-hidden="true" />
        </div>
      </div>
    </section>
  )
}

/* ─── Sub-components ────────────────────────────────── */
function BenefitCard({ num, icon: Icon, title, body, note }) {
  const cardRef = useRef(null)

  function onMouseMove(e) {
    if (!cardRef.current) return
    const r = cardRef.current.getBoundingClientRect()
    cardRef.current.style.setProperty('--mx', `${e.clientX - r.left}px`)
    cardRef.current.style.setProperty('--my', `${e.clientY - r.top}px`)
  }

  return (
    <div ref={cardRef} className={styles.benefitCard} onMouseMove={onMouseMove}>
      <div className={styles.spotlight} aria-hidden="true" />
      <div className={styles.cardHeader}>
        <div className={styles.cardIcon}><Icon size={18} strokeWidth={1.8} /></div>
        <span className={styles.cardNum}>{num}</span>
      </div>
      <h4 className={styles.cardTitle}>{title}</h4>
      <p className={styles.cardBody}>{body}</p>
      {note && <p className={styles.cardNote}>{note}</p>}
    </div>
  )
}

function MetricCard({ icon: Icon, title, desc }) {
  return (
    <div className={styles.metricCard}>
      <div className={styles.metricIcon}><Icon size={20} strokeWidth={1.7} /></div>
      <div className={styles.metricContent}>
        <h4 className={styles.metricTitle}>{title}</h4>
        <p className={styles.metricDesc}>{desc}</p>
      </div>
    </div>
  )
}
