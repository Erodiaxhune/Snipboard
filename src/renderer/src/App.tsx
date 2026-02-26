import { useMemo, useRef, useLayoutEffect, useState } from 'react'
import { useSnipStore } from '@renderer/store'
import Card from './components/Card'
import { useEffect } from 'react'


const CARD_W = 400
const GAP = 16
const ITEM_STRIDE = CARD_W + GAP
const OVERSCAN = 3

export default function CardStripVirtualized(): JSX.Element {
  const { snips, getSnips } = useSnipStore()
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [scrollLeft, setScrollLeft] = useState(0)
  const [viewportW, setViewportW] = useState(1200)

  useEffect(() => {
    getSnips()
  }, [getSnips])

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
    const start = Math.max(0, Math.floor(scrollLeft / ITEM_STRIDE) - OVERSCAN)
    const visibleCount = Math.ceil(viewportW / ITEM_STRIDE) + OVERSCAN * 2
    const end = Math.min(snips.length, start + visibleCount)
    return { start, end, offsetX: start * ITEM_STRIDE }
  }, [scrollLeft, viewportW, snips.length])

  const slice = snips.slice(start, end)

  if (snips.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-500">
        No snips to display
      </div>
    )
  }


  return (
    <div ref={scrollerRef} className="w-full h-full overflow-x-auto overflow-y-hidden">
      <div style={{ width: snips.length * ITEM_STRIDE - GAP, height: '100%', position: 'relative' }}>
        <div style={{ transform: `translateX(${offsetX}px)`, display: 'flex', gap: GAP, height: '100%' }}>
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