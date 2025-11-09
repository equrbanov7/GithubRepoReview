"use client"

import { useState } from "react"
import { Loader2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

interface UserSummaryProps {
  user: {
    login: string
    name?: string | null
    bio?: string | null
    location?: string | null
    followers: number
    following: number
    public_repos: number
  }
}

export function UserSummary({ user }: UserSummaryProps) {
  const [summary, setSummary] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>("")

  const generateSummary = async () => {
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/ai/generate-user-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: user.login,
          name: user.name ?? "",
          bio: user.bio ?? "",
          location: user.location ?? "",
          followers: user.followers,
          following: user.following,
          publicRepos: user.public_repos,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate summary")
      }

      const data = await response.json()
      if (!data.summary) {
        throw new Error("Missing summary in response")
      }

      setSummary(data.summary)
    } catch (err) {
      console.error("User summary generation error:", err)
      setError("Unable to generate user summary. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="border border-primary/20 rounded-lg p-4 bg-primary/5 animate-fade-in-up">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-primary" />
        <h4 className="text-sm font-semibold text-foreground uppercase tracking-wide">AI User Insight</h4>
      </div>

      {!summary && !error && (
        <Button
          onClick={generateSummary}
          disabled={isLoading}
          size="sm"
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-3 h-3 mr-2 animate-spin" />
              Generating insight...
            </>
          ) : (
            <>
              <Sparkles className="w-3 h-3 mr-2" />
              Generate AI summary
            </>
          )}
        </Button>
      )}

      {summary && (
        <div className="space-y-3">
          <p className="text-sm text-foreground leading-relaxed">{summary}</p>
          <Button onClick={() => setSummary("")} size="sm" variant="outline" className="text-xs">
            Generate again
          </Button>
        </div>
      )}

      {error && (
        <div className="mt-3 space-y-2">
          <p className="text-sm text-destructive">{error}</p>
          <Button
            onClick={generateSummary}
            disabled={isLoading}
            size="sm"
            variant="outline"
            className="text-xs"
          >
            Try again
          </Button>
        </div>
      )}
    </div>
  )
}
