/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { create } from 'zustand'
import { Snip } from '@renderer/types'

interface SnipStore {
  snips: Snip[]
  masterSnips: Snip[]
  clear: () => Promise<void>
  currentTab: 'history' | 'pinned'
  setCurrentTab: (tab: 'history' | 'pinned') => void

  getSnips: (type?: 'history' | 'pinned') => Promise<void>
  searchSnips: (query: string) => void
}

export const useSnipStore = create<SnipStore>((set, get) => ({
  masterSnips: [],
  snips: [],
  currentTab: 'history',

  setCurrentTab: (tab) => set({ currentTab: tab }),

  clear: async () => {
    return window.electron.ipcRenderer.invoke('snipboard-clear')
  },

  /** fetching from DB for fresh data. */
  getSnips: async (type = 'history') => {
    const ipcChannel = type === 'pinned' ? 'snipboard-get-pinned' : 'snipboard-get-all'

    const start = Date.now()
    const newSnips = await window.electron.ipcRenderer.invoke(ipcChannel)
    console.log('ipcChannel', ipcChannel)
    console.log('newSnips', newSnips)
    const end = Date.now()

    console.log(`Start: ${start} --> end: ${end}`)

    set({ snips: newSnips, masterSnips: newSnips })
  },

  /** Filter snips in the store based on title matching. */
  searchSnips: (query: string) => {
    const { masterSnips } = get()
    if (!query.trim()) set({ snips: masterSnips })

    // WebGL-optimized filtering
    const regex = new RegExp(query, 'i')
    const filtered = masterSnips.filter((snip) => regex.test(snip.title))

    requestAnimationFrame(() => set({ snips: filtered }))
  }
}))
