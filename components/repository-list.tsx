"use client"

import { useState } from "react"
import { Star, GitFork, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RepositoryModal } from "./repository-modal"

interface Repository {
  id: number
  name: string
  description: string
  url: string
  html_url: string
  stars: number
  forks: number
  watchers: number
  language: string
  topics: string[]
  stargazers_count: number
  forks_count: number
  watchers_count: number
}

interface RepositoryListProps {
  repositories: Repository[]
  username: string
}

export function RepositoryList({ repositories, username }: RepositoryListProps) {
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null)

  const getLanguageColor = (language: string | null): string => {
    const colors: Record<string, string> = {
      TypeScript: "bg-blue-500",
      JavaScript: "bg-yellow-500",
      Python: "bg-green-600",
      Go: "bg-cyan-500",
      Rust: "bg-orange-600",
      Java: "bg-red-600",
      "C++": "bg-blue-700",
      "C#": "bg-purple-600",
      PHP: "bg-indigo-600",
      Ruby: "bg-red-500",
    }
    return colors[language || ""] || "bg-gray-500"
  }

  return (
    <>
      <div className="space-y-3">
        {repositories.map((repo) => (
          <div
            key={repo.id}
            className="group rounded-lg border border-primary/20 bg-card p-4 hover:bg-primary/5 hover:border-primary/50 transition-all duration-300 animate-fade-in-up"
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div className="flex-1 min-w-0">
                <button
                  onClick={() => setSelectedRepo(repo)}
                  className="flex items-start gap-2 hover:opacity-80 transition-opacity"
                >
                  <h3 className="text-lg font-semibold text-primary hover:underline truncate">{repo.name}</h3>
                </button>

                {repo.description && (
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{repo.description}</p>
                )}

                <div className="flex flex-wrap items-center gap-3 mt-3">
                  {repo.language && (
                    <span className={`text-xs px-2.5 py-1 rounded-full text-white ${getLanguageColor(repo.language)}`}>
                      {repo.language}
                    </span>
                  )}

                  {repo.topics && repo.topics.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {repo.topics.slice(0, 2).map((topic) => (
                        <span
                          key={topic}
                          className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/20"
                        >
                          {topic}
                        </span>
                      ))}
                      {repo.topics.length > 2 && (
                        <span className="text-xs px-2 py-1 text-muted-foreground">+{repo.topics.length - 2}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground flex-shrink-0">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4" />
                  <span>{repo.stargazers_count}</span>
                </div>
                <div className="flex items-center gap-1">
                  <GitFork className="w-4 h-4" />
                  <span>{repo.forks_count}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <Button
                onClick={() => setSelectedRepo(repo)}
                size="sm"
                variant="outline"
                className="text-xs border-primary/30 hover:bg-primary hover:text-primary-foreground"
              >
                View Details
              </Button>
              <a
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs px-3 py-2 rounded-md border border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                <ExternalLink className="w-3 h-3" />
                Open on GitHub
              </a>
            </div>
          </div>
        ))}
      </div>

      {selectedRepo && (
        <RepositoryModal repository={selectedRepo} username={username} onClose={() => setSelectedRepo(null)} />
      )}
    </>
  )
}
