import styles from './ProductsMarquee.module.css'

// Brands: logo via Simple Icons CDN where available, otherwise SVG text mark
const brands = [
  {
    name: 'Nike',
    logo: 'https://cdn.simpleicons.org/nike/6b7280',
    type: 'img',
  },
  {
    name: 'Adidas',
    logo: 'https://cdn.simpleicons.org/adidas/6b7280',
    type: 'img',
  },
  {
    name: 'King Of The Kongo',
    type: 'text',
  },
  {
    name: 'Puma',
    logo: 'https://cdn.simpleicons.org/puma/6b7280',
    type: 'img',
  },
  {
    name: 'Ona Saez',
    type: 'text',
  },
  {
    name: 'New Balance',
    logo: 'https://cdn.simpleicons.org/newbalance/6b7280',
    type: 'img',
  },
  {
    name: '47 Street',
    type: 'text',
  },
  {
    name: 'Lacoste',
    logo: 'https://cdn.simpleicons.org/lacoste/6b7280',
    type: 'img',
  },
  {
    name: 'Rapsodia',
    type: 'text',
  },
  {
    name: 'Converse',
    logo: 'https://cdn.simpleicons.org/converse/6b7280',
    type: 'img',
  },
]

function BrandItem({ name, logo, type }) {
  if (type === 'img') {
    return (
      <span className={styles.item}>
        <img
          src={logo}
          alt={name}
          className={styles.brandLogo}
          loading="lazy"
          onError={e => {
            // Fallback to text if CDN fails
            e.currentTarget.style.display = 'none'
            e.currentTarget.nextSibling?.style && (e.currentTarget.nextSibling.style.display = 'inline')
          }}
        />
        <span className={styles.brandText} style={{ display: 'none' }}>{name}</span>
      </span>
    )
  }
  return (
    <span className={styles.item}>
      <span className={styles.brandText}>{name}</span>
    </span>
  )
}

export default function ProductsMarquee() {
  const doubled = [...brands, ...brands]
  return (
    <div className={styles.marqueeWrapper}>
      <div className={styles.track}>
        {doubled.map((brand, i) => (
          <BrandItem key={`${brand.name}-${i}`} {...brand} />
        ))}
      </div>
    </div>
  )
}
