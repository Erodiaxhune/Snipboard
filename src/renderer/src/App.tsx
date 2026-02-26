import { useMemo, useRef, useLayoutEffect, useState } from 'react'
import { useSnipStore } from '@renderer/store'
import Card from './components/Card'

const CARD_W = 400
const OVERSCAN = 3

export default function CardStripVirtualized() {
  const { snips } = useSnipStore()
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [scrollLeft, setScrollLeft] = useState(0)
  const [viewportW, setViewportW] = useState(1200)

  useLayoutEffect(() => {
    const el = scrollerRef.current
    if (!el) return

    const onScroll = () => setScrollLeft(el.scrollLeft)
    const ro = new ResizeObserver(() => setViewportW(el.clientWidth))

    el.addEventListener('scroll', onScroll, { passive: true })
    ro.observe(el)

    setViewportW(el.clientWidth)
    return () => {
      el.removeEventListener('scroll', onScroll)
      ro.disconnect()
    }
  }, [])

  const { start, end, offsetX } = useMemo(() => {
    const start = Math.max(0, Math.floor(scrollLeft / CARD_W) - OVERSCAN)
    const visibleCount = Math.ceil(viewportW / CARD_W) + OVERSCAN * 2
    const end = Math.min(snips.length, start + visibleCount)
    return { start, end, offsetX: start * CARD_W }
  }, [scrollLeft, viewportW, snips.length])

  const slice = snips.slice(start, end)

  return (
    <div ref={scrollerRef} className="w-full h-full overflow-x-auto overflow-y-hidden">
      <div style={{ width: snips.length * CARD_W, height: '100%', position: 'relative' }}>
        <div style={{ transform: `translateX(${offsetX}px)`, display: 'flex', gap: 16, height: '100%' }}>
          {slice.map((snip) => (
            <div key={snip.id} style={{ width: CARD_W }}>
              <Card {...snip} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}