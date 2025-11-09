"use client"

import { useState, useCallback } from "react"
import { Github, AlertCircle } from "lucide-react"
import { SearchBar } from "@/components/search-bar"
import { UserDetails } from "@/components/user-details"
import { RepositoryList } from "@/components/repository-list"
import { RecentSearches } from "@/components/recent-searches"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface GitHubUser {
  login: string
  name: string
  avatar_url: string
  bio: string
  location: string
  blog: string
  followers: number
  following: number
  public_repos: number
}

interface Repository {
  id: number
  name: string
  description: string
  url: string
  html_url: string
  language: string
  topics: string[]
  stargazers_count: number
  forks_count: number
}

export default function Home() {
  const [user, setUser] = useState<GitHubUser | null>(null)
  const [repositories, setRepositories] = useState<Repository[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [currentUsername, setCurrentUsername] = useState("")

  const fetchUserData = useCallback(async (username: string) => {
    setIsLoading(true)
    setError("")
    setUser(null)
    setRepositories([])

    try {
      // Fetch user data
      const userResponse = await fetch(`/api/github/user?username=${username}`)
      if (!userResponse.ok) {
        throw new Error("User not found")
      }
      const userData = await userResponse.json()
      setUser(userData)
      setCurrentUsername(username)

      // Add to search history
      if ((window as any).__addGitHubSearch) {
        ;(window as any).__addGitHubSearch(username)
      }

      // Fetch repositories
      const reposResponse = await fetch(`/api/github/repos?username=${username}&perPage=20`)
      if (reposResponse.ok) {
        const reposData = await reposResponse.json()
        setRepositories(reposData)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred"
      setError(errorMessage)
      console.error("Fetch error:", err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-primary/10 bg-background/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <div className="p-2.5 rounded-lg bg-primary/10">
              <Github className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Repository Explorer</h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Search GitHub users and explore their repositories
              </p>
            </div>
          </div>
          <SearchBar onSearch={fetchUserData} isLoading={isLoading} />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Error Message */}
        {error && (
          <Alert className="mb-6 border-destructive/20 bg-destructive/5 animate-fade-in-up">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <AlertDescription className="text-destructive">{error}</AlertDescription>
          </Alert>
        )}

        {!user ? (
          // Initial State - Show Recent Searches
          <div className="max-w-2xl mx-auto">
            <RecentSearches
              onSelectUser={(username) => {
                setCurrentUsername(username)
                fetchUserData(username)
              }}
              currentUser={currentUsername}
            />
          </div>
        ) : (
          // Results Layout
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Left Sidebar - User Details and Recent Searches */}
            <div className="lg:col-span-1 space-y-6">
              <UserDetails user={user} />
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                  Other Users
                </h3>
                <RecentSearches
                  onSelectUser={(username) => {
                    setCurrentUsername(username)
                    fetchUserData(username)
                  }}
                  currentUser={currentUsername}
                />
              </div>
            </div>

            {/* Right Content - Repositories */}
            <div className="lg:col-span-2">
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-foreground mb-1">Repositories</h2>
                  <p className="text-muted-foreground text-sm">
                    {repositories.length} {repositories.length === 1 ? "repository" : "repositories"} found
                  </p>
                </div>

                {repositories.length > 0 ? (
                  <RepositoryList repositories={repositories} username={user.login} />
                ) : (
                  <div className="p-8 text-center border border-dashed border-primary/20 rounded-lg bg-primary/2">
                    <p className="text-muted-foreground">No repositories found for this user.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-primary/10 bg-card/50 backdrop-blur-sm mt-12 sm:mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 text-center">
          <p className="text-xs sm:text-sm text-muted-foreground">
            Built with <span className="text-primary font-semibold">Vercel AI SDK</span> and{" "}
            <span className="text-primary font-semibold">OpenAI GPT-4</span> for AI-powered repository summaries
          </p>
        </div>
      </footer>
    </div>
  )
}
