import styles from './Footer.module.css'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brandCol}>
          <span className={styles.logo}>findclo</span>
          <p className={styles.tagline}>
            La plataforma creada para reunir y simplificar la forma de descubrir moda.
          </p>
        </div>

        <div className={styles.linksCol}>
          <a href="#top" className={styles.footerLink}>Inicio</a>
          <a href="#soluciones" className={styles.footerLink}>Soluciones</a>
          <a href="#nosotros" className={styles.footerLink}>Nosotros</a>
          <a href="#colecciones" className={styles.footerLink}>Colecciones</a>
          <a href="https://findclo.com" target="_blank" rel="noopener noreferrer" className={styles.footerLink}>
            Ir a Findclo ↗
          </a>
        </div>
      </div>

      <div className={styles.bottomBar}>
        <p className={styles.copy}>
          © {currentYear} Findclo. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  )
}
