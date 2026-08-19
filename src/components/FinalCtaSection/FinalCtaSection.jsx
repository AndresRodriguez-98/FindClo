import { useScrollReveal } from '../../hooks/useScrollReveal'
import styles from './FinalCtaSection.module.css'

export default function FinalCtaSection() {
  const [ref, visible] = useScrollReveal()
  const currentYear = new Date().getFullYear()

  return (
    <footer className={styles.section}>
      {/* Background ambient lighting */}
      <div className={styles.ambientGlow} aria-hidden="true" />

      <div
        ref={ref}
        className={`${styles.container} ${visible ? styles.visible : ''}`}
      >
        {/* ── Columna Izquierda: Descarga de App ── */}
        <div className={styles.leftCol}>
          <h3 className={styles.appTitle}>
            LLEVÁ <span className={styles.brandAccent}>FINDCLO</span><br />
            A DONDE VAYAS.
          </h3>

          <div className={styles.badgesWrap}>
            {/* App Store Badge */}
            <a
              href="https://apple.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.storeBadge}
              aria-label="Descargar en el App Store"
            >
              <svg className={styles.storeIcon} viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 0.92-2.87-.92.04-2.02.62-2.66 1.37-.56.65-.89 1.69-.76 2.72 1.03.08 2.06-.52 2.5-1.22z"/>
              </svg>
              <div className={styles.badgeText}>
                <span className={styles.badgeSub}>Consíguelo en el</span>
                <span className={styles.badgeMain}>App Store</span>
              </div>
            </a>

            {/* Google Play Badge */}
            <a
              href="https://play.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.storeBadge}
              aria-label="Disponible en Google Play"
            >
              <svg className={styles.storeIcon} viewBox="0 0 24 24" fill="currentColor">
                <path d="M3.609 1.814L13.793 12 3.61 22.186a1.94 1.94 0 0 1-.225-.972V2.786c0-.36.082-.693.224-.972zm11.242 11.242l2.368 2.368-12.012 6.863 9.644-9.231zm0-2.112L5.207 1.713l12.012 6.863-2.368 2.368zm1.056 1.056l3.435 1.963c.96.549.96 1.447 0 1.996l-3.435 1.963-2.112-2.112 2.112-2.112z"/>
              </svg>
              <div className={styles.badgeText}>
                <span className={styles.badgeSub}>DISPONIBLE EN</span>
                <span className={styles.badgeMain}>Google Play</span>
              </div>
            </a>
          </div>
        </div>

        {/* ── Columna Central: Smartphone Horizontal (Landscape) ── */}
        <div className={styles.centerCol}>
          <div className={styles.phoneMockupHorizontal}>
            {/* Phone Outer Chassis in Landscape */}
            <div className={styles.phoneFrameHorizontal}>
              {/* Left Notch / Dynamic Island */}
              <div className={styles.phoneNotchLandscape} />

              {/* Landscape Screen Content */}
              <div className={styles.phoneScreenHorizontal}>
                <div className={styles.phoneHeaderLandscape}>
                  <span className={styles.phoneLogo}>findclo</span>
                  <div className={styles.phoneHeaderDots}>
                    <span />
                    <span />
                  </div>
                </div>

                <div className={styles.phoneBodyLandscape}>
                  {/* Left panel in landscape */}
                  <div className={styles.phoneHeroPreviewLandscape}>
                    <span className={styles.phoneHeroTag}>EXPLORÁ</span>
                    <p className={styles.phoneHeroText}>Descubrí prendas exclusivas</p>
                  </div>

                  {/* Right grid in landscape */}
                  <div className={styles.phoneCardGridLandscape}>
                    <div className={styles.phoneMiniCard} />
                    <div className={styles.phoneMiniCard} />
                    <div className={styles.phoneMiniCard} />
                    <div className={styles.phoneMiniCard} />
                  </div>
                </div>

                {/* Bottom Home Bar */}
                <div className={styles.phoneHomeBarLandscape} />
              </div>
            </div>

            <div className={styles.phoneGlow} aria-hidden="true" />
          </div>
        </div>

        {/* ── Columna Derecha: CTA de Conversión ── */}
        <div className={styles.rightCol}>
          <h3 className={styles.ctaHeading}>
            ENCONTRÁ <span className={styles.brandAccent}>ESA PRENDA</span><br />
            QUE TENÉS EN MENTE.
          </h3>

          <div className={styles.ctaActionWrap}>
            <a
              href="https://findclo.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.primaryCtaBtn}
            >
              <span>EMPEZÁ A EXPLORAR</span>
              <span className={styles.ctaArrow} aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>

      {/* Subtle bottom copyright bar */}
      <div className={styles.bottomBar}>
        <p className={styles.copyText}>
          © {currentYear} Findclo. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  )
}
