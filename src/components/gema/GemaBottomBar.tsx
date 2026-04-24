'use client'

import { useState } from 'react'
import { Send } from 'lucide-react'
import { GemaSheet } from './GemaSheet'

export function GemaBottomBar() {
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim()) return
    setIsOpen(true)
  }

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-zinc-900/95 backdrop-blur-sm border-t border-zinc-800">
        <form onSubmit={handleSubmit} className="flex items-center gap-3 px-4 py-3 max-w-7xl mx-auto">
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="💎 Escribe tu transacción..."
              className="w-full px-4 py-2.5 bg-zinc-800/50 border border-zinc-700 rounded-lg text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={!inputValue.trim()}
            className="p-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white rounded-lg transition-all active:scale-95"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>

      <GemaSheet isOpen={isOpen} onClose={() => setIsOpen(false)} initialMessage={inputValue} />
    </>
  )
}
