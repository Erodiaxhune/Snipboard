import { Snip } from '@renderer/types'
import React, { useState } from 'react'
import CardContextMenu from './ui/cardContextMenu'
import { ContextMenuTrigger } from 'rctx-contextmenu'
import { CardProvider } from '@renderer/context/CardContext'
import { CardBody, CardHeader } from './ui/__card_exports__'

const Card: React.FC<Snip> = (snip): JSX.Element => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <CardProvider snip={snip}>
      <div
        id="card"
        className={`max-w-sm min-w-sm h-(--card-height) max-h-(--card-height) [--card-height:calc(27rem-(--spacing(2)))] rounded-md overflow-hidden shadow-lg transition-all duration-200 bg-transparent ${isHovered ? 'ring-5 ring-white/30' : ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        // onClick={() => console.log('Card clicked')}
      >
        <ContextMenuTrigger
          id={snip.id}
          className="h-full flex-1 flex flex-col overflow-hidden bg-transparent"
        >
          <div className="h-full flex-1 flex flex-col overflow-hidden bg-transparent">
            <CardHeader />
            <CardBody />
          </div>
        </ContextMenuTrigger>

        <CardContextMenu />

        {/* Context Menu */}
        {/* <ContextMenu
          hideOnLeave
          id={snip.id}
          appendTo="body"
          className="!bg-[#3e4245] !rounded-xl !min-w-52 text-white text-lg !px-1 shadow-md border border-gray-700"
        >
          <ContextMenuItem
            className="px-2 py-1 rounded-md hover:bg-[#4d5154] transition-colors"
            onClick={() => console.log('Copy to clipboard')}
          >
            Copy to clipboard
          </ContextMenuItem>
          <ContextMenuItem
            className="px-2 py-1 rounded-md hover:bg-[#4d5154] transition-colors"
            onClick={() => console.log('Pin Snip')}
          >
            Pin Snip
          </ContextMenuItem>
          <ContextMenuItem
            className="px-2 py-1 rounded-md hover:bg-[#4d5154] transition-colors"
            onClick={() => console.log('Edit content')}
          >
            Edit Content
          </ContextMenuItem>
          <ContextMenuItem
            className="px-2 py-1 rounded-md hover:bg-[#4d5154] transition-colors"
            onClick={() => console.log('Delete Snip')}
          >
            Delete
          </ContextMenuItem>
        </ContextMenu> */}
      </div>
    </CardProvider>
  )
}

export default Card
