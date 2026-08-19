import { Search, Compass, ShoppingBag, ExternalLink, ChevronDown, ArrowRight } from 'lucide-react'
import styles from './HeroOverlay.module.css'

const features = [
  {
    icon: Search,
    title: 'BUSCÁ',
    description: 'Encontrá lo que querés entre miles de productos.',
  },
  {
    icon: Compass,
    title: 'DESCUBRÍ',
    description: 'Explorá distintas marcas y estilos en un solo lugar.',
  },
  {
    icon: ShoppingBag,
    title: 'ELEGÍ',
    description: 'Compará, guardá tus favoritos y elegí con confianza.',
  },
  {
    icon: ExternalLink,
    title: 'COMPRÁ EN LA MARCA',
    description: 'Te redirigimos a la tienda oficial para que compres seguro.',
  },
]

export default function HeroOverlay({ ready }) {
  const handleScrollToNext = (e) => {
    e?.preventDefault?.()
    const nextSec = document.querySelector('#soluciones')
    if (nextSec) {
      nextSec.scrollIntoView({ behavior: 'smooth' })
    } else {
      window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })
    }
  }

  return (
    <div
      className={`${styles.overlay} ${ready ? styles.ready : ''}`}
      aria-label="Toda la moda. Un solo lugar."
    >
      {/* ── Main Hero Content ──────────────────── */}
      <div className={styles.heroMain}>
        <div className={styles.contentWrap}>
          
          {/* ── H1 Heading in DRUK ───────────────── */}
          <h1 className={styles.heading}>
            <span className={styles.lineWrap}>
              <span className={`${styles.line} ${styles.lineDark}`} style={{ '--delay': '0.05s' }}>
                TODA LA MODA.
              </span>
            </span>
            <span className={styles.lineWrap}>
              <span className={`${styles.line} ${styles.lineGreen}`} style={{ '--delay': '0.2s' }}>
                UN SOLO LUGAR
              </span>
            </span>
          </h1>

          {/* ── Subtitle with semantic highlights ── */}
          <div className={styles.taglineBlock} style={{ '--delay': '0.38s' }}>
            <p className={styles.tagline}>
              Somos <strong className={styles.brandHighlight}>Findclo</strong>, la plataforma creada para reunir y simplificar la forma de <strong className={styles.brandHighlight}>descubrir moda</strong>.
            </p>
          </div>

          {/* ── Primary CTA Button ───────────────── */}
          <div className={styles.ctaWrap} style={{ '--delay': '0.52s' }}>
            <a
              href="#colecciones"
              className={styles.primaryCta}
              onClick={(e) => {
                e.preventDefault()
                document.querySelector('#colecciones')?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              <span>EXPLORÁ FINDCLO</span>
              <ArrowRight size={17} className={styles.ctaArrow} />
            </a>
          </div>

        </div>
      </div>

      {/* ── Bottom Section: Floating Features Bar & Scroll Indicator ── */}
      <div className={styles.bottomSection} style={{ '--delay': '0.68s' }}>
        
        {/* Floating Features Bar */}
        <div className={styles.featuresBar} role="region" aria-label="Características de Findclo">
          {features.map((item, idx) => {
            const Icon = item.icon
            return (
              <div key={item.title} className={styles.featureItem}>
                <div className={styles.iconCircle}>
                  <Icon size={19} strokeWidth={2.2} />
                </div>
                <div className={styles.featureText}>
                  <h3 className={styles.featureTitle}>{item.title}</h3>
                  <p className={styles.featureDesc}>{item.description}</p>
                </div>
                {idx < features.length - 1 && <div className={styles.divider} aria-hidden="true" />}
              </div>
            )
          })}
        </div>

        {/* Interactive Scroll Indicator */}
        <button
          type="button"
          className={styles.scrollIndicator}
          onClick={handleScrollToNext}
          aria-label="Deslizá para seguir explorando"
        >
          <div className={styles.mouseShape}>
            <span className={styles.mouseWheelDot} />
          </div>
          <span className={styles.scrollText}>DESLIZÁ PARA SEGUIR EXPLORANDO</span>
          <ChevronDown size={14} className={styles.scrollChevron} />
        </button>

      </div>
    </div>
  )
}
