"use client"

import { useState } from "react"
import { Loader2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

interface RepositorySummaryProps {
  repoName: string
  repoDescription?: string
  topics?: string[]
  onSummaryGenerated?: (summary: string) => void
}

export function RepositorySummary({ repoName, repoDescription, topics, onSummaryGenerated }: RepositorySummaryProps) {
  const [summary, setSummary] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>("")

  const generateSummary = async () => {
    setIsLoading(true)
    setError("")
    setSummary("")

    try {
      const response = await fetch("/api/ai/generate-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          repoName,
          repoDescription: repoDescription || "",
          topics: topics || [],
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate summary")
      }

      const data = await response.json()
      setSummary(data.summary || "")
      onSummaryGenerated?.(data.summary)
    } catch (err) {
      setError("Unable to generate summary. Please try again.")
      console.error("Summary generation error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">AI-Generated Summary</h3>
      </div>

      {!summary ? (
        <Button
          onClick={generateSummary}
          disabled={isLoading}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating with AI...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Generate Repository Overview
            </>
          )}
        </Button>
      ) : (
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 animate-fade-in-up">
          <p className="text-foreground leading-relaxed">{summary}</p>
          <Button onClick={() => setSummary("")} variant="outline" size="sm" className="mt-4 text-xs">
            Generate New Summary
          </Button>
        </div>
      )}

      {error && (
        <div className="mt-3 p-3 bg-destructive/10 border border-destructive rounded-lg">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}
    </div>
  )
}
