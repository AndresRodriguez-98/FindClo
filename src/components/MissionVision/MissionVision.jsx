import { useScrollReveal } from '../../hooks/useScrollReveal'
import styles from './MissionVision.module.css'

function Panel({ label, heading, body, quote, reverse, accent, video, videoOpacity, labelOpacity }) {
  const [ref, visible] = useScrollReveal()
  return (
    <article
      ref={ref}
      className={`${styles.panel} ${reverse ? styles.reverse : ''} ${visible ? styles.visible : ''}`}
    >
      <div className={styles.textBlock}>
        <p className={styles.label}>{label}</p>
        <h2 className={styles.heading}>{heading}</h2>
        <p className={styles.body}>{body}</p>
        {quote && <blockquote className={styles.quote}>"{quote}"</blockquote>}
        <a href="#" className={styles.link}>
          <span>Conocer más</span>
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
      </div>

      <div className={styles.visual} style={{ '--accent': accent }}>
        {video && (
          <video
            src={video}
            autoPlay
            loop
            muted
            playsInline
            className={styles.videoBackground}
            style={videoOpacity !== undefined ? { opacity: videoOpacity, mixBlendMode: 'normal' } : {}}
          />
        )}
        <div className={styles.visualInner}>
          <span 
            className={styles.visualLabel}
            style={labelOpacity !== undefined ? { color: `rgba(255,255,255,${labelOpacity})` } : {}}
          >
            {heading}
          </span>
        </div>
        <div className={styles.visualTag}>Buenos Aires, AR</div>
      </div>
    </article>
  )
}

export default function MissionVision() {
  return (
    <section id="nosotros" className={styles.section}>
      <Panel
        label="01 — Quiénes somos"
        heading="Venimos a cambiar las reglas"
        body="findclo nació en Buenos Aires con una convicción: el acceso a la moda tiene que ser más inteligente, más rápido y más justo. Somos una empresa de tecnología de indumentaria que conecta personas con las prendas que realmente buscan, eliminando la fricción que existe entre la inspiración y la compra."
        quote="No seguimos el mercado. Lo rediseñamos."
        accent="#006251"
        video="/findclo2.mp4"
        videoOpacity={1}
        labelOpacity={0.15}
      />
      <Panel
        label="02 — Nuestra promesa"
        heading="El futuro del descubrimiento"
        body="En un mundo donde la moda se mueve a la velocidad de la cultura, seguir buscando entre decenas de sitios no tiene sentido. findclo es la infraestructura que conecta, entiende y revela lo que el mundo quiere usar — y lo pone a tu alcance desde una sola pantalla."
        quote="La mejor prenda es la que encontrás cuando la buscás."
        reverse
        accent="#004840"
        video="/findclo.webm"
      />
    </section>
  )
}
