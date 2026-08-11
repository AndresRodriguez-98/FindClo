import styles from './HeroOverlay.module.css'

const lines = ['NO VENDEMOS ROPA,', 'CAMBIAMOS CÓMO', 'SE DESCUBRE']

export default function HeroOverlay({ ready }) {
  return (
    <div className={`${styles.overlay} ${ready ? styles.ready : ''}`} aria-label="No vendemos ropa, cambiamos cómo se descubre">

      <div className={styles.content}>

        {/* ── Main heading in DRUK ──────────────── */}
        <h1 className={styles.heading}>
          {lines.map((line, i) => (
            <span key={line} className={styles.lineWrap}>
              <span className={styles.line} style={{ '--delay': `${i * 0.15 + 0.05}s` }}>
                {line}
              </span>
            </span>
          ))}
        </h1>

        {/* ── Infrastructure tagline in Inter ───── */}
        <div className={styles.taglineBlock} style={{ '--delay': '0.58s' }}>
          <p className={styles.tagline}>
            Findclo es la infraestructura que conecta, entiende y revela
            lo que el mundo quiere usar.
          </p>
          <p className={styles.taglineSub}>
            No vendemos ropa. Cambiamos la forma en que la moda se descubre.
          </p>
        </div>

        {/* ── CTA ───────────────────────────────── */}
        <a href="#coleccion" className={styles.cta} style={{ '--delay': '0.75s' }}
           onClick={e => { e.preventDefault(); document.querySelector('#coleccion')?.scrollIntoView({ behavior: 'smooth' }) }}>
          <span>Descubrí más</span>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>

      </div>

      {/* ── Scroll indicator ─────────────────────── */}
      <div className={styles.scrollHint} style={{ '--delay': '1.0s' }}>
        <span className={styles.scrollLine} />
        <span className={styles.scrollLabel}>scroll</span>
      </div>

    </div>
  )
}
