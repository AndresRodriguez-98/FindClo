import { CoverflowCarousel } from '../CoverflowCarousel/CoverflowCarousel'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import styles from './CarouselSection.module.css'

/* ─── All images are local (public/images/) — no external CDN dependency ── */
const SLIDES = [
  /* ── King Of The Kongo ─────────────────────────────────────── */
  {
    src: '/images/kotk-campera-sakura.webp',
    alt: 'Campera Sakura — King Of The Kongo',
    title: 'King Of The Kongo',
    subtitle: 'Campera Sakura',
    href: 'https://www.findclo.com/search?search=King+Of+The+Kongo'
  },
  {
    src: '/images/kotk-team-knit-black.webp',
    alt: 'Kongo Team Knit Black — King Of The Kongo',
    title: 'King Of The Kongo',
    subtitle: 'Kongo Team Knit Black',
    href: 'https://www.findclo.com/product/41024'
  },
  {
    src: '/images/kotk-chomba-boxy-black.webp',
    alt: 'Chomba Boxy Fit 01 Black — King Of The Kongo',
    title: 'King Of The Kongo',
    subtitle: 'Chomba Boxy Fit "01" Black',
    href: 'https://www.findclo.com/search?search=King+Of+The+Kongo'
  },

  /* ── Higher ─────────────────────────────────────────────────── */
  {
    src: '/images/higher-top-new-goya.webp',
    alt: 'Top New Goya — Higher',
    title: 'Higher',
    subtitle: 'Top New Goya',
    href: 'https://www.findclo.com/search?search=Higher'
  },
  {
    src: '/images/higher-buzo-star.webp',
    alt: 'Buzo Star — Higher',
    title: 'Higher',
    subtitle: 'Buzo Star',
    href: 'https://www.findclo.com/product/41556'
  },
  {
    src: '/images/higher-remera-club.webp',
    alt: 'Remera Club — Higher',
    title: 'Higher',
    subtitle: 'Remera Club',
    href: 'https://www.findclo.com/product/41427'
  },

  /* ── VCP ─────────────────────────────────────────────────────── */
  {
    src: '/images/vcp-body-mets.webp',
    alt: 'Body Mets — VCP',
    title: 'VCP',
    subtitle: 'Body Mets',
    href: 'https://www.findclo.com/search?search=VCP'
  },

  /* ── Vans ─────────────────────────────────────────────────────── */
  {
    src: '/images/vans-hylane.jpg',
    alt: 'Zapatillas U Hylane — Vans',
    title: 'Vans',
    subtitle: 'Zapatillas U Hylane',
    href: 'https://www.findclo.com/search?search=Vans'
  },

  /* ── The North Face ───────────────────────────────────────────── */
  {
    src: '/images/tnf-thermoball-beige.jpg',
    alt: 'Borcegos Thermoball Beige — The North Face',
    title: 'The North Face',
    subtitle: 'W Thermoball Lace Up WP',
    href: 'https://www.findclo.com/search?search=The+North+Face'
  },
  {
    src: '/images/tnf-vectiv-enduris.jpg',
    alt: 'Zapatillas Vectiv Enduris 4 — The North Face',
    title: 'The North Face',
    subtitle: 'W Vectiv Enduris 4',
    href: 'https://www.findclo.com/search?search=The+North+Face'
  },

  /* ── Puma ─────────────────────────────────────────────────────── */
  {
    src: '/images/puma-fade-unisex.png',
    alt: 'Zapatillas Fade Unisex — Puma',
    title: 'Puma',
    subtitle: 'Zapatillas Fade Unisex',
    href: 'https://www.findclo.com/search?search=Puma'
  },
  {
    src: '/images/puma-class-remera.png',
    alt: 'Remera Class — Puma',
    title: 'Puma',
    subtitle: 'Remera Class Hombre',
    href: 'https://www.findclo.com/search?search=Puma'
  },

  /* ── Paz Cornu ────────────────────────────────────────────────── */
  {
    src: '/images/pazcornu-vestido-estany.webp',
    alt: 'Vestido Estany — Paz Cornu',
    title: 'Paz Cornu',
    subtitle: 'Vestido Estany',
    href: 'https://www.findclo.com/product/40990'
  },
  {
    src: '/images/pazcornu-saco-san-remo.webp',
    alt: 'Saco San Remo — Paz Cornu',
    title: 'Paz Cornu',
    subtitle: 'Saco San Remo',
    href: 'https://www.findclo.com/product/40985'
  },
  {
    src: '/images/pazcornu-vestido-parissea.webp',
    alt: 'Vestido Parissea — Paz Cornu',
    title: 'Paz Cornu',
    subtitle: 'Vestido Parissea',
    href: 'https://www.findclo.com/product/40986'
  },
]

export default function CarouselSection() {
  const [ref, visible] = useScrollReveal()

  return (
    <section id="colecciones" className={styles.section}>
      {/* Header */}
      <div
        ref={ref}
        className={`${styles.header} ${visible ? styles.visible : ''}`}
      >
        <p className={styles.label}>Colecciones</p>
        <h2 className={styles.heading}>
          DESCUBRÍ<br />LO QUE HAY
        </h2>
        <p className={styles.sub}>
          Más de 30 marcas, un solo lugar. Swipeá para explorar.
        </p>
      </div>

      {/* Coverflow */}
      <div className={`${styles.carouselWrap} ${visible ? styles.carouselVisible : ''}`}>
        <CoverflowCarousel
          slides={SLIDES}
          showCaption
          showNavigation
          showPagination
          cardWidth="clamp(180px, 24vw, 300px)"
          rotate={44}
          depth={0.55}
          fade={0.12}
          label="Colecciones de ropa findclo"
        />
      </div>
    </section>
  )
}
