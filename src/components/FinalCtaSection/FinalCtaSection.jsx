import { useScrollReveal } from '../../hooks/useScrollReveal'
import styles from './FinalCtaSection.module.css'

export default function FinalCtaSection() {
  const [ref, visible] = useScrollReveal()
  const currentYear = new Date().getFullYear()

  return (
    <footer className={styles.section}>
      {/* Ambient green glow */}
      <div className={styles.ambientGlow} aria-hidden="true" />

      {/* Subtle typographic grid texture on left area */}
      <div className={styles.bgTexture} aria-hidden="true" />

      <div
        ref={ref}
        className={`${styles.container} ${visible ? styles.visible : ''}`}
      >
        {/* ── Columna Izquierda: Tagline ── */}
        <div className={styles.leftCol}>
          <h3 className={styles.appTitle}>
            LLEVÁ <span className={styles.brandAccent}>FINDCLO</span><br />
            A DONDE VAYAS.
          </h3>
        </div>

        {/* ── Columna Central: Foto real del celular ── */}
        <div className={styles.centerCol}>
          <div className={styles.phoneMockup}>
            <img
              src="/images/phone-mockup.png"
              alt="App Findclo en un smartphone"
              className={styles.phoneImg}
              loading="lazy"
              draggable="false"
            />
            {/* Glow behind the phone */}
            <div className={styles.phoneGlow} aria-hidden="true" />
          </div>
        </div>

        {/* ── Columna Derecha: Descargá tu app + store badges ── */}
        <div className={styles.rightCol}>
          <h3 className={styles.ctaHeading}>
            DESCARGÁ<br />
            <span className={styles.brandAccent}>TU APP</span>
          </h3>

          <div className={styles.badgesWrap}>
            {/* App Store */}
            <a
              href="https://apps.apple.com/ar/app/findclo/id6771854973"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.storeBadge}
              aria-label="Descargar en el App Store"
            >
              <svg className={styles.storeIcon} viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8.92-2.87-.92.04-2.02.62-2.66 1.37-.56.65-.89 1.69-.76 2.72 1.03.08 2.06-.52 2.5-1.22z"
                />
              </svg>
              <div className={styles.badgeText}>
                <span className={styles.badgeSub}>Disponible en</span>
                <span className={styles.badgeMain}>App Store</span>
              </div>
            </a>

            {/* Google Play — brand colors */}
            <a
              href="https://play.google.com/store/search?q=findclo&c=apps"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.storeBadge}
              aria-label="Disponible en Google Play"
            >
              <svg className={styles.storeIconColor} viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#EA4335" d="M3.18 23.5c.46.27 1.02.29 1.52.03l11.08-6.38-2.56-2.56-10.04 8.91z"/>
                <path fill="#FBBC04" d="M21.84 10.7c-.46-.27-1.38-.74-1.38-.74l-2.76-1.59-3.02 3.02 3.02 3.02 2.78-1.6c.77-.44 1.27-1.25 1.27-2.11 0-.48-.14-.94-.39-1.35l.48.35z"/>
                <path fill="#4285F4" d="M1.66.93C1.25 1.3 1 1.84 1 2.46v19.08c0 .62.25 1.16.66 1.53l.09.08 10.69-10.69v-.25L1.75.85 1.66.93z"/>
                <path fill="#34A853" d="M15.78 8.37L13.22 5.81 4.7.5c-.5-.29-1.09-.27-1.55.02l10.63 10.63 2-2.78z"/>
              </svg>
              <div className={styles.badgeText}>
                <span className={styles.badgeSub}>Disponible en</span>
                <span className={styles.badgeMain}>Google Play</span>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className={styles.bottomBar}>
        <p className={styles.copyText}>
          © {currentYear} Findclo. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  )
}
