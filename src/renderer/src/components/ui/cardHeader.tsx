import { useState } from 'react'
import { Pin, PinOff } from 'lucide-react'
import { useCardContext } from '@renderer/context/CardContext'

// assets
import UrlIcon from '@renderer/assets/link.png'
import TextIcon from '@renderer/assets/text.png'
import CodeIcon from '@renderer/assets/code.png'
import ColorIcon from '@renderer/assets/color.png'
import ImageIcon from '@renderer/assets/image.png'

const CardHeader = (): JSX.Element => {
  const { type, title, timeStamp, togglePin, pinned } = useCardContext()

  const [newTitle, setNewTitle] = useState(title || `Saved ${type}`)

  const getHeaderBg = (): string => {
    switch (type) {
      case 'url':
        return 'bg-red-700'
      case 'text':
        return 'bg-purple-700'
      case 'image':
        return 'bg-blue-700'
      case 'color':
        return 'bg-green-700'
      case 'code':
        return 'bg-gray-700'
      default:
        return 'bg-gray-700'
    }
  }

  const icons = {
    text: TextIcon,
    url: UrlIcon,
    image: ImageIcon,
    color: ColorIcon,
    code: CodeIcon
  }

  // Format timestamp (e.g., "31 minutes ago", "2 days ago")
  const formatTimeStamp = (): string => {
    if (!timeStamp) return 'a while ago'

    const now = new Date()
    const time = new Date(timeStamp)
    const diffInSeconds = Math.floor((now.getTime() - time.getTime()) / 1000)

    if (diffInSeconds < 60) {
      return 'less than a minute ago'
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60)
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600)
      return `${hours} hour${hours > 1 ? 's' : ''} ago`
    } else {
      const days = Math.floor(diffInSeconds / 86400)
      return `${days} day${days > 1 ? 's' : ''} ago`
    }
  }

  return (
    <div
      id="cardH"
      className={`${getHeaderBg()} w-full flex items-center justify-around px-4 py-3`}
    >
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 flex items-center justify-center">
          <img src={icons[type]} alt="Text" className="w-12 h-12 object-contain object-center" />
        </div>
        <div>
          <input
            value={newTitle}
            onDoubleClick={() => {
              // Editable only on double click
            }}
            onChange={(e) => setNewTitle(e.target.value)}
            onBlur={() => {
              // TODO: Update title in store
            }}
            className="text-lg font-semibold text-white border-none ring-none focus:ring-none focus:ring-offset-none focus:outline-none"
          />
          <p className="text-sm text-white/70">{formatTimeStamp()}</p>
        </div>
      </div>
      <button onClick={togglePin} className="text-white/70 hover:text-white cursor-pointer">
        {pinned ? <Pin size={18} /> : <PinOff size={18} />}
      </button>
    </div>
  )
}

export default CardHeader
