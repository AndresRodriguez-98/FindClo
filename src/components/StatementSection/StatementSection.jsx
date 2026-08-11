import { useScrollReveal } from '../../hooks/useScrollReveal'
import styles from './StatementSection.module.css'

const benefits = [
  {
    number: '01',
    title: 'Todo en un solo lugar',
    body: 'Buscá, filtrá y encontrá lo que querés sin saltar entre decenas de tiendas. findclo reúne toda la oferta de moda en una sola plataforma.',
  },
  {
    number: '02',
    title: '+30 marcas trabajando juntas',
    body: 'Integramos más de 30 marcas líderes para que tengas la mayor selección posible — desde lo más buscado hasta las joyas escondidas.',
  },
  {
    number: '03',
    title: 'Ves algo que te gusta? Lo encontrás.',
    body: 'Se terminó el problema de ver una prenda y no saber dónde conseguirla. findclo conecta la inspiración con el punto de compra en segundos.',
  },
]

export default function StatementSection() {
  const [ref, visible] = useScrollReveal()

  return (
    <section id="soluciones" className={styles.section}>
      {/* Header */}
      <div ref={ref} className={`${styles.header} ${visible ? styles.visible : ''}`}>
        <p className={styles.label}>Soluciones</p>
        <h2 className={styles.heading}>
          TODO LO QUE<br />BUSCÁS EN UN<br />SOLO LUGAR
        </h2>
      </div>

      {/* Benefit cards */}
      <ul className={styles.grid}>
        {benefits.map((b, i) => (
          <BenefitCard key={b.number} {...b} delay={i * 0.12} />
        ))}
      </ul>
    </section>
  )
}

function BenefitCard({ number, title, body, delay }) {
  const [ref, visible] = useScrollReveal()
  return (
    <li
      ref={ref}
      className={`${styles.card} ${visible ? styles.cardVisible : ''}`}
      style={{ '--delay': `${delay}s` }}
    >
      <span className={styles.cardNumber}>{number}</span>
      <h3 className={styles.cardTitle}>{title}</h3>
      <p className={styles.cardBody}>{body}</p>
    </li>
  )
}
