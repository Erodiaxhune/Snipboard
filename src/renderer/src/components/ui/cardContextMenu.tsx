import React from 'react'
import { useCardContext } from '../../context/CardContext'
import { ContextMenuItem, ContextMenu } from 'rctx-contextmenu'

const CardContextMenu: React.FC = (): JSX.Element => {
  const { copyToClipboard, id, togglePin, editSnip, deleteSnip, pinned } = useCardContext()

  const menuItems = [
    { label: 'Copy to clipboard', onclick: copyToClipboard },
    { label: pinned ? 'Unpin Snip' : 'Pin Snip', onclick: togglePin },
    { label: 'Edit content', onclick: editSnip },
    { label: 'Delete Snip', onclick: deleteSnip }
  ]

  return (
    <ContextMenu id={id} className="!bg-[#191919]">
      {menuItems.map((item, index) => (
        <ContextMenuItem key={index} onClick={item.onclick}>
          <span>{item.label}</span>
        </ContextMenuItem>
      ))}
    </ContextMenu>
  )
}

export default CardContextMenu
