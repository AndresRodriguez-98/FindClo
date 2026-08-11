import { useState, useCallback } from 'react'
import PageIntro from './components/PageIntro/PageIntro'
import Navbar from './components/Navbar/Navbar'
import ScrollSequence from './components/ScrollSequence/ScrollSequence'
import HeroOverlay from './components/HeroOverlay/HeroOverlay'
import StatementSection from './components/StatementSection/StatementSection'
import ProductsMarquee from './components/ProductsMarquee/ProductsMarquee'
import MissionVision from './components/MissionVision/MissionVision'
import CarouselSection from './components/CarouselSection/CarouselSection'
import Footer from './components/Footer/Footer'
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
          <ScrollSequence>
            <HeroOverlay ready={introComplete} />
          </ScrollSequence>

          <StatementSection />
          <ProductsMarquee />
          <MissionVision />
          <CarouselSection />
        </main>

        <Footer />
      </div>
    </>
  )
}
