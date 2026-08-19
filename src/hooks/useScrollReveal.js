import { useEffect, useRef, useState } from 'react'

/**
 * useScrollReveal — IntersectionObserver hook.
 *
 * Returns [ref, isVisible].
 * Attach `ref` to the DOM element you want to observe.
 * Once it crosses the threshold, `isVisible` flips to true and
 * stays true (one-shot: observer auto-disconnects on first trigger).
 *
 * Architecture notes:
 * - Splits `threshold` and `rootMargin` into explicit params so
 *   callers aren't forced to remember the options shape.
 * - Defensive `el` check prevents double-observer on StrictMode
 *   double-mount.
 * - `options` object is NOT in the dep array — it would cause
 *   an infinite re-subscription loop if the caller creates a
 *   new object literal on every render. Pass stable values only.
 *
 * @param {object} [options]
 * @param {number} [options.threshold=0.12]   0–1 visibility ratio to trigger
 * @param {string} [options.rootMargin='0px 0px -60px 0px']  viewport inset
 */
export function useScrollReveal({
  threshold  = 0.12,
  rootMargin = '0px 0px -60px 0px',
} = {}) {
  const ref       = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold, rootMargin },
    )

    observer.observe(el)
    return () => observer.disconnect()
  // threshold and rootMargin are primitives → safe in dep array
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [threshold, rootMargin])

  return [ref, visible]
}
