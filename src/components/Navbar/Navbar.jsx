import styles from './Navbar.module.css'

const navLinks = [
  { label: 'Plataforma',   href: '#top'          },
  { label: 'Soluciones',   href: '#soluciones'   },
  { label: 'Nosotros',     href: '#nosotros'     },
  { label: 'Colecciones',  href: '#colecciones'  },
]

/* Inline SVG logo — renders with the page's loaded fonts,
   transparent background, crisp at any DPR               */
function Logo() {
  return (
    <svg
      viewBox="0 0 300 60"
      className={styles.logoSvg}
      role="img"
      aria-label="findclo"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <text
        x="0"
        y="46"
        fontFamily="'Nunito', 'Varela Round', 'Comfortaa', 'Trebuchet MS', system-ui, sans-serif"
        fontWeight="700"
        fontSize="50"
        letterSpacing="-1"
        fill="#006251"
      >
        findclo
      </text>
    </svg>
  )
}

export default function Navbar() {
  function handleScroll(e, href) {
    e.preventDefault()
    if (href === '#top') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <header className={styles.navbar}>
      <div className={styles.inner}>

        {/* ── Logo (left) ──────────────────────── */}
        <a
          href="/"
          className={styles.logo}
          aria-label="Findclo — inicio"
          onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
        >
          <Logo />
        </a>

        {/* ── Nav links (center) ───────────────── */}
        <nav className={styles.nav} aria-label="Navegación principal">
          {navLinks.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className={styles.navLink}
              onClick={e => handleScroll(e, href)}
            >
              <span className={styles.navLinkText}>{label}</span>
              <span className={styles.navLinkUnderline} />
            </a>
          ))}
        </nav>

        {/* ── CTA (right) ──────────────────────── */}
        <a
          href="https://findclo.com"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.ctaBtn}
          aria-label="Ir al sitio oficial de Findclo"
        >
          <span className={styles.ctaText}>Ir al sitio</span>
          <span className={styles.ctaArrow} aria-hidden="true">
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <path d="M1 10L10 1M10 1H3M10 1V8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </a>

      </div>
    </header>
  )
}
