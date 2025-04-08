import { Snip } from '@renderer/types'
import { createContext, useContext, useMemo } from 'react'

interface CardContextProps extends Snip {
  editSnip: () => void
  togglePin: () => void
  deleteSnip: () => void
  copyToClipboard: () => void
}

const CardContext = createContext<CardContextProps | undefined>(undefined)

const CardProvider = ({
  children,
  snip
}: {
  children: React.ReactNode
  snip: Snip
}): JSX.Element => {
  const togglePin = async (): Promise<void> => {
    const res = await window.electron.ipcRenderer.invoke('snipboard-pin', snip.id, !snip.pinned)
    console.log('Response: ', res)
  }

  const editSnip = (): void => {
    // TODO: Edit snip
  }

  const deleteSnip = (): void => {
    // TODO: Delete snip
  }

  const copyToClipboard = (): void => {
    // TODO: Copy to clipboard
  }

  // Memoize the snip to prevent unnecessary re-renders
  const memoizedSnip = useMemo(() => snip, [snip])

  return (
    <CardContext.Provider
      value={{ ...memoizedSnip, togglePin, editSnip, deleteSnip, copyToClipboard }}
    >
      {children}
    </CardContext.Provider>
  )
}

const useCardContext = (): CardContextProps => {
  const context = useContext(CardContext)
  if (!context) {
    throw new Error('useCardContext must be used within a CardProvider')
  }
  return context
}

// eslint-disable-next-line react-refresh/only-export-components
export { CardContext, CardProvider, useCardContext }
