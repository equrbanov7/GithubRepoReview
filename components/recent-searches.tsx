"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { Star, Clock, Trash2, ChevronDown } from "lucide-react"

interface SearchHistory {
  username: string
  isFavorite: boolean
  timestamp: number
}

interface RecentSearchesProps {
  onSelectUser: (username: string) => void
  currentUser?: string
}

const STORAGE_KEY = "github_searches"

const sortByTimestamp = (items: SearchHistory[]) =>
  [...items].sort((a, b) => b.timestamp - a.timestamp)

export function RecentSearches({ onSelectUser, currentUser }: RecentSearchesProps) {
  const [searches, setSearches] = useState<SearchHistory[]>([])
  const [isExpanded, setIsExpanded] = useState(false)
  const hasHydratedRef = useRef(false)

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    try {
      const stored = window.localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as SearchHistory[]
        setSearches(sortByTimestamp(parsed))
      }
    } catch (error) {
      console.error("Error parsing stored searches:", error)
    } finally {
      hasHydratedRef.current = true
    }
  }, [])

  useEffect(() => {
    if (!hasHydratedRef.current || typeof window === "undefined") {
      return
    }

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(searches))
    } catch (error) {
      console.error("Error saving searches to storage:", error)
    }
  }, [searches])

  const addSearch = useCallback((username: string) => {
    const trimmed = username.trim()
    if (!trimmed) {
      return
    }

    setSearches((prev) => {
      const normalized = trimmed.toLowerCase()
      const existing = prev.find((s) => s.username.toLowerCase() === normalized)
      const timestamp = Date.now()

      let updated: SearchHistory[]

      if (existing) {
        updated = prev.map((s) =>
          s.username.toLowerCase() === normalized ? { ...s, timestamp } : s,
        )
      } else {
        updated = [...prev, { username: trimmed, isFavorite: false, timestamp }]
      }

      return sortByTimestamp(updated).slice(0, 10)
    })
  }, [])

  const toggleFavorite = useCallback((username: string) => {
    setSearches((prev) =>
      prev.map((s) =>
        s.username === username ? { ...s, isFavorite: !s.isFavorite } : s,
      ),
    )
  }, [])

  const deleteSearch = useCallback((username: string) => {
    setSearches((prev) => prev.filter((s) => s.username !== username))
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    ;(window as any).__addGitHubSearch = addSearch

    return () => {
      if ((window as any).__addGitHubSearch === addSearch) {
        delete (window as any).__addGitHubSearch
      }
    }
  }, [addSearch])

  const favorites = useMemo(
    () => sortByTimestamp(searches.filter((s) => s.isFavorite)),
    [searches],
  )
  const recent = useMemo(
    () => sortByTimestamp(searches.filter((s) => !s.isFavorite)),
    [searches],
  )

  return (
    <div className="space-y-4">
      {/* Favorites Section */}
      {favorites.length > 0 && (
        <div className="animate-fade-in-up">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
            <Star className="w-4 h-4 text-primary" />
            Favorite Users ({favorites.length})
          </h3>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3">
            {favorites.map((search) => (
              <button
                key={search.username}
                onClick={() => onSelectUser(search.username)}
                className={`group p-3 rounded-lg border transition-all duration-300 text-left hover:border-primary/50 hover:bg-primary/5 ${
                  currentUser?.toLowerCase() === search.username.toLowerCase()
                    ? "border-primary/50 bg-primary/5 ring-2 ring-primary/20"
                    : "border-primary/20"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">@{search.username}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleFavorite(search.username)
                    }}
                    className="opacity-100 transition-opacity"
                    title="Remove from favorites"
                  >
                    <Star className="w-4 h-4 fill-primary text-primary" />
                  </button>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Recent Searches Section */}
      {recent.length > 0 && (
        <div className="animate-fade-in-up">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wide hover:text-foreground transition-colors w-full"
          >
            <Clock className="w-4 h-4 text-secondary" />
            <span>Recent Searches ({recent.length})</span>
            <ChevronDown
              className={`w-4 h-4 ml-auto transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
            />
          </button>

          {isExpanded && (
            <div className="space-y-2 animate-slide-in-down">
              {recent.map((search) => (
                <div
                  key={search.username}
                  className={`group p-3 rounded-lg border bg-card hover:bg-primary/5 hover:border-primary/50 transition-all duration-300 flex items-center justify-between ${
                    currentUser?.toLowerCase() === search.username.toLowerCase()
                      ? "border-primary/50 bg-primary/5 ring-2 ring-primary/20"
                      : "border-primary/20"
                  }`}
                >
                  <button
                    onClick={() => onSelectUser(search.username)}
                    className="flex-1 text-left hover:text-primary transition-colors"
                  >
                    <span className="font-medium text-foreground">@{search.username}</span>
                  </button>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => toggleFavorite(search.username)}
                      className="p-1 hover:bg-primary/20 rounded transition-colors"
                      title="Add to favorites"
                    >
                      <Star className="w-4 h-4 text-primary" />
                    </button>
                    <button
                      onClick={() => deleteSearch(search.username)}
                      className="p-1 hover:bg-destructive/20 rounded transition-colors"
                      title="Remove search"
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {searches.length === 0 && (
        <div className="p-6 sm:p-8 text-center border border-dashed border-primary/20 rounded-lg bg-primary/2">
          <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
          <p className="text-muted-foreground text-sm">No searches yet. Search for a GitHub user to get started!</p>
        </div>
      )}
    </div>
  )
}
