import { useEffect, useRef } from 'react'
import { Search, ShoppingBag, Star } from 'lucide-react'
import styles from './StatementSection.module.css'

const benefits = [
  {
    number: '01',
    icon: Search,
    title: 'ENCONTRÁ EXACTAMENTE LO QUE BUSCÁS',
    body: 'No te limites a lo que encontrás en una sola tienda. Buscá y filtrá entre miles de productos de distintas marcas hasta dar con lo que querés.',
  },
  {
    number: '02',
    icon: ShoppingBag,
    title: 'TODAS LAS MARCAS. UNA SOLA BÚSQUEDA.',
    body: 'En lugar de abrir y recorrer tienda por tienda, buscá una vez en Findclo. Menos vueltas, menos tiempo perdido.',
  },
  {
    number: '03',
    icon: Star,
    title: 'DESCUBRÍ LO QUE NO CONOCÍAS',
    body: 'Encontrá nuevas marcas, productos y alternativas que quizás nunca hubieras descubierto por tu cuenta.',
  },
]

export default function StatementSection() {
  const sectionRef = useRef(null)
  const titleLayerRef = useRef(null)
  const cardsLayerRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    const titleLayer = titleLayerRef.current
    const cardsLayer = cardsLayerRef.current
    if (!section || !titleLayer || !cardsLayer) return

    const state = {
      currentProgress: 0,
      targetProgress: 0,
      rafId: null,
    }

    function updateTarget() {
      const rect = section.getBoundingClientRect()
      const sectionH = section.offsetHeight
      const viewH = window.innerHeight
      const scrollRange = sectionH - viewH
      if (scrollRange <= 0) return

      // Progress goes 0 -> 1 as user scrolls through this pinned section
      const scrolled = Math.max(0, -rect.top)
      const progress = Math.min(1, Math.max(0, scrolled / scrollRange))
      state.targetProgress = progress
    }

    function render() {
      const diff = state.targetProgress - state.currentProgress
      if (Math.abs(diff) > 0.001) {
        state.currentProgress += diff * 0.14
      } else {
        state.currentProgress = state.targetProgress
      }

      const p = state.currentProgress

      // 1. Title Subtle Parallax: floats slightly upwards for 3D depth
      const titleY = p * -40
      titleLayer.style.transform = `translate3d(0, ${titleY}px, 0)`

      // 2. Cards Reveal on Scroll (emerges upward from behind the text layer)
      // Reveal completes over the first 75% of section scroll
      const revealProgress = Math.min(1, Math.max(0, p / 0.75))
      // Smooth cubic ease-out
      const ease = 1 - Math.pow(1 - revealProgress, 3)
      const cardsY = (1 - ease) * 160 // starts at 160px down -> docks to 0px

      // 3. Fade-in: from 0 to 1 over first 50% of section scroll
      const opacity = Math.min(1, Math.max(0, p / 0.5))

      cardsLayer.style.transform = `translate3d(0, ${cardsY}px, 0)`
      cardsLayer.style.opacity = opacity.toFixed(3)

      state.rafId = requestAnimationFrame(render)
    }

    window.addEventListener('scroll', updateTarget, { passive: true })
    window.addEventListener('resize', updateTarget, { passive: true })

    updateTarget()
    state.currentProgress = state.targetProgress
    state.rafId = requestAnimationFrame(render)

    return () => {
      window.removeEventListener('scroll', updateTarget)
      window.removeEventListener('resize', updateTarget)
      if (state.rafId) cancelAnimationFrame(state.rafId)
    }
  }, [])

  return (
    <section ref={sectionRef} id="soluciones" className={styles.section}>
      <div className={styles.stickyViewport}>
        {/* Ambient background emerald atmosphere */}
        <div className={styles.ambientGlow} aria-hidden="true" />

        {/* ── Capa Superior (Z-Index: 10): Título y Label con Parallax ── */}
        <div ref={titleLayerRef} className={styles.titleLayer}>
          <p className={styles.label}>Para vos</p>
          <h2 className={styles.heading}>
            VENIMOS A<br />
            CAMBIAR CÓMO<br />
            DESCUBRÍS MODA.
          </h2>
        </div>

        {/* ── Capa Inferior (Z-Index: 5): 3 Tarjetas emergentes con Fade-in ── */}
        <div ref={cardsLayerRef} className={styles.cardsLayer}>
          <div className={styles.gridContainer}>
            {benefits.map((b) => (
              <BenefitCard key={b.number} {...b} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function BenefitCard({ number, icon: Icon, title, body }) {
  const cardRef = useRef(null)

  const handleMouseMove = (e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    cardRef.current.style.setProperty('--mouse-x', `${x}px`)
    cardRef.current.style.setProperty('--mouse-y', `${y}px`)
  }

  return (
    <div
      ref={cardRef}
      className={styles.card}
      onMouseMove={handleMouseMove}
    >
      {/* Hover Spotlight Glow */}
      <div className={styles.spotlight} aria-hidden="true" />

      <div className={styles.cardTop}>
        <span className={styles.cardNumber}>{number}</span>
        <div className={styles.iconCircle}>
          <Icon size={19} strokeWidth={1.8} />
        </div>
      </div>
      <h3 className={styles.cardTitle}>{title}</h3>
      <p className={styles.cardBody}>{body}</p>
    </div>
  )
}
