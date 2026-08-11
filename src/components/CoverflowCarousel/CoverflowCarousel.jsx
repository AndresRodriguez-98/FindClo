import * as React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import styles from './CoverflowCarousel.module.css'

const useIsoLayoutEffect =
  typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect

/**
 * CoverflowCarousel — ported from TypeScript/Tailwind to plain JS + CSS Modules.
 * All animation is done via direct DOM manipulation (no state on every frame)
 * for 60fps performance.
 *
 * Click UX:
 *  - Short tap / click (< DRAG_THRESHOLD px) on the *centered* card → shows overlay
 *  - Short tap on a *side* card → brings it to center (goTo), no overlay
 *  - Second click on the overlay → follows the href link
 *  - Drag/swipe (moved > DRAG_THRESHOLD) → scrolls, never opens overlay
 *  - Click anywhere outside the card overlay → closes overlay
 */

const DRAG_THRESHOLD = 6 // pixels — below this = tap, above = drag

export function CoverflowCarousel({
  slides,
  rotate = 44,
  depth = 0.6,
  perspective = 3,
  falloff = 0.56,
  fade = 0.1,
  cardWidth = 'clamp(148px, 22vw, 260px)',
  gap = 0.05,
  loop = true,
  showCaption = false,
  showPagination = false,
  showNavigation = false,
  label = 'Cover carousel',
  className,
  cardClassName,
}) {
  const count = slides.length

  const frameRef = React.useRef(null)
  const cardRefs = React.useRef([])
  const posRef    = React.useRef(0)
  const targetRef = React.useRef(0)
  const widthRef  = React.useRef(0)
  const rafRef    = React.useRef(null)
  const dragRef   = React.useRef(null)

  const [selected, setSelected] = React.useState(0)
  // Which card index has the overlay open (-1 = none)
  const [overlayIndex, setOverlayIndex] = React.useState(-1)

  const indexAt = React.useCallback(
    (pos) => ((Math.round(pos) % count) + count) % count,
    [count],
  )

  const paint = React.useCallback(() => {
    const width = widthRef.current
    if (!width) return
    const pitch = width * (1 + gap)
    const pos   = posRef.current

    cardRefs.current.forEach((card, index) => {
      if (!card) return

      let offset = index - pos
      if (loop) {
        offset = ((offset % count) + count) % count
        if (offset > count / 2) offset -= count
      }

      const distance = Math.abs(offset)
      const ramp     = Math.pow(distance, falloff)
      const tilt     = Math.min(rotate * ramp, 82) * Math.sign(offset)

      card.style.transform =
        `translateX(calc(-50% + ${offset * pitch}px)) ` +
        `translateZ(${-depth * width * ramp}px) rotateY(${-tilt}deg)`

      const edge      = loop ? Math.min(1, Math.max(0, count / 2 - distance)) : 1
      card.style.opacity  = String(Math.max(0, 1 - fade * distance) * edge)
      card.style.zIndex   = String(100 - Math.round(distance))
    })
  }, [count, depth, fade, falloff, gap, loop, rotate])

  const settle = React.useCallback(
    (target) => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
      targetRef.current = target
      setSelected(indexAt(target))

      const step = () => {
        const remaining = target - posRef.current
        if (Math.abs(remaining) < 0.0004) {
          posRef.current = target
          paint()
          rafRef.current = null
          return
        }
        posRef.current += remaining * 0.16
        paint()
        rafRef.current = requestAnimationFrame(step)
      }
      rafRef.current = requestAnimationFrame(step)
    },
    [indexAt, paint],
  )

  const clamp = React.useCallback(
    (pos) => (loop ? pos : Math.max(0, Math.min(count - 1, pos))),
    [count, loop],
  )

  const goTo = React.useCallback(
    (index) => {
      const target = loop
        ? index + Math.round((targetRef.current - index) / count) * count
        : index
      settle(clamp(target))
    },
    [clamp, count, loop, settle],
  )

  const nudge = React.useCallback(
    (by) => settle(clamp(Math.round(targetRef.current) + by)),
    [clamp, settle],
  )

  // ── Pointer handlers ────────────────────────────────────────────────────────
  const wasDragRef = React.useRef(false)

  const onPointerDown = (event) => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
    event.target.setPointerCapture(event.pointerId)
    targetRef.current = posRef.current
    wasDragRef.current = false
    dragRef.current = {
      id:      event.pointerId,
      x:       event.clientX,
      startX:  event.clientX,
      pos:     posRef.current,
      v:       0,
      t:       performance.now(),
    }
  }

  const onPointerMove = (event) => {
    const drag = dragRef.current
    if (!drag || drag.id !== event.pointerId) return
    const pitch = widthRef.current * (1 + gap)
    if (!pitch) return

    const dx = Math.abs(event.clientX - drag.startX)
    if (dx > DRAG_THRESHOLD) wasDragRef.current = true

    const now      = performance.now()
    const previous = posRef.current
    posRef.current = clamp(drag.pos - (event.clientX - drag.x) / pitch)
    drag.v = ((posRef.current - previous) / Math.max(now - drag.t, 1)) * 1000
    drag.t = now

    const index = indexAt(posRef.current)
    if (index !== selected) setSelected(index)
    paint()
  }

  const endDrag = (event) => {
    const drag = dragRef.current
    if (!drag || drag.id !== event.pointerId) return

    dragRef.current = null
    
    if (event.target.hasPointerCapture(event.pointerId)) {
      event.target.releasePointerCapture(event.pointerId)
    }

    if (wasDragRef.current) {
      // Pure drag — settle and close any overlay
      const carried = Math.max(-2, Math.min(2, drag.v * 0.18))
      settle(clamp(Math.round(posRef.current + carried)))
      setOverlayIndex(-1)
    }
    // If not a drag, the onClick on the card will fire naturally
  }

  // ── Card click handler ──────────────────────────────────────────────────────
  const handleCardClick = (event, cardIndex) => {
    // If pointerMove already flagged this as a drag, ignore
    const realIndex = ((cardIndex % count) + count) % count

    if (overlayIndex === realIndex) {
      // Since the <a className={styles.overlayLink}> has e.stopPropagation(),
      // if this handler fires when the overlay is open, it means the user 
      // clicked the dimmed background. We should close the overlay.
      setOverlayIndex(-1)
      return
    }

    if (realIndex !== selected) {
      // Clicking a side card — navigate to it, don't open overlay
      goTo(cardIndex)
      setOverlayIndex(-1)
      return
    }

    // Click on the centered card → toggle overlay
    setOverlayIndex((prev) => (prev === realIndex ? -1 : realIndex))
  }

  // Close overlay when clicking outside any card
  React.useEffect(() => {
    if (overlayIndex === -1) return
    const close = (e) => {
      if (!e.target.closest(`.${styles.card}`) &&
          !e.target.closest(`.${styles.overlayLink}`)) {
        setOverlayIndex(-1)
      }
    }
    document.addEventListener('pointerdown', close)
    return () => document.removeEventListener('pointerdown', close)
  }, [overlayIndex])

  useIsoLayoutEffect(() => {
    const frame = frameRef.current
    if (!frame) return

    const measure = () => {
      const card = cardRefs.current[0]
      if (!card) return
      widthRef.current = card.offsetWidth
      paint()
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(frame)
    return () => observer.disconnect()
  }, [paint])

  React.useEffect(
    () => () => { if (rafRef.current !== null) cancelAnimationFrame(rafRef.current) },
    [],
  )

  const active = slides[selected]

  return (
    <div
      className={[styles.root, className].filter(Boolean).join(' ')}
      style={{ '--cf-card': cardWidth }}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
    >
      <div className={styles.wrapper}>
        {/* ── Viewport ─────────────────────────────────── */}
        <div
          ref={frameRef}
          tabIndex={0}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft')  { e.preventDefault(); nudge(-1) }
            if (e.key === 'ArrowRight') { e.preventDefault(); nudge(1)  }
          }}
          className={styles.frame}
          style={{ perspective: `calc(var(--cf-card) * ${perspective})` }}
        >
          <div className={styles.track}>
            {slides.map((slide, index) => {
              const realIndex = ((index % count) + count) % count
              const isOpen = overlayIndex === realIndex

              return (
                <div
                  key={index}
                  ref={(node) => { cardRefs.current[index] = node }}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${index + 1} of ${count}`}
                  className={[
                    styles.card,
                    cardClassName,
                    isOpen ? styles.cardOverlayOpen : '',
                  ].filter(Boolean).join(' ')}
                  onClick={(e) => {
                    // Only fire if this wasn't a drag
                    if (wasDragRef.current) return
                    handleCardClick(e, index)
                  }}
                >
                  <img
                    src={slide.src}
                    alt={slide.alt}
                    draggable={false}
                    className={[
                      styles.cardImg,
                      isOpen ? styles.cardImgDimmed : '',
                    ].filter(Boolean).join(' ')}
                  />

                  {/* ── Overlay ──────────────────────────── */}
                  <div
                    className={[
                      styles.overlay,
                      isOpen ? styles.overlayVisible : '',
                    ].filter(Boolean).join(' ')}
                    aria-hidden={!isOpen}
                  >
                    {slide.href ? (
                      <a
                        href={slide.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.overlayLink}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span className={styles.overlayIcon}>↗</span>
                        Ver en el sitio
                      </a>
                    ) : (
                      <span className={styles.overlayLinkDisabled}>
                        Próximamente
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Navigation arrows ────────────────────────── */}
        {showNavigation && (
          <>
            <button
              type="button"
              aria-label="Slide anterior"
              onClick={() => { nudge(-1); setOverlayIndex(-1) }}
              className={`${styles.navBtn} ${styles.navBtnLeft}`}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              aria-label="Slide siguiente"
              onClick={() => { nudge(1); setOverlayIndex(-1) }}
              className={`${styles.navBtn} ${styles.navBtnRight}`}
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      {/* ── Caption ──────────────────────────────────── */}
      {showCaption && active?.title && (
        <div key={selected} className={styles.caption}>
          <p className={styles.captionTitle}>{active.title}</p>
          {active.subtitle && (
            <p className={styles.captionSub}>{active.subtitle}</p>
          )}
        </div>
      )}

      {/* ── Pagination dots ──────────────────────────── */}
      {showPagination && (
        <div className={styles.pagination}>
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Ir al slide ${index + 1}`}
              aria-current={index === selected}
              onClick={() => { goTo(index); setOverlayIndex(-1) }}
              className={`${styles.dot} ${index === selected ? styles.dotActive : ''}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
