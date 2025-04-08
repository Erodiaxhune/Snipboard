import { useSnipStore } from './store'
import Header from './components/header'
import React, { useRef, useEffect, Fragment } from 'react'
import CardDeckOverlay from './components/cardDeckOverlay'

const App: React.FC = (): JSX.Element => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const { getSnips, currentTab } = useSnipStore()

  useEffect(() => {
    getSnips(currentTab)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTab])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    // Scroll handler for horizontal scrolling using the mouse wheel.
    const handleWheelScroll = (ev: WheelEvent): void => {
      ev.preventDefault()
      el.scrollLeft += ev.deltaY * 2
    }

    // Reseting the horizontal scroll position.
    const handleResetScroll = (): void => {
      if (scrollRef.current) {
        scrollRef.current.scrollLeft = 0
      }
    }

    // Callback for the snip-action event.
    const handleSnipAction = (): void => {
      getSnips(currentTab)
    }

    // Registering ipcRenderer event listeners.
    window.electron.ipcRenderer.on('snip-action', handleSnipAction)
    window.electron.ipcRenderer.on('reset-scroll', handleResetScroll)
    el.addEventListener('wheel', handleWheelScroll, { passive: false })

    return (): void => {
      el.removeEventListener('wheel', handleWheelScroll)
      window.electron.ipcRenderer.removeAllListeners('snip-action')
      window.electron.ipcRenderer.removeAllListeners('reset-scroll')
    }
  }, [getSnips, currentTab])

  return (
    <Fragment>
      <div
        id="main"
        className="w-[99%] h-full gap-y-2 p-2 rounded-lg overflow-hidden flex flex-col items-center justify-between bg-transparent"
      >
        <Header />

        <div
          id="snips"
          ref={scrollRef}
          className="isolate max-w-screen overflow-y-hidden overflow-x-auto flex flex-1 flex-grow flex-nowrap items-start justify-start p-2 px-4 gap-x-6 min-w-screen relative"
        >
          <CardDeckOverlay />
          {/* {data && data.length > 0 ? (
            data.map((snip) => <Card key={snip.id} {...snip} />)
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No content available.
            </div>
          )} */}
        </div>
      </div>
    </Fragment>
  )
}

export default App
