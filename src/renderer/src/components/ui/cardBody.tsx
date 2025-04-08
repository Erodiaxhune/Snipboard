// import { useState } from 'react'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { useCardContext } from '@renderer/context/CardContext'
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs'

const CardBody = (): JSX.Element => {
  const { type, content } = useCardContext()
  // const [isCopied, setIsCopied] = useState(false)

  const renderContent = (): JSX.Element => {
    switch (type) {
      case 'image':
        return (
          <div className="w-full h-full flex items-center justify-center bg-[#363636]">
            <img
              src={content}
              alt="Saved image"
              className="object-contain object-top bg-[#363636]"
            />
          </div>
        )

      case 'url':
        return (
          <div className="w-full h-full flex flex-col bg-transparent p-4">
            <a href={content} target="_blank" rel="noopener noreferrer">
              {content}
            </a>
          </div>
        )

      case 'color':
        return (
          <div
            style={{ backgroundColor: content }}
            className="w-full h-full flex items-center justify-center"
          >
            <p className="text-white font-bold text-2xl text-center">{content}</p>
          </div>
        )

      case 'code': {
        // Detect language
        const detectLanguage = (): string => {
          if (content.includes('function') || content.includes('var') || content.includes('const'))
            return 'javascript'
          if (content.includes('def ') || content.includes('import ')) return 'python'
          if (content.includes('<div') || content.includes('<html')) return 'html'
          if (content.includes('class ') && content.includes('{')) return 'java'
          if (content.includes('func ') || content.includes(':=')) return 'go'
          if (content.includes('package ') && content.includes('import (')) return 'go'
          if (content.includes('useState') || content.includes('useEffect')) return 'javascript'
          return 'text'
        }

        return (
          <div className="w-full h-full bg-transparent">
            <SyntaxHighlighter
              language={detectLanguage()}
              style={atomOneDark}
              customStyle={{
                margin: 0,
                padding: '1rem',
                height: '100%',
                width: '100%',
                fontSize: '0.85rem',
                backgroundColor: '#363636',
                overflow: 'auto'
              }}
              wrapLongLines={true}
            >
              {content}
            </SyntaxHighlighter>
          </div>
        )
      }

      case 'text':
      default:
        return (
          <div className="w-full h-full p-4 overflow-hidden bg-[#363636]">
            <span className="text-white whitespace-pre-wrap text-center">{content}</span>
          </div>
        )
    }
  }

  return (
    <div
      className="flex-1 overflow-hidden cursor-pointer relative bg-[#353535]"
      onClick={() => {
        navigator.clipboard.writeText(content)
        setTimeout(() => {
          window.electron.ipcRenderer.invoke('hide-window')
        }, 300)
      }}
    >
      {renderContent()}
    </div>
  )
}

export default CardBody
