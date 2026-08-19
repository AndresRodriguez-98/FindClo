import { useState, useEffect } from 'react'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import styles from './Navbar.module.css'

const navLinks = [
  { id: 'findclo', label: 'FINDCLO', href: '#top' },
  { id: 'para-vos', label: 'PARA VOS', href: '#soluciones' },
  { id: 'para-marcas', label: 'PARA MARCAS', href: '#nosotros' },
  { id: 'explora', label: 'EXPLORÁ', href: '#colecciones' },
]

function Logo() {
  return (
    <span className={styles.logoText}>findclo</span>
  )
}

export default function Navbar() {
  const { isDark, toggleTheme } = useTheme()
  const [activeId, setActiveId] = useState('findclo')
  const [scrolled, setScrolled] = useState(false)

  // Scrollspy to automatically update active nav item based on viewport position
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30)

      const scrollPos = window.scrollY + 220
      const secciones = [
        { id: 'explora', el: document.querySelector('#colecciones') },
        { id: 'para-marcas', el: document.querySelector('#nosotros') },
        { id: 'para-vos', el: document.querySelector('#soluciones') },
        { id: 'findclo', el: document.querySelector('#top') || document.body },
      ]

      for (const sec of secciones) {
        if (sec.el && sec.el.offsetTop <= scrollPos) {
          setActiveId(sec.id)
          break
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  function handleNavClick(e, href, id) {
    e.preventDefault()
    setActiveId(id)
    if (href === '#top') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      const target = document.querySelector(href)
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <header className={`${styles.navbar} ${scrolled ? styles.navbarScrolled : ''}`}>
      <div className={styles.inner}>

        {/* ── Logo (left) ──────────────────────── */}
        <a
          href="/"
          className={styles.logo}
          aria-label="Findclo — Inicio"
          onClick={e => {
            e.preventDefault()
            setActiveId('findclo')
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
        >
          <Logo />
        </a>

        {/* ── Center Navigation with Active Indicator ── */}
        <nav className={styles.nav} aria-label="Navegación principal">
          {navLinks.map(({ id, label, href }) => {
            const isActive = activeId === id
            return (
              <a
                key={id}
                href={href}
                className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
                onClick={e => handleNavClick(e, href, id)}
              >
                <span className={styles.navLinkText}>{label}</span>
                <span className={`${styles.activeIndicator} ${isActive ? styles.indicatorVisible : ''}`} />
              </a>
            )
          })}
        </nav>

        {/* ── Right Actions: CTA + Theme Toggle ─────────── */}
        <div className={styles.rightActions}>
          <a
            href="https://www.findclo.com"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.ctaBtn}
            aria-label="Ir a Findclo"
          >
            <span className={styles.ctaText}>IR A FINDCLO</span>
            <span className={styles.ctaArrow} aria-hidden="true">↗</span>
          </a>

          {/* Theme Toggle Button */}
          <button
            type="button"
            className={styles.themeToggleBtn}
            onClick={toggleTheme}
            aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          >
            <div className={`${styles.iconContainer} ${isDark ? styles.isDarkState : styles.isLightState}`}>
              {isDark ? (
                <Sun size={17} strokeWidth={2.2} className={styles.themeIcon} />
              ) : (
                <Moon size={17} strokeWidth={2.2} className={styles.themeIcon} />
              )}
            </div>
          </button>
        </div>

      </div>
    </header>
  )
}
