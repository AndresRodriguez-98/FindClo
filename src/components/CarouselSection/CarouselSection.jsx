import { useEffect, useRef } from 'react'
import { CoverflowCarousel } from '../CoverflowCarousel/CoverflowCarousel'
import styles from './CarouselSection.module.css'

/* ─── Categorías Generales de Prendas ─── */
const CATEGORIES = [
  {
    src: '/images/vans-hylane.jpg',
    alt: 'Zapatillas en Findclo',
    title: 'ZAPATILLAS',
    subtitle: 'Explorar zapatillas',
    href: 'https://www.findclo.com/search?search=Zapatillas',
  },
  {
    src: '/images/kotk-campera-sakura.webp',
    alt: 'Abrigos en Findclo',
    title: 'ABRIGOS',
    subtitle: 'Explorar abrigos y camperas',
    href: 'https://www.findclo.com/search?search=Abrigos',
  },
  {
    src: '/images/category-jeans.jpg',
    alt: 'Jeans en Findclo',
    title: 'JEANS',
    subtitle: 'Explorar jeans y denim',
    href: 'https://www.findclo.com/search?search=Jeans',
  },
  {
    src: '/images/pazcornu-vestido-parissea.webp',
    alt: 'Vestidos en Findclo',
    title: 'VESTIDOS',
    subtitle: 'Explorar vestidos y monos',
    href: 'https://www.findclo.com/search?search=Vestidos',
  },
  {
    src: '/images/higher-buzo-star.webp',
    alt: 'Buzos en Findclo',
    title: 'BUZOS',
    subtitle: 'Explorar buzos y hoodies',
    href: 'https://www.findclo.com/search?search=Buzos',
  },
  {
    src: '/images/category-accesorios.jpg',
    alt: 'Accesorios en Findclo',
    title: 'ACCESORIOS',
    subtitle: 'Explorar accesorios',
    href: 'https://www.findclo.com/search?search=Accesorios',
  },
  {
    src: '/images/tnf-thermoball-beige.jpg',
    alt: 'Botas en Findclo',
    title: 'BOTAS',
    subtitle: 'Explorar botas y borcegos',
    href: 'https://www.findclo.com/search?search=Botas',
  },
]

export default function CarouselSection() {
  const sectionRef      = useRef(null)
  const headerRef       = useRef(null)
  const carouselWrapRef = useRef(null)

  useEffect(() => {
    const section      = sectionRef.current
    const header       = headerRef.current
    const carouselWrap = carouselWrapRef.current
    if (!section || !header || !carouselWrap) return

    const state = {
      targetProgress: 0,
      currentProgress: 0,
      rafId: null,
    }

    function onScroll() {
      const rect = section.getBoundingClientRect()
      const viewH = window.innerHeight
      const sectionH = section.offsetHeight
      const totalSpan = sectionH + viewH
      if (totalSpan <= 0) return

      // Progress goes 0 -> 1 as section scrolls through viewport
      const scrolled = Math.max(0, viewH - rect.top)
      const progress = Math.min(1, Math.max(0, scrolled / totalSpan))
      state.targetProgress = progress
    }

    function render() {
      // 60-120fps continuous interpolation
      const diff = state.targetProgress - state.currentProgress
      if (Math.abs(diff) > 0.001) {
        state.currentProgress += diff * 0.14
      } else {
        state.currentProgress = state.targetProgress
      }

      const p = state.currentProgress

      // 1. Header Parallax: subtle vertical movement for 3D depth
      const headerY = (p - 0.35) * -45
      header.style.transform = `translate3d(0, ${headerY.toFixed(2)}px, 0)`

      // 2. Carousel Parallax: active vertical floating travel decoupled from header
      const carouselY = (p - 0.5) * -75
      carouselWrap.style.transform = `translate3d(0, ${carouselY.toFixed(2)}px, 0)`

      state.rafId = requestAnimationFrame(render)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })

    onScroll()
    state.currentProgress = state.targetProgress
    state.rafId = requestAnimationFrame(render)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (state.rafId) cancelAnimationFrame(state.rafId)
    }
  }, [])

  return (
    <section ref={sectionRef} id="colecciones" className={styles.section}>
      {/* Ambient background emerald glow */}
      <div className={styles.ambientGlow} aria-hidden="true" />

      {/* Header with Smooth Parallax */}
      <div ref={headerRef} className={styles.header}>
        <p className={styles.label}>Explorá</p>
        <h2 className={styles.heading}>
          HAY MÁS<br />
          PARA ENCONTRAR.
        </h2>
        <p className={styles.sub}>
          Categorías, marcas y miles de productos.<br />
          Todo en un solo lugar.
        </p>
      </div>

      {/* Coverflow Carousel with Fluid Decoupled Parallax */}
      <div ref={carouselWrapRef} className={styles.carouselWrap}>
        <CoverflowCarousel
          slides={CATEGORIES}
          showCaption={false}
          showNavigation
          showPagination
          cardWidth="clamp(200px, 25vw, 320px)"
          rotate={40}
          depth={0.5}
          fade={0.15}
          label="Categorías de prendas en Findclo"
        />
      </div>
    </section>
  )
}
