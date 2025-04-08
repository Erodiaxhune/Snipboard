/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { debounce } from 'lodash'
import { useSnipStore } from '@renderer/store'
import { Settings, Search, X, History } from 'lucide-react'
import React, { ChangeEvent, useEffect, useState } from 'react'

const Header: React.FC = (): JSX.Element => {
  const [searchQuery, setSearchQuery] = useState('')
  const { currentTab, setCurrentTab, searchSnips } = useSnipStore()

  useEffect(() => {
    const debouncedSearch = debounce((query: string) => {
      searchSnips(query)
    }, 300)

    debouncedSearch(searchQuery)

    return () => {
      debouncedSearch.cancel()
    }
  }, [searchQuery, searchSnips])

  const handleTabSwitch = async (tab: 'history' | 'pinned') => {
    setCurrentTab(tab)
    setSearchQuery('')
  }

  // Reset search input
  const clearSearch = () => {
    setSearchQuery('')
    searchSnips('')
  }

  return (
    <div className="w-full px-4 py-2 bg-transparent">
      <div className="flex items-center justify-between">
        {/* TODO: Add logo */}
        <div />

        {/* Search and Tabs */}
        <div className="flex items-center gap-6">
          {/* Search Box */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search by title..."
              value={searchQuery}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              className="pl-9 pr-8 py-1.5 rounded-xl border-2 border-gray-400 bg-transparent text-white focus:outline-none focus:border-indigo-400 placeholder:text-gray-300 transition-colors w-64"
            />
            <Search className="absolute top-1/2 left-2 h-5 w-5 -translate-y-1/2 text-gray-300" />
            {searchQuery.trim().length > 0 && (
              <X
                onClick={clearSearch}
                className="absolute top-1/2 right-2 h-5 w-5 -translate-y-1/2 text-gray-300 hover:text-white cursor-pointer"
              />
            )}
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-6 text-gray-200">
            {/* History Tab */}
            <button
              onClick={() => handleTabSwitch('history')}
              className={`flex items-center gap-1 cursor-pointer ${
                currentTab === 'history'
                  ? 'underline decoration-2 decoration-purple-600'
                  : 'hover:text-white'
              }`}
            >
              <History size={18} />
              <span>Clipboard History</span>
            </button>

            {/* Pinned Tab */}
            <button
              onClick={() => handleTabSwitch('pinned')}
              className={`flex items-center gap-1 cursor-pointer ${
                currentTab === 'pinned'
                  ? 'underline decoration-2 decoration-purple-600'
                  : 'hover:text-white'
              }`}
            >
              <span>Pinned Snips</span>
            </button>
          </div>
        </div>

        <div>
          <Settings size={24} className="text-gray-300 hover:text-white cursor-pointer" />
        </div>
      </div>
    </div>
  )
}

export default Header
