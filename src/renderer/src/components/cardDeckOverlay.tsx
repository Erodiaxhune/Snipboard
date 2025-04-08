import Card from './Card'
import React, { useMemo } from 'react'
import { useSnipStore } from '@renderer/store'
import DeckGL, { OrthographicView } from 'deck.gl'

const CardDeckOverlay: React.FC = () => {
  const { snips } = useSnipStore()

  // Compute positions for your cards. Adjust spacing and alignment as needed.
  const cardsWithPosition = useMemo(() => {
    return snips.map((snip, index) => ({
      ...snip,
      // Example: evenly space cards horizontally. Adjust these values to your layout.
      x: index * 400, // 300px gap (or your card width plus margin)
      y: 0
    }))
  }, [snips])

  return (
    <DeckGL
      // initialViewState={viewState}
      controller={true}
      height={window.innerHeight}
      views={new OrthographicView()}
      viewState={{
        target: [0, 0],
        zoom: 1,
        minZoom: 0.5,
        maxZoom: 2
      }}
      style={{ width: '100%', height: '100%' }}
      layers={[]}
    >
      {/*
        This overlay container is positioned over the deck.gl canvas.
        Each card is absolutely positioned based on the computed x/y values.
      */}
      <div
        style={{
          top: 0,
          left: 0,
          height: '100%',
          position: 'relative',
          width: cardsWithPosition.length * 400
        }}
      >
        {cardsWithPosition.map((snip) => (
          <div
            key={snip.id}
            style={{
              position: 'absolute',
              left: snip.x,
              top: snip.y,
              width: 384,
              margin: '0 10px'
            }}
          >
            <Card {...snip} />
          </div>
        ))}
      </div>
    </DeckGL>
  )
}

export default CardDeckOverlay
