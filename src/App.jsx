import { useState, useCallback } from 'react'
import PageIntro from './components/PageIntro/PageIntro'
import Navbar from './components/Navbar/Navbar'
import ScrollSequence from './components/ScrollSequence/ScrollSequence'
import HeroOverlay from './components/HeroOverlay/HeroOverlay'
import StatementSection from './components/StatementSection/StatementSection'
import ForBrands from './components/ForBrands/ForBrands'
import CarouselSection from './components/CarouselSection/CarouselSection'
import ProductsMarquee from './components/ProductsMarquee/ProductsMarquee'
import FinalCtaSection from './components/FinalCtaSection/FinalCtaSection'
import styles from './App.module.css'

export default function App() {
  const [introComplete, setIntroComplete] = useState(false)

  const handleIntroComplete = useCallback(() => {
    setIntroComplete(true)
  }, [])

  return (
    <>
      {/* Curtain intro — unmounts visually after slide-up */}
      <PageIntro onComplete={handleIntroComplete} />

      {/* Main content fades in once curtain is gone */}
      <div className={`${styles.pageContent} ${introComplete ? styles.visible : ''}`}>
        <Navbar />

        <main>
          {/* 1. Hero & Canvas Sequence */}
          <ScrollSequence>
            <HeroOverlay ready={introComplete} />
          </ScrollSequence>

          {/* 2. Para Vos */}
          <StatementSection />

          {/* 3. Para Marcas */}
          <ForBrands />

          {/* 4. Explorá (Categorías) */}
          <CarouselSection />

          {/* 5. Marcas en Findclo */}
          <ProductsMarquee />

          {/* 6. Footer & CTA de Cierre con Celular Horizontal */}
          <FinalCtaSection />
        </main>
      </div>
    </>
  )
}
