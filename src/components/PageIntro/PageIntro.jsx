import { useState, useEffect } from 'react'
import styles from './PageIntro.module.css'

export default function PageIntro({ onComplete }) {
  const [phase, setPhase] = useState('enter') // 'enter' | 'exit'

  useEffect(() => {
    // Hold logo, then trigger curtain lift
    const exitTimer = setTimeout(() => setPhase('exit'), 900)
    // Notify parent once curtain is fully gone
    const doneTimer  = setTimeout(() => onComplete?.(), 1700)

    return () => {
      clearTimeout(exitTimer)
      clearTimeout(doneTimer)
    }
  }, [onComplete])

  return (
    <div className={`${styles.curtain} ${phase === 'exit' ? styles.exit : ''}`} aria-hidden="true">
      <span className={styles.logo}>findclo</span>
    </div>
  )
}
