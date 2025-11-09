"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SearchBarProps {
  onSearch: (username: string) => void
  isLoading?: boolean
}

export function SearchBar({ onSearch, isLoading }: SearchBarProps) {
  const [input, setInput] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSearch = () => {
    if (input.trim()) {
      onSearch(input.trim())
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <div className="w-full">
      <div className="flex gap-2 flex-col sm:flex-row">
        <div className="relative flex-1">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <Search className="w-5 h-5 text-primary" />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter GitHub username..."
            className="w-full pl-12 pr-4 py-3 rounded-lg border border-border bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-background transition-all duration-300"
            disabled={isLoading}
          />
          {isLoading && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <div className="animate-spin w-5 h-5 border-2 border-primary border-t-transparent rounded-full" />
            </div>
          )}
        </div>
        <Button
          onClick={handleSearch}
          disabled={isLoading || !input.trim()}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-3 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed sm:w-auto w-full"
        >
          {isLoading ? "Searching..." : "Search"}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground mt-2">Press Enter or click Search to find a GitHub user</p>
    </div>
  )
}
