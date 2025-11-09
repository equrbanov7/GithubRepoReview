"use client"

import { useState } from "react"
import { X, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

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

interface RepositoryModalProps {
  repository: Repository
  username: string
  onClose: () => void
}

export function RepositoryModal({ repository, username, onClose }: RepositoryModalProps) {
  const [summary, setSummary] = useState<string>("")
  const [isLoadingSummary, setIsLoadingSummary] = useState(false)
  const [summaryError, setSummaryError] = useState(false)

  const handleGenerateSummary = async () => {
    setSummaryError(false)
    setIsLoadingSummary(true)
    try {
      const response = await fetch("/api/ai/generate-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          repoName: repository.name,
          repoDescription: repository.description,
          topics: repository.topics,
        }),
      })

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`)
      }

      const data = await response.json()
      if (data.summary) {
        setSummary(data.summary)
      } else {
        setSummaryError(true)
      }
    } catch (error) {
      console.error("Error generating summary:", error)
      setSummaryError(true)
    } finally {
      setIsLoadingSummary(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in-up">
      <div className="bg-card rounded-lg shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-primary/20 p-4 sm:p-6 flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground break-words">{repository.name}</h2>
            <p className="text-sm text-muted-foreground mt-1">
              by <span className="text-primary font-semibold">{username}</span>
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-primary/10 rounded-lg transition-colors flex-shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-6">
          {/* Description */}
          {repository.description && (
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Description</h3>
              <p className="text-foreground mt-2">{repository.description}</p>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
              <p className="text-xs text-muted-foreground font-semibold">Stars</p>
              <p className="text-2xl font-bold text-primary mt-1">{repository.stargazers_count}</p>
            </div>
            <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
              <p className="text-xs text-muted-foreground font-semibold">Forks</p>
              <p className="text-2xl font-bold text-primary mt-1">{repository.forks_count}</p>
            </div>
            {repository.language && (
              <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
                <p className="text-xs text-muted-foreground font-semibold">Language</p>
                <p className="text-lg font-bold text-primary mt-1 truncate">{repository.language}</p>
              </div>
            )}
          </div>

          {/* Topics */}
          {repository.topics && repository.topics.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Topics</h3>
              <div className="flex flex-wrap gap-2 mt-3">
                {repository.topics.map((topic) => (
                  <span
                    key={topic}
                    className="px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-sm hover:bg-primary/20 transition-colors"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="border-t border-primary/10 pt-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">AI Summary</h3>
              {!summary && !summaryError && (
                <Button
                  onClick={handleGenerateSummary}
                  disabled={isLoadingSummary}
                  size="sm"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {isLoadingSummary ? (
                    <>
                      <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Generate Summary"
                  )}
                </Button>
              )}
            </div>

            {summary && (
              <div className="bg-primary/5 rounded-lg p-4 border border-primary/20 animate-fade-in-up">
                <p className="text-foreground text-sm leading-relaxed">{summary}</p>
              </div>
            )}

            {summaryError && (
              <div className="bg-destructive/5 rounded-lg p-4 border border-destructive/20 flex items-start gap-3 animate-fade-in-up">
                <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-destructive">Unable to generate summary</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Please check your OpenAI API configuration or try again later.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* GitHub Link */}
          <a
            href={repository.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-full px-4 py-3 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-semibold transition-all duration-300"
          >
            View on GitHub →
          </a>
        </div>
      </div>
    </div>
  )
}
